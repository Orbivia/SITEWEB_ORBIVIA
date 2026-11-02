# Symboles IEC / ISO — étiquetage médical Orbivia

## Source des images

Les **17 pictogrammes** proviennent de recadrages des tableaux normatifs fournis pour ce projet, sans redessin des formes. Les **17 fichiers PNG distincts** (300 × 300 px) sont maintenant conservés dans ce dossier sous leurs références normatives exactes. Le site utilise directement chaque fichier sans découpe ou reconstitution dynamique. L'ancien fichier `iec-iso-sprite.png` reste conservé à titre historique et n'est plus utilisé.

**Sources et pages PDF :**

- **EN 60601-1:2006+A1+A12+A2:2021**, tableau D.1, pages PDF **363–367** : IEC 60417-5032 (AC), 5031 (DC), 5033 (AC+DC), 5019 (terre), 5172 (classe II), 5840 (B), 5333 (BF), 5335 (CF), 5841 (B défibrillation), 5334 (BF défibrillation), 5336 (CF défibrillation), ISO 7000-1641 (consulter les instructions).
- **EN 60601-1:2021**, tableau D.2, pages PDF **368–369** : ISO 7010-W012 (danger électrique), ISO 7010-M002 (obligation de suivre la notice).
- **EN 60601-1-8:2021**, tableau C.1, pages PDF **104 et 106** : IEC 60417-5307 (alarme générale), 5309 (réinitialisation), 5576 (silence sonore).

## Ordre des cases

| Ligne | Colonne 1 | Colonne 2 | Colonne 3 | Colonne 4 | Colonne 5 |
|---|---|---|---|---|---|
| 1 | IEC 5032 | IEC 5031 | IEC 5033 | IEC 5019 | IEC 5172 |
| 2 | ISO 7000-1641 | IEC 5840 | IEC 5333 | IEC 5335 | IEC 5841 |
| 3 | IEC 5334 | IEC 5336 | ISO 7010-W012 | ISO 7010-M002 | IEC 5307 |
| 4 | IEC 5309 | IEC 5576 | — | — | — |

Les références affichées sur le site sont mappées dans le jeu `IEC_SYMBOL_CODES` puis associées directement aux fichiers `IEC-60417-xxxx.png`, `ISO-7000-1641.png` et `ISO-7010-xxxx.png`. Les mêmes PNG sont chargés par la synthèse web, mobile et PDF. Aucune association n'est déduite automatiquement par reconnaissance d'image.

## Limites et exploitation

- Les **codes IP** et les valeurs d'alimentation (V/A/W/Hz) restent en texte.
- Le symbole **IEC 60417-5957** (intérieur seulement) n'apparaît pas dans les tables fournies ; l'outil conserve sa référence textuelle sans approximation graphique.
- Les symboles **DEEE** et **batterie** sont régis par d'autres textes ; la poubelle DEEE préexistante est affichée depuis la source autorisée existante, et non extraite de ces normes.
- La synthèse PDF utilise la même découpe de la planche. L'affichage d'un symbole n'atteste ni de sa nécessité sur le support retenu ni de la conformité du produit.
