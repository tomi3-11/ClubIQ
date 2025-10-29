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
    <div className='reset-wrapper'>
      <div className='reset-flow'>
        <div className='reset-navbar'>
          <img src='/images/arban-logo.png' alt='brand logo' />
        </div>
        <div className='create-pass-card'>
          <h1>Create new password</h1>
          <p>Your new password must be different from previous ones</p>

          <form onSubmit={handleSubmit} className='create-pass-form'>
            <div className='input-container'>
              <input
                name='pass'
                className='typical-tnp-input'
                type='password'
                id=''
                placeholder='Password'
              />
              <span className={`error-text ${error ? "show" : ""}`}>
                {error}
              </span>
            </div>
            <div className='input-container'>
              <input
                name='cpass'
                className='typical-tnp-input'
                type='password'
                placeholder='Confirm password'
              />
              <span className={`error-text ${cpassError ? "show" : ""}`}>
                {cpassError}
              </span>
            </div>

            <button type='submit' className='typical-tnp-button reset-flow-btn'>
              Reset
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
