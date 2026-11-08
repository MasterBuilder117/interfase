// Pure maths shared by the page and the Node tests: dice laws, NOAA climatology lookup and the antipodal search.
(function(root){
'use strict';

// Dice: the standard pair and Sicherman's pair (1978) share the law of the sum but not the share of doubles.
const DICE={trad:{name:'Tradicionales',a:[1,2,3,4,5,6],b:[1,2,3,4,5,6]},sich:{name:'Sicherman',a:[1,2,2,3,3,4],b:[1,3,4,5,6,8]}};
const diceCount=(k,test)=>{let n=0;for(const a of DICE[k].a)for(const b of DICE[k].b)n+=test(a,b)?1:0;return n};

// NOAA climatology: NCEP/NCAR Reanalysis 1 monthly means 1991-2020 on a 5° grid (lat 90..-90, lon 0..355),
// 13 slices (Jan..Dec, annual mean), packed as little-endian uint16: value = base + n/100.
const decodeClimate=(json,atobFn)=>{const dec=b=>{const s=atobFn(b),out=new Uint16Array(s.length/2);for(let i=0;i<out.length;i++)out[i]=s.charCodeAt(2*i)|s.charCodeAt(2*i+1)<<8;return out};return{...json,T:dec(json.t.data),P:dec(json.p.data)}};
// Bilinear interpolation between grid nodes; continuous across the date line and single-valued at the poles.
const climateAt=(arr,base,month,lonDeg,latDeg)=>{const L=72,N=37,lo=(((lonDeg%360)+360)%360)/5,la=(90-Math.max(-90,Math.min(90,latDeg)))/5,i0=Math.floor(lo)%L,i1=(i0+1)%L,fx=lo-Math.floor(lo),j0=Math.min(N-1,Math.floor(la)),j1=Math.min(N-1,j0+1),fy=la-j0,o=month*N*L,g=(j,i)=>base+arr[o+j*L+i]/100;return(g(j0,i0)*(1-fx)+g(j0,i1)*fx)*(1-fy)+(g(j1,i0)*(1-fx)+g(j1,i1)*fx)*fy};
const climateFields=(C,month,lonDeg,latDeg)=>({temperature:climateAt(C.T,C.t.base,month,lonDeg,latDeg),pressure:climateAt(C.P,C.p.base,month,lonDeg,latDeg)});
// D(p) = F(p) - F(-p), the vector Borsuk-Ulam says must vanish somewhere.
const climateDelta=(C,month,lonDeg,latDeg)=>{const p=climateFields(C,month,lonDeg,latDeg),a=climateFields(C,month,lonDeg+180,-latDeg);return{dt:p.temperature-a.temperature,dp:p.pressure-a.pressure}};
// D(p)=0 searched numerically: a 1° sweep, then two local refinements. ΔT and ΔP are scaled so both units weigh alike.
const findCoincidence=(C,month)=>{const score=(lo,la)=>{const q=climateDelta(C,month,lo,la);return(q.dt/10)**2+(q.dp/5)**2};let best=[0,0,Infinity];for(let la=-89;la<=89;la++)for(let lo=-180;lo<180;lo++){const v=score(lo,la);if(v<best[2])best=[lo,la,v]}for(const [span,step] of [[1.5,.1],[.15,.01]]){const [lo0,la0]=best;for(let la=la0-span;la<=la0+span;la+=step)for(let lo=lo0-span;lo<=lo0+span;lo+=step){const v=score(lo,Math.max(-90,Math.min(90,la)));if(v<best[2])best=[lo,la,v]}}const lon=((best[0]+540)%360)-180,lat=best[1];return{lon,lat,...climateDelta(C,month,lon,lat)}};

const api={DICE,diceCount,decodeClimate,climateAt,climateFields,climateDelta,findCoincidence};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LabMath=api;
})(typeof window!=='undefined'?window:globalThis);
