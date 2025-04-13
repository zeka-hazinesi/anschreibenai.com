import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    "ar", // Arabic
    "bn", // Bengali
    "cs", // Czech
    "de", // German
    "el", // Greek
    "en", // English
    "es", // Spanish
    "fa", // Persian
    "fr", // French
    "hi", // Hindi
    "hr", // Croatian
    "hu", // Hungarian
    "it", // Italian
    "ja", // Japanese
    "ko", // Korean
    "ms", // Malay
    "my", // Burmese
    "nl", // Dutch
    "pl", // Polish
    "pt", // Portuguese
    "ro", // Romanian
    "ru", // Russian
    "sr", // Serbian
    "sw", // Swahili
    "ta", // Tamil
    "th", // Thai
    "tl", // Filipino/Tagalog
    "tr", // Turkish
    "uk", // Ukrainian
    "ur", // Urdu
    "vi", // Vietnamese
    "zh", // Chinese (Simplified)
  ],
  // Used when no locale matches
  defaultLocale: "de",
});
