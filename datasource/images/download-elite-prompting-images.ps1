$dir = 'E:\github\claude-code-tutorial\images\claude-elite-prompting-2026-01'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$images = @(
  @{url='https://pbs.twimg.com/media/G_sJOMSawAAn_96?format=jpg&name=large'; name='00-cover.jpg'},
  @{url='https://pbs.twimg.com/media/G_s9jXZXMAAfI8j?format=jpg&name=large'; name='01-prompt-structure.jpg'},
  @{url='https://pbs.twimg.com/media/G_s-wu4bAAUUvGL?format=jpg&name=large'; name='02-task-context.jpg'},
  @{url='https://pbs.twimg.com/media/G_s_M9yW8AAP-Oo?format=jpg&name=large'; name='03-tone-context.jpg'},
  @{url='https://pbs.twimg.com/media/G_s_ylbbAAQgbs_?format=jpg&name=large'; name='04-task-description.jpg'},
  @{url='https://pbs.twimg.com/media/G_tBHITbcAAeEET?format=jpg&name=large'; name='05-immediate-task.jpg'},
  @{url='https://pbs.twimg.com/media/G_tBqe6bAAA-Z1E?format=png&name=900x900'; name='06-deep-thinking.png'},
  @{url='https://pbs.twimg.com/media/G_tB3csaIAA7lsq?format=jpg&name=large'; name='07-output-formatting.jpg'},
  @{url='https://pbs.twimg.com/media/G_tCFlWbAAEvQvF?format=png&name=large'; name='08-prefilled-response.png'},
  @{url='https://pbs.twimg.com/media/G_tDB9GbAAEFJEU?format=jpg&name=large'; name='09-final-structure.jpg'}
)

foreach ($img in $images) {
  $dest = Join-Path $dir $img.name
  Invoke-WebRequest -Uri $img.url -OutFile $dest
  Write-Host "Downloaded: $($img.name)"
}

Write-Host "Done - Total: $($images.Count) images"
Get-ChildItem $dir | Select-Object Name, @{N='Size(KB)';E={[math]::Round($_.Length/1KB,1)}}
