import "./style.css";
import { IsNotVisibleSvg, IsVisibleSvg } from "@/assets/icons";
import React, { useState } from "react";

interface BetterInputProps {
  name: string;
  id?: string;
  placeholder: string;
  value: string;
  onchange: (value: string) => void;
  classList?: string;
  type: string;
  readonly?: boolean | null;
  countryCode?: string | null;
}

export default function BetterInput({
  name,
  id,
  placeholder,
  value,
  onchange,
  classList = "",
  type,
  readonly,
  countryCode = null,
}: BetterInputProps) {
  const [passVisible, setPassVisible] = useState(false);
  return (
    <div className={`input-container ${countryCode ? "extra" : ""}`}>
      {type === "" && (
        <div className='country-code-container'>{countryCode}</div>
      )}
      <input
        type={type === "password" ? (passVisible ? "text" : "password") : type}
        name={name}
        id={id ? id : ""}
        placeholder={placeholder ? placeholder : ""}
        className={`typical-tnp-input ${classList}`}
        onChange={(e) => onchange(e.target.value)}
        value={value}
        required
        readOnly={readonly ? readonly : false}
      />
      {type === "password" && (
        <div
          className='svg-container'
          onClick={() => setPassVisible(!passVisible)}
        >
          {passVisible ? <IsVisibleSvg /> : <IsNotVisibleSvg />}
        </div>
      )}
    </div>
  );
}
