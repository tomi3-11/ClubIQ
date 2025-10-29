"use client";
import Image from "next/image";
import "./navbar.css";
import InputContainer from "./components/InputContainer";
import NavLinks from "./components/NavLinks";
import UserButton from "./components/UserButton";
import Link from "next/link";
import { useState } from "react";
import MenuButton from "./components/MenuButton";
import { useUser } from "@clerk/nextjs";
export default function Navbar({}) {
  const [navLinksOpen, setNavLinksOpen] = useState(false);
  const { user } = useUser();
  const customStyle = {
    "--nav-links-num": `${user ? 3 : 5}`,
  } as React.CSSProperties & { [key: `--${string}`]: string };

  return (
    <div className='navbar'>
      <div className='navbar-inner'>
        <div className='nav-start nav-section'>
          <MenuButton setNavLinksOpen={setNavLinksOpen} />

          <Link href={"/"} className='home-button'>
            <Image
              className='reel-icon'
              src={"/images/reel_favicon.png"}
              width={256}
              height={256}
              alt='alt logo'
            />
            <span>ReelTone</span>
          </Link>
        </div>
        <NavLinks />
        <div className='nav-end nav-section'>
          <InputContainer />
          <UserButton />
        </div>
      </div>
      <div
        className={`collapsable-links ${navLinksOpen ? "open" : ""}`}
        style={customStyle}
      >
        <NavLinks />
      </div>
    </div>
  );
}
