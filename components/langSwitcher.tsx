"use client";
import {
  FaGlobeEurope, // For multiple European languages
} from "react-icons/fa";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { FiGlobe } from "react-icons/fi";
import { capitalize } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const LangSwitcher: React.FC = () => {
  interface Option {
    country: string;
    code: string;
    icon: React.ReactNode;
  }
  const pathname = usePathname();
  const urlSegments = useSelectedLayoutSegments();

  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);

  // Function to get appropriate flag icon based on language code
  const getFlagIcon = (code: string) => {
    const iconSize = 16;

    // Map language codes to their appropriate icons
    switch (code) {
      // English - using GB flag instead of USA
      case "en":
        return <span className="fi fi-gb"></span>;

      // European languages
      case "de":
        return <span className="fi fi-de"></span>;
      case "tr":
        return <span className="fi fi-tr"></span>;
      case "fr":
        return <span className="fi fi-fr"></span>;
      case "es":
        return <span className="fi fi-es"></span>;
      case "it":
        return <span className="fi fi-it"></span>;
      case "ru":
        return <span className="fi fi-ru"></span>;
      case "pt":
        return <span className="fi fi-pt"></span>;
      case "pl":
        return <span className="fi fi-pl"></span>;
      case "uk":
        return <span className="fi fi-ua"></span>;
      case "ro":
        return <span className="fi fi-ro"></span>;
      case "nl":
        return <span className="fi fi-nl"></span>;
      case "cs":
        return <span className="fi fi-cz"></span>;
      case "hu":
        return <span className="fi fi-hu"></span>;
      case "sr":
        return <span className="fi fi-rs"></span>;
      case "el":
        return <span className="fi fi-gr"></span>;
      case "hr":
        return <span className="fi fi-hr"></span>;

      // Middle Eastern and Asian languages
      case "ar":
        return <span className="fi fi-sa"></span>; // Saudi Arabia as representative
      case "bn":
        return <span className="fi fi-bd"></span>; // Bangladesh
      case "hi":
        return <span className="fi fi-in"></span>; // India
      case "ur":
        return <span className="fi fi-pk"></span>; // Pakistan
      case "tl":
        return <span className="fi fi-ph"></span>; // Philippines
      case "vi":
        return <span className="fi fi-vn"></span>; // Vietnam
      case "fa":
        return <span className="fi fi-ir"></span>; // Iran

      // East Asian languages
      case "zh":
        return <span className="fi fi-cn"></span>; // China
      case "ja":
        return <span className="fi fi-jp"></span>; // Japan
      case "ko":
        return <span className="fi fi-kr"></span>; // South Korea
      case "th":
        return <span className="fi fi-th"></span>; // Thailand
      case "ms":
        return <span className="fi fi-my"></span>; // Malaysia
      case "sw":
        return <span className="fi fi-ke"></span>; // Kenya (for Swahili)
      case "my":
        return <span className="fi fi-mm"></span>; // Myanmar
      case "ta":
        return <span className="fi fi-lk"></span>; // Sri Lanka (for Tamil)

      // Default icon for any unmatched language
      default:
        return <FaGlobeEurope size={iconSize} />;
    }
  };

  const options: Option[] = [
    // European languages
    { country: "Deutsch", code: "de", icon: getFlagIcon("de") },
    { country: "English", code: "en", icon: getFlagIcon("en") },
    { country: "Türkçe", code: "tr", icon: getFlagIcon("tr") },
    { country: "Українська", code: "uk", icon: getFlagIcon("uk") },
    { country: "العربية", code: "ar", icon: getFlagIcon("ar") },
    { country: "Français", code: "fr", icon: getFlagIcon("fr") },
    { country: "Español", code: "es", icon: getFlagIcon("es") },
    { country: "Italiano", code: "it", icon: getFlagIcon("it") },
    { country: "Русский", code: "ru", icon: getFlagIcon("ru") },
    { country: "Português", code: "pt", icon: getFlagIcon("pt") },
    { country: "Polski", code: "pl", icon: getFlagIcon("pl") },
    { country: "Română", code: "ro", icon: getFlagIcon("ro") },
    { country: "Nederlands", code: "nl", icon: getFlagIcon("nl") },
    { country: "Čeština", code: "cs", icon: getFlagIcon("cs") },
    { country: "Magyar", code: "hu", icon: getFlagIcon("hu") },
    { country: "Српски", code: "sr", icon: getFlagIcon("sr") },
    { country: "Ελληνικά", code: "el", icon: getFlagIcon("el") },
    { country: "Hrvatski", code: "hr", icon: getFlagIcon("hr") },

    // US-relevant languages (large communities)
    { country: "বাংলা", code: "bn", icon: getFlagIcon("bn") },
    { country: "हिन्दी", code: "hi", icon: getFlagIcon("hi") },
    { country: "اردو", code: "ur", icon: getFlagIcon("ur") },
    { country: "Filipino", code: "tl", icon: getFlagIcon("tl") },
    { country: "Tiếng Việt", code: "vi", icon: getFlagIcon("vi") },
    { country: "فارسی", code: "fa", icon: getFlagIcon("fa") },

    // Remaining major world languages
    { country: "中文", code: "zh", icon: getFlagIcon("zh") },
    { country: "日本語", code: "ja", icon: getFlagIcon("ja") },
    { country: "한국어", code: "ko", icon: getFlagIcon("ko") },
    { country: "ไทย", code: "th", icon: getFlagIcon("th") },
    { country: "Bahasa Melayu", code: "ms", icon: getFlagIcon("ms") },
    { country: "Kiswahili", code: "sw", icon: getFlagIcon("sw") },
    { country: "မြန်မာဘာသာ", code: "my", icon: getFlagIcon("my") },
    { country: "தமிழ்", code: "ta", icon: getFlagIcon("ta") },
  ];

  return (
    <div className="z-50 flex items-center justify-center">
      <div className="relative">
        <Button
          variant="ghost"
          className="text-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-full px-1 py-1 text-base shadow-none transition-all duration-200"
          onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
          onBlur={() => setIsOptionsExpanded(false)}
        >
          <FiGlobe size={30} style={{ width: "24px", height: "24px" }} />
        </Button>
        {isOptionsExpanded && (
          <div className="bg-background absolute right-0 mt-2 w-52 origin-top-right rounded-md shadow-lg">
            <div
              className="max-h-[90vh] overflow-y-auto"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {options.map(lang => {
                return (
                  <Link key={lang.code} href={`/${lang.code}/${urlSegments.join("/")}`}>
                    <button
                      lang={lang.code}
                      onMouseDown={e => {
                        e.preventDefault();
                      }}
                      className={`hover:bg-dropdownHover block flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-left text-sm hover:text-white ${
                        pathname === `/${lang.code}`
                          ? "bg-primary hover:bg-selected text-white"
                          : "text-primary hover:bg-primary duration-200 hover:text-white"
                      }`}
                    >
                      <span className="inline-flex w-6 items-center justify-center">{lang.icon}</span>
                      <span>
                        {capitalize(lang.country)} {pathname === `/${lang.code}` ? "✓" : ""}
                      </span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LangSwitcher;
