/* ORBIVIA — V3.12 : interface de travail responsive.
 * Couche de présentation uniquement, aucune migration ni modification de l'évaluation MDR.
 * L'état de classification confirmé est distinct du questionnaire rempli.
 */
(()=>{
'use strict';
const STEPS=['Cadrage','Classification','Normes','Documents','Preuves','Synthèse'];
const SHORT=['Cadrage','Classif.','Normes','Docs','Preuves','Bilan'];
const PAGE_IDS=['guided','classification','proofs','docsummary'];
let currentMenu=null;
function project(){return pickProject();}
function stepIndex(p){
 const d=df(p);
 if(d.normsOpen)return 2;
 if(page==='classification')return 1;
 if(page==='proofs')return 4;
 if(page==='docsummary')return 5;
 return d.step>=2?Math.min(5,d.step+1):d.step;
}
function getHeader(){
 const header=document.querySelector('.topbar');
 if(!header)return null;
 let brand=header.querySelector('#cq-header-brand');
 if(!brand){
  brand=document.createElement('div');brand.id='cq-header-brand';
  const original=document.querySelector('.sidebar .brand .orbivia-logo');
  if(original)brand.append(original.cloneNode(true));
  const b=document.createElement('b');b.textContent='ORBIVIA';brand.append(b);
  header.prepend(brand);
 }
 brand.setAttribute('aria-label','ORBIVIA — R&D Compliance Studio');
 let actions=header.querySelector('.top-project');
 if(!actions)return header;
 if(!actions.querySelector('.v312-menu')){
  const menu=document.createElement('details');menu.className='v312-menu';menu.id='v312-global-actions';
  const trigger=document.createElement('summary');trigger.setAttribute('aria-label','Menu des actions');trigger.setAttribute('title','Actions et paramètres');
  trigger.textContent='⋯';
  const body=document.createElement('div');body.className='v312-menu-popup';
  body.innerHTML='<button type="button" data-export="json">Sauvegarder le projet (JSON)</button>'
  +'<button type="button" data-import>Restaurer un projet (JSON)</button>'
  +'<div class="v312-menu-divider"></div>'
  +'<button type="button" data-unified-tools>Outils avancés</button>'
  +'<button type="button" data-nav="dashboard">Tableau de bord</button>'
  +'<small>Les données sont conservées localement dans ce navigateur. Une sauvegarde JSON permet leur transfert.</small>';
  menu.append(trigger,body);
  actions.append(menu);
  currentMenu=menu;
 }else currentMenu=actions.querySelector('.v312-menu');
 return header;
}
function navHolder(header){
 let holder=document.getElementById('v312-progress');
 if(!holder){
  holder=document.createElement('div');holder.id='v312-progress';holder.className='v312-progress';
  holder.setAttribute('aria-label','Parcours de conformité — six étapes');
  header.insertAdjacentElement('afterend',holder);
 }
 return holder;
}
function fullStepper(p,holder){
 // L'étape est créée depuis la navigation unique existante, avec ses vrais statuts.
 holder.innerHTML=cqStepNav(p);
 const nav=holder.querySelector('.flow-stepnav')||holder.querySelector('nav');
 if(!nav)return;
 nav.setAttribute('aria-label','Parcours de conformité réglementaire en six étapes');
 const buttons=nav.querySelectorAll('[data-df-step]');
 buttons.forEach((button,i)=>{
  const span=button.querySelector('.flow-label');
  if(span){
   const small=document.createElement('span');small.className='v312-short-label';
   small.textContent=SHORT[i]||STEPS[i]||'';
   span.insertAdjacentElement('afterend',small);
  }
  const status=button.querySelector('.flow-status')?.textContent?.trim()||'Non commencé';
  button.setAttribute('aria-label','Étape '+(i+1)+' sur 6 — '+STEPS[i]+' — '+status);
  button.type='button';
  if(i===stepIndex(p))button.setAttribute('aria-current','step');
  else button.removeAttribute('aria-current');
 });
}
function classificationStatus(){
 const p=project();
 const d=df(p),classification=d.classification||{},r=cqEvaluate(p);
 if(!r.complete)return null;
 return typeof dfClassConfirmed==='function'&&dfClassConfirmed(p)?'confirmed':'provisional';
}
const BEFORE_PROGRESS=flowProgress;
flowProgress=function(p,n){
 const v=BEFORE_PROGRESS(p,n);
 if(n!==1||v.state!=='done')return v;
 if(typeof dfClassConfirmed==='function'&&!dfClassConfirmed(p)){
  return {state:'review',short:'À confirmer',detail:'Questionnaire rempli : la revue de classification et sa confirmation restent nécessaires.'};
 }
 return v;
};
function tidyClassification(p){
 const app=document.getElementById('app');if(!app)return;
 const result=app.querySelector('#cq-result');
 if(result){
  const r=cqEvaluate(p),status=classificationStatus();
  if(!result.querySelector('.v312-class-indicator')){
   const indicator=document.createElement('p');indicator.className='v312-class-indicator';
   indicator.textContent=status==='confirmed'?'Classification confirmée après revue':'Proposition à confirmer après revue';
   indicator.style.cssText='display:inline-flex;align-items:center;padding:5px 10px;border-radius:30px;background:'+(status==='confirmed'?'#e4f4eb':'#fff4dc')+';color:'+(status==='confirmed'?'#246d55':'#865d13')+';font-size:11px;font-weight:700;margin:0 0 12px';
   const ruleLine=result.querySelector('.cq-result-lead');
   if(ruleLine)ruleLine.insertAdjacentElement('afterend',indicator);
  }
  // La confirmation demeure accessible ; elle n'est ni escamotée ni préremplie.
  // Éviter deux CTA identiques dans le résultat et le pied de page.
  const label=result.querySelector('.cq-result-label');
  if(label&&r.complete)label.textContent='Classe proposée par le questionnaire';
 }
 // Les noms de paramètres ne doivent pas devenir de faux statuts réglementaires.
}
function canPrefill(p){
 const a=cqContext(p)||{},s=df(p).norms?.answers||{};
 return (a.form==='software'||a.form==='combined')&&s.software!=='yes'
  ||['yes','no'].includes(a.implant)&&!['yes','no'].includes(s.implant)
  ||['yes','no'].includes(a.nano)&&!['yes','no'].includes(s.nano)
  ||['yes','no'].includes(a.wound)&&!['yes','no'].includes(s.wound)
  ||(['animal','human','viable','none'].includes(a.tissue))&&!['yes','no'].includes(s.tissue);
}
function tidyNorms(p){
 const app=document.getElementById('app');if(!app)return;
 const body=app.querySelector('.std-work');if(!body)return;
 const tabs=body.querySelector('.std-tabs');
 if(!tabs)return;
 const buttons=[...tabs.querySelectorAll('[data-std-export],[data-std-prefill]')];
 if(!buttons.length)return;
 let tools=body.querySelector('.v312-norm-tools');
 if(!tools){tools=document.createElement('div');tools.className='v312-norm-tools';tabs.insertAdjacentElement('afterend',tools);}
 for(const b of buttons){
  tools.append(b);
  if(b.hasAttribute('data-std-export')){
   b.textContent='Exporter les normes en CSV';
   b.hidden=!!(df(p).norms?.view==='questions');
  }else if(b.hasAttribute('data-std-prefill')){
   b.textContent='↻ Reprendre les réponses de la classification';
   b.hidden=!canPrefill(p);
  }
 }
 if(![...tools.children].some(x=>!x.hidden))tools.hidden=true;
 const question=body.querySelector('.std-question');
 if(question){
  const actions=question.querySelector('.std-actions');
  const skip=actions?.querySelector('[data-std-skip]');
  if(skip){
   const more=document.createElement('details');more.className='v312-optional';
   more.innerHTML='<summary>Autres options</summary><p>Marquer explicitement « Non » les questions restantes de cette même catégorie. À utiliser uniquement si aucune ne concerne le dispositif.</p>';
   skip.textContent='Répondre Non aux autres questions de la catégorie';
   more.append(skip);
   actions.insertAdjacentElement('afterend',more);
  }
  const progress=question.querySelector('.std-progress');
  if(progress){
   const meter=progress.querySelector('progress');
   if(meter){
    meter.setAttribute('aria-label','Avancement des réponses confirmées pour les normes');
   }
  }
 }
}
function tidyWorkflow(p){
 const app=document.getElementById('app');
 if(!app)return;
 // Une seule barre de progression, hors du contenu afin de rester visible.
 app.querySelectorAll('.flow-stepnav,.df-steps').forEach(n=>n.remove());
 const active=stepIndex(p);
 document.body.classList.toggle('v312-classification',active===1);
 document.body.classList.toggle('v312-norms',active===2);
 document.body.classList.toggle('v312-classification-result',active===1&&!!app.querySelector('#cq-result'));
 if(active===1)tidyClassification(p);
 if(active===2)tidyNorms(p);
 // L'inventaire et l'audit conservent un seul jeu de boutons de navigation.
 if(active>=3){
  const footer=app.querySelector('.flow-footer');
  if(footer){
   footer.setAttribute('aria-label','Passer à l’étape précédente ou suivante');
  }
 }
}
// Le menu reste utilisable sur téléphone comme sur ordinateur.
document.addEventListener('click',e=>{
 const toggle=e.target.closest('.v312-menu>summary');
 if(toggle)return;
 if(currentMenu&&currentMenu.open){
  if(!e.target.closest('.v312-menu')||e.target.closest('.v312-menu-popup button'))currentMenu.open=false;
 }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&currentMenu)currentMenu.open=false;});
const OLD_RENDER=render;
render=function(){
 OLD_RENDER();
 document.body.classList.add('v312-ui');
 const header=getHeader();
 if(!header)return;
 const p=project(),active=PAGE_IDS.includes(page);
 document.body.classList.toggle('v312-guided',active);
 const holder=navHolder(header);
 holder.hidden=!active;
 if(active){
  fullStepper(p,holder);
  tidyWorkflow(p);
 }else{
  holder.innerHTML='';
  document.body.classList.remove('v312-classification','v312-norms','v312-classification-result');
 }
};
window.ORBIVIA_UI_INFO={version:'3.12',steps:STEPS.length,goal:'Un parcours visible, un seul header et un seul ensemble de commandes'};
render();
})();