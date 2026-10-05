/* Modele de fiche de preparation d'entretien.
   Claude Code s'en sert pour preparer un entretien (voir cockpit/INSTRUCTIONS.md).
   Copie : cockpit/fiche-<id>.js, ou <id> est l'id du dossier dans la base
   (ou son debut, par exemple "exemple" pour le dossier "exemple-chef-de-projet").
   Les fichiers cockpit/fiche-*.js sont ignores par git.

   Chaque <section data-s="..." data-titre="..."> peut etre masquee ou affichee
   depuis la barre du haut ; le choix est garde dans le navigateur.
   data-defaut="cache" : section masquee tant qu'on ne l'affiche pas.

   Blocs disponibles : section.large (pleine largeur), div.rang (deux colonnes),
   div.dire + span.cue (phrase a dire), div.piege (point d'attention),
   ol.q (liste numerotee), ol.q.ambre (questions), p.note (remarque, source),
   div.tour > div.moi / div.lui + span.qui (dialogue), div.defile > table
   (tableau, valeurs dans td.n), a.lien (lien externe).

   Regles : premiere personne ; chaque fait vient d'une source citee et datee ;
   ce qui n'est pas verifie est dit comme tel ; rien n'est invente sur le
   parcours du candidat (seulement cv.md et ce qu'il a dit lui-meme). */
fiche("id-du-dossier", "Entreprise", "date de l'entretien", `
<div class="grille" data-perso>
  <section class="large" data-s="cadre" data-titre="Le cadre">
    <h2>Jour, date et heure &middot; format (visio, sur place, téléphone) &middot; interlocuteurs</h2>
    <div class="rang">
      <div>
        <p><strong>Où j'en suis dans le processus</strong> : étape actuelle, étapes suivantes annoncées.</p>
        <p><strong>Ce que cet entretien évalue</strong> : motivation, compétences, mise en situation, intégration dans l'équipe...</p>
        <div class="piege"><p><strong>Le point d'attention principal pour cet entretien.</strong></p></div>
      </div>
      <div>
        <h3>Le poste</h3>
        <div class="defile"><table>
          <tr><td>Intitulé</td><td class="n">...</td></tr>
          <tr><td>Lieu et télétravail</td><td class="n">...</td></tr>
          <tr><td>Contrat</td><td class="n">...</td></tr>
          <tr><td>Salaire affiché</td><td class="n">...</td></tr>
          <tr><td>Missions</td><td class="n">...</td></tr>
        </table></div>
        <p class="note"><a class="lien" href="#" target="_blank" rel="noopener">Annonce</a>, relevée le ...</p>
      </div>
    </div>
  </section>

  <section class="large" data-s="interlocuteurs" data-titre="Qui est en face">
    <h2>Qui est en face</h2>
    <div class="rang">
      <div>
        <h3>Prénom Nom, fonction</h3>
        <p>Parcours public (profil professionnel, interviews, podcasts), ce qu'il ou elle porte dans l'entreprise, et donc ce qui l'intéressera chez moi.</p>
      </div>
      <div>
        <h3>Prénom Nom, fonction</h3>
        <p>Même chose. Rien qui ne soit public et sourcé.</p>
      </div>
    </div>
  </section>

  <section class="large" data-s="pitch" data-titre="Mon pitch">
    <h2>Mon parcours en 90 secondes, relié au poste</h2>
    <div class="rang">
      <div>
        <div class="dire">
          <span class="cue">à dire, pas à réciter</span>
          <p>Ce que je fais aujourd'hui, <b>une preuve chiffrée</b>, le lien direct avec le poste, et pourquoi cette entreprise.</p>
        </div>
      </div>
      <div>
        <h3>Les preuves à placer</h3>
        <ol class="q">
          <li><strong>Preuve 1</strong> : un fait tiré de mon CV, relié à une exigence de l'annonce.</li>
          <li><strong>Preuve 2</strong> : même principe.</li>
          <li><strong>Preuve 3</strong> : même principe.</li>
        </ol>
      </div>
    </div>
  </section>

  <section class="large" data-s="attendu" data-titre="Leurs questions">
    <h2>Ce qu'ils vont me demander, et ce que je réponds</h2>
    <div class="rang">
      <div>
        <ol class="q ambre">
          <li><strong>« Pourquoi nous ? »</strong> Trame de réponse.</li>
          <li><strong>« Pourquoi ce poste ? »</strong> Trame de réponse.</li>
          <li><strong>La question piège de mon parcours</strong> (trou, changement de métier, manque d'expérience). Trame de réponse.</li>
        </ol>
      </div>
      <div>
        <ol class="q ambre" start="4">
          <li><strong>« Vos prétentions ? »</strong> Voir la section Rémunération.</li>
          <li><strong>« Votre disponibilité ? »</strong> Réponse factuelle.</li>
        </ol>
        <div class="piege"><p><strong>Le piège de ce type d'entretien</strong>, et comment l'éviter.</p></div>
      </div>
    </div>
  </section>

  <section class="large" data-s="entreprise" data-titre="L'entreprise">
    <h2>L'entreprise, le produit, les clients</h2>
    <div class="rang">
      <div>
        <ul>
          <li><strong>Date de création, fondateurs, taille</strong> (source).</li>
          <li><strong>Ce qu'elle vend, à qui, à quel prix</strong> (source).</li>
          <li><strong>Chiffres et actualité récente</strong> : levée de fonds, résultats, recrutements, nouveaux produits (source, date).</li>
        </ul>
      </div>
      <div>
        <h3>Les clients et leurs problèmes</h3>
        <p>Qui achète, ce qui les bloque, ce que le produit leur apporte. C'est la matière des bonnes questions.</p>
        <p class="note">Ce que disent les avis publics, si c'est utile (source, date).</p>
      </div>
    </div>
  </section>

  <section class="large" data-s="situation" data-titre="Mise en situation" data-defaut="cache">
    <h2>Si on me fait faire l'exercice</h2>
    <div class="tour">
      <div class="moi"><span class="qui">moi, l'ouverture</span><p>...</p></div>
      <div class="lui"><span class="qui">l'interlocuteur</span><p>...</p></div>
      <div class="moi"><span class="qui">moi, la conclusion</span><p>...</p></div>
    </div>
    <p class="note">Pour un appel de prospection : aucune question fermée avant d'avoir obtenu le rendez-vous.</p>
  </section>

  <section class="large" data-s="questions" data-titre="Mes questions">
    <h2>Mes questions de fin d'entretien</h2>
    <div class="rang">
      <div>
        <h3>Pour Prénom</h3>
        <ol class="q ambre">
          <li>Une question qui s'appuie sur un fait précis de l'entreprise ou de son parcours.</li>
          <li>Une question sur ce qui fait réussir dans le poste.</li>
        </ol>
      </div>
      <div>
        <h3>Pour Prénom</h3>
        <ol class="q ambre" start="3">
          <li>Une question propre à son rôle.</li>
          <li>Une question sur la suite du processus.</li>
        </ol>
      </div>
    </div>
    <p class="note">Deux ou trois suffisent. Ordre conseillé, et pourquoi.</p>
  </section>

  <section data-s="remuneration" data-titre="Rémunération" data-defaut="cache">
    <h2>Rémunération et conditions : ma position</h2>
    <p>Fourchette annoncée, ma demande et sa justification, ce que je ne négocie pas à cette étape.</p>
  </section>

  <section data-s="vocabulaire" data-titre="Vocabulaire" data-defaut="cache">
    <h2>Le vocabulaire du métier</h2>
    <ul>
      <li><strong>Terme</strong> : définition en une ligne.</li>
    </ul>
  </section>

  <section class="large" data-s="bilan" data-titre="Bilan" data-defaut="cache">
    <h2>Après l'entretien : ce que j'en retiens</h2>
    <p>Ce qui s'est dit, ce que j'ai appris (chiffres, processus, prochaine étape), le délai de réponse annoncé, et le mail de remerciement à envoyer.</p>
  </section>
</div>`);
