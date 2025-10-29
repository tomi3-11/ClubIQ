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
import { setRole } from "@/DAL/authServiceImpl";

export default function Page() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useSignUp();
  const { signIn, setActive } = useSignIn();
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldSetRole, setShouldSetRole] = useState(false);

  // useEffect(() => {
  //   if (isSignedIn) {
  //     router.replace("/");
  //   } else if (signIn && signIn?.status !== "needs_identifier") {
  //     router.replace("/auth/sign-in");
  //   }
  // }, [signUp, router, signIn, user]);

  useEffect(() => {
    if (user && shouldSetRole) {
      const addUserRole = async () => {
        try {
          await setRole(user.id, "user");
          window.location.href = `${window.location.origin}/sso`;
        } catch (error) {
          console.error("Error setting user role:", error);
        }
      };

      addUserRole();
    }
  }, [user, shouldSetRole]);

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
      setShouldSetRole(true);
    } catch (err: any) {
      setIsLoading(false);
      console.error("Error completing sign-up:", err);
      setError(
        err.errors ? err.errors[0]?.message : "An unexpected error occurred"
      );
    }
  };

  const handleCancel = () => {
    router.push("/auth/sign-in");
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--text-primary)]'>
      <div className='bg-[var(--bg-primary)] shadow-lg rounded-2xl w-full max-w-md p-8 sm:p-10 space-y-6'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <h1 className='text-2xl font-semibold '>Sign Up</h1>
          <p className='text-sm text-[var(--text-secondary)]'>
            Please fill in the missing details to continue
          </p>
        </div>

        {/* Username Input */}
        <div className='space-y-4'>
          <BetterInput
            type='text'
            placeholder='Username'
            value={username}
            onchange={setUsername}
            name='username'
          />

          <span className='block h-px bg-[var(--border)] my-2'></span>

          {error && (
            <p className='text-[var(--danger)] text-sm text-center'>{error}</p>
          )}
        </div>

        {/* Buttons */}
        <div className='flex flex-col gap-3'>
          <button
            disabled={isLoading || username.length < 4}
            type='button'
            onClick={handleContinue}
            className={`w-full py-2.5 rounded-lg font-medium transition-all shadow-md ${
              username.length >= 4
                ? "bg-[var(--primary)] hover:bg-[var(--primary-dark)] hover:shadow-lg"
                : "bg-[var(--border)] cursor-not-allowed text-[var(--text-secondary)]"
            } ${isLoading ? "opacity-80" : ""}`}
          >
            {isLoading ? (
              <Loader2 className='animate-spin w-5 h-5 mx-auto text-[var(--primary)]' />
            ) : (
              <span>Continue</span>
            )}
          </button>
        </div>

        <div id='clerk-captcha' className='pt-2' />
      </div>
    </div>
  );
}
