"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { LetterProps, SenderData } from "@/types/coverletter";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/lib/generatePDF";
import { generateText } from "@/lib/apiClient";
import TextInput from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import DIN5008 from "../review/din5008";
import { Loader2 } from "lucide-react";

interface CheckboxState {
  draft: boolean;
  pdf: boolean;
}

export default function HeroSection() {
  const t = useTranslations("link");
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize router

  // Core state
  const [inputValue, setInputValue] = useState("");
  const [isValidLink, setIsValidLink] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [letterProps, setLetterProps] = useState<LetterProps>();

  // Add state to track when to generate PDF
  const [shouldGeneratePDF, setShouldGeneratePDF] = useState(false);
  const filenameRef = useRef<string>("");

  // Checkbox state (combined into a single state object)
  const [checkboxes, setCheckboxes] = useState<CheckboxState>({
    draft: false,
    pdf: false,
  });

  const { draft: draftChecked, pdf: pdfChecked } = checkboxes;

  // Constants
  const CHECKBOXES_STORAGE_KEY = "checkboxStates";
  const ADDRESS_STORAGE_KEY = "address";

  // Memoized values
  const isFormValid = useMemo(() => inputValue.trim() !== "" && isValidLink, [inputValue, isValidLink]);

  const buttonLabel = useMemo(() => {
    if (isGenerating) return t("processing");
    if (draftChecked) return t("generateDraft");
    if (pdfChecked) return t("generatePDF");
    return t("proceedAddressButton");
  }, [isGenerating, draftChecked, pdfChecked, t]);

  // ===== URL Validation =====
  const isValidURL = useCallback((url: string) => {
    try {
      if (!url.startsWith("http://") && !url.startsWith("https://")) return false;
      const parsedURL = new URL(url);
      return /\.[a-zA-Z]{2,}$/.test(parsedURL.hostname);
    } catch {
      return false;
    }
  }, []);

  // ===== Event Handlers =====
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setIsValidLink(isValidURL(value));
    },
    [isValidURL],
  );

  const handleCheckboxChange = useCallback(
    (field: keyof CheckboxState) => (checked: boolean) => {
      setCheckboxes(prev => {
        const newState = { ...prev, [field]: checked };
        localStorage.setItem(CHECKBOXES_STORAGE_KEY, JSON.stringify(newState));
        return newState;
      });
    },
    [CHECKBOXES_STORAGE_KEY],
  );

  // ===== Core Logic =====
  const handleButtonClick = useCallback(async () => {
    if (!isFormValid) return;

    const link = inputValue.trim();
    sessionStorage.setItem("link", link);

    try {
      if (draftChecked && !pdfChecked) {
        setIsGenerating(true);

        // Generate text and go to draft
        const textData = await generateText(link);
        localStorage.setItem("draft", JSON.stringify(textData.coverLetter));
        setIsGenerating(false);
        router.push("/review");
      } else if (pdfChecked) {
        setIsGenerating(true);
        const { coverLetter } = await generateText(link);

        const address = JSON.parse(localStorage.getItem(ADDRESS_STORAGE_KEY) || "{}");
        const signaturePath = localStorage.getItem("signature") || "";

        const sender: SenderData = address.name
          ? {
              name: address.name + " " + address.surname,
              street: address.street + " " + address.buildingNumber,
              zip: address.zipCode,
              city: address.city,
              email: address.email,
              phone: address.phone,
            }
          : {
              name: "",
              street: "",
              zip: "",
              city: "",
              email: "",
              phone: "",
            };

        // Prepare letter props with safeguards for missing data
        const letter: LetterProps = {
          sender,
          recipient: {
            company: coverLetter.recipient.company || "",
            contactName: coverLetter.recipient.contactName || "",
            street: coverLetter.recipient.street || "",
            zip: coverLetter.recipient.zip || "",
            city: coverLetter.recipient.city || "",
          },
          city_and_date: address.city
            ? address.city +
              ", " +
              new Date().toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "",
          subject: coverLetter?.subject || "",
          body: coverLetter?.body || [],
          closing: coverLetter?.closing || "",
          senderSignature: signaturePath,
        };

        // Generate a filename based on recipient and sender
        const filename =
          "anschreiben_" +
          (letter.recipient.company ? letter.recipient.company.replace(/\s+/g, " ").trim() : "company") +
          "_" +
          (letter.sender.name ? letter.sender.name.replace(/\s+/g, " ").trim() : "sender") +
          ".pdf";

        // Store the filename in ref for use in useEffect
        filenameRef.current = filename;

        // Set the letter props to trigger rendering
        setLetterProps(letter);

        // Flag that we should generate PDF after render
        setShouldGeneratePDF(true);
      } else {
        // Navigate to the address page
        router.push("/address");
      }
    } catch (error) {
      console.error("Error processing request:", error);
      alert("Es gab ein Problem. Bitte versuchen Sie es erneut.");
      setIsGenerating(false); // Ensure loading state is reset on error
    }
  }, [isFormValid, inputValue, draftChecked, pdfChecked, router]);

  // Effect to handle PDF generation after letterProps is updated and component is rendered
  useEffect(() => {
    if (shouldGeneratePDF && letterProps) {
      // Small timeout to ensure DIN5008 component has fully rendered
      const timer = setTimeout(() => {
        generatePDF("cl", filenameRef.current);
        setShouldGeneratePDF(false);
        setIsGenerating(false);
        // Reset letterProps to force a complete re-render next time
        setLetterProps(undefined);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [shouldGeneratePDF, letterProps]);

  // Initialize from URL/localStorage
  // ===== Effects =====
  useEffect(() => {
    // Load URL from query parameter or sessionStorage
    const linkFromQuery = searchParams.get("link");

    if (linkFromQuery) {
      setInputValue(linkFromQuery);
      sessionStorage.setItem("link", linkFromQuery);
      setIsValidLink(isValidURL(linkFromQuery));
    } else {
      const storedLink = sessionStorage.getItem("link") || "";
      setInputValue(storedLink);
      if (storedLink) setIsValidLink(isValidURL(storedLink));
    } // Load checkbox states from localStorage

    try {
      const checkboxStates = localStorage.getItem(CHECKBOXES_STORAGE_KEY);
      if (checkboxStates) {
        setCheckboxes(JSON.parse(checkboxStates));
      }
    } catch (error) {
      console.error("Error parsing checkbox states:", error); // Optionally clear invalid storage data
      // localStorage.removeItem(CHECKBOXES_STORAGE_KEY);
    }

    // --- CORRECTED LOGIC ---
    // Determine if checkboxes should be shown based on whether address exists
    // Show checkboxes only if ADDRESS_STORAGE_KEY has a value in localStorage.
    const addressExists = !!localStorage.getItem(ADDRESS_STORAGE_KEY);
    setShowCheckboxes(addressExists);
    // --- END OF CORRECTION ---
  }, [searchParams, isValidURL, CHECKBOXES_STORAGE_KEY, ADDRESS_STORAGE_KEY]); // Removed letterProps from dependencies

  return (
    // Removed the outermost div, assuming the parent component (`Home`) provides the main container
    <div className="flex h-[100dvh] w-full flex-col items-center p-4 pt-[10rem] sm:p-16 sm:pt-[13rem]">
      {/* Header */}
      <div className="flex h-auto w-full flex-col items-center gap-4 py-8">
        <h1 className="text-primary text-2xl font-bold lg:text-4xl xl:text-7xl">{t("title")}</h1>
      </div>
      {/* Content */}
      <div className="flex h-auto w-full max-w-[210mm] flex-col items-center space-y-4 px-4 sm:px-0">
        {" "}
        {/* Added padding for smaller screens */}
        <div className="flex h-auto w-full flex-col items-center justify-center">
          <TextInput label={t("inputLabel")} value={inputValue} onChange={handleInputChange} />
          {!isValidLink && inputValue.trim() !== "" && (
            <p className="mt-1 w-full text-left text-sm text-red-600">{t("instructions")}</p>
          )}
        </div>
        {/* Controls */}
        <div
          className={`flex h-auto w-full flex-col-reverse sm:flex-row ${
            showCheckboxes ? "justify-between" : "justify-end" // Corrected logic based on original intent (show checkboxes when address is MISSING)
          } items-start gap-4 sm:gap-0`} // Added gap for column layout
        >
          {showCheckboxes && ( // Show when address is NOT found
            <div className="flex h-auto w-auto flex-col items-start justify-center space-y-2 pt-4 sm:pt-0">
              {" "}
              {/* Added space-y */}
              {/* Checkboxes */}
              {[
                {
                  id: "draft",
                  label: t("generateDraft"),
                  disabled: pdfChecked, // Disable draft if PDF is checked
                },
                { id: "pdf", label: t("generatePDF"), disabled: false }, // Disable PDF if draft is checked
              ].map(({ id, label, disabled }) => (
                <div key={id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${id}Checkbox`}
                    checked={checkboxes[id as keyof CheckboxState]}
                    onCheckedChange={checked => handleCheckboxChange(id as keyof CheckboxState)(checked === true)}
                    disabled={isGenerating || disabled} // Also disable during generation
                    className="cursor-pointer"
                  />
                  <Label
                    className={`cursor-pointer text-base font-medium ${disabled || isGenerating ? "cursor-not-allowed text-gray-400" : ""}`} // Adjusted disabled style
                    htmlFor={`${id}Checkbox`}
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {/* Button */}
          <Button
            variant="default"
            className={`h-[42px] w-full shrink-0 cursor-pointer text-base sm:w-auto ${!isFormValid ? "bg-input cursor-not-allowed opacity-50" : "text-chart-1"}`} // Improved disabled style, added shrink-0
            onClick={handleButtonClick}
            disabled={!isFormValid}
            aria-disabled={!isFormValid}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <p> {buttonLabel}</p>
              </>
            ) : (
              <p> {buttonLabel}</p>
            )}
          </Button>
        </div>
      </div>
      {letterProps && letterProps.sender && (
        <div className="hidden">
          <DIN5008 {...letterProps} skipAddress={localStorage.getItem("skipAddress") === "true"} />
        </div>
      )}
      <div className="pointer-events-none absolute bottom-0 flex h-auto w-full flex-row items-start justify-center sm:-ml-24">
        <DotLottiePlayer
          src="/animations/arrow-down.json"
          autoplay
          loop
          speed={0.75}
          className="h-auto w-32 object-cover lg:w-42"
        />
      </div>
    </div>
  );
}
