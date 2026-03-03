"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Gift, Sparkles, Menu, X } from "lucide-react";
import ReferralModal from "./ReferralModal";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Tools", href: "/tools" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-50 bg-black/90 backdrop-blur-md shadow-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-blue-500 transition"
          >
            CreatorOS
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white hover:text-blue-500 transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}

            {/* 🎁 Referral Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative ml-4 group"
              onClick={() => setReferralOpen(true)}
            >
              {/* Glow */}
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 blur-lg opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse"></span>

              {/* Button Content */}
              <div className="relative flex items-center gap-2 px-5 py-2.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl text-white shadow-xl">
                
                {/* Animated Gift */}
                <motion.div
                  animate={{ rotate: [0, -10, 10, -5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="relative"
                >
                  <Gift className="w-5 h-5 text-purple-400" />
                  <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-cyan-400 animate-ping" />
                </motion.div>

                <span className="font-medium tracking-wide">
                  Refer & Earn
                </span>

                <span className="ml-2 text-xs bg-gradient-to-r from-purple-500 to-blue-500 px-2 py-0.5 rounded-full font-semibold">
                  +20
                </span>
              </div>
            </motion.button>

            {/* Login */}
            <Link
              href="/login"
              className="text-white hover:text-blue-500 font-medium px-4 py-2 rounded-md transition-colors duration-200"
            >
              Login
            </Link>

            {/* Signup */}
            <Link
              href="/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
            >
              Sign Up →
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: menuOpen ? "auto" : 0 }}
          className="overflow-hidden md:hidden bg-black/95 border-t border-white/5"
        >
          <div className="flex flex-col px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white hover:text-blue-500 font-medium transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Referral (FIXED) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-white hover:text-blue-400 font-medium mt-2"
              onClick={() => {
                setMenuOpen(false);
                setReferralOpen(true);
              }}
            >
              <Gift className="w-4 h-4 text-purple-400" />
              Refer & Earn
            </motion.button>

            <Link
              href="/login"
              className="text-white hover:text-blue-500 font-medium mt-2"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md mt-2"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up →
            </Link>
          </div>
        </motion.div>
      </nav>

      {/* Referral Modal */}
      <ReferralModal
        open={referralOpen}
        onClose={() => setReferralOpen(false)}
      />
    </>
  );
}