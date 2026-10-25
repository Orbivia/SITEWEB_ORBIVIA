# Outils publics ORBIVIA

Deux outils autonomes, accessibles depuis l’onglet **Outils** de la navigation du site :

- `/outils/classification/` : **Classification MDR / IVDR**, questionnaire conditionnel, résultat justifié et réponses à préciser. Aucun champ projet, fabricant ou relecteur.
- `/outils/normes/` : **Normes du dispositif**, questionnaire technique, références proposées, motifs fondés sur les réponses actives et liens vers les éditeurs. Aucun arbitrage manuel de chaque norme requis pour obtenir le résultat.

L’accueil `/outils/` présente uniquement ces deux outils. Compliance Studio est désormais une application privée conservée dans Google Drive. Il n’est plus publié sur orbivia.fr.

## Code commun

- `questionnaire.js` : interface et navigation des deux questionnaires, commentaires, reprise ciblée, réinitialisation et affichage des résultats.
- `questionnaire.css` : présentation commune et affichage mobile.
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

328 tests réussis sur le site public. Le contrôle `python scripts/check-site.py` vérifie également les liens, ancres et ressources locales des 48 pages HTML, y compris les anciennes adresses de projets conservées comme redirections.

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
