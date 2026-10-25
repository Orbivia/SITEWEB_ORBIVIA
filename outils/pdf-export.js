/* PDF export, entirely local. pdf-lib is vendored with its MIT license. */
(function(){
'use strict';
function blocksFromHTML(html){
 const doc=new DOMParser().parseFromString(html,'text/html'),blocks=[];
 doc.querySelectorAll('br').forEach(br=>br.replaceWith(doc.createTextNode('\n')));
 function visit(node){
  if(node.nodeType!==1)return;
  const tag=node.tagName;
  if(['H1','H2','H3','P','LI','TR'].includes(tag)){
   if(tag==='TR'&&node.closest('thead'))return;
   let text=node.textContent.trim();
   if(tag==='TR'){
    const headers=[...node.closest('table').querySelectorAll('thead th')].map(x=>x.textContent.trim());
    text=[...node.children].map((cell,i)=>(headers[i]?headers[i]+' : ':'')+cell.textContent.trim()).join('\n');
   }
   blocks.push({text,level:tag==='H1'?1:tag==='H2'?2:tag==='H3'?3:0});
   node.querySelectorAll('a[href]').forEach(a=>blocks.push({text:a.href,url:a.href,level:0}));
  }else [...node.children].forEach(visit);
 }
 [...doc.body.children].forEach(visit);
 return blocks;
}
async function createFromBlocks(blocks,lib){
 const {PDFDocument,StandardFonts,rgb,PDFName,PDFString}=lib;
 const pdf=await PDFDocument.create();
 pdf.setTitle('ORBIVIA — Résultat du questionnaire');pdf.setAuthor('ORBIVIA');pdf.setLanguage('fr-FR');
 const regular=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);
 const width=595.28,height=841.89,margin=44,usable=width-2*margin;
 let page,y;
 const ink=rgb(.09,.15,.23),muted=rgb(.35,.42,.5);
 function newPage(){page=pdf.addPage([width,height]);y=height-60;page.drawRectangle({x:margin,y:height-32,width:40,height:3,color:rgb(.91,.63,.09)});}
 function safe(text,font){return Array.from(String(text).replace(/\u00a0/g,' ').replace(/\t/g,' ').replaceAll('≥','>=').replaceAll('≤','<=').replaceAll('μ','µ')).map(c=>{try{font.encodeText(c);return c;}catch(_){return '-';}}).join('');}
 function wrap(text,font,size){
  const lines=[];
  for(const paragraph of text.split('\n')){
   let line='';
   // Character wrapping also handles long source URLs without clipping.
   for(const word of paragraph.split(/(\s+)/)){
    if(font.widthOfTextAtSize(line+word,size)<=usable){line+=word;continue;}
    if(line.trim()){lines.push(line.trimEnd());line='';}
    for(const char of word.trimStart()){
     if(font.widthOfTextAtSize(line+char,size)>usable){lines.push(line);line='';}
     line+=char;
    }
   }
   lines.push(line.trimEnd());
  }
  return lines;
 }
 newPage();
 for(const block of blocks){
  const font=block.level?bold:regular,size=block.level===1?22:block.level===2?15:block.level===3?11:9.5;
  const lineHeight=size*1.45,lines=wrap(safe(block.text,font),font,size);
  if(y-lineHeight*(block.level?Math.min(lines.length,3)+2:Math.min(lines.length,2))<54)newPage();
  for(const line of lines){
   if(y-lineHeight<54)newPage();
   page.drawText(line,{x:margin,y,size,font,color:block.url?rgb(.16,.32,.5):block.level?ink:muted});
   if(block.url&&line){
    const annotation=pdf.context.obj({Type:'Annot',Subtype:'Link',Rect:[margin,y-2,margin+font.widthOfTextAtSize(line,size),y+size],Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of(block.url)}});
    const ref=pdf.context.register(annotation);let annots=page.node.lookup(PDFName.of('Annots'));
    if(!annots){annots=pdf.context.obj([]);page.node.set(PDFName.of('Annots'),annots);}annots.push(ref);
   }
   y-=lineHeight;
  }
  y-=block.level?10:8;
 }
 const pages=pdf.getPages();pages.forEach((p,i)=>{
  p.drawLine({start:{x:margin,y:40},end:{x:width-margin,y:40},thickness:.5,color:rgb(.85,.88,.91)});
  p.drawText('ORBIVIA | '+(i+1)+' / '+pages.length,{x:margin,y:25,size:8,font:regular,color:muted});
 });
 return pdf.save();
}
const api={blocksFromHTML,createFromBlocks,create:html=>createFromBlocks(blocksFromHTML(html),window.PDFLib)};
if(typeof module==='object'&&module.exports)module.exports=api;else window.ORBIVIA_TOOL_PDF=api;
})();
