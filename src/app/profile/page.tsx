"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain } from "lucide-react"

type Platform = "YouTube" | "Instagram" | "TikTok"

type AnalyzeResponse = {
  result?: string
  error?: string
}

export default function AnalyzerPage() {
  const [niche, setNiche] = useState<string>("")
  const [platform, setPlatform] = useState<Platform>("YouTube")
  const [keywords, setKeywords] = useState<string>("")

  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [loadingStep, setLoadingStep] = useState<number>(0)

  const loadingMessages: string[] = [
    "Scanning niche landscape...",
    "Analyzing competitor saturation...",
    "Detecting content gaps...",
    "Building strategic insights...",
  ]

  const handleAnalyze = useCallback(async () => {
    if (!niche.trim() || loading) return

    setLoading(true)
    setResult(null)
    setError(null)
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
        body: JSON.stringify({
          niche: niche.trim(),
          platform,
          keywords: keywords.trim(),
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to analyze niche.")
      }

      const data: AnalyzeResponse = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data.result ?? "No insights generated.")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Unexpected error occurred.")
      }
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }, [niche, platform, keywords, loading])

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
            {platform} Mode
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="flex-1 p-8 grid lg:grid-cols-2 gap-10">

          {/* INPUT PANEL */}
          <div className="space-y-6">
            <InputField
              label="NICHE"
              value={niche}
              onChange={setNiche}
              placeholder="e.g. AI Tools for Entrepreneurs"
            />

            <div>
              <label className="text-xs text-zinc-400">PLATFORM</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="mt-2 w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:border-purple-500 outline-none"
              >
                <option value="YouTube">YouTube</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
              </select>
            </div>

            <InputField
              label="KEYWORDS (Optional)"
              value={keywords}
              onChange={setKeywords}
              placeholder="automation, productivity, SaaS"
            />

            <button
              onClick={handleAnalyze}
              disabled={!niche.trim() || loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:opacity-90 disabled:opacity-40 transition"
            >
              {loading ? "Analyzing..." : "Run Analysis"}
            </button>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* OUTPUT PANEL */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 overflow-y-auto relative">

            <AnimatePresence mode="wait">

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-full text-zinc-400 text-sm"
                >
                  {loadingMessages[loadingStep]}
                </motion.div>
              )}

              {!loading && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
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

type InputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}

function InputField({ label, value, onChange, placeholder }: InputProps) {
  return (
    <div>
      <label className="text-xs text-zinc-400">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:border-purple-500 outline-none"
      />
    </div>
  )
}