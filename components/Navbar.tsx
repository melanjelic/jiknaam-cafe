"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Coffee, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const t = useTranslations("navbar");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/" as const, label: t("home") },
    { href: "/menu" as const, label: t("menu") },
    { href: "/gallery" as const, label: t("gallery") },
    { href: "/campaigns" as const, label: t("campaigns") },
    { href: "/contact" as const, label: t("contact") },
  ];

  const otherLocale = locale === "en" ? "th" : "en";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#2a2a2a]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/30 flex items-center justify-center group-hover:bg-[#d4a853]/20 transition-colors">
            <Coffee size={15} className="text-[#d4a853]" />
          </div>
          <span className="font-semibold text-[#f0ece4] tracking-wide text-sm">
            {tCommon("brandName")}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "text-[#d4a853]"
                    : "text-[#888] hover:text-[#f0ece4]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <Link
            href={pathname}
            locale={otherLocale}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#3a3a3a] text-[#888] hover:text-[#d4a853] hover:border-[#d4a853]/40 transition-colors"
          >
            {otherLocale.toUpperCase()}
          </Link>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-[#888] hover:text-[#f0ece4] transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0d0d0d]/98 border-b border-[#2a2a2a] overflow-hidden"
          >
            <nav className="max-w-6xl mx-auto px-5 py-4 flex flex-col gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    pathname === href
                      ? "text-[#d4a853] bg-[#d4a853]/10"
                      : "text-[#888] hover:text-[#f0ece4] hover:bg-[#1c1c1c]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
