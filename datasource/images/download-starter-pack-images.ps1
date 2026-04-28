$dir = 'E:\github\claude-code-tutorial\images\claude-code-starter-pack-2026-01'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$images = @(
  # P.1 images
  @{url='https://pbs.twimg.com/media/G-fnwZ_bQAESIq2?format=jpg&name=large'; name='00-cover-p1.jpg'},
  @{url='https://pbs.twimg.com/media/G-fwuYga0AADwaX?format=jpg&name=large'; name='01-boris-setup.jpg'},
  @{url='https://pbs.twimg.com/media/G-fyh2OaUAAYYpT?format=jpg&name=large'; name='02-learning-path.jpg'},
  @{url='https://pbs.twimg.com/media/G-f1GmBXEAAFRx6?format=jpg&name=900x900'; name='03-best-prompt.jpg'},
  @{url='https://pbs.twimg.com/media/G-f15heWIAAden1?format=jpg&name=large'; name='04-skills-setup.jpg'},
  @{url='https://pbs.twimg.com/media/G-gAiclaAAAsiq5?format=jpg&name=large'; name='05-skillsmsp.jpg'},
  @{url='https://pbs.twimg.com/media/G-gBb0ZboAAZ4_s?format=jpg&name=large'; name='06-mcp-tools.jpg'},
  @{url='https://pbs.twimg.com/media/G-gBz6XbQAQT7jk?format=jpg&name=large'; name='07-prompt-library.jpg'},
  @{url='https://pbs.twimg.com/media/G-gCGhYboAANXVz?format=png&name=large'; name='08-awesome-skills.png'},
  @{url='https://pbs.twimg.com/media/G-gDENkbQAIs6r4?format=jpg&name=large'; name='09-awesome-cc.jpg'},
  # P.2 images
  @{url='https://pbs.twimg.com/media/G-qEvrlbQAMS32p?format=jpg&name=large'; name='10-cover-p2.jpg'},
  @{url='https://pbs.twimg.com/media/G-qS0qjbQAITQ7Q?format=jpg&name=large'; name='11-complete-guide-v2.jpg'},
  @{url='https://pbs.twimg.com/media/G-qTb2la0AAO7qZ?format=png&name=large'; name='12-how-to-use.png'},
  @{url='https://pbs.twimg.com/media/G-qT0PuaEAAcyYk?format=jpg&name=large'; name='13-cc-in-cc.jpg'},
  @{url='https://pbs.twimg.com/media/G-qUz6sbQAIryqj?format=jpg&name=large'; name='14-plan-mode.jpg'},
  @{url='https://pbs.twimg.com/media/G-qVqzRbUAAC8PZ?format=jpg&name=large'; name='15-cli-guide.jpg'},
  @{url='https://pbs.twimg.com/media/G-qWvQpbQAEh-sX?format=jpg&name=large'; name='16-prompt-overview.jpg'},
  @{url='https://pbs.twimg.com/media/G-qXwPNa4AAVOfB?format=jpg&name=large'; name='17-llm-prompting.jpg'},
  @{url='https://pbs.twimg.com/media/G-qYJSeaIAABluQ?format=jpg&name=large'; name='18-reddit-guide.jpg'},
  @{url='https://pbs.twimg.com/media/G-qZJXVaoAARJMy?format=jpg&name=large'; name='19-skillsmp.jpg'},
  @{url='https://pbs.twimg.com/media/G-qZZoJbsAANEiM?format=jpg&name=large'; name='20-skills-library.jpg'},
  @{url='https://pbs.twimg.com/media/G-qafyabQAQY41F?format=jpg&name=large'; name='21-system-prompts.jpg'},
  @{url='https://pbs.twimg.com/media/G-qavEMbQAUJw8-?format=jpg&name=large'; name='22-command-library.jpg'},
  @{url='https://pbs.twimg.com/media/G-qbiFcbQAQtfi6?format=jpg&name=large'; name='23-superclaude.jpg'},
  @{url='https://pbs.twimg.com/media/G-qcZHTbQAI-q8a?format=jpg&name=large'; name='24-cc-best-practices.jpg'},
  @{url='https://pbs.twimg.com/media/G-qc-kDbQAcEASn?format=jpg&name=large'; name='25-claude-md.jpg'},
  @{url='https://pbs.twimg.com/media/G-qdl0hbQAMeKRT?format=jpg&name=large'; name='26-subreddits.jpg'},
  @{url='https://pbs.twimg.com/media/G-qdz9Ha4AAZIKC?format=jpg&name=large'; name='27-chrome-ext.jpg'},
  @{url='https://pbs.twimg.com/media/G-qeezJbQAIDumq?format=jpg&name=large'; name='28-anthropic-academy.jpg'}
)

foreach ($img in $images) {
  $dest = Join-Path $dir $img.name
  Invoke-WebRequest -Uri $img.url -OutFile $dest
  Write-Host "Downloaded: $($img.name)"
}

Write-Host "Done - Total: $($images.Count) images"
Get-ChildItem $dir | Select-Object Name, @{N='Size(KB)';E={[math]::Round($_.Length/1KB,1)}}
