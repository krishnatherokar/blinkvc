import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 pb-30">
      <h1 className="mb-6 text-4xl font-bold text-blue-600">BlinkVC</h1>
      <Link href="/random">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Start Video Call
        </button>
      </Link>
    </main>
  );
}
