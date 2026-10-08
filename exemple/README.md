# Un exemple complet, de l'offre repérée à l'entretien préparé

Ce dossier contient une candidature entière, jouable telle quelle : une candidate,
trois offres, une recherche d'entreprise, deux lettres, trois CV, un cockpit rempli
et une fiche d'entretien.

**Tout est fictif** : Inès Barbier, la Mutuelle Saint-Clair, Edimark, Pilona, Ardent Conseil,
Ovanie, Belisse, Rhodana, leurs chiffres, leurs clients et les sources citées. Les liens
pointent vers `exemple.fr`. Rien ici ne décrit une entreprise réelle.

C'est le seul endroit du dépôt où des données de candidature sont suivies par git.
Les tiennes vivent dans `cv.md`, `config/profile.yml`, `data/`, `reports/`, `output/`
et `cockpit/`, tous ignorés.

## Le cas

Inès Barbier, 27 ans, Lyon. Conseillère relation adhérents dans une mutuelle, elle suit
320 entreprises et elle est responsable du renouvellement de leurs contrats. Elle vise
un poste de Customer Success Manager chez un éditeur de logiciel. **Son seul écart :
elle n'a jamais travaillé chez un éditeur.** Tout le dossier tourne autour de ça,
en le nommant plutôt qu'en le cachant.

## Les fichiers, et ce qu'ils montrent

| Fichier | Dans ton usage réel | Ce qu'il montre |
|---|---|---|
| `cv.md` | `cv.md` à la racine | la source de vérité, avec une section « ce qui n'est pas dans le CV » |
| `profile.yml` | `config/profile.yml` | les champs qui comptent en France : contrat, convention, avantages, exclusions |
| `recherche-pilona.md` | `reports/recherche-<entreprise>.md` | une recherche de niveau 3, chaque chiffre daté et sourcé |
| `candidat.mjs` | `data/candidat.mjs` | les expériences et leurs puces, choisies ensuite par offre |
| `offres.mjs` | `data/offres.mjs` | trois cas : candidature directe, cabinet, CV générique |
| `fiche-pilona.js` | `cockpit/fiche-<id>.js` | la fiche d'entretien complète, 15 sections |
| `donnees.js` | `cockpit/donnees.js` | 5 offres triées et 3 dossiers à des étapes différentes |
| `sorties/` | `output/` | les PDF produits, CV et lettres |

## Le parcours, étape par étape

### 1. L'offre arrive

Inès colle le lien de l'annonce Pilona. L'agent l'évalue (`modes/fr/offre.md`), la note
4,5 sur 5, et l'ajoute aux offres du cockpit : c'est la ligne 1 de `donnees.js`.
Deux autres offres y sont notées plus bas, dont une écartée d'office (`s:"ecartee"`,
le centre d'appels sans télétravail) et une encore à lire (`pv:1`, note provisoire).

### 2. La recherche

Avant d'écrire quoi que ce soit, l'agent produit `recherche-pilona.md`
(méthode : `modes/fr/recherche.md`). On y trouve ce qui sert ensuite partout :
le produit en trente secondes, les trois différenciateurs, le persona, l'ICP,
les concurrents, le vocabulaire, et surtout **les questions restées sans réponse**,
qui deviendront des questions d'entretien.

Chaque chiffre porte sa source et sa date. L'effectif, dont les sources publiques
se contredisent, est donné en fourchette avec une phrase qui le dit.

### 3. Le CV et la lettre

```bash
node build-cv-lettres.mjs --donnees exemple --sortie exemple/sorties
```

Trois dossiers sortent, et les trois passent les contrôles (une page, compétences
sur une ligne) :

- **`Pilona_CSM`** : candidature directe. Couleur de la marque, accroche reprise de
  l'annonce, quatre puces sur l'expérience actuelle, le projet personnel affiché parce
  qu'il répond à une exigence. La lettre nomme l'écart au quatrième paragraphe.
- **`Ardent_CSM`** : passage par un cabinet, employeur final non communiqué.
  **Ni logo, ni nom d'entreprise**, un neutre `#2B3A4A` à la place de la couleur,
  et la lettre adressée au cabinet.
- **`Profil_CSM`** : le CV générique, sans annonce. Celui qu'on joint à une candidature
  spontanée ou à un échange sur un réseau professionnel.

Le détail de chaque champ est dans `INSTRUCTIONS-CV-LETTRES.md`.

### 4. Le suivi

`donnees.js` montre trois dossiers à trois étapes : un entretien calé, une candidature
envoyée avec sa relance à J+7, un dossier prêt mais pas encore envoyé. Chacun porte son
journal, sa prochaine action et sa date.

### 5. L'entretien

`fiche-pilona.js` est la fiche de préparation du deuxième tour. Elle contient le cadre,
les interlocuteurs et leur parcours public, le pitch de 90 secondes, les questions
attendues avec la réponse à la question piège, l'entreprise en six faits, le produit et
ses différenciateurs, l'ICP, le persona, un appel joué tour par tour, six objections et
leurs réponses, les questions à poser à chacun des deux interlocuteurs, l'antisèche des
chiffres, la position sur la rémunération et le vocabulaire du métier.

Les sections s'affichent ou se masquent depuis la barre du haut : on prépare avec
quinze sections, on garde l'antisèche et les questions à l'écran pendant l'entretien.

Pour la voir :

```bash
cp exemple/donnees.js cockpit/donnees.js
cp exemple/fiche-pilona.js cockpit/fiche-pilona.js
cd cockpit && node assembler.mjs
```

Puis ouvre `cockpit/cockpit.html` dans un navigateur, ou demande à Claude Code de le
publier comme artefact.

**Attention** : ces deux copies écrasent tes propres `cockpit/donnees.js` et
`cockpit/fiche-pilona.js` s'ils existent. Sauvegarde-les avant.

## Repartir de cet exemple pour ton propre dossier

```bash
cp exemple/candidat.mjs data/candidat.mjs
cp exemple/offres.mjs   data/offres.mjs
cp exemple/cv.md        cv.md
cp exemple/profile.yml  config/profile.yml
```

Puis remplace chaque valeur par la tienne. Ou, plus simple : ouvre Claude Code et
donne-lui ton CV, il s'en charge et te pose les questions qui manquent.

Les modèles vides, eux, sont dans `templates/` et dans `cockpit/modeles/`.
