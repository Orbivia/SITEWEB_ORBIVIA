import test from 'node:test';
import assert from 'node:assert/strict';
import { saveQuote, readQuote, clearQuote, QUOTE_KEY } from '../js/quote-transfer.mjs';
import { buildPayload, submissionState } from '../js/contact-core.mjs';
function storage() { const data = new Map(); return {getItem:k=>data.get(k) ?? null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}; }
test('le récapitulatif complet arrive dans la demande sans écraser les précisions', () => {
 const s=storage();const report='Projet : capteur autonome\nBudget : 2 000 à 3 000 € HT\n'+'Détail technique '.repeat(350).trim();
 saveQuote(s,report,1000);const payload=buildPayload({email:'test@example.com',message:'Livraison en janvier',estimation:readQuote(s,2000)});
 assert.equal(payload.estimation,report);assert.equal(payload.message,'Livraison en janvier');
 assert.equal(submissionState({ok:false},{success:false}),'error');assert.equal(readQuote(s,3000),report);
 clearQuote(s);assert.equal(readQuote(s,3000),'');
});
test('un récapitulatif expiré ou invalide ne préremplit pas une nouvelle demande',()=>{
 const s=storage();saveQuote(s,'Projet initial',1000);assert.equal(readQuote(s,1000+7200001),'');assert.equal(s.getItem(QUOTE_KEY),null);
 s.setItem(QUOTE_KEY,'invalid');assert.equal(readQuote(s),'');
 s.setItem(QUOTE_KEY,JSON.stringify({report:'Projet',created:'yesterday'}));assert.equal(readQuote(s),'');
});
test('les demandes directes ne contiennent pas de récapitulatif vide',()=>{
 assert.equal('estimation' in buildPayload({message:'Mon projet',email:'test@example.com'}),false);
 assert.equal(buildPayload({retour:'rappel',telephone:'0600000000',disponibilites:'Le matin',estimation:'Projet'}).disponibilites,'Le matin');
});
test('un stockage bloqué déclenche le parcours de secours',()=>{
 assert.throws(()=>saveQuote({setItem(){throw new Error('blocked');}},'Projet'));
});
