/* Comportements communs des questionnaires ORBIVIA — v1.
 * <details class="info-bubble"> : fermeture en cliquant hors de la bulle
 * ou avec Échap. Aucun recalcul de la page à l'ouverture.
 */
(function(){
 "use strict";
 document.addEventListener("click",function(event){
  if(event.target.closest(".info-bubble"))return;
  document.querySelectorAll('[data-questionnaire-ui] .question-heading .info-bubble[open]').forEach(function(el){el.open=false;});
 });
 document.addEventListener("keydown",function(event){
  if(event.key!=="Escape")return;
  const opened=document.querySelectorAll('[data-questionnaire-ui] .question-heading .info-bubble[open]');
  if(!opened.length)return;
  for(const item of opened)item.open=false;
  event.stopPropagation();
 });
})();
