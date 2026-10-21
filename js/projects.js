// Les liens de détail sont réservés aux études de cas documentées.
const projets = [
  {
    "title": "Aegis RF Pro",
    "img": "img/editorial/aegis.webp",
    "detailImg": "img/editorial/aegis.webp",
    "desc": "Unité radiofréquence transportable intégrant SDR, ordinateur de pilotage, écran et antennes pour les audits sur site. https://orbivia.fr/projets/aegisrf.html",
    "category": "IOT"
  },
  {
    "title": "Panoptès AI",
    "img": "img/editorial/panoptes.webp",
    "detailImg": "img/editorial/panoptes.webp",
    "desc": "Assistant vocal au format pendentif, avec carte électronique sur mesure, microphone, haut-parleur, batterie et liaison Bluetooth LE. https://orbivia.fr/projets/panoptes.html",
    "category": "IOT"
  },
  {
    "title": "NFC Matcher",
    "img": "img/retouched/NFCMatcher-v2.webp",
    "desc": "Dispositif de réglage et de calibration automatique d’antennes NFC.",
    "category": "IOT",
    "detailImg": "img/retouched/NFCMatcher-v2.webp"
  },
  {
    "title": "ECG Reader",
    "img": "img/retouched/ECGReader-v2.webp",
    "desc": "Prototype d’acquisition ECG avec transmission des signaux par Bluetooth.",
    "category": "Medical",
    "detailImg": "img/retouched/ECGReader-v2.webp"
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
    "detailImg": "img/retouched/Stethoscope-white-v3.webp"
  },
  {
    "title": "Luxohm",
    "img": "img/retouched/Luxohm-v2.webp",
    "detailImg": "img/retouched/Luxohm-v2.webp",
    "desc": "Testeur de continuité pour inflammateurs pyrotechniques, avec retour par vibration et électronique à très faible consommation. https://orbivia.fr/projets/luxohm.html",
    "category": "Autre"
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
    "desc": "Carte de développement NFC open source compatible Arduino, pour l’identification et les interactions sans contact.",
    "category": "IOT"
  },
  {
    "title": "VibraSense",
    "visualNote": "Concept fictif de démonstration R&D.",
    "img": "img/concepts/vibrasense.webp",
    "detailImg": "img/concepts/vibrasense.webp",
    "desc": "Concept de capteur autonome de vibrations pour machines tournantes, associant acquisition embarquée, analyse fréquentielle et suivi sans fil.",
    "category": "IOT",
    "status": "Concept R&D"
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
    "desc": "Dispositif porté au cou pour le suivi de constantes physiologiques, étudié pour l’accompagnement des troubles cognitifs.",
    "category": "Medical",
    "detailImg": "img/retouched/Torkeo-v2.webp"
  },
  {
    "title": "LIDAR",
    "img": "img/retouched/LIDAR-white-v3.webp",
    "desc": "Capteur LIDAR portable destiné à la détection d’obstacles et à la cartographie, avec une intégration sur drone envisagée.",
    "category": "Autre",
    "detailImg": "img/retouched/LIDAR-white-v3.webp"
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
    "desc": "Balle vidéobook qui filme les interactions des invités pendant un mariage ou un événement.",
    "category": "Autre",
    "detailImg": "img/retouched/ORBI-white-v3.webp"
  },
  {
    "title": "Livre d'Or Audio",
    "img": "img/retouched/AudioBook-white-v3.webp",
    "desc": "Livre d’or audio connecté en Wi-Fi pour enregistrer les messages vocaux des invités lors d’un mariage ou d’un événement.",
    "category": "Autre",
    "detailImg": "img/retouched/AudioBook-white-v3.webp"
  },
  {
    "title": "Capsule temporelle",
    "img": "img/retouched/CAPSULE-white-v3.webp",
    "desc": "Téléphone vidéo pour enregistrer les messages des invités et programmer leur envoi à une date choisie. https://orbivia.fr/projets/capsule.html",
    "category": "Autre",
    "detailImg": "img/retouched/CAPSULE-white-v3.webp"
  },
  {
    "title": "Clef USB PPG",
    "img": "img/retouched/ClefPPG-white-v3.webp",
    "desc": "Capteur de fréquence cardiaque par photopléthysmographie, au format clé USB.",
    "category": "Medical",
    "detailImg": "img/retouched/ClefPPG-white-v3.webp"
  },
  {
    "title": "Be Wheel Soon",
    "img": "img/retouched/CompteurTours-white-v3.webp",
    "desc": "Compteur de rotations monté sur une roue de rongeur, utilisé en clinique vétérinaire pour étudier l’activité et évaluer le stress.",
    "category": "IOT",
    "detailImg": "img/retouched/CompteurTours-white-v3.webp"
  },
  {
    "title": "KeyDuino Nano",
    "img": "img/retouched/KeyDuinoNano-white-v3.webp",
    "desc": "Lecteur NFC miniature de la famille KeyDuino, pour les intégrations où la place est limitée.",
    "category": "IOT",
    "detailImg": "img/retouched/KeyDuinoNano-white-v3.webp"
  },
  {
    "title": "Hertz Strike",
    "img": "img/retouched/HertzStrike-white-v3.webp",
    "desc": "Équipement radiofréquence de détection de drones et de brouillage.",
    "category": "IOT",
    "detailImg": "img/retouched/HertzStrike-white-v3.webp"
  },
  {
    "title": "Livre d'Or Vidéo",
    "img": "img/retouched/VideoBook-white-v3.webp",
    "desc": "Téléphone rétro pour enregistrer les messages vidéo des invités en décrochant le combiné. https://orbivia.fr/projets/videobook.html",
    "category": "Autre",
    "detailImg": "img/retouched/VideoBook-white-v3.webp"
  },
  {
    "title": "SunGuard",
    "img": "img/retouched/SunGuard-white-v3.webp",
    "desc": "Capteur sans fil d’exposition aux UV, rechargeable par induction.",
    "category": "Medical",
    "detailImg": "img/retouched/SunGuard-white-v3.webp"
  },
  {
    "title": "Banc en 3D béton",
    "img": "img/retouched/Banc3D-white-v3.webp",
    "desc": "Banc urbain en impression 3D béton, avec une forme inspirée d’un peigne.",
    "category": "Autre",
    "detailImg": "img/retouched/Banc3D-white-v3.webp"
  },
  {
    "title": "Airca",
    "img": "img/retouched/Airca-white-v3.webp",
    "desc": "Lanceur pneumatique pour les spectacles pyrotechniques.",
    "category": "Autre",
    "detailImg": "img/retouched/Airca-white-v3.webp"
  },
  {
    "title": "NFC Ring",
    "img": "img/retouched/NFCRing-white-v3.webp",
    "desc": "Bague NFC pour l’identification sans contact et le contrôle d’accès.",
    "category": "IOT",
    "detailImg": "img/retouched/NFCRing-white-v3.webp"
  },
  {
    "title": "OzOne",
    "img": "img/retouched/OZONE-white-v3.webp",
    "desc": "Contrôle d’accès NFC avec configuration à distance par Wi-Fi.",
    "category": "IOT",
    "detailImg": "img/retouched/OZONE-white-v3.webp"
  },
  {
    "title": "Photobooth V1",
    "img": "img/retouched/PhotoboothV1-white-v3.webp",
    "desc": "Première borne photo : appareil photo, écran et imprimante réunis autour d’un Raspberry Pi. https://orbivia.fr/projets/photobooth.html",
    "category": "Autre",
    "detailImg": "img/retouched/PhotoboothV1-white-v3.webp"
  },
  {
    "title": "Orchidomètre",
    "img": "img/retouched/Orchidometre-v3.webp",
    "desc": "Orchidomètre fabriqué par impression 3D : un outil de comparaison de volumes destiné à l’évaluation du volume testiculaire.",
    "category": "Medical",
    "detailImg": "img/retouched/Orchidometre-v3.webp"
  },
  {
    "title": "Photobooth V2",
    "img": "img/editorial/photobooth.webp",
    "detailImg": "img/editorial/photobooth.webp",
    "desc": "Borne photo transportable, revue après les essais terrain et fabriquée en six exemplaires. https://orbivia.fr/projets/photobooth.html",
    "category": "Autre"
  },
  {
    "title": "Dôme en 3D béton",
    "img": "img/retouched/Sculpture3D-white-v3.webp",
    "desc": "Dôme architectural réalisé en impression 3D béton pour une installation dans l’espace public.",
    "category": "Autre",
    "detailImg": "img/retouched/Sculpture3D-white-v3.webp"
  },
  {
    "title": "AcCorps",
    "img": "img/retouched/StethoscopePassif-v2.webp",
    "desc": "Stéthoscope passif dont la conception acoustique s’inspire de la cochlée humaine pour l’écoute des sons corporels.",
    "category": "Medical",
    "detailImg": "img/retouched/StethoscopePassif-v2.webp"
  },
  {
    "title": "Notaboo",
    "img": "img/retouched/Notaboo-white-v3.webp",
    "desc": "Toilettes portatives autonomes conçues pour les personnes en situation de handicap.",
    "category": "Autre",
    "detailImg": "img/retouched/Notaboo-white-v3.webp"
  },
  {
    "title": "Sensor CO2",
    "img": "img/retouched/SensorCO2-white-v3.webp",
    "desc": "Capteur de CO₂ avec transmission des mesures par Wi-Fi.",
    "category": "IOT",
    "detailImg": "img/retouched/SensorCO2-white-v3.webp"
  }
];
