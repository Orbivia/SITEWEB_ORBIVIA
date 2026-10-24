# V5.1 — décisions normatives simplifiées

- Trois boutons : **Retenir cette norme**, **À vérifier plus tard**, **Écarter cette norme**. Les deux premiers enregistrent la décision et ouvrent directement la référence suivante. Une exclusion demande une justification, sans supposer un motif à la place du relecteur.
- L’édition, la source et la famille restent dans **Détails de la référence**. Les éditions déjà saisies sont conservées.
- La revue des références est suivie dans **Dossier > Références et exigences**, séparément des réponses du questionnaire. Les normes non examinées ne deviennent pas automatiquement retenues ou exclues.
- Le compteur du questionnaire ne cumule plus les références du catalogue. Le compteur de revue indique uniquement la position dans les normes proposées.
- Après les caractéristiques techniques, le parcours passe aux documents. **Continuer le questionnaire** ne reboucle pas sur les décisions normatives en attente. La confirmation de la sélection normative reste soumise aux contrôles existants du moteur.
- Essais navigateur : passage immédiat après Retenir et À vérifier ; édition masquée initialement ; exclusions conditionnelles. Test supplémentaire : les décisions et la taille du catalogue ne changent pas le pourcentage du questionnaire.

---

# ORBIVIA Compliance Studio — V5, questionnaire unifié

Deux destinations : **Questionnaire** et **Dossier**. Le questionnaire regroupe trois chapitres : Produit, Réglementation, Documents. Le dossier rassemble preuves, revues, actions, matrice MDR et exports.

## Parcours et avancement

- L’accueil affiche un pourcentage global et les trois pourcentages par chapitre. Le calcul compte les réponses exploitables, les décisions normatives motivées et les confirmations ; « À vérifier » n’est pas une réponse terminée. Le total évolue selon les questions conditionnelles et références proposées. Le pourcentage est plafonné à 99 % tant qu’il manque une réponse.
- **Continuer** recherche le premier champ manquant, puis la classification à compléter/confirmer, les normes à compléter/confirmer et enfin une réponse documentaire manquante. Un chapitre terminé ne renvoie plus à sa dernière question.
- Le même cadre présente profil, classification, caractéristiques techniques, références une par une et documents. La progression est mesurée sur les réponses, indépendamment du numéro de la question affichée.
- Le dossier distingue **Documents rattachés** et **Revues enregistrées**. Aucun pourcentage ne mesure la conformité.
- Les bulles « i » s’ouvrent au toucher ou au clavier ; les aides restent dépliables. Sur mobile, les commandes du questionnaire restent en bas de l’écran.
- Une première ouverture de la V5 affiche l’accueil ; les réponses, commentaires, fichiers et revues existants sont conservés.

## Vérification V5

`node --test tests/compliance.test.cjs` : six tests, incluant calcul pondéré du pourcentage, adaptation du dénominateur, plafond à 99 %, compatibilité des sauvegardes, invalidation des revues et export ZIP décodé indépendamment.

Essais navigateur : reprise après profil terminé, réponse de classification à vérifier, transition vers normes, revue d’une référence puis suivante, refus d’exclusion sans motif, dossier regroupé. Contrôle à largeur 390 px : absence de débordement horizontal, commandes fixes et bulle d’aide lisible. Les anciens essais d’import et persistance des fichiers restent décrits ci-dessous.

`journey-metrics.js` contient le calcul indépendant des pourcentages ; `normes.js` expose une lecture de progression et une reprise à ses moteurs existants. Le moteur de classification reste inchangé.

---

# ORBIVIA Compliance Studio — V4.1, parcours guidé

Le questionnaire constitue l’entrée principale. Les trois rubriques sont **Mon parcours**, **Mon dossier** et **Mon bilan**. Les projets, documents et revues V3/V4 restent conservés.

## Utilisation

1. **Décrire le projet** : huit questions, une par écran, avec commentaire facultatif et sauvegarde automatique.
2. **Définir les exigences** : questionnaires de classification puis de sélection des normes existants, dans le même cadre de navigation. Les confirmations humaines demeurent distinctes des réponses.
3. **Constituer et vérifier** : chaque livrable propose cinq réponses de disponibilité. Joindre un fichier ou rattacher un document déjà inventorié, puis documenter sa revue sans quitter la question. Pour un document absent, télécharger une trame de départ et créer une action.
4. En fin de thème, un récapitulatif permet de corriger un point ou d’ouvrir le thème suivant. Le choix d’un thème reste disponible sous le questionnaire.
5. **Mon bilan** sépare le dossier renseigné des revues enregistrées. Une revue enregistrée peut constater un écart ; le pourcentage ne mesure pas la conformité. Les écarts et actions sont regroupés ici.
6. **Reprendre les points en attente** ouvre uniquement les rubriques sans revue suffisante ou exclusion justifiée. Le parcours ne reboucle pas après le dernier point de la sélection.
7. **Mon dossier** permet aussi une consultation directe de l’arborescence, la copie explicite dans un dossier du PC compatible, et l’export ZIP.
8. Exporter le **JSON** pour les réponses, commentaires, brouillons et décisions ; exporter le **ZIP** pour conserver aussi les fichiers. Le ZIP n’est pas encore restaurable automatiquement.

Les brouillons de revue ne comptent pas comme des décisions enregistrées. Une preuve jointe seule ne permet pas de déclarer la revue suffisante : points vérifiés, relecteur et méthode restent obligatoires. Les exclusions nécessitent une justification et un relecteur.

## Organisation technique

- `v4-data.js` : 15 répertoires de premier niveau et 30 fiches initiales de livrables, matrice de preuve/révision, invalidation de revue, suggestions d'applicabilité sur les rubriques spécialisées.
- `v4-files.js` : IndexedDB, copie locale explicite via File System Access API si prise en charge, export ZIP autonome sans CDN.
- `core.js` : moteur existant, désormais chargé comme fichier externe pour éviter les erreurs du parseur HTML sur les modèles de rapport.
- `v4-app.js` : parcours, navigation, dossiers, revues, écarts et rapports. Les réponses du parcours sont stockées dans `project.v4.journey`.
- `v4.css` : affichage ordinateur et mobile.

Les questionnaires réglementaires V3 restent intégrés à l’étape **Définir les exigences**. Les outils détaillés restent accessibles dans le menu supérieur. La sauvegarde JSON V3 conserve également les métadonnées V4 du projet.

## Précautions importantes

- Il s'agit d'une **base de travail guidée** et non d'un système de certification ou d'un audit exhaustif MDR/ISO 13485. La liste de 30 livrables est volontairement initiale et doit être complétée et adaptée. Les références ISO sont synthétisées, sans reproduire les textes protégés des normes.
- Le SMQ V4 est actuellement rattaché à un **projet** : le futur partage inter-dispositifs d'un même fabricant nécessite un modèle organisationnel et des droits d'accès dédiés.
- Les fichiers importés restent dans le stockage de **ce navigateur**, sauf export explicite ou copie vers un dossier autorisé. Le JSON seul **ne contient pas** les fichiers. Pour transférer les preuves, exporter également le ZIP. Une restauration automatique des binaires depuis le ZIP n'est pas encore implémentée.
- Les fichiers peuvent disparaître si le stockage du navigateur est effacé, et ne sont pas chiffrés au niveau applicatif. Éviter les informations sensibles sur un ordinateur partagé.
- L'accès direct à un dossier nécessite un navigateur compatible, un contexte HTTPS et une autorisation explicite. Sur téléphone ou navigateur non compatible, utiliser l'export ZIP.
- Chaque révision d'une preuve rattachée modifie l'empreinte de son lot de références et invalide la revue précédente. La simple existence d'un fichier n'est jamais une conclusion de conformité.
- Les utilisateurs doivent contrôler les normes réellement applicables, leur édition et leur statut d'harmonisation.

## Vérification et suite

- `node --test tests/compliance.test.cjs` : 5 tests réussis (compatibilité des sauvegardes et validation des imports, invalidation des revues après changement de preuve, archive ZIP vérifiée par un décodeur indépendant, syntaxe de tous les scripts).
- Essais navigateur : huit questions de profil, transition classification/normes, question normative avec avancement automatique, création d’action, preuve réellement importée et conservée après rechargement, refus d’une revue suffisante incomplète, sauvegarde du brouillon, enregistrement de revue, récapitulatif de thème, bilan et reprise filtrée à 29 points après une revue.
- Largeur mobile : questionnaire et bilan examinés dans un cadre de 390 px ; aucun débordement horizontal mesuré sur le questionnaire. Cela ne remplace pas un essai sur appareil Android/iOS réel.
- Export ZIP : notification de création vérifiée dans le navigateur ; contenu binaire, chemins Unicode et index des fichiers absents vérifiés automatiquement. Le téléchargement de l’archive n’a pas été récupéré par le pilote du navigateur distant.


Prochaines étapes : référentiel ISO 13485 détaillé et versionné, bibliothèque SMQ au niveau fabricant, import ZIP et restauration contrôlée des binaires, gestion des droits et sauvegardes chiffrées, vérification automatisée des renvois de preuve et journal d'audit exploitable.


## V5.2 — aide des normes et classification simplifiée

- La bulle d’information décrit le sujet de la norme, son usage, les caractéristiques ayant motivé sa proposition et fournit un lien vers l’éditeur. Huit références principales ont un résumé dédié fondé sur les périmètres publics ISO/IEC ; les autres reprennent le sujet du catalogue et renvoient explicitement à l’éditeur pour le périmètre détaillé. Aucune édition ni applicabilité n’est validée automatiquement.
- Le résultat de classification présente la classe proposée, les règles retenues et une seule action principale. Justification, source MDR, réponses, détail des règles, référence documentaire facultative et export sont regroupés dans un volet replié.
- La confirmation reste une revue explicite : seul le relecteur est demandé au moment de confirmer. Le moteur de classification et les données existantes sont conservés.
- Validation : huit tests Node réussis ; parcours mobile 390 px essayé avec un projet fictif (résultat, confirmation refusée sans relecteur, confirmation puis passage aux normes, bulle ISO 14971 et lien éditeur). Captures dans `preview/v52-*.jpg`.
