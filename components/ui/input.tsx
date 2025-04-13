import React, { ChangeEvent } from "react";
import "./styles.css";

interface InputProps {
  type?: string;
  label: string;
  value: string;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ type = "text", label, value, autoComplete, onChange, ...props }) => {
  return (
    <div className="input-container h-auto w-full">
      <input
        className="rounded-md"
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        onBlur={() => {}}
        {...props}
      />
      <label className={value ? "filled" : ""} htmlFor={label}>
        {label}
      </label>
    </div>
  );
};

export default Input;
