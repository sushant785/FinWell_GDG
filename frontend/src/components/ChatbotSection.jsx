import { Link } from "react-router-dom";

export default function ChatbotSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl rounded-xl bg-primary/10 px-4 py-16 text-center dark:bg-primary/20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ask FinGuru Chatbot
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white">
          Get instant answers to your financial questions and explore various financial
          scenarios with our intelligent chatbot.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white shadow-lg transition-transform hover:scale-105"
        >
          <span className="material-symbols-outlined text-2xl text-white">chat</span>
          <span className="font-medium">Ask FinGuru Chatbot</span>
        </Link>
      </div>
    </section>
  );
}
