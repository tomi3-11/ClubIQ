"use client";
import { SearchIcon } from "@/assets/icons";
import { useProgress } from "@bprogress/next";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function InputContainer({}) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { start } = useProgress();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      return;
    }
    start();
    const query = encodeURIComponent(searchQuery.trim());
    const url = `/film/${query}`;
    router.push(url);
    setSearchQuery("");
  };
  return (
    <form onSubmit={handleSearch} className='nav-input-container'>
      <input
        type='search'
        placeholder='Search...'
        className='nav-input'
        autoComplete='off'
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className='nav-input-button' type='submit'>
        <SearchIcon />
      </button>
    </form>
  );
}
