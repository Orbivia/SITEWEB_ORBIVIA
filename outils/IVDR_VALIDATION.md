# Parcours IVDR — validation et maintenance

Version `ivdr-questionnaire-1`, ajout du 25 octobre 2026.

## Sources vérifiées

- Règlement (UE) 2017/746, annexe VIII, règles 1 à 7 et règles d’application 1.1 à 1.10 : https://eur-lex.europa.eu/eli/reg/2017/746/oj
- MDCG 2020-16 rév.5, septembre 2026 : https://health.ec.europa.eu/system/files/2023-02/md_mdcg_2020_guidance_classification_ivd-md_en.pdf
- Index de la Commission : https://health.ec.europa.eu/medical-devices-sector/new-regulations/guidance-mdcg-endorsed-documents-and-other-guidance_en

Le guide est interprétatif, non juridiquement contraignant. Le calculateur fournit une proposition fondée sur les déclarations ; il ne vérifie pas les preuves, la destination réelle ou un éventuel acte particulier de reclassification. L’épidémiologie et la gravité ne sont jamais déduites du nom d’un agent.

## Couverture

| Règle | Critères examinés | Cas vérifiés |
|---|---|---|
| 1 | Sécurité des dons, maladie mortelle avec forte propagation, suivi critique de charge infectieuse | Chaque critère D séparément, priorité sur un autotest |
| 2 | Compatibilité et incompatibilité fœto-maternelle, marqueurs de la liste D | Autres marqueurs C, marqueurs listés D, liste inconnue provisoire |
| 3 | Les 13 alinéas a à m sont couverts par des champs distincts | Chaque alinéa C, branches infectieuses inactives ignorées |
| 4 | Autotest, exceptions de B, test près du patient sans classe automatique | Grossesse / fertilité / cholestérol / paramètres urinaires B ; autre autotest C ; priorité C/D |
| 5 | Produits généraux IVD, accessoires non critiques, instruments supports de réactifs, récipients sans test intégré | A, A stérile, mesure indépendante / test intégré / autre fonction examinés séparément |
| 6 | B seulement lorsque les destinations renseignées ne relèvent pas des règles 1 à 5 | Aucun repli B à partir d’une réponse manquante ou reportée ; fonction propre d’un logiciel en plus du pilotage |
| 7 | Contrôle sans valeur quantitative ni qualitative assignée | B, distinct du contrôle à valeur assignée |
| 1.4–1.6 | Logiciel pilotant / influençant, calibrateur, contrôle à valeur assignée | Héritage A/B/C/D, classe inconnue provisoire, maximum en présence d’une fonction logicielle propre |
| 1.8–1.10 | Maximum des règles et destinations, prise en compte des essais de confirmation / supplémentaires | Destinations incomplètes provisoires ; pas de classe universelle attribuée à tous les éléments d’un système |

## Limites et distinctions

Un récipient seul utilisé par un profane pour collecter / conserver son prélèvement ne devient pas un autotest. Un kit complet qui réalise le test est classé pour sa destination complète. Un instrument avec mesure indépendante sans réactif supplémentaire ne bénéficie pas automatiquement du raccourci A. L’analyse d’anticorps n’est pas une détection directe d’agent dans le sang au sens de 3b. La glycémie sanguine n’est pas l’exception du glucose urinaire. Un accessoire critique est examiné pour sa propre destination, sans héritage automatique de la classe du dispositif.

Les réponses doivent rester cohérentes entre elles et couvrir tous les usages. Les dispositifs hors qualification IVDR sont orientés vers une révision du type de produit. L’annexe XVI du MDR conserve son écran d’orientation distinct.

## Architecture et reprise

Le routeur conserve le champ commun `scope` et utilise des champs IVDR préfixés `ivd`. Les questions et règles MDR ne sont pas réutilisées pour donner une classe IVDR. Les réponses inactives ne contribuent pas aux règles. Chaque branche conserve un référentiel de progression fixe. Les anciens résultats avec `scope: ivd` et sans caractérisation reviennent au premier champ IVDR sans effacer les autres réponses. Le changement vers MDR masque les réponses IVDR dans le calcul, la revue et l’export.

Les 32 champs ont deux exemples au minimum et une aide déterministe. Certains critères composés ont des arbres à deux étapes. Toute proposition exige confirmation ; « Je ne sais toujours pas » enregistre une incertitude explicite, jamais un Non. Le rechargement et la revue ciblée utilisent le mécanisme existant.

## Vérifications

328 tests réussis sur les moteurs, aides, parcours, restauration et exports, dont la couverture IVDR dédiée dans `tests/ivdr.test.cjs`. Les PDFs IVDR B, A stérile et un cas cumulant les critères sont vérifiés sur une page avec leur source.

Essais navigateur : récipient A stérile, autotest de grossesse B, autre autotest C, critères D de la règle 1 prioritaires ; report d’un point, rechargement et résolution ciblée ; export PDF disponible. Résultat contrôlé à 390 × 640 pixels : aucun débordement horizontal ; un court défilement vertical reste nécessaire pour le pied de page. Les règles sont des propositions à faire confirmer selon la destination et les preuves.

Après modification d’une question / règle : mettre à jour les scénarios concernés, les sources, les versions de cache dans les deux pages publiques, et la version de l’aide si un arbre change. Ne pas introduire d’équivalence produit-classe par nom commercial.
