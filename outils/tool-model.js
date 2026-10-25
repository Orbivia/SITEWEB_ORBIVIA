/* Modèle des questionnaires publics. Aucun projet, aucune écriture hors de l'interface. */
(function(){
'use strict';
function create({classification,norms,questions,catalogue,explanations}){
 const E=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
 const yesNo=[['yes','Oui'],['no','Non']];
 function visible(kind,answers){return kind==='classification'?classification.questions(answers):norms.activeQuestions(questions,answers).map(q=>({...q,label:q.title,options:yesNo}));}
 function known(q,answers){return q.options.some(([value])=>value===answers[q.id]);}
 function visited(q,answers){return known(q,answers)||answers[q.id]==='checking';}
 function restore(kind,value){
  const state={answers:{},comments:{},cursor:'',result:false};
  if(!value||typeof value!=='object'||Array.isArray(value))return state;
  const all=kind==='classification'?classification.allQuestions:questions.map(q=>({...q,options:yesNo}));
  for(const q of all){const answer=value.answers?.[q.id];if(answer==='checking'||q.options.some(([v])=>v===answer))state.answers[q.id]=answer;if(typeof value.comments?.[q.id]==='string')state.comments[q.id]=value.comments[q.id].slice(0,10000);}
  state.cursor=visible(kind,state.answers).some(q=>q.id===value.cursor)?value.cursor:'';state.result=value.result===true;
  return state;
 }
 function analysis(kind,answers){
  if(kind==='classification')return classification.evaluate(answers);
  const active=norms.activeQuestions(questions,answers),effective=norms.effectiveAnswers(questions,answers);
  const label=new Map(active.map(q=>[q.id,q.title]));
  const describe=reference=>{
   const help=explanations.describe(reference,effective,active);
   const matches=reference.when==='base'?[]:reference.when.split(',').map(x=>x.split('+')).filter(clause=>clause.every(key=>effective[key]==='yes'));
   const reasons=reference.when==='base'?['Référence transversale à examiner selon le périmètre du dispositif.']:matches.map(clause=>clause.map(key=>(label.get(key)||key)+' : Oui').join(' ; '));
   return {...help,reasons};
  };
  const missing=active.filter(q=>!['yes','no'].includes(effective[q.id]));
  return {suggested:catalogue.filter(r=>norms.classify(r,effective)==='suggested').map(describe),possible:catalogue.filter(r=>norms.classify(r,effective)==='possible').map(describe),missing,complete:missing.length===0,answered:active.length-missing.length,total:active.length};
 }
 function answerRows(kind,state){return visible(kind,state.answers).map(q=>({id:q.id,label:q.label,answer:q.options.find(([value])=>value===state.answers[q.id])?.[1]||(state.answers[q.id]==='checking'?'À vérifier':'Sans réponse'),comment:state.comments[q.id]||''}));}
 function reportBody(kind,state,date=new Date().toLocaleDateString('fr-FR')){
  const result=analysis(kind,state.answers),isClass=kind==='classification';
  let html='<h1>'+E(isClass?'Classification MDR':'Normes du dispositif')+'</h1><p>ORBIVIA · Résultat du questionnaire · '+E(date)+'</p>';
  html+='<p class="notice">'+E(isClass?'Proposition fondée sur les réponses déclarées. La qualification, la destination réelle, les exceptions et les règles de l’annexe VIII restent à examiner par le fabricant.':'Références proposées à partir des caractéristiques déclarées. Leur applicabilité, l’édition, les amendements et l’harmonisation restent à vérifier. Cette liste ne constitue pas une démonstration de conformité ni un inventaire exhaustif.')+'</p>';
  if(isClass){
   html+='<h2>'+E(result.complete?'Classe proposée : '+result.highest:'Résultat provisoire — classification à préciser')+'</h2>';
   if(result.missing.length)html+='<h3>Points à préciser</h3><ul>'+result.missing.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul>';
   html+='<h3>Examen des 22 règles</h3><table><thead><tr><th>Règle</th><th>Résultat</th><th>Raison</th></tr></thead><tbody>'+result.rules.map(r=>'<tr><td>'+r.n+'</td><td>'+E(r.applies==='yes'?(result.complete?'Retenue : ':'Provisoire : ')+r.class:result.complete?'Non retenue':'À examiner')+'</td><td>'+E(r.reason)+'</td></tr>').join('')+'</tbody></table><p>Source : <a href="https://eur-lex.europa.eu/eli/reg/2017/745/oj">Règlement (UE) 2017/745 — annexe VIII</a>.</p>';
  }else{
   if(state.answers.ivd==='yes')html+='<p class="notice">Profil diagnostic in vitro signalé : les références IVDR sont complémentaires. Ce questionnaire ne réalise pas la qualification ni la classification IVDR.</p>';
   html+='<h2>'+result.suggested.length+' références proposées</h2><p>'+result.answered+' / '+result.total+' caractéristiques précisées.</p>';
   if(result.missing.length)html+='<h3>Caractéristiques restant à préciser</h3><ul>'+result.missing.map(q=>'<li>'+E(q.title)+'</li>').join('')+'</ul>';
   html+='<table><thead><tr><th>Référence et objet</th><th>Pourquoi elle est proposée</th><th>Source éditeur</th></tr></thead><tbody>'+result.suggested.map(r=>'<tr><td><b>'+E(r.id)+'</b><br>'+E(r.title)+'</td><td>'+r.reasons.map(E).join('<br>')+'</td><td><a href="'+E(r.url)+'">'+E(r.sourceLabel)+'</a></td></tr>').join('')+'</tbody></table>';
   if(result.possible.length)html+='<h3>Autres pistes conditionnelles</h3><p>Une partie des conditions est renseignée ; ces références ne sont pas retenues automatiquement.</p><ul>'+result.possible.map(r=>'<li>'+E(r.id)+' — '+E(r.title)+' · <a href="'+E(r.url)+'">Source éditeur</a></li>').join('')+'</ul>';
  }
  html+='<h2>Réponses et commentaires</h2><table><thead><tr><th>Question</th><th>Réponse</th><th>Commentaire</th></tr></thead><tbody>'+answerRows(kind,state).map(q=>'<tr><td>'+E(q.label)+'</td><td>'+E(q.answer)+'</td><td>'+E(q.comment)+'</td></tr>').join('')+'</tbody></table>';
  return html;
 }
 function report(kind,state){return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ORBIVIA — '+(kind==='classification'?'Classification MDR':'Normes du dispositif')+'</title><style>body{font:14px/1.6 Arial,sans-serif;color:#17263a;margin:35px auto;padding:0 20px;max-width:1100px}h1{font-size:30px}h2{margin-top:30px}table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12px}th,td{border:1px solid #dce3eb;padding:10px;text-align:left;vertical-align:top;overflow-wrap:anywhere}th{background:#f3f5f8}.notice{padding:16px;border-left:4px solid #e7a116;background:#fffbf1}a{color:#325c83}@media print{body{margin:0}thead{display:table-header-group}tr{break-inside:avoid}h2,h3{break-after:avoid}}</style></head><body>'+reportBody(kind,state)+'</body></html>';}
 return {visible,known,visited,restore,analysis,answerRows,reportBody,report,escape:E};
}
if(typeof module==='object'&&module.exports)module.exports={create};else window.ORBIVIA_PUBLIC_TOOLS={create};
})();
