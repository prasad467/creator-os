"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const accessToken = params.get("access_token");
  const email = params.get("email");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    !accessToken || !email ? "error" : "loading"
  );
  const [message, setMessage] = useState(
    !accessToken || !email ? "Invalid verification link." : "Verifying your email..."
  );

  useEffect(() => {
    if (!accessToken || !email) return;

    const verifyEmail = async () => {
      try {
        const { error } = await supabase.auth.verifyOtp({
          token: accessToken,
          email: email,
          type: "signup",
        });

        if (error) {
          setStatus("error");
          setMessage("Verification failed: " + error.message);
        } else {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [accessToken, email]);

  const renderIcon = () => {
    if (status === "loading") return null;

    const iconProps = { className: "w-20 h-20 mx-auto" };

    return (
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {status === "success" ? (
          <CheckCircle {...iconProps} className="text-green-500" />
        ) : (
          <XCircle {...iconProps} className="text-red-500" />
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-zinc-900 p-8 rounded-2xl max-w-md text-center space-y-6 shadow-2xl"
      >
        {renderIcon()}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-lg font-semibold ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </motion.p>

        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <p className="text-zinc-400">Verifying your email...</p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/login")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Go to Login
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}