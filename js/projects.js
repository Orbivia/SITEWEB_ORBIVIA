// Les projets présentant les enjeux techniques les plus transversaux sont affichés en premier.
const projets = [
  {
    "title": "Aegis Rf Pro",
    "img": "img/Projets/AegisRfPro.webp",
    "detailImg": "img/featured/aegis-exploded.webp",
    "desc": "Unité mobile de test pour la sécurisation des infrastructures radiofréquences critiques. https://orbivia.fr/projets/aegisrf.html",
    "category": "IOT"
  },
  {
    "title": "Panoptès AI",
    "img": "img/Projets/AssistantVocal.webp",
    "detailImg": "img/featured/panoptes.webp",
    "desc": "Assistant vocal miniature : carte électronique sur mesure, audio, communication Bluetooth LE et intégration dans un pendentif. https://orbivia.fr/projets/panoptes.html",
    "category": "IOT"
  },
  {
    "title": "NFC Matcher",
    "img": "img/Projets/NFCMatcher.webp",
    "desc": "Dispositif de calibration automatique d’antennes NFC, associant réglage d’antenne et optimisation des performances de lecture.",
    "category": "IOT"
  },
  {
    "title": "ECG Reader",
    "img": "img/Projets/ECGReader.webp",
    "desc": "Prototype d’acquisition de signaux électrocardiographiques avec transmission Bluetooth : électronique de mesure et communication sans fil.",
    "category": "Medical"
  },
  {
    "title": "SensorForge",
    "img": "img/Projets/sensorforge.svg",
    "desc": "Boîte à outils Android pour explorer les capteurs du téléphone, visualiser les signaux et enregistrer plusieurs sources sur une même base de temps, avec export CSV. https://orbivia.fr/projets/sensorforge.html",
    "category": "Logiciel"
  },
  {
    "title": "Stethoscope Bluetooth",
    "img": "img/Projets/Stethoscope.webp",
    "desc": "Stéthoscope électronique avec amplification audio et transmission Bluetooth, développé pour explorer les usages d’enseignement et de télémédecine.",
    "category": "Medical"
  },
  {
    "title": "Luxohm",
    "img": "img/Projets/Luxohm.webp",
    "detailImg": "img/featured/luxohm-exploded.webp",
    "desc": "Testeur pyrotechnique garantissant un contrôle électrique sûr et fiable sur le terrain.  https://orbivia.fr/projets/luxohm.html",
    "category": "Autre"
  },
  {
    "title": "La Suite",
    "img": "img/Projets/la-suite.svg",
    "desc": "Capsule temporelle numérique pour mariages et événements : souvenirs déposés par QR code, personnalisation et découverte immédiate ou différée. Plateforme web et application Android organisateur. https://orbivia.fr/projets/la-suite.html",
    "category": "Logiciel"
  },
  {
    "title": "KeyDuino",
    "img": "img/Projets/KeyDuino.webp",
    "detailImg": "img/featured/keyduino.webp",
    "desc": "Lecteur NFC open source basé sur Arduino, conçu pour les makers. https://kickstarter.com/projects/1535978353/keyduino?lang=fr",
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
    "img": "img/Projets/Torkeo.webp",
    "desc": "Dispositif porté au cou pour le suivi de constantes physiologiques, pensé pour les troubles cognitifs.",
    "category": "Medical"
  },
  {
    "title": "LIDAR",
    "img": "img/Projets/LIDAR.webp",
    "desc": "Capteur LIDAR portable compatible avec drones pour la détection d’obstacles et la cartographie.",
    "category": "Autre"
  },
  {
    "title": "PrintLeft",
    "img": "img/Projets/printleft.svg",
    "desc": "Application Android de lecture NFC des consommables photo DNP et Citizen compatibles : consultation des tirages restants, historique local et export CSV / JSON. https://orbivia.fr/projets/printleft.html",
    "category": "Logiciel"
  },
  {
    "title": "ORBI",
    "img": "img/Projets/orbi.svg",
    "desc": "Balle vidéobook destinée aux mariages et aux événements, conçue pour filmer l’action au cœur de la fête. Un format de captation vidéo événementielle intégré dans un boîtier circulaire. Visuel présenté : modèle CAO.",
    "category": "Autre"
  },
  {
    "title": "Livre d'Or Audio",
    "img": "img/Projets/AudioBook.webp",
    "desc": "Livre d’or audio permettant l’enregistrement de fichiers vocaux en haute définition, connecté en Wi-Fi. https://laforgeasouvenirs.fr",
    "category": "Autre"
  },
  {
    "title": "Capsule temporelle",
    "img": "img/Projets/CAPSULE.webp",
    "desc": "Capsule temporelle numérique permettant l’envoi différé de messages vidéo.  https://orbivia.fr/projets/capsule.html",
    "category": "Autre"
  },
  {
    "title": "Clef USB PPG",
    "img": "img/Projets/ClefPPG.webp",
    "desc": "Capteur de fréquence cardiaque économique basé sur la photopléthysmographie (PPG).",
    "category": "Medical"
  },
  {
    "title": "Be Wheel Soon",
    "img": "img/Projets/CompteurTours.webp",
    "desc": "Compteur de rotation pour roue de rongeur, utilisé en clinique vétérinaire pour évaluer le stress animal.",
    "category": "IOT"
  },
  {
    "title": "KeyDuino Nano",
    "img": "img/Projets/KeyDuinoNano.webp",
    "desc": "Mini lecteur NFC ultra compact, adapté aux projets embarqués. https://kickstarter.com/projects/1535978353/keyduino?lang=fr",
    "category": "IOT"
  },
  {
    "title": "Hertz Strike",
    "img": "img/Projets/HertzStrike.webp",
    "desc": "Détecteur et brouilleur de drones.",
    "category": "IOT"
  },
  {
    "title": "Livre d'Or Vidéo",
    "img": "img/Projets/VideoBook.webp",
    "desc": "Livre d’or vidéo au design rétro, pour immortaliser les moments forts d’un événement. https://orbivia.fr/projets/videobook.html",
    "category": "Autre"
  },
  {
    "title": "SunGuard",
    "img": "img/Projets/SunGuard.webp",
    "desc": "Capteur sans fil multifonction mesurant l’exposition aux UV, rechargeable par induction.",
    "category": "Medical"
  },
  {
    "title": "Banc en 3D béton",
    "img": "img/Projets/Banc3D.webp",
    "desc": "Banc urbain imprimé en 3D béton, au design inspiré d’un peigne. https://constructions-3d.com/fr/maxiprinter",
    "category": "Autre"
  },
  {
    "title": "Airca",
    "img": "img/Projets/Airca.webp",
    "desc": "Lanceur pneumatique pour des spectacle pyrotechniques.",
    "category": "Autre"
  },
  {
    "title": "NFC Ring",
    "img": "img/Projets/NFCRing.webp",
    "desc": "Bague NFC connectée pour l’identification et le contrôle d’accès. https://nfcring.com",
    "category": "IOT"
  },
  {
    "title": "OzOne",
    "img": "img/Projets/OZONE.webp",
    "desc": "Système de contrôle d’accès NFC connecté en WIFI, configurable à distance.",
    "category": "IOT"
  },
  {
    "title": "Photobooth V1",
    "img": "img/Projets/PhotoboothV1.webp",
    "desc": "Première version d’une borne photo événementielle. https://orbivia.fr/projets/photobooth.html",
    "category": "Autre"
  },
  {
    "title": "Orchidomètre",
    "img": "img/Projets/Orchidometre.webp",
    "desc": "Instrument de mesure médical utilisé pour mesurer le volume testiculaire imprimé en 3D.",
    "category": "Medical"
  },
  {
    "title": "Photobooth V2",
    "img": "img/Projets/PhotoboothV2.webp",
    "detailImg": "img/featured/photobooth-exploded.webp",
    "desc": "Version optimisée de notre borne photo transportable pour événements. https://orbivia.fr/projets/photobooth.html",
    "category": "Autre"
  },
  {
    "title": "Dôme en 3D béton",
    "img": "img/Projets/Sculpture3D.webp",
    "desc": "Dôme architectural imprimé en béton 3D, pensé pour valoriser l’espace public.",
    "category": "Autre"
  },
  {
    "title": "AcCorps",
    "img": "img/Projets/StethoscopePassif.webp",
    "desc": "Stéthoscope passif biomimétique, inspiré de la cochlée humaine. https://biomimexpo.com",
    "category": "Medical"
  },
  {
    "title": "Notaboo",
    "img": "img/Projets/Notaboo.webp",
    "desc": "Toilettes portatives autonomes, accessibles aux personnes en situation de handicap. https://helloasso.com/associations/association-notaboo-solutions",
    "category": "Autre"
  },
  {
    "title": "Sensor CO2",
    "img": "img/Projets/SensorCO2.webp",
    "desc": "Capteur CO2 connecté en WIFI.",
    "category": "IOT"
  }
];
