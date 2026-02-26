"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, BarChart3, Brain, Rocket } from "lucide-react"

export default function AnalyzerPage() {
  const [niche, setNiche] = useState("")
  const [platform, setPlatform] = useState("YouTube")
  const [keywords, setKeywords] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)

  const loadingMessages = [
    "Scanning niche landscape...",
    "Analyzing competitor saturation...",
    "Detecting content gaps...",
    "Building strategic insights...",
  ]

  const handleAnalyze = async () => {
    if (!niche.trim() || loading) return

    setLoading(true)
    setResult(null)
    setLoadingStep(0)

    const interval = setInterval(() => {
      setLoadingStep((prev) =>
        prev < loadingMessages.length - 1 ? prev + 1 : prev
      )
    }, 1500)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform, keywords }),
      })

      const data = await res.json()
      clearInterval(interval)
      setResult(data.result)
    } catch {
      clearInterval(interval)
      setResult("Something went wrong.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-6 hidden md:flex flex-col">
        <h1 className="text-xl font-bold mb-10">CreatorOS</h1>

        <nav className="space-y-4 text-sm">
          <div className="flex items-center gap-3 text-purple-400">
            <Brain size={18} />
            AI Analyzer
          </div>

           {/* { <div className="flex items-center gap-3 text-zinc-500">
            <Sparkles size={18} />
            Hook Writer
          </div>

          <div className="flex items-center gap-3 text-zinc-500">
            <BarChart3 size={18} />
            Viral Breakdown
          </div>

          <div className="flex items-center gap-3 text-zinc-500">
            <Rocket size={18} />
            Growth Engine
          </div>}  */}
        </nav> 

        <div className="mt-auto text-xs text-zinc-600">
          Free Plan • 3/10 analyses left
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-8">
          <h2 className="font-semibold text-lg">
            AI Content Gap Analyzer
          </h2>

          <div className="text-xs bg-zinc-800 px-3 py-1 rounded-full text-zinc-400">
            YouTube Mode
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="flex-1 p-8 grid lg:grid-cols-2 gap-10">

          {/* LEFT PANEL - INPUT */}
          <div className="space-y-6">
            <div>
              <label className="text-xs text-zinc-400">
                NICHE
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. AI Tools for Entrepreneurs"
                className="mt-2 w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400">
                PLATFORM
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="mt-2 w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:border-purple-500 outline-none"
              >
                <option>YouTube</option>
                <option>Instagram</option>
                <option>TikTok</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400">
                KEYWORDS (Optional)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="automation, productivity, SaaS"
                className="mt-2 w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:border-purple-500 outline-none"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!niche.trim() || loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:opacity-90 disabled:opacity-40 transition"
            >
              {loading ? "Analyzing..." : "Run Analysis"}
            </button>
          </div>

          {/* RIGHT PANEL - OUTPUT */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 overflow-y-auto relative">

  <AnimatePresence mode="wait">

    {/* LOADING STATE */}
    {loading && (
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full space-y-10"
      >

        {/* Ambient Glow Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* AI Core Orb */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="relative w-24 h-24"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-60" />
          <div className="absolute inset-2 bg-black rounded-full border border-zinc-800" />
        </motion.div>

        {/* Animated Loading Text */}
        <motion.div
          key={loadingStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2"
        >
          <p className="text-sm text-zinc-400 tracking-wide">
            {loadingMessages[loadingStep]}
          </p>

          <div className="flex justify-center gap-1 mt-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150" />
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300" />
          </div>
        </motion.div>

        {/* Shimmer Skeleton */}
        <div className="w-full max-w-md space-y-3 mt-8">
          <div className="h-4 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 bg-zinc-800 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-zinc-800 rounded w-4/6 animate-pulse" />
        </div>

      </motion.div>
    )}

    {/* RESULT STATE */}
    {!loading && result && (
      <motion.div
        key="result"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-4"
      >
        <pre className="whitespace-pre-wrap text-zinc-200 leading-relaxed text-sm">
          {result}
        </pre>

        <button
          onClick={() => navigator.clipboard.writeText(result)}
          className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-md transition"
        >
          Copy Report
        </button>
      </motion.div>
    )}

    {/* EMPTY STATE */}
    {!loading && !result && (
      <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-zinc-600 text-center mt-20 text-sm"
      >
        Your strategic AI report will appear here.
      </motion.div>
    )}

  </AnimatePresence>
</div>

        </div>
      </div>
    </div>
  )
}