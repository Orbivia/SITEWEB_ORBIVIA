# Outils publics ORBIVIA

Deux outils autonomes, accessibles depuis l’onglet **Outils** de la navigation du site :

- `/outils/classification/` : **Classification MDR**, questionnaire conditionnel, résultat justifié et réponses à préciser. Aucun champ projet, fabricant ou relecteur.
- `/outils/normes/` : **Normes du dispositif**, questionnaire technique, références proposées, motifs fondés sur les réponses actives et liens vers les éditeurs. Aucun arbitrage manuel de chaque norme requis pour obtenir le résultat.

L’accueil `/outils/` présente uniquement ces deux outils. Compliance Studio est désormais une application privée conservée dans Google Drive. Il n’est plus publié sur orbivia.fr.

## Code commun

- `questionnaire.js` : interface et navigation des deux questionnaires, commentaires, reprise ciblée, réinitialisation et affichage des résultats.
- `questionnaire.css` : présentation commune et affichage mobile.
- `tool-model.js` : validation de la reprise, interprétation des réponses et rapports autonomes.
- `shared/classification-engine.js` : moteur MDR extrait du code historique ; le dossier documentaire et le questionnaire public utilisent les mêmes règles et questions. Le mode public n’exige pas de formulaire de destination ; le dossier documentaire conserve cette exigence. Les réponses doivent néanmoins correspondre à la destination réellement prévue.
- `shared/normes-questions.js` : questions techniques communes, extraites sans changement de l’ancien module.
- `shared/normes-model.js`, `normes-catalogue.js`, `normes-aide.js` et `normes-explications.js` : dépendances, catalogue et aides partagés.

Les deux questionnaires publics n’accèdent pas aux projets documentaires. Leurs clés de stockage local sont `orbivia-public-classification-v1` et `orbivia-public-norms-v1`. Recommencer un outil efface uniquement son état. Les anciennes réponses à des sous-questions désactivées ne participent pas au résultat.

## Exports

**Exporter le résultat en PDF** télécharge une synthèse A4 d’une seule page, préparée localement par `pdf-export.js` à partir de `tool-model.js` (`summary`). Aucun dialogue d’impression ni service externe.

- Classification : classe proposée, profil déclaré, règles retenues avec leurs raisons, points à préciser et source MDR cliquable.
- Normes : toutes les références proposées, regroupées par motif de sélection, avec chaque référence cliquable vers l’éditeur. La mise en page adapte les colonnes et la typographie ; le cas extrême des 278 références est testé sans en omettre.

Les réponses complètes et commentaires restent consultables dans le résultat de l’outil. Ils ne sont pas reproduits dans cette fiche de synthèse. `reportBody` et `report` conservent le générateur de rapport détaillé pour les usages internes et leurs tests.

## Vérifications

```sh
node --test tests/*.test.*
git diff --check
```

49 tests passent après cet ajout, dont six scénarios propres aux outils publics : résultat sans identité de projet, maintien des résultats du moteur partagé, références conditionnelles et raisons, rapports et échappement des commentaires, reprise isolée, chemins des dépendances et accès depuis le site.

Essais navigateur du 25 octobre 2026 : accueil du site → Outils → classification ; cas IVDR sans classe MDR ; remise à zéro ; 18 questions sur un dispositif fictif ; modification/commentaire d’une réponse et reprise ciblée d’un seul point à vérifier ; 55 questions techniques sur un profil fictif ; résultat normatif, recherche IEC 62304, motif logiciel et lien officiel ; retour d’un outil à l’autre sans mélange des réponses ; accès à l’espace documentaire historique et question de classification sans erreur JavaScript.

Affichage contrôlé à 390 px et 320 px : accueil, résultat et question sans débordement horizontal dans les vues mesurées ; menu mobile et aide contextuelle vérifiés. Rapport HTML contrôlé automatiquement et attributs du lien de téléchargement vérifiés. Le pilote distant n’a pas remonté d’événement de téléchargement ; le fichier téléchargé n’a donc pas été récupéré pour cette vérification. L’impression PDF n’a pas été exécutée sur un appareil physique.

### Présentation compacte

L’accueil et les questions utilisent des espacements réduits et des réponses en colonnes selon leur longueur. Les boutons conservent une hauteur minimale de 44 px. Les commentaires, aides et informations de confidentialité se déplient à la demande. Sur le résultat normatif, les exports précèdent désormais la liste des références, repliée au départ ; la recherche, les explications et les sources restent accessibles. Les rapports exportés conservent le contenu complet.

Contrôles de cette adaptation : accueil, question à six choix et résultat de classification à 390 × 640 px ; accueil et question normative à 320 × 640 px sans défilement ni débordement horizontal dans ces vues. Résultat normatif de 52 références repliées contrôlé à 390 × 640 px ; recherche IEC 62304 et détail avec source vérifiés après ouverture. Les explications ouvertes et les contenus longs peuvent naturellement nécessiter de défiler : aucune zone utile n’est masquée pour forcer la hauteur.

### Simplification des outils publics

Le résultat apparaît une fois toutes les questions actives renseignées. Le choix « À vérifier » est retiré des outils publics. Les anciennes valeurs `checking` sont ignorées à la restauration : les autres réponses et commentaires sont conservés, et le questionnaire reprend directement au premier point sans réponse. Un choix métier ambigu peut néanmoins produire une conclusion à préciser ; aucune classe n’est inventée pour un périmètre hors MDR. « Reprendre à zéro » est disponible dans les questions et le résultat ; sa confirmation efface uniquement les réponses de l’outil courant.

Le compteur « question X sur Y » a été retiré. Chaque question possède une position fixe dans le parcours de référence (`tool-model.js`, `progress`) : le pourcentage ne dépend plus du nombre de questions momentanément visibles. Les branches non applicables sont sautées ; la progression ne recule pas lorsqu’on avance. Une modification antérieure qui ouvre de nouveaux points peut légitimement réduire l’avancement ; les points sans réponse empêchent d’afficher 100 %. L’intitulé du thème reste visible au-dessus de la question.

Le pied de page compact est présent sur les pages publiques du site, l’accueil Outils et les deux questionnaires. Les trois liens conduisent aux mentions légales, aux conditions générales de prestation et à la confidentialité.

Contrôles : 51 tests, dont parcours conditionnels monotones et génération/relecture d’un PDF multipage avec annotations de liens. Parcours de classification classe I, remise à zéro et génération des deux liens PDF vérifiés dans le navigateur. La première question de classification et le pied de page tiennent à 320 × 640 et 390 × 640 pixels, sans défilement dans les vues contrôlées. Le pilote de téléchargement distant ne renvoie pas d’événement ; la récupération du fichier par ce pilote reste une limite de vérification.

### Aides par question

`question-examples.js` contient des exemples pour les 64 questions de classification et les 64 questions techniques. Ils sont affichés dans les bulles avec l’aide existante et les liens officiels. Les exemples opposent des situations lorsque cela aide à distinguer les réponses ; ils ne déduisent pas une classe du seul nom d’un produit. Le test de couverture exige au moins deux exemples par question.

La question initiale présente des boutons décrivant dispositif médical, accessoire, diagnostic in vitro, annexe XVI et statut à clarifier. Les exemples sont fondés sur les définitions MDR/IVDR et l’orientation de la Commission européenne. Les moteurs partagés de qualification, de classification et de proposition des normes restent inchangés.

Contrôles de cette révision : 53 tests réussis ; parcours classe I de 18 questions réalisé dans le navigateur ; génération du lien PDF des résultats contrôlée ; PDFs d’une page rendus avec Poppler et inspectés ; reprise des anciennes réponses incertaines testée ; première question et pied de page à 390 × 640 px sans défilement, exemples repliés au départ.

### Revue MDR et ordre des réponses

La convention d’ordre des réponses place les cas usuels avant les fonctions particulières, sans présélection et sans modifier les valeurs enregistrées. Les seuils de gravité restent présentés comme des niveaux, sans supposer qu’un risque faible serait le plus probable. Le moteur partagé est en version `mdr-questionnaire-2`. La question de contexte clinique remplace les deux anciennes questions ambiguës sur les paramètres vitaux ; les anciennes réponses sont conservées pour les autres sujets mais ce nouveau point doit être répondu explicitement.

Les corrections de règles, la matrice de couverture et les hypothèses EEG / CPAP figurent dans [CLASSIFICATION_VALIDATION.md](CLASSIFICATION_VALIDATION.md). Le guide de référence est MDCG 2021-24 Rev.1 (avril 2026). Les 22 règles ont des scénarios attendus ; cette couverture ne vaut pas validation réglementaire exhaustive de tous les produits possibles.

Contrôles : 121 tests réussis, dont 66 dédiés aux règles et cas limites ; EEG courant testé dans le navigateur en 28 questions (IIa, règle 10), CPAP simple en 27 questions (IIa, règles 9 et 12). La règle 4 est également évaluée pour les muqueuses lésées en cas d’invasivité. Une simple régulation technique ne déclenche pas automatiquement la règle 22.

### Clarifications guidées

Les 128 questions proposent « Je ne sais pas — aidez-moi à répondre ». Les sujets complexes sont décomposés en sous-questions. Toute proposition doit être confirmée. Une incertitude persistante permet de continuer avec un résultat provisoire et peut être revue directement à la fin. Les traces et brouillons sont conservés après rechargement.

Voir [CLARIFICATION_MAINTENANCE.md](CLARIFICATION_MAINTENANCE.md) pour les cas examinés et le catalogue. Contrôles : 261 tests réussis, parcours de report/résolution et reprise ciblée vérifiés dans le navigateur, aide mobile à 390 × 640 px.
