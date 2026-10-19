// Les projets présentant les enjeux techniques les plus transversaux sont affichés en premier.
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
    "img": "img/retouched/NFCMatcher-v2.svg",
    "desc": "Dispositif de calibration automatique d’antennes NFC, conçu pour faciliter les réglages et optimiser les performances de lecture.",
    "category": "IOT",
    "detailImg": "img/retouched/NFCMatcher-v2.svg",
    "visualNote": "Photographie du prototype retouchée pour la présentation."
  },
  {
    "title": "ECG Reader",
    "img": "img/retouched/ECGReader-v2.svg",
    "desc": "Prototype d’acquisition de signaux ECG avec transmission Bluetooth, associant électronique de mesure et communication sans fil.",
    "category": "Medical",
    "detailImg": "img/retouched/ECGReader-v2.svg",
    "visualNote": "Photographie du prototype retouchée pour la présentation."
  },
  {
    "title": "SensorForge",
    "img": "img/Projets/sensorforge.svg",
    "desc": "Application Android de visualisation et d’enregistrement multi-capteurs, avec base de temps commune, analyse du signal et export CSV. https://orbivia.fr/projets/sensorforge.html",
    "category": "Logiciel"
  },
  {
    "title": "Stethoscope Bluetooth",
    "img": "img/Projets/Stethoscope.webp",
    "desc": "Stéthoscope électronique avec amplification audio et transmission Bluetooth, pour explorer les usages d’enseignement et de télémédecine.",
    "category": "Medical"
  },
  {
    "title": "Luxohm",
    "img": "img/retouched/Luxohm-v2.svg",
    "detailImg": "img/retouched/Luxohm-v2.svg",
    "desc": "Instrument de contrôle électrique pour les installations pyrotechniques, conçu pour accompagner les vérifications sur le terrain. https://orbivia.fr/projets/luxohm.html",
    "category": "Autre",
    "visualNote": "Photographie du prototype retouchée pour la présentation."
  },
  {
    "title": "La Suite",
    "img": "img/Projets/la-suite.svg",
    "desc": "Plateforme web et Android de capsules temporelles : souvenirs déposés par QR code, personnalisation et découverte immédiate ou différée. https://orbivia.fr/projets/la-suite.html",
    "category": "Logiciel"
  },
  {
    "title": "KeyDuino",
    "img": "img/Projets/KeyDuino.webp",
    "detailImg": "img/featured/keyduino.webp",
    "desc": "Carte de développement NFC open source compatible Arduino, pour prototyper des fonctions d’identification et d’interaction sans contact. https://kickstarter.com/projects/1535978353/keyduino?lang=fr",
    "category": "IOT"
  },
  {
    "title": "Wombly",
    "img": "img/Projets/wombly.svg",
    "desc": "Application Android d’enregistrement et de transformation audio locale, pour une écoute plus douce des voix, berceuses et sons familiers. https://orbivia.fr/projets/wombly.html",
    "category": "Logiciel"
  },
  {
    "title": "Torkeo",
    "img": "img/retouched/Torkeo-v2.svg",
    "desc": "Dispositif porté au cou pour le suivi de constantes physiologiques, pensé pour les usages liés à l’accompagnement des troubles cognitifs.",
    "category": "Medical",
    "detailImg": "img/retouched/Torkeo-v2.svg",
    "visualNote": "Rendu illustratif à partir du modèle du projet."
  },
  {
    "title": "LIDAR",
    "img": "img/Projets/LIDAR.webp",
    "desc": "Capteur LIDAR portable compatible avec une intégration sur drone, pour explorer la détection d’obstacles et les usages de cartographie.",
    "category": "Autre"
  },
  {
    "title": "PrintLeft",
    "img": "img/Projets/printleft.svg",
    "desc": "Application Android de lecture NFC des consommables photo compatibles, avec suivi des tirages restants, historique local et export. https://orbivia.fr/projets/printleft.html",
    "category": "Logiciel"
  },
  {
    "title": "ORBI",
    "img": "img/Projets/orbi.svg",
    "desc": "Balle vidéobook pour mariages et événements, conçue pour filmer l’action au cœur de la fête. Visuel présenté : modèle CAO du boîtier.",
    "category": "Autre"
  },
  {
    "title": "Livre d'Or Audio",
    "img": "img/Projets/AudioBook.webp",
    "desc": "Livre d’or audio connecté en Wi-Fi, permettant aux invités d’enregistrer des messages vocaux pour conserver les souvenirs d’un événement. https://laforgeasouvenirs.fr",
    "category": "Autre"
  },
  {
    "title": "Capsule temporelle",
    "img": "img/Projets/CAPSULE.webp",
    "desc": "Dispositif de capsule temporelle pour enregistrer des messages vidéo lors d’un événement et programmer leur révélation à une date choisie. https://orbivia.fr/projets/capsule.html",
    "category": "Autre"
  },
  {
    "title": "Clef USB PPG",
    "img": "img/Projets/ClefPPG.webp",
    "desc": "Capteur de fréquence cardiaque au format clé USB, basé sur la photopléthysmographie pour explorer l’acquisition de signaux physiologiques.",
    "category": "Medical"
  },
  {
    "title": "Be Wheel Soon",
    "img": "img/Projets/CompteurTours.webp",
    "desc": "Compteur de rotations pour roue de rongeur, utilisé en clinique vétérinaire pour étudier l’activité et contribuer à l’évaluation du stress.",
    "category": "IOT"
  },
  {
    "title": "KeyDuino Nano",
    "img": "img/Projets/KeyDuinoNano.webp",
    "desc": "Lecteur NFC miniature de la famille KeyDuino, adapté à l’intégration de fonctions sans contact dans des projets embarqués compacts. https://kickstarter.com/projects/1535978353/keyduino?lang=fr",
    "category": "IOT"
  },
  {
    "title": "Hertz Strike",
    "img": "img/Projets/HertzStrike.webp",
    "desc": "Système radiofréquence associant des fonctions de détection de drones et de brouillage, appliquées à la lutte contre les drones.",
    "category": "IOT"
  },
  {
    "title": "Livre d'Or Vidéo",
    "img": "img/Projets/VideoBook.webp",
    "desc": "Livre d’or vidéo au design rétro, permettant aux invités de laisser des messages filmés et de conserver les souvenirs d’un événement. https://orbivia.fr/projets/videobook.html",
    "category": "Autre"
  },
  {
    "title": "SunGuard",
    "img": "img/Projets/SunGuard.webp",
    "desc": "Capteur sans fil de suivi de l’exposition aux UV, associant mesure environnementale et recharge par induction dans un même dispositif.",
    "category": "Medical"
  },
  {
    "title": "Banc en 3D béton",
    "img": "img/Projets/Banc3D.webp",
    "desc": "Banc urbain réalisé par impression 3D béton, avec une géométrie inspirée d’un peigne pour explorer les possibilités de fabrication. https://constructions-3d.com/fr/maxiprinter",
    "category": "Autre"
  },
  {
    "title": "Airca",
    "img": "img/Projets/Airca.webp",
    "desc": "Lanceur pneumatique destiné aux spectacles pyrotechniques, illustrant l’intégration d’un système de projection dans un équipement événementiel.",
    "category": "Autre"
  },
  {
    "title": "NFC Ring",
    "img": "img/Projets/NFCRing.webp",
    "desc": "Bague intégrant la technologie NFC pour explorer des usages d’identification sans contact et de contrôle d’accès au format porté. https://nfcring.com",
    "category": "IOT"
  },
  {
    "title": "OzOne",
    "img": "img/Projets/OZONE.webp",
    "desc": "Système de contrôle d’accès par NFC connecté en Wi-Fi, avec configuration à distance pour gérer les paramètres du dispositif.",
    "category": "IOT"
  },
  {
    "title": "Photobooth V1",
    "img": "img/Projets/PhotoboothV1.webp",
    "desc": "Première version d’une borne photo événementielle, associant appareil photo, interface et impression dans un équipement intégré. https://orbivia.fr/projets/photobooth.html",
    "category": "Autre"
  },
  {
    "title": "Orchidomètre",
    "img": "img/retouched/Orchidometre-v3.svg",
    "desc": "Instrument imprimé en 3D pour l’évaluation du volume testiculaire, illustrant la fabrication d’un outil destiné à un usage médical.",
    "category": "Medical",
    "detailImg": "img/retouched/Orchidometre-v3.svg",
    "visualNote": "Rendu illustratif à partir du modèle du projet."
  },
  {
    "title": "Photobooth V2",
    "img": "img/Projets/PhotoboothV2.webp",
    "detailImg": "img/featured/photobooth-exploded.webp",
    "desc": "Borne photo événementielle transportable, optimisée pour faciliter l’intégration des équipements, le transport et l’utilisation. https://orbivia.fr/projets/photobooth.html",
    "category": "Autre"
  },
  {
    "title": "Dôme en 3D béton",
    "img": "img/Projets/Sculpture3D.webp",
    "desc": "Dôme architectural réalisé par impression 3D béton, explorant les géométries de fabrication et leur intégration dans l’espace public.",
    "category": "Autre"
  },
  {
    "title": "AcCorps",
    "img": "img/retouched/StethoscopePassif-v2.svg",
    "desc": "Stéthoscope passif biomimétique inspiré de la cochlée humaine, explorant une approche acoustique appliquée à l’écoute des sons corporels. https://biomimexpo.com",
    "category": "Medical",
    "detailImg": "img/retouched/StethoscopePassif-v2.svg",
    "visualNote": "Rendu illustratif à partir du modèle du projet."
  },
  {
    "title": "Notaboo",
    "img": "img/Projets/Notaboo.webp",
    "desc": "Toilettes portatives autonomes pensées pour les personnes en situation de handicap, associant besoins d’accessibilité et conception produit. https://helloasso.com/associations/association-notaboo-solutions",
    "category": "Autre"
  },
  {
    "title": "Sensor CO2",
    "img": "img/Projets/SensorCO2.webp",
    "desc": "Capteur de dioxyde de carbone connecté en Wi-Fi, associant mesure du CO₂ et communication sans fil pour le suivi de l’air ambiant.",
    "category": "IOT"
  }
];
