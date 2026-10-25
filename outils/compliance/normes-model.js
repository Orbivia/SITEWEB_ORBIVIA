/* Navigation et applicabilité du questionnaire technique, sans DOM ni stockage. */
(function(){
'use strict';
function activeQuestions(questions,answers){
 const byId=new Map(questions.map(q=>[q.id,q]));
 function active(q,seen=new Set()){
  if(!q.dependency)return true;
  if(seen.has(q.id)||answers[q.dependency]!=='yes')return false;
  seen.add(q.id);const parent=byId.get(q.dependency);
  return !!parent&&active(parent,seen);
 }
 return questions.filter(q=>active(q));
}
function effectiveAnswers(questions,answers){
 return Object.fromEntries(activeQuestions(questions,answers).map(q=>[q.id,answers[q.id]]));
}
function classify(reference,answers){
 if(reference.when==='base')return 'suggested';
 const clauses=reference.when.split(',').map(x=>x.split('+'));
 if(clauses.some(x=>x.every(k=>answers[k]==='yes')))return 'suggested';
 if(clauses.some(x=>x.some(k=>answers[k]==='yes')&&x.every(k=>answers[k]!=='no')))return 'possible';
 return 'all';
}
function nextQuestion(questions,session,answeredId){
 if(session.reviewOnly){
  session.reviewSeen=[...new Set([...(session.reviewSeen||[]),answeredId])];
  return questions.find(q=>!['yes','no'].includes(session.answers[q.id])&&!session.reviewSeen.includes(q.id));
 }
 return questions.find(q=>!['yes','no','checking'].includes(session.answers[q.id]));
}
const api={activeQuestions,effectiveAnswers,classify,nextQuestion};
if(typeof module==='object'&&module.exports)module.exports=api;else window.ORBIVIA_NORMES_MODEL=api;
})();
