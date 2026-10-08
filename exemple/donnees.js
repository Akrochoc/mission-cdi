/* Exemple complet : les donnees du cockpit.
   Entreprises fictives. Voir exemple/README.md.
   Pour voir le cockpit rempli :
     cp exemple/donnees.js cockpit/donnees.js
     cp exemple/fiche-pilona.js cockpit/fiche-pilona.js
     cd cockpit && node assembler.mjs
   Dans ton usage reel, ce fichier s'appelle cockpit/donnees.js (ignore par git),
   et les dossiers vivent dans la base de l'artefact. Le format des champs est
   decrit dans cockpit/donnees.exemple.js. */

var OFFRES = [
  {n:1, e:"Pilona", p:"Customer Success Manager", v:"Lyon", mi:34000, ma:38000, d:"2026-09-29", t:4.5, src:"Welcome to the Jungle", u:"https://exemple.fr/offres/pilona-csm", r:"Réseaux de franchises, portefeuille de 40 à 60 comptes, renouvellement et montée en usage.", a:"2026-10-06"},
  {n:2, e:"Ardent Conseil", p:"Customer Success Manager (éditeur de logiciel RH)", v:"Paris", mi:36000, ma:42000, d:"2026-10-01", t:4.1, src:"APEC", u:"https://exemple.fr/offres/ardent-csm", r:"Cabinet, employeur final non communiqué. Comptes PME, renouvellement.", a:"2026-10-06"},
  {n:3, e:"Ovanie", p:"Account Manager", v:"Villeurbanne", mi:33000, ma:36000, d:"2026-10-03", t:3.6, src:"LinkedIn", u:"https://exemple.fr/offres/ovanie-am", r:"Éditeur de logiciel pour cabinets comptables. Portefeuille existant, peu de nouveaux comptes.", nv:1, a:"2026-10-07"},
  {n:4, e:"Rhodana", p:"Chargé de relation client", v:"Lyon", mi:30000, ma:33000, d:"2026-10-05", t:2.8, src:"France Travail", u:"https://exemple.fr/offres/rhodana-crc", r:"Centre d'appels, aucun télétravail. Sous la fourchette visée.", s:"ecartee", a:"2026-10-07"},
  {n:5, e:"Belisse", p:"Customer Success Manager", v:"Paris, 3 jours sur site", mi:38000, ma:44000, d:"2026-10-06", t:3.9, src:"Welcome to the Jungle", u:"https://exemple.fr/offres/belisse-csm", r:"Bonne rémunération, mais présence à Paris 3 jours par semaine.", nv:1, pv:1, a:"2026-10-07"}
];

var DOSSIERS = [
  {id:"pilona-customer-success-manager", e:"Pilona", p:"Customer Success Manager", l:"Lyon", s:"entretien", de:"2026-10-07", no:"Premier entretien passé le 9 octobre avec Alice Reynaud. Deuxième tour avec le cofondateur.", u:"https://exemple.fr/offres/pilona-csm", et:"2e tour, avec le cofondateur", a:"Entretien en visioconférence", ad:"2026-10-15", h:"14:00", j:[{d:"2026-10-06", s:"prete"},{d:"2026-10-07", s:"envoyee"},{d:"2026-10-09", s:"entretien"}]},
  {id:"ardent-conseil-customer-success-manager", e:"Ardent Conseil", p:"Customer Success Manager", l:"Paris", c:"Ardent Conseil", s:"envoyee", de:"2026-10-08", r:"2026-10-15", no:"Employeur final non communiqué. CV sans logo ni nom.", u:"https://exemple.fr/offres/ardent-csm", a:"Relancer si pas de réponse", ad:"2026-10-15", j:[{d:"2026-10-08", s:"envoyee"}]},
  {id:"ovanie-account-manager", e:"Ovanie", p:"Account Manager", l:"Villeurbanne", s:"prete", no:"CV et lettre prêts. À envoyer après l'entretien Pilona.", u:"https://exemple.fr/offres/ovanie-am", a:"Envoyer la candidature", ad:"2026-10-16", j:[{d:"2026-10-07", s:"reperee"},{d:"2026-10-08", s:"prete"}]}
];

var TYPES_OFFRE = [
  {id:"csm", nom:"Customer Success", motif:"customer success|csm|success manager"},
  {id:"am", nom:"Account Management", motif:"account manager|chargé de clientèle|charge de clientele"},
  {id:"relation", nom:"Relation client", motif:"relation client|conseiller|support"}
];
