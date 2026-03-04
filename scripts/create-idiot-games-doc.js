const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType, 
        ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat } = require('docx');
const fs = require('fs');

// Color scheme: "Midnight Code" - for tech/gaming
const colors = {
  primary: "020617",      // Midnight Black
  bodyText: "1E293B",     // Deep Slate Blue
  secondary: "64748B",    // Cool Blue-Gray
  accent: "94A3B8",       // Steady Silver
  tableBg: "F8FAFC",      // Glacial Blue-White
  white: "FFFFFF"
};

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: colors.accent };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 72, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 0, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: colors.bodyText, font: "Times New Roman" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: colors.secondary, font: "Times New Roman" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [
    // ===== COVER PAGE =====
    {
      properties: {
        page: { margin: { top: 0, right: 0, bottom: 0, left: 0 } }
      },
      children: [
        new Paragraph({ spacing: { before: 3000 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 1000 },
          children: [new TextRun({ text: "🎮", size: 144 })]
        }),
        new Paragraph({
          heading: HeadingLevel.TITLE,
          children: [new TextRun("IDIOT GAMES")]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [new TextRun({ text: "Plateforme de Mini-Jeux Viraux", size: 32, color: colors.secondary, font: "Times New Roman" })]
        }),
        new Paragraph({ spacing: { before: 2000 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Document de Conception", size: 24, color: colors.bodyText })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [new TextRun({ text: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }), size: 22, color: colors.secondary })]
        })
      ]
    },
    // ===== MAIN CONTENT =====
    {
      properties: {
        page: { margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({ children: [new Paragraph({ 
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "Idiot Games - Document de Conception", size: 18, color: colors.secondary })]
        })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ 
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "— ", size: 20 }), new TextRun({ children: [PageNumber.CURRENT], size: 20 }), new TextRun({ text: " —", size: 20 })]
        })] })
      },
      children: [
        // ===== 1. RÉSUMÉ EXÉCUTIF =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Résumé Exécutif")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Idiot Games est une plateforme web regroupant plusieurs mini-jeux simples, addictifs et viraux. Le concept repose sur un principe éprouvé : plus c'est idiot, plus les gens aiment. Chaque jeu est conçu pour être compris en une seconde, joué en quelques clics, et partagé massivement sur les réseaux sociaux.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "La monétisation repose sur un modèle hybride : publicités regardées pour effectuer des actions dans les jeux, couplé à une option premium sans publicité. Les jeux se réinitialisent toutes les 48 heures pour créer un sentiment d'urgence et inciter les joueurs à revenir régulièrement.", size: 22 })]
        }),

        // ===== 2. CONCEPT GLOBAL =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Concept Global")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Philosophie du Projet")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Dans un monde où les gens paient pour des jeux qui ne rapportent rien (loot boxes, skins, microtransactions), Idiot Games propose une approche radicalement simple : des jeux immédiatement compréhensibles, sans barrière à l'entrée, où le seul investissement demandé est de regarder une courte publicité. Cette approche élimine la friction tout en garantissant une monétisation stable.", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Architecture de la Plateforme")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Un seul site web hébergeant plusieurs mini-jeux indépendants mais interconnectés par un système commun de Hall of Fame. Cette architecture permet d'attirer différents types de joueurs tout en maximisant le temps passé sur la plateforme.", size: 22 })]
        }),

        // ===== 3. LES TROIS JEUX =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Les Trois Jeux du MVP")] }),

        // Game 1: Team Vote
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Team Vote - Sondages Battles")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Principe : ", bold: true }), new TextRun({ text: "Les utilisateurs votent pour leur équipe préférée parmi des duels iconiques. Aucun commentaire, juste un pourcentage en temps réel. Pour valider son vote, il faut regarder une publicité de quelques secondes.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Exemples de battles :", bold: true })]
        }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("iOS vs Android")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("McDonald's vs Burger King")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Chat vs Chien")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Café vs Thé")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("PlayStation vs Xbox")] }),
        new Paragraph({
          spacing: { before: 150, after: 200 },
          children: [new TextRun({ text: "Pourquoi ça marche : ", bold: true }), new TextRun({ text: "Les gens adorent affirmer leur appartenance à une \"team\". Le format sans commentaire évite les débats toxiques tout en permettant l'expression d'une préférence. Les résultats en temps réel créent un effet FOMO (Fear Of Missing Out).", size: 22 })]
        }),

        // Game 2: Balle Lune
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Balle Lune - Jeu de Progression")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Principe : ", bold: true }), new TextRun({ text: "Une balle part de la Terre vers la Lune. Chaque publicité regardée fait monter la balle. Les joueurs peuvent aussi regarder une pub pour la faire redescendre. Le but ? Atteindre la Lune collectivement ou individuellement.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Mécanique de jeu :", bold: true })]
        }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("1 pub regardée = Balle monte d'un cran")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("1 pub regardée (option descente) = Balle descend d'un cran")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Animation visuelle satisfaisante à chaque action")] }),
        new Paragraph({
          spacing: { before: 150, after: 200 },
          children: [new TextRun({ text: "Pourquoi ça marche : ", bold: true }), new TextRun({ text: "L'absurdité du concept le rend mémorable et partageable. La progression visuelle donne un sentiment d'accomplissement immédiat. La dimension collective crée une communauté de joueurs.", size: 22 })]
        }),

        // Game 3: Trouve le Meme
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Trouve le Meme - Jeu de Hasard")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Principe : ", bold: true }), new TextRun({ text: "Une grille de cases blanches cache un meme (ex: Elon Musk, un chat drôle, un personnage culte). Pour révéler une case, le joueur doit regarder une publicité. Celui qui trouve le meme gagne le titre de Winner dans le tableau d'honneur.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Déroulement d'une partie :", bold: true })]
        }),
        new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("Le joueur arrive sur une grille de 50-100 cases")] }),
        new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("Il clique sur une case → publicité → case révélée")] }),
        new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("S'il trouve le meme : WINNER ! Entrée dans le Hall of Fame")] }),
        new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun("Le meme change toutes les 48 heures")] }),
        new Paragraph({
          spacing: { before: 150, after: 200 },
          children: [new TextRun({ text: "Pourquoi ça marche : ", bold: true }), new TextRun({ text: "Le hasard crée un effet \"peut-être cette fois\" très addictif. Les memes sont culturellement pertinents et drôles. Le Hall of Fame satisfait l'égo des gagnants et incite au partage.", size: 22 })]
        }),

        // ===== 4. SYSTÈME DE RÉINITIALISATION =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Système de Réinitialisation")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Reset Temporel (48h)")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Tous les jeux se réinitialisent automatiquement toutes les 48 heures. Cette mécanique est centrale à la rétention des utilisateurs et crée un cycle prévisible que les joueurs peuvent anticiper.", size: 22 })]
        }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Reset Anticipé (Événementiel)")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Certains jeux peuvent se réinitialiser plus tôt si un objectif est atteint rapidement. Le timer de 48h continue cependant son compte à rebours pour le cycle suivant.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Conditions de reset anticipé :", bold: true })]
        }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Trouve le Meme : ", bold: true }), new TextRun("Reset immédiat dès qu'un joueur trouve le meme caché")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Balle Lune : ", bold: true }), new TextRun("Reset si la balle atteint la Lune avant les 48h")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Team Vote : ", bold: true }), new TextRun("Pas de reset anticipé (les votes s'accumulent jusqu'au timer)")] }),
        new Paragraph({
          spacing: { before: 150, after: 200 },
          children: [new TextRun({ text: "Ce système crée un double effet : l'excitation de la victoire rapide ET la stabilité du cycle temporel. Les joueurs savent qu'il y aura toujours un nouveau jeu à un moment fixe, même si quelqu'un a gagné entre-temps.", size: 22 })]
        }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 Bénéfices du Reset")] }),
        new Table({
          columnWidths: [3000, 6000],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Effet", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Description", bold: true, size: 22 })] })] })
              ]
            }),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 3000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Urgence", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 6000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "\"Vite, avant le reset !\" - Les joueurs reviennent avant la fin du cycle", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 3000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Renouveau", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 6000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Nouveau meme, nouvelles battles - Le contenu reste frais", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 3000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Équité", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 6000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Nouveaux joueurs = mêmes chances que les anciens", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 3000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Habitude", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 6000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Crée une routine de jeu régulière", size: 22 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 100 }, children: [] }),

        // ===== 5. MODÈLE ÉCONOMIQUE =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Modèle Économique")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 Sources de Revenus")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Publicités Vidéo")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Chaque action dans un jeu (voter, révéler une case, monter/descendre la balle) nécessite le visionnage d'une publicité de 5-30 secondes. Les réseaux publicitaires comme Google AdMob, Unity Ads ou ironSource paient typiquement entre $0.01 et $0.05 par publicité regardée selon la géographie de l'utilisateur et le taux d'engagement.", size: 22 })]
        }),
        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Abonnement Premium")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Une option premium permet de jouer sans publicité, proposée à deux tarifs :", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Mensuel : $2.99/mois")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Annuel : $19.99/an (économie de 44%)")] }),
        new Paragraph({
          spacing: { before: 150, after: 200 },
          children: [new TextRun({ text: "Cette option s'adresse aux joueurs réguliers qui préfèrent payer plutôt que subir les publicités. Elle constitue un revenu récurrent prévisible.", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 Estimation des Revenus")] }),
        new Table({
          columnWidths: [3500, 2500, 3000],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 3500, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Scénario", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Joueurs/jour", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Revenus/mois", bold: true, size: 22 })] })] })
              ]
            }),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 3500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Lancement modeste", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "100", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 3000, type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "$150 - $300", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 3500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Croissance normale", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1 000", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 3000, type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "$1 500 - $3 000", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 3500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Effet viral", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "10 000", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 3000, type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "$15 000 - $30 000", size: 22 })] })] })
            ]})
          ]
        }),
        new Paragraph({
          spacing: { before: 100, after: 200 },
          children: [new TextRun({ text: "Note : Ces estimations sont basées sur une moyenne de 10 actions/joueur/jour et un RPM (Revenue Per Mille) de $10-20.", size: 20, italics: true, color: colors.secondary })]
        }),

        // ===== 6. ROADMAP TECHNIQUE =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Roadmap de Développement")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 Phase 1 - MVP (1-2 semaines)")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Développement des 3 jeux de base")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Système de publicités intégré")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Système de reset 48h automatisé")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Hall of Fame basique")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Déploiement sur Vercel")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun("6.2 Phase 2 - Croissance (1 mois)")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Système Premium (abonnement sans pub)")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Partage sur réseaux sociaux optimisé")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Analytics et tracking")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Optimisation mobile")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun("6.3 Phase 3 - Expansion (continu)")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Ajout de nouveaux mini-jeux selon tendances")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Système de badges et achievements")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Classements mondiaux")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Battles personnalisées par les utilisateurs")] }),

        // ===== 7. POINTS CLÉS =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. Points Clés du Succès")] }),
        new Table({
          columnWidths: [2500, 6500],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Facteur", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 6500, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Implémentation", bold: true, size: 22 })] })] })
              ]
            }),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Simplicité", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 6500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Concept compréhensible en 1 seconde, aucun tutoriel nécessaire", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Addiction", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 6500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Boucle de jeu courte, récompense immédiate, envie de rejouer", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Viralité", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 6500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Contenu drôle et partageable, battles controversées naturellement", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Rétention", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 6500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Reset 48h, Hall of Fame, nouveautés régulières", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Monétisation", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 6500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Pubs non intrusives, premium optionnel, modèle hybride stable", size: 22 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 }, children: [] }),

        // ===== CONCLUSION =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("8. Conclusion")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Idiot Games représente une opportunité de créer un projet web simple, potentiellement viral et monétisable rapidement. Le concept s'appuie sur des mécaniques psychologiques éprouvées : l'appartenance à une équipe, le hasard gratifiant, la progression visuelle et l'urgence temporelle.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "La roadmap proposée permet un lancement rapide avec un MVP fonctionnel en 1-2 semaines, puis une itération basée sur les retours utilisateurs et les données d'utilisation. L'architecture modulaire permet d'ajouter facilement de nouveaux mini-jeux sans refonte du système.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Ce projet est particulièrement pertinent dans le contexte actuel où les gens cherchent des divertissements simples et gratuits, acceptant de payer par leur attention (publicités) plutôt que par leur portefeuille.", size: 22 })]
        })
      ]
    }
  ]
});

// Generate and save
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/Idiot_Games_Conception.docx", buffer);
  console.log("✅ Document créé: /home/z/my-project/download/Idiot_Games_Conception.docx");
});
