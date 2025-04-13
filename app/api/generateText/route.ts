import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import * as cheerio from "cheerio";
import { z } from "zod";

function getOutputLanguage(language: string) {
  switch (language) {
    case "de":
      return "German";
    case "en":
      return "English";
    case "es":
      return "Spanish";
    case "fr":
      return "French";
    case "it":
      return "Italian";
    case "pt":
      return "Portuguese";
    case "zh":
      return "Chinese";
    default:
      return "German";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { link, personal, language } = await req.json();

    const isPersonalEmpty = !personal || personal.trim() === "";

    if (!link) {
      return NextResponse.json({ error: "Missing required fields: link, address, or personal" }, { status: 400 });
    }

    let linkContent = "";
    try {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error(`Failed to fetch link content: ${response.statusText}`);
      }
      const html = await response.text();

      // Load HTML into Cheerio and extract visible text
      const $ = cheerio.load(html);
      linkContent = $("body").text(); // Extract visible text from the body
      linkContent = linkContent.replace(/\s+/g, " ").trim(); // Normalize spaces
    } catch (error) {
      console.error("Error fetching link content:", error);
      return NextResponse.json({ error: "Failed to fetch content from the provided link" }, { status: 500 });
    }

    const personalInput = isPersonalEmpty
      ? ""
      : `MY PERSONAL INFO:
    ${personal}`;

    const prompt = `
    # TASK: PROFESSIONAL COVER LETTER GENERATION

    ## INSTRUCTIONS:
    Create a tailored, professional cover letter based on the information provided below. Follow all formatting requirements exactly.

    ## INPUT DATA:
    JOB DESCRIPTION/COMPANY INFO:
    ${linkContent}

    ${personalInput}

    ## CONTACT EXTRACTION (PRIORITY):
    - CAREFULLY search for contact person information in the job description
    - Look in sections labeled "Contact," "Contact Person," "Kontakt," "Kontaktperson," or similar
    - Extract full name including first name AND last name (e.g., "John Smith", "Maria González")
    - If multiple contacts exist, choose the most relevant one (recruiter, hiring manager, department head)
    - If no specific contact name is found, use generic greeting

    ## OUTPUT REQUIREMENTS:
    1. Format: Return ONLY a valid JSON object with the structure specified below
    2. Style: Formal yet personable tone, directly referencing specific job requirements
    3. Language: ${getOutputLanguage(language)}
    4. Length: Maximum 150 words total

    ## CONTENT GUIDELINES:
    - Highlight how my qualifications match the specific job requirements
    - Include concrete examples from my experience that align with key responsibilities
    - Demonstrate knowledge of the company
    - Avoid generic language or placeholder text
    - Make the letter ready to send without further editing

    ## GREETING GUIDELINES:
    - If a specific contact person is found, the greeting MUST address them directly (e.g., "Dear Mr. Smith," or "Dear Ms. Johnson,")
    - If no specific contact is found, use an appropriate generic greeting
    - Use the appropriate salutation based on the target language (e.g., "Sehr geehrter Herr [Last Name]," in German)

    ## CLOSING GUIDELINES:
    - Include a professional closing statement (e.g., "Sincerely," or "Best regards,")

    ## IMPORTANT:
    - Include ONLY the JSON output - no explanations or other text
    - Each body paragraph should be a separate string in the array
    - Fill in all fields with appropriate content based on available information
    - If certain recipient details are not available, use appropriate defaults or leave as empty strings`;

    const coverLetterSchema = z.object({
      recipient: z.object({
        company: z.string(),
        contactName: z.string(),
        street: z.string(),
        zip: z.string(),
        city: z.string(),
      }),
      subject: z.string(),
      body: z.array(z.string()),
      closing: z.string(),
    });

    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: coverLetterSchema,
      prompt: prompt,
    });

    return NextResponse.json({ coverLetter: object });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 });
  }
}
