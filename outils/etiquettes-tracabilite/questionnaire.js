/* ORBIVIA — assistant d'étiquetage MDR / première étape : applicabilité.
 * Ne produit pas de marquages normatifs imprimables ni d'avis de conformité.
 */
(function () {
"use strict";
const root=document.getElementById("label-app");
if(!root)return;
const STORE="orbivia-mdr-label-wizard-v2";
const Q=[
{id:"status",s:"Périmètre",title:"Dans quel cadre ce dispositif sera-t-il utilisé ?",help:"Un dispositif en investigation clinique ou fabriqué sur mesure relève de règles particulières d'étiquetage. Ne jamais apposer le CE avant l'achèvement de la procédure de conformité.",type:"single",options:[
["market","Dispositif destiné à être mis sur le marché","Étiquetage commercial MDR."],
["investigation","Dispositif destiné à une investigation clinique","Mention spécifique et dispositions applicables."],
["custom","Dispositif fabriqué sur mesure","Règles propres aux dispositifs sur mesure."],
["draft","Prototype ou conception en cours","Préparation d'une future étiquette : pas encore d'allégation de conformité."]]},
{id:"territory",s:"Périmètre",title:"Sur quel marché le dispositif sera-t-il fourni ?",help:"Le questionnaire suit prioritairement le règlement européen (UE) 2017/745. Des règles supplémentaires peuvent s'appliquer dans les pays hors UE.",type:"single",options:[["eu","Union européenne","MDR et exigences nationales de langue."],["euother","UE et autres pays","Vérifier également les règles des autres pays."],["outside","Hors Union européenne uniquement","Cette analyse MDR ne couvre pas à elle seule ce marché."]]},
{id:"support",s:"Produit",title:"Sur quel support préparez-vous l'étiquette ?",help:"L'étiquette du dispositif, celle du conditionnement unitaire et celle de l'emballage stérile n'ont pas toujours les mêmes exigences. La taille ne dispense pas automatiquement des mentions réglementaires.",type:"single",options:[["device","Directement sur le dispositif","Marquage physique ou plaque signalétique."],["unit","Sur l'emballage unitaire","Une unité de dispositif."],["sterile","Sur l'emballage maintenant la stérilité","Conditionnement barrière stérile."],["outer","Sur le conditionnement extérieur","Boîte ou emballage supérieur."]]},
{id:"pack",s:"Produit",title:"Existe-t-il plusieurs niveaux de conditionnement ?",help:"En règle générale l'UDI doit se retrouver à chaque niveau supérieur de conditionnement, hors conteneurs logistiques. Chaque niveau commercial peut nécessiter son propre UDI-DI.",type:"single",options:[["one","Non, un seul niveau commercial","Une unité ou un conditionnement."],["multiple","Oui, unités, boîtes ou cartons commerciaux","Plusieurs niveaux d'étiquetage peuvent être nécessaires."]]},
{id:"carrier",s:"Traçabilité",title:"Plusieurs codes de données figurent-ils sur la même étiquette ?",help:"Le symbole ISO 15223-1 5.7.10 sert à identifier le support UDI, notamment si plusieurs codes sont présents. Ce pictogramme ne remplace pas le support UDI obligatoire.",type:"single",when:a=>a.status==="market"&&a.territory!=="outside",options:[["one","Non, seul le code UDI est présent"],["multiple","Oui, plusieurs codes de données sont présents"]]},
{id:"class",s:"Réglementaire",title:"Quelle est la classe réglementaire du dispositif ?",help:"La classe conditionne l'évaluation de conformité. Un dispositif de classe I peut néanmoins requérir un organisme notifié dans certains cas (stérile, fonction de mesurage, instrument chirurgical réutilisable).",type:"single",options:[["i","Classe I","Sans caractéristique Is, Im ou Ir."],["is","Classe Is, Im ou Ir","Intervention d'un organisme notifié pour les aspects concernés."],["iia","Classe IIa","Procédure d'évaluation de conformité à confirmer."],["iib","Classe IIb","Procédure d'évaluation de conformité à confirmer."],["iii","Classe III","Procédure d'évaluation de conformité à confirmer."]]},
{id:"ce",s:"Réglementaire",title:"Quel est le statut du marquage CE de ce dispositif ?",help:"Le logo CE, et le numéro de l'organisme notifié lorsqu'il est applicable, ne peuvent être ajoutés que sur la base d'une conformité établie. Le numéro n'est pas déduit automatiquement de la classe.",type:"single",when:a=>a.status==="market",options:[["ce-alone","Marquage CE autorisé sans numéro d'organisme notifié","Notamment classe I sans intervention d'organisme notifié."],["ce-nb","Marquage CE autorisé avec organisme notifié","Le numéro de l'organisme doit être confirmé."],["notready","Procédure de conformité non achevée","Ne pas apposer le CE."]]},
{id:"manufacturer",s:"Opérateurs",title:"Où est établi le fabricant légal ?",help:"L'étiquette doit identifier le fabricant et son adresse de siège. S'il est établi hors UE, un mandataire dans l'Union est généralement requis.",type:"single",options:[["eu","Dans l'Union européenne","Fabricant et adresse du siège à faire apparaître."],["outside","Hors Union européenne","Vérifier mandataire UE et informations correspondantes."]]},
{id:"import",s:"Opérateurs",title:"Un importateur fait-il entrer le dispositif dans l'UE ?",help:"L'article 13(3) du MDR impose à l'importateur de faire figurer certaines informations sur le dispositif, son emballage ou un document l'accompagnant, sans masquer celles du fabricant.",type:"single",options:[["yes","Oui"],["no","Non"]]},
{id:"implant",s:"Utilisation",title:"Le dispositif est-il implantable ?",help:"Des règles UDI-PI spécifiques s'appliquent aux dispositifs implantables : numéro de série pour les actifs implantables, numéro de série ou de lot pour les autres.",type:"single",options:[["no","Non"],["active","Oui, dispositif actif implantable"],["passive","Oui, dispositif implantable non actif"]]},
{id:"reuse",s:"Utilisation",title:"Le dispositif est-il destiné à plusieurs utilisations ?",help:"Un dispositif à usage unique doit être clairement identifié comme tel. Si le dispositif est réutilisable et nécessite un retraitement entre les patients, des règles de marquage UDI direct et d'instructions de retraitement peuvent s'appliquer.",type:"single",options:[["single","Non, usage unique"],["reusable","Oui, réutilisable"],["limited","Oui, mais avec un nombre maximal de réutilisations"]]},
{id:"patient",s:"Utilisation",title:"Le dispositif réutilisable est-il réservé à un seul patient ?",help:"ISO 15223-1, 5.4.12 : le symbole « un seul patient, plusieurs utilisations » ne s’applique pas aux dispositifs réutilisés pour plusieurs patients.",type:"single",when:a=>["reusable","limited"].includes(a.reuse),options:[["same","Oui, toujours le même patient"],["multiple","Non, il peut être utilisé pour plusieurs patients"]]},
{id:"reprocess",s:"Utilisation",title:"Que faut-il faire entre deux utilisations ?",help:"Ne confondez pas « réutilisable » et « restérilisable ». La notice doit décrire les procédés validés appropriés, les limites et critères de fin de vie.",type:"single",when:a=>["reusable","limited"].includes(a.reuse),options:[["clean","Nettoyage uniquement"],["disinfect","Nettoyage puis désinfection"],["sterilize","Nettoyage puis stérilisation"],["none","Pas de retraitement entre utilisations"]]},
{id:"sterile",s:"Stérilité",title:"Comment le dispositif est-il fourni ?",help:"Le caractère stérile se réfère à l'état du dispositif livré, pas à un nettoyage ultérieur. Un dispositif non stérile devant être stérilisé par l'utilisateur requiert des instructions adaptées.",type:"single",options:[["sterile","Fourni stérile"],["nonsterile","Fourni non stérile"],["before","Fourni non stérile, à stériliser avant utilisation"]]},
{id:"nonsterilevariants",s:"Stérilité",title:"Ce modèle est-il aussi commercialisé en version stérile ?",help:"La norme ISO 15223-1 limite l’emploi du symbole 5.2.7 « Non stérile » : il convient surtout pour distinguer des dispositifs identiques ou similaires proposés à l’état stérile et non stérile.",type:"single",when:a=>a.sterile==="nonsterile"||a.sterile==="before",options:[["yes","Oui, une version stérile existe"],["no","Non, uniquement non stérile"]]},
{id:"fluidpath",s:"Stérilité",title:"Une partie du dispositif comporte-t-elle un chemin de fluide stérile ?",help:"Le symbole 5.2.9 concerne un chemin de fluide stérile lorsque le reste du dispositif, notamment sa partie externe, n’est pas stérile. La méthode du procédé et la partie concernée doivent être identifiées.",type:"single",when:a=>a.sterile!=="sterile",options:[["yes","Oui, chemin de fluide stérile"],["no","Non"]]},
{id:"sterilmethod",s:"Stérilité",title:"Quelle méthode de stérilisation est utilisée ?",help:"Le symbole est lié à une méthode validée. Ne pas sélectionner par défaut un procédé simplement parce qu'il est courant.",type:"single",when:a=>a.sterile==="sterile",options:[["eo","Oxyde d'éthylène (EO)"],["radiation","Irradiation"],["steam","Vapeur d'eau ou chaleur sèche"],["aseptic","Techniques de préparation aseptique"],["vph","Peroxyde d’hydrogène vaporisé"],["other","Autre procédé / procédé mixte"]]},
{id:"barrier",s:"Stérilité",title:"Quel système de barrière stérile est utilisé ?",help:"La barrière stérile doit être distinguée de l'emballage protecteur. Des symboles ISO 15223-1 décrivent les différents agencements.",type:"single",when:a=>a.sterile==="sterile",options:[["single","Une barrière stérile"],["double","Deux barrières stériles"],["inner","Une barrière stérile avec protection interne"],["outer","Une barrière stérile avec protection externe"]]},
{id:"resterilize",s:"Stérilité",title:"Le dispositif peut-il être restérilisé après ouverture ?",help:"Ne pas confondre « ne pas restériliser » (ISO 15223-1, 5.2.6) et « ne pas réutiliser » (5.4.2). Les deux informations ne sont pas interchangeables.",type:"single",when:a=>a.sterile==="sterile",options:[["no","Non, ne pas restériliser"],["yes","Oui, un procédé validé existe"]]},
{id:"expiry",s:"Durée de vie",title:"Existe-t-il une date limite d'utilisation ou d'implantation ?",help:"Une date limite peut être pertinente pour un dispositif stérile ou non stérile. En l'absence de date limite, la date de fabrication doit normalement être indiquée sur l'étiquette.",type:"single",options:[["yes","Oui, une date limite est définie"],["no","Non, pas de date limite pertinente"]]},
{id:"tracking",s:"Traçabilité",title:"Comment les unités fabriquées sont-elles identifiées ?",help:"Le lot et/ou la série sont les données de production (UDI-PI) lorsqu'elles sont applicables. Pour un actif implantable, la série doit être présente. La date de péremption affichée doit aussi figurer dans l'UDI-PI.",type:"single",options:[["lot","Par numéro de lot"],["serial","Par numéro de série"],["both","Lot et numéro de série"]]},
{id:"storage",s:"Conservation",title:"Quelles précautions de stockage doivent être indiquées ?",help:"Vous pouvez sélectionner plusieurs conditions réellement imposées par les spécifications et la gestion des risques. Un symbole sans limite chiffrée appropriée peut être insuffisant.",type:"multi",options:[["temperature","Limites de température"],["humidity","Limites d'humidité"],["dry","Garder au sec"],["sunlight","Protéger du soleil"],["fragile","Fragile / manutention spécifique"],["pressure","Plage de pression atmosphérique"],["none","Aucune condition particulière"]]},
{id:"substances",s:"Matières",title:"Le dispositif ou son emballage comporte-t-il des substances à signaler ?",help:"Certaines substances nécessitent une indication spécifique et parfois une justification dans la documentation. Les exigences CMR/perturbateurs endocriniens sont conditionnelles ; un simple pictogramme ne suffit pas.",type:"multi",options:[["latex","Latex naturel"],["cmr","Substances CMR ou perturbateurs endocriniens pertinentes"],["med","Substance médicamenteuse incorporée"],["blood","Dérivés du sang ou plasma humain"],["human","Tissus ou dérivés d'origine humaine"],["animal","Tissus ou dérivés d'origine animale"],["nano","Nanomatériaux"],["none","Aucun de ces cas"]]},
{id:"instructions",s:"Information",title:"Quelles informations d'utilisation sont nécessaires ?",help:"Le renvoi à une notice peut être pertinent, mais la notice électronique seule est soumise à des conditions particulières. Les avertissements immédiats ne peuvent pas toujours être déportés dans la notice.",type:"multi",options:[["ifu","Consulter la notice avant utilisation"],["electronic","Notice électronique envisagée"],["warning","Avertissement critique à lire sur l'étiquette"],["damaged","Ne pas utiliser si l'emballage est endommagé"],["none","Aucune information particulière identifiée"]]},
{id:"electronic",s:"Produit",title:"Le dispositif comporte-t-il une partie électrique ou électronique ?",help:"Les dispositifs électriques peuvent nécessiter des marquages complémentaires hors ISO 15223-1 (par exemple sécurité électrique ou DEEE), selon leurs caractéristiques et les textes applicables.",type:"single",options:[["yes","Oui, équipement électrique ou électronique"],["no","Non, dispositif non électrique"]]},
{id:"space",s:"Étiquette",title:"Quelle surface est disponible pour l’étiquetage ?",help:"Cette question concerne l'espace sur le support choisi, pas la taille totale du dispositif. La place disponible ne dispense pas des mentions requises : il faudra parfois adapter les niveaux d'emballage.",type:"single",options:[["tiny","Très petite : moins de 20 × 20 mm"],["small","Petite : environ 40 × 20 mm"],["medium","Moyenne : environ 70 × 40 mm"],["large","Grande : 100 × 50 mm ou plus"]]},
{id:"language",s:"Étiquette",title:"Pour quels pays les informations seront-elles préparées ?",help:"Les États membres fixent les exigences de langue des informations fournies avec les dispositifs. Des symboles normalisés peuvent aider mais ne remplacent pas tous les textes requis.",type:"single",options:[["fr","France"],["eu","Plusieurs pays de l'UE"],["other","UE et pays hors UE"]]}
];

const $=(sel)=>root.querySelector(sel);
const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

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
 return '<button type="button" class="answer label-option" data-choice="'+escapeHTML(value)+'" aria-pressed="'+sel+'"><div class="answer-copy">'+escapeHTML(label)+'</div></button>';
}
function choiceNotes(q){const seen=new Set([q.help]);const notes=q.options.filter(o=>o[2]&&!seen.has(o[2])&&seen.add(o[2])).map(o=>'<li><strong>'+escapeHTML(o[1])+'</strong><p>'+escapeHTML(o[2])+'</p></li>').join('');return notes?'<strong>Précisions sur les choix</strong><ul>'+notes+'</ul>':'';}
function showQuestion(){
 const q=current(),qs=applicable(),pct=Math.round(position/qs.length*100);
 root.innerHTML='<div class="question-progress"><span>'+escapeHTML(q.s)+' · Étiquette MDR <b>Question '+(position+1)+' / '+qs.length+'</b></span><progress max="100" value="'+pct+'" aria-label="Progression"></progress></div>'
 +'<section class="question-card"><div class="question-prompt"><div class="question-heading"><h1 id="question-title">'+escapeHTML(q.title)+'</h1>'
 +'<details class="info-bubble"><summary aria-label="Comprendre cette question">i</summary><div><strong>Pourquoi cette question ?</strong><p>'+escapeHTML(q.help)+'</p>'+choiceNotes(q)+'</div></details></div></div>'
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
 /* Deux niveaux distincts : exigences MDR pour l'information, symboles ISO utilisables pour la représenter.
  * On ne reproduit aucun graphisme normatif dans cet outil.
  */
 const required=[],conditional=[],review=[];
 const add=(target,code,title,detail,source,tag)=>target.push({code,title,detail,source:source||"",tag:tag||""});
 const r=(code,title,detail,source,tag)=>add(required,code,title,detail,source,tag);
 const c=(code,title,detail,source,tag)=>add(conditional,code,title,detail,source,tag);
 const v=(title,detail)=>add(review,"!",title,detail,"Contrôle");
 const a=answers;
 const market=a.status==="market",draft=a.status==="draft",custom=a.status==="custom",investigation=a.status==="investigation";
 const isEU=a.territory!=="outside";
 const isDevice=a.support==="device",sterilePack=a.support==="sterile";
 const label=!isDevice;
 const sterile=a.sterile==="sterile";
 const trackingLot=a.tracking==="lot"||a.tracking==="both",trackingSerial=a.tracking==="serial"||a.tracking==="both";
 const reused=a.reuse==="reusable"||a.reuse==="limited";
 const reprocessed=["clean","disinfect","sterilize"].includes(a.reprocess);
 const iso="ISO 15223-1:2021";
 const mdr="MDR (UE) 2017/745";
 if(market&&!isEU){
  r("Texte","Identification du dispositif","Conserver une identification claire du modèle et de son fabricant.","Information générale","Mention");
  v("Marché non couvert par cette analyse","Ce questionnaire concerne le MDR européen. Les obligations de marquage pour une commercialisation exclusivement hors UE doivent être établies selon le pays de destination.");
  return {required,conditional,review};
 }

 r("Texte","Nom et identification du produit","Préciser la dénomination, le modèle et le contenu de l'emballage si nécessaire.",mdr+" annexe I, 23.2(a–b)","Mention");
 if(label){
  r("5.1.1","Fabricant légal et adresse","Indiquer le nom légal et l'adresse du siège du fabricant. Le symbole 5.1.1 peut introduire ces coordonnées.",mdr+" annexe I, 23.2(c)","Mention");
  if(!draft){
   r("5.7.7","Indication « dispositif médical »","Le MDR exige cette indication. Le symbole MD (5.7.7) est une manière possible de la présenter.",mdr+" annexe I, 23.2(q)","Mention");
  }
  if(a.manufacturer==="outside"&&isEU&&!draft){
   r("5.1.2","Mandataire dans l'Union et adresse","Utiliser les coordonnées du mandataire UE ; symbole 5.1.2 dans la version amendée A1:2025 (code de juridiction).",mdr+" annexe I, 23.2(d) ; "+iso+" / A1:2025","Mention");
  }
 }else{
  c("Texte","Marquage du dispositif","Privilégier l'identification durable adaptée au produit. Le marquage direct n'est pas identique à l'étiquette complète du conditionnement.",mdr+" annexe I, 23.1 et 23.2","Support");
  v("Étiquettes des emballages distinctes","Le questionnaire porte ici sur le dispositif lui-même. Prévoir séparément l'étiquette de l'unité de vente et, le cas échéant, du conditionnement stérile.");
 }

 if(custom&&label)r("Texte","Mention « dispositif sur mesure »","Mention spécifique requise ; les conditions de l'annexe XIII doivent être vérifiées.",mdr+" annexe I, 23.2(p), annexe XIII","Mention");
 if(investigation&&label)r("Texte","Mention « exclusivement destiné à une investigation clinique »","Ne pas assimiler à une étiquette commerciale marquée CE.",mdr+" annexe I, 23.2(q)","Mention");
 if(draft)v("Produit en développement","Ne pas faire apparaître de marquage CE ou d'UDI commercial non attribué sur une étiquette de prototype.");
 if(custom||investigation)v("Procédure particulière","Vérifier l'étiquetage et la documentation spécifiques aux dispositifs sur mesure ou aux investigations cliniques ; le régime commercial standard ne s'applique pas automatiquement.");

 if(market&&isEU){
  if(a.ce==="ce-alone")r("CE","Marquage CE","Ne l'apposer qu'après achèvement de la procédure de conformité applicable. Utiliser le graphisme réglementaire officiel.",mdr+" articles 20 et 52, annexe V","Marquage");
  else if(a.ce==="ce-nb")r("CE + ON","CE et numéro d'organisme notifié","Confirmer le numéro de l'ON et sa participation à la procédure de conformité, sans l'inférer automatiquement de la classe.",mdr+" articles 20 et 52, annexe V","Marquage");
  else v("Marquage CE non autorisé","La procédure de conformité n'est pas achevée : ne pas imprimer le CE.");
  if(label)r("UDI (AIDC + HRI)","Support UDI","Placer un identifiant UDI attribué avec sa représentation lisible par machine et par l'homme suivant l'entité d'attribution et les exemptions applicables ; le Basic UDI-DI n'est pas imprimé.",mdr+" article 27 ; annexe VI, partie C","Traçabilité");
  if(a.carrier==="multiple"&&label)c("5.7.10","Pictogramme UDI (facultatif)","Le symbole 5.7.10 permet de repérer le support UDI en présence de plusieurs supports de données ; il ne constitue pas le support UDI lui-même.",iso+" 5.7.10","Symbole");
 }else if(market&&!isEU){
  v("Commercialisation hors Union européenne","Les mentions MDR ci-dessous sont seulement indicatives pour ce marché. Les règles locales restent à établir.");
 }

 if(label&&!draft){
  if(trackingLot)r("5.1.5","Numéro de lot (LOT)","La valeur LOT doit être cohérente avec la production et l'UDI-PI applicable.",mdr+" annexe I, 23.2(g) ; "+iso+" 5.1.5","Traçabilité");
  if(trackingSerial)r("5.1.7","Numéro de série (SN)","La valeur SN doit être cohérente avec la production et l'UDI-PI applicable.",mdr+" annexe I, 23.2(g) ; "+iso+" 5.1.7","Traçabilité");
  if(sterilePack){
   r("5.1.3","Date de fabrication (mois/année)","Information propre à l'emballage maintenant l'état stérile, même si une péremption est indiquée.",mdr+" annexe I, 23.3(h)","Date");
   r("5.1.4","Date limite d'utilisation (année/mois minimum)","L'emballage stérile doit indiquer la limite d'utilisation ou d'implantation sûre.",mdr+" annexe I, 23.3(i)","Date");
   if(a.expiry==="no")v("Date limite manquante pour l'emballage stérile","La réponse « aucune date limite » ne satisfait pas la liste d'informations prévue à l'annexe I, 23.3(i).");
  }else if(a.expiry==="yes"){
   r("5.1.4","Date limite d'utilisation","Indiquer la date limite déterminée par les données de durée de vie et la stabilité.",mdr+" annexe I, 23.2(i)","Date");
  }else{
   r("5.1.3","Date de fabrication","En l'absence de limite d'utilisation renseignée, la date de fabrication doit être identifiable.",mdr+" annexe I, 23.2(j)","Date");
  }
  c("5.1.6","Référence catalogue / modèle","À utiliser si nécessaire pour identifier sans ambiguïté la version du produit, distincte de l'UDI.",iso+" 5.1.6","Identification");
 }else if(draft&&label){
  c("5.1.6","Référence du prototype","Utiliser une référence interne et une révision documentée, sans la présenter comme UDI-DI.",iso+" 5.1.6","Identification");
 }

 if(a.implant==="active"&&!trackingSerial)v("Implant actif : numéro de série requis","Pour un dispositif actif implantable, l'UDI-PI doit comprendre un numéro de série.");
 if(a.implant==="passive"&&!trackingSerial&&!trackingLot)v("Implant : lot ou série","Pour les autres dispositifs implantables, l'UDI-PI doit au minimum identifier lot ou série.");

 if(sterile){
  const methods={
   eo:["5.2.3","Stérilisé à l'oxyde d'éthylène"],
   radiation:["5.2.4","Stérilisé par irradiation"],
   steam:["5.2.5","Stérilisé par vapeur ou chaleur sèche"],
   aseptic:["5.2.2","Préparation aseptique"],
   vph:["5.2.10","Stérilisé au peroxyde d'hydrogène vaporisé"],
   other:["5.2.1","Stérile — autre procédé"]
  };
  const method=methods[a.sterilmethod];
  if(label){
   if(method)r(method[0],method[1],"Choisir ce symbole selon le procédé effectivement validé. Ne PAS ajouter le symbole générique 5.2.1 lorsqu'une méthode spécifique 5.2.2 à 5.2.5 ou 5.2.10 est affichée.",mdr+" annexe I, 23.2(l) ; "+iso+" 5.2","Stérilité");
   if(a.sterilmethod==="other")v("Méthode de stérilisation à préciser","La mention du procédé validé est exigée. Le symbole générique ne suffit pas à donner cette information.");
  }
  const barriers={
   single:["5.2.11","Barrière stérile simple"],
   double:["5.2.12","Barrière stérile double"],
   inner:["5.2.13","Barrière stérile et protection intérieure"],
   outer:["5.2.14","Barrière stérile et protection extérieure"]
  };
  const barrier=barriers[a.barrier];
  if(label&&barrier)c(barrier[0],barrier[1],"Symbole à placer près du symbole de stérilisation si utilisé. Il faut distinguer barrière microbienne et emballage de protection.",iso+" 5.2.11–5.2.14","Conditionnement");
  if(label&&a.resterilize==="no"){
   if(reused&&a.reprocess==="sterilize")v("Incompatibilité entre réutilisation et restérilisation","Vous avez prévu une stérilisation entre utilisations mais déclaré « ne pas restériliser ». Ne pas proposer le symbole 5.2.6 avant correction.");
   else c("5.2.6","Ne pas restériliser","Réservé aux dispositifs portant un symbole stérile et ne devant pas être restérilisés. Ne pas l'utiliser pour un dispositif réutilisable stérilisé entre les usages.",iso+" 5.2.6","Utilisation");
  }
  if(sterilePack){
   r("Texte","Identification de l'emballage stérile","L'emballage doit être reconnaissable comme maintenant l'état stérile et identifier le dispositif, le fabricant, et le procédé de stérilisation.",mdr+" annexe I, 23.3(a–e)","Emballage");
   r("Texte","Consigne en cas d'emballage endommagé","Prévoir une indication invitant à consulter la notice sur la conduite à tenir si l'emballage stérile est ouvert ou endommagé.",mdr+" annexe I, 23.3(j)","Emballage");
   c("5.2.8","Pictogramme « emballage endommagé »","Peut accompagner la consigne imposée pour la barrière stérile, en conservant un renvoi compréhensible à la notice.",iso+" 5.2.8","Emballage");
  }
 }else{
  if(a.fluidpath==="yes"&&label){
   r("5.2.9","Chemin de fluide stérile","À retenir uniquement si le chemin de fluide est stérile alors que le dispositif dans son ensemble ne l'est pas. Identifier la partie concernée et la méthode de stérilisation.",iso+" 5.2.9","Stérilité");
  }
  if(a.nonsterilevariants==="yes"&&label){
   c("5.2.7","Non stérile","Symbole utile pour distinguer une version non stérile d'une version identique ou similaire commercialisée stérile.",iso+" 5.2.7","Stérilité");
  }
  if(a.sterile==="before"){
   v("Stérilisation avant utilisation","Fournir un procédé validé, les paramètres et les instructions correspondantes dans la notice.");
  }
  if(sterilePack)v("Support incohérent avec l'état déclaré","Un conditionnement maintenant la stérilité ne peut pas correspondre à un dispositif déclaré fourni non stérile.");
 }

 if(a.reuse==="single"&&label&&!draft)r("5.4.2","À usage unique — ne pas réutiliser","L'indication d'usage unique est requise si le dispositif est conçu pour une seule procédure sur un patient.",mdr+" annexe I, 23.2(n) ; "+iso+" 5.4.2","Utilisation");
 if(reused){
  if(a.patient==="same"&&label)c("5.4.12","Un seul patient, plusieurs utilisations","Adapté uniquement au matériel réutilisable sur un même patient, et non sur plusieurs patients.",iso+" 5.4.12","Utilisation");
  if(a.reprocess==="none"&&a.patient==="multiple")v("Retraitement entre patients à justifier","Le dispositif est déclaré réutilisable sur plusieurs patients sans retraitement entre les utilisations : évaluer la sécurité et la justification technique.");
  c("Notice","Instructions de retraitement","Documenter les procédés validés, limites de cycles et critères de fin de vie du dispositif.",mdr+" annexe I, 23.4(n)","Notice");
  if(a.reuse==="limited")c("Notice","Nombre maximal de réutilisations","La limite validée doit être portée dans la documentation et communiquée à l'utilisateur.",mdr+" annexe I, 23.4(n)","Notice");
  if(market&&isEU&&reprocessed){
   const directRequired=!["i","is"].includes(a.class);
   if(isDevice&&directRequired){
    r("UDI direct","Marquage direct UDI permanent","L'UDI des dispositifs retraités entre usages doit être lisible après chaque cycle, sauf exemption documentée en cas d'impossibilité technique ou d'incidence sur la sécurité et la performance.",mdr+" annexe VI, partie C, 6.2 et 4.10","Traçabilité");
   }else if(isDevice){
    c("UDI direct","Marquage direct UDI (classe I : 26 mai 2027)","Obligation applicable à partir du 26 mai 2027 pour la classe I, sauf dérogation documentée. Vérifier l'applicabilité anticipée éventuelle.",mdr+" article 123(3)(g) ; annexe VI, partie C","Traçabilité");
   }else{
    v("UDI direct sur le dispositif","Étudier le marquage UDI permanent du dispositif retraité. Classes III/implantables : depuis 2023 ; classes IIa/IIb : depuis 2025 ; classe I : à partir du 26 mai 2027. Exemptions à justifier.");
   }
  }
 }

 const storage=[
  ["temperature","5.3.7","Limites de température"],
  ["humidity","5.3.8","Limites d'humidité"],
  ["pressure","5.3.9","Limites de pression atmosphérique"],
  ["dry","5.3.4","Conserver au sec"],
  ["sunlight","5.3.2","Protéger de la lumière solaire"],
  ["fragile","5.3.1","Fragile : manipuler avec soin"]
 ];
 if(label){
  storage.forEach(item=>{if(listContains("storage",item[0]))r(item[1],item[2],"Ajouter les valeurs et limites validées si le symbole le requiert ; ne pas inventer des seuils.",mdr+" annexe I, 23.2(k) ; "+iso+" 5.3","Stockage");});
  const substances=[
   ["latex","5.4.5","Latex de caoutchouc naturel"],
   ["blood","5.4.6","Dérivés du sang ou du plasma humain"],
   ["med","5.4.7","Substance médicamenteuse incorporée"],
   ["animal","5.4.8","Matériau biologique d'origine animale"],
   ["human","5.4.9","Matériau biologique d'origine humaine"],
   ["cmr","5.4.10","Substances dangereuses (CMR / perturbateurs endocriniens)"],
   ["nano","5.4.11","Nanomatériaux"]
  ];
  substances.forEach(item=>{
   if(listContains("substances",item[0])){
    if(item[0]==="nano"||item[0]==="latex")
     c(item[1],item[2],"Vérifier que le symbole correspond aux matériaux et risques documentés du produit.",iso+" "+item[1],"Composition");
    else r(item[1],item[2],"Évaluer la mention réglementaire exacte à partir de la composition, de l'analyse de risques et des seuils applicables.",mdr+" annexe I, 23.2(e–f) ; "+iso+" "+item[1],"Composition");
   }
  });
  if(listContains("instructions","ifu")||listContains("instructions","electronic"))c("5.4.3","Consulter la notice","Le symbole peut renvoyer aux instructions d'utilisation, papier ou électronique dans les conditions réglementaires applicables.",iso+" 5.4.3","Notice");
  if(listContains("instructions","warning"))r("5.4.4","Attention et avertissements particuliers","La nature et le placement des avertissements doivent venir de l'analyse de risques, le pictogramme seul ne remplace pas le texte nécessaire.",mdr+" annexe I, 23.2(m) ; "+iso+" 5.4.4","Sécurité");
  if(listContains("instructions","damaged")&&!sterilePack)c("5.2.8","Emballage endommagé : consulter la notice","À envisager si l'intégrité de l'emballage conditionne l'utilisation sûre du produit.",iso+" 5.2.8","Emballage");
 }
 if(listContains("instructions","electronic"))v("Notice électronique","Vérifier l'éligibilité au régime de notice électronique avant de supprimer toute notice papier.");
 if(a.electronic==="yes")v("Marquages électriques complémentaires","Évaluer, si applicables, les exigences issues des normes électriques, des batteries et de la réglementation DEEE, hors ISO 15223-1.");
 if(a.pack==="multiple"&&market)v("Niveaux commerciaux de conditionnement","Examiner séparément l'UDI-DI et l'étiquette de chaque niveau de commercialisation, en excluant les conteneurs purement logistiques.");
 if(["tiny","small"].includes(a.space))v("Place réduite pour les marquages","Vérifier la lisibilité des symboles, des caractères et de l'UDI après impression. Une surface réduite ne dispense pas automatiquement des mentions obligatoires.");
 if(["eu","other"].includes(a.language))v("Langues applicables","Vérifier les exigences linguistiques des États membres ciblés et, le cas échéant, celles des pays hors UE.");
 if(a.ce==="ce-alone"&&["is","iia","iib","iii"].includes(a.class))v("CE / organisme notifié : déclaration incohérente","La classe ou les caractéristiques déclarées demandent une vérification de la procédure et du numéro d'organisme notifié.");
 if(a.ce==="ce-nb"&&a.class==="i")v("Classe I et organisme notifié","Vérifier pourquoi un organisme notifié intervient, ou corriger la classification.");
 if(a.class==="i"&&sterile&&market)v("Classe I stérile","Vérifier si la classification doit être Is et si un organisme notifié doit intervenir pour les aspects liés à la stérilité.");
 if(a.manufacturer==="outside"&&!isEU&&market)v("Mandataire et opérateurs hors UE","Les obligations relatives aux représentants dépendent du marché de destination ; ne pas appliquer automatiquement la règle européenne.");
 if(a.import==="yes"&&isEU&&label)c("5.1.8","Importateur","Coordonnées requises par l'article 13(3), qui peuvent figurer sur le dispositif, son emballage ou un document d'accompagnement ; pas nécessairement sur cette étiquette.",mdr+" article 13(3) ; "+iso+" 5.1.8","Opérateur");

 const unique=items=>items.filter((x,i)=>items.findIndex(y=>y.code===x.code&&y.title===x.title)===i);
 return {required:unique(required),conditional:unique(conditional),review:unique(review)};
}
/* Les PNG ISO source proviennent du document fourni ; CE et MD sont fournis séparément.
 * Correspondance stricte par numéro de symbole : aucun remplacement inventé.
 * Les mentions UDI et textuelles sans fichier restent textuelles.
 */
const isoSymbolCodes=new Set("5.1.1 5.1.2 5.1.3 5.1.4 5.1.5 5.1.6 5.1.7 5.1.8 5.1.9 5.1.10 5.1.11 5.2.1 5.2.2 5.2.3 5.2.4 5.2.5 5.2.6 5.2.7 5.2.8 5.2.9 5.2.10 5.2.11 5.2.12 5.2.13 5.2.14 5.3.1 5.3.2 5.3.3 5.3.4 5.3.5 5.3.6 5.3.7 5.3.8 5.3.9 5.4.1 5.4.2 5.4.3 5.4.4 5.4.5 5.4.6 5.4.7 5.4.8 5.4.9 5.4.10 5.4.11 5.4.12 5.5.1 5.5.2 5.5.3 5.5.4 5.5.5 5.5.6 5.7.7 5.7.10".split(" "));
function symbolImage(code,reference=false){
 const asset=(code==="CE"||code==="CE + ON")?"CE":code==="UDI (AIDC + HRI)"?"5.7.10":isoSymbolCodes.has(code)?code:null;
 if(!asset)return "";
 return '<img class="label-symbol-img'+(reference?' label-symbol-small':'')+'" src="symboles-iso/'+asset+'.png?v=2" alt="" aria-hidden="true" width="'+(reference?36:44)+'" height="'+(reference?36:44)+'" decoding="async">';
}
function symbolRef(code) {
 if(/^\d+\.\d+\.\d+$/.test(code))return "ISO " + code;
 return code==="Texte"?"Texte":code==="MDR"?"MDR":code==="Notice"?"Notice":code;
}
function renderShortList(items) {
 if(!items.length)return '<p class="label-empty">Aucun élément supplémentaire.</p>';
 return '<ul class="label-symbol-grid">'+items.map(it=>{
  const image=symbolImage(it.code);
  const textMark=it.code==='Texte'&&/^Nom /.test(it.title)?'Nom':it.code==='UDI (AIDC + HRI)'?'Code UDI':it.code==='UDI direct'?'UDI direct':it.code==='Notice'?'Notice':'Texte';
  return '<li>'+ (image||'<span class="label-text-mark" aria-hidden="true">'+escapeHTML(textMark)+'</span>')+'<span>'+escapeHTML(it.title)+'</span><small>'+escapeHTML(symbolRef(it.code))+'</small></li>';
 }).join('')+'</ul>';
}
function renderChecks(items){
 if(!items.length)return '<p class="label-empty">Aucun point particulier détecté.</p>';
 return '<ul class="label-checks">'+items.map(it=>'<li><strong>'+escapeHTML(it.title)+'</strong><span>'+escapeHTML(it.detail)+'</span></li>').join("")+'</ul>';
}
function renderReferences(result){
 const groups=[["À prévoir",result.required],["Selon votre dispositif",result.conditional],["Points de vigilance",result.review]];
 return '<details class="label-details"><summary>Afficher les explications et références réglementaires</summary><div>'+
 groups.map(group=>'<h3>'+escapeHTML(group[0])+'</h3>'+
 group[1].map(it=>'<div class="label-reference"><div class="label-reference-heading">'+symbolImage(it.code,true)+'<strong>'+escapeHTML(it.title)+'</strong></div><p>'+escapeHTML(it.detail)+'</p>'+(it.source?'<small>'+escapeHTML(it.source)+'</small>':'')+'</div>').join("")
 ).join("")+'</div></details>';
}
function summary(){
 const result=conclusions();
 const supportName=Q.find(q=>q.id==="support")?.options.find(o=>o[0]===answers.support)?.[1]||"Support d'étiquette";
 const answersHTML=applicable().map(q=>{
 const val=answers[q.id],values=Array.isArray(val)?val:[val];
 const labels=values.map(v=>q.options.find(o=>o[0]===v)?.[1]||"Non renseigné").join(", ");
 return '<div><dt>'+escapeHTML(q.title)+'</dt><dd>'+escapeHTML(labels)+'</dd></div>';
 }).join("");
 root.innerHTML=
 '<div class="label-result-heading label-summary-heading"><h1>À prévoir <span>'+result.required.length+'</span></h1><p class="label-result-support">'+escapeHTML(supportName)+'</p></div>'+
 '<section class="label-result-card label-main-grid">'+
 renderShortList(result.required)+'</section>'+
 (result.conditional.length?'<details class="label-result-card label-fold"><summary>Selon votre dispositif <span>'+result.conditional.length+'</span></summary>'+renderShortList(result.conditional)+'</details>':'')+
 (result.review.length?'<details class="label-result-card label-fold label-review"><summary>À vérifier avant impression <span>'+result.review.length+'</span></summary>'+renderChecks(result.review)+'</details>':'')+
 '<section class="label-result-card label-additional">'+renderReferences(result)+
 '<details class="label-answers"><summary>Voir mes réponses au questionnaire</summary><dl>'+answersHTML+'</dl></details></section>'+
 '<p class="label-disclaimer">Synthèse d’aide à la conception, non une validation réglementaire. Vérifiez les exigences du MDR, les symboles ISO 15223-1 applicables et la lisibilité réelle avant impression.</p>'+
 '<div class="export-actions"><button class="tool-button" type="button" data-action="print">Imprimer la synthèse</button></div>'+
 '<div class="result-bottom"><button class="tool-button" type="button" data-action="back">← Modifier mes réponses</button>'+
 '<button class="tool-button quiet" type="button" data-action="reset">Reprendre à zéro</button></div>';
}
// L'impression conserve les sections repliées sans changer l'état de lecture.
let printSections=[];
window.addEventListener?.('beforeprint',()=>{printSections=[...root.querySelectorAll('details.label-fold')].map(el=>[el,el.open]);for(const [el] of printSections)el.open=true;});
window.addEventListener?.('afterprint',()=>{for(const [el,open] of printSections)el.open=open;printSections=[];});
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
