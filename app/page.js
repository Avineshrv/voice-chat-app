import { Chat } from './Components/Chat';

export default function Home() {
  const qa = {
    'what is your name': 'I am your Friend',
    'how are you': 'I am fine',
    'what can you do':
      'I can help you with information, advice, and a bit of entertainment.',
    'what time is it': 'Let me check the current time for you.',
    'tell me a joke':
      "Why don't scientists trust atoms? Because they make up everything!",
    'what’s the weather like':
      'I can check the weather for your location or anywhere you like.',
    'set a timer for 3 minutes': 'Starting a timer for 3 minutes now.',
    'remind me to call Mom at 7 PM':
      "I'll remind you to call Mom at 7 PM today.",
    'how do I make a cake':
      'I can guide you through the steps to bake a delicious cake.',
    'what’s the news today':
      'I’ll find the latest news for you. Just a moment.',
  };

  return (
    <main className="flex h-full w-full flex-col items-center justify-between bg-gradient-to-r from-slate-900 to-slate-700">
      <Chat qa={qa} />
    </main>
  );
}
