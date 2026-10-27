# Interface commune des questionnaires ORBIVIA

## Objectif

Les questionnaires **Classification MDR/IVDR**, **Choix de connectivité** et **Étiquetage médical** utilisent un système visuel partagé. Chaque nouveau questionnaire doit reprendre ce système, plutôt que recopier des correctifs CSS d'un outil à l'autre.

## Fichiers

- `/outils/questionnaire.css` : base historique des composants de questionnaire et présentation générique.
- `/outils/shared/questionnaire-ui.css` : **référence visuelle actuelle** pour les titres, choix, sous-titres conditionnels et info-bulles flottantes.
- `/outils/shared/questionnaire-ui.js` : comportement commun des info-bulles (fermeture extérieure / Échap).
- `/outils/shared/questionnaire-layout.css` : grille ordinateur, empilement mobile, dimensions, navigation et densités partagées.
- `/outils/shared/questionnaire-layout.js` : détecte automatiquement la phase question et réduit les espaces si nécessaire (sans masquer les réponses).
- `/outils/shared/help-sheet.css` : panneau « Aide au choix » distinct de la petite bulle d'information.
- `/outils/<outil>/...css` : uniquement ce qui est spécifique à l'outil (mise en page, résultats et cas particuliers).

## Brancher un nouveau questionnaire

Dans la page HTML, ajouter `data-questionnaire-ui="v1"` sur `<body>`. Charger `/outils/questionnaire.css`, puis la feuille CSS spécifique de l'outil, puis `/outils/shared/questionnaire-ui.css`, et **en dernier** `/outils/shared/questionnaire-layout.css`. Charger `/outils/shared/questionnaire-ui.js` une seule fois, puis `/outils/shared/questionnaire-layout.js` **après** le script qui affiche les questions.

Respecter les classes HTML communes :

- `.question-progress` pour l'avancement ;
- `.question-card` et `.question-heading` ;
- le titre de chaque question est uniquement textuel : **aucun pictogramme dans le titre ni dans les réponses** ;
- `.answer` contenant `.answer-copy` et, **seulement si nécessaire**, `<small>` avec une explication brève ;
- `<details class="info-bubble"><summary aria-label="Comprendre cette question">i</summary><div>...</div></details>` à côté du titre ; cette bulle flotte par-dessus le contenu sans le déplacer ;
- « Aide au choix » réservée aux questions qui demandent une assistance plus approfondie ;
- navigation avec « Précédent », « Continuer » uniquement lorsque nécessaire, et « Reprendre à zéro » comme vrai bouton secondaire.

Conserver le bleu nuit `#17263a` et le doré `#e7a116` pour les éléments de navigation et de sélection. Les informations optionnelles ne doivent pas rendre tous les boutons inutilement hauts.

## Affichage sur un seul écran

Tous les outils présentent la question dans le même cadre, avec le titre et « Aide au choix » à gauche (si disponible), et les réponses à droite sur ordinateur. Sur téléphone, les réponses s'empilent sous le titre. Le pied de page est masqué pendant le questionnaire, mais réapparaît sur les résultats.

Le script commun ajoute temporairement `quiz-active`, puis les classes `quiz-compact`, `quiz-dense` ou `quiz-tight` si les réponses dépassent la fenêtre. Si elles ne tiennent toujours pas, `quiz-scroll` réactive le défilement. **Ne jamais masquer ou couper une réponse pour tenir artificiellement dans la fenêtre.** Les aides modales et les synthèses restent indépendantes. Le moteur ne modifie aucune valeur métier.

Un nouvel outil doit disposer d'un conteneur principal détectable et d'une `.question-card` (hors résultats), contenant ses réponses dans `.answer-list`, `.cx-options` ou `.label-options`. Adapter la détection de la racine commune si le conteneur d'un nouvel outil diffère.

## Points de contrôle

Vérifier sur téléphone (largeurs 320, 360, 390 px) et sur ordinateur (768, 1280 px) :

1. les titres des questions ne contiennent aucune icône et ne réservent pas de grand espace vide ;
2. seuls la question et les intitulés des réponses sont visibles ; les sous-titres et précisions des choix sont regroupés dans la bulle `i`, sans doublons ;
3. ouvrir/fermer la bulle `i` **ne change ni la hauteur de la page, ni la position des boutons** ; clic extérieur et Échap ferment ;
4. l'aide et les réponses restent utilisables au clavier et au toucher ;
5. l'avancement, l'aide, le retour, la réinitialisation et la synthèse fonctionnent sans changer les valeurs métier.

Exécuter `node --test tests/*.test.*` et `python scripts/check-site.py` avant publication. Les tests statiques ne remplacent pas une inspection visuelle dans un navigateur.

## Pictogrammes pleins

La famille commune se trouve dans `shared/icons/` : silhouettes simples sur une grille 32 × 32, bleu nuit et accent doré. Classification et Étiquetage chargent ces SVG ; Connectivité utilise les variantes de la même famille dans son dossier d’icônes. Ne pas réintroduire de PNG, de traits fins, de dégradés ni de textes dans les icônes. Les symboles servent à repérer les questions et ne constituent pas des marquages réglementaires imprimables.
