import Image from "next/image";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import Features from "@/components/Features";
import Leaderboard from "@/components/Leaderboard";

import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <section className="relative min-h-screen">
        <Image
          src="/images/background.png"
          alt="Session background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="relative z-10 min-h-screen">
          <Navbar />
          <Hero />
        </div>
      </section>

      <Dashboard />

      <Features />

      <Leaderboard />

      <Footer />
    </main>
  );
}
