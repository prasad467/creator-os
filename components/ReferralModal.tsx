"use client";

import { useEffect, useState } from "react";
import { ensureReferralCode } from "../src/lib/referral";
import { supabase } from "../src/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Link as LinkIcon, Copy, Check } from "lucide-react";

interface ReferralModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ReferralModal({
  open,
  onClose,
}: ReferralModalProps) {
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const generateLink = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const code = await ensureReferralCode(user.id);
        const url = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${code}`;
        setReferralLink(url);
      } catch (error) {
        console.error("Error generating referral link:", error);
      }

      setLoading(false);
    };

    generateLink();
  }, [open]);

  const handleCopy = async () => {
    if (!referralLink) return;

    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-2xl bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

              <div className="relative p-8 bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border-b border-white/5">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/60 hover:text-white"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-3 text-emerald-400 mb-4">
                  <Gift size={20} />
                  <span className="uppercase tracking-widest text-sm">
                    Earn 50 Credits
                  </span>
                </div>

                <h2 className="text-3xl font-semibold text-white">
                  Build together. Grow together.
                </h2>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <p className="text-white/70 mb-3">
                    Your referral link:
                  </p>

                  <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 text-cyan-400 truncate">
                      <LinkIcon size={16} />
                      <span className="truncate text-sm">
                        {loading
                          ? "Generating link..."
                          : referralLink || "Login required"}
                      </span>
                    </div>

                    <button
                      onClick={handleCopy}
                      disabled={!referralLink}
                      className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-black font-medium px-4 py-2 rounded-lg transition"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-black/40 border border-white/10 p-6 rounded-xl text-center">
                    <Gift className="mx-auto mb-3 text-emerald-400" />
                    <p className="text-white font-medium">
                      Share your referral link
                    </p>
                  </div>

                  <div className="bg-black/40 border border-white/10 p-6 rounded-xl text-center">
                    <Gift className="mx-auto mb-3 text-cyan-400" />
                    <p className="text-white font-medium">
                      They get extra 5 credits
                    </p>
                  </div>

                  <div className="bg-black/40 border border-white/10 p-6 rounded-xl text-center">
                    <Gift className="mx-auto mb-3 text-purple-400" />
                    <p className="text-white font-medium">
                      You earn 50 credits on first subscription
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}