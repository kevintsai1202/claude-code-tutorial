$dir = 'E:\github\claude-code-tutorial\images\claude-underrated-tips-2026-01'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$images = @(
  @{url='https://pbs.twimg.com/media/G_J2-ABaoAE8xFv?format=jpg&name=large'; name='00-cover.jpg'},
  @{url='https://pbs.twimg.com/media/G_JeMluaoAI1lSE?format=jpg&name=large'; name='01-boris-setup.jpg'}
)

foreach ($img in $images) {
  $dest = Join-Path $dir $img.name
  Invoke-WebRequest -Uri $img.url -OutFile $dest
  Write-Host "Downloaded: $($img.name)"
}

Write-Host "Done"
Get-ChildItem $dir | Select-Object Name, @{N='Size(KB)';E={[math]::Round($_.Length/1KB,1)}}
