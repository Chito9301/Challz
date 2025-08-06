#!/bin/bash

# Mensaje para el commit (por defecto toma el argumento o un mensaje estándar)
COMMIT_MSG=${1:-"Actualización automática de archivos"}

echo "Agregando todos los cambios al área de staging..."
git add .

echo "Realizando commit con mensaje: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

echo "Subiendo cambios a la rama actual..."
git push

echo "Proceso completado."
