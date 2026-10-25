/* Vues du dossier et des preuves. Les événements et écritures restent dans v4-app.js. */
(function(){
'use strict';
window.ORBIVIA_DOCUMENT_VIEWS={create:function(context){
const {D,ui,E,A,button,status,pill,journey,availability,documentPill,allDocs,actionBy,comment,stageNav,chapterProgress,progress,unresolved,title,stageState,normReviewSummary,countActions,pickFolder,pickEntry,presenceOptions,autosave}=context;
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

function proofPicker(p){const j=journey(p);return '<details class="j-disclosure j-picker"><summary>Choisir un thème ou retrouver un point</summary><div class="v4-actions">'+button("Uniquement les points en attente","j-pending",undefined,"quiet")+'</div>'+D.folders.map(f=>'<details><summary>'+E(f.title)+' <small>'+E(f.scope==="smq"?'SMQ ISO 13485':'Dossier technique')+'</small></summary><div class="j-pick-list">'+D.expected.filter(e=>e.folder===f.id).map(e=>'<button type="button" data-j-entry="'+A(e.id)+'" '+(j.cursor===e.id?'aria-current="true"':'')+'><span>'+E(e.title)+'</span>'+documentPill(p,e)+'</button>').join("")+'</div></details>').join("")+'</details>';}
function guideForm(p,entry){
 const j=journey(p),r=window.ORBIVIA_DOCUMENT_REVIEW.prepare(D.ensure(p).reviews[entry.id],j.drafts[entry.id],D.fingerprint(p,entry.id),status(p,entry.id)==="stale"),a=availability(p,entry);
 const attached=D.docs(p,entry.id).length;
 return '<form class="v4-form" id="v4-review-form" data-v4-review-id="'+A(entry.id)+'" data-j-guided>'
 +(attached?'<div><h2>Vérifier le contenu</h2><p class="v4-muted">Examinez chaque point dans la preuve avant de le cocher.</p><div class="v4-review-checks">'+entry.checks.map((x,i)=>'<label><input type="checkbox" name="check" value="'+i+'" '+(Array.isArray(r.checked)&&r.checked.includes(i)?'checked':'')+'>'+E(x)+'</label>').join("")+'</div></div>':'')
 +'<label class="v4-field">'+(a==="na"?'Justification de non-applicabilité':'Conclusion de la revue')+'<select name="status">'+[["pending","Revue à terminer"],["reviewed","Preuve suffisante après revue interne"],["gap","Écart ou preuve insuffisante"],["na","Non applicable — justification requise"]].map(o=>'<option value="'+o[0]+'" '+((r.status||(a==="na"?'na':'pending'))===o[0]?'selected':'')+'>'+E(o[1])+'</option>').join("")+'</select></label>'
 +'<details class="j-disclosure" '+(["reviewed","na","gap"].includes(r.status)||a==="na"?'open':'')+'><summary>Documenter la revue ou l’écart</summary><div class="v4-formgrid"><label class="v4-field">Relecteur<input name="reviewer" value="'+A(r.reviewer||"")+'" autocomplete="name"></label><label class="v4-field">Méthode / passage examiné<input name="method" value="'+A(r.method||"")+'" placeholder="Page, paragraphe, méthode de vérification"></label></div><label class="v4-field">Constat ou justification<textarea name="finding">'+E(r.finding||"")+'</textarea></label></details>'
 +'<div class="j-bottom">'+button("← Précédent","j-previous")+'<button type="submit" class="v4-button primary">Enregistrer et continuer →</button></div></form>';
}
function proof(p){
 const j=journey(p),entry=D.entry(j.cursor),a=availability(p,entry),folder=D.folder(entry.folder),at=j.queue.indexOf(entry.id);
 ui.entry=entry.id;ui.folder=entry.folder;ui.scope=entry.scope;
 const docs=D.docs(p,entry.id),existing=allDocs(p).filter(x=>!D.links(p,entry.id).includes(x.id));
 const canUpload=a==="present"||a==="partial"||docs.length;
 const s=status(p,entry.id);
 return '<div class="j-work">'+chapterProgress(p,2,at+1,j.queue.length)
 +'<section class="v4-card j-question"><div class="j-eyebrow">'+E(entry.scope==="smq"?'SMQ ISO 13485':'Dossier technique')+' · '+E(entry.id)+'</div><h1 id="j-title" tabindex="-1">Avez-vous ce document ?</h1><h2 class="j-document-title">'+E(entry.title)+'</h2>'
 +'<div class="j-options">'+presenceOptions.map(o=>'<button type="button" class="j-option '+(a===o[0]?'selected':'')+'" data-j-presence="'+o[0]+'" aria-pressed="'+(a===o[0])+'"><span class="j-radio" aria-hidden="true"></span>'+E(o[1])+'</button>').join("")+'</div>'
 +'<details class="j-disclosure"><summary>Comprendre ce qui est attendu</summary><ul class="v4-guidelist">'+entry.checks.map(x=>'<li>'+E(x)+'</li>').join("")+'</ul><p class="v4-muted">'+E(entry.ref)+'</p></details>'
 +comment(p,entry.id)
 +(s==="stale"?'<p class="v4-alert">Les preuves ont changé : la revue précédente doit être reconfirmée.</p>':'')
 +(a?'<div class="j-context" id="j-evidence">'+(canUpload?'<h2>'+(a==="partial"?'Ajoutez votre brouillon':'Ajoutez votre preuve')+'</h2><div class="j-upload"><span>PDF, document, tableur ou autre fichier · 120 Mo maximum par fichier</span><button type="button" class="v4-button primary" data-v4-j-upload>Choisir un fichier</button><input id="v4-file-input" data-v4-file type="file" multiple class="v4-hidden-input"></div><label class="v4-field j-revision">Révision (facultatif)<input id="v4-file-revision" placeholder="Ex. B, 02, 1.0"></label>'+fileList(p,entry)+(existing.length?'<details class="j-disclosure"><summary>Utiliser une preuve déjà enregistrée</summary><label class="v4-field">Document<select id="v4-existing-doc"><option value="">Choisir une référence…</option>'+existing.map(x=>'<option value="'+A(x.id)+'">'+E(x.title)+'</option>').join("")+'</select></label>'+button("Rattacher sans dupliquer","attach",entry.id)+'</details>':'')+'<p class="j-path">Classé dans : '+E(D.path(entry))+'</p><p class="v4-muted">Fichiers conservés dans ce navigateur ; exportez le ZIP pour les sauvegarder avec le dossier.</p>':a==="absent"?'<h2>Préparer ce document</h2><p class="v4-muted">Utilisez une trame de départ et suivez sa rédaction dans une action.</p>'+button("Télécharger la trame","j-template",entry.id)+button(actionBy(p,entry.id)?"Voir l’action":"Créer une action","j-action",entry.id):a==="checking"?'<p class="v4-muted">Ce point restera dans les éléments en attente. Vous pourrez y revenir directement.</p>':'<p class="v4-muted">Précisez pourquoi ce document ne concerne pas votre projet.</p>')+guideForm(p,entry)+'</div>':'<div class="j-bottom">'+button("← Précédent","j-previous")+button("Passer pour le moment","j-skip",undefined,"quiet")+'</div>')+'</section>'
 +proofPicker(p)+autosave()+'</div>';
}
function recap(p){const j=journey(p),entry=D.entry(j.cursor),f=D.folder(entry.folder),rows=j.queue.map(id=>D.entry(id)).filter(e=>e.folder===f.id);return '<div class="j-work">'+stageNav(p,2)+'<section class="v4-card j-question"><div class="j-eyebrow">Récapitulatif du thème</div><h1 id="j-title" tabindex="-1">'+E(f.title)+'</h1><p>Vos réponses sont enregistrées. Les points en attente restent accessibles.</p><div class="j-pick-list">'+rows.map(e=>'<button type="button" data-j-entry="'+A(e.id)+'"><span>'+E(e.title)+'</span>'+documentPill(p,e)+'</button>').join("")+'</div><div class="j-bottom">'+button("Retour au parcours","switch","home")+button(j.next?"Thème suivant →":"Voir mon dossier →","j-next-theme",undefined,"primary")+'</div></section>'+autosave()+'</div>';}

function meter(value,label,total){const n=Math.round(100*value/total);return '<section class="v4-card j-meter"><span>'+E(label)+'</span><div><strong>'+n+' %</strong><progress aria-label="'+A(label)+'" value="'+value+'" max="'+total+'"></progress></div><small>'+value+' / '+total+' rubriques</small></section>';}
function bilan(p){
 const v=progress(p),pending=D.expected.filter(e=>unresolved(p,e));
 const priorities=pending.slice().sort((a,b)=>{const rank={gap:0,stale:1,missing:2,attached:3};return (rank[status(p,a.id)]??4)-(rank[status(p,b.id)]??4);});
 return '<div class="v4-work j-bilan">'+title("Mon dossier","Retrouvez vos preuves, les points à traiter et vos exports.")+'<div class="j-meters">'+meter(D.expected.filter(e=>status(p,e.id)!=="na"&&D.docs(p,e.id).length).length,"Documents rattachés",D.expected.filter(e=>status(p,e.id)!=="na").length||1)+meter(v.inspected,"Revues enregistrées",v.total)+'</div><p class="v4-muted">Ces indicateurs suivent les preuves et les revues ; ils ne constituent pas un taux de conformité.</p>'
 +(!stageState(p,1).done?'<div class="v4-alert j-scope-alert">Le périmètre réglementaire reste à compléter ou confirmer. <button type="button" class="v4-button quiet" data-j-stage="1">Reprendre les exigences →</button></div>':'')+'<section class="v4-card"><div class="v4-actions j-between"><h2>À traiter en priorité</h2>'+button("Reprendre les "+pending.length+" points en attente","j-pending",undefined,"primary")+'</div><div class="j-pick-list">'+priorities.slice(0,3).map(e=>'<button type="button" data-j-entry="'+A(e.id)+'"><span>'+E(e.title)+'</span>'+documentPill(p,e)+'<strong>Reprendre ›</strong></button>').join("")+(pending.length?'':'<p>Toutes les rubriques ont une revue enregistrée.</p>')+'</div></section>'
 +'<details class="j-disclosure v4-card" data-v4-section="files" '+(ui.sections.files?'open':'')+'><summary>Documents classés</summary>'+button('Choisir un dossier sur mon PC','folder-pick')+documentBrowser(p)+'</details>'+'<details class="j-disclosure v4-card" data-v4-section="actions" '+(ui.sections.actions?'open':'')+'><summary>Plan d’actions ('+countActions(p)+' à traiter)</summary>'+actionList(p)+'</details>'
 +'<details class="j-disclosure v4-card" data-v4-section="references" '+(ui.sections.references?'open':'')+'><summary>Références et exigences</summary>'+normReviewSummary(p)+'<div class="v4-actions"><button type="button" class="v4-button" data-v5-gspr>Matrice des exigences MDR</button><button type="button" class="v4-button" data-std-export>Exporter les normes CSV</button></div></details>'+'<details class="j-disclosure v4-card" data-v4-section="exports" '+(ui.sections.exports?'open':'')+'><summary>Rapports, exports et sauvegarde</summary>'+exportCards(p)+'</details>'
 +'<div class="v4-actions j-export">'+button("Exporter la synthèse","report",undefined,"primary")+button("Exporter le dossier ZIP","zip")+button("Sauvegarder le projet JSON","json")+'</div><p class="v4-muted">Bilan interne — validation humaine requise. Les 30 rubriques constituent une base à compléter selon le projet.</p></div>';
}
function documentBrowser(p){
 const folders=pickFolder(ui.scope),folder=D.folder(ui.folder),entries=pickEntry(folder.id),selected=D.entry(ui.entry);
 const scope=ui.scope;
 const nav='<div class="v4-scope">'+[["mdr","Dossier MDR"],["smq","SMQ ISO 13485"]].map(function(r){return '<button type="button" data-v4-scope="'+r[0]+'" class="'+(scope===r[0]?'active':'')+'">'+E(r[1])+'</button>';}).join("")+'</div>';
 const tree='<aside class="v4-card">'+nav+'<div class="v4-folders">'+folders.map(function(f){
  const docs=D.expected.filter(function(x){return x.folder===f.id;});
  const reviewed=docs.filter(function(x){return status(p,x.id)==="reviewed";}).length;
  return '<button type="button" class="v4-folder '+(f.id===ui.folder?'selected':'')+'" data-v4-folder="'+A(f.id)+'"><span>'+E(f.title)+'</span><b>'+reviewed+'/'+docs.length+'</b></button>';
 }).join("")+'</div></aside>';
 const rows='<section class="v4-card"><h2>'+E(folder.title)+'</h2><p class="v4-muted">Cliquez sur un livrable pour voir les attentes, les preuves et ses contrôles.</p>'
 +'<div class="v4-entrylist">'+entries.map(function(x){return '<button type="button" class="v4-entry '+(ui.entry===x.id?'active':'')+'" data-v4-entry="'+A(x.id)+'"><span><strong>'+E(x.title)+'</strong><small>'+E(x.ref)+'</small></span>'+pill(status(p,x.id))+'</button>';}).join("")+'</div>'
 +itemDetail(p,selected)+'</section>';
 return '<div class="v4-dossier-layout">'+tree+rows+'</div>';
}

function actionList(p){
 const v=D.ensure(p);
 return '<section class="v4-card"><h2>Plan d’actions</h2>'+(v.actions.length?v.actions.map(function(x){return '<div class="v4-action" data-v4-action-id="'+A(x.id)+'"><div><strong>'+E(x.title)+'</strong><small>'+E(x.entry)+' · '+E(x.createdAt||"")+'</small></div><div><label class="v4-field">Responsable<input data-v4-action-field="owner" value="'+A(x.owner||"")+'" placeholder="À affecter"></label></div><div><label class="v4-field">Échéance<input type="date" data-v4-action-field="due" value="'+A(x.due||"")+'"></label></div><div><label class="v4-field">Statut<select data-v4-action-field="status">'+[["open","À faire"],["doing","En cours"],["closed","Clôturée"]].map(function(y){return '<option value="'+y[0]+'" '+(x.status===y[0]?'selected':'')+'>'+E(y[1])+'</option>';}).join("")+'</select></label></div></div>';}).join(""):'<div class="v4-empty">Aucune action créée.</div>')
 +'</section>';
}
function exportCards(p){
 const card=function(heading,txt,btn){return '<section class="v4-card v4-report-card"><h2>'+E(heading)+'</h2><p>'+E(txt)+'</p>'+btn+'</section>';};
 return '<div class="v4-exportgrid">'
 +card("Dossier technique ZIP","Arborescence générée, fichiers réellement conservés dans le navigateur, index JSON et références documentaires.",button("Exporter l'arborescence et les preuves","zip",undefined,"primary"))
 +card("Rapport d'audit V4","Statut de chaque livrable, décisions documentées, références des preuves, constats et actions.",button("Exporter le rapport HTML","report"))
 +card("Matrice des preuves","Correspondance des documents attendus avec les preuves, révisions et résultats de revue.",button("Exporter la matrice CSV","matrix"))
 +card("Plan d'actions","Écarts ouverts, responsables et échéances, y compris les nouveaux documents à créer.",button("Exporter les actions CSV","actions-export"))
 +card("Audit documentaire historique","Conserver l'accès au rapport détaillé et à la grille de contrôle de la V3.",'<button class="v4-button" type="button" data-df-export="full">Revue V3 détaillée</button>')
 +card("Sauvegarde et transfert","Le JSON enregistre les références et les décisions, mais pas les fichiers binaires. Pour transférer les preuves, exporter aussi le ZIP.",button("Télécharger la sauvegarde JSON","json"))
 +'</div>';
}
return {proof,recap,bilan};
}};
})();
