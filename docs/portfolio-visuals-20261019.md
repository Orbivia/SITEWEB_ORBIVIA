# Visuels du portfolio — 19 octobre 2026

Les 29 projets matériels utilisent désormais des visuels sur fond blanc ou transparent. Les quatre projets logiciels conservent leur identité visuelle sur fond blanc. L'ordre des projets et les catégories sont conservés.

## Traitement

- Photographies : détourage, neutralisation des reflets du fond coloré, éclairage de studio neutre, conservation de la forme et des éléments du prototype.
- Rendus CAO : conversion illustrative vers des matériaux réalistes (polymère, métal, béton), en conservant la géométrie de référence. Les rendus restent identifiés comme illustratifs dans les fenêtres du portfolio.
- LIDAR : détourage et finition du boîtier lissée à la demande de Pierre. Le marquage PANOPTES visible dans la référence est conservé.
- Originaux conservés dans `img/Projets/` et `img/featured/`.
- Livrables légers : fichiers WebP directs avec transparence sous `img/retouched/`. Les SVG contenant les images d’origine sont conservés comme sources, mais les pages utilisent les WebP pour éviter l’encapsulation en base64. Les visuels détourés existants de KeyDuino et Photobooth V2 sont réutilisés sous `img/editorial/`.

## Prompts de retouche (outil ImageGen intégré)

Consigne commune : préserver le sujet et son identité, supprimer le fond coloré, utiliser une véritable transparence alpha, lumière de studio neutre, cadrage 4:3 avec marge, sans ajouter de texte ou de fonction.

### ORBI

Convert this CAD screenshot into a photorealistic studio shot of the exact same ORBI video ball. Remove black CAD edge outlines and flat viewport shading. Real matte black elastomer shell with the same triangular geometric tread, dark polymer circular face, silver-white crescent bands, same small circular photo insert and large round black camera/control at bottom. Preserve 'Orbi' script at top and all positions, preserve the ball profile. No extra screens, lights, holes or buttons. Retain the exact product identity. 

### LIDAR

Retouch this supplied actual orange/terracotta rectangular sensor housing. Keep its three round black optical apertures and the engraved PANOPTES lettering exactly as shown; do not rename the product. Smooth the visible FDM layer lines and rough edges to a fine realistic satin polymer finish, retaining every contour, aperture and original color. Remove the yellow background and the visible supporting fingertip. Preserve the close three-quarter view; do not invent parts outside the photographed region. 

### Notaboo

Convert the PCB CAD rendering to a realistic macro product photograph of the same board. Preserve the green PCB outline and thickness, mounting holes, three mustard-colored relays, translucent connectors, barrel power jack, micro USB, chips and exact component positions. Use realistic solder joints, semi-gloss solder mask and subtle readable material textures, no invented components, no changed circuit layout. 

### Stethoscope

Remove the green backdrop from the photo of the circular white PCB with the large black and silver central knob. Preserve each red illuminated LED, chip, switch, solder joint, cable and USB connector in its original position, retain the original physical prototype appearance. Neutralize only the green background color cast; do not invent markings or circuitry. 

### ClefPPG

Remove green backdrop from this transparent USB stick containing a red PCB. Preserve the clear enclosure, USB plug, all chips and components and perspective. Neutralize green reflections on the transparent plastic, improve exposure while keeping real prototype textures. No new parts. 

### SensorCO2

Remove mauve background from the red and black CO2 sensor enclosure. Preserve exact red top shape, black lower enclosure, blank rectangular dark window, right-side micro USB connector and both screw holes. Clean surface scratches and visually soften FDM striations into a realistic satin plastic finish while preserving all details and proportions. Do not add screen content. 

### CompteurTours

Preserve the burgundy rectangular body with white dotted display and the top black cylindrical optical sensor, yellow rings and looped black cable. Keep the label attached to cable and preserve all original parts. Improve clarity but retain faithful prototype materials.

### KeyDuinoNano

Preserve the long white key-shaped PCB including bottle-opener outline, USB-A metal plug, all tiny electronic components and printed tracks. Do not redesign or change chip counts.

### HertzStrike

Preserve the exact black pan/tilt assembly, silver heatsink and fan, upper flat triangular antenna panel, exposed lower electronic base and wiring. Remove only the purple studio backdrop; do not add weapons, beams, drones or other elements. This is a catalog photo cleanup only.

### SunGuard

Preserve exact round green PCB, component positions, large inductor, illuminated blue LED, lower copper-colored circular base, screw holes and white border. Remove only the green background, retain metallic and solder textures.

### NFCRing

Preserve the exact green PCB outline, antenna tracks on top-left, concentric antenna circles on top-right, USB socket, components, pads and printed text. Do not turn it into an actual ring or change circuit layout.

### OZONE

Preserve exact round white plate and circular outer ring with screws and standoffs, OzOne logo, multicolored illuminated LEDs and attached yellow plug. Remove mauve background and neutralize its cast. Do not add features or change text.

### AudioBook

Keep the exact copper-colored rotary telephone with black handset, brass dial, number ring and coiled black cord. Improve exposure and remove yellow reflections without changing the product.

### CAPSULE

Keep the black handset over the rectangular black screen and silver-white decorative faceplate, all frame screws, the support and existing cables. Screen remains off. Keep original decorative wording, do not invent UI or labels. Remove yellow background only and clean up edges.

### VideoBook

Keep the exact red vintage telephone-style video guestbook column with brass details, handset, top '25 10 5' plate, SMILE lettering and original labels. Show the photographed object as a clean product shot without altering its screen, numbers, lettering or geometry. Do not add new controls. If lower base is cropped keep same photographed region cleanly framed.

### Banc3D

Convert the CAD bench model to a photorealistic manufactured concrete urban bench. Preserve its long ribbed comb-like structure, curved seating profile and bike slots. Remove the two low-poly people and bicycles to present the bench alone, along with yellow background and viewport look. Fine natural grey concrete pores and subtle fabrication texture, believable mass and light, no redesign or new architectural features.

### PhotoboothV1

Keep the blue rounded photobooth case, black face, same large top screen with original imagery/text, two white round lights, central camera lens, side vent pattern and visible mounting stem. Do not invent screen content, text or camera apertures. Soften harsh printing striations slightly, keeping original materials and geometry.

### Sculpture3D

Convert the architectural CAD model to a photorealistic grey concrete sculpture. Preserve its exact truncated tapered dome shape with elongated vertical openings, circular top opening, and ribbed circular seating base. Remove both bicycles and yellow background. Use fine realistic concrete pores, subtle natural 3D concrete printing texture, soft studio lighting. Keep the exact geometry, do not turn into a house or add doors/windows.

### LIDAR — seconde passe

Retouche ciblée de la surface : supprimer les stries FDM et les irrégularités sur les faces et dans les lettres, avec une finition polymère satinée, sans modifier les optiques, le cadrage, la couleur ou les contours.

### Airca

Détourage uniquement et présentation catalogue fidèle du prototype orange et noir, en conservant tous les éléments d'origine ; aucune scène d'action, aucun accessoire ajouté.

## Nettoyage du 25 octobre 2026

Les originaux et variantes sans référence dans le site ont été retirés du dépôt courant, ainsi que les SVG encapsulant les images en base64. Ils restent récupérables dans l’historique Git. Les images effectivement utilisées sont conservées.
