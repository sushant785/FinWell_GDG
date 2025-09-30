import { Link, useLocation,useNavigate } from "react-router-dom";

export default function DashboardNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-white">FinWell</h2>
        <nav className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className={`hover:text-primary ${location.pathname === "/dashboard" ? "text-primary" : "text-white"}`}
          >
            Dashboard
          </Link>
          <Link
            to="/chat"
            className={`hover:text-primary ${location.pathname === "/chat" ? "text-primary" : "text-white"}`}
          >
            Chatbot
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/")
            }}
            className="text-white hover:text-primary"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
