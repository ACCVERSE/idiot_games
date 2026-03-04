'use client';

import { Button } from '@/components/ui/button';
import { PawPrint, Heart, Shield, Globe, Sparkles, Users, MessageCircle, Share2 } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-100 px-4 py-2 rounded-full mb-6">
              <Users className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">Réseau social animalier</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Connectez-vous avec la{' '}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                communauté animale
              </span>
            </h2>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Accverse est avant tout un réseau social dédié à vos animaux. 
              Partagez leurs moments, suivez d'autres compagnons, 
              échangez avec des passionnés du monde entier.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Partagez leur vie</h3>
                  <p className="text-gray-600 text-sm">
                    Photos, vidéos, histoires... Créez le fil d'actualité de vos compagnons 
                    et partagez-le avec vos abonnés.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Échangez et commentez</h3>
                  <p className="text-gray-600 text-sm">
                    Likez, commentez, envoyez des messages à d'autres propriétaires. 
                    Créez des liens autour de votre passion commune.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Et bien plus encore...</h3>
                  <p className="text-gray-600 text-sm">
                    Suivi santé, documents, rappels... Accverse vous accompagne 
                    dans tous les aspects de la vie de vos compagnons.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-full px-8">
                <Users className="w-5 h-5 mr-2" />
                Rejoindre la communauté
              </Button>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            {/* Social Feed Preview */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 relative z-10">
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
                  <span className="text-2xl">🐕</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Max le Golden</div>
                  <div className="text-xs text-gray-500">il y a 2 heures • 📍 Paris</div>
                </div>
              </div>

              {/* Post Image */}
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl h-48 flex items-center justify-center mb-4">
                <span className="text-6xl">🐕‍🦺</span>
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-6 mb-4">
                <button className="flex items-center gap-1 text-red-500">
                  <Heart className="w-6 h-6 fill-current" />
                  <span className="font-medium">247</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                  <MessageCircle className="w-6 h-6" />
                  <span className="font-medium">32</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-green-500">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Comments Preview */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-200 to-cyan-200 flex items-center justify-center">
                    <span className="text-sm">🐈</span>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-800">Luna</span>
                    <span className="text-sm text-gray-600"> Quel beau golden ! 😍</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating User Avatars */}
            <div className="absolute -top-4 -right-4 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform">
              <span className="text-2xl">🐈</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transform -rotate-12 hover:rotate-0 transition-transform">
              <span className="text-xl">🐢</span>
            </div>
            <div className="absolute top-1/2 -right-8 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <span className="text-lg">🦜</span>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-200 rounded-full opacity-50 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-200 rounded-full opacity-50 blur-xl" />
          </div>
        </div>

        {/* Species Banner */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 mb-6">Rejoignez des milliers de propriétaires passionnés</p>
          <div className="flex flex-wrap justify-center gap-4 text-4xl">
            <span className="hover:scale-125 transition-transform cursor-pointer" title="Chien">🐕</span>
            <span className="hover:scale-125 transition-transform cursor-pointer" title="Chat">🐈</span>
            <span className="hover:scale-125 transition-transform cursor-pointer" title="Lapin">🐇</span>
            <span className="hover:scale-125 transition-transform cursor-pointer" title="Oiseau">🦜</span>
            <span className="hover:scale-125 transition-transform cursor-pointer" title="Poisson">🐠</span>
            <span className="hover:scale-125 transition-transform cursor-pointer" title="Tortue">🐢</span>
            <span className="hover:scale-125 transition-transform cursor-pointer" title="Serpent">🐍</span>
            <span className="hover:scale-125 transition-transform cursor-pointer" title="Furet">🦝</span>
            <span className="hover:scale-125 transition-transform cursor-pointer" title="Cheval">🐴</span>
            <span className="hover:scale-125 transition-transform cursor-pointer" title="Cochon d'Inde">🐹</span>
            <span className="hover:scale-125 transition-transform cursor-pointer" title="Hérisson">🦔</span>
            <span className="hover:scale-125 transition-transform cursor-pointer" title="Autre">🐾</span>
          </div>
        </div>
      </div>
    </section>
  );
}
