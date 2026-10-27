# Orbivia

Site vitrine statique publié sur [orbivia.fr](https://orbivia.fr) avec GitHub Pages.

## Organisation

- `index.html` : accueil, expertises, réalisations et moyens techniques.
- Les quatre pages de prestations présentent la conception électronique, les systèmes embarqués, le prototypage et l’accompagnement réglementaire CE.
- `realisations.html` et `js/projects.js` : galerie filtrable et données des projets.
- `projets/` : dix études de cas détaillées, dont PrintLeft, Wombly, SensorForge et La Suite. Les anciennes fiches courtes renvoient au projet dans la galerie.
- `contact.html` : coordonnées et localisation.
- `estimer-mon-projet.html` : parcours d’estimation indicative en trois étapes.
- `404.html` : page de récupération des adresses introuvables.
- `css/style.css` : styles communs ; `css/home.css` : accueil ; `css/project.css` : pages projet.
- `js/site.js` : navigation mobile ; `js/portfolio.js` : filtres et fenêtre projet.

## Images

La galerie utilise des fonds blancs ou transparents : `img/editorial/` pour les variantes existantes, `img/retouched/` pour les photos détourées et les rendus réalistes illustratifs. Les pages chargent les fichiers directement utilisés ; les anciennes variantes et les SVG contenant des images en base64 ont été retirés. Les filtres identifient Santé, Objets connectés, Conception produit et Logiciel. Les notes des dialogues distinguent les photographies retouchées des rendus illustratifs.

## Publication

Le site ne nécessite ni installation ni compilation. La branche `main` déclenche le déploiement GitHub Pages. `CNAME`, les URL canoniques, `robots.txt` et `sitemap.xml` doivent conserver le domaine `orbivia.fr`.

Après modification, vérifier les liens et ancres locaux, la navigation mobile, les filtres et la fermeture du dialogue, ainsi que les métadonnées des pages.

## Vérifications

`node --test` exécute toutes les suites découvertes automatiquement : estimateur, contact, galerie, classification MDR/IVDR et interface des questionnaires. `node outils/etiquettes-tracabilite/tests/run.mjs` complète ces contrôles avec les scénarios et le parcours d’étiquetage. Le filtre sélectionné est conservé dans le paramètre `categorie`, et la réalisation ouverte dans `projet`.

Le contrôle structurel s’exécute avec `python scripts/check-site.py` : liens et ancres locaux, images, scripts et feuilles de style, y compris les ressources chargées depuis JavaScript. Les anciens liens de projets restent disponibles sous forme de redirections.

Les tests, documents de maintenance et scripts de contrôle restent dans le dépôt et sont exclus de la publication par `_config.yml`. Les captures de travail et les images inutilisées ne sont plus livrées avec le site. Les fichiers de prévisualisation locaux sont ignorés par Git.

## Outils publics et maintenance

- `outils/classification/` : questionnaire de classification MDR/IVDR ; moteurs et composants communs dans `outils/shared/`.
- `outils/connectivite/` : questionnaire de présélection des technologies de communication. Les réponses sauvegardées sont filtrées selon les choix actuellement valides.
- `outils/etiquettes-tracabilite/` : aide à la préparation des mentions et symboles d’étiquetage, avec synthèse imprimable.
- `outils/normes/` reste exclu de la publication.

Le workflow `.github/workflows/check-site.yml` exécute les tests et le contrôle structurel à chaque pull request et après modification de `main`. Pour bloquer une fusion en cas d’échec, configurer la protection de `main` avec le contrôle requis « Tests et liens du site ». Le déploiement Pages existant reste indépendant de ces vérifications.

Les tests valident le comportement logiciel et des scénarios de référence ; ils ne constituent pas une validation réglementaire des résultats. Les licences des bibliothèques restent publiées avec leurs fichiers.
