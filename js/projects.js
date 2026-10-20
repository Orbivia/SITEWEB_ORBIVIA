// Réalisations et concepts exploratoires ; les concepts portent un statut explicite.
const projets = [
  {
    "title": "Aegis Rf Pro",
    "img": "img/editorial/aegis.webp",
    "detailImg": "img/editorial/aegis.webp",
    "desc": "Unité mobile de test radiofréquence pour évaluer les infrastructures de communication, avec intégration dans un équipement transportable. https://orbivia.fr/projets/aegisrf.html",
    "category": "IOT",
    "visualNote": "Rendu illustratif à partir du modèle du projet."
  },
  {
    "title": "Panoptès AI",
    "img": "img/editorial/panoptes.webp",
    "detailImg": "img/editorial/panoptes.webp",
    "desc": "Assistant vocal miniature associant carte électronique sur mesure, audio et Bluetooth LE, intégrés dans un pendentif compact. https://orbivia.fr/projets/panoptes.html",
    "category": "IOT",
    "visualNote": "Rendu illustratif à partir du modèle du projet."
  },
  {
    "title": "NFC Matcher",
    "img": "img/retouched/NFCMatcher-v2.webp",
    "desc": "Dispositif de calibration automatique d’antennes NFC, conçu pour faciliter les réglages et optimiser les performances de lecture.",
    "category": "IOT",
    "detailImg": "img/retouched/NFCMatcher-v2.webp",
    "visualNote": "Photographie du prototype retouchée pour la présentation."
  },
  {
    "title": "ECG Reader",
    "img": "img/retouched/ECGReader-v2.webp",
    "desc": "Prototype d’acquisition de signaux ECG avec transmission Bluetooth, associant électronique de mesure et communication sans fil.",
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
    "desc": "Stéthoscope électronique avec amplification audio et transmission Bluetooth, pour explorer les usages d’enseignement et de télémédecine.",
    "category": "Medical",
    "detailImg": "img/retouched/Stethoscope-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Luxohm",
    "img": "img/retouched/Luxohm-v2.webp",
    "detailImg": "img/retouched/Luxohm-v2.webp",
    "desc": "Instrument de contrôle électrique pour les installations pyrotechniques, conçu pour accompagner les vérifications sur le terrain. https://orbivia.fr/projets/luxohm.html",
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
    "desc": "Carte de développement NFC open source compatible Arduino, pour prototyper des fonctions d’identification et d’interaction sans contact. https://kickstarter.com/projects/1535978353/keyduino?lang=fr",
    "category": "IOT",
    "visualNote": "Photographie détourée pour la présentation."
  },
  {
    "title": "VibraSense",
    "img": "img/concepts/vibrasense.webp",
    "detailImg": "img/concepts/vibrasense.webp",
    "desc": "Concept de capteur autonome de vibrations pour machines tournantes, associant acquisition embarquée, analyse fréquentielle et suivi sans fil. https://orbivia.fr/projets/vibrasense.html",
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
    "desc": "Dispositif porté au cou pour le suivi de constantes physiologiques, pensé pour les usages liés à l’accompagnement des troubles cognitifs.",
    "category": "Medical",
    "detailImg": "img/retouched/Torkeo-v2.webp",
    "visualNote": "Rendu illustratif à partir du modèle du projet."
  },
  {
    "title": "LIDAR",
    "img": "img/retouched/LIDAR-white-v3.webp",
    "desc": "Capteur LIDAR portable compatible avec une intégration sur drone, pour explorer la détection d’obstacles et les usages de cartographie.",
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
    "desc": "Balle vidéobook pour mariages et événements, conçue pour filmer l’action au cœur de la fête. Présentation réaliste du concept produit.",
    "category": "Autre",
    "detailImg": "img/retouched/ORBI-white-v3.webp",
    "visualNote": "Rendu réaliste illustratif à partir du modèle du projet."
  },
  {
    "title": "Livre d'Or Audio",
    "img": "img/retouched/AudioBook-white-v3.webp",
    "desc": "Livre d’or audio connecté en Wi-Fi, permettant aux invités d’enregistrer des messages vocaux pour conserver les souvenirs d’un événement. https://laforgeasouvenirs.fr",
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
    "desc": "Capteur de fréquence cardiaque au format clé USB, basé sur la photopléthysmographie pour explorer l’acquisition de signaux physiologiques.",
    "category": "Medical",
    "detailImg": "img/retouched/ClefPPG-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Be Wheel Soon",
    "img": "img/retouched/CompteurTours-white-v3.webp",
    "desc": "Compteur de rotations pour roue de rongeur, utilisé en clinique vétérinaire pour étudier l’activité et contribuer à l’évaluation du stress.",
    "category": "IOT",
    "detailImg": "img/retouched/CompteurTours-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "KeyDuino Nano",
    "img": "img/retouched/KeyDuinoNano-white-v3.webp",
    "desc": "Lecteur NFC miniature de la famille KeyDuino, adapté à l’intégration de fonctions sans contact dans des projets embarqués compacts. https://kickstarter.com/projects/1535978353/keyduino?lang=fr",
    "category": "IOT",
    "detailImg": "img/retouched/KeyDuinoNano-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Hertz Strike",
    "img": "img/retouched/HertzStrike-white-v3.webp",
    "desc": "Système radiofréquence associant des fonctions de détection de drones et de brouillage, appliquées à la lutte contre les drones.",
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
    "desc": "Capteur sans fil de suivi de l’exposition aux UV, associant mesure environnementale et recharge par induction dans un même dispositif.",
    "category": "Medical",
    "detailImg": "img/retouched/SunGuard-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "Banc en 3D béton",
    "img": "img/retouched/Banc3D-white-v3.webp",
    "desc": "Banc urbain réalisé par impression 3D béton, avec une géométrie inspirée d’un peigne pour explorer les possibilités de fabrication. https://constructions-3d.com/fr/maxiprinter",
    "category": "Autre",
    "detailImg": "img/retouched/Banc3D-white-v3.webp",
    "visualNote": "Rendu réaliste illustratif à partir du modèle du projet."
  },
  {
    "title": "Airca",
    "img": "img/retouched/Airca-white-v3.webp",
    "desc": "Lanceur pneumatique destiné aux spectacles pyrotechniques, illustrant l’intégration d’un système de projection dans un équipement événementiel.",
    "category": "Autre",
    "detailImg": "img/retouched/Airca-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "NFC Ring",
    "img": "img/retouched/NFCRing-white-v3.webp",
    "desc": "Bague intégrant la technologie NFC pour explorer des usages d’identification sans contact et de contrôle d’accès au format porté. https://nfcring.com",
    "category": "IOT",
    "detailImg": "img/retouched/NFCRing-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  },
  {
    "title": "OzOne",
    "img": "img/retouched/OZONE-white-v3.webp",
    "desc": "Système de contrôle d’accès par NFC connecté en Wi-Fi, avec configuration à distance pour gérer les paramètres du dispositif.",
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
    "desc": "Instrument imprimé en 3D pour l’évaluation du volume testiculaire, illustrant la fabrication d’un outil destiné à un usage médical.",
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
    "desc": "Dôme architectural réalisé par impression 3D béton, explorant les géométries de fabrication et leur intégration dans l’espace public.",
    "category": "Autre",
    "detailImg": "img/retouched/Sculpture3D-white-v3.webp",
    "visualNote": "Rendu réaliste illustratif à partir du modèle du projet."
  },
  {
    "title": "AcCorps",
    "img": "img/retouched/StethoscopePassif-v2.webp",
    "desc": "Stéthoscope passif biomimétique inspiré de la cochlée humaine, explorant une approche acoustique appliquée à l’écoute des sons corporels. https://biomimexpo.com",
    "category": "Medical",
    "detailImg": "img/retouched/StethoscopePassif-v2.webp",
    "visualNote": "Rendu illustratif à partir du modèle du projet."
  },
  {
    "title": "Notaboo",
    "img": "img/retouched/Notaboo-white-v3.webp",
    "desc": "Toilettes portatives autonomes pensées pour les personnes en situation de handicap, associant besoins d’accessibilité et conception produit. https://helloasso.com/associations/association-notaboo-solutions",
    "category": "Autre",
    "detailImg": "img/retouched/Notaboo-white-v3.webp",
    "visualNote": "Rendu réaliste illustratif à partir du modèle du projet."
  },
  {
    "title": "Sensor CO2",
    "img": "img/retouched/SensorCO2-white-v3.webp",
    "desc": "Capteur de dioxyde de carbone connecté en Wi-Fi, associant mesure du CO₂ et communication sans fil pour le suivi de l’air ambiant.",
    "category": "IOT",
    "detailImg": "img/retouched/SensorCO2-white-v3.webp",
    "visualNote": "Photographie retouchée et détourée pour la présentation."
  }
];
