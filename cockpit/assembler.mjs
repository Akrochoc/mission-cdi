// Assemble cockpit.html : la coquille, les donnees, les fiches et la logique.
// Usage : node assembler.mjs, depuis n'importe quel dossier du projet.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
process.chdir(dirname(fileURLToPath(import.meta.url)));
const donnees = fs.existsSync("donnees.js") ? "donnees.js" : "donnees.exemple.js";
const fiches = fs.readdirSync(".").filter((f) => /^fiche-.+\.js$/.test(f)).sort();
const parts = [donnees, "fiches.js", ...fiches, "app.js"];
const coquille = fs.readFileSync("cockpit-coquille.html", "utf8");
const bloc = "<script>\n" + parts.map((f) => fs.readFileSync(f, "utf8")).join("\n") + "\n</script>";
if (!coquille.includes('<script src="DONNEES"></script>')) throw new Error("placeholder absent");
const out = coquille.replace('<script src="DONNEES"></script>', () => bloc);
fs.writeFileSync("cockpit.html", out);
console.log("cockpit.html : " + Math.round(out.length / 1024) + " Ko (" + donnees + ", " + fiches.length + " fiche(s))");
