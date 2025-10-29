"use client";
import { GoogleSvg } from "@/assets/icons";
import Logo from "@/components/reusables/Logo";
import BetterInput from "@/components/reusables/BetterInput/BetterInput";
import { customToast, validatePassword } from "@/utils/utilities";
import { useSignIn, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { signIn } = useSignIn();
  const { isSignedIn } = useUser();
  const [username, setUsername] = useState("");
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

  const handleOAuthSignIn = async (
    strategy: "oauth_google" | "oauth_facebook" | "oauth_apple"
  ) => {
    setLoading(true);
    customToast("Signing In", "creating");
    const url = window.location.origin;
    const redirectUrl = `${url}/auth/sign-up/continue`;
    const redirectUrlComplete = `${url}/sso`;
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

  const handleRegularSignIn = async (
    trimmedUsername: string,
    trimmedPass: string
  ) => {
    try {
      //  Sign in using clerk
      const response = await signIn?.create({
        identifier: trimmedUsername, // The username
        password: trimmedPass,
      });

      if (response?.status === "complete") {
        console.log("Sign-in successful!");
        window.location.href = `${window.location.origin}/me`;
      }
    } catch (error) {
      customToast("Failed, Try Again", "fail");
      console.error("Sign-up error:", error);
      setError((error as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPass = password.trim();

    const message = validatePassword(trimmedPass);

    if (message !== true) {
      setError(message);
      customToast("Failed, Try Again", "fail");
      return;
    }
    setError("");
    customToast("Signing In", "creating");

    handleRegularSignIn(trimmedUsername, trimmedPass);
  };
  return (
    <div className='min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--text-primary)]'>
      <div className='bg-[var(--bg-primary)] shadow-lg rounded-2xl w-full max-w-md p-8 sm:p-10 space-y-6'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <h1 className='text-2xl font-semibold '>Login</h1>
          <p className='text-sm text-[var(--text-secondary)]'>
            Don't have an account?{" "}
            <Link
              href='/auth/sign-up'
              className='text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium transition-colors'
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className='flex flex-col gap-3'>
          <button
            onClick={() => handleOAuthSignIn("oauth_google")}
            className='w-full flex items-center justify-center gap-3 border border-[var(--border)] py-2.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all'
          >
            {loading ? (
              <Loader2 className='animate-spin w-5 h-5 text-[var(--primary)]' />
            ) : (
              <GoogleSvg />
            )}
            <span className='font-medium'>Continue with Google</span>
          </button>
        </div>

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
              name='username'
              value={username}
              placeholder='Username'
              onchange={setUsername}
              type='text'
            />
            <BetterInput
              name='password'
              value={password}
              placeholder='Password'
              onchange={setPassword}
              type='password'
            />

            <p className='text-right text-sm'>
              <Link
                href='/auth/reset'
                className='text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium transition-colors'
              >
                Forgot password?
              </Link>
            </p>

            <div>
              <button
                type='submit'
                className='w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all'
              >
                Login
              </button>
            </div>
          </form>
        </div>

        <div id='clerk-captcha' className='pt-2' />
      </div>
    </div>
  );
}
