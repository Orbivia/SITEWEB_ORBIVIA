/* Modèle des questionnaires publics. Aucun projet, aucune écriture hors de l'interface. */
(function(){
'use strict';
function create({classification,norms,questions,catalogue,explanations}){
 const E=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
 const yesNo=[['yes','Oui'],['no','Non']];
 function ordered(q,kind,answers){
  let preferred;
  if(kind==='norms')preferred=['electric','software','contact'].includes(q.id)?'yes':'no';
  else preferred=({scope:'md',form:'physical',active:'yes',contact:'none',implant:'no',cleaning:'none',tissue:'none',controlTherapy:'none',duration:'short',multiPurpose:'yes',diagnosticUse:'routine',softwareRole:'drives'})[q.id]||'no';
  if(q.id==='diagnostic')preferred=answers.therapyEnergy==='yes'?'no':'yes';
  if(q.id==='softwareRole'&&answers.form==='software')preferred='independent';
  return {...q,options:[...q.options].sort((a,b)=>(b[0]===preferred?1:0)-(a[0]===preferred?1:0))};
 }
 function visible(kind,answers){
  if(kind!=='classification')return norms.activeQuestions(questions,answers).map(q=>ordered({...q,label:q.title,options:yesNo},kind,answers));
  const scopeHelp={
   md:{label:'Dispositif médical',description:'Pour soigner ou diagnostiquer. Ex. : CPAP, thermomètre.'},
   accessory:{label:'Accessoire dédié à un DM',description:'Permet ou assiste l’usage d’un DM, sans être lui-même un DM.'},
   ivd:{label:'Diagnostic in vitro',description:'Analyse d’un prélèvement humain. Ex. : test de grossesse.'},
   annex16:{label:'Sans but médical (annexe XVI)',description:'Ex. : lentilles colorées non correctrices, laser d’épilation.'},
   other:{label:'Autre produit / statut incertain',description:'Clarifier le statut du produit avant de le classer.'}
  };
  return classification.questions(answers).map(q=>q.id==='scope'?{...q,label:'Quel type de produit ?',example:'Choisissez selon l’usage prévu par le fabricant. Un dispositif médical a une fonction médicale propre (diagnostic, prévention, surveillance, traitement…). Un accessoire contribue spécifiquement à l’usage ou à la fonction d’un DM, sans être lui-même un DM. Le diagnostic in vitro analyse un prélèvement humain : il relève de l’IVDR. L’annexe XVI vise seulement certains groupes sans but médical (dont lentilles non correctrices et certains équipements esthétiques). Si le statut est incertain, il doit être clarifié avant de proposer une classe.',options:q.options.map(([value,label])=>[value,scopeHelp[value]?.label||label]),optionHelp:Object.fromEntries(Object.entries(scopeHelp).map(([id,item])=>[id,item.description]))}:q).map(q=>ordered(q,kind,answers));
 }
 function known(q,answers){return q.options.some(([value])=>value===answers[q.id]);}
 function visited(q,answers){return known(q,answers)||answers[q.id]==='unresolved';}
 function resolved(q,answers){return known(q,answers)&&!['unclear','unknown','unknownClass','multiple'].includes(answers[q.id])&&!(q.id==='controlTherapy'&&answers[q.id]==='other')&&!(q.id==='scope'&&answers[q.id]==='other');}
 // Each question keeps a fixed position, independent of conditional branches.
 // Skipped branches advance the route; they never change its denominator.
 function progress(kind,answers,cursor){
  const all=kind==='classification'?classification.allQuestions:questions;
  const active=visible(kind,answers),next=active.find(q=>!visited(q,answers));
  const position=next?all.findIndex(q=>q.id===next.id):all.length;
  const percent=Math.min(active.some(q=>!resolved(q,answers))?99:100,Math.floor(100*position/all.length));
  let theme;
  if(kind==='norms')theme=all.find(q=>q.id===cursor)?.section||all[position]?.section||'Résultat';
  else{
   const index=all.findIndex(q=>q.id===cursor);
   const before=id=>index<all.findIndex(q=>q.id===id);
   theme=before('medicinal')?'Votre produit':before('channel')?'Fonctions particulières':before('therapyEnergy')?'Contact et utilisation':before('softwareRole')?'Fonctions actives':'Logiciel et usages';
  }
  return {percent,theme};
 }
 function restore(kind,value){
  const state={answers:{},comments:{},cursor:'',result:false,assistance:null,clarifications:{},editing:false,reviewMode:false,reviewSeen:[]};
  if(!value||typeof value!=='object'||Array.isArray(value))return state;
  const all=kind==='classification'?classification.allQuestions:questions.map(q=>({...q,options:yesNo}));
  state.editing=value.editing===true;state.reviewMode=value.reviewMode===true;
  state.reviewSeen=Array.isArray(value.reviewSeen)?[...new Set(value.reviewSeen.filter(id=>all.some(q=>q.id===id)))].slice(0,all.length):[];
  for(const q of all){const answer=value.answers?.[q.id];if(answer==='unresolved'||q.options.some(([v])=>v===answer))state.answers[q.id]=answer;if(typeof value.comments?.[q.id]==='string')state.comments[q.id]=value.comments[q.id].slice(0,10000);}
  state.cursor=visible(kind,state.answers).some(q=>q.id===value.cursor)?value.cursor:'';state.result=value.result===true;
  const unanswered=visible(kind,state.answers).find(q=>!visited(q,state.answers));
  if(unanswered&&(state.result||Object.values(value.answers||{}).includes('checking')||Object.hasOwn(value.answers||{},'diagnosticVital')||Object.hasOwn(value.answers||{},'diagnosticImmediate'))){state.cursor=unanswered.id;state.result=false;}
  const activeIds=new Set(visible(kind,state.answers).map(q=>q.id));
  if(value.assistance&&activeIds.has(value.assistance.question)&&Array.isArray(value.assistance.path)){
   state.assistance={question:value.assistance.question,version:typeof value.assistance.version==='string'?value.assistance.version.slice(0,80):'',path:(value.assistance.path.every(x=>typeof x==='string'&&x.length<80)?value.assistance.path.slice(0,8):[])};
   state.cursor=state.assistance.question;state.result=false;
  }
  for(const q of all){
   const record=value.clarifications?.[q.id];
   if(record&&Object.hasOwn(state.answers,q.id)&&record.value===state.answers[q.id]&&Array.isArray(record.steps))state.clarifications[q.id]={value:record.value,steps:record.steps.filter(x=>x&&typeof x.question==='string'&&typeof x.answer==='string').slice(0,8).map(x=>({question:x.question.slice(0,1000),answer:x.answer.slice(0,1000)}))};
  }
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
 function answerRows(kind,state){return visible(kind,state.answers).map(q=>({id:q.id,label:q.label,answer:q.options.find(([value])=>value===state.answers[q.id])?.[1]||(state.answers[q.id]==='unresolved'?'À préciser — aide non concluante':'Sans réponse'),comment:state.comments?.[q.id]||'',guidance:state.clarifications?.[q.id]?.steps||[]}));}
 function summary(kind,state,date=new Date().toLocaleDateString('fr-FR')){
  const result=analysis(kind,state.answers),isClass=kind==='classification';
  const document={compact:!isClass,title:isClass?'Classification MDR':'Normes du dispositif',date,
   outcome:isClass?(result.complete?'Classe proposée : '+result.highest:'Classification à préciser'):result.suggested.length+' références proposées'+(result.complete?'':' · provisoire'),
   note:isClass?'Proposition à vérifier selon la destination réelle et les règles du MDR. Ne vaut pas validation réglementaire.':'Applicabilité, édition et harmonisation à vérifier. Liste indicative, non exhaustive. Les références sont cliquables vers leur source.',
   sections:[]};
  if(isClass){
   const profile=answerRows(kind,state).filter(q=>['scope','form','active','contact','implant','duration'].includes(q.id));
   document.sections.push({title:'Profil déclaré',items:profile.map(q=>({text:({scope:'Type',form:'Forme',active:'Dispositif actif',contact:'Contact / pénétration',implant:'Implantable',duration:'Durée'})[q.id]+' : '+q.answer}))});
   const retained=result.rules.filter(r=>r.applies==='yes'&&(result.complete||![1,13].includes(r.n)));
   document.sections.push({title:result.complete?'Règles retenues et raisons':'Règles proposées, à confirmer',items:retained.map(r=>({text:'Règle '+r.n+' · '+r.class+' — '+r.reason}))});
   if(result.missing.length)document.sections.push({title:'Points à préciser',items:result.missing.map(text=>({text}))});
   document.sections.push({title:'Source',items:[{text:'Règlement (UE) 2017/745 · annexe VIII',url:'https://eur-lex.europa.eu/eli/reg/2017/745/oj'}]});
  }else{
   const short={electric:'Électromédical',software:'Logiciel médical',connected:'Connexion réseau',cloud:'Serveur distant',ai:'IA',alarm:'Alarmes',closedloop:'Boucle fermée',home:'Domicile',emergency:'Secours',transport:'Chocs et vibrations',clinical:'Investigation clinique',contact:'Contact corporel',substance:'Substances',polymer:'Polymères exposés',blood:'Contact sanguin',implant:'Implant',activeImplant:'Implant actif',nano:'Nanomatériaux',tissue:'Tissus biologiques',sterile:'Produit stérile',eto:'Oxyde d’éthylène',radiation:'Irradiation',steam:'Vapeur',reprocess:'Retraitement',cleanroom:'Salle propre',resp:'Circuit respiratoire',sleep:'Apnées du sommeil',oxygen:'Oxygène',anesthesia:'Anesthésie',infusion:'Perfusion',catheter:'Cathéter intravasculaire',connectors:'Petits raccords',enteral:'Voie entérale',dialysis:'Dialyse',cardiac:'Cardiovasculaire',ecg:'ECG',vascular:'Vasculaire',neuro:'Neurologie',surgical:'Chirurgie',endoscopy:'Endoscopie',orthopedic:'Implant orthopédique',prosthesis:'Prothèse / orthèse externe',wheelchair:'Fauteuil roulant',dental:'Dentaire',ophthalmic:'Ophtalmologie',contactLens:'Lentilles',wound:'Plaies',monitor:'Surveillance physiologique',neonatal:'Nouveau-nés',bed:'Lit médicalisé',hearing:'Audition',thermal:'Chauffage patient',gloves:'Gants médicaux',mask:'Masque médical',textile:'Textiles de bloc',xray:'Rayons X',mri:'IRM',ultrasound:'Ultrasons',laser:'Laser',optical:'Lumière médicale',radiotherapy:'Radiothérapie',imaging:'Images médicales',lab:'Laboratoire',ivd:'Diagnostic in vitro'};
   const effective=norms.effectiveAnswers(questions,state.answers),byId=new Map(catalogue.map(r=>[r.id,r]));
   const groups=new Map();
   for(const reference of result.suggested){
    const original=byId.get(reference.id);
    const reason=original.when==='base'?'Références transversales':original.when.split(',').map(clause=>clause.split('+')).filter(clause=>clause.every(id=>effective[id]==='yes')).map(clause=>clause.map(id=>short[id]||id).join(' + ')).join(' ou ');
    if(!groups.has(reason))groups.set(reason,[]);
    groups.get(reason).push({text:reference.id,url:reference.url});
   }
   document.sections.push(...[...groups].map(([title,items])=>({title,items,inline:true})));
   if(result.missing.length)document.sections.unshift({title:'Caractéristiques à préciser',items:result.missing.map(q=>({text:q.title}))});
   if(state.answers.ivd==='yes')document.note+=' Le profil IVDR nécessite une analyse distincte ; aucune classification IVDR n’est réalisée.';
  }
  return document;
 }
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
 return {visible,known,visited,resolved,progress,restore,analysis,answerRows,summary,reportBody,report,escape:E};
}
if(typeof module==='object'&&module.exports)module.exports={create};else window.ORBIVIA_PUBLIC_TOOLS={create};
})();
