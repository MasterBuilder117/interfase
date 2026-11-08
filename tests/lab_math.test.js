// Logic tests for lab-math.js: dice laws, NOAA climatology lookup and the antipodal search.
// Run: node --test tests/lab_math.test.js
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const M=require('../lab-math.js');

const atobNode=s=>Buffer.from(s,'base64').toString('binary');
const C=M.decodeClimate(JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/data/noaa-climatology.json'),'utf8')),atobNode);

test('Sicherman dice have the same law of the sum as standard dice',()=>{
  for(let sum=2;sum<=12;sum++)assert.equal(M.diceCount('sich',(a,b)=>a+b===sum),M.diceCount('trad',(a,b)=>a+b===sum),`sum ${sum}`);
});

test('Sicherman faces are the expansion of the factored generating function',()=>{
  const mul=(p,q)=>{const r=Array(p.length+q.length-1).fill(0);p.forEach((x,i)=>q.forEach((y,j)=>{r[i+j]+=x*y}));return r};
  const faces=poly=>poly.flatMap((c,k)=>Array(c).fill(k));
  const X=[0,1],onePlusX=[1,1],tri=[1,1,1],cyc=[1,-1,1];
  assert.deepEqual(faces(mul(mul(X,onePlusX),tri)),M.DICE.sich.a);
  assert.deepEqual(faces(mul(mul(mul(mul(X,onePlusX),tri),cyc),cyc)),M.DICE.sich.b);
});

test('doubles: 6/36 with standard dice, 4/36 with Sicherman; 6-6 is impossible with Sicherman',()=>{
  assert.equal(M.diceCount('trad',(a,b)=>a===b),6);
  assert.equal(M.diceCount('sich',(a,b)=>a===b),4);
  assert.equal(M.diceCount('trad',(a,b)=>a===b&&(a===1||a===6)),2);
  assert.equal(M.diceCount('sich',(a,b)=>a===b&&(a===1||a===6)),1);
});

test('climatology has 13 slices of 37x72 nodes and plausible values',()=>{
  assert.equal(C.T.length,13*37*72);
  assert.equal(C.P.length,13*37*72);
  const annual=12,eq=M.climateAt(C.T,C.t.base,annual,0,0),south=M.climateAt(C.T,C.t.base,annual,0,-90),north=M.climateAt(C.T,C.t.base,annual,0,90);
  assert.ok(eq>22&&eq<30,`equator ${eq}`);
  assert.ok(south<-35,`South Pole ${south}`);
  assert.ok(north<-5&&north>south,`North Pole ${north}`);
  const slp=M.climateAt(C.P,C.p.base,annual,0,-60);
  assert.ok(slp>975&&slp<1000,`Southern Ocean ${slp}`);
});

test('interpolation is continuous across the date line and single-valued at the poles',()=>{
  for(const lat of [-62.5,0,37.5]){
    const a=M.climateAt(C.T,C.t.base,12,359.999,lat),b=M.climateAt(C.T,C.t.base,12,0,lat),c=M.climateAt(C.T,C.t.base,12,-180.0001,lat),d=M.climateAt(C.T,C.t.base,12,180,lat);
    assert.ok(Math.abs(a-b)<.01,`wrap at 0° lat ${lat}`);
    assert.ok(Math.abs(c-d)<.01,`wrap at 180° lat ${lat}`);
  }
  const p=[0,90,-135].map(lon=>M.climateAt(C.P,C.p.base,0,lon,90));
  assert.ok(Math.max(...p)-Math.min(...p)<1e-9,'North Pole independent of longitude');
});

test('D is odd: D(-p) = -D(p)',()=>{
  for(const [lon,lat] of [[35,20],[-72,-22],[118.3,61.7]]){
    const d=M.climateDelta(C,12,lon,lat),e=M.climateDelta(C,12,lon+180,-lat);
    assert.ok(Math.abs(d.dt+e.dt)<1e-9&&Math.abs(d.dp+e.dp)<1e-9);
  }
});

test('the search finds an antipodal coincidence in the annual mean and in January',()=>{
  for(const month of [12,0]){
    const r=M.findCoincidence(C,month);
    assert.ok(Math.abs(r.dt)<.1&&Math.abs(r.dp)<.1,`month ${month}: ΔT=${r.dt} ΔP=${r.dp}`);
    assert.ok(r.lon>=-180&&r.lon<=180&&r.lat>=-90&&r.lat<=90);
  }
});
