/* One entry question, separate MDR and IVDR rules and progress scales. */
(function(){
'use strict';
function create(mdr,ivdr){
 const scope=mdr.allQuestions.find(q=>q.id==='scope');
 const ivdAll=[scope,...ivdr.allQuestions];
 return {version:mdr.version+'+'+ivdr.version,allQuestions:[...mdr.allQuestions,...ivdr.allQuestions],
  referenceQuestions:a=>a.scope==='ivd'?ivdAll:mdr.allQuestions,
  known:mdr.known,supported:a=>a.scope==='ivd'||mdr.supported(a),
  context:a=>a.scope==='ivd'?{scope:'ivd',...ivdr.context(a)}:mdr.context(a),
  questions:a=>a.scope==='ivd'?[scope,...ivdr.questions(a)]:mdr.questions(a),
  evaluate:(a,options)=>a.scope==='ivd'?ivdr.evaluate(a):{...mdr.evaluate(a,options),regulation:'MDR',source:'https://eur-lex.europa.eu/eli/reg/2017/745/oj',sourceLabel:'MDR — annexe VIII'}
 };
}
if(typeof module==='object'&&module.exports)module.exports={create};else window.ORBIVIA_CLASSIFICATION=create(window.ORBIVIA_CLASSIFICATION,window.ORBIVIA_IVDR);
})();
