import { Link } from "react-router-dom";
import HeroImage from "../assets/hero_image.png"

export default function Hero() {
  return (
    <section
      className="relative flex min-h-[60vh] items-center justify-center bg-cover bg-center py-20 text-center text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(16,22,34,0.7), rgba(16,22,34,0.9)), url(${HeroImage})`,
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
  );
}
