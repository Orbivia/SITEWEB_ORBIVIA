/* Règles de revue documentaire. Aucune lecture du DOM ni écriture du stockage. */
(function(){
'use strict';
function prepare(saved,draft,fingerprint,stale){
 const value={...(draft||saved||{})};
 if(value.fingerprint!==undefined&&value.fingerprint!==fingerprint||stale&&(!draft||draft.fingerprint!==fingerprint)){
  value.status='pending';value.checked=[];
 }
 return value;
}
function validate(value,entry,documentCount){
 if(!['pending','reviewed','gap','na'].includes(value.status))return 'Conclusion de revue invalide.';
 const checked=new Set(value.checked||[]);
 if([...checked].some(n=>!Number.isInteger(n)||n<0||n>=entry.checks.length))return 'Point de contrôle invalide.';
 if(value.status==='reviewed'&&(!documentCount||!value.reviewer||!value.method||checked.size!==entry.checks.length))return 'Pour conclure à une preuve suffisante : rattacher une preuve, préciser le relecteur et la méthode, puis vérifier tous les points.';
 if(value.status==='gap'&&!value.finding)return 'Décrivez l’écart constaté.';
 if(value.status==='na'&&(!value.finding||!value.reviewer))return 'Justifiez l’inapplicabilité et renseignez le relecteur.';
 return '';
}
const api={prepare,validate};
if(typeof module==='object'&&module.exports)module.exports=api;else window.ORBIVIA_DOCUMENT_REVIEW=api;
})();
