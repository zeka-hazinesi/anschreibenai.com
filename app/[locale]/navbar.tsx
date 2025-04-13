"use client";

import LangSwitcher from "@/components/langSwitcher";
import StyleSwitch from "@/components/style-switch";
import { Button } from "@/components/ui/button";
import Settings from "@/components/settings";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-background fixed top-0 left-0 z-50 flex h-auto w-full flex-row items-start justify-between px-4 py-2">
      <Link href="/" className="flex flex-row items-center justify-center gap-1 select-none">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} className="pointer-events-none h-10 w-10 rounded-md" />
        <span className="text-primary text-xl font-semibold select-none sm:text-2xl">anschreibenAI</span>
      </Link>

      {/* Burger menu button - only visible on mobile */}
      <button
        className="z-50 flex flex-col items-center justify-center gap-1 p-2 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`bg-primary block h-0.5 w-6 transition-all ${isMobileMenuOpen ? "translate-y-1.5 rotate-45" : ""}`}
        ></span>
        <span
          className={`bg-primary block h-0.5 w-6 transition-all ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
        ></span>
        <span
          className={`bg-primary block h-0.5 w-6 transition-all ${isMobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
        ></span>
      </button>

      {/* Desktop menu - hidden on mobile */}
      <div id="menu" className="hidden flex-row items-center justify-center gap-4 md:flex">
        <a href="https://github.com/zeka-hazinesi/anschreibenai.com" target="_blank" rel="noreferrer">
          <Button
            variant="outline"
            className="text-primary flex cursor-pointer flex-row gap-1.5 px-4 py-2 text-sm font-medium"
          >
            <Image src="/github.svg" alt="Github Logo" className="size-[14px]" width={14} height={14} />
            <span>Github</span>
          </Button>
        </a>
        <StyleSwitch />
        <Settings />
        <LangSwitcher />
      </div>

      {/* Mobile menu - slides in from the right when open */}
      <div
        className={`bg-background fixed top-0 right-0 z-40 h-screen shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "w-64 opacity-100" : "pointer-events-none w-0 opacity-0"
        } flex flex-col items-center gap-6 px-4`}
      >
        <div className="flex w-full flex-row items-center justify-start gap-4 py-2">
          <StyleSwitch />
          <Settings />
          <LangSwitcher />
        </div>
        <a
          href="https://github.com/zeka-hazinesi/anschreibenai.com"
          target="_blank"
          rel="noreferrer"
          className="w-full"
        >
          <Button
            variant="outline"
            className="text-primary flex w-full cursor-pointer flex-row justify-center gap-1.5 px-4 py-2 text-sm font-medium"
          >
            <Image src="/github.svg" alt="Github Logo" className="size-[14px]" width={14} height={14} />
            <span>Github</span>
          </Button>
        </a>
      </div>

      {/* Overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </nav>
  );
}
