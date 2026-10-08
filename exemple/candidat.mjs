// Exemple complet : la candidate.
// Profil entierement fictif. Voir exemple/README.md.
// Dans ton usage reel, ce fichier s'appelle data/candidat.mjs (ignore par git).

export const CANDIDAT = {
  nom: 'Inès Barbier',
  email: 'ines.barbier@exemple.fr',
  telephone: '06 12 34 56 78',
  linkedin: 'linkedin.com/in/ines-barbier-exemple',
  ville: 'Lyon, France',
  permis: true,
  photo: null,

  experiences: {
    mutuelle: {
      company: 'Mutuelle Saint-Clair - mutuelle santé régionale, 180 salariés',
      period: 'Mars 2024 - Présent',
      role: 'Conseillère relation adhérents, contrats collectifs',
      bullets: {
        portefeuille: 'Suivi d\'un portefeuille de <strong>320 entreprises adhérentes</strong>, de 5 à 200 salariés, en autonomie complète',
        renouvellement: '<strong>94% des contrats collectifs renouvelés</strong> sur l\'exercice 2025, contre 89% l\'année précédente',
        reclamations: 'Traitement de <strong>40 à 60 demandes par jour</strong>, dont les réclamations escaladées par le centre d\'appels',
        outil: 'Salesforce et Zendesk au quotidien, et rédaction des réponses types utilisées par l\'équipe',
        formation: 'Accompagnement de <strong>6 nouveaux conseillers</strong> en 2025, de la prise en main des outils au premier mois en autonomie',
      },
    },
    agence: {
      company: 'Edimark - agence de communication, 25 salariés',
      period: 'Septembre 2021 - Février 2024',
      role: 'Chargée de clientèle',
      bullets: {
        comptes: '<strong>18 comptes clients</strong> suivis de la prise de brief à la facturation',
        croissance: '<strong>23% de chiffre d\'affaires supplémentaire</strong> sur le portefeuille en deux ans, par vente de prestations complémentaires',
        coordination: 'Coordination quotidienne entre les clients et une équipe de production de 4 personnes',
        retard: 'Gestion des retards et des reprises de projet, y compris les conversations difficiles sur le budget',
      },
    },
    terrain: {
      company: 'Décathlon Lyon Part-Dieu',
      period: 'Juin 2020 - Août 2021',
      role: 'Vendeuse conseil, rayon running',
      bullets: {
        conseil: 'Conseil et vente en magasin, <strong>120 à 150 clients par semaine</strong>',
      },
    },
  },

  projets: {
    relances: {
      company: 'Outil de suivi des renouvellements',
      period: '2025',
      role: 'Projet personnel, repris par l\'équipe',
      bullets: {
        resume: 'Tableau de relance automatisé (Google Sheets et Apps Script) qui signale les contrats à échéance 90 jours avant&#160;: <strong>repris par les 4 conseillers</strong> de l\'équipe',
      },
    },
  },

  textes: {
    fr: {
      edu: [
        ['Master Management de la relation client - ', 'IAE Lyon, Université Jean Moulin', '2021'],
        ['Licence Information et communication - ', 'Université Lumière Lyon 2', '2019'],
        ['Certification HubSpot Service Hub - ', 'en ligne', '2025'],
      ],
      skills: [
        ['Métier&#160;:', 'Suivi de portefeuille, renouvellement, gestion des réclamations, formation des utilisateurs'],
        ['Outils&#160;:', 'Salesforce, Zendesk, HubSpot, Notion, Google Sheets'],
        ['Langues&#160;:', 'Français (natif), Anglais (B2, TOEIC 870)'],
      ],
    },
    en: {
      edu: [
        ['Master in Customer Relationship Management - ', 'IAE Lyon, Jean Moulin University', '2021'],
        ['Bachelor in Communication - ', 'Lumière Lyon 2 University', '2019'],
        ['HubSpot Service Hub certification - ', 'online', '2025'],
      ],
      skills: [
        ['Skills:', 'Account management, renewals, complaint handling, user onboarding'],
        ['Tools:', 'Salesforce, Zendesk, HubSpot, Notion, Google Sheets'],
        ['Languages:', 'French (native), English (B2, TOEIC 870)'],
      ],
    },
  },
};
