export default function Footer() {
  return (
    <footer className="bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row">
          <p className="text-sm text-white">© 2025 FinWell. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {["Terms", "Privacy", "Contact"].map((link) => (
              <button
                key={link}
                className="text-sm font-medium text-white hover:text-primary dark:text-white dark:hover:text-primary"
                >
                {link}
            </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
