"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("YouTube");
  const [keywords, setKeywords] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setShowAnalyzer(true);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {!showAnalyzer ? (
        // Hero Section
        <section className="h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-2xl text-center space-y-8">
            <div>
                <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                Find Content Gaps
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-purple-500">
                  {" "}instantly
                </span>
              </h1>
              <p className="text-xl text-zinc-400 mb-8">
                Analyze your niche and discover untapped content opportunities across platforms. Powered by AI.
              </p>
            </div>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-zinc-100 transition-colors duration-300 text-lg"
            >
              Get Started →
            </button>
          </div>
        </section>
      ) : (
        // Analyzer Section
        <section className="min-h-screen bg-linear-to-b from-black via-zinc-950 to-black px-6 py-20 flex items-center">
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-3">Analyzer</h2>
              <p className="text-zinc-400">Enter your details to discover content gaps</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Form Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Your Niche
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fitness, AI Tools, Gaming"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 transition-all cursor-pointer"
                  >
                    <option>YouTube</option>
                    <option>Instagram</option>
                    <option>TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Keywords (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. trending, how-to, tips"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 transition-all"
                  />
                </div>

                <button
                 onClick={async () => {
  if (!niche.trim()) return;

  setLoading(true);
  setResult(null);

  try {
    const res = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ niche, platform, keywords }),
});

const data = await res.json();
setResult(data.result);
  } catch (error) {
  console.error("Error fetching AI result:", error);
  setResult("Something went wrong.");
}

  setLoading(false);
}}
                  disabled={!niche.trim()}
                  className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                  Analyze
                </button>
              </div>

              {/* Result Preview Section */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-96 overflow-y-auto relative">
{loading ? (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    className="bg-linear-to-br from-purple-900 via-black to-purple-800 border border-purple-700 rounded-2xl p-8 flex flex-col items-center justify-center h-96 relative overflow-hidden"
  >
    {/* Pulsating AI Text */}
    <motion.p
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      className="text-white text-lg font-bold text-center"
    >
      Analyzing your niche... AI magic in progress ✨
    </motion.p>

    {/* Bouncing dots */}
    <div className="flex mt-6 space-x-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -15, 0], scale: [1, 1.3, 1] }}
          transition={{
            repeat: Infinity,
            delay: i * 0.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="w-4 h-4 bg-pink-500 rounded-full shadow-lg"
        />
      ))}
    </div>

    {/* Animated rotating neon border */}
    <motion.div
      className="absolute inset-0 rounded-2xl border-4 border-transparent border-t-pink-500 border-b-purple-500 pointer-events-none"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
    />
  </motion.div>
) : (
  /* Your result box */
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 whitespace-pre-wrap min-h-96"
  >
    {result}
  </motion.div>
)}
  {result && (
    <>
      <pre className="whitespace-pre-wrap font-mono text-zinc-200">{result}</pre>
      <button
        onClick={() => navigator.clipboard.writeText(result)}
        className="absolute top-4 right-4 bg-zinc-700 hover:bg-zinc-600 text-sm px-3 py-1 rounded-md transition"
      >
        Copy
      </button>
    </>
  )}
</div>
            </div>

            <button
              onClick={() => {
                setShowAnalyzer(false);
                setResult(null);
                setNiche("");
                setKeywords("");
              }}
              className="mt-12 mx-auto block text-zinc-400 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </section>
      )}
    </main>
  );
}