"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const accessToken = params.get("access_token");
  const email = params.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error">(!accessToken ? "error" : "loading");
  const [message, setMessage] = useState(!accessToken ? "Invalid verification link." : "");

  useEffect(() => {
    if (!accessToken || !email) {
      return;
    }

    const verify = async () => {
      const { error } = await supabase.auth.verifyOtp({ token: accessToken, email: email, type: "signup" });

      if (error) {
        setStatus("error");
        setMessage("Verification failed: " + error.message);
      } else {
        setStatus("success");
        setMessage("Your email has been successfully verified!");
      }
    };

    verify();
  }, [accessToken]);

  const renderIcon = () => {
    if (status === "success") return <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />;
    if (status === "error") return <XCircle className="w-16 h-16 text-red-500 mx-auto" />;
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-zinc-900 p-8 rounded-xl max-w-md text-center space-y-4 shadow-lg"
      >
        {status === "loading" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400"
          >
            Verifying your email...
          </motion.p>
        )}

        {status !== "loading" && (
          <>
            {renderIcon()}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-lg font-semibold ${
                status === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </motion.p>
          </>
        )}
      </motion.div>
    </div>
  );
}