"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, UserRound, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/components/providers/AuthProvider";

const navLinkClass =
  "text-[15px] font-medium text-slate-800 hover:text-brand-cyan transition-colors";

const mediaItemClass =
  "block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-cyan transition-colors";

export default function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="bg-slate-50 border-b border-slate-200 hidden md:block">
          <div className="max-w-7xl mx-auto px-6 h-16 flex justify-end items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/how-to-buy" className="hover:text-brand-cyan transition-colors">
              How to buy
            </Link>
            <Link href="/partners" className="hover:text-brand-cyan transition-colors">
              Partners &amp; Clients
            </Link>
          </div>
        </div>

        <nav className="w-full border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div className="flex items-center gap-10 lg:gap-12">
              <Link href="/">
                <Image
                  src="https://lh3.googleusercontent.com/d/1GKmxjLOuf5s9RZXitclgYgdbPa2QMC8m"
                  alt="Innovera Logo"
                  width={160}
                  height={48}
                  priority
                  className="h-10 sm:h-12 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </Link>

              <div className="hidden lg:flex items-center gap-8">
                <Link href="/" className={navLinkClass}>
                  Home
                </Link>
                <Link href="/about" className={navLinkClass}>
                  About Us
                </Link>
                <Link href="/academy" className={navLinkClass}>
                  Academy
                </Link>
                <Link href="/courses" className={navLinkClass}>
                  Courses
                </Link>

                <Link href="/internship" className={navLinkClass}>
                  Internship
                </Link>

                <div className="relative group">
                  <button
                    type="button"
                    className={`${navLinkClass} inline-flex items-center gap-1`}
                    aria-haspopup="menu"
                  >
                    Media
                    <svg
                      className="w-4 h-4 transition-transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="w-44 rounded-lg bg-white shadow-lg border border-slate-100 py-2">
                      <Link href="/news" className={mediaItemClass}>
                        News
                      </Link>
                      <Link href="/events" className={mediaItemClass}>
                        Events
                      </Link>
                      <Link href="/gallery" className={mediaItemClass}>
                        Gallery
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/contact"
                className="px-6 py-2 border-2 border-brand-cyan text-brand-cyan rounded-full text-[15px] font-medium hover:bg-brand-cyan hover:text-white transition-all"
              >
                Contact Us
              </Link>
              {user ? (
                <Link
                  href="/account"
                  className="inline-flex items-center gap-2 text-[15px] font-medium text-slate-800 hover:text-brand-cyan transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-brand-cyan/10 text-brand-cyan inline-flex items-center justify-center">
                    <UserRound className="w-4 h-4" />
                  </span>
                  <span className="max-w-[140px] truncate">{user.name}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-[15px] font-medium text-slate-800 hover:text-brand-cyan transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            <button
              type="button"
              className="lg:hidden text-slate-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </header>

      {/*
        Header is always `fixed` (out of document flow) now — see the jump-on-scroll
        fix above. This spacer reserves the same height in normal flow so page content
        isn't hidden behind it, matching what pages already expect (several already pad
        their own top-level wrapper for a permanently-fixed header, e.g. Gallery's
        `pt-24`; this keeps their effective spacing unchanged while also fixing pages
        that had no such padding and previously relied on the header's own in-flow
        height at scroll position 0).
      */}
      <div className="h-20 md:h-36" aria-hidden />

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-display font-semibold"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-display font-semibold"
              >
                About Us
              </Link>
              <Link
                href="/academy"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-display font-semibold"
              >
                Academy
              </Link>
              <Link
                href="/courses"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-display font-semibold"
              >
                Courses
              </Link>
              <Link
                href="/services"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-display font-semibold"
              >
                Services
              </Link>
              <Link
                href="/internship"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-display font-semibold"
              >
                Internship
              </Link>
              <Link
                href="/news"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-display font-semibold"
              >
                News
              </Link>
              <Link
                href="/events"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-display font-semibold"
              >
                Events
              </Link>
              <Link
                href="/gallery"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-display font-semibold"
              >
                Gallery
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-display font-semibold text-brand-cyan mt-4"
              >
                Contact Us
              </Link>
              {user ? (
                <Link
                  href="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-display font-semibold"
                >
                  My Account ({user.name})
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-display font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-display font-semibold"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
