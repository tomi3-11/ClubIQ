import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function NavLinks() {
  const { user } = useUser();

  return (
    <nav className='nav-middle nav-section'>
      {!user && (
        <>
          <Link href={"/auth/sign-in"}>SIGN IN</Link>
          <Link href={"/auth/sign-up"}>CREATE ACCOUNT</Link>
        </>
      )}
      <Link href={"/me"}>ME</Link>
      <Link href={"/films"}>FILMS</Link>
      <Link href={"/members/new"}>MEMBERS</Link>
    </nav>
  );
}
