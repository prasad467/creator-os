"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setStatus("success");
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setStatus("error");
      }
    };

    checkUser();
  }, [router]);

  const content = {
    loading: {
      icon: <Loader2 className="w-14 h-14 animate-spin text-zinc-400" />,
      title: "Verifying your email...",
      description: "Please wait while we confirm your account.",
    },
    success: {
      icon: <CheckCircle2 className="w-14 h-14 text-green-500" />,
      title: "Email verified successfully",
      description: "Redirecting you to login...",
    },
    error: {
      icon: <XCircle className="w-14 h-14 text-red-500" />,
      title: "Invalid or expired link",
      description: "Please request a new verification email.",
    },
  }[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-black text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-10 text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-6"
        >
          {content.icon}
        </motion.div>

        <h1 className="text-xl font-semibold mb-2">{content.title}</h1>
        <p className="text-zinc-400 text-sm">{content.description}</p>

        {status === "error" && (
          <button
            onClick={() => router.push("/signup")}
            className="mt-6 w-full bg-white text-black font-medium py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Back to Signup
          </button>
        )}
      </motion.div>
    </div>
  );
}