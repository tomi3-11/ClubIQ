"use client";

import { validatePassword } from "@/utils/utilities";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePass() {
  const [error, setError] = useState("");
  const [cpassError, setCpassError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const target = e.target;

    const pass = target.pass.value;
    const cpass = target.cpass.value;

    const message = validatePassword(pass);
    if (message !== true) {
      setError(message);
      return;
    }

    if (cpass !== pass) {
      setError("");
      setCpassError("Passwords must match");
      return;
    }

    setError("");
    setCpassError("");
    setTimeout(() => {
      router.push("/home");
    }, 3000);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--text-primary)]'>
      <div className='bg-[var(--bg-primary)] shadow-lg rounded-2xl w-full max-w-md p-8 sm:p-10 space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-semibold'>Create new password</h1>
          <p className='text-sm text-[var(--text-secondary)]'>
            Your new password must be different from previous ones
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Password */}
          <div className='flex flex-col space-y-1'>
            <input
              name='pass'
              type='password'
              placeholder='Password'
              className='w-full border border-[var(--border)] bg-[var(--bg-tertiary)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-all'
            />
            {error && (
              <span className='text-[var(--danger)] text-sm'>{error}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className='flex flex-col space-y-1'>
            <input
              name='cpass'
              type='password'
              placeholder='Confirm password'
              className='w-full border border-[var(--border)] bg-[var(--bg-tertiary)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-all'
            />
            {cpassError && (
              <span className='text-[var(--danger)] text-sm'>{cpassError}</span>
            )}
          </div>

          {/* Reset Button */}
          <button
            type='submit'
            className='w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all'
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}
