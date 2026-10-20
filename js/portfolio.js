const gallery = document.querySelector('#gallery');
const dialog = document.querySelector('#project-dialog');
const filters = [...document.querySelectorAll('[data-filter]')];
const labels = { Medical: 'Santé', IOT: 'Objets connectés', Autre: 'Conception produit', Logiciel: 'Logiciel' };
let category = 'All';
let opener;

function description(project) {
  return project.desc.replace(/https?:\/\/[^\s]+/g, '').trim();
}

function updateUrl(projectTitle) {
  const url = new URL(location.href);
  if (category === 'All') url.searchParams.delete('categorie');
  else url.searchParams.set('categorie', category);
  if (projectTitle) url.searchParams.set('projet', projectTitle);
  else url.searchParams.delete('projet');
  history.replaceState(null, '', url);
}

function render() {
  gallery.replaceChildren();
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  const selected = projets.filter(project => category === 'All' || project.category === category);
  document.querySelector('#result-count').textContent = `${selected.length} projet${selected.length === 1 ? '' : 's'} à découvrir`;
  for (const project of selected) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'project-card';
    button.setAttribute('aria-haspopup', 'dialog');
    const frame = document.createElement('div'); frame.className = 'project-image';
    const image = document.createElement('img');
    image.src = project.img; image.alt = project.title;
    image.loading = 'lazy'; image.decoding = 'async'; frame.append(image);
    const copy = document.createElement('div'); copy.className = 'project-copy';
    const tag = document.createElement('span'); tag.className = 'eyebrow'; tag.textContent = labels[project.category] + (project.status ? ' · ' + project.status : '');
    const title = document.createElement('h3'); title.textContent = project.title + ' ↗';
    const summary = document.createElement('p'); summary.textContent = description(project);
    copy.append(tag, title, summary); button.append(frame, copy);
    button.addEventListener('click', () => openProject(project, button)); gallery.append(button);
  }
}

function openProject(project, button) {
  opener = button;
  document.querySelector('#dialog-title').textContent = project.title;
  const image = document.querySelector('#dialog-image');
  image.src = project.detailImg || project.img; image.alt = project.title;
  document.querySelector('#dialog-category').textContent = labels[project.category] + (project.status ? ' · ' + project.status : '');
  document.querySelector('#dialog-description').textContent = description(project);
  const similar = dialog.querySelector('a[href*="contact.html"]');
  if (similar) { similar.href = 'contact.html?projet=' + encodeURIComponent(project.title) + '#contact-form'; similar.textContent = 'J’ai un besoin similaire →'; }
  const links = document.querySelector('#dialog-link'); links.replaceChildren();
  if (project.visualNote) {
    const note = document.createElement('p'); note.className = 'credit'; note.textContent = project.visualNote; links.append(note);
  }
  const url = project.desc.match(/https?:\/\/[^\s]+/);
  if (url) {
    const link = document.createElement('a'); link.href = url[0]; link.className = 'button'; link.textContent = 'Lire l’étude de cas ↗';
    if (new URL(url[0]).hostname !== 'orbivia.fr') {
      link.target = '_blank'; link.rel = 'noopener noreferrer'; link.setAttribute('aria-label', 'Découvrir le projet (nouvel onglet)');
    }
    links.append(link);
  }
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open'); updateUrl(project.title);
}

function restoreFromUrl() {
  const params = new URLSearchParams(location.search);
  const requested = projets.find(project => project.title === params.get('projet'));
  category = Object.hasOwn(labels, params.get('categorie')) ? params.get('categorie') : 'All';
  if (requested && category !== 'All' && requested.category !== category) category = 'All';
  render();
  if (requested) {
    const selected = projets.filter(project => category === 'All' || project.category === category);
    openProject(requested, gallery.children[selected.indexOf(requested)]);
  } else {
    if (dialog.open) dialog.close();
    updateUrl();
  }
}

filters.forEach(button => button.addEventListener('click', () => {
  category = button.dataset.filter; render(); updateUrl();
}));
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  if (dialog.open) return;
  document.body.classList.remove('modal-open'); updateUrl();
  if (opener?.isConnected) opener.focus();
});
window.addEventListener('popstate', restoreFromUrl);
restoreFromUrl();
