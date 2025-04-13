// apiClient.ts
import { CoverLetter } from "@/types/coverletter";

interface TextGenerationResponse {
  coverLetter: CoverLetter;
  // Add any other fields that might be returned by the API
}

/**
 * Generates text for a cover letter using job link, address, and personal info
 * @param link - The job posting URL
 * @returns Promise with the generated text response
 */
export const generateText = async (link: string): Promise<TextGenerationResponse> => {
  try {
    // 1. Read the personal from the localStorage
    const personal = localStorage.getItem("personal") || "";
    const language = localStorage.getItem("outputLanguage") || "de";

    // 2. Make API call to generate text
    const result = await fetch("/api/generateText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link,
        personal,
        language,
      }),
    });

    if (!result.ok) {
      throw new Error("Failed to generate text");
    }

    return await result.json();
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
};
