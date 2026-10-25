(function(){
'use strict';
const kind=document.body.dataset.tool;
const model=window.ORBIVIA_PUBLIC_TOOLS.create({classification:window.ORBIVIA_CLASSIFICATION,norms:window.ORBIVIA_NORMES_MODEL,questions:window.ORBIVIA_NORMES_QUESTIONS,catalogue:window.ORBIVIA_NORMES_CATALOGUE,explanations:window.ORBIVIA_NORMES_EXPLICATIONS});
const guide=window.ORBIVIA_CLARIFICATION;
const E=model.escape,key='orbivia-public-'+kind+'-v1',app=document.getElementById('tool-app');
let state=model.restore(kind,null),storageOK=true,locked=false,reviewMode=false,reviewSeen=[],reportURL=null;
try{state=model.restore(kind,JSON.parse(localStorage.getItem(key)||'null'));}catch(_error){storageOK=false;}
reviewMode=state.reviewMode;reviewSeen=state.reviewSeen;
function save(){state.reviewMode=reviewMode;state.reviewSeen=reviewSeen;try{localStorage.setItem(key,JSON.stringify(state));storageOK=true;}catch(_error){storageOK=false;}}
function action(label,name,classes=''){return '<button type="button" class="tool-button '+classes+'" data-action="'+name+'">'+label+'</button>';}
function questionHelp(q,inline=false){
 const n=window.ORBIVIA_NORMES_AIDES?.[q.id],text=kind==='classification'?q.example:n?.text;
 const examples=q.examples||window.ORBIVIA_QUESTION_EXAMPLES?.[kind]?.[q.id]||[];
 const sources=q.sources?.map(s=>'<a href="'+E(s.url)+'" target="_blank" rel="noopener noreferrer">'+E(s.label)+' ↗</a>').join('');
 const criterion=kind==='classification'?window.ORBIVIA_QUESTION_PRESENTATION?.questions[q.id]?.sourceLabel:null;
 const content=(criterion?'<strong>Critère examiné</strong><p>'+E(criterion)+'</p>':'')+'<strong>Pour répondre</strong><p>'+E(text||'Répondez d’après les caractéristiques et les usages prévus du dispositif.')+'</p>'+(kind==='norms'&&n?.example?'<p>'+E(n.example)+'</p>':'')+(examples.length?'<strong class="examples-heading">Exemples de produits</strong><ul class="product-examples">'+examples.map(item=>'<li>'+E(item)+'</li>').join('')+'</ul>':'')+(kind==='norms'?'<strong>Sources pour approfondir</strong><p>'+E(n?.sourceNote||'Applicabilité et édition à vérifier.')+'</p>':'')+(sources||(kind==='classification'?'<a href="https://eur-lex.europa.eu/eli/reg/2017/745/oj" target="_blank" rel="noopener noreferrer">'+(q.id==='scope'?'MDR — définitions et annexe XVI':'MDR — annexe VIII')+' ↗</a><a href="https://health.ec.europa.eu/system/files/2021-10/mdcg_2021-24_en_0.pdf" target="_blank" rel="noopener noreferrer">Guide MDCG 2021-24 rév.1 · avril 2026 ↗</a>':(n?.sources||[]).map(s=>'<a href="'+E(s.url)+'" target="_blank" rel="noopener noreferrer">'+E(s.label)+' ↗</a>').join('')));
 return inline?'<div class="guide-explanation">'+content+'</div>':'<details class="info-bubble"><summary aria-label="Comprendre cette question">i</summary><div>'+content+'</div></details>';
}
function focus(){const h=app.querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}window.scrollTo({top:0,behavior:'auto'});}
function renderQuestion(){
 const qs=model.visible(kind,state.answers),q=qs.find(q=>q.id===state.cursor)||qs.find(q=>!model.visited(q,state.answers))||qs[0];state.cursor=q.id;
 if(state.assistance?.question===q.id){renderAssistance(q);return;}
 const isScope=kind==='classification'&&q.id==='scope';
 const presentation=kind==='classification'?window.ORBIVIA_QUESTION_PRESENTATION:null;
 const view=presentation?presentation.view(q):{title:q.label,criterion:q.intro||'',options:q.options,descriptions:q.optionHelp||{}};
 const options=isScope?view.options.filter(([value])=>value!=='annex16'):view.options;
 const choiceLayout=options.length>=4?'many':q.options.every(([,label])=>label.length<28)?'short':'long';
 const at=qs.findIndex(x=>x.id===q.id),{percent,theme}=model.progress(kind,state.answers,q.id);
 app.innerHTML='<div class="question-progress"><span>'+E(theme)+(reviewMode?' · À préciser':'')+'<b>'+percent+' % parcouru</b></span><progress aria-label="Avancement du questionnaire" max="100" value="'+percent+'"></progress></div><section class="question-card'+(isScope?' scope-card':'')+'"><div class="question-prompt"><div class="question-heading"><h1>'+E(view.title).replace(/\s+\?$/,'&nbsp;?')+'</h1>'+questionHelp(q)+'</div>'+(view.criterion?'<p class="question-intro">'+E(view.criterion)+'</p>':'')+'</div><div class="answer-list choices-'+choiceLayout+(Object.keys(view.descriptions).length?' explained-choices':'')+(kind==='classification'&&q.id==='scope'?' scope-choices':'')+'">'+options.map(([value,label])=>'<button type="button" class="answer '+(state.answers[q.id]===value?'selected':'')+'" data-answer="'+E(value)+'" data-question="'+E(q.id)+'" aria-pressed="'+(state.answers[q.id]===value)+'">'+(presentation?presentation.answerIcon(q,value):'<span aria-hidden="true"></span>')+'<span class="answer-copy">'+E(label)+(view.descriptions[value]?'<small>'+E(view.descriptions[value])+'</small>':'')+'</span></button>').join('')+'</div>'+(isScope?'':'<button type="button" class="help-choice" data-action="assist-start">Je ne sais pas — aidez-moi à répondre</button><details class="comment" '+(state.comments[q.id]?'open':'')+'><summary>Commentaire</summary><label for="question-comment" class="sr-only">Commentaire sur cette réponse</label><textarea id="question-comment" data-comment="'+E(q.id)+'" rows="3">'+E(state.comments[q.id]||'')+'</textarea></details>')+'</section><div class="question-controls">'+(isScope?'':action('← Précédent','previous'))+action('Reprendre à zéro','restart','quiet')+'</div><p class="save-status" id="save-status" role="status">'+(storageOK?'':'Enregistrement indisponible sur cet appareil.')+'</p>';
 if(presentation)presentation.reservePrompt(app);
 const previous=app.querySelector('[data-action="previous"]');if(previous)previous.disabled=at===0;
}
function renderAssistance(q){
 const draft=state.assistance;if(draft.version!==guide.version){draft.path=[];draft.version=guide.version;}const view=guide.view(kind,q,draft.path);draft.path=view.path;
 const {percent,theme}=model.progress(kind,state.answers,q.id);
 let content;
 if(view.type==='step'){
  content='<h1>'+E(view.question)+'</h1><div class="answer-list guide-answers'+(view.options.every(([,label])=>label.length<20)?' guide-short':'')+'">'+view.options.map(([value,label])=>'<button type="button" class="answer" data-probe="'+E(value)+'">'+E(label)+'</button>').join('')+'</div><button type="button" class="help-choice" data-probe="?">Je ne sais toujours pas</button>';
 }else{
  const label=view.value==='unresolved'?'Ce point reste à préciser':q.options.find(([v])=>v===view.value)[1];
  content='<span class="eyebrow">'+(view.value==='unresolved'?'Aide non concluante':'Proposition à confirmer')+'</span><h1>'+E(label)+'</h1>'+(view.trace.length?'<details class="guide-rationale"><summary>'+view.trace.length+' précision(s) à l’origine de cette proposition</summary><ul class="guide-trace">'+view.trace.map(item=>'<li>'+E(item.question)+' <strong>'+E(item.answer)+'</strong></li>').join('')+'</ul></details>':'')+'<p class="guide-note">'+E(view.value==='unresolved'?'Vous pouvez continuer. Le résultat restera provisoire et ce point sera accessible directement à la fin.':'Cette proposition repose uniquement sur les précisions que vous venez d’apporter. Confirmez-la si elle correspond à l’usage prévu du produit.')+'</p>'+action(view.value==='unresolved'?'Continuer avec ce point à préciser':'Confirmer et continuer','assist-commit','primary');
 }
 app.innerHTML='<div class="question-progress"><span>'+E(theme)+'<b>'+percent+' % parcouru</b></span><progress aria-label="Avancement du questionnaire" max="100" value="'+percent+'"></progress></div><section class="question-card assistance-card"><p class="guide-parent">Aide au choix · '+E(q.label)+'</p>'+content+'<details class="guide-context"><summary>Exemples et explication de la question</summary>'+questionHelp(q,true)+'</details></section><div class="question-controls">'+action('← Étape précédente','assist-back')+action('Revenir à la question','assist-close','quiet')+'</div>';
 app.querySelector('[data-action="assist-back"]').disabled=!draft.path.length;
}
function answerQuestion(q,value,clarification){
 state.answers[q.id]=value;state.assistance=null;
 if(kind==='classification'&&q.id==='scope'&&value==='other'&&!clarification){state.result=false;state.cursor='scope';state.assistance={question:'scope',version:guide.version,path:[]};save();render();focus();return;}
 if(clarification)state.clarifications[q.id]={value,steps:clarification.trace};else delete state.clarifications[q.id];
 const nextQuestions=model.visible(kind,state.answers);let next;
 if(reviewMode){reviewSeen.push(q.id);next=nextQuestions.find(x=>!model.resolved(x,state.answers)&&!reviewSeen.includes(x.id));}
 else if(state.editing){next=nextQuestions.find(x=>!model.visited(x,state.answers));state.editing=false;}
 else next=nextQuestions[nextQuestions.findIndex(x=>x.id===q.id)+1];
 if(next){state.cursor=next.id;state.result=false;}else{state.result=true;reviewMode=false;}
 save();render();focus();locked=true;app.querySelectorAll('[data-answer]').forEach(x=>x.disabled=true);setTimeout(()=>{locked=false;app.querySelectorAll('[data-answer]').forEach(x=>x.disabled=false);},250);
}
function normRow(r){return '<details class="norm-row" data-reference="'+E((r.id+' '+r.title).toLocaleLowerCase('fr'))+'"><summary><span><strong>'+E(r.id)+'</strong><span>'+E(r.title)+'</span></span><span class="row-info" aria-label="Explication et source">i</span></summary><div class="norm-detail"><h3>Pourquoi cette référence ?</h3><ul>'+r.reasons.map(reason=>'<li>'+E(reason)+'</li>').join('')+'</ul><h3>Ce qu’elle couvre</h3><p>'+E(r.scope)+'</p><p>'+E(r.use)+'</p><a href="'+E(r.url)+'" target="_blank" rel="noopener noreferrer">'+E(r.sourceLabel)+' ↗</a><p class="muted">Édition, amendements et statut d’harmonisation à vérifier.</p></div></details>';}
function renderOrientation(info){
 app.innerHTML='<div class="result-heading"><span class="eyebrow">Orientation du produit</span><h1>'+E(info.title)+'</h1></div><section class="result-card"><p>'+E(info.text)+'</p>'+(info.url?'<p><a href="'+E(info.url)+'" target="_blank" rel="noopener noreferrer">'+E(info.source)+' ↗</a></p>':'')+'</section><div class="question-controls">'+(kind==='classification'&&state.answers.scope==='ivd'&&state.answers.ivdQualification==='no'?action('Revoir la qualification IVDR','qualification-change','primary'):'')+action('Modifier le type de produit','scope-change','quiet')+action('M’aider à choisir','scope-help','quiet')+'</div><p class="scope-note">Le parcours de classification se poursuit lorsque le cadre MDR ou IVDR et la destination du produit sont établis.</p>';
}
function renderResult(){
 const r=model.analysis(kind,state.answers),isClass=kind==='classification',ivd=isClass&&r.regulation==='IVDR',qs=model.visible(kind,state.answers),pending=qs.filter(q=>!model.resolved(q,state.answers));
 let body='<div class="result-heading"><span class="eyebrow">Votre résultat</span><h1>'+E(isClass?(ivd?'Classification IVDR':'Classification MDR'):'Normes du dispositif')+'</h1></div>';
 if(isClass){
  const principal=r.complete?r.rules.find(x=>x.applies==='yes'&&x.class===r.highest):null;
  body+='<section class="result-card"><p class="muted">'+(r.complete?'Classe proposée à partir de vos réponses':'Des points restent à préciser')+'</p><strong class="class-value">'+E(r.complete?r.highest:'À préciser')+'</strong><p>'+E(r.complete?'Règles retenues : '+r.rules.filter(x=>x.applies==='yes'&&(r.complete||!(ivd?[6]:[1,13]).includes(x.n))).map(x=>x.n).join(', ')+'. La classe la plus élevée est proposée.':'Aucune classe définitive proposée pour cette analyse.')+'</p>'+(principal?'<div class="result-reason"><h2>Pourquoi cette classe ?</h2><p><b>Règle '+E(principal.n)+'</b> · '+E(principal.reason)+'</p></div>':'')+'<details class="result-detail"><summary>Comprendre les règles retenues</summary>'+r.rules.filter(x=>x.applies==='yes'&&(r.complete||!(ivd?[6]:[1,13]).includes(x.n))).map(x=>'<p><b>Règle '+x.n+' · '+E(x.class)+'</b><br>'+E(x.reason)+'</p>').join('')+(r.missing.length?'<ul>'+r.missing.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul>':'')+'<a href="'+E(r.source||'https://eur-lex.europa.eu/eli/reg/2017/745/oj')+'" target="_blank" rel="noopener noreferrer">'+E(r.sourceLabel||'MDR — annexe VIII')+' ↗</a></details></section>';
  if(r.sterileA)body+='<p class="scope-note">Classe A stérile : intervention de l’organisme notifié sur les aspects de stérilité (IVDR, article 48, paragraphe 10).</p>';
  for(const note of r.notes||[])body+='<p class="scope-note">'+E(note)+'</p>';
 }else{
  if(state.answers.ivd==='yes')body+='<p class="scope-note">Profil diagnostic in vitro signalé : les références IVDR sont complémentaires. Ce questionnaire ne réalise pas la qualification ni la classification IVDR.</p>';
  body+='<section class="result-card norm-summary"><strong>'+r.suggested.length+'</strong><div><h2>références proposées</h2><p>'+r.answered+' / '+r.total+' caractéristiques précisées.</p></div></section><p class="result-note">'+E(r.complete?'Consultez les références pour retrouver les raisons et les sources.':'Résultat provisoire : les caractéristiques à préciser peuvent ajouter ou modifier les références proposées.')+'</p><label class="reference-search">Retrouver une référence<input type="search" data-search placeholder="ISO, IEC, logiciel, risques…"></label><p class="save-status" id="reference-count" role="status">'+r.suggested.length+' références affichées</p><div class="reference-list">'+r.suggested.map(normRow).join('')+'</div><p id="no-references" class="result-note" hidden>Aucune référence ne correspond à cette recherche.</p>'+(r.possible.length?'<details class="result-detail"><summary>'+r.possible.length+' autres pistes conditionnelles</summary><p>Ces références dépendent de caractéristiques restant à confirmer.</p><ul>'+r.possible.map(x=>'<li><a href="'+E(x.url)+'" target="_blank" rel="noopener noreferrer">'+E(x.id)+' — '+E(x.title)+'</a></li>').join('')+'</ul></details>':'');
 }
 body+='<p class="scope-note">'+E(isClass?'Proposition '+(ivd?'IVDR':'MDR')+' à vérifier selon la destination et les variantes du dispositif ; ne vaut pas validation réglementaire.':'Applicabilité, périmètre, édition et harmonisation à vérifier pour chaque référence. Liste non exhaustive.')+'</p>';
 if(pending.length)body+='<div class="pending-box"><span>'+pending.length+' réponse(s) à préciser</span>'+action('Revoir ces points →','review','quiet')+'</div>';
 body+='<div class="export-actions"><a class="tool-button primary" id="pdf-download" aria-disabled="true">Préparation du PDF…</a></div><p class="save-status">Synthèse sur une page : résultat, raisons et sources.</p><details class="result-detail answers-review"><summary>Relire ou modifier mes réponses</summary>'+model.answerRows(kind,state).map(q=>'<div class="answer-row"><div><span>'+E(q.label)+'</span><b>'+E(q.answer)+'</b>'+(q.comment?'<p>'+E(q.comment)+'</p>':'')+(q.guidance.length?'<details><summary>Précisions apportées dans l’aide</summary>'+q.guidance.map(step=>'<p>'+E(step.question)+' '+E(step.answer)+'</p>').join('')+'</details>':'')+'</div><button type="button" class="text-button" data-edit="'+E(q.id)+'">Modifier</button></div>').join('')+'</details><div class="result-bottom">'+action('← Questionnaire','back','quiet')+action('Reprendre à zéro','restart','quiet')+'</div>';
 app.innerHTML=body;
 if(!isClass){
  const references=document.createElement('details');references.className='result-detail reference-browser';
  references.innerHTML='<summary>Consulter les '+r.suggested.length+' références proposées</summary>';
  const conditional=app.querySelector('.result-detail:not(.answers-review)');
  app.querySelectorAll('.reference-search,#reference-count,.reference-list,#no-references').forEach(el=>references.append(el));
  if(conditional)references.append(conditional);
  app.querySelector('.answers-review').before(references);
 }
 preparePDF(app.querySelector('#pdf-download'));
}
async function preparePDF(button){
 button.setAttribute('aria-disabled','true');button.textContent='Préparation du PDF…';
 try{
  const bytes=await window.ORBIVIA_TOOL_PDF.create(model.summary(kind,state));
  if(!button.isConnected)return;
  if(reportURL)URL.revokeObjectURL(reportURL);
  reportURL=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
  button.href=reportURL;button.download='ORBIVIA_'+(kind==='classification'?(state.answers.scope==='ivd'?'classification_IVDR':'classification_MDR'):'normes_dispositif')+'_'+new Date().toISOString().slice(0,10)+'.pdf';
  button.textContent='Exporter le résultat en PDF';button.removeAttribute('data-action');button.removeAttribute('aria-disabled');
 }catch(error){button.textContent='Réessayer l’export PDF';button.dataset.action='export-pdf';button.removeAttribute('aria-disabled');console.error('Export PDF indisponible',error);}
}

function render(){if(kind==='classification'){const ivd=state.answers.scope==='ivd';document.title='Classification '+(ivd?'IVDR':'MDR')+' | ORBIVIA';const crumb=document.querySelector('.tool-breadcrumb span');if(crumb)crumb.textContent='Classification '+(ivd?'IVDR':'MDR');}const orientation=model.orientation(kind,state.answers);if(state.result&&orientation){document.body.classList.remove('is-question','is-result');renderOrientation(orientation);return;}if(state.result){const missing=model.visible(kind,state.answers).find(q=>!model.visited(q,state.answers));if(missing){state.result=false;state.cursor=missing.id;}}document.body.classList.toggle('is-question',!state.result);document.body.classList.toggle('is-result',state.result);if(state.result)renderResult();else renderQuestion();}
function moveTo(q){state.cursor=q.id;state.result=false;save();render();focus();}
document.addEventListener('click',event=>{
 const b=event.target.closest('[data-answer],[data-action],[data-edit],[data-probe]');if(!b||b.disabled)return;
 const qs=model.visible(kind,state.answers),at=qs.findIndex(q=>q.id===state.cursor),cmd=b.dataset.action;
 const current=qs.find(q=>q.id===state.cursor);
 if(cmd==='qualification-change'){state.editing=true;reviewMode=false;state.assistance=null;moveTo(qs.find(q=>q.id==='ivdQualification'));return;}
 if(cmd==='scope-change'||cmd==='scope-help'){state.editing=true;reviewMode=false;state.assistance=cmd==='scope-help'?{question:'scope',version:guide.version,path:[]}:null;moveTo(qs.find(q=>q.id==='scope'));return;}
 if(cmd==='assist-start'&&current){state.assistance={question:current.id,version:guide.version,path:[]};save();render();focus();return;}
 if(b.hasAttribute('data-probe')&&state.assistance&&current){
  if(locked)return;locked=true;setTimeout(()=>{locked=false;},250);
  const view=guide.view(kind,current,state.assistance.path);if(view.type!=='step')return;
  if(b.dataset.probe!=='?'&&!view.options.some(([v])=>v===b.dataset.probe))return;
  state.assistance.path=[...view.path,b.dataset.probe];save();render();focus();return;
 }
 if(cmd==='assist-back'&&state.assistance){state.assistance.path.pop();save();render();focus();return;}
 if(cmd==='assist-close'){state.assistance=null;save();render();focus();return;}
 if(cmd==='assist-commit'&&state.assistance&&current){
  const view=guide.view(kind,current,state.assistance.path);if(view.type==='proposal')answerQuestion(current,view.value,view);return;
 }
 if(b.hasAttribute('data-answer')){
  if(locked)return;const q=qs.find(q=>q.id===b.dataset.question);if(!q)return;
  answerQuestion(q,b.dataset.answer);return;
 }
 if(b.dataset.edit){state.assistance=null;state.editing=true;reviewMode=false;const q=qs.find(q=>q.id===b.dataset.edit);if(q)moveTo(q);return;}
 if(cmd==='previous'){if(at>0){model.rewind(kind,state,qs[at-1].id);reviewMode=false;reviewSeen=[];moveTo(qs[at-1]);}return;}
 if(cmd==='back'){state.result=false;reviewMode=false;save();render();focus();return;}
 if(cmd==='review'){const q=qs.find(x=>!model.resolved(x,state.answers));if(q){reviewMode=true;reviewSeen=[];state.assistance={question:q.id,version:guide.version,path:[]};moveTo(q);}return;}
 if(cmd==='export-pdf'){preparePDF(b);return;}
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
