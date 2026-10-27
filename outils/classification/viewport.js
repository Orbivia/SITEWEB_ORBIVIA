/* MDR/IVDR — adapter le questionnaire à l'écran courant.
   Les réponses restent accessibles lorsque l'écran est trop petit.
   Aucune modification du moteur réglementaire ni de l'état des réponses. */
(function(){
 'use strict';
 const body=document.body;
 const app=document.getElementById('tool-app');
 if(!app)return;
 const levels=['question-density-compact','question-density-dense','question-density-tight'];
 let frame=0;
 function clear(){
  body.classList.remove(...levels,'question-allow-scroll');
 }
 function overflows(card){
  const viewport=window.visualViewport?.height||window.innerHeight;
  const controls=app.querySelector('.question-controls');
  const choices=card.querySelector('.answer-list');
  const status=app.querySelector('.save-status:not(:empty)');
  const cutoff=Math.min(window.innerHeight,viewport);
  return document.documentElement.scrollHeight>window.innerHeight+3
   ||card.scrollHeight>card.clientHeight+3
   ||(choices&&choices.scrollHeight>choices.clientHeight+3)
   ||(controls&&controls.getBoundingClientRect().bottom>cutoff+3)
   ||(status&&status.getBoundingClientRect().bottom>cutoff+3);
 }
 function fit(){
  frame=0;
  clear();
  if(!body.classList.contains('is-question'))return;
  const card=app.querySelector('.question-card:not(.assistance-card)');
  if(!card||app.querySelector('.help-sheet[open]'))return;
  if(!overflows(card))return;
  for(const level of levels){
   body.classList.add(level);
   if(!overflows(card))return;
  }
  // Priorité à l'accès aux réponses et aux tailles de cibles :
  // aucun contenu n'est masqué, même sur écran très court.
  body.classList.add('question-allow-scroll');
 }
 function schedule(){
  if(frame)cancelAnimationFrame(frame);
  frame=requestAnimationFrame(fit);
 }
 const observer=new MutationObserver(schedule);
 observer.observe(app,{childList:true,subtree:false});
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('orientationchange',schedule,{passive:true});
 window.visualViewport?.addEventListener('resize',schedule,{passive:true});
 document.fonts?.ready.then(schedule);
 schedule();
})();
