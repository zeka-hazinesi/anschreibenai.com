// File: src/types.ts

export interface Recipient {
  company: string;
  contactName: string;
  street: string;
  zip: string;
  city: string;
}

export interface RecipientData {
  company: string;
  contactName: string;
  street: string;
  zip: string;
  city: string;
}

export interface SenderData {
  name: string;
  street: string;
  zip: string;
  city: string;
  email: string;
  phone: string;
}

export interface CoverLetter {
  recipient: Recipient;
  subject: string;
  body: string[];
  closing: string;
}

export interface GenerateTextResponse {
  coverLetter: CoverLetter;
}

export interface DraftData {
  recipient: RecipientData;
  subject: string;
  body: string[];
  closing: string;
}

export interface LetterProps {
  sender: SenderData;
  recipient: RecipientData;
  city_and_date: string;
  subject: string;
  body: string[];
  closing: string;
  senderSignature: string;
}

export interface AddressData {
  name: string;
  surname: string;
  street: string;
  buildingNumber: string;
  zipCode: string;
  city: string;
  email: string;
  phone: string;
}
