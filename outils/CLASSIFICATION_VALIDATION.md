# Validation du questionnaire de classification MDR

Revue du 25 octobre 2026. Référence : [MDCG 2021-24 Rev.1, avril 2026](https://health.ec.europa.eu/system/files/2021-10/mdcg_2021-24_en_0.pdf), avec les règles de [l’annexe VIII du règlement (UE) 2017/745](https://eur-lex.europa.eu/eli/reg/2017/745/oj).

## Cas demandés

| Dispositif et destination déclarée | Classe attendue et obtenue | Justification retenue |
| --- | --- | --- |
| Casque EEG médical actif, examen courant, électrodes sur peau intacte, sans surveillance de danger immédiat | IIa | Règle 10 : diagnostic direct / mesure physiologique, dont l’activité cérébrale. Guide p. 44–45. |
| CPAP simple pour apnée du sommeil, patient respirant spontanément, pression prescrite, sans surveillance vitale critique ni fonction diagnostique déterminant automatiquement le traitement | IIa | Règle 9 : énergie thérapeutique, cas de l’aide à l’apnée sans monitoring dans le guide p. 42. Règle 12 examinée si administration active d’air déclarée. |
| EEG de réanimation destiné à une surveillance vitale avec danger immédiat | IIb | Règle 10, contexte critique. |
| Bonnet / électrodes EEG passifs vendus seuls, sans fonction active ni autre caractéristique particulière | I | Règle 1. À distinguer de l’appareil EEG complet. |
| Ventilation de suppléance d’une fonction vitale, énergie potentiellement dangereuse | IIb | Règle 9. À distinguer d’une CPAP simple. |
| Adaptation thérapeutique pilotée par une fonction diagnostique patient déterminante, intégrée ou incorporée | III | Règle 22 ; le nom commercial et la seule présence d’un capteur ne suffisent pas. |

Un casque de recherche ou de bien-être sans destination médicale n’est pas qualifié automatiquement comme DM par son seul intitulé. Une APAP ou une interface cerveau-machine doit être examinée selon ses fonctions exactes ; les exemples ci-dessus ne constituent pas des profils universels à appliquer à toute une famille commerciale.

## Corrections

- Remplacement de deux questions ambiguës sur les « processus vitaux » et le « danger immédiat » par une question de contexte clinique distinguant mesure courante, contexte critique et autre fonction. L’EEG, l’ECG et la température figurent explicitement dans le premier choix.
- Confirmation de la fonction diagnostique pour la règle 22 : une simple régulation technique n’entraîne pas automatiquement la classe III.
- Extension des questions et du calcul de la règle 4 aux muqueuses lésées, y compris en cas d’invasivité. Le classement le plus élevé entre les règles applicables reste retenu.
- Règles 1 et 13 utilisées uniquement en l’absence de règle plus spécifique, afin de ne plus afficher une justification de classe I à côté d’un EEG de classe IIa.
- Reprise des anciens diagnostics à la nouvelle question de contexte, sans déduire une réponse différente à partir de l’ancien libellé.
- Ordre des réponses fondé sur une convention pratique : cas usuels avant exceptions rares. Cet ordre n’est pas une estimation statistique d’applicabilité ; aucune réponse n’est présélectionnée. Les valeurs des réponses sauvegardées ne changent pas quand leur position change.

## Couverture des règles

Les attentes sont codées dans `tests/classification-rules.test.cjs`, à partir de scénarios indépendants. Chaque règle a au moins un scénario attendu ; les branches principales ont plusieurs variantes.

| Règle | Scénarios couverts | Classes testées |
| --- | --- | --- |
| 1 | Non-invasif passif, bonnet EEG passif | I |
| 2 | Tubulure connectée, poche à sang | IIa, IIb |
| 3 | Modification biologique, filtration simple, substance de conservation d’organe | IIa, IIb, III |
| 4 | Barrière, micro-environnement, lésion profonde par orifice | I, IIa, IIb |
| 5 | Orifice court, cavité buccale, usage long, connexion active | I, IIa, IIb |
| 6 | Chirurgical temporaire, instrument réutilisable, contact central, absorption | I, IIa, IIb, III |
| 7 | Chirurgical court, absorption, transformation chimique | IIa, IIb, III |
| 8 | Implant passif, dents, articulation, accessoire externe d’implant actif | IIa, IIb, III |
| 9 | CPAP simple, ventilation de suppléance, ionisant, commande d’implant actif | IIa, IIb, III |
| 10 | EEG courant / critique, moniteur d’apnée, échographie, gamma-caméra, rayons X | IIa, IIb |
| 11 | Décision logicielle, gravité, surveillance, autre logiciel médical | I, IIa, IIb, III |
| 12 | Administration d’air / liquide, administration critique | IIa, IIb |
| 13 | Autre actif, fauteuil électrique | I |
| 14 | Substance médicamenteuse intégrée accessoire | III |
| 15 | Contraception non implantable et implantable | IIb, III |
| 16 | Désinfection, lentilles, traitement final d’un invasif | IIa, IIb |
| 17 | Détecteur enregistrant les rayons X | IIa |
| 18 | Dérivés humains, origine animale hors peau intacte | III |
| 19 | Potentiel interne négligeable, faible, élevé | IIa, IIb, III |
| 20 | Inhalation courante et situation aggravante | IIa, IIb |
| 21 | Absorption systémique / digestive, action locale, autre dispersion | IIa, IIb, III |
| 22 | Traitement déterminé par diagnostic, régulation seule, diagnostic non défini | III ou absence d’application de la règle 22 |

66 tests portent spécifiquement sur cette matrice et ses garde-fous ; la suite complète du site comporte 121 tests après cette révision.

## Limites

La présence de 22 règles et de cas de test ne démontre pas la couverture exhaustive de toutes les interprétations et de toutes les destinations. La sortie reste une proposition fondée sur les réponses. L’IVDR, la qualification non établie, les produits de l’annexe XVI, les cellules viables et certains usages multiples ou classes connectées inconnues restent explicitement hors conclusion automatique. Un contexte diagnostique ou une fonction de boucle thérapeutique non définis empêchent une conclusion présentée comme complète.
