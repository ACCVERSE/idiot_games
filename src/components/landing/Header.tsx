'use client';

import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-amber-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image 
                src="/accverse-logo.png" 
                alt="Accverse Logo" 
                width={40} 
                height={40}
                className="object-contain rounded-lg"
                priority
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Accverse
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-amber-500 transition-colors">Fonctionnalités</a>
            <a href="#about" className="text-gray-600 hover:text-amber-500 transition-colors">À propos</a>
            <a href="#roadmap" className="text-gray-600 hover:text-amber-500 transition-colors">Roadmap</a>
            <a href="#contact" className="text-gray-600 hover:text-amber-500 transition-colors">Contact</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="text-gray-600">
              Se connecter
            </Button>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
              Rejoindre la beta
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-amber-100">
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-gray-600 hover:text-amber-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>Fonctionnalités</a>
              <a href="#about" className="text-gray-600 hover:text-amber-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>À propos</a>
              <a href="#roadmap" className="text-gray-600 hover:text-amber-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>Roadmap</a>
              <a href="#contact" className="text-gray-600 hover:text-amber-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              <div className="flex flex-col gap-2 pt-4 border-t border-amber-100">
                <Button variant="ghost" className="text-gray-600 justify-start">Se connecter</Button>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">Rejoindre la beta</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
