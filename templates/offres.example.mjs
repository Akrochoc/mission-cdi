// Modele d'offres pour build-cv-lettres.mjs.
// Copier en data/offres.mjs (ignore par git) :
//   cp templates/offres.example.mjs data/offres.mjs
//
// Une entree par offre visee. Le plus simple : demander a Claude Code
// "ajoute cette offre a data/offres.mjs" en collant l'annonce.

export const OFFRES = [
  {
    slug: 'Entreprise_Poste',  // utilise dans le nom des fichiers produits
    name: 'Entreprise',        // affiche a cote de ton nom ; '' si tu passes par un cabinet
    lieu: 'Ville, France',
    lang: 'fr',                // 'fr' ou 'en'
    date: null,                // AAAA-MM-JJ ; null = aujourd'hui
    campagne: 'candidatures',  // sous-dossier de output/
    logo: null,                // fichier dans logos/, ex. 'entreprise.png' ; null sans logo
    logoW: 40, logoH: 40,
    // Couleurs de la marque (prises sur le logo ou le site).
    primary: '#1F3A5F', accent: '#2E7D6B', tagBg: '#EEF2F7', tagBorder: '#CBD5E1',
    tagline: 'Intitulé visé - ton angle en une ligne',
    summary: "Quatre ou cinq lignes adaptées à l'annonce, avec <strong>les preuves en gras</strong>.",
    tags: ['Compétence 1', 'Compétence 2', 'Compétence 3', 'Compétence 4'], // doivent tenir sur une ligne
    jobs: [
      { ref: 'actuel', keys: ['resultat', 'mission', 'outil'] },
      { ref: 'precedent', keys: ['resultat'] },
    ],
    projets: [],               // ex. [{ ref: 'monprojet', keys: ['resume'] }]
  },
];

// Lettres de motivation, par slug d'offre. Une offre sans lettre n'en produit pas.
export const LETTRES = {
  Entreprise_Poste: {
    objet: 'Candidature au poste de ...',
    dest: 'Entreprise<br>Ville',
    paras: [
      "Premier paragraphe : ce qui, dans l'annonce, correspond à ton parcours.",
      'Deuxième paragraphe : une preuve chiffrée.',
      'Troisième paragraphe : pourquoi cette entreprise.',
    ],
  },
};
