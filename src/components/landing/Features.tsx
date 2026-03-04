'use client';

import { Card, CardContent } from '@/components/ui/card';
import { 
  PawPrint, 
  Heart, 
  Camera, 
  FileText, 
  Calendar, 
  Shield, 
  Globe, 
  Users,
  Bell,
  Smartphone,
  MessageCircle,
  Share2
} from 'lucide-react';

const features = [
  {
    icon: PawPrint,
    title: 'Profils Animaux',
    description: 'Créez des profils uniques pour chacun de vos compagnons et partagez leur personnalité avec le monde.',
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50',
  },
  {
    icon: Globe,
    title: 'Communauté Mondiale',
    description: 'Connectez-vous avec des millions de passionnés d\'animaux à travers le monde et partagez vos aventures.',
    color: 'from-teal-400 to-cyan-500',
    bgColor: 'bg-teal-50',
  },
  {
    icon: Users,
    title: 'Famille & Amis',
    description: 'Invitez vos proches à suivre le quotidien de vos animaux et créez des souvenirs ensemble.',
    color: 'from-orange-400 to-red-500',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Camera,
    title: 'Galerie Photos & Vidéos',
    description: 'Partagez les moments précieux de vos compagnons et recevez des likes et commentaires de la communauté.',
    color: 'from-purple-400 to-violet-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: MessageCircle,
    title: 'Messagerie',
    description: 'Échangez avec d\'autres propriétaires, posez vos questions et partagez vos conseils.',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Share2,
    title: 'Fil d\'Actualités',
    description: 'Découvrez le quotidien des animaux que vous suivez et partagez les vôtres en un clic.',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-50',
  },
  {
    icon: Heart,
    title: 'Suivi Santé',
    description: 'Gardez un historique médical complet : vaccinations, traitements, visites vétérinaires.',
    color: 'from-red-400 to-pink-500',
    bgColor: 'bg-red-50',
  },
  {
    icon: FileText,
    title: 'Documents',
    description: 'Stockez et organisez tous les documents importants : certificats, ordonnances, pedigrees...',
    color: 'from-slate-400 to-gray-600',
    bgColor: 'bg-slate-50',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full mb-4">
            <PawPrint className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-700">Fonctionnalités</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Le réseau social{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              de vos animaux
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Avant tout un espace pour partager, connecter et célébrer la vie de vos compagnons 
            avec une communauté passionnée.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${feature.bgColor}`}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Feature Highlight */}
        <div className="mt-16 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-10 text-6xl">❤️</div>
            <div className="absolute bottom-4 right-10 text-4xl">💬</div>
            <div className="absolute top-1/2 right-1/4 text-5xl">🐾</div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="w-8 h-8" />
              <Users className="w-8 h-8" />
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Un réseau social pensé pour les animaux
            </h3>
            <p className="text-white/80 max-w-xl mx-auto mb-6">
              Partagez, likez, commentez et connectez-vous avec d'autres amoureux des animaux 
              du monde entier. Chaque animal a sa propre identité numérique.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2">
                <span className="text-2xl">❤️</span>
                <span className="font-medium">Likes</span>
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2">
                <span className="text-2xl">💬</span>
                <span className="font-medium">Commentaires</span>
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2">
                <span className="text-2xl">👥</span>
                <span className="font-medium">Abonnements</span>
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2">
                <span className="text-2xl">🔔</span>
                <span className="font-medium">Notifications</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
