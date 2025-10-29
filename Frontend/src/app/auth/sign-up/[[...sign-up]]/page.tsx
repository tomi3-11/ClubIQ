"use client";
import "../../page.css";
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

  if (isSignedIn) {
    router.replace("/member-dashboard");
    return;
  }

  const handleOAuthSignUp = async (
    strategy: "oauth_google" | "oauth_facebook" | "oauth_apple"
  ) => {
    setLoading(true);
    customToast("Creating Account", "creating");
    const url = window.location.origin;
    const redirectUrl = `${url}/auth/sign-up/continue`;
    const redirectUrlComplete = `${url}/member-dashboard`;
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
    <div className='auth-flow register'>
      <div className='inner-card'>
        <div className='auth-left'>
          <Image
            src={"/images/collage_all.jpg"}
            width={1920}
            height={1080}
            alt='collage of movies'
          />
        </div>
        <div className='auth-right'>
          <div className='rs-inner'>
            <Logo />
            <h1>Create An Account</h1>
            <p className='has-account center-text'>
              Already have an account?
              <Link href={"/auth/sign-in"}>
                <span> Login</span>
              </Link>
            </p>
            <div className='socials-options'>
              <button
                onClick={() => handleOAuthSignUp("oauth_google")}
                className='btn btn-google'
              >
                {loading ? (
                  <Loader2 className='loading-spinner' />
                ) : (
                  <GoogleSvg />
                )}
                <span>Continue with Google</span>
              </button>
            </div>
            <span className='span-separator'>or</span>
            <div className='form-container'>
              <p className='error-message'>{error}</p>
              <form onSubmit={handleSubmit}>
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
                <div className='btn-container'>
                  <button type='submit' className='continue auth-flow-btn'>
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
            <div id='clerk-captcha' />
          </div>
        </div>
      </div>
    </div>
  );
}
