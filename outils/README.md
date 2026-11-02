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
- **Ergonomie** : une question par écran, réponses conditionnelles, synthèse courte par support, explications normatives repliables, « Reprendre à zéro », stockage temporaire en session. Les questions sur la conservation, les substances et les informations d’utilisation sont décomposées en étapes Oui/Non, avec un premier écran pour éviter les séries inutiles. Le moteur utilise la clé de session `orbivia-mdr-label-wizard-v7` afin de ne pas reprendre des réponses obsolètes.
- **Études cliniques** : la synthèse rappelle la formulation demandée « exclusivement pour des études cliniques » et précise le libellé réglementaire à employer sur l’étiquette, « exclusivement pour des investigations cliniques » (MDR annexe I, 23.2(q)).
- **Pictogrammes** : les images PNG déjà fournies dans le projet sont visibles sur PC et téléphone, pour les mentions principales comme pour les propositions conditionnelles, avec distinction obligatoire/à examiner ; le support UDI obligatoire ne prend pas abusivement l’icône facultative ISO 5.7.10.
- **Tests** : \`node outils/etiquettes-tracabilite/tests/run.mjs\` teste les combinaisons interdites, les différents conditionnements, l'UDI, les substances et un parcours complet. Le contrôle visuel multi-écran et la lecture de codes sur impression demeurent hors champ de ces tests.
- **Pas de génération d'étiquette** : aucune exportation de pictogrammes normalisés, une synthèse PDF téléchargeable sur une page, mais aucun PDF d'étiquette finale, aucun avis de conformité. Il faut une revue produit et marché avant mise en production.


### Marquages complémentaires électriques et environnementaux (novembre 2026)

Quand l’équipement est électrique/électronique, le questionnaire propose **sans déduire de conformité automatiquement** : collecte séparée DEEE (directive 2012/19/UE, annexe IX), collecte des batteries (règlement UE 2023/1542, art. 13), indice IP testé (IEC 60529), caractéristiques nominales, classe de protection électrique, parties appliquées B/BF/CF et protection défibrillateur (IEC 60601-1 / IEC 60417), lecture obligatoire du manuel (ISO 7010-M002), usage intérieur. Les marques de ces référentiels ne se confondent pas avec les symboles ISO 15223-1.

L'outil **n'invente pas** de valeur IP, de classement de partie appliquée ni de justification de conformité : chaque donnée doit venir du dossier technique. Les fichiers IEC 60417 non disponibles dans la bibliothèque ne sont pas redessinés. Le pictogramme DEEE affiché provient d'un visuel européen préexistant diffusé sur Wikimedia Commons (domaine public) ; il reste à vérifier que la variante avec barre et son apposition correspondent à l'équipement. La synthèse PDF reprend les noms et références, pas les pictogrammes d'impression.

### Vérification des références sur les normes fournies (2026-11-02)

- EN 60601-1:2006+A1+A12+A2:2021, **annexe D**, tableau D.1 (PDF pages 363–367) : IEC 60417-5031, -5032, -5033 pour DC/AC/AC+DC ; -5019 pour la borne de terre de protection ; -5172 pour la classe II ; -5840/-5333/-5335 pour les parties appliquées B/BF/CF ; -5841/-5334/-5336 pour les variantes protégées contre la défibrillation ; **ISO 7000-1641** « Operating instructions ». Tableau D.2, PDF pages 368–369 : **ISO 7010-M002** « Refer to instruction manual/booklet » et **ISO 7010-W012** « Warning, electricity ». Tableau D.3 : code IP, qui n'est pas un logo.
- EN 60601-1-8:2007+A1+A11+A2:2021, **annexe C**, tableau C.1 (PDF pages 104–110) : IEC 60417-5307 (alarme), -5309 (réinitialisation), -5576 (silence du signal), entre autres. Les symboles de commande ou d'interface ne doivent pas être ajoutés systématiquement à une étiquette de conditionnement.
- IEC 60529:1989+A1:1999 : degré de protection exprimé par **IP + caractères**, sans logo associé.
- IEC 80601-2-26:2019 (NF EN IEC 80601-2-26:2020) : norme particulière des EEG, notamment identification, marquage et documentation en 201.7. Ne pas présumer de nouveaux pictogrammes génériques.
- IEC 60601-2-51:2003 (NF EN 60601-2-51:2005) : document remplacé par IEC 60601-2-25:2011 ; ne pas l'utiliser comme référentiel actuel sans vérification.

**Droits sur les pictogrammes :** les documents IEC/ISO/AFNOR/EVS fournis sont soumis à des restrictions de reproduction et de rediffusion. Aucune image IEC/ISO n'a été capturée puis déposée dans le dépôt public à partir de ces PDF. Les références textuelles sont affichées pour les pictogrammes qui n'ont pas de fichier réutilisable autorisé. L'utilisation d'un symbole pour le marquage d'un équipement ne vaut pas automatiquement droit de publication de l'image sur un site tiers.

### Couverture des questions — révision du 2 novembre 2026

Les **17 pictogrammes graphiques IEC/ISO disponibles** disposent désormais d'au moins une condition explicite de sélection : bornes de terre (IEC 60417-5019), nature de l'alimentation (5031/5032/5033), classe II (5172), types B/BF/CF et variantes défibrillation (5840/5841/5333–5336), alarme « activée » (5307), réinitialisation (5309), audio désactivé (5576), consultation du manuel (ISO 7000-1641), obligation de suivre la notice (ISO 7010-M002), danger électrique (ISO 7010-W012).

Le moteur distingue un deuxième type éventuel de partie appliquée et ses conditions de protection, le cas « Audio paused » (variante graphique **non disponible**, jamais remplacée par le pictogramme Audio off), les indications fabricant/distributeur, le numéro de modèle, le pays de fabrication, les risques biologiques et les symboles de température limite haute/basse/plage. Les questions non pertinentes sont masquées ; les réponses conditionnelles précédentes sont supprimées après un changement de branche.

**Attention :** 5.1.11 « pays de fabrication » comporte un espace CC à personnaliser avec le vrai code pays avant impression. Les symboles des commandes d'alarme relèvent surtout de l'interface du dispositif, pas de l'emballage commercial. L'IEC 60417-5957 (intérieur seulement) reste affiché en référence textuelle en l'absence de PNG exact dans la bibliothèque.
