# Orbivia

Site vitrine statique publié sur [orbivia.fr](https://orbivia.fr) avec GitHub Pages.

## Organisation

- `index.html` : accueil, expertises, réalisations et moyens techniques.
- Les quatre pages de prestations présentent la conception électronique, les systèmes embarqués, le prototypage et l’accompagnement réglementaire CE.
- `realisations.html` et `js/projects.js` : galerie filtrable et données des projets.
- `projets/` : six présentations détaillées.
- `contact.html` : coordonnées et localisation.
- `css/style.css` : styles communs ; `css/home.css` : accueil ; `css/project.css` : pages projet.
- `js/site.js` : navigation mobile ; `js/portfolio.js` : filtres et fenêtre projet.

## Images

Les variantes de l’accueil, sur fond blanc, se trouvent dans `img/editorial/`. Les miniatures originales de `img/Projets/` et leur code couleur sont conservées dans la galerie. Les vues éclatées sont illustratives ; les images d’origine restent disponibles dans les pages détaillées.

## Publication

Le site ne nécessite ni installation ni compilation. La branche `main` déclenche le déploiement GitHub Pages. `CNAME`, les URL canoniques, `robots.txt` et `sitemap.xml` doivent conserver le domaine `orbivia.fr`.

Après modification, vérifier les liens et ancres locaux, la navigation mobile, les filtres et la fermeture du dialogue, ainsi que les métadonnées des pages.
