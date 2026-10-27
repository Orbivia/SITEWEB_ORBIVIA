# Illustrations raster MDR / IVDR

Ce répertoire doit contenir les **96 PNG transparents** de l'archive `orbivia_mdr_ivdr_96_png.zip`, sous les noms `<question_id>.png`. Dimensions : 96 × 96 pixels.

## État au 27 octobre 2026

Les vues HTML/CSS et le repli sur les SVG sont présents dans le dépôt. **Les fichiers PNG eux-mêmes ne sont pas encore publiés ici.** Le connecteur GitHub utilisé pour l'édition ne transmet pas directement les fichiers binaires depuis le dossier de travail.

## Installation

1. Télécharger l'archive fournie dans la conversation.
2. Dans une copie du dépôt, exécuter `python scripts/install-mdr-png-icons.py /chemin/vers/orbivia_mdr_ivdr_96_png.zip`.
3. Vérifier les 96 images et leur correspondance avec le sens médical des questions.
4. Ajouter `outils/classification/icones-raster/*.png` à Git, puis publier sur GitHub Pages.

Le questionnaire emploie automatiquement les PNG disponibles et conserve l'ancien SVG en cas d'absence d'un fichier.

**Limite de la planche** : les 96 images ont été générées comme thèmes génériques de santé et conformité ; 57 dessins distincts seulement trouvent une correspondance exploitable avec les 96 questions. Des améliorations spécifiques seront nécessaires pour obtenir une illustration unique et parfaitement pertinente pour chaque question.
