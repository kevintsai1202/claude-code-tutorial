$dir = 'E:\github\claude-code-tutorial\images\claude-guide-2026-03'

$images = @(
  @{url='https://pbs.twimg.com/media/HCgBU6JaUAAk2-x?format=jpg&name=900x900'; name='01-pricing.jpg'},
  @{url='https://pbs.twimg.com/media/HCgC6OQbkAAY-zx?format=jpg&name=large'; name='02-interface.jpg'},
  @{url='https://pbs.twimg.com/media/HCgG9DmacAASFdu?format=png&name=large'; name='03-advanced-prompting.png'},
  @{url='https://pbs.twimg.com/media/HCgKG6-agAA4FcK?format=jpg&name=large'; name='04-connectors.jpg'},
  @{url='https://pbs.twimg.com/media/HCgKi-4awA83TVh?format=jpg&name=large'; name='05-claude-in-chrome.jpg'},
  @{url='https://pbs.twimg.com/media/HCgK_HVawAYKIQY?format=jpg&name=large'; name='06-custom-styling.jpg'},
  @{url='https://pbs.twimg.com/media/HCgLXjaawAIx5bV?format=jpg&name=large'; name='07-projects.jpg'},
  @{url='https://pbs.twimg.com/media/HCgR92zawAACvOV?format=jpg&name=large'; name='08-research-mode.jpg'},
  @{url='https://pbs.twimg.com/media/HCgTLMWb0AAtDwc?format=jpg&name=large'; name='09-cowork.jpg'},
  @{url='https://pbs.twimg.com/media/HCgTzi2aIAADsC8?format=jpg&name=large'; name='10-claude-code.jpg'},
  @{url='https://pbs.twimg.com/media/HCgUyfSb0AAQ27m?format=jpg&name=900x900'; name='11-skills.jpg'},
  @{url='https://pbs.twimg.com/media/HCgVuOXawAMb8AI?format=jpg&name=large'; name='12-cowork-plugins.jpg'}
)

foreach ($img in $images) {
  $dest = Join-Path $dir $img.name
  if (-not (Test-Path $dest)) {
    Invoke-WebRequest -Uri $img.url -OutFile $dest
    Write-Host "Downloaded: $($img.name)"
  } else {
    Write-Host "Skip (exists): $($img.name)"
  }
}

Write-Host "Done"
Get-ChildItem $dir | Select-Object Name, Length
