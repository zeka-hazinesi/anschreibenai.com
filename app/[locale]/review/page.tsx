"use client";

import { useState, useEffect, useCallback } from "react";
import DIN5008 from "@/components/review/din5008";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/lib/generatePDF";
// Fallback PDF generation function with Promise rejection handling
const fallbackGeneratePDF = (elementId: string, filename: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error("Element not found:", elementId);
      reject(new Error("Element not found"));
      return;
    }

    try {
      // Try to use html2pdf if available in window
      if (typeof window !== "undefined" && "html2pdf" in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const html2pdf = (window as any).html2pdf;
        const opt = {
          margin: 10,
          filename: filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        // Use promise syntax rather than await
        html2pdf()
          .set(opt)
          .from(element)
          .save()
          .then(() => resolve())
          .catch((err: Error) => {
            console.error("html2pdf failed:", err);
            reject(err);
          });
        return;
      }

      // Alternative method using browser print to PDF functionality
      console.log("Falling back to print method for PDF generation");
      const originalTitle = document.title;
      document.title = filename.replace(".pdf", "");

      const printStyles = `
        @media print {
          @page { size: A4; margin: 20mm 20mm 20mm 25mm; }
          body * { visibility: hidden; }
          #${elementId}, #${elementId} * { visibility: visible; }
          #${elementId} { position: absolute; left: 0; top: 0; }
        }
      `;

      const styleElem = document.createElement("style");
      styleElem.innerHTML = printStyles;
      document.head.appendChild(styleElem);

      window.print();

      document.head.removeChild(styleElem);
      document.title = originalTitle;

      // Assume print was successful
      resolve();
    } catch (error) {
      console.error("Error in fallback PDF generation:", error);
      alert("Could not generate PDF. Please try using the Print function and save as PDF.");
      reject(error);
    }
  });
};
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { LetterProps, AddressData, RecipientData, SenderData, DraftData } from "@/types/coverletter";
import ProgressStepper from "@/components/progressStepper";
import { Printer, Home, Download } from "lucide-react";

interface EditedContent {
  sender: string;
  recipient: string;
  date: string;
  subject: string;
  content: string;
}

export default function Review() {
  const t = useTranslations("review");
  const router = useRouter();
  const [isGenerating] = useState<boolean>(false);
  const [address, setAddress] = useState<AddressData>({} as AddressData);
  const [draft, setDraft] = useState<DraftData>({} as DraftData);
  const [signaturePath, setSignaturePath] = useState<string>("/unterschrift-max-mustermann.png");
  const [isClient, setIsClient] = useState(false);

  // Store the edited content from DIN5008
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editedContent, setEditedContent] = useState<EditedContent>({
    sender: "",
    recipient: "",
    date: "",
    subject: "",
    content: "",
  });

  // Load data from localStorage only after component mounts (client-side)
  useEffect(() => {
    setIsClient(true);
    try {
      const storedAddress = localStorage.getItem("address");
      const storedDraft = localStorage.getItem("draft");
      const storedSignature = localStorage.getItem("signature");

      if (storedAddress) setAddress(JSON.parse(storedAddress));
      if (storedDraft) setDraft(JSON.parse(storedDraft));
      if (storedSignature) setSignaturePath(storedSignature);
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  // Compute sender data only when address is available
  const sender: SenderData =
    isClient && address.name
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

  // Use draft data only when it's available
  const recipient: RecipientData = draft?.recipient || {
    company: "",
    contactName: "",
    street: "",
    zip: "",
    city: "",
  };

  // Prepare letter props with safeguards for missing data
  const letterProps: LetterProps = {
    sender,
    recipient,
    city_and_date:
      isClient && address.city
        ? address.city +
          ", " +
          new Date().toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "",
    subject: draft?.subject || "",
    body: draft?.body || [],
    closing: draft?.closing || "",
    senderSignature: signaturePath,
  };

  const handleContentChange = useCallback((updatedContent: EditedContent) => {
    setEditedContent(updatedContent);
  }, []);

  // Print document function
  const printDocument = () => {
    // Save the current page content
    const originalBody = document.body.innerHTML;

    // Get the div we want to print
    const contentToPrint = document.getElementById("cl");

    if (!contentToPrint) {
      alert("Could not find the content to print");
      return;
    }

    // Create a print-specific stylesheet preserving DIN 5008 margins
    const printStyles = `
    @media print {
      @page {
        size: A4;
        margin: 0; /* Remove browser default margins */
      }
      body {
        margin: 0;
        padding: 0;
        background-color: white;
      }
      #printContent {
        display: block;
        width: 210mm;
        height: 296mm;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        box-sizing: border-box;
      }
      #printContent #cl {
        /* Preserve the DIN 5008 margins */
        margin: 0;
        padding: 20mm 20mm 20mm 25mm !important; /* Top, Right, Bottom, Left - DIN 5008 standard */
        width: 210mm !important;
        height: 296mm !important;
        box-sizing: border-box !important;
        position: relative !important;
        overflow: visible !important;
      }
      /* Fix alignment issues for sender and date in print view */
      #printContent #cl #sender, 
      #printContent #cl #date {
        text-align: left !important;
        align-self: flex-end !important;
      }
      /* Force desktop styling */
      #printContent #cl * [class*="md:"] {
        display: inherit;
      }
      #printContent #cl .md\\:self-end {
        align-self: flex-end !important;
      }
      #printContent #cl .md\\:text-right {
        text-align: right !important;
      }
      #printContent #cl .hidden.sm\\:block {
        display: block !important;
      }
    }
    @media screen {
      body { display: none; }
    }
  `;

    // Temporarily replace the page content with just the element to print
    document.body.innerHTML = `
    <style>${printStyles}</style>
    <div id="printContent">${contentToPrint.outerHTML}</div>
  `;

    // Trigger the browser's native print dialog
    window.print();

    // Restore the original content after printing with a safer approach
    setTimeout(() => {
      // Create a temporary div to hold the restored content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = originalBody;

      // Replace the current body with the original content in a more controlled way
      document.body.innerHTML = originalBody;

      // Set up new handlers with safer approach that doesn't use async operations
      document.getElementById("print-button")?.addEventListener("click", printDocument);

      // For the PDF button, use a direct click handler
      const pdfButton = document.getElementById("download-pdf-button");
      if (pdfButton) {
        pdfButton.addEventListener("click", function (e) {
          e.preventDefault();
          // Use the synchronous version that doesn't rely on awaiting promises
          generatePDFDocument();
        });
      }

      // Use direct navigation for navigation buttons
      document.querySelector('button[data-action="back"]')?.addEventListener("click", function () {
        window.location.href = "/personalization";
      });

      document.querySelector('button[data-action="home"]')?.addEventListener("click", function () {
        window.location.href = "/";
      });
    }, 300);
  };

  // Generate PDF function with proper error handling and cancellation support
  const generatePDFDocument = (): void => {
    console.log("PDF generation initiated");

    // Check if the element exists immediately
    const element = document.getElementById("cl");
    if (!element) {
      console.error("Cannot find element with ID 'cl' to generate PDF");
      alert("Cannot find the cover letter content to generate PDF");
      return;
    }

    // Generate a filename based on recipient and sender
    const filename =
      "anschreiben_" +
      (letterProps.recipient.company ? letterProps.recipient.company.replace(/\s+/g, " ").trim() : "company") +
      "_" +
      (letterProps.sender.name ? letterProps.sender.name.replace(/\s+/g, " ").trim() : "sender") +
      ".pdf";

    console.log("Generating PDF with filename:", filename);

    // Use a non-async approach with generatePDF to avoid promise issues
    try {
      // This is now a synchronous call that initiates the PDF generation
      // without waiting for the promise to resolve
      generatePDF("cl", filename)
        .then(() => {
          console.log("PDF generation completed successfully");
        })
        .catch(primaryError => {
          console.error("Primary PDF generation failed:", primaryError);
          console.log("Attempting fallback PDF generation method");

          // Only try fallback if component is still mounted
          if (document.getElementById("cl")) {
            fallbackGeneratePDF("cl", filename).catch(fallbackError => {
              console.error("Fallback PDF generation failed:", fallbackError);
            });
          }
        });
    } catch (error) {
      console.error("Error initiating PDF generation:", error);
      alert("There was an error generating the PDF. Please try using the print button and save as PDF.");
    }
  };

  // Show a loading state or placeholder while client-side code is initializing
  if (!isClient) {
    return (
      <div className="flex h-full w-full max-w-[210mm] items-center justify-center sm:w-full">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-w-[210mm] p-4 sm:w-full sm:p-0">
      <ProgressStepper currentStep={4} />
      <div className="flex h-[20%] w-full flex-col items-center gap-4 px-0 pt-[4rem] sm:px-8 sm:pt-[6rem]">
        <h1 className="text-primary text-3xl font-bold lg:text-4xl xl:text-7xl">{t("title")}</h1>
        <p className="text-base leading-4.5 font-medium sm:text-base">{t("description")}</p>
      </div>
      <div className="document-container flex h-full min-h-[80%] w-full flex-col items-center justify-center self-center pt-4">
        <div className="document-wrapper relative p-0">
          <div className="floating-actions absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="default"
              type="button"
              onClick={printDocument}
              className="text-chart-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-md p-0 shadow-md"
              title={t("print")}
              disabled={isGenerating}
              id="print-button"
            >
              <Printer size={20} strokeWidth={1.5} style={{ width: "24px", height: "24px" }} />
            </Button>
            <Button
              variant="default"
              type="button"
              onClick={generatePDFDocument}
              className="text-chart-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-md p-0 shadow-md"
              title={t("downloadPDF")}
              disabled={isGenerating}
              id="download-pdf-button"
            >
              <Download size={30} strokeWidth={1.5} style={{ width: "24px", height: "24px" }} />
            </Button>
          </div>

          <DIN5008
            {...letterProps}
            onContentChange={handleContentChange}
            skipAddress={localStorage.getItem("skipAddress") === "true"}
          />

          <div className="flex h-auto w-full flex-col-reverse gap-4 py-4 lg:flex-row lg:justify-between lg:gap-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/personalization")}
              type="button"
              data-action="back"
              className="text-primary h-[42px] w-full cursor-pointer px-8 text-base shadow-none duration-200 lg:w-auto"
              disabled={isGenerating}
            >
              {t("back")}
            </Button>
            <Button
              variant="default"
              type="button"
              onClick={() => router.push("/")}
              data-action="home"
              className="text-chart-1 flex h-[42px] w-full cursor-pointer items-center justify-center px-8 text-base duration-200 lg:w-auto"
              disabled={isGenerating}
            >
              <Home size={30} style={{ width: "20px", height: "20px" }} className="mr-1" />
              {t("home")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
