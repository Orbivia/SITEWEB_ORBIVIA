/* Progress measures completed answers, never regulatory conformity. */
(function(){
'use strict';
function ratio(done,total){return total?(done<total?Math.min(99,Math.round(100*done/total)):100):0;}
function calculate(input){
 const chapters=input.map(row=>{const total=row.total||0,done=Math.min(total,Math.max(0,row.done||0));return {...row,total,done,percent:ratio(done,total)};});
 const total=chapters.reduce((n,c)=>n+c.total,0),done=chapters.reduce((n,c)=>n+c.done,0);
 return {chapters,total,done,percent:ratio(done,total),complete:total>0&&done===total};
}
if(typeof module==='object'&&module.exports)module.exports={calculate};
else window.ORBIVIA_JOURNEY_METRICS={calculate};
})();
