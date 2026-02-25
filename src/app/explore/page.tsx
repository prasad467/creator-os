"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Sparkles, Rocket, BarChart3, Brain } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type Tool = {
  id: string
  title: string
  description: string
  category: "ai" | "analytics"
  icon: React.ComponentType<{ size?: number }>
  badge: string | null
}

const tools: Tool[] = [
  {
    id: "ai-gap-analyzer",
    title: "AI Gap Analyzer",
    description:
      "Instantly scan your niche and uncover high-growth content gaps powered by AI.",
    category: "ai",
    icon: Brain,
    badge: "Featured",
  },
  {
    id: "content-gap-analyzer",
    title: "Content Gap Analyzer",
    description:
      "Analyze your niche and discover untapped content opportunities across platforms.",
    category: "analytics",
    icon: BarChart3,
    badge: "Popular",
  },
  {
    id: "hook-writer",
    title: "Hook Writer",
    description:
      "Generate viral first 3 seconds that stop the scroll instantly.",
    category: "ai",
    icon: Sparkles,
    badge: null,
  },
  {
    id: "viral-breakdown",
    title: "Viral Breakdown",
    description:
      "Reverse engineer viral content and replicate success patterns.",
    category: "analytics",
    icon: Rocket,
    badge: "Pro",
  },
]

export default function ExplorePage() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "ai" | "analytics">("all")
  const [activeTool, setActiveTool] = useState<Tool | null>(null)

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch = tool.title
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesFilter =
        filter === "all" || tool.category === filter

      return matchesSearch && matchesFilter
    })
  }, [search, filter])

  const handleToolClick = (tool: Tool) => {
    // 🔥 ONLY LOGIC CHANGE HERE
    if (tool.id === "ai-gap-analyzer") {
      router.push("/analyzer")
    } else {
      setActiveTool(tool)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white pt-24 pb-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-4">
            Explore{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Creator Tools
            </span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            AI-powered tools built to scale creators from 0 to 1M followers.
          </p>
        </motion.div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
            <Input
              placeholder="Search tools..."
              className="pl-10 bg-zinc-800/60 border-zinc-700 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-3 bg-zinc-900/60 backdrop-blur-md p-2 rounded-full border border-zinc-800">
            {["all", "ai", "analytics"].map((type) => {
              const isActive = filter === type

              return (
                <button
                  key={type}
                  onClick={() =>
                    setFilter(type as "all" | "ai" | "analytics")
                  }
                  className={`
                    px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300
                    ${isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"}
                  `}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tools Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredTools.map((tool) => {
              const Icon = tool.icon

              return (
                <motion.div
                  key={tool.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    onClick={() => handleToolClick(tool)}
                    className="cursor-pointer bg-zinc-700/60 backdrop-blur border border-zinc-700 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10 rounded-2xl"
                  >
                    <CardContent className="p-6">

                      {tool.badge && (
                        <Badge className="mb-4 bg-blue-600 text-white border-none">
                          {tool.badge}
                        </Badge>
                      )}

                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                        <Icon size={28} />
                      </div>

                      <h3 className="text-xl font-semibold text-zinc-50 mb-2">
                        {tool.title}
                      </h3>

                      <p className="text-sm text-zinc-400">
                        {tool.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {activeTool && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTool(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              > <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-6" />

               <h2 className="text-2xl font-bold mb-2">
  {activeTool.title}
</h2>

<div className="mb-6">
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium mb-4">
    🚧 In Development
  </div>

  <p className="text-zinc-400 text-sm leading-relaxed">
    This tool is currently under active development.
    We're engineering advanced AI systems to ensure it delivers
    real competitive advantage — not just generic outputs.
  </p>
</div>

<div className="space-y-3 mb-6">
  <div className="flex items-center gap-3 text-sm text-zinc-400">
    <div className="w-2 h-2 bg-blue-500 rounded-full" />
    Advanced AI optimization engine
  </div>
  <div className="flex items-center gap-3 text-sm text-zinc-400">
    <div className="w-2 h-2 bg-purple-500 rounded-full" />
    Creator growth analytics integration
  </div>
  <div className="flex items-center gap-3 text-sm text-zinc-400">
    <div className="w-2 h-2 bg-green-500 rounded-full" />
    High-performance output framework
  </div>
</div>

<Button
  disabled
  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed"
>
  Coming Soon
</Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  )
}