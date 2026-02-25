"use client";

import { useState } from "react";

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
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ niche, platform, keywords }),
    });

    const data = await res.json();
    setResult(data.result);
  } catch (error) {
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
              <div>
                {loading ? (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex items-center justify-center h-96">
                    <p className="text-zinc-400">Analyzing with AI...</p>
                  </div>
                ) : result ? (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 whitespace-pre-wrap">
                    {result}
                  </div>
                ) : (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex items-center justify-center h-96">
                    <p className="text-zinc-500">
                      Enter your niche details and click Analyze to see AI insights
                    </p>
                  </div>
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