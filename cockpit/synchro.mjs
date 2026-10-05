#!/usr/bin/env node
/**
 * cockpit/synchro.mjs - relie career-ops au cockpit
 *
 * 1. Offres : les lignes non cochees de data/pipeline.md (sorties du scan)
 *    sont ajoutees a OFFRES dans cockpit/donnees.js, sans doublon (cle : URL).
 *    Les nouvelles portent nv:1 ; l'etiquette "nouvelle" des vagues
 *    precedentes est retiree.
 * 2. Candidatures : chaque ligne du suivi data/applications.md devient un
 *    document au format de la base du cockpit, ecrit dans
 *    data/cockpit-sync/<id>.json. Claude Code les pousse ensuite dans la
 *    collection "candidatures" (voir cockpit/INSTRUCTIONS.md) ; ce script
 *    n'ecrit jamais dans la base lui-meme.
 *
 * Usage (depuis la racine du projet) : node cockpit/synchro.mjs [--offres] [--candidatures]
 * Sans option : les deux.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { resolveColumns, parseTrackerRow } from '../tracker-parse.mjs';

const args = process.argv.slice(2);
const faireOffres = !args.length || args.includes('--offres');
const faireCand = !args.length || args.includes('--candidatures');
const AUJ = new Date().toISOString().slice(0, 10);

const slug = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const normUrl = (u) => (u || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '')
  .replace(/[?#].*$/, '').replace(/\/+$/, '');

// ------------------------------------------------------------------ offres
function salaire(txt) {
  const nombres = [...(txt || '').matchAll(/(\d+(?:[.,]\d+)?)\s*(k|K)?/g)]
    .map((m) => Number(m[1].replace(',', '.')) * (m[2] ? 1000 : 1))
    .filter((n) => n >= 1000);
  return nombres.length ? [Math.min(...nombres), Math.max(...nombres)] : [null, null];
}

if (faireOffres) {
  const fichier = 'cockpit/donnees.js';
  if (!existsSync(fichier)) copyFileSync('cockpit/donnees.exemple.js', fichier);
  const src = readFileSync(fichier, 'utf-8');
  const { OFFRES } = new Function(src + '\nreturn { OFFRES };')();
  const vues = new Set(OFFRES.map((o) => normUrl(o.u)));
  let n = OFFRES.reduce((m, o) => Math.max(m, o.n || 0), 999);
  const nouvelles = [];
  const pipeline = existsSync('data/pipeline.md') ? readFileSync('data/pipeline.md', 'utf-8') : '';
  for (const ligne of pipeline.split('\n')) {
    const m = ligne.match(/^- \[ \] (https?:\/\/\S+)(.*)$/);
    if (!m || vues.has(normUrl(m[1]))) continue;
    const champs = m[2].split('|').map((s) => s.trim()).filter(Boolean);
    const libres = champs.filter((c) => !/^(posted|note):/i.test(c));
    const posted = (champs.find((c) => /^posted:/i.test(c)) || '').replace(/^posted:\s*/i, '');
    const note = (ligne.match(/(\d(?:[.,]\d)?)\s*\/\s*5/) || [])[1];
    const [mi, ma] = salaire(libres[3]);
    nouvelles.push({
      n: ++n, e: libres[0] || '?', p: libres[1] || '', v: libres[2] || '', mi, ma,
      d: posted || AUJ, t: note ? Number(note.replace(',', '.')) : 0, src: new URL(m[1]).hostname.replace(/^www\./, ''),
      u: m[1], r: '', nv: 1, a: AUJ, ...(note ? {} : { pv: 1 }),
    });
    vues.add(normUrl(m[1]));
  }
  if (nouvelles.length) {
    for (const o of OFFRES) delete o.nv;
    const tout = [...OFFRES, ...nouvelles];
    const ligne = 'var OFFRES = ' + JSON.stringify(tout) + ';';
    if (!/^var OFFRES\s*=.*;\s*$/m.test(src)) throw new Error('Ligne "var OFFRES = ...;" introuvable dans cockpit/donnees.js');
    writeFileSync(fichier, src.replace(/^var OFFRES\s*=.*;\s*$/m, () => ligne));
  }
  console.log(`Offres : ${nouvelles.length} ajoutée(s) à cockpit/donnees.js (${OFFRES.length + nouvelles.length} au total).`);
}

// ------------------------------------------------------------ candidatures
const STATUTS = {
  evaluated: 'prete', applied: 'envoyee', responded: 'reponse', interview: 'entretien',
  offer: 'offre', hired: 'offre', rejected: 'refus', discarded: 'sans_suite',
};

if (faireCand) {
  const suivi = ['data/applications.md', 'applications.md'].find(existsSync);
  if (!suivi) {
    console.log('Candidatures : aucun suivi trouvé (data/applications.md).');
  } else {
    const lignes = readFileSync(suivi, 'utf-8').split('\n');
    const colmap = resolveColumns(lignes);
    mkdirSync('data/cockpit-sync', { recursive: true });
    let nb = 0;
    for (const l of lignes) {
      const r = parseTrackerRow(l, colmap);
      if (!r) continue;
      const statut = STATUTS[(r.status || '').toLowerCase()];
      if (!statut) continue; // SKIP et statuts inconnus : pas dans le cockpit
      const id = slug(`${r.company}-${r.role}`) || `dossier-${r.num}`;
      const envoyee = !['prete'].includes(statut);
      const url = ((r.notes || '').match(/https?:\/\/\S+/) || [''])[0];
      const note = parseFloat(r.score);
      const doc = {
        entreprise: r.company, poste: r.role, lieu: '', cabinet: '', statut,
        dateEnvoi: envoyee ? r.date : '', relance: '', campagne: '',
        note: `${r.notes || ''} (suivi career-ops, ligne ${r.num})`.trim(),
        triage: Number.isFinite(note) ? note : null, url,
        etape: '', action: '', actionDate: '', heure: '',
        journal: [{ d: r.date || AUJ, s: statut }], maj: AUJ,
      };
      writeFileSync(`data/cockpit-sync/${id}.json`, JSON.stringify(doc, null, 2));
      nb++;
    }
    console.log(`Candidatures : ${nb} document(s) prêts dans data/cockpit-sync/ (à pousser dans la base par Claude Code).`);
  }
}
