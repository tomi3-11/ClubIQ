"use client";
import Link from "next/link";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { GoogleSvg } from "@/assets/icons";
import {
  customToast,
  validatePassword,
  generateUsername,
} from "@/utils/utilities";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BetterInput from "@/components/reusables/BetterInput/BetterInput";
import Logo from "@/components/reusables/Logo";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { isSignedIn } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (password.trim().length === 0) return;
    const message = validatePassword(password);
    if (message !== true) {
      setError(message);
    } else {
      setError("");
    }
  }, [password]);

  // if (isSignedIn) {
  //   router.replace("/");
  //   return;
  // }

  const handleOAuthSignUp = async (
    strategy: "oauth_google" | "oauth_facebook" | "oauth_apple"
  ) => {
    setLoading(true);
    customToast("Creating Account", "creating");
    const url = window.location.origin;
    const redirectUrl = `${url}/auth/sign-up/continue`;
    const redirectUrlComplete = `${url}/auth/sso`;
    try {
      await signIn?.authenticateWithRedirect({
        strategy, // Dynamically set the OAuth strategy
        redirectUrl: redirectUrl, // Where to redirect after sign-in
        redirectUrlComplete: redirectUrlComplete, // Final destination after authentication
      });
    } catch (error) {
      customToast("Failed, Try Again", "fail");
      console.error(
        `Error during ${strategy.replace("oauth_", "")} Sign-In:`,
        error
      );
      setLoading(false);
    }
  };

  const handleSignUp = async (
    trimmedUsername: string,
    trimmedEmail: string,
    trimmedPass: string
  ) => {
    try {
      await signUp?.create({
        username: trimmedUsername,
        emailAddress: trimmedEmail,
        password: trimmedPass,
      });

      // Prepare  number verification
      await signUp?.prepareEmailAddressVerification();

      router.push("/auth/sign-up/verify-email");

      console.log("Sign-up successful! Please verify your email address.");
    } catch (error) {
      customToast("Failed, Try Again", "fail");
      console.error("Sign-up error:", error);
      setError((error as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = generateUsername();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    setError("");

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!trimmedPass) {
      setError("Password is required");
      return;
    }

    const passValidationResult = validatePassword(trimmedPass);

    if (passValidationResult !== true) {
      setError(passValidationResult);
      customToast("Failed, Try Again", "fail");
      return;
    }

    setError("");
    customToast("Creating Account", "creating");

    handleSignUp(trimmedUsername, trimmedEmail, trimmedPass);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--text-primary)]'>
      <div className='bg-[var(--bg-primary)] shadow-lg rounded-2xl w-full max-w-md p-8 sm:p-10 space-y-6'>
        <div className='flex flex-col items-center space-y-2'>
          <h1 className='text-2xl font-semibold'>Create an Account</h1>
          <p className='text-sm text-[var(--text-secondary)]'>
            Already have an account?{" "}
            <Link
              href='/auth/sign-in'
              className='text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium transition-colors'
            >
              Login
            </Link>
          </p>
        </div>

        {/* Social Signup */}
        <div className='flex flex-col gap-3'>
          <button
            disabled={loading}
            onClick={() => handleOAuthSignUp("oauth_google")}
            className='w-full flex items-center justify-center gap-3 border border-[var(--border)] py-2.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all'
          >
            {loading ? (
              <Loader2 className='animate-spin w-5 h-5 text-white' />
            ) : (
              <GoogleSvg />
            )}
            <span className='font-medium'>Continue with Google</span>
          </button>
        </div>

        {/* Separator */}
        <div className='flex items-center gap-3'>
          <span className='h-px bg-[var(--border)] flex-1'></span>
          <span className='text-xs text-[var(--text-secondary)] uppercase'>
            or
          </span>
          <span className='h-px bg-[var(--border)] flex-1'></span>
        </div>

        {/* Form */}
        <div className='space-y-4'>
          {error && (
            <p className='text-[var(--danger)] text-sm text-center'>{error}</p>
          )}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <BetterInput
              name='email'
              placeholder='Email address'
              value={email}
              onchange={setEmail}
              type='email'
            />
            <BetterInput
              name='password'
              placeholder='Password'
              value={password}
              onchange={setPassword}
              type='password'
            />
            <div>
              <button
                type='submit'
                className='w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all'
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>

        {/* Captcha */}
        <div id='clerk-captcha' className='pt-2' />
      </div>
    </div>
  );
}
