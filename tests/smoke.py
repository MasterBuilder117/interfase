from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
required=['index.html','styles.css','projects.js','app.js','sw.js','manifest.webmanifest','assets/icon.svg','assets/icon-192.png','assets/icon-512.png']
missing=[p for p in required if not (root/p).exists()]
assert not missing,f'Missing: {missing}'
html=(root/'index.html').read_text()
js=(root/'app.js').read_text()
data=(root/'projects.js').read_text()
assert '<main id="contenido">' in html and '<dialog' in html
assert html.count('<section')>=5
assert len(re.findall(r"id:'[^']+',index:'",data))==8
for key in ['parques','markov','gradient','activation','logistic','montecarlo','earth','table']:
 assert key in js
assert "id:'earth-theorem'" in data and "id:'wobbly-table'" in data
assert data.count('proofSteps:') == 2
assert "viewModes:['2D','3D']" in data
manifest=json.loads((root/'manifest.webmanifest').read_text())
assert manifest['display']=='standalone' and len(manifest['icons'])==2
print('smoke: ok — 8 proyectos, PWA y visualizadores presentes')
