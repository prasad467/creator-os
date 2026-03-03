"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    website: "", // honeypot
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch {
      setStatus("error");
    }

    setLoading(false);
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-10"
      >
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-zinc-400 mb-8">
          Have questions, feedback, or partnership ideas? Let’s talk.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Honeypot */}
          <input
            type="text"
            value={form.website}
            onChange={(e) =>
              setForm({ ...form, website: e.target.value })
            }
            className="hidden"
          />

          <InputField
            label="Your Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <InputField
            label="Email Address"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <div>
            <label className="text-sm text-zinc-400">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <AnimatePresence>
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 mt-6"
            >
              Message sent successfully 🚀
            </motion.p>
          )}

          {status === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 mt-6"
            >
              Something went wrong. Try again.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-zinc-400">{label}</label>
      <input
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition"
      />
    </div>
  );
}