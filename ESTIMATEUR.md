# Estimateur de budget Orbivia

Page statique : `estimer-mon-projet.html`. Aucun serveur, compte ni service d’IA. Les réponses restent en mémoire de la page jusqu’au rechargement. Copie du récapitulatif, impression/PDF et ouverture de la messagerie ; le visiteur doit envoyer lui-même son message.

## Taux et méthode

| Catégorie | Taux horaire retenu HT |
| --- | --- |
| Expert | 150 € |
| Ingénieur | 120 € |
| Technicien | 80 € |

Taux de la grille fournie par Pierre le 19 octobre 2026. Aucun TJM ni durée de journée n’a été déduit. Les modèles initiaux ont été rapprochés d’un échantillon de dix devis PDF envoyés. Cet échantillon comporte des variantes et extensions d’un même projet : ce ne sont pas dix observations indépendantes. Les devis sont des propositions commerciales, pas des relevés de temps ni des preuves de validation par les clients.

Les fourchettes d’heures dans le moteur sont des **charges modélisées au tarif actuel**, choisies pour rester compatibles avec les ordres de grandeur des missions observées. Elles ne sont pas présentées comme des heures réellement passées. Les remises ponctuelles, tarifs journaliers anciens et achats ne sont pas transposés automatiquement. Les missions de réparation sont écartées du modèle de développement. Les devis combinant plusieurs métiers ne permettent pas d’attribuer exactement une durée à chaque tâche.

Aucun devis, identité client, coordonnées, référence de document, détail contractuel ou donnée bancaire n’est incorporé au site ni aux tests publics. Le site contient uniquement des règles génériques de chiffrage. Aucun apprentissage de modèle n’a été réalisé.

## Charges modélisées

| Poste | Catégorie | Heures de base | Évolution ciblée |
| --- | --- | --- | --- |
| Cadrage, besoin défini / existant | Expert | 1 à 3 | 1 à 3 |
| Cadrage, idée | Expert | 3 à 6 | Sans objet |
| Une carte sur mesure | Ingénieur | 10 à 30 | 2 à 10 |
| Assemblage de modules existants | Ingénieur | 4 à 12 | 4 à 12 |
| Logiciel embarqué | Ingénieur | 10 à 24 | 4 à 24 |
| Conception mécanique | Ingénieur | 6 à 36 | 1 à 10 |
| Mesures / mise au point | Expert | 4 à 12 | 4 à 12 |
| Accompagnement CE | Expert | 3 à 24 | 3 à 24 |
| Impression 3D | Technicien | 1 à 4 | 1 à 4 |
| Assemblage électronique | Technicien | 3 à 12 | 3 à 12 |
| Intégration du produit | Technicien | 4 à 16 | 4 à 16 |

La connectivité majore de 30 % uniquement les postes électronique et firmware. L’intégration automatique (4 à 12 heures technicien) est ajoutée si un travail électronique ou mécanique doit être associé à du firmware ou de l’assemblage. Elle n’est pas ajoutée lorsque l’intégration est déjà choisie. L’étude de faisabilité comprend uniquement le cadrage et 2 à 6 heures d’analyse par domaine au taux expert ; il s’agit d’une hypothèse de périmètre, pas d’une charge historique observée.

Une réserve de charge de 25 % est appliquée à tous les postes, à la demande de Pierre le 19 octobre 2026. Les taux horaires restent inchangés. Chaque poste = heures × 1,25 × taux du métier. Arrondi par pas de 50 €, borne basse vers le bas et borne haute vers le haut. Le total est la somme des lignes affichées. Un calendrier de livraison ne peut pas être déduit des heures.

## Périmètre et limites

L’estimation est activée pour des missions usuelles, dans un périmètre de premier prototype ou d’évolution ciblée. Les achats, matières, fabrication sous-traitée, laboratoire et série restent à chiffrer séparément. Plusieurs cartes/appareils, application ou logiciel PC, service cloud, préparation à la série, contraintes sensibles, fonctions avancées ou inconnues nécessitent systématiquement une étude et ne reçoivent pas de montant automatique. Une évolution ciblée suppose un produit existant et l’accès aux sources.

Le texte libre est conservé dans le résumé mais n’est pas analysé : les choix structurés déterminent la simulation. La simulation n’atteste ni la faisabilité technique ni la conformité réglementaire. Le caractère initial et indicatif du modèle apparaît avec le résultat. Continuer à ajuster le modèle avec les écarts entre budgets estimés, devis signés et temps réellement passés.

## Vérification

`node --test tests/estimateur.test.mjs`

Ne jamais mettre de clé d’IA dans le JavaScript public. Une future aide IA nécessitera une route serveur et une politique de confidentialité adaptée. Le calcul tarifaire doit rester déterministe.
