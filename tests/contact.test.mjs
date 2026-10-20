import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPayload, submissionState, cleanContext} from '../js/contact-core.mjs';
test('une activation ou une erreur ne confirme jamais un envoi',()=>{
 assert.equal(submissionState({ok:true},{success:true,message:'Please activate your form'}),'activation');
 assert.equal(submissionState({ok:false},{success:true}),'error');
 assert.equal(submissionState({ok:true},{success:'true'}),'success');
 assert.equal(submissionState({ok:true},{}),'error');
});
test('le rappel conserve les disponibilités uniquement si demandé',()=>{
 assert.equal(buildPayload({retour:'rappel',disponibilites:'Le matin'}).disponibilites,'Le matin');
 assert.equal(buildPayload({retour:'email',disponibilites:'Le matin'}).disponibilites,'');
 assert.equal(cleanContext(' test\n ',4),'test');
});
