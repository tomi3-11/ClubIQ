import Link from "next/link";

export default function LegalNav() {
  return (
    <nav className='bg-gray-800 text-white'>
      <div className='max-w-3xl mx-auto px-4 py-2'>
        <ul className='flex space-x-4'>
          <li>
            <Link href='/'>Home</Link>
          </li>
          <li>
            <Link href='/legal/privacy_policy'>Privacy Policy</Link>
          </li>
          <li>
            <Link href='/legal/cookie_policy'>Cookie Policy</Link>
          </li>
          <li>
            <Link href='/legal/terms_of_service'>Terms of Service</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
