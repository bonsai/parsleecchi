let S = {xp:0, mood:''};

function setup() {
  let cnv = createCanvas(200, 240);
  cnv.parent('p5-holder');
  cnv.style('width', '100%');
  cnv.style('height', 'auto');
  noLoop();
  readState();
}

function readState() {
  try {
    let raw = localStorage.getItem('paseritchi');
    S = raw ? JSON.parse(raw) : {xp:0, mood:''};
  } catch(e) { S = {xp:0, mood:''}; }
  redraw();
}

window.updateParsley = readState;
window.addEventListener('storage', readState);

function draw() {
  clear();
  const stages = [0,15,45,110,220,400,650];
  let idx = 0;
  for(let j=0;j<stages.length;j++) if(S.xp >= stages[j]) idx = j;
  let p = 0;
  if (idx+1 < stages.length) {
    p = (S.xp - stages[idx]) / (stages[idx+1] - stages[idx]);
  } else { p = 1; }

  let scaleFactor = 0.85 + 0.25 * p;

  push();
  translate(100, 170);
  scale(scaleFactor);

  randomSeed(S.xp + (S.mood||'').length * 997);

  if (idx === 0) {
    noStroke();
    fill(138,136,128);
    ellipse(0, -4, 7, 5);
  } else {
    let nBranches = Math.min(idx * 2 + (idx>=3?2:0), 14);
    if (idx === 1) nBranches = 2;

    let baseCol = [67,160,71];
    if (S.mood === 'pos') baseCol = [46,125,50];
    if (S.mood === 'neg') baseCol = [120,144,156];

    for (let b=0; b<nBranches; b++) {
      let spread = map(b, 0, Math.max(nBranches-1,1), -0.5, 0.5);
      if (nBranches === 1) spread = 0;
      let ang = -HALF_PI + spread;
      let len = map(idx, 1, 6, 30, 90) * random(0.75, 1.2);
      let tipX = random(-4,4);

      // Stem
      stroke(baseCol[0], baseCol[1], baseCol[2]);
      strokeWeight(map(len, 20, 100, 1.2, 2.8));
      noFill();
      beginShape();
      vertex(0,0);
      bezierVertex(tipX*0.3, -len*0.3, tipX*0.7, -len*0.7, tipX, -len);
      endShape();

      // Bushy leaflets (もしゃもしゃ)
      push();
      translate(tipX, -len);
      rotate(spread * 0.6);

      let nClusters = floor(map(len, 20, 100, 3, 8));
      for (let k=0; k<nClusters; k++) {
        let t = k / Math.max(nClusters-1, 1);
        let side = (k%2===0) ? 1 : -1;
        let cx = side * lerp(2, 14, t) * random(0.8, 1.2);
        let cy = -lerp(0, len*0.5, t) * random(0.8, 1.2);
        noStroke();
        fill(baseCol[0], baseCol[1], baseCol[2], 210);
        ellipse(cx, cy, random(6,11), random(5,9));
        fill(baseCol[0]+10, baseCol[1]+15, baseCol[2]+5, 140);
        ellipse(cx*1.1, cy-2, random(4,7), random(3,5));
        fill(baseCol[0]-10, baseCol[1], baseCol[2]-10, 120);
        ellipse(cx*0.5, cy+2, random(3,6), random(2,4));
      }

      // Flower on final stage
      if (idx >= 6 && b%2===0) {
        fill(255, 245, 240); stroke(200,190,180); strokeWeight(0.8);
        for (let f=0; f<5; f++) {
          let fa = TWO_PI/5 * f;
          ellipse(cos(fa)*4.5, sin(fa)*4.5, 5, 5);
        }
        fill(255,220,100); noStroke(); ellipse(0,0,3,3);
      }
      pop();
    }
  }
  pop();
}
