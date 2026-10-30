from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
required=['index.html','styles.css','projects.js','app.js','sw.js','manifest.webmanifest','assets/icon.svg','assets/icon-192.png','assets/icon-512.png','assets/earth-atmos-2048.jpg','assets/parques-forja-infernal.svg']
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
# Accessibility and responsive regressions found by independent review.
assert 'aria-pressed="${!i}"' in js
assert 'aria-describedby="viz-description"' in js
assert 'aria-label="Visualización interactiva de ${esc(p.title)}"' in js
assert "activeDraw?.()" in js
assert 'activeDraw=()=>{cancelAnimationFrame(raf);draw()}' in js
assert "delete labState[genericKey]" in js
assert 'data-markov-start' in js and 'activation-probe' in js and 'logistic-x0' in js and 'data-lab-action="mc-add"' in js
assert 'const ROOT_EPS=1e-6' in js
assert js.count('Math.abs(gap)<ROOT_EPS') >= 2
assert 'rooted=Math.abs(gap)<ROOT_EPS' in js
assert 'step="any"' in js
# Mathematical scope: application/illustration, not a proof by animation.
assert 'APLICACIÓN INTERACTIVA' in js
assert 'antiperiodicidad' in data.lower()
assert 'diagrama esquemático' in data.lower()
assert 'tableState' in js and 'predicted=z[0]+z[2]-z[1]' in js
assert 'TABLE_GROUND_SCALE=1' in js
assert 'TERRAIN_DOMAIN_SCALE=TABLE_GROUND_SCALE/TABLE_PROJECT_SCALE' in js
assert 'complexity*5' in js
assert 'gap=z[3]-predicted' in js
assert 'ANIMAR 0° → 90°' in js
assert 'data-type="table" tabindex="0"' in js
assert "external:'https://parques-lab.vercel.app'" in data
assert 'earth-vector-description' in js and 'table-profile-description' in js
assert 'const planeZ=' not in js
assert 'activeStop?.()' in js
assert 'aria-pressed="true" data-earth-layer' in js
assert 'aria-pressed="true" data-table-camera' in js
assert 'table-function-description' in js
assert 'pointercancel' in js and "e.key==='ArrowLeft'" in js
css=(root/'styles.css').read_text()
assert '.table-panel{padding:16px;overflow:visible' in css
assert "html[data-theme='light'] .card-meta{color:var(--muted)}" in css
assert "--coral:#a63824" in css and "--muted:#565750" in css and "html[data-theme='dark']" in css
assert '.viz-controls label:has(input){flex:1 1 100%' in css
# 2026 redesign: original atlas shell and rich domain visualizers.
for token in ['atlas-rail','signal-strip','project-marquee','field-notes']:
 assert token in html, f'missing redesigned shell: {token}'
for token in ['earth-map-shell','earth-layer','map-zoom-in','map-zoom-out','earth-vector-plot','earth-pair-bars','table-lab-shell','table-camera','table-contacts','table-profile','table-diagonal-balance','table-seed','table-complexity','table-derivative','table-bisection','table-trajectories','floorHeight','bisectionState']:
 assert token in js, f'missing advanced visualizer behavior: {token}'
assert 'pointerdown' in js and 'wheel' in js
assert 'analysis-card' in js and 'table-lab-actions' in js
# Every visualizer must expose manipulation beyond a lone slider.
for token in ['data-lab-action="roll"','data-lab-action="markov-step"','data-lab-action="gradient-step"','data-lab-action="activation-compare"','data-lab-action="logistic-step"','data-lab-action="mc-batch"','table-sweep-step','table-random-floor']:
    assert token in js, token
assert 'bindDirectManipulation' in js and 'lab-history' in js
assert 'Interpolación bilineal continua' in js and 'diferencia finita' in js
assert "bisectionState={lo:0,hi:Math.PI/2,step:0}" in js
assert 'campo continuo sintético' in js
assert "cardImage:'assets/parques-forja-infernal.svg'" in data
assert "earthImage.src='assets/earth-atmos-2048.jpg'" in js
assert 'earth-scalar-plot' in js and 'earth-layer-explanation' in js
assert 'Valores puntuales sintéticos' in js and 'no son promedios' in js
assert 'viz-controls-sticky' in css
assert 'Diagrama matemático' in js
readme=(root/'README.md').read_text()
assert 'demostraciones interactivas' not in readme.lower()
manifest=json.loads((root/'manifest.webmanifest').read_text())
assert manifest['display']=='standalone' and len(manifest['icons'])==2
print('smoke: ok — 8 proyectos, PWA y visualizadores presentes')
