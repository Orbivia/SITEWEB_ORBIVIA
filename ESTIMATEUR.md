# Estimateur Orbivia — préparation

Page : `estimer-mon-projet.html`. Compatible avec l’hébergement statique existant, sans dépendance, compte, clé API ni serveur supplémentaire. Aucune IA n’est appelée. Les réponses restent en mémoire et ne sont pas envoyées automatiquement. Le bouton e-mail ouvre la messagerie du visiteur ; il doit encore envoyer son message.

## Avant de publier le chiffrage

Les taux horaires de la capture transmise le 19 octobre 2026 sont intégrés dans `pricing.hourlyRatesHT`. Ils sont interprétés comme HT, dans le contexte de la demande de tarif HT. Aucun TJM ni nombre d’heures par journée n’a été déduit de la colonne TJM, non visible.

| Catégorie | Taux horaire | Prestations de la grille |
| --- | --- | --- |
| Expert | 150 € | Conseil, mesures et tests réglementaires, roadmap R&D, stratégie et choix des partenaires de production, documentation scientifique et réglementaire |
| Ingénieur | 120 € | Développement mécanique, électronique et logiciel, documentation technique |
| Technicien | 80 € | Impression 3D, assemblage électronique et intégration produit |

La correspondance des catégories reprend la capture. Pour le formulaire actuel, le cadrage et l’analyse de faisabilité sont classés en conseil expert. Le poste de mesures est calculé au taux expert ; les essais de laboratoire externes restent exclus.

Les heures ci-dessous restent des **hypothèses initiales de charge**, pas des temps fournis par Pierre ni des références historiques. Les calibrer avant de passer `rulesApproved` à `true`. Les taux réels sont renseignés ; seul le calibrage des durées empêche désormais l’affichage des prix. Les cas complexes et sensibles restent soumis à étude, même avec une grille activée. Le texte libre sert de contexte et n’est pas analysé automatiquement.

| Poste | Catégorie | Heures proposées, à calibrer |
| --- | --- | --- |
| Cadrage, besoin défini ou produit existant | Expert | 4 à 12 |
| Cadrage, idée | Expert | 7 à 21 |
| Carte électronique | Ingénieur | 21 à 49 |
| Logiciel embarqué | Ingénieur | 21 à 56 |
| Conception mécanique du boîtier | Ingénieur | 14 à 35 |
| Mesures et mise au point | Expert | 7 à 21 |
| Accompagnement CE | Expert | 14 à 35 |
| Impression 3D | Technicien | 2 à 6 |
| Assemblage électronique | Technicien | 3 à 10 |
| Intégration produit | Technicien | 7 à 21 |

Chaque ligne est calculée par `heures × taux de la catégorie`. Le facteur connecté est 1,5 sur les postes choisis, sans majoration sur le cadrage ni l’intégration ajoutée automatiquement entre plusieurs domaines. Cette intégration n’est jamais ajoutée si elle est déjà sélectionnée. Une étude de faisabilité comporte uniquement le cadrage et 4 à 12 heures d’analyse par domaine au taux expert. Arrondi par poste par pas de 50 € (minimum vers le bas, maximum vers le haut) ; le total est la somme exacte des postes affichés.

Le temps de préparation et réalisation d’une impression 3D, d’un assemblage ou d’une intégration est distingué des achats de composants, matières et prestations de fabrication sous-traitées, qui restent à chiffrer séparément. Les heures ne sont pas un délai calendaire.

L’industrialisation, les contraintes sensibles ou inconnues, et les fonctions avancées ou indéterminées ne sont jamais chiffrées automatiquement. Les risques sont déclarés par le visiteur : la simulation ne valide pas la faisabilité ni la qualification réglementaire du projet.

## Vérification

`node --test tests/estimateur.test.mjs`

Retirer le `noindex` de la page uniquement à l’activation publique de l’estimateur. Aucune clé d’IA ne doit être ajoutée au JavaScript public. Une éventuelle analyse IA nécessitera un point d’accès serveur, une politique de confidentialité adaptée et une validation des sorties avant le calcul déterministe.
