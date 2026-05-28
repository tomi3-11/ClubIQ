"use client";
import { AccountSvg, LogoutSvg } from "@/assets/icons";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import useSignOut from "@/hooks/useSignOut";

export default function UserButton() {
  const { user, isSignedIn } = useUser();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const router = useRouter();
  const { handleSignOut } = useSignOut();

  useEffect(() => {
    const handleClick = (e: any) => {
      const target = e.target as HTMLElement;

      if (
        !target.classList.contains("options-container") &&
        !target.closest(".options-container") &&
        !target.classList.contains("pfp")
      ) {
        setOptionsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleImageLoadingError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = "/default-user-icon.svg";
  };

  const handleClick = () => {
    router.push("/profile");
  };

  if (!isSignedIn) return null;

  return (
    <div className='pfp-container'>
      <img
        onClick={() => setOptionsOpen(!optionsOpen)}
        className='pfp'
        src={user?.imageUrl ? user.imageUrl : "/svgs/default-user-icon.svg"}
        alt='profile picture'
        onError={handleImageLoadingError}
      />

      <div className={`options-container ${optionsOpen ? "open" : ""}`}>
        <button onClick={handleClick}>
          <AccountSvg />
          <span>Profile</span>
        </button>
        <button className='logout-nav' onClick={handleSignOut}>
          <LogoutSvg />
          <span>logout</span>
        </button>
      </div>
    </div>
  );
}
