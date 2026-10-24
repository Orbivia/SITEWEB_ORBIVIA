/* ORBIVIA Compliance Studio V3.10 — Matrice GSPR du MDR.
 * Ne vaut ni démonstration de conformité ni statut officiel d'harmonisation.
 * Les décisions et preuves restent locales et sont incluses dans la sauvegarde JSON.
 */
(()=>{
'use strict';
const CATALOG=window.ORBIVIA_GSPR_CATALOGUE||[];
if(!CATALOG.length)throw Error('Référentiel GSPR non chargé');
const VERSION='2026-10-24-mdr-annexI-v2';
const MDR_URL='https://eur-lex.europa.eu/eli/reg/2017/745/oj';
const DECISION_URL='https://single-market-economy.ec.europa.eu/single-market/goods/european-standards/harmonised-standards/medical-devices_en';
const OPT_APPLY=[['pending','À déterminer'],['yes','Applicable'],['no','Non applicable (avec motif)']];
const OPT_EVID=[['pending','Non examinée'],['checking','À vérifier'],['present','Preuve jugée suffisante (revue interne)'],['partial','Preuve partielle ou insuffisante'],['absent','Preuve absente']];
function data(p){const d=df(p);d.gsprMatrix=d.gsprMatrix&&typeof d.gsprMatrix==='object'?d.gsprMatrix:{};const g=d.gsprMatrix;g.entries=g.entries&&typeof g.entries==='object'?g.entries:{};g.filter=g.filter||'priority';g.chapter=g.chapter||'all';return g;}
function hash(v){const s=JSON.stringify(v);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return String(h>>>0)+':'+s.length;}
function classificationContext(p){try{return cqContext(p)||{};}catch(_){return {};}}
function techContext(p){
 const c=classificationContext(p),n=df(p).norms?.answers||{},a={};
 if(c.scope==='annex16')a.annex16='yes';
 else if(['md','accessory'].includes(c.scope))a.annex16='no';
 if(c.form==='software'||c.form==='combined')a.software='yes';
 if(['yes','no'].includes(c.implant))a.implant=c.implant;
 if(['yes','no'].includes(c.nano))a.nano=c.nano;
 if(['yes','no'].includes(c.medicinal))a.medicinal=c.medicinal;
 if(['yes','no'].includes(c.substance))a.substance=c.substance;
 if(c.tissue==='none')a.tissue='no';else if(['animal','human','viable'].includes(c.tissue))a.tissue='yes';
 return {...a,...n};
}
function scope(row,p){
 if(row.tags.includes('base'))return 'priority';
 const ans=techContext(p),vals=row.tags.map(x=>ans[x]);
 if(vals.includes('yes'))return 'priority';
 if(vals.length&&vals.every(x=>x==='no'))return 'likely-out';
 return 'check';
}
function linkedStandards(row,p){
 const r=df(p).norms?.decisions||{},refs=window.ORBIVIA_NORMES_CATALOGUE||[];
 return refs.filter(n=>{
  const d=r[n.id];if(!d||d.status!=='retained')return false;
  return row.links.some(link=>n.id===link||n.id.startsWith(link+'-')||n.id.startsWith(link+'/')||n.id.startsWith(link+' '));
 }).map(x=>({id:x.id,title:x.title,edition:r[x.id]?.edition||''})).sort((a,b)=>a.id.localeCompare(b.id,'fr'));
}
function docOf(p,id){return df(p).documents.find(x=>x.id===id);}
function fingerprint(row,p,e){
 const d=docOf(p,e.documentId);
 return hash({version:VERSION,device:p.device,intended:p.intended,context:row.tags.map(tag=>[tag,techContext(p)[tag]]),qualification:classificationContext(p).scope,scope:scope(row,p),
 standards:linkedStandards(row,p).map(x=>[x.id,x.edition]),doc:d?[d.id,d.title,d.revision,d.date,d.path,d.url,d.size,d.modified]:e.documentId?'DOCUMENT SUPPRIMÉ':null});
}
function check(row,p){
 const e=data(p).entries[row.ref]||{},saved=!!e.savedAt;
 const fresh=saved&&e.basis===fingerprint(row,p,e);
 const closed=e.applicability==='no'&&!!String(e.reason||'').trim();
 const explained=['yes','no'].includes(e.applicability);
 const proof=['present','partial','absent'].includes(e.evidence);
 const reviewed=closed||(e.applicability==='yes'&&proof&&fresh);
 const incomplete=e.applicability==='yes'&&!proof||e.applicability==='pending'||e.evidence==='checking';
 const gap=e.applicability==='yes'&&['partial','absent'].includes(e.evidence)&&fresh;
 return {e,saved,fresh,reviewed:reviewed&&fresh,gap:!!gap,checking:!!(e.evidence==='checking'),incomplete,closed:closed&&fresh,explained};
}
function stats(p){
 let reviewed=0,gaps=0,checking=0,stale=0,applicable=0,excluded=0,open=0,notAssessed=0;
 for(const row of CATALOG){const q=check(row,p);if(q.reviewed)reviewed++;else open++;if(q.gap)gaps++;if(q.checking)checking++;if(q.saved&&!q.fresh)stale++;if(q.e.applicability==='yes'&&q.fresh)applicable++;if(q.closed)excluded++;if(!q.saved)notAssessed++;}
 return {total:CATALOG.length,reviewed,gaps,checking,stale,applicable,excluded,open,notAssessed};
}
function badge(row,p){
 const q=check(row,p);
 if(q.saved&&!q.fresh)return ['À reconfirmer','gspr-warn'];
 if(q.gap)return ['Écart constaté','gspr-danger'];
 if(q.checking)return ['À vérifier','gspr-warn'];
 if(q.closed)return ['N/A justifié','gspr-neutral'];
 if(q.reviewed)return ['Preuve déclarée présente','gspr-success'];
 if(q.e.applicability==='yes')return ['À documenter','gspr-warn'];
 return scope(row,p)==='priority'?['À examiner','gspr-warn']:['Applicabilité à déterminer','gspr-neutral'];
}
function renderRow(row,p){
 const g=data(p),q=check(row,p),e=q.e,b=badge(row,p);
 const standards=linkedStandards(row,p),allDocs=df(p).documents||[],rec=scope(row,p);
 const linked=standards.length?'<ul class="gspr-ref-list">'+standards.map(x=>'<li><b>'+esc(x.id)+'</b>'+ (x.edition?' — '+esc(x.edition):' — édition à confirmer')+'</li>').join('')+'</ul>':'<p class="gspr-empty">Aucune norme retenue liée à ce point. Vérifier les propositions de l’onglet Référentiel.</p>';
 const a='<label>Applicabilité<select name="applicability" class="control">'+OPT_APPLY.map(([v,l])=>'<option value="'+v+'" '+(e.applicability===v?'selected':'')+'>'+l+'</option>').join('')+'</select></label>';
 const ev='<label>État de la preuve<select name="evidence" class="control">'+OPT_EVID.map(([v,l])=>'<option value="'+v+'" '+(e.evidence===v?'selected':'')+'>'+l+'</option>').join('')+'</select></label>';
 const docs='<label>Document rattaché<select name="documentId" class="control"><option value="">Aucun document</option>'+allDocs.map(d=>'<option value="'+attr(d.id)+'" '+(e.documentId===d.id?'selected':'')+'>'+esc(d.title)+(d.revision?' — '+esc(d.revision):'')+'</option>').join('')+'</select></label>';
 return '<details class="gspr-point" data-gspr-row="'+attr(row.ref)+'"><summary><span class="gspr-ref">'+esc(row.ref)+'</span><span class="gspr-name">'+esc(row.title)+'</span><span class="gspr-pill '+b[1]+'">'+b[0]+'</span></summary><div class="gspr-point-body">'+(q.saved&&!q.fresh?'<p class="notice">Le dispositif, les normes ou la référence documentaire ont changé depuis cette revue. Reconfirmer le point après vérification.</p>':'')+'<div class="gspr-context"><div><strong>Applicabilité proposée</strong><p>'+(rec==='priority'?'À examiner en priorité, selon le dispositif et les réponses.':rec==='likely-out'?'Probablement non pertinent ; une exclusion exige une justification.':'À déterminer avec les données techniques du produit.')+'</p></div><div><strong>Preuves documentaires attendues</strong><p>'+esc(row.evidence)+'</p></div></div><div class="gspr-links"><strong>Normes retenues liées à cette exigence</strong>'+linked+'</div><form class="gspr-form" data-gspr-form="'+attr(row.ref)+'"><div class="gspr-fields">'+a+ev+docs+'<label>Référence manuelle / document<input name="reference" class="control" placeholder="N° document, révision..." value="'+attr(e.reference||'')+'"></label><label>Emplacement de la preuve<input name="location" class="control" placeholder="Page, paragraphe, dossier..." value="'+attr(e.location||'')+'"></label><label>Relecteur interne<input name="reviewer" class="control" placeholder="Nom ou fonction" value="'+attr(e.reviewer||'')+'"></label><label>Méthode de démonstration<input name="method" class="control" placeholder="Essai, analyse, calcul, clinique..." value="'+attr(e.method||'')+'"></label></div><label>Constat / observations<textarea name="finding" class="control" rows="2" placeholder="Ce qui a été réellement vérifié...">'+esc(e.finding||'')+'</textarea></label><label>Motif de non-applicabilité (si exclu)<textarea name="reason" class="control" rows="2" placeholder="Justification documentée du périmètre">'+esc(e.reason||'')+'</textarea></label><label>Action à mener (si manque)<textarea name="action" class="control" rows="2" placeholder="Complément, vérification, responsable...">'+esc(e.action||'')+'</textarea></label><div class="gspr-form-actions"><a href="'+MDR_URL+'" target="_blank" rel="noopener">Relire l’annexe I du MDR ↗</a><button class="btn gold" type="submit">Enregistrer la revue</button></div></form></div></details>';
}
function filterRows(p){
 const g=data(p),q=(g.search||'').toLocaleLowerCase('fr');
 return CATALOG.filter(r=>(g.chapter==='all'||g.chapter===r.chapter)&&(!q||(r.ref+' '+r.title+' '+r.evidence).toLocaleLowerCase('fr').includes(q))&& (g.filter==='all'||g.filter==='priority'&&scope(r,p)==='priority'||g.filter==='open'&&!check(r,p).reviewed||g.filter==='issues'&&(check(r,p).gap||check(r,p).checking||check(r,p).saved&&!check(r,p).fresh)||g.filter==='reviewed'&&check(r,p).reviewed));
}
function view(p){
 const z=stats(p),g=data(p),rows=filterRows(p),options=[['priority','Prioritaires'],['open','À examiner'],['issues','Écarts / à vérifier'],['reviewed','Déjà examinées'],['all','Toutes les exigences']];
 const chapterOpts=[['all','Tous les chapitres'],['I','I — Exigences générales'],['II','II — Conception et fabrication'],['III','III — Informations']];
 return '<div class="gspr-work"><div class="gspr-heading"><h2>Matrice MDR — Annexe I</h2><p>Reliez les 23 exigences principales et leurs subdivisions de travail aux normes retenues, documents, constats et actions. Les propositions d’applicabilité ne valent pas décision réglementaire.</p></div><div class="gspr-stats">'+[[z.total,'Lignes de revue'],[z.reviewed,'Décisions revues'],[z.gaps,'Écarts documentés'],[z.open,'À examiner']].map(([n,l])=>'<div><strong>'+n+'</strong><span>'+l+'</span></div>').join('')+'</div><p class="gspr-note">'+z.checking+' points à vérifier · '+z.stale+' revues à reconfirmer · '+z.excluded+' exclusions motivées. Les lignes de détail peuvent recouvrir partiellement leur exigence parente ; ces compteurs mesurent le suivi, pas la conformité.</p><div class="gspr-tools"><label>Afficher<select class="control" data-gspr-filter>'+options.map(([v,l])=>'<option value="'+v+'" '+(g.filter===v?'selected':'')+'>'+l+'</option>').join('')+'</select></label><label>Chapitre<select class="control" data-gspr-chapter>'+chapterOpts.map(([v,l])=>'<option value="'+v+'" '+(g.chapter===v?'selected':'')+'>'+l+'</option>').join('')+'</select></label><label>Rechercher<input class="control" data-gspr-search placeholder="N° d’exigence, preuve..." value="'+attr(g.search||'')+'"></label></div><div class="gspr-actions"><button class="btn" type="button" data-gspr-export>Exporter la matrice CSV</button><button class="btn" type="button" data-gspr-missing>Voir les écarts</button></div><div class="gspr-rows">'+(rows.length?rows.map(r=>renderRow(r,p)).join(''):'<p class="panel pad">Aucune exigence dans ce filtre.</p>')+'</div><p class="gspr-legal">Source réglementaire : <a target="_blank" rel="noopener" href="'+MDR_URL+'">Règlement (UE) 2017/745, annexe I</a>. Statut des normes harmonisées : <a target="_blank" rel="noopener" href="'+DECISION_URL+'">Commission européenne</a>. Intitulés reformulés ; consulter le texte intégral, les sous-exigences et l’édition applicable. Cette grille de travail n’est pas une transcription exhaustive de chaque alinéa.</p></div>';
}
function formRead(form){
 const fd=new FormData(form),v=k=>String(fd.get(k)||'').trim();
 return {applicability:v('applicability'),evidence:v('evidence'),documentId:v('documentId'),reference:v('reference'),location:v('location'),reviewer:v('reviewer'),method:v('method'),finding:v('finding'),reason:v('reason'),action:v('action')};
}
function validate(row,p,e){
 if(!['pending','yes','no'].includes(e.applicability))return 'Statut d’applicabilité invalide.';
 if(!['pending','checking','present','partial','absent'].includes(e.evidence))return 'Statut de preuve invalide.';
 if(e.documentId&&!docOf(p,e.documentId))return 'Référence documentaire introuvable.';
 if(e.applicability==='no'){
  if(!e.reason)return 'Justifier précisément la non-applicabilité.';
  if(e.evidence!=='pending')return 'Une exigence exclue ne peut pas être déclarée comme preuve examinée.';
 }
 if(e.applicability!=='yes'&&e.evidence!=='pending')return 'Déterminer l’applicabilité avant de qualifier les preuves.';
 if(e.applicability==='yes'&&e.evidence==='present'){
  if(!(e.documentId||e.reference)&&!e.location)return 'Indiquer au minimum un document ou une référence et un emplacement précis.';
  if(!(e.documentId||e.reference)||!e.location||!e.finding||!e.reviewer||!e.method)return 'Pour une preuve suffisante : méthode, document/référence, emplacement, constat et relecteur sont requis.';
 }
 if(e.applicability==='yes'&&['partial','absent'].includes(e.evidence)&&!e.finding)return 'Décrire le manque ou l’écart observé.';
 return '';
}
function saveEntry(row,p,value){
 const v={...value};if(v.applicability==='no')v.evidence='pending';const error=validate(row,p,v);if(error)return error;
 if(v.applicability==='no'){v.evidence='pending';v.documentId='';v.reference='';v.location='';}
 v.basis=fingerprint(row,p,v);v.savedAt=new Date().toISOString();
 data(p).entries[row.ref]=v;
 if(df(p).flowComplete)df(p).flowComplete.summary='';
 save();return '';
}
function exportRows(p){
 const rows=[['Exigence MDR','Chapitre','Intitulé résumé','Applicabilité proposée','Applicabilité confirmée','État de preuve','Document','Révision du document','Référence libre','Emplacement','Normes retenues liées','Constat','Motif d’exclusion','Action','Relecteur','Méthode de démonstration','Date revue','Révision périmée']];
 for(const row of CATALOG){
  const a=check(row,p),e=a.e,doc=docOf(p,e.documentId);
  rows.push([row.ref,row.chapter,row.title,scope(row,p),e.applicability||'pending',e.evidence||'pending',doc?.title||'',doc?.revision||'',e.reference||'',e.location||'',linkedStandards(row,p).map(x=>x.id+(x.edition?' '+x.edition:'')).join(' ; '),e.finding||'',e.reason||'',e.action||'',e.reviewer||'',e.method||'',e.savedAt||'',a.saved&&!a.fresh?'Oui':'Non']);
 }
 return rows;
}
function csv(rows){return '\ufeff'+rows.map(r=>r.map(v=>{let s=String(v??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}).join(';')).join('\r\n');}
function exportCSV(p){download(safeName(p.name||'Projet')+'_matrice_GSPR_MDR.csv',csv(exportRows(p)),'text/csv;charset=utf-8');}
function mini(p){
 const z=stats(p);
 return '<section class="gspr-mini panel pad"><div class="gspr-mini-head"><div><h2>Matrice MDR — exigences de sécurité et performance</h2><p class="help">'+z.reviewed+' / '+z.total+' lignes examinées · '+z.gaps+' écart(s) · '+z.checking+' à vérifier · '+z.stale+' à reconfirmer. Compteurs de revue, sans conclusion de conformité.</p></div><button type="button" class="btn gold" data-gspr-open>Ouvrir la matrice</button></div></section>';
}
function report(p){
 const rows=exportRows(p),z=stats(p);
 return '<section><h2>Matrice MDR — Annexe I</h2><p>'+z.reviewed+'/'+z.total+' lignes de revue enregistrées ; '+z.gaps+' écarts déclarés ; '+z.stale+' revues à reconfirmer. Cela ne mesure pas la conformité du dispositif.</p><p>Les intitulés sont simplifiés. Relire le règlement (UE) 2017/745, annexe I, pour les exigences détaillées.</p><table><thead><tr>'+rows[0].slice(0,13).map(s=>'<th>'+esc(s)+'</th>').join('')+'</tr></thead><tbody>'+rows.slice(1).map(row=>'<tr>'+row.slice(0,13).map(c=>'<td>'+esc(c)+'</td>').join('')+'</tr>').join('')+'</tbody></table></section>';
}
const BASE_PROGRESS=flowProgress;
flowProgress=function(p,i){const st=BASE_PROGRESS(p,i);if(i!==2||st.state!=='done')return st;const v=stats(p);if(v.reviewed===v.total)return st;return {state:v.reviewed?'progress':'review',short:v.reviewed+'/'+v.total+' exigences',detail:'Normes sélectionnées, mais la matrice MDR reste à examiner.'};};
const BASE_INVENTORY=dfInventory;
dfInventory=function(p){return mini(p)+BASE_INVENTORY(p);};
const BASE_REVIEW=dfReview;
dfReview=function(p){return mini(p)+BASE_REVIEW(p);};
const BASE_SUMMARY=dfSummary;
dfSummary=function(p){return mini(p)+BASE_SUMMARY(p);};
const BASE_REPORT=dfReport;
dfReport=function(p,full){const html=BASE_REPORT(p,full);return html.includes('</body>')?html.replace('</body>',report(p)+'</body>'):html+report(p);};
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-gspr-open],[data-gspr-export],[data-gspr-missing]');if(!b)return;
 const p=pickProject(),g=data(p);
 if(b.hasAttribute('data-gspr-export')){exportCSV(p);return;}
 if(b.hasAttribute('data-gspr-missing')){g.filter='issues';save();render();return;}
 df(p).normsOpen=true;df(p).norms=df(p).norms||{};df(p).norms.view='matrix';dfNavigate(2);
});
document.addEventListener('change',e=>{
 const t=e.target,p=pickProject(),g=data(p);
 if(t.hasAttribute('data-gspr-filter'))g.filter=t.value;
 else if(t.hasAttribute('data-gspr-chapter'))g.chapter=t.value;
 else return;
 save();render();
});
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.hasAttribute('data-gspr-search')){data(pickProject()).search=t.value;save();return;}
});
document.addEventListener('submit',e=>{
 const f=e.target.closest('[data-gspr-form]');if(!f)return;
 e.preventDefault();const p=pickProject(),row=CATALOG.find(x=>x.ref===f.dataset.gsprForm);if(!row)return;
 const value=formRead(f),error=saveEntry(row,p,value);
 if(error){notify(error,'danger');return;}
 const openRef=row.ref;
 render();
 const escaped=typeof CSS!=='undefined'&&CSS.escape?CSS.escape(openRef):openRef.replaceAll('.','\\.');
 const target=document.querySelector('[data-gspr-row="'+escaped+'"]');
 if(target){target.open=true;target.scrollIntoView({block:'nearest'});}
 notify('Revue de l’exigence '+row.ref+' enregistrée.');
});
window.ORBIVIA_GSPR={screen:view,stats,exportCSV,scope,linkedStandards,check,saveEntry,validate,report,version:VERSION,count:CATALOG.length};
const st=document.createElement('style');
st.textContent='.gspr-work{max-width:1140px;margin:0 auto 40px}.gspr-heading h2{font-size:24px;margin:12px 0 8px}.gspr-heading p,.gspr-note,.gspr-legal{color:#617389;font-size:12px;line-height:1.7}.gspr-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}.gspr-stats>div{background:#fff;border:1px solid #dce3eb;border-radius:12px;padding:17px;display:flex;flex-direction:column;gap:6px}.gspr-stats strong{font-size:26px}.gspr-stats span{font-size:11px;color:#697c91}.gspr-tools{display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:12px;margin:21px 0}.gspr-tools label,.gspr-form label{display:flex;flex-direction:column;gap:7px;font-size:12px;color:#536579;font-weight:600}.gspr-actions{display:flex;gap:8px;flex-wrap:wrap;margin:15px 0}.gspr-rows{display:grid;gap:10px}.gspr-point{border:1px solid #dce3eb;background:#fff;border-radius:11px;overflow:hidden}.gspr-point>summary{cursor:pointer;display:flex;gap:14px;align-items:center;padding:17px 20px;list-style:none}.gspr-point>summary::-webkit-details-marker{display:none}.gspr-point>summary:focus-visible{outline:2px solid #e7a116;outline-offset:-2px}.gspr-ref{color:#6b7c90;font-size:12px;min-width:38px;font-weight:750}.gspr-name{flex:1;font-size:13px;font-weight:700;color:#172338}.gspr-pill{font-size:10px;font-weight:700;border-radius:20px;padding:5px 9px;white-space:nowrap}.gspr-neutral{background:#eef1f5;color:#5f7286}.gspr-warn{background:#fff2dc;color:#8b5a08}.gspr-danger{background:#ffe5e5;color:#a83e43}.gspr-success{background:#e3f4eb;color:#227457}.gspr-point-body{padding:18px 20px 22px;border-top:1px solid #edf0f4}.gspr-context{display:grid;grid-template-columns:1fr 1.4fr;gap:16px}.gspr-context strong,.gspr-links strong{font-size:12px}.gspr-context p{color:#66788e;font-size:12px;line-height:1.55}.gspr-links{padding:12px 0;border-bottom:1px solid #e6ebf0;margin-bottom:18px}.gspr-ref-list{display:flex;gap:8px;flex-wrap:wrap;padding:0;list-style:none;font-size:11px}.gspr-ref-list li{border:1px solid #e5e9f0;border-radius:9px;padding:9px}.gspr-empty{font-size:11px;color:#697c91}.gspr-fields{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:16px}.gspr-form>label{margin-top:13px}.gspr-form .control{width:100%;min-width:0}.gspr-form-actions{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:18px}.gspr-form-actions a{font-size:11px}.gspr-mini{margin-bottom:18px}.gspr-mini-head{display:flex;justify-content:space-between;align-items:center;gap:16px}.gspr-mini h2{font-size:16px}.gspr-mini p{margin:8px 0 0}.gspr-legal{margin:24px 0}.std-tabs .btn{white-space:normal}@media(max-width:850px){.gspr-fields{grid-template-columns:1fr 1fr}}@media(max-width:650px){.gspr-work{padding:0 2px}.gspr-stats{grid-template-columns:1fr 1fr;gap:8px}.gspr-stats>div{padding:12px}.gspr-stats strong{font-size:22px}.gspr-tools{grid-template-columns:1fr}.gspr-point>summary{gap:8px;padding:15px 12px;flex-wrap:wrap}.gspr-name{flex:1;min-width:50%}.gspr-pill{margin-left:40px}.gspr-point-body{padding:14px}.gspr-context,.gspr-fields{grid-template-columns:1fr}.gspr-mini-head{align-items:stretch;flex-direction:column}.gspr-mini-head .btn{width:100%}.gspr-form-actions .btn{width:100%}}';
document.head.append(st);
render();
})();