/* Exemple complet : une fiche de preparation d'entretien remplie.
   Entreprise et interlocuteurs fictifs, sources fictives. Voir exemple/README.md.
   Pour la voir dans le cockpit :
     cp exemple/fiche-pilona.js cockpit/fiche-pilona.js
     cd cockpit && node assembler.mjs
   Dans ton usage reel, ces fichiers s'appellent cockpit/fiche-<id>.js
   et ils sont ignores par git. Le modele vide est dans cockpit/modeles/. */
fiche("pilona", "Pilona", "Jeudi 15 octobre, 14h", `
<div class="grille" data-perso>

  <section class="large" data-s="cadre" data-titre="Le cadre">
    <h2>Jeudi 15 octobre, 14h &middot; visioconférence, 45 minutes &middot; Sofiane Ferrand et Alice Reynaud</h2>
    <div class="rang">
      <div>
        <p><strong>Où j'en suis</strong>&#160;: premier entretien passé le 9 octobre avec Alice Reynaud (30 minutes, téléphone). C'est le deuxième tour, avec le cofondateur. Une troisième étape est annoncée, un échange avec l'équipe.</p>
        <p><strong>Ce que cet entretien évalue</strong>&#160;: ma compréhension de leur métier, et ma capacité à tenir 40 à 60 réseaux sans en perdre un. Sofiane est commercial de formation, il écoutera comment je parle de chiffres.</p>
        <div class="piege"><p><strong>Le point d'attention.</strong> Je n'ai jamais travaillé chez un éditeur de logiciel. Si je laisse ce sujet arriver à la fin, il pèsera. Je le pose moi-même dans les 5 premières minutes, et j'enchaîne sur ce que je sais faire.</p></div>
      </div>
      <div>
        <h3>Le poste</h3>
        <div class="defile"><table>
          <tr><td>Intitulé</td><td class="n">Customer Success Manager</td></tr>
          <tr><td>Lieu et télétravail</td><td class="n">Lyon, 2 jours</td></tr>
          <tr><td>Contrat</td><td class="n">CDI</td></tr>
          <tr><td>Salaire affiché</td><td class="n">34 à 38 K€ plus prime</td></tr>
          <tr><td>Portefeuille</td><td class="n">40 à 60 réseaux</td></tr>
          <tr><td>Responsabilité</td><td class="n">Renouvellement et montée en usage</td></tr>
        </table></div>
        <p class="note">Annonce publiée le 29 septembre 2026, relevée le 6 octobre. Recherche complète&#160;: exemple/recherche-pilona.md.</p>
      </div>
    </div>
  </section>

  <section class="large" data-s="interlocuteurs" data-titre="Qui est en face">
    <h2>Qui est en face</h2>
    <div class="rang">
      <div>
        <h3>Sofiane Ferrand, cofondateur, direction commerciale et Customer Success</h3>
        <p>Parcours commercial dans l'édition de logiciel avant de fonder Pilona en 2019. Dans un podcast professionnel de février 2026, il revient deux fois sur la même idée&#160;: «&#160;un client qui signe et un client qui utilise, ce ne sont pas les mêmes gens&#160;». C'est exactement le sujet de ce poste, et c'est sur ce terrain qu'il m'attendra.</p>
      </div>
      <div>
        <h3>Alice Reynaud, Customer Success Manager depuis 2024</h3>
        <p>Je reprendrais une partie de son portefeuille. Ancienne responsable de magasin d'après son profil public&#160;: elle a vécu l'autre côté, celui du point de vente à qui le siège impose un outil. Elle m'a fait le premier entretien, elle sait déjà ce que j'ai répondu.</p>
      </div>
    </div>
  </section>

  <section class="large" data-s="pitch" data-titre="Mon pitch">
    <h2>Mon parcours en 90 secondes, relié au poste</h2>
    <div class="rang">
      <div>
        <div class="dire">
          <span class="cue">à dire, pas à réciter</span>
          <p>Je suis conseillère relation adhérents à la Mutuelle Saint-Clair, où je suis <b>320 entreprises</b> de 5 à 200 salariés. Mon travail, c'est que leur contrat soit reconduit l'année suivante&#160;: <b>94% l'ont été en 2025, contre 89% l'année d'avant</b>. Chez moi comme chez vous, celui qui signe n'est pas celui qui utilise&#160;: le dirigeant signe, ce sont les salariés qui appellent, ou pas. C'est ce décalage que je sais traiter, et c'est pour ça que votre annonce m'a arrêtée.</p>
        </div>
        <p class="note">90 secondes, pas plus. Ensuite je me tais.</p>
      </div>
      <div>
        <h3>Les preuves à placer</h3>
        <ol class="q">
          <li><strong>94% de renouvellement en 2025, 89% en 2024</strong>&#160;: l'écart vient d'un tableau de relance à 90 jours que j'ai construit et que mes 4 collègues utilisent.</li>
          <li><strong>40 à 60 demandes par jour</strong>, dont les réclamations que le centre d'appels n'a pas résolues. Le volume ne me fait pas peur.</li>
          <li><strong>6 nouveaux conseillers formés en 2025</strong>&#160;: faire adopter des outils à des gens qui ne les ont pas choisis, c'est déjà mon quotidien.</li>
        </ol>
      </div>
    </div>
  </section>

  <section class="large" data-s="attendu" data-titre="Leurs questions">
    <h2>Ce qu'ils vont me demander, et ce que je réponds</h2>
    <div class="rang">
      <div>
        <ol class="q ambre">
          <li><strong>«&#160;Pourquoi Pilona&#160;?&#160;»</strong> Parce que le produit s'adresse à deux publics qui n'ont pas le même intérêt, le siège et le point de vente, et que c'est la situation que je connais. Et parce que le module satisfaction lancé en juin rapproche votre outil de ce que je fais aujourd'hui.</li>
          <li><strong>«&#160;Pourquoi quitter la mutuelle&#160;?&#160;»</strong> Le métier me plaît, le produit ne bouge pas. Je veux travailler sur un outil qui évolue, et pouvoir mesurer l'usage.</li>
          <li><strong>La question piège&#160;: «&#160;vous n'avez jamais travaillé chez un éditeur&#160;».</strong> C'est vrai, et c'est mon seul écart. J'arrive avec le métier de la relation client, la gestion d'un volume et la responsabilité d'un renouvellement. Ce que j'ai à apprendre, c'est le produit et le vocabulaire. En un mois je tiens un portefeuille, en trois je suis autonome sur les démonstrations.</li>
        </ol>
      </div>
      <div>
        <ol class="q ambre" start="4">
          <li><strong>«&#160;Comment vous gérez 60 comptes&#160;?&#160;»</strong> Par la segmentation et par le calendrier, pas par la bonne volonté. Je décris mon tableau de relance à 90 jours.</li>
          <li><strong>«&#160;Vos prétentions&#160;?&#160;»</strong> Voir la section Rémunération.</li>
          <li><strong>«&#160;Votre disponibilité&#160;?&#160;»</strong> Préavis d'un mois, donc disponible à partir de mi-novembre.</li>
        </ol>
        <div class="piege"><p><strong>Le piège du deuxième tour avec un fondateur</strong>&#160;: parler de mes outils au lieu de parler de ses clients. Pour une réponse sur moi, une question sur eux.</p></div>
      </div>
    </div>
  </section>

  <section class="large" data-s="entreprise" data-titre="L'entreprise">
    <h2>L'entreprise, en six faits</h2>
    <div class="rang">
      <div>
        <ul>
          <li>Créée en <strong>2019 à Lyon</strong> par Camille Noiret et Sofiane Ferrand, indépendante. (site, 6 octobre 2026)</li>
          <li><strong>Environ 45 salariés</strong>, les sources publiques varient de 42 à 48. Je ne cite pas de chiffre précis, je pose la question. (6 octobre 2026)</li>
          <li><strong>7,5 M€ levés en mars 2024</strong>, série A menée par un fonds régional. Rien depuis. (presse régionale, 12 mars 2024)</li>
        </ul>
      </div>
      <div>
        <ul>
          <li><strong>Module satisfaction lancé en juin 2026</strong>&#160;: comparer la qualité de service entre points de vente. (blog, 18 juin 2026)</li>
          <li><strong>6 postes ouverts</strong>, dont 3 commerciaux et 1 Customer Success Manager. L'équipe commerciale grossit plus vite que l'équipe produit. (page carrières, 6 octobre 2026)</li>
          <li><strong>Avis clients&#160;: 4,3 sur 5, 61 avis.</strong> Points forts&#160;: la mise en service. Points faibles&#160;: l'application mobile et le délai du support en forte activité. (6 octobre 2026)</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="large" data-s="produit" data-titre="Le produit">
    <h2>Le produit, en trente secondes</h2>
    <div class="rang">
      <div>
        <div class="dire">
          <span class="cue">avec les mots du client</span>
          <p>Le siège d'un réseau voit chaque matin ce que chaque point de vente a vendu, ce qui lui manque et ce que ses clients en disent, <b>sans attendre un reporting mensuel envoyé par mail</b>.</p>
        </div>
        <h3>Les trois différenciateurs</h3>
        <ol class="q">
          <li>«&#160;Je vois mes 60 magasins sur le même écran, sans rien retraiter.&#160;»</li>
          <li>«&#160;Le responsable de magasin y trouve son intérêt à lui, donc il l'ouvre.&#160;»</li>
          <li>«&#160;C'est branché sur ma caisse en deux semaines, pas en six mois.&#160;»</li>
        </ol>
      </div>
      <div>
        <h3>Les concurrents</h3>
        <ul>
          <li><strong>Deux éditeurs nationaux installés</strong>&#160;: plus connus, plus chers, et plus longs à déployer.</li>
          <li><strong>Le tableur du siège</strong>&#160;: le vrai concurrent, gratuit et déjà en place.</li>
        </ul>
        <p class="note">Limites connues&#160;: pas de gestion de stock, application mobile moins complète. Si on me demande ce que je changerais, je parle de l'application mobile, qui revient dans les avis.</p>
      </div>
    </div>
  </section>

  <section data-s="icp" data-titre="L'ICP" data-defaut="cache">
    <h2>À quoi je reconnais un bon client</h2>
    <ol class="q">
      <li><strong>20 à 300 points de vente</strong>&#160;: en dessous, le tableur suffit. Au-dessus, ils ont déjà un éditeur national.</li>
      <li><strong>Une direction qui compare déjà ses sites</strong>, mal et à la main. Le besoin existe, l'outil manque.</li>
      <li><strong>Un secteur où Pilona a une référence</strong>&#160;: restauration, commerce spécialisé.</li>
      <li><strong>Un enjeu de marge visible</strong>&#160;: ouverture de sites, plan d'économies, nouvelle direction des opérations.</li>
    </ol>
    <h3>À qui je parle</h3>
    <p>Direction du réseau et direction des opérations pour la signature. Responsable de point de vente pour l'usage. <strong>Le renouvellement se décide au siège, mais il se perd dans les magasins.</strong></p>
  </section>

  <section class="large" data-s="persona" data-titre="Le persona" data-defaut="cache">
    <h2>Le responsable de point de vente, et ses difficultés</h2>
    <div class="rang">
      <div>
        <ul>
          <li>Il <strong>n'a pas choisi l'outil</strong>&#160;: le siège l'a signé pour lui.</li>
          <li>Il a <strong>15 minutes</strong> entre deux rushs, et trois autres outils ouverts.</li>
          <li>On le juge sur <strong>son chiffre</strong>, pas sur la qualité de ses données.</li>
          <li>Il se méfie d'un outil qui sert d'abord à le surveiller.</li>
        </ul>
      </div>
      <div>
        <div class="dire">
          <span class="cue">ma meilleure question de découverte</span>
          <p>Aujourd'hui, pour savoir où vous en êtes par rapport au mois dernier, <b>vous regardez quoi&#160;?</b></p>
        </div>
        <p class="note">Elle est ouverte, elle ne juge pas, et la réponse me dit en 10 secondes s'il ouvre l'outil ou s'il a gardé son cahier. C'est de là que part toute montée en usage.</p>
      </div>
    </div>
  </section>

  <section class="large" data-s="situation" data-titre="Mise en situation" data-defaut="cache">
    <h2>Si on me fait jouer un appel de renouvellement</h2>
    <div class="tour">
      <div class="moi"><span class="qui">moi, l'ouverture</span><p>Bonjour, Inès Barbier, de Pilona. Votre contrat arrive à échéance fin janvier, et avant d'en parler budget, je voulais faire le point sur ce que vos magasins en font aujourd'hui. <b>Depuis six mois, qu'est-ce qui a changé dans votre façon de suivre le réseau&#160;?</b></p></div>
      <div class="lui"><span class="qui">le directeur du réseau</span><p>Franchement, pas grand-chose. On s'en sert au siège, mais les magasins, je ne sais pas trop.</p></div>
      <div class="moi"><span class="qui">moi, je creuse</span><p>C'est souvent comme ça la première année. <b>Sur vos 48 magasins, lesquels vous appellent quand ils ont une question sur leurs chiffres&#160;?</b></p></div>
      <div class="lui"><span class="qui">lui</span><p>Toujours les mêmes, cinq ou six.</p></div>
      <div class="moi"><span class="qui">moi, la valeur</span><p>Ces cinq-là sont vos relais. Ce que je vous propose, c'est qu'on regarde ensemble les 10 magasins qui n'ouvrent jamais l'outil, et que je passe 20 minutes avec chacun pour leur montrer le seul écran qui leur sert à eux. <b>C'est ce qui fait la différence entre un outil du siège et un outil du réseau.</b></p></div>
      <div class="moi"><span class="qui">moi, la conclusion</span><p>Je vous propose qu'on cale ça avant la fin du mois, pour que ce soit fait avant la discussion du renouvellement. <b>Mardi à 10h, ou jeudi à 15h&#160;?</b></p></div>
    </div>
    <p class="note"><strong>Pourquoi je ne parle pas du prix.</strong> Un renouvellement ne se gagne pas sur la remise, il se gagne sur l'usage. Si j'ouvre sur le budget, je n'ai plus que la remise à offrir.</p>
    <p class="note"><strong>En réserve</strong>&#160;: le taux d'adoption par magasin, la comparaison avec un réseau de taille voisine. Je ne les sors que s'il conteste.</p>
  </section>

  <section class="large" data-s="objections" data-titre="Les objections" data-defaut="cache">
    <h2>Ce qu'on va m'opposer, et ce que je réponds</h2>
    <div class="rang">
      <div>
        <ol class="q ambre">
          <li><strong>«&#160;Nos magasins ne s'en servent pas.&#160;»</strong> C'est le vrai sujet, et c'est le mien. Combien l'ont ouvert ce mois-ci, et parmi ceux qui ne l'ouvrent pas, combien ont été formés&#160;?</li>
          <li><strong>«&#160;C'est trop cher pour ce qu'on en fait.&#160;»</strong> Si l'usage est faible, le prix paraît élevé, c'est logique. Je propose qu'on travaille l'usage d'abord, et qu'on reparle du montant ensuite, avec des chiffres.</li>
          <li><strong>«&#160;On a un tableur qui marche très bien.&#160;»</strong> Qui le met à jour, et combien de temps ça lui prend chaque semaine&#160;?</li>
        </ol>
      </div>
      <div>
        <ol class="q ambre" start="4">
          <li><strong>«&#160;Le support met trois jours à répondre.&#160;»</strong> Je ne le conteste pas. Je veux savoir quelle demande a mis trois jours, et je la reprends moi-même.</li>
          <li><strong>«&#160;On change de direction, tout est gelé.&#160;»</strong> Qui arrive, et quand&#160;? Je prépare une démonstration courte pour la nouvelle direction, c'est le bon moment pour elle.</li>
          <li><strong>«&#160;L'appli mobile est mauvaise.&#160;»</strong> C'est ce qui revient dans les avis, je le sais. Ce que je peux faire, c'est remonter précisément ce qui vous manque et vous dire ce qui est prévu.</li>
        </ol>
      </div>
    </div>
  </section>

  <section class="large" data-s="questions" data-titre="Mes questions">
    <h2>Mes questions de fin d'entretien</h2>
    <div class="rang">
      <div>
        <h3>Pour Sofiane</h3>
        <ol class="q ambre">
          <li>Vous dites souvent que celui qui signe n'est pas celui qui utilise. <strong>Sur vos renouvellements perdus, le problème venait du siège ou des points de vente&#160;?</strong></li>
          <li>Vous avez 3 postes commerciaux ouverts et 1 Customer Success Manager. <strong>Qu'est-ce qui vous dit aujourd'hui que le frein est devant la vente plutôt que derrière&#160;?</strong></li>
        </ol>
      </div>
      <div>
        <h3>Pour Alice</h3>
        <ol class="q ambre" start="3">
          <li><strong>Sur les réseaux que je reprendrais, lequel vous inquiète le plus, et pourquoi&#160;?</strong></li>
          <li>Le module satisfaction lancé en juin&#160;: <strong>les clients l'ont adopté, ou il faut aller le vendre une deuxième fois&#160;?</strong></li>
        </ol>
      </div>
    </div>
    <p class="note">Ordre conseillé&#160;: la première à Sofiane, elle reprend ses mots. Puis celle d'Alice sur le réseau qui l'inquiète, qui lui donne l'occasion de parler de son quotidien. Les deux autres si le temps le permet.</p>
  </section>

  <section class="large" data-s="antiseche" data-titre="Antisèche">
    <h2>Ce que je garde sous les yeux</h2>
    <div class="rang">
      <div>
        <h3>Leurs chiffres</h3>
        <div class="defile"><table>
          <tr><td>Création</td><td class="n">2019, Lyon</td></tr>
          <tr><td>Effectif</td><td class="n">environ 45</td></tr>
          <tr><td>Levée</td><td class="n">7,5 M€ en mars 2024</td></tr>
          <tr><td>Avis clients</td><td class="n">4,3 sur 5, 61 avis</td></tr>
          <tr><td>Postes ouverts</td><td class="n">6, dont 3 commerciaux</td></tr>
          <tr><td>Nouveauté</td><td class="n">module satisfaction, juin 2026</td></tr>
        </table></div>
      </div>
      <div>
        <h3>Mes chiffres</h3>
        <div class="defile"><table>
          <tr><td>Portefeuille</td><td class="n">320 entreprises</td></tr>
          <tr><td>Renouvellement</td><td class="n">94% en 2025, 89% en 2024</td></tr>
          <tr><td>Volume</td><td class="n">40 à 60 demandes par jour</td></tr>
          <tr><td>Formation</td><td class="n">6 conseillers en 2025</td></tr>
          <tr><td>Disponibilité</td><td class="n">mi-novembre, préavis d'un mois</td></tr>
          <tr><td>Prétentions</td><td class="n">38 K€</td></tr>
        </table></div>
        <div class="piege"><p><strong>Les trois choses qu'ils doivent retenir de moi</strong>&#160;: je tiens un gros portefeuille sans en perdre, je fais adopter un outil à des gens qui ne l'ont pas choisi, et j'ai construit moi-même l'outil qui a fait gagner 5 points de renouvellement.</p></div>
      </div>
    </div>
  </section>

  <section data-s="remuneration" data-titre="Rémunération" data-defaut="cache">
    <h2>Rémunération et conditions&#160;: ma position</h2>
    <p>Fourchette affichée&#160;: 34 à 38 K€ de fixe, plus une prime liée au renouvellement. <strong>Je demande 38 K€</strong>, le haut de leur fourchette, et je le justifie par les 320 comptes que je suis déjà et par les 5 points de renouvellement gagnés. Si on me propose 36, je demande la part variable et son mode de calcul avant de répondre.</p>
    <p>Ce que je ne négocie pas à cette étape&#160;: les 2 jours de télétravail, qui sont dans l'annonce, et la date de disponibilité. Je confirme la convention collective applicable et les titres-restaurant, sans en faire un sujet.</p>
  </section>

  <section data-s="vocabulaire" data-titre="Vocabulaire" data-defaut="cache">
    <h2>Le vocabulaire du métier</h2>
    <ul>
      <li><strong>Réseau</strong>&#160;: l'ensemble des points de vente d'une enseigne, franchisés ou intégrés.</li>
      <li><strong>Franchisé</strong>&#160;: indépendant juridiquement. On ne lui impose pas un outil, on le lui fait adopter.</li>
      <li><strong>Succursale</strong>, ou point de vente intégré&#160;: détenu par l'enseigne, le siège peut imposer.</li>
      <li><strong>Taux d'adoption</strong>&#160;: part des points de vente qui ouvrent l'outil chaque semaine.</li>
      <li><strong>Montée en usage</strong>&#160;: passer d'un usage minimal à un usage quotidien, sur plusieurs modules.</li>
      <li><strong>Renouvellement</strong>&#160;: la reconduction de l'abonnement annuel, décidée au siège.</li>
    </ul>
  </section>

  <section class="large" data-s="bilan" data-titre="Bilan" data-defaut="cache">
    <h2>Après l'entretien&#160;: ce que j'en retiens</h2>
    <p>À remplir le soir même&#160;: ce qui s'est dit, les chiffres appris, la prochaine étape et le délai de réponse annoncé, puis le mail de remerciement, court, avec une question qui reprend un point de l'échange.</p>
  </section>

</div>`);
