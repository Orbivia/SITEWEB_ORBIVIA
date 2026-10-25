# Outils publics ORBIVIA

Deux outils autonomes, accessibles depuis l’onglet **Outils** de la navigation du site :

- `/outils/classification/` : **Classification MDR**, questionnaire conditionnel, résultat justifié et réponses à préciser. Aucun champ projet, fabricant ou relecteur.
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

245 tests réussis sur le site public. Le contrôle `python scripts/check-site.py` vérifie également les liens, ancres et ressources locales des 48 pages HTML, y compris les anciennes adresses de projets conservées comme redirections.

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
