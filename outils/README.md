# Outils publics ORBIVIA

Deux outils autonomes, accessibles depuis l’onglet **Outils** de la navigation du site :

- `/outils/classification/` : **Classification MDR**, questionnaire conditionnel, résultat justifié et réponses à préciser. Aucun champ projet, fabricant ou relecteur.
- `/outils/normes/` : **Normes du dispositif**, questionnaire technique, références proposées, motifs fondés sur les réponses actives et liens vers les éditeurs. Aucun arbitrage manuel de chaque norme requis pour obtenir le résultat.

L’accueil `/outils/` présente uniquement ces deux outils. L’espace documentaire historique reste à son adresse existante ; le développement Windows est reporté.

## Code commun

- `questionnaire.js` : interface et navigation des deux questionnaires, commentaires, reprise ciblée, réinitialisation et affichage des résultats.
- `questionnaire.css` : présentation commune et impression.
- `tool-model.js` : validation de la reprise, interprétation des réponses et rapports autonomes.
- `compliance/classification-engine.js` : moteur MDR extrait du code historique ; le dossier documentaire et le questionnaire public utilisent les mêmes règles et questions. Le mode public n’exige pas de formulaire de destination ; le dossier documentaire conserve cette exigence. Les réponses doivent néanmoins correspondre à la destination réellement prévue.
- `compliance/normes-questions.js` : questions techniques communes, extraites sans changement de l’ancien module.
- `compliance/normes-model.js`, `normes-catalogue.js`, `normes-aide.js` et `normes-explications.js` : dépendances, catalogue et aides partagés.

Les deux questionnaires publics n’accèdent pas aux projets documentaires. Leurs clés de stockage local sont `orbivia-public-classification-v1` et `orbivia-public-norms-v1`. Recommencer un outil efface uniquement son état. Les anciennes réponses à des sous-questions désactivées ne participent pas au résultat.

## Exports

**Exporter le résultat** est un lien de téléchargement natif vers un rapport HTML autonome, avec date, résultat, raisons, sources, réponses et commentaires. **Imprimer / PDF** utilise l’impression du navigateur sur une version complète dédiée ; l’enregistrement PDF dépend du dialogue d’impression du système. Le résultat incomplet reste identifié comme provisoire. Les références normatives ne sont pas déclarées automatiquement obligatoires, à jour ou harmonisées.

## Vérifications

```sh
node --test tests/*.test.*
git diff --check
```

49 tests passent après cet ajout, dont six scénarios propres aux outils publics : résultat sans identité de projet, maintien des résultats du moteur partagé, références conditionnelles et raisons, rapports et échappement des commentaires, reprise isolée, chemins des dépendances et accès depuis le site.

Essais navigateur du 25 octobre 2026 : accueil du site → Outils → classification ; cas IVDR sans classe MDR ; remise à zéro ; 18 questions sur un dispositif fictif ; modification/commentaire d’une réponse et reprise ciblée d’un seul point à vérifier ; 55 questions techniques sur un profil fictif ; résultat normatif, recherche IEC 62304, motif logiciel et lien officiel ; retour d’un outil à l’autre sans mélange des réponses ; accès à l’espace documentaire historique et question de classification sans erreur JavaScript.

Affichage contrôlé à 390 px et 320 px : accueil, résultat et question sans débordement horizontal dans les vues mesurées ; menu mobile et aide contextuelle vérifiés. Rapport HTML contrôlé automatiquement et attributs du lien de téléchargement vérifiés. Le pilote distant n’a pas remonté d’événement de téléchargement ; le fichier téléchargé n’a donc pas été récupéré pour cette vérification. L’impression PDF n’a pas été exécutée sur un appareil physique.
