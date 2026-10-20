import { ENDPOINT, cleanContext, buildPayload, submissionState } from './contact-core.mjs';
const form = document.querySelector('#contact-form');
const feedback = document.querySelector('#contact-feedback');
const submit = document.querySelector('#contact-submit');
const confirmation = document.querySelector('#contact-confirmation');
let sending = false;
const params = new URLSearchParams(location.search);
const project = cleanContext(params.get('projet'));
if (project) {
  document.querySelector('#project-reference').value = project;
  const context = document.querySelector('#project-context');
  context.textContent = 'Votre demande fait référence au projet : ' + project;
  context.hidden = false;
}
document.querySelector('#contact-source').value = project ? 'Fiche projet : ' + project : 'Page contact Orbivia';
function callbackUI() {
  const callback = form.elements.retour.value === 'rappel';
  document.querySelector('#contact-phone').required = callback;
  document.querySelector('#phone-optional').hidden = callback;
  document.querySelector('#callback-slot').hidden = !callback;
}
form.addEventListener('change', callbackUI);
callbackUI();
function showConfirmation(callback) {
  form.hidden = true;
  confirmation.hidden = false;
  document.querySelector('#callback-confirmation').hidden = !callback;
  confirmation.focus({ preventScroll: true });
  confirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending || !form.reportValidity()) return;
  const values = Object.fromEntries(new FormData(form));
  if (values._honey) return;
  sending = true; submit.disabled = true;
  feedback.removeAttribute('data-error'); feedback.textContent = 'Envoi en cours…';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(buildPayload(values)), signal: controller.signal });
    const result = await response.json();
    const state = submissionState(response, result);
    if (state !== 'success') throw new Error(state);
    showConfirmation(values.retour === 'rappel');
  } catch (error) {
    feedback.setAttribute('data-error', 'true');
    feedback.textContent = error.message === 'activation'
      ? 'L’envoi par formulaire n’est pas encore activé. Votre demande n’a pas été confirmée : utilisez le lien « Écrire à Orbivia » présent sur cette page.'
      : 'L’envoi n’a pas pu être confirmé. Votre texte est conservé : réessayez ou utilisez le lien « Écrire à Orbivia » présent sur cette page.';
    feedback.focus();
  } finally {
    clearTimeout(timer); sending = false; submit.disabled = false;
  }
});
