/* ORBIVIA : dimensionnement partagé des trois questionnaires publics.
 * Ne modifie ni les réponses, ni le calcul des résultats, ni les panneaux d'aide.
 * En cas de manque de place, autorise le défilement au lieu de cacher les choix.
 */
(function(){
 "use strict";
 const root=document.querySelector("#tool-app, #connect-app, #label-app");
 if(!root)return;
 const body=document.body;
 const sizes=["quiz-compact","quiz-dense","quiz-tight"];
 let frame=0;
 function removeDensity(){
  body.classList.remove(...sizes,"quiz-scroll");
 }
 function currentCard(){
  return root.querySelector(".question-card:not(.result-card):not(.assistance-card):not(.prompt-measure)");
 }
 function overflowing(card){
  const viewport=Math.min(window.innerHeight,window.visualViewport?.height||window.innerHeight);
  const options=card.querySelector(".answer-list, .label-options, .cx-options");
  const controls=root.querySelector(".question-controls");
  const save=root.querySelector(".save-status:not(:empty)");
  const cardRect=card.getBoundingClientRect();
  return document.documentElement.scrollHeight>window.innerHeight+3
    ||card.scrollHeight>card.clientHeight+3
    ||(options&&options.scrollHeight>options.clientHeight+3)
    ||cardRect.bottom>viewport+3
    ||(controls&&controls.getBoundingClientRect().bottom>viewport+3)
    ||(save&&save.getBoundingClientRect().bottom>viewport+3);
 }
 function fit(){
  frame=0;
  removeDensity();
  const card=currentCard();
  body.classList.toggle("quiz-active",!!card);
  if(!card||root.querySelector(".help-sheet[open]"))return;
  if(!overflowing(card))return;
  for(const cls of sizes){
   body.classList.add(cls);
   if(!overflowing(card))return;
  }
  body.classList.add("quiz-scroll");
 }
 function schedule(){
  if(frame)cancelAnimationFrame(frame);
  frame=requestAnimationFrame(fit);
 }
 const observer=new MutationObserver(schedule);
 observer.observe(root,{childList:true,subtree:false});
 window.addEventListener("resize",schedule,{passive:true});
 window.addEventListener("orientationchange",schedule,{passive:true});
 window.visualViewport?.addEventListener("resize",schedule,{passive:true});
 document.fonts?.ready.then(schedule);
 schedule();
})();
