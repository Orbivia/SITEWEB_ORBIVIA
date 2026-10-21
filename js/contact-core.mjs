export const ENDPOINT = 'https://formsubmit.co/ajax/pierre.charlier@orbivia.fr';
export function cleanContext(value, max = 120) { return String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max); }
export function buildPayload(values) {
  const callback = values.retour === 'rappel';
  return {
    name: cleanContext(values.name, 100) || 'Non précisé',
    email: cleanContext(values.email, 254),
    message: String(values.message || '').trim().slice(0, 4000),
    ...(values.estimation ? { estimation: String(values.estimation).trim().slice(0, 16000) } : {}),
    telephone: cleanContext(values.telephone, 40),
    retour: callback ? 'Rappel téléphonique souhaité' : 'Réponse par e-mail',
    disponibilites: callback ? cleanContext(values.disponibilites, 180) : '',
    projet_reference: cleanContext(values.projet_reference),
    page_origine: cleanContext(values.page_origine, 200),
    _subject: 'Orbivia — nouvelle demande de devis',
    _template: 'table',
    _honey: String(values._honey || '').slice(0, 200)
  };
}
export function submissionState(response, result) {
  const message = String(result?.message || '');
  if (/activat|confirm.*email|check.*email/i.test(message)) return 'activation';
  if (response.ok && (result?.success === true || result?.success === 'true')) return 'success';
  return 'error';
}
