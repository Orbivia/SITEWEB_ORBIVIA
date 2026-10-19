const gallery=document.querySelector('#gallery'),dialog=document.querySelector('#project-dialog');
const labels={Medical:'Santé',IOT:'Objets connectés',Autre:'Conception produit',Logiciel:'Logiciel'};
let opener;
function description(project){return project.desc.replace(/https?:\/\/[^\s]+/g,'').trim();}
function render(category='All'){
 gallery.replaceChildren();const selected=projets.filter(p=>category==='All'||p.category===category);
 document.querySelector('#result-count').textContent=`${selected.length} projets à découvrir`;
 for(const project of selected){
  const button=document.createElement('button');button.type='button';button.className='project-card';
  const frame=document.createElement('div');frame.className='project-image';
  const image=document.createElement('img');image.src=project.img;image.alt=project.title;image.loading='lazy';frame.append(image);
  const copy=document.createElement('div');copy.className='project-copy';
  const tag=document.createElement('span');tag.className='eyebrow';tag.textContent=labels[project.category];
  const title=document.createElement('h3');title.textContent=project.title+' ↗';
  const summary=document.createElement('p');summary.textContent=description(project);
  copy.append(tag,title,summary);button.append(frame,copy);button.addEventListener('click',()=>openProject(project,button));gallery.append(button);
 }
}
function openProject(project,button){
 opener=button;document.querySelector('#dialog-title').textContent=project.title;
 const image=document.querySelector('#dialog-image');image.src=project.detailImg || project.img;image.alt=project.title;
 document.querySelector('#dialog-category').textContent=labels[project.category];
 document.querySelector('#dialog-description').textContent=description(project);
 const links=document.querySelector('#dialog-link');links.replaceChildren();
 const url=project.desc.match(/https?:\/\/[^\s]+/);
 if(url){const link=document.createElement('a');link.href=url[0];link.className='button';link.textContent='Découvrir le projet ↗';if(new URL(url[0]).hostname!=='orbivia.fr'){link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Découvrir le projet (nouvel onglet)');}links.append(link);}
 dialog.showModal();document.body.classList.add('modal-open');
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render(button.dataset.filter);}));
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus();});
render();

// Allow homepage project links to open the matching project directly.
const requestedProject=new URLSearchParams(location.search).get('projet');
if(requestedProject){const project=projets.find(p=>p.title===requestedProject);if(project){const index=projets.indexOf(project);openProject(project,gallery.children[index]);}}
