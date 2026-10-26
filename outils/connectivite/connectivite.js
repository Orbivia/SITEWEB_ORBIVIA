(function(){
"use strict";
const root=document.getElementById("connect-app");
const prefix="icones/";
const storeKey="orbivia-connectivite-v2";
const Q=[
{id:"peer",section:"Usage",icon:"network",title:"Avec quoi votre objet doit-il communiquer ?",help:"Pensez à l'appareil qui reçoit ou envoie les informations, et pas à la technologie utilisée.",example:"Un capteur consulté sur un téléphone, ou une machine qui transmet ses mesures à un serveur.",type:"single",options:[["phone","Un téléphone ou une tablette","À proximité de l'objet.","phone"],["device","Un autre appareil ou une machine","","network"],["cloud","Un service accessible via Internet","","cloud"],["mesh","Plusieurs objets entre eux","","network"],["unknown","Je ne sais pas encore","","help"]]},
{id:"range",section:"Usage",icon:"distance",title:"À quelle distance doit fonctionner la connexion ?",help:"Retenez la distance maximale nécessaire en utilisation normale, même si les équipements sont séparés par des murs.",example:"Un capteur dans le jardin qui communique avec un appareil à l'intérieur.",type:"single",options:[["touch","Quelques centimètres","","nfc"],["room","Dans une pièce","","distance"],["building","Dans un bâtiment","","distance"],["site","Sur un grand site ou à plusieurs kilomètres","","antenna"],["anywhere","Partout, même en déplacement","","cellular"],["unknown","Je ne sais pas encore","","help"]]},
{id:"payload",section:"Usage",icon:"sensor",title:"Quelles informations votre objet doit-il échanger ?",help:"Plusieurs réponses possibles. La vidéo et la musique nécessitent généralement beaucoup plus de débit que des mesures ponctuelles.",example:"Un capteur peut transmettre à la fois une température et recevoir une commande d'activation.",type:"multi",options:[["identify","Identification ou présence","","nfc"],["measures","Mesures (température, niveau, position…)","","sensor"],["commands","Commandes et réglages","","network"],["audio","Son ou voix","","audio"],["video","Images ou vidéo","","video"],["unknown","Je ne sais pas encore","","help"]]},
{id:"frequency",section:"Usage",icon:"clock",title:"À quelle fréquence les échanges auront-ils lieu ?",help:"La fréquence des transmissions influence la consommation, notamment sur batterie.",example:"Une mesure toutes les heures n'a pas les mêmes besoins qu'une diffusion audio permanente.",type:"single",options:[["rare","Occasionnellement","","clock"],["daily","Quelques fois par jour","","clock"],["minutes","Chaque seconde ou chaque minute","","clock"],["continuous","En continu ou presque","","audio"],["unknown","Je ne sais pas encore","","help"]]},
{id:"environment",section:"Usage",icon:"box",title:"Où votre objet sera-t-il utilisé ?",help:"Plusieurs réponses possibles. Un boîtier métallique, des obstacles et certains environnements industriels peuvent compliquer la propagation radio.",example:"Un objet fixé dans une armoire métallique en atelier.",type:"multi",options:[["indoor","À l'intérieur","","box"],["outdoor","À l'extérieur","","antenna"],["metal","Dans un boîtier métallique","","box"],["industrial","Près d'équipements industriels","","network"],["unknown","Je ne sais pas encore","","help"]]},
{id:"power",section:"Produit",icon:"battery",title:"Comment votre objet sera-t-il alimenté ?",help:"L'alimentation disponible conditionne les technologies envisageables et le fonctionnement continu.",example:"Une prise USB permanente, une batterie rechargeable ou une pile remplaçable.",type:"single",options:[["mains","Sur secteur ou USB en permanence","","cable"],["recharge","Avec une batterie rechargeable","","battery"],["cell","Avec une pile remplaçable","","battery"],["harvest","Avec de l'énergie récupérée","","battery"],["unknown","Pas encore défini","","help"]]},
{"id":"autonomy","section":"Produit","icon":"battery","title":"Quelle autonomie souhaitez-vous sans recharge ?","help":"L'autonomie dépend de l'ensemble du produit et du nombre de transmissions. Choisissez votre objectif plutôt qu'une valeur calculée.","example":"Un capteur de jardin dont la pile est remplacée chaque année.","type":"single","optional":true,"options":[["hours","Quelques heures","Recharge quotidienne acceptable.","battery"],["days","De 1 à 7 jours","","battery"],["weeks","De 1 à 4 semaines","","battery"],["months","De 1 à 6 mois","","battery"],["year","Plus de 6 mois","","battery"],["unknown","Pas encore défini","","help"]]},
{id:"infra",section:"Produit",icon:"wifi",title:"Quels réseaux seront disponibles sur place ?",help:"Plusieurs réponses possibles. Un réseau existant facilite l'installation, mais sa couverture réelle devra être vérifiée.",example:"Une connexion Wi-Fi à domicile ou un réseau mobile à l'extérieur.",type:"multi",options:[["wifi","Wi-Fi","","wifi"],["ethernet","Connexion Internet filaire","","cable"],["cellular","Réseau mobile","","cellular"],["none","Aucun réseau connu","","antenna"],["varies","Cela dépend des lieux","","network"],["unknown","Je ne sais pas encore","","help"]]},
{id:"mobility",section:"Produit",icon:"distance",title:"Votre objet se déplacera-t-il ?",help:"La mobilité peut nécessiter un réseau couvrant plusieurs lieux et capable de maintenir la communication pendant un déplacement.",example:"Un tracker transporté en voiture n'a pas les mêmes besoins qu'un capteur mural.",type:"single",options:[["fixed","Non, il restera au même endroit","","box"],["building","Oui, dans un bâtiment","","distance"],["moving","Oui, en déplacement à l'extérieur","","cellular"],["unknown","Je ne sais pas encore","","help"]]},
{"id":"volume","section":"Produit","icon":"box","title":"Quelle place pouvez-vous réserver à la connectivité ?","help":"Pensez au module électronique, à la carte et à l'antenne. Les tailles indiquées sont des ordres de grandeur, pas celles des solutions proposées.","example":"Un petit capteur portable n'offre pas autant d'espace qu'un boîtier mural.","type":"single","options":[["tiny","Très peu : moins de 5 cm³","","box"],["small","Entre 5 et 20 cm³","","box"],["medium","Entre 20 et 100 cm³","","box"],["large","Plus de 100 cm³","","box"],["none","Aucune contrainte d'encombrement","","box"],["unknown","Je ne sais pas encore","","help"]]},
{"id":"weight","section":"Produit","icon":"weight","title":"Quel poids peut être réservé à la connectivité ?","help":"Le poids à considérer comprend le module, sa carte et l'antenne. Celui de la batterie doit être ajouté séparément.","example":"Sur un objet porté, une différence de quelques grammes peut compter.","type":"single","options":[["tiny","Moins de 5 g","","weight"],["small","De 5 à 20 g","","weight"],["medium","De 20 à 100 g","","weight"],["large","Plus de 100 g","","weight"],["none","Aucune limite de poids","","weight"],["unknown","Je ne sais pas encore","","help"]]},
{id:"security",section:"Sécurité",icon:"shield",title:"Quelles données votre objet échangera-t-il ?",help:"Plusieurs réponses possibles. Les protections nécessaires dépendent aussi de l'accès à distance, des fonctions commandées et du contexte réglementaire.",example:"Une donnée de localisation ou de santé peut être personnelle, même si le débit transmis est faible.",type:"multi",options:[["normal","Des informations non sensibles","","sensor"],["personal","Des données personnelles","","shield"],["secret","Des informations confidentielles","","shield"],["health","Des données de santé","","shield"],["unknown","Je ne sais pas encore","","help"]]},
{id:"control",section:"Sécurité",icon:"shield",title:"Que pourra-t-on faire à distance ?",help:"Plus l'objet permet d'actions importantes, plus il faut analyser l'authentification, les autorisations et le fonctionnement en cas de panne.",example:"Consulter une mesure n'a pas les mêmes conséquences qu'ouvrir une serrure.",type:"single",options:[["read","Consulter des informations uniquement","","sensor"],["settings","Modifier des réglages","","network"],["actuate","Déclencher une action physique","","network"],["critical","Commander une fonction liée à la sécurité","","shield"],["unknown","Je ne sais pas encore","","help"]]},
{id:"offline",section:"Sécurité",icon:"shield",title:"Que doit-il se passer si la connexion est perdue ?",help:"La disponibilité du réseau ne doit jamais être confondue avec la sécurité du produit. Les fonctions critiques peuvent nécessiter un fonctionnement local indépendant.",example:"Un thermostat peut continuer à réguler localement malgré une coupure Internet.",type:"single",options:[["wait","Une interruption temporaire est acceptable","","clock"],["buffer","Les données peuvent être enregistrées puis envoyées","","sensor"],["local","Le produit doit continuer à fonctionner localement","","box"],["critical","La coupure pourrait créer un risque","","shield"],["unknown","Je ne sais pas encore","","help"]]},
{id:"latency",section:"Sécurité",icon:"clock",title:"Quel délai de réponse est acceptable ?",help:"Indiquez le délai attendu entre une commande et son effet. La latence dépend de l'ensemble du système, pas uniquement du réseau.",example:"Une télécommande doit généralement réagir plus vite qu'un relevé quotidien.",type:"single",options:[["instant","Presque immédiatement","","clock"],["seconds","En quelques secondes","","clock"],["minutes","En quelques minutes","","clock"],["unknown","Sans contrainte connue","","help"]],optional:true},
{id:"updates",section:"Sécurité",icon:"shield",title:"Des mises à jour à distance sont-elles prévues ?",help:"Les mises à jour doivent être authentifiées et protégées contre les modifications non autorisées. Le besoin peut influencer le débit et la connectivité.",example:"Un objet installé chez un client peut recevoir des correctifs sans retour en atelier.",type:"single",options:[["yes","Oui, elles seront nécessaires","","shield"],["nice","Ce serait utile","","shield"],["no","Pas prévu pour le moment","","box"],["unknown","Je ne sais pas encore","","help"]]},
{"id":"budget","section":"Budget","icon":"euro","title":"Quel budget matériel prévoyez-vous par objet ?","help":"Budget pour les éléments de connectivité uniquement, hors développement, assemblage et certification. Une première estimation suffit.","example":"Le prix dépend du volume de production et de l'intégration choisie.","type":"single","options":[["under5","Moins de 5 €","","euro"],["5to15","De 5 à 15 €","","euro"],["15to30","De 15 à 30 €","","euro"],["30to100","De 30 à 100 €","","euro"],["over100","Plus de 100 €","","euro"],["unknown","Je ne sais pas encore","","help"]]},
{"id":"monthly","section":"Budget","icon":"euro","title":"Quel abonnement mensuel serait acceptable ?","help":"Les réseaux mobiles et certains réseaux opérés peuvent avoir des frais récurrents. D'autres connectivités n'imposent pas d'abonnement réseau propre à l'objet.","example":"Une carte SIM connectée peut entraîner des frais chaque mois.","type":"single","options":[["zero","Aucun abonnement","","euro"],["under1","Moins de 1 € par mois","","euro"],["1to3","De 1 à 3 € par mois","","euro"],["3to10","De 3 à 10 € par mois","","euro"],["any","Sans contrainte définie","","euro"],["unknown","Je ne sais pas encore","","help"]]},
{"id":"quantity","section":"Budget","icon":"box","title":"Combien d'objets souhaitez-vous fabriquer ?","help":"Le volume de fabrication influence les coûts et le choix des modules. Une estimation suffit à ce stade.","example":"Un prototype unique, une présérie de 50 objets ou plusieurs milliers d'unités.","type":"single","options":[["one","1 à 10 objets","","box"],["small","11 à 100 objets","","box"],["medium","101 à 1 000 objets","","box"],["large","Plus de 1 000 objets","","box"],["unknown","Je ne sais pas encore","","help"]]},
{id:"priorities",section:"Budget",icon:"network",title:"Quels sont vos trois critères prioritaires ?",help:"Choisissez jusqu'à trois critères dans l'ordre d'importance. Les besoins indispensables restent prioritaires sur ce classement.",example:"Une longue autonomie et un faible encombrement peuvent conduire à privilégier une solution différente d'un système de vidéo.",type:"priority",options:[["autonomy","Autonomie","","battery"],["cost","Coût matériel","","euro"],["size","Encombrement","","box"],["weight","Poids","","weight"],["reach","Portée","","distance"],["speed","Débit et réactivité","","clock"],["easy","Simplicité d'installation","","phone"],["reliable","Fiabilité","","shield"]]}
];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const icon=name=>prefix+encodeURIComponent(name||"help")+".svg";
function restore(){try{const x=JSON.parse(localStorage.getItem(storeKey)||"null");return x&&typeof x==="object"&&!Array.isArray(x)?x:{}}catch{return {}}}
let answers=restore(),pos=0,result=false;
const byId=id=>Q.find(q=>q.id===id);
const has=(id,value)=>Array.isArray(answers[id])&&answers[id].includes(value);
function visible(q){if(q.id==="autonomy")return !["mains"].includes(answers.power);if(q.id==="latency")return ["settings","actuate","critical"].includes(answers.control)||has("payload","audio")||has("payload","video");return true}
const active=()=>Q.filter(visible);
function save(){try{localStorage.setItem(storeKey,JSON.stringify(answers))}catch{}}
function done(q){const a=answers[q.id];if(q.type==="multi"||q.type==="priority")return Array.isArray(a)&&a.length>0;return typeof a==="string"}
function selectedOption(q){if(q.type==="single")return q.options.find(o=>o[0]===answers[q.id])?.[1]||"Non renseigné";if(q.type==="multi"||q.type==="priority")return (q.options||[]).filter(o=>has(q.id,o[0])).map(o=>o[1]).join(", ")||"Non renseigné";return "Non renseigné"}
function optionMarkup(q,o){
 const [id,label,description,picto]=o,selected=q.type==="single"?answers[q.id]===id:has(q.id,id);
 const mark=selected?(q.type==="priority"?String((answers[q.id]||[]).indexOf(id)+1):"✓"):"";
 return '<button class="answer cx-option" type="button" data-option="'+esc(id)+'" aria-pressed="'+selected+'"><span class="choice-icon cx-icon"><img src="'+icon(picto)+'" alt=""></span><span class="answer-copy cx-option-copy"><strong>'+esc(label)+'</strong>'+(description?'<small>'+esc(description)+'</small>':'')+'</span>'+(q.type==="single"?'':'<span class="cx-check" aria-hidden="true">'+esc(mark)+'</span>')+'</button>';
}
function optionEditor(q){const multi=q.type!=="single";return '<div class="cx-options" data-columns="'+(q.options.length>=5?"two":"one")+'" data-multi="'+multi+'">'+q.options.map(o=>optionMarkup(q,o)).join("")+'</div>'+(q.type==="priority"?'<p class="cx-secondary" id="priority-count">'+((answers[q.id]||[]).length)+'/3 critères sélectionnés</p>':"")}
function editor(q){return optionEditor(q)}
function current(){const qs=active();pos=Math.min(Math.max(0,pos),qs.length-1);return qs[pos]}

let helpOpen=false;
function render(){
 if(result){renderResult();return}
 const q=current(),qs=active(),position=Q.findIndex(x=>x.id===q.id)+1;
 const progress=Math.round((position-1)/Q.length*100);
 const single=q.type==="single";
 const back='<button type="button" class="tool-button cx-button" data-action="back" '+(pos===0?"disabled":"")+'>← Précédent</button>';
 const restart='<button type="button" class="tool-button quiet cx-button" data-action="reset">Reprendre à zéro</button>';
 const nextButton=single?"":'<button type="button" class="tool-button primary cx-button" data-action="next" '+(!done(q)?"disabled":"")+'>'+(pos===qs.length-1?"Voir ma synthèse →":"Continuer →")+'</button>';
 const expanded=helpOpen?"true":"false";
 root.innerHTML='<div class="question-progress cx-progress"><span>'+esc(q.section)+' · Connectivité<b>'+progress+' % parcouru</b></span><progress max="100" value="'+progress+'" aria-label="Avancement du questionnaire"></progress></div>'
 +'<section class="question-card cx-card" aria-labelledby="question-title">'
 +'<div class="question-prompt cx-question-prompt"><div class="question-heading cx-head"><h1 id="question-title">'+esc(q.title)+'</h1>'
 +'<button class="cx-info-button" type="button" data-action="toggle-help" aria-expanded="'+expanded+'" aria-label="Explication de la question">i</button></div>'
 +'<div class="cx-help" '+(helpOpen?'':'hidden')+'><p>'+esc(q.help)+'</p><small>'+esc(q.example)+'</small></div>'
 +'<button class="cx-help-trigger" type="button" data-action="toggle-help" aria-expanded="'+expanded+'"><span class="cx-help-symbol" aria-hidden="true">?</span>'+ (helpOpen?"Masquer l’aide":"Aide au choix")+'</button>'
 +'</div><div class="cx-options-wrapper">'+editor(q)+'</div></section>'
 +'<div class="question-controls cx-controls">'+back+'<div class="cx-control-right">'+nextButton+restart+'</div></div>';
}
function updateContinue(){const b=root.querySelector('[data-action="next"]');if(b)b.disabled=!done(current())}
function next(){if(!done(current()))return;const qs=active();helpOpen=false;if(pos>=qs.length-1){result=true;render();return}pos++;render()}
function choose(id){
 const q=current();
 if(q.type==="single"){answers[q.id]=id;save();next();return}
 if(!["multi","priority"].includes(q.type))return;
 let values=Array.isArray(answers[q.id])?[...answers[q.id]]:[];
 const exclusive=id==="unknown"||(q.id==="security"&&id==="normal")||(q.id==="infra"&&id==="none");
 if(exclusive){values=values.length===1&&values[0]===id?[]:[id]}
 else{
  values=values.filter(x=>x!=="unknown"&&!(q.id==="security"&&x==="normal")&&!(q.id==="infra"&&x==="none"));
  if(values.includes(id))values=values.filter(x=>x!==id);
  else if(q.type!=="priority"||values.length<3)values.push(id);
 }
 answers[q.id]=values;save();render();
}
function candidates(){const a=answers;const picks=[];const push=(id,label,why)=>{if(!picks.some(p=>p.id===id))picks.push({id,label,why})};const long=["site","anywhere"].includes(a.range);const fast=has("payload","video")||has("payload","audio");const mobile=a.mobility==="moving";const nearby=["touch","room"].includes(a.range);const internet=a.peer==="cloud";if(a.range==="touch"&&has("payload","identify"))push("nfc","NFC","Intéressant pour une lecture volontaire à très courte distance.");if(nearby&&a.peer==="phone"&&!has("payload","video"))push("bluetooth","Bluetooth Low Energy","Piste adaptée à une communication locale avec smartphone, sous réserve de débit et d'autonomie.");if(has("infra","ethernet")&&a.mobility!=="moving")push("cable","Ethernet","Une liaison filaire peut faciliter la stabilité et réduire les incertitudes radio.");if((has("infra","wifi")||!long)&&!mobile)push("wifi","Wi-Fi","À étudier pour une connexion réseau locale ou Internet si une couverture adaptée existe.");if(long&&!fast&&!mobile)push("lora","LoRaWAN","Piste pour des petits messages espacés, sous réserve de passerelle, couverture et limites de trafic.");if(mobile||long||has("infra","cellular")&&internet)push("cellular","Réseau cellulaire","Piste pour des objets distants ou mobiles, avec couverture et coûts récurrents à vérifier.");if(picks.length<2&&!fast&&!long)push("bluetooth","Bluetooth Low Energy","Peut convenir aux échanges locaux économes en énergie.");if(picks.length<2&&fast)push("wifi","Wi-Fi","Peut couvrir des besoins de débit plus importants sous réserve de couverture.");if(picks.length<2)push("cellular","Réseau cellulaire","À comparer si l'objet doit accéder au réseau hors infrastructure locale.");return picks.slice(0,3)}

function renderResult(){
 const pick=candidates();
 const summary=[
  ["Communication",selectedOption(byId("peer"))],
  ["Portée",selectedOption(byId("range"))],
  ["Données",selectedOption(byId("payload"))],
  ["Alimentation",selectedOption(byId("power"))],
  ["Autonomie",visible(byId("autonomy"))?selectedOption(byId("autonomy")):"Sans objet (alimentation permanente)"],
  ["Volume réservé",selectedOption(byId("volume"))],
  ["Poids maximal",selectedOption(byId("weight"))],
  ["Sensibilité des données",selectedOption(byId("security"))],
  ["Coupure réseau",selectedOption(byId("offline"))],
  ["Coût matériel cible",selectedOption(byId("budget"))],
  ["Abonnement maximal",selectedOption(byId("monthly"))],
  ["Quantité",selectedOption(byId("quantity"))],
  ["Priorités",selectedOption(byId("priorities"))]
 ];
 const options=pick.map((p,i)=>'<article class="cx-pick"><img src="'+icon(p.id)+'" alt=""><div><em>'+(i===0?"Piste à examiner en premier":"Autre piste à comparer")+'</em><strong>'+esc(p.label)+'</strong><p>'+esc(p.why)+'</p></div></article>').join("");
 const rows=summary.map(([label,value])=>'<div class="cx-summary-row"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong></div>').join("");
 root.innerHTML='<div class="question-progress cx-progress"><span>Synthèse · Connectivité<b>100 % parcouru</b></span><progress max="100" value="100" aria-label="Avancement du questionnaire"></progress></div>'
 +'<section class="question-card result-card cx-card">'
 +'<h1>Premières pistes de connectivité</h1><p class="cx-header-note">Présélection indicative selon les réponses. Les caractéristiques et la sécurité de la solution doivent être confirmées lors de la conception.</p>'
 +'<div class="cx-picks">'+options+'</div>'
 +'<div class="cx-result-warning"><strong>À vérifier avant conception.</strong> Portée sur site, consommation globale, intégration de l’antenne, authentification, chiffrement et mises à jour sécurisées. La technologie radio seule ne garantit pas la cybersécurité.</div>'
 +'<h2 class="cx-result-title">Votre profil de besoin</h2><div class="cx-summary-list">'+rows+'</div>'
 +'</section><div class="cx-result-actions"><button type="button" class="tool-button cx-button" data-action="edit">← Modifier les réponses</button><button type="button" class="tool-button quiet cx-button" data-action="reset">Reprendre à zéro</button></div>'
 +'<p class="cx-note">Il s’agit d’une aide à la présélection, non d’une validation de faisabilité ou d’une certification. Aucune réponse n’est envoyée à Orbivia.</p>';
}
root.addEventListener("click",event=>{const choice=event.target.closest("[data-option]");if(choice){choose(choice.dataset.option);return}const unit=event.target.closest("[data-unit]");if(unit){const u=unit.dataset.unit;const value=u==="heures"?24:u==="jours"?30:12;answers.autonomy={unit:u,value};save();render();return}if(event.target.closest("[data-no-limit]")){const q=current();answers[q.id]=answers[q.id]==="none"?(q.type==="duration"?{value:12,unit:"mois"}:q.defaultValue):"none";save();render();return}const a=event.target.closest("[data-action]")?.dataset.action;if(!a)return;if(a==="toggle-help"){helpOpen=!helpOpen;render();return}if(a==="back"){helpOpen=false;pos=Math.max(0,pos-1);render()}if(a==="next")next();if(a==="edit"){result=false;helpOpen=false;pos=0;render()}if(a==="reset"){answers={};pos=0;result=false;helpOpen=false;try{localStorage.removeItem(storeKey)}catch{}render()}});
render();
})();