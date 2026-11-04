param(
    [int]$Port = 8080,
    [string]$Root = $PSScriptRoot
)

$Host.UI.RawUI.WindowTitle = "Bahasa Humanis-Digital - Server Localhost"
$listener = $null

for ($p = $Port; $p -le ($Port + 10); $p++) {
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $p)
        $listener.Start()
        $Port = $p
        break
    } catch {
        Write-Host "Port $p tidak tersedia, mencoba port berikutnya..." -ForegroundColor DarkYellow
    }
}

Write-Host "=================================================================" -ForegroundColor DarkYellow
Write-Host "   PLATFORM PEMBELAJARAN BAHASA HUMANIS-DIGITAL (DISERTASI S3)  " -ForegroundColor Yellow -NoNewline
Write-Host " "
Write-Host "   Sinergi Mahatma Gandhi (Ahimsa) & Ki Hadjar Dewantara (Among) " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "  >> Server Aktif di Localhost: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:$Port" -ForegroundColor Green
Write-Host "  >> Direktori Web           : $Root" -ForegroundColor Gray
Write-Host "  >> Tekan Ctrl+C untuk keluar dari server`n" -ForegroundColor DarkGray

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".htm"   = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".svg"   = "image/svg+xml; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".ico"   = "image/x-icon"
    ".woff2" = "font/woff2"
    ".woff"  = "font/woff"
    ".ttf"   = "font/ttf"
}

try {
    while ($true) {
        try {
            $client = $listener.AcceptTcpClient()
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)
            
            $requestLine = $reader.ReadLine()
            if (-not $requestLine) {
                $client.Close()
                continue
            }
            
            $tokens = $requestLine -split ' '
            $method = $tokens[0]
            $rawUrl = if ($tokens.Length -gt 1) { $tokens[1] } else { "/" }
            
            $urlPath = ($rawUrl -split '\?')[0]
            if ($urlPath -eq "/" -or [string]::IsNullOrWhiteSpace($urlPath)) {
                $urlPath = "/index.html"
            }
            
            # Prevent directory traversal
            $safeRelPath = $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $localPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($Root, $safeRelPath))
            
            if (-not $localPath.StartsWith([System.IO.Path]::GetFullPath($Root))) {
                $localPath = [System.IO.Path]::Combine($Root, "index.html")
            }
            
            while ($line = $reader.ReadLine()) {
                if ([string]::IsNullOrWhiteSpace($line)) { break }
            }
            
            if ([System.IO.File]::Exists($localPath)) {
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                
                $header = "HTTP/1.1 200 OK`r`n" +
                          "Content-Type: $mime`r`n" +
                          "Content-Length: $($bytes.Length)`r`n" +
                          "Access-Control-Allow-Origin: *`r`n" +
                          "Cache-Control: no-cache`r`n" +
                          "Connection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                $stream.Write($bytes, 0, $bytes.Length)
                $stream.Flush()
                Write-Host " [200 OK] $method $rawUrl" -ForegroundColor Green
            } else {
                $msg = "404 Not Found"
                $msgBytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
                $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($msgBytes.Length)`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                $stream.Write($msgBytes, 0, $msgBytes.Length)
                $stream.Flush()
                Write-Host " [404] $method $rawUrl" -ForegroundColor Red
            }
            $client.Close()
        } catch {
            # continue loop on minor socket errors
        }
    }
} finally {
    if ($listener) { $listener.Stop() }
}
