/* ORBIVIA V4 — Modèles de dossiers, non assimilables à une checklist réglementaire exhaustive. */
(function(){
"use strict";
const folders=[
 ["DT01","01_Description_et_destination","Description et destination","mdr"],
 ["DT02","02_Conception_et_fabrication","Conception et fabrication","mdr"],
 ["DT03","03_Gestion_des_risques","Gestion des risques","mdr"],
 ["DT04","04_Exigences_et_normes","Exigences et normes","mdr"],
 ["DT05","05_Verification_et_validation","Vérification et validation","mdr"],
 ["DT06","06_Evaluation_clinique","Évaluation clinique","mdr"],
 ["DT07","07_Etiquetage_et_notice","Étiquetage et notice","mdr"],
 ["DT08","08_Surveillance_apres_commercialisation","Surveillance après commercialisation","mdr"],
 ["DT09","09_Declaration_et_rapports","Déclarations et rapports","mdr"],
 ["SMQ01","SMQ/01_Organisation_et_qualite","Organisation et qualité","smq"],
 ["SMQ02","SMQ/02_Maitrise_documentaire","Maîtrise documentaire","smq"],
 ["SMQ03","SMQ/03_Conception_et_developpement","Conception et développement","smq"],
 ["SMQ04","SMQ/04_Achats_et_fournisseurs","Achats et fournisseurs","smq"],
 ["SMQ05","SMQ/05_Production_et_validation","Production et validation","smq"],
 ["SMQ06","SMQ/06_Surveillance_et_amelioration","Surveillance et amélioration","smq"]
].map(function(a){return {id:a[0],path:a[1],title:a[2],scope:a[3]};});
const expected=[
 ["DT-DES-01","DT01","Destination prévue et description du dispositif","MDR annexe II, 1","Destination et utilisateurs prévus|Principe et performances revendiquées|Versions, modèles et accessoires"],
 ["DT-DES-02","DT01","Spécifications et variantes","MDR annexe II, 1","Versions et variantes identifiées|Caractéristiques techniques cohérentes|Interfaces et accessoires décrits"],
 ["DT-CON-01","DT02","Plan de conception et développement","MDR annexe II, 3 ; ISO 13485 §7.3","Étapes, livrables et responsables définis|Revues, vérifications et validations planifiées|Modifications suivies"],
 ["DT-CON-02","DT02","Entrées et sorties de conception","MDR annexe II, 3 ; ISO 13485 §7.3","Exigences utilisateur et réglementaires identifiées|Exigences mesurables et approuvées|Lien entre entrées et sorties"],
 ["DT-CON-03","DT02","Dossier de fabrication et transfert","MDR annexe II, 3","Plans et nomenclatures identifiés|Procédés et sous-traitants décrits|Transfert en production documenté"],
 ["DT-RIS-01","DT03","Plan de gestion des risques","MDR annexe I, 3 ; ISO 14971 si applicable","Méthode et critères définis|Responsabilités et étapes prévues|Périmètre du cycle de vie couvert"],
 ["DT-RIS-02","DT03","Analyse et évaluation des risques","MDR annexe I, 3 ; ISO 14971 si applicable","Dangers et situations dangereuses identifiés|Estimation et acceptabilité justifiées|Mesures de maîtrise et vérification tracées"],
 ["DT-RIS-03","DT03","Rapport de gestion des risques","MDR annexe I, 3 ; ISO 14971 si applicable","Risques résiduels évalués|Bénéfice/risque examiné le cas échéant|Conclusion et approbation identifiées"],
 ["DT-REG-01","DT04","Qualification et classification MDR","MDR annexe VIII","Destination réglementaire documentée|Règles et exceptions examinées|Conclusion justifiée et revue"],
 ["DT-REG-02","DT04","Matrice des exigences générales (GSPR)","MDR annexe I ; annexe II, 4","Applicabilité motivée par exigence|Méthodes de démonstration et normes retenues|Renvois précis vers preuves et révisions"],
 ["DT-REG-03","DT04","Liste maîtrisée des normes et spécifications","MDR annexe II, 4","Champ et édition de chaque norme vérifiés|Normes retenues ou exclues justifiées|Écarts aux normes identifiés"],
 ["DT-VAL-01","DT05","Plan et protocoles de vérification","MDR annexe II, 6","Exigences vérifiées identifiées|Critères d'acceptation définis|Versions et configurations d'essai décrites"],
 ["DT-VAL-02","DT05","Rapports de vérification et validation","MDR annexe II, 6","Résultats et écarts consignés|Traçabilité aux exigences|Conclusion sur les critères d'acceptation"],
 ["DT-VAL-03","DT05","Dossier de sécurité électrique / CEM","MDR annexe II, 6 ; normes retenues","Justification d'applicabilité|Configurations représentatives testées|Rapports et non-conformités suivis"],
 ["DT-VAL-04","DT05","Dossier logiciel et cybersécurité","MDR annexe I, 17 ; normes retenues","Architecture et versions maîtrisées|Analyse des risques et vérifications logicielles|Justification de la cybersécurité si pertinente"],
 ["DT-VAL-05","DT05","Évaluation biologique / matériaux","MDR annexe I, 10 ; normes retenues","Nature et durée des contacts déterminées|Risques liés aux matériaux évalués|Preuves et conclusions justifiées"],
 ["DT-CLI-01","DT06","Plan d'évaluation clinique","MDR annexe XIV, partie A","Questions et critères cliniques définis|Données cliniques recherchées et analysées|Méthode de suivi des évolutions prévue"],
 ["DT-CLI-02","DT06","Rapport d'évaluation clinique","MDR annexe II, 6.1 ; annexe XIV","Données critiques et limites discutées|Lien avec destination et revendications|Conclusion bénéfice/risque argumentée"],
 ["DT-LAB-01","DT07","Étiquettes, notice et informations","MDR annexe I, chapitre III","Versions des étiquettes et notice conservées|Avertissements et usages cohérents|Langues et traçabilité vérifiées"],
 ["DT-PMS-01","DT08","Plan de surveillance après commercialisation","MDR annexe III","Méthodes de collecte et d'analyse décrites|Responsabilités et indicateurs définis|Lien avec risques et clinique"],
 ["DT-PMS-02","DT08","Enregistrements et rapports PMS","MDR annexe III ; art. 85–86","Données disponibles et tendances examinées|Décisions et actions traçables|Rapport approprié à la classe et au stade"],
 ["DT-DEC-01","DT09","Déclaration UE de conformité et traçabilité","MDR art. 19 ; annexe IV","Identité du fabricant et dispositif exacts|Conformité et procédures déclarées vérifiées|Signature et révision contrôlées"],
 ["SMQ-01","SMQ01","Manuel/processus et responsabilités SMQ","ISO 13485 §4–5","Périmètre du SMQ défini|Interactions entre processus établies|Responsabilités documentées"],
 ["SMQ-02","SMQ02","Maîtrise des documents et enregistrements","ISO 13485 §4.2","Approbation et diffusion maîtrisées|Révisions et obsolescence suivies|Durées de conservation définies"],
 ["SMQ-03","SMQ03","Procédure de conception et développement","ISO 13485 §7.3","Entrées, sorties et revues prévues|Vérification et validation définies|Transfert et modifications contrôlés"],
 ["SMQ-04","SMQ04","Évaluation et surveillance des fournisseurs","ISO 13485 §7.4","Critères de sélection définis|Évaluations et suivi enregistrés|Achats et produits réceptionnés maîtrisés"],
 ["SMQ-05","SMQ05","Maîtrise de production et validation de procédés","ISO 13485 §7.5","Instructions et traçabilité adaptées|Équipements et moyens maîtrisés|Procédés spéciaux validés si nécessaires"],
 ["SMQ-06","SMQ06","Non-conformités et actions correctives","ISO 13485 §8.3 et §8.5","Écarts enregistrés et analysés|Actions et responsables définis|Efficacité des actions vérifiée"],
 ["SMQ-07","SMQ06","Programme et comptes rendus d'audits internes","ISO 13485 §8.2.4","Planification et impartialité définies|Constats documentés|Suites et vérification des actions enregistrées"],
 ["SMQ-08","SMQ01","Revues de direction","ISO 13485 §5.6","Entrées de revue définies|Décisions et ressources documentées|Actions et suivi consignés"]
].map(function(a){return {id:a[0],folder:a[1],title:a[2],ref:a[3],checks:a[4].split("|"),scope:a[0].startsWith("SMQ")?"smq":"mdr"};});
const conditional={"DT-VAL-03":["electric"],"DT-VAL-04":["software","connected","cloud","ai"],"DT-VAL-05":["contact","polymer","blood","implant","resp"]};
const app={
 folders:folders,expected:expected,
 folder:function(id){return folders.find(function(x){return x.id===id;});},
 entry:function(id){return expected.find(function(x){return x.id===id;});},
 path:function(entry){const f=this.folder(entry.folder);return (entry.scope==="mdr"?"Dossier_technique/":"")+f.path+"/"+entry.id;},
 ensure:function(p){
  if(!p.v4||typeof p.v4!=="object")p.v4={};
  if(!p.v4.reviews||typeof p.v4.reviews!=="object")p.v4.reviews={};
  if(!p.v4.links||typeof p.v4.links!=="object")p.v4.links={};
  if(!Array.isArray(p.v4.actions))p.v4.actions=[];
  return p.v4;
 },
 links:function(p,id){const v=this.ensure(p);return (v.links[id]||[]).filter(function(x){return df(p).documents.some(function(d){return d.id===x;});});},
 docs:function(p,id){const ids=new Set(this.links(p,id));return df(p).documents.filter(function(d){return ids.has(d.id);});},
 fingerprint:function(p,id){return this.docs(p,id).map(function(d){return [d.id,d.revision||"",d.hash||"",d.modified||0].join(":");}).sort().join("|");},
 recommend:function(p,id){
  const tags=conditional[id];if(!tags)return "general";
  const answers=window.ORBIVIA_NORMES_INFO?.answers?window.ORBIVIA_NORMES_INFO.answers(p):df(p).norms&&df(p).norms.answers||{};
  if(tags.some(function(tag){return answers[tag]==="yes";}))return "likely";
  if(tags.every(function(tag){return answers[tag]==="no";}))return "unlikely";
  return "unknown";
 },
 status:function(p,id){
  const r=this.ensure(p).reviews[id],documents=this.docs(p,id);
  if(r&&r.fingerprint!==this.fingerprint(p,id)&&["reviewed","na","gap"].includes(r.status))return "stale";
  if(r&&r.status==="na")return "na";
  if(r&&r.status==="gap")return "gap";
  if(r&&r.status==="reviewed")return "reviewed";
  if(documents.length)return "attached";
  const recommendation=this.recommend(p,id);
  return recommendation==="unlikely"?"scope":recommendation==="unknown"?"uncertain":"missing";
 },
 counts:function(p,scope){
  const rows=expected.filter(function(e){return !scope||e.scope===scope;}),out={total:rows.length,reviewed:0,attached:0,gap:0,missing:0,stale:0,na:0,scope:0,uncertain:0};
  for(const e of rows){const status=this.status(p,e.id);out[status]=(out[status]||0)+1;}
  return out;
 }
};
window.ORBIVIA_V4_DATA=app;
})();
