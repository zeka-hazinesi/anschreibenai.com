"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { SettingsIcon, X, ChevronDown, Check } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import * as React from "react";

const Settings = () => {
  const t = useTranslations("settings");
  const [open, setOpen] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState("de");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const languages = [
    { value: "de", label: "Deutsch" },
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "it", label: "Italiano" },
    { value: "pt", label: "Português" },
    { value: "zh", label: "中文" },
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle saving the language selection
    localStorage.setItem("outputLanguage", selectedLanguage);
    setOpen(false);
  };

  // Simplified Language Selector
  const LanguageSelector = () => (
    <div className="relative w-full cursor-pointer" ref={dropdownRef}>
      <button
        type="button"
        className="bg-background border-primary flex h-9 w-full cursor-pointer items-center justify-between rounded-md border px-3 text-left"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span>{languages.find(lang => lang.value === selectedLanguage)?.label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isDropdownOpen && (
        <div className="bg-background border-primary absolute bottom-full left-0 z-10 mb-1 w-full cursor-pointer rounded-md border shadow-lg">
          <ul className="max-h-90 overflow-auto py-1">
            {languages.map(language => (
              <li
                key={language.value}
                className={`hover:bg-primary hover:text-chart-1 relative cursor-pointer py-2 pr-9 pl-3 duration-200 select-none ${
                  selectedLanguage === language.value ? "bg-primary text-chart-1" : ""
                }`}
                onClick={() => {
                  setSelectedLanguage(language.value);
                  setIsDropdownOpen(false);
                }}
              >
                <span className="block truncate">{language.label}</span>
                {selectedLanguage === language.value && (
                  <span className="text-chart-1 absolute top-1/2 right-2 -translate-y-1/2">
                    <Check className="h-5 w-5" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // Form content shared between Dialog and Drawer
  const SettingsForm = ({ className = "" }) => (
    <form onSubmit={handleSave} className={`grid w-full items-start gap-4 ${className}`}>
      <div className="grid w-full gap-2">
        <Label htmlFor="language">{t("languageLabel")}</Label>
        <LanguageSelector />
      </div>
      <Button variant="default" type="submit" className="text-chart-1 w-full cursor-pointer">
        {t("saveButton")}
      </Button>
    </form>
  );

  return (
    <div className="flex items-center justify-center">
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary h-9 w-9 cursor-pointer items-center justify-center rounded-full p-1 text-base shadow-none"
            >
              <SettingsIcon size={30} style={{ width: "24px", height: "24px" }} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] [&>button:last-child]:hidden">
            <DialogClose asChild className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary h-9 w-9 cursor-pointer items-center justify-center rounded-full p-1 text-base shadow-none"
              >
                <X size={30} style={{ width: "24px", height: "24px" }} />
              </Button>
            </DialogClose>
            <DialogHeader className="py-4">
              <DialogTitle>{t("settingsTitle")}</DialogTitle>
              <DialogDescription>{t("settingsDescription")}</DialogDescription>
            </DialogHeader>
            <SettingsForm />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary h-9 w-9 cursor-pointer items-center justify-center rounded-full p-1 text-base shadow-none"
            >
              <SettingsIcon size={30} style={{ width: "24px", height: "24px" }} />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4 pb-32">
            <DrawerClose asChild className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary h-9 w-9 cursor-pointer items-center justify-center rounded-full p-1 text-base shadow-none"
              >
                <X size={30} style={{ width: "24px", height: "24px" }} />
              </Button>
            </DrawerClose>
            <DrawerHeader className="py-4 text-left">
              <DrawerTitle className="text-2xl font-bold">{t("settingsTitle")}</DrawerTitle>
              <DrawerDescription className="text-base">{t("settingsDescription")}</DrawerDescription>
            </DrawerHeader>
            <SettingsForm className="px-4" />
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default Settings;
