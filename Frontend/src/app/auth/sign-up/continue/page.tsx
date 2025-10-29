"use client";
import "../../page.css";
import "./continue.css";
import { useEffect, useState } from "react";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Logo from "@/components//reusables/Logo";
import BetterInput from "@/components/reusables/BetterInput/BetterInput";
import Image from "next/image";

export default function Page() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useSignUp();
  const { signIn, setActive } = useSignIn();
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/me");
    } else if (signIn && signIn?.status !== "needs_identifier") {
      router.replace("/auth/sign-in");
    }
  }, [signUp, router, signIn, user]);

  const handleContinue = async () => {
    if (!signIn || !signUp) return;
    setIsLoading(true);

    try {
      if (signIn?.firstFactorVerification.status === "transferable") {
        const res = await signUp.create({
          transfer: true,
          username: username,
        });

        if (res.status === "complete") {
          setActive({
            session: res.createdSessionId,
          });
        }
      } else if (signUp.status === "missing_requirements") {
        const res = await signUp?.update({
          username: username,
        });
        if (res.status === "complete") {
          setActive({
            session: res.createdSessionId,
          });
        }
      }

      window.location.href = `${window.location.origin}/me`;
    } catch (err: any) {
      setIsLoading(false);
      console.error("Error completing sign-up:", err);
      setError(
        err.errors ? err.errors[0]?.message : "An unexpected error occurred"
      );
    }
  };

  // --- NEW CODE START: handleCancel function ---
  const handleCancel = () => {
    // This will navigate the user back to the sign-in/sign-up entry point.
    // Based on the useEffect, the previous step is likely '/auth/sign-in' or '/auth/sign-up'.
    // I'm using '/auth/sign-in' as a common initial auth page.
    // If your previous page is different (e.g., the main login page), adjust this path.
    router.push("/auth/sign-in");
  };
  // --- NEW CODE END ---

  return (
    <div className='auth-flow continue'>
      <div className='inner-card '>
        <div className='auth-left'>
          <Image
            src={"/images/collage_marvel2.jpg"}
            width={1920}
            height={1080}
            alt='collage of movies'
          />
        </div>
        <div className='auth-right'>
          <div className='rs-inner'>
            <Logo />
            <h1>Sign Up</h1>
            <p className='title-text'>
              Please fill in the missing details to continue
            </p>
            <BetterInput
              type='text'
              placeholder='Username'
              value={username}
              onchange={setUsername}
              name='username'
            />
            <span className='span-separator'></span>

            {error && <p className='error-txt'>{error}</p>}

            <div className='btn-container'>
              <button
                disabled={isLoading || username.length < 4}
                type='button'
                onClick={handleContinue}
                className={`auth-flow-btn ${
                  username.length >= 4 ? "active" : "inactive"
                } ${isLoading ? "loading" : ""}`}
              >
                {isLoading ? <Loader2 /> : <span>Continue</span>}
              </button>
              {/* --- NEW CODE START: Cancel button --- */}
              <button
                type='button'
                onClick={handleCancel}
                className='auth-flow-btn secondary-btn' // Added a new class for styling
                style={{ marginTop: "10px" }} // Basic spacing, refine with CSS
              >
                <span>Cancel</span>
              </button>
              {/* --- NEW CODE END --- */}
            </div>
            <div id='clerk-captcha' />
          </div>
        </div>
      </div>
    </div>
  );
}
