# Icônes raster du questionnaire MDR/IVDR

## Intégration (27 octobre 2026)

Les 96 PNG ont été déposés sur GitHub dans `icones/` :

```
outils/classification/icones-raster/icones/icon-01.png
...
outils/classification/icones-raster/icones/icon-96.png
```

Les illustrations sont des PNG transparents (96 × 96 px), issus de la planche graphique approuvée. **Ne pas convertir en SVG : cela détruit le rendu avec relief et dégradés.**

Le code `../presentation.js` associe chacun des 96 identifiants de question à une image numérotée. Cette correspondance reprend le fichier `mapping.json` inclus dans l'archive `orbivia_mdr_ivdr_96_png.zip` du projet. Le site conserve le pictogramme SVG initial comme solution de secours si un PNG échoue à charger.

Sur le site :
- Ordinateur : conteneur de 64 × 64 px ;
- Téléphone : conteneur de 36 × 36 px ;
- Images conservées au ratio et sans texte dans les pictogrammes.

**Limite de pertinence :** il existe 96 associations, mais 57 dessins sources distincts réutilisés pour différents critères. Les 96 PNG déposés restent toutefois des fichiers différents. Plusieurs associations nécessitent une révision graphique spécifique dans une phase ultérieure, sans impact sur les réponses ni la classification réglementaire.

## Contrôles

Lancer `node --test tests/questionnaire-ui.test.cjs` pour contrôler les chemins de fichiers, leur présence et le repli SVG. Tester ensuite la navigation réelle sur ordinateur et téléphone. La publication GitHub Pages et la disponibilité des images en production doivent être contrôlées séparément.

Si la correspondance est modifiée, reprendre le tableau de l'archive, en gardant les identifiants de question comme référence. Ne pas simplement supposer qu'icon-01 correspond à la première question et que tous les numéros suivent l'ordre des questions.
