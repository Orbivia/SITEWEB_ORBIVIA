# Icônes raster du questionnaire MDR/IVDR

## Intégration (27 octobre 2026)

Les PNG nécessaires ont été déposés sur GitHub dans `icones/` :

```
outils/classification/icones-raster/icones/icon-01.png
...
outils/classification/icones-raster/icones/icon-95.png
```

**57 fichiers PNG transparents de 96 × 96 px sont conservés**, issus de la planche graphique approuvée. Les 39 dessins jamais utilisés dans le questionnaire ont été supprimés du dépôt. **Ne pas convertir en SVG : cela détruit le rendu avec relief et dégradés.**

Le code `../presentation.js` contient une **correspondance explicite par identifiant de question** vers les PNG numérotés. L'ordre de déclaration des questions n'influence donc plus l'illustration affichée. Si le chargement d'un PNG échoue, le pictogramme SVG initial reste disponible en secours.

Sur le site :
- Ordinateur : conteneur de 64 × 64 px ;
- Téléphone : conteneur de 36 × 36 px ;
- Images conservées au ratio et sans texte dans les pictogrammes.

**Limite de pertinence :** il existe 96 associations, mais 57 dessins sources distincts réutilisés pour différents critères. Seuls les 57 PNG actuellement référencés sont conservés. Toute nouvelle illustration devra être ajoutée explicitement et associée à un identifiant. Plusieurs associations nécessitent une révision graphique spécifique dans une phase ultérieure, sans impact sur les réponses ni la classification réglementaire.

## Contrôles

Lancer `node --test tests/questionnaire-ui.test.cjs` pour contrôler les chemins de fichiers, leur présence et le repli SVG. Tester ensuite la navigation réelle sur ordinateur et téléphone. La publication GitHub Pages et la disponibilité des images en production doivent être contrôlées séparément.

Si la correspondance est modifiée, reprendre le tableau de l'archive, en gardant les identifiants de question comme référence. Ne pas simplement supposer qu'icon-01 correspond à la première question et que tous les numéros suivent l'ordre des questions.

## Maintenance du code

- Les réponses restent uniquement textuelles : ne pas réintroduire les anciens pictogrammes de choix.
- L'installateur d'images séparé a été supprimé : les PNG sont maintenant directement versionnés dans le dépôt.
- Les 96 associations et les fichiers de secours sont vérifiés dans `tests/presentation.test.cjs` et `tests/questionnaire-ui.test.cjs`.
- Pour changer une illustration, modifier la correspondance nominative dans `presentation.js`, puis augmenter la version des ressources dans `index.html`.

## Affichage sur un seul écran

Les fichiers communs `../../shared/questionnaire-layout.css` et `../../shared/questionnaire-layout.js` gèrent la disposition et la densité sur **Classification MDR/IVDR**, **Connectivité** et **Étiquetage médical**. Sur un écran trop petit ou avec un zoom important, le défilement reste possible pour ne jamais masquer une réponse.
