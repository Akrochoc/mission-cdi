# Cockpit de candidatures : instructions pour l'agent

Le cockpit (`cockpit/`) est une page HTML qui regroupe l'agenda, le suivi des candidatures, les offres et une fiche de préparation par entretien. Ces instructions décrivent cinq gestes : construire et publier, ajouter des offres, suivre une candidature, préparer un entretien, faire le bilan. Écris tout ce qui est destiné à l'utilisateur dans la langue de `language.output` (français par défaut).

## Les fichiers

| Fichier | Contenu | Suivi par git |
|---|---|---|
| `cockpit-coquille.html` | mise en page et style | oui |
| `app.js`, `fiches.js` | logique de la page | oui |
| `donnees.exemple.js` | modèle vide des données, avec la description des champs | oui |
| `donnees.js` | les offres (`OFFRES`), une copie de secours des dossiers (`DOSSIERS`), les filtres de type (`TYPES_OFFRE`) | **non** |
| `fiche-<id>.js` | une fiche de préparation par entretien | **non** |
| `modeles/fiche-entretien.js` | modèle de fiche complet | oui |
| `cockpit.html` | la page assemblée | **non** |
| `synchro.mjs` | passe du suivi career-ops au cockpit | oui |

## 1. Construire et publier

```bash
cd cockpit && node assembler.mjs
```

L'assembleur prend `donnees.js` (ou `donnees.exemple.js` s'il n'existe pas), `fiches.js`, toutes les `fiche-*.js` et `app.js`.

**Publication comme artefact Claude** (si l'outil de publication d'artefacts est disponible) : publie `cockpit/cockpit.html` avec la capacité de base partagée :

```json
{ "db": { "rules": [ { "path": "", "read": "view", "write": "admin" } ] } }
```

- À la première publication, enregistre l'URL de l'artefact dans `data/cockpit-url.txt` (ignoré par git). Aux suivantes, republie à cette URL au lieu d'en créer une nouvelle.
- Rappelle à l'utilisateur de ne pas partager le lien : la page contient ses candidatures. Lors d'un test, la règle `write: admin` n'a pas empêché un simple lecteur d'écrire : ne la présente pas comme une protection.
- Sans outil d'artefact, le cockpit s'ouvre dans un navigateur, en lecture seule, à partir de `DOSSIERS` et `OFFRES`.

**La base** contient deux collections :
- `candidatures` : un document par dossier, identifiant au format `entreprise-poste` en minuscules et tirets. Champs : `entreprise`, `poste`, `lieu`, `cabinet`, `statut`, `dateEnvoi`, `relance`, `campagne`, `note`, `triage` (nombre), `url`, `etape`, `action`, `actionDate`, `heure`, `journal` (liste de `{d, s}`), `maj`. Statuts : `reperee`, `prete`, `envoyee`, `relancee`, `reponse`, `entretien`, `offre`, `refus`, `sans_suite`, `pause`.
- `offres` : l'état d'une offre décidé depuis la page, identifiant = numéro `n` de l'offre, `{etat: "ecartee" | "a_trier", maj}`.

Dès que la base répond, la page affiche ses dossiers et ignore `DOSSIERS`. Écris donc toujours dans la base, en passant la `version` lue (`if_version`) pour ne pas écraser une modification faite depuis la page.

## 2. Ajouter des offres

Après un scan, ou quand l'utilisateur colle des annonces :

```bash
node cockpit/synchro.mjs --offres
```

Le script ajoute les lignes non cochées de `data/pipeline.md` à `OFFRES`, sans doublon, avec l'étiquette « nouvelle » (`nv:1`) et la date d'ajout (`a`). Il retire l'étiquette des vagues précédentes. Complète ensuite, pour chaque nouvelle offre, `r` (résumé en une phrase) et `t` (note sur 5) à partir de l'évaluation, puis retire `pv` (note provisoire). Reconstruis et republie.

## 3. Suivre une candidature

- **Nouveau dossier** : quand l'utilisateur décide de postuler, crée le document avec `statut: "prete"`, la note de triage, l'URL et une prochaine action datée.
- **Envoi** : `statut: "envoyee"`, `dateEnvoi` du jour, `relance` à J+7.
- **Chaque changement d'étape** : mets à jour `statut`, ajoute `{d: date, s: statut}` à `journal`, mets `maj` à jour. Pour un entretien, remplis `etape` (ex. « 2e tour : mise en situation »), `action`, `actionDate` et `heure`.
- **Suivi career-ops** : garde `data/applications.md` cohérent avec la base, avec `node set-status.mjs` (voir AGENTS.md).
- **Reprise d'un suivi existant** : `node cockpit/synchro.mjs --candidatures` écrit un document par ligne du suivi dans `data/cockpit-sync/`. Lis la collection `candidatures`, crée les documents absents (par lots de 50 au plus), et pour ceux qui existent ne change que le statut et le journal s'ils diffèrent. Ne touche jamais aux champs que l'utilisateur a saisis depuis la page.

## 4. Préparer un entretien

Quand l'utilisateur annonce un entretien (« j'ai un entretien demain avec X », ou un mail de convocation collé) :

1. **Rassemble** le dossier dans la base, le rapport d'évaluation dans `reports/`, l'annonce, la convocation, `cv.md` et `config/profile.yml`. S'il manque la date, l'heure, le format ou le nom des interlocuteurs, demande-les.
2. **Cherche** sur Internet, en notant chaque source et sa date :
   - l'entreprise : activité, produit, clients, prix, taille, levées, résultats, actualité récente, recrutements en cours ;
   - les clients et leurs problèmes : c'est la matière des bonnes questions ;
   - les interlocuteurs : fonction et parcours **publics** seulement. Si l'identité n'est pas certaine, dis-le dans la fiche ;
   - l'annonce exacte, et ce qui a changé depuis la candidature ;
   - le vocabulaire du métier, si l'utilisateur en change.
3. **Situe l'entretien** : ce qu'il évalue (motivation et cadre pour les RH, compétences pour le manager, exercice pour une mise en situation, intégration pour un « culture fit »).
4. **Écris la fiche** `cockpit/fiche-<id>.js` à partir de `modeles/fiche-entretien.js`, en gardant les sections utiles :
   - le cadre et le poste ;
   - qui est en face ;
   - le pitch, relié aux exigences de l'annonce, avec des preuves tirées de `cv.md` ;
   - les questions probables, avec une trame de réponse pour chacune, y compris la question piège du parcours ;
   - l'entreprise, le produit, les clients et leurs problèmes ;
   - la mise en situation s'il y en a une, en tour par tour, avec les objections ;
   - **les questions à poser, propres à chaque interlocuteur** : chacune s'appuie sur un fait précis (un chiffre, une annonce, une déclaration) et montre que le candidat se projette dans le poste. Deux ou trois suffisent : indique l'ordre conseillé ;
   - la rémunération (masquée par défaut).

   Masque par défaut (`data-defaut="cache"`) ce qui sert à relire la veille mais pas pendant l'entretien.
5. **Mets à jour le dossier** (statut `entretien`, étape, action, date, heure), puis reconstruis et republie.

**Règles :**
- N'invente rien sur le parcours du candidat : seulement `cv.md`, son profil et ce qu'il a dit lui-même. S'il manque un fait, demande-le.
- Chaque chiffre sur l'entreprise a sa source. Ce qui n'est pas vérifié est présenté comme tel.
- Écris la fiche à la première personne, du point de vue du candidat.
- Dans un script d'appel de prospection, aucune question fermée tant que le rendez-vous n'est pas obtenu, et jamais de demande de permission en ouverture.
- Aucun conseil qui pousse à mentir ou à exagérer.

## 5. Faire le bilan

Quand l'utilisateur raconte l'entretien :
- ajoute ou complète la section « Bilan » de la fiche : ce qui s'est dit, les informations apprises (chiffres, processus, prochaine étape), le délai de réponse annoncé ;
- masque par défaut les sections qui ne servent plus et place en tête ce qui prépare l'étape suivante ;
- propose un mail de remerciement court, avec une ou deux questions qui reprennent ce qui a été dit ;
- mets à jour le dossier (étape, prochaine action, relance à la date de réponse annoncée), puis reconstruis et republie.
