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

## Autres marquages (hors ISO 15223-1)

Les marquages DEEE, de batteries, IP et IEC 60417 ont été ajoutés au questionnaire. Le visuel de la poubelle DEEE est le fichier **WEEE.svg** diffusé par Wikimedia Commons (représentation préexistante, domaine public), chargé depuis son URL d'origine ; les variantes de ce symbole (barre sous la poubelle, date) restent à vérifier. Le marquage de collecte séparée de la batterie est une exigence **distincte**. Le code IP est un **texte** et non un logo. Les symboles IEC 60417 (dont 1641 « manuel à lire », 5172 classe II et 5333 BF) ne sont **pas représentés graphiquement** tant que leurs fichiers autorisés n'ont pas été fournis ; aucune icône de remplacement n'est dessinée.

## Références croisées fournies (IEC 60601-1 et -1-8)

Les tableaux D.1, D.2, D.3 (EN 60601-1:2021) et C.1 (EN 60601-1-8:2021) permettent de vérifier les **références exactes** des symboles, mais les PDF sous licence ne fournissent pas le droit de publier leurs images extraites sur orbivia.fr.

- Lecture du manuel obligatoire : **ISO 7010-M002** (sécurité ; cercle bleu)
- Consultation ordinaire des instructions : **ISO 7000-1641** (livret avec « i »), à distinguer de l'ISO 15223-1 5.4.3
- Risque électrique : **ISO 7010-W012**
- Courant continu / alternatif / mixte : **IEC 60417-5031 / -5032 / -5033**
- Alarme / réinitialisation / silence sonore : **IEC 60417-5307 / -5309 / -5576**

Aucun logo n'est redessiné. Les symboles sans fichier à droits compatibles restent identifiés par leur code et leur titre dans la synthèse et dans son PDF.

## Pictogrammes IEC/ISO intégrés — novembre 2026

La bibliothèque `../symboles-iec/iec-iso-sprite.png` contient 17 pictogrammes extraits sans redessin des tableaux suivants :

- **EN 60601-1:2006+A1+A12+A2:2021**, annexe D, tableaux D.1 et D.2 (pages PDF 363 à 369) : IEC 60417-5032, 5031, 5033, 5019, 5172, 5840, 5333, 5335, 5841, 5334, 5336 ; ISO 7000-1641, ISO 7010-W012 et ISO 7010-M002.
- **EN 60601-1-8:2007+A1+A11+A2:2021**, annexe C, tableau C.1 (pages PDF 104 et 106) : IEC 60417-5307, 5309 et 5576.

Les images sont recadrées et regroupées dans un atlas PNG de 5 colonnes par 4 lignes, 92 × 92 pixels par case. L'ordre de correspondance est donné par `IEC_SYMBOL_CODES` dans `questionnaire.js`. Le navigateur découpe l'atlas en mémoire sans redessiner les formes. Les mêmes recadrages sont intégrés dans le PDF exporté.

**Limite documentée :** IEC 60417-5957 (« utilisation en intérieur ») n'apparaît pas dans les tableaux fournis pour l'atlas et reste indiqué avec sa référence sans pictogramme de substitution. Les indices IP sont des textes, non des logos. Les fichiers proviennent des normes fournies avec autorisation de reproduction et ne doivent pas être confondus avec une validation de conformité du dispositif.

## Révision 2026 : EC REP et EU REP

Le fichier 5.1.2.png illustre la version historique EC REP. L'amendement ISO 15223-1/A1:2025 introduit EU REP. Jusqu'à obtention du graphisme original autorisé, l'outil affiche EU REP comme référence textuelle uniquement. Une période de transition a été annoncée jusqu'au 17 juin 2031.

Les références ISO 15223-1 5.6.1 à 5.6.6, 5.7.1 à 5.7.6, 5.7.8 et 5.7.9 sont proposées conditionnellement, sans image en bibliothèque. Il faut fournir les PNG originaux avant de les utiliser sur une étiquette imprimée.
