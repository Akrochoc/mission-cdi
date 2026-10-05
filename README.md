# Mission CDI

> De l'offre repérée au contrat signé, ta recherche d'emploi pilotée avec Claude Code.

Un poste de pilotage de recherche d'emploi, à utiliser avec [Claude Code](https://claude.com/claude-code) : évaluation des offres, CV et lettres adaptés à chaque annonce, suivi des candidatures et préparation des entretiens.

Ce dépôt est un fork de [career-ops](https://github.com/santifer/career-ops) (version 1.32.0), créé par Santiago Fernández de Valderrama et distribué sous licence MIT. Le fonctionnement d'origine est décrit dans [README.career-ops.md](README.career-ops.md) (en anglais) et dans le [guide en français](README.fr.md).

## Ce que ce fork ajoute

1. **Le français par défaut.** Le profil d'exemple produit les rapports, CV et lettres en français, avec le vocabulaire du marché français (CDI, SYNTEC, RTT...).
2. **Un cockpit de candidatures** (`cockpit/`) : une page qui regroupe l'agenda des entretiens, le suivi des candidatures (étapes, relances, prochaine action), les offres à trier, et une fiche de préparation par entretien (interlocuteurs, entreprise, pitch, questions probables, mise en situation, questions à poser), dont on choisit les sections affichées. Claude Code sait la remplir et la publier : ses instructions sont dans `cockpit/INSTRUCTIONS.md`.
3. **Un générateur de CV et de lettres** (`build-cv-lettres.mjs`) : un CV d'une page par offre, aux couleurs de l'entreprise, avec contrôle automatique de la mise en page.

## Démarrer

Prérequis : [Node.js](https://nodejs.org) 18 ou plus récent, et Claude Code.

```bash
npm install
npx playwright install chromium
```

Ouvre ensuite Claude Code dans ce dossier. Au premier message, il vérifie l'installation et te guide pour créer ton CV (`cv.md`), ton profil (`config/profile.yml`) et tes critères de recherche (`portals.yml`). Dis-lui ton métier et le type de postes que tu vises : il adapte le système à ta cible.

Ensuite, colle simplement le lien d'une offre : il l'évalue, rédige un rapport et prépare le CV.

## Le cockpit

Le cockpit est une page HTML, construite à partir de quelques fichiers :

| Fichier | Rôle |
|---|---|
| `cockpit-coquille.html` | la mise en page et le style |
| `donnees.js` | tes offres et une copie de secours de tes dossiers (à créer depuis `donnees.exemple.js`) |
| `fiche-<id>.js` | une fiche de préparation par entretien (modèle dans `modeles/fiche-entretien.js`) |
| `app.js`, `fiches.js` | la logique |
| `synchro.mjs` | ajoute au cockpit les offres trouvées par le scan et les candidatures du suivi career-ops |
| `INSTRUCTIONS.md` | la marche à suivre pour Claude Code |

Pour le construire :

```bash
cd cockpit
cp donnees.exemple.js donnees.js
node assembler.mjs
```

Au quotidien, tu n'as pas à toucher à ces fichiers : parle à Claude Code.

- « Publie le cockpit » : il assemble la page et la publie comme artefact.
- « Ajoute les offres du scan au cockpit » : il lance `node cockpit/synchro.mjs --offres` et note chaque offre.
- « J'ai postulé chez X » ou « X m'a répondu » : il met le dossier à jour.
- « J'ai un entretien jeudi à 14h avec Y, chez X » : il fait les recherches et écrit la fiche de préparation, avec les questions à poser.
- « L'entretien s'est bien passé, voici mes notes » : il fait le bilan et te propose un mail de remerciement.

Le plus pratique est de le publier comme **artefact Claude**, avec sa base partagée : demande à Claude Code de « publier `cockpit/cockpit.html` comme artefact avec la capacité db ». Tes candidatures vivent alors dans la base (collection `candidatures`), et tu peux changer une étape ou une prochaine action directement depuis la page. Claude peut aussi les mettre à jour pour toi : « passe le dossier X en entretien, jeudi 14h ».

Attention : un artefact partagé par lien est lisible par toute personne qui a ce lien, et lors d'un test, un simple lecteur a pu écrire dans la base malgré la règle d'accès. Ne partage pas le lien.

Les instructions sont chargées automatiquement par Claude Code. Avec un autre outil (Codex, OpenCode...), demande-lui de lire `cockpit/INSTRUCTIONS.md`.

## Le générateur de CV et de lettres

```bash
cp templates/candidat.example.mjs data/candidat.mjs
cp templates/offres.example.mjs data/offres.mjs
node build-cv-lettres.mjs
```

- `data/candidat.mjs` : ton identité, tes expériences (avec leurs puces), ta formation, tes compétences.
- `data/offres.mjs` : une entrée par offre (couleurs, accroche, résumé, compétences clés, expériences et puces retenues) et, si tu veux, la lettre de motivation.
- Les PDF arrivent dans `output/<campagne>/CV` et `output/<campagne>/LM`.
- Chaque CV est contrôlé : il doit tenir sur une page, et les compétences clés sur une ligne. Sinon, le script affiche `ECHEC CONTROLE`.

Le plus simple : colle une annonce à Claude Code et demande-lui d'ajouter l'offre à `data/offres.mjs` à partir de ton CV, puis de lancer le générateur.

## Tes données restent privées

Les fichiers qui contiennent tes informations sont ignorés par git : `cv.md`, `config/profile.yml`, `portals.yml`, `data/`, `reports/`, `output/`, `interview-prep/`, `cockpit/donnees.js`, `cockpit/fiche-*.js`, `cockpit/cockpit.html` et `logos/`. Si tu publies ton propre fork, vérifie avec `git status` qu'aucun de ces fichiers n'apparaît avant de pousser.

## Licence

MIT, comme le projet d'origine : voir [LICENSE](LICENSE). Le nom « career-ops » appartient à son auteur : voir [TRADEMARK.md](TRADEMARK.md).
