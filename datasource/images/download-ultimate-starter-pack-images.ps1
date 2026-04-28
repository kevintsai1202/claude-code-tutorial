$dir = 'E:\github\claude-code-tutorial\images\claude-ultimate-starter-pack-2026-02'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$images = @(
  @{url='https://pbs.twimg.com/media/HAMdKSKaQAEMF6x?format=jpg&name=large'; name='00-cover.jpg'},
  @{url='https://pbs.twimg.com/media/HAMK4k0asAAI-Dn?format=jpg&name=large'; name='01-learning-path.jpg'},
  @{url='https://pbs.twimg.com/media/HAMKpm9b0AELPpD?format=jpg&name=large'; name='02-master-skills.jpg'},
  @{url='https://pbs.twimg.com/media/HAMLposaUAETax3?format=jpg&name=large'; name='03-cc-20-guide.jpg'},
  @{url='https://pbs.twimg.com/media/HAMMiUvbIAAcZ9h?format=jpg&name=large'; name='04-quickstart.jpg'},
  @{url='https://pbs.twimg.com/media/HAMM6oYakAAsGrV?format=jpg&name=large'; name='05-beginners-guide.jpg'},
  @{url='https://pbs.twimg.com/media/HAMOQLRaUAAq2i8?format=png&name=large'; name='06-boris-setup.png'},
  @{url='https://pbs.twimg.com/media/HAMPKajaoAEqPIA?format=jpg&name=large'; name='07-builder-tips.jpg'},
  @{url='https://pbs.twimg.com/media/HAMPhZIaYAAiVNB?format=jpg&name=large'; name='08-official-best-practices.jpg'},
  @{url='https://pbs.twimg.com/media/HAMP1KbaUAAyAiO?format=png&name=large'; name='09-reddit-tips.png'},
  @{url='https://pbs.twimg.com/media/HAMQKcTbQAA0t_n?format=jpg&name=large'; name='10-cc-for-everyone.jpg'},
  @{url='https://pbs.twimg.com/media/HAMQXD8bsAAbla_?format=jpg&name=large'; name='11-prompt-library.jpg'},
  @{url='https://pbs.twimg.com/media/HAMQg35bQAACYpE?format=jpg&name=large'; name='12-prompt-optimizer.jpg'},
  @{url='https://pbs.twimg.com/media/HAMQv_-bcAAeHRw?format=jpg&name=large'; name='13-claude-directory.jpg'},
  @{url='https://pbs.twimg.com/media/HAMRgY7bkAAVLri?format=jpg&name=large'; name='14-skills-marketplace.jpg'},
  @{url='https://pbs.twimg.com/media/HAMRqcDawAAThla?format=jpg&name=large'; name='15-cc-marketplace.jpg'},
  @{url='https://pbs.twimg.com/media/HAMSfR8aQAA8BtN?format=jpg&name=large'; name='16-slash-commands.jpg'},
  @{url='https://pbs.twimg.com/media/HAMUWOUbMAISsAv?format=jpg&name=large'; name='17-claude-in-chrome.jpg'},
  @{url='https://pbs.twimg.com/media/HAMX-3-bcAMoXMZ?format=jpg&name=large'; name='18-style-selection.jpg'}
)

foreach ($img in $images) {
  $dest = Join-Path $dir $img.name
  Invoke-WebRequest -Uri $img.url -OutFile $dest
  Write-Host "Downloaded: $($img.name)"
}

Write-Host "Done - Total: $($images.Count) images"
Get-ChildItem $dir | Select-Object Name, @{N='Size(KB)';E={[math]::Round($_.Length/1KB,1)}}
