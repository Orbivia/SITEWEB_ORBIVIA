# Maintenance des clarifications

Les 128 questions ont une aide déterministe spécifique : reformulation concrète, choix décrits ou arbre ciblé. Le nom du produit ne détermine jamais une réponse. Exemples et sources restent accessibles. Toute proposition exige une confirmation explicite. Annuler conserve la réponse précédente.

Une incertitude persistante permet de continuer avec un point à préciser. Le résultat et son PDF restent provisoires ; le doute ne devient pas un Non. Les règles de repli I sont masquées lorsque des réponses manquent. La revue ouvre directement les points à préciser. Réponses, brouillon et traces survivent au rechargement, avec stockage séparé par outil. Les branches inapplicables sont ignorées. Les sous-questions ne changent pas le pourcentage principal.

## Cas examinés

Qualification et mode principal pharmacologique / immunologique / métabolique ; diagnostic in vitro ; contraception et nettoyage ; accessoire et annexe XVI ; implantation totale et partielle pendant 30 jours ; durée continue ; conversion ou transmission passive d’énergie ; diagnostic et surveillance courante ou critique ; régulation technique ou boucle diagnostique thérapeutique ; impact logiciel ; énergie dangereuse ; contact central et muqueuses ; tissu viable ; nanomatériau et exposition ; classes des dispositifs commandés. Pour les normes : fonction électrique médicale, logiciel, contact indirect, alarmes et régulation physiologique.

Les aides reprennent les critères documentés des questions. Elles ne valent pas validation réglementaire. Une destination ou des données insuffisantes restent à préciser. Sources : MDR annexe VIII et liens officiels présents dans les questions ; voir CLASSIFICATION_VALIDATION.md.

## Maintenance

Après modification des arbres, incrémenter version dans clarification.js et la version de cache dans les deux pages HTML. Un brouillon incompatible revient au début de l’aide sans effacer les réponses principales. Les chemins invalides sont rejetés. unresolved est distinct des réponses connues ; les anciens checking ne sont pas réintroduits. editing, reviewMode et reviewSeen sont sauvegardés pour reprendre une revue ciblée.

261 tests réussis : toutes les branches des 128 aides, incertitude à chaque étape, qualification et cas cliniques, restauration, résultats provisoires et PDF sur une page. Navigateur : report et résolution du doute, reprise après rechargement, confirmation puis retour direct au résultat EEG IIa règle 10 ; aide normative et mobile 390 × 640.

## Catalogue revu

### classification

| Champ | Question | Aide | Étapes |
|---|---|---|---|
| scope | Le produit est-il déjà qualifié de dispositif médical ? | Arbre ciblé | 1–5 |
| form | Quelle forme a le produit ? | Choix décrits | 1–1 |
| active | Le produit utilise-t-il une énergie électrique ou une autre énergie externe pour sa fonction ? | Arbre ciblé | 1–2 |
| contact | Comment le produit entre-t-il en contact avec le corps ? | Choix décrits | 1–1 |
| implant | Le produit est-il destiné à rester implanté après une intervention clinique ? | Arbre ciblé | 1–2 |
| duration | Quelle est la durée maximale d’utilisation continue prévue ? | Choix décrits | 1–1 |
| medicinal | Le produit incorpore-t-il une substance médicamenteuse dont l’action est accessoire ? | Critère concret | 1–1 |
| contraception | Le produit sert-il à la contraception ou à la prévention des infections sexuellement transmissibles ? | Critère concret | 1–1 |
| cleaning | Le produit est-il spécifiquement destiné au traitement de dispositifs médicaux ? | Choix décrits | 1–1 |
| xrecord | Le produit enregistre-t-il spécifiquement les images diagnostiques générées par rayons X ? | Critère concret | 1–1 |
| tissue | Le produit est-il fabriqué avec des tissus, cellules ou dérivés d’origine humaine ou animale ? | Choix décrits | 1–1 |
| animalIntact | Le dispositif d’origine animale touche-t-il exclusivement une peau intacte ? | Critère concret | 1–1 |
| nano | Le produit incorpore-t-il un nanomatériau ou est-il constitué d’un nanomatériau ? | Critère concret | 1–1 |
| nanoContact | Le composant contenant le nanomatériau peut-il avoir un contact direct ou indirect avec une personne ? | Critère concret | 1–1 |
| nanoExposure | Quel est le potentiel documenté d’exposition interne au nanomatériau ? | Choix décrits | 1–1 |
| substance | Le produit est-il composé de substances appliquées sur la peau ou introduites par un orifice, puis absorbées ou dispersées dans le corps ? | Critère concret | 1–1 |
| substanceSystemic | L’absorption systémique du produit ou de ses métabolites est-elle nécessaire à l’effet prévu ? | Critère concret | 1–1 |
| substanceGI | La substance agit-elle dans l’estomac / le tube digestif inférieur et est-elle, ou ses métabolites, absorbée par voie systémique ? | Critère concret | 1–1 |
| substanceLocal | La substance est-elle appliquée sur la peau ou dans la cavité nasale / buccale jusqu’au pharynx, et y atteint-elle son effet ? | Critère concret | 1–1 |
| channel | Le produit conduit-il ou stocke-t-il des matières destinées à être introduites dans le corps ? | Critère concret | 1–1 |
| bloodBag | Est-ce une poche destinée à conserver du sang ? | Critère concret | 1–1 |
| channelBody | Le produit conduit-il / stocke-t-il du sang ou des liquides corporels, ou stocke-t-il des organes, cellules ou tissus ? | Critère concret | 1–1 |
| channelActive | Peut-il se connecter à un dispositif actif de classe IIa, IIb ou III ? | Choix décrits | 1–1 |
| modify | Le produit modifie-t-il la composition de tissus, cellules, sang ou liquides destinés à être implantés ou administrés ? | Critère concret | 1–1 |
| modifySimple | Le traitement se limite-t-il à une filtration, centrifugation ou à un échange de gaz ou de chaleur ? | Critère concret | 1–1 |
| invitroSubstance | Est-ce une substance utilisée in vitro au contact direct de cellules, tissus, organes humains ou d’embryons avant leur implantation / administration ? | Critère concret | 1–1 |
| wound | Le produit touche-t-il une peau ou une muqueuse lésée ? | Critère concret | 1–1 |
| woundDeep | Est-il principalement destiné aux lésions ayant franchi le derme / la muqueuse et cicatrisant uniquement par seconde intention ? | Critère concret | 1–1 |
| woundBarrier | Son rôle se limite-t-il à une barrière mécanique, la compression ou l’absorption des exsudats ? | Critère concret | 1–1 |
| orificeActive | Le produit est-il destiné à être connecté à un dispositif actif IIa, IIb ou III ? | Choix décrits | 1–1 |
| orificeCavity | Est-il utilisé uniquement dans la bouche jusqu’au pharynx, le conduit auditif jusqu’au tympan ou la cavité nasale ? | Critère concret | 1–1 |
| orificeAbsorb | Est-il susceptible d’être absorbé par la muqueuse ? | Critère concret | 1–1 |
| inhalation | Le produit administre-t-il un médicament par inhalation ? | Critère concret | 1–1 |
| inhalationRisk | Son fonctionnement influence-t-il essentiellement l’efficacité / la sécurité du médicament, ou traite-t-il une affection mettant la vie en danger ? | Critère concret | 1–1 |
| heartDefect | Est-il spécifiquement destiné à contrôler, diagnostiquer, surveiller ou corriger une défaillance cardiaque / circulatoire centrale par contact direct ? | Critère concret | 1–1 |
| centralContact | Est-il spécifiquement utilisé en contact direct avec le cœur, la circulation centrale ou le système nerveux central ? | Critère concret | 1–1 |
| reusableSurgical | Est-ce un instrument chirurgical réutilisable, sans connexion à un dispositif actif ? | Critère concret | 1–1 |
| surgIonising | Le dispositif fournit-il de l’énergie sous forme de rayonnements ionisants ? | Critère concret | 1–1 |
| bioAbsorb | A-t-il un effet biologique ou est-il absorbé en totalité ou en grande partie ? | Critère concret | 1–1 |
| chemical | Subit-il une transformation chimique dans le corps, en dehors d’un placement dans les dents ? | Critère concret | 1–1 |
| surgMedicine | Est-il destiné à administrer un médicament ? | Critère concret | 1–1 |
| surgMedicineRisk | Cette administration temporaire se fait-elle d’une manière potentiellement dangereuse ? | Critère concret | 1–1 |
| dental | Le dispositif est-il destiné à être placé dans les dents ? | Critère concret | 1–1 |
| implantActive | S’agit-il d’un implant actif ou d’un accessoire d’implant actif ? | Critère concret | 1–1 |
| implantSpecial | Est-ce un implant mammaire, un treillis chirurgical, une prothèse articulaire totale / partielle ou un dispositif rachidien visé par la règle ? | Critère concret | 1–1 |
| therapyEnergy | Le produit administre-t-il ou échange-t-il de l’énergie avec le corps à des fins thérapeutiques ? | Critère concret | 1–1 |
| energyHazard | Cette énergie peut-elle être administrée d’une manière potentiellement dangereuse compte tenu de sa nature, densité et site ? | Arbre ciblé | 1–2 |
| therapyIonising | Le produit émet-il des rayonnements ionisants à visée thérapeutique, ou commande-t-il / surveille-t-il directement un tel dispositif ? | Critère concret | 1–1 |
| controlTherapy | Le produit commande-t-il, surveille-t-il ou influence-t-il directement un autre dispositif thérapeutique actif ? | Choix décrits | 1–1 |
| diagnostic | Le produit réalise-t-il un diagnostic ou une surveillance physiologique ? | Critère concret | 1–1 |
| diagnosticEnergy | Fournit-il une énergie absorbée par le corps, hors simple éclairage visible ? | Critère concret | 1–1 |
| radiopharm | Représente-t-il la distribution de produits radiopharmaceutiques dans le corps ? | Critère concret | 1–1 |
| diagnosticUse | Dans quel contexte le diagnostic ou la surveillance est-il utilisé ? | Arbre ciblé | 1–3 |
| diagnosticXray | Émet-il des rayonnements ionisants pour le diagnostic / la radiologie interventionnelle, ou commande-t-il / surveille-t-il un tel dispositif ? | Critère concret | 1–1 |
| administer | Le dispositif actif fait-il entrer ou sortir de l’air, un liquide ou une autre substance du corps ? | Critère concret | 1–1 |
| adminHazard | L’administration / le retrait peut-il être potentiellement dangereux selon la substance, le site ou le mode ? | Critère concret | 1–1 |
| closedLoop | Le dispositif adapte-t-il automatiquement un traitement à partir de mesures sur le patient ? | Critère concret | 1–1 |
| closedLoopDiagnostic | Une fonction diagnostique patient détermine-t-elle le traitement automatique ? | Arbre ciblé | 1–2 |
| softwareRole | Quel est le rôle médical du logiciel ? | Choix décrits | 1–1 |
| softwareDecision | Fournit-il des informations utilisées pour une décision diagnostique ou thérapeutique ? | Critère concret | 1–1 |
| softwareImpact | Quelle est la conséquence la plus grave qu’une décision erronée pourrait entraîner ? | Arbre ciblé | 1–2 |
| softwareMonitor | Le logiciel surveille-t-il des processus physiologiques ? | Critère concret | 1–1 |
| softwareVital | Surveille-t-il des paramètres vitaux dont les variations peuvent présenter un danger immédiat pour la vie ? | Critère concret | 1–1 |
| multiPurpose | Les réponses couvrent-elles un seul dispositif et tous ses usages / variantes, avec les situations les plus contraignantes ? | Critère concret | 1–1 |

### norms

| Champ | Question | Aide | Étapes |
|---|---|---|---|
| electric | Le produit est-il un appareil électromédical électrique ? | Arbre ciblé | 1–2 |
| software | Comprend-il un logiciel médical ? | Arbre ciblé | 1–2 |
| connected | Communique-t-il avec un réseau ou un système informatique ? | Critère concret | 1–1 |
| cloud | Utilise-t-il un serveur distant ou des données de santé hébergées ? | Critère concret | 1–1 |
| ai | Utilise-t-il une fonction d’intelligence artificielle ? | Critère concret | 1–1 |
| alarm | Dispose-t-il d’alarmes médicales ? | Arbre ciblé | 1–2 |
| closedloop | Régule-t-il un paramètre physiologique en boucle fermée ? | Arbre ciblé | 1–2 |
| home | Est-il destiné au domicile ? | Critère concret | 1–1 |
| emergency | Est-il utilisé par les secours médicaux ? | Critère concret | 1–1 |
| transport | Subit-il des conditions de chocs ou vibrations exigeantes ? | Critère concret | 1–1 |
| clinical | Une investigation clinique est-elle prévue ? | Critère concret | 1–1 |
| contact | Présente-t-il un contact direct ou indirect avec le corps ? | Arbre ciblé | 1–2 |
| substance | Est-il composé de substances introduites, absorbées ou localement dispersées dans le corps ? | Critère concret | 1–1 |
| polymer | Les polymères exposent-ils le patient à un risque biologique à évaluer ? | Critère concret | 1–1 |
| blood | Entre-t-il en contact avec le sang ? | Critère concret | 1–1 |
| implant | Est-il implantable ? | Critère concret | 1–1 |
| activeImplant | S’agit-il d’un implant actif ? | Critère concret | 1–1 |
| nano | Contient-il des nanomatériaux avec exposition possible ? | Critère concret | 1–1 |
| tissue | Contient-il des tissus d’origine animale ou humaine ? | Critère concret | 1–1 |
| sterile | Est-il fourni à l’état stérile ? | Critère concret | 1–1 |
| eto | La stérilisation utilise-t-elle l’oxyde d’éthylène ? | Critère concret | 1–1 |
| radiation | La stérilisation utilise-t-elle une irradiation ? | Critère concret | 1–1 |
| steam | La stérilisation utilise-t-elle la vapeur ? | Critère concret | 1–1 |
| reprocess | Est-il réutilisable avec retraitement entre utilisations ? | Critère concret | 1–1 |
| cleanroom | Est-il fabriqué ou conditionné en salle propre ? | Critère concret | 1–1 |
| resp | Concerne-t-il la respiration ou un circuit respiratoire ? | Critère concret | 1–1 |
| sleep | Est-il destiné à traiter les apnées du sommeil ? | Critère concret | 1–1 |
| oxygen | Utilise-t-il de l’oxygène médical ? | Critère concret | 1–1 |
| anesthesia | Est-il destiné à l’anesthésie ? | Critère concret | 1–1 |
| infusion | Administre-t-il des médicaments ou liquides par perfusion ? | Critère concret | 1–1 |
| catheter | Contient-il un cathéter intravasculaire ? | Critère concret | 1–1 |
| connectors | Utilise-t-il de petits raccords fluidiques ou gazeux ? | Critère concret | 1–1 |
| enteral | Concerne-t-il la voie entérale ? | Critère concret | 1–1 |
| dialysis | Concerne-t-il la dialyse ou l’épuration extracorporelle ? | Critère concret | 1–1 |
| cardiac | Concerne-t-il une fonction cardiovasculaire ? | Critère concret | 1–1 |
| ecg | Acquiert-il des électrocardiogrammes ? | Critère concret | 1–1 |
| vascular | Concerne-t-il une prothèse ou un acte vasculaire ? | Critère concret | 1–1 |
| neuro | Concerne-t-il la neurologie ou neurostimulation ? | Critère concret | 1–1 |
| surgical | Est-il utilisé en chirurgie ? | Critère concret | 1–1 |
| endoscopy | Est-il utilisé en endoscopie ? | Critère concret | 1–1 |
| orthopedic | Concerne-t-il des implants orthopédiques ? | Critère concret | 1–1 |
| prosthesis | Est-ce une prothèse externe ou orthèse ? | Critère concret | 1–1 |
| wheelchair | Est-ce un fauteuil roulant ? | Critère concret | 1–1 |
| dental | Concerne-t-il la dentisterie ? | Critère concret | 1–1 |
| ophthalmic | Concerne-t-il l’ophtalmologie ? | Critère concret | 1–1 |
| contactLens | Concerne-t-il les lentilles de contact ? | Critère concret | 1–1 |
| wound | Est-il destiné au traitement de plaies ? | Critère concret | 1–1 |
| monitor | Surveille-t-il des paramètres physiologiques ? | Critère concret | 1–1 |
| neonatal | Concerne-t-il les nouveau-nés ? | Critère concret | 1–1 |
| bed | Est-ce un lit médicalisé ? | Critère concret | 1–1 |
| hearing | Concerne-t-il une aide auditive ou un implant cochléaire ? | Critère concret | 1–1 |
| thermal | Chauffe-t-il le patient ? | Critère concret | 1–1 |
| gloves | Est-ce un gant à usage médical ? | Critère concret | 1–1 |
| mask | Est-ce un masque à usage médical ? | Critère concret | 1–1 |
| textile | Concerne-t-il les textiles de bloc opératoire ? | Critère concret | 1–1 |
| xray | Produit-il ou détecte-t-il les rayons X médicaux ? | Critère concret | 1–1 |
| mri | Utilise-t-il l’imagerie par résonance magnétique ? | Critère concret | 1–1 |
| ultrasound | Utilise-t-il les ultrasons médicaux ? | Critère concret | 1–1 |
| laser | Utilise-t-il un laser médical ? | Critère concret | 1–1 |
| optical | Émet-il une lumière à visée médicale ? | Critère concret | 1–1 |
| radiotherapy | Concerne-t-il la radiothérapie ? | Critère concret | 1–1 |
| imaging | Échange-t-il des images médicales ? | Critère concret | 1–1 |
| lab | S’agit-il d’un appareil de laboratoire médical ? | Critère concret | 1–1 |
| ivd | Relève-t-il plutôt du diagnostic in vitro (IVDR) ? | Critère concret | 1–1 |

{"Arbre ciblé":12,"Choix décrits":10,"Critère concret":106}
