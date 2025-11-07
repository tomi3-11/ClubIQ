import Link from "next/link";
import "./footer.css";

export default function Footer() {
  return (
    <footer className='footer mt-100 border-t border-gray-700'>
      <div className='max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500'>
        {/* Top Row: Legal Links */}
        <div className='flex justify-center space-x-6 mb-4'>
          <Link
            href='/legal/privacy_policy'
            className='hover:text-gray-800 transition-colors'
          >
            Privacy Policy
          </Link>
          <Link
            href='/legal/terms_of_service'
            className='hover:text-gray-800 transition-colors'
          >
            Terms of Service
          </Link>
          <Link
            href='/legal/cookie_policy'
            className='hover:text-gray-800 transition-colors'
          >
            Cookie Policy
          </Link>
        </div>

        {/* Bottom Bar */}
        <p>© {new Date().getFullYear()} ReelTone. All rights reserved.</p>
        <p className='mt-1'>
          Made with <span className='text-red-500'>♥</span> by the ReelTone Team
        </p>
      </div>
    </footer>
  );
}
