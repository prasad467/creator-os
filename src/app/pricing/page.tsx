"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [users, setUsers] = useState(2148);

  // Fake increasing counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prev) => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const plans = [
    {
      name: "Starter",
      monthly: 0,
      annual: 0,
      features: [
        "5 AI analyses per month",
        "Basic niche insights",
        "Limited growth projection",
      ],
      highlight: false,
    },
    {
      name: "Growth",
      monthly: 199,
      annual: 1700,
      features: [
        "50 AI analyses",
        "Advanced viral breakdown",
        "Growth engine insights",
        "Faster AI responses",
        "Priority feature access",
      ],
      highlight: true,
    },
    {
      name: "Scale",
      monthly: 499,
      annual: 4999,
      features: [
        "Unlimited AI analyses",
        "Full intelligence suite",
        "Deep viral pattern analysis",
        "Advanced forecasting",
        "Future premium tools included",
      ],
      highlight: false,
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black via-zinc-950 to-black text-white">

      {/* Discount Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-6"
      >
        <div className="inline-block bg-purple-600/20 border border-purple-500 px-6 py-2 rounded-full text-sm animate-pulse">
          🔥 Limited Time: Save 30% on Annual Plans
        </div>
      </motion.div>

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          Scale Smarter, Not Harder
        </h2>
        <p className="text-zinc-400">
          {users.toLocaleString()} creators upgraded this month
        </p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-full p-1 flex">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2 rounded-full transition ${
              !isAnnual ? "bg-purple-600" : "text-zinc-400"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-full transition ${
              isAnnual ? "bg-purple-600" : "text-zinc-400"
            }`}
          >
            Annual
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -10 }}
            className={`rounded-2xl p-8 border ${
              plan.highlight
                ? "border-purple-500 bg-gradient-to-b from-purple-600/20 to-purple-900/10 scale-105"
                : "border-zinc-800 bg-zinc-900"
            }`}
          >
            {plan.highlight && (
              <div className="mb-4 text-xs bg-purple-600 inline-block px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}

            <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>

            <AnimatePresence mode="wait">
              <motion.div
                key={isAnnual ? "annual" : "monthly"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <p className="text-4xl font-bold">
                  ₹
                  {isAnnual ? plan.annual : plan.monthly}
                </p>
                <p className="text-zinc-400 text-sm">
                  {isAnnual ? "Per year" : "Per month"}
                </p>
              </motion.div>
            </AnimatePresence>

            <ul className="space-y-3 text-sm text-zinc-300 mb-8">
              {plan.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-xl transition font-semibold ${
                plan.highlight
                  ? "bg-purple-600 hover:bg-purple-500"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              {plan.monthly === 0 ? "Start Free" : "Upgrade Now"}
            </button>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs text-zinc-500 mt-12">
        Pricing is subject to change as new features are added.
      </p>
    </section>
  );
}