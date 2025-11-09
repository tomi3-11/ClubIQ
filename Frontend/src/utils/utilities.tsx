"use client";
import { toast } from "sonner";
import Chance from "chance";

const chance = new Chance();

export const validateEmail = (email: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isVaildEmail = emailPattern.test(email);

  return isVaildEmail;
};

export const validatePassword = (password: string): true | string => {
  // Check if password has at least 8 characters
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  // Check if password contains at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return "Password must contain at least one letter.";
  }

  // Check if password contains at least one number
  if (!/\d/.test(password)) {
    return "Password must contain at least one number.";
  }

  // Check if password contains at least one special character
  if (!/[!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|`~]/.test(password)) {
    return "Password must contain at least one special character.";
  }

  // If all conditions are satisfied, return true
  return true;
};

export const customToast = (message: string, name: string, duration = 2000) => {
  return toast.custom(
    (t) => (
      <div className={`rt-toast ${name} text-sm`}>
        <span>{message}</span>
      </div>
    ),
    { position: "bottom-center", duration }
  );
};

export const generateUsername = () => {
  return `${chance.word({ length: 5 })}${chance.word({
    length: 5,
  })}${chance.integer({ min: 1000, max: 9999 })}`;
};

export const generateEmptyArray = (length: number) => {
  return new Array(length).fill(null);
};

export const filterArrayByKey = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  value: any
): T[] => {
  return array.filter((item) => item[key] === value);
};

export function sanitizeYear(value: string | null): number | null {
  const currentYear = new Date().getFullYear();

  if (!value) return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  if (!Number.isInteger(num)) return null;
  if (num < 1800 || num > currentYear + 5) return null; // Adjust limits as you see fit
  return num;
}
