(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const grid=$('#project-grid'), search=$('#project-search'), status=$('#results-status'), dialog=$('#project-dialog'), content=$('#dialog-content');
let filter='all';
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
function render(){const q=search.value.trim().toLowerCase();const rows=PROJECTS.filter(p=>(filter==='all'||p.category===filter)&&[p.title,p.subtitle,p.description,...p.concepts].join(' ').toLowerCase().includes(q));status.textContent=`${rows.length} ${rows.length===1?'proyecto visible':'proyectos visibles'}`;grid.innerHTML=rows.length?rows.map(p=>`<article class="project-card ${p.featured?'featured':''}" style="--accent:${p.accent}"><div class="card-visual"><canvas data-visual="${p.visual}" aria-hidden="true"></canvas><span class="card-index">${p.index}</span><span class="card-state">${esc(p.status)}</span></div><div class="card-body"><span class="card-meta">${esc(p.subtitle)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><div class="concepts">${p.concepts.map(x=>`<span>${esc(x)}</span>`).join('')}</div></div><button class="card-open" data-project="${p.id}" aria-label="Abrir ${esc(p.title)}"></button></article>`).join(''):`<div class="empty-state"><b>No hay coincidencias.</b><br>Prueba otro término o elimina el filtro.</div>`;$$('canvas[data-visual]',grid).forEach(drawCard);}
function prep(canvas){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);const c=canvas.getContext('2d');c.scale(d,d);return[c,r.width,r.height]}
function drawCard(canvas){const [c,w,h]=prep(canvas),type=canvas.dataset.visual;c.clearRect(0,0,w,h);c.lineWidth=1.5;
 if(type==='parques'){const colors=['#ff4c52','#36a7ff','#6ee55e','#ffd42a'];c.translate(w/2,h/2);for(let j=0;j<4;j++){c.save();c.rotate(j*Math.PI/2);c.strokeStyle=colors[j];for(let i=0;i<9;i++){c.strokeRect(-9,-h*.39+i*10,18,8)}c.beginPath();c.arc(0,-h*.28,5,0,7);c.fillStyle=colors[j];c.fill();c.restore()}c.strokeStyle='#526074';c.strokeRect(-34,-34,68,68)}
 if(type==='markov'){const pts=[[w*.22,h*.58],[w*.51,h*.26],[w*.79,h*.62]];c.strokeStyle='#425069';for(let i=0;i<3;i++){for(let j=i+1;j<3;j++){c.beginPath();c.moveTo(...pts[i]);c.lineTo(...pts[j]);c.stroke()}}pts.forEach((p,i)=>{c.beginPath();c.arc(...p,22+i*5,0,7);c.strokeStyle='#36a7ff';c.stroke();c.fillStyle='#d7e6f7';c.font='11px monospace';c.fillText(String.fromCharCode(65+i),p[0]-4,p[1]+4)})}
 if(type==='gradient'){c.strokeStyle='#ff3fa4';c.beginPath();for(let x=0;x<w;x++){let y=h*.54+Math.sin(x/w*12)*24+(x-w*.62)**2/(w*8);x?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();c.fillStyle='#ffd42a';c.beginPath();c.arc(w*.36,h*.54+Math.sin(.36*12)*24+(w*.36-w*.62)**2/(w*8),8,0,7);c.fill()}
 if(type==='activation'){const colors=['#6ee55e','#ff3fa4','#36a7ff'];[-1,0,1].forEach((k,j)=>{c.beginPath();for(let x=0;x<w;x++){let z=(x/w*8-4),v=j===0?Math.max(0,z):j===1?1/(1+Math.exp(-z)):Math.tanh(z);let y=h*.72-v*h*.4;x?c.lineTo(x,y):c.moveTo(x,y)}c.strokeStyle=colors[j];c.stroke()})}
 if(type==='logistic'){c.fillStyle='#ff6b35';let x=.317,r=3.82;for(let i=0;i<800;i++){x=r*x*(1-x);if(i>20)c.fillRect((i-20)/780*w,h*(1-x),1.2,1.2)}}
 if(type==='montecarlo'){let seed=17,rand=()=>((seed=(seed*16807)%2147483647)-1)/2147483646;c.strokeStyle='#526074';c.strokeRect(w*.15,h*.08,h*.75,h*.75);c.beginPath();c.arc(w*.15+h*.375,h*.455,h*.375,0,7);c.stroke();for(let i=0;i<240;i++){let x=rand(),y=rand(),inside=(x-.5)**2+(y-.5)**2<=.25;c.fillStyle=inside?'#b58cff':'#3b4658';c.fillRect(w*.15+x*h*.75,h*.08+y*h*.75,2,2)}}}
function openProject(id){const p=PROJECTS.find(x=>x.id===id);if(!p)return;content.innerHTML=`<div class="dialog-hero"><p class="eyebrow">PROYECTO ${p.index} · ${esc(p.status)}</p><h2 id="dialog-title">${esc(p.title)}</h2><p>${esc(p.question)}</p></div><div class="dialog-grid"><div class="dialog-main"><h3>Visualizador</h3><div class="visualizer"><canvas id="active-viz" data-type="${p.visual}"></canvas><div class="viz-controls" id="viz-controls"></div></div><h3>Hipótesis de trabajo</h3><p>${esc(p.description)}</p><div class="dialog-actions">${p.external?`<a class="button primary" href="${p.external}">Abrir aplicación completa</a>`:''}<button class="button ghost" type="button" id="rerun-viz">Reiniciar experimento</button></div></div><aside class="dialog-side"><p class="eyebrow">TEORÍA DETRÁS</p><h3>Conceptos esenciales</h3><ul class="theory-list">${p.theory.map(t=>`<li><b>${esc(t[0])}</b><span>${esc(t[1])}</span></li>`).join('')}</ul><p class="eyebrow" style="margin-top:34px">PREGUNTA ABIERTA</p><p>${esc(p.question)}</p></aside></div>`;dialog.showModal();document.body.style.overflow='hidden';location.hash=`proyecto/${p.id}`;setupViz(p.visual);}
function setupViz(type){
 const canvas=$('#active-viz'),controls=$('#viz-controls');
 let raf=0,seed=13;
 const size=()=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=260*d;const c=canvas.getContext('2d');c.setTransform(d,0,0,d,0,0);return[c,r.width,260]};
 const range=(label,min,max,step,val)=>{controls.innerHTML=`<label>${label}</label><input id="viz-range" type="range" min="${min}" max="${max}" step="${step}" value="${val}"><output id="viz-value">${val}</output>`};
 const input=()=>$('#viz-range');
 function draw(){
  cancelAnimationFrame(raf);
  const [c,w,h]=size();
  c.clearRect(0,0,w,h);c.strokeStyle='#354154';c.fillStyle='#dce5f0';c.font='11px monospace';c.lineWidth=1.5;
  if(type==='parques'){
   range('riesgo táctico',0,1,.01,.4);
   const paint=()=>{const v=+input().value;$('#viz-value').textContent=v.toFixed(2);c.clearRect(0,0,w,h);c.fillStyle='#9da8b8';c.fillText('VALOR ESPERADO DE CUATRO ACCIONES',14,20);['Avanzar','Capturar','Asegurar','Liberar'].forEach((x,i)=>{const z=[.48,.25+v*.58,.70-v*.24,.38+v*.18][i];c.fillStyle=['#36a7ff','#ff3fa4','#6ee55e','#ffd42a'][i];c.fillRect(110,48+i*46,(w-145)*z,18);c.fillStyle='#dce5f0';c.fillText(x,14,61+i*46);c.fillText(z.toFixed(2),Math.min(w-35,118+(w-145)*z),61+i*46)})};
   input().oninput=paint;paint();
  }
  if(type==='markov'){
   range('P(A→B)',0.05,.95,.05,.35);
   const paint=()=>{const q=+input().value;let dist=[1,0,0];$('#viz-value').textContent=q.toFixed(2);c.clearRect(0,0,w,h);for(let t=0;t<22;t++){const next=[dist[0]*(1-q)+dist[2]*.2,dist[0]*q+dist[1]*.62,dist[1]*.38+dist[2]*.8];['#36a7ff','#ff3fa4','#6ee55e'].forEach((col,j)=>{c.fillStyle=col;c.fillRect(24+t*(w-50)/22,h-18-dist[j]*170,5,dist[j]*170)});dist=next}c.fillStyle='#dce5f0';c.fillText('tiempo →',w-76,h-4)};
   input().oninput=paint;paint();
  }
  if(type==='gradient'){
   range('tasa α',.01,.75,.01,.12);let x=-2.7;
   const f=z=>.09*z**4-.48*z**2+.16*z,df=z=>.36*z**3-.96*z+.16;
   const paint=()=>{c.clearRect(0,0,w,h);c.strokeStyle='#ff3fa4';c.beginPath();for(let px=0;px<w;px++){let z=px/w*7-3.5,y=145-f(z)*45;px?c.lineTo(px,y):c.moveTo(px,y)}c.stroke();let y=145-f(x)*45;c.fillStyle='#ffd42a';c.beginPath();c.arc((x+3.5)/7*w,y,8,0,7);c.fill();c.fillStyle='#dce5f0';c.fillText(`x=${x.toFixed(3)}  f(x)=${f(x).toFixed(3)}`,14,20);x-=+input().value*df(x);if(Math.abs(x)<20)raf=requestAnimationFrame(paint)};
   input().oninput=()=>{$('#viz-value').textContent=input().value;x=-2.7;paint()};paint();
  }
  if(type==='activation'){
   controls.innerHTML='<label>función</label><select id="viz-select"><option>ReLU</option><option>Sigmoide</option><option>tanh</option></select><output id="viz-value">ReLU</output>';
   const paint=()=>{const fn=$('#viz-select').value;$('#viz-value').textContent=fn;c.clearRect(0,0,w,h);c.strokeStyle='#354154';c.beginPath();c.moveTo(0,h/2);c.lineTo(w,h/2);c.moveTo(w/2,0);c.lineTo(w/2,h);c.stroke();c.strokeStyle='#6ee55e';c.beginPath();for(let px=0;px<w;px++){let z=px/w*10-5,v=fn==='ReLU'?Math.max(0,z):fn==='Sigmoide'?1/(1+Math.exp(-z)):Math.tanh(z);let y=h/2-v*38;px?c.lineTo(px,y):c.moveTo(px,y)}c.stroke();c.strokeStyle='#ff3fa4';c.beginPath();for(let px=0;px<w;px++){let z=px/w*10-5,v=fn==='ReLU'?(z>0?1:0):fn==='Sigmoide'?Math.exp(-z)/(1+Math.exp(-z))**2:1-Math.tanh(z)**2;let y=h-38-v*55;px?c.lineTo(px,y):c.moveTo(px,y)}c.stroke()};
   $('#viz-select').onchange=paint;paint();
  }
  if(type==='logistic'){
   range('parámetro r',2.5,4,.001,3.72);
   const paint=()=>{let r=+input().value,x=.201;$('#viz-value').textContent=r.toFixed(3);c.clearRect(0,0,w,h);c.strokeStyle='#354154';c.beginPath();c.moveTo(0,h);c.lineTo(w,0);c.stroke();c.strokeStyle='#ff6b35';c.beginPath();for(let px=0;px<w;px++){let z=px/w,y=h-r*z*(1-z)*h;px?c.lineTo(px,y):c.moveTo(px,y)}c.stroke();c.strokeStyle='#ffd42a';c.beginPath();let y=x;for(let i=0;i<35;i++){let n=r*x*(1-x);c.lineTo(x*w,h-y*h);c.lineTo(x*w,h-n*h);c.lineTo(n*w,h-n*h);y=n;x=n}c.stroke()};
   input().oninput=paint;paint();
  }
  if(type==='montecarlo'){
   range('muestras',100,6000,100,1200);
   const paint=()=>{let n=+input().value,inside=0;seed=13;const rnd=()=>((seed=(seed*16807)%2147483647)-1)/2147483646;c.clearRect(0,0,w,h);let side=Math.min(h-34,w*.66),ox=14,oy=12;c.strokeStyle='#516075';c.strokeRect(ox,oy,side,side);c.beginPath();c.arc(ox+side/2,oy+side/2,side/2,0,7);c.stroke();for(let i=0;i<n;i++){let x=rnd(),y=rnd(),ok=(x-.5)**2+(y-.5)**2<=.25;inside+=ok;c.fillStyle=ok?'#b58cff':'#354154';c.fillRect(ox+x*side,oy+y*side,1.5,1.5)}let pi=4*inside/n;c.fillStyle='#dce5f0';c.fillText(`π ≈ ${pi.toFixed(5)}`,side+35,80);c.fillText(`error ${Math.abs(Math.PI-pi).toFixed(5)}`,side+35,105);$('#viz-value').textContent=n};
   input().oninput=paint;paint();
  }
 }
 draw();
 $('#rerun-viz').onclick=draw;
}
function close(){dialog.close();document.body.style.overflow='';if(location.hash.startsWith('#proyecto/'))history.replaceState(null,'',location.pathname+'#proyectos')}
grid.addEventListener('click',e=>{const b=e.target.closest('[data-project]');if(b)openProject(b.dataset.project)});$('.dialog-close').onclick=close;dialog.addEventListener('click',e=>{if(e.target===dialog)close()});dialog.addEventListener('close',()=>{document.body.style.overflow='' });
search.oninput=render;document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();search.focus()}if(e.key==='Escape'&&dialog.open)close()});$$('[data-filter]').forEach(b=>b.onclick=()=>{$$('[data-filter]').forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');filter=b.dataset.filter;render()});
$('.nav-toggle').onclick=e=>{const n=$('#main-nav'),on=n.classList.toggle('is-open');e.currentTarget.setAttribute('aria-expanded',on)};$$('#main-nav a').forEach(a=>a.onclick=()=>{$('#main-nav').classList.remove('is-open');$('.nav-toggle').setAttribute('aria-expanded','false')});
const theme=localStorage.getItem('interfase-theme');if(theme)document.documentElement.dataset.theme=theme;$('.theme-toggle').onclick=()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.setItem('interfase-theme',t)};
function map(){const nodes=[['Probabilidad',18,48,'#36a7ff'],['Markov',36,27,'#36a7ff'],['Decisión',52,51,'#ffd42a'],['Optimización',70,28,'#ff3fa4'],['Aprendizaje',84,53,'#6ee55e'],['Dinámica',39,76,'#ff6b35'],['Simulación',68,78,'#b58cff']];const edges=[[0,1],[0,2],[0,5],[1,2],[2,3],[2,4],[2,6],[3,4],[5,6],[6,4]];$('#theory-map').innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">${edges.map(e=>`<line x1="${nodes[e[0]][1]}" y1="${nodes[e[0]][2]}" x2="${nodes[e[1]][1]}" y2="${nodes[e[1]][2]}"/>`).join('')}${nodes.map((n,i)=>`<g><circle class="pulse" cx="${n[1]}" cy="${n[2]}" r="9" fill="none" stroke="${n[3]}" style="animation-delay:${i*.23}s"/><circle cx="${n[1]}" cy="${n[2]}" r="4" stroke="${n[3]}"/><text x="${n[1]}" y="${n[2]+13}" text-anchor="middle">${n[0]}</text></g>`).join('')}</svg>`}
window.addEventListener('resize',()=>$$('canvas[data-visual]',grid).forEach(drawCard));$('#year').textContent=new Date().getFullYear();render();map();const hash=location.hash.match(/^#proyecto\/(.+)$/);if(hash)setTimeout(()=>openProject(hash[1]),0);if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js');})();