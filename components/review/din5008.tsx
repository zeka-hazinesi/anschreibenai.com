import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import React, { useRef, useState, useEffect } from "react";
import { Recipient } from "@/types/coverletter";

interface Address {
  name: string;
  street: string;
  zip: string;
  city: string;
  email: string;
  phone: string;
}

interface DIN5008Props {
  sender: Address;
  recipient: Recipient;
  city_and_date: string;
  subject: string;
  body: string[]; // Each string represents a paragraph
  closing: string;
  senderSignature: string;
  skipAddress?: boolean;
  onContentChange?: (updatedContent: {
    sender: string;
    recipient: string;
    date: string;
    subject: string;
    content: string;
  }) => void;
}

const DIN5008: React.FC<DIN5008Props> = ({
  sender,
  recipient,
  city_and_date,
  subject,
  body,
  closing,
  senderSignature,
  skipAddress,
  onContentChange,
}) => {
  // Create refs with the correct type
  const senderRef = useRef<HTMLElement>(null as unknown as HTMLElement);
  const recipientRef = useRef<HTMLElement>(null as unknown as HTMLElement);
  const dateRef = useRef<HTMLElement>(null as unknown as HTMLElement);
  const subjectRef = useRef<HTMLElement>(null as unknown as HTMLElement);
  const contentRef = useRef<HTMLElement>(null as unknown as HTMLElement);

  // Initialize HTML content for each section
  const [senderHtml, setSenderHtml] = useState<string>(
    `<div class="leading-4.5">
      ${sender.name}<br />
      ${sender.street}<br />
      ${sender.zip} ${sender.city}<br />
      ${sender.email}<br />
      ${sender.phone}
    </div>`,
  );

  const [recipientHtml, setRecipientHtml] = useState<string>(
    `<div class="leading-4.5">
      ${recipient.company}<br />
      ${recipient.contactName}<br />
      ${recipient.street}<br />
      ${recipient.zip} ${recipient.city}
    </div>`,
  );

  const [dateHtml, setDateHtml] = useState<string>(`<div>${city_and_date}</div>`);

  const [subjectHtml, setSubjectHtml] = useState<string>(`<div class="text-xl font-bold">${subject}</div>`);

  // Prepare content HTML with all body paragraphs
  const bodyHtml = body.map(p => `<div class="leading-4.5">${p}</div><br />`).join("");

  const [contentHtml, setContentHtml] = useState<string>(
    `${bodyHtml}
     <div>${closing}</div>
     <img src=${senderSignature} alt="Signature" class="w-1/4 my-4" />
     <div>${sender.name}</div>`,
  );

  // Send changes back to parent component - but use a ref to track if content actually changed
  const prevContentRef = useRef({
    sender: senderHtml,
    recipient: recipientHtml,
    date: dateHtml,
    subject: subjectHtml,
    content: contentHtml,
  });

  useEffect(() => {
    if (onContentChange) {
      const currentContent = {
        sender: senderHtml,
        recipient: recipientHtml,
        date: dateHtml,
        subject: subjectHtml,
        content: contentHtml,
      };

      // Only call onContentChange if the content actually changed
      const prevContent = prevContentRef.current;
      if (
        prevContent.sender !== currentContent.sender ||
        prevContent.recipient !== currentContent.recipient ||
        prevContent.date !== currentContent.date ||
        prevContent.subject !== currentContent.subject ||
        prevContent.content !== currentContent.content
      ) {
        onContentChange(currentContent);
        prevContentRef.current = currentContent;
      }
    }
  }, [senderHtml, recipientHtml, dateHtml, subjectHtml, contentHtml, onContentChange]);

  // Handlers for content changes with proper typing
  const handleSenderChange = (evt: ContentEditableEvent) => {
    setSenderHtml(evt.target.value);
  };

  const handleRecipientChange = (evt: ContentEditableEvent) => {
    setRecipientHtml(evt.target.value);
  };

  const handleDateChange = (evt: ContentEditableEvent) => {
    setDateHtml(evt.target.value);
  };

  const handleSubjectChange = (evt: ContentEditableEvent) => {
    setSubjectHtml(evt.target.value);
  };

  const handleContentChange = (evt: ContentEditableEvent) => {
    setContentHtml(evt.target.value);
  };

  return (
    <div className="ring-primary relative rounded-md ring-1">
      <div
        id="cl"
        className="bg-chart-1 relative m-0 box-border flex h-auto w-full flex-col rounded-lg pt-4 pr-4 pb-4 pl-4 [page-break-after:always] md:h-[296mm] md:w-[210mm] md:pt-[20mm] md:pr-[20mm] md:pb-[20mm] md:pl-[25mm]"
      >
        {!skipAddress && (
          <>
            <ContentEditable
              id="sender"
              innerRef={senderRef}
              html={senderHtml}
              disabled={false}
              onChange={handleSenderChange}
              className="hover:ring-primary text-chart-2 focus-visible:ring-primary ring-offset-chart-1 h-auto w-auto self-start rounded-xs hover:ring hover:ring-offset-4 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none md:self-end"
              tagName="div"
            />
            <br />
            <br className="hidden sm:block" />
            <ContentEditable
              innerRef={recipientRef}
              html={recipientHtml}
              disabled={false}
              onChange={handleRecipientChange}
              className="hover:ring-primary text-chart-2 focus-visible:ring-primary ring-offset-chart-1 h-auto w-auto self-start rounded-xs hover:ring hover:ring-offset-4 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
              tagName="div"
            />
            <br />
            <br className="hidden sm:block" />
            <ContentEditable
              id="date"
              innerRef={dateRef}
              html={dateHtml}
              disabled={false}
              onChange={handleDateChange}
              className="hover:ring-primary text-chart-2 focus-visible:ring-primary ring-offset-chart-1 h-auto w-auto self-start rounded-xs hover:ring hover:ring-offset-4 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none md:self-end"
              tagName="div"
            />
          </>
        )}
        <br />
        <br className="hidden sm:block" />
        <ContentEditable
          innerRef={subjectRef}
          html={subjectHtml}
          disabled={false}
          onChange={handleSubjectChange}
          className="hover:ring-primary text-chart-2 focus-visible:ring-primary ring-offset-chart-1 h-auto w-auto self-start rounded-xs hover:ring hover:ring-offset-4 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
          tagName="div"
        />
        <br />
        <br className="hidden sm:block" />
        <ContentEditable
          innerRef={contentRef}
          html={contentHtml}
          disabled={false}
          onChange={handleContentChange}
          className="hover:ring-primary text-chart-2 focus-visible:ring-primary ring-offset-chart-1 h-auto w-auto self-start rounded-xs hover:ring hover:ring-offset-4 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
          tagName="div"
        />
      </div>
    </div>
  );
};

export default DIN5008;
