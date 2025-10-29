"use client";
import "../../page.css";
import { GoogleSvg } from "@/assets/icons";
import Logo from "@/components/reusables/Logo";
import BetterInput from "@/components/reusables/BetterInput/BetterInput";
import { customToast, validatePassword } from "@/utils/utilities";
import { useSignIn, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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

  if (isSignedIn) {
    router.replace("/member-dashboard");
    return;
  }

  const handleOAuthSignIn = async (
    strategy: "oauth_google" | "oauth_facebook" | "oauth_apple"
  ) => {
    setLoading(true);
    customToast("Signing In", "creating");
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
    <div className='auth-flow register'>
      <div className='inner-card'>
        <div className='auth-left'>
          <Image
            src={"/images/collage_horror.jpg"}
            width={1920}
            height={1080}
            alt='collage of movies'
          />
        </div>
        <div className='auth-right'>
          <div className='rs-inner'>
            <Logo />
            <h1>Login</h1>
            <p className='has-account center-text title-text'>
              Don't have an account?
              <Link href={"/auth/sign-up"}>
                <span> Sign Up</span>
              </Link>
            </p>

            <div className='socials-options'>
              <button
                onClick={() => handleOAuthSignIn("oauth_google")}
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
                  name='username'
                  value={username}
                  classList=''
                  placeholder='Username'
                  onchange={setUsername}
                  type='text'
                />
                <BetterInput
                  name='password'
                  value={password}
                  classList=''
                  placeholder='Password'
                  onchange={setPassword}
                  type='password'
                />
                <p className='has-account right-text title-text'>
                  <Link href={"/auth/reset"}>
                    <span>Forgot password?</span>
                  </Link>{" "}
                </p>
                <div className='btn-container less'>
                  <button type='submit' className='continue auth-flow-btn'>
                    Login
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
