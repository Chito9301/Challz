# Script para descomentar líneas con .username en archivos .ts y .tsx
Get-ChildItem -Recurse -Include *.tsx,*.ts | Where-Object { $_.FullName -notmatch '\\\.next\\' } | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file

    $newContent = $content | ForEach-Object {
        # Quitar "// " sólo si la línea está comentada y contiene .username
        if ($_ -match '^\s*//\s*.*\.username') {
            # Elimina sólo la primera ocurrencia de "// " al inicio
            $_ -replace '^\s*//\s*', ''
        } else {
            $_
        }
    }

    # Guarda el archivo con las líneas ya descomentadas
    Set-Content -Path $file -Value $newContent
    Write-Host "Archivo procesado:" $file
}
