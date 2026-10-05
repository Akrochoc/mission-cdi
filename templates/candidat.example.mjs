// Modele de donnees candidat pour build-cv-lettres.mjs.
// Copier en data/candidat.mjs (ignore par git) puis remplacer chaque valeur :
//   cp templates/candidat.example.mjs data/candidat.mjs
//
// Regle d'or : n'ecrire que des faits vrais, chiffres compris. Le generateur
// choisit et reordonne, il n'invente rien.

export const CANDIDAT = {
  nom: 'Prénom Nom',
  email: 'prenom.nom@exemple.fr',
  telephone: '06 00 00 00 00',
  linkedin: 'linkedin.com/in/ton-profil',
  ville: 'Ville, France',      // affichee si l'offre ne precise pas de lieu
  permis: true,                // false pour ne pas afficher "Permis B"
  photo: null,                 // ex. 'data/photo.jpg' ; null pour un CV sans photo

  // Une entree par experience, dans l'ordre antichronologique. Chaque offre
  // choisit ses experiences par leur cle (ici "actuel", "precedent") et ses
  // puces par leur cle (ici "resultat", "mission"...).
  experiences: {
    actuel: {
      company: 'Entreprise actuelle - description courte',
      period: 'Janvier 2025 - Présent',
      role: 'Intitulé du poste',
      bullets: {
        resultat: 'Une réalisation chiffrée, avec <strong>le chiffre en gras</strong>',
        mission: 'Une mission principale, décrite par un verbe d\'action',
        outil: 'Les outils ou méthodes utilisés au quotidien',
      },
    },
    precedent: {
      company: 'Entreprise précédente - description courte',
      period: 'Septembre 2022 - Décembre 2024',
      role: 'Intitulé du poste',
      bullets: {
        resultat: 'Une réalisation chiffrée',
        mission: 'Une mission principale',
      },
    },
  },

  // Facultatif, meme format. Laisser vide si aucun projet.
  projets: {},

  // Parties fixes du CV, par langue.
  textes: {
    fr: {
      edu: [
        ['Diplôme ou certification - ', 'École, Ville', '2022'],
      ],
      skills: [
        ['Métier&#160;:', 'Compétences propres à ton métier'],
        ['Outils&#160;:', 'Logiciels et outils maîtrisés'],
        ['Langues&#160;:', 'Français (natif), Anglais (B2)'],
      ],
    },
    en: {
      edu: [
        ['Degree or certification - ', 'School, City', '2022'],
      ],
      skills: [
        ['Skills:', 'Job-specific skills'],
        ['Tools:', 'Software and tools'],
        ['Languages:', 'French (native), English (B2)'],
      ],
    },
  },
};
