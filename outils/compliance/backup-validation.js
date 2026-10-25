/* Validation des sauvegardes, indépendante du navigateur et des moteurs réglementaires. */
(function(){
'use strict';
function validateBackup(obj){
 if(!obj||typeof obj!=='object')throw Error('Sauvegarde non reconnue.');
 if(obj.version!==1||!Array.isArray(obj.projects)||!obj.projects.length||obj.projects.length>200)throw Error('Sauvegarde non reconnue.');
 const ids=new Set();const record=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 function walk(v){if(!v||typeof v!=='object')return;for(const key of Object.keys(v)){if(['__proto__','constructor','prototype'].includes(key))throw Error('Clé non autorisée dans la sauvegarde.');walk(v[key])}}
 walk(obj);
 for(const p of obj.projects){if(!record(p)||typeof p.id!=='string'||!p.id||ids.has(p.id)||typeof p.name!=='string')throw Error('Projet invalide ou identifiant en doublon.');ids.add(p.id);for(const k of ['name','company','device','intended','patient','users','owner','stage'])if(p[k]!==undefined&&typeof p[k]!=='string')throw Error('Champ de projet invalide : '+k);
  for(const k of ['customTasks','procedures','requirements','risks','tests','docs','activity'])if(p[k]!==undefined&&(!Array.isArray(p[k])||p[k].some(v=>!record(v)||v.id!==undefined&&typeof v.id!=='string')))throw Error('Registre invalide : '+k);
  if(p.v4!==undefined){
   const v=p.v4;if(!record(v))throw Error('Dossier V4 invalide.');
   for(const key of ['reviews','links','journey'])if(v[key]!==undefined&&!record(v[key]))throw Error('Section V4 invalide : '+key);
   if(v.links&&Object.values(v.links).some(x=>!Array.isArray(x)||x.some(id=>typeof id!=='string')))throw Error('Rattachements V4 invalides.');
   if(v.actions!==undefined&&(!Array.isArray(v.actions)||v.actions.some(x=>!record(x)||typeof x.id!=='string'||typeof x.entry!=='string')))throw Error('Actions V4 invalides.');
   if(v.reviews&&Object.values(v.reviews).some(x=>!record(x)||x.checked!==undefined&&(!Array.isArray(x.checked)||x.checked.some(n=>!Number.isInteger(n)))))throw Error('Revues V4 invalides.');
   const j=v.journey;if(j){
    for(const key of ['answers','comments','drafts'])if(j[key]!==undefined&&!record(j[key]))throw Error('Parcours invalide : '+key);
    if(j.answers&&Object.values(j.answers).some(x=>!['present','partial','absent','checking','na'].includes(x)))throw Error('Disponibilité documentaire invalide.');
    if(j.comments&&Object.values(j.comments).some(x=>typeof x!=='string'))throw Error('Commentaires invalides.');
    if(j.queue!==undefined&&(!Array.isArray(j.queue)||j.queue.some(x=>typeof x!=='string')))throw Error('Reprise du parcours invalide.');
    if(j.drafts&&Object.values(j.drafts).some(x=>!record(x)||x.checked!==undefined&&(!Array.isArray(x.checked)||x.checked.some(n=>!Number.isInteger(n)))))throw Error('Brouillons invalides.');
   }
  }
  if(p.docflow!==undefined){const d=p.docflow;if(!record(d))throw Error('Dossier documentaire invalide.');for(const k of ['checks','features','classification','standardUse'])if(d[k]!==undefined&&!record(d[k]))throw Error('Section documentaire invalide : '+k);if(d.documents!==undefined&&(!Array.isArray(d.documents)||d.documents.some(x=>!record(x)||typeof x.id!=='string'||typeof x.title!=='string')))throw Error('Inventaire documentaire invalide.');for(const a of Object.values(d.checks||{})){if(!record(a)||!['pending','checking','present','partial','absent','na'].includes(a.presence)||a.documentIds!==undefined&&!Array.isArray(a.documentIds))throw Error('Réponse documentaire invalide.');for(const k of ['reference','location','finding','reviewer','action','owner','due','review'])if(a[k]!==undefined&&typeof a[k]!=='string')throw Error('Champ de réponse invalide : '+k);if(a.documentIds?.some(x=>typeof x!=='string'))throw Error('Référence documentaire invalide.');if(a.parts!==undefined&&(!record(a.parts)||Object.values(a.parts).some(v=>!record(v)||typeof v.presence!=='string'||v.note!==undefined&&typeof v.note!=='string')))throw Error('Éléments de preuve invalides.')}
   const q=d.classification?.questionnaire;if(q!==undefined&&(!record(q)||!record(q.answers)||Object.values(q.answers).some(x=>typeof x!=='string')))throw Error('Réponses de classification invalides.');if(q?.comments!==undefined&&(!record(q.comments)||Object.values(q.comments).some(x=>typeof x!=='string')))throw Error('Commentaires de classification invalides.');
  }
  const textFields=(value,fields,label)=>{for(const key of fields)if(value[key]!==undefined&&typeof value[key]!=='string')throw Error(label+' : '+key);};
  for(const r of Object.values(p.v4?.reviews||{}))textFields(r,['status','reviewer','method','finding','fingerprint','reviewedAt'],'Revue invalide');
  for(const r of Object.values(p.v4?.journey?.drafts||{}))textFields(r,['status','reviewer','method','finding','fingerprint'],'Brouillon invalide');
  for(const a of p.v4?.actions||[])textFields(a,['title','owner','due','status','createdAt'],'Action invalide');
  const norms=p.docflow?.norms;
  if(norms!==undefined){
   if(!record(norms))throw Error('Sélection normative invalide.');
   for(const key of ['answers','notes','decisions'])if(norms[key]!==undefined&&!record(norms[key]))throw Error('Normes invalides : '+key);
   if(Object.values(norms.answers||{}).some(a=>!['yes','no','checking'].includes(a)))throw Error('Réponse normative invalide.');
   if(Object.values(norms.notes||{}).some(a=>typeof a!=='string'))throw Error('Commentaire normatif invalide.');
   for(const d of Object.values(norms.decisions||{})){
    if(!record(d)||d.status!==undefined&&!['review','retained','excluded'].includes(d.status))throw Error('Décision normative invalide.');
    textFields(d,['status','edition','reason'],'Décision normative invalide');
   }
   textFields(norms,['view','filter','family','query','cursor','confirmedBasis'],'Sélection normative invalide');
  }
  const matrix=p.docflow?.gsprMatrix;
  if(matrix!==undefined){
   if(!record(matrix)||matrix.entries!==undefined&&!record(matrix.entries)||matrix.drafts!==undefined&&!record(matrix.drafts))throw Error('Matrice MDR invalide.');
   textFields(matrix,['search','filter','chapter'],'Matrice MDR invalide');
   for(const e of [...Object.values(matrix.entries||{}),...Object.values(matrix.drafts||{})]){
    if(!record(e))throw Error('Revue MDR invalide.');
    textFields(e,['applicability','evidence','documentId','reference','location','reviewer','method','finding','reason','action','basis','savedAt'],'Revue MDR invalide');
   }
  }
  if(p.docflow?.classification)textFields(p.docflow.classification,['reviewer','reference','confirmedAt','confirmedBasis','engineVersion','retained'],'Classification invalide');

 }
 return true;
}
const api={validate:validateBackup};
if(typeof module==='object'&&module.exports)module.exports=api;else window.ORBIVIA_BACKUP=api;
})();
