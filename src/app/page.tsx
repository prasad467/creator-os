export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <h1 className="text-5xl font-bold mb-6">
        CreatorOS 🚀
      </h1>

      <p className="text-lg text-gray-400 mb-8 text-center max-w-xl">
        AI Growth Operating System for Indian Micro Creators.
        Generate viral ideas, powerful scripts, and growth insights in seconds.
      </p>

      <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
        Get Started
      </button>
    </main>
  );
}