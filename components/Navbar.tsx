"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Tools", href: "/tools" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-black/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-blue-500">
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

          {/* Search Icon */}
          <button className="text-white hover:text-blue-500 transition-colors duration-200 text-xl ml-4">
            🔍
          </button>

          {/* Auth Buttons */}
          <Link
            href="/login"
            className="text-white hover:text-blue-500 font-medium px-4 py-2 rounded-md transition-colors duration-200"
          >
            Login
          </Link>
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
            className="text-white text-2xl"
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: menuOpen ? "auto" : 0 }}
        className="overflow-hidden md:hidden bg-black/95"
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

          <button
            className="text-white hover:text-blue-500 font-medium text-left mt-2"
            onClick={() => setMenuOpen(false)}
          >
            🔍 Search
          </button>

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
  );
}