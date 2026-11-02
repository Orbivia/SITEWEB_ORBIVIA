/* ORBIVIA — assistant d'étiquetage MDR / première étape : applicabilité.
 * Ne produit pas d’étiquette de dispositif prête à imprimer ni d’avis de conformité.
 */
(function () {
"use strict";
const root=document.getElementById("label-app");
if(!root)return;
const STORE="orbivia-mdr-label-wizard-v4";
const Q=[
{id:"status",s:"Périmètre",title:"Dans quel cadre ce dispositif sera-t-il utilisé ?",help:"Un dispositif en investigation clinique ou fabriqué sur mesure relève de règles particulières d'étiquetage. Ne jamais apposer le CE avant l'achèvement de la procédure de conformité.",type:"single",options:[
["market","Dispositif destiné à être mis sur le marché","Étiquetage commercial MDR."],
["investigation","Dispositif destiné à une investigation clinique","Mention spécifique et dispositions applicables."],
["custom","Dispositif fabriqué sur mesure","Règles propres aux dispositifs sur mesure."],
["draft","Prototype ou conception en cours","Préparation d'une future étiquette : pas encore d'allégation de conformité."]]},
{id:"territory",s:"Périmètre",title:"Sur quel marché le dispositif sera-t-il fourni ?",help:"Le questionnaire suit prioritairement le règlement européen (UE) 2017/745. Des règles supplémentaires peuvent s'appliquer dans les pays hors UE.",type:"single",options:[["eu","Union européenne","MDR et exigences nationales de langue."],["euother","UE et autres pays","Vérifier également les règles des autres pays."],["outside","Hors Union européenne uniquement","Les exigences locales sont hors du périmètre de cet outil."]]},
{id:"support",s:"Produit",title:"Sur quel support préparez-vous l'étiquette ?",help:"L'étiquette du dispositif, celle du conditionnement unitaire et celle de l'emballage stérile n'ont pas toujours les mêmes exigences. La taille ne dispense pas automatiquement des mentions réglementaires.",type:"single",options:[["device","Directement sur le dispositif","Marquage physique ou plaque signalétique."],["unit","Sur l'emballage unitaire","Une unité de dispositif."],["sterile","Sur l'emballage maintenant la stérilité","Conditionnement barrière stérile."],["outer","Sur le conditionnement extérieur","Boîte ou emballage supérieur."]]},
{id:"pack",s:"Produit",title:"Existe-t-il plusieurs niveaux de conditionnement ?",help:"En règle générale l'UDI doit se retrouver à chaque niveau supérieur de conditionnement, hors conteneurs logistiques. Chaque niveau commercial peut nécessiter son propre UDI-DI.",type:"single",options:[["one","Non, un seul niveau commercial","Une unité ou un conditionnement."],["multiple","Oui, unités, boîtes ou cartons commerciaux","Plusieurs niveaux d'étiquetage peuvent être nécessaires."]]},
{id:"carrier",s:"Traçabilité",title:"Plusieurs codes de données figurent-ils sur la même étiquette ?",help:"Le symbole ISO 15223-1 5.7.10 sert à identifier le support UDI, notamment si plusieurs codes sont présents. Ce pictogramme ne remplace pas le support UDI obligatoire.",type:"single",when:a=>a.status==="market"&&a.territory!=="outside"&&a.support!=="device",options:[["one","Non, seul le code UDI est présent"],["multiple","Oui, plusieurs codes de données sont présents"]]},
{id:"class",s:"Réglementaire",title:"Quelle est la classe réglementaire du dispositif ?",when:a=>a.status==="market",help:"La classe conditionne l'évaluation de conformité. Un dispositif de classe I peut néanmoins requérir un organisme notifié dans certains cas (stérile, fonction de mesurage, instrument chirurgical réutilisable).",type:"single",options:[["i","Classe I","Sans caractéristique Is, Im ou Ir."],["is","Classe Is, Im ou Ir","Intervention d'un organisme notifié pour les aspects concernés."],["iia","Classe IIa","Procédure d'évaluation de conformité à confirmer."],["iib","Classe IIb","Procédure d'évaluation de conformité à confirmer."],["iii","Classe III","Procédure d'évaluation de conformité à confirmer."]]},
{id:"ce",s:"Réglementaire",title:"Quel est le statut du marquage CE de ce dispositif ?",help:"Le logo CE, et le numéro de l'organisme notifié lorsqu'il est applicable, ne peuvent être ajoutés que sur la base d'une conformité établie. Le numéro n'est pas déduit automatiquement de la classe.",type:"single",when:a=>a.status==="market",options:[["ce-alone","Marquage CE autorisé sans numéro d'organisme notifié","Notamment classe I sans intervention d'organisme notifié."],["ce-nb","Marquage CE autorisé avec organisme notifié","Le numéro de l'organisme doit être confirmé."],["notready","Procédure de conformité non achevée","Ne pas apposer le CE."]]},
{id:"manufacturer",s:"Opérateurs",title:"Où est établi le fabricant légal ?",help:"L'étiquette doit identifier le fabricant et son adresse de siège. S'il est établi hors UE, un mandataire dans l'Union est généralement requis.",type:"single",options:[["eu","Dans l'Union européenne","Fabricant et adresse du siège à faire apparaître."],["outside","Hors Union européenne","Vérifier mandataire UE et informations correspondantes."]]},
{id:"import",s:"Opérateurs",title:"Un importateur fait-il entrer le dispositif dans l'UE ?",when:a=>a.territory!=="outside"&&a.status!=="draft",help:"L'article 13(3) du MDR impose à l'importateur de faire figurer certaines informations sur le dispositif, son emballage ou un document l'accompagnant, sans masquer celles du fabricant.",type:"single",options:[["yes","Oui"],["no","Non"]]},
{id:"implant",s:"Utilisation",title:"Le dispositif est-il implantable ?",help:"Des règles UDI-PI spécifiques s'appliquent aux dispositifs implantables : numéro de série pour les actifs implantables, numéro de série ou de lot pour les autres.",type:"single",options:[["no","Non"],["active","Oui, dispositif actif implantable"],["passive","Oui, dispositif implantable non actif"]]},
{id:"reuse",s:"Utilisation",title:"Le dispositif est-il destiné à plusieurs utilisations ?",help:"Un dispositif à usage unique doit être clairement identifié comme tel. Si le dispositif est réutilisable et nécessite un retraitement entre les patients, des règles de marquage UDI direct et d'instructions de retraitement peuvent s'appliquer.",type:"single",options:[["single","Non, usage unique"],["reusable","Oui, réutilisable"],["limited","Oui, mais avec un nombre maximal de réutilisations"]]},
{id:"patient",s:"Utilisation",title:"Le dispositif réutilisable est-il réservé à un seul patient ?",help:"ISO 15223-1, 5.4.12 : le symbole « un seul patient, plusieurs utilisations » ne s’applique pas aux dispositifs réutilisés pour plusieurs patients.",type:"single",when:a=>["reusable","limited"].includes(a.reuse),options:[["same","Oui, toujours le même patient"],["multiple","Non, il peut être utilisé pour plusieurs patients"]]},
{id:"reprocess",s:"Utilisation",title:"Que faut-il faire entre deux utilisations ?",help:"Ne confondez pas « réutilisable » et « restérilisable ». La notice doit décrire les procédés validés appropriés, les limites et critères de fin de vie.",type:"single",when:a=>["reusable","limited"].includes(a.reuse),options:[["clean","Nettoyage uniquement"],["disinfect","Nettoyage puis désinfection"],["sterilize","Nettoyage puis stérilisation"],["none","Pas de retraitement entre utilisations"]]},
{id:"sterile",s:"Stérilité",title:"Comment le dispositif est-il fourni ?",help:"Le caractère stérile se réfère à l'état du dispositif livré, pas à un nettoyage ultérieur. Un dispositif non stérile devant être stérilisé par l'utilisateur requiert des instructions adaptées.",type:"single",options:[["sterile","Fourni stérile"],["nonsterile","Fourni non stérile"],["before","Fourni non stérile, à stériliser avant utilisation"]]},
{id:"nonsterilevariants",s:"Stérilité",title:"Ce modèle est-il aussi commercialisé en version stérile ?",help:"La norme ISO 15223-1 limite l’emploi du symbole 5.2.7 « Non stérile » : il convient surtout pour distinguer des dispositifs identiques ou similaires proposés à l’état stérile et non stérile.",type:"single",when:a=>a.sterile==="nonsterile"||a.sterile==="before",options:[["yes","Oui, une version stérile existe"],["no","Non, uniquement non stérile"]]},
{id:"fluidpath",s:"Stérilité",title:"Une partie du dispositif comporte-t-elle un chemin de fluide stérile ?",help:"Le symbole 5.2.9 concerne un chemin de fluide stérile lorsque le reste du dispositif, notamment sa partie externe, n’est pas stérile. La méthode du procédé et la partie concernée doivent être identifiées.",type:"single",when:a=>a.sterile!=="sterile",options:[["yes","Oui, chemin de fluide stérile"],["no","Non"]]},
{id:"sterilmethod",s:"Stérilité",title:"Par quel procédé l’état stérile est-il obtenu ?",help:"Le symbole est lié à une méthode validée. Ne pas sélectionner par défaut un procédé simplement parce qu'il est courant.",type:"single",when:a=>a.sterile==="sterile",options:[["eo","Oxyde d'éthylène (EO)"],["radiation","Irradiation"],["steam","Vapeur d'eau ou chaleur sèche"],["aseptic","Techniques de préparation aseptique"],["vph","Peroxyde d’hydrogène vaporisé"],["other","Autre procédé / procédé mixte"]]},
{id:"barrier",s:"Stérilité",title:"Quel système de barrière stérile est utilisé ?",help:"La barrière stérile doit être distinguée de l'emballage protecteur. Des symboles ISO 15223-1 décrivent les différents agencements.",type:"single",when:a=>a.sterile==="sterile",options:[["single","Une barrière stérile"],["double","Deux barrières stériles"],["inner","Une barrière stérile avec protection interne"],["outer","Une barrière stérile avec protection externe"]]},
{id:"resterilize",s:"Stérilité",title:"Le dispositif peut-il être restérilisé après ouverture ?",help:"Ne pas confondre « ne pas restériliser » (ISO 15223-1, 5.2.6) et « ne pas réutiliser » (5.4.2). Les deux informations ne sont pas interchangeables.",type:"single",when:a=>a.sterile==="sterile",options:[["no","Non, ne pas restériliser"],["yes","Oui, un procédé validé existe"]]},
{id:"expiry",s:"Durée de vie",title:"Existe-t-il une date limite d'utilisation ou d'implantation ?",help:"Une date limite peut être pertinente pour un dispositif stérile ou non stérile. En l'absence de date limite, la date de fabrication doit normalement être indiquée sur l'étiquette.",type:"single",options:[["yes","Oui, une date limite est définie"],["no","Non, pas de date limite pertinente"]]},
{id:"tracking",s:"Traçabilité",title:"Comment les unités fabriquées sont-elles identifiées ?",help:"Le lot et/ou la série sont les données de production (UDI-PI) lorsqu'elles sont applicables. Pour un actif implantable, la série doit être présente. La date de péremption affichée doit aussi figurer dans l'UDI-PI.",type:"single",options:[["lot","Par numéro de lot"],["serial","Par numéro de série"],["both","Lot et numéro de série"]]},
{id:"storage",s:"Conservation",title:"Quelles précautions de stockage doivent être indiquées ?",help:"Vous pouvez sélectionner plusieurs conditions réellement imposées par les spécifications et la gestion des risques. Un symbole sans limite chiffrée appropriée peut être insuffisant.",type:"multi",options:[["temperature","Limites de température"],["humidity","Limites d'humidité"],["dry","Garder au sec"],["sunlight","Protéger du soleil"],["fragile","Fragile / manutention spécifique"],["pressure","Plage de pression atmosphérique"],["none","Aucune condition particulière"]]},
{id:"substances",s:"Matières",title:"Le dispositif ou son emballage comporte-t-il des substances à signaler ?",help:"Certaines substances nécessitent une indication spécifique et parfois une justification dans la documentation. Les exigences CMR/perturbateurs endocriniens sont conditionnelles ; un simple pictogramme ne suffit pas.",type:"multi",options:[["latex","Latex naturel"],["cmr","Substances CMR ou perturbateurs endocriniens pertinentes"],["med","Substance médicamenteuse incorporée"],["blood","Dérivés du sang ou plasma humain"],["human","Tissus ou dérivés d'origine humaine"],["animal","Tissus ou dérivés d'origine animale"],["nano","Nanomatériaux"],["none","Aucun de ces cas"]]},
{id:"instructions",s:"Information",title:"Quelles informations d'utilisation sont nécessaires ?",help:"Le renvoi à une notice peut être pertinent, mais la notice électronique seule est soumise à des conditions particulières. Les avertissements immédiats ne peuvent pas toujours être déportés dans la notice.",type:"multi",options:[["ifu","Consulter la notice avant utilisation"],["electronic","Notice électronique envisagée"],["warning","Avertissement critique à lire sur l'étiquette"],["damaged","Ne pas utiliser si l'emballage est endommagé"],["none","Aucune information particulière identifiée"]]},
{id:"electronic",s:"Produit",title:"Le dispositif comporte-t-il une partie électrique ou électronique ?",help:"Les dispositifs électriques peuvent nécessiter des marquages complémentaires hors ISO 15223-1 (par exemple sécurité électrique ou DEEE), selon leurs caractéristiques et les textes applicables.",type:"single",options:[["yes","Oui, équipement électrique ou électronique"],["no","Non, dispositif non électrique"]]},
{id:"elec_weee",s:"Environnement",title:"L'équipement relève-t-il de la filière DEEE (déchets d'équipements électriques et électroniques) ?",help:"Pour la majorité des équipements électriques/électroniques mis sur le marché européen, la directive 2012/19/UE impose le symbole de la poubelle sur roues barrée. Des exclusions existent. Le marquage se place normalement sur l'équipement lui-même.",type:"single",when:a=>a.electronic==="yes"&&a.status==="market",options:[["yes","Oui, l'équipement est concerné"],["no","Non, exclusion justifiée dans le dossier réglementaire"]]},
{id:"elec_battery",s:"Environnement",title:"Le dispositif comporte-t-il une pile ou une batterie ?",help:"Le marquage de collecte séparée des batteries relève du règlement (UE) 2023/1542 et concerne la batterie elle-même, distinctement du marquage DEEE de l'équipement.",type:"single",when:a=>a.electronic==="yes",options:[["no","Non"],["yes","Oui, pile ou batterie intégrée ou fournie"]]},
{id:"elec_ip",s:"Protection",title:"Un indice de protection IP a-t-il été vérifié pour l'enveloppe ?",help:"La codification IP selon l'IEC 60529 est une information technique, pas un pictogramme. Ne l'affichez que si le niveau a été justifié par les essais ou la documentation technique.",type:"single",when:a=>a.electronic==="yes",options:[["no","Non, aucun indice IP revendiqué"],["yes","Oui, un indice IP est établi"]]},
{id:"elec_ip_value",s:"Protection",title:"Quel indice IP a été établi ?",help:"Ne sélectionnez que l'indice réellement vérifié selon la norme IEC 60529. Le code affiché dans la synthèse n'est pas une certification délivrée par l'outil.",type:"single",when:a=>a.elec_ip==="yes"&&a.electronic==="yes",options:[["ip22","IP22"],["ip20","IP20"],["ip21","IP21"],["ip44","IP44"],["ip54","IP54"],["ip55","IP55"],["ip65","IP65"],["ip67","IP67"],["ip68","IP68"],["ipx4","IPX4"],["ipx7","IPX7"],["other","Autre indice IP documenté"]]},
{id:"elec_60601",s:"Sécurité électrique",title:"Le dispositif est-il un équipement électromédical évalué selon l'IEC 60601-1 ?",help:"Les classes de protection électrique et les types de parties appliquées (B, BF, CF) ne doivent pas être déduits du seul fait que le produit contient de l'électronique.",type:"single",when:a=>a.electronic==="yes",options:[["yes","Oui, IEC 60601-1 applicable"],["no","Non, autre référentiel électrique"]]},
{id:"elec_insulation",s:"Sécurité électrique",title:"Quelle protection contre les chocs électriques est déclarée ?",help:"Pour la classe II, le double carré correspond au symbole IEC 60417-5172. Ne pas confondre cette classe de protection électrique avec la classe MDR du dispositif.",type:"single",when:a=>a.elec_60601==="yes",options:[["internal","Source d'énergie interne"],["class2","Classe II — double isolation"],["class1","Classe I — mise à la terre de protection"]]},
{id:"elec_applied",s:"Sécurité électrique",title:"Le dispositif présente-t-il une partie appliquée au patient classifiée ?",help:"L'IEC 60601-1 définit les types B, BF et CF selon le degré de protection contre les chocs électriques ; ne sélectionner que la classification réellement justifiée.",type:"single",when:a=>a.elec_60601==="yes",options:[["none","Non, aucune partie appliquée de ce type"],["bf","Oui, type BF"],["b","Oui, type B"],["cf","Oui, type CF"]]},
{id:"elec_defib",s:"Sécurité électrique",title:"La partie appliquée est-elle protégée contre les décharges d'un défibrillateur ?",help:"Si cette protection est vérifiée, un symbole IEC 60417 distinct identifie la version résistante aux décharges de défibrillateur. Ne pas le déduire du seul type B, BF ou CF.",type:"single",when:a=>["b","bf","cf"].includes(a.elec_applied),options:[["no","Non"],["yes","Oui, protection validée"]]},
{id:"elec_manual",s:"Sécurité électrique",title:"Un avertissement impose-t-il la lecture du manuel avant utilisation ?",help:"Le symbole IEC 60417-1641 (« Operating manual ») diffère du symbole ISO 15223-1, 5.4.3 (« Consulter les instructions d'utilisation »). Le choix dépend des risques et des exigences de la norme applicable.",type:"single",when:a=>a.electronic==="yes",options:[["no","Non, renvoi standard à la notice suffisant"],["yes","Oui, lecture du manuel requise pour la sécurité"]]},
{id:"elec_supply",s:"Sécurité électrique",title:"Les caractéristiques nominales de l'alimentation doivent-elles figurer sur le dispositif ?",help:"Examiner tension, nature du courant (AC/DC), fréquence et puissance ou courant nominal selon la norme de sécurité et la construction retenues. Ne pas inventer de valeurs.",type:"single",when:a=>a.electronic==="yes",options:[["yes","Oui, marquage électrique nominal prévu"],["no","Non, absence justifiée pour ce produit"]]},
{id:"elec_indoor",s:"Sécurité électrique",title:"L'appareil est-il réservé à un usage en intérieur ?",help:"Le symbole IEC 60417-5957 peut être pertinent lorsque l'usage exclusivement intérieur doit être indiqué sur le produit.",type:"single",when:a=>a.electronic==="yes",options:[["no","Non, usage extérieur possible"],["yes","Oui, usage en intérieur uniquement"]]},
{id:"space",s:"Étiquette",title:"Quelle surface est disponible pour l’étiquetage ?",help:"Cette question concerne l'espace sur le support choisi, pas la taille totale du dispositif. La place disponible ne dispense pas des mentions requises : il faudra parfois adapter les niveaux d'emballage.",type:"single",options:[["tiny","Très petite : moins de 20 × 20 mm"],["small","Petite : environ 40 × 20 mm"],["medium","Moyenne : environ 70 × 40 mm"],["large","Grande : 100 × 50 mm ou plus"]]},
{id:"language",s:"Étiquette",title:"Pour quels pays les informations seront-elles préparées ?",help:"Les États membres fixent les exigences de langue des informations fournies avec les dispositifs. Des symboles normalisés peuvent aider mais ne remplacent pas tous les textes requis.",type:"single",options:[["fr","France"],["eu","Plusieurs pays de l'UE"],["other","UE et pays hors UE"]]}
];

/* Les trois anciennes questions multisélection sont décomposées en étapes Oui/Non. */
const flagTitles={
 storage:{temperature:"Faut-il indiquer des limites de température ?",humidity:"Faut-il indiquer des limites d'humidité ?",dry:"Faut-il conserver le produit au sec ?",sunlight:"Faut-il protéger le produit du soleil ?",fragile:"Le produit est-il fragile ?",pressure:"Faut-il indiquer des limites de pression atmosphérique ?"},
 substances:{latex:"Le produit contient-il du latex naturel ?",cmr:"Contient-il des substances CMR ou des perturbateurs endocriniens ?",med:"Contient-il une substance médicamenteuse ?",blood:"Contient-il des dérivés du sang ou du plasma humain ?",human:"Contient-il des matériaux biologiques d'origine humaine ?",animal:"Contient-il des matériaux biologiques d'origine animale ?",nano:"Contient-il des nanomatériaux ?"},
 instructions:{ifu:"Une notice d'utilisation est-elle prévue ?",electronic:"La notice est-elle électronique ?",warning:"Un avertissement doit-il apparaître directement sur l'étiquette ?",damaged:"Faut-il signaler le risque d'utilisation si l'emballage est endommagé ?"}
};
const gateTitles={
 storage:["Des précautions particulières de stockage ou de manutention sont-elles nécessaires ?","Non, aucune précaution particulière","Oui"],
 substances:["Des substances ou matériaux nécessitent-ils une information particulière ?","Non, aucun de ces matériaux","Oui"],
 instructions:["Des informations d'utilisation ou avertissements particuliers sont-ils prévus ?","Oui, une notice ou des précautions","Non, aucune information particulière"]
};
for(const group of ["storage","substances","instructions"]){
 const index=Q.findIndex(q=>q.id===group),previous=Q[index],intro=gateTitles[group];
 const gate={id:group,s:previous.s,title:intro[0],help:previous.help,type:"single",options:group==="instructions"?[["yes",intro[1]],["none",intro[2]]]:[["none",intro[1]],["yes",intro[2]]]};
 const flags=previous.options.filter(o=>o[0]!=="none").map(option=>({id:group+"_"+option[0],s:previous.s,title:flagTitles[group][option[0]],help:option[2]||previous.help,type:"single",when:a=>a[group]==="yes",options:[["no","Non"],["yes","Oui"]]}));
 Q.splice(index,1,gate,...flags);
}
const likely={status:"market",territory:"eu",support:"unit",pack:"one",carrier:"one",class:"iia",ce:"notready",manufacturer:"eu",import:"no",implant:"no",reuse:"single",patient:"multiple",reprocess:"clean",sterile:"nonsterile",nonsterilevariants:"no",fluidpath:"no",sterilmethod:"eo",barrier:"single",resterilize:"no",expiry:"no",tracking:"lot",electronic:"no",space:"medium",language:"fr"};
for(const q of Q){const i=q.options.findIndex(o=>o[0]===likely[q.id]);if(i>0)q.options.unshift(q.options.splice(i,1)[0]);}


const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

let answers={},position=0,finished=false,editing=false;
function applicable(){
 return Q.filter(q=>(answers.territory!=="outside"||["status","territory"].includes(q.id))&&(!q.when||q.when(answers)));
}
function completed(q){const val=answers[q.id];return typeof val==="string"&&q.options.some(o=>o[0]===val);}
function migrateMultiple(){
 for(const group of ["storage","substances","instructions"]){
  if(!Array.isArray(answers[group]))continue;
  const values=answers[group],selected=values.filter(x=>x!=="none");
  if(!values.length||(values.includes("none")&&selected.length)){
   delete answers[group];
   for(const flag of Object.keys(flagTitles[group]))delete answers[group+"_"+flag];
   continue;
  }
  answers[group]=selected.length?"yes":"none";
  for(const flag of Object.keys(flagTitles[group]))answers[group+"_"+flag]=selected.includes(flag)?"yes":"no";
 }
}
function sanitize(){
 migrateMultiple();
 let changed=false;
 for(const id of Object.keys(answers)){
  const q=Q.find(q=>q.id===id),value=answers[id];
  if(!q){delete answers[id];changed=true;continue;}
  if(q.type==="multi"&&Array.isArray(value)){
   const list=[...new Set(value.filter(v=>q.options.some(o=>o[0]===v)))];
   const clean=list.includes("none")&&list.length>1?[]:list;
   if(clean.length)answers[id]=clean;else delete answers[id];
   if(JSON.stringify(value)!==JSON.stringify(clean))changed=true;
  }else if(q.type==="multi"||typeof value!=="string"||!q.options.some(o=>o[0]===value)){
   delete answers[id];changed=true;
  }
 }
 for(let pass=0;pass<Q.length;pass++){
  const ids=new Set(applicable().map(q=>q.id)),unused=Object.keys(answers).filter(id=>!ids.has(id));
  if(!unused.length)break;
  for(const id of unused)delete answers[id];changed=true;
 }
 return changed;
}
try{
 const saved=JSON.parse(sessionStorage.getItem(STORE)||"{}");
 if(saved&&saved.answers&&typeof saved.answers==="object"&&!Array.isArray(saved.answers)){
  answers=saved.answers;position=Number.isInteger(saved.position)?saved.position:0;
  finished=saved.finished===true;editing=saved.editing===true;
 }
}catch(_){}
sanitize();
function store(){try{sessionStorage.setItem(STORE,JSON.stringify({answers,position,finished,editing}));}catch(_){}}
function current(){const qs=applicable();position=Math.max(0,Math.min(qs.length-1,position));return qs[position];}
function focusView(){const heading=root.querySelector("h1");if(heading){heading.tabIndex=-1;heading.focus?.({preventScroll:true});}}
function optionMarkup(q,option) {
 const value=option[0],label=option[1],sel=answers[q.id]===value;
 return '<button type="button" class="answer label-option" data-choice="'+escapeHTML(value)+'" aria-pressed="'+sel+'"><div class="answer-copy">'+escapeHTML(label)+'</div></button>';
}
function choiceNotes(q){const seen=new Set([q.help]);const notes=q.options.filter(o=>o[2]&&!seen.has(o[2])&&seen.add(o[2])).map(o=>'<li><strong>'+escapeHTML(o[1])+'</strong><p>'+escapeHTML(o[2])+'</p></li>').join('');return notes?'<strong>Précisions sur les choix</strong><ul>'+notes+'</ul>':'';}
function showQuestion(){
 const q=current(),qs=applicable(),pct=Math.round(Math.max(0,Q.findIndex(item=>item.id===q.id))/Q.length*100);
 root.innerHTML='<div class="question-progress"><span>'+escapeHTML(q.s)+' · Étiquette MDR <b>Question '+(position+1)+' / '+qs.length+'</b></span><progress max="100" value="'+pct+'" aria-label="Progression"></progress></div>'
 +'<section class="question-card"><div class="question-prompt"><div class="question-heading"><h1 id="question-title" tabindex="-1">'+escapeHTML(q.title)+'</h1>'
 +'<details class="info-bubble"><summary aria-label="Comprendre cette question">i</summary><div><strong>Pourquoi cette question ?</strong><p>'+escapeHTML(q.help)+'</p>'+choiceNotes(q)+'</div></details></div>'+'</div>'
 +'<div class="label-options">'+q.options.map(o=>optionMarkup(q,o)).join("")+'</div></section>'
 +'<div class="question-controls label-controls"><button class="tool-button" data-action="back" type="button" '+(position===0?"disabled":"")+'>← Précédent</button>'
 +'<div class="label-controls-right">'+'<button class="tool-button quiet" data-action="reset" type="button">Reprendre à zéro</button></div></div>';
}
function advance(q){
 sanitize();const qs=applicable(),missing=qs.findIndex(item=>!completed(item)),at=qs.findIndex(item=>item.id===q.id);
 if(editing){if(missing<0){finished=true;editing=false;}else position=missing;}
 else if(at>=qs.length-1){if(missing<0)finished=true;else position=missing;}
 else position=at+1;
 store();render();focusView();window.scrollTo?.({top:0,behavior:"instant"});
}
function next(){const q=current();if(completed(q))advance(q);}
function selectChoice(value){
 const q=current();if(!q.options.some(o=>o[0]===value))return;
 answers[q.id]=value;advance(q);
}
function listContains(group,flag){
 if(!flagTitles[group])return false;
 if(flag==="none")return answers[group]==="none";
 return answers[group]==="yes"&&answers[group+"_"+flag]==="yes";
}

function conclusions(at=new Date()){
 sanitize();
 /* Deux niveaux distincts : exigences MDR pour l'information, symboles ISO utilisables pour la représenter.
  * Les PNG illustrent les mentions et ne constituent pas une étiquette prête à imprimer.
  */
 const required=[],conditional=[],review=[];
 const add=(target,code,title,detail,source,tag)=>target.push({code,title,detail,source:source||"",tag:tag||""});
 const r=(code,title,detail,source,tag)=>add(required,code,title,detail,source,tag);
 const c=(code,title,detail,source,tag)=>add(conditional,code,title,detail,source,tag);
 const v=(title,detail,blocking=false)=>{add(review,"!",title,detail,"Contrôle");review[review.length-1].blocking=blocking;};
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
 if(!isEU){
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
  c("5.1.1","Identification du fabricant sur le dispositif","Examiner la place et la faisabilité des coordonnées sur le dispositif ; prévoir les informations complètes sur le conditionnement lorsque nécessaire.",mdr+" annexe I, 23.1(b) et 23.2(c)","Support");
  v("Répartition des informations","Cette vue du marquage direct ne remplace pas l’étiquette complète : vérifier séparément les coordonnées, dates, précautions et mentions d’usage sur le dispositif ou le conditionnement approprié.");
 }

 if(custom&&label)r("Texte","Mention « dispositif sur mesure »","Mention spécifique requise ; les conditions de l'annexe XIII doivent être vérifiées.",mdr+" annexe I, 23.2(p), annexe XIII","Mention");
 if(investigation)r("Texte","Exclusivement pour des investigations cliniques","Mention à apposer selon le libellé réglementaire du MDR, annexe I, 23.2(q). En langage courant : « exclusivement pour des études cliniques ». Pas de CE commercial présumé.",mdr+" annexe I, 23.2(q)","Mention");
 if(draft)v("Produit en développement","Ne pas faire apparaître de marquage CE ou d'UDI commercial non attribué sur une étiquette de prototype.");
 if(custom||investigation)v("Procédure particulière","Vérifier l'étiquetage et la documentation spécifiques aux dispositifs sur mesure ou aux investigations cliniques ; le régime commercial standard ne s'applique pas automatiquement.");

 if(market&&isEU){
  if(market&&a.ce==="ce-alone"&&a.class==="i"&&!sterile)r("CE","Marquage CE","Ne l'apposer qu'après achèvement de la procédure de conformité applicable. Utiliser le graphisme réglementaire officiel.",mdr+" articles 20 et 52, annexe V","Marquage");
  else if(market&&a.ce==="ce-nb"&&a.class!=="i")r("CE + ON","CE et numéro d'organisme notifié","Confirmer le numéro de l'ON et sa participation à la procédure de conformité, sans l'inférer automatiquement de la classe.",mdr+" articles 20 et 52, annexe V","Marquage");
  else if(a.ce==="notready")v("Marquage CE non autorisé","La procédure de conformité n'est pas achevée : ne pas imprimer le CE.",true);
  if(label)r("UDI (AIDC + HRI)","Code UDI — AIDC + HRI","Placer un identifiant UDI attribué avec sa représentation lisible par machine et par l'homme suivant l'entité d'attribution et les exemptions applicables ; le Basic UDI-DI n'est pas imprimé.",mdr+" article 27 ; annexe VI, partie C","Traçabilité");
  if(a.carrier==="multiple"&&label)c("5.7.10","Pictogramme UDI (facultatif)","Le symbole 5.7.10 permet de repérer le support UDI en présence de plusieurs supports de données ; il ne constitue pas le support UDI lui-même.",iso+" 5.7.10","Symbole");
 }

 if(label&&!draft){
  if(trackingLot)r("5.1.5","Numéro de lot (LOT)","La valeur LOT doit être cohérente avec la production et l'UDI-PI applicable.",mdr+" annexe I, 23.2(g) ; "+iso+" 5.1.5","Traçabilité");
  if(trackingSerial)r("5.1.7","Numéro de série (SN)","La valeur SN doit être cohérente avec la production et l'UDI-PI applicable.",mdr+" annexe I, 23.2(g) ; "+iso+" 5.1.7","Traçabilité");
  if(sterilePack){
   r("5.1.3","Date de fabrication (mois/année)","Information propre à l'emballage maintenant l'état stérile, même si une péremption est indiquée.",mdr+" annexe I, 23.3(h)","Date");
   r("5.1.4","Date limite d'utilisation (année/mois minimum)","L'emballage stérile doit indiquer la limite d'utilisation ou d'implantation sûre.",mdr+" annexe I, 23.3(i)","Date");
   if(a.expiry==="no")v("Date limite manquante pour l'emballage stérile","La réponse « aucune date limite » ne satisfait pas la liste d'informations prévue à l'annexe I, 23.3(i).",true);
  }else if(a.expiry==="yes"){
   r("5.1.4","Date limite d'utilisation","Indiquer la date limite déterminée par les données de durée de vie et la stabilité.",mdr+" annexe I, 23.2(i)","Date");
  }else{
   r("5.1.3","Date de fabrication","En l'absence de limite d'utilisation renseignée, la date de fabrication doit être identifiable.",mdr+" annexe I, 23.2(j)","Date");
  }
  c("5.1.6","Référence catalogue (REF)","À utiliser pour identifier la référence catalogue. Ne pas confondre avec le numéro de modèle (symbole 5.1.10) ni avec l’UDI.",iso+" 5.1.6","Identification");
 }else if(draft&&label){
  c("5.1.6","Référence du prototype","Utiliser une référence interne et une révision documentée, sans la présenter comme UDI-DI.",iso+" 5.1.6","Identification");
 }

 if(a.implant==="active"&&!trackingSerial)v("Implant actif : numéro de série requis","Un dispositif actif implantable doit être identifié par un numéro de série sur l’étiquette. Corriger le choix lot / série ; pour un dispositif commercial MDR, la série entre aussi dans l’UDI-PI.",true);
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
   if(reused&&a.reprocess==="sterilize")v("Incompatibilité entre réutilisation et restérilisation","Vous avez prévu une stérilisation entre utilisations mais déclaré « ne pas restériliser ». Ne pas proposer le symbole 5.2.6 avant correction.",true);
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
  if(sterilePack)v("Support incohérent avec l'état déclaré","Un conditionnement maintenant la stérilité ne peut pas correspondre à un dispositif déclaré fourni non stérile.",true);
 }

 if(a.reuse==="single"&&label&&!draft)r("5.4.2","À usage unique — ne pas réutiliser","L'indication d'usage unique est requise si le dispositif est conçu pour une seule procédure sur un patient.",mdr+" annexe I, 23.2(n) ; "+iso+" 5.4.2","Utilisation");
 if(reused){
  if(a.patient==="same"&&label)c("5.4.12","Un seul patient, plusieurs utilisations","Adapté uniquement au matériel réutilisable sur un même patient, et non sur plusieurs patients.",iso+" 5.4.12","Utilisation");
  if(a.reprocess==="none"&&a.patient==="multiple")v("Retraitement entre patients à justifier","Le dispositif est déclaré réutilisable sur plusieurs patients sans retraitement entre les utilisations : évaluer la sécurité et la justification technique.");
  if(reprocessed)c("Notice","Instructions de retraitement","Documenter les procédés validés, limites de cycles et critères de fin de vie du dispositif.",mdr+" annexe I, 23.4(n)","Notice");
  else c("Notice","Instructions de réutilisation","Préciser les conditions d’utilisation répétée et les critères de fin de vie, sans présumer d’un retraitement non déclaré.",mdr+" annexe I, 23.4(n)","Notice");
  if(a.reuse==="limited")c("Notice","Nombre maximal de réutilisations","La limite validée doit être portée dans la documentation et communiquée à l'utilisateur.",mdr+" annexe I, 23.4(n)","Notice");
  if(market&&isEU&&reprocessed){
   const directRequired=a.implant!=="no"||!["i","is"].includes(a.class)||at>=new Date("2027-05-26T00:00:00Z");
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
  if(listContains("instructions","ifu")||listContains("instructions","electronic"))r("5.4.3","Consulter les instructions d’utilisation","Une notice est prévue ; le symbole ISO 15223-1 5.4.3 peut être utilisé pour y renvoyer. Le pictogramme n’est pas imposé dans tous les cas.",iso+" 5.4.3","Notice");
  if(listContains("instructions","warning"))r("5.4.4","Attention et avertissements particuliers","La nature et le placement des avertissements doivent venir de l'analyse de risques, le pictogramme seul ne remplace pas le texte nécessaire.",mdr+" annexe I, 23.2(m) ; "+iso+" 5.4.4","Sécurité");
  if(listContains("instructions","damaged")&&!sterilePack)c("5.2.8","Emballage endommagé : consulter la notice","À envisager si l'intégrité de l'emballage conditionne l'utilisation sûre du produit.",iso+" 5.2.8","Emballage");
 }
 if(listContains("instructions","electronic"))v("Notice électronique","Vérifier l'éligibilité au régime de notice électronique avant de supprimer toute notice papier.");
 /* IEC 60601-1 / IEC 60417, IEC 60529, DEEE et piles :
  * les graphismes de ces autres référentiels ne sont PAS redessinés.
  * Le code seul signale l'information ou le symbole exact à rechercher.
  * Chaque marquage est indépendant des symboles ISO 15223-1.
  */
 if(a.electronic==="yes"){
  const onDevice=isDevice;
  const placement=(code,title,detail,source,tag,requiredOnDevice=false)=>{
   if(onDevice&&requiredOnDevice)r(code,title,detail,source,tag);
   else c(code,title,detail,source,tag);
  };
  if(market&&a.elec_weee==="yes"){
   placement("DEEE","Collecte séparée — poubelle sur roues barrée",
    "Directive 2012/19/UE, annexe IX : marquage permanent normalement sur l'équipement. L'emballage ne peut le remplacer que lorsque les dimensions ou la fonction du produit l'imposent. Vérifier les exclusions et l'identification du producteur.",
    "Directive 2012/19/UE, articles 14(4) et 15(2), annexe IX","Environnement",true);
   if(!onDevice)v("Poubelle barrée à prévoir sur le dispositif","Le support choisi est un emballage : la poubelle DEEE doit normalement se trouver directement sur l'équipement, sauf exception réglementaire. Ne pas considérer l'étiquette de la boîte comme suffisante.");
  }
  if(a.elec_battery==="yes"){
   c("BAT-DEEE","Collecte séparée de la pile / batterie",
    "La poubelle barrée des batteries doit être portée sur la batterie selon les règles de taille et de présentation ; les exceptions permettent dans certains cas son report sur l'emballage. Vérifier les mentions Cd/Pb si seuils dépassés.",
    "Règlement (UE) 2023/1542, article 13(4–5), annexe VI, partie B","Environnement");
   v("Marquages et information de la batterie","Examiner séparément la batterie, son emballage et la documentation. Les obligations batteries ne se résument pas au pictogramme du produit complet.");
  }
  if(a.elec_ip==="yes"){
   const ip={
    ip20:"IP20",ip21:"IP21",ip22:"IP22",ip44:"IP44",ip54:"IP54",
    ip55:"IP55",ip65:"IP65",ip67:"IP67",ip68:"IP68",ipx4:"IPX4",ipx7:"IPX7"
   }[a.elec_ip_value];
   placement(ip||"IP","Indice de protection "+(ip||"IP documenté"),
    "Mention technique selon IEC 60529 : reporter uniquement la valeur justifiée dans le dossier d'essais, sur l'enveloppe ou la documentation au support pertinent.",
    "IEC 60529, codification IP","Protection",true);
   if(!ip)v("Indice IP à reporter","L'indice retenu est différent des valeurs proposées. Reporter la valeur exacte vérifiée : ne pas imprimer seulement « IP ».");
  }
  if(a.elec_60601==="yes"){
   if(a.elec_insulation==="class2")placement("IEC 60417-5172","Classe II — double isolation",
    "Symbole du double carré à employer seulement si les exigences de classe II de la sécurité électrique sont satisfaites.",
    "IEC 60417-5172 ; IEC 60601-1","Sécurité électrique",true);
   if(a.elec_insulation==="class1")placement("IEC 60417-5019","Terre de protection (si borne à identifier)",
    "La classe I requiert une protection par terre. Le symbole IEC 60417-5019 identifie la borne de protection lorsqu'une telle borne est présente, pas la classe I en général.",
    "IEC 60417-5019 ; IEC 60601-1","Sécurité électrique");
   const applied={
    b:["IEC 60417-5840","Partie appliquée type B"],
    bf:["IEC 60417-5333","Partie appliquée type BF"],
    cf:["IEC 60417-5335","Partie appliquée type CF"]
   };
   const defib={
    b:["IEC 60417-5841","Partie appliquée B protégée défibrillation"],
    bf:["IEC 60417-5334","Partie appliquée BF protégée défibrillation"],
    cf:["IEC 60417-5336","Partie appliquée CF protégée défibrillation"]
   };
   const appliedSymbol=a.elec_defib==="yes"?defib[a.elec_applied]:applied[a.elec_applied];
   if(appliedSymbol){
    placement(appliedSymbol[0],appliedSymbol[1],
      "Marquage selon le type de partie appliquée et sa résistance éventuelle aux décharges. À positionner au niveau du connecteur ou sur la partie appliquée conformément aux dispositions de l'IEC 60601-1.",
      "IEC 60601-1, 7.2.10 ; "+appliedSymbol[0],"Sécurité électrique",true);
   }
  }
  if(a.elec_manual==="yes")placement("IEC 60417-1641","Lire impérativement le manuel",
   "Le symbole « Operating manual » exprime une obligation de lecture pour la sécurité ; distinct du symbole ISO 15223-1, 5.4.3, qui invite à consulter la notice.",
   "IEC 60417-1641","Information",true);
  if(a.elec_supply==="yes")placement("Alim.","Caractéristiques nominales d'alimentation",
   "Reporter les valeurs réelles d'entrée ou d'alimentation selon la norme applicable (V, A/W, AC ou DC, Hz si pertinent). Aucun chiffre n'est fourni automatiquement.",
   "IEC 60601-1, 7.2 / autre norme de sécurité applicable","Sécurité électrique",true);
  if(a.elec_indoor==="yes")placement("IEC 60417-5957","Utilisation en intérieur uniquement",
   "Symbole à retenir lorsque les conditions d'utilisation et la norme de sécurité demandent explicitement cette indication.",
   "IEC 60417-5957","Sécurité électrique",true);
 }
 if(a.pack==="multiple"&&market)v("Niveaux commerciaux de conditionnement","Examiner séparément l'UDI-DI et l'étiquette de chaque niveau de commercialisation, en excluant les conteneurs purement logistiques.");
 if(["tiny","small"].includes(a.space))v("Place réduite pour les marquages","Vérifier la lisibilité des symboles, des caractères et de l'UDI après impression. Une surface réduite ne dispense pas automatiquement des mentions obligatoires.");
 if(["eu","other"].includes(a.language))v("Langues applicables","Vérifier les exigences linguistiques des États membres ciblés et, le cas échéant, celles des pays hors UE.");
 if(a.ce==="ce-alone"&&["is","iia","iib","iii"].includes(a.class))v("CE / organisme notifié : déclaration incohérente","La classe ou les caractéristiques déclarées demandent une vérification de la procédure et du numéro d'organisme notifié.",true);
 if(a.ce==="ce-nb"&&a.class==="i")v("Classe I et organisme notifié","Vérifier pourquoi un organisme notifié intervient, ou corriger la classification.",true);
 if(a.class==="i"&&sterile&&market)v("Classe I stérile","Vérifier si la classification doit être Is et si un organisme notifié doit intervenir pour les aspects liés à la stérilité.",true);
 if(market&&a.implant==="active"&&a.class!=="iii")v("Implant actif : classe à vérifier","Le statut d’implant actif est incohérent avec la classe déclarée : revoir la classification avant de finaliser les marquages.",true);
 if(market&&a.implant==="passive"&&["i","is"].includes(a.class))v("Implant et classe I à vérifier","Vérifier la classification du dispositif implantable avant de retenir les obligations liées à la classe I.",true);
 if(a.import==="yes"&&isEU&&label)c("5.1.8","Importateur","Coordonnées requises par l'article 13(3), qui peuvent figurer sur le dispositif, son emballage ou un document d'accompagnement ; pas nécessairement sur cette étiquette.",mdr+" article 13(3) ; "+iso+" 5.1.8","Opérateur");

 const unique=items=>items.filter((x,i)=>items.findIndex(y=>y.code===x.code&&y.title===x.title)===i);
 return {required:unique(required),conditional:unique(conditional),review:unique(review)};
}
/* Les PNG ISO source proviennent du document fourni ; CE, MD et UDI sont fournis séparément.
 * Correspondance stricte par numéro de symbole : aucun remplacement inventé.
 * Les mentions UDI et textuelles sans fichier restent textuelles.
 */
const isoSymbolCodes=new Set("5.1.1 5.1.2 5.1.3 5.1.4 5.1.5 5.1.6 5.1.7 5.1.8 5.1.9 5.1.10 5.1.11 5.2.1 5.2.2 5.2.3 5.2.4 5.2.5 5.2.6 5.2.7 5.2.8 5.2.9 5.2.10 5.2.11 5.2.12 5.2.13 5.2.14 5.3.1 5.3.2 5.3.3 5.3.4 5.3.5 5.3.6 5.3.7 5.3.8 5.3.9 5.4.1 5.4.2 5.4.3 5.4.4 5.4.5 5.4.6 5.4.7 5.4.8 5.4.9 5.4.10 5.4.11 5.4.12 5.5.1 5.5.2 5.5.3 5.5.4 5.5.5 5.5.6 5.7.7 5.7.10".split(" "));
function symbolImage(code,reference=false){
 // Poubelle DEEE : fichier graphique européen existant, non redessiné (Wikimedia Commons, PD-ineligible).
 if(code==="DEEE")return '<img class="label-symbol-img'+(reference?' label-symbol-small':'')+'" src="https://upload.wikimedia.org/wikipedia/commons/a/a9/WEEE.svg" alt="" aria-hidden="true" width="'+(reference?36:44)+'" height="'+(reference?36:44)+'" loading="lazy" decoding="async">';
 const asset=(code==="CE"||code==="CE + ON")?"CE":isoSymbolCodes.has(code)?code:null;
 if(!asset)return "";
 return '<img class="label-symbol-img'+(reference?' label-symbol-small':'')+'" src="symboles-iso/'+asset+'.png?v=2" alt="" aria-hidden="true" width="'+(reference?36:44)+'" height="'+(reference?36:44)+'" decoding="async">';
}
function symbolRef(code) {
 if(/^\d+\.\d+\.\d+$/.test(code))return "ISO " + code;
 return code==="Texte"?"Texte":code==="MDR"?"MDR":code==="Notice"?"Notice":code;
}
function renderShortList(items) {
 if(!items.length)return '<p class="label-empty">Aucun élément proposé pour ce périmètre.</p>';
 return '<ul class="label-symbol-grid">'+items.map(it=>{
  const image=symbolImage(it.code);
  const textMark=it.code==='Texte'&&/^Nom /.test(it.title)?'Nom':it.code==='UDI (AIDC + HRI)'?'Code UDI':it.code==='UDI direct'?'UDI direct':it.code==='Notice'?'Notice':/^(IP(?:[0-9X]+)?|DEEE|BAT-DEEE|Alim\.|IEC 60417-\d+)$/.test(it.code)?(it.code.startsWith('IEC')?'IEC':it.code==='BAT-DEEE'?'BAT':it.code):'Texte';
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
let pdfURL=null;
function pdfSummary(){
 const result=conclusions(),support=Q.find(q=>q.id==="support")?.options.find(o=>o[0]===answers.support)?.[1]||"Étiquette médicale";
 const sections=[
  {title:"À prévoir",items:result.required.map(item=>({text:item.title+" — "+symbolRef(item.code)}))}
 ];
 if(answers.status==="investigation")sections.push({title:"Études cliniques",items:[{text:"Libellé MDR : exclusivement pour des investigations cliniques. Expression usuelle : exclusivement pour des études cliniques."}]});
 if(result.conditional.length)sections.push({title:"Selon votre dispositif",items:result.conditional.map(item=>({text:item.title+" — "+symbolRef(item.code)}))});
 if(result.review.length)sections.push({title:"À vérifier",items:result.review.map(item=>({text:item.title+(item.blocking?" (à corriger)":"")}))});
 sections.push({title:"Sources",items:[{text:"MDR 2017/745 · Annexe I et Annexe VI",url:"https://eur-lex.europa.eu/eli/reg/2017/745/oj"},{text:"ISO 15223-1:2021 · Symboles normalisés"}]});
 return {
  compact:true,title:"Étiquetage médical",date:new Date().toLocaleDateString("fr-FR"),
  outcome:answers.territory==="outside"?"Marché hors périmètre":support,
  note:"Présélection indicative. Les symboles ISO sont des références et non des fichiers imprimables. Vérifier le MDR, les restrictions des symboles et la lisibilité.",
  sections
 };
}
async function preparePDF(button){
 if(!button||!window.ORBIVIA_TOOL_PDF?.create)return;
 button.textContent="Préparation du PDF…";
 button.removeAttribute("href");
 try{
  const bytes=await window.ORBIVIA_TOOL_PDF.create(pdfSummary());
  if(!button.isConnected)return;
  if(pdfURL)URL.revokeObjectURL(pdfURL);
  pdfURL=URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}));
  button.href=pdfURL;
  button.download="ORBIVIA_etiquetage_medical_"+new Date().toISOString().slice(0,10)+".pdf";
  button.textContent="Télécharger la synthèse PDF";
  button.removeAttribute("aria-disabled");
 }catch(error){
  button.textContent="Réessayer l’export PDF";
  button.setAttribute("aria-disabled","true");
  console.error("Export PDF étiquetage indisponible",error);
 }
}
function summary(){
 const result=conclusions(),blockers=result.review.filter(it=>it.blocking);
 const supportName=Q.find(q=>q.id==="support")?.options.find(o=>o[0]===answers.support)?.[1]||"Support d'étiquette";
 const answersHTML=applicable().map(q=>{
 const val=answers[q.id],values=Array.isArray(val)?val:[val];
 const labels=values.map(v=>q.options.find(o=>o[0]===v)?.[1]||"Non renseigné").join(", ");
 return '<div><dt>'+escapeHTML(q.title)+'</dt><dd>'+escapeHTML(labels)+'</dd><button class="text-button" type="button" aria-label="Modifier la réponse : '+escapeHTML(q.title)+'" data-edit="'+escapeHTML(q.id)+'">Modifier</button></div>';
 }).join("");
 root.innerHTML=
 '<div class="label-result-heading label-summary-heading"><h1>'+(answers.territory==='outside'?'Marché hors périmètre':'À prévoir <span>'+result.required.length+'</span>')+'</h1><p class="label-result-support">'+escapeHTML(answers.territory==='outside'?'Exigences du pays de destination à établir':supportName)+'</p></div>'+(answers.status==='investigation'?'<p class="label-clinical-note"><strong>Études cliniques :</strong> « exclusivement pour des études cliniques »<small>Pour l’étiquette réglementaire MDR, utiliser la mention exacte : « exclusivement pour des investigations cliniques » (annexe I, 23.2(q)).</small></p>':'')+
 (blockers.length?'<p class="label-inconsistency" role="status">'+blockers.length+' point'+(blockers.length>1?'s':'')+' à corriger avant impression</p>':'')+
 '<section class="label-result-card label-main-grid">'+
 renderShortList(result.required)+'</section>'+
 (result.conditional.length?'<section class="label-result-card label-optional-symbols"><header><h2>Autres symboles à examiner</h2><span>'+result.conditional.length+' éléments</span></header>'+renderShortList(result.conditional)+'</section>':'')+
 (result.review.length?'<details class="label-result-card label-fold label-review"'+(blockers.length||answers.territory==='outside'?' open':'')+'><summary>À vérifier avant impression <span>'+result.review.length+'</span></summary>'+renderChecks(result.review)+'</details>':'')+
 '<section class="label-result-card label-additional">'+renderReferences(result)+
 '<details class="label-answers"><summary>Voir mes réponses au questionnaire</summary><dl>'+answersHTML+'</dl></details></section>'+
 '<p class="label-disclaimer">Synthèse d’aide à la conception, non une validation réglementaire. Vérifiez les exigences du MDR, les symboles ISO 15223-1 applicables et la lisibilité réelle avant impression.</p>'+
 '<div class="export-actions"><a class="tool-button primary" id="label-pdf-download" aria-disabled="true">Préparation du PDF…</a></div>'+
 '<div class="result-bottom"><button class="tool-button" type="button" data-action="back">← Modifier mes réponses</button>'+
 '<button class="tool-button quiet" type="button" data-action="reset">Reprendre à zéro</button></div>';
 preparePDF(root.querySelector("#label-pdf-download"));
}
// L'impression conserve les sections repliées sans changer l'état de lecture.
let printSections=[];
window.addEventListener?.('beforeprint',()=>{printSections=[...root.querySelectorAll('details.label-fold, details.label-details')].map(el=>[el,el.open]);for(const [el] of printSections)el.open=true;});
window.addEventListener?.('afterprint',()=>{for(const [el,open] of printSections)el.open=open;printSections=[];});
function render(){
 if(finished){const missing=applicable().findIndex(q=>!completed(q));if(missing>=0){finished=false;position=missing;store();}}
 document.body?.classList.toggle("is-question",!finished);document.body?.classList.toggle("is-result",finished);
 if(finished)summary();else showQuestion();
}
function reset(){const d=document.getElementById("restart-label-dialog");if(d&&typeof d.showModal==="function")d.showModal();else if(confirm("Effacer toutes les réponses de ce questionnaire ?"))doReset();}
function doReset(){answers={};position=0;finished=false;editing=false;store();render();}
root.addEventListener("click",event=>{
 const edit=event.target.closest("[data-edit]");if(edit&&root.contains(edit)){const at=applicable().findIndex(q=>q.id===edit.dataset.edit);if(at>=0){position=at;finished=false;editing=true;store();render();focusView();window.scrollTo?.({top:0,behavior:"instant"});}return;}
 const pdfRetry=event.target.closest("#label-pdf-download");
 if(pdfRetry&&!pdfRetry.hasAttribute("href")){event.preventDefault();preparePDF(pdfRetry);return;}
 const choice=event.target.closest("[data-choice]");if(choice&&root.contains(choice)){selectChoice(choice.dataset.choice);return}
 const button=event.target.closest("[data-action]");if(!button)return;
 switch(button.dataset.action){
 case "next":next();break;
 case "back":if(finished){root.querySelector(".label-answers")?.setAttribute("open","");root.querySelector(".label-answers")?.scrollIntoView?.({block:"start",behavior:"smooth"});}else{position=Math.max(0,position-1);store();render();}break;
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
