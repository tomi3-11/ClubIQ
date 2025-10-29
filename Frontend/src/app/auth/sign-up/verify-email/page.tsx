"use client";
import { useEffect, useRef, useState } from "react";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { customToast } from "@/utils/utilities";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { setRole } from "@/DAL/authServiceImpl";

export default function Page() {
  const [otpInputs, setOtpInputs] = useState(new Array(6).fill(""));
  const { signUp } = useSignUp();
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { signIn } = useSignIn();
  const firstInputRef = useRef<HTMLInputElement>(null); // Fixed: Properly typed ref
  const [loading, setIsLoading] = useState(false);
  const [shouldSetRole, setShouldSetRole] = useState(false);

  // useEffect(() => {
  //   if (isSignedIn) {
  //     //router.replace("/me");
  //   } else if (signUp && signUp?.status !== "missing_requirements") {
  //     //router.replace("/auth/sign-in");
  //   }
  // }, [signUp, router, signIn, user, isSignedIn]);

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
      handleVerification();
    }
  }, [code]);

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

  const handleVerification = async () => {
    const code = otpInputs.join("");
    setIsLoading(true);
    if (code.length < 6) {
      setError("Please enter a 6-digit code.");
      setIsLoading(false);

      return;
    }
    try {
      await signUp?.attemptEmailAddressVerification({ code });
      setShouldSetRole(true);

      customToast("Email verified! Welcome.", "success");
    } catch (err: any) {
      setError(
        err.errors ? err.errors[0]?.message : "Invalid code. Please try again."
      );
      setIsLoading(false);
    }
  };

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
        <div className='flex flex-col items-center space-y-3 text-center'>
          <h1 className='text-2xl font-semibold'>Please check your email</h1>
          <p className='text-sm text-[var(--text-secondary)]'>
            We've sent a code to{" "}
            <span className='font-medium text-[var(--primary)]'>
              {signUp?.emailAddress}
            </span>
          </p>
        </div>

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
              className='w-12 h-12 text-center text-lg font-medium border border-[var(--border)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all bg-[var(--bg-tertiary)]'
            />
          ))}
        </div>

        {/* Verify Button */}
        <div className='flex flex-col gap-3'>
          <button
            disabled={loading || code.length !== 6}
            onClick={handleVerification}
            className={`w-full py-2.5 rounded-lg font-medium transition-all shadow-md ${
              code.length === 6
                ? "bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-[var(--foreground)] hover:shadow-lg"
                : "bg-[var(--border)] cursor-not-allowed text-[var(--text-secondary)]"
            } ${loading ? "opacity-80" : ""}`}
          >
            {loading ? (
              <Loader2 className='animate-spin w-5 h-5 mx-auto text-[var(--primary)]' />
            ) : (
              <span>Verify</span>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className='text-[var(--danger)] text-sm text-center'>{error}</p>
        )}

        <div id='clerk-captcha' className='pt-2' />
      </div>
    </div>
  );
}
