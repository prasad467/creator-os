"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailClient() {
  const params = useSearchParams();
  const router = useRouter();

  const accessToken = params.get("access_token");
  const email = params.get("email");
  const errorCode = params.get("error_code"); // Supabase may send this for expired links

  const [status, setStatus] = useState<"loading" | "success" | "error">(() => {
    if (!accessToken || !email) return "error";
    if (errorCode === "otp_expired") return "error";
    return "loading";
  });
  const [message, setMessage] = useState(() => {
    if (!accessToken || !email) return "Invalid verification link.";
    if (errorCode === "otp_expired")
      return "This verification link has expired. Request a new one.";
    return "Verifying your email...";
  });

  useEffect(() => {
    if (!accessToken || !email || errorCode === "otp_expired") return;

    const verifyEmail = async () => {
      try {
        const { error } = await supabase.auth.verifyOtp({
          token: accessToken,
          email,
          type: "signup",
        });

        if (error) {
          setStatus("error");
          setMessage("Verification failed: " + error.message);
        } else {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [accessToken, email, errorCode]);

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

  const resendVerification = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resend({ email, type: "signup" });
    if (!error) alert("Verification email resent!");
    else alert("Failed to resend: " + error.message);
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

        {/* Show resend button if link expired */}
        {errorCode === "otp_expired" && email && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resendVerification}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Resend Verification Email
          </motion.button>
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