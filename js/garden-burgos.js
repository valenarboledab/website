// Edificio Burgos · back garden, built procedurally for the 3D scroll hero.
// Realism pass: textured stucco walls, teak deck, stone pavers, 50k wind-blown grass blades,
// leaf-card plants and cypresses, kamado grill, fire bowl, hot tub with moving water,
// and Nala playing fetch with the gold architect.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

const rnd=(()=>{let s=7;return()=>{s=(s*16807)%2147483647;return s/2147483647}})();
const cv=(w,h,draw)=>{const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t};
const noise=(x,w,h,a,base)=>{const im=x.getImageData(0,0,w,h);for(let i=0;i<im.data.length;i+=4){const n=(Math.random()-.5)*a;im.data[i]+=n;im.data[i+1]+=n;im.data[i+2]+=n}x.putImageData(im,0,0)};
const rep=(t,u,v)=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(u,v);return t};

// ---------- procedural textures ----------
const stucco=()=>cv(512,512,(x,w,h)=>{x.fillStyle='#e4d9c6';x.fillRect(0,0,w,h);for(let i=0;i<2600;i++){x.fillStyle=`rgba(${120+rnd()*60},${105+rnd()*50},${85+rnd()*40},${rnd()*.06})`;const r=2+rnd()*14;x.beginPath();x.arc(rnd()*w,rnd()*h,r,0,7);x.fill()}noise(x,w,h,18)});
const teak=()=>cv(256,1024,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'#a77d55');g.addColorStop(.5,'#b98d62');g.addColorStop(1,'#9f7650');x.fillStyle=g;x.fillRect(0,0,w,h);
  for(let i=0;i<70;i++){x.strokeStyle=`rgba(70,45,25,${.05+rnd()*.12})`;x.lineWidth=.6+rnd()*1.6;x.beginPath();let px=rnd()*w;x.moveTo(px,0);for(let y=0;y<h;y+=16){px+=(rnd()-.5)*3;x.lineTo(px,y)}x.stroke()}
  for(let i=0;i<3;i++){const cx=rnd()*w,cy=rnd()*h;for(let r=3;r<16;r+=2.5){x.strokeStyle='rgba(80,50,28,.18)';x.beginPath();x.ellipse(cx,cy,r*.6,r*1.8,0,0,7);x.stroke()}}noise(x,w,h,10)});
const stone=()=>cv(256,256,(x,w,h)=>{x.fillStyle='#d6cfc2';x.fillRect(0,0,w,h);for(let i=0;i<900;i++){x.fillStyle=`rgba(${90+rnd()*80},${85+rnd()*70},${75+rnd()*60},${.08+rnd()*.12})`;x.fillRect(rnd()*w,rnd()*h,1+rnd()*3,1+rnd()*3)}noise(x,w,h,16)});
const soil=()=>cv(256,256,(x,w,h)=>{x.fillStyle='#5a4a37';x.fillRect(0,0,w,h);for(let i=0;i<1600;i++){x.fillStyle=`rgba(${40+rnd()*60},${32+rnd()*40},${22+rnd()*30},.5)`;x.fillRect(rnd()*w,rnd()*h,2,2)}});
const turf=()=>cv(512,512,(x,w,h)=>{x.fillStyle='#5f7f37';x.fillRect(0,0,w,h);for(let i=0;i<9000;i++){x.strokeStyle=`rgba(${60+rnd()*60},${100+rnd()*60},${30+rnd()*30},.55)`;x.lineWidth=1;const px=rnd()*w,py=rnd()*h;x.beginPath();x.moveTo(px,py);x.lineTo(px+(rnd()-.5)*4,py-4-rnd()*6);x.stroke()}});
const linen=()=>cv(256,256,(x,w,h)=>{x.fillStyle='#e9e1d3';x.fillRect(0,0,w,h);for(let y=0;y<h;y+=2){x.fillStyle=`rgba(120,100,80,${.03+rnd()*.03})`;x.fillRect(0,y,w,1)}for(let i=0;i<w;i+=2){x.fillStyle=`rgba(120,100,80,${.02+rnd()*.03})`;x.fillRect(i,0,1,h)}});
const leafTex=(c1,c2)=>{const t=cv(256,512,(x,w,h)=>{x.clearRect(0,0,w,h);const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,c1);g.addColorStop(.5,c2);g.addColorStop(1,c1);x.fillStyle=g;
  x.beginPath();x.moveTo(w/2,h*.98);x.bezierCurveTo(w*.02,h*.72,w*.06,h*.2,w/2,h*.02);x.bezierCurveTo(w*.94,h*.2,w*.98,h*.72,w/2,h*.98);x.fill();
  x.strokeStyle='rgba(225,235,190,.55)';x.lineWidth=3;x.beginPath();x.moveTo(w/2,h*.98);x.lineTo(w/2,h*.04);x.stroke();x.lineWidth=1.2;x.strokeStyle='rgba(215,230,180,.35)';
  for(let y=h*.12;y<h*.92;y+=h*.045){x.beginPath();x.moveTo(w/2,y+14);x.quadraticCurveTo(w*.3,y+4,w*.1,y-6);x.moveTo(w/2,y+14);x.quadraticCurveTo(w*.7,y+4,w*.9,y-6);x.stroke()}});t.colorSpace=THREE.SRGBColorSpace;return t};
const foliage=()=>cv(256,256,(x,w,h)=>{x.clearRect(0,0,w,h);for(let i=0;i<420;i++){const a=rnd()*Math.PI*2,r=rnd()*w*.42,px=w/2+Math.cos(a)*r,py=h/2+Math.sin(a)*r;
  x.fillStyle=`rgb(${30+rnd()*35},${60+rnd()*45},${28+rnd()*25})`;x.save();x.translate(px,py);x.rotate(rnd()*7);x.beginPath();x.ellipse(0,0,2+rnd()*3,6+rnd()*6,0,0,7);x.fill();x.restore()}});
const flowerTex=c=>cv(64,64,(x,w,h)=>{x.clearRect(0,0,w,h);x.fillStyle=c;for(let i=0;i<6;i++){x.save();x.translate(32,32);x.rotate(i*Math.PI/3);x.beginPath();x.ellipse(0,-14,7,13,0,0,7);x.fill();x.restore()}x.fillStyle='#e8c25a';x.beginPath();x.arc(32,32,6,0,7);x.fill()});

export function buildGarden({sc,V,VM,glow,lamps}){
  const G=new THREE.Group();sc.add(G);const X0=34.85,X1=39.6,Z0=-17.1,Z1=-6.22,DX=37.55,DY=.17;
  const M=(o)=>new THREE.MeshStandardMaterial(Object.assign({roughness:.85,envMapIntensity:.4},o));
  const put=(geo,m,x,y,z,ry=0,cast=true)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.rotation.y=ry;o.castShadow=cast;o.receiveShadow=true;G.add(o);return o};
  const rb=(w,h,d,r=.02)=>new RoundedBoxGeometry(w,h,d,3,r);
  // ---- walls: stucco with shadow grooves and a coping ----
  const st=stucco();const wallM=M({map:rep(st,3,1),roughness:.95,color:0xf2ebe0});const cop=M({map:rep(stone(),4,1),color:0xe9e2d6,roughness:.8});
  const wall=(w,d,x,z)=>{put(new THREE.BoxGeometry(w,2.3,d),wallM,x,1.15,z);put(rb(w+.06,.08,d+.06,.015),cop,x,2.34,z);
    for(let y=.45;y<2.2;y+=.45){const g=put(new THREE.BoxGeometry(w>d?w:.012,.012,w>d?.012:d),M({color:0xb5a890}),x+(w>d?0:(x<36?.1:-.1)),y,z+(w>d?(z<-10?.1:-.1):0),0,false);g.receiveShadow=false}};
  wall(.2,Z1-Z0+.4,X0-.1,(Z0+Z1)/2);wall(X1-X0+.2,.2,(X0+X1)/2,Z0-.1);wall(X1-X0+.2,.2,(X0+X1)/2,Z1+.1);
  // ---- soil + lawn base ----
  put(new THREE.PlaneGeometry(DX-X0,Z1-Z0),M({map:rep(turf(),3,10),roughness:1}),(X0+DX)/2,.012,(Z0+Z1)/2,0,false).rotation.x=-Math.PI/2;
  // ---- grass: 50k instanced blades swaying in the wind ----
  {const bg=new THREE.PlaneGeometry(.022,1,1,4);bg.translate(0,.5,0);const P=bg.attributes.position;for(let i=0;i<P.count;i++){const y=P.getY(i);P.setX(i,P.getX(i)*(1-y*.92));P.setZ(i,y*y*.06)}bg.computeVertexNormals();
   const gm=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,side:THREE.DoubleSide,envMapIntensity:.25});
   gm.onBeforeCompile=s=>{s.uniforms.uTime={value:0};gm.userData.u=s.uniforms.uTime;s.vertexShader='uniform float uTime;\n'+s.vertexShader.replace('#include <begin_vertex>',
     `#include <begin_vertex>
      vec4 ip=instanceMatrix*vec4(0.,0.,0.,1.);float bend=position.y*position.y;
      transformed.x+=sin(uTime*1.6+ip.x*1.3+ip.z*.9)*.05*bend; transformed.z+=cos(uTime*1.2+ip.z*1.1)*.03*bend;`)};
   const N=50000,im=new THREE.InstancedMesh(bg,gm,N);const o=new THREE.Object3D(),c=new THREE.Color();
   const pav=[];for(let i=0;i<9;i++){const t=i/8;pav.push([DX-.4+(X0+.9-DX+.4)*t,-8.2+(-12.8+8.2)*t+Math.sin(i)*.25])}
   let n=0;while(n<N){const x=X0+.05+rnd()*(DX-X0-.1),z=Z0+.05+rnd()*(Z1-Z0-.1);if(pav.some(p=>Math.abs(p[0]-x)<.33&&Math.abs(p[1]-z)<.28))continue;if(Math.hypot(x-36.1,z+11.6)<.62)continue;if(x<35.6&&((z<-12.8)||(z>-10.3&&z<-8.0)))continue;
     o.position.set(x,.01,z);o.rotation.set(0,rnd()*6.28,0);const hh=.07+rnd()*.09;o.scale.set(1,hh,1);o.updateMatrix();im.setMatrixAt(n,o.matrix);c.setHSL(.24+rnd()*.05,.45+rnd()*.2,.24+rnd()*.14);im.setColorAt(n,c);n++}
   im.receiveShadow=true;G.add(im);G.userData.grass=gm}
  // ---- stepping stones ----
  const sm=M({map:stone(),roughness:.9,color:0xf0ebe2});for(let i=0;i<9;i++){const t=i/8;const p=put(rb(.56+rnd()*.12,.05,.44+rnd()*.1,.02),sm,DX-.4+(X0+.9-DX+.4)*t,.03,-8.2+(-12.8+8.2)*t+Math.sin(i)*.25,rnd()*.8)}
  // ---- teak deck: individual planks with grain ----
  {const tk=teak();const pm=M({map:tk,roughness:.62,color:0xffffff});const N=Math.floor((Z1-Z0)/.148);const im=new THREE.InstancedMesh(rb(X1-DX,.035,.135,.008),pm,N);const o=new THREE.Object3D(),c=new THREE.Color();
   for(let i=0;i<N;i++){o.position.set((DX+X1)/2,DY-.017,Z0+.075+i*.148);o.updateMatrix();im.setMatrixAt(i,o.matrix);c.setHSL(.075,.35+rnd()*.12,.7+rnd()*.12);im.setColorAt(i,c)}im.receiveShadow=im.castShadow=true;G.add(im);
   put(rb(.06,DY,Z1-Z0,.01),M({map:tk,color:0x8f6a48}),DX,DY/2,(Z0+Z1)/2)}
  // ---- hot tub: rounded acrylic shell, wood skirt, rippling water ----
  {const tx=38.55,tz=-15.85;put(rb(1.75,.85,1.75,.08),M({map:rep(teak(),2,1),color:0xc9a27c,roughness:.6}),tx,.6,tz);put(rb(1.55,.06,1.55,.03),M({color:0xf2efe9,roughness:.25}),tx,1.02,tz);
   const wg=new THREE.PlaneGeometry(1.4,1.4,40,40);wg.rotateX(-Math.PI/2);const wm=new THREE.MeshPhysicalMaterial({color:0x6fb9bf,roughness:.06,metalness:0,clearcoat:1,transparent:true,opacity:.86,envMapIntensity:1.2,emissive:0x2aa8b8,emissiveIntensity:0});
   const water=put(wg,wm,tx,.98,tz,0,false);glow.push(wm);wm.userData.k=1.4;G.userData.water=water}
  // ---- glass balustrade with steel cap ----
  {const gm=new THREE.MeshPhysicalMaterial({color:0xdfeeed,roughness:.03,transmission:.0,transparent:true,opacity:.22,metalness:.1,depthWrite:false});const g=put(new THREE.BoxGeometry(.02,.95,3.2),gm,DX+.06,DY+.48,-13.2,0,false);g.renderOrder=3;
   put(new THREE.BoxGeometry(.04,.03,3.2),M({color:0x9b9b98,metalness:.8,roughness:.3}),DX+.06,DY+.97,-13.2)}
  // ---- lounge: teak frames, linen cushions, throw pillows ----
  {const fr=M({map:rep(teak(),1,1),color:0xb98f68,roughness:.6}),cu=M({map:rep(linen(),2,2),color:0xf1ebe1,roughness:.95}),pil=[M({map:linen(),color:0x9c7350,roughness:.95}),M({map:linen(),color:0x7f8b62,roughness:.95})];
   const SX=39.15,SZ=-9.2;put(rb(.8,.3,2.2,.03),fr,SX,DY+.17,SZ);put(rb(.2,.38,2.2,.04),fr,SX+.3,DY+.47,SZ);
   [-0.72,0,.72].forEach(dz=>{put(rb(.62,.14,.7,.06),cu,SX-.07,DY+.39,SZ+dz);put(rb(.16,.36,.7,.07),cu,SX+.17,DY+.62,SZ+dz)});
   [[-.85,.35],[.85,-.2]].forEach(([dz,ry],i)=>{const p=put(rb(.12,.36,.36,.08),pil[i],SX+.08,DY+.62,SZ+dz,ry)});
   put(rb(.6,.04,.95,.015),M({map:teak(),color:0xc29a72,roughness:.5}),38.3,DY+.38,SZ);put(rb(.5,.36,.82,.02),fr,38.3,DY+.18,SZ);
   [[38.15,-7.55],[38.15,-10.85]].forEach(([x,z])=>{put(rb(.72,.3,.72,.03),fr,x,DY+.17,z);put(rb(.62,.13,.62,.05),cu,x,DY+.38,z)})}
  // ---- parasol: octagonal canopy with ribs ----
  {const px=37.85,pz=-8.15;put(new THREE.CylinderGeometry(.025,.03,2.5,12),M({color:0xd8d3cb,metalness:.5,roughness:.35}),px,DY+1.25,pz);
   const can=new THREE.ConeGeometry(1.35,.42,8,3,true);const cm=M({map:rep(linen(),3,3),color:0xe7dcc6,side:THREE.DoubleSide,roughness:.95});put(can,cm,px,DY+2.55,pz,Math.PI/8);
   for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.PI/8;const r=put(new THREE.CylinderGeometry(.008,.008,1.4,5),M({color:0xd8d3cb,metalness:.6}),px+Math.cos(a)*.66,DY+2.45,pz+Math.sin(a)*.66,0,false);r.rotation.set(0,0,0);r.lookAt(px,DY+2.76,pz);r.rotateX(Math.PI/2)}
   put(rb(.5,.08,.5,.02),M({color:0x4a4744,roughness:.5}),px,DY+.04,pz)}
  // ---- kamado grill ----
  {const gx=39.2,gz=-12.6;const eg=put(new THREE.SphereGeometry(.3,32,24),M({color:0x2f3a2c,roughness:.28,metalness:.1,clearcoat:1}),gx,DY+.78,gz);eg.scale.set(1,1.15,1);
   put(new THREE.TorusGeometry(.29,.012,8,40),M({color:0x9b9b98,metalness:.8,roughness:.3}),gx,DY+.86,gz).rotation.x=Math.PI/2;
   [[0,1],[1,-1],[-1,-1]].forEach(([a,b])=>{const l=put(new THREE.CylinderGeometry(.015,.015,.5,8),M({color:0x2b2b2b,metalness:.6}),gx+a*.18,DY+.25,gz+b*.15,0)});
   put(rb(.5,.03,.3,.01),M({map:teak(),color:0xb98f68}),gx-.42,DY+.72,gz)}
  // ---- shed + bench ----
  put(rb(1.1,2,.9,.02),M({map:rep(teak(),3,1),color:0x9d8670,roughness:.8}),35.45,1,-6.75);put(rb(1.25,.07,1.05,.01),M({color:0x3a3a3c,roughness:.6}),35.45,2.04,-6.75);
  put(rb(1.6,.06,.42,.015),M({map:teak(),color:0xb88f66,roughness:.55}),36.9,.43,-6.55);[36.25,37.55].forEach(x=>put(rb(.08,.4,.38,.01),M({map:teak(),color:0xa47c56}),x,.2,-6.55));
  // ---- fire bowl: cast concrete, flames, embers ----
  {const fx=36.1,fz=-11.6;const prof=[[0,.08],[.3,.06],[.5,.18],[.58,.42],[.6,.5],[.52,.5],[.5,.44],[.3,.32],[0,.3]].map(([r,y])=>new THREE.Vector2(r,y));
   put(new THREE.LatheGeometry(prof,48),M({map:stone(),color:0xc9c2b6,roughness:.95,side:THREE.DoubleSide}),fx,0,fz);
   const lava=put(new THREE.CircleGeometry(.48,32),M({color:0x3a302a,roughness:1,emissive:0xff5a1a,emissiveIntensity:.0}),fx,.33,fz,0,false);lava.rotation.x=-Math.PI/2;glow.push(lava.material);lava.material.userData.k=.6;
   const fl=new THREE.Group();fl.position.set(fx,.34,fz);G.add(fl);const fm=[0xff8a2a,0xffb347,0xffe08a].map(c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}));
   for(let i=0;i<14;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(.04+rnd()*.06,.25+rnd()*.35,8),fm[i%3]);f.position.set((rnd()-.5)*.55,.12,(rnd()-.5)*.55);f.userData.s=rnd()*6;fl.add(f)}
   const fireL=new THREE.PointLight(0xff9a40,0,9,1.7);fireL.position.set(fx,1.0,fz);G.add(fireL);G.userData.fire={fl,fireL}}
  // ---- planting beds: rendered render plaster + soil ----
  const bedM=M({map:rep(stucco(),2,1),color:0xe8e0d2,roughness:.95}),soM=M({map:rep(soil(),3,3),roughness:1});
  const bed=(w,d,x,z)=>{put(rb(w,.5,d,.02),bedM,x,.25,z);put(new THREE.BoxGeometry(w-.08,.02,d-.08),soM,x,.5,z,0,false)};
  bed(.7,4.2,35.2,-15.0);bed(2.4,.7,36.4,-16.75);bed(.6,2.2,35.2,-9.2);
  // ---- tropical leaf plants (bird of paradise / banana style) ----
  const lt=[leafTex('#3c6b2b','#5c8f3c'),leafTex('#2f5e2c','#4f8a3a'),leafTex('#4b7a30','#77a145')];
  const leafGeo=(L)=>{const g=new THREE.PlaneGeometry(.22*L,L,1,8);g.translate(0,L/2,0);const P=g.attributes.position;for(let i=0;i<P.count;i++){const y=P.getY(i)/L;P.setZ(i,Math.sin(y*1.4)*.35*L*y);P.setX(i,P.getX(i)*(1+.15*Math.sin(y*3)))}g.computeVertexNormals();return g};
  const plant=(x,y,z,s=1)=>{const g=new THREE.Group();g.position.set(x,y,z);G.add(g);const n=7+Math.floor(rnd()*5);
    for(let i=0;i<n;i++){const L=(.55+rnd()*.5)*s;const m=new THREE.MeshStandardMaterial({map:lt[i%3],alphaTest:.45,side:THREE.DoubleSide,roughness:.7,envMapIntensity:.3});
      const leaf=new THREE.Mesh(leafGeo(L),m);leaf.castShadow=true;const st=new THREE.Mesh(new THREE.CylinderGeometry(.008*s,.012*s,L*.5,5),M({color:0x5c7a36}));
      const piv=new THREE.Group();piv.rotation.y=i/n*Math.PI*2+rnd()*.5;const tilt=new THREE.Group();tilt.rotation.x=.25+rnd()*.55;piv.add(tilt);st.position.y=L*.25;tilt.add(st);leaf.position.y=L*.45;tilt.add(leaf);g.add(piv);g.userData['l'+i]=tilt}
    G.userData.plants=(G.userData.plants||[]).concat([g]);return g};
  for(let z=-16.7;z<-13.1;z+=.62)plant(35.2+(rnd()-.5)*.15,.5,z,1+rnd()*.3);for(let x=35.7;x<37.5;x+=.6)plant(x,.5,-16.75+(rnd()-.5)*.1,.9+rnd()*.3);plant(35.2,.5,-9.7,.9);plant(35.2,.5,-8.7,.85);
  // ornamental grass clumps
  {const bg=new THREE.PlaneGeometry(.012,1,1,5);bg.translate(0,.5,0);const P=bg.attributes.position;for(let i=0;i<P.count;i++){const y=P.getY(i);P.setX(i,P.getX(i)*(1-y*.9));P.setZ(i,y*y*.35)}bg.computeVertexNormals();
   const im=new THREE.InstancedMesh(bg,new THREE.MeshStandardMaterial({color:0xffffff,side:THREE.DoubleSide,roughness:.8}),2400);const o=new THREE.Object3D(),c=new THREE.Color();let n=0;
   [[35.2,-12.95],[35.2,-10.35],[35.2,-8.1],[37.25,-16.75],[35.35,-16.75]].forEach(([cx,cz])=>{for(let i=0;i<480;i++){o.position.set(cx+(rnd()-.5)*.25,.5,cz+(rnd()-.5)*.25);o.rotation.set(0,rnd()*6.28,0);o.scale.set(1,.45+rnd()*.35,1);o.updateMatrix();im.setMatrixAt(n,o.matrix);c.setHSL(.16+rnd()*.06,.35,.45+rnd()*.15);im.setColorAt(n++,c)}});
   im.castShadow=true;G.add(im)}
  // flowers
  {const fts=['#c8323a','#f2efe8','#e58fa0'].map(flowerTex);for(let i=0;i<60;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:fts[i%3],alphaTest:.4}));const onBack=i%2;
    s.position.set(onBack?35.1+rnd()*.25:35.7+rnd()*1.8,.8+rnd()*.45,onBack?-16.8+rnd()*3.6:-16.95+rnd()*.35);s.scale.setScalar(.07+rnd()*.05);G.add(s)}}
  // ---- cypresses: trunk + foliage cards in a columnar crown ----
  {const ft=foliage();const fm=new THREE.MeshStandardMaterial({map:ft,alphaTest:.4,side:THREE.DoubleSide,roughness:.9,color:0xc8d8b8,envMapIntensity:.3});const card=new THREE.PlaneGeometry(.55,.55);
   [-11.0,-12.4,-13.8,-8.0].forEach(z=>{const H=3.4+rnd()*.5,base=.5;put(new THREE.CylinderGeometry(.04,.06,.6,8),M({color:0x5a4634}),35.15,base+.3,z);
     const im=new THREE.InstancedMesh(card,fm,170);const o=new THREE.Object3D(),c=new THREE.Color();for(let i=0;i<170;i++){const y=rnd()*H,r=.42*Math.pow(1-y/H,.75)*(.55+rnd()*.5),a=rnd()*6.28;
       o.position.set(35.15+Math.cos(a)*r,base+.35+y,z+Math.sin(a)*r);o.rotation.set(rnd()*6.28,rnd()*6.28,rnd()*6.28);o.scale.setScalar(.7+rnd()*.6);o.updateMatrix();im.setMatrixAt(i,o.matrix);c.setHSL(.27+rnd()*.05,.35,.32+rnd()*.12);im.setColorAt(i,c)}
     im.castShadow=true;im.receiveShadow=true;G.add(im)})}
  // ---- lighting: bollards + festoon string ----
  const bm=new THREE.MeshStandardMaterial({color:0xfff0d0,emissive:0xffc477,emissiveIntensity:0});glow.push(bm);bm.userData.k=3;
  [[37.4,-7.2],[37.4,-14.9],[35.45,-12.4]].forEach(([x,z])=>{put(rb(.12,.6,.12,.02),M({color:0x2b2b2b,metalness:.5,roughness:.4}),x,.3,z);put(new THREE.CylinderGeometry(.05,.05,.08,16),bm,x,.64,z,0,false)});
  {const N=26,bulb=new THREE.InstancedMesh(new THREE.SphereGeometry(.045,12,8),bm,N),o=new THREE.Object3D(),pts=[];for(let i=0;i<N;i++){const t=i/(N-1);o.position.set(39.5+(35.0-39.5)*t,2.38-Math.sin(t*Math.PI)*.45,-6.35);o.updateMatrix();bulb.setMatrixAt(i,o.matrix);pts.push(o.position.clone().add(new THREE.Vector3(0,.05,0)))}
   G.add(bulb);const wire=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),60,.004,4),M({color:0x2b2b2b}));G.add(wire)}
  const gL=new THREE.PointLight(0xffc477,0,10,1.8);gL.position.set(38,2.2,-9);G.add(gL);lamps.push([gL,14]);
  // ---- people: the Valentinas on the deck ----
  const sitV=(hair,x,z,pose)=>{const f=V.figure(VM.white,{hair});f.userData.pose(V.poseValues(pose));f.userData.refresh();f.position.set(x,DY+.48-.79+.03,z);f.rotation.y=-Math.PI/2;G.add(f);return f};
  const sa=sitV('long',39.08,-9.55,'sitSip'),sb=sitV('pony',39.08,-8.82,'sitTalk');
  const ck=V.figure(VM.white,{hair:'bob'});ck.position.set(39.2,DY,-12.1);ck.rotation.y=Math.PI;ck.userData.pose(V.poseValues('cook'));ck.userData.refresh();G.add(ck);
  // ---- Nala playing fetch with the gold architect ----
  const arq=V.figure(VM.gold,{hair:'bob',gold:true,h:1.64});arq.position.set(37.3,.02,-10.6);arq.rotation.y=-Math.PI/2;G.add(arq);
  const nala=V.nala();nala.scale.setScalar(1.25);G.add(nala);
  const ball=new THREE.Mesh(new THREE.SphereGeometry(.036,20,14),M({color:0xc6d05a,roughness:.7}));ball.castShadow=true;G.add(ball);
  const home=new THREE.Vector3(36.95,.02,-10.6),throwsTo=[[35.75,-13.4],[35.9,-8.6],[36.3,-14.6],[36.0,-9.4]];
  let nYaw=-Math.PI/2,nPrev=null,aYaw=-Math.PI/2;const tmp=new THREE.Vector3();
  const ease=V.ease,yawTo=V.yawTo;
  return {group:G,focus:()=>nala.position.clone().setY(.6),
   update(t,dt){
    if(G.userData.grass&&G.userData.grass.userData.u)G.userData.grass.userData.u.value=t;
    const w=G.userData.water;if(w){const P=w.geometry.attributes.position;for(let i=0;i<P.count;i++){const x=P.getX(i),z=P.getZ(i);P.setY(i,Math.sin(x*9+t*2.2)*.006+Math.cos(z*11+t*1.7)*.005)}P.needsUpdate=true;w.geometry.computeVertexNormals()}
    const f=G.userData.fire;if(f){f.fl.children.forEach(c=>{c.scale.y=.7+Math.sin(t*9+c.userData.s)*.25+Math.sin(t*23+c.userData.s*2)*.1;c.rotation.y=t*(c.userData.s>3?1:-1)});f.fireL.position.y=1+Math.sin(t*13)*.05}
    (G.userData.plants||[]).forEach((g,i)=>{for(const k in g.userData){g.userData[k].rotation.z=Math.sin(t*1.1+i+k.length)*.04}});
    {const u=ck.userData;u.L.sr.p=-.75+Math.sin(t*4)*.18;u.L.sr.b=-.7+Math.sin(t*4)*.2;u.refresh()}
    sa.userData.head.rotation.y=-.45+Math.sin(t*.5)*.15;sb.userData.head.rotation.y=.45+Math.sin(t*.6)*.1;
    // fetch cycle (9 s): wind-up, throw, Nala sprints, picks up, trots back, sits, gets a pat
    const cyc=9,k=Math.floor(t/cyc),c=t%cyc,T=throwsTo[k%throwsTo.length],land=new THREE.Vector3(T[0],.036,T[1]);
    const mouth=nala.userData.head.localToWorld(new THREE.Vector3(0,-.06,.13));const hand=arq.userData.hand.sr?arq.userData.hand.sr.getWorldPosition(new THREE.Vector3()):home.clone();
    // architect pose
    let pose='stand';const au=arq.userData;
    if(c<1.1)pose='stand';else if(c<1.45)pose='windup';else if(c<1.8)pose='throw';else if(c>7.2&&c<8.6)pose='pet';
    const PV={windup:{sr:[-2.9,-.7,.18],sl:[-.5,-.2,-.1],hl:[0,0,-.02],hr:[0,0,.02],hp:-.15,y:0},throw:{sr:[-1.05,-.08,.08],sl:[.2,-.2,-.1],hl:[0,0,-.02],hr:[0,0,.02],hp:-.1,y:0},
      pet:{hl:[-1.05,1.7,-.12],hr:[-.75,1.55,.1],y:-.3,sr:[-1.0+Math.sin(t*5)*.12,-.25,.02],sl:[-.85,-.5,-.12],hp:.5}};
    au.pose(PV[pose]||V.poseValues('stand'));arq.position.y=.02+(au.rootY||0);au.refresh();
    // Nala
    let np,sit=0;const sprint=[1.8,3.6],pick=[3.6,4.0],back=[4.0,6.6];
    if(c<1.8){np=home.clone().add(new THREE.Vector3(-.45,0,.15));sit=c<1.4?1:0}
    else if(c<sprint[1])np=mix(home.clone().add(new THREE.Vector3(-.45,0,.15)),land.clone().setY(.02).add(new THREE.Vector3(.12,0,0)),(c-sprint[0])/(sprint[1]-sprint[0]));
    else if(c<pick[1])np=land.clone().setY(.02).add(new THREE.Vector3(.12,0,0));
    else if(c<back[1])np=mix(land.clone().setY(.02).add(new THREE.Vector3(.12,0,0)),home.clone().add(new THREE.Vector3(-.45,0,.15)),(c-back[0])/(back[1]-back[0]));
    else{np=home.clone().add(new THREE.Vector3(-.45,0,.15));sit=Math.min(1,(c-back[1])/.4)}
    const spd=nPrev?nPrev.distanceTo(np)/Math.max(dt,1e-3):0;let ty=nYaw;if(spd>.1&&nPrev)ty=Math.atan2(np.x-nPrev.x,np.z-nPrev.z);else ty=Math.atan2(home.x-np.x,home.z-np.z);
    nPrev=np.clone();nYaw=yawTo(nYaw,ty,Math.min(1,dt*7));nala.rotation.y=nYaw;nala.position.copy(np);nala.position.y=np.y+nala.userData.update(t,dt,spd,sit);
    aYaw=yawTo(aYaw,Math.atan2(nala.position.x-home.x,nala.position.z-home.z),Math.min(1,dt*3));arq.rotation.y=aYaw;arq.position.x=home.x;arq.position.z=home.z;
    au.head.rotation.x=(pose==='pet'?.5:.15);
    // ball
    if(c<1.65)ball.position.copy(hand);
    else if(c<2.6){const f=(c-1.65)/.95;ball.position.lerpVectors(hand,land,f);ball.position.y=hand.y*(1-f)+.036*f+Math.sin(f*Math.PI)*1.1}
    else if(c<3.75){const f=(c-2.6)/1.15;ball.position.set(land.x-.15*f,.036+Math.abs(Math.sin(f*Math.PI*2.5))*.14*(1-f),land.z)}
    else if(c<6.8)ball.position.copy(mouth);
    else if(c<7.1)ball.position.lerpVectors(mouth,hand,(c-6.8)/.3);else ball.position.copy(hand);
   }};
  function mix(a,b,f){return a.clone().lerp(b,ease(Math.min(1,Math.max(0,f))))}
}
