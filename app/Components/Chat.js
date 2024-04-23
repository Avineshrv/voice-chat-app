/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import Image from 'next/image';
import characterOne from '../../public/images/characters/Character1.png';
import characterTwo from '../../public/images/characters/Character2.png';
import { useEffect, useRef, useState, useCallback } from 'react';
import { MdKeyboardVoice } from 'react-icons/md';

export const Chat = ({ qa }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showLoadingBubble, setShowLoadingBubble] = useState(false);
  const talkBack = typeof window !== 'undefined' && window.speechSynthesis;
  const voiceRecognitionRef = useRef(null);

  const initializeSpeechRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error(
        'This Browser does not support Speech Recognition. Try some other browser.'
      );
      return;
    }
    const voiceRecognition = new SpeechRecognition();
    // voiceRecognition.continuous = true;
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
  }, []);

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      if (voiceRecognitionRef.current && isListening) {
        voiceRecognitionRef.current.stop();
      }
    };
  }, [initializeSpeechRecognition, isListening]);

  const handleChat = (e) => {
    const results = e.results;
    const latestResult = results[results.length - 1];
    if (latestResult.isFinal) {
      const question = latestResult[0].transcript.trim().toLowerCase();
      const answer = qa[question];

      setTranscript(question);
      console.log(question, 'QUESTION');
      console.log(transcript, 'Transcript');

      if (answer) {
        setAnswer(answer);
        speak(answer);
        console.log(answer, 'ANSWER');
      } else {
        setAnswer(
          'Try Again. Make sure your voice is loud and the environment is noise-free'
        );
        speak('Voice is not audible or recognized');
      }
      setShowLoadingBubble(false);
      if (isListening) {
        voiceRecognitionRef.current.start();
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
    if (!isListening) {
      voiceRecognitionRef.current.start();
      setIsListening(true);
      setShowLoadingBubble(true);
      setTranscript('');
      setAnswer('');
    } else {
      voiceRecognitionRef.current.stop();
      setIsListening(false);
      setShowLoadingBubble(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-8">
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-white font-sans font-bold text-xl md:text-5xl">
          Voice Chat Buddy
        </h1>
        <button onClick={toggleListen}>
          <MdKeyboardVoice
            className={`text-5xl md:text-7xl text-white ${
              isListening ? ' bg-green-400' : 'bg-red-600'
            } rounded-full p-3`}
          />
        </button>
      </div>
      <div className="flex w-full justify-center items-center">
        <div className="relative">
          <Image
            className="w-1/2 md:w-full mx-auto"
            src={characterOne.src}
            width={characterOne.width}
            height={characterOne.height}
            alt="charcater 1"
          />
          <div className="md:absolute top-0 right-[100%] flex w-full">
            <div className="bubble grow right">{transcript}</div>
          </div>
        </div>
        <div className="relative">
          <Image
            className="w-1/2 md:w-full mx-auto"
            src={characterTwo.src}
            width={characterTwo.width}
            height={characterTwo.height}
            alt="charcater 2"
          />

          <div className="md:absolute top-0 left-[100%] flex w-full">
            <div className="bubble grow left">{answer}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
