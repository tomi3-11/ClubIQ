import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Users,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Github,
} from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const user = await currentUser();

  if (user) {
    const role = user.publicMetadata.role;
    if (role === "admin") {
      redirect("/admin/dashboard");
    } else if (role === "user") {
      redirect("/member/dashboard");
    } else {
      throw new Error("User role not recognized");
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900'>
      {/* Navigation */}
      <nav className='border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center gap-2'>
              <Sparkles className='h-6 w-6 text-blue-600' />
              <span className='text-xl font-bold text-gray-900'>ClubIQ</span>
            </div>
            <div className='flex items-center gap-4'>
              <button className='text-gray-600 hover:text-gray-900 transition-colors px-3 py-2'>
                Features
              </button>
              <button className='text-gray-600 hover:text-gray-900 transition-colors px-3 py-2'>
                About
              </button>
              <Link
                href={"/auth/sign-in"}
                className='px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors font-medium'
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className='pt-20 pb-32 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center max-w-4xl mx-auto mb-16'>
          <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent'>
            Lead Your Club Like a Team — Not a To-Do List
          </h1>
          <p className='text-xl md:text-2xl text-gray-600 mb-8'>
            Manage members, track activities, and organize events — all in one
            smart workspace built for university clubs and organizations.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold inline-flex items-center justify-center'>
              Get Started Free
              <ArrowRight className='ml-2 h-5 w-5' />
            </button>
            <button className='text-lg px-8 py-6 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors font-semibold'>
              See Demo
            </button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className='relative max-w-6xl mx-auto'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-3xl -z-10' />
          <img
            src='/images/dashboard-mockup.png'
            alt='ClubHub Dashboard Preview'
            className='rounded-2xl shadow-2xl border border-gray-200 w-full'
          />
        </div>
      </section>

      {/* Features */}
      <section className='py-20 px-4 sm:px-6 lg:px-8 bg-gray-100'>
        <div className='max-w-7xl mx-auto text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-gray-900'>
            Everything You Need, Nothing You Don't
          </h2>
          <p className='text-xl text-gray-600'>
            Simple tools that make a real difference
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto'>
          {[
            {
              icon: <Calendar className='h-7 w-7 text-blue-600' />,
              title: "Activities at a Glance",
              desc: "Track meetings, trainings, and deadlines in a single dashboard.",
            },
            {
              icon: <Users className='h-7 w-7 text-indigo-600' />,
              title: "Know Your Members",
              desc: "See who's active, assign roles, and celebrate participation.",
            },
            {
              icon: <CheckSquare className='h-7 w-7 text-green-600' />,
              title: "Tasks That Get Done",
              desc: "Assign, track, and mark progress in real-time.",
            },
            {
              icon: <Sparkles className='h-7 w-7 text-blue-600' />,
              title: "Events Coming Soon",
              desc: "Plan, promote, and manage events — all from your club hub.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className='p-8 rounded-xl bg-white border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1'
            >
              <div className='bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4'>
                {f.icon}
              </div>
              <h3 className='text-xl font-semibold mb-3 text-gray-900'>
                {f.title}
              </h3>
              <p className='text-gray-600'>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className='py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden text-center'>
        <div className='absolute inset-0 bg-[rgba(255,255,255,0.05)] bg-[size:32px_32px]' />
        <div className='max-w-4xl mx-auto relative z-10'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6 text-white'>
            Ready to Level Up Your Club Management?
          </h2>
          <p className='text-xl text-white/90 mb-10'>
            Join student leaders already making club management effortless.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-white text-blue-700 hover:bg-white/90 text-lg px-8 py-6 rounded-lg shadow-xl font-semibold inline-flex items-center justify-center transition-all'>
              Start Managing Now
              <ArrowRight className='ml-2 h-5 w-5' />
            </button>
            <button className='text-white border-2 border-white hover:bg-white/10 text-lg px-8 py-6 rounded-lg font-semibold transition-all'>
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8 text-gray-600'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid md:grid-cols-4 gap-8 mb-8'>
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <Sparkles className='h-6 w-6 text-blue-600' />
                <span className='text-lg font-bold text-gray-900'>ClubHub</span>
              </div>
              <p className='text-sm'>
                Built for leaders who care about their teams.
              </p>
            </div>
            <div>
              <h4 className='font-semibold mb-4 text-gray-900'>Product</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='#' className='hover:text-blue-600 transition-colors'>
                    Features
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-blue-600 transition-colors'>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-blue-600 transition-colors'>
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4 text-gray-900'>Company</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='#' className='hover:text-blue-600 transition-colors'>
                    About
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-blue-600 transition-colors'>
                    Contact
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-blue-600 transition-colors'>
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4 text-gray-900'>Legal</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='#' className='hover:text-blue-600 transition-colors'>
                    Privacy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-blue-600 transition-colors'>
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='hover:text-blue-600 transition-colors flex items-center gap-2'
                  >
                    <Github className='h-4 w-4' /> GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t border-gray-200 pt-8 text-center text-sm'>
            <p>
              &copy; 2025 ClubHub. Built for leaders who care about their teams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
