$ftpHost = "62.72.50.163"
$ftpUser = "u537606041"
$ftpPass = 'z*Z%zk6Vw8,,Z(Z'
$ftpPort = 21

# The local folder to upload (Next.js static export folder)
$localRoot = Join-Path $PSScriptRoot "out"
$ftpBase = "ftp://${ftpHost}:${ftpPort}"

# Paths to try on the remote host:
# Try `/domains/celebraconmigo.store/public_html/app` or `/public_html/app`
$remoteBase = "/domains/celebraconmigo.store/public_html/app"

Write-Host "`n=== Celebra SaaS - Iniciando Subida FTP ===" -ForegroundColor Cyan
Write-Host "Local Source: $localRoot" -ForegroundColor Gray
Write-Host "FTP Host    : $ftpHost" -ForegroundColor Gray
Write-Host "Remote Base : $remoteBase" -ForegroundColor Gray

# Check if local build exists
if (-not (Test-Path $localRoot)) {
    Write-Host "ERROR: La carpeta 'out' no existe. Ejecuta 'npm run build' primero." -ForegroundColor Red
    exit
}

# Function to create remote directory
function Create-FtpDirectory($remoteDir) {
    $uri = "${ftpBase}${remoteDir}"
    $request = [System.Net.FtpWebRequest]::Create($uri)
    $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
    $request.UsePassive = $true
    
    try {
        $response = $request.GetResponse()
        $response.Close()
        Write-Host "  Directorio creado: $remoteDir" -ForegroundColor Green
    } catch {
        # Directory might already exist, which is fine
        $err = $_.Exception.Message
        if ($err -match "550") {
            # 550 means directory already exists or access denied (usually exists)
        } else {
            Write-Host "  Aviso/Error al crear directorio $remoteDir : $err" -ForegroundColor Yellow
        }
    }
}

# Function to upload file
function Upload-FtpFile($localPath, $remotePath) {
    $uri = "${ftpBase}${remotePath}"
    $request = [System.Net.FtpWebRequest]::Create($uri)
    $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $request.UsePassive = $true
    $request.UseBinary = $true
    $request.KeepAlive = $false

    try {
        $fileBytes = [System.IO.File]::ReadAllBytes($localPath)
        $request.ContentLength = $fileBytes.Length
        $stream = $request.GetRequestStream()
        $stream.Write($fileBytes, 0, $fileBytes.Length)
        $stream.Close()
        $response = $request.GetResponse()
        $response.Close()
        Write-Host "  OK: $remotePath" -ForegroundColor Green
    } catch {
        Write-Host "  FAIL: $remotePath - $_" -ForegroundColor Red
    }
}

# Recursive upload function
function Upload-Recursive($localPath, $remotePath) {
    # Ensure remote directory exists
    Create-FtpDirectory $remotePath

    # Upload files
    $files = Get-ChildItem -Path $localPath -File
    foreach ($file in $files) {
        $remoteFilePath = $remotePath + "/" + $file.Name
        Upload-FtpFile $file.FullName $remoteFilePath
    }

    # Recurse subdirectories
    $dirs = Get-ChildItem -Path $localPath -Directory
    foreach ($dir in $dirs) {
        $remoteSubDir = $remotePath + "/" + $dir.Name
        Upload-Recursive $dir.FullName $remoteSubDir
    }
}

# Run the upload
Upload-Recursive $localRoot $remoteBase

Write-Host "`n=== Despliegue Completado! ===" -ForegroundColor Cyan
