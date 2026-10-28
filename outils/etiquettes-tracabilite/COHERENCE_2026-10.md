# Cohérence du parcours Étiquetage — 28 octobre 2026

Relecture des 27 questions, aides, embranchements, mentions proposées, logos, relecture et impression. Les 55 PNG existants sont conservés.

## Corrections

- Validation des réponses restaurées : types attendus, choix autorisés, valeurs multiples exclusives et suppression des réponses masquées. Une synthèse enregistrée comme terminée ne s’affiche pas si des réponses manquent.
- Modification ciblée de chaque réponse depuis la synthèse. Les branches nouvellement nécessaires sont redemandées ; les autres réponses sont conservées.
- Sortie explicite après le choix d’un marché exclusivement hors UE : aucune liste d’exigences MDR présentée comme applicable à ce marché. Les questions de classe, de CE, d’importateur et de support UDI sont filtrées selon leur utilité.
- Mention « Plusieurs choix possibles » pour les trois questions multiples, progression fondée sur l’ordre fixe des questions et focus conservé après sélection.
- CE non proposé lorsque les déclarations de classe / organisme notifié / stérilité sont incohérentes ou lorsque la conformité est non achevée. Alerte visible et rubrique des points à vérifier ouverte pour les contradictions importantes.
- Code UDI (AIDC + HRI) distingué du pictogramme UDI facultatif ; REF distingué du numéro de modèle ; préparation aseptique distinguée de la stérilisation.
- Instructions de réutilisation sans retraitement distinguées des instructions de retraitement. Numéro de série et classe des implants actifs contrôlés. Le calendrier du marquage UDI direct prend en compte l’échéance du 26 mai 2027 pour la classe I.
- Sur le support dispositif : identification du fabricant à examiner et rappel explicite que cette vue ne remplace pas l’étiquette complète du conditionnement.
- Impression : ouverture temporaire des rubriques de mentions, points à vérifier et explications réglementaires, puis restauration de leur état ; boutons de modification masqués sur papier.

## Contrôles

- 368 tests réussis, dont 10 nouveaux groupes de tests Étiquetage et 300 parcours déterministes avec rechargements et modifications de réponses.
- Scénarios métier historiques et parcours en 22 questions réussis.
- Vérification des fichiers PNG référencés par les scénarios.
- 50 pages HTML et 775 dépendances / ancres locales vérifiées.
- Navigateur : parcours direct sur dispositif en 21 questions ; changement vers emballage unitaire demandant le choix de support UDI manquant, puis synthèse de 8 éléments ; modification CE incohérente en classe IIa retirant le logo et affichant le point à corriger. PNG chargés, aucune erreur console. Contrôle DOM à largeur mobile 390 px sans débordement horizontal ; capture d’écran indisponible dans cette session, donc pas de validation visuelle par image enregistrée.

## Sources

- [MDR — annexe I, 23.2 et 23.3](https://eur-lex.europa.eu/legal-content/FR/ALL/?uri=CELEX:32017R0745), pour les informations d’étiquetage et de conditionnement stérile.
- [Commission européenne — FAQ UDI](https://health.ec.europa.eu/document/download/add107c5-0ca8-45d3-b049-63bb84c4ce31_en?filename=md_faq_udi_en.pdf), pour le calendrier du support UDI et du marquage direct.
- [ISO 15223-1:2021/Amd 1:2025](https://www.iso.org/standard/86270.html), pour la modification du symbole de mandataire.

La revue vérifie la cohérence des scénarios pris en charge. Elle ne constitue pas une validation exhaustive de l’étiquetage de tous les dispositifs, des régimes transitoires ou des règles nationales.
