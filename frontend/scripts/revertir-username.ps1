# Script para revertir los cambios, restaurando los archivos originales desde los .bak
Get-ChildItem -Recurse -Filter *.bak | ForEach-Object {
    $bakFile = $_.FullName
    $origFile = $bakFile.Substring(0, $bakFile.Length - 4)
    
    # Restaurar el archivo original
    Copy-Item -Path $bakFile -Destination $origFile -Force
    
    # Eliminar el archivo de respaldo .bak
    Remove-Item $bakFile
}
