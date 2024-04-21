import { Chat } from './Components/Chat';

export default function Home() {
  const qa = {
    'what is your name': 'I am your bot',
    'how are you': 'I am fine',
  };

  return (
    <main className="flex h-full w-full flex-col items-center justify-between bg-gradient-to-r from-slate-900 to-slate-700">
      <Chat qa={qa} />
    </main>
  );
}
