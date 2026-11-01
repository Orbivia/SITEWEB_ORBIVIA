# Symboles d'étiquetage ISO 15223-1:2021

Bibliothèque de **55 PNG transparents**, dont les symboles de la série ISO 15223-1:2021 et trois fichiers complémentaires (5.7.7, 5.7.10 et CE), fournis dans le cadre du projet. Les images ISO existantes n'ont pas été redessinées.

Source : dossier Google Drive « A - CODEX / Labels / PNG_propres » fourni dans le projet. L'index d'origine (`index_symboles.csv`) associe chaque référence au nom du fichier source et à la page PDF.

Les noms des fichiers publiés correspondent **exactement** aux références des symboles :
- `5.1.1.png` : Fabricant
- `5.1.5.png` : Code de lot
- `5.2.3.png` : Stérilisation à l'oxyde d'éthylène
- `5.4.2.png` : Ne pas réutiliser

Les références intégrées sont `5.1.1` à `5.1.11`, `5.2.1` à `5.2.14`, `5.3.1` à `5.3.9`, `5.4.1` à `5.4.12` et `5.5.1` à `5.5.6`.

## Règles d'affichage

La fonction `symbolImage(code)` de `../questionnaire.js` affiche un PNG **uniquement** pour un code qui figure exactement dans cette bibliothèque. Les fichiers CE, MD (5.7.7) et pictogramme UDI facultatif (5.7.10) sont également présents. Le code UDI obligatoire (AIDC et HRI) reste représenté textuellement : il ne doit pas être confondu avec le pictogramme facultatif 5.7.10. Les mentions « Texte » et « Notice » n'ont pas d'image normative de substitution. Conserver le code et le libellé textuels à côté de chaque illustration.

**Important :** les symboles visualisés sont des options d'étiquetage à vérifier selon le dispositif. Leur représentation sur la synthèse ne constitue pas une validation de conformité ni une autorisation d'apposer le marquage CE. Ne pas réutiliser ces extraits comme images d'étiquettes commerciales sans avoir contrôlé les droits d'utilisation et la norme applicable.

Ne pas convertir ces PNG en SVG ou redessiner leurs graphismes.
