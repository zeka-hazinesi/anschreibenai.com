"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export default function StyleSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="size-auto" />;

  return (
    <Button
      variant={"ghost"}
      aria-label="Toggle Dark Mode"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-primary flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full"
    >
      {theme === "dark" ? (
        <Sun size={30} style={{ width: "24px", height: "24px" }} />
      ) : (
        <Moon size={30} style={{ width: "24px", height: "24px" }} />
      )}
    </Button>
  );
}
