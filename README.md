# Orbivia

Site vitrine statique publié sur [orbivia.fr](https://orbivia.fr) avec GitHub Pages.

## Organisation

- `index.html` : accueil, expertises, réalisations et moyens techniques.
- Les quatre pages de prestations présentent la conception électronique, les systèmes embarqués, le prototypage et l’accompagnement réglementaire CE.
- `realisations.html` et `js/projects.js` : galerie filtrable et données des projets.
- `projets/` : dix présentations détaillées, dont PrintLeft, Wombly, SensorForge et La Suite.
- `contact.html` : coordonnées et localisation.
- `estimer-mon-projet.html` : parcours d’estimation indicative en trois étapes.
- `404.html` : page de récupération des adresses introuvables.
- `css/style.css` : styles communs ; `css/home.css` : accueil ; `css/project.css` : pages projet.
- `js/site.js` : navigation mobile ; `js/portfolio.js` : filtres et fenêtre projet.

## Images

La galerie utilise des fonds blancs ou transparents : `img/editorial/` pour les variantes existantes, `img/retouched/` pour les photos détourées et les rendus réalistes illustratifs. Les pages chargent des WebP directs ; les sources SVG et les originaux sont conservés. Les filtres identifient Santé, Objets connectés, Conception produit et Logiciel. Les notes des dialogues distinguent les photographies retouchées des rendus illustratifs.

## Publication

Le site ne nécessite ni installation ni compilation. La branche `main` déclenche le déploiement GitHub Pages. `CNAME`, les URL canoniques, `robots.txt` et `sitemap.xml` doivent conserver le domaine `orbivia.fr`.

Après modification, vérifier les liens et ancres locaux, la navigation mobile, les filtres et la fermeture du dialogue, ainsi que les métadonnées des pages.

## Vérifications

`node --test tests/estimateur.test.mjs tests/portfolio.test.cjs` vérifie le calcul indicatif et les liens de galerie avec filtre/projet. Le filtre sélectionné est conservé dans le paramètre `categorie`, et la réalisation ouverte dans `projet`.

La revue du 19 octobre 2026 couvre les liens locaux, ancres, images, titres, métadonnées, sitemap et règles responsive. Le contrôle visuel dans un navigateur reste à effectuer lorsque cet outil est disponible.
