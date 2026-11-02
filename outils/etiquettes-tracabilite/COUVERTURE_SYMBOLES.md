# Couverture du questionnaire — symboles et mentions

Revue du 2 novembre 2026. Ce tableau relie les symboles présents dans `symboles-iec/` aux **questions réellement posées**, pas seulement aux références disponibles. Les PNG sont conservés tels que fournis.

## Bibliothèque IEC / ISO : 17/17 accessibles par questionnaire

| Symbole exact | Réponse déterminante | Destination privilégiée |
|---|---|---|
| IEC 60417-5019 — terre de protection | `elec_60601=yes`, `elec_insulation=class1`, `elec_earth_terminal=yes` | Borne de protection sur l'appareil |
| IEC 60417-5031 — courant continu | `elec_supply=yes`, `elec_supply_kind=dc` | Plaque signalétique |
| IEC 60417-5032 — courant alternatif | `elec_supply=yes`, `elec_supply_kind=ac` | Plaque signalétique |
| IEC 60417-5033 — alternatif et continu | `elec_supply=yes`, `elec_supply_kind=both` | Plaque signalétique |
| IEC 60417-5172 — classe II | `elec_60601=yes`, `elec_insulation=class2` | Appareil de classe II |
| IEC 60417-5840 — partie B | `elec_applied=b`, `elec_defib=no` | Connecteur / partie appliquée |
| IEC 60417-5841 — B défibrillation | `elec_applied=b`, `elec_defib=yes` | Connecteur / partie appliquée |
| IEC 60417-5333 — partie BF | `elec_applied=bf`, `elec_defib=no` | Connecteur / partie appliquée |
| IEC 60417-5334 — BF défibrillation | `elec_applied=bf`, `elec_defib=yes` | Connecteur / partie appliquée |
| IEC 60417-5335 — partie CF | `elec_applied=cf`, `elec_defib=no` | Connecteur / partie appliquée |
| IEC 60417-5336 — CF défibrillation | `elec_applied=cf`, `elec_defib=yes` | Connecteur / partie appliquée |
| IEC 60417-5307 — alarme activée | `elec_alarm=yes`, `elec_alarm_on=yes` | Interface / commande |
| IEC 60417-5309 — réinitialiser l'alarme | `elec_alarm=yes`, `elec_alarm_reset=yes` | Interface / commande |
| IEC 60417-5576 — Audio off | `elec_alarm=yes`, `elec_alarm_silence=off` | Interface / commande |
| ISO 7000-1641 — instructions d'utilisation | `instructions_ifu=yes`, `elec_60601=yes`, `elec_ifu_reference=operating` | Dispositif ou étiquette selon le choix |
| ISO 7010-M002 — suivre le manuel | `elec_manual=yes` | Signal d'obligation lié à la sécurité |
| ISO 7010-W012 — danger électrique | `elec_warning_electric=yes` | Emplacement du danger |

Le deuxième type de partie appliquée est traité indépendamment via `elec_applied_more`, `elec_applied_second` et `elec_defib_second`. Aucun type de partie appliquée ni protection défibrillation n'est déduit de la classe MDR.

## Familles ISO 15223-1 à vérifier

| Thème | Questions | Conséquence |
|---|---|---|
| Identification | `manufacturer`, `import`, `distributor`, `modelnumber`, `madein`, `tracking`, `expiry` | 5.1.1–5.1.11 selon les informations / obligations applicables |
| Stérilisation et barrière | `sterile`, `sterilmethod`, `barrier`, `resterilize`, `fluidpath` | 5.2.1–5.2.14 avec exclusions, avertissements et données de procédé |
| Stockage | `storage` et questions `storage_*` | 5.3.1–5.3.9 dont 5.3.5/5.3.6/5.3.7 **mutuellement exclusifs** |
| Matériaux et sécurité | `substances` et questions `substances_*`, `biologicalrisk`, `reuse`, `instructions` | 5.4.1–5.4.12 suivant la composition, les risques et l'usage |
| Réglementaire | `status`, `class`, `ce`, `territory`, `carrier` | CE, MD, UDI et cas investigations cliniques ou sur mesure |

## Autres références et limites

- **DEEE** : `elec_weee`; pictogramme de poubelle barrée distinct du système de collecte des batteries (`elec_battery`).
- **IP** : `elec_ip` et `elec_ip_value`, toujours **texte**, avec validation des valeurs par IEC 60529.
- **Audio paused** : `elec_alarm_silence=pause` propose la référence de variante IEC 60417-5576-2, mais **aucun graphisme n'est substitué à IEC 60417-5576**.
- **IEC 60417-5957** : usage intérieur demandé par `elec_indoor`, fichier PNG exact **non fourni** ; repère textuel seulement.
- **Pays de fabrication, ISO 15223-1 5.1.11** : remplacer **CC** par le vrai code pays ISO 3166-1. Le PNG de référence ne doit pas être imprimé tel quel.
- **Ce questionnaire n'est pas un audit complet de conformité** : les pictogrammes spécifiques à l'interface, à l'emballage, aux parties appliquées et à la batterie ne doivent pas être fusionnés en une seule étiquette.
- **IEC 80601-2-26 / IEC 60601-2-51** : normes spécifiques EEG/ECG ; leur applicabilité à un produit ne se déduit pas d'un pictogramme générique. Une vérification produit dédiée demeure nécessaire.

Tests dans `tests/etiquetage.test.mjs` : routes de sélection des 17 fichiers, absence de faux positifs, gestion des combinaisons et effacement des anciennes réponses. Revue réelle dans Chromium : `scripts/review-labels-browser.mjs`.

## Normes particulières EEG / ECG

La question `elec_specialty`, visible uniquement pour un équipement IEC 60601-1, distingue les EEG (IEC 80601-2-26:2019 + A1:2024), les ECG diagnostiques (IEC 60601-2-25:2011, qui remplace IEC 60601-2-51) et les autres équipements. Elle produit un **contrôle documentaire** et n'ajoute aucun pictogramme sans justification propre au dispositif.


## Références complémentaires — 2 novembre 2026
- **ISO 15223-1 5.6.1 à 5.6.6** : six références de prélèvement / transfusion / perfusion, proposées seulement sur les fonctions déclarées. Le chemin de fluide 5.6.2 est distinct du chemin stérile 5.2.9. Valeur réelle exigée pour les gouttes/mL et la taille des pores.
- **ISO 15223-1 5.7.1 à 5.7.6** : informations à étudier pour une **carte d'implant distincte**. Aucune donnée personnelle n'est automatiquement placée sur l'étiquette commerciale. Vérification MDR article 18.
- **ISO 15223-1 5.7.8 et 5.7.9** : traduction et reconditionnement dans les conditions pertinentes de l'article 16 du MDR, sans sélectionner ces références pour une simple distribution.
- **Mandataire 5.1.2** : choix explicite **EC REP 2021** (PNG historique) ou **EU REP, A1:2025** (référence textuelle). Selon l'annexe MDCG 2021-5 Rev.1 (juin 2026), coexistence possible jusqu'au **17 juin 2031**. Le PNG EC REP ne se substitue pas au graphisme EU REP.
- **Sans graphisme normatif disponible** : références de ces compléments, IEC 60417-5957 et marquage batterie ; affichage textuel avec un contrôle explicite en synthèse et PDF. Ne pas assimiler pictogramme DEEE de l'équipement et symbole de la batterie.
- **Périmètre** : les 106 fichiers PNG d'origine restent inchangés ; l'ajout concerne le questionnaire et la traçabilité des références. Les nouvelles images exactes sont à importer depuis une source autorisée avant tout usage comme graphisme d'impression.

Sources : [ISO 15223-1/Amd.1:2025](https://www.iso.org/standard/86270.html) ; [MDCG 2021-5 Rev.1, annexe](https://health.ec.europa.eu/medical-devices-sector/new-regulations/guidance-mdcg-endorsed-documents-and-other-guidance_en) ; MDR 2017/745 art. 16, 18.
