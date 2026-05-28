"use client";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

export default function useSignOut() {
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    try {
      const url = `${window.location.origin}/`;
      await signOut({ redirectUrl: url });
    } catch (error) {
      toast.error("There was an error when signing out.");
      console.error("Error signing out:", error);
    }
  };

  return { handleSignOut };
}
