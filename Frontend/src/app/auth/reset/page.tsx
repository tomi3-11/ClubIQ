"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Logo from "@/components/reusables/Logo";
import BetterInput from "@/components/reusables/BetterInput/BetterInput";

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const firstInputRef = useRef<HTMLInputElement>(null);
  const [loading, setIsLoading] = useState(false);
  const [otpInputs, setOtpInputs] = useState(new Array(6).fill(""));

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  const createButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // If the user is already signed in,
    // redirect them to the home page
    if (isSignedIn) {
      //router.push("/me");
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setCode(otpInputs.join(""));
  }, [otpInputs]);

  useEffect(() => {
    if (code.length === 6) {
      reset();
    }
  }, [code]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !successfulCreation) {
        if (createButtonRef.current) {
          createButtonRef?.current.click();
        }
      } else if (e.key === "Enter" && successfulCreation) {
        if (resetButtonRef.current) {
          resetButtonRef.current.click();
        }
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [successfulCreation]);

  if (!isLoaded) {
    return null;
  }

  // Send the password reset code to the user's email
  async function create() {
    setIsLoading(true);
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
        setIsLoading(false);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset() {
    setIsLoading(true);
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: password.trim(),
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          setError("");
        } else {
          console.log(result);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
        setIsLoading(false);
      });
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = e.target.value;

    if (isNaN(Number(newValue))) return;

    // Check if this is a backspace event (this is more reliable than checking inputType)
    if (newValue === "") return;

    setOtpInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs[index] = newValue;
      return updatedInputs;
    });

    if (newValue && e.target.nextSibling) {
      const nextInput = e.target.nextSibling as HTMLInputElement;

      setTimeout(() => {
        nextInput.focus();
        nextInput.select();
      }, 10);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Fixed: Proper event type
    if (e.key === "Backspace") {
      setOtpInputs((prevInputs) => {
        const updatedInputs = [...prevInputs];
        updatedInputs[index] = "";
        return updatedInputs;
      });

      if (e.currentTarget.previousSibling) {
        // Fixed: Using currentTarget
        const prevInput = e.currentTarget.previousSibling as HTMLInputElement;

        setTimeout(() => {
          prevInput.focus();
          prevInput.select();
        }, 10);
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--text-primary)]'>
      <div className='bg-[var(--bg-primary)] shadow-lg rounded-2xl w-full max-w-md p-8 sm:p-10 space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-semibold'>Forgot Password?</h1>
        </div>

        {/* Stage 1: Request Reset Code */}
        {!successfulCreation && (
          <div className='space-y-5'>
            <label
              htmlFor='email'
              className='text-sm text-[var(--text-secondary)]'
            >
              Please provide your email address
            </label>
            <BetterInput
              type='email'
              name='email'
              placeholder='e.g john@doe.com'
              onchange={setEmail}
              value={email}
            />

            {error && (
              <p className='text-[var(--danger)] text-sm text-center'>
                {error}
              </p>
            )}

            <div className='pt-2'>
              <button
                ref={createButtonRef}
                onClick={create}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium shadow-md transition-all ${
                  loading
                    ? "bg-[var(--border)] text-[var(--text-secondary)] cursor-not-allowed"
                    : "bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <Loader2 className='animate-spin w-5 h-5' />
                ) : (
                  "Send Code"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Enter Code + New Password */}
        {successfulCreation && (
          <div className='space-y-5 animate-fade-in'>
            <label
              htmlFor='password'
              className='text-sm text-[var(--text-secondary)]'
            >
              Enter your new password
            </label>
            <BetterInput
              name='password'
              type='password'
              value={password}
              onchange={setPassword}
              placeholder='New Password'
            />

            <label
              htmlFor='otp'
              className='text-sm text-[var(--text-secondary)]'
            >
              Enter the code we sent to{" "}
              <span className='font-medium text-[var(--primary)]'>{email}</span>
            </label>

            {/* OTP Inputs */}
            <div className='flex justify-center gap-3'>
              {otpInputs.map((data, i) => (
                <input
                  key={i}
                  type='text'
                  ref={i === 0 ? firstInputRef : undefined}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onChange={(e) => handleChange(e, i)}
                  value={data}
                  maxLength={1}
                  className='w-12 h-12 text-center text-lg font-medium border border-[var(--border)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--bg-tertiary)] transition-all'
                />
              ))}
            </div>

            {error && (
              <p className='text-[var(--danger)] text-sm text-center'>
                {error}
              </p>
            )}

            <div className='pt-2'>
              <button
                ref={resetButtonRef}
                onClick={reset}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium shadow-md transition-all ${
                  loading
                    ? "bg-[var(--border)] text-[var(--text-secondary)] cursor-not-allowed"
                    : "bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <Loader2 className='animate-spin w-5 h-5' />
                ) : (
                  "Reset"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Stage 3: 2FA (unhandled notice) */}
        {secondFactor && (
          <p className='text-center text-[var(--accent)] text-sm'>
            2FA is required, but this UI does not handle that
          </p>
        )}

        <div id='clerk-captcha' className='pt-2' />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
