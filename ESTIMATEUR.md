# Estimateur Orbivia — préparation

Page : `estimer-mon-projet.html`. Compatible avec l’hébergement statique existant, sans dépendance, compte, clé API ni serveur supplémentaire. Aucune IA n’est appelée. Les réponses restent en mémoire et ne sont pas envoyées automatiquement. Le bouton e-mail ouvre la messagerie du visiteur ; il doit encore envoyer son message.

## Avant de publier le chiffrage

Dans `js/estimateur-engine.mjs`, renseigner `pricing.dailyRateHT` avec le tarif journalier HT de Pierre. Les fourchettes de jours sont une proposition d’amorçage, pas des données historiques : les calibrer et les approuver avant de passer `rulesApproved` à `true`. Sans ces deux conditions, aucun montant ni délai de travail n’est communiqué au visiteur. Les cas complexes et sensibles restent soumis à étude, même avec une grille activée. Le texte libre sert de contexte et n’est pas analysé automatiquement : la simulation dépend des choix structurés.

| Poste | Jours proposés, à valider |
| --- | --- |
| Cadrage, besoin défini ou produit existant | 0,5 à 1,5 |
| Cadrage, idée | 1 à 3 |
| Carte électronique | 3 à 7 |
| Logiciel embarqué | 3 à 8 |
| Boîtier et intégration | 2 à 5 |
| Mesures | 1 à 3 |
| Accompagnement CE | 2 à 5 |
| Intégration entre plusieurs domaines | 1 à 3 |

Le facteur connecté est 1,5 sur les postes métier, sans majoration sur le cadrage et l’intégration. Une étude de faisabilité comporte uniquement le cadrage et 0,5 à 1,5 jour d’analyse par domaine. Arrondi conservateur par ligne, par pas de 50 € (minimum vers le bas, maximum vers le haut) ; le total est la somme des lignes affichées. Les coûts de fabrication, d’achats, de laboratoire et de production sont explicitement exclus. Les journées d’effort ne sont pas un délai calendaire.

L’industrialisation, les contraintes sensibles ou inconnues, et les fonctions avancées ou indéterminées ne sont jamais chiffrées automatiquement. Les risques sont déclarés par le visiteur : la simulation ne valide pas la faisabilité ni la qualification réglementaire du projet.

## Vérification

`node --test tests/estimateur.test.mjs`

Retirer le `noindex` de la page uniquement à l’activation publique de l’estimateur. Aucune clé d’IA ne doit être ajoutée au JavaScript public. Une éventuelle analyse IA nécessitera un point d’accès serveur, une politique de confidentialité adaptée et une validation des sorties avant le calcul déterministe.
