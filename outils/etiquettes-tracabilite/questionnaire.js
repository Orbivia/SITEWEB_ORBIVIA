/* ORBIVIA — assistant d'étiquetage MDR / première étape : applicabilité.
 * Ne produit pas de marquages normatifs imprimables ni d'avis de conformité.
 */
(function () {
"use strict";
const root=document.getElementById("label-app");
if(!root)return;
const STORE="orbivia-mdr-label-wizard-v1";
const Q=[
{id:"status",s:"Périmètre",icon:"file",title:"Dans quel cadre ce dispositif sera-t-il utilisé ?",help:"Un dispositif en investigation clinique ou fabriqué sur mesure relève de règles particulières d'étiquetage. Ne jamais apposer le CE avant l'achèvement de la procédure de conformité.",type:"single",options:[
["market","Dispositif destiné à être mis sur le marché","Étiquetage commercial MDR."],
["investigation","Dispositif destiné à une investigation clinique","Mention spécifique et dispositions applicables."],
["custom","Dispositif fabriqué sur mesure","Règles propres aux dispositifs sur mesure."],
["draft","Prototype ou conception en cours","Préparation d'une future étiquette : pas encore d'allégation de conformité."]]},
{id:"territory",s:"Périmètre",icon:"globe",title:"Sur quel marché le dispositif sera-t-il fourni ?",help:"Le questionnaire suit prioritairement le règlement européen (UE) 2017/745. Des règles supplémentaires peuvent s'appliquer dans les pays hors UE.",type:"single",options:[["eu","Union européenne","MDR et exigences nationales de langue."],["euother","UE et autres pays","Vérifier également les règles des autres pays."],["outside","Hors Union européenne uniquement","Cette analyse MDR ne couvre pas à elle seule ce marché."]]},
{id:"support",s:"Produit",icon:"box",title:"Sur quel support préparez-vous l'étiquette ?",help:"L'étiquette du dispositif, celle du conditionnement unitaire et celle de l'emballage stérile n'ont pas toujours les mêmes exigences. La taille ne dispense pas automatiquement des mentions réglementaires.",type:"single",options:[["device","Directement sur le dispositif","Marquage physique ou plaque signalétique."],["unit","Sur l'emballage unitaire","Une unité de dispositif."],["sterile","Sur l'emballage maintenant la stérilité","Conditionnement barrière stérile."],["outer","Sur le conditionnement extérieur","Boîte ou emballage supérieur."]]},
{id:"pack",s:"Produit",icon:"layers",title:"Existe-t-il plusieurs niveaux de conditionnement ?",help:"En règle générale l'UDI doit se retrouver à chaque niveau supérieur de conditionnement, hors conteneurs logistiques. Chaque niveau commercial peut nécessiter son propre UDI-DI.",type:"single",options:[["one","Non, un seul niveau commercial","Une unité ou un conditionnement."],["multiple","Oui, unités, boîtes ou cartons commerciaux","Plusieurs niveaux d'étiquetage peuvent être nécessaires."]]},
{id:"class",s:"Réglementaire",icon:"shield",title:"Quelle est la classe réglementaire du dispositif ?",help:"La classe conditionne l'évaluation de conformité. Un dispositif de classe I peut néanmoins requérir un organisme notifié dans certains cas (stérile, fonction de mesurage, instrument chirurgical réutilisable).",type:"single",options:[["i","Classe I","Sans caractéristique Is, Im ou Ir."],["is","Classe Is, Im ou Ir","Intervention d'un organisme notifié pour les aspects concernés."],["iia","Classe IIa","Procédure d'évaluation de conformité à confirmer."],["iib","Classe IIb","Procédure d'évaluation de conformité à confirmer."],["iii","Classe III","Procédure d'évaluation de conformité à confirmer."]]},
{id:"ce",s:"Réglementaire",icon:"check",title:"Quel est le statut du marquage CE de ce dispositif ?",help:"Le logo CE, et le numéro de l'organisme notifié lorsqu'il est applicable, ne peuvent être ajoutés que sur la base d'une conformité établie. Le numéro n'est pas déduit automatiquement de la classe.",type:"single",when:a=>a.status==="market",options:[["ce-alone","Marquage CE autorisé sans numéro d'organisme notifié","Notamment classe I sans intervention d'organisme notifié."],["ce-nb","Marquage CE autorisé avec organisme notifié","Le numéro de l'organisme doit être confirmé."],["notready","Procédure de conformité non achevée","Ne pas apposer le CE."]]},
{id:"manufacturer",s:"Opérateurs",icon:"factory",title:"Où est établi le fabricant légal ?",help:"L'étiquette doit identifier le fabricant et son adresse de siège. S'il est établi hors UE, un mandataire dans l'Union est généralement requis.",type:"single",options:[["eu","Dans l'Union européenne","Fabricant et adresse du siège à faire apparaître."],["outside","Hors Union européenne","Vérifier mandataire UE et informations correspondantes."]]},
{id:"import",s:"Opérateurs",icon:"truck",title:"Un importateur fait-il entrer le dispositif dans l'UE ?",help:"L'article 13(3) du MDR impose à l'importateur de faire figurer certaines informations sur le dispositif, son emballage ou un document l'accompagnant, sans masquer celles du fabricant.",type:"single",options:[["yes","Oui"],["no","Non"]]},
{id:"implant",s:"Utilisation",icon:"target",title:"Le dispositif est-il implantable ?",help:"Des règles UDI-PI spécifiques s'appliquent aux dispositifs implantables : numéro de série pour les actifs implantables, numéro de série ou de lot pour les autres.",type:"single",options:[["no","Non"],["active","Oui, dispositif actif implantable"],["passive","Oui, dispositif implantable non actif"]]},
{id:"reuse",s:"Utilisation",icon:"repeat",title:"Le dispositif est-il destiné à plusieurs utilisations ?",help:"Un dispositif à usage unique doit être clairement identifié comme tel. Si le dispositif est réutilisable et nécessite un retraitement entre les patients, des règles de marquage UDI direct et d'instructions de retraitement peuvent s'appliquer.",type:"single",options:[["single","Non, usage unique"],["reusable","Oui, réutilisable"],["limited","Oui, mais avec un nombre maximal de réutilisations"]]},
{id:"reprocess",s:"Utilisation",icon:"refresh",title:"Que faut-il faire entre deux utilisations ?",help:"Ne confondez pas « réutilisable » et « restérilisable ». La notice doit décrire les procédés validés appropriés, les limites et critères de fin de vie.",type:"single",when:a=>["reusable","limited"].includes(a.reuse),options:[["clean","Nettoyage uniquement"],["disinfect","Nettoyage puis désinfection"],["sterilize","Nettoyage puis stérilisation"],["none","Pas de retraitement entre utilisations"]]},
{id:"sterile",s:"Stérilité",icon:"spark",title:"Comment le dispositif est-il fourni ?",help:"Le caractère stérile se réfère à l'état du dispositif livré, pas à un nettoyage ultérieur. Un dispositif non stérile devant être stérilisé par l'utilisateur requiert des instructions adaptées.",type:"single",options:[["sterile","Fourni stérile"],["nonsterile","Fourni non stérile"],["before","Fourni non stérile, à stériliser avant utilisation"]]},
{id:"sterilmethod",s:"Stérilité",icon:"sun",title:"Quelle méthode de stérilisation est utilisée ?",help:"Le symbole est lié à une méthode validée. Ne pas sélectionner par défaut un procédé simplement parce qu'il est courant.",type:"single",when:a=>a.sterile==="sterile",options:[["eo","Oxyde d'éthylène (EO)"],["radiation","Irradiation"],["steam","Vapeur d'eau ou chaleur sèche"],["aseptic","Techniques de préparation aseptique"],["other","Autre procédé / procédé mixte"]]},
{id:"barrier",s:"Stérilité",icon:"layers2",title:"Quel système de barrière stérile est utilisé ?",help:"La barrière stérile doit être distinguée de l'emballage protecteur. Des symboles ISO 15223-1 décrivent les différents agencements.",type:"single",when:a=>a.sterile==="sterile",options:[["single","Une barrière stérile"],["double","Deux barrières stériles"],["inner","Une barrière stérile avec protection interne"],["outer","Une barrière stérile avec protection externe"]]},
{id:"resterilize",s:"Stérilité",icon:"refresh",title:"Le dispositif peut-il être restérilisé après ouverture ?",help:"Ne pas confondre « ne pas restériliser » (ISO 15223-1, 5.2.6) et « ne pas réutiliser » (5.4.2). Les deux informations ne sont pas interchangeables.",type:"single",when:a=>a.sterile==="sterile",options:[["no","Non, ne pas restériliser"],["yes","Oui, un procédé validé existe"]]},
{id:"expiry",s:"Durée de vie",icon:"hourglass",title:"Existe-t-il une date limite d'utilisation ou d'implantation ?",help:"Une date limite peut être pertinente pour un dispositif stérile ou non stérile. En l'absence de date limite, la date de fabrication doit normalement être indiquée sur l'étiquette.",type:"single",options:[["yes","Oui, une date limite est définie"],["no","Non, pas de date limite pertinente"]]},
{id:"tracking",s:"Traçabilité",icon:"barcode",title:"Comment les unités fabriquées sont-elles identifiées ?",help:"Le lot et/ou la série sont les données de production (UDI-PI) lorsqu'elles sont applicables. Pour un actif implantable, la série doit être présente. La date de péremption affichée doit aussi figurer dans l'UDI-PI.",type:"single",options:[["lot","Par numéro de lot"],["serial","Par numéro de série"],["both","Lot et numéro de série"]]},
{id:"storage",s:"Conservation",icon:"thermo",title:"Quelles précautions de stockage doivent être indiquées ?",help:"Vous pouvez sélectionner plusieurs conditions réellement imposées par les spécifications et la gestion des risques. Un symbole sans limite chiffrée appropriée peut être insuffisant.",type:"multi",options:[["temperature","Limites de température"],["humidity","Limites d'humidité"],["dry","Garder au sec"],["sunlight","Protéger du soleil"],["fragile","Fragile / manutention spécifique"],["none","Aucune condition particulière"]]},
{id:"substances",s:"Matières",icon:"flask",title:"Le dispositif ou son emballage comporte-t-il des substances à signaler ?",help:"Certaines substances nécessitent une indication spécifique et parfois une justification dans la documentation. Les exigences CMR/perturbateurs endocriniens sont conditionnelles ; un simple pictogramme ne suffit pas.",type:"multi",options:[["latex","Latex naturel"],["cmr","Substances CMR ou perturbateurs endocriniens pertinentes"],["med","Substance médicamenteuse incorporée"],["human","Tissus ou dérivés d'origine humaine"],["animal","Tissus ou dérivés d'origine animale"],["none","Aucun de ces cas"]]},
{id:"instructions",s:"Information",icon:"book",title:"Quelles informations d'utilisation sont nécessaires ?",help:"Le renvoi à une notice peut être pertinent, mais la notice électronique seule est soumise à des conditions particulières. Les avertissements immédiats ne peuvent pas toujours être déportés dans la notice.",type:"multi",options:[["ifu","Consulter la notice avant utilisation"],["electronic","Notice électronique envisagée"],["warning","Avertissement critique à lire sur l'étiquette"],["damaged","Ne pas utiliser si l'emballage est endommagé"],["none","Aucune information particulière identifiée"]]},
{id:"electronic",s:"Produit",icon:"circuit",title:"Le dispositif comporte-t-il une partie électrique ou électronique ?",help:"Les dispositifs électriques peuvent nécessiter des marquages complémentaires hors ISO 15223-1 (par exemple sécurité électrique ou DEEE), selon leurs caractéristiques et les textes applicables.",type:"single",options:[["yes","Oui, équipement électrique ou électronique"],["no","Non, dispositif non électrique"]]},
{id:"space",s:"Étiquette",icon:"ruler",title:"Quelle surface est disponible pour l’étiquetage ?",help:"Cette question concerne l'espace sur le support choisi, pas la taille totale du dispositif. La place disponible ne dispense pas des mentions requises : il faudra parfois adapter les niveaux d'emballage.",type:"single",options:[["tiny","Très petite : moins de 20 × 20 mm"],["small","Petite : environ 40 × 20 mm"],["medium","Moyenne : environ 70 × 40 mm"],["large","Grande : 100 × 50 mm ou plus"]]},
{id:"language",s:"Étiquette",icon:"lang",title:"Pour quels pays les informations seront-elles préparées ?",help:"Les États membres fixent les exigences de langue des informations fournies avec les dispositifs. Des symboles normalisés peuvent aider mais ne remplacent pas tous les textes requis.",type:"single",options:[["fr","France"],["eu","Plusieurs pays de l'UE"],["other","UE et pays hors UE"]]}
];
const ICONS={
file:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/>',
box:'<path d="m3 7 9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7M12 11v10"/>',
layers:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
shield:'<path d="M12 2 4 5v6c0 5 3 8 8 11 5-3 8-6 8-11V5l-8-3Z"/><path d="m8.5 12 2.5 2.5 5-5" class="accent"/>',
check:'<circle cx="12" cy="12" r="9"/><path d="m7 12 3.2 3 7-7" class="accent"/>',
factory:'<path d="M3 21V9l7 4V9l7 4V4h4v17H3Z"/><path d="M7 17h2m4 0h2m4 0h1" class="accent"/>',
truck:'<path d="M3 6h11v12H3zM14 10h4l3 4v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" class="accent"/>',
repeat:'<path d="M5 8h13l-3-3m3 3-3 3M19 16H6l3 3m-3-3 3-3"/>',
refresh:'<path d="M20 9a8 8 0 0 0-14-3L3 9M4 15a8 8 0 0 0 14 3l3-3"/><path d="M3 4v5h5M21 20v-5h-5" class="accent"/>',
spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/><path d="M12 9v6M9 12h6" class="accent"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2" class="accent"/>',
layers2:'<rect x="3" y="4" width="18" height="16" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1" class="accent"/>',
hourglass:'<path d="M5 3h14M5 21h14M7 3c0 6 5 7 5 9s-5 3-5 9m10-18c0 6-5 7-5 9s5 3 5 9"/>',
barcode:'<path d="M3 4v16M7 4v16M10 4v16M14 4v16M17 4v16M21 4v16" class="accent"/>',
thermo:'<path d="M10 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0Z"/><path d="M13 9v9" class="accent"/>',
flask:'<path d="M9 3h6M10 3v7l-6 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-9V3M7 16h10" />',
book:'<path d="M12 6c-3-2-7-2-10-1v14c4-1 7-1 10 1 3-2 6-2 10-1V5c-3-1-7-1-10 1Zm0 0v14"/>',
circuit:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/><rect x="10" y="10" width="4" height="4" class="accent"/>',
ruler:'<path d="m3 16 13-13 5 5-13 13-5-5Z"/><path d="M9 10l3 3m1-7 3 3M6 13l3 3" class="accent"/>',
lang:'<path d="M3 5h12M9 3v2M5 9c2 4 5 6 9 7M13 8c-2 5-5 8-10 10M14 21l4-11 4 11m-6.5-4h5" />'
};
const $=(sel)=>root.querySelector(sel);
const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function icon(id){return '<svg class="mdr-question-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="#17263a" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><style>.accent{stroke:#e7a116}</style>'+(ICONS[id]||ICONS.file)+'</svg>';}
let answers={},position=0,finished=false;
try{const saved=JSON.parse(sessionStorage.getItem(STORE)||"{}");if(saved&&saved.answers&&typeof saved.answers==="object"){answers=saved.answers;position=Math.max(0,Math.min(30,Number(saved.position)||0));finished=!!saved.finished;}}catch(_){}
/* Ignore les choix indéterminés conservés par une ancienne version du questionnaire. */
let invalidSavedAnswer=false;
for (const question of Q) {
 const value=answers[question.id];
 const choices=question.options.map(option=>option[0]);
 if(Array.isArray(value)) {
  const cleaned=value.filter(entry=>choices.includes(entry));
  if(cleaned.length!==value.length){answers[question.id]=cleaned;invalidSavedAnswer=true;}
 } else if(value!==undefined&&!choices.includes(value)) {
  delete answers[question.id];invalidSavedAnswer=true;
 }
}
if(invalidSavedAnswer){finished=false;position=0;}
function store(){try{sessionStorage.setItem(STORE,JSON.stringify({answers,position,finished}));}catch(_){}}
function applicable(){return Q.filter(q=>!q.when||q.when(answers));}
function completed(q){const v=answers[q.id];return q.type==="multi"?Array.isArray(v)&&v.length>0&&v.every(a=>q.options.some(o=>o[0]===a)):typeof v==="string"&&q.options.some(o=>o[0]===v);}
function current(){const qs=applicable();position=Math.max(0,Math.min(qs.length-1,position));return qs[position];}
function optionMarkup(q,option) {
 const value=option[0],label=option[1],desc=option[2]||"",sel=q.type==="single"?answers[q.id]===value:(answers[q.id]||[]).includes(value);
 return '<button type="button" class="answer label-option" data-choice="'+escapeHTML(value)+'" aria-pressed="'+sel+'"><div class="answer-copy">'+escapeHTML(label)+(desc?'<small>'+escapeHTML(desc)+'</small>':"")+'</div></button>';
}
function showQuestion(){
 const q=current(),qs=applicable(),pct=Math.round(position/qs.length*100);
 root.innerHTML='<div class="question-progress"><span>'+escapeHTML(q.s)+' · Étiquette MDR <b>Question '+(position+1)+' / '+qs.length+'</b></span><progress max="100" value="'+pct+'" aria-label="Progression"></progress></div>'
 +'<section class="question-card"><div class="question-prompt"><div class="question-heading"><h1 id="question-title">'+icon(q.icon)+escapeHTML(q.title)+'</h1>'
 +'<details class="info-bubble"><summary aria-label="Comprendre cette question">i</summary><div><strong>Pourquoi cette question ?</strong><p>'+escapeHTML(q.help)+'</p></div></details></div></div>'
 +'<div class="label-options">'+q.options.map(o=>optionMarkup(q,o)).join("")+'</div></section>'
 +'<div class="question-controls label-controls"><button class="tool-button" data-action="back" type="button" '+(position===0?"disabled":"")+'>← Précédent</button>'
 +'<div class="label-controls-right">'+(q.type==="multi"?'<button class="tool-button primary" data-action="next" type="button" '+(!completed(q)?"disabled":"")+'>'+(position===qs.length-1?"Voir les résultats":"Continuer")+' →</button>':"")
 +'<button class="tool-button quiet" data-action="reset" type="button">Reprendre à zéro</button></div></div>';
}
function next(){const q=current();if(!completed(q))return;const qs=applicable();if(position>=qs.length-1){finished=true;}else{position++}store();render();window.scrollTo?.({top:0,behavior:"instant"});}
function selectChoice(value){
 const q=current();if(!q.options.some(o=>o[0]===value))return;
 if(q.type==="single"){answers[q.id]=value;const qs=applicable();if(position>=qs.length-1)finished=true;else position++;store();render();window.scrollTo?.({top:0,behavior:"instant"});return}
 let list=Array.isArray(answers[q.id])?answers[q.id].slice():[];
 const exclusive=["none","unknown"];
 if(exclusive.includes(value))list=[value];
 else{list=list.filter(s=>!exclusive.includes(s));list=list.includes(value)?list.filter(s=>s!==value):[...list,value];}
 answers[q.id]=list;store();render();
}
function listContains(id,v){return Array.isArray(answers[id])&&answers[id].includes(v);}
function conclusions(){
 const required=[],conditional=[],review=[];
 const add=(target,code,title,detail,source,tag)=>target.push({code,title,detail,source:source||"",tag:tag||""});
 const r=(c,t,d,s,tag)=>add(required,c,t,d,s,tag),c=(c,t,d,s,tag)=>add(conditional,c,t,d,s,tag),v=(t,d)=>add(review,"?",t,d);
 const market=answers.status==="market";
 r("Texte","Nom du dispositif et identification","Nom commercial, modèle et identification du contenu/usage si nécessaire.","MDR annexe I, 23.2 a–b","Mention");
 r("5.1.1","Fabricant légal","Nom ou raison sociale et adresse du siège du fabricant.","MDR annexe I, 23.2 c");
 if(answers.tracking==="unknown")v("Identification des unités","Définir le numéro de lot ou de série et sa traçabilité avant création de l’étiquette.");
 c("5.1.6","Référence catalogue / modèle","Utile pour identifier sans ambiguïté la version commerciale ; à distinguer de l'UDI.","ISO 15223-1, 5.1.6");
 c("5.7.7","Dispositif médical (MD)","À utiliser lorsque la nature médicale du produit n'est pas évidente.","MDR annexe I, 23.2 q");
 if(market&&answers.territory!=="outside"){
  r("5.7.10","Identifiant UDI : AIDC + HRI","UDI-DI attribué par une entité habilitée et UDI-PI selon données de production. Le Basic UDI-DI n'est pas imprimé.","MDR annexe VI, partie C");
  if(answers.ce==="ce-nb")r("CE + ON","Marquage CE et numéro de l'organisme notifié","Utiliser le graphisme officiel CE et le numéro vérifié de l'organisme notifié.","MDR articles 20 et 52","Marquage réglementaire");
  else if(answers.ce==="ce-alone")r("CE","Marquage CE","Seulement si la procédure de conformité est effectivement achevée et sans numéro d'ON exigible.","MDR article 20","Marquage réglementaire");
  else v("Marquage CE non confirmé","Ne pas imprimer le CE tant que la procédure appropriée et, le cas échéant, le numéro d'organisme notifié ne sont pas établis.");
 }else if(market&&answers.territory==="outside"){v("Marché hors UE","L'analyse MDR est informative seulement. Vérifier les exigences du ou des pays visés.");}
 else if(answers.status==="custom"){v("Dispositif sur mesure","Vérifier les mentions « dispositif sur mesure », l'annexe XIII et les règles spécifiques ; UDI/CE commerciaux ne sont pas présumés.");}
 else if(answers.status==="investigation"){v("Investigation clinique","Vérifier la mention « exclusivement destiné à une investigation clinique » et les règles associées ; pas de CE commercial présumé.");}
 else v("Prototype en cours","Ne pas apposer de CE ou d'UDI commercial non attribué. Limiter les mentions aux informations effectivement établies.");
 if(answers.manufacturer==="outside"&&answers.territory!=="outside"){r("5.1.2","Mandataire / représentant autorisé","Nom et adresse de l'entité mandatée dans l'UE ; vérifier la version du symbole après amendement ISO 15223-1:2025.","MDR annexe I, 23.2 d");}
 else if(answers.manufacturer==="unknown")v("Fabricant légal","Établir le siège du fabricant et l'éventuel mandataire européen.");
 if(answers.import==="yes")c("5.1.8","Importateur","Nom et coordonnées de l'importateur : sur dispositif, emballage ou document d'accompagnement selon l'article 13(3).","MDR art. 13(3)");
 else if(answers.import==="unknown")v("Importateur","Déterminer si un opérateur importe effectivement le produit dans l'UE.");
 if(answers.tracking==="lot"||answers.tracking==="both")r("5.1.5","Numéro de lot (LOT)","Le lot doit correspondre aux documents de production et, le cas échéant, à l'UDI-PI.","ISO 15223-1, 5.1.5");
 if(answers.tracking==="serial"||answers.tracking==="both")r("5.1.7","Numéro de série (SN)","Identifiant de l'unité, cohérent avec l'UDI-PI.","ISO 15223-1, 5.1.7");
 if(answers.tracking==="unknown")v("Identification des unités","Définir lot, numéro de série, et structure UDI-PI avant génération.");
 if(answers.implant==="active"&&answers.tracking!=="serial"&&answers.tracking!=="both")v("Implant actif : numéro de série requis","La partie UDI-PI doit contenir le numéro de série pour les dispositifs actifs implantables.");
 if(answers.implant==="passive"&&answers.tracking==="unknown")v("Implant : UDI-PI","Définir au minimum lot ou série approprié et la règle d'identification avant implantation.");
 if(answers.implant==="unknown")v("Implantabilité","La nature implantable du dispositif n'est pas déterminée.");
 if(answers.expiry==="yes")r("5.1.4","Date limite d'utilisation","Indiquer la date validée, notamment sur les emballages maintenant l'état stérile.","MDR annexe I, 23.2 i");
 else if(answers.expiry==="no")r("5.1.3","Date de fabrication","En l'absence de date limite, la date de fabrication doit être identifiable.","MDR annexe I, 23.2 j");
 else v("Durée de conservation","Déterminer la présence d'une date limite ou, sinon, les modalités d'indication de la fabrication.");
 if(answers.sterile==="sterile"){
  if(answers.resterilize==="no")c("5.2.6","Ne pas restériliser","À afficher uniquement si une seconde stérilisation est interdite ; distinct de l’usage unique.","ISO 15223-1, 5.2.6");
  else if(answers.resterilize==="unknown")v("Restérilisation","Clarifier la possibilité de restériliser après ouverture et les instructions applicables.");
  r("5.2.1","État stérile","Indication de l'état stérile et de la méthode de stérilisation effectivement utilisée.","MDR annexe I, 23.2 l");
  const map={eo:["5.2.3","Stérilisé à l'oxyde d'éthylène"],radiation:["5.2.4","Stérilisé par irradiation"],steam:["5.2.5","Stérilisé par vapeur ou chaleur sèche"],aseptic:["5.2.2","Traitement aseptique"]};
  if(map[answers.sterilmethod])r(map[answers.sterilmethod][0],map[answers.sterilmethod][1],"Symbole à confirmer avec le procédé validé.","ISO 15223-1, 5.2");
  else v("Méthode de stérilisation","Sélectionner et valider le procédé avant le choix du symbole.");
  const barriers={single:["5.2.11","Système de barrière stérile simple"],double:["5.2.12","Système de barrière stérile double"],inner:["5.2.13","Barrière stérile + protection intérieure"],outer:["5.2.14","Barrière stérile + protection extérieure"]};
  if(barriers[answers.barrier])c(barriers[answers.barrier][0],barriers[answers.barrier][1],"À placer selon l'architecture du conditionnement réellement validée.","ISO 15223-1, 5.2.11–5.2.14");
  else v("Système de barrière stérile","Préciser le type de barrière et les protections.");
  c("5.2.8","Ne pas utiliser si emballage endommagé","La conduite à tenir doit être définie dans la notice ; sur emballage stérile, l'information est particulièrement importante.","MDR annexe I, 23.3 j");
  if(answers.support==="sterile")r("Texte","Mentions spécifiques sur l'emballage stérile","Description du dispositif, fabricant, fabrication (mois et année), limite d'utilisation, indication stérile et méthode, consigne en cas d'emballage endommagé.","MDR annexe I, 23.3","Mention");
  if(answers.expiry!=="yes")v("Stérile sans date limite","Vérifier la durée de conservation du système de barrière stérile et le besoin d'une date limite validée.");
 }else if(answers.sterile==="before"){
  c("5.2.7","Non stérile","Le dispositif est livré non stérile ; indiquer clairement les opérations validées à effectuer avant utilisation.","MDR annexe I, 23.4 m");
 }else if(answers.sterile==="unknown")v("État de stérilité","Définir si le dispositif est fourni stérile et, le cas échéant, sa méthode.");
 if(answers.reuse==="single")r("5.4.2","Ne pas réutiliser / usage unique","Mention explicite de l'usage unique lorsque le dispositif est prévu pour une seule utilisation.","MDR annexe I, 23.2 n");
 else if(["reusable","limited"].includes(answers.reuse)){
  c("Notice","Retraitement et réutilisation","Vérifier les procédés validés de nettoyage/désinfection/stérilisation ; signaler les critères de fin de vie.","MDR annexe I, 23.4 n","Information");
  if(market&&["clean","disinfect","sterilize"].includes(answers.reprocess))c("UDI direct","Marquage UDI permanent sur le dispositif","À examiner si le dispositif subit un retraitement entre patients, sauf dérogation documentée. Échéance classe I : 26 mai 2027 ; classes IIa/IIb/III : déjà applicable.","MDR annexe VI, partie C, 6.2","Marquage");
  if(answers.reuse==="limited")c("Notice","Nombre maximal de réutilisations","Indiquer la limite validée et les critères de retrait du service.","MDR annexe I, 23.4 n","Information");
  if(answers.reprocess==="unknown")v("Retraitement","Il faut définir les cycles et procédés validés.");
 }else v("Usage unique ou réutilisable","Décision nécessaire pour éviter des instructions contradictoires.");
 const storage=[["temperature","5.3.7","Limites de température"],["humidity","5.3.8","Limites d'humidité"],["dry","5.3.4","Garder au sec"],["sunlight","5.3.2","Tenir à l'abri de la lumière solaire"],["fragile","5.3.1","Fragile : manipuler avec précaution"]];
 storage.forEach(x=>{if(listContains("storage",x[0]))c(x[1],x[2],"Spécifier les limites et conditions validées, si applicables.","MDR annexe I, 23.2 k");});
 if(listContains("storage","unknown"))v("Stockage","Évaluer stabilité, transport, conditions de conservation et risques de manutention.");
 if(listContains("substances","latex"))c("5.4.5","Contient du latex naturel","La déclaration doit refléter les matériaux et la conformité avec les exigences de sécurité.","ISO 15223-1, 5.4.5");
 [["cmr","CMR / perturbateurs endocriniens"],["med","Substance médicamenteuse"],["human","Origine humaine"],["animal","Origine animale"]].forEach(x=>{
  if(listContains("substances",x[0]))c("MDR","Mention de composition : "+x[1],"Examiner les exigences spécifiques ; ne pas remplacer une évaluation réglementaire par un pictogramme seul.","MDR annexe I, 23.2 e–f","Mention");
 });
 if(listContains("substances","unknown"))v("Substances et matériaux","Vérifier latex, CMR, substances médicamenteuses et dérivés humains/animaux.");
 if(listContains("instructions","ifu")||listContains("instructions","electronic"))c("5.4.3","Consulter le mode d’emploi","Notice conforme et accessible dans les langues requises.","ISO 15223-1, 5.4.3");
 if(listContains("instructions","electronic"))v("Notice électronique","Vérifier séparément si les conditions du règlement d'exécution eIFU sont satisfaites ; ne pas supposer qu'une notice numérique remplace toujours le papier.");
 if(listContains("instructions","warning"))r("5.4.4","Avertissements critiques","Avertissements nécessaires à l'utilisation sûre : texte et/ou symbole, à confirmer par l'analyse de risques.","MDR annexe I, 23.2 m");
 if(listContains("instructions","damaged"))c("5.2.8","Ne pas utiliser si emballage endommagé","Indication à vérifier selon l'état de l'emballage et le risque.","ISO 15223-1, 5.2.8");
 if(listContains("instructions","unknown"))v("Notices et avertissements","Définir les messages critiques et la nécessité d'une notice.");
 if(answers.electronic==="yes")v("Marquages hors ISO 15223-1","Évaluer les obligations éventuelles (sécurité électrique, DEEE, batterie, symbole applicable) séparément.");
 if(answers.electronic==="unknown")v("Électricité / électronique","La présence de circuits et d'une alimentation peut imposer d'autres marquages.");
 if(answers.pack==="multiple")v("Plusieurs conditionnements","Prévoir les UDI-DI et étiquettes de chaque niveau commercial, hors conteneurs logistiques.");
 if(answers.support==="unknown")v("Support de l'étiquette","Identifier le dispositif, l'emballage primaire et le conditionnement extérieur.");
 if(answers.space==="tiny"||answers.space==="small")v("Surface réduite","Étudier la lisibilité du DataMatrix et des mentions ; une petite surface n'autorise pas à omettre des informations obligatoires.");
 if(answers.space==="unknown")v("Dimensions d'étiquette","Mesurer la surface disponible et prévoir une vérification physique de lisibilité.");
 if(answers.language==="eu"||answers.language==="other")v("Langues et pays","Vérifier les langues exigées dans chaque État membre et les prescriptions supplémentaires hors UE.");
 if(answers.language==="unknown")v("Marché linguistique","Définir les pays de commercialisation avant la validation de l'étiquette.");
 if(answers.class==="unknown")v("Classe MDR","Déterminer la classification et la procédure d'évaluation avant finalisation.");
 if(answers.ce==="ce-alone"&&["is","iia","iib","iii"].includes(answers.class))v("Incohérence possible CE / organisme notifié","La classe déclarée impose de vérifier l'intervention de l'organisme notifié et le numéro de marquage.");
 if(answers.ce==="ce-nb"&&answers.class==="i")v("Incohérence possible classe I","Confirmer pourquoi un organisme notifié intervient, ou corriger la classe déclarée.");
 if(answers.territory==="unknown")v("Marché cible","Vérifier le champ territorial du règlement MDR.");
 if(answers.manufacturer==="outside"&&answers.territory==="outside")v("Mandataire UE","Un mandataire UE n'est pas automatiquement exigé si aucun dispositif n'est commercialisé dans l'UE.");
 const unique=items=>items.filter((x,i)=>items.findIndex(y=>y.code===x.code&&y.title===x.title)===i);
 return {required:unique(required),conditional:unique(conditional),review:unique(review)};
}
function symbolRef(code) {
 if(/^\d+\.\d+\.\d+$/.test(code))return "ISO " + code;
 return code==="Texte"?"Texte":code==="MDR"?"MDR":code==="Notice"?"Notice":code;
}
function renderShortList(items) {
 if(!items.length)return '<p class="label-empty">Aucun élément supplémentaire.</p>';
 return '<ul class="label-short-list">'+items.map(it=>
 '<li><span class="label-short-name">'+escapeHTML(it.title)+'</span><span class="label-short-code">'+escapeHTML(symbolRef(it.code))+'</span></li>'
 ).join("")+'</ul>';
}
function renderChecks(items){
 if(!items.length)return '<p class="label-empty">Aucun point particulier détecté.</p>';
 return '<ul class="label-checks">'+items.map(it=>'<li><strong>'+escapeHTML(it.title)+'</strong><span>'+escapeHTML(it.detail)+'</span></li>').join("")+'</ul>';
}
function renderReferences(result){
 const groups=[["À prévoir",result.required],["Selon votre dispositif",result.conditional],["Points de vigilance",result.review]];
 return '<details class="label-details"><summary>Afficher les explications et références réglementaires</summary><div>'+
 groups.map(group=>'<h3>'+escapeHTML(group[0])+'</h3>'+
 group[1].map(it=>'<div class="label-reference"><strong>'+escapeHTML(it.title)+'</strong><p>'+escapeHTML(it.detail)+'</p>'+(it.source?'<small>'+escapeHTML(it.source)+'</small>':'')+'</div>').join("")
 ).join("")+'</div></details>';
}
function summary(){
 const result=conclusions();
 const answersHTML=applicable().map(q=>{
 const val=answers[q.id],values=Array.isArray(val)?val:[val];
 const labels=values.map(v=>q.options.find(o=>o[0]===v)?.[1]||"Non renseigné").join(", ");
 return '<div><dt>'+escapeHTML(q.title)+'</dt><dd>'+escapeHTML(labels)+'</dd></div>';
 }).join("");
 root.innerHTML=
 '<div class="label-result-heading"><span class="label-result-eyebrow">Étiquetage médical · MDR 2017/745</span>'+
 '<h1>Votre étiquette : les éléments à prévoir</h1>'+
 '<p>Liste indicative basée sur vos réponses. Les références indiquées servent à identifier les symboles à vérifier, pas à les reproduire.</p></div>'+
 '<section class="label-result-card"><header><h2>À prévoir</h2><span>'+result.required.length+' éléments</span></header>'+
 renderShortList(result.required)+'</section>'+
 (result.conditional.length?'<section class="label-result-card"><header><h2>Selon votre dispositif</h2><span>'+result.conditional.length+' éléments</span></header>'+renderShortList(result.conditional)+'</section>':'')+
 (result.review.length?'<section class="label-result-card"><header><h2>À vérifier avant impression</h2><span>'+result.review.length+' points</span></header>'+renderChecks(result.review)+'</section>':'')+
 '<section class="label-result-card label-additional">'+renderReferences(result)+
 '<details class="label-answers"><summary>Voir mes réponses au questionnaire</summary><dl>'+answersHTML+'</dl></details></section>'+
 '<p class="label-disclaimer">Synthèse d’aide à la conception, non une validation réglementaire. Vérifiez les exigences du MDR, les symboles ISO 15223-1 applicables et la lisibilité réelle avant impression.</p>'+
 '<div class="question-controls label-controls"><button class="tool-button" type="button" data-action="back">← Modifier mes réponses</button>'+
 '<div class="label-controls-right"><button class="tool-button" type="button" data-action="print">Imprimer la synthèse</button>'+
 '<button class="tool-button quiet" type="button" data-action="reset">Reprendre à zéro</button></div></div>';
}
function render(){if(finished)summary();else showQuestion();}
function reset(){const d=document.getElementById("restart-label-dialog");if(d&&typeof d.showModal==="function")d.showModal();else if(confirm("Effacer toutes les réponses de ce questionnaire ?"))doReset();}
function doReset(){answers={};position=0;finished=false;store();render();}
root.addEventListener("click",event=>{
 const choice=event.target.closest("[data-choice]");if(choice&&root.contains(choice)){selectChoice(choice.dataset.choice);return}
 const button=event.target.closest("[data-action]");if(!button)return;
 switch(button.dataset.action){
 case "next":next();break;
 case "back":if(finished){finished=false;position=applicable().length-1;}else position=Math.max(0,position-1);store();render();break;
 case "reset":reset();break;
 case "print":window.print();break;
 }
});
const d=document.getElementById("restart-label-dialog");if(d){
 d.querySelector('[data-confirm]')?.addEventListener("click",()=>{d.close();doReset();});
 d.querySelector('[data-cancel]')?.addEventListener("click",()=>d.close());
}
render();
})();
