/* Public questionnaire presentation only. No rules or answer values live here. */
(function(){
'use strict';
const questions={
 "scope": {
  "title": "À quelle catégorie appartient votre produit ?",
  "criterion": "",
  "sourceLabel": "Le produit est-il déjà qualifié de dispositif médical ?",
  "options": {
   "md": "Dispositif médical",
   "accessory": "Accessoire dédié à un DM",
   "ivd": "Diagnostic in vitro",
   "annex16": "Produit sans destination médicale de l’annexe XVI",
   "other": "Autre produit"
  },
  "descriptions": {
   "md": "Dispositif à destination médicale : prévention, diagnostic, surveillance, traitement ou compensation.",
   "accessory": "Pour permettre ou assister l’utilisation d’un dispositif médical.",
   "ivd": "Analyse in vitro de prélèvements humains, par exemple un test de grossesse.",
   "other": "Votre produit ne correspond pas clairement aux catégories précédentes."
  }
 },
 "form": {
  "title": "Quelle forme a le produit ?",
  "criterion": "",
  "sourceLabel": "Quelle forme a le produit ?",
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
  "options": {
   "yes": "Oui",
   "no": "Non : plusieurs configurations doivent encore être analysées"
  }
 },
 "ivdAllUses": {
  "title": "Toutes les destinations et la configuration complète sont-elles couvertes ?",
  "criterion": "Les réponses couvrent-elles toutes les destinations du produit et sa configuration complète ?",
  "sourceLabel": "Les réponses couvrent-elles toutes les destinations du produit et sa configuration complète ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "active": {
  "title": "Le produit dépend-il d’une source d’énergie ?",
  "criterion": "Le produit utilise-t-il une énergie électrique ou une autre énergie externe pour sa fonction ?",
  "sourceLabel": "Le produit utilise-t-il une énergie électrique ou une autre énergie externe pour sa fonction ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "therapyEnergy": {
  "title": "Le produit échange-t-il de l’énergie avec le corps pour traiter ?",
  "criterion": "Le produit administre-t-il ou échange-t-il de l’énergie avec le corps à des fins thérapeutiques ?",
  "sourceLabel": "Le produit administre-t-il ou échange-t-il de l’énergie avec le corps à des fins thérapeutiques ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "energyHazard": {
  "title": "L'énergie thérapeutique peut-elle présenter un danger lors de son administration ?",
  "criterion": "Cette énergie peut-elle être administrée d’une manière potentiellement dangereuse compte tenu de sa nature, densité et site ?",
  "sourceLabel": "Cette énergie peut-elle être administrée d’une manière potentiellement dangereuse compte tenu de sa nature, densité et site ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "contact": {
  "title": "Par quelle voie le dispositif entre-t-il en contact avec le corps ?",
  "criterion": "",
  "sourceLabel": "Comment le produit entre-t-il en contact avec le corps ?",
  "options": {
   "none": "Sans pénétration dans le corps (contact externe possible)",
   "orifice": "Par un orifice corporel (naturel ou stomie), sans pénétration chirurgicale",
   "surgical": "Par pénétration à travers les tissus ou dans le cadre d'un acte chirurgical",
   "multiple": "Plusieurs voies ou situations à analyser séparément"
  },
  "descriptions": {
   "none": "Par exemple un appareil sur peau intacte ou un pansement sur une plaie.",
   "orifice": "Par exemple nez, bouche, oreille ou stomie permanente.",
   "surgical": "Notamment par la peau ou une muqueuse lors d'une intervention."
  }
 },
 "animalIntact": {
  "title": "Le dispositif d’origine animale touche-t-il exclusivement une peau intacte ?",
  "criterion": "",
  "sourceLabel": "Le dispositif d’origine animale touche-t-il exclusivement une peau intacte ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "nanoContact": {
  "title": "Le nanomatériau peut-il exposer une personne ?",
  "criterion": "Le composant contenant le nanomatériau peut-il avoir un contact direct ou indirect avec une personne ?",
  "sourceLabel": "Le composant contenant le nanomatériau peut-il avoir un contact direct ou indirect avec une personne ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "wound": {
  "title": "Le produit touche-t-il une peau ou une muqueuse lésée ?",
  "criterion": "",
  "sourceLabel": "Le produit touche-t-il une peau ou une muqueuse lésée ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "woundDeep": {
  "title": "Le produit vise-t-il des lésions profondes cicatrisant par seconde intention ?",
  "criterion": "Est-il principalement destiné aux lésions ayant franchi le derme / la muqueuse et cicatrisant uniquement par seconde intention ?",
  "sourceLabel": "Est-il principalement destiné aux lésions ayant franchi le derme / la muqueuse et cicatrisant uniquement par seconde intention ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "woundBarrier": {
  "title": "Son rôle se limite-t-il à une barrière mécanique, la compression ou l’absorption des exsudats ?",
  "criterion": "",
  "sourceLabel": "Son rôle se limite-t-il à une barrière mécanique, la compression ou l’absorption des exsudats ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "orificeCavity": {
  "title": "L’usage est-il limité à certaines cavités naturelles ?",
  "criterion": "Est-il utilisé uniquement dans la bouche jusqu’au pharynx, le conduit auditif jusqu’au tympan ou la cavité nasale ?",
  "sourceLabel": "Est-il utilisé uniquement dans la bouche jusqu’au pharynx, le conduit auditif jusqu’au tympan ou la cavité nasale ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "orificeAbsorb": {
  "title": "Est-il susceptible d’être absorbé par la muqueuse ?",
  "criterion": "",
  "sourceLabel": "Est-il susceptible d’être absorbé par la muqueuse ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "implant": {
  "title": "Le produit est-il destiné à rester implanté après une intervention clinique ?",
  "criterion": "",
  "sourceLabel": "Le produit est-il destiné à rester implanté après une intervention clinique ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "implantActive": {
  "title": "S’agit-il d’un implant actif ou d’un accessoire d’implant actif ?",
  "criterion": "",
  "sourceLabel": "S’agit-il d’un implant actif ou d’un accessoire d’implant actif ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "implantSpecial": {
  "title": "L’implant appartient-il à l’une de ces catégories particulières ?",
  "criterion": "Est-ce un implant mammaire, un treillis chirurgical, une prothèse articulaire totale / partielle ou un dispositif rachidien visé par la règle ?",
  "sourceLabel": "Est-ce un implant mammaire, un treillis chirurgical, une prothèse articulaire totale / partielle ou un dispositif rachidien visé par la règle ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "dental": {
  "title": "Le dispositif est-il destiné à être placé dans les dents ?",
  "criterion": "",
  "sourceLabel": "Le dispositif est-il destiné à être placé dans les dents ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "reusableSurgical": {
  "title": "Est-ce un instrument chirurgical réutilisable, sans connexion à un dispositif actif ?",
  "criterion": "",
  "sourceLabel": "Est-ce un instrument chirurgical réutilisable, sans connexion à un dispositif actif ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "duration": {
  "title": "Quelle est la durée maximale d’utilisation continue prévue ?",
  "criterion": "",
  "sourceLabel": "Quelle est la durée maximale d’utilisation continue prévue ?",
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
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "contraception": {
  "title": "Le produit a-t-il une fonction contraceptive ou de prévention des IST ?",
  "criterion": "Le produit sert-il à la contraception ou à la prévention des infections sexuellement transmissibles ?",
  "sourceLabel": "Le produit sert-il à la contraception ou à la prévention des infections sexuellement transmissibles ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "inhalation": {
  "title": "Le produit administre-t-il un médicament par inhalation ?",
  "criterion": "",
  "sourceLabel": "Le produit administre-t-il un médicament par inhalation ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "inhalationRisk": {
  "title": "L’inhalation présente-t-elle l’un de ces enjeux cliniques ?",
  "criterion": "Son fonctionnement influence-t-il essentiellement l’efficacité / la sécurité du médicament, ou traite-t-il une affection mettant la vie en danger ?",
  "sourceLabel": "Son fonctionnement influence-t-il essentiellement l’efficacité / la sécurité du médicament, ou traite-t-il une affection mettant la vie en danger ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "surgMedicine": {
  "title": "Est-il destiné à administrer un médicament ?",
  "criterion": "",
  "sourceLabel": "Est-il destiné à administrer un médicament ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "surgMedicineRisk": {
  "title": "Cette administration temporaire se fait-elle d’une manière potentiellement dangereuse ?",
  "criterion": "",
  "sourceLabel": "Cette administration temporaire se fait-elle d’une manière potentiellement dangereuse ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "ivdCompanion": {
  "title": "Le test est-il un diagnostic compagnon d’un médicament ?",
  "criterion": "",
  "sourceLabel": "Le test est-il un diagnostic compagnon d’un médicament ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdLevelsRisk": {
  "title": "Une erreur de suivi peut-elle conduire à une décision menaçant la vie ?",
  "criterion": "Une erreur de suivi d’un médicament, d’une substance ou d’un composant biologique pourrait-elle mener à une décision menaçant la vie ?",
  "sourceLabel": "Une erreur de suivi d’un médicament, d’une substance ou d’un composant biologique pourrait-elle mener à une décision menaçant la vie ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "cleaning": {
  "title": "Le produit sert-il à nettoyer, désinfecter ou stériliser des dispositifs médicaux ?",
  "criterion": "Le produit est-il spécifiquement destiné au traitement de dispositifs médicaux ?",
  "sourceLabel": "Le produit est-il spécifiquement destiné au traitement de dispositifs médicaux ?",
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
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "xrecord": {
  "title": "Le produit enregistre-t-il des images issues de rayons X ?",
  "criterion": "Le produit enregistre-t-il spécifiquement les images diagnostiques générées par rayons X ?",
  "sourceLabel": "Le produit enregistre-t-il spécifiquement les images diagnostiques générées par rayons X ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "surgIonising": {
  "title": "Le dispositif fournit-il de l’énergie sous forme de rayonnements ionisants ?",
  "criterion": "",
  "sourceLabel": "Le dispositif fournit-il de l’énergie sous forme de rayonnements ionisants ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "therapyIonising": {
  "title": "Le produit intervient-il dans une thérapie par rayonnements ionisants ?",
  "criterion": "Le produit émet-il des rayonnements ionisants à visée thérapeutique, ou commande-t-il / surveille-t-il directement un tel dispositif ?",
  "sourceLabel": "Le produit émet-il des rayonnements ionisants à visée thérapeutique, ou commande-t-il / surveille-t-il directement un tel dispositif ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "diagnosticXray": {
  "title": "Le produit intervient-il dans un diagnostic par rayonnements ionisants ?",
  "criterion": "Émet-il des rayonnements ionisants pour le diagnostic / la radiologie interventionnelle, ou commande-t-il / surveille-t-il un tel dispositif ?",
  "sourceLabel": "Émet-il des rayonnements ionisants pour le diagnostic / la radiologie interventionnelle, ou commande-t-il / surveille-t-il un tel dispositif ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "tissue": {
  "title": "Le produit contient-il des tissus ou cellules d’origine biologique ?",
  "criterion": "Le produit est-il fabriqué avec des tissus, cellules ou dérivés d’origine humaine ou animale ?",
  "sourceLabel": "Le produit est-il fabriqué avec des tissus, cellules ou dérivés d’origine humaine ou animale ?",
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
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "nanoExposure": {
  "title": "Quelle exposition interne au nanomatériau est documentée ?",
  "criterion": "Quel est le potentiel documenté d’exposition interne au nanomatériau ?",
  "sourceLabel": "Quel est le potentiel documenté d’exposition interne au nanomatériau ?",
  "options": {
   "high": "Élevé ou moyen",
   "low": "Faible",
   "negligible": "Négligeable",
   "unknown": "Évaluation de l’exposition non disponible"
  },
  "descriptions": {
   "unknown": "À sélectionner si aucune évaluation d'exposition interne n'est disponible."
  }
 },
 "substance": {
  "title": "Le produit est-il composé de substances absorbées ou dispersées dans le corps ?",
  "criterion": "Le produit est-il composé de substances appliquées sur la peau ou introduites par un orifice, puis absorbées ou dispersées dans le corps ?",
  "sourceLabel": "Le produit est-il composé de substances appliquées sur la peau ou introduites par un orifice, puis absorbées ou dispersées dans le corps ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "substanceSystemic": {
  "title": "Une absorption systémique est-elle nécessaire à l’effet prévu ?",
  "criterion": "L’absorption systémique du produit ou de ses métabolites est-elle nécessaire à l’effet prévu ?",
  "sourceLabel": "L’absorption systémique du produit ou de ses métabolites est-elle nécessaire à l’effet prévu ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "substanceGI": {
  "title": "La substance agit-elle dans le tube digestif avec absorption systémique ?",
  "criterion": "La substance agit-elle dans l’estomac / le tube digestif inférieur et est-elle, ou ses métabolites, absorbée par voie systémique ?",
  "sourceLabel": "La substance agit-elle dans l’estomac / le tube digestif inférieur et est-elle, ou ses métabolites, absorbée par voie systémique ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "substanceLocal": {
  "title": "La substance atteint-elle son effet dans une zone locale précise ?",
  "criterion": "La substance est-elle appliquée sur la peau ou dans la cavité nasale / buccale jusqu’au pharynx, et y atteint-elle son effet ?",
  "sourceLabel": "La substance est-elle appliquée sur la peau ou dans la cavité nasale / buccale jusqu’au pharynx, et y atteint-elle son effet ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "bioAbsorb": {
  "title": "A-t-il un effet biologique ou est-il absorbé en totalité ou en grande partie ?",
  "criterion": "",
  "sourceLabel": "A-t-il un effet biologique ou est-il absorbé en totalité ou en grande partie ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "chemical": {
  "title": "Subit-il une transformation chimique dans le corps, en dehors d’un placement dans les dents ?",
  "criterion": "",
  "sourceLabel": "Subit-il une transformation chimique dans le corps, en dehors d’un placement dans les dents ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "invitroSubstance": {
  "title": "La substance prépare-t-elle du matériel humain à une implantation ou administration ?",
  "criterion": "Est-ce une substance utilisée in vitro au contact direct de cellules, tissus, organes humains ou d’embryons avant leur implantation / administration ?",
  "sourceLabel": "Est-ce une substance utilisée in vitro au contact direct de cellules, tissus, organes humains ou d’embryons avant leur implantation / administration ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "channel": {
  "title": "Le produit conduit-il ou stocke-t-il des matières destinées au corps ?",
  "criterion": "Le produit conduit-il ou stocke-t-il des matières destinées à être introduites dans le corps ?",
  "sourceLabel": "Le produit conduit-il ou stocke-t-il des matières destinées à être introduites dans le corps ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "bloodBag": {
  "title": "Est-ce une poche destinée à conserver du sang ?",
  "criterion": "",
  "sourceLabel": "Est-ce une poche destinée à conserver du sang ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "channelBody": {
  "title": "Le produit conduit-il ou stocke-t-il des matières biologiques ?",
  "criterion": "Le produit conduit-il / stocke-t-il du sang ou des liquides corporels, ou stocke-t-il des organes, cellules ou tissus ?",
  "sourceLabel": "Le produit conduit-il / stocke-t-il du sang ou des liquides corporels, ou stocke-t-il des organes, cellules ou tissus ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "modify": {
  "title": "Le produit modifie-t-il des matières biologiques destinées au corps ?",
  "criterion": "Le produit modifie-t-il la composition de tissus, cellules, sang ou liquides destinés à être implantés ou administrés ?",
  "sourceLabel": "Le produit modifie-t-il la composition de tissus, cellules, sang ou liquides destinés à être implantés ou administrés ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "modifySimple": {
  "title": "Le traitement se limite-t-il à une filtration, centrifugation ou à un échange de gaz ou de chaleur ?",
  "criterion": "",
  "sourceLabel": "Le traitement se limite-t-il à une filtration, centrifugation ou à un échange de gaz ou de chaleur ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "administer": {
  "title": "Le produit actif administre-t-il ou retire-t-il une substance ?",
  "criterion": "Le dispositif actif fait-il entrer ou sortir de l’air, un liquide ou une autre substance du corps ?",
  "sourceLabel": "Le dispositif actif fait-il entrer ou sortir de l’air, un liquide ou une autre substance du corps ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "adminHazard": {
  "title": "L’administration ou le retrait peut-il être dangereux ?",
  "criterion": "L’administration / le retrait peut-il être potentiellement dangereux selon la substance, le site ou le mode ?",
  "sourceLabel": "L’administration / le retrait peut-il être potentiellement dangereux selon la substance, le site ou le mode ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "ivdDonor": {
  "title": "Le test recherche-t-il un agent transmissible pour accepter un don ?",
  "criterion": "",
  "sourceLabel": "Le test recherche-t-il un agent transmissible pour accepter un don ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdBloodAgent": {
  "title": "Le test détecte-t-il directement un agent dans le sang ou le LCR ?",
  "criterion": "Détecte-t-il directement un agent infectieux dans le sang ou le liquide céphalo-rachidien, sans fort risque de propagation ?",
  "sourceLabel": "Détecte-t-il directement un agent infectieux dans le sang ou le liquide céphalo-rachidien, sans fort risque de propagation ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "channelActive": {
  "title": "Peut-il se connecter à un dispositif actif de classe IIa, IIb ou III ?",
  "criterion": "",
  "sourceLabel": "Peut-il se connecter à un dispositif actif de classe IIa, IIb ou III ?",
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
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "heartDefect": {
  "title": "Le produit intervient-il directement sur une défaillance cardiaque ou circulatoire centrale ?",
  "criterion": "Est-il spécifiquement destiné à contrôler, diagnostiquer, surveiller ou corriger une défaillance cardiaque / circulatoire centrale par contact direct ?",
  "sourceLabel": "Est-il spécifiquement destiné à contrôler, diagnostiquer, surveiller ou corriger une défaillance cardiaque / circulatoire centrale par contact direct ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "centralContact": {
  "title": "Le produit touche-t-il directement le cœur ou le système nerveux central ?",
  "criterion": "Est-il spécifiquement utilisé en contact direct avec le cœur, la circulation centrale ou le système nerveux central ?",
  "sourceLabel": "Est-il spécifiquement utilisé en contact direct avec le cœur, la circulation centrale ou le système nerveux central ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "softwareVital": {
  "title": "Les paramètres surveillés peuvent-ils signaler un danger vital immédiat ?",
  "criterion": "Surveille-t-il des paramètres vitaux dont les variations peuvent présenter un danger immédiat pour la vie ?",
  "sourceLabel": "Surveille-t-il des paramètres vitaux dont les variations peuvent présenter un danger immédiat pour la vie ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "diagnostic": {
  "title": "Le produit réalise-t-il un diagnostic ou une surveillance physiologique ?",
  "criterion": "",
  "sourceLabel": "Le produit réalise-t-il un diagnostic ou une surveillance physiologique ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "diagnosticEnergy": {
  "title": "Fournit-il une énergie absorbée par le corps, hors simple éclairage visible ?",
  "criterion": "",
  "sourceLabel": "Fournit-il une énergie absorbée par le corps, hors simple éclairage visible ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "radiopharm": {
  "title": "Représente-t-il la distribution de produits radiopharmaceutiques dans le corps ?",
  "criterion": "",
  "sourceLabel": "Représente-t-il la distribution de produits radiopharmaceutiques dans le corps ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "diagnosticUse": {
  "title": "Le diagnostic ou la surveillance présente-t-il un danger vital immédiat ?",
  "criterion": "Dans quel contexte le diagnostic ou la surveillance est-il utilisé ?",
  "sourceLabel": "Dans quel contexte le diagnostic ou la surveillance est-il utilisé ?",
  "options": {
   "routine": "Diagnostic ou surveillance sans danger vital immédiat identifié",
   "critical": "Surveillance ou diagnostic avec danger immédiat pour le patient",
   "other": "Autre fonction, hors diagnostic ou surveillance physiologique",
   "unclear": "Usage clinique ou niveau de risque encore indéterminé"
  },
  "descriptions": {
   "routine": "Selon l'usage prévu, même avec un ECG ou un EEG.",
   "critical": "Les variations surveillées peuvent mettre immédiatement le patient en danger."
  }
 },
 "softwareMonitor": {
  "title": "Le logiciel surveille-t-il des processus physiologiques ?",
  "criterion": "",
  "sourceLabel": "Le logiciel surveille-t-il des processus physiologiques ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "ivdInstrumentIndependent": {
  "title": "L’instrument réalise-t-il une mesure sans réactif supplémentaire ?",
  "criterion": "L’instrument réalise-t-il une mesure indépendante sans réactif supplémentaire ?",
  "sourceLabel": "L’instrument réalise-t-il une mesure indépendante sans réactif supplémentaire ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "closedLoop": {
  "title": "Le dispositif adapte-t-il automatiquement un traitement à partir de mesures sur le patient ?",
  "criterion": "",
  "sourceLabel": "Le dispositif adapte-t-il automatiquement un traitement à partir de mesures sur le patient ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "closedLoopDiagnostic": {
  "title": "Une fonction diagnostique détermine-t-elle le traitement automatique ?",
  "criterion": "Une fonction diagnostique patient détermine-t-elle le traitement automatique ?",
  "sourceLabel": "Une fonction diagnostique patient détermine-t-elle le traitement automatique ?",
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
  "options": {
   "independent": "Il a une fonction médicale propre",
   "drives": "Il commande ou influence seulement l’utilisation du dispositif physique",
   "both": "Il commande le dispositif et possède aussi une fonction médicale propre"
  },
  "descriptions": {
   "independent": "Le logiciel contribue lui-même à une finalité médicale.",
   "drives": "Il pilote le dispositif physique sans finalité médicale propre indépendante.",
   "both": "Il pilote le dispositif et fournit aussi une fonction médicale propre."
  }
 },
 "softwareDecision": {
  "title": "Fournit-il des informations utilisées pour une décision diagnostique ou thérapeutique ?",
  "criterion": "",
  "sourceLabel": "Fournit-il des informations utilisées pour une décision diagnostique ou thérapeutique ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "softwareImpact": {
  "title": "Quelle serait la conséquence la plus grave d’une décision erronée ?",
  "criterion": "Quelle est la conséquence la plus grave qu’une décision erronée pourrait entraîner ?",
  "sourceLabel": "Quelle est la conséquence la plus grave qu’une décision erronée pourrait entraîner ?",
  "options": {
   "death": "Décès ou détérioration irréversible de la santé",
   "serious": "Détérioration grave ou intervention chirurgicale",
   "other": "Autres conséquences, sans gravité des deux catégories précédentes"
  }
 },
 "ivdSoftwareRole": {
  "title": "Quel est le rôle du logiciel IVD ?",
  "criterion": "",
  "sourceLabel": "Quel est le rôle du logiciel IVD ?",
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
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdRole": {
  "title": "Quel élément souhaitez-vous classer ?",
  "criterion": "Quel élément classez-vous séparément ?",
  "sourceLabel": "Quel élément classez-vous séparément ?",
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
  "title": "Est-ce un produit général destiné aux analyses de laboratoire IVD ?",
  "criterion": "Le produit correspond-il à un produit général IVD de la règle 5a ?",
  "sourceLabel": "Le produit correspond-il à un produit général IVD de la règle 5a ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdAdditional": {
  "title": "Le produit possède-t-il une autre fonction ou destination à classer ?",
  "criterion": "Le produit possède-t-il aussi une fonction d’analyse ou une autre destination à classer ?",
  "sourceLabel": "Le produit possède-t-il aussi une fonction d’analyse ou une autre destination à classer ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdLinkedClass": {
  "title": "Quelle est la classe documentée la plus élevée des DIV associés ?",
  "criterion": "",
  "sourceLabel": "Quelle est la classe documentée la plus élevée des DIV associés ?",
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
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdStaging": {
  "title": "Une erreur de stadification peut-elle menacer la vie ?",
  "criterion": "Une erreur de détermination du stade d’une maladie pourrait-elle mener à une décision menaçant la vie ?",
  "sourceLabel": "Une erreur de détermination du stade d’une maladie pourrait-elle mener à une décision menaçant la vie ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdPropagation": {
  "title": "L’agent détecté présente-t-il un risque élevé de propagation ?",
  "criterion": "Le test détecte-t-il un agent causant une maladie mortelle à fort risque de propagation ?",
  "sourceLabel": "Le test détecte-t-il un agent causant une maladie mortelle à fort risque de propagation ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdInfection": {
  "title": "La destination couvre-t-elle la détection d’une infection ou d’un état immunitaire infectieux ?",
  "criterion": "",
  "sourceLabel": "La destination couvre-t-elle la détection d’une infection ou d’un état immunitaire infectieux ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdSexual": {
  "title": "Le test recherche-t-il un agent principalement sexuellement transmissible, ou l’exposition à cet agent ?",
  "criterion": "",
  "sourceLabel": "Le test recherche-t-il un agent principalement sexuellement transmissible, ou l’exposition à cet agent ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdInfectionHarm": {
  "title": "Une erreur de détection risque-t-elle un décès ou un handicap grave ?",
  "criterion": "Un résultat erroné de détection d’agent risque-t-il d’entraîner décès ou handicap grave ?",
  "sourceLabel": "Un résultat erroné de détection d’agent risque-t-il d’entraîner décès ou handicap grave ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdPrenatalImmune": {
  "title": "Le test dépiste-t-il un statut immunitaire pendant la grossesse ?",
  "criterion": "Le test dépiste-t-il le statut immunitaire d’une femme enceinte envers un agent transmissible ?",
  "sourceLabel": "Le test dépiste-t-il le statut immunitaire d’une femme enceinte envers un agent transmissible ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdImmuneRisk": {
  "title": "Une erreur de statut peut-elle conduire à une décision menaçant la vie ?",
  "criterion": "Une erreur de statut infectieux ou immunitaire pourrait-elle mener à une décision menaçant la vie ?",
  "sourceLabel": "Une erreur de statut infectieux ou immunitaire pourrait-elle mener à une décision menaçant la vie ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdCompatibility": {
  "title": "Le test détermine-t-il une compatibilité immunologique ?",
  "criterion": "Le test détermine-t-il une compatibilité immunologique ou une incompatibilité fœto-maternelle ?",
  "sourceLabel": "Le test détermine-t-il une compatibilité immunologique ou une incompatibilité fœto-maternelle ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdMarkers": {
  "title": "Le test recherche-t-il un marqueur de groupe sanguin de la liste de classe D ?",
  "criterion": "",
  "sourceLabel": "Le test couvre-t-il un des marqueurs de groupe explicitement classés D ?",
  "options": {
   "other": "Non, uniquement d’autres marqueurs de compatibilité",
   "listed": "Oui, un marqueur explicitement listé par la règle 2",
   "unknown": "La liste des marqueurs n’est pas établie"
  },
  "descriptions": {
   "listed": "ABO ; Rh D/C/c/E/e et RHW1 ; Kell K ; Kidd Jka/Jkb ; Duffy Fya/Fyb.",
   "other": "Autres marqueurs de compatibilité uniquement."
  }
 },
 "ivdLifeManagement": {
  "title": "Le test aide-t-il à prendre en charge une situation menaçant la vie ?",
  "criterion": "Le test sert-il à la prise en charge d’une maladie ou d’un état menaçant la vie ?",
  "sourceLabel": "Le test sert-il à la prise en charge d’une maladie ou d’un état menaçant la vie ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdCancer": {
  "title": "Le test est-il destiné au dépistage, au diagnostic ou à la stadification d’un cancer ?",
  "criterion": "",
  "sourceLabel": "Le test est-il destiné au dépistage, au diagnostic ou à la stadification d’un cancer ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdGenetic": {
  "title": "Le test est-il destiné à un examen génétique humain ?",
  "criterion": "",
  "sourceLabel": "Le test est-il destiné à un examen génétique humain ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdCongenital": {
  "title": "Le test dépiste-t-il une anomalie congénitale de l’embryon ou du fœtus ?",
  "criterion": "",
  "sourceLabel": "Le test dépiste-t-il une anomalie congénitale de l’embryon ou du fœtus ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdNewborn": {
  "title": "Le dépistage du nouveau-né prévient-il une conséquence grave ?",
  "criterion": "Le test dépiste-t-il chez le nouveau-né une anomalie dont l’absence de traitement risque décès ou handicap grave ?",
  "sourceLabel": "Le test dépiste-t-il chez le nouveau-né une anomalie dont l’absence de traitement risque décès ou handicap grave ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdSelf": {
  "title": "Une personne non professionnelle réalise-t-elle une étape de l'analyse ?",
  "criterion": "Une personne non professionnelle réalise-t-elle au moins une étape du test lui-même ?",
  "sourceLabel": "Une personne non professionnelle réalise-t-elle au moins une étape du test lui-même ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdSelfException": {
  "title": "Quelle analyse est réalisée par cet autotest ?",
  "criterion": "L’autotest est-il limité à l’une des exceptions de classe B ?",
  "sourceLabel": "L’autotest est-il limité à l’une des exceptions de classe B ?",
  "options": {
   "pregnancy": "Détection de grossesse uniquement",
   "fertility": "Test de fertilité uniquement",
   "cholesterol": "Mesure du cholestérol uniquement",
   "urine": "Uniquement glucose, érythrocytes, leucocytes ou bactéries dans les urines",
   "other": "Autre test ou panel comportant d’autres marqueurs"
  },
  "descriptions": {
   "other": "Autre marqueur ou panel plus large que les exceptions listées."
  }
 },
 "ivdNear": {
  "title": "Le test est-il effectué près du patient par un professionnel ?",
  "criterion": "",
  "sourceLabel": "Le test est-il réalisé par un professionnel près du patient, hors laboratoire ?",
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
 "nanoExposure": "Les niveaux doivent provenir d'une évaluation documentée de l'exposition interne. Ne déduisez pas le niveau de la seule présence de nanoparticules.",
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
 "energyHazard": "Évaluez la nature de l'énergie, sa densité, son mode d'administration et le site traité. Une réponse « Non » doit être justifiable au regard de l'usage prévu.",
 "therapyIonising": "Émission thérapeutique de rayonnements ionisants, ou commande ou surveillance directe d’un tel dispositif.",
 "controlTherapy": "Commande, surveillance ou influence directe sur un autre dispositif thérapeutique actif.",
 "diagnosticUse": "La destination clinique prime sur le nom de la technologie : un ECG ou un EEG peut être courant ou critique selon les paramètres surveillés et les décisions associées.",
 "diagnosticXray": "Émission de rayonnements ionisants pour le diagnostic ou la radiologie interventionnelle, ou commande ou surveillance d’un tel dispositif.",
 "administer": "Un dispositif actif fait entrer ou sortir de l’air, un liquide ou une autre substance du corps.",
 "adminHazard": "Tenez compte de la substance, du site et du mode d’administration ou de retrait.",
 "closedLoopDiagnostic": "Distinguez une fonction diagnostique sur le patient d’une simple régulation technique.",
 "softwareRole": "Distinguez la fonction médicale propre du logiciel du pilotage d’un dispositif physique.",
 "softwareImpact": "Évaluez la conséquence la plus grave d'une décision diagnostique ou thérapeutique erronée. Les catégories supérieures concernent le décès, l'atteinte irréversible, une détérioration grave ou une intervention chirurgicale.",
 "softwareVital": "Surveillance de paramètres vitaux dont les variations peuvent présenter un danger immédiat pour la vie.",
 "multiPurpose": "Un seul dispositif, tous ses usages et variantes, en retenant les situations les plus contraignantes.",
 "ivdQualification": "Examen médical in vitro humain, récipient de prélèvement ou accessoire dédié à un DIV, selon la destination du fabricant.",
 "ivdRole": "Classez chaque élément selon sa propre destination, sans confondre un kit complet avec un composant.",
 "ivdInstrumentIndependent": "Une mesure indépendante, réalisée sans nécessiter de réactif supplémentaire.",
 "ivdGeneral": "Vérifiez la règle 5a : produits généraux de laboratoire, tampons, solutions de lavage, milieux généraux et colorants histologiques dont le fabricant prévoit un usage IVD spécifique. Ne classez pas automatiquement un réactif analytique comme produit général.",
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
 "ivdSelf": "Visez les étapes du test lui-même (par exemple ajouter un réactif ou appliquer le prélèvement sur une cassette). Le seul prélèvement ou sa conservation ne fait pas, à lui seul, un autotest.",
 "ivdSelfException": "Les exceptions de classe B concernent uniquement les destinations précisément énumérées à la règle 4 : grossesse, fertilité, cholestérol, ou glucose, érythrocytes, leucocytes et bactéries dans les urines. Un panel plus large est à examiner selon les autres règles applicables.",
 "ivdAllUses": "L’ensemble des destinations du produit et sa configuration complète ont été examinés.",
 "contact": "Distinguez contact externe, pénétration par un orifice corporel et pénétration invasive chirurgicale selon les définitions MDR (annexe VIII).",
 "ivdNear": "Test hors laboratoire, généralement auprès du patient, réalisé par un professionnel de santé et non destiné à l'autotest. Le lieu de réalisation ne détermine pas seul la classe.",
 "ivdMarkers": "Vérifiez la liste de la règle 2 de l'annexe VIII IVDR et la destination du test. Tous les marqueurs du système Rhésus ne sont pas nécessairement équivalents.",
 "ivdLinkedClass": "Si le produit est associé à plusieurs DIV, retenez la classe la plus élevée effectivement documentée parmi eux, et « classe non documentée » en cas d'incertitude."
};
const icons={
 medical:'<rect x="3" y="3" width="26" height="26" rx="5" fill="currentColor"/><path d="M13 8h6v5h5v6h-5v5h-6v-5H8v-6h5z" fill="#e7a116"/>',

 product:'<path d="M12 5a4 4 0 0 1 8 0v14a7 7 0 1 1-8 0z" fill="currentColor"/><path d="M16 8v15" stroke="#e7a116" stroke-width="3"/><circle cx="16" cy="24" r="3" fill="#e7a116"/><path d="M20 9h3m-3 4h3" stroke="currentColor" stroke-width="1.5"/>',
 link:'<path d="M8 13v9a7 7 0 0 0 14 0v-9" stroke="currentColor" stroke-width="3" fill="none"/><rect x="4" y="6" width="8" height="11" rx="2" fill="currentColor"/><rect x="19" y="6" width="6" height="11" rx="2" fill="currentColor"/><path d="M6 2h4v5H6zm14 0h4v5h-4z" fill="#e7a116"/>',
 software:'<rect x="2" y="3" width="28" height="21" rx="3" fill="currentColor"/><rect x="5" y="6" width="22" height="15" rx="1" fill="white"/><path d="M5 10h22" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r=".7" fill="#e7a116"/><path d="M8 16h4l2-3 3 6 2-3h5" stroke="#e7a116" stroke-width="1.6" fill="none"/><path d="M13 25v3h-4m10-3v3h4M9 28h14" stroke="currentColor" stroke-width="2" fill="none"/>',
 tube:'<path d="M10 9h12v15a6 6 0 0 1-12 0z" fill="currentColor"/><rect x="8" y="2" width="16" height="7" rx="2" fill="#e7a116"/><path d="M12 14h4m-4 4h4" stroke="white" stroke-width="1.5"/><path d="M12 24v-1l8-4v5a4 4 0 0 1-8 0" fill="#e7a116"/>',

};
Object.assign(questions.ivdRole.options,{test:'Réactif, test ou kit',instrument:'Instrument d’analyse seul',software:'Logiciel IVD',receptacle:'Récipient sans test intégré',lab:'Produit général pour usage IVD',accessory:'Accessoire de DIV',calibrator:'Calibrateur',assignedControl:'Contrôle à valeur assignée',unassignedControl:'Contrôle sans valeur assignée'});
function view(q){const p=questions[q.id];if(!p)return {title:q.label,criterion:q.intro||'',options:q.options,descriptions:q.optionHelp||{}};
 return {title:p.title,criterion:hints[q.id]||p.criterion||q.intro||'',options:q.options.map(([value,label])=>[value,p.options[value]||label]),descriptions:{...q.optionHelp,...p.descriptions}};}
let promptWidth=0,promptHeight=0;
function reservePrompt(app){
 // Sur téléphone et tablette, la hauteur est déjà gérée par le CSS responsive.
 // Éviter de créer et mesurer 96 titres invisibles à chaque changement de largeur.
 if(typeof window!=='undefined'&&window.matchMedia&&window.matchMedia('(max-width: 899px)').matches){
  app.style.removeProperty('--question-prompt-height');
  return;
 }
 const prompt=app.querySelector('.question-prompt');if(!prompt)return;
 const width=Math.round(prompt.getBoundingClientRect().width);if(!width)return;
 if(width!==promptWidth){
  const measure=document.createElement('div');measure.className='question-card prompt-measure';
  measure.setAttribute('aria-hidden','true');measure.inert=true;
  Object.assign(measure.style,{position:'absolute',visibility:'hidden',pointerEvents:'none',width:width+'px',padding:'0',left:'0',top:'0'});
  for(const [id,p] of Object.entries(questions)){
   const item=document.createElement('div');item.className='question-prompt';
   const heading=document.createElement('div');heading.className='question-heading';
   const title=document.createElement('h1');title.textContent=p.title.replace(/\s+\?$/,'\u00a0?');
   const info=document.createElement('details');info.className='info-bubble';
   const summary=document.createElement('summary');summary.textContent='i';info.append(summary);heading.append(title,info);item.append(heading);
   const text=hints[id]||p.criterion;
   if(text){const note=document.createElement('p');note.className='question-intro';note.textContent=text;item.append(note);}
   measure.append(item);
  }
  app.append(measure);
  promptHeight=Math.ceil(Math.max(...Array.from(measure.children,item=>item.getBoundingClientRect().height)));
  promptWidth=width;measure.remove();
 }
 app.style.setProperty('--question-prompt-height',promptHeight+'px');
}
if(typeof window!=='undefined'){
 window.addEventListener('resize',()=>{const app=document.getElementById('tool-app');if(app)reservePrompt(app);});
 document.fonts?.ready.then(()=>{promptWidth=0;const app=document.getElementById('tool-app');if(app)reservePrompt(app);});
}
const roleGroups={
 analysis:{label:'Test, instrument ou logiciel',description:'Réactif, kit, automate d’analyse ou logiciel IVD.',values:['test','instrument','software']},
 support:{label:'Récipient, produit général ou accessoire',description:'Tube de prélèvement, tampon, produit de lavage ou accessoire dédié.',values:['receptacle','lab','accessory']},
 reference:{label:'Calibrateur ou contrôle',description:'Produit servant à étalonner l’analyse ou à vérifier ses résultats.',values:['calibrator','assignedControl','unassignedControl']}
};

/* Pictogramme placé dans le titre de chaque question, jamais dans les réponses.
   Les thèmes génériques réutilisent exactement le pack SVG de Connectivité. */
const medicalQuestionIcons={
 heart:'<path d="M16 29C8 23 3 18 3 11a7 7 0 0 1 13-3 7 7 0 0 1 13 3c0 7-5 12-13 18z" fill="currentColor"/><path d="M6 16h5l2-4 4 9 3-5h6" fill="none" stroke="#e7a116" stroke-width="2.5"/>',
 wound:'<rect x="4" y="6" width="24" height="20" rx="7" transform="rotate(-22 16 16)" fill="currentColor"/><path d="M10 12l12 8M12 8l12 8M8 16l12 8" stroke="#e7a116" stroke-width="2.5"/>',
 implant:'<path d="M10 3h12v6l-3 3v14l-3 4-3-4V12l-3-3z" fill="currentColor"/><path d="M10 9h12M14 16h4M14 21h4" stroke="#e7a116" stroke-width="2"/>',
 tooth:'<path d="M9 4c-6 0-7 6-5 12l5 13c2 2 4-7 7-7s5 9 7 7l5-13c2-6 1-12-5-12-3 0-4 2-7 2S12 4 9 4z" fill="currentColor"/><path d="M11 10h10" stroke="#e7a116" stroke-width="2.5"/>',
 pill:'<rect x="4" y="4" width="24" height="24" rx="12" fill="currentColor"/><path d="M8 24 24 8" stroke="#e7a116" stroke-width="3"/><path d="M12 12l8 8" stroke="white" stroke-width="1.5"/>',
 lungs:'<path d="M14 3v11C11 8 7 9 5 15l-3 11c0 5 10 5 12-2zM18 3v11c3-6 7-5 9 1l3 11c0 5-10 5-12-2z" fill="currentColor"/><path d="M16 2v15M8 17l5 3m11-3-5 3" stroke="#e7a116" stroke-width="2" fill="none"/>',
 radiation:'<circle cx="16" cy="16" r="14" fill="currentColor"/><circle cx="16" cy="16" r="3" fill="#e7a116"/><path d="M14 11 9 4M20 15l9 2M14 20l-3 9" stroke="#e7a116" stroke-width="5"/>',
 dna:'<path d="M10 2c14 8-2 19 12 28M22 2C8 10 24 21 10 30" fill="none" stroke="currentColor" stroke-width="4"/><path d="M12 6h8M12 12h8M12 19h8M12 26h8" stroke="#e7a116" stroke-width="2.5"/>',
 blood:'<path d="M16 2C10 11 5 17 5 22a11 11 0 0 0 22 0c0-5-5-11-11-20z" fill="currentColor"/><path d="M11 23c0 4 4 5 7 4" fill="none" stroke="#e7a116" stroke-width="3"/>',
 baby:'<circle cx="16" cy="10" r="7" fill="currentColor"/><path d="M4 30c0-9 4-13 12-13s12 4 12 13" fill="currentColor"/><path d="M12 10h8M11 24l5 3 5-3" stroke="#e7a116" stroke-width="2" fill="none"/>',
 cells:'<circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="23" cy="22" r="8" fill="currentColor"/><circle cx="12" cy="12" r="3" fill="#e7a116"/><circle cx="23" cy="22" r="2.5" fill="#e7a116"/>',
 surgery:'<path d="M5 3h6v15l5 4 5-4V3h6v17l-11 10L5 20z" fill="currentColor"/><path d="M16 11v13M10 16h12" stroke="#e7a116" stroke-width="2.5"/>',
 needle:'<path d="m6 25 18-18 3 3L9 28z" fill="currentColor"/><path d="m21 5 6 6M5 22l5 5" stroke="#e7a116" stroke-width="2.5"/><path d="m5 27-3 3" stroke="currentColor" stroke-width="2"/>',
 skin:'<path d="M3 8c7-6 12 6 19 0 3-2 5-2 7-1v19H3z" fill="currentColor"/><path d="M3 16c7-6 12 6 19 0 3-2 5-2 7-1" stroke="#e7a116" stroke-width="2.5" fill="none"/>',
 microbe:'<circle cx="16" cy="16" r="10" fill="currentColor"/><path d="M16 1v5m0 20v5M1 16h5m20 0h5M5 5l4 4m14 14 4 4M27 5l-4 4M9 23l-4 4" stroke="currentColor" stroke-width="2.5"/><circle cx="12" cy="12" r="2" fill="#e7a116"/><circle cx="20" cy="18" r="3" fill="#e7a116"/>',
 medical:'<rect x="3" y="3" width="26" height="26" rx="5" fill="currentColor"/><path d="M13 8h6v5h5v6h-5v5h-6v-5H8v-6h5z" fill="#e7a116"/>'
};
const questionIconTypes={
 scope:'medical',form:'product',multiPurpose:'box',ivdAllUses:'box',
 active:'battery',therapyEnergy:'battery',energyHazard:'shield',contact:'skin',
 animalIntact:'skin',nanoContact:'cells',wound:'wound',woundDeep:'wound',woundBarrier:'wound',
 orificeCavity:'lungs',orificeAbsorb:'blood',implant:'implant',implantActive:'implant',
 implantSpecial:'implant',dental:'tooth',reusableSurgical:'surgery',duration:'clock',
 medicinal:'pill',contraception:'shield',inhalation:'lungs',inhalationRisk:'lungs',
 surgMedicine:'needle',surgMedicineRisk:'shield',ivdCompanion:'pill',ivdLevelsRisk:'blood',
 cleaning:'shield',ivdSterile:'shield',xrecord:'radiation',surgIonising:'radiation',
 therapyIonising:'radiation',diagnosticXray:'radiation',tissue:'cells',nano:'cells',
 nanoExposure:'cells',substance:'pill',substanceSystemic:'blood',substanceGI:'pill',
 substanceLocal:'pill',bioAbsorb:'cells',chemical:'cells',invitroSubstance:'tube',
 channel:'network',bloodBag:'blood',channelBody:'blood',modify:'cells',modifySimple:'cells',
 administer:'needle',adminHazard:'shield',ivdDonor:'blood',ivdBloodAgent:'microbe',
 channelActive:'network',orificeActive:'link',controlTherapy:'network',
 ivdAccessoryCritical:'shield',heartDefect:'heart',centralContact:'heart',
 softwareVital:'heart',diagnostic:'sensor',diagnosticEnergy:'battery',
 radiopharm:'radiation',diagnosticUse:'medical',softwareMonitor:'software',
 ivdInstrumentIndependent:'sensor',closedLoop:'network',closedLoopDiagnostic:'network',
 softwareRole:'software',softwareDecision:'software',softwareImpact:'shield',
 ivdSoftwareRole:'software',ivdQualification:'tube',ivdRole:'tube',
 ivdGeneral:'tube',ivdAdditional:'medical',ivdLinkedClass:'network',
 ivdLoad:'microbe',ivdStaging:'medical',ivdPropagation:'microbe',
 ivdInfection:'microbe',ivdSexual:'microbe',ivdInfectionHarm:'microbe',
 ivdPrenatalImmune:'baby',ivdImmuneRisk:'shield',ivdCompatibility:'blood',
 ivdMarkers:'blood',ivdLifeManagement:'heart',ivdCancer:'cells',ivdGenetic:'dna',
 ivdCongenital:'baby',ivdNewborn:'baby',ivdSelf:'medical',
 ivdSelfException:'medical',ivdNear:'medical'
};
/* PNG raster prévus dans icones-raster/. Une image non encore publiée ne doit
 * jamais empêcher l'affichage du pictogramme vectoriel existant. */
if(typeof document!=='undefined')document.addEventListener('error',function(event){
 const img=event.target;
 if(!img || !img.classList || !img.classList.contains('mdr-raster-icon'))return;
 img.hidden=true;
 const fallback=img.nextElementSibling;
 if(fallback)fallback.hidden=false;
},true);
/* Correspondance : ordre des 96 clés de questions ↔ numéros PNG de la planche. */
/* Correspondance explicite, indépendante de l'ordre des questions dans l'objet. */
const iconByQuestion=Object.freeze({
 "scope":1,
 "form":56,
 "multiPurpose":58,
 "ivdAllUses":65,
 "active":28,
 "therapyEnergy":30,
 "energyHazard":36,
 "contact":38,
 "animalIntact":48,
 "nanoContact":49,
 "wound":9,
 "woundDeep":18,
 "woundBarrier":9,
 "orificeCavity":8,
 "orificeAbsorb":40,
 "implant":7,
 "implantActive":23,
 "implantSpecial":42,
 "dental":7,
 "reusableSurgical":45,
 "duration":95,
 "medicinal":2,
 "contraception":13,
 "inhalation":39,
 "inhalationRisk":39,
 "surgMedicine":6,
 "surgMedicineRisk":36,
 "ivdCompanion":34,
 "ivdLevelsRisk":5,
 "cleaning":55,
 "ivdSterile":54,
 "xrecord":5,
 "surgIonising":29,
 "therapyIonising":29,
 "diagnosticXray":29,
 "tissue":21,
 "nano":50,
 "nanoExposure":49,
 "substance":19,
 "substanceSystemic":41,
 "substanceGI":46,
 "substanceLocal":40,
 "bioAbsorb":38,
 "chemical":50,
 "invitroSubstance":34,
 "channel":27,
 "bloodBag":6,
 "channelBody":41,
 "modify":25,
 "modifySimple":20,
 "administer":2,
 "adminHazard":36,
 "ivdDonor":6,
 "ivdBloodAgent":47,
 "channelActive":27,
 "orificeActive":27,
 "controlTherapy":26,
 "ivdAccessoryCritical":36,
 "heartDefect":44,
 "centralContact":43,
 "softwareVital":5,
 "diagnostic":5,
 "diagnosticEnergy":30,
 "radiopharm":29,
 "diagnosticUse":17,
 "softwareMonitor":83,
 "ivdInstrumentIndependent":3,
 "closedLoop":86,
 "closedLoopDiagnostic":80,
 "softwareRole":24,
 "softwareDecision":66,
 "softwareImpact":85,
 "ivdSoftwareRole":24,
 "ivdQualification":34,
 "ivdRole":20,
 "ivdGeneral":19,
 "ivdAdditional":56,
 "ivdLinkedClass":70,
 "ivdLoad":47,
 "ivdStaging":66,
 "ivdPropagation":33,
 "ivdInfection":47,
 "ivdSexual":47,
 "ivdInfectionHarm":35,
 "ivdPrenatalImmune":11,
 "ivdImmuneRisk":36,
 "ivdCompatibility":41,
 "ivdMarkers":41,
 "ivdLifeManagement":5,
 "ivdCancer":21,
 "ivdGenetic":22,
 "ivdCongenital":11,
 "ivdNewborn":12,
 "ivdSelf":71,
 "ivdSelfException":67,
 "ivdNear":15
});
function questionIcon(q){
 const type=questionIconTypes[q.id]||'medical';
 const svg=medicalQuestionIcons[type]||icons[type];
 const n=iconByQuestion[q.id];
 const original=svg
  ?'<span class="mdr-question-icon mdr-svg-fallback" '+(n?'hidden ':'')+'aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false" stroke-linecap="round" stroke-linejoin="round">'+svg+'</svg></span>'
  :'<img class="mdr-question-icon mdr-svg-fallback" '+(n?'hidden ':'')+'src="../connectivite/icones/'+type+'.svg?v=2" alt="">';
 const raster=n?'<img class="mdr-question-icon mdr-raster-icon" loading="eager" alt="" src="icones-raster/icones/icon-'+String(n).padStart(2,'0')+'.png?v=2">':'';
 return '<span class="mdr-question-art" aria-hidden="true">'+raster+original+'</span>';
}

const api={questions,view,questionIcon,reservePrompt,roleGroups};
if(typeof module==='object'&&module.exports)module.exports=api;else window.ORBIVIA_QUESTION_PRESENTATION=api;
})();
