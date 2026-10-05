(function(){
"use strict";

/* ------------------------------------------------------------ dates */
function iso(d){ var m=d.getMonth()+1, j=d.getDate(); return d.getFullYear()+"-"+(m<10?"0":"")+m+"-"+(j<10?"0":"")+j; }
var AUJ = iso(new Date());
var MOIS = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
var MOIS_LONG = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
var JOURS = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
var JOURS_C = ["dim.","lun.","mar.","mer.","jeu.","ven.","sam."];

function dt(s){ return new Date(s+"T12:00:00"); }
function joli(s){ if(!s) return "-"; var p=s.split("-"); return Number(p[2])+" "+MOIS[Number(p[1])-1]; }
function jourDe(s){ return JOURS[dt(s).getDay()]; }
function ecart(s){ return Math.round((dt(s) - dt(AUJ))/86400000); }
function plus(s, n){ var d=dt(s); d.setDate(d.getDate()+n); return iso(d); }
function quand(s){
  if(!s) return "";
  var e = ecart(s);
  if(e===0) return "aujourd'hui";
  if(e===1) return "demain";
  if(e===-1) return "hier";
  if(e<0) return "en retard de "+(-e)+" j";
  if(e<7) return JOURS_C[dt(s).getDay()]+" "+joli(s);
  return joli(s);
}
function el(t,c,x){ var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e; }
function sansAccent(s){ return (s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase(); }

(function semaine(){
  var d = dt(AUJ), jour = d.getDay() || 7;
  var lun = new Date(d); lun.setDate(d.getDate()-jour+1);
  var ven = new Date(lun); ven.setDate(lun.getDate()+4);
  var f = document.getElementById("semaine"); if(!f) return;
  f.textContent = "Semaine du ";
  var b = el("b",null, lun.getDate()+(lun.getMonth()!==ven.getMonth()?" "+MOIS_LONG[lun.getMonth()]:"")+" au "+ven.getDate()+" "+MOIS_LONG[ven.getMonth()]+" "+ven.getFullYear());
  f.appendChild(b);
})();

/* ---------------------------------------------------------- statuts */
var STATUTS = {
  reperee:{l:"Repérée",c:"--encre-3"}, prete:{l:"Dossier prêt",c:"--st-prete"},
  pause:{l:"En pause",c:"--st-pause"}, envoyee:{l:"Envoyée",c:"--st-envoyee"},
  relancee:{l:"Relancée",c:"--st-envoyee"}, reponse:{l:"Réponse reçue",c:"--st-reponse"},
  entretien:{l:"Entretien",c:"--st-entretien"}, offre:{l:"Offre",c:"--st-envoyee"},
  refus:{l:"Refus",c:"--st-refus"}, sans_suite:{l:"Sans suite",c:"--st-refus"}
};
var ORDRE = ["entretien","reponse","offre","relancee","envoyee","prete","reperee","pause","refus","sans_suite"];
var GROUPES = [
  {id:"cours",   nom:"En cours",   st:["entretien","reponse","offre"], note:"Entretiens et échanges ouverts."},
  {id:"attente", nom:"En attente", st:["envoyee","relancee"], note:"Candidatures envoyées sans réponse. Au-delà de 21 jours, le cockpit propose de les classer sans suite."},
  {id:"envoyer", nom:"À envoyer",  st:["prete","reperee"], note:"Dossiers prêts ou repérés, du mieux noté au moins bien noté."},
  {id:"clos",    nom:"Clos",       st:["refus","sans_suite","pause"], note:"Refus, sans suite et dossiers en pause."}
];
function groupeDe(s){ for(var i=0;i<GROUPES.length;i++) if(GROUPES[i].st.indexOf(s)>=0) return GROUPES[i].id; return "envoyer"; }
function pastille(s){
  var st = STATUTS[s]||STATUTS.reperee;
  var p = el("span","pastille",st.l); p.style.background="var("+st.c+")"; return p;
}

/* --------------------------------------------------------- dossiers */
var dossiers = DOSSIERS.slice();
var db = null;
var OFFRE_ETAT = {};
var ouvert = null;          // dossier deplie
var recherche = "";
var closOuvert = false;

function depuisBase(id, x){
  return { id:id, e:x.entreprise||"", p:x.poste||"", l:x.lieu||"", c:x.cabinet||"",
    s:x.statut||"reperee", de:x.dateEnvoi||"", r:x.relance||"", cp:x.campagne||"",
    no:x.note||"", t:(typeof x.triage==="number"?x.triage:null), u:x.url||"",
    et:x.etape||"", a:x.action||"", ad:x.actionDate||"", h:x.heure||"",
    j:Array.isArray(x.journal)?x.journal:[] };
}

// Prochaine action : celle saisie, sinon la relance prevue pour un dossier en attente.
function prochaine(d){
  if(d.a || d.ad) return {a:d.a||"À faire", d:d.ad};
  if(d.s==="envoyee"||d.s==="relancee"){
    var r = d.r || (d.de ? plus(d.de,7) : "");
    return {a:"Relancer", d:r};
  }
  return {a:"", d:""};
}
function age(d){ return d.de ? -ecart(d.de) : null; }
function aFaire(d){
  if(groupeDe(d.s)==="clos") return false;
  return !!(d.ad && ecart(d.ad) <= 0);
}
function relanceDue(d){
  if(groupeDe(d.s)!=="attente" || d.a || d.ad) return false;
  var n = prochaine(d);
  return !!(n.d && ecart(n.d) <= 0);
}
function aProposerSansSuite(d){ var a=age(d); return groupeDe(d.s)==="attente" && a!==null && a>21; }

/* ---------------------------------------------------------- onglets */
var ONGLETS = [{id:"semaine", nom:"Agenda", note:""}]
  .concat(FICHES_INFO.map(function(f){ return {id:f.id, nom:f.nom, note:f.note||""}; }))
  .concat([{id:"suivi", nom:"Candidatures", note:""}, {id:"offres", nom:"Offres", note:""}]);
function ficheDe(d){
  var ids = ONGLETS.map(function(o){ return o.id; });
  if(ids.indexOf(d.id)>=0) return d.id;
  var racine = d.id.split("-")[0];
  return ids.indexOf(racine)>=0 && racine!=="semaine" ? racine : null;
}

function bati(){
  var bo = document.getElementById("onglets");
  ONGLETS.forEach(function(o,i){
    var b = el("button","onglet",o.nom);
    b.type="button"; b.id="t-"+o.id; b.setAttribute("role","tab");
    b.setAttribute("aria-controls","p-"+o.id);
    b.setAttribute("aria-selected", i===0?"true":"false");
    var n = el("i",null,o.note); n.id="n-"+o.id; b.appendChild(n);
    b.addEventListener("click", function(){ montre(o.id); });
    bo.appendChild(b);
  });
  var mp = document.getElementById("panneaux");
  ONGLETS.forEach(function(o,i){
    var d = el("div","pan"); d.id="p-"+o.id;
    d.setAttribute("role","tabpanel"); d.setAttribute("aria-labelledby","t-"+o.id);
    if(i!==0) d.hidden = true;
    mp.appendChild(d);
  });
}
function montre(id){
  ONGLETS.forEach(function(o){
    var actif = o.id===id;
    document.getElementById("t-"+o.id).setAttribute("aria-selected", actif?"true":"false");
    document.getElementById("p-"+o.id).hidden = !actif;
  });
  window.scrollTo({top:0});
}
function ouvreDossier(id){
  ouvert = id; recherche = "";
  var d = dossiers.filter(function(x){ return x.id===id; })[0];
  if(d && groupeDe(d.s)==="clos") closOuvert = true;
  panSuivi(); montre("suivi");
  var ligne = document.getElementById("d-"+id);
  if(ligne) ligne.scrollIntoView({block:"center"});
}

/* --------------------------------------------------------- compteurs */
function repartition(){
  var c = {}, total = dossiers.length;
  dossiers.forEach(function(d){ c[d.s] = (c[d.s]||0)+1; });
  var barre = document.getElementById("barre");
  var leg = document.getElementById("legende");
  barre.textContent = ""; leg.textContent = "";
  ORDRE.forEach(function(k){
    var n = c[k]; if(!n) return;
    var st = STATUTS[k];
    var seg = el("div","seg");
    seg.style.flexGrow = n;
    seg.style.background = "var("+st.c+")";
    seg.title = st.l + " : " + n + " sur " + total;
    barre.appendChild(seg);
    var seul = el("span");
    var pu = el("i","puce"); pu.style.background = "var("+st.c+")";
    seul.appendChild(pu);
    seul.appendChild(el("b",null,n));
    seul.appendChild(document.createTextNode(" "+st.l));
    leg.appendChild(seul);
  });
}

function compteurs(){
  var g = {cours:0,attente:0,envoyer:0,clos:0};
  dossiers.forEach(function(d){ g[groupeDe(d.s)]++; });
  var dus = dossiers.filter(aFaire).length;
  var relances = dossiers.filter(relanceDue).length;
  var vieux = dossiers.filter(aProposerSansSuite).length;
  var envoyees = dossiers.filter(function(d){ return !!d.de; });
  var entretiens = envoyees.filter(function(d){
    return ["entretien","reponse","offre"].indexOf(d.s)>=0 || d.j.some(function(x){ return x.s==="entretien"; });
  }).length;
  var taux = envoyees.length ? Math.round(100*entretiens/envoyees.length) : 0;
  var aTrier = OFFRES.filter(function(o){ return etatOffre(o).k==="a_trier"; }).length;
  var data = [
    [dus,"à faire aujourd'hui",1,"suivi"],
    [g.cours,"en cours",1,"suivi"],
    [relances,"relances dépassées",0,"suivi",vieux ? vieux+" sans réponse depuis plus de 21 jours" : null],
    [g.attente,"en attente",0,"suivi"],
    [g.envoyer,"à envoyer",0,"suivi"],
    [taux+"%","taux d'entretien",0,null,entretiens+" entretiens pour "+envoyees.length+" candidatures envoyées"],
    [aTrier,"offres à trier",0,"offres"]
  ];
  var h = document.getElementById("jauges"); h.textContent="";
  data.forEach(function(x){
    var d = el(x[3]?"button":"div","jauge"+(x[2]?" chaud":""));
    if(x[3]){ d.type="button"; d.addEventListener("click", function(){ montre(x[3]); }); }
    if(x[4]) d.title = x[4];
    d.appendChild(el("b",null,x[0])); d.appendChild(el("span",null,x[1]));
    h.appendChild(d);
  });
  var n = document.getElementById("n-semaine");
  if(n) n.textContent = dus ? dus+" à faire" : "";
}

/* ---------------------------------------------------------- semaine */
function ligneAction(d, cible){
  var n = prochaine(d);
  var li = el("div","rdv");
  var q = el("div","quand");
  var e = n.d ? ecart(n.d) : null;
  q.appendChild(el("b",(e!==null&&e<0)?"retard":null, n.d ? (e<=0&&e>-2 ? quand(n.d) : (e<0 ? quand(n.d) : jourDe(n.d)+" "+joli(n.d))) : "date à caler"));
  q.appendChild(document.createTextNode((d.h?d.h+" · ":"")+(d.et||STATUTS[d.s].l)));
  var w = el("div","quoi");
  w.appendChild(el("b",null,d.e));
  w.appendChild(el("span",null,n.a));
  li.appendChild(q); li.appendChild(w);
  var bt = el("div","boutons");
  var f = ficheDe(d);
  if(f && cible!=="sans-fiche"){
    var a = el("button","aller","Préparation"); a.type="button";
    a.addEventListener("click", function(){ montre(f); }); bt.appendChild(a);
  }
  var o = el("button","aller","Dossier"); o.type="button";
  o.addEventListener("click", function(){ ouvreDossier(d.id); }); bt.appendChild(o);
  li.appendChild(bt);
  return li;
}
function parDate(a,b){
  var x = prochaine(a).d || "9999", y = prochaine(b).d || "9999";
  return x<y ? -1 : x>y ? 1 : a.e.localeCompare(b.e,"fr");
}

function panSemaine(){
  var p = document.getElementById("p-semaine"); p.textContent="";
  var g = el("div","grille");

  var s1 = el("section","large");
  s1.appendChild(el("h2",null,"Agenda des processus en cours"));
  var cours = dossiers.filter(function(d){ return groupeDe(d.s)==="cours"; }).sort(parDate);
  if(!cours.length) s1.appendChild(el("p","note","Aucun processus en cours."));
  cours.forEach(function(d){ s1.appendChild(ligneAction(d)); });
  g.appendChild(s1);

  var s2 = el("section","large");
  s2.appendChild(el("h2",null,"À faire dans les 7 jours"));
  var semaine = dossiers.filter(function(d){
    if(groupeDe(d.s)==="clos"||groupeDe(d.s)==="cours") return false;
    var n = prochaine(d); return n.d && ecart(n.d) <= 7 && (d.a || ecart(n.d) >= 0 || d.s!=="envoyee");
  }).sort(parDate);
  var relances = dossiers.filter(relanceDue).length;
  if(!semaine.length) s2.appendChild(el("p","note","Rien de daté cette semaine."));
  semaine.forEach(function(d){ s2.appendChild(ligneAction(d)); });
  if(relances){
    var r = el("p","avis");
    r.appendChild(document.createTextNode(relances+" candidatures envoyées ont dépassé leur date de relance. "));
    var a = el("button","lienbtn","Les voir dans Candidatures"); a.type="button";
    a.addEventListener("click", function(){ montre("suivi"); });
    r.appendChild(a); s2.appendChild(r);
  }
  g.appendChild(s2);

  p.appendChild(g);
}

/* ------------------------------------------------------------ suivi */
function correspond(d){
  if(!recherche) return true;
  var q = sansAccent(recherche);
  return sansAccent(d.e+" "+d.p+" "+d.c+" "+d.no).indexOf(q)>=0;
}

function celluleAge(d){
  var td = el("td","n");
  var a = age(d);
  if(a===null){ td.textContent="-"; td.classList.add("rien"); return td; }
  var g = groupeDe(d.s);
  var chip = el("span","age", a===0 ? "aujourd'hui" : "il y a "+a+" j");
  if(g==="attente") chip.classList.add(a<=7?"frais":a<=14?"moyen":"vieux");
  td.appendChild(chip);
  td.appendChild(el("div","note","envoyée le "+joli(d.de)));
  return td;
}
function celluleAction(d){
  var td = el("td","act");
  var n = prochaine(d);
  if(!n.a && !n.d){ td.appendChild(el("span","rien","-")); return td; }
  if(n.d){
    var e = ecart(n.d);
    var b = el("span","echeance"+(e<0?" retard":e===0?" jour":""), quand(n.d)+(d.h?" · "+d.h:""));
    td.appendChild(b);
  }
  td.appendChild(el("div","texte-action",n.a));
  return td;
}

function panSuivi(){
  var p = document.getElementById("p-suivi"); p.textContent="";

  var barre = el("div","outils");
  var champ = el("input","recherche"); champ.type="search"; champ.placeholder="Rechercher une entreprise, un poste, un contact…";
  champ.value = recherche;
  champ.addEventListener("input", function(){ recherche = champ.value; rendGroupes(); });
  barre.appendChild(champ);
  var sauts = el("div","sauts");
  barre.appendChild(sauts);
  p.appendChild(barre);
  if(!db){
    p.appendChild(el("p","avis bandeau","Lecture seule : les boutons de mise à jour ne fonctionnent que dans la page publiée."));
  }

  var zone = el("div"); p.appendChild(zone);

  function rendGroupes(){
    zone.textContent=""; sauts.textContent="";
    var dus = dossiers.filter(function(d){ return aFaire(d) && correspond(d); }).sort(parDate);
    if(dus.length){
      var s0 = el("section","large faire");
      s0.appendChild(el("h2",null,"À faire aujourd'hui ("+dus.length+")"));
      var l = el("div","liste-faire");
      dus.slice(0,12).forEach(function(d){
        var n = prochaine(d);
        var b = el("button","item-faire"); b.type="button";
        b.appendChild(el("span","echeance"+(ecart(n.d)<0?" retard":" jour"), quand(n.d)));
        b.appendChild(el("b",null,d.e+(d.c?" (via "+d.c+")":"")));
        b.appendChild(el("span","texte-action",n.a));
        b.addEventListener("click", function(){ ouvreDossier(d.id); });
        l.appendChild(b);
      });
      s0.appendChild(l);
      if(dus.length>12) s0.appendChild(el("p","note","Et "+(dus.length-12)+" autres, en tête de leur groupe."));
      zone.appendChild(s0);
    }
    var nbRel = dossiers.filter(function(d){ return relanceDue(d) && correspond(d); }).length;
    if(nbRel){
      var rr = el("p","bandeau");
      rr.appendChild(document.createTextNode(nbRel+" candidatures envoyées ont dépassé leur date de relance. Elles sont en tête du groupe En attente, du plus ancien au plus récent. "));
      var go = el("button","lienbtn","Y aller"); go.type="button";
      go.addEventListener("click", function(){ var c=document.getElementById("g-attente"); if(c) c.scrollIntoView({block:"start"}); });
      rr.appendChild(go); zone.appendChild(rr);
    }

    GROUPES.forEach(function(G){
      var liste = dossiers.filter(function(d){ return groupeDe(d.s)===G.id && correspond(d); });
      if(G.id==="envoyer") liste.sort(function(a,b){ return (b.t||0)-(a.t||0) || a.e.localeCompare(b.e,"fr"); });
      else if(G.id==="attente") liste.sort(function(a,b){ return (aFaire(b)-aFaire(a)) || (relanceDue(b)-relanceDue(a)) || ((age(b)||0)-(age(a)||0)); });
      else if(G.id==="cours") liste.sort(parDate);
      else liste.sort(function(a,b){ return (b.de||"").localeCompare(a.de||""); });

      var ancre = el("a","saut",G.nom+" "+liste.length); ancre.href="#g-"+G.id;
      ancre.addEventListener("click", function(ev){ ev.preventDefault(); if(G.id==="clos"&&!closOuvert){ closOuvert=true; rendGroupes(); }
        var c=document.getElementById("g-"+G.id); if(c) c.scrollIntoView({block:"start"}); });
      sauts.appendChild(ancre);

      var s = el("section","large groupe"); s.id="g-"+G.id;
      var tete = el("div","tete-groupe");
      tete.appendChild(el("h2",null,G.nom+" ("+liste.length+")"));
      if(G.id==="clos"){
        var t = el("button","aller",closOuvert?"Replier":"Afficher"); t.type="button";
        t.addEventListener("click", function(){ closOuvert=!closOuvert; rendGroupes(); });
        tete.appendChild(t);
      }
      s.appendChild(tete);
      s.appendChild(el("p","note",G.note));
      if(G.id==="clos" && !closOuvert && !recherche){ zone.appendChild(s); return; }
      if(!liste.length){ s.appendChild(el("p","note rien","Aucun dossier.")); zone.appendChild(s); return; }

      var w = el("div","defile");
      var t2 = el("table","suivi");
      var tr = el("tr");
      ["Entreprise","Poste","Étape","Envoyée","Prochaine action","Note",""].forEach(function(h){ tr.appendChild(el("th",null,h)); });
      t2.appendChild(tr);
      liste.forEach(function(d){
        var l = el("tr","ligne"+(ouvert===d.id?" ouverte":"")+(aFaire(d)?" due":""));
        l.id = "d-"+d.id; l.tabIndex = 0;
        var c1 = el("td");
        c1.appendChild(el("strong",null,d.e));
        if(d.c){ c1.appendChild(el("span","note"," via "+d.c)); }
        if(d.l) c1.appendChild(el("div","note",d.l));
        l.appendChild(c1);
        l.appendChild(el("td","poste",d.p));
        var c3 = el("td"); c3.appendChild(pastille(d.s));
        if(d.et) c3.appendChild(el("div","note",d.et));
        if(aProposerSansSuite(d)) c3.appendChild(el("div","conseil","Sans suite ?"));
        l.appendChild(c3);
        l.appendChild(celluleAge(d));
        l.appendChild(celluleAction(d));
        l.appendChild(el("td","n"+(d.t?"":" rien"), d.t ? d.t.toFixed(1) : "-"));
        l.appendChild(el("td","chevron", ouvert===d.id ? "▾" : "▸"));
        function bascule(){ ouvert = ouvert===d.id ? null : d.id; rendGroupes();
          var r=document.getElementById("d-"+d.id); if(r) r.focus({preventScroll:true}); }
        l.addEventListener("click", function(ev){ if(ev.target.closest("a,button,input,textarea,select")) return; bascule(); });
        l.addEventListener("keydown", function(ev){ if(ev.key==="Enter"&&ev.target===l){ bascule(); } });
        t2.appendChild(l);
        if(ouvert===d.id) t2.appendChild(detail(d));
      });
      w.appendChild(t2); s.appendChild(w);
      zone.appendChild(s);
    });
    if(recherche && !zone.querySelector("tr.ligne")) zone.appendChild(el("p","note","Aucun dossier ne correspond à « "+recherche+" »."));
  }
  rendGroupes();
}

/* ------------------------------------------------ detail et edition */
function ecrire(id, champs){
  if(!db) return Promise.reject({code:"not_granted"});
  champs.maj = AUJ;
  return db.collection("candidatures").doc(id).update(champs);
}
function changeStatut(d, s){
  var c = {statut:s, journal:d.j.concat([{d:AUJ,s:s}])};
  if(s==="envoyee"){ if(!d.de) c.dateEnvoi=AUJ; c.relance=plus(AUJ,7); c.action="Relancer"; c.actionDate=plus(AUJ,7); c.etape=""; }
  if(s==="relancee"){ c.relance=plus(AUJ,7); c.action="Dernière relance ou classer sans suite"; c.actionDate=plus(AUJ,7); }
  if(s==="refus"||s==="sans_suite"||s==="pause"){ c.action=""; c.actionDate=""; c.heure=""; }
  return ecrire(d.id, c);
}

function detail(d){
  var tr = el("tr","detail");
  var td = el("td"); td.colSpan = 7;
  var g = el("div","fiche-dossier");

  var gauche = el("div");
  gauche.appendChild(el("h3",null,d.e+" · "+d.p));
  if(d.u){
    var a = el("a","lien","Voir l'annonce ↗"); a.href=d.u; a.target="_blank"; a.rel="noopener noreferrer";
    gauche.appendChild(a);
  }
  var f = ficheDe(d);
  if(f){
    var bf = el("button","lienbtn","Fiche de préparation"); bf.type="button";
    bf.addEventListener("click", function(){ montre(f); });
    gauche.appendChild(document.createTextNode("  ")); gauche.appendChild(bf);
  }
  gauche.appendChild(el("p","texte-note",d.no||"Pas de note."));
  if(d.j.length){
    gauche.appendChild(el("h4",null,"Historique"));
    var ol = el("ol","journal");
    d.j.forEach(function(x){
      var li = el("li");
      li.appendChild(el("span","mono",joli(x.d)));
      li.appendChild(pastille(x.s));
      ol.appendChild(li);
    });
    gauche.appendChild(ol);
  }
  g.appendChild(gauche);

  var droite = el("div","edition");
  var msg = el("p","retour");
  function fait(txt){ return function(){ msg.textContent = txt; msg.className="retour ok"; }; }
  function rate(e){ msg.textContent = "Échec de l'enregistrement ("+((e&&e.code)||"erreur")+"). Réessaie dans un instant."; msg.className="retour ko"; }
  var inactif = !db;

  droite.appendChild(el("h4",null,"Changer d'étape"));
  var bs = el("div","statuts");
  ["envoyee","relancee","entretien","reponse","offre","refus","sans_suite","pause","prete"].forEach(function(s){
    var b = el("button","btn-statut"+(d.s===s?" actif":""), STATUTS[s].l); b.type="button";
    b.style.setProperty("--c","var("+STATUTS[s].c+")");
    b.disabled = inactif || d.s===s;
    b.addEventListener("click", function(){
      b.disabled = true; msg.textContent="Enregistrement…"; msg.className="retour";
      changeStatut(d, s).then(fait("Étape enregistrée : "+STATUTS[s].l+"."), rate);
    });
    bs.appendChild(b);
  });
  droite.appendChild(bs);

  droite.appendChild(el("h4",null,"Prochaine action"));
  var form = el("div","formulaire");
  function champ(lbl, type, val, cls){
    var l = el("label",cls); l.appendChild(el("span",null,lbl));
    var i = el(type==="textarea"?"textarea":"input"); if(type!=="textarea") i.type=type;
    i.value = val||""; i.disabled = inactif; l.appendChild(i); form.appendChild(l); return i;
  }
  var iEt = champ("Étape précise","text",d.et,"large");
  var iA = champ("Action","text",d.a,"large");
  var iD = champ("Date","date",d.ad);
  var iH = champ("Heure","text",d.h);
  var iN = champ("Ajouter à la note","textarea","","large");
  droite.appendChild(form);
  var ok = el("button","btn-principal","Enregistrer"); ok.type="button"; ok.disabled = inactif;
  ok.addEventListener("click", function(){
    var c = {etape:iEt.value.trim(), action:iA.value.trim(), actionDate:iD.value, heure:iH.value.trim()};
    var ajout = iN.value.trim();
    if(ajout) c.note = (d.no ? d.no+" " : "") + "["+joli(AUJ)+"] "+ajout;
    ok.disabled = true; msg.textContent="Enregistrement…"; msg.className="retour";
    ecrire(d.id, c).then(fait("Enregistré."), function(e){ ok.disabled=false; rate(e); });
  });
  droite.appendChild(ok);
  droite.appendChild(msg);
  if(inactif) droite.appendChild(el("p","note","Modifiable uniquement dans la page publiée."));
  g.appendChild(droite);

  td.appendChild(g); tr.appendChild(td);
  return tr;
}

/* ----------------------------------------------------------- offres */
function normUrl(u){
  return (u||"").toLowerCase().replace(/^https?:\/\//,"").replace(/^www\./,"")
    .replace(/[?#].*$/,"").replace(/\/+$/,"").replace(/\/(en|fr)\/companies\//,"/companies/");
}
function cleE(s){ return sansAccent(s).replace(/[^a-z0-9]+/g," ").trim(); }
var indexDossiers = null;
function indexe(){
  var parUrl = {}, parCle = {}, parE = {};
  dossiers.forEach(function(d){
    var urls = (d.no||"").match(/https?:\/\/[^\s]+/g) || [];
    if(d.u) urls.push(d.u);
    urls.forEach(function(u){ parUrl[normUrl(u.replace(/[.,;)]+$/,""))] = d; });
    parCle[cleE(d.e)+"|"+cleE(d.p)] = d;
    (parE[cleE(d.e)] = parE[cleE(d.e)] || []).push(d);
  });
  indexDossiers = {url:parUrl, cle:parCle, e:parE};
}
function dossierDe(o){
  if(!indexDossiers) indexe();
  return indexDossiers.url[normUrl(o.u)] || indexDossiers.cle[cleE(o.e)+"|"+cleE(o.p)] || null;
}
function etatOffre(o){
  var d = dossierDe(o);
  if(d){
    if(d.s==="prete"||d.s==="reperee") return {k:"dossier", d:d};
    return {k:"candidatee", d:d};
  }
  var sur = OFFRE_ETAT[String(o.n)];
  if(sur && sur.etat==="ecartee") return {k:"ecartee"};
  if(o.s==="ecartee" && !(sur && sur.etat==="a_trier")) return {k:"ecartee"};
  if(o.d && -ecart(o.d) > 30 && !(sur && sur.etat==="a_trier")) return {k:"fermee"};
  return {k:"a_trier"};
}
var ETATS_O = [
  ["a_trier","À trier"],["dossier","Dossier prêt"],["candidatee","Candidatées"],
  ["fermee","Probablement fermées"],["ecartee","Écartées"],["tout","Toutes"]
];
function typeOffre(o){
  var p = (o.p||"").toLowerCase();
  for(var i=0;i<TYPES_OFFRE.length;i++) if(new RegExp(TYPES_OFFRE[i].motif,"i").test(p)) return TYPES_OFFRE[i].id;
  return "autre";
}
var fEtat = "a_trier", fType = "tout", fTri = "note", fNouv = false, fTexte = "";

function panOffres(){
  var p = document.getElementById("p-offres"); p.textContent="";
  indexe();
  var etats = OFFRES.map(function(o){ return {o:o, e:etatOffre(o)}; });
  var compte = {tout:etats.length};
  etats.forEach(function(x){ compte[x.e.k] = (compte[x.e.k]||0)+1; });
  var nouv = OFFRES.filter(function(o){ return o.nv===1; });
  var dateNouv = nouv.reduce(function(m,o){ return (o.a||"")>m ? o.a : m; }, "");

  var s = el("section","large");
  s.appendChild(el("h2",null,"Offres suivies"));
  var intro = OFFRES.length+" offres suivies, dont "+(compte.a_trier||0)+" à trier.";
  if(nouv.length) intro += " Dernière vague : "+nouv.length+" offres ajoutées"+(dateNouv?" le "+joli(dateNouv).replace(/\.$/,""):"")+".";
  s.appendChild(el("p","note",intro));

  var f = el("div","filtres");
  f.appendChild(el("i",null,"État"));
  ETATS_O.forEach(function(x){
    var b = el("button","chip",x[1]+" "+(compte[x[0]]||0)); b.type="button";
    b.setAttribute("aria-pressed", fEtat===x[0]?"true":"false");
    b.addEventListener("click", function(){ fEtat=x[0]; panOffres(); });
    f.appendChild(b);
  });
  s.appendChild(f);

  var f2 = el("div","filtres");
  var types = TYPES_OFFRE.length ? [["tout","Tous"]].concat(TYPES_OFFRE.map(function(t){ return [t.id,t.nom]; })).concat([["autre","Autres"]]) : [];
  if(types.length) f2.appendChild(el("i",null,"Type"));
  types.forEach(function(x){
    var b = el("button","chip",x[1]); b.type="button";
    b.setAttribute("aria-pressed", fType===x[0]?"true":"false");
    b.addEventListener("click", function(){ fType=x[0]; panOffres(); });
    f2.appendChild(b);
  });
  if(nouv.length){
    var bn = el("button","chip",(fNouv?"✓ ":"")+"Nouvelles seulement "+nouv.length); bn.type="button";
    bn.setAttribute("aria-pressed", fNouv?"true":"false");
    bn.addEventListener("click", function(){ fNouv=!fNouv; panOffres(); });
    f2.appendChild(bn);
  }
  var tri = el("select","tri");
  [["note","Tri : note"],["date","Tri : plus récentes"],["entreprise","Tri : entreprise"]].forEach(function(x){
    var o = el("option",null,x[1]); o.value=x[0]; if(fTri===x[0]) o.selected=true; tri.appendChild(o);
  });
  tri.addEventListener("change", function(){ fTri=tri.value; panOffres(); });
  f2.appendChild(tri);
  var q = el("input","recherche petite"); q.type="search"; q.placeholder="Rechercher…"; q.value=fTexte;
  f2.appendChild(q);
  s.appendChild(f2);

  var zone = el("div"); s.appendChild(zone);
  function rend(){
    zone.textContent="";
    var vis = etats.filter(function(x){
      if(fEtat!=="tout" && x.e.k!==fEtat) return false;
      if(fType!=="tout" && typeOffre(x.o)!==fType) return false;
      if(fNouv && x.o.nv!==1) return false;
      if(fTexte && sansAccent(x.o.e+" "+x.o.p+" "+x.o.v+" "+x.o.r).indexOf(sansAccent(fTexte))<0) return false;
      return true;
    }).sort(function(a,b){
      if(fTri==="date") return (b.o.d||"").localeCompare(a.o.d||"");
      if(fTri==="entreprise") return a.o.e.localeCompare(b.o.e,"fr");
      return b.o.t-a.o.t;
    });

    var w = el("div","defile");
    var t = el("table","offres");
    var tr = el("tr");
    ["Entreprise","Poste","Lieu","Salaire","Publiée","Note","Dossier",""].forEach(function(h){ tr.appendChild(el("th",null,h)); });
    t.appendChild(tr);
    vis.forEach(function(x){
      var o = x.o, e = x.e;
      var l = el("tr", e.k==="ecartee"||e.k==="fermee" ? "estompe" : null);
      var c1 = el("td");
      var a = el("a","lien",o.e); a.href=o.u; a.target="_blank"; a.rel="noopener noreferrer";
      c1.appendChild(a);
      if(o.nv===1) c1.appendChild(el("span","neuf","nouvelle"));
      c1.appendChild(el("div","note",o.src));
      l.appendChild(c1);
      var c2 = el("td",null,o.p);
      if(o.r) c2.appendChild(el("div","note",o.r));
      if(!e.d){
        var autres = indexDossiers.e[cleE(o.e)];
        if(autres && autres.length) c2.appendChild(el("div","conseil","Déjà en contact avec "+o.e+" : "+autres.map(function(d){ return STATUTS[d.s].l.toLowerCase(); }).join(", ")+"."));
      }
      l.appendChild(c2);
      l.appendChild(el("td",null,o.v));
      var sal = o.mi ? (Math.round(o.mi/1000)+(o.ma&&o.ma!==o.mi?" à "+Math.round(o.ma/1000):"")+" K€") : "-";
      l.appendChild(el("td","n"+(o.mi?"":" rien"),sal));
      var cd = el("td","n");
      cd.appendChild(document.createTextNode(joli(o.d)));
      if(o.d){ var ag=-ecart(o.d); cd.appendChild(el("div","note"+(ag>30?" vieux-txt":""), ag===0?"aujourd'hui":"il y a "+ag+" j")); }
      l.appendChild(cd);
      var cn = el("td","n", (o.pv?"~":"")+o.t.toFixed(1));
      if(o.pv){ cn.title = "Note provisoire, donnée sur le titre sans lire l'annonce"; cn.classList.add("provisoire"); }
      l.appendChild(cn);
      var cdo = el("td");
      if(e.d){
        var bd = el("button","lienbtn"); bd.type="button"; bd.appendChild(pastille(e.d.s));
        bd.title = "Ouvrir le dossier";
        bd.addEventListener("click", function(){ ouvreDossier(e.d.id); });
        cdo.appendChild(bd);
      } else cdo.appendChild(el("span","rien","-"));
      l.appendChild(cdo);
      var ca = el("td","actions-offre");
      if(db && !e.d){
        if(e.k==="ecartee"){
          ca.appendChild(boutonOffre("Remettre", function(){ return db.collection("offres").doc(String(o.n)).set({etat:"a_trier", maj:AUJ}); }));
        } else {
          ca.appendChild(boutonOffre("À préparer", function(){ return creeDossier(o); }, true));
          ca.appendChild(boutonOffre("Écarter", function(){ return db.collection("offres").doc(String(o.n)).set({etat:"ecartee", maj:AUJ}); }));
        }
      }
      l.appendChild(ca);
      t.appendChild(l);
    });
    w.appendChild(t); zone.appendChild(w);
    zone.appendChild(el("p","note", vis.length+" offre(s) affichée(s)."));
  }
  q.addEventListener("input", function(){ fTexte=q.value; rend(); });
  rend();
  p.appendChild(s);
}
function boutonOffre(txt, action, principal){
  var b = el("button", principal?"btn-mini principal":"btn-mini", txt); b.type="button";
  b.addEventListener("click", function(){
    b.disabled = true; b.textContent = "…";
    action().then(null, function(){ b.disabled=false; b.textContent = txt+" (échec)"; });
  });
  return b;
}
function creeDossier(o){
  var id = cleE(o.e).replace(/ /g,"-").slice(0,40)+"-"+o.n;
  return db.collection("candidatures").doc(id).set({
    entreprise:o.e, poste:o.p, lieu:o.v, cabinet:"", statut:"reperee", dateEnvoi:"", relance:"",
    campagne:"", note:"Offre repérée dans le cockpit le "+joli(AUJ)+". "+(o.r||"")+" "+o.u,
    triage:o.t, url:o.u, etape:"", action:"Préparer le CV et le message", actionDate:plus(AUJ,1), heure:"",
    journal:[{d:AUJ,s:"reperee"}], maj:AUJ
  });
}

/* ---------------------------------------------------------- rendu */
function toutRendre(){
  indexDossiers = null;
  compteurs(); repartition(); panSemaine(); panSuivi(); panOffres();
}

bati();
toutRendre();
function hauteurSocle(){ var so=document.querySelector(".socle"); if(so) document.documentElement.style.setProperty("--haut-socle", so.offsetHeight+"px"); }
hauteurSocle(); window.addEventListener("resize", hauteurSocle);
panFiches();

if(typeof claude !== "undefined" && claude && typeof claude.use === "function"){
  claude.use("db").then(function(x){
    if(!x) return;
    db = x;
    db.collection("candidatures").onSnapshot(function(snap){
      var frais = [];
      snap.docs.forEach(function(doc){ frais.push(depuisBase(doc.id, doc.data() || {})); });
      if(frais.length){
        dossiers = frais.sort(function(a,b){ return a.e.localeCompare(b.e,"fr"); });
        toutRendre();
      }
    }, function(){ /* la page reste utilisable sur l'instantane */ });
    db.collection("offres").onSnapshot(function(snap){
      var m = {};
      snap.docs.forEach(function(doc){ m[doc.id] = doc.data() || {}; });
      OFFRE_ETAT = m;
      compteurs(); panOffres();
    }, function(){});
  });
}
})();
