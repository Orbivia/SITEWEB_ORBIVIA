const projets = [
  {
    title: "Livre d'Or Audio",
    img: "img/Projets/AudioBook.webp",
    desc: "Livre d’or audio permettant l’enregistrement de fichiers vocaux en haute définition, connecté en Wi-Fi. https://laforgeasouvenirs.fr",
    category: "Autre"
  },
  {
    title: "Capsule temporelle",
    img: "img/Projets/CAPSULE.webp",
    desc: "Capsule temporelle numérique permettant l’envoi différé de messages vidéo.  https://orbivia.fr/projets/capsule.html",
    category: "Autre"
  },
  {
    title: "Luxohm",
    img: "img/Projets/Luxohm.webp",
    desc: "Testeur pyrotechnique garantissant un contrôle électrique sûr et fiable sur le terrain.  https://orbivia.fr/projets/luxohm.html",
    category: "Autre"
  },
  {
    title: "KeyDuino",
    img: "img/featured/keyduino.webp",
    desc: "Lecteur NFC open source basé sur Arduino, conçu pour les makers. https://kickstarter.com/projects/1535978353/keyduino?lang=fr",
    category: "IOT"
  },
  {
    title: "Clef USB PPG",
    img: "img/Projets/ClefPPG.webp",
    desc: "Capteur de fréquence cardiaque économique basé sur la photopléthysmographie (PPG).",
    category: "Medical"
  },
  {
    title: "Be Wheel Soon",
    img: "img/Projets/CompteurTours.webp",
    desc: "Compteur de rotation pour roue de rongeur, utilisé en clinique vétérinaire pour évaluer le stress animal.",
    category: "IOT"
  },
  {
    title: "Panoptès AI",
    img: "img/featured/panoptes.webp",
    desc: "Traducteur et assistant vocal portatif associé à ChatGPT. https://orbivia.fr/projets/panoptes.html",
    category: "IOT"
  },
  {
    title: "ECG Reader",
    img: "img/Projets/ECGReader.webp",
    desc: "Capteur ECG connecté en Bluetooth, idéal pour la télémédecine et le suivi personnel.",
    category: "Medical"
  },
  {
    title: "KeyDuino Nano",
    img: "img/Projets/KeyDuinoNano.webp",
    desc: "Mini lecteur NFC ultra compact, adapté aux projets embarqués. https://kickstarter.com/projects/1535978353/keyduino?lang=fr",
    category: "IOT"
  },
  {
    title: "Torkeo",
    img: "img/Projets/Torkeo.webp",
    desc: "Dispositif porté au cou pour le suivi de constantes physiologiques, pensé pour les troubles cognitifs.",
    category: "Medical"
  },
  {
    title: "Hertz Strike",
    img: "img/Projets/HertzStrike.webp",
    desc: "Détecteur et brouilleur de drones.",
    category: "IOT"
  },
  {
    title: "Livre d'Or Vidéo",
    img: "img/Projets/VideoBook.webp",
    desc: "Livre d’or vidéo au design rétro, pour immortaliser les moments forts d’un événement. https://orbivia.fr/projets/videobook.html",
    category: "Autre"
  },
  {
    title: "Aegis Rf Pro",
    img: "img/Projets/aegisrf/Aegis_DESIGN.webp",
    desc: "Unité mobile de test pour la sécurisation des infrastructures radiofréquences critiques. https://orbivia.fr/projets/aegisrf.html",
    category: "IOT"
  },
  {
    title: "SunGuard",
    img: "img/Projets/SunGuard.webp",
    desc: "Capteur sans fil multifonction mesurant l’exposition aux UV, rechargeable par induction.",
    category: "Medical"
  },
  {
    title: "LIDAR",
    img: "img/Projets/LIDAR.webp",
    desc: "Capteur LIDAR portable compatible avec drones pour la détection d’obstacles et la cartographie.",
    category: "Autre"
  },
  {
    title: "Banc en 3D béton",
    img: "img/Projets/Banc3D.webp",
    desc: "Banc urbain imprimé en 3D béton, au design inspiré d’un peigne. https://constructions-3d.com/fr/maxiprinter",
    category: "Autre"
  },
  {
    title: "NFC Matcher",
    img: "img/Projets/NFCMatcher.webp",
    desc: "Dispositif de calibration automatique d’antennes NFC pour des performances de lecture optimales.",
    category: "IOT"
  },
  {
    title: "Airca",
    img: "img/Projets/Airca.webp",
    desc: "Lanceur pneumatique pour des spectacle pyrotechniques.",
    category: "Autre"
  },
  {
    title: "NFC Ring",
    img: "img/Projets/NFCRing.webp",
    desc: "Bague NFC connectée pour l’identification et le contrôle d’accès. https://nfcring.com",
    category: "IOT"
  },
  {
    title: "OzOne",
    img: "img/Projets/OZONE.webp",
    desc: "Système de contrôle d’accès NFC connecté en WIFI, configurable à distance.",
    category: "IOT"
  },
  {
    title: "Photobooth V1",
    img: "img/Projets/PhotoboothV1.webp",
    desc: "Première version d’une borne photo événementielle. https://orbivia.fr/projets/photobooth.html",
    category: "Autre"
  },
  {
    title: "Orchidomètre",
    img: "img/Projets/Orchidometre.webp",
    desc: "Instrument de mesure médical utilisé pour mesurer le volume testiculaire imprimé en 3D.",
    category: "Medical"
  },
  {
    title: "Photobooth V2",
    img: "img/featured/photobooth.webp",
    desc: "Version optimisée de notre borne photo transportable pour événements. https://orbivia.fr/projets/photobooth.html",
    category: "Autre"
  },
  {
    title: "Dôme en 3D béton",
    img: "img/Projets/Sculpture3D.webp",
    desc: "Dôme architectural imprimé en béton 3D, pensé pour valoriser l’espace public.",
    category: "Autre"
  },
  {
    title: "AcCorps",
    img: "img/Projets/StethoscopePassif.webp",
    desc: "Stéthoscope passif biomimétique, inspiré de la cochlée humaine. https://biomimexpo.com",
    category: "Medical"
  },
  {
    title: "Stethoscope Bluetooth",
    img: "img/Projets/Stethoscope.webp",
    desc: "Stéthoscope électronique Bluetooth avec amplification audio, conçu pour l’enseignement et la télémédecine.",
    category: "Medical"
  },
  {
    title: "Robot suiveur NFC",
    img: "img/Projets/FollowBot.webp",
    desc: "Prototype de robot suiveur pour l'industrie.",
    category: "Autre"
  },
  {
    title: "Notaboo",
    img: "img/Projets/Notaboo.webp",
    desc: "Toilettes portatives autonomes, accessibles aux personnes en situation de handicap. https://helloasso.com/associations/association-notaboo-solutions",
    category: "Autre"
  },
  {
    title: "Sensor CO2",
    img: "img/Projets/SensorCO2.webp",
    desc: "Capteur CO2 connecté en WIFI.",
    category: "IOT"
  }
];
