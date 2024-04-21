'use client';
import Image from 'next/image';
import characterOne from '../../public/images/characters/Character1.png';
import characterTwo from '../../public/images/characters/Character2.png';
import { useEffect, useRef, useState } from 'react';
import { MdKeyboardVoice } from 'react-icons/md';

export const Chat = ({ qa }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showLoadingBubble, setShowLoadingBubble] = useState(false);
  const talkBack = window.speechSynthesis;
  const voiceRecognitionRef = useRef(null);

  // const SpeechRecognition =
  //   window.SpeechRecognition || window.webkitSpeechRecognition;

  const initializeSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error(
        'This Browser does not support Speech Recoginition. Try some other browser.'
      );
      return;
    }
    const voiceRecognition = new SpeechRecognition();
    voiceRecognition.continous = true;
    voiceRecognition.language = 'en-US';
    voiceRecognition.onstart = () => {
      console.log('Voice Recognition Started');
      setShowLoadingBubble(true);
    };

    voiceRecognition.onerror = (e) => {
      if (e.error === 'aborted') {
        console.log('Voice Recognition Aborted');
      } else {
        console.error('Voice Recognition Error:', e.error);
      }
    };
    voiceRecognition.onend = () => {
      console.log('Voice Recognition Ended');
      setIsListening(false);
      setShowLoadingBubble(false);
    };
    voiceRecognition.onresult = handleChat;
    voiceRecognitionRef.current = voiceRecognition;
  };

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      if (voiceRecognitionRef.current) {
        voiceRecognitionRef.current.stop();
      }
    };
  }, []);

  const handleChat = (e) => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        const question = e.results[i][0].transcript.trim().toLowerCase();
        const answer = qa[question];
        setTranscript(question);
        console.log(question, 'QUESTION');
        console.log(transcript, 'Transcipt');
        if (answer) {
          setAnswer(answer);
          speak(answer);
          console.log(answer, 'ANSWER');
        } else {
          setAnswer(
            'Try Again. Make you sound loud and environment is noise free'
          );
          speak('Voice is not audible or recognized');
        }
        setShowLoadingBubble(false);
      }
    }
  };

  const speak = (text) => {
    if (talkBack.speaking) {
      console.error('speechSynthesis.speaking');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    talkBack.speak(utterance);
  };

  const toggleListen = () => {
    if (isListening) {
      voiceRecognitionRef.current.stop();
      setIsListening(false);
      setShowLoadingBubble(false);
    } else {
      voiceRecognitionRef.current.start();
      setIsListening(true);
      setShowLoadingBubble(true);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-8">
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-white font-sans font-bold text-5xl">
          Voice Chat Buddy
        </h1>
        <button onClick={toggleListen}>
          <MdKeyboardVoice className="text-7xl text-white  bg-green-400 rounded-full p-3" />
        </button>
      </div>
      <div className="flex">
        <div>
          <div className="text-3xl text-white">Question:</div>
          <Image
            src={characterOne.src}
            width={characterOne.width}
            height={characterOne.height}
            alt="charcater 1"
          />
        </div>
        <div>
          <div className="text-3xl text-white">Answer:</div>
          <Image
            src={characterTwo.src}
            width={characterTwo.width}
            height={characterTwo.height}
            alt="charcater 2"
          />
        </div>
      </div>
    </div>
  );
};
