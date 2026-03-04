'use client';

import { Button } from '@/components/ui/button';
import { PawPrint, Globe, Heart, Camera, MessageCircle, Sparkles, ChevronDown, Users } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-100/20 rounded-full blur-3xl" />

      {/* Floating paw prints */}
      <div className="absolute top-32 right-20 text-amber-200/50 text-6xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>🐾</div>
      <div className="absolute top-48 left-32 text-orange-200/50 text-4xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>🐾</div>
      <div className="absolute bottom-32 left-20 text-amber-200/50 text-5xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>🐾</div>
      <div className="absolute bottom-48 right-32 text-orange-200/50 text-3xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }}>🐾</div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-amber-200 mb-8">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-amber-700">Bientôt disponible • Beta ouverte</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          <span className="text-gray-800">Le réseau social</span>
          <br />
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            de vos animaux
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Créez le profil de vos compagnons, partagez leurs moments, 
          connectez-vous avec d'autres passionnés et suivez leur santé 
          au quotidien.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg px-8 py-6 rounded-full shadow-lg shadow-amber-200/50 hover:shadow-amber-300/50 transition-all">
            <PawPrint className="w-5 h-5 mr-2" />
            Créer un profil
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2 border-amber-200 text-amber-700 hover:bg-amber-50">
            <Globe className="w-5 h-5 mr-2" />
            Découvrir
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-500">50+</div>
            <div className="text-sm text-gray-500">Espèces supportées</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-500">🌍</div>
            <div className="text-sm text-gray-500">Communauté mondiale</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-500">100%</div>
            <div className="text-sm text-gray-500">Gratuit pour démarrer</div>
          </div>
        </div>

        {/* Preview cards floating */}
        <div className="mt-16 relative">
          <div className="flex justify-center gap-4">
            {/* Card 1 */}
            <div className="hidden md:block w-48 h-64 bg-white rounded-2xl shadow-xl p-4 transform rotate-[-8deg] hover:rotate-0 transition-transform">
              <div className="w-full h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl mb-3 flex items-center justify-center">
                <span className="text-4xl">🐕</span>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">Max</div>
                <div className="text-xs text-gray-500">Golden Retriever</div>
                <div className="flex justify-center items-center gap-2 mt-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-gray-500">3 ans • 1.2k abonnés</span>
                </div>
              </div>
            </div>

            {/* Card 2 - Center */}
            <div className="w-52 h-72 bg-white rounded-2xl shadow-2xl p-5 transform hover:scale-105 transition-transform z-10 border-2 border-amber-100">
              <div className="w-full h-28 bg-gradient-to-br from-amber-200 to-orange-200 rounded-xl mb-3 flex items-center justify-center relative">
                <span className="text-5xl">🐈</span>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  🔥 Populaire
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 text-lg">Luna</div>
                <div className="text-sm text-gray-500">Chat européen</div>
                <div className="flex justify-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-gray-600">2.4k</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-600">156</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-gray-600">890</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">12 photos • 8 vidéos</div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="hidden md:block w-48 h-64 bg-white rounded-2xl shadow-xl p-4 transform rotate-[8deg] hover:rotate-0 transition-transform">
              <div className="w-full h-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl mb-3 flex items-center justify-center">
                <span className="text-4xl">🐢</span>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">Shelly</div>
                <div className="text-xs text-gray-500">Tortue terrestre</div>
                <div className="flex justify-center items-center gap-2 mt-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-gray-500">15 ans • 350 abonnés</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-amber-400" />
        </div>
      </div>
    </section>
  );
}
