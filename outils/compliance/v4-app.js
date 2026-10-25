/* ORBIVIA Compliance Studio V4 — Poste de travail documentaire.
 * Compatible avec les sauvegardes et les moteurs MDR/ISO 13485 déjà présents.
 * Le résultat d'audit reste un constat humain documenté, jamais une certification.
 */
(function(){
"use strict";
const D=window.ORBIVIA_V4_DATA,F=window.ORBIVIA_V4_FILES;
if(!D||!F){console.error("Modules documentaires V4 indisponibles.");return;}
const ui={tab:"home",scope:"mdr",folder:"DT01",entry:"DT-DES-01",auditScope:"mdr",auditEntry:"DT-DES-01",filter:"all",sections:{},legacy:false,working:false};
const labels={missing:"À constituer",attached:"À vérifier",reviewed:"Revue enregistrée",gap:"Écart relevé",stale:"Revue à refaire",na:"Non applicable",scope:"Applicabilité à confirmer",uncertain:"À cadrer"};
const tabs=[["home","Questionnaire"],["dossier","Dossier"]];
function E(value){return esc(String(value===null||value===undefined?"":value));}
function A(value){return attr(String(value===null||value===undefined?"":value));}
function P(){const p=pickProject();D.ensure(p);return p;}
function allDocs(p){return df(p).documents;}
function actionBy(p,id){return D.ensure(p).actions.find(function(x){return x.entry===id&&x.status!=="closed";});}
function countActions(p){return D.ensure(p).actions.filter(function(a){return a.status!=="closed";}).length;}
function status(p,id){return D.status(p,id);}
function pill(value){return '<span class="v4-status '+E(value)+'">'+E(labels[value]||value)+'</span>';}
function button(text,cmd,value,extra){
 return '<button type="button" class="v4-button '+(extra||"")+'" data-v4-'+cmd+(value===undefined?'':('="'+A(value)+'"'))+'>'+E(text)+'</button>';
}
function title(name,help,actions){
 return '<div class="v4-page-title"><div><h1>'+E(name)+'</h1><p>'+E(help)+'</p></div><div class="v4-actions">'+(actions||"")+'</div></div>';
}
function note(text){return '<p class="v4-note">'+E(text)+'</p>';}
function metric(n,label){return '<div class="v4-metric"><strong>'+E(n)+'</strong><span>'+E(label)+'</span></div>';}
function stats(p){const md=D.counts(p,"mdr"),smq=D.counts(p,"smq");return {md:md,smq:smq,docs:allDocs(p).length,open:countActions(p)};}
function pickFolder(scope){
 const folders=D.folders.filter(function(f){return f.scope===scope;});
 if(!folders.some(function(f){return f.id===ui.folder;}))ui.folder=folders[0].id;
 return folders;
}
function pickEntry(folder){
 const rows=D.expected.filter(function(e){return e.folder===folder;});
 if(!rows.some(function(x){return x.id===ui.entry;}))ui.entry=rows[0]&&rows[0].id||"";
 return rows;
}
// Guided journey state belongs to the project and is included in its JSON backup.
const profileFields=[
 ["name","Comment s’appelle votre projet ?","Un nom court pour retrouver ce dossier.",false],
 ["company","Quelle organisation porte le projet ?","Indiquez le fabricant ou l’organisation concernée.",false],
 ["device","Quel dispositif examinez-vous ?","Précisez sa désignation et sa version.",false],
 ["intended","Quelle est sa destination prévue ?","Décrivez l’usage médical revendiqué, les indications et les limites.",true],
 ["patient","À quels patients est-il destiné ?","Population cible et contre-indications connues.",true],
 ["users","Qui l’utilise, et dans quel environnement ?","Professionnels, patients, domicile, établissement de soins…",true],
 ["owner","Qui est responsable de ce dossier ?","Nom et fonction du responsable.",false],
 ["stage","Où en est le développement ?","Conception, prototype, validation, commercialisation…",false]
];
const stages=["Décrire le projet","Définir les exigences","Constituer et vérifier","Faire le bilan"];
const presenceOptions=[["present","Oui, le document est disponible"],["partial","Il est en cours de rédaction"],["absent","Non, il reste à créer"],["checking","Je ne sais pas"],["na","Non applicable"]];
function journey(p){
 const v=D.ensure(p);
 if(!v.journey||typeof v.journey!=="object"||Array.isArray(v.journey))v.journey={};
 const j=v.journey;
 if(j.uiVersion!==5){j.screen="home";j.uiVersion=5;}
 if(!j.answers||typeof j.answers!=="object")j.answers={};
 if(!j.drafts||typeof j.drafts!=="object")j.drafts={};
 if(!j.comments||typeof j.comments!=="object")j.comments={};
 if(!["profile","requirements","proof","recap","home"].includes(j.screen))j.screen="home";
 if(!Number.isInteger(j.profile)||j.profile<0||j.profile>=profileFields.length)j.profile=0;
 if(!Array.isArray(j.queue))j.queue=[];
 j.queue=j.queue.filter(id=>D.entry(id));
 if(!D.entry(j.cursor))j.cursor=D.expected[0].id;
 return j;
}
function availability(p,e){const j=journey(p);return j.answers[e.id]||(status(p,e.id)==="na"?"na":D.docs(p,e.id).length?"present":"");}
function documentPill(p,e){const st=status(p,e.id),a=availability(p,e);if(["reviewed","gap","na","stale"].includes(st))return pill(st);const text=a==="checking"?"À préciser":a==="partial"?"En cours de rédaction":a==="na"?"Exclusion à justifier":"";return text?'<span class="v4-status attached">'+text+'</span>':pill(st);}
function filled(p,e){const a=availability(p,e);return !!a&&a!=="checking"&&(a!=="na"||status(p,e.id)==="na");}
function inspected(p,e){return ["reviewed","gap","na"].includes(status(p,e.id));}
function progress(p){const total=D.expected.length;return {total,filled:D.expected.filter(e=>filled(p,e)).length,inspected:D.expected.filter(e=>inspected(p,e)).length};}
function unresolved(p,e){return !["reviewed","na"].includes(status(p,e.id));}
function stageState(p,n){
 if(n===0){const count=profileFields.filter(f=>String(p[f[0]]||"").trim()).length;return {done:count===profileFields.length,text:count===profileFields.length?"Terminé":count+" / "+profileFields.length+" réponses"};}
 if(n===1){const n=window.ORBIVIA_NORMES_INFO.journey(p),done=dfClassConfirmed(p)&&n.known===n.total;return {done,text:done?"Terminé":"À compléter / confirmer"};}
 if(n===2){const v=progress(p),done=v.inspected===v.total;return {done,text:done?"Terminé":v.filled+" / "+v.total+" renseignés"};}
 return {done:false,text:"Consulter"};
}
function help(text){return '<details class="v5-help"><summary aria-label="Afficher l’aide" title="Afficher l’aide">i</summary><div role="note">'+E(text)+'</div></details>';}
function stageNav(){return '';}
function questionnaireMetrics(p){
 const c=cqEvaluate(p),a=cqContext(p),n=window.ORBIVIA_NORMES_INFO.journey(p),v=progress(p);
 return window.ORBIVIA_JOURNEY_METRICS.calculate([
  {id:0,title:"Produit",done:profileFields.filter(f=>String(p[f[0]]||"").trim()).length,total:profileFields.length},
  {id:1,title:"Réglementation",done:c.questions.filter(q=>cqKnown(q,a)).length+(dfClassConfirmed(p)?1:0)+n.known,total:c.questions.length+1+n.total},
  {id:2,title:"Documents",done:v.filled,total:v.total}
 ]);
}
function chapterProgress(p,n,position,total){const m=questionnaireMetrics(p).chapters[n];return '<div class="v5-chapter"><button type="button" data-v4-switch="home" aria-label="Retour au questionnaire">←</button><span>'+m.title+'</span><small>'+m.percent+' % · '+position+' sur '+total+'</small></div><progress class="v5-progress" aria-label="Avancement du chapitre '+m.title+'" value="'+m.done+'" max="'+m.total+'"></progress>';}
function regulatoryHeader(p,kind,index){const c=cqEvaluate(p),n=window.ORBIVIA_NORMES_INFO.journey(p),offset=kind==='classification'?0:kind==='norms'?c.questions.length+1:c.questions.length+1+n.total;return chapterProgress(p,1,Math.min(offset+index,questionnaireMetrics(p).chapters[1].total),questionnaireMetrics(p).chapters[1].total);}
function continueJourney(p){
 const j=journey(p),missing=profileFields.findIndex(f=>!String(p[f[0]]||"").trim());
 if(missing>=0){j.profile=missing;openStage(0);return;}
 const c=cqEvaluate(p),a=cqContext(p),q=c.questions.find(q=>!cqKnown(q,a));
 if(q||!dfClassConfirmed(p)){
  j.requirement="classification";j.screen="requirements";
  const session=cqSession(p);session.cursor=q?.id||session.cursor;session.view=q?"question":"result";session.reviewMode=c.questions.some(q=>cqKnown(q,a));session.reviewSeen=[];
  ui.tab="home";ui.legacy=false;save();render();focusQuestion();return;
 }
 const n=window.ORBIVIA_NORMES_INFO.journey(p);
 if(n.known<n.total){j.requirement="norms";window.ORBIVIA_NORMES_INFO.resume(p);openStage(1);return;}
 const e=D.expected.find(e=>!filled(p,e));
 if(e){openProof(p,e.id,D.expected.filter(e=>!filled(p,e)).map(e=>e.id));return;}
 route("dossier");
}
function autosave(){return '<p class="j-save" role="status" aria-live="polite">'+(storageOK?'Réponses enregistrées automatiquement':'Enregistrement indisponible — exportez une sauvegarde JSON')+'</p>';}
function nextStage(p){if(!stageState(p,0).done)return 0;if(!stageState(p,1).done)return 1;return progress(p).inspected===D.expected.length?3:2;}
function home(p){
 const m=questionnaireMetrics(p),next=m.chapters.find(c=>c.done<c.total);
 return '<div class="j-work v5-home"><div class="v5-intro"><span class="v5-kicker">VOTRE PROJET</span><h1>'+E(p.name||"Nouveau projet")+'</h1><p>Répondez aux questions pour construire votre dossier.</p></div><section class="v5-overview"><div class="v5-global"><span>Questionnaire complété</span>'+help("Ce pourcentage suit les réponses au questionnaire et la confirmation de la classification. La revue détaillée des normes est suivie séparément dans le dossier. Les réponses à vérifier restent à compléter ; ce pourcentage ne mesure pas la conformité.")+'<strong>'+m.percent+'<small> %</small></strong></div><progress class="v5-progress" aria-label="Questionnaire complété" value="'+m.done+'" max="'+m.total+'"></progress><p class="v5-next">'+E(next?'À poursuivre : '+next.title:'Toutes les réponses sont renseignées. Les revues restent consultables dans le dossier.')+'</p>'+button(m.complete?"Ouvrir mon dossier →":"Continuer le questionnaire →","j-resume",undefined,"primary")+'</section><div class="v5-chapters">'+m.chapters.map(c=>'<button type="button" data-j-stage="'+c.id+'"><span>'+E(c.title)+'</span><span>'+c.percent+' % <b aria-hidden="true">›</b></span></button>').join("")+'</div>'+autosave()+'</div>';
}
function profile(p){
 const j=journey(p),f=profileFields[j.profile];
 return '<div class="j-work">'+chapterProgress(p,0,j.profile+1,profileFields.length)
 +'<section class="v4-card j-question"><h1 tabindex="-1" id="j-title">'+E(f[1])+'</h1><p>'+E(f[2])+'</p><label class="v4-field" for="j-profile"><span class="j-sr">'+E(f[1])+'</span>'+(f[3]?'<textarea':'<input type="text"')+' id="j-profile" data-j-profile="'+f[0]+'" '+(f[3]?'>':'value="'+A(p[f[0]]||"")+'">')+(f[3]?E(p[f[0]]||"")+'</textarea>':'')+'</label>'
 +comment(p,'profile-'+f[0])+'<div class="j-bottom">'+(j.profile?'<button class="v4-button" type="button" data-j-profile-move="-1">← Précédent</button>':button("Retour au parcours","switch","home","quiet"))+'<button class="v4-button primary" type="button" data-j-profile-move="1">'+(j.profile===profileFields.length-1?'Passer aux exigences →':'Continuer →')+'</button></div></section>'+autosave()+'</div>';
}
function comment(p,key){return '<details class="j-disclosure" '+(journey(p).comments[key]?'open':'')+'><summary>Ajouter un commentaire</summary><label class="v4-field"><span class="j-sr">Commentaire</span><textarea data-j-comment="'+A(key)+'">'+E(journey(p).comments[key]||"")+'</textarea></label></details>';}
function openProof(p,id,queue){
 const j=journey(p);j.screen="proof";j.cursor=id||j.cursor;
 if(queue)j.queue=queue;
 if(!j.queue.includes(j.cursor))j.queue=D.expected.map(e=>e.id);
 const e=D.entry(j.cursor);ui.entry=e.id;ui.scope=e.scope;ui.folder=e.folder;
 ui.legacy=false;ui.tab="home";df(p).normsOpen=false;save();render();focusQuestion();
}
function focusQuestion(){const h=document.querySelector('#j-title,#app h1,#app h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}window.scrollTo({top:0,behavior:"auto"});}
function openStage(n){
 const p=P(),j=journey(p);ui.legacy=false;ui.tab="home";df(p).normsOpen=false;
 if(n===0){j.screen="profile";const missing=profileFields.findIndex(f=>!String(p[f[0]]||"").trim());j.profile=missing>=0?missing:0;}
 else if(n===1){j.screen="requirements";j.requirement=dfClassConfirmed(p)?"norms":"classification";if(j.requirement==="classification"){const c=cqEvaluate(p),a=cqContext(p),q=c.questions.find(q=>!cqKnown(q,a)),ss=cqSession(p);ss.cursor=q?.id||ss.cursor;ss.view=q?"question":"result";ss.reviewMode=false;}else window.ORBIVIA_NORMES_INFO.resume(p);}
 else if(n===2){const e=D.expected.find(e=>!filled(p,e));openProof(p,e?.id||j.cursor);return;}
 else{route("reports");return;}
 save();render();focusQuestion();
}
function advance(p){const j=journey(p),at=j.queue.indexOf(j.cursor),next=j.queue[at+1];if(next)openProof(p,next);else route("dossier");}
function journeyView(p){const j=journey(p);if(j.screen==="profile")return profile(p);if(j.screen==="proof")return proof(p);if(j.screen==="recap")return recap(p);return home(p);}
function view(p){
 if(ui.tab==="home")return journeyView(p);
 if(ui.tab==="dossier")return bilan(p);
 return bilan(p);
}
function nav(){
 return '<nav class="v4-nav" id="v4-nav" aria-label="Navigation principale">'+tabs.map(function(tab){return '<button type="button" data-v4-switch="'+tab[0]+'" '+(ui.tab===tab[0]?'aria-current="page"':'')+'>'+tab[1]+'</button>';}).join("")+'</nav>';
}
document.addEventListener('toggle',function(event){const el=event.target;if(el.matches('[data-v4-section]')&&el.isConnected)ui.sections[el.dataset.v4Section]=el.open;},true);
const {proof,recap,bilan}=window.ORBIVIA_DOCUMENT_VIEWS.create({D,ui,E,A,button,status,pill,journey,availability,documentPill,allDocs,actionBy,comment,stageNav,chapterProgress,progress,unresolved,title,stageState,normReviewSummary,countActions,pickFolder,pickEntry,presenceOptions,autosave});
function paintStorage(){
 const app=document.getElementById('app');if(!app)return;
 let warning=document.getElementById('v53-storage-warning');
 if(!warning){warning=document.createElement('div');warning.id='v53-storage-warning';warning.className='v4-alert v53-storage-warning';warning.setAttribute('role','alert');warning.innerHTML='<span>Enregistrement indisponible. Exportez vos réponses avant de quitter.</span>'+button('Sauvegarder le JSON','json');app.before(warning);}
 warning.hidden=storageOK;
 document.querySelectorAll('.j-save,.cq-autosave').forEach(el=>{el.textContent=storageOK?'Réponses enregistrées automatiquement':'Enregistrement indisponible — exportez une sauvegarde JSON';});
}
document.addEventListener('orbivia-storage',paintStorage);
document.addEventListener('orbivia-restored',()=>{ui.project=null;});
const beforeRender=render;
render=function(){
 const p=P();if(ui.project!==p.id){F.directory=null;ui.sections={};ui.project=p.id;ui.normClickAt=0;ui.legacy=false;ui.tab="home";}const j=journey(p),requirements=!ui.legacy&&ui.tab==="home"&&j.screen==="requirements";
 if(!ui.legacy){page="guided";df(p).normsOpen=requirements&&j.requirement==="norms";if(requirements)df(p).step=1;}
 if(ui.legacy||requirements)beforeRender();
 else{
  normalizeProject(p);
  document.getElementById('projectSelect').innerHTML=state.projects.map(x=>'<option value="'+A(x.id)+'" '+(x.id===p.id?'selected':'')+'>'+E(x.name||'Projet à renseigner')+'</option>').join('');
  document.body.classList.add('v312-guided','cq-focused','unified-guided');
  document.body.classList.remove('v312-classification','v312-norms','v312-classification-result','std-active');
 }
 document.body.classList.add("v4-active","j-active","v5-active");
 document.body.classList.toggle("v4-legacy",ui.legacy);
 const header=document.querySelector(".topbar"),app=document.getElementById("app");
 if(!header||!app)return;
 paintStorage();
 const menu=document.querySelector('.v312-menu-popup');if(menu&&!menu.querySelector('[data-v5-new]'))menu.insertAdjacentHTML('afterbegin','<button type="button" data-v5-new>+ Nouveau projet</button>');
 let navigation=document.getElementById("v4-nav");
 if(!navigation){header.insertAdjacentHTML("afterend",nav());navigation=document.getElementById("v4-nav");}
 document.querySelectorAll(".v4-legacybar").forEach(el=>el.remove());
 if(ui.legacy){
  navigation.hidden=true;
  const bar=document.createElement("div");bar.className="v4-legacybar";
  bar.innerHTML='<label class="v4-field">Outil<select data-v53-tool>'+NAV.filter(x=>!["guided","classification","proofs","docsummary"].includes(x[0])).map(x=>'<option value="'+A(x[0])+'" '+(page===x[0]?'selected':'')+'>'+E(x[2])+'</option>').join('')+'</select></label><button class="v4-button primary" type="button" data-v4-return>← Retour au parcours</button>';
  app.insertAdjacentElement("beforebegin",bar);return;
 }
 navigation.outerHTML=nav();
 if(requirements){
  app.querySelectorAll(".flow-footer,.df-bottom,.cq-stepnav").forEach(el=>el.remove());
  app.insertAdjacentHTML("afterbegin",'<div class="j-work">'+stageNav(p,1)+'<div class="j-requirement-tabs"><button type="button" data-j-requirement="classification" '+(j.requirement!=="norms"?'aria-current="page"':'')+'>1. Classification</button><button type="button" data-j-requirement="norms" '+(j.requirement==="norms"?'aria-current="page"':'')+'>2. Normes et exigences</button></div></div>');
  app.insertAdjacentHTML("beforeend",'<div class="j-work j-bottom">'+button("Retour au parcours","switch","home")+(j.requirement!=="norms"?'<button class="v4-button primary" type="button" data-j-requirement="norms">Passer aux normes →</button>':'<button class="v4-button primary" type="button" data-j-stage="2">Constituer le dossier →</button>')+'</div>');
 }else app.innerHTML=view(p);
 polish(p,requirements);
};
function route(tab){
 const section={reports:'exports',actions:'actions',audit:'files'}[tab];
 if(section){ui.sections[section]=true;tab='dossier';}ui.legacy=false;ui.tab=tab;if(tab==="home"){const j=journey(P());if(j.screen!=="home")j.lastScreen=j.screen;j.screen="home";save();}page="guided";df(pickProject()).normsOpen=false;render();if(section)document.querySelector('[data-v4-section="'+section+'"]')?.scrollIntoView({block:"start"});else window.scrollTo({top:0,behavior:"auto"});
}
function legacy(n){
 ui.legacy=true;df(pickProject()).normsOpen=false;page="guided";
 dfNavigate(Number(n)||0);
}
function changed(p,text){log(p,text);save();render();}
function newAction(p,id){
 const target=D.entry(id);if(!target){notify("Livrable introuvable.","danger");return;}
 const v=D.ensure(p);
 const existing=actionBy(p,id);if(existing){route("actions");return;}
 v.actions.push({id:uid(),entry:id,title:"Compléter / vérifier : "+target.title,owner:"",due:"",status:"open",createdAt:new Date().toISOString().slice(0,10)});
 ui.sections.actions=true;changed(p,"Action créée : "+target.title);
}
async function storeFiles(list,p,entry){
 if(ui.working)return;ui.working=true;
 const revision=(document.getElementById("v4-file-revision")?.value||"").trim();
 let complete=0,written=0,errors=[];
 try{
  for(const file of list){
   if(file.size>120*1024*1024){errors.push(file.name+" : fichier > 120 Mo");continue;}
   const id=uid();
   const path=D.path(entry)+"/"+F.safe(id)+"_"+F.safe(file.name);
   try{
    const hash=await F.hash(file);
    await F.save(p.id,id,file);
    const doc={id:id,title:file.name,revision:revision,date:new Date().toISOString().slice(0,10),path:path,size:file.size,modified:file.lastModified,hash:hash,origin:"import V4 — copie locale",v4FileKey:true};
    df(p).documents.push(doc);
    const links=D.ensure(p).links[entry.id]||(D.ensure(p).links[entry.id]=[]);
    links.push(id);journey(p).answers[entry.id]=journey(p).answers[entry.id]==="partial"?"partial":"present";complete++;
    if(F.directory){try{if(await F.writeDirectory(path,file))written++;}catch(err){errors.push(file.name+" : copie dans le dossier PC échouée ("+err.message+")");}}
   }catch(err){errors.push(file.name+" : "+err.message);}
  }
  if(complete){log(p,complete+" preuve(s) enregistrée(s) dans "+entry.id);save();render();}
  notify(complete+" fichier(s) conservé(s) dans le navigateur"+(written?", "+written+" copié(s) sur le PC":"")+(errors.length?". Attention : "+errors.join(" ; "):""),errors.length?"danger":"success");
 }finally{ui.working=false;}
}
async function exportZip(){
 if(ui.working)return;ui.working=true;
 try{
  const p=P(),folders=D.folders.map(function(f){return (f.scope==="mdr"?"Dossier_technique/":"")+f.path;});
  const work={reviews:D.ensure(p).reviews,links:D.ensure(p).links,actions:D.ensure(p).actions,journey:journey(p),expected:D.expected.map(function(e){return {id:e.id,title:e.title,folder:e.folder,reference:e.ref};})};
  const r=await F.exportProject(p,allDocs(p),folders,work);
  notify("ZIP créé : "+r.files+" fichiers inclus."+(r.missing.length?" Références sans fichier : "+r.missing.length+" (voir index).":""),r.missing.length?"danger":"success");
 }catch(e){notify("Export ZIP impossible : "+e.message,"danger");}finally{ui.working=false;}
}
async function chooseFolder(){
 if(ui.working)return;ui.working=true;
 try{
  const p=P(),name=await F.chooseDirectory();
  let count=0,copied=0,failed=0;
  for(const f of D.folders){
   const path=(f.scope==="mdr"?"Dossier_technique/":"")+f.path;
   let dir=F.directory;
   for(const segment of path.split("/").filter(Boolean))dir=await dir.getDirectoryHandle(F.safe(segment),{create:true});
   count++;
  }
  for(const doc of allDocs(p)){
   if(!doc.v4FileKey)continue;
   try{const blob=await F.read(p.id,doc.id);if(!blob){failed++;continue;}await F.writeDirectory(doc.path,blob);copied++;}
   catch(_e){failed++;}
  }
  notify("Dossier « "+name+" » : "+count+" répertoires créés, "+copied+" preuves copiées."+(failed?" "+failed+" fichiers non copiés : vérifier le stockage local.":""),failed?"danger":"success");
 }catch(e){if(e.name!=="AbortError")notify(e.message,"danger");}finally{ui.working=false;}
}
function exportCSV(type){
 const p=P();let rows;
 if(type==="matrix"){
  rows=[["Livrable","Dossier","Référence","État","Document","Révision","Identifiant preuve","Relecteur","Constat","Disponibilité","Commentaire"]];
  for(const entry of D.expected){
   const docs=D.docs(p,entry.id),r=D.ensure(p).reviews[entry.id]||{};
   if(!docs.length)rows.push([entry.id,D.path(entry),entry.ref,status(p,entry.id),"","","",r.reviewer||"",r.finding||"",journey(p).answers[entry.id]||"",journey(p).comments[entry.id]||""]);
   else for(const doc of docs)rows.push([entry.id,D.path(entry),entry.ref,status(p,entry.id),doc.title,doc.revision||"",doc.id,r.reviewer||"",r.finding||"",journey(p).answers[entry.id]||"",journey(p).comments[entry.id]||""]);
  }
 }else{
  rows=[["Action","Livrable","Intitulé","Responsable","Échéance","Statut"]];
  for(const a of D.ensure(p).actions)rows.push([a.id,a.entry,a.title,a.owner||"",a.due||"",a.status]);
 }
 download(safeName(p.name)+"_V4_"+type+".csv",toCsv(rows),"text/csv;charset=utf-8");
}
function exportReport(){
 const p=P(),v=D.ensure(p);
 const rows=D.expected.map(function(entry){
  const review=v.reviews[entry.id]||{};
  const docs=D.docs(p,entry.id);
  return '<tr><td>'+E(entry.id)+'</td><td>'+E(entry.title)+'</td><td>'+E(entry.ref)+'</td><td>'+E(labels[status(p,entry.id)])+'</td><td>'+docs.map(function(x){return E(x.title)+" ("+E(x.revision||"sans rév.")+")";}).join(", ")+'</td><td>'+E(review.reviewer||"")+'</td><td>'+E(review.finding||"")+'</td><td>'+E(journey(p).answers[entry.id]||"")+'</td><td>'+E(journey(p).comments[entry.id]||"")+'</td></tr>';
 }).join("");
 const report='<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>ORBIVIA — Rapport documentaire</title><style>body{font:13px Arial,sans-serif;color:#20354a;margin:34px}table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #ccd6e2;text-align:left;padding:8px;vertical-align:top}th{background:#eef3f8}h1{color:#17263a}small{color:#728398}</style></head><body><h1>Rapport documentaire ORBIVIA V4.1</h1><p><b>Projet :</b> '+E(p.name)+' — '+E(p.company)+'</p><p>Édité le '+E(new Date().toLocaleDateString("fr-FR"))+'</p><p>Ce document est un relevé de travail et des décisions de relecteurs. Il ne constitue pas une certification, une déclaration de conformité ou un avis d’organisme notifié.</p><h2>Revue des livrables</h2><table><thead><tr><th>Code</th><th>Document attendu</th><th>Référence</th><th>État</th><th>Preuves</th><th>Relecteur</th><th>Constat</th><th>Disponibilité</th><th>Commentaire</th></tr></thead><tbody>'+rows+'</tbody></table><h2>Actions</h2><ul>'+v.actions.map(function(a){return '<li>'+E(a.title)+' — '+E(a.status)+' — '+E(a.owner||"Non affecté")+'</li>';}).join("")+'</ul></body></html>';
 download(safeName(p.name)+"_audit_V4.html",report,"text/html;charset=utf-8");
}
document.addEventListener("click",function(event){
 const link=event.target.closest("[data-unified-tools],[data-nav]");
 if(!link)return;
 const name=link.dataset.nav;
 if(link.hasAttribute("data-unified-tools")||name&&name!=="guided")ui.legacy=true;
},true);
document.addEventListener("click",async function(event){
 const b=event.target.closest("[data-v4-switch],[data-v4-project],[data-v4-scope],[data-v4-folder],[data-v4-entry],[data-v4-audit-scope],[data-v4-audit-entry],[data-v4-filter],[data-v4-start-audit],[data-v4-go-entry],[data-v4-legacy],[data-v4-return],[data-v4-add-action],[data-v4-attach],[data-v4-unlink],[data-v4-download],[data-v4-folder-pick],[data-v4-zip],[data-v4-json],[data-v4-report],[data-v4-matrix],[data-v4-actions-export],[data-v4-switch],#v4-new-project");
 if(!b)return;
 if(ui.working){notify("Enregistrement des fichiers en cours…");return;}
 const p=P(),data=b.dataset;
 if(data.v4Switch){route(data.v4Switch);return;}
 if(data.v4Project){state.activeProject=data.v4Project;save();route("home");return;}
 if(data.v4Scope){ui.scope=data.v4Scope;pickFolder(ui.scope);pickEntry(ui.folder);render();return;}
 if(data.v4Folder){ui.folder=data.v4Folder;pickEntry(ui.folder);render();return;}
 if(data.v4Entry){ui.entry=data.v4Entry;render();return;}
 if(data.v4AuditScope){ui.auditScope=data.v4AuditScope;ui.auditEntry="";render();return;}
 if(data.v4AuditEntry){ui.auditEntry=data.v4AuditEntry;render();return;}
 if(data.v4Filter){ui.filter=data.v4Filter;render();return;}
 if(data.v4StartAudit){openProof(p,data.v4StartAudit,D.expected.map(e=>e.id));return;}
 if(data.v4GoEntry){const entry=D.entry(data.v4GoEntry);ui.scope=entry.scope;ui.folder=entry.folder;ui.entry=entry.id;ui.sections.files=true;route("dossier");return;}
 if(data.v4Legacy!==undefined){const n=Number(data.v4Legacy);openStage(n===0?0:1);if(n===2){journey(p).requirement="norms";save();render();}return;}
 if(data.v4Return!==undefined){ui.legacy=false;route("home");return;}
 if(data.v4AddAction){newAction(p,data.v4AddAction);return;}
 if(data.v4Attach){
  const id=document.getElementById("v4-existing-doc")?.value;
  if(!id){notify("Sélectionnez une référence.","danger");return;}
  if(!allDocs(p).some(function(d){return d.id===id;})){notify("Document introuvable.","danger");return;}
  const ids=D.ensure(p).links[data.v4Attach]||(D.ensure(p).links[data.v4Attach]=[]);
  if(!ids.includes(id))ids.push(id);
  journey(p).answers[data.v4Attach]=journey(p).answers[data.v4Attach]==="partial"?"partial":"present";
  changed(p,"Document rattaché à "+data.v4Attach);return;
 }
 if(data.v4Unlink){
  const ids=D.ensure(p).links[ui.entry]||[];
  D.ensure(p).links[ui.entry]=ids.filter(function(id){return id!==data.v4Unlink;});
  changed(p,"Document détaché du livrable "+ui.entry);return;
 }
 if(data.v4Download){
  try{
   const doc=allDocs(p).find(function(x){return x.id===data.v4Download;});
   const blob=await F.read(p.id,data.v4Download);
   if(!doc||!blob){notify("Le fichier n'est plus accessible dans ce navigateur. Réimportez-le.","danger");return;}
   F.exportBlob(blob,doc.title);
  }catch(e){notify("Téléchargement impossible : "+e.message,"danger");}
  return;
 }
 if(data.v4FolderPick!==undefined){await chooseFolder();return;}
 if(data.v4Zip!==undefined){await exportZip();return;}
 if(data.v4Json!==undefined){exportKind("json");return;}
 if(data.v4Report!==undefined){exportReport();return;}
 if(data.v4Matrix!==undefined){exportCSV("matrix");return;}
 if(data.v4ActionsExport!==undefined){exportCSV("actions");return;}
 if(b.id==="v4-new-project"){document.getElementById("newProjectBtn")?.click();return;}
});
document.addEventListener("change",async function(event){
 const input=event.target;
 if(input.matches("[data-v4-file]")){
  const entry=D.entry(ui.entry),list=Array.from(input.files||[]);
  if(entry&&list.length)await storeFiles(list,P(),entry);
  return;
 }
 if(input.matches("[data-v53-tool]")){page=input.value;ui.legacy=true;render();window.scrollTo({top:0});return;}
 if(input.matches("[data-v4-action-field]")){
  const row=input.closest("[data-v4-action-id]"),p=P();
  const action=D.ensure(p).actions.find(function(x){return x.id===row?.dataset?.v4ActionId;});
  if(!action)return;
  const field=input.dataset.v4ActionField;
  if(["owner","due","status"].includes(field))action[field]=input.value;
  log(p,"Action "+action.id+" : "+field+" actualisé");save();if(field==="status")render();
 }
});
document.addEventListener("submit",function(event){
 const form=event.target;
 if(!form.matches("#v4-review-form"))return;
 event.preventDefault();
 const p=P(),id=form.dataset.v4ReviewId,entry=D.entry(id);
 if(!entry)return;
 const data=new FormData(form),s=String(data.get("status")||"pending"),
  reviewer=String(data.get("reviewer")||"").trim(),method=String(data.get("method")||"").trim(),finding=String(data.get("finding")||"").trim(),
  checked=data.getAll("check").map(Number);
 const error=window.ORBIVIA_DOCUMENT_REVIEW.validate({status:s,reviewer,method,finding,checked},entry,D.docs(p,id).length);
 if(error){form.querySelector("details")?.setAttribute("open","");notify(error,"danger");return;}
 if(form.hasAttribute("data-j-guided")&&availability(p,entry)==="na"&&s!=="na"){
  notify("Justifiez l’exclusion ou choisissez une autre réponse de disponibilité.","danger");return;
 }
 if(s==="na")journey(p).answers[id]="na";
 else if(journey(p).answers[id]==="na")journey(p).answers[id]="checking";
 delete journey(p).drafts[id];
 D.ensure(p).reviews[id]={status:s,reviewer:reviewer,method:method,finding:finding,checked:checked,fingerprint:D.fingerprint(p,id),reviewedAt:new Date().toISOString()};
 if(s==="gap"&&!actionBy(p,id)){D.ensure(p).actions.push({id:uid(),entry:id,title:"Écart à traiter : "+entry.title,owner:"",due:"",status:"open",createdAt:new Date().toISOString().slice(0,10)});}
 log(p,"Revue du livrable "+id+" : "+s);save();
 if(form.hasAttribute("data-j-guided"))advance(p);else render();
 notify(s==="pending"?"Réponse enregistrée. La revue reste à terminer.":"Revue enregistrée.");
});
// Intercept the legacy duplicate action so IndexedDB proofs follow the new project ID.
document.addEventListener('click',async function(event){
 if(!event.target.closest('[data-duplicate]'))return;
 event.preventDefault();event.stopImmediatePropagation();
 if(ui.working){notify('Attendez la fin de l’opération en cours.');return;}
 ui.working=true;
 try{
  const source=P(),copy=JSON.parse(JSON.stringify(source));copy.id=uid();copy.name=(source.name||'Projet')+' (copie)';copy.activity=[];
  const missing=await F.copyProject(source.id,copy.id,df(copy).documents);
  for(const doc of df(copy).documents)if(missing.includes(doc.id)){doc.v4FileKey=false;doc.origin='Référence copiée — fichier absent du stockage source';}
  log(copy,'Projet dupliqué avec ses preuves locales');state.projects.push(copy);state.activeProject=copy.id;save();render();
  notify(missing.length?'Projet copié. '+missing.length+' référence(s) sans fichier dans le stockage source.':'Projet et preuves locales copiés.',missing.length?'danger':'success');
 }catch(error){notify('Duplication impossible : '+error.message,'danger');}finally{ui.working=false;}
},true);
// Keep legacy step buttons coherent when the regulatory engines request the next screen.
document.addEventListener("click",function(event){
 if(ui.working&&(event.target.closest("#projectSelect,#newProjectBtn,[data-nav],[data-unified-tools],[data-import],[data-j-stage],[data-v4-switch],[data-v4-return]"))){event.preventDefault();event.stopImmediatePropagation();notify("Attendez la fin de l’import des fichiers.");return;}
 const step=event.target.closest("[data-df-step]");
 if(!step||ui.legacy||journey(P()).screen!=="requirements")return;
 event.preventDefault();event.stopImmediatePropagation();
 const n=Number(step.dataset.dfStep);
 if(n>=3)openStage(2);else if(n===0)openStage(0);else{const j=journey(P());j.requirement=n===2?"norms":"classification";save();render();focusQuestion();}
},true);
document.addEventListener("change",function(event){
 if(ui.working&&event.target.id==="projectSelect"){event.stopImmediatePropagation();event.target.value=state.activeProject;notify("Attendez la fin de l’import des fichiers.");}
},true);
// Confirming normative decisions already calls dfNavigate(3) in the existing engine.
const regulatoryNavigate=dfNavigate;
dfNavigate=function(n){
 if(!ui.legacy&&journey(P()).screen==="requirements"){
  if(n>=3){openStage(2);return;}
  if(n===0){openStage(0);return;}
  journey(P()).requirement=n===2?"norms":"classification";save();render();return;
 }
 regulatoryNavigate(n);
};
document.addEventListener("click",function(event){
 const b=event.target.closest("[data-j-stage],[data-v4-j-resume],[data-v4-j-pending],[data-j-entry],[data-j-presence],[data-j-profile-move],[data-v4-j-previous],[data-v4-j-skip],[data-v4-j-next-theme],[data-j-requirement],[data-v4-j-template],[data-v4-j-action],[data-v4-j-upload]");
 if(!b)return;
 if(ui.working){notify("Enregistrement des fichiers en cours…");return;}
 const p=P(),j=journey(p),data=b.dataset;
 if(data.v4JUpload!==undefined){document.getElementById("v4-file-input")?.click();return;}
 if(data.jStage!==undefined){openStage(Number(data.jStage));return;}
 if(data.v4JResume!==undefined){continueJourney(p);return;}
 if(data.v4JPending!==undefined){const ids=D.expected.filter(e=>unresolved(p,e)).map(e=>e.id);if(ids.length)openProof(p,ids[0],ids);else notify("Aucun point en attente.");return;}
 if(data.jEntry){const ids=ui.tab==="reports"?D.expected.filter(e=>unresolved(p,e)).map(e=>e.id):j.queue.includes(data.jEntry)?j.queue:D.expected.map(e=>e.id);openProof(p,data.jEntry,ids);return;}
 if(data.jRequirement){j.requirement=data.jRequirement;j.screen="requirements";ui.tab="home";save();render();focusQuestion();return;}
 if(data.jProfileMove){
  const n=Number(data.jProfileMove);
  if(n>0&&!String(p[profileFields[j.profile][0]]||"").trim()){notify("Renseignez votre réponse avant de continuer.","danger");document.getElementById("j-profile")?.focus();return;}
  if(j.profile+n>=profileFields.length){continueJourney(p);return;}
  else j.profile=Math.max(0,j.profile+n);
  save();render();focusQuestion();return;
 }
 if(data.jPresence){
  const id=j.cursor,old=availability(p,D.entry(id));j.answers[id]=data.jPresence;
  // Availability changes invalidate an existing conclusion until a new review is saved.
  if(old!==data.jPresence){const review=D.ensure(p).reviews[id];if(review&&["reviewed","gap","na"].includes(review.status))review.status="pending";if(j.drafts[id])j.drafts[id].status="pending";}
  save();render();document.getElementById("j-evidence")?.scrollIntoView({block:"nearest",behavior:"smooth"});return;
 }
 if(data.v4JPrevious!==undefined){const at=j.queue.indexOf(j.cursor);if(at>0)openProof(p,j.queue[at-1]);else route("home");return;}
 if(data.v4JSkip!==undefined){j.answers[j.cursor]="checking";save();advance(p);return;}
 if(data.v4JNextTheme!==undefined){if(j.next)openProof(p,j.next);else route("reports");return;}
 if(data.v4JAction){const e=D.entry(data.v4JAction);if(actionBy(p,e.id)){route("actions");return;}D.ensure(p).actions.push({id:uid(),entry:e.id,title:"Constituer : "+e.title,owner:"",due:"",status:"open",createdAt:new Date().toISOString().slice(0,10)});log(p,"Action créée : "+e.title);save();render();notify("Action ajoutée au dossier.");return;}
 if(data.v4JTemplate){const e=D.entry(data.v4JTemplate);const html='<!doctype html><html lang="fr"><meta charset="utf-8"><title>'+E(e.title)+'</title><body><h1>'+E(e.title)+'</h1><p>Projet : '+E(p.name)+'</p><p>Référence / révision : à renseigner</p><p>Rédacteur / relecteur / date : à renseigner</p><p>Trame de départ à adapter et compléter ; ne constitue pas une preuve validée.</p>'+e.checks.map(x=>'<h2>'+E(x)+'</h2><p>À documenter : méthode, éléments, références et conclusion.</p>').join("")+'<h2>Approbation et historique des modifications</h2><p>À renseigner.</p></body></html>';download(e.id+"_trame.html",html,"text/html;charset=utf-8");}
});
document.addEventListener("input",function(event){
 const x=event.target,p=P(),j=journey(p);
 if(x.matches('[data-v4-action-field]')){const row=x.closest('[data-v4-action-id]'),action=D.ensure(p).actions.find(a=>a.id===row?.dataset.v4ActionId);if(action&&['owner','due','status'].includes(x.dataset.v4ActionField)){action[x.dataset.v4ActionField]=x.value;save();}return;}
 if(x.dataset.jProfile){p[x.dataset.jProfile]=x.value;if(["device","intended","patient","users"].includes(x.dataset.jProfile))cqInvalidate(p);save();}
 else if(x.dataset.jComment){j.comments[x.dataset.jComment]=x.value;save();}
 else if(x.closest("form[data-j-guided]")){
  const f=x.closest("form"),data=new FormData(f);
  j.drafts[f.dataset.v4ReviewId]={status:String(data.get("status")||"pending"),reviewer:String(data.get("reviewer")||""),method:String(data.get("method")||""),finding:String(data.get("finding")||""),checked:data.getAll("check").map(Number),fingerprint:D.fingerprint(p,f.dataset.v4ReviewId)};save();
  if(x.name==="status"&&x.value!=="pending")f.querySelector("details")?.setAttribute("open","");
 }else return;
 const label=document.querySelector(".j-save");if(label)label.textContent=storageOK?"Réponses enregistrées automatiquement":"Enregistrement indisponible — exportez une sauvegarde JSON";
});

function normHelp(p,id){const entry=window.ORBIVIA_NORMES_CATALOGUE.find(e=>e.id===id),n=window.ORBIVIA_NORMES_INFO.journey(p);if(!entry)return '';const h=window.ORBIVIA_NORMES_EXPLICATIONS.describe(entry,window.ORBIVIA_NORMES_INFO.answers(p),n.questions);return '<details class="v5-help v52-norm-help"><summary aria-label="Comprendre '+A(id)+'" title="Comprendre cette norme">i</summary><div role="note"><strong>'+E(h.id)+' — '+E(h.title)+'</strong><h3>Ce qu’elle couvre</h3><p>'+E(h.scope)+'</p><p>'+E(h.use)+'</p><h3>Pourquoi elle est proposée</h3><p>'+E(h.why)+'</p>'+(h.criteria.length?'<ul>'+h.criteria.map(x=>'<li>'+E(x)+' : Oui</li>').join('')+'</ul>':'')+'<a href="'+A(h.url)+'" target="_blank" rel="noopener noreferrer">'+E(h.sourceLabel)+' ↗</a><small>Vérifier l’édition, les amendements et le périmètre sur la fiche de l’éditeur.</small></div></details>';}
function compactClassification(p,app,bottom){
 const result=app.querySelector('#cq-result');if(!result)return;
 const r=cqEvaluate(p),confirmed=dfClassConfirmed(p);result.classList.add('v52-class-result');
 const oldActions=result.querySelector(':scope > .actions');
 const incompleteAction=oldActions?.querySelector('[data-cq-resume],[data-cq-edit],[data-df-step]');
 const exporter=oldActions?.querySelector('[data-cq-export]');
 const parts=Array.from(result.querySelectorAll(':scope > details.cq-result-detail'));
 let confirmation=parts.find(el=>el.querySelector('[data-cq-confirm]'));
 const details=document.createElement('details');details.className='j-disclosure v52-class-details';details.innerHTML='<summary>Justification, sources et réponses</summary><p><a href="https://eur-lex.europa.eu/eli/reg/2017/745/oj" target="_blank" rel="noopener noreferrer">MDR — annexe VIII : règles de classification ↗</a></p>';
 parts.forEach(el=>{if(el!==confirmation){el.open=false;details.append(el);}});
 if(exporter)details.append(exporter);
 if(confirmation){
  confirmation.hidden=confirmed||!journey(p).confirmClassOpen;
  confirmation.classList.add('v52-confirmation');confirmation.open=true;
  const reference=confirmation.querySelector('[data-cq-meta="reference"]')?.closest('.field');
  if(reference){const opt=document.createElement('details');opt.className='j-disclosure';opt.innerHTML='<summary>Référence documentaire (facultatif)</summary>';opt.append(reference);details.append(opt);}
  confirmation.querySelector(':scope > summary')?.remove();confirmation.querySelector('[data-cq-confirm]')?.remove();
  const intro=document.createElement('p');intro.className='v4-muted';intro.textContent='Après examen de la justification, indiquez le relecteur pour confirmer la proposition.';confirmation.prepend(intro);
  const panel=document.createElement('section');panel.className=confirmation.className;panel.hidden=confirmation.hidden;while(confirmation.firstChild)panel.append(confirmation.firstChild);confirmation.replaceWith(panel);confirmation=panel;
 }
 if(confirmed)details.insertAdjacentHTML('afterbegin','<p class="v4-muted">Revue enregistrée par '+E(df(p).classification.reviewer||'')+'.</p>');
 oldActions?.remove();result.append(details);
 result.querySelector('.v312-class-indicator')?.remove();
 const lead=result.querySelector('.cq-result-lead');if(lead)lead.textContent=r.complete?'Règles retenues : '+r.rules.filter(rule=>rule.applies==='yes').map(rule=>rule.n).join(', ')+'.':r.missing.length+' point(s) restent à préciser.';
 result.querySelector('.cq-result-label').textContent=confirmed?'Classe confirmée après revue':r.complete?'Classe proposée':'Classification à préciser';
 if(bottom){bottom.innerHTML='<button class="v4-button quiet" type="button" data-cq-last>← Modifier mes réponses</button>';
  if(r.complete){bottom.insertAdjacentHTML('beforeend',confirmed?'<button class="v4-button primary" type="button" data-v5-norms>Continuer →</button>':journey(p).confirmClassOpen?'<button class="v4-button primary" type="button" data-cq-confirm>Confirmer et continuer →</button>':'<button class="v4-button primary" type="button" data-v52-open-confirm>Confirmer après revue →</button>');}
  else if(incompleteAction){incompleteAction.textContent='Compléter les réponses →';bottom.append(incompleteAction);}
 }
}
function normReviewSummary(p){const n=window.ORBIVIA_NORMES_INFO.journey(p);return '<p class="v4-muted">Décisions renseignées : '+n.decided+' · Références à examiner : '+n.unresolved.length+'. La revue des normes est distincte du questionnaire.</p><div class="v4-actions"><button type="button" class="v4-button" data-v51-review-norms>Examiner les normes proposées</button><button type="button" class="v4-button quiet" data-v51-confirm-norms>Confirmer la sélection</button></div>';}
function openNormReview(p){const j=journey(p),n=window.ORBIVIA_NORMES_INFO.journey(p),s=df(p).norms;j.normId=n.unresolved[0]||n.references[0]?.id;j.screen='requirements';j.requirement='norms';s.view='catalogue';s.filter='suggested';s.family='all';s.query='';ui.tab='home';ui.legacy=false;save();render();focusQuestion();}
function nextNorm(p){const j=journey(p),n=window.ORBIVIA_NORMES_INFO.journey(p),at=n.references.findIndex(r=>r.id===j.normId);if(at>=0&&at+1<n.references.length){j.normId=n.references[at+1].id;save();render();focusQuestion();}else{route('dossier');notify('Revue parcourue. Les références laissées à vérifier restent dans le dossier.');}}
function polish(p,requirements){
 if(ui.legacy)return;
 const app=document.getElementById("app"),j=journey(p);
 document.body.classList.toggle("v5-question-mode",ui.tab==="home"&&j.screen!=="home");
 const menu=document.querySelector('.v312-menu-popup');
 if(menu&&!menu.querySelector('[data-v5-new]'))menu.insertAdjacentHTML('afterbegin','<button type="button" data-v5-new>+ Nouveau projet</button>');
 if(requirements){
  app.querySelectorAll('.j-work,.cq-heading,.std-tabs,.v312-norm-tools,.cq-autosave,.std-metrics,.std-filters,.std-actions,.v312-optional,.std-work>.notice').forEach(el=>el.remove());
  let card;
  if(j.requirement!=="norms"){
   const c=cqEvaluate(p),q=c.questions.findIndex(q=>q.id===cqSession(p).cursor);
   app.insertAdjacentHTML('afterbegin',regulatoryHeader(p,"classification",app.querySelector("#cq-result")?c.questions.length+1:Math.max(1,q+1)));
   card=app.querySelector('.cq-card');
   const bottom=app.querySelector('.cq-below');
   if(bottom){bottom.classList.add('v5-controls');bottom.querySelectorAll('p').forEach(el=>el.remove());bottom.querySelector('[data-cq-review-end]')?.remove();if(app.querySelector('#cq-result'))bottom.insertAdjacentHTML('beforeend','<button type="button" class="v4-button primary" data-v5-norms>Continuer vers les normes →</button>');}
   app.querySelector('.cq-progress-row')?.remove();
   compactClassification(p,app,bottom);
  }else{
   const n=window.ORBIVIA_NORMES_INFO.journey(p),s=df(p).norms;
   if(s.view==='matrix'){app.insertAdjacentHTML('afterbegin','<div class="v5-chapter"><button type="button" data-v4-switch="dossier" aria-label="Retour au dossier">←</button><span>Matrice des exigences MDR</span></div>');}else if(s.view==='questions'){
    const at=n.questions.findIndex(q=>q.id===s.cursor);
    app.insertAdjacentHTML('afterbegin',regulatoryHeader(p,"norms",Math.max(1,at+1)));
    app.querySelector('.std-progress')?.remove();card=app.querySelector('.cq-card');
    app.insertAdjacentHTML('beforeend','<div class="v5-controls"><button class="v4-button quiet" type="button" data-v5-norm-back>← Précédent</button><button class="v4-button quiet" type="button" data-v5-norm-list>Références proposées →</button></div>');
   }else if(s.view==='catalogue'){
    const records=Array.from(app.querySelectorAll('.std-record'));
    const selected=n.references.some(r=>r.id===j.normId)?j.normId:n.unresolved[0]||n.references.at(-1)?.id;
    j.normId=selected;
    records.forEach(el=>{if(el.querySelector('[data-std-decision]')?.dataset.stdDecision!==selected)el.remove();});
    app.querySelectorAll('.std-work>.smalltxt,.std-work>p').forEach(el=>el.remove());
    app.insertAdjacentHTML('afterbegin','<div class="v5-chapter"><button type="button" data-v4-switch="dossier" aria-label="Retour au dossier">←</button><span>Revue des normes</span><small>'+Math.max(1,n.references.findIndex(r=>r.id===selected)+1)+' sur '+n.references.length+'</small></div>');
    card=app.querySelector('.std-record');
    if(card){
     card.insertAdjacentHTML('afterbegin','<h1>Retenir cette norme ?</h1>'+normHelp(p,selected));
     card.classList.add('v5-norm-card');
     const id=selected,decision=s.decisions[id]||{},fields=card.querySelector('.std-record-fields'),source=card.querySelector('.std-top a'),metadata=card.querySelector(':scope > small');
     const details=document.createElement('details');details.className='j-disclosure v51-reference-details';details.innerHTML='<summary>Détails de la référence</summary>';
     if(metadata)details.append(metadata);
     if(fields){const decisionField=fields.querySelector('[data-std-decision]')?.closest('label');if(decisionField)decisionField.hidden=true;details.append(fields);}
     if(source)details.append(source);
     card.append(details);
     const choices=document.createElement('div');choices.className='j-options v51-norm-choices';
     choices.innerHTML=[['retained','Retenir cette norme'],['review','À vérifier plus tard'],['excluded','Écarter cette norme']].map(([value,label])=>'<button type="button" class="j-option '+(decision.status===value?'selected':'')+'" data-v51-norm-choice="'+value+'" data-v51-norm-id="'+A(id)+'" aria-pressed="'+(decision.status===value)+'"><span class="j-radio" aria-hidden="true"></span>'+label+'</button>').join('');
     details.before(choices);
     const reason=card.querySelector('.std-reason');
     if(reason){choices.after(reason);reason.insertAdjacentHTML('afterend','<button type="button" class="v4-button primary" data-v51-exclude="'+A(id)+'">Valider l’exclusion →</button>');}
    }else app.querySelector('.std-grid')?.insertAdjacentHTML('afterend','<section class="cq-card"><h1>Aucune norme proposée</h1><p>Vérifiez les caractéristiques du produit dans le questionnaire.</p></section>');
    app.insertAdjacentHTML('beforeend','<div class="v5-controls"><button class="v4-button quiet" type="button" data-v51-norm-prev>← Précédente</button><button class="v4-button quiet" type="button" data-v51-norm-exit>Retour au dossier</button></div>');
   }
  }
  if(card){card.classList.add('v5-common-card');const h=card.querySelector('h1,h2');if(h){h.id='j-title';h.tabIndex=-1;}}
 }
 app.querySelectorAll('.cq-comment>summary,.std-comment>summary,.j-question .j-disclosure>summary').forEach(el=>{if(el.textContent.includes('Ajouter un commentaire'))el.textContent='Ajouter un commentaire';});
 app.querySelectorAll('.j-bottom').forEach(el=>el.classList.add('v5-controls'));
 app.querySelectorAll('.j-question,.cq-card').forEach(el=>el.classList.add('v5-common-card'));
 app.querySelectorAll('.j-question>p').forEach(el=>{if(!el.textContent.trim())el.remove();});
 const h=app.querySelector('.j-question>h1,.std-question-head h2,.cq-question-head h2');
 if(j.screen==="profile")app.querySelector('.j-question>p')?.remove();
 if(h&&!h.parentElement.querySelector('.v5-help')&&!h.parentElement.querySelector('.class-info'))h.insertAdjacentHTML('afterend',help(j.screen==='profile'?profileFields[j.profile][2]:'Indiquez la disponibilité, puis rattachez une preuve ou précisez ce qui manque. Une pièce jointe doit faire l’objet d’une revue distincte.'));
 const pct=app.querySelector('.v5-global strong');if(pct)pct.setAttribute('aria-label',questionnaireMetrics(p).percent+' pour cent du questionnaire complété');
}
document.addEventListener('click',function(event){
 const b=event.target.closest('[data-v5-new],[data-v5-gspr],[data-v5-norms],[data-v5-norm-back],[data-v5-norm-list],[data-v5-norm-questions],[data-v4-v5-norm-next],[data-cq-confirm]');
 if(!b||ui.working)return;
 const p=P(),j=journey(p),s=df(p).norms;
 if(b.hasAttribute('data-v5-gspr')){j.screen='requirements';j.requirement='norms';df(p).norms=df(p).norms||{};df(p).norms.view='matrix';ui.tab='home';save();render();return;}
 if(b.hasAttribute('data-v5-new')){document.getElementById('newProjectBtn')?.click();return;}
 if(b.hasAttribute('data-cq-confirm')){if(!dfClassConfirmed(p))return;j.requirement='norms';window.ORBIVIA_NORMES_INFO.resume(p);save();render();focusQuestion();return;}
 if(b.hasAttribute('data-v5-norms')){j.requirement='norms';window.ORBIVIA_NORMES_INFO.resume(p);save();render();focusQuestion();return;}
 if(b.hasAttribute('data-v5-norm-questions')){s.view='questions';window.ORBIVIA_NORMES_INFO.resume(p);s.view='questions';save();render();return;}
 if(b.hasAttribute('data-v5-norm-list')){s.view='catalogue';s.filter='suggested';s.family='all';s.query='';save();render();return;}
 if(b.hasAttribute('data-v5-norm-back')){const n=window.ORBIVIA_NORMES_INFO.journey(p),at=n.questions.findIndex(q=>q.id===s.cursor);if(at>0)s.cursor=n.questions[at-1].id;else{j.requirement='classification';cqSession(p).view='result';}save();render();return;}
 if(b.hasAttribute('data-v4-v5-norm-next')){
  const n=window.ORBIVIA_NORMES_INFO.journey(p),decision=s.decisions[j.normId];
  if(n.unresolved.includes(j.normId)&&(!decision||!['retained','excluded'].includes(decision.status)||decision.status==='excluded'&&!decision.reason?.trim())){notify('Choisissez une décision et justifiez toute exclusion.','danger');return;}
  if(n.unresolved.length){j.normId=n.unresolved[0];save();render();focusQuestion();return;}
  if(n.known!==n.total){notify('Des caractéristiques restent à préciser.','danger');window.ORBIVIA_NORMES_INFO.resume(p);save();render();return;}
  // Delegate final confirmation to the existing normative engine.
  const holder=document.createElement('button');holder.hidden=true;holder.dataset.stdConfirm='';document.body.append(holder);holder.click();holder.remove();
 }
});
document.addEventListener('click',function(event){
 const b=event.target.closest('[data-v51-norm-choice],[data-v51-exclude],[data-v51-norm-prev],[data-v51-norm-exit],[data-v51-review-norms],[data-v51-confirm-norms],[data-std-answer]');
 if(!b||ui.working)return;
 const p=P(),j=journey(p),s=df(p).norms,n=window.ORBIVIA_NORMES_INFO.journey(p);
 if(b.hasAttribute('data-std-answer')){if(s.view==='catalogue'){openStage(2);}return;}
 if(b.hasAttribute('data-v51-review-norms')){openNormReview(p);return;}
 if(b.hasAttribute('data-v51-norm-exit')){route('dossier');return;}
 if(b.hasAttribute('data-v51-norm-prev')){const at=n.references.findIndex(r=>r.id===j.normId);if(at>0){j.normId=n.references[at-1].id;save();render();}else route('dossier');return;}
 if(b.hasAttribute('data-v51-confirm-norms')){
  if(n.known!==n.total||n.unresolved.length){notify('Complétez les caractéristiques et les références encore à examiner avant confirmation.','danger');return;}
  const holder=document.createElement('button');holder.hidden=true;holder.dataset.stdConfirm='';document.body.append(holder);holder.click();holder.remove();route('dossier');return;
 }
 const id=b.dataset.v51NormId||b.dataset.v51Exclude;
 if(!n.references.some(r=>r.id===id))return;
 const decision=s.decisions[id]||(s.decisions[id]={status:'review'});
 if(b.dataset.v51NormChoice){
  if(ui.normClickAt&&Date.now()-ui.normClickAt<300)return;ui.normClickAt=Date.now();
  decision.status=b.dataset.v51NormChoice;s.confirmedBasis='';log(p,'Référence '+id+' : '+decision.status);save();
  if(decision.status==='excluded'){render();document.querySelector('.std-reason textarea')?.focus();return;}
  nextNorm(p);return;
 }
 if(b.hasAttribute('data-v51-exclude')){if(!decision.reason?.trim()){notify('Précisez pourquoi cette norme ne concerne pas le produit.','danger');document.querySelector('.std-reason textarea')?.focus();return;}save();nextNorm(p);}
});
document.addEventListener('click',function(event){if(!event.target.closest('[data-v52-open-confirm]')||ui.working)return;journey(P()).confirmClassOpen=true;save();render();document.getElementById('cq-reviewer')?.focus();});
document.addEventListener('click',function(event){document.querySelectorAll('.v5-help[open]').forEach(el=>{if(!el.contains(event.target))el.open=false;});});
document.addEventListener('keydown',function(event){if(event.key==='Escape')document.querySelectorAll('.v5-help[open]').forEach(el=>el.open=false);});
window.ORBIVIA_V4={version:"5.3-guided",getState:function(){return {tab:ui.tab,legacy:ui.legacy};},open:function(tab){route(tab||"home");},model:D};
render();
})();
