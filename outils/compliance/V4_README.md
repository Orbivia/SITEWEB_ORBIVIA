# ORBIVIA Compliance Studio — V4 (première base opérationnelle)

Cette version conserve le moteur V3 (classification, normes, GSPR, inventaire et revue documentaire) et ajoute un espace de travail documentaire en cinq rubriques : Accueil, Mon dossier, Audit, Actions et Rapports.

## Utilisation

1. Ouvrir ou créer un projet dans le bandeau supérieur.
2. Dans **Mon dossier**, choisir **Dossier MDR** ou **SMQ ISO 13485**.
3. Ouvrir une section puis un document attendu.
4. Ajouter une preuve (le fichier est copié dans IndexedDB sur cet appareil) ou rattacher une référence déjà inventoriée en V3.
5. Si souhaité, choisir **Générer sur mon PC** : le navigateur demande l'autorisation d'écriture dans un dossier ; les sous-dossiers sont créés et les fichiers déjà importés sont copiés. Les imports suivants sont aussi copiés dans le dossier choisi pendant cette session.
6. Dans **Audit**, vérifier les points associés, saisir la méthode, le relecteur et le constat. Pour une revue déclarée suffisante, une preuve rattachée et les points de contrôle renseignés sont obligatoires.
7. Utiliser **Actions** pour suivre les écarts et les documents manquants.
8. Utiliser **Rapports** pour exporter l'index CSV, le rapport HTML et un ZIP comprenant l'arborescence et les preuves effectivement stockées.

## Organisation technique

- `v4-data.js` : 15 répertoires de premier niveau et 30 fiches initiales de livrables, matrice de preuve/révision, invalidation de revue, suggestions d'applicabilité sur les rubriques spécialisées.
- `v4-files.js` : IndexedDB, copie locale explicite via File System Access API si prise en charge, export ZIP autonome sans CDN.
- `v4-app.js` : navigation, dossiers, revue MDR et ISO 13485, écarts, rapports.
- `v4.css` : affichage ordinateur et mobile.

Les scripts V3 demeurent accessibles par **Cadrage et classification**, **Normes applicables** et **Outils avancés**. La sauvegarde JSON V3 conserve également les métadonnées V4 du projet.

## Précautions importantes

- Il s'agit d'une **base de travail guidée** et non d'un système de certification ou d'un audit exhaustif MDR/ISO 13485. La liste de 30 livrables est volontairement initiale et doit être complétée et adaptée. Les références ISO sont synthétisées, sans reproduire les textes protégés des normes.
- Le SMQ V4 est actuellement rattaché à un **projet** : le futur partage inter-dispositifs d'un même fabricant nécessite un modèle organisationnel et des droits d'accès dédiés.
- Les fichiers importés restent dans le stockage de **ce navigateur**, sauf export explicite ou copie vers un dossier autorisé. Le JSON seul **ne contient pas** les fichiers. Pour transférer les preuves, exporter également le ZIP. Une restauration automatique des binaires depuis le ZIP n'est pas encore implémentée.
- Les fichiers peuvent disparaître si le stockage du navigateur est effacé, et ne sont pas chiffrés au niveau applicatif. Éviter les informations sensibles sur un ordinateur partagé.
- L'accès direct à un dossier nécessite un navigateur compatible, un contexte HTTPS et une autorisation explicite. Sur téléphone ou navigateur non compatible, utiliser l'export ZIP.
- Chaque révision d'une preuve rattachée modifie l'empreinte de son lot de références et invalide la revue précédente. La simple existence d'un fichier n'est jamais une conclusion de conformité.
- Les utilisateurs doivent contrôler les normes réellement applicables, leur édition et leur statut d'harmonisation.

## Vérification et suite

Tests statiques et tests d'exécution simulée effectués lors de l'intégration ; des essais bout en bout sur Chrome/Edge, Android et les flux de reprise/importation de fichiers doivent être réalisés avant usage opérationnel.

Prochaines étapes : référentiel ISO 13485 détaillé et versionné, bibliothèque SMQ au niveau fabricant, import ZIP et restauration contrôlée des binaires, gestion des droits et sauvegardes chiffrées, vérification automatisée des renvois de preuve et journal d'audit exploitable.
