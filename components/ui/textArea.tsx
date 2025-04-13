// TextArea.tsx
import React, { ChangeEvent, useRef, useEffect, useState } from "react";
import "./styles.css";

interface TextFieldProps {
  label: string;
  focusedText: string; // Text to display when focused
  blurredText: string; // Text to display when not focused
  value: string; // Controlled value from react-hook-form
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void; // Controlled onChange from react-hook-form
}

const TextArea: React.FC<TextFieldProps> = ({ label, focusedText, blurredText, value, onChange }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set it based on scroll height
    }
  }, [value]);

  // Handle focus event
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle blur event
  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="input-container">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange} // Use the onChange from react-hook-form
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="border-border focus:border-primary h-auto max-h-[1123px] min-h-[20rem] w-full resize-none overflow-hidden rounded-md border bg-transparent pt-7 pr-4 pb-1 pl-4 text-base leading-[1.3] transition-all duration-200 outline-none"
      />
      <label className={value || isFocused ? "filled multiline" : "multiline"} htmlFor={label}>
        {isFocused || value ? focusedText : blurredText}
      </label>
    </div>
  );
};

export default TextArea;
