# Maintenir ORBIVIA Compliance Studio

## Point d’entrée et responsabilités

L’application reste statique et ne nécessite ni installation de dépendances ni compilation. `index.html` contient les données initiales et charge les scripts dans leur ordre de dépendance. Le parcours courant utilise les mêmes projets et le même stockage que les outils historiques.

| Fichier | Responsabilité |
| --- | --- |
| `v4-app.js` | Navigation du parcours, événements, coordination des moteurs, sauvegarde des réponses et imports de preuves |
| `document-views.js` | Rendu des fiches, du dossier, des actions et des exports ; dépendances explicites via `create(context)` |
| `document-review.js` | Validation d’une revue et remise à zéro des contrôles lorsque les preuves changent ; fonctions pures |
| `v4-data.js` | 30 livrables, arborescence, rattachements et état des revues |
| `v4-files.js` | IndexedDB, fichiers binaires, copie sur PC et archive ZIP |
| `journey-metrics.js` | Calcul des pourcentages, distincts de la conformité |
| `normes-model.js` | Questions actives, réponses effectives, conditions de proposition et reprise filtrée |
| `normes.js` | Questionnaire technique, catalogue et décisions sur les références |
| `normes-catalogue.js` / `normes-explications.js` | Catalogue et explications avec sources éditeur |
| `gspr.js` / `gspr-catalogue.js` | Matrice MDR, brouillons, validation et export des revues |
| `backup-validation.js` | Validation des sauvegardes avant remplacement des projets locaux |
| `core.js` / `ui-v312.js` | Moteur de classification et outils historiques compatibles |
| `v4.css` | Présentation du parcours actuel et adaptations mobiles |

Les vues simples du parcours ne reconstruisent plus l’ensemble de l’interface historique avant de le remplacer. Les fiches, actions et exports sont rendus directement ; ils ne passent plus par l’extraction de fragments de pages complètes dans un DOM temporaire. Les pages réglementaires et les outils avancés utilisent encore les moteurs historiques.

## Modifier sans casser les données

- Ajouter un livrable dans `v4-data.js`, avec un identifiant stable, un dossier et des points de contrôle. Ne pas réutiliser un identifiant pour un autre document.
- Modifier la présentation d’une fiche dans `document-views.js`. Les écritures restent dans le contrôleur ; une vue ne sauvegarde pas de revue.
- Modifier les règles de validation dans les modules purs et ajouter un cas de non-régression correspondant. Une preuve attachée ne suffit jamais à valider une revue.
- Une sous-question désactivée conserve sa réponse historique. Utiliser `ORBIVIA_NORMES_INFO.answers(p)` pour les propositions et indicateurs ; ne pas exploiter directement les anciennes réponses conditionnelles.
- Les brouillons MDR (`docflow.gsprMatrix.drafts`) sont séparés des revues enregistrées (`entries`). Les statistiques et exports utilisent les revues enregistrées.
- Garder les noms et identifiants des champs existants pour la compatibilité JSON. Étendre `backup-validation.js` lors de l’ajout de structures de données.
- Les fichiers binaires restent dans IndexedDB, indexés par projet et document. Le JSON ne contient pas leur contenu. Ne pas changer ces clés sans migration explicite.
- Lors d’une publication coordonnée de plusieurs modules, mettre à jour les paramètres de version des scripts concernés et du CSS dans `index.html` pour éviter le mélange de versions en cache.

## Vérifications

Depuis la racine du dépôt :

```sh
node --test tests/compliance*.test.cjs
git diff --check
```

Les tests couvrent notamment la restauration des anciennes sauvegardes, les formats normatifs invalides, les dépendances des questions, la reprise des réponses incertaines, les validations documentaires, les preuves modifiées, le ZIP relu par Python, les pourcentages et le rendu des 30 fiches pour chaque disponibilité. Aucun navigateur ni service tiers n’est requis pour les tests automatiques.

Avant publication, essayer dans un projet fictif : profil → classification (résultat incomplet et confirmation) → questions techniques → documents → dossier ; puis les normes retenues/reportées/exclues, la matrice MDR, les actions, le changement de projet et les outils avancés. Contrôler une largeur de 390 px et de 320 px. Ne pas utiliser les données réelles d’un dispositif pour les essais.

## Vérification V5.3 du 25 octobre 2026

- 16 tests automatiques réussis. Rendu des 30 fiches testé dans les six états de disponibilité ; un brouillon ne compte pas comme une revue.
- Navigateur : huit questions de profil, cas IVDR hors périmètre puis récupération, 18 questions de classification d’un dispositif fictif et confirmation refusée sans relecteur, puis confirmation valide.
- Navigateur : 55 questions techniques actives dans une configuration fictive, transition vers les documents, parcours des 30 fiches et retour au dossier après la dernière.
- Normes : bulle et lien officiel, sélection, report, exclusion refusée sans motif puis acceptée avec motif.
- Matrice MDR : recherche immédiate (quatre lignes sur « logiciel » dans le filtre toutes), brouillon conservé après navigation, preuve suffisante incomplète refusée, écart enregistré.
- Actions : ouverture directe de l’action et volet conservé après changement de statut.
- Treize outils avancés chargés sans erreur JavaScript de l’application ; sélecteur d’outil disponible sur mobile.
- Duplication : les preuves IndexedDB sont copiées vers le nouvel identifiant de projet ; les fichiers source absents restent signalés comme références seules. Copie vérifiée automatiquement.
- Nouveau projet créé depuis les outils avancés : arrivée dans le questionnaire simplifié ; changement vers le projet précédent : reprise de son écran et de ses données.
- Largeurs 390 et 320 px : contrôle de l’accueil, du profil, de la classification, du dossier, des documents classés, de la matrice, de l’aide des normes et de l’accès aux outils ; aucun débordement horizontal constaté dans les vues mesurées. Ces essais ne remplacent pas un test sur appareils physiques.
- Limite : le pilote de navigateur s’est interrompu lors du nouvel essai d’import d’un fichier. L’import binaire, la restauration JSON et la copie dans un dossier PC ne sont donc pas déclarés revalidés de bout en bout dans cette passe. Le stockage existant est conservé et l’export ZIP reste vérifié automatiquement.

## Dette technique restante

`core.js`, `normes.js`, `gspr.js` et `ui-v312.js` conservent des adaptations historiques de fonctions globales. Éviter d’ajouter une nouvelle couche de remplacement de `render` : étendre les modules du parcours ou exposer une fonction explicite dans le moteur concerné. Une séparation complète du moteur de classification et des registres historiques serait une migration distincte, avec des jeux de sauvegardes et des scénarios réglementaires supplémentaires.
