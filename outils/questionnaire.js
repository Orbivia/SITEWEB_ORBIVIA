(function(){
'use strict';
const kind=document.body.dataset.tool;
const model=window.ORBIVIA_PUBLIC_TOOLS.create({classification:window.ORBIVIA_CLASSIFICATION,norms:window.ORBIVIA_NORMES_MODEL,questions:window.ORBIVIA_NORMES_QUESTIONS,catalogue:window.ORBIVIA_NORMES_CATALOGUE,explanations:window.ORBIVIA_NORMES_EXPLICATIONS});
const E=model.escape,key='orbivia-public-'+kind+'-v1',app=document.getElementById('tool-app');
let state=model.restore(kind,null),storageOK=true,locked=false,reviewMode=false,reviewSeen=[],reportURL=null;
try{state=model.restore(kind,JSON.parse(localStorage.getItem(key)||'null'));}catch(_error){storageOK=false;}
function save(){try{localStorage.setItem(key,JSON.stringify(state));storageOK=true;}catch(_error){storageOK=false;}const status=document.getElementById('save-status');if(status)status.textContent=storageOK?'Réponses enregistrées dans ce navigateur.':'Enregistrement indisponible : exportez le résultat avant de quitter.';}
function action(label,name,classes=''){return '<button type="button" class="tool-button '+classes+'" data-action="'+name+'">'+label+'</button>';}
function questionHelp(q){
 const n=window.ORBIVIA_NORMES_AIDES?.[q.id],text=kind==='classification'?q.example:n?.text;
 return '<details class="info-bubble"><summary aria-label="Comprendre cette question">i</summary><div><strong>Pour répondre</strong><p>'+E(text||'Répondez d’après les caractéristiques et les usages prévus du dispositif.')+'</p>'+(kind==='norms'&&n?.example?'<p>'+E(n.example)+'</p>':'')+(kind==='classification'?'<a href="https://eur-lex.europa.eu/eli/reg/2017/745/oj" target="_blank" rel="noopener noreferrer">MDR — annexe VIII ↗</a>':(n?.sources||[]).map(s=>'<a href="'+E(s.url)+'" target="_blank" rel="noopener noreferrer">'+E(s.label)+' ↗</a>').join(''))+'</div></details>';
}
function focus(){const h=app.querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}window.scrollTo({top:0,behavior:'auto'});}
function renderQuestion(){
 const qs=model.visible(kind,state.answers),q=qs.find(q=>q.id===state.cursor)||qs.find(q=>!model.visited(q,state.answers))||qs[0];state.cursor=q.id;
 const choiceLayout=q.options.length>=4?'many':q.options.every(([,label])=>label.length<28)?'short':'long';
 const at=qs.findIndex(x=>x.id===q.id),done=qs.filter(x=>model.visited(x,state.answers)).length,percent=Math.round(100*done/qs.length);
 app.innerHTML='<div class="question-progress"><span>Question '+(at+1)+' sur '+qs.length+(reviewMode?' · Points à préciser':'')+'<b>'+percent+' % parcouru</b></span><progress aria-label="Avancement du questionnaire" max="'+qs.length+'" value="'+done+'"></progress></div><section class="question-card"><div class="question-heading"><h1>'+E(q.label)+'</h1>'+questionHelp(q)+'</div><div class="answer-list choices-'+choiceLayout+'">'+[...q.options,['checking','À vérifier']].map(([value,label])=>'<button type="button" class="answer '+(state.answers[q.id]===value?'selected':'')+'" data-answer="'+E(value)+'" data-question="'+E(q.id)+'" aria-pressed="'+(state.answers[q.id]===value)+'"><span aria-hidden="true"></span>'+E(label)+'</button>').join('')+'</div><details class="comment" '+(state.comments[q.id]?'open':'')+'><summary>Ajouter un commentaire</summary><label for="question-comment" class="sr-only">Commentaire sur cette réponse</label><textarea id="question-comment" data-comment="'+E(q.id)+'" rows="3">'+E(state.comments[q.id]||'')+'</textarea></details></section><div class="question-controls">'+action('← Précédent','previous')+action('Voir mon résultat →','result','quiet')+'</div><p class="save-status" id="save-status" role="status">'+(storageOK?'Réponses enregistrées dans ce navigateur.':'Enregistrement indisponible : exportez le résultat avant de quitter.')+'</p>';
 app.querySelector('[data-action="previous"]').disabled=at===0;
}
function normRow(r){return '<details class="norm-row" data-reference="'+E((r.id+' '+r.title).toLocaleLowerCase('fr'))+'"><summary><span><strong>'+E(r.id)+'</strong><span>'+E(r.title)+'</span></span><span class="row-info" aria-label="Explication et source">i</span></summary><div class="norm-detail"><h3>Pourquoi cette référence ?</h3><ul>'+r.reasons.map(reason=>'<li>'+E(reason)+'</li>').join('')+'</ul><h3>Ce qu’elle couvre</h3><p>'+E(r.scope)+'</p><p>'+E(r.use)+'</p><a href="'+E(r.url)+'" target="_blank" rel="noopener noreferrer">'+E(r.sourceLabel)+' ↗</a><p class="muted">Édition, amendements et statut d’harmonisation à vérifier.</p></div></details>';}
function renderResult(){
 const r=model.analysis(kind,state.answers),isClass=kind==='classification',qs=model.visible(kind,state.answers),pending=qs.filter(q=>!model.known(q,state.answers));
 let body='<div class="result-heading"><span class="eyebrow">Votre résultat</span><h1>'+E(isClass?'Classification MDR':'Normes du dispositif')+'</h1></div>';
 if(isClass){
  body+='<section class="result-card"><p class="muted">'+(r.complete?'Classe proposée à partir de vos réponses':'Des points restent à préciser')+'</p><strong class="class-value">'+E(r.complete?r.highest:'À vérifier')+'</strong><p>'+E(r.complete?'Règles retenues : '+r.rules.filter(x=>x.applies==='yes').map(x=>x.n).join(', ')+'. La classe la plus élevée est proposée.':'Aucune classe définitive proposée pour cette analyse.')+'</p><details class="result-detail"><summary>Comprendre le résultat</summary>'+r.rules.filter(x=>x.applies==='yes').map(x=>'<p><b>Règle '+x.n+' · '+E(x.class)+'</b><br>'+E(x.reason)+'</p>').join('')+(r.missing.length?'<ul>'+r.missing.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul>':'')+'<a href="https://eur-lex.europa.eu/eli/reg/2017/745/oj" target="_blank" rel="noopener noreferrer">MDR — annexe VIII ↗</a></details></section>';
 }else{
  if(state.answers.ivd==='yes')body+='<p class="scope-note">Profil diagnostic in vitro signalé : les références IVDR sont complémentaires. Ce questionnaire ne réalise pas la qualification ni la classification IVDR.</p>';
  body+='<section class="result-card norm-summary"><strong>'+r.suggested.length+'</strong><div><h2>références proposées</h2><p>'+r.answered+' / '+r.total+' caractéristiques précisées.</p></div></section><p class="result-note">'+E(r.complete?'Consultez les références pour retrouver les raisons et les sources.':'Résultat provisoire : les caractéristiques à préciser peuvent ajouter ou modifier les références proposées.')+'</p><label class="reference-search">Retrouver une référence<input type="search" data-search placeholder="ISO, IEC, logiciel, risques…"></label><p class="save-status" id="reference-count" role="status">'+r.suggested.length+' références affichées</p><div class="reference-list">'+r.suggested.map(normRow).join('')+'</div><p id="no-references" class="result-note" hidden>Aucune référence ne correspond à cette recherche.</p>'+(r.possible.length?'<details class="result-detail"><summary>'+r.possible.length+' autres pistes conditionnelles</summary><p>Ces références dépendent de caractéristiques restant à confirmer.</p><ul>'+r.possible.map(x=>'<li><a href="'+E(x.url)+'" target="_blank" rel="noopener noreferrer">'+E(x.id)+' — '+E(x.title)+'</a></li>').join('')+'</ul></details>':'');
 }
 body+='<p class="scope-note">'+E(isClass?'Proposition à vérifier selon la destination et les variantes du dispositif ; ne vaut pas validation réglementaire.':'Applicabilité, périmètre, édition et harmonisation à vérifier pour chaque référence. Liste non exhaustive.')+'</p>';
 if(pending.length)body+='<div class="pending-box"><span>'+pending.length+' réponse(s) à préciser</span>'+action('Revoir ces points →','review','quiet')+'</div>';
 if(reportURL)URL.revokeObjectURL(reportURL);reportURL=URL.createObjectURL(new Blob([model.report(kind,state)],{type:'text/html;charset=utf-8'}));
 const filename='ORBIVIA_'+(isClass?'classification_MDR':'normes_dispositif')+'_'+new Date().toISOString().slice(0,10)+'.html';
 body+='<div class="export-actions"><a class="tool-button primary" href="'+E(reportURL)+'" download="'+filename+'">Exporter le résultat</a>'+action('Imprimer / PDF','print')+'</div><p class="save-status">Export : réponses, raisons, sources et commentaires.</p><details class="result-detail answers-review"><summary>Relire ou modifier mes réponses</summary>'+model.answerRows(kind,state).map(q=>'<div class="answer-row"><div><span>'+E(q.label)+'</span><b>'+E(q.answer)+'</b>'+(q.comment?'<p>'+E(q.comment)+'</p>':'')+'</div><button type="button" class="text-button" data-edit="'+E(q.id)+'">Modifier</button></div>').join('')+'</details><div class="result-bottom">'+action('← Questionnaire','back','quiet')+action('Recommencer','restart','quiet')+'</div>';
 app.innerHTML=body;
 if(!isClass){
  const references=document.createElement('details');references.className='result-detail reference-browser';
  references.innerHTML='<summary>Consulter les '+r.suggested.length+' références proposées</summary>';
  const conditional=app.querySelector('.result-detail:not(.answers-review)');
  app.querySelectorAll('.reference-search,#reference-count,.reference-list,#no-references').forEach(el=>references.append(el));
  if(conditional)references.append(conditional);
  app.querySelector('.answers-review').before(references);
 }
 document.getElementById('print-document').innerHTML=model.reportBody(kind,state);
}
function render(){document.body.classList.toggle('is-question',!state.result);document.body.classList.toggle('is-result',state.result);if(state.result)renderResult();else renderQuestion();}
function moveTo(q){state.cursor=q.id;state.result=false;save();render();focus();}
document.addEventListener('click',event=>{
 const b=event.target.closest('[data-answer],[data-action],[data-edit]');if(!b||b.disabled)return;
 const qs=model.visible(kind,state.answers),at=qs.findIndex(q=>q.id===state.cursor),cmd=b.dataset.action;
 if(b.hasAttribute('data-answer')){
  if(locked)return;const q=qs.find(q=>q.id===b.dataset.question);if(!q)return;
  state.answers[q.id]=b.dataset.answer;
  const nextQuestions=model.visible(kind,state.answers);let next;
  if(reviewMode){reviewSeen.push(q.id);next=nextQuestions.find(x=>!model.known(x,state.answers)&&!reviewSeen.includes(x.id));}
  else if(state.editing){next=nextQuestions.find(x=>!model.visited(x,state.answers));state.editing=false;}
  else next=nextQuestions[nextQuestions.findIndex(x=>x.id===q.id)+1];
  if(next){state.cursor=next.id;state.result=false;}else{state.result=true;reviewMode=false;}
  save();render();focus();locked=true;app.querySelectorAll('[data-answer]').forEach(x=>x.disabled=true);setTimeout(()=>{locked=false;app.querySelectorAll('[data-answer]').forEach(x=>x.disabled=false);},250);return;
 }
 if(b.dataset.edit){state.editing=true;reviewMode=false;const q=qs.find(q=>q.id===b.dataset.edit);if(q)moveTo(q);return;}
 if(cmd==='previous'){state.editing=false;reviewMode=false;if(at>0)moveTo(qs[at-1]);return;}
 if(cmd==='result'){state.result=true;save();render();focus();return;}
 if(cmd==='back'){state.result=false;reviewMode=false;save();render();focus();return;}
 if(cmd==='review'){const q=qs.find(x=>!model.known(x,state.answers));if(q){reviewMode=true;reviewSeen=[];moveTo(q);}return;}
 if(cmd==='print'){window.print();return;}
 if(cmd==='restart'){document.getElementById('restart-dialog').showModal();return;}
 if(cmd==='cancel-restart'){document.getElementById('restart-dialog').close();return;}
 if(cmd==='confirm-restart'){state=model.restore(kind,null);reviewMode=false;reviewSeen=[];save();document.getElementById('restart-dialog').close();render();focus();}
});
document.addEventListener('input',event=>{
 const input=event.target;if(input.dataset.comment){state.comments[input.dataset.comment]=input.value;save();}
 if(input.hasAttribute('data-search')){const query=input.value.toLocaleLowerCase('fr').trim();let visible=0;app.querySelectorAll('[data-reference]').forEach(row=>{row.hidden=!row.dataset.reference.includes(query);if(!row.hidden)visible++;});document.getElementById('reference-count').textContent=visible+' référence'+(visible===1?'':'s')+' affichée'+(visible===1?'':'s');document.getElementById('no-references').hidden=visible>0;}
});
document.addEventListener('click',event=>document.querySelectorAll('.info-bubble[open]').forEach(el=>{if(!el.contains(event.target))el.open=false;}));
document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.info-bubble[open]').forEach(el=>el.open=false);});
render();
})();
