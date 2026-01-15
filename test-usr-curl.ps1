# PowerShell script to invoke web request and print detailed status and body
$url = "https://apis.data.go.kr/1230000/UsrInfoService/getPrcrmntCorpBasicInfo02"
$serviceKey = [System.Web.HttpUtility]::UrlDecode($env:VITE_PUBLIC_DATA_KEY) # Decode if needed, but let's try raw first
$encodedKey = $env:VITE_PUBLIC_DATA_KEY

# Test 1: Root Path with Encoded Key
Write-Host "--- Testing Root Path ---"
$fullUrl = "$url?ServiceKey=$encodedKey&type=json&numOfRows=1&pageNo=1&corpNm=%EC%82%BC%EC%84%B1"
try {
    $response = Invoke-WebRequest -Uri $fullUrl -Method Get -SkipCertificateCheck
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Body: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Body: $($reader.ReadToEnd())"
    }
}

# Test 2: /bs Path
Write-Host "`n--- Testing /bs Path ---"
$urlBS = "https://apis.data.go.kr/1230000/bs/UsrInfoService/getPrcrmntCorpBasicInfo02"
$fullUrlBS = "$urlBS?ServiceKey=$encodedKey&type=json&numOfRows=1&pageNo=1&corpNm=%EC%82%BC%EC%84%B1"
try {
    $response = Invoke-WebRequest -Uri $fullUrlBS -Method Get -SkipCertificateCheck
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Body: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Body: $($reader.ReadToEnd())"
    }
}
