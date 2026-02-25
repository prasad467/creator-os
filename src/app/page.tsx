"use client"

import { motion } from "framer-motion"
import { Sparkles, Zap, BarChart3, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen flex items-center justify-center px-6"
      >
        {/* Background Glow */}
        <div className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-3xl rounded-full -z-10" />

        <div className="text-center max-w-3xl space-y-8">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-7xl font-bold leading-tight"
          >
            Discover Hidden{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Content Opportunities
            </span>
          </motion.h1>

          <p className="text-xl text-zinc-400">
            AI-powered niche analysis for serious creators building real audience empires.
          </p>

          <button
            onClick={() => router.push("/analyzer")}
            className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
          >
            Start Analyzing →
          </button>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-sm text-zinc-400">
            <div className="flex flex-col items-center">
              <Sparkles size={28} />
              AI Insights
            </div>
            <div className="flex flex-col items-center">
              <BarChart3 size={28} />
              Data Driven
            </div>
            <div className="flex flex-col items-center">
              <Zap size={28} />
              Fast Results
            </div>
            <div className="flex flex-col items-center">
              <Rocket size={28} />
              Growth Focused
            </div>
          </div>
        </div>
      </motion.section>

    </main>
  )
}