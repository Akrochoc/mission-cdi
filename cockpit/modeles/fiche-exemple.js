/* Modele de fiche de preparation d'entretien.
   Pour l'utiliser : copier ce fichier dans cockpit/ sous le nom
   fiche-<id>.js, changer l'id, le nom et le contenu, puis relancer
   node assembler.mjs. Les fichiers cockpit/fiche-*.js sont ignores par git :
   tes preparations restent privees.

   L'id doit etre celui du dossier (ou son debut) pour que l'agenda
   propose le bouton "Preparation".

   Chaque <section data-s="..." data-titre="..."> peut etre masquee ou
   affichee depuis la barre du haut, et le choix est garde dans le navigateur.
   data-defaut="cache" : section masquee tant qu'on ne l'affiche pas.

   Blocs disponibles : section.large (pleine largeur), div.rang (deux
   colonnes), div.dire (phrase a dire), div.piege (point d'attention),
   ol.q (liste numerotee), ol.q.ambre (questions), p.note (remarque),
   div.tour avec div.moi / div.lui (dialogue), div.defile > table (tableau). */
fiche("exemple", "Entreprise exemple", "entretien", `
<div class="grille" data-perso>
  <section class="large" data-s="cadre" data-titre="Le cadre">
    <h2>Date, heure &middot; type d'entretien &middot; interlocuteurs</h2>
    <div class="rang">
      <div>
        <p><strong>Qui est en face, et ce qu'il ou elle va evaluer.</strong></p>
        <div class="piege"><p><strong>Le point d'attention principal.</strong></p></div>
      </div>
      <div>
        <h3>Le poste</h3>
        <div class="defile"><table>
          <tr><td>Intitule</td><td class="n">...</td></tr>
          <tr><td>Lieu</td><td class="n">...</td></tr>
          <tr><td>Salaire</td><td class="n">...</td></tr>
        </table></div>
      </div>
    </div>
  </section>

  <section class="large" data-s="pitch" data-titre="Mon pitch">
    <h2>Mon parcours en 90 secondes</h2>
    <div class="dire">
      <span class="cue">a dire, pas a reciter</span>
      <p>Trois phrases sur mon parcours, <b>une preuve chiffree</b>, et pourquoi ce poste.</p>
    </div>
  </section>

  <section data-s="questions" data-titre="Mes questions">
    <h2>Mes questions de fin d'entretien</h2>
    <ol class="q ambre">
      <li>Une question precise sur le poste.</li>
      <li>Une question sur l'equipe.</li>
    </ol>
  </section>

  <section data-s="notes" data-titre="Notes" data-defaut="cache">
    <h2>Notes de fond</h2>
    <p class="note">Ce qui sert a relire la veille, pas pendant l'entretien.</p>
  </section>
</div>`);
