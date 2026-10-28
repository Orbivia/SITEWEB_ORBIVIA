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
   "combined": "Un produit physique avec une fonction logicielle médicale"
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
  "title": "Le produit utilise-t-il une énergie autre que celle du corps ou de la gravité ?",
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
  "title": "Cette énergie peut-elle être administrée d’une manière potentiellement dangereuse compte tenu de sa nature, densité et site ?",
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
  "title": "Le produit vise-t-il principalement des lésions ayant franchi le derme ou la muqueuse et cicatrisant uniquement par seconde intention ?",
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
  "title": "L’usage se limite-t-il à la bouche jusqu’au pharynx, au conduit auditif jusqu’au tympan ou au nez ?",
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
  "title": "Est-ce un implant mammaire, un treillis chirurgical, une prothèse articulaire ou un dispositif rachidien visé par la règle 8 ?",
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
  "title": "Le fonctionnement détermine-t-il l’efficacité ou la sécurité du médicament inhalé, ou vise-t-il une affection mettant la vie en danger ?",
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
  "title": "Une erreur de suivi d’un médicament, d’une substance ou d’un composant biologique pourrait-elle mener à une décision menaçant la vie ?",
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
  "title": "Le produit capte-t-il les images diagnostiques de rayons X, au-delà de leur simple archivage ?",
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
  "title": "Le produit émet-il des rayonnements ionisants à visée thérapeutique, ou commande-t-il / surveille-t-il directement un tel dispositif ?",
  "criterion": "Le produit émet-il des rayonnements ionisants à visée thérapeutique, ou commande-t-il / surveille-t-il directement un tel dispositif ?",
  "sourceLabel": "Le produit émet-il des rayonnements ionisants à visée thérapeutique, ou commande-t-il / surveille-t-il directement un tel dispositif ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "diagnosticXray": {
  "title": "Émet-il des rayonnements ionisants pour le diagnostic / la radiologie interventionnelle, ou commande-t-il / surveille-t-il un tel dispositif ?",
  "criterion": "Émet-il des rayonnements ionisants pour le diagnostic / la radiologie interventionnelle, ou commande-t-il / surveille-t-il un tel dispositif ?",
  "sourceLabel": "Émet-il des rayonnements ionisants pour le diagnostic / la radiologie interventionnelle, ou commande-t-il / surveille-t-il un tel dispositif ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "tissue": {
  "title": "Le produit contient-il des tissus, cellules ou dérivés d’origine humaine ou animale ?",
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
  "title": "Le produit est-il composé de substances appliquées sur la peau ou introduites par un orifice, puis absorbées ou dispersées dans le corps ?",
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
  "title": "La substance agit-elle dans l’estomac / le tube digestif inférieur et est-elle, ou ses métabolites, absorbée par voie systémique ?",
  "criterion": "La substance agit-elle dans l’estomac / le tube digestif inférieur et est-elle, ou ses métabolites, absorbée par voie systémique ?",
  "sourceLabel": "La substance agit-elle dans l’estomac / le tube digestif inférieur et est-elle, ou ses métabolites, absorbée par voie systémique ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "substanceLocal": {
  "title": "La substance atteint-elle son effet sur la peau, dans le nez ou dans la bouche jusqu’au pharynx ?",
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
  "title": "Est-ce une substance utilisée in vitro au contact direct de cellules, tissus, organes humains ou d’embryons avant leur implantation / administration ?",
  "criterion": "Est-ce une substance utilisée in vitro au contact direct de cellules, tissus, organes humains ou d’embryons avant leur implantation / administration ?",
  "sourceLabel": "Est-ce une substance utilisée in vitro au contact direct de cellules, tissus, organes humains ou d’embryons avant leur implantation / administration ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "channel": {
  "title": "Le produit conduit-il ou stocke-t-il des matières destinées à être introduites dans le corps ?",
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
  "title": "Le produit conduit-il / stocke-t-il du sang ou des liquides corporels, ou stocke-t-il des organes, cellules ou tissus ?",
  "criterion": "Le produit conduit-il / stocke-t-il du sang ou des liquides corporels, ou stocke-t-il des organes, cellules ou tissus ?",
  "sourceLabel": "Le produit conduit-il / stocke-t-il du sang ou des liquides corporels, ou stocke-t-il des organes, cellules ou tissus ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "modify": {
  "title": "Le produit modifie-t-il la composition de tissus, cellules, sang ou liquides destinés à être implantés ou administrés ?",
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
  "title": "Détecte-t-il directement un agent infectieux dans le sang ou le liquide céphalo-rachidien, sans fort risque de propagation ?",
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
  "title": "Le produit commande-t-il, surveille-t-il ou influence-t-il directement un autre dispositif thérapeutique actif ?",
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
  "title": "Le produit est-il destiné au contact direct avec le cœur, la circulation centrale ou le système nerveux central ?",
  "criterion": "Est-il spécifiquement utilisé en contact direct avec le cœur, la circulation centrale ou le système nerveux central ?",
  "sourceLabel": "Est-il spécifiquement utilisé en contact direct avec le cœur, la circulation centrale ou le système nerveux central ?",
  "options": {
   "yes": "Oui",
   "no": "Non"
  }
 },
 "softwareVital": {
  "title": "Les variations des paramètres vitaux surveillés peuvent-elles mettre immédiatement la vie en danger ?",
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
  "title": "Quel est l’usage clinique du diagnostic ou de la surveillance ?",
  "criterion": "Dans quel contexte le diagnostic ou la surveillance est-il utilisé ?",
  "sourceLabel": "Dans quel contexte le diagnostic ou la surveillance est-il utilisé ?",
  "options": {
   "routine": "Diagnostic direct ou mesure d’un processus vital, sans danger vital immédiat identifié",
   "critical": "Surveillance ou diagnostic avec danger immédiat pour le patient",
   "other": "Autre fonction, hors diagnostic direct et mesure d’un processus vital",
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
  "title": "Le fabricant prévoit-il un diagnostic in vitro humain, un récipient de prélèvement ou un accessoire dédié ?",
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
  "title": "Le test mesure-t-il une charge infectieuse dont le suivi est critique pour une maladie mortelle ?",
  "criterion": "Le test mesure-t-il une charge infectieuse dont le suivi est critique pour une maladie mortelle ?",
  "sourceLabel": "Le test mesure-t-il une charge infectieuse dont le suivi est critique pour une maladie mortelle ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdStaging": {
  "title": "Une erreur de détermination du stade d’une maladie pourrait-elle mener à une décision menaçant la vie ?",
  "criterion": "Une erreur de détermination du stade d’une maladie pourrait-elle mener à une décision menaçant la vie ?",
  "sourceLabel": "Une erreur de détermination du stade d’une maladie pourrait-elle mener à une décision menaçant la vie ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdPropagation": {
  "title": "Le test détecte-t-il un agent causant une maladie mortelle à fort risque de propagation ?",
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
  "title": "Le test dépiste-t-il le statut immunitaire infectieux d’une femme enceinte ?",
  "criterion": "Le test dépiste-t-il le statut immunitaire d’une femme enceinte envers un agent transmissible ?",
  "sourceLabel": "Le test dépiste-t-il le statut immunitaire d’une femme enceinte envers un agent transmissible ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdImmuneRisk": {
  "title": "Une erreur de statut infectieux ou immunitaire pourrait-elle mener à une décision menaçant la vie ?",
  "criterion": "Une erreur de statut infectieux ou immunitaire pourrait-elle mener à une décision menaçant la vie ?",
  "sourceLabel": "Une erreur de statut infectieux ou immunitaire pourrait-elle mener à une décision menaçant la vie ?",
  "options": {
   "no": "Non",
   "yes": "Oui"
  }
 },
 "ivdCompatibility": {
  "title": "Le test détermine-t-il une compatibilité immunologique ou une incompatibilité fœto-maternelle ?",
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
  "title": "Le test dépiste-t-il une anomalie congénitale du nouveau-né dont l’absence de traitement risque décès ou handicap grave ?",
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
  "title": "Le test est-il effectué hors laboratoire, près du patient, par un professionnel ?",
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

Object.assign(questions.ivdRole.options,{test:'Réactif, test ou kit',instrument:'Instrument d’analyse seul',software:'Logiciel IVD',receptacle:'Récipient sans test intégré',lab:'Produit général pour usage IVD',accessory:'Accessoire de DIV',calibrator:'Calibrateur',assignedControl:'Contrôle à valeur assignée',unassignedControl:'Contrôle sans valeur assignée'});
function view(q){const p=questions[q.id];if(!p)return {title:q.label,criterion:q.intro||'',options:q.options,descriptions:q.optionHelp||{}};
 return {title:p.title,criterion:hints[q.id]||p.criterion||q.intro||'',options:q.options.map(([value,label])=>[value,p.options[value]||label]),descriptions:{...q.optionHelp,...p.descriptions}};}
const roleGroups={
 analysis:{label:'Test, instrument ou logiciel',description:'Réactif, kit, automate d’analyse ou logiciel IVD.',values:['test','instrument','software']},
 support:{label:'Récipient, produit général ou accessoire',description:'Tube de prélèvement, tampon, produit de lavage ou accessoire dédié.',values:['receptacle','lab','accessory']},
 reference:{label:'Calibrateur ou contrôle',description:'Produit servant à étalonner l’analyse ou à vérifier ses résultats.',values:['calibrator','assignedControl','unassignedControl']}
};

/* Anciens pictogrammes SVG conservés uniquement comme secours si le PNG ne charge pas. */

const api={questions,view,roleGroups};
if(typeof module==='object'&&module.exports)module.exports=api;else window.ORBIVIA_QUESTION_PRESENTATION=api;
})();
