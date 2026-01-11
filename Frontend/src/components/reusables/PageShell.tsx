"use client";

import React from "react";
import Sidebar from "./Sidebar";
import useSignOut from "@/hooks/useSignOut";
import { useUser } from "@clerk/nextjs";

export default function PageShell({
  children,
  pageTitle,
}: {
  children: React.ReactNode;
  pageTitle?: string;
}) {
  const { handleSignOut } = useSignOut();
  const { user } = useUser();

  return (
    <div className='main-page-container min-h-screen h-full flex'>
      <Sidebar role='admin' />

      <main className='main-page-main grow'>
        <header className='main-page-header px-4 py-3 flex justify-between align-center border-b border-light'>
          <div className='header-content'>
            <h1 className='font-bold text-lg'>Welcome, {user?.firstName}</h1>
            <p className='text-sm text-gray-600 '>
              {pageTitle ? pageTitle : "Some page title content"}
            </p>
          </div>
          <button className='btn btn-outline h-10' onClick={handleSignOut}>
            Logout
          </button>
        </header>

        <div className='main-page-tabs flex gap-2 px-4 py-3'>
          <button>Action 1</button>
          <button>Action 2</button>
        </div>

        {children}
      </main>
    </div>
  );
}
