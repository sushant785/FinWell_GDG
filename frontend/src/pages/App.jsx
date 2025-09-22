import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import Chat from "./Chat";
import Dashboard from "./Dashboard"; // Import Dashboard
import SignUp from "./SignUp"; // add this at the top
 

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-white-800 dark:text-white-200">
              {/* Header */}
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
                    <h2 className="text-xl font-bold text-white dark:text-white">FinWell</h2>
                  </div>
                  <nav className="hidden items-center gap-8 md:flex">
                    {["Overview", "Features", "Pricing", "Resources"].map((item) => (
                      <a
                        key={item}
                        href="#"
                        className="text-sm font-medium text-white hover:text-primary dark:text-white dark:hover:text-primary"
                      >
                        {item}
                      </a>
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

              {/* Hero Section */}
              <main className="flex-grow">
                <section
                  className="relative flex min-h-[60vh] items-center justify-center bg-cover bg-center py-20 text-center text-white"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(16, 22, 34, 0.7), rgba(16, 22, 34, 0.9)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCmsIkbTM-iEWnjy_QX3UvIoe1AUZsX_JB7UiFGWdYyV4glOMnYDgnLhA__oQfl9fGpe4OGhI-4aUNvwysRo58qQj3lrcdHGZEmBU8HQ64Jq1usj5EaiUuge05n_iem_yhEuBEyex_EaAXfc8Kdrotggbj06tuehwUOaiGlIYFdCZy0KnYMdJTyK7bY0CauRk8Ycdrm1JdYfM1ennbf5JvwxpAMwYeYFK23vxarPE9K-yEK1pebqc3LwhINAhOM4UPLNutyqCag9h36")',
                  }}
                >
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
                      Your Proactive Financial Coach
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-white">
                      FinWell is your personal financial wellness agent, providing proactive guidance
                      and support to help you achieve your financial goals.
                    </p>
                    <Link
                      to="/login"
                      className="mt-8 rounded-lg bg-primary px-8 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 inline-block"
                    >
                      Get started for free
                    </Link>
                  </div>
                </section>

                {/* Features Section */}
                <section className="py-16 sm:py-24" id="features">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                      <h2 className="text-3xl font-bold tracking-tight text-white dark:text-white sm:text-4xl">
                        How FinWell Works
                      </h2>
                      <p className="mt-4 text-lg text-white dark:text-white">
                        FinWell combines behavioral finance principles with cutting-edge technology
                        to provide personalized financial guidance.
                      </p>
                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                      <div className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                          <span className="material-symbols-outlined">insights</span>
                        </div>
                        <h3 className="mt-5 text-lg font-semibold text-white dark:text-white">
                          Personalized Insights
                        </h3>
                        <p className="mt-2 text-base text-white dark:text-white">
                          Receive tailored insights into your financial behavior and spending patterns.
                        </p>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                          <span className="material-symbols-outlined">support_agent</span>
                        </div>
                        <h3 className="mt-5 text-lg font-semibold text-white dark:text-white">
                          Proactive Coaching
                        </h3>
                        <p className="mt-2 text-base text-white dark:text-white">
                          Get proactive guidance and support to stay on track with your financial goals.
                        </p>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                          <span className="material-symbols-outlined">savings</span>
                        </div>
                        <h3 className="mt-5 text-lg font-semibold text-white dark:text-white">
                          Goal-Oriented Approach
                        </h3>
                        <p className="mt-2 text-base text-white dark:text-white">
                          Set and achieve your financial goals with personalized action plans.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Chatbot Section */}
                <section className="py-16 sm:py-24">
                  <div className="container mx-auto max-w-4xl rounded-xl bg-primary/10 px-4 py-16 text-center dark:bg-primary/20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold tracking-tight text-white dark:text-white sm:text-4xl"> Ask FinWell Chatbot </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-white dark:text-white">
                      Get instant answers to your financial questions and explore various financial
                      scenarios with our intelligent chatbot.
                    </p>
                    <Link
                      to="/login"
                      className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white shadow-lg transition-transform hover:scale-105"
                    >
                      <span className="material-symbols-outlined text-2xl text-white">chat</span>
                      <span className="font-medium">Ask FinWell Chatbot</span>
                    </Link>
                  </div>
                </section>
              </main>

              {/* Footer */}
              <footer className="bg-background-light dark:bg-background-dark">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                  <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row">
                    <p className="text-sm text-white dark:text-white">© 2025 FinWell. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                      {["Terms", "Privacy", "Contact"].map((link) => (
                        <a
                          key={link}
                          href="#"
                          className="text-sm text-white hover:text-primary dark:text-white dark:hover:text-primary"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard Route */}
        <Route path="/signup" element={<SignUp />} />

      </Routes>
    </Router>
  );
}
