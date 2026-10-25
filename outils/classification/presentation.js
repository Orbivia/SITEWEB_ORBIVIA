/* Public questionnaire presentation only. No rules or answer values live here. */
(function(){
'use strict';
const questions={
 "scope": {
  "title": "Quel type de produit ?",
  "criterion": "",
  "sourceLabel": "Le produit est-il déjà qualifié de dispositif médical ?",
  "icon": "product",
  "options": {
   "md": "Dispositif médical",
   "accessory": "Accessoire dédié à un DM",
   "ivd": "Diagnostic in vitro",
   "annex16": "Produit sans destination médicale de l’annexe XVI",
   "other": "Autre produit / Je ne sais pas"
  },
  "descriptions": {
   "md": "Pour soigner ou diagnostiquer : CPAP, thermomètre…",
   "accessory": "Pour permettre ou assister l’utilisation d’un dispositif médical.",
   "ivd": "Pour analyser un prélèvement humain : test de grossesse…",
   "other": "Quelques questions pour vous aider à choisir."
  }
 },
 "form": {
  "title": "Quelle forme a le produit ?",
  "criterion": "",
  "sourceLabel": "Quelle forme a le produit ?",
  "icon": "product",
  "options": {
   "physical": "Un produit physique",
   "software": "Un logiciel seul",
   "combined": "Un produit avec logiciel"
  },
  "descriptions": {
   "physical": "Un équipement, un instrument ou un consommable.",
   "software": "Un logiciel utilisé sans faire partie d’un produit physique.",
   "combined": "Un produit physique intégrant une fonction logicielle médicale."
  }
 },
 "multiPurpose": {
  "title": "Toutes les configurations du dispositif sont-elles couvertes ?",
  "criterion": "Les réponses couvrent-elles un seul dispositif et tous ses usages / variantes, avec les situations les plus contraignantes ?",
  "sourceLabel": "Les réponses couvrent-elles un seul dispositif et tous ses usages / variantes, avec les situations les plus contraignantes ?",
  "icon": "product",
  "options": {
   "yes": "Oui",
   "no": "Non : plusieurs configurations doivent encore être analysées"
  }
 },
 "ivdAllUses": {
  "title": "Toutes les destinations et la configuration complète sont-elles couvertes ?",
  "criterion": "Les réponses couvrent-elles toutes les destinations du produit et sa configuration complète ?",
  "sourceLabel": "Les réponses couvrent-elles toutes les destinations du produit et sa configuration complète ?",
  "icon": "product",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "active": {
  "title": "Le produit dépend-il d’une source d’énergie ?",
  "criterion": "Le produit utilise-t-il une énergie électrique ou une autre énergie externe pour sa fonction ?",
  "sourceLabel": "Le produit utilise-t-il une énergie électrique ou une autre énergie externe pour sa fonction ?",
  "icon": "energy",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "therapyEnergy": {
  "title": "Le produit échange-t-il de l’énergie avec le corps pour traiter ?",
  "criterion": "Le produit administre-t-il ou échange-t-il de l’énergie avec le corps à des fins thérapeutiques ?",
  "sourceLabel": "Le produit administre-t-il ou échange-t-il de l’énergie avec le corps à des fins thérapeutiques ?",
  "icon": "energy",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "energyHazard": {
  "title": "L’énergie peut-elle être administrée de façon dangereuse ?",
  "criterion": "Cette énergie peut-elle être administrée d’une manière potentiellement dangereuse compte tenu de sa nature, densité et site ?",
  "sourceLabel": "Cette énergie peut-elle être administrée d’une manière potentiellement dangereuse compte tenu de sa nature, densité et site ?",
  "icon": "energy",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "contact": {
  "title": "Comment le produit entre-t-il en contact avec le corps ?",
  "criterion": "",
  "sourceLabel": "Comment le produit entre-t-il en contact avec le corps ?",
  "icon": "body",
  "options": {
   "none": "Il ne pénètre pas dans le corps",
   "orifice": "Par un orifice, sans pénétration chirurgicale",
   "surgical": "À travers la peau / une muqueuse ou dans le cadre d’un acte chirurgical",
   "multiple": "Plusieurs voies ou situations à analyser séparément"
  }
 },
 "animalIntact": {
  "title": "Le dispositif d’origine animale touche-t-il exclusivement une peau intacte ?",
  "criterion": "",
  "sourceLabel": "Le dispositif d’origine animale touche-t-il exclusivement une peau intacte ?",
  "icon": "body",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "nanoContact": {
  "title": "Le nanomatériau peut-il exposer une personne ?",
  "criterion": "Le composant contenant le nanomatériau peut-il avoir un contact direct ou indirect avec une personne ?",
  "sourceLabel": "Le composant contenant le nanomatériau peut-il avoir un contact direct ou indirect avec une personne ?",
  "icon": "body",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "wound": {
  "title": "Le produit touche-t-il une peau ou une muqueuse lésée ?",
  "criterion": "",
  "sourceLabel": "Le produit touche-t-il une peau ou une muqueuse lésée ?",
  "icon": "body",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "woundDeep": {
  "title": "Le produit vise-t-il des lésions profondes cicatrisant par seconde intention ?",
  "criterion": "Est-il principalement destiné aux lésions ayant franchi le derme / la muqueuse et cicatrisant uniquement par seconde intention ?",
  "sourceLabel": "Est-il principalement destiné aux lésions ayant franchi le derme / la muqueuse et cicatrisant uniquement par seconde intention ?",
  "icon": "body",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "woundBarrier": {
  "title": "Son rôle se limite-t-il à une barrière mécanique, la compression ou l’absorption des exsudats ?",
  "criterion": "",
  "sourceLabel": "Son rôle se limite-t-il à une barrière mécanique, la compression ou l’absorption des exsudats ?",
  "icon": "body",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "orificeCavity": {
  "title": "L’usage est-il limité à certaines cavités naturelles ?",
  "criterion": "Est-il utilisé uniquement dans la bouche jusqu’au pharynx, le conduit auditif jusqu’au tympan ou la cavité nasale ?",
  "sourceLabel": "Est-il utilisé uniquement dans la bouche jusqu’au pharynx, le conduit auditif jusqu’au tympan ou la cavité nasale ?",
  "icon": "body",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "orificeAbsorb": {
  "title": "Est-il susceptible d’être absorbé par la muqueuse ?",
  "criterion": "",
  "sourceLabel": "Est-il susceptible d’être absorbé par la muqueuse ?",
  "icon": "body",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "implant": {
  "title": "Le produit est-il destiné à rester implanté après une intervention clinique ?",
  "criterion": "",
  "sourceLabel": "Le produit est-il destiné à rester implanté après une intervention clinique ?",
  "icon": "implant",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "implantActive": {
  "title": "S’agit-il d’un implant actif ou d’un accessoire d’implant actif ?",
  "criterion": "",
  "sourceLabel": "S’agit-il d’un implant actif ou d’un accessoire d’implant actif ?",
  "icon": "implant",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "implantSpecial": {
  "title": "L’implant appartient-il à l’une de ces catégories particulières ?",
  "criterion": "Est-ce un implant mammaire, un treillis chirurgical, une prothèse articulaire totale / partielle ou un dispositif rachidien visé par la règle ?",
  "sourceLabel": "Est-ce un implant mammaire, un treillis chirurgical, une prothèse articulaire totale / partielle ou un dispositif rachidien visé par la règle ?",
  "icon": "implant",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "dental": {
  "title": "Le dispositif est-il destiné à être placé dans les dents ?",
  "criterion": "",
  "sourceLabel": "Le dispositif est-il destiné à être placé dans les dents ?",
  "icon": "implant",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "reusableSurgical": {
  "title": "Est-ce un instrument chirurgical réutilisable, sans connexion à un dispositif actif ?",
  "criterion": "",
  "sourceLabel": "Est-ce un instrument chirurgical réutilisable, sans connexion à un dispositif actif ?",
  "icon": "implant",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "duration": {
  "title": "Quelle est la durée maximale d’utilisation continue prévue ?",
  "criterion": "",
  "sourceLabel": "Quelle est la durée maximale d’utilisation continue prévue ?",
  "icon": "clock",
  "options": {
   "transient": "Moins de 60 minutes",
   "short": "De 60 minutes à 30 jours inclus",
   "long": "Plus de 30 jours",
   "multiple": "Plusieurs durées / continuité à clarifier"
  }
 },
 "medicinal": {
  "title": "Le produit incorpore-t-il un médicament à action accessoire ?",
  "criterion": "Le produit incorpore-t-il une substance médicamenteuse dont l’action est accessoire ?",
  "sourceLabel": "Le produit incorpore-t-il une substance médicamenteuse dont l’action est accessoire ?",
  "icon": "medicine",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "contraception": {
  "title": "Le produit a-t-il une fonction contraceptive ou de prévention des IST ?",
  "criterion": "Le produit sert-il à la contraception ou à la prévention des infections sexuellement transmissibles ?",
  "sourceLabel": "Le produit sert-il à la contraception ou à la prévention des infections sexuellement transmissibles ?",
  "icon": "medicine",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "inhalation": {
  "title": "Le produit administre-t-il un médicament par inhalation ?",
  "criterion": "",
  "sourceLabel": "Le produit administre-t-il un médicament par inhalation ?",
  "icon": "medicine",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "inhalationRisk": {
  "title": "L’inhalation présente-t-elle l’un de ces enjeux cliniques ?",
  "criterion": "Son fonctionnement influence-t-il essentiellement l’efficacité / la sécurité du médicament, ou traite-t-il une affection mettant la vie en danger ?",
  "sourceLabel": "Son fonctionnement influence-t-il essentiellement l’efficacité / la sécurité du médicament, ou traite-t-il une affection mettant la vie en danger ?",
  "icon": "medicine",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "surgMedicine": {
  "title": "Est-il destiné à administrer un médicament ?",
  "criterion": "",
  "sourceLabel": "Est-il destiné à administrer un médicament ?",
  "icon": "medicine",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "surgMedicineRisk": {
  "title": "Cette administration temporaire se fait-elle d’une manière potentiellement dangereuse ?",
  "criterion": "",
  "sourceLabel": "Cette administration temporaire se fait-elle d’une manière potentiellement dangereuse ?",
  "icon": "medicine",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "ivdCompanion": {
  "title": "Le test est-il un diagnostic compagnon d’un médicament ?",
  "criterion": "",
  "sourceLabel": "Le test est-il un diagnostic compagnon d’un médicament ?",
  "icon": "medicine",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdLevelsRisk": {
  "title": "Une erreur de suivi peut-elle conduire à une décision menaçant la vie ?",
  "criterion": "Une erreur de suivi d’un médicament, d’une substance ou d’un composant biologique pourrait-elle mener à une décision menaçant la vie ?",
  "sourceLabel": "Une erreur de suivi d’un médicament, d’une substance ou d’un composant biologique pourrait-elle mener à une décision menaçant la vie ?",
  "icon": "medicine",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "cleaning": {
  "title": "Le produit sert-il à traiter d’autres dispositifs médicaux ?",
  "criterion": "Le produit est-il spécifiquement destiné au traitement de dispositifs médicaux ?",
  "sourceLabel": "Le produit est-il spécifiquement destiné au traitement de dispositifs médicaux ?",
  "icon": "clean",
  "options": {
   "none": "Non",
   "lens": "Nettoyage, rinçage, désinfection ou hydratation des lentilles de contact",
   "final": "Solution ou laveur-désinfecteur : désinfection finale de dispositifs invasifs",
   "disinfect": "Autre désinfection ou stérilisation de DM",
   "physical": "Nettoyage par action physique seule, hors lentilles"
  }
 },
 "ivdSterile": {
  "title": "Le produit est-il mis sur le marché à l’état stérile ?",
  "criterion": "",
  "sourceLabel": "Le produit est-il mis sur le marché à l’état stérile ?",
  "icon": "clean",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "xrecord": {
  "title": "Le produit enregistre-t-il des images issues de rayons X ?",
  "criterion": "Le produit enregistre-t-il spécifiquement les images diagnostiques générées par rayons X ?",
  "sourceLabel": "Le produit enregistre-t-il spécifiquement les images diagnostiques générées par rayons X ?",
  "icon": "radiation",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "surgIonising": {
  "title": "Le dispositif fournit-il de l’énergie sous forme de rayonnements ionisants ?",
  "criterion": "",
  "sourceLabel": "Le dispositif fournit-il de l’énergie sous forme de rayonnements ionisants ?",
  "icon": "radiation",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "therapyIonising": {
  "title": "Le produit intervient-il dans une thérapie par rayonnements ionisants ?",
  "criterion": "Le produit émet-il des rayonnements ionisants à visée thérapeutique, ou commande-t-il / surveille-t-il directement un tel dispositif ?",
  "sourceLabel": "Le produit émet-il des rayonnements ionisants à visée thérapeutique, ou commande-t-il / surveille-t-il directement un tel dispositif ?",
  "icon": "radiation",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "diagnosticXray": {
  "title": "Le produit intervient-il dans un diagnostic par rayonnements ionisants ?",
  "criterion": "Émet-il des rayonnements ionisants pour le diagnostic / la radiologie interventionnelle, ou commande-t-il / surveille-t-il un tel dispositif ?",
  "sourceLabel": "Émet-il des rayonnements ionisants pour le diagnostic / la radiologie interventionnelle, ou commande-t-il / surveille-t-il un tel dispositif ?",
  "icon": "radiation",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "tissue": {
  "title": "Le produit contient-il des tissus ou cellules d’origine biologique ?",
  "criterion": "Le produit est-il fabriqué avec des tissus, cellules ou dérivés d’origine humaine ou animale ?",
  "sourceLabel": "Le produit est-il fabriqué avec des tissus, cellules ou dérivés d’origine humaine ou animale ?",
  "icon": "molecule",
  "options": {
   "none": "Non",
   "human": "Origine humaine, non viable / rendue non viable",
   "animal": "Origine animale, non viable / rendue non viable",
   "viable": "Cellules ou tissus viables : qualification particulière"
  }
 },
 "nano": {
  "title": "Le produit incorpore-t-il un nanomatériau ou est-il constitué d’un nanomatériau ?",
  "criterion": "",
  "sourceLabel": "Le produit incorpore-t-il un nanomatériau ou est-il constitué d’un nanomatériau ?",
  "icon": "molecule",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "nanoExposure": {
  "title": "Quelle exposition interne au nanomatériau est documentée ?",
  "criterion": "Quel est le potentiel documenté d’exposition interne au nanomatériau ?",
  "sourceLabel": "Quel est le potentiel documenté d’exposition interne au nanomatériau ?",
  "icon": "molecule",
  "options": {
   "high": "Élevé ou moyen",
   "low": "Faible",
   "negligible": "Négligeable",
   "unknown": "Évaluation de l’exposition non disponible"
  }
 },
 "substance": {
  "title": "Le produit est-il composé de substances absorbées ou dispersées dans le corps ?",
  "criterion": "Le produit est-il composé de substances appliquées sur la peau ou introduites par un orifice, puis absorbées ou dispersées dans le corps ?",
  "sourceLabel": "Le produit est-il composé de substances appliquées sur la peau ou introduites par un orifice, puis absorbées ou dispersées dans le corps ?",
  "icon": "molecule",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "substanceSystemic": {
  "title": "Une absorption systémique est-elle nécessaire à l’effet prévu ?",
  "criterion": "L’absorption systémique du produit ou de ses métabolites est-elle nécessaire à l’effet prévu ?",
  "sourceLabel": "L’absorption systémique du produit ou de ses métabolites est-elle nécessaire à l’effet prévu ?",
  "icon": "molecule",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "substanceGI": {
  "title": "La substance agit-elle dans le tube digestif avec absorption systémique ?",
  "criterion": "La substance agit-elle dans l’estomac / le tube digestif inférieur et est-elle, ou ses métabolites, absorbée par voie systémique ?",
  "sourceLabel": "La substance agit-elle dans l’estomac / le tube digestif inférieur et est-elle, ou ses métabolites, absorbée par voie systémique ?",
  "icon": "molecule",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "substanceLocal": {
  "title": "La substance atteint-elle son effet dans une zone locale précise ?",
  "criterion": "La substance est-elle appliquée sur la peau ou dans la cavité nasale / buccale jusqu’au pharynx, et y atteint-elle son effet ?",
  "sourceLabel": "La substance est-elle appliquée sur la peau ou dans la cavité nasale / buccale jusqu’au pharynx, et y atteint-elle son effet ?",
  "icon": "molecule",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "bioAbsorb": {
  "title": "A-t-il un effet biologique ou est-il absorbé en totalité ou en grande partie ?",
  "criterion": "",
  "sourceLabel": "A-t-il un effet biologique ou est-il absorbé en totalité ou en grande partie ?",
  "icon": "molecule",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "chemical": {
  "title": "Subit-il une transformation chimique dans le corps, en dehors d’un placement dans les dents ?",
  "criterion": "",
  "sourceLabel": "Subit-il une transformation chimique dans le corps, en dehors d’un placement dans les dents ?",
  "icon": "molecule",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "invitroSubstance": {
  "title": "La substance prépare-t-elle du matériel humain à une implantation ou administration ?",
  "criterion": "Est-ce une substance utilisée in vitro au contact direct de cellules, tissus, organes humains ou d’embryons avant leur implantation / administration ?",
  "sourceLabel": "Est-ce une substance utilisée in vitro au contact direct de cellules, tissus, organes humains ou d’embryons avant leur implantation / administration ?",
  "icon": "molecule",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "channel": {
  "title": "Le produit conduit-il ou stocke-t-il des matières destinées au corps ?",
  "criterion": "Le produit conduit-il ou stocke-t-il des matières destinées à être introduites dans le corps ?",
  "sourceLabel": "Le produit conduit-il ou stocke-t-il des matières destinées à être introduites dans le corps ?",
  "icon": "drop",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "bloodBag": {
  "title": "Est-ce une poche destinée à conserver du sang ?",
  "criterion": "",
  "sourceLabel": "Est-ce une poche destinée à conserver du sang ?",
  "icon": "drop",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "channelBody": {
  "title": "Le produit conduit-il ou stocke-t-il des matières biologiques ?",
  "criterion": "Le produit conduit-il / stocke-t-il du sang ou des liquides corporels, ou stocke-t-il des organes, cellules ou tissus ?",
  "sourceLabel": "Le produit conduit-il / stocke-t-il du sang ou des liquides corporels, ou stocke-t-il des organes, cellules ou tissus ?",
  "icon": "drop",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "modify": {
  "title": "Le produit modifie-t-il des matières biologiques destinées au corps ?",
  "criterion": "Le produit modifie-t-il la composition de tissus, cellules, sang ou liquides destinés à être implantés ou administrés ?",
  "sourceLabel": "Le produit modifie-t-il la composition de tissus, cellules, sang ou liquides destinés à être implantés ou administrés ?",
  "icon": "drop",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "modifySimple": {
  "title": "Le traitement se limite-t-il à une filtration, centrifugation ou à un échange de gaz ou de chaleur ?",
  "criterion": "",
  "sourceLabel": "Le traitement se limite-t-il à une filtration, centrifugation ou à un échange de gaz ou de chaleur ?",
  "icon": "drop",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "administer": {
  "title": "Le produit actif administre-t-il ou retire-t-il une substance ?",
  "criterion": "Le dispositif actif fait-il entrer ou sortir de l’air, un liquide ou une autre substance du corps ?",
  "sourceLabel": "Le dispositif actif fait-il entrer ou sortir de l’air, un liquide ou une autre substance du corps ?",
  "icon": "drop",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "adminHazard": {
  "title": "L’administration ou le retrait peut-il être dangereux ?",
  "criterion": "L’administration / le retrait peut-il être potentiellement dangereux selon la substance, le site ou le mode ?",
  "sourceLabel": "L’administration / le retrait peut-il être potentiellement dangereux selon la substance, le site ou le mode ?",
  "icon": "drop",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "ivdDonor": {
  "title": "Le test recherche-t-il un agent transmissible pour accepter un don ?",
  "criterion": "",
  "sourceLabel": "Le test recherche-t-il un agent transmissible pour accepter un don ?",
  "icon": "drop",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdBloodAgent": {
  "title": "Le test détecte-t-il directement un agent dans le sang ou le LCR ?",
  "criterion": "Détecte-t-il directement un agent infectieux dans le sang ou le liquide céphalo-rachidien, sans fort risque de propagation ?",
  "sourceLabel": "Détecte-t-il directement un agent infectieux dans le sang ou le liquide céphalo-rachidien, sans fort risque de propagation ?",
  "icon": "drop",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "channelActive": {
  "title": "Peut-il se connecter à un dispositif actif de classe IIa, IIb ou III ?",
  "criterion": "",
  "sourceLabel": "Peut-il se connecter à un dispositif actif de classe IIa, IIb ou III ?",
  "icon": "link",
  "options": {
   "yes": "Oui, selon l’usage prévu et la classe documentée du dispositif connecté",
   "no": "Non",
   "unknownClass": "Dispositif connecté identifié, classe inconnue"
  }
 },
 "orificeActive": {
  "title": "Le produit est-il destiné à être connecté à un dispositif actif IIa, IIb ou III ?",
  "criterion": "",
  "sourceLabel": "Le produit est-il destiné à être connecté à un dispositif actif IIa, IIb ou III ?",
  "icon": "link",
  "options": {
   "yes": "Oui, classe du dispositif connecté documentée",
   "no": "Non ou connexion uniquement à un actif de classe I",
   "unknownClass": "Connexion prévue, classe inconnue"
  }
 },
 "controlTherapy": {
  "title": "Le produit agit-il sur un autre dispositif thérapeutique actif ?",
  "criterion": "Le produit commande-t-il, surveille-t-il ou influence-t-il directement un autre dispositif thérapeutique actif ?",
  "sourceLabel": "Le produit commande-t-il, surveille-t-il ou influence-t-il directement un autre dispositif thérapeutique actif ?",
  "icon": "link",
  "options": {
   "none": "Non",
   "iib": "Un dispositif thérapeutique actif IIb",
   "implant": "Un dispositif implantable actif",
   "other": "Autre cas / classe inconnue à analyser"
  }
 },
 "ivdAccessoryCritical": {
  "title": "L’accessoire possède-t-il une caractéristique critique pour l’examen ?",
  "criterion": "",
  "sourceLabel": "L’accessoire possède-t-il une caractéristique critique pour l’examen ?",
  "icon": "link",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "heartDefect": {
  "title": "Le produit intervient-il directement sur une défaillance cardiaque ou circulatoire centrale ?",
  "criterion": "Est-il spécifiquement destiné à contrôler, diagnostiquer, surveiller ou corriger une défaillance cardiaque / circulatoire centrale par contact direct ?",
  "sourceLabel": "Est-il spécifiquement destiné à contrôler, diagnostiquer, surveiller ou corriger une défaillance cardiaque / circulatoire centrale par contact direct ?",
  "icon": "heart",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "centralContact": {
  "title": "Le produit touche-t-il directement le cœur ou le système nerveux central ?",
  "criterion": "Est-il spécifiquement utilisé en contact direct avec le cœur, la circulation centrale ou le système nerveux central ?",
  "sourceLabel": "Est-il spécifiquement utilisé en contact direct avec le cœur, la circulation centrale ou le système nerveux central ?",
  "icon": "heart",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "softwareVital": {
  "title": "Les paramètres surveillés peuvent-ils signaler un danger vital immédiat ?",
  "criterion": "Surveille-t-il des paramètres vitaux dont les variations peuvent présenter un danger immédiat pour la vie ?",
  "sourceLabel": "Surveille-t-il des paramètres vitaux dont les variations peuvent présenter un danger immédiat pour la vie ?",
  "icon": "heart",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "diagnostic": {
  "title": "Le produit réalise-t-il un diagnostic ou une surveillance physiologique ?",
  "criterion": "",
  "sourceLabel": "Le produit réalise-t-il un diagnostic ou une surveillance physiologique ?",
  "icon": "monitor",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "diagnosticEnergy": {
  "title": "Fournit-il une énergie absorbée par le corps, hors simple éclairage visible ?",
  "criterion": "",
  "sourceLabel": "Fournit-il une énergie absorbée par le corps, hors simple éclairage visible ?",
  "icon": "monitor",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "radiopharm": {
  "title": "Représente-t-il la distribution de produits radiopharmaceutiques dans le corps ?",
  "criterion": "",
  "sourceLabel": "Représente-t-il la distribution de produits radiopharmaceutiques dans le corps ?",
  "icon": "monitor",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "diagnosticUse": {
  "title": "Dans quel contexte clinique le produit est-il utilisé ?",
  "criterion": "Dans quel contexte le diagnostic ou la surveillance est-il utilisé ?",
  "sourceLabel": "Dans quel contexte le diagnostic ou la surveillance est-il utilisé ?",
  "icon": "monitor",
  "options": {
   "routine": "Diagnostic / mesure courante (EEG, ECG, température…)",
   "critical": "Surveillance / diagnostic avec danger immédiat",
   "other": "Autre fonction, hors diagnostic direct / processus vitaux",
   "unclear": "Contexte clinique non défini"
  }
 },
 "softwareMonitor": {
  "title": "Le logiciel surveille-t-il des processus physiologiques ?",
  "criterion": "",
  "sourceLabel": "Le logiciel surveille-t-il des processus physiologiques ?",
  "icon": "monitor",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "ivdInstrumentIndependent": {
  "title": "L’instrument réalise-t-il une mesure sans réactif supplémentaire ?",
  "criterion": "L’instrument réalise-t-il une mesure indépendante sans réactif supplémentaire ?",
  "sourceLabel": "L’instrument réalise-t-il une mesure indépendante sans réactif supplémentaire ?",
  "icon": "monitor",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "closedLoop": {
  "title": "Le dispositif adapte-t-il automatiquement un traitement à partir de mesures sur le patient ?",
  "criterion": "",
  "sourceLabel": "Le dispositif adapte-t-il automatiquement un traitement à partir de mesures sur le patient ?",
  "icon": "loop",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "closedLoopDiagnostic": {
  "title": "Une fonction diagnostique détermine-t-elle le traitement automatique ?",
  "criterion": "Une fonction diagnostique patient détermine-t-elle le traitement automatique ?",
  "sourceLabel": "Une fonction diagnostique patient détermine-t-elle le traitement automatique ?",
  "icon": "loop",
  "options": {
   "no": "Non, régulation technique seule",
   "yes": "Oui, fonction diagnostique déterminante",
   "unclear": "Fonction diagnostique non définie"
  }
 },
 "softwareRole": {
  "title": "Quel est le rôle médical du logiciel ?",
  "criterion": "",
  "sourceLabel": "Quel est le rôle médical du logiciel ?",
  "icon": "software",
  "options": {
   "independent": "Il a une fonction médicale propre",
   "drives": "Il commande ou influence seulement l’utilisation du dispositif physique",
   "both": "Il commande le dispositif et possède aussi une fonction médicale propre"
  }
 },
 "softwareDecision": {
  "title": "Fournit-il des informations utilisées pour une décision diagnostique ou thérapeutique ?",
  "criterion": "",
  "sourceLabel": "Fournit-il des informations utilisées pour une décision diagnostique ou thérapeutique ?",
  "icon": "software",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "softwareImpact": {
  "title": "Quelle serait la conséquence la plus grave d’une décision erronée ?",
  "criterion": "Quelle est la conséquence la plus grave qu’une décision erronée pourrait entraîner ?",
  "sourceLabel": "Quelle est la conséquence la plus grave qu’une décision erronée pourrait entraîner ?",
  "icon": "software",
  "options": {
   "death": "Décès ou détérioration irréversible de la santé",
   "serious": "Détérioration grave ou intervention chirurgicale",
   "other": "Autres conséquences"
  }
 },
 "ivdSoftwareRole": {
  "title": "Quel est le rôle du logiciel IVD ?",
  "criterion": "",
  "sourceLabel": "Quel est le rôle du logiciel IVD ?",
  "icon": "software",
  "options": {
   "independent": "Il fournit une information IVD pour sa propre destination",
   "drives": "Il pilote ou influence uniquement un autre DIV",
   "both": "Il pilote un DIV et réalise aussi une fonction IVD propre"
  }
 },
 "ivdQualification": {
  "title": "Le fabricant prévoit-il une destination de diagnostic in vitro humain ?",
  "criterion": "Le fabricant destine-t-il ce produit au diagnostic in vitro humain, ou comme accessoire dédié ?",
  "sourceLabel": "Le fabricant destine-t-il ce produit au diagnostic in vitro humain, ou comme accessoire dédié ?",
  "icon": "tube",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdRole": {
  "title": "Quel élément souhaitez-vous classer ?",
  "criterion": "Quel élément classez-vous séparément ?",
  "sourceLabel": "Quel élément classez-vous séparément ?",
  "icon": "tube",
  "options": {
   "test": "Réactif, test ou kit réalisant une analyse",
   "instrument": "Instrument d’analyse vendu séparément des réactifs",
   "software": "Logiciel IVD",
   "receptacle": "Récipient de prélèvement sans test intégré",
   "lab": "Produit général / tampon / lavage / milieu / colorant pour usage IVD",
   "accessory": "Accessoire dédié à un DIV",
   "calibrator": "Calibrateur",
   "assignedControl": "Contrôle avec valeur quantitative ou qualitative assignée",
   "unassignedControl": "Contrôle sans valeur quantitative ni qualitative assignée"
  }
 },
 "ivdGeneral": {
  "title": "S’agit-il d’un produit général IVD de la règle 5a ?",
  "criterion": "Le produit correspond-il à un produit général IVD de la règle 5a ?",
  "sourceLabel": "Le produit correspond-il à un produit général IVD de la règle 5a ?",
  "icon": "tube",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdAdditional": {
  "title": "Le produit possède-t-il une autre fonction ou destination à classer ?",
  "criterion": "Le produit possède-t-il aussi une fonction d’analyse ou une autre destination à classer ?",
  "sourceLabel": "Le produit possède-t-il aussi une fonction d’analyse ou une autre destination à classer ?",
  "icon": "tube",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdLinkedClass": {
  "title": "Quelle est la classe documentée la plus élevée des DIV associés ?",
  "criterion": "",
  "sourceLabel": "Quelle est la classe documentée la plus élevée des DIV associés ?",
  "icon": "chart",
  "options": {
   "A": "Classe A",
   "B": "Classe B",
   "C": "Classe C",
   "D": "Classe D",
   "unknown": "La classe n’est pas documentée"
  }
 },
 "ivdLoad": {
  "title": "Le suivi de la charge infectieuse est-il critique ?",
  "criterion": "Le test mesure-t-il une charge infectieuse dont le suivi est critique pour une maladie mortelle ?",
  "sourceLabel": "Le test mesure-t-il une charge infectieuse dont le suivi est critique pour une maladie mortelle ?",
  "icon": "chart",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdStaging": {
  "title": "Une erreur de stadification peut-elle menacer la vie ?",
  "criterion": "Une erreur de détermination du stade d’une maladie pourrait-elle mener à une décision menaçant la vie ?",
  "sourceLabel": "Une erreur de détermination du stade d’une maladie pourrait-elle mener à une décision menaçant la vie ?",
  "icon": "chart",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdPropagation": {
  "title": "L’agent détecté présente-t-il un risque élevé de propagation ?",
  "criterion": "Le test détecte-t-il un agent causant une maladie mortelle à fort risque de propagation ?",
  "sourceLabel": "Le test détecte-t-il un agent causant une maladie mortelle à fort risque de propagation ?",
  "icon": "infection",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdInfection": {
  "title": "La destination couvre-t-elle la détection d’une infection ou d’un état immunitaire infectieux ?",
  "criterion": "",
  "sourceLabel": "La destination couvre-t-elle la détection d’une infection ou d’un état immunitaire infectieux ?",
  "icon": "infection",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdSexual": {
  "title": "Le test recherche-t-il un agent principalement sexuellement transmissible, ou l’exposition à cet agent ?",
  "criterion": "",
  "sourceLabel": "Le test recherche-t-il un agent principalement sexuellement transmissible, ou l’exposition à cet agent ?",
  "icon": "infection",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdInfectionHarm": {
  "title": "Une erreur de détection risque-t-elle un décès ou un handicap grave ?",
  "criterion": "Un résultat erroné de détection d’agent risque-t-il d’entraîner décès ou handicap grave ?",
  "sourceLabel": "Un résultat erroné de détection d’agent risque-t-il d’entraîner décès ou handicap grave ?",
  "icon": "infection",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdPrenatalImmune": {
  "title": "Le test dépiste-t-il un statut immunitaire pendant la grossesse ?",
  "criterion": "Le test dépiste-t-il le statut immunitaire d’une femme enceinte envers un agent transmissible ?",
  "sourceLabel": "Le test dépiste-t-il le statut immunitaire d’une femme enceinte envers un agent transmissible ?",
  "icon": "infection",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdImmuneRisk": {
  "title": "Une erreur de statut peut-elle conduire à une décision menaçant la vie ?",
  "criterion": "Une erreur de statut infectieux ou immunitaire pourrait-elle mener à une décision menaçant la vie ?",
  "sourceLabel": "Une erreur de statut infectieux ou immunitaire pourrait-elle mener à une décision menaçant la vie ?",
  "icon": "infection",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdCompatibility": {
  "title": "Le test détermine-t-il une compatibilité immunologique ?",
  "criterion": "Le test détermine-t-il une compatibilité immunologique ou une incompatibilité fœto-maternelle ?",
  "sourceLabel": "Le test détermine-t-il une compatibilité immunologique ou une incompatibilité fœto-maternelle ?",
  "icon": "shield",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdMarkers": {
  "title": "Le test couvre-t-il un des marqueurs de groupe explicitement classés D ?",
  "criterion": "",
  "sourceLabel": "Le test couvre-t-il un des marqueurs de groupe explicitement classés D ?",
  "icon": "shield",
  "options": {
   "other": "Non, uniquement d’autres marqueurs de compatibilité",
   "listed": "Oui : ABO, Rhésus listé, K (Kell), Kidd ou Duffy listé",
   "unknown": "La liste des marqueurs n’est pas établie"
  }
 },
 "ivdLifeManagement": {
  "title": "Le test aide-t-il à prendre en charge une situation menaçant la vie ?",
  "criterion": "Le test sert-il à la prise en charge d’une maladie ou d’un état menaçant la vie ?",
  "sourceLabel": "Le test sert-il à la prise en charge d’une maladie ou d’un état menaçant la vie ?",
  "icon": "shield",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdCancer": {
  "title": "Le test est-il destiné au dépistage, au diagnostic ou à la stadification d’un cancer ?",
  "criterion": "",
  "sourceLabel": "Le test est-il destiné au dépistage, au diagnostic ou à la stadification d’un cancer ?",
  "icon": "gene",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdGenetic": {
  "title": "Le test est-il destiné à un examen génétique humain ?",
  "criterion": "",
  "sourceLabel": "Le test est-il destiné à un examen génétique humain ?",
  "icon": "gene",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdCongenital": {
  "title": "Le test dépiste-t-il une anomalie congénitale de l’embryon ou du fœtus ?",
  "criterion": "",
  "sourceLabel": "Le test dépiste-t-il une anomalie congénitale de l’embryon ou du fœtus ?",
  "icon": "baby",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdNewborn": {
  "title": "Le dépistage du nouveau-né prévient-il une conséquence grave ?",
  "criterion": "Le test dépiste-t-il chez le nouveau-né une anomalie dont l’absence de traitement risque décès ou handicap grave ?",
  "sourceLabel": "Le test dépiste-t-il chez le nouveau-né une anomalie dont l’absence de traitement risque décès ou handicap grave ?",
  "icon": "baby",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdSelf": {
  "title": "Un non-professionnel réalise-t-il une étape du test ?",
  "criterion": "Une personne non professionnelle réalise-t-elle au moins une étape du test lui-même ?",
  "sourceLabel": "Une personne non professionnelle réalise-t-elle au moins une étape du test lui-même ?",
  "icon": "person",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdSelfException": {
  "title": "L’autotest correspond-il à une exception de classe B ?",
  "criterion": "L’autotest est-il limité à l’une des exceptions de classe B ?",
  "sourceLabel": "L’autotest est-il limité à l’une des exceptions de classe B ?",
  "icon": "person",
  "options": {
   "pregnancy": "Détection de grossesse uniquement",
   "fertility": "Test de fertilité uniquement",
   "cholesterol": "Mesure du cholestérol uniquement",
   "urine": "Uniquement glucose, érythrocytes, leucocytes ou bactéries dans les urines",
   "other": "Autre test ou panel comportant d’autres marqueurs"
  }
 },
 "ivdNear": {
  "title": "Le test est-il réalisé par un professionnel près du patient, hors laboratoire ?",
  "criterion": "",
  "sourceLabel": "Le test est-il réalisé par un professionnel près du patient, hors laboratoire ?",
  "icon": "person",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 }
};
const hints={
 "active": "Énergie électrique ou autre énergie externe utilisée pour la fonction du produit.",
 "medicinal": "La substance médicamenteuse fait partie du produit et son action reste accessoire.",
 "contraception": "Contraception ou prévention des infections sexuellement transmissibles (IST).",
 "cleaning": "Nettoyage, désinfection, stérilisation ou entretien de lentilles de contact.",
 "xrecord": "Enregistrement spécifique de l’image diagnostique générée par les rayons X.",
 "tissue": "Tissus, cellules ou dérivés d’origine humaine ou animale, y compris non viables.",
 "nanoContact": "Contact direct ou indirect possible entre le composant contenant le nanomatériau et une personne.",
 "nanoExposure": "Appuyez-vous sur l’évaluation documentée de l’exposition interne.",
 "substance": "Substances appliquées sur la peau ou introduites par un orifice, puis absorbées ou dispersées dans le corps.",
 "substanceSystemic": "L’absorption du produit ou de ses métabolites dans la circulation générale est nécessaire à son effet.",
 "substanceGI": "Action dans l’estomac ou le tube digestif inférieur, avec absorption systémique du produit ou de ses métabolites.",
 "substanceLocal": "Application sur la peau, ou dans la cavité nasale ou buccale jusqu’au pharynx, avec un effet atteint dans cette zone.",
 "channel": "Conduite ou stockage de matières qui seront introduites dans le corps.",
 "channelBody": "Conduite ou stockage de sang ou de liquides corporels, ou stockage d’organes, de cellules ou de tissus.",
 "modify": "Modification de la composition de tissus, cellules, sang ou liquides qui seront implantés ou administrés.",
 "invitroSubstance": "Substance utilisée in vitro au contact direct de cellules, tissus, organes humains ou d’embryons avant implantation ou administration.",
 "woundDeep": "Usage principal sur une lésion ayant franchi le derme ou la muqueuse, cicatrisant uniquement par seconde intention.",
 "orificeCavity": "Bouche jusqu’au pharynx, conduit auditif jusqu’au tympan, ou cavité nasale uniquement.",
 "inhalationRisk": "Influence essentielle sur l’efficacité ou la sécurité du médicament, ou traitement d’une affection mettant la vie en danger.",
 "heartDefect": "Contrôle, diagnostic, surveillance ou correction d’une défaillance cardiaque ou circulatoire centrale par contact direct.",
 "centralContact": "Usage spécifique en contact direct avec le cœur, la circulation centrale ou le système nerveux central.",
 "implantSpecial": "Implant mammaire, treillis chirurgical, prothèse articulaire totale ou partielle, ou dispositif rachidien visé par la règle. Consultez le « i » pour les exceptions.",
 "therapyEnergy": "Administration ou échange d’énergie avec le corps à des fins thérapeutiques.",
 "energyHazard": "Tenez compte de la nature de l’énergie, de sa densité et du site d’application.",
 "therapyIonising": "Émission thérapeutique de rayonnements ionisants, ou commande ou surveillance directe d’un tel dispositif.",
 "controlTherapy": "Commande, surveillance ou influence directe sur un autre dispositif thérapeutique actif.",
 "diagnosticUse": "Précisez la destination clinique du diagnostic ou de la surveillance physiologique.",
 "diagnosticXray": "Émission de rayonnements ionisants pour le diagnostic ou la radiologie interventionnelle, ou commande ou surveillance d’un tel dispositif.",
 "administer": "Un dispositif actif fait entrer ou sortir de l’air, un liquide ou une autre substance du corps.",
 "adminHazard": "Tenez compte de la substance, du site et du mode d’administration ou de retrait.",
 "closedLoopDiagnostic": "Distinguez une fonction diagnostique sur le patient d’une simple régulation technique.",
 "softwareRole": "Distinguez la fonction médicale propre du logiciel du pilotage d’un dispositif physique.",
 "softwareImpact": "Retenez la conséquence la plus grave d’une décision diagnostique ou thérapeutique erronée.",
 "softwareVital": "Surveillance de paramètres vitaux dont les variations peuvent présenter un danger immédiat pour la vie.",
 "multiPurpose": "Un seul dispositif, tous ses usages et variantes, en retenant les situations les plus contraignantes.",
 "ivdQualification": "Examen médical in vitro humain, récipient de prélèvement ou accessoire dédié à un DIV, selon la destination du fabricant.",
 "ivdRole": "Classez chaque élément selon sa propre destination, sans confondre un kit complet avec un composant.",
 "ivdInstrumentIndependent": "Une mesure indépendante, réalisée sans nécessiter de réactif supplémentaire.",
 "ivdGeneral": "Produits généraux IVD, tampons, solutions de lavage, milieux généraux ou colorants histologiques. Vérifiez les limites dans le « i ».",
 "ivdAdditional": "Une fonction d’analyse ou une autre destination s’ajoute à la fonction déjà décrite.",
 "ivdPropagation": "Détection d’un agent causant une maladie mortelle avec un fort risque de propagation.",
 "ivdLoad": "Mesure d’une charge infectieuse dont le suivi est critique pour une maladie mortelle.",
 "ivdCompatibility": "Compatibilité immunologique ou incompatibilité fœto-maternelle.",
 "ivdBloodAgent": "Détection directe d’un agent infectieux dans le sang ou le liquide céphalo-rachidien, sans fort risque de propagation.",
 "ivdInfectionHarm": "Résultat erroné de détection d’un agent infectieux pouvant entraîner un décès ou un handicap grave.",
 "ivdPrenatalImmune": "Dépistage du statut immunitaire d’une femme enceinte envers un agent transmissible.",
 "ivdImmuneRisk": "Une erreur de statut infectieux ou immunitaire peut mener à une décision menaçant la vie.",
 "ivdStaging": "Une erreur de détermination du stade d’une maladie peut mener à une décision menaçant la vie.",
 "ivdLevelsRisk": "Suivi d’un médicament, d’une substance ou d’un composant biologique : une erreur peut mener à une décision menaçant la vie.",
 "ivdLifeManagement": "Prise en charge d’une maladie ou d’un état menaçant la vie.",
 "ivdNewborn": "Dépistage d’une anomalie chez le nouveau-né dont l’absence de traitement risque un décès ou un handicap grave.",
 "ivdSelf": "Une personne non professionnelle réalise au moins une étape du test lui-même.",
 "ivdSelfException": "L’autotest doit être limité à l’une des destinations indiquées. Un panel plus large relève d’un autre cas.",
 "ivdAllUses": "L’ensemble des destinations du produit et sa configuration complète ont été examinés."
};
const icons={
 yes:'<circle cx="16" cy="16" r="13" fill="currentColor"/><path d="m10 16 4 4 8-9" stroke="#e7a116" stroke-width="3" fill="none"/>',
 no:'<circle cx="16" cy="16" r="13" fill="currentColor"/><path d="M10 16h12" stroke="#e7a116" stroke-width="3"/>',
 unknown:'<circle cx="16" cy="16" r="13" fill="currentColor"/><path d="M12 12a4 4 0 1 1 6 4c-2 1-2 2-2 4" stroke="white" stroke-width="2.5" fill="none"/><circle cx="16" cy="24" r="1.5" fill="#e7a116"/>',
 product:'<rect x="4" y="6" width="24" height="21" rx="3" fill="currentColor"/><path d="M8 17h4l3-6 4 11 3-5h3" stroke="#e7a116" stroke-width="2" fill="none"/>',
 energy:'<rect x="7" y="5" width="18" height="24" rx="3" fill="currentColor"/><path d="M12 2h8v4h-8z" fill="currentColor"/><path d="m17 9-6 10h5l-1 6 7-11h-5z" fill="#e7a116"/>',
 body:'<circle cx="16" cy="6" r="4" fill="currentColor"/><path d="M9 13h14l-2 10h-3v7h-4v-7h-3z" fill="currentColor"/><path d="M8 18h16" stroke="#e7a116" stroke-width="3"/>',
 implant:'<path d="m8 4 18 18-5 5L3 9z" fill="currentColor"/><path d="m12 13 4-4m1 9 4-4" stroke="#e7a116" stroke-width="2"/><circle cx="7" cy="8" r="2" fill="white"/>',
 clock:'<circle cx="16" cy="17" r="12" fill="currentColor"/><path d="M16 9v8l6 3" stroke="#e7a116" stroke-width="2.5" fill="none"/><path d="M12 2h8" stroke="currentColor" stroke-width="3"/>',
 medicine:'<g transform="rotate(-40 16 16)"><rect x="2" y="9" width="28" height="14" rx="7" fill="currentColor"/><path d="M16 9h7a7 7 0 0 1 0 14h-7z" fill="#e7a116"/></g>',
 clean:'<path d="M10 9h12l3 19H7z" fill="currentColor"/><path d="M12 4h8v6h-8z" fill="currentColor"/><path d="M16 14v10m-5-5h10" stroke="#e7a116" stroke-width="2.5"/>',
 radiation:'<circle cx="16" cy="16" r="13" fill="currentColor"/><circle cx="16" cy="16" r="2" fill="#e7a116"/><path d="m14 12-4-7-5 8 8 1m6 0 8-1-5-8-4 7m-2 7-4 7h9l-4-7" fill="#e7a116"/>',
 molecule:'<path d="m8 8 15 4-7 13z" stroke="currentColor" stroke-width="3" fill="none"/><circle cx="8" cy="8" r="5" fill="currentColor"/><circle cx="23" cy="12" r="5" fill="#e7a116"/><circle cx="16" cy="25" r="5" fill="currentColor"/>',
 drop:'<path d="M16 2C12 9 5 15 5 21a11 11 0 0 0 22 0c0-6-7-12-11-19" fill="currentColor"/><path d="M10 22a6 6 0 0 0 6 5" stroke="#e7a116" stroke-width="3" fill="none"/>',
 link:'<path d="M8 13v9a7 7 0 0 0 14 0v-9" stroke="currentColor" stroke-width="3" fill="none"/><rect x="4" y="6" width="8" height="11" rx="2" fill="currentColor"/><rect x="19" y="6" width="6" height="11" rx="2" fill="currentColor"/><path d="M6 2h4v5H6zm14 0h4v5h-4z" fill="#e7a116"/>',
 heart:'<path d="M16 28 4 16C-3 7 8-2 16 7c8-9 19 0 12 9z" fill="currentColor"/><path d="M6 16h5l3-6 4 12 3-6h5" stroke="#e7a116" stroke-width="2" fill="none"/>',
 monitor:'<rect x="3" y="3" width="26" height="22" rx="3" fill="currentColor"/><path d="M7 14h4l3-6 4 11 3-5h4" stroke="#e7a116" stroke-width="2" fill="none"/><path d="M16 25v4m-6 0h12" stroke="currentColor" stroke-width="3"/>',
 loop:'<path d="M25 11a11 11 0 0 0-19 0m1 10a11 11 0 0 0 19 0" stroke="currentColor" stroke-width="3" fill="none"/><path d="m19 11 8 3 1-9M4 19l1 9 8-3" fill="#e7a116"/>',
 software:'<rect x="3" y="4" width="26" height="24" rx="3" fill="currentColor"/><path d="M6 10h20" stroke="white" stroke-width="1.5"/><path d="m12 14-4 4 4 4m8-8 4 4-4 4m-3-8-2 9" stroke="#e7a116" stroke-width="2" fill="none"/>',
 tube:'<path d="M10 9h12v15a6 6 0 0 1-12 0z" fill="currentColor"/><rect x="8" y="2" width="16" height="7" rx="2" fill="#e7a116"/><path d="M12 14h4m-4 4h4" stroke="white" stroke-width="1.5"/><path d="M12 24v-1l8-4v5a4 4 0 0 1-8 0" fill="#e7a116"/>',
 chart:'<rect x="4" y="3" width="24" height="27" rx="2" fill="currentColor"/><path d="M9 23v-7m7 7V9m7 14V13" stroke="#e7a116" stroke-width="3"/>',
 infection:'<circle cx="16" cy="16" r="8" fill="currentColor"/><path d="M16 2v6m0 16v6M2 16h6m16 0h6M6 6l5 5m10 10 5 5M6 26l5-5M21 11l5-5" stroke="currentColor" stroke-width="3"/><circle cx="13" cy="14" r="2" fill="#e7a116"/><circle cx="19" cy="19" r="2" fill="#e7a116"/>',
 shield:'<path d="m16 2 12 5v10c0 6-7 11-12 14C11 28 4 23 4 17V7z" fill="currentColor"/><path d="m10 16 4 4 8-9" stroke="#e7a116" stroke-width="2.5" fill="none"/>',
 gene:'<path d="M8 2c0 14 16 14 16 28M24 2C24 16 8 16 8 30" stroke="currentColor" stroke-width="3" fill="none"/><path d="M10 5h12M12 12h8m-8 8h8M10 27h12" stroke="#e7a116" stroke-width="2"/>',
 baby:'<circle cx="16" cy="11" r="7" fill="currentColor"/><path d="M7 23a9 9 0 0 1 18 0v7H7z" fill="currentColor"/><path d="m12 23 4 4 4-4" stroke="#e7a116" stroke-width="2" fill="none"/>',
 person:'<circle cx="16" cy="7" r="5" fill="currentColor"/><path d="M6 29v-8a10 10 0 0 1 20 0v8z" fill="currentColor"/><path d="M16 17v8m-4-4h8" stroke="#e7a116" stroke-width="2"/>',
 combined:'<rect x="2" y="4" width="18" height="20" rx="2" fill="currentColor"/><path d="M5 13h4l2-4 3 8 3-4" stroke="#e7a116" stroke-width="1.5" fill="none"/><rect x="15" y="14" width="15" height="15" rx="2" fill="currentColor" stroke="white"/><path d="m21 18-3 3 3 3m3-6 3 3-3 3" stroke="#e7a116" stroke-width="1.5" fill="none"/>'
};
const optionIcons={
 scope:{md:'monitor',accessory:'link',ivd:'tube',other:'unknown'},
 form:{physical:'product',software:'software',combined:'combined'},
 contact:{none:'shield',orifice:'body',surgical:'implant',multiple:'unknown'},
 duration:{transient:'clock',short:'clock',long:'clock',multiple:'unknown'},
 softwareRole:{independent:'software',drives:'link',both:'combined'},
 ivdSoftwareRole:{independent:'software',drives:'link',both:'combined'},
 ivdRole:{test:'tube',instrument:'monitor',software:'software',receptacle:'tube',lab:'molecule',accessory:'link',calibrator:'chart',assignedControl:'shield',unassignedControl:'chart'}
};
function icon(name){return '<span class="choice-icon" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false" stroke-linecap="round" stroke-linejoin="round">'+(icons[name]||icons.unknown)+'</svg></span>';}
function view(q){const p=questions[q.id];if(!p)return {title:q.label,criterion:q.intro||'',options:q.options,descriptions:q.optionHelp||{}};
 return {title:p.title,criterion:hints[q.id]||p.criterion||q.intro||'',options:q.options.map(([value,label])=>[value,p.options[value]||label]),descriptions:{...q.optionHelp,...p.descriptions}};}
function answerIcon(q,value){const named=optionIcons[q.id]?.[value];return icon(named||(value==='yes'?'yes':value==='no'||value==='none'?'no':/unknown|unclear|multiple|other/.test(value)?'unknown':questions[q.id]?.icon));}
const api={questions,icons,view,icon,answerIcon};
if(typeof module==='object'&&module.exports)module.exports=api;else window.ORBIVIA_QUESTION_PRESENTATION=api;
})();
