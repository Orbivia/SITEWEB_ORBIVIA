/* ORBIVIA Compliance Studio V4 — Poste de travail documentaire.
 * Compatible avec les sauvegardes et les moteurs MDR/ISO 13485 déjà présents.
 * Le résultat d'audit reste un constat humain documenté, jamais une certification.
 */
(function(){
"use strict";
const D=window.ORBIVIA_V4_DATA,F=window.ORBIVIA_V4_FILES;
if(!D||!F){console.error("Modules documentaires V4 indisponibles.");return;}
const ui={tab:"home",scope:"mdr",folder:"DT01",entry:"DT-DES-01",auditScope:"mdr",auditEntry:"DT-DES-01",filter:"all",legacy:false,working:false};
const labels={missing:"À constituer",attached:"À vérifier",reviewed:"Revue enregistrée",gap:"Écart relevé",stale:"Revue à refaire",na:"Non applicable"};
const tabs=[["home","Accueil"],["dossier","Mon dossier"],["audit","Audit"],["actions","Actions"],["reports","Rapports"]];
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
function fileList(p,entry){
 const docs=D.docs(p,entry.id);
 if(!docs.length)return '<p class="v4-muted">Aucun document rattaché. Importez un fichier ou rattachez une référence de l’inventaire existant.</p>';
 return '<div class="v4-docfiles">'+docs.map(function(doc){
  const storage=!!doc.v4FileKey,meta=[doc.revision?'Rév. '+doc.revision:'Révision non renseignée',storage?'Fichier conservé localement':'Référence seule — fichier non stocké'].join(" · ");
  return '<div class="v4-docfile"><div><strong>'+E(doc.title)+'</strong><small>'+E(meta)+'</small></div><div class="v4-actions">'+(storage?button("Télécharger","download",doc.id):'')+button("Détacher","unlink",doc.id)+'</div></div>';
 }).join("")+'</div>';
}
function itemDetail(p,entry){
 if(!entry)return '<div class="v4-empty">Sélectionnez un document attendu.</div>';
 const linked=new Set(D.links(p,entry.id));
 const existing=allDocs(p).filter(function(x){return !linked.has(x.id);});
 const rev=D.ensure(p).reviews[entry.id]||{};
 return '<div class="v4-docdetail"><div class="v4-actions" style="justify-content:space-between"><h2>'+E(entry.title)+'</h2>'+pill(status(p,entry.id))+'</div>'
 +'<p class="v4-muted">'+E(entry.id)+' · '+E(entry.ref)+' · '+E(D.path(entry))+'</p>'
 +'<h3>Éléments attendus</h3><ul class="v4-guidelist">'+entry.checks.map(function(x){return '<li>'+E(x)+'</li>';}).join("")+'</ul>'
 +'<h3>Documents et preuves</h3>'+fileList(p,entry)
 +'<div class="v4-formgrid"><label class="v4-field">Révision du nouveau fichier<input id="v4-file-revision" type="text" placeholder="Ex. B, 02, 1.0 (facultatif)"></label><div class="v4-field"><span>Importer dans ce dossier</span><label class="v4-button primary" for="v4-file-input" style="cursor:pointer">+ Ajouter une preuve</label><input class="v4-hidden-input" id="v4-file-input" data-v4-file type="file" multiple></div></div>'
 +(existing.length?'<div class="v4-formgrid" style="margin-top:12px"><label class="v4-field">Ou rattacher un document existant<select id="v4-existing-doc"><option value="">Choisir une référence…</option>'+existing.map(function(x){return '<option value="'+A(x.id)+'">'+E(x.title)+' '+E(x.revision||"")+'</option>';}).join("")+'</select></label><div class="v4-field"><span>Sans duplication du fichier</span>'+button("Rattacher la référence","attach",entry.id)+'</div></div>':"")
 +'<div class="v4-separator"></div>'
 +'<div class="v4-actions">'+button("Vérifier ce document","start-audit",entry.id,"primary")+button("Ajouter une action","add-action",entry.id)+'</div>'
 +'<p class="v4-muted" style="margin:12px 0 0">Une preuve présente n’est pas automatiquement conforme. Sa revue reste à documenter par un relecteur.</p>'
 +'</div>';
}
function home(p){
 const s=stats(p),projects=state.projects;
 const actions=button("Reprendre mon dossier","switch","dossier","primary")+button("Configurer le dispositif","legacy","0");
 return '<div class="v4-work">'+title("Mes projets","Constitution et revue des dossiers techniques MDR et du SMQ ISO 13485",actions)
 +'<div class="v4-metrics">'+metric(s.md.reviewed+"/"+s.md.total,"Documents techniques revus")+metric(s.smq.reviewed+"/"+s.smq.total,"Points documentaires SMQ revus")+metric(s.docs,"Références inventoriées")+metric(s.open,"Actions ouvertes")+'</div>'
 +'<div class="v4-grid"><section class="v4-card"><h2>Dispositifs et projets</h2><div class="v4-stack">'+projects.map(function(x){const active=x.id===p.id;return '<button type="button" class="v4-project" data-v4-project="'+A(x.id)+'"><span><strong>'+E(x.name||"Nouveau projet")+'</strong><small>'+E(x.company||"Fabricant non précisé")+' · '+E(x.device||"Dispositif à préciser")+'</small></span><span class="v4-status">'+(active?"Ouvert":"Ouvrir")+'</span></button>';}).join("")+'</div><div class="v4-actions" style="margin-top:14px"><button type="button" class="v4-button" id="v4-new-project">+ Nouveau projet</button></div></section>'
 +'<section class="v4-card"><h2>À reprendre</h2>'
 +(s.md.missing?'<p class="v4-muted"><b>'+s.md.missing+'</b> documents techniques attendus sans preuve rattachée.</p>':"")
 +(s.md.attached+s.md.stale?'<p class="v4-muted"><b>'+(s.md.attached+s.md.stale)+'</b> dossiers possèdent une preuve, mais nécessitent une revue ou une nouvelle revue.</p>':"")
 +(s.smq.missing?'<p class="v4-muted"><b>'+s.smq.missing+'</b> documents SMQ à constituer ou rattacher.</p>':"")
 +'<div class="v4-actions" style="margin-top:16px">'+button("Ouvrir le dossier technique","switch","dossier","primary")+button("Voir les actions","switch","actions")+'</div>'
 +'<div class="v4-separator"></div>'+note("Mode local : les références et les résultats d'audit sont dans la sauvegarde JSON du projet. Les fichiers sont conservés séparément dans le navigateur et inclus uniquement lors d'un export ZIP du dossier.")+'</section></div></div>';
}
function dossier(p){
 const folders=pickFolder(ui.scope),folder=D.folder(ui.folder),entries=pickEntry(folder.id),selected=D.entry(ui.entry);
 const scope=ui.scope;
 const topActions=button("Cadrage et classification","legacy","0")+button("Normes applicables","legacy","2")+button("Générer sur mon PC","folder-pick",undefined,"primary")+button("Exporter ZIP","zip");
 const nav='<div class="v4-scope">'+[["mdr","Dossier MDR"],["smq","SMQ ISO 13485"]].map(function(r){return '<button type="button" data-v4-scope="'+r[0]+'" class="'+(scope===r[0]?'active':'')+'">'+E(r[1])+'</button>';}).join("")+'</div>';
 const tree='<aside class="v4-card">'+nav+'<div class="v4-folders">'+folders.map(function(f){
  const docs=D.expected.filter(function(x){return x.folder===f.id;});
  const reviewed=docs.filter(function(x){return status(p,x.id)==="reviewed";}).length;
  return '<button type="button" class="v4-folder '+(f.id===ui.folder?'selected':'')+'" data-v4-folder="'+A(f.id)+'"><span>'+E(f.title)+'</span><b>'+reviewed+'/'+docs.length+'</b></button>';
 }).join("")+'</div></aside>';
 const rows='<section class="v4-card"><h2>'+E(folder.title)+'</h2><p class="v4-muted">Cliquez sur un livrable pour voir les attentes, les preuves et ses contrôles.</p>'
 +'<div class="v4-entrylist">'+entries.map(function(x){return '<button type="button" class="v4-entry '+(ui.entry===x.id?'active':'')+'" data-v4-entry="'+A(x.id)+'"><span><strong>'+E(x.title)+'</strong><small>'+E(x.ref)+'</small></span>'+pill(status(p,x.id))+'</button>';}).join("")+'</div>'
 +itemDetail(p,selected)+'</section>';
 return '<div class="v4-work">'+title("Mon dossier","Arborescence générée, preuves et vérification document par document",topActions)
 +'<div class="v4-dossier-layout">'+tree+rows+'</div>'
 +'<div class="v4-card" style="margin-top:14px">'+note("Les modèles sont une trame de constitution, pas un référentiel exhaustif. Confirmez l'applicabilité réelle des exigences et des normes avant toute conclusion de conformité. Le SMQ est pour l'instant rattaché à ce projet.")+'</div></div>';
}
function reviewForm(p,entry){
 if(!entry)return '<div class="v4-empty">Sélectionnez un contrôle.</div>';
 const item=D.ensure(p).reviews[entry.id]||{},statusNow=status(p,entry.id);
 const selected=Array.isArray(item.checked)?item.checked:[];
 const options=[["pending","Non audité / à vérifier"],["reviewed","Preuve suffisante après revue interne"],["gap","Écart ou preuve insuffisante"],["na","Non applicable — justification requise"]];
 return '<h2>'+E(entry.title)+'</h2><p class="v4-muted">'+E(entry.ref)+' · '+E(entry.id)+'</p><div style="margin-top:12px">'+pill(statusNow)+'</div>'
 +(statusNow==="stale"?'<div class="v4-alert" style="margin-top:12px">La liste ou la révision des preuves a changé. La revue précédente doit être reconfirmée.</div>':'')
 +'<div class="v4-separator"></div><b>Preuves rattachées</b>'+fileList(p,entry)
 +'<form class="v4-form" id="v4-review-form" data-v4-review-id="'+A(entry.id)+'">'
 +'<div><b>Points à examiner</b><p class="v4-muted">Cochez un point uniquement après vérification de son contenu dans la preuve.</p><div class="v4-review-checks">'+entry.checks.map(function(x,i){return '<label><input type="checkbox" name="check" value="'+i+'" '+(selected.includes(i)?'checked':'')+'>'+E(x)+'</label>';}).join("")+'</div></div>'
 +'<label class="v4-field">Conclusion documentaire<select name="status">'+options.map(function(o){return '<option value="'+o[0]+'" '+((item.status||"pending")===o[0]?'selected':'')+'>'+E(o[1])+'</option>';}).join("")+'</select></label>'
 +'<div class="v4-formgrid"><label class="v4-field">Relecteur<input name="reviewer" value="'+A(item.reviewer||"")+'" placeholder="Nom et fonction"></label><label class="v4-field">Méthode / référence du contrôle<input name="method" value="'+A(item.method||"")+'" placeholder="Ex. §4 du rapport, vérification des résultats"></label></div>'
 +'<label class="v4-field">Constat, justification ou écart<textarea name="finding" placeholder="Exigence évaluée, passage examiné, résultat, lacune éventuelle…">'+E(item.finding||"")+'</textarea></label>'
 +'<div class="v4-actions"><button type="submit" class="v4-button primary">Enregistrer la revue</button>'+button("Ouvrir dans mon dossier","go-entry",entry.id)+'</div></form>';
}
function audit(p){
 const items=D.expected.filter(function(e){return e.scope===ui.auditScope&&(ui.filter==="all"||(ui.filter==="open"?status(p,e.id)!=="reviewed"&&status(p,e.id)!=="na":status(p,e.id)===ui.filter));});
 if(!items.some(function(x){return x.id===ui.auditEntry;}))ui.auditEntry=items[0]&&items[0].id||"";
 const selected=D.entry(ui.auditEntry);
 const filters=[["all","Tous"],["open","À traiter"],["gap","Écarts"],["stale","Révision modifiée"],["reviewed","Revus"]];
 const select='<div class="v4-scope"><button class="'+(ui.auditScope==="mdr"?'active':'')+'" data-v4-audit-scope="mdr">Dossier MDR</button><button class="'+(ui.auditScope==="smq"?'active':'')+'" data-v4-audit-scope="smq">SMQ ISO 13485</button></div>'
 +'<div class="v4-auditlist">'+items.map(function(e){return '<button type="button" class="'+(ui.auditEntry===e.id?'active':'')+'" data-v4-audit-entry="'+A(e.id)+'"><strong>'+E(e.title)+'</strong>'+pill(status(p,e.id))+'</button>';}).join("")+'</div>';
 return '<div class="v4-work">'+title("Audit documentaire","Présence des documents et examen de leur contenu : deux décisions distinctes",button("Consulter les matrices MDR","legacy","2"))
 +'<div class="v4-filter">'+filters.map(function(f){return '<button type="button" data-v4-filter="'+f[0]+'" class="'+(ui.filter===f[0]?'active':'')+'">'+E(f[1])+'</button>';}).join("")+'</div>'
 +'<div class="v4-audit-layout"><aside class="v4-card">'+select+'</aside><section class="v4-card">'+(selected?reviewForm(p,selected):'<div class="v4-empty">Aucun contrôle dans cette sélection.</div>')+'</section></div>'
 +'<div style="margin-top:12px">'+note("Les points proposés ne remplacent ni une lecture des exigences ISO 13485 applicables ni la revue exhaustive du MDR. Toute décision 'suffisante' nécessite une preuve liée, une méthode, un relecteur et la vérification des points attendus.")+'</div></div>';
}
function actions(p){
 const v=D.ensure(p),missing=D.expected.filter(function(e){return status(p,e.id)==="missing"&&!actionBy(p,e.id);});
 return '<div class="v4-work">'+title("Écarts et actions","Registre des constats et documents à produire",button("Ouvrir l’audit","switch","audit","primary"))
 +'<div class="v4-metrics">'+metric(countActions(p),"Actions ouvertes")+metric(missing.length,"Livrables sans preuve")+metric(D.counts(p,"mdr").gap+D.counts(p,"smq").gap,"Écarts de revue")+'</div>'
 +'<section class="v4-card"><h2>Plan d’actions</h2>'+(v.actions.length?v.actions.map(function(x){return '<div class="v4-action" data-v4-action-id="'+A(x.id)+'"><div><strong>'+E(x.title)+'</strong><small>'+E(x.entry)+' · '+E(x.createdAt||"")+'</small></div><div><label class="v4-field">Responsable<input data-v4-action-field="owner" value="'+A(x.owner||"")+'" placeholder="À affecter"></label></div><div><label class="v4-field">Échéance<input type="date" data-v4-action-field="due" value="'+A(x.due||"")+'"></label></div><div><label class="v4-field">Statut<select data-v4-action-field="status">'+[["open","À faire"],["doing","En cours"],["closed","Clôturée"]].map(function(y){return '<option value="'+y[0]+'" '+(x.status===y[0]?'selected':'')+'>'+E(y[1])+'</option>';}).join("")+'</select></label></div></div>';}).join(""):'<div class="v4-empty">Aucune action créée.</div>')
 +'</section><section class="v4-card" style="margin-top:15px"><h2>Documents manquants à traiter ('+missing.length+')</h2><div class="v4-stack">'+missing.map(function(entry){return '<div class="v4-entry"><span><strong>'+E(entry.title)+'</strong><small>'+E(entry.ref)+'</small></span>'+button("Créer une action","add-action",entry.id)+'</div>';}).join("")+'</div></section></div>';
}
function reports(p){
 const s=stats(p);
 const card=function(heading,txt,btn){return '<section class="v4-card v4-report-card"><h2>'+E(heading)+'</h2><p>'+E(txt)+'</p>'+btn+'</section>';};
 return '<div class="v4-work">'+title("Rapports et exports","Fichiers, tableaux de suivi et conclusions des revues internes",button("Sauvegarde du projet","json",undefined,"primary"))
 +'<div class="v4-metrics">'+metric(s.md.reviewed+"/"+s.md.total,"Revue dossier MDR")+metric(s.smq.reviewed+"/"+s.smq.total,"Revue documentaire SMQ")+metric(s.md.gap+s.smq.gap,"Écarts de revue")+metric(s.md.stale+s.smq.stale,"Revues invalidées")+'</div>'
 +'<div class="v4-exportgrid">'
 +card("Dossier technique ZIP","Arborescence générée, fichiers réellement conservés dans le navigateur, index JSON et références documentaires.",button("Exporter l'arborescence et les preuves","zip",undefined,"primary"))
 +card("Rapport d'audit V4","Statut de chaque livrable, décisions documentées, références des preuves, constats et actions.",button("Exporter le rapport HTML","report"))
 +card("Matrice des preuves","Correspondance des documents attendus avec les preuves, révisions et résultats de revue.",button("Exporter la matrice CSV","matrix"))
 +card("Plan d'actions","Écarts ouverts, responsables et échéances, y compris les nouveaux documents à créer.",button("Exporter les actions CSV","actions-export"))
 +card("Audit documentaire historique","Conserver l'accès au rapport détaillé et à la grille de contrôle de la V3.",'<button class="v4-button" type="button" data-df-export="full">Revue V3 détaillée</button>')
 +card("Sauvegarde et transfert","Le JSON enregistre les références et les décisions, mais pas les fichiers binaires. Pour transférer les preuves, exporter aussi le ZIP.",button("Télécharger la sauvegarde JSON","json"))
 +'</div><p class="v4-note" style="margin-top:17px">La complétude du dossier et le résultat des contrôles sont deux indicateurs différents. Le logiciel ne délivre pas de déclaration de conformité ni de certification ISO 13485.</p></div>';
}
function view(p){
 if(ui.tab==="home")return home(p);
 if(ui.tab==="dossier")return dossier(p);
 if(ui.tab==="audit")return audit(p);
 if(ui.tab==="actions")return actions(p);
 return reports(p);
}
function nav(){
 return '<nav class="v4-nav" id="v4-nav" aria-label="Navigation principale">'+tabs.map(function(tab){return '<button type="button" data-v4-switch="'+tab[0]+'" '+(ui.tab===tab[0]?'aria-current="page"':'')+'>'+tab[1]+'</button>';}).join("")+'</nav>';
}
const beforeRender=render;
render=function(){
 beforeRender();
 document.body.classList.add("v4-active");
 document.body.classList.toggle("v4-legacy",ui.legacy);
 const header=document.querySelector(".topbar"),app=document.getElementById("app");
 if(!header||!app)return;
 let navigation=document.getElementById("v4-nav");
 if(!navigation){header.insertAdjacentHTML("afterend",nav());navigation=document.getElementById("v4-nav");}
 if(ui.legacy){
  navigation.hidden=true;document.body.classList.add("v4-legacy");
  if(!document.querySelector(".v4-legacybar")){
   const bar=document.createElement("div");bar.className="v4-legacybar";
   bar.innerHTML='<span>Configuration réglementaire existante — vos réponses restent conservées.</span><button class="v4-button primary" type="button" data-v4-return>← Retour à mon dossier</button>';
   const target=document.querySelector("#v312-progress")||app;
   target.insertAdjacentElement("beforebegin",bar);
  }
  return;
 }
 const bar=document.querySelector(".v4-legacybar");if(bar)bar.remove();
 navigation.outerHTML=nav();
 page="guided";
 const p=P();
 app.innerHTML=view(p);
};
function route(tab){
 ui.legacy=false;ui.tab=tab;page="guided";df(pickProject()).normsOpen=false;render();window.scrollTo({top:0,behavior:"auto"});
}
function legacy(n){
 ui.legacy=true;df(pickProject()).normsOpen=false;page="guided";
 dfNavigate(Number(n)||0);
}
function changed(p,text){log(p,text);save();render();}
function newAction(p,id){
 const target=D.entry(id);if(!target){notify("Livrable introuvable.","danger");return;}
 const v=D.ensure(p);
 const existing=actionBy(p,id);if(existing){ui.tab="actions";render();return;}
 v.actions.push({id:uid(),entry:id,title:"Compléter / vérifier : "+target.title,owner:"",due:"",status:"open",createdAt:new Date().toISOString().slice(0,10)});
 changed(p,"Action créée : "+target.title);
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
    links.push(id);complete++;
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
  const work={reviews:D.ensure(p).reviews,links:D.ensure(p).links,actions:D.ensure(p).actions,expected:D.expected.map(function(e){return {id:e.id,title:e.title,folder:e.folder,reference:e.ref};})};
  const r=await F.exportProject(p,allDocs(p),folders,work);
  notify("ZIP créé : "+r.files+" fichiers inclus."+(r.missing.length?" Références sans fichier : "+r.missing.length+" (voir index).":""),r.missing.length?"danger":"success");
 }catch(e){notify("Export ZIP impossible : "+e.message,"danger");}finally{ui.working=false;}
}
async function chooseFolder(){
 try{
  const p=P(),name=await F.chooseDirectory();
  let count=0;
  for(const f of D.folders){
   const path=(f.scope==="mdr"?"Dossier_technique/":"")+f.path;
   let dir=F.directory;
   for(const segment of path.split("/").filter(Boolean))dir=await dir.getDirectoryHandle(F.safe(segment),{create:true});
   count++;
  }
  notify("Dossier « "+name+" » : "+count+" répertoires créés. Les nouvelles preuves y seront également copiées.");
 }catch(e){if(e.name!=="AbortError")notify(e.message,"danger");}
}
function exportCSV(type){
 const p=P();let rows;
 if(type==="matrix"){
  rows=[["Livrable","Dossier","Référence","État","Document","Révision","Identifiant preuve","Relecteur","Constat"]];
  for(const entry of D.expected){
   const docs=D.docs(p,entry.id),r=D.ensure(p).reviews[entry.id]||{};
   if(!docs.length)rows.push([entry.id,D.path(entry),entry.ref,status(p,entry.id),"","","",r.reviewer||"",r.finding||""]);
   else for(const doc of docs)rows.push([entry.id,D.path(entry),entry.ref,status(p,entry.id),doc.title,doc.revision||"",doc.id,r.reviewer||"",r.finding||""]);
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
  return '<tr><td>'+E(entry.id)+'</td><td>'+E(entry.title)+'</td><td>'+E(entry.ref)+'</td><td>'+E(labels[status(p,entry.id)])+'</td><td>'+docs.map(function(x){return E(x.title)+" ("+E(x.revision||"sans rév.")+")";}).join(", ")+'</td><td>'+E(review.reviewer||"")+'</td><td>'+E(review.finding||"")+'</td></tr>';
 }).join("");
 const report='<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>ORBIVIA — Rapport documentaire</title><style>body{font:13px Arial,sans-serif;color:#20354a;margin:34px}table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #ccd6e2;text-align:left;padding:8px;vertical-align:top}th{background:#eef3f8}h1{color:#17263a}small{color:#728398}</style></head><body><h1>Rapport documentaire ORBIVIA V4</h1><p><b>Projet :</b> '+E(p.name)+' — '+E(p.company)+'</p><p>Édité le '+E(new Date().toLocaleDateString("fr-FR"))+'</p><p>Ce document est un relevé de travail et des décisions de relecteurs. Il ne constitue pas une certification, une déclaration de conformité ou un avis d’organisme notifié.</p><h2>Revue des livrables</h2><table><thead><tr><th>Code</th><th>Document attendu</th><th>Référence</th><th>État</th><th>Preuves</th><th>Relecteur</th><th>Constat</th></tr></thead><tbody>'+rows+'</tbody></table><h2>Actions</h2><ul>'+v.actions.map(function(a){return '<li>'+E(a.title)+' — '+E(a.status)+' — '+E(a.owner||"Non affecté")+'</li>';}).join("")+'</ul></body></html>';
 download(safeName(p.name)+"_audit_V4.html",report,"text/html;charset=utf-8");
}
document.addEventListener("click",async function(event){
 const b=event.target.closest("[data-v4-switch],[data-v4-project],[data-v4-scope],[data-v4-folder],[data-v4-entry],[data-v4-audit-scope],[data-v4-audit-entry],[data-v4-filter],[data-v4-start-audit],[data-v4-go-entry],[data-v4-legacy],[data-v4-return],[data-v4-add-action],[data-v4-attach],[data-v4-unlink],[data-v4-download],[data-v4-folder-pick],[data-v4-zip],[data-v4-json],[data-v4-report],[data-v4-matrix],[data-v4-actions-export],[data-v4-switch],#v4-new-project");
 if(!b)return;
 const p=P(),data=b.dataset;
 if(data.v4Switch){route(data.v4Switch);return;}
 if(data.v4Project){state.activeProject=data.v4Project;save();route("dossier");return;}
 if(data.v4Scope){ui.scope=data.v4Scope;pickFolder(ui.scope);pickEntry(ui.folder);render();return;}
 if(data.v4Folder){ui.folder=data.v4Folder;pickEntry(ui.folder);render();return;}
 if(data.v4Entry){ui.entry=data.v4Entry;render();return;}
 if(data.v4AuditScope){ui.auditScope=data.v4AuditScope;ui.auditEntry="";render();return;}
 if(data.v4AuditEntry){ui.auditEntry=data.v4AuditEntry;render();return;}
 if(data.v4Filter){ui.filter=data.v4Filter;render();return;}
 if(data.v4StartAudit){ui.auditScope=D.entry(data.v4StartAudit).scope;ui.auditEntry=data.v4StartAudit;ui.filter="all";route("audit");return;}
 if(data.v4GoEntry){const entry=D.entry(data.v4GoEntry);ui.scope=entry.scope;ui.folder=entry.folder;ui.entry=entry.id;route("dossier");return;}
 if(data.v4Legacy!==undefined){legacy(data.v4Legacy);return;}
 if(data.v4Return!==undefined){ui.legacy=false;route("dossier");return;}
 if(data.v4AddAction){newAction(p,data.v4AddAction);return;}
 if(data.v4Attach){
  const id=document.getElementById("v4-existing-doc")?.value;
  if(!id){notify("Sélectionnez une référence.","danger");return;}
  if(!allDocs(p).some(function(d){return d.id===id;})){notify("Document introuvable.","danger");return;}
  const ids=D.ensure(p).links[data.v4Attach]||(D.ensure(p).links[data.v4Attach]=[]);
  if(!ids.includes(id))ids.push(id);
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
 if(input.matches("[data-v4-action-field]")){
  const row=input.closest("[data-v4-action-id]"),p=P();
  const action=D.ensure(p).actions.find(function(x){return x.id===row?.dataset?.v4ActionId;});
  if(!action)return;
  const field=input.dataset.v4ActionField;
  if(["owner","due","status"].includes(field))action[field]=input.value;
  log(p,"Action "+action.id+" : "+field+" actualisé");save();render();
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
 if(s==="reviewed"&&(!D.docs(p,id).length||!reviewer||!method||checked.length!==entry.checks.length)){
  notify("Pour conclure à une preuve suffisante : rattacher une preuve, préciser le relecteur et la méthode, puis vérifier tous les points.","danger");return;
 }
 if(s==="gap"&&!finding){notify("Décrivez l'écart constaté.","danger");return;}
 if(s==="na"&&!finding){notify("Justifiez l'inapplicabilité.","danger");return;}
 D.ensure(p).reviews[id]={status:s,reviewer:reviewer,method:method,finding:finding,checked:checked,fingerprint:D.fingerprint(p,id),reviewedAt:new Date().toISOString()};
 if(s==="gap"&&!actionBy(p,id)){D.ensure(p).actions.push({id:uid(),entry:id,title:"Écart à traiter : "+entry.title,owner:"",due:"",status:"open",createdAt:new Date().toISOString().slice(0,10)});}
 changed(p,"Revue du livrable "+id+" : "+s);
 notify("Revue enregistrée. La conclusion reste une évaluation interne documentée.");
});
window.ORBIVIA_V4={version:"4.0-preview",getState:function(){return {tab:ui.tab,legacy:ui.legacy};},open:function(tab){route(tab||"home");},model:D};
render();
})();
