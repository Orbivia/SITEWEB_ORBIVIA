> Publication actuelle : les questionnaires Classification MDR/IVDR et Choix de connectivité, ainsi que le générateur d'étiquettes de traçabilité, sont accessibles. Le parcours normes reste en source, retiré de l’accueil et du sitemap, et exclu de GitHub Pages par `_config.yml`.

# Outils publics ORBIVIA

Trois outils autonomes, accessibles depuis l’onglet **Outils** de la navigation du site :

- `/outils/classification/` : **Classification MDR / IVDR**, questionnaire conditionnel, résultat justifié et réponses à préciser. Aucun champ projet, fabricant ou relecteur.
- `/outils/connectivite/` : **Choix de connectivité**, questionnaire de présélection selon l’usage, l’autonomie, les réseaux, la sécurité et les coûts.
- `/outils/etiquettes-tracabilite/` : **Étiquetage de dispositifs médicaux (MDR)**, questionnaire conditionnel de sélection des informations et références de symboles à examiner pour une étiquette. Synthèse indicative imprimable, pas encore un composeur d'étiquettes.

Le questionnaire `/outils/normes/` reste maintenu dans les sources, sans publication actuellement.

L’accueil `/outils/` présente ces trois outils. Compliance Studio est désormais une application privée conservée dans Google Drive. Il n’est plus publié sur orbivia.fr.

## Code commun

- `shared/questionnaire-ui.css` et `shared/questionnaire-ui.js` : système visuel réutilisable pour les questions, réponses avec sous-titre facultatif et info-bulles flottantes (sans décalage du contenu). **À utiliser pour les futurs questionnaires.**
- `shared/QUESTIONNAIRE_DESIGN.md` : conventions HTML/CSS et contrôles responsive à effectuer avant publication.
- `connectivite/connectivite.js` : questions, réponses, conditions et moteur de présélection de connectivité ; `connectivite/connectivite.css` : styles spécifiques à ce parcours.

- `questionnaire.js` : interface et navigation des deux questionnaires, commentaires, reprise ciblée, réinitialisation et affichage des résultats.
- `questionnaire.css` : présentation commune et affichage mobile.
- `classification/presentation.js` : textes des 96 questions MDR/IVDR et pictogrammes SVG bicolores. Présentation indépendante des règles : mêmes identifiants, valeurs et ordre des réponses. Les critères complets restent dans le « i ».
- `classification/design.css` : présentation du questionnaire et du résultat publics, cartes en une colonne sur mobile.
- `tool-model.js` : validation de la reprise, interprétation des réponses et rapports autonomes.
- `shared/classification-engine.js` : moteur MDR extrait du code historique ; le questionnaire public n’exige pas de formulaire de destination. Les réponses doivent néanmoins correspondre à la destination réellement prévue.
- `shared/normes-questions.js` : questions techniques communes, extraites sans changement de l’ancien module.
- `shared/normes-model.js`, `normes-catalogue.js`, `normes-aide.js` et `normes-explications.js` : dépendances, catalogue et aides partagés.

Les deux questionnaires publics n’accèdent pas aux projets documentaires. Leurs clés de stockage local sont `orbivia-public-classification-v1` et `orbivia-public-norms-v1`. Recommencer un outil efface uniquement son état. Les anciennes réponses à des sous-questions désactivées ne participent pas au résultat.

## Exports

**Exporter le résultat en PDF** télécharge une synthèse A4 d’une seule page, préparée localement par `pdf-export.js` à partir de `tool-model.js` (`summary`). Aucun dialogue d’impression ni service externe.

- Classification : classe proposée, profil déclaré, règles retenues avec leurs raisons, points à préciser et source MDR cliquable.
- Normes : toutes les références proposées, regroupées par motif de sélection, avec chaque référence cliquable vers l’éditeur. La mise en page adapte les colonnes et la typographie ; le cas extrême des 278 références est testé sans en omettre.

Les réponses complètes et commentaires restent consultables dans le résultat de l’outil. Ils ne sont pas reproduits dans cette fiche de synthèse.

## Vérifications

```sh
node --test tests/*.test.*
git diff --check
```

Les tests du site et de l’interface partagée doivent réussir avant publication. Le contrôle `python scripts/check-site.py` vérifie également les liens, ancres et ressources locales des 48 pages HTML, y compris les anciennes adresses de projets conservées comme redirections.

## Questions et clarifications

`question-examples.js` contient des exemples pour les 64 questions de classification et les 64 questions techniques. Ils sont affichés avec les explications et les liens officiels. Les noms de produits ne suffisent pas à déduire une classe.

`clarification.js` fournit une aide déterministe adaptée aux 128 champs. Les critères simples sont reformulés ; les sujets complexes ouvrent des sous-questions. Toute proposition doit être confirmée. Une incertitude persistante permet de continuer avec un résultat provisoire et de revoir directement le point à la fin. Réponses, commentaires, traces et brouillons sont conservés après rechargement. Voir [CLARIFICATION_MAINTENANCE.md](CLARIFICATION_MAINTENANCE.md).

## Classification et progression

Le moteur MDR est en version `mdr-questionnaire-2`. Les corrections de règles, la matrice de couverture et les hypothèses EEG / CPAP figurent dans [CLASSIFICATION_VALIDATION.md](CLASSIFICATION_VALIDATION.md). Les 22 règles ont des scénarios attendus ; cette couverture ne vaut pas validation réglementaire exhaustive de tous les produits possibles.

Les choix usuels précèdent les fonctions particulières, sans présélection. Le pourcentage se fonde sur la position fixe de chaque question dans le parcours de référence. Les branches inapplicables sont sautées. Les sous-questions d’aide ne modifient pas l’avancement. Un point non résolu empêche d’afficher 100 %.

Les anciens choix `checking` sont ignorés à la restauration, sans effacer les autres réponses. « Reprendre à zéro » est disponible dans le questionnaire et le résultat ; sa confirmation n’efface que les réponses de l’outil courant.

## Affichage et publication

Les aides, commentaires et listes longues se déplient à la demande. Les cibles tactiles restent accessibles ; les contenus ouverts peuvent défiler. Le pied de page compact contient les trois liens légaux sur les deux outils.

Le site public utilise uniquement le moteur `shared/`. Aucun fichier de Compliance Studio n’est nécessaire. L’ancien générateur de rapport HTML a été retiré : l’export public utilise uniquement `summary` et `pdf-export.js`. Les tests et documents de maintenance sont exclus de GitHub Pages par `_config.yml`.

## Parcours IVDR

Le choix « Diagnostic in vitro / accessoire DIV » ouvre 32 champs conditionnels consacrés à la qualification, à la fonction du produit et aux règles IVDR. Les sept règles et les règles d’application des logiciels, calibrateurs et contrôles à valeur assignée sont calculées par `shared/ivdr-engine.js`. `shared/classification-router.js` choisit le moteur et la progression de référence en fonction du type de produit. Les règles MDR existantes restent dans leur module propre.

Les champs IVDR portent leurs exemples, explications, critères de clarification et liens officiels. Les quatre classes A, B, C et D utilisent le même écran et le PDF d’une page, avec titre, source et nom de fichier IVDR. Un point reporté reste provisoire et peut être revu directement. Les anciennes analyses IVDR interrompues au choix du type reprennent à la nouvelle qualification.

Voir [IVDR_VALIDATION.md](IVDR_VALIDATION.md) pour la couverture, les cas limites et les sources.

## Revue des parcours — 25 octobre 2026

La suite comprend désormais 333 tests, dont 1 200 simulations reproductibles (300 MDR, 300 accessoires MDR, 300 IVDR, 300 normes), chacune avec reprise après chaque réponse, incertitudes et modification d’une réponse antérieure. Les simulations contrôlent terminaison, reprise, progression et absence de conclusion définitive en présence de réponses non résolues. Les tests existants contrôlent règles et exports.

Corrections : les configurations MDR non couvertes et les tissus viables restent visibles dans la liste des points à préciser et empêchent 100 %. L’écran de refus de qualification IVDR permet de revoir directement cette réponse, sans effacer le parcours. Cette revue teste les comportements couverts ; elle ne démontre pas l’absence de tout bug ni une validation réglementaire exhaustive.

### Sources des 64 aides normatives

Chaque bulle renvoie désormais à une ou deux références liées à son thème. Les fiches officielles identifiées sont liées directement ; les autres liens portent explicitement « Rechercher … — catalogue ISO/IEC » et transmettent la référence au catalogue de l’éditeur. Le lien IVDR remplace le MDR pour la définition du diagnostic in vitro. Les pages AFNOR des masques, gants et textiles ont été recherchées en tenant compte des versions remplacées ; aucun numéro d’édition n’est imposé par le questionnaire. Une note distingue ces sources d’une décision d’applicabilité ou d’harmonisation. La suite comporte 334 tests, dont le contrôle des sources des 64 bulles.

## Étiquetage des dispositifs médicaux : règles et limites (v2)

- **Objet** : questionnaire public d'aide à l'étiquetage des dispositifs médicaux selon le MDR 2017/745 (annexe I, 23.2 et 23.3 ; annexe VI pour UDI) avec références de symboles ISO 15223-1:2021, amendement A1:2025 à vérifier pour 5.1.2. L'ISO 15223-2:2010 sert au développement et à la validation de **nouveaux** symboles, pas au choix automatisé des étiquettes.
- **Distinction impérative** : obligation d'indiquer une information MDR ≠ obligation d'utiliser le pictogramme ISO. Le code ISO affiché dans la synthèse indique le symbole correspondant **possible** ; les fichiers graphiques normalisés ne sont pas redistribués.
- **Périmètre** : MDR UE seulement (pas l'IVDR ni les marchés hors UE). Les prototypes, dispositifs sur mesure et investigations cliniques ont un traitement distinct : pas d'UDI/CE commercial présumé, mentions dédiées sur le support d'étiquetage.
- **Supports** : dispositif physique, emballage unitaire, emballage stérile et conditionnement extérieur. Le marquage direct UDI des produits réutilisables retraités est vérifié séparément ; les étiquettes d'emballage doivent être traitées à part.
- **Sélection** : stérilité et méthodes exclusives 5.2.1 OU 5.2.2–5.2.5/5.2.10 ; barrière 5.2.11–5.2.14 à associer près de la méthode ; 5.2.6 uniquement sans ré-stérilisation, sans contradictions ; 5.2.7 réservé à l'usage pertinent de distinction de versions stériles/non stériles ; 5.2.9 si seul le chemin de fluide est stérile.
- **UDI** : le support UDI (AIDC et HRI selon réglementation) est distinct du symbole 5.7.10 facultatif. Le Basic UDI-DI n'est pas indiqué sur l'étiquette. Marquage direct pour dispositifs réutilisables retraités (sauf dérogation) : classe III/implantables depuis 2023, IIa/IIb depuis 2025, classe I à partir du 26 mai 2027.
- **Autres cas** : 5.4.12 lorsque plusieurs usages concernent le même patient ; symboles matières 5.4.5 à 5.4.11 et stockage 5.3.1–5.3.9 sélectionnés selon les réponses ; fabricant/mandataire/importateur et marquage CE selon statut réglementaire.
- **Conditionnement stérile** : mois/année de fabrication et limite d'utilisation indiqués (MDR annexe I, 23.3(h–i)), méthode, fabricant, dispositif et consigne de vérification de la notice si ouverture/dommage. Incohérences affichées comme alertes avant impression.
- **Ergonomie** : une question par écran, réponses conditionnelles, synthèse courte par support, explications normatives repliables, « Reprendre à zéro », stockage temporaire en session. Le nouveau moteur utilise la clé de session \`orbivia-mdr-label-wizard-v2\` pour ne pas reprendre des résultats obsolètes.
- **Tests** : \`node outils/etiquettes-tracabilite/tests/run.mjs\` teste les combinaisons interdites, les différents conditionnements, l'UDI, les substances et un parcours complet. Le contrôle visuel multi-écran et la lecture de codes sur impression demeurent hors champ de ces tests.
- **Pas de génération d'étiquette** : aucune exportation de pictogrammes normalisés, aucun PDF d'étiquette finale, aucun avis de conformité. Il faut une revue produit et marché avant mise en production.

