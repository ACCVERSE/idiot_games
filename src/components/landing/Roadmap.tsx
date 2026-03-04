'use client';

import { PawPrint, CheckCircle, Circle, Clock, Rocket, Users, MessageCircle, Heart, FileText, Smartphone } from 'lucide-react';

const roadmapItems = [
  {
    phase: 'Phase 1',
    title: 'Fondations',
    description: 'Authentification sécurisée et création de comptes utilisateurs.',
    status: 'completed',
    icon: CheckCircle,
    features: ['Inscription/Connexion', 'Récupération mot de passe', 'Profil utilisateur'],
  },
  {
    phase: 'Phase 2',
    title: 'Profils Animaux',
    description: 'Créez le profil unique de chaque compagnon avec photo et informations.',
    status: 'in-progress',
    icon: PawPrint,
    features: ['Création de profil', '50+ espèces supportées', 'Photo de profil', 'Informations de base'],
  },
  {
    phase: 'Phase 3',
    title: 'Réseau Social',
    description: 'Connectez-vous avec la communauté : abonnements, likes, commentaires et fil d\'actualités.',
    status: 'upcoming',
    icon: Users,
    features: ['Système d\'abonnements', 'Likes et commentaires', 'Fil d\'actualités', 'Notifications'],
  },
  {
    phase: 'Phase 4',
    title: 'Galerie & Partage',
    description: 'Partagez photos et vidéos, créez des albums et stories de vos compagnons.',
    status: 'upcoming',
    icon: Heart,
    features: ['Upload photos/vidéos', 'Albums personnalisés', 'Stories éphémères', 'Partage entre profils'],
  },
  {
    phase: 'Phase 5',
    title: 'Messagerie',
    description: 'Échangez en privé avec d\'autres propriétaires passionnés.',
    status: 'upcoming',
    icon: MessageCircle,
    features: ['Chat privé', 'Messages groupés', 'Partage de médias', 'Notifications push'],
  },
  {
    phase: 'Phase 6',
    title: 'Santé & Documents',
    description: 'Fonctionnalités avancées : suivi santé, stockage de documents et rappels.',
    status: 'upcoming',
    icon: FileText,
    features: ['Carnet de santé', 'Rappels vaccinations', 'Stockage documents', 'Code PIN sécurisé'],
  },
  {
    phase: 'Phase 7',
    title: 'Application Mobile',
    description: 'Applications natives iOS et Android avec toutes les fonctionnalités.',
    status: 'upcoming',
    icon: Smartphone,
    features: ['App iOS', 'App Android', 'Notifications push', 'Mode hors-ligne'],
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-full mb-4">
            <Rocket className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-teal-700">Feuille de route</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Notre <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Roadmap</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les étapes de développement d'Accverse. 
            Le réseau social pour vos animaux, en construction !
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {roadmapItems.map((item, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-2xl p-6 shadow-lg border transition-all hover:shadow-xl ${
                  item.status === 'in-progress' 
                    ? 'border-teal-200 ring-2 ring-teal-100' 
                    : item.status === 'completed'
                      ? 'border-green-200'
                      : 'border-gray-100'
                }`}
              >
                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    item.status === 'completed' 
                      ? 'text-green-600' 
                      : item.status === 'in-progress' 
                        ? 'text-teal-600' 
                        : 'text-gray-400'
                  }`}>
                    {item.phase}
                  </span>
                  {item.status === 'in-progress' && (
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                      En cours
                    </span>
                  )}
                  {item.status === 'completed' && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Terminé
                    </span>
                  )}
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.status === 'completed' 
                      ? 'bg-green-100' 
                      : item.status === 'in-progress' 
                        ? 'bg-teal-100' 
                        : 'bg-gray-100'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      item.status === 'completed' 
                        ? 'text-green-600' 
                        : item.status === 'in-progress' 
                          ? 'text-teal-600' 
                          : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                {/* Features List */}
                <div className="flex flex-wrap gap-2">
                  {item.features.map((feature, idx) => (
                    <span 
                      key={idx} 
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'completed' 
                          ? 'bg-green-50 text-green-600' 
                          : item.status === 'in-progress' 
                            ? 'bg-teal-50 text-teal-600' 
                            : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-2">Envie de participer au projet ?</h3>
            <p className="text-white/80 mb-6">
              Rejoignez notre programme beta et soyez les premiers à découvrir Accverse.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#contact" 
                className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-full font-medium hover:bg-teal-50 transition-all shadow-lg"
              >
                <PawPrint className="w-4 h-4" />
                Devenir beta-testeur
              </a>
              <a 
                href="#contact" 
                className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-all"
              >
                Partenariat / Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
