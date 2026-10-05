#!/usr/bin/env node

/**
 * build-cv-lettres.mjs - CV et lettres de motivation adaptes a chaque offre
 *
 * Un modele commun, un jeu de donnees par offre : couleurs de marque, logo,
 * accroche, resume, competences cles et puces choisies pour l'annonce.
 *
 * Donnees (privees, ignorees par git) :
 *   data/candidat.mjs  ton identite, tes experiences, ta formation
 *   data/offres.mjs    les offres visees et les lettres correspondantes
 * Pour demarrer : copier les modeles
 *   cp templates/candidat.example.mjs data/candidat.mjs
 *   cp templates/offres.example.mjs data/offres.mjs
 *
 * Usage : node build-cv-lettres.mjs [motif]
 *   sans argument : toutes les offres ; avec un motif : celles dont le slug le contient.
 *
 * Controles automatiques sur chaque CV : une seule page, competences cles sur
 * une seule ligne. Un ecart affiche ECHEC CONTROLE et le code de sortie vaut 1.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';
import { pathToFileURL } from 'url';
import { resolve } from 'path';

for (const f of ['data/candidat.mjs', 'data/offres.mjs']) {
  if (!existsSync(f)) {
    const modele = f.replace('data/', 'templates/').replace('.mjs', '.example.mjs');
    console.error(`Fichier manquant : ${f}\nCopie le modele puis remplis-le : cp ${modele} ${f}`);
    process.exit(1);
  }
}
const { CANDIDAT: C } = await import(pathToFileURL(resolve('data/candidat.mjs')).href);
const { OFFRES, LETTRES = {} } = await import(pathToFileURL(resolve('data/offres.mjs')).href);

const AUJ = new Date().toISOString().slice(0, 10);
const MOIS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MOIS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const nomFichier = C.nom.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_');
const photo = C.photo ? readFileSync(C.photo).toString('base64') : null;
const logoData = (file) => {
  const mime = file.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  return `data:${mime};base64,` + readFileSync(`logos/${file}`).toString('base64');
};

// Parties fixes du CV selon la langue. Le contenu variable vient de l'offre,
// la formation et les competences techniques viennent de data/candidat.mjs.
const LABELS = {
  fr: {
    titre: 'CV', resume: 'Résumé professionnel', competences: 'Compétences clés',
    experiences: 'Expériences professionnelles', projets: 'Projets personnels',
    formation: 'Formation et certifications', technique: 'Compétences techniques et langues',
    permis: 'Permis B',
  },
  en: {
    titre: 'Resume', resume: 'Professional Summary', competences: 'Key Skills',
    experiences: 'Professional Experience', projets: 'Personal Projects',
    formation: 'Education and Certifications', technique: 'Technical Skills and Languages',
    permis: 'Driving licence',
  },
};

const FONTS = `
  @font-face { font-family: 'Space Grotesk'; src: url('./fonts/space-grotesk-latin.woff2') format('woff2'); font-weight: 300 700; font-style: normal; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
  @font-face { font-family: 'Space Grotesk'; src: url('./fonts/space-grotesk-latin-ext.woff2') format('woff2'); font-weight: 300 700; font-style: normal; font-display: swap; unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
  @font-face { font-family: 'DM Sans'; src: url('./fonts/dm-sans-latin.woff2') format('woff2'); font-weight: 100 1000; font-style: normal; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
  @font-face { font-family: 'DM Sans'; src: url('./fonts/dm-sans-latin-ext.woff2') format('woff2'); font-weight: 100 1000; font-style: normal; font-display: swap; unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }`;

// Une offre cite des experiences par leur cle dans data/candidat.mjs.
function resoudre(liste, source, quoi) {
  return (liste || []).map((x) => {
    const base = source[x.ref];
    if (!base) throw new Error(`${quoi} inconnue : "${x.ref}" (cles disponibles : ${Object.keys(source).join(', ')})`);
    for (const k of x.keys) if (!base.bullets[k]) throw new Error(`Puce inconnue "${k}" dans ${quoi} "${x.ref}"`);
    return { ...base, keys: x.keys };
  });
}

function renderJob(j) {
  const lis = j.keys.map((k) => `        <li>${j.bullets[k]}</li>`).join('\n');
  return `    <div class="job">
      <div class="job-header">
        <span class="job-company">${j.company}</span>
        <span class="job-period">${j.period}</span>
      </div>
      ${j.role ? `<div class="job-role">${j.role}</div>` : ''}
      <ul>
${lis}
      </ul>
    </div>`;
}

function contacts(o, L) {
  const items = [
    C.email && `<span>${C.email}</span>`,
    C.telephone && `<span>${C.telephone}</span>`,
    C.linkedin && `<a href="https://${C.linkedin.replace(/^https?:\/\//, '')}">${C.linkedin.replace(/^https?:\/\//, '')}</a>`,
    `<span>${o.lieu || C.ville}</span>`,
    C.permis && `<span>${L.permis}</span>`,
  ].filter(Boolean);
  return items.join('\n      <span class="separator">|</span>\n      ');
}

function render(o) {
  const lang = o.lang || 'fr';
  const L = LABELS[lang];
  const T = C.textes[lang] || C.textes.fr;
  const jobs = resoudre(o.jobs, C.experiences, 'Experience');
  const projets = resoudre(o.projets, C.projets || {}, 'Projet');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${C.nom} - ${L.titre} - ${o.name || o.slug}</title>
<style>${FONTS}

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'DM Sans', sans-serif; font-size: 11px; line-height: 1.55; color: #1a1a2e; background: #fff; padding: 0; margin: 0; }
  .page { width: 100%; max-width: 210mm; margin: 0 auto; padding: 2px 0; }
  .header { margin-bottom: 10px; }
  .header-identity { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .header-name { display: flex; flex-direction: column; gap: 2px; }
  .header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; color: #1a1a2e; letter-spacing: -0.02em; line-height: 1.1; }
  .company-tag { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: ${o.accent}; margin-left: 10px; }
  .tagline { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.01em; color: ${o.primary}; }
  .header-visuals { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .company-logo { width: ${o.logoW || 40}px; height: ${o.logoH || 40}px; background-size: contain; background-repeat: no-repeat; background-position: center; flex-shrink: 0; }
  .profile-photo { width: 66px; height: 66px; border-radius: 50%; background-size: cover; background-position: center; border: 2px solid ${o.primary}; flex-shrink: 0; }
  .header-gradient { height: 2px; background: linear-gradient(to right, ${o.primary}, ${o.accent}); border-radius: 1px; margin-bottom: 8px; }
  .contact-row { display: flex; flex-wrap: wrap; gap: 6px 12px; font-size: 10px; line-height: 1.3; color: #555; }
  .contact-row a { color: #555; text-decoration: none; }
  .contact-row .separator { color: #ccc; }
  .section { margin-bottom: 14px; }
  .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${o.primary}; border-top: 1.5px solid #e2e2e2; padding-top: 8px; margin-bottom: 11px; line-height: 1.2; }
  .summary-text { font-size: 11px; line-height: 1.5; text-align: justify; color: #2f2f2f; }
  a { white-space: nowrap; }
  .competencies-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .competency-tag { font-size: 10px; font-weight: 500; color: ${o.primary}; background: ${o.tagBg}; padding: 4px 10px; border-radius: 3px; border: 1px solid ${o.tagBorder}; }
  .job { margin-bottom: 10px; }
  .job-header { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 2px; }
  .job-company { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 600; color: ${o.accent}; }
  .job-period { font-size: 10px; color: #777; white-space: nowrap; }
  .job-role { font-size: 10.5px; font-weight: 600; color: #333; margin-bottom: 2px; }
  .job ul { padding-left: 16px; margin-top: 2px; }
  .job li { font-size: 10.5px; line-height: 1.45; text-align: justify; color: #333; margin-bottom: 3px; }
  .job li strong { font-weight: 600; }
  .edu-item { margin-bottom: 5px; }
  .edu-header { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .edu-title { font-weight: 600; font-size: 10.5px; color: #333; }
  .edu-org { color: ${o.accent}; font-weight: 500; }
  .edu-year { font-size: 9.5px; color: #777; white-space: nowrap; }
  .skills-grid { display: flex; flex-direction: column; gap: 5px; }
  .skill-item { font-size: 10px; color: #444; }
  .skill-category { font-weight: 600; color: #333; }
  .avoid-break, .job, .edu-item { break-inside: avoid; page-break-inside: avoid; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { padding: 0; } }
</style>
</head>
<body>
<div class="page">

  <div class="header avoid-break">
    <div class="header-identity">
      <div class="header-name">
        <h1>${C.nom}${o.name ? `<span class="company-tag">- ${o.name}</span>` : ''}</h1>
        <div class="tagline">${o.tagline}</div>
      </div>
      <div class="header-visuals">
        ${o.logo ? `<div class="company-logo" style="background-image: url('${logoData(o.logo)}')" title="${o.name}"></div>` : ''}
        ${photo ? `<div class="profile-photo" style="background-image: url('data:image/jpeg;base64,${photo}')"></div>` : ''}
      </div>
    </div>
    <div class="header-gradient"></div>
    <div class="contact-row">
      ${contacts(o, L)}
    </div>
  </div>

  <div class="section avoid-break">
    <div class="section-title">${L.resume}</div>
    <p class="summary-text">${o.summary}</p>
  </div>

  <div class="section">
    <div class="section-title">${L.competences}</div>
    <div class="competencies-grid">
${o.tags.map((t) => `      <span class="competency-tag">${t}</span>`).join('\n')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">${L.experiences}</div>

${jobs.map(renderJob).join('\n\n')}
  </div>
${projets.length ? `
  <div class="section">
    <div class="section-title">${L.projets}</div>

${projets.map(renderJob).join('\n\n')}
  </div>
` : ''}
  <div class="section avoid-break">
    <div class="section-title">${L.formation}</div>

${T.edu.map((e) => `    <div class="edu-item">
      <div class="edu-header">
        <span class="edu-title">${e[0]}<span class="edu-org">${e[1]}</span></span>
        <span class="edu-year">${e[2]}</span>
      </div>
    </div>`).join('\n\n')}
  </div>

  <div class="section avoid-break">
    <div class="section-title">${L.technique}</div>
    <div class="skills-grid">
${T.skills.map((k) => `      <span class="skill-item"><span class="skill-category">${k[0]}</span> ${k[1]}</span>`).join('\n')}
    </div>
  </div>

</div>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Lettres de motivation : mise en page classique, une seule touche de la
// couleur de marque sur le nom et le filet.
// ---------------------------------------------------------------------------
const FORMULES = {
  fr: {
    objet: 'Objet', salutation: 'Madame, Monsieur,',
    politesse: "Je vous prie d'agr&#233;er, Madame, Monsieur, l'expression de mes salutations distingu&#233;es.",
    date: (iso) => { const [a, m, j] = iso.split('-').map(Number); return `${j} ${MOIS_FR[m - 1]} ${a}`; },
  },
  en: {
    objet: 'Subject', salutation: 'Dear Hiring Team,', politesse: 'Kind regards,',
    date: (iso) => { const [a, m, j] = iso.split('-').map(Number); return `${j} ${MOIS_EN[m - 1]} ${a}`; },
  },
};

function renderLM(o, lm) {
  const lang = o.lang || 'fr';
  const F = FORMULES[lang];
  const lieu = o.lieu || C.ville;
  const corps = lm.paras.map((p) => `      <p>${p}</p>`).join('\n');
  const coord = [C.email, C.telephone, C.linkedin && C.linkedin.replace(/^https?:\/\//, ''), lieu].filter(Boolean).join('<br>\n      ');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${C.nom} - ${lang === 'en' ? 'Cover letter' : 'Lettre de motivation'} - ${o.name || o.slug}</title>
<style>${FONTS}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'DM Sans', sans-serif; font-size: 11px; line-height: 1.5; color: #1a1a2e; }
  .page { width: 100%; max-width: 210mm; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 26px; padding-bottom: 12px; border-bottom: 2px solid ${o.primary}; }
  .sender { font-size: 10.5px; color: #333; line-height: 1.55; }
  .sender .name { font-size: 16px; font-weight: 700; color: ${o.primary}; margin-bottom: 4px; letter-spacing: -0.01em; }
  .company-logo { width: ${o.logoW || 40}px; height: ${o.logoH || 40}px; background-size: contain; background-repeat: no-repeat; background-position: right center; flex-shrink: 0; }
  .recipient { margin-bottom: 16px; font-size: 10.5px; color: #333; line-height: 1.5; }
  .date-city { text-align: right; margin-bottom: 18px; font-size: 10.5px; color: #333; }
  .subject { font-weight: 600; margin-bottom: 18px; font-size: 11px; color: #1a1a2e; }
  .body { font-size: 11px; line-height: 1.65; text-align: justify; color: #222; }
  .body p { margin-bottom: 12px; }
  .signature { margin-top: 20px; font-weight: 600; color: ${o.primary}; font-size: 12px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="sender">
      <div class="name">${C.nom}</div>
      ${coord}
    </div>
    ${o.logo ? `<div class="company-logo" style="background-image: url('${logoData(o.logo)}')" title="${o.name}"></div>` : ''}
  </div>
  <div class="recipient">${lm.dest}</div>
  <div class="date-city">${lieu.split(',')[0]}${lang === 'en' ? ', ' : ', le '}${F.date(lm.date || o.date || AUJ)}</div>
  <div class="subject">${F.objet}${lang === 'en' ? ': ' : '&nbsp;: '}${lm.objet}</div>
  <div class="body">
      <p>${F.salutation}</p>
${corps}
      <p>${F.politesse}</p>
  </div>
  <div class="signature">${C.nom}</div>
</div>
</body>
</html>
`;
}

// Chaque offre peut declarer sa campagne (sous-dossier de sortie) ; candidatures par defaut.
function chemins(o) {
  const c = o.campagne || 'candidatures';
  return { cvHtml: `output/sources/CV/${c}`, cvPdf: `output/${c}/CV`, lmHtml: `output/sources/LM/${c}`, lmPdf: `output/${c}/LM` };
}

const motif = process.argv[2];
const cibles = motif ? OFFRES.filter((o) => o.slug.toLowerCase().includes(motif.toLowerCase())) : OFFRES;
if (!cibles.length) { console.log(motif ? `Aucune offre ne contient "${motif}".` : 'Aucune offre dans data/offres.mjs.'); process.exit(0); }

const aControler = [];
function produire(kind, htmlPath, pdfPath, html, label) {
  writeFileSync(htmlPath, html, 'utf-8');
  try {
    execSync(`node generate-pdf.mjs "${htmlPath}" "${pdfPath}" --format=a4`, { stdio: 'pipe' });
    console.log(`  OK    ${kind}   ${pdfPath}`);
    if (kind === 'CV') aControler.push({ label, htmlPath, pdfPath });
  } catch (e) {
    const out = (e.stdout || Buffer.from('')).toString() + (e.stderr || Buffer.from('')).toString();
    console.log(`  ECHEC ${kind}   ${label} : ${out.split('\n').filter((l) => /failed|error|Fact check/i.test(l)).join(' ').trim()}`);
    process.exitCode = 1;
  }
}

for (const o of cibles) {
  console.log(o.name || o.slug);
  const p = chemins(o);
  for (const d of Object.values(p)) mkdirSync(d, { recursive: true });
  const date = o.date || AUJ;
  const baseCV = `${o.slug}-CV-${nomFichier}_${date}`;
  produire('CV', `${p.cvHtml}/${baseCV}.html`, `${p.cvPdf}/${baseCV}.pdf`, render(o), o.name || o.slug);
  const lm = LETTRES[o.slug];
  if (!lm) { console.log('  (pas de lettre pour cette offre)'); continue; }
  const baseLM = `${o.slug}-LM-${nomFichier}_${lm.date || date}`;
  produire('LM', `${p.lmHtml}/${baseLM}.html`, `${p.lmPdf}/${baseLM}.pdf`, renderLM(o, lm), o.name || o.slug);
}

// ---------------------------------------------------------------- controles
// Mesure dans les conditions du PDF : zone imprimable A4 avec 0.6in de marges
// (678px de large), media print, polices du projet chargees.
if (aControler.length) {
  const { chromium } = await import('playwright');
  const nav = await chromium.launch();
  const page = await nav.newPage({ viewport: { width: 678, height: 1007 } });
  await page.emulateMedia({ media: 'print' });
  const fonts = pathToFileURL(resolve('fonts')).href + '/';
  let echecs = 0;
  for (const c of aControler) {
    const pdf = readFileSync(c.pdfPath, 'latin1');
    const m = pdf.match(/\/Type\s*\/Pages[^>]*\/Count\s+(\d+)/);
    const pages = m ? Number(m[1]) : NaN;
    const tmp = c.htmlPath.replace(/\.html$/, '.controle.html');
    writeFileSync(tmp, readFileSync(c.htmlPath, 'utf-8').replaceAll("url('./fonts/", `url('${fonts}`));
    await page.goto(pathToFileURL(resolve(tmp)).href);
    await page.evaluate(() => document.fonts.ready);
    const lignes = await page.$$eval('.competency-tag', (els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().top))).size);
    unlinkSync(tmp);
    const motifs = [];
    if (pages !== 1) motifs.push(`${pages} pages`);
    if (lignes > 1) motifs.push(`competences sur ${lignes} lignes`);
    if (motifs.length) { echecs++; console.log(`  ECHEC CONTROLE   ${c.label} : ${motifs.join(', ')}`); }
  }
  await nav.close();
  console.log(echecs ? `\n${echecs} CV hors regles : raccourcis le resume, les puces ou les competences.` : `\nControles OK : ${aControler.length} CV sur une page, competences sur une ligne.`);
  if (echecs) process.exitCode = 1;
}
