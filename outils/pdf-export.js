/* One-page summaries. Generated locally with the vendored pdf-lib (MIT). */
(function(){
'use strict';
async function create(summary,lib){
 const {PDFDocument,StandardFonts,rgb,PDFName,PDFString}=lib||window.PDFLib;
 const pdf=await PDFDocument.create();
 pdf.setTitle('ORBIVIA — '+summary.title);pdf.setAuthor('ORBIVIA');pdf.setLanguage('fr-FR');
 const font=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);
 const width=595.28,height=841.89,margin=34,gap=18;
 const page=pdf.addPage([width,height]),ink=rgb(.09,.15,.23),muted=rgb(.36,.42,.49),blue=rgb(.16,.32,.5);
 function safe(text){return Array.from(String(text??'').replace(/\s+/g,' ').replaceAll('≥','>=').replaceAll('≤','<=').replaceAll('μ','µ')).map(c=>{try{font.encodeText(c);return c;}catch(_){return '-';}}).join('');}
 function wrap(text,face,size,maxWidth){
  const lines=[];let line='';
  for(const word of safe(text).split(' ')){
   const candidate=line?line+' '+word:word;
   if(face.widthOfTextAtSize(candidate,size)<=maxWidth){line=candidate;continue;}
   if(line){lines.push(line);line='';}
   for(const char of word){
    if(face.widthOfTextAtSize(line+char,size)>maxWidth){lines.push(line);line='';}
    line+=char;
   }
  }
  if(line)lines.push(line);return lines;
 }
 function layout(size,columns){
  const columnWidth=(width-2*margin-gap*(columns-1))/columns,lines=[];
  for(const section of summary.sections){
   for(const text of wrap(section.title,bold,size+.6,columnWidth))lines.push({runs:[{text}],heading:true});
   if(section.inline){
    let runs=[],used=0;
    for(const item of section.items){
     const text=safe(item.text),itemWidth=font.widthOfTextAtSize(text,size);
     if(itemWidth>columnWidth){
      if(runs.length){lines.push({runs});runs=[];used=0;}
      for(const part of wrap(text,font,size,columnWidth))lines.push({runs:[{text:part,url:item.url}]});continue;
     }
     const separator=runs.length?' · ':'';
     const add=font.widthOfTextAtSize(separator+text,size);
     if(runs.length&&used+add>columnWidth){lines.push({runs});runs=[];used=0;}
     if(runs.length){runs.push({text:' · '});used+=font.widthOfTextAtSize(' · ',size);}
     runs.push({text,url:item.url});used+=itemWidth;
    }
    if(runs.length)lines.push({runs});
   }else{
    for(const item of section.items){
     for(const text of wrap(item.text,font,size,columnWidth))lines.push({runs:[{text,url:item.url}]});
     lines.push({space:true,units:.35});
    }
   }
   lines.push({space:true,units:section.inline ? 0.2 : 0.75});
  }
  const leading=size*1.23;let column=0,y=height-151;
  const positioned=[];
  for(let i=0;i<lines.length;i++){
   const line=lines[i],needed=leading*(line.units||1);
   const following=lines[i+1];
   if(y-needed<54||(line.heading&&following&&!following.space&&y-needed-2*leading<54)){column++;y=height-151;}
   if(column>=columns)return null;
   positioned.push({...line,x:margin+column*(columnWidth+gap),y});y-=needed;
  }
  return {lines:positioned,size,columns,columnWidth};
 }
 let content;
 for(const columns of (summary.compact?[2,3]:[1,2])){
  for(let size=summary.compact?10:11.5;size>=7;size-=.25){content=layout(size,columns);if(content)break;}
  if(content)break;
 }
 if(!content)throw new Error('La synthèse dépasse une page à une taille lisible.');
 function link(text,url,x,y,size,face){
  page.drawText(text,{x,y,size,font:face,color:url?blue:ink});
  if(!url)return;
  const annot=pdf.context.register(pdf.context.obj({Type:'Annot',Subtype:'Link',Rect:[x,y-2,x+face.widthOfTextAtSize(text,size),y+size],Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of(url)}}));
  let annots=page.node.lookup(PDFName.of('Annots'));
  if(!annots){annots=pdf.context.obj([]);page.node.set(PDFName.of('Annots'),annots);}annots.push(annot);
 }
 page.drawRectangle({x:margin,y:height-31,width:38,height:3,color:rgb(.91,.63,.09)});
 page.drawText('ORBIVIA  /  '+safe(summary.date),{x:margin,y:height-49,size:8,font,color:muted});
 page.drawText(safe(summary.title),{x:margin,y:height-77,size:23,font:bold,color:ink});
 page.drawText(safe(summary.outcome),{x:margin,y:height-104,size:15,font:bold,color:ink});
 page.drawText('SYNTHÈSE · RAISONS ET SOURCES',{x:margin,y:height-129,size:8,font,color:muted});
 for(const line of content.lines){
  if(line.space)continue;
  let x=line.x;const face=line.heading?bold:font,size=content.size+(line.heading ? 0.6 : 0);
  for(const run of line.runs){link(run.text,run.url,x,line.y,size,face);x+=face.widthOfTextAtSize(run.text,size);}
 }
 page.drawLine({start:{x:margin,y:43},end:{x:width-margin,y:43},thickness:.5,color:rgb(.85,.88,.91)});
 const note=wrap(summary.note,font,7.1,width-2*margin);
 for(let i=0;i<note.length;i++)page.drawText(note[i],{x:margin,y:31-i*8,size:7.1,font,color:muted});
 pdf.setSubject('Synthèse sur une page. Détail des réponses consultable dans le questionnaire ORBIVIA.');
 return pdf.save();
}
const api={create};
if(typeof module==='object'&&module.exports)module.exports=api;else window.ORBIVIA_TOOL_PDF=api;
})();
