/* Chaque fiche de preparation vit dans son propre fichier cockpit/fiche-*.js
   et s'enregistre avec fiche(id, nom, note, html). Voir modeles/fiche-exemple.js.
   L'id doit correspondre a l'id du dossier (ou a son debut) pour que
   l'agenda propose le bouton "Preparation". */
var FICHES = {};
var FICHES_INFO = [];
function fiche(id, nom, note, html){
  FICHES[id] = html;
  FICHES_INFO.push({id:id, nom:nom, note:note});
}

function panFiches(){
  FICHES_INFO.forEach(function(info){
    var k = info.id;
    var pan = document.getElementById("p-"+k);
    if(!pan) return;
    pan.innerHTML = FICHES[k];
    bascule(pan);
    if(pan.querySelector("[data-perso]")) perso(pan, k);
    else sommaire(pan, k);
  });
}

/* Sections a la carte : on choisit ce qui reste a l'ecran, et le choix
   est garde dans ce navigateur. On ne stocke que les ecarts au reglage par
   defaut, pour qu'une section ajoutee plus tard apparaisse normalement. */
function perso(pan, cle){
  var CLE = "cockpit-sections-" + cle;
  var ecarts = {};
  try { ecarts = JSON.parse(localStorage.getItem(CLE) || "{}") || {}; } catch(e){ ecarts = {}; }
  function sauve(){ try { localStorage.setItem(CLE, JSON.stringify(ecarts)); } catch(e){} }

  var sections = Array.prototype.slice.call(pan.querySelectorAll("section[data-s]"));
  var barre = document.createElement("div");
  barre.className = "perso";
  var lab = document.createElement("b");
  lab.textContent = "Sections affichées";
  barre.appendChild(lab);
  var puces = document.createElement("div");
  puces.className = "perso-puces";
  barre.appendChild(puces);
  var compte = document.createElement("span");
  compte.className = "perso-compte";
  barre.appendChild(compte);
  var tout = document.createElement("button");
  tout.type = "button"; tout.className = "lienbtn"; tout.textContent = "Tout afficher";
  barre.appendChild(tout);
  var defaut = document.createElement("button");
  defaut.type = "button"; defaut.className = "lienbtn"; defaut.textContent = "Réglage d'origine";
  barre.appendChild(defaut);

  var items = sections.map(function(sec){
    var id = sec.getAttribute("data-s");
    var parDefaut = sec.getAttribute("data-defaut") !== "cache";
    var titre = sec.getAttribute("data-titre") || sec.querySelector("h2").textContent;
    var puce = document.createElement("button");
    puce.type = "button"; puce.className = "puce-s"; puce.textContent = titre;
    puce.title = "Afficher ou masquer cette section";
    puces.appendChild(puce);
    var h2 = sec.querySelector("h2");
    var masque = document.createElement("button");
    masque.type = "button"; masque.className = "masque-s"; masque.textContent = "Masquer";
    masque.setAttribute("aria-label", "Masquer la section " + titre);
    h2.appendChild(masque);
    var it = {id:id, sec:sec, puce:puce, parDefaut:parDefaut};
    puce.addEventListener("click", function(){
      var vis = !visible(it);
      regle(it, vis);
      if(vis) sec.scrollIntoView({behavior:"smooth", block:"start"});
    });
    masque.addEventListener("click", function(){ regle(it, false); });
    return it;
  });

  function visible(it){ return (it.id in ecarts) ? ecarts[it.id] : it.parDefaut; }
  function regle(it, vis){
    if(vis === it.parDefaut) delete ecarts[it.id]; else ecarts[it.id] = vis;
    sauve(); rend();
  }
  function rend(){
    var n = 0;
    items.forEach(function(it){
      var vis = visible(it);
      it.sec.hidden = !vis;
      it.puce.setAttribute("aria-pressed", vis ? "true" : "false");
      if(vis) n++;
    });
    compte.textContent = n + " sur " + items.length;
  }
  tout.addEventListener("click", function(){
    items.forEach(function(it){ if(it.parDefaut) delete ecarts[it.id]; else ecarts[it.id] = true; });
    sauve(); rend();
  });
  defaut.addEventListener("click", function(){ ecarts = {}; sauve(); rend(); });

  pan.insertBefore(barre, pan.firstChild);
  rend();
}

/* Barre de navigation interne, utile des que la fiche depasse une dizaine
   de sections : pendant un entretien, chercher en faisant defiler est perdu. */
function sommaire(pan, cle){
  // le sommaire ne liste que ce qui sert pendant l'entretien
  var titres = [];
  Array.prototype.forEach.call(pan.querySelectorAll("section > h2"), function(h){
    if(!h.parentNode.parentNode.classList.contains("repli")) titres.push(h);
  });
  if(titres.length < 8) return;
  var nav = document.createElement("nav");
  nav.className = "somm";
  var lab = document.createElement("b");
  lab.textContent = "Aller à";
  nav.appendChild(lab);
  titres.forEach(function(h, i){
    var sec = h.parentNode;
    sec.id = "s-" + cle + "-" + i;
    var a = document.createElement("a");
    a.href = "#" + sec.id;
    a.textContent = h.textContent.replace(/\s*·.*$/, "").trim();
    a.addEventListener("click", function(e){
      e.preventDefault();
      sec.scrollIntoView({behavior:"smooth", block:"start"});
    });
    nav.appendChild(a);
  });
  pan.insertBefore(nav, pan.firstChild);
}

/* Replie le fond documentaire : pendant l'entretien, seul l'essentiel reste
   a l'ecran. Le bouton dit combien de sections se cachent derriere. */
function bascule(pan){
  var b = pan.querySelector(".ouvre-fond");
  if(!b) return;
  var cible = pan.querySelector("#" + b.getAttribute("aria-controls"));
  if(!cible) return;
  var libelle = b.textContent.trim();
  b.addEventListener("click", function(){
    var ouvert = cible.hidden;
    cible.hidden = !ouvert;
    b.setAttribute("aria-expanded", ouvert ? "true" : "false");
    b.textContent = ouvert ? "Masquer le fond" : libelle;
    if(ouvert) cible.scrollIntoView({behavior:"smooth", block:"start"});
  });
}
