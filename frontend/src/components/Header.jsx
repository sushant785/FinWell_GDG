import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48">
            <path
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
            />
          </svg>
          <h2 className="text-xl font-bold text-white dark:text-white">FinGuru</h2>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {["Overview", "Features", "Pricing", "Resources"].map((item) => (
            <button
                key={item}
                className="text-sm font-medium text-white hover:text-primary dark:text-white dark:hover:text-primary"
                >
                {item}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
