/* Donnees du cockpit, version vide.
   Copier ce fichier en donnees.js (ignore par git) pour y mettre les tiennes :
     cp donnees.exemple.js donnees.js

   Une fois le cockpit publie comme artefact Claude avec sa base partagee,
   les dossiers vivent dans la base (collection "candidatures") et DOSSIERS
   ne sert plus que de secours hors ligne. Les offres restent ici.

   OFFRES : une ligne par offre reperee.
     n   numero unique (entier)          e   entreprise
     p   intitule du poste               v   lieu
     mi  salaire min (euros, ou null)    ma  salaire max (euros, ou null)
     d   date de publication AAAA-MM-JJ  t   note sur 5 (ex. 4.2)
     src source (LinkedIn, WTTJ...)      u   lien de l'annonce
     r   resume en une phrase            s   "ecartee" pour l'ecarter d'office
     nv  1 si l'offre est nouvelle       a   date d'ajout AAAA-MM-JJ
     pv  1 si la note est provisoire (annonce pas encore lue)

   DOSSIERS : une ligne par candidature (copie de secours de la base).
     id  identifiant (ex. "entreprise-poste"), e entreprise, p poste, l lieu,
     c   cabinet de recrutement, s statut (reperee, prete, envoyee, relancee,
         reponse, entretien, offre, refus, sans_suite, pause),
     de  date d'envoi, r date de relance, no notes, u lien,
     et  etape en cours, a prochaine action, ad date de l'action, h heure,
     j   journal [{d:"AAAA-MM-JJ", s:"statut"}]

   TYPES_OFFRE : filtres par type de poste dans l'onglet Offres (facultatif).
     {id:"dev", nom:"Developpeur", motif:"developpeur|developer|dev\\b"}
     Le motif est une expression reguliere testee sur l'intitule du poste.
*/
var OFFRES = [];
var DOSSIERS = [];
var TYPES_OFFRE = [];
