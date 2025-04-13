import { jsPDF } from "jspdf";

/**
 * Generates a PDF document from the cover letter HTML element
 * @param elementId - The ID of the HTML element to convert to PDF
 * @param recipient - Recipient data for the filename
 * @param sender - Sender data for the filename
 * @returns Promise resolving when PDF is generated and saved
 */
export async function generatePDF(elementId: string, filename: string): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const element = document.getElementById(elementId) as HTMLElement;
  if (!element) {
    throw new Error(`Element with ID ${elementId} not found`);
  }

  const clonedElement = element.cloneNode(true) as HTMLElement;

  clonedElement.className =
    "flex flex-col pl-[25mm] pt-[20mm] pb-[20mm] pr-[20mm] m-0 overflow-hidden relative box-border [page-break-after:always] w-[210mm] h-[296mm]";

  const senderElement = clonedElement.querySelector("#sender") as HTMLElement;
  if (senderElement) {
    senderElement.className = "self-end focus-visible:outline-none w-auto h-auto";
  }

  const dateElement = clonedElement.querySelector("#date") as HTMLElement;
  if (dateElement) {
    dateElement.className = "self-end focus-visible:outline-none w-auto h-auto";
  }

  await doc.html(clonedElement, {
    width: 170,
    windowWidth: 650,
    x: 0,
    y: 0,
    callback: doc => {
      doc.save(filename);
    },
  });
}
