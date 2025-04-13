import { useTranslations } from "next-intl";
import { X, Check } from "lucide-react";

export default function ComparisonSection() {
  const t = useTranslations("link");
  return (
    <div className="flex h-auto w-full flex-col items-center justify-center space-y-16 p-4 pb-16 sm:p-16 lg:pb-32">
      <h2 className="text-primary text-xl font-bold lg:text-2xl xl:text-4xl">{t("comparisonSectionTitle")}</h2>

      <div className="flex h-auto w-full flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16 md:gap-24 lg:gap-32">
        {/* Without ZenVoice */}
        <div className="rounded-xl bg-red-50 p-10 shadow-lg">
          <h3 className="mb-6 text-lg font-semibold text-red-600 lg:text-xl xl:text-3xl">ChatGPT</h3>

          <ul className="space-y-6">
            <li className="flex items-center gap-2">
              <X className="h-7 w-7 text-red-500" />
              <span className="text-md text-gray-700 lg:text-lg xl:text-xl">{t("reason1")}</span>
            </li>
            <li className="flex items-center gap-2">
              <X className="h-7 w-7 text-red-500" />
              <span className="text-md text-gray-700 lg:text-lg xl:text-xl">{t("reason2")}</span>
            </li>
            <li className="flex items-center gap-2">
              <X className="h-7 w-7 text-red-500" />
              <span className="text-md text-gray-700 lg:text-lg xl:text-xl">{t("reason3")}</span>
            </li>
            <li className="flex items-center gap-2">
              <X className="h-7 w-7 text-red-500" />
              <span className="text-md text-gray-700 lg:text-lg xl:text-xl">{t("reason4")}</span>
            </li>
            <li className="flex items-center gap-2">
              <X className="h-7 w-7 text-red-500" />
              <span className="text-md text-gray-700 lg:text-lg xl:text-xl">{t("reason5")}</span>
            </li>
          </ul>
        </div>

        {/* With ZenVoice */}
        <div className="rounded-xl bg-green-50 p-10 shadow-lg">
          <h3 className="mb-6 text-lg font-semibold text-green-600 lg:text-xl xl:text-3xl">anschreibenAI</h3>

          <ul className="space-y-6">
            <li className="flex items-center gap-2">
              <Check className="h-7 w-7 text-green-500" />
              <span className="text-md text-gray-700 lg:text-lg xl:text-xl">{t("solution1")}📄</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-7 w-7 text-green-500" />
              <span className="text-md text-gray-700 lg:text-lg xl:text-xl">{t("solution2")}🖊️</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-7 w-7 text-green-500" />
              <span className="text-md text-gray-700 lg:text-lg xl:text-xl">{t("solution3")}🔐</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-7 w-7 text-green-500" />
              <span className="text-md text-gray-700 lg:text-lg xl:text-xl">{t("solution4")}✏️</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-7 w-7 text-green-500" />
              <span className="text-md text-gray-700 lg:text-lg xl:text-xl">{t("solution5")}🚀</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
