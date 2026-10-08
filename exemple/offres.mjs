// Exemple complet : les offres visées et les lettres.
// Entreprises entierement fictives. Voir exemple/README.md.
// Dans ton usage reel, ce fichier s'appelle data/offres.mjs (ignore par git).

export const OFFRES = [

  // 1. Candidature en direct. Couleurs de la marque, logo si on en a un.
  {
    slug: 'Pilona_CSM',
    date: '2026-10-08',
    campagne: '',           // vide : les PDF vont directement dans le dossier de sortie
    lieu: 'Lyon, France',
    lang: 'fr',
    name: 'Pilona',
    logo: null,            // en vrai : 'pilona.png' dans logos/
    logoW: 36, logoH: 36,
    primary: '#1C4E3A', accent: '#1C4E3A',
    tagBg: '#ECF3EF', tagBorder: '#C6DCD0',
    tagline: 'Customer Success Manager - Réseaux de franchises et renouvellements',
    summary: "Vous cherchez quelqu'un qui tient un portefeuille de réseaux multisites et qui sait faire adopter un outil à des utilisateurs qui ne l'ont pas choisi&#160;: c'est mon quotidien. À la Mutuelle Saint-Clair, je suis <strong>320 entreprises adhérentes</strong> de 5 à 200 salariés, avec <strong>94% de contrats renouvelés en 2025</strong> contre 89% l'année d'avant. Avant cela, chez Edimark, j'ai porté <strong>18 comptes clients</strong> de bout en bout et fait progresser leur chiffre d'affaires de <strong>23% en deux ans</strong>. J'ai aussi construit l'outil de relance des échéances que mes 4 collègues utilisent aujourd'hui.",
    tags: ['Portefeuille multisites', 'Renouvellements', 'Adoption produit', 'Salesforce et Zendesk', 'Formation des utilisateurs'],
    jobs: [
      { ref: 'mutuelle', keys: ['portefeuille', 'renouvellement', 'formation', 'outil'] },
      { ref: 'agence', keys: ['comptes', 'croissance'] },
      { ref: 'terrain', keys: ['conseil'] },
    ],
    projets: [
      { ref: 'relances', keys: ['resume'] },
    ],
  },

  // 2. Candidature via un cabinet, employeur final non communiqué :
  //    ni logo ni nom d'entreprise, et un neutre à la place de la couleur.
  {
    slug: 'Ardent_CSM',
    date: '2026-10-08',
    campagne: '',           // vide : les PDF vont directement dans le dossier de sortie
    lieu: 'Paris, France',
    lang: 'fr',
    name: 'Éditeur de logiciel RH',
    logo: null,
    primary: '#2B3A4A', accent: '#2B3A4A',
    tagBg: '#EEF1F4', tagBorder: '#CBD3DB',
    tagline: 'Customer Success Manager - Comptes PME et montée en usage',
    summary: "L'annonce décrit un poste de suivi de comptes PME sur un logiciel déployé auprès d'équipes entières, avec la responsabilité du renouvellement&#160;: c'est la fonction que j'exerce aujourd'hui. À la Mutuelle Saint-Clair, je suis <strong>320 entreprises adhérentes</strong> et j'ai obtenu <strong>94% de renouvellements en 2025</strong>. Je traite <strong>40 à 60 demandes par jour</strong>, dont les réclamations que le centre d'appels n'a pas résolues, et j'ai formé <strong>6 nouveaux conseillers</strong> l'an dernier.",
    tags: ['Suivi de comptes PME', 'Renouvellements', 'Réclamations', 'Formation des utilisateurs'],
    jobs: [
      { ref: 'mutuelle', keys: ['portefeuille', 'renouvellement', 'reclamations'] },
      { ref: 'agence', keys: ['comptes', 'retard'] },
    ],
  },

  // 3. Le CV générique : aucune annonce, aucun nom d'entreprise.
  //    Celui qu'on joint à un cabinet, à une candidature spontanée ou à un
  //    échange sur un réseau professionnel.
  {
    slug: 'Profil_CSM',
    date: '2026-10-08',
    campagne: '',           // vide : les PDF vont directement dans le dossier de sortie
    lieu: 'Lyon, France',
    lang: 'fr',
    name: '',
    logo: null,
    primary: '#2B3A4A', accent: '#2B3A4A',
    tagBg: '#EEF1F4', tagBorder: '#CBD3DB',
    tagline: 'Customer Success Manager - Logiciel B2B',
    summary: "Je suis conseillère relation adhérents à la Mutuelle Saint-Clair, où je suis un portefeuille de <strong>320 entreprises</strong> de 5 à 200 salariés&#160;: adoption des services, réclamations, et surtout renouvellement des contrats collectifs, avec <strong>94% de reconduction en 2025</strong>. J'ai appris le suivi de comptes en agence de communication, sur <strong>18 clients</strong> et <strong>23% de croissance en deux ans</strong>. Je cherche aujourd'hui à faire le même métier sur un logiciel, auprès d'équipes qui l'utilisent tous les jours.",
    tags: ['Suivi de portefeuille', 'Renouvellements', 'Adoption produit', 'Salesforce et Zendesk'],
    jobs: [
      { ref: 'mutuelle', keys: ['portefeuille', 'renouvellement', 'formation'] },
      { ref: 'agence', keys: ['comptes', 'croissance'] },
      { ref: 'terrain', keys: ['conseil'] },
    ],
    projets: [
      { ref: 'relances', keys: ['resume'] },
    ],
  },
];

// Les lettres, par slug. Une offre sans lettre n'en produit pas : c'est le cas
// du CV générique.
export const LETTRES = {

  Pilona_CSM: {
    objet: 'Candidature au poste de Customer Success Manager',
    dest: 'Pilona<br>Lyon',
    paras: [
      "Votre annonce dit que le Customer Success Manager suit entre 40 et 60 réseaux, et qu'il est responsable du renouvellement annuel. C'est la double contrainte que je connais le mieux&#160;: beaucoup de comptes, et une échéance qui tombe quoi qu'il arrive.",
      "Je suis conseillère relation adhérents à la Mutuelle Saint-Clair, où je suis 320 entreprises adhérentes de 5 à 200 salariés. En 2025, 94% des contrats collectifs de mon portefeuille ont été reconduits, contre 89% l'année précédente. L'écart ne vient pas d'un argument commercial&#160;: il vient d'un tableau de relance que j'ai construit, qui signale chaque échéance 90 jours avant, et que mes 4 collègues utilisent aujourd'hui.",
      "Vous insistez sur l'adoption par des utilisateurs qui n'ont pas choisi l'outil. Dans un réseau de franchises, c'est le franchisé qui décide d'ouvrir le logiciel le lundi matin, pas le siège qui l'a signé. Je connais cette situation par les entreprises adhérentes&#160;: le dirigeant signe, et ce sont les salariés qui utilisent ou n'utilisent pas les services. J'ai formé 6 nouveaux conseillers l'an dernier et je sais ce qui fait qu'une prise en main tient au-delà de la première semaine.",
      "Un point de transparence&#160;: je n'ai jamais travaillé chez un éditeur de logiciel. J'arrive avec le métier de la relation client et pas avec la culture produit, que j'apprendrai. Je serais heureuse de vous rencontrer pour en parler, et de voir ce que Pilona montre à ses franchisés.",
    ],
  },

  Ardent_CSM: {
    objet: 'Candidature au poste de Customer Success Manager',
    dest: "À l'attention du cabinet Ardent Conseil<br>Paris",
    paras: [
      "Votre annonce cherche un Customer Success Manager pour un éditeur de logiciel RH, sur un portefeuille de PME, avec la responsabilité du renouvellement. Je tiens aujourd'hui cette fonction, dans un autre secteur, et je souhaite la poursuivre chez un éditeur.",
      "À la Mutuelle Saint-Clair, je suis 320 entreprises adhérentes de 5 à 200 salariés. 94% des contrats collectifs de mon portefeuille ont été renouvelés en 2025, contre 89% l'année précédente. Je traite 40 à 60 demandes par jour, dont les réclamations que le centre d'appels n'a pas su résoudre&#160;: ce sont celles qui décident de la reconduction.",
      "Le sujet des ressources humaines m'est familier par mes interlocuteurs. Mes contacts quotidiens sont des responsables des ressources humaines et des dirigeants de PME, qui gèrent la mutuelle entre deux urgences et jugent un prestataire à la vitesse à laquelle un dossier se règle.",
      "Je ne connais pas encore le nom de l'entreprise que vous accompagnez et je serais heureuse d'en savoir plus. Je suis disponible pour un échange à votre convenance.",
    ],
  },
};
