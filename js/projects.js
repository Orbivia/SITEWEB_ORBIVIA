// Les liens de détail sont réservés aux études de cas documentées.
const projets = [
  {
    "title": "Aegis RF Pro",
    "img": "img/editorial/aegis.webp",
    "detailImg": "img/editorial/aegis.webp",
    "desc": "Unité radiofréquence transportable intégrant SDR, ordinateur de pilotage, écran et antennes pour les audits sur site. https://orbivia.fr/projets/aegisrf.html",
    "category": "IOT",
    "visualNote": "Rendu illustratif à partir du modèle du projet."
  },
  {
    "title": "Panoptès AI",
    "img": "img/editorial/panoptes.webp",
    "detailImg": "img/editorial/panoptes.webp",
    "desc": "Assistant vocal au format pendentif, avec carte électronique sur mesure, microphone, haut-parleur, batterie et liaison Bluetooth LE. https://orbivia.fr/projets/panoptes.html",
    "category": "IOT",
    "visualNote": "Rendu illustratif à partir du modèle du projet."
  },
  {
    "title": "NFC Matcher",
    "img": "img/retouched/NFCMatcher-v2.webp",
    "desc": "Dispositif de calibration automatique d’antennes NFC destiné au réglage des antennes et à la mise au point de la lecture sans contact.",
    "category": "IOT",
    "detailImg": "img/retouched/NFCMatcher-v2.webp",
    "visualNote": "Photographie du prototype retouchée pour la présentation."
  },
  {
    "title": "ECG Reader",
    "img": "img/retouched/ECGReader-v2.webp",
    "desc": "Prototype de mesure ECG avec transmission Bluetooth, pour acquérir les signaux cardiaques et les transmettre sans liaison filaire.",
    "category": "Medical",
    "detailImg": "img/retouched/ECGReader-v2.webp",
    "visualNote": "Photographie du prototype retouchée pour la présentation."
  },
  {
    "title": "SensorForge",
    "img": "img/Projets/sensorforge.webp",
    "desc": "Application Android de visualisation et d’enregistrement multi-capteurs, avec base de temps commune, analyse du signal et export CSV. https://orbivia.fr/projets/sensorforge.html",
    "category": "Logiciel"
  },
  {
    "title": "Stethoscope Bluetooth",
    "img": "img/retouched/Stethoscope-white-v3.webp",
    "desc": "Stéthoscope électronique avec amplification des sons corporels et transmission Bluetooth, étudié pour l’enseignement et la télémédecine.",
    "category": "Medical",
    "detailImg": "img/retouched/Stethoscope-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Luxohm",
    "img": "img/retouched/Luxohm-v2.webp",
    "detailImg": "img/retouched/Luxohm-v2.webp",
    "desc": "Testeur de continuité pour inflammateurs pyrotechniques, avec retour par vibration et électronique à très faible consommation. https://orbivia.fr/projets/luxohm.html",
    "category": "Autre",
    "visualNote": "Photographie du prototype retouchée pour la présentation."
  },
  {
    "title": "La Suite",
    "img": "img/Projets/la-suite.webp",
    "desc": "Plateforme web et Android de capsules temporelles : souvenirs déposés par QR code, personnalisation et découverte immédiate ou différée. https://orbivia.fr/projets/la-suite.html",
    "category": "Logiciel"
  },
  {
    "title": "KeyDuino",
    "img": "img/editorial/keyduino.webp",
    "detailImg": "img/editorial/keyduino.webp",
    "desc": "Carte de développement NFC open source compatible Arduino, destinée au prototypage de fonctions d’identification et d’interaction sans contact.",
    "category": "IOT",
    "visualNote": "Photographie détourée pour la présentation."
  },
  {
    "title": "VibraSense",
    "img": "img/concepts/vibrasense.webp",
    "detailImg": "img/concepts/vibrasense.webp",
    "desc": "Concept de capteur autonome de vibrations pour machines tournantes, associant acquisition embarquée, analyse fréquentielle et suivi sans fil.",
    "category": "IOT",
    "status": "Concept R&D",
    "visualNote": "Projet fictif exploratoire. Visuel généré ; aucun prototype ni résultat d’essai à ce stade."
  },
  {
    "title": "Wombly",
    "img": "img/Projets/wombly.webp",
    "desc": "Application Android d’enregistrement et de transformation audio locale, pour une écoute plus douce des voix, berceuses et sons familiers. https://orbivia.fr/projets/wombly.html",
    "category": "Logiciel"
  },
  {
    "title": "Torkeo",
    "img": "img/retouched/Torkeo-v2.webp",
    "desc": "Dispositif porté au cou pour le suivi de constantes physiologiques, étudié dans le cadre de l’accompagnement des troubles cognitifs.",
    "category": "Medical",
    "detailImg": "img/retouched/Torkeo-v2.webp",
    "visualNote": "Rendu illustratif à partir du modèle du projet."
  },
  {
    "title": "LIDAR",
    "img": "img/retouched/LIDAR-white-v3.webp",
    "desc": "Capteur LIDAR portable destiné à la détection d’obstacles et à la cartographie, avec une intégration sur drone envisagée.",
    "category": "Autre",
    "detailImg": "img/retouched/LIDAR-white-v3.webp",
    "visualNote": "Photographie retouchée : finition du boîtier lissée pour la présentation."
  },
  {
    "title": "PrintLeft",
    "img": "img/Projets/printleft.webp",
    "desc": "Application Android de lecture NFC des consommables photo compatibles, avec suivi des tirages restants, historique local et export. https://orbivia.fr/projets/printleft.html",
    "category": "Logiciel"
  },
  {
    "title": "ORBI",
    "img": "img/retouched/ORBI-white-v3.webp",
    "desc": "Balle vidéobook pour les mariages et événements : un objet avec lequel les invités interagissent pendant qu’il filme l’action.",
    "category": "Autre",
    "detailImg": "img/retouched/ORBI-white-v3.webp",
    "visualNote": "Rendu réaliste illustratif à partir du modèle du projet."
  },
  {
    "title": "Livre d'Or Audio",
    "img": "img/retouched/AudioBook-white-v3.webp",
    "desc": "Livre d’or audio connecté en Wi-Fi pour enregistrer les messages vocaux des invités lors d’un mariage ou d’un événement.",
    "category": "Autre",
    "detailImg": "img/retouched/AudioBook-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Capsule temporelle",
    "img": "img/retouched/CAPSULE-white-v3.webp",
    "desc": "Dispositif de capsule temporelle pour enregistrer des messages vidéo lors d’un événement et programmer leur révélation à une date choisie. https://orbivia.fr/projets/capsule.html",
    "category": "Autre",
    "detailImg": "img/retouched/CAPSULE-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Clef USB PPG",
    "img": "img/retouched/ClefPPG-white-v3.webp",
    "desc": "Capteur de fréquence cardiaque au format clé USB, utilisant la photopléthysmographie pour acquérir un signal physiologique optique.",
    "category": "Medical",
    "detailImg": "img/retouched/ClefPPG-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Be Wheel Soon",
    "img": "img/retouched/CompteurTours-white-v3.webp",
    "desc": "Compteur de rotations monté sur une roue de rongeur, utilisé en clinique vétérinaire pour étudier l’activité et évaluer le stress.",
    "category": "IOT",
    "detailImg": "img/retouched/CompteurTours-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "KeyDuino Nano",
    "img": "img/retouched/KeyDuinoNano-white-v3.webp",
    "desc": "Lecteur NFC miniature de la famille KeyDuino, destiné aux équipements embarqués où l’espace disponible limite la taille de la carte.",
    "category": "IOT",
    "detailImg": "img/retouched/KeyDuinoNano-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Hertz Strike",
    "img": "img/retouched/HertzStrike-white-v3.webp",
    "desc": "Équipement radiofréquence regroupant détection de drones et brouillage. La présentation publique se limite aux fonctions générales du système.",
    "category": "IOT",
    "detailImg": "img/retouched/HertzStrike-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Livre d'Or Vidéo",
    "img": "img/retouched/VideoBook-white-v3.webp",
    "desc": "Livre d’or vidéo au design rétro, permettant aux invités de laisser des messages filmés et de conserver les souvenirs d’un événement. https://orbivia.fr/projets/videobook.html",
    "category": "Autre",
    "detailImg": "img/retouched/VideoBook-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "SunGuard",
    "img": "img/retouched/SunGuard-white-v3.webp",
    "desc": "Capteur sans fil pour suivre l’exposition aux UV, avec recharge par induction pour alimenter le dispositif.",
    "category": "Medical",
    "detailImg": "img/retouched/SunGuard-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Banc en 3D béton",
    "img": "img/retouched/Banc3D-white-v3.webp",
    "desc": "Banc urbain réalisé en impression 3D béton. Sa forme inspirée d’un peigne met en évidence la géométrie obtenue par fabrication additive.",
    "category": "Autre",
    "detailImg": "img/retouched/Banc3D-white-v3.webp",
    "visualNote": "Rendu réaliste illustratif à partir du modèle du projet."
  },
  {
    "title": "Airca",
    "img": "img/retouched/Airca-white-v3.webp",
    "desc": "Lanceur pneumatique destiné aux spectacles pyrotechniques. Le projet porte sur l’intégration du système de projection dans un équipement événementiel.",
    "category": "Autre",
    "detailImg": "img/retouched/Airca-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "NFC Ring",
    "img": "img/retouched/NFCRing-white-v3.webp",
    "desc": "Bague intégrant une fonction NFC pour l’identification sans contact et le contrôle d’accès, dans un objet porté au doigt.",
    "category": "IOT",
    "detailImg": "img/retouched/NFCRing-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "OzOne",
    "img": "img/retouched/OZONE-white-v3.webp",
    "desc": "Dispositif de contrôle d’accès par NFC, connecté en Wi-Fi pour permettre la configuration des paramètres à distance.",
    "category": "IOT",
    "detailImg": "img/retouched/OZONE-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Photobooth V1",
    "img": "img/retouched/PhotoboothV1-white-v3.webp",
    "desc": "Première version d’une borne photo événementielle, associant appareil photo, interface et impression dans un équipement intégré. https://orbivia.fr/projets/photobooth.html",
    "category": "Autre",
    "detailImg": "img/retouched/PhotoboothV1-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Orchidomètre",
    "img": "img/retouched/Orchidometre-v3.webp",
    "desc": "Orchidomètre fabriqué par impression 3D : un outil de comparaison de volumes destiné à l’évaluation du volume testiculaire.",
    "category": "Medical",
    "detailImg": "img/retouched/Orchidometre-v3.webp",
    "visualNote": "Rendu illustratif à partir du modèle du projet."
  },
  {
    "title": "Photobooth V2",
    "img": "img/editorial/photobooth.webp",
    "detailImg": "img/editorial/photobooth.webp",
    "desc": "Borne photo événementielle transportable, optimisée pour faciliter l’intégration des équipements, le transport et l’utilisation. https://orbivia.fr/projets/photobooth.html",
    "category": "Autre",
    "visualNote": "Photographie détourée pour la présentation."
  },
  {
    "title": "Dôme en 3D béton",
    "img": "img/retouched/Sculpture3D-white-v3.webp",
    "desc": "Dôme architectural réalisé en impression 3D béton, avec une géométrie étudiée pour une installation dans l’espace public.",
    "category": "Autre",
    "detailImg": "img/retouched/Sculpture3D-white-v3.webp",
    "visualNote": "Rendu réaliste illustratif à partir du modèle du projet."
  },
  {
    "title": "AcCorps",
    "img": "img/retouched/StethoscopePassif-v2.webp",
    "desc": "Stéthoscope passif dont la conception acoustique s’inspire de la cochlée humaine pour l’écoute des sons corporels.",
    "category": "Medical",
    "detailImg": "img/retouched/StethoscopePassif-v2.webp",
    "visualNote": "Rendu illustratif à partir du modèle du projet."
  },
  {
    "title": "Notaboo",
    "img": "img/retouched/Notaboo-white-v3.webp",
    "desc": "Toilettes portatives autonomes destinées aux personnes en situation de handicap, avec un travail de conception centré sur l’accessibilité.",
    "category": "Autre",
    "detailImg": "img/retouched/Notaboo-white-v3.webp",
    "visualNote": "Rendu réaliste illustratif à partir du modèle du projet."
  },
  {
    "title": "Sensor CO2",
    "img": "img/retouched/SensorCO2-white-v3.webp",
    "desc": "Capteur de dioxyde de carbone connecté en Wi-Fi pour mesurer le CO₂ et transmettre les relevés de l’air ambiant.",
    "category": "IOT",
    "detailImg": "img/retouched/SensorCO2-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  }
];
