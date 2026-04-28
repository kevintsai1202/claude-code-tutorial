$dir = 'E:\github\claude-code-tutorial\images\claude-skills-guide-2026-01'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$images = @(
  @{url='https://pbs.twimg.com/media/G_NbFNbbcAAw1vP?format=jpg&name=large'; name='00-cover.jpg'},
  @{url='https://pbs.twimg.com/media/G_NiKyCaIAA_BMy?format=jpg&name=large'; name='01-code-execution.jpg'},
  @{url='https://pbs.twimg.com/media/G_NioCzaIAAzN1B?format=jpg&name=large'; name='02-skill-creator.jpg'},
  @{url='https://pbs.twimg.com/media/G_Njv-GaIAMXTBw?format=jpg&name=large'; name='03-prompt-to-build.jpg'},
  @{url='https://pbs.twimg.com/media/G_NkslOaYAA6Q9Q?format=png&name=large'; name='04-provide-context.png'},
  @{url='https://pbs.twimg.com/media/G_Nm0h3XMAAiC5W?format=jpg&name=large'; name='05-copy-to-skills.jpg'},
  @{url='https://pbs.twimg.com/media/G_NtVZLXgAEB453?format=jpg&name=900x900'; name='06-brand-voice.jpg'},
  @{url='https://pbs.twimg.com/media/G_NujWPWwAAohMT?format=jpg&name=large'; name='07-pdf-generator.jpg'},
  @{url='https://pbs.twimg.com/media/G_Nw-gyWsAI3YLn?format=jpg&name=large'; name='08-doc-summarizer.jpg'},
  @{url='https://pbs.twimg.com/media/G_Nws1JbAAAx0xs?format=jpg&name=large'; name='09-meeting-transcripts.jpg'},
  @{url='https://pbs.twimg.com/media/G_NxjEgboAAQ-2a?format=jpg&name=large'; name='10-skills-msp.jpg'},
  @{url='https://pbs.twimg.com/media/G_NyUgdaIAIf-F4?format=jpg&name=large'; name='11-claude-docs.jpg'},
  @{url='https://pbs.twimg.com/media/G_NymgVaIAAbUy2?format=jpg&name=large'; name='12-awesome-skills.jpg'}
)

foreach ($img in $images) {
  $dest = Join-Path $dir $img.name
  Invoke-WebRequest -Uri $img.url -OutFile $dest
  Write-Host "Downloaded: $($img.name)"
}

Write-Host "Done"
Get-ChildItem $dir | Select-Object Name, @{N='Size(KB)';E={[math]::Round($_.Length/1KB,1)}}
