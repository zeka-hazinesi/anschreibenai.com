"use client";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { ArrowRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { useState } from "react";
import Image from "next/image";

export default function FromToSection() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const t = useTranslations("link");

  // Function to handle opening the specific modal
  const handleOpenModal = (modalId: string) => {
    setOpenModal(modalId);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(null);
  };

  return (
    <section className="flex h-auto w-full flex-col items-center justify-center space-y-16 p-4 pb-16 sm:p-16 lg:pb-32">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-primary text-xl font-bold lg:text-2xl xl:text-4xl">{t("fromToSectionTitle")}</h2>
      </div>
      <div className="flex h-auto w-full flex-col items-center justify-center gap-8 sm:flex-row">
        <div>
          {" "}
          <div className="bg-primary h-auto w-full rounded-t-lg px-4 py-2">
            <h3 className="font-bold text-white">{t("beforeText")}</h3>
          </div>
          <div
            className="relative aspect-[1/1.414] h-[60vh] w-auto cursor-zoom-in rounded-lg shadow-lg lg:h-[80vh]"
            onClick={() => handleOpenModal("stellenanzeige")}
          >
            <Image src="/stellenanzeige.png" alt="Before portrait" className="rounded-b-lg object-cover" fill />
          </div>
        </div>

        <div className="">
          <ArrowRight className="text-primary h-auto w-12 rotate-90 sm:rotate-0" />
        </div>

        <div>
          {" "}
          <div className="bg-primary flex h-auto w-full rounded-t-lg px-4 py-2">
            <h3 className="font-bold text-white">{t("afterText")}</h3>
          </div>
          <div
            className="relative aspect-[1/1.414] h-[60vh] w-auto cursor-zoom-in rounded-lg rounded-b-lg shadow-lg lg:h-[80vh]"
            onClick={() => handleOpenModal("motivationsschreiben")}
          >
            <Image src="/motivationsschreiben.png" alt="After portrait" className="rounded-b-lg object-cover" fill />
          </div>
        </div>
      </div>

      <Dialog open={openModal === "stellenanzeige"} onOpenChange={handleCloseModal}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <DialogContent className="fixed top-1/2 left-1/2 z-50 max-h-screen w-full -translate-x-1/2 -translate-y-1/2 border-none bg-transparent p-0 shadow-none sm:max-w-[100dvw]">
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <div className="relative flex h-screen max-h-screen w-full items-center justify-center">
              <Button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 h-9 w-9 cursor-pointer rounded-full"
              >
                <X size={30} style={{ width: "24px", height: "24px" }} />
              </Button>
              <div className="relative aspect-[1/1.414] h-[60vh] w-auto max-w-full lg:h-[100vh]">
                <Image src="/stellenanzeige.png" alt="Stellenanzeige" className="object-contain" fill priority />
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <Dialog open={openModal === "motivationsschreiben"} onOpenChange={handleCloseModal}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <DialogContent className="fixed top-1/2 left-1/2 z-50 max-h-screen w-full -translate-x-1/2 -translate-y-1/2 border-none bg-transparent p-0 shadow-none sm:max-w-[100dvw]">
            <div className="relative flex h-screen max-h-screen w-full items-center justify-center">
              <Button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 h-9 w-9 cursor-pointer rounded-full"
              >
                <X size={30} style={{ width: "24px", height: "24px" }} />
              </Button>
              <div className="relative aspect-[1/1.414] h-[60vh] w-auto max-w-full lg:h-[100vh]">
                <Image
                  src="/motivationsschreiben.png"
                  alt="Motivationsschreiben"
                  className="object-contain"
                  fill
                  priority
                />
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </section>
  );
}
