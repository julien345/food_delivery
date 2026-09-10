#!/bin/bash
FICHIER=".env"
if [ -f "$FICHIER" ]; then
  echo "Le fichier $FICHIER existe, tout va bien"
else
  echo "ATTENTION : $FICHIER est manquant !"
fi
