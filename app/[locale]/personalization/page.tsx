"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Signature, { SignatureCanvasRef } from "@uiw/react-signature/canvas";
import ProgressStepper from "@/components/progressStepper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useEffect } from "react";
import TextArea from "@/components/ui/textArea";
import { Button } from "@/components/ui/button";
import { generateText } from "@/lib/apiClient";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { z } from "zod";

const formSchema = z.object({
  personal: z.string().min(0, {
    message: "nameError",
  }),
});

export default function Personal() {
  const [loading, setLoading] = useState(false);
  const [isCanvasFilled, setIsCanvasFilled] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(793.69);
  const [savedSignatureData, setSavedSignatureData] = useState<string | null>(null);
  const signatureContainerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("personal");
  const router = useRouter();

  // Use the proper type for the signature ref
  const signatureRef = useRef<SignatureCanvasRef>(null);

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personal: "",
    },
  });

  // Function to update canvas width based on container width
  const updateCanvasWidth = () => {
    if (signatureContainerRef.current) {
      const containerWidth = signatureContainerRef.current.clientWidth;
      setCanvasWidth(containerWidth);
    }
  };

  // Function to check if canvas is filled
  const checkIfCanvasFilled = () => {
    if (signatureRef.current && signatureRef.current.canvas) {
      const canvas = signatureRef.current.canvas;
      const context = canvas.getContext("2d");

      if (context) {
        // Get image data from the entire canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

        // Check if there are any non-transparent pixels
        for (let i = 3; i < imageData.length; i += 4) {
          if (imageData[i] > 0) {
            setIsCanvasFilled(true);
            return;
          }
        }
        setIsCanvasFilled(false);
      }
    }
  };

  // Load the personal localStorage value and handle responsive canvas sizing
  useEffect(() => {
    const savedPersonal = localStorage.getItem("personal");
    if (savedPersonal) {
      form.setValue("personal", savedPersonal);
    }

    // Check for previously saved signature in localStorage
    const savedSignature = localStorage.getItem("signature");
    if (savedSignature) {
      setSavedSignatureData(savedSignature);
      setIsCanvasFilled(true);
    }

    // Initial canvas width update
    updateCanvasWidth();

    // Add window resize event listener
    window.addEventListener("resize", updateCanvasWidth);

    // Store a reference to the current canvas for cleanup
    const currentCanvas = signatureRef.current?.canvas;

    // Set up event listeners for mouse/touch events on the canvas
    const setupCanvasListeners = () => {
      if (currentCanvas) {
        // Use pointer events which work for both mouse and touch
        currentCanvas.addEventListener("pointerup", checkIfCanvasFilled);
        currentCanvas.addEventListener("pointerout", checkIfCanvasFilled);
      }
    };

    // Small delay to ensure the canvas is mounted
    const timer = setTimeout(() => {
      setupCanvasListeners();
      updateCanvasWidth(); // Update width again after canvas is mounted
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateCanvasWidth);
      // Clean up listeners using the stored reference
      if (currentCanvas) {
        currentCanvas.removeEventListener("pointerup", checkIfCanvasFilled);
        currentCanvas.removeEventListener("pointerout", checkIfCanvasFilled);
      }
    };
  }, [form]);

  const saveSignature = () => {
    if (signatureRef.current && signatureRef.current.canvas) {
      const signature = signatureRef.current.canvas.toDataURL();
      console.log("Signature saved:", signature);
      localStorage.setItem("signature", signature);
      setSavedSignatureData(signature);
      checkIfCanvasFilled(); // Check after saving
    }
  };

  const handleButtonClick = async () => {
    setLoading(true);
    console.log("Button clicked");
    // Save signature to localStorage
    saveSignature();

    const link = sessionStorage.getItem("link");
    if (!link) {
      console.error("No link found in sessionStorage");
      setLoading(false);
      return;
    }
    try {
      const textData = await generateText(link);
      localStorage.setItem("draft", JSON.stringify(textData.coverLetter));

      router.push("/review");
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const personalValue = values.personal;
    localStorage.setItem("personal", personalValue);
    handleButtonClick(); // Trigger the button click logic which now includes saving the signature
  }

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
    setIsCanvasFilled(false);
    setSavedSignatureData(null);
    localStorage.removeItem("signature");
  };

  return (
    <div className="h-full w-full max-w-[210mm] p-4 sm:w-full sm:p-0">
      <ProgressStepper currentStep={3} />
      <div className="flex h-[20%] w-full flex-col items-center gap-4 px-0 pt-[4rem] sm:px-8 sm:pt-[6rem]">
        <h1 className="text-primary text-3xl font-bold lg:text-4xl xl:text-6xl">{t("title")}</h1>
        <p className="text-base leading-4.5 font-medium sm:text-base">{t("description")}</p>
      </div>
      <div className="flex h-full min-h-[80%] w-full flex-col items-center justify-center self-center pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-0">
            <FormField
              control={form.control}
              name="personal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel></FormLabel>
                  <FormControl>
                    <TextArea
                      label="personal"
                      focusedText={t("textareaLabel")}
                      blurredText={t("textareaBlurred")}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex w-full flex-col items-center space-y-4">
              <p className="text-base leading-4.5 font-medium sm:text-base">{t("signatureDescription")}</p>
              <div className="relative w-full" ref={signatureContainerRef}>
                {savedSignatureData ? (
                  // Render the saved signature image
                  <div className="relative w-full">
                    <div
                      className="border-border focus-within:border-primary flex w-full items-center justify-center rounded-md border"
                      style={{ width: `${canvasWidth}px`, height: "200px" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={savedSignatureData}
                        alt="Your signature"
                        style={{ maxWidth: `${canvasWidth}px`, maxHeight: "200px", width: "auto", height: "auto" }}
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button
                        type="button"
                        onClick={clearSignature}
                        className="hover:border-primary h-[42px] cursor-pointer border border-transparent bg-transparent px-2 py-2 shadow-none duration-200 hover:bg-white"
                      >
                        <Image src="/icons/trash-full.svg" alt="trash" width={36} height={36} className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Render the signature canvas
                  <Signature
                    width={canvasWidth}
                    height={200}
                    options={{
                      size: 5,
                      smoothing: 0.8,
                      thinning: 0.7,
                      streamline: 0.6,
                      easing: t => t,
                      simulatePressure: true,
                      last: true,
                      start: {
                        cap: true,
                        taper: 0,
                        easing: t => t,
                      },
                      end: {
                        cap: true,
                        taper: 0,
                        easing: t => t,
                      },
                    }}
                    ref={signatureRef}
                    style={{
                      backgroundColor: "transparent",
                      cursor:
                        'url("https://icons.iconarchive.com/icons/designcontest/vintage/32/Patent-Pen-icon.png") 0 30, auto',
                    }}
                    className="border-border focus-within:border-primary w-full rounded-md border bg-transparent stroke-red-300"
                  />
                )}

                {!savedSignatureData && (
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={clearSignature}
                    className="absolute top-2 right-2 h-[42px] cursor-pointer self-end px-2 py-2 duration-200"
                  >
                    <Image
                      src={isCanvasFilled ? "/icons/trash-full.svg" : "/icons/trash-empty.svg"}
                      alt="trash full"
                      width={36}
                      height={36}
                      className="h-6 w-6"
                    />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex h-auto w-full flex-col-reverse justify-between gap-4 pt-4 sm:flex-row lg:gap-8">
              <Button
                variant="ghost"
                onClick={() => router.push("/address")}
                type="button"
                className="text-primary h-[42px] w-full cursor-pointer px-8 text-base shadow-none duration-200 sm:w-auto"
              >
                {t("back")}
              </Button>

              <Button
                variant="default"
                type="submit"
                className="text-chart-1 flex h-[42px] w-full cursor-pointer items-center justify-center px-8 text-base duration-200 sm:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <p>{t("loading")}</p>
                  </>
                ) : (
                  t("generate")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
