"use client";
import "../page.css";
import "./style.css";
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
    <div className='auth-flow'>
      <div className='inner-card'>
        <div className='auth-left'></div>
        <div className='auth-right'>
          <div className='rs-inner'>
            <Logo />
            <h1>Forgot Password?</h1>
            <div>
              {!successfulCreation && (
                <>
                  <label htmlFor='email' className='reset-txt'>
                    Please provide your email address
                  </label>
                  <BetterInput
                    type='email'
                    name='email'
                    placeholder='e.g john@doe.com'
                    onchange={setEmail}
                    classList=''
                    value={email}
                  />
                  {error && <p className='error-txt'>{error}</p>}

                  <div className='btn-container'>
                    <button
                      ref={createButtonRef}
                      className={`auth-flow-btn ${loading ? "loading" : ""}`}
                      onClick={create}
                    >
                      {loading ? <Loader2 /> : "Send Code"}
                    </button>
                  </div>
                </>
              )}

              {successfulCreation && (
                <>
                  <label htmlFor='password'>Enter your new password</label>
                  <BetterInput
                    name='password'
                    type='password'
                    classList=''
                    value={password}
                    onchange={setPassword}
                    placeholder='New Password'
                  />

                  <label htmlFor='password' className='reset-txt'>
                    Enter the code we sent a code to <span>{email}</span>{" "}
                  </label>
                  <div className='input-fields-container'>
                    {otpInputs.map((data, i) => (
                      <input
                        key={i}
                        type='text'
                        ref={i === 0 ? firstInputRef : undefined} // Fixed: Using undefined instead of null
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className='otp-input'
                        value={data}
                        maxLength={1}
                        onChange={(e) => handleChange(e, i)}
                      />
                    ))}
                  </div>
                  {error && <p className='error-txt'>{error}</p>}

                  <div className='btn-container'>
                    <button
                      ref={resetButtonRef}
                      className={`auth-flow-btn ${loading ? "loading" : ""}`}
                      onClick={reset}
                    >
                      {loading ? <Loader2 /> : "Reset"}
                    </button>
                  </div>
                </>
              )}

              {secondFactor && (
                <p>2FA is required, but this UI does not handle that</p>
              )}
            </div>
            <div id='clerk-captcha' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
