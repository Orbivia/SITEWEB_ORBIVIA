/* Reviewed clarification criteria. No class is inferred from a product name. */
(function(){
'use strict';
const criteria={classification:{
 implant:'Après la procédure clinique, le produit reste-t-il dans le corps comme implant, totalement ou partiellement selon sa destination ?',
 medicinal:'Le produit contient-il, comme partie intégrante, une substance ayant une action médicamenteuse accessoire à son action principale ?',
 contraception:'Le fabricant prévoit-il d’éviter une grossesse ou la transmission d’une infection sexuelle avec ce produit ?',
 xrecord:'Le produit capte-t-il lui-même l’image issue des rayons X, plutôt que d’afficher ou archiver une image déjà acquise ?',
 animalIntact:'Tous les usages prévus du composant d’origine animale se limitent-ils au contact d’une peau intacte ?',
 nano:'La composition identifie-t-elle un nanomatériau, au-delà d’un simple nom commercial contenant « nano » ?',
 nanoContact:'Le composant contenant le nanomatériau présente-t-il une voie de contact direct ou indirect avec le patient ou l’utilisateur ?',
 substance:'Le produit lui-même est-il une substance appliquée sur la peau ou introduite par un orifice, puis absorbée ou dispersée dans le corps ?',
 substanceSystemic:'Le passage dans la circulation générale est-il nécessaire pour obtenir l’effet prévu du produit ou de ses métabolites ?',
 substanceGI:'Le produit agit-il dans l’estomac ou l’intestin inférieur ET le produit ou ses métabolites sont-ils absorbés dans la circulation générale ?',
 substanceLocal:'L’application ET l’effet prévu restent-ils sur la peau, dans le nez ou la bouche jusqu’au pharynx ?',
 channel:'Le produit conduit-il ou conserve-t-il une matière qui sera ensuite introduite dans le corps, contrairement à un déchet définitivement évacué ?',
 bloodBag:'Le produit est-il une poche dont la fonction prévue est de conserver du sang destiné à être réutilisé ?',
 channelBody:'La destination inclut-elle le transport / stockage de sang ou de liquides corporels, ou le stockage d’organes, cellules ou tissus ?',
 modify:'Le dispositif change-t-il la composition de matières biologiques avant leur implantation ou leur réadministration, plutôt que de les stocker uniquement ?',
 modifySimple:'L’ensemble du traitement est-il limité à la filtration, la centrifugation ou un échange de gaz ou de chaleur, sans autre modification de composition ?',
 invitroSubstance:'S’agit-il d’une substance en contact direct, hors du corps, avec des cellules, tissus, organes ou embryons humains destinés à être implantés ou administrés ?',
 wound:'Au moins un usage prévu met-il le dispositif au contact d’une peau ou d’une muqueuse déjà lésée ?',
 woundDeep:'La destination principale couvre-t-elle des lésions dépassant le derme / la muqueuse et ne cicatrisant que par seconde intention ?',
 woundBarrier:'La fonction sur la lésion se limite-t-elle à faire barrière, comprimer ou absorber les exsudats, sans gérer le micro-environnement ?',
 orificeCavity:'Le produit reste-t-il exclusivement dans la bouche jusqu’au pharynx, le conduit auditif jusqu’au tympan ou la cavité nasale ?',
 orificeAbsorb:'Le matériau peut-il être absorbé par la muqueuse pendant l’utilisation prévue, selon les données disponibles ?',
 inhalation:'Le produit a-t-il pour fonction d’administrer un médicament par les voies respiratoires, au-delà de délivrer de l’air sans médicament ?',
 inhalationRisk:'Le fonctionnement détermine-t-il essentiellement l’efficacité / la sécurité du médicament, OU le produit traite-t-il une affection mettant la vie en danger ?',
 heartDefect:'La destination vise-t-elle précisément le diagnostic, le contrôle, la surveillance ou la correction d’une défaillance du cœur / de la circulation centrale par contact direct ?',
 centralContact:'Le site d’utilisation prévu implique-t-il un contact direct avec le cœur, la circulation centrale ou le système nerveux central, et non seulement avec la peau au-dessus ?',
 reusableSurgical:'L’instrument est-il chirurgical, prévu pour plusieurs utilisations après retraitement, ET sans connexion à un dispositif actif ?',
 surgIonising:'L’instrument invasif fournit-il lui-même une énergie ionisante, plutôt que d’être seulement guidé par un appareil de radiographie externe ?',
 bioAbsorb:'Le matériau a-t-il un effet biologique revendiqué, OU est-il absorbé totalement ou en grande partie dans le corps ?',
 chemical:'Une transformation chimique du dispositif se produit-elle dans le corps, hors du placement dans les dents ?',
 surgMedicine:'Le dispositif a-t-il une fonction d’administration de médicament, avec stockage ou contrôle de délivrance, plutôt qu’un simple rôle mécanique ?',
 surgMedicineRisk:'Le mode d’application et les caractéristiques du dispositif rendent-ils potentiellement dangereuse l’administration médicamenteuse temporaire ?',
 dental:'La destination prévoit-elle un placement dans les dents elles-mêmes, plutôt que dans l’os de la mâchoire ?',
 implantActive:'S’agit-il d’un implant actif, OU d’un accessoire spécifiquement destiné à cet implant, même externe et passif ?',
 implantSpecial:'La destination correspond-elle à un implant mammaire, un treillis chirurgical, une prothèse articulaire ou un dispositif rachidien visé, hors simples composants exemptés ?',
 therapyEnergy:'L’énergie fournie au corps sert-elle au traitement (pression respiratoire, stimulation, chaleur…), plutôt qu’à une mesure ou à un voyant technique ?',
 therapyIonising:'Le produit émet-il des rayonnements ionisants thérapeutiques, OU commande-t-il / surveille-t-il directement un tel dispositif ?',
 diagnostic:'Le produit fournit-il un diagnostic ou des mesures physiologiques médicales du patient, plutôt que seulement des informations techniques sur l’appareil ?',
 diagnosticEnergy:'Pour le diagnostic, le dispositif fournit-il une énergie absorbée par le corps, au-delà d’un simple éclairage dans le visible ?',
 radiopharm:'L’image produite représente-t-elle la répartition d’un radiotraceur administré au patient, comme en scintigraphie ou en TEP ?',
 diagnosticXray:'Le produit émet-il des rayonnements ionisants pour la radiologie diagnostique / interventionnelle, OU en commande-t-il directement l’émission ?',
 administer:'Le dispositif actif fait-il entrer ou sortir une substance du corps, y compris de l’air, de l’oxygène ou un liquide ?',
 adminHazard:'La substance, le site ou le mode d’administration / retrait rendent-ils l’opération potentiellement dangereuse, indépendamment de la compétence de l’utilisateur ?',
 closedLoop:'Une mesure du patient modifie-t-elle automatiquement le traitement délivré par le dispositif, plutôt que d’être seulement affichée ?',
 softwareDecision:'Une information produite par le logiciel intervient-elle dans une décision diagnostique ou thérapeutique pour un patient ?',
 softwareMonitor:'Le logiciel suit-il ou analyse-t-il un processus physiologique du patient à des fins médicales, plutôt que de stocker des données sans traitement ?',
 softwareVital:'Les paramètres suivis sont-ils vitaux ET leurs variations peuvent-elles mettre immédiatement la vie du patient en danger ?',
 multiPurpose:'Le produit examiné est-il clairement délimité, avec tous ses usages et variantes couverts, sans regrouper des dispositifs devant être classés séparément ?'
},norms:{
 electric:'Le produit est-il un équipement électromédical dont la fonction utilise l’électricité, plutôt qu’un produit mécanique passif ?',
 software:'Le logiciel réalise-t-il, commande-t-il ou contribue-t-il à une fonction médicale, plutôt qu’à une fonction administrative uniquement ?',
 connected:'Le dispositif échange-t-il des données ou commandes avec un autre système par réseau, Wi-Fi, Bluetooth ou une interface équivalente ?',
 cloud:'Les données ou traitements du produit passent-ils par un serveur distant ou une infrastructure d’hébergement, plutôt que de rester uniquement locaux ?',
 ai:'Une fonction du produit utilise-t-elle un modèle d’apprentissage ou d’IA, au-delà d’une IA utilisée pour rédiger des documents de développement ?',
 alarm:'Une alarme avertit-elle d’un état nécessitant une action pour la sécurité du patient, au-delà d’un voyant ou message informatif ?',
 closedloop:'Une mesure physiologique du patient est-elle automatiquement utilisée pour ajuster la sortie thérapeutique, plutôt qu’une simple régulation du moteur ?',
 home:'La destination du fabricant prévoit-elle une utilisation au domicile, même si le produit peut aussi être utilisé en établissement de soins ?',
 emergency:'La destination prévoit-elle les secours médicaux ou l’ambulance, plutôt que la seule utilisation en cabinet ou à l’hôpital ?',
 transport:'Les conditions d’utilisation ou de transport imposent-elles des chocs / vibrations significatifs à évaluer ?',
 clinical:'Une investigation clinique sur des participants est-elle planifiée, au-delà d’une évaluation clinique fondée sur la littérature ?',
 contact:'Le patient peut-il être exposé au produit directement ou indirectement, notamment via des gaz, liquides ou matériaux délivrés ?',
 substance:'Le produit est-il constitué de substances introduites, absorbées ou dispersées localement dans le corps, plutôt que d’un simple instrument ?',
 polymer:'Un polymère peut-il exposer le patient à un risque biologique, par contact direct ou indirect, plutôt que d’être seulement une pièce externe isolée ?',
 blood:'Le produit présente-t-il un contact avec le sang dans son utilisation prévue ?',
 implant:'Le dispositif reste-t-il implanté après une procédure clinique selon sa destination ?',
 activeImplant:'L’implant utilise-t-il une source d’énergie autre que celle du corps ou la gravité pour assurer sa fonction ?',
 nano:'Un nanomatériau identifié dans la composition peut-il exposer le patient ou l’utilisateur, au-delà d’un nom commercial ?',
 tissue:'La composition contient-elle des tissus, cellules ou dérivés d’origine humaine ou animale, plutôt que des matériaux entièrement synthétiques ?',
 sterile:'Le fabricant fournit-il le produit à l’état stérile, plutôt que de demander à l’utilisateur de le stériliser avant le premier usage ?',
 eto:'Le procédé de stérilisation prévu et documenté utilise-t-il l’oxyde d’éthylène ?',
 radiation:'Le procédé de stérilisation utilise-t-il des rayonnements gamma, un faisceau d’électrons ou une autre irradiation ?',
 steam:'Le procédé de stérilisation prévu utilise-t-il la vapeur, par exemple en autoclave ?',
 reprocess:'Le fabricant prévoit-il la réutilisation après nettoyage, désinfection ou stérilisation entre les usages ?',
 cleanroom:'La fabrication ou le conditionnement prévoit-il une salle à environnement maîtrisé / salle propre ?',
 resp:'La fonction implique-t-elle la respiration ou un trajet de gaz respiratoires vers le patient ?',
 sleep:'Le traitement des apnées du sommeil figure-t-il dans la destination, au-delà de l’enregistrement général du sommeil ?',
 oxygen:'L’administration ou l’utilisation d’oxygène médical est-elle prévue, au-delà de l’air ambiant seul ?',
 anesthesia:'Le produit a-t-il une destination spécifique d’anesthésie ou d’administration d’agent anesthésique ?',
 infusion:'Le produit administre-t-il un médicament ou un liquide par perfusion, plutôt que par nutrition entérale ?',
 catheter:'Un cathéter du produit est-il prévu pour se trouver dans un vaisseau sanguin, plutôt que dans la vessie ou l’estomac ?',
 connectors:'Le produit comporte-t-il de petits raccords transportant un liquide ou un gaz, plutôt que seulement des connecteurs électriques ?',
 enteral:'Le raccord ou trajet fluidique est-il destiné à la nutrition ou à l’administration par la voie digestive ?',
 dialysis:'Le produit intervient-il dans la dialyse ou le traitement extracorporel du sang ?',
 cardiac:'La destination porte-t-elle sur le cœur ou le système cardiovasculaire ?',
 ecg:'Le dispositif acquiert-il un signal électrique cardiaque / ECG, plutôt qu’un pouls mesuré uniquement par une méthode optique ?',
 vascular:'Le produit comporte-t-il une prothèse vasculaire ou est-il destiné à un acte dans les vaisseaux ?',
 neuro:'La destination porte-t-elle sur le système nerveux, son exploration ou sa stimulation ?',
 surgical:'Une utilisation chirurgicale figure-t-elle dans la destination du dispositif ?',
 endoscopy:'Le produit est-il destiné à l’endoscopie ou à être utilisé comme accessoire d’un système endoscopique ?',
 orthopedic:'Le produit comprend-il un implant orthopédique laissé dans le corps, plutôt qu’une orthèse externe ?',
 prosthesis:'Le produit remplace-t-il extérieurement un membre / segment ou soutient-il une fonction par une orthèse externe ?',
 wheelchair:'Le produit est-il un fauteuil roulant manuel ou électrique, plutôt qu’une autre aide à la marche ?',
 dental:'Le fabricant destine-t-il le produit aux soins dentaires ou aux structures dentaires ?',
 ophthalmic:'La destination concerne-t-elle l’œil ou l’exploration / le traitement ophtalmique ?',
 contactLens:'S’agit-il d’une lentille portée sur l’œil, plutôt que d’un verre de lunettes ou d’un implant intraoculaire ?',
 wound:'La destination vise-t-elle la prise en charge de plaies ou de lésions ?',
 monitor:'Le produit mesure-t-il ou suit-il des paramètres physiologiques du patient, plutôt que les seuls paramètres techniques de l’appareil ?',
 neonatal:'Le fabricant inclut-il explicitement les nouveau-nés dans la population prévue ?',
 bed:'Le produit est-il un lit destiné aux soins / au soutien médical du patient, plutôt qu’un mobilier ordinaire ?',
 hearing:'La destination vise-t-elle la compensation d’un déficit auditif, plutôt qu’une simple restitution audio de loisir ?',
 thermal:'Le produit chauffe-t-il volontairement le patient à des fins médicales, plutôt que de refroidir ou chauffer seulement son électronique ?',
 gloves:'Les gants sont-ils spécifiquement destinés à un usage médical, d’examen ou chirurgical ?',
 mask:'Le produit est-il un masque à usage médical, plutôt qu’un masque de ventilation ou un équipement de protection d’un autre périmètre ?',
 textile:'Le textile a-t-il une destination de bloc opératoire, comme un champ ou une casaque chirurgicale ?',
 xray:'La technique médicale utilise-t-elle des rayons X, en émission ou en détection ?',
 mri:'La technique prévue est-elle l’imagerie par résonance magnétique, plutôt que le scanner X ou l’échographie ?',
 ultrasound:'Des ultrasons interviennent-ils dans la fonction médicale, plutôt qu’un simple son de notification ?',
 laser:'La source utilisée pour la fonction médicale est-elle un laser, plutôt qu’une LED non laser ?',
 optical:'Le produit émet-il volontairement une lumière pour une fonction médicale, au-delà d’une LED d’état ?',
 radiotherapy:'La destination inclut-elle le traitement par rayonnements ionisants, plutôt que la seule imagerie diagnostique ?',
 imaging:'Des images médicales sont-elles échangées avec un autre système, au-delà de l’affichage d’une simple interface ?',
 lab:'L’équipement possède-t-il une destination médicale de laboratoire, plutôt qu’une destination générale de recherche ?',
 ivd:'L’information médicale provient-elle de l’analyse d’un prélèvement humain hors du corps, plutôt que d’une mesure directe sur le patient ?'
}};
const choices={
 form:{physical:'Un objet matériel ; son logiciel éventuel sert seulement à le faire fonctionner.',software:'Un logiciel autonome ayant une fonction médicale propre.',combined:'Un objet matériel ET une fonction logicielle médicale propre à examiner.'},
 contact:{none:'Aucune partie ne pénètre dans le corps : peau intacte, extérieur ou aucun contact.',orifice:'Une partie est introduite par un orifice naturel ou une stomie, sans geste chirurgical ; inclut la surface externe de l’œil.',surgical:'Une partie passe à travers une surface corporelle ou pénètre dans le cadre d’un acte chirurgical.',multiple:'Plusieurs configurations de contact doivent être analysées séparément.'},
 duration:{transient:'Usage continu normalement inférieur à 60 minutes.',short:'Usage continu normalement entre 60 minutes et 30 jours inclus.',long:'Usage continu normalement supérieur à 30 jours.',multiple:'Plusieurs durées ou interruptions / remplacements ne sont pas encore caractérisés.'},
 cleaning:{none:'Le produit n’est pas spécifiquement destiné au nettoyage / traitement des DM.',lens:'Traitement de lentilles : nettoyage, rinçage, désinfection ou hydratation.',final:'Désinfection finale d’invasifs, par solution ou laveur-désinfecteur.',disinfect:'Autre fonction spécifique de désinfection / stérilisation de DM.',physical:'Action physique de nettoyage seule, hors lentilles.'},
 tissue:{none:'Matériaux sans tissu / cellule / dérivé d’origine humaine ou animale.',human:'Origine humaine, non viable ou rendue non viable.',animal:'Origine animale, non viable ou rendue non viable.',viable:'Les cellules / tissus sont encore viables : qualification particulière.'},
 nanoExposure:{high:'Une évaluation documente un potentiel d’exposition interne élevé ou moyen.',low:'Une évaluation documente un potentiel faible.',negligible:'Une évaluation documente un potentiel négligeable.',unknown:'L’évaluation permettant de distinguer ces niveaux n’est pas disponible.'},
 channelActive:{yes:'La connexion est prévue vers un appareil dont la classe IIa, IIb ou III est documentée.',no:'Aucune telle connexion n’est prévue.',unknownClass:'Un appareil connecté est identifié, mais sa classe n’est pas établie.'},
 orificeActive:{yes:'Le dispositif est prévu pour être connecté à un actif IIa, IIb ou III identifié.',no:'Pas de connexion active, ou seulement à un actif de classe I.',unknownClass:'La connexion est prévue, mais la classe du dispositif actif manque.'},
 controlTherapy:{none:'Aucune commande ou influence directe de ce type.',iib:'Un appareil thérapeutique actif de classe IIb identifiée est directement commandé / surveillé.',implant:'La commande / surveillance porte directement sur un implant actif.',other:'Le rôle ou la classe de l’appareil commandé n’est pas établi.'},
 softwareRole:{independent:'Le logiciel produit une information / fonction médicale propre.',drives:'Le logiciel sert seulement à commander / influencer le matériel.',both:'Le logiciel commande le matériel et a aussi sa propre fonction médicale.'}
};
// Explicit branches for the criteria whose combination changes the interpretation.
const yesNo=[['no','Non'],['yes','Oui']];
const result=value=>({value});
const step=(question,yes,no)=>({question,options:yesNo,next:{yes,no}});
const medicalMode=step('L’action principale recherchée sur le corps est-elle pharmacologique, immunologique ou métabolique, comme celle d’un médicament ?',result('other'),result('md'));
const trees={
 scope:step('L’information médicale est-elle obtenue par analyse d’un prélèvement humain hors du corps ?',result('ivd'),
  step('Le fabricant prévoit-il un usage médical propre : diagnostic, prévention, surveillance, traitement ou compensation d’un handicap ?',medicalMode,
   step('La destination couvre-t-elle la maîtrise / l’aide à la conception, ou le nettoyage, la désinfection ou la stérilisation de dispositifs médicaux ?',medicalMode,
    step('Est-il spécifiquement destiné à permettre ou assister l’usage / la fonction d’un DM, sans être lui-même un DM ?',result('accessory'),
     step('Le produit correspond-il explicitement à un groupe sans destination médicale de l’annexe XVI ?',result('annex16'),result('other')))))),
 implant:step('Le produit est-il totalement introduit dans le corps (ou remplace-t-il une surface épithéliale / de l’œil) ET reste-t-il en place après la procédure clinique ?',result('yes'),
  step('Sinon, une partie du produit reste-t-elle dans le corps après la procédure pendant au moins 30 jours selon la destination prévue ?',result('yes'),result('no'))),
 active:step('La fonction dépend-elle d’une énergie autre que celle du corps ou de la gravité ?',
  step('Le dispositif convertit-il ou modifie-t-il cette énergie pour sa fonction, plutôt que de la transmettre sans modification significative ?',result('yes'),result('no')),result('no')),
 diagnosticUse:step('Le diagnostic concerne-t-il un patient en danger immédiat, ou une variation surveillée d’un paramètre vital peut-elle créer un danger immédiat ?',result('critical'),
  step('Le dispositif fournit-il un diagnostic de maladie / état, ou une information décisive pour ce diagnostic ?',result('routine'),
   step('Mesure-t-il un processus vital : activité cérébrale / EEG, ECG, respiration, tension, température, gaz sanguins… ?',result('routine'),result('other')))),
 closedLoopDiagnostic:step('L’entrée de la boucle correspond-elle à une mesure de l’état physiologique du patient, plutôt qu’à un paramètre technique seul ?',
  step('Une fonction diagnostique issue de cette mesure détermine-t-elle largement le traitement automatique délivré ?',result('yes'),result('no')),result('no')),
 softwareImpact:step('Une décision erronée peut-elle plausiblement provoquer un décès ou une détérioration irréversible de la santé ?',result('death'),
  step('Peut-elle provoquer une détérioration grave de la santé ou une intervention chirurgicale ?',result('serious'),result('other'))),
 energyHazard:step('Le dispositif assure-t-il une ventilation de suppléance dont le patient dépend pour une fonction vitale ?',result('yes'),
  step('Par sa nature, sa densité ou son site, l’énergie peut-elle être administrée d’une manière potentiellement dangereuse, indépendamment des protections de conception ?',result('yes'),result('no')))
};
const normTrees={
 electric:step('Le produit fonctionne-t-il grâce à une batterie, au secteur ou à une autre alimentation électrique ?',
  step('L’équipement réalise-t-il une mesure ou un traitement médical lié au patient, plutôt que d’être seulement un ordinateur généraliste hébergeant un logiciel ?',result('yes'),result('no')),result('no')),
 software:step('Le programme analyse-t-il des informations patient pour produire une information médicale ?',result('yes'),
  step('Commande-t-il ou contribue-t-il à la fonction médicale d’un dispositif, au-delà de la gestion administrative ?',result('yes'),result('no'))),
 contact:step('Une partie du produit touche-t-elle directement le patient lors de l’utilisation prévue ?',result('yes'),
  step('Le patient peut-il être exposé indirectement via des gaz, liquides ou matériaux qui passent par le dispositif ?',result('yes'),result('no'))),
 closedloop:step('Le dispositif mesure-t-il un état physiologique du patient, plutôt qu’un paramètre technique seul ?',
  step('Cette mesure modifie-t-elle automatiquement la sortie thérapeutique, sans attendre un réglage manuel ?',result('yes'),result('no')),result('no')),
 alarm:step('Le signal avertit-il d’un état du patient ou d’une défaillance de l’appareil pouvant affecter la sécurité des soins ?',
  step('Une réponse de l’utilisateur est-elle nécessaire, immédiatement ou dans un délai défini, pour réduire ce risque ?',result('yes'),result('no')),result('no'))
};
function definition(kind,q){
 if(kind==='classification'&&q.probe){
  if(q.clarification)return q.clarification;
  return {question:typeof q.probe==='string'?q.probe:q.label,options:q.options,next:Object.fromEntries(q.options.map(([value])=>[value,result(value)]))};
 }
 if(kind==='classification'&&trees[q.id])return trees[q.id];
 if(kind==='norms'&&normTrees[q.id])return normTrees[q.id];
 if(kind==='classification'&&choices[q.id])return {question:'Quelle situation est effectivement prévue ou documentée pour le produit ?',options:q.options.map(([value,label])=>[value,choices[q.id][value]||label]),next:Object.fromEntries(q.options.map(([value])=>[value,result(value)]))};
 const criterion=criteria[kind]?.[q.id];
 if(!criterion)throw Error('Clarification manquante : '+kind+'/'+q.id);
 return {...step(criterion,result('yes'),result('no')),options:q.options};
}
function view(kind,q,path=[]){
 let node=definition(kind,q);const valid=[],trace=[];
 for(const value of path.slice(0,8)){
  if(node.value!==undefined)break;
  if(value==='?')return {type:'proposal',value:'unresolved',path:[...valid,'?'],trace,reason:'Les précisions disponibles ne suffisent pas à choisir une réponse. Ce point restera à préciser.'};
  const option=node.options.find(([v])=>v===value);if(!option)break;
  trace.push({question:node.question,answer:option[1]});valid.push(value);node=node.next[value];
 }
 if(node.value!==undefined){
  if(!q.options.some(([v])=>v===node.value))throw Error('Proposition hors des réponses autorisées');
  return {type:'proposal',value:node.value,path:valid,trace,reason:trace.map(item=>item.question+' '+item.answer).join(' ')};
 }
 return {type:'step',question:node.question,options:node.options,path:valid,trace};
}
const api={version:'clarification-1',definition,view,criteria,choices,trees,normTrees};
if(typeof module==='object'&&module.exports)module.exports=api;else window.ORBIVIA_CLARIFICATION=api;
})();
