import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import ChatbotSection from "../components/ChatbotSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-white-800 dark:text-white-200">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <ChatbotSection />
      </main>
      <Footer />
    </div>
  );
}
