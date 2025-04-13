"use client";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import { useTranslations } from "next-intl";

export default function HowToSection() {
  const t = useTranslations("link");
  return (
    <div className="flex h-auto w-full flex-col items-center justify-center space-y-16 p-4 px-4 pb-16 sm:p-16 lg:pb-32">
      {" "}
      {/* Added horizontal padding */}
      <h2 className="text-primary text-center text-xl font-bold lg:text-2xl xl:text-4xl">
        {t("howToSectionTitle")}
      </h2>{" "}
      {/* Added text-center */}
      <div className="relative w-full max-w-[90vw] shadow-lg sm:max-w-[65vw]">
        {" "}
        {/* Adjusted max-width */}
        <LiteYouTubeEmbed
          aspectHeight={9}
          aspectWidth={16}
          id="db9h6EfkGuE"
          title="Die perfekte Anleitung für Dein Motivationsschreiben"
        />
      </div>
    </div>
  );
}
