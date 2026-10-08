#!/usr/bin/env node

/**
 * verifier.mjs - controle automatique des regles d'ecriture (REGLES.md)
 *
 * Usage :
 *   node verifier.mjs                 les fichiers modifies et non ignores par git
 *   node verifier.mjs cockpit/        un dossier, recursivement
 *   node verifier.mjs fiche-acme.js   un fichier
 *
 * Controles : cadratins et demi-cadratins, nombres ecrits en lettres,
 * expressions a eviter, balises HTML desequilibrees, JavaScript invalide.
 *
 * Code de sortie 1 si au moins une erreur. Les avertissements n'echouent pas.
 * Pour ecarter une ligne volontairement : commentaire "verifier:ok" sur la ligne.
 */

import { readFileSync, writeFileSync, unlinkSync, readdirSync, statSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, extname, relative, resolve, sep } from 'path';

const RACINE = process.cwd();
const EXTENSIONS = new Set(['.md', '.js', '.mjs', '.cjs', '.html', '.txt', '.yml', '.yaml']);
const IGNORES = new Set(['node_modules', '.git', 'output', 'fonts', 'logos', 'reports', 'test-fixtures']);

const CADRATIN = String.fromCharCode(0x2014);
const DEMI_CADRATIN = String.fromCharCode(0x2013);

// Expressions qui trahissent un texte non relu. Avertissement, pas erreur.
const A_EVITER = [
  /\bpassionn[ée]\b/i,
  /\bv[ée]ritable\b/i,
  /\bincroyable\b/i,
  /\bj'ai [àa] c[œo]ur\b/i,
  /\bje me permets de\b/i,
  /\bdynamique et motiv[ée]\b/i,
  /\bn'h[ée]sitez pas [àa] me contacter\b/i,
  /\bforce de proposition\b/i,
  /\bdans le cadre de ma recherche\b/i,
];

const CHIFFRES_EN_LETTRES = /\b(z[ée]ro|un|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|vingt|trente|quarante|cinquante|soixante|cent|mille)\s+pour\s+cent\b/i;

let erreurs = 0;
let avertissements = 0;

function signaler(niveau, fichier, ligne, message, extrait) {
  const ou = ligne ? `${fichier}:${ligne}` : fichier;
  const tete = niveau === 'erreur' ? 'ERREUR ' : 'ATTENTION';
  console.log(`${tete}  ${ou}  ${message}`);
  if (extrait) console.log(`           ${extrait.trim().slice(0, 120)}`);
  if (niveau === 'erreur') erreurs++; else avertissements++;
}

function fichiersDe(chemin) {
  const abs = resolve(chemin);
  if (!existsSync(abs)) return [];
  if (statSync(abs).isFile()) return [abs];
  const sortie = [];
  for (const entree of readdirSync(abs)) {
    if (IGNORES.has(entree)) continue;
    sortie.push(...fichiersDe(join(abs, entree)));
  }
  return sortie;
}

function fichiersModifies() {
  try {
    const sortie = execSync('git status --porcelain --untracked-files=all', { encoding: 'utf8' });
    return sortie.split('\n')
      .map((l) => l.slice(3).trim())
      .filter(Boolean)
      .map((l) => l.includes(' -> ') ? l.split(' -> ')[1] : l)
      .map((l) => resolve(l.replace(/^"|"$/g, '')))
      .filter((f) => existsSync(f) && statSync(f).isFile());
  } catch {
    console.log('Pas de depot git ici : indique un fichier ou un dossier a verifier.');
    return [];
  }
}

function verifierTexte(fichier, contenu) {
  const nom = relative(RACINE, fichier).split(sep).join('/');
  const markdown = extname(fichier) === '.md';
  contenu.split('\n').forEach((brute, i) => {
    if (brute.includes('verifier:ok')) return;
    // Dans un document, ce qui est entre accents graves cite un caractere ou
    // une expression : on documente la regle, on ne l'enfreint pas.
    const ligne = markdown ? brute.replace(/`[^`]*`/g, '``') : brute;
    const n = i + 1;
    if (ligne.includes(CADRATIN)) signaler('erreur', nom, n, 'cadratin (U+2014) interdit', ligne);
    if (ligne.includes(DEMI_CADRATIN)) signaler('erreur', nom, n, 'demi-cadratin (U+2013) interdit', ligne);
    if (CHIFFRES_EN_LETTRES.test(ligne)) signaler('avertissement', nom, n, 'pourcentage en lettres, ecrire "50%"', ligne);
    for (const motif of A_EVITER) {
      if (motif.test(ligne)) { signaler('avertissement', nom, n, `expression a eviter : ${ligne.match(motif)[0]}`, ligne); break; }
    }
  });
}

function verifierBalises(fichier, contenu) {
  const nom = relative(RACINE, fichier).split(sep).join('/');
  // Les commentaires de bloc decrivent souvent les balises disponibles.
  const corps = contenu.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const balise of ['section', 'div', 'table', 'ol', 'ul']) {
    const ouvertes = (corps.match(new RegExp(`<${balise}[\\s>]`, 'g')) || []).length;
    const fermees = (corps.match(new RegExp(`</${balise}>`, 'g')) || []).length;
    if (ouvertes !== fermees) {
      signaler('erreur', nom, null, `balises <${balise}> desequilibrees : ${ouvertes} ouvertes, ${fermees} fermees`);
    }
  }
}

function verifierJs(fichier, contenu) {
  const nom = relative(RACINE, fichier).split(sep).join('/');
  try {
    execSync(`node --check "${fichier}"`, { stdio: 'pipe' });
  } catch (e) {
    const msg = ((e.stderr || Buffer.from('')).toString().split('\n').find((l) => /Error|error/.test(l)) || '').trim();
    signaler('erreur', nom, null, `JavaScript invalide : ${msg}`);
  }
  if (/\bfiche\s*\(/.test(contenu)) verifierBalises(fichier, contenu);
}

function verifierHtml(fichier, contenu) {
  const nom = relative(RACINE, fichier).split(sep).join('/');
  verifierBalises(fichier, contenu);
  const blocs = [...contenu.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!blocs.length) return;
  const tmp = join(RACINE, '.verifier-scripts.tmp.mjs');
  try {
    writeFileSync(tmp, blocs.join('\n;\n'), 'utf8');
    try {
      execSync(`node --check "${tmp}"`, { stdio: 'pipe' });
    } catch (e) {
      const msg = ((e.stderr || Buffer.from('')).toString().split('\n').find((l) => /Error|error/.test(l)) || '').trim();
      signaler('erreur', nom, null, `script inline invalide : ${msg}`);
    }
    unlinkSync(tmp);
  } catch { /* le fichier temporaire n'a pas pu etre ecrit : on passe */ }
}

const cibles = process.argv.slice(2);
const fichiers = (cibles.length ? cibles.flatMap(fichiersDe) : fichiersModifies())
  .filter((f) => EXTENSIONS.has(extname(f)))
  .filter((f) => !relative(RACINE, f).split(sep).some((p) => IGNORES.has(p)));

if (!fichiers.length) {
  console.log('Rien a verifier.');
  process.exit(0);
}

for (const fichier of fichiers) {
  let contenu;
  try { contenu = readFileSync(fichier, 'utf8'); } catch { continue; }
  verifierTexte(fichier, contenu);
  const ext = extname(fichier);
  if (ext === '.js' || ext === '.mjs' || ext === '.cjs') verifierJs(fichier, contenu);
  if (ext === '.html') verifierHtml(fichier, contenu);
}

console.log(`\n${fichiers.length} fichier(s) verifie(s) : ${erreurs} erreur(s), ${avertissements} avertissement(s).`);
if (erreurs) process.exit(1);
