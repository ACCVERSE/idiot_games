'use client';

import { Header } from './Header';
import { Hero } from './Hero';
import { Features } from './Features';
import { About } from './About';
import { Roadmap } from './Roadmap';
import { Contact } from './Contact';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <About />
      <Roadmap />
      <Contact />
      <Footer />
    </main>
  );
}
