# Questionnaires ORBIVIA — Plan de corrections et suivi

## Lot 1 — Ambiguïtés des textes et des réponses (effectué, 27 octobre 2026)

Principe : **ne pas modifier le moteur MDR/IVDR**. Modifier seulement les textes de présentation et les aides, en gardant les identifiants des questions et des réponses.

### Connectivité

- `peer` : clarifier qu'un choix **principal** est attendu. Le choix multiple des interlocuteurs reste une évolution potentielle qui nécessite une adaptation du moteur de recommandation.
- `range` : distinguer portée d'une liaison et mobilité, ajouter les contraintes murs / site, éviter « partout ».
- `frequency` : distinguer minutes et secondes en ajoutant `seconds` ; conserver les valeurs historiques `rare`, `daily`, `minutes`, `continuous`, `unknown`.
- `security` : indiquer que les données de santé sont personnelles et que « non sensible » / « inconnu » sont exclusifs (comportement existant conservé).
- `control`, `offline`, `latency` : préciser risque pour les personnes, effet d'une coupure et délai de réponse.
- `priorities` : expliciter l'ordre de sélection des trois critères.
- `monthly` : distinguer « abonnement acceptable sans plafond défini » de « je ne sais pas ».

### MDR / IVDR

Textes ciblés dans `classification/presentation.js` :
- `scope` : destination médicale plus complète ;
- `contact` : contact externe, orifice, pénétration chirurgicale mieux différenciés ;
- `energyHazard` : danger en fonction de l'énergie et du site ;
- `diagnosticUse` : risque clinique indépendant du nom de la technique (ECG/EEG) ;
- `softwareImpact` : définir explicitement la catégorie de gravité inférieure ;
- `ivdSelf` / `ivdSelfException` / `ivdNear` : autotest, exceptions et test près du patient selon la destination ;
- `ivdMarkers` : liste des marqueurs explicitement visés par la règle 2 IVDR ;
- `cleaning`, `ivdGeneral`, `nanoExposure`, `softwareRole` : rendre les distinctions interprétables.

**Aucun identifiant, embranchement conditionnel ou calcul de classe MDR / IVDR n'a été modifié.** Le choix `frequency.seconds` est une nouvelle valeur dans le questionnaire de connectivité ; il n'affecte pas à ce jour les heuristiques du moteur de recommandation.

### Contrôles

- Les 96 questions sont toujours présentes et gardent les mêmes identifiants de réponse, vérification statique effectuée.
- Les 20 questions de connectivité sont préservées ; `frequency` contient désormais 6 choix.
- Analyses de syntaxe des fichiers JS : réussies.
- Tests de non-régression ajoutés à `tests/questionnaire-ui.test.cjs`.
- **À faire** : exécuter localement `node --test tests/*.test.*`, `python scripts/check-site.py` et passer visuellement tous les écrans téléphone/desktop ; l'exécution des tests complets n'a pas été réalisée dans cet échange.

Références réglementaires : règlement (UE) 2017/745, annexe VIII (règles de classification) ; règlement (UE) 2017/746, annexe VIII, notamment règles 2 et 4 ; guide MDCG 2020-16 rev.5.

## Lot 2 — Pictogrammes, par lots de quatre

### Lot 2.1 — Connectivité (effectué, 27 octobre 2026)

Quatre SVG de question ont été redessinés individuellement et prévisualisés en 128 px et en 28 px, avec la palette ORBIVIA (#17263a / #e7a116) :

- `question-autonomy.svg` : batterie + cadran horaire ; différent du symbole d'alimentation.
- `question-mobility.svg` : produit en déplacement + flèche ; différent de la règle de portée.
- `question-offline.svg` : signal Wi-Fi coupé ; différent du bouclier de sécurité.
- `question-priorities.svg` : podium avec étoile ; différent du réseau d'appareils.

Le rendu utilise toujours la nomenclature `question-<id>.svg`. La version de chargement des icônes est passée de `v=2` à `v=3`, et celle de `connectivite.js` à `v=10` dans la page. Les 16 autres icônes de connectivité et les 96 icônes MDR/IVDR n'ont pas été modifiées dans ce lot.

Les tests `tests/questionnaire-ui.test.cjs` contrôlent la différence entre le nouvel SVG et l'ancien pictogramme dupliqué. La validation visuelle au sein du navigateur reste à confirmer.


### Lot 2.3 — Connectivité, questions 1 à 4 (intégré sur GitHub, 27 octobre 2026)

Les quatre images validées ont été adaptées en **SVG 32 × 32 transparents**, sans texte ni bordure, en privilégiant leur lisibilité à 28 px :
- `question-peer.svg` : objet connecté + ondes + smartphone ;
- `question-range.svg` : point émetteur + trois arcs de portée ;
- `question-payload.svg` : deux documents et flèches dans les deux sens ;
- `question-frequency.svg` : horloge entourée de flèches de répétition.

Le chemin des icônes reste identique. L'URL de cache passe à `.svg?v=4` et la page charge `connectivite.js?v=11`. Un test de non-régression vérifie quatre dessins distincts, sans texte ni image embarquée, et les couleurs ORBIVIA.

**Prochain lot à valider avant toute intégration :** Environnement, Alimentation, Autonomie, Réseaux disponibles.

### Lots suivants (non appliqués)

- **Lot 2.2** : sélectionner quatre nouvelles questions prioritaires, et contrôler les icônes individuellement avant de les publier.
- **Lot 2.x MDR/IVDR** : appliquer la même méthode par petits ensembles de questions réglementaires.
- **Lot 3** : uniformiser les bulles d'aide, ajouter des exemples adaptés et simplifier les titres particulièrement longs sans changer la règle réglementaire.
- **Lot 4** : tester l'ensemble du parcours, les résultats et les recommandations sur mobile et ordinateur.
