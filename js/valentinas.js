// Las Valentinas · Studio Valentina's own character family for every 3D model.
// Built from scratch in code: slim 1:50-model figures with a gold neck ring, three hairstyles,
// the gold architect with her plan, and Nala, the studio mascot.
import * as THREE from 'three';

const UP=new THREE.Vector3(0,-1,0),tv=new THREE.Vector3();
export const ease=x=>x<0?0:x>1?1:x*x*(3-2*x);
const dirOf=(p,z)=>UP.clone().applyEuler(new THREE.Euler(p,0,z));
const std=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.85,envMapIntensity:.35},o));
export const materials=()=>({white:std(0xf8f6f2,{roughness:.9}),gold:new THREE.MeshStandardMaterial({color:0xc6a679,metalness:.6,roughness:.42,envMapIntensity:1.1})});
const clipAll=(obj,planes)=>{if(!planes)return;obj.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.clippingPlanes=planes;o.material.clipShadows=true}})};

function taperTube(pts,rf,seg=22,rad=10){const c=new THREE.CatmullRomCurve3(pts,false,'centripetal');const g=new THREE.TubeGeometry(c,seg,1,rad,false);const P=g.attributes.position;
  for(let i=0;i<=seg;i++){const u=i/seg,cp=c.getPointAt(u),r=rf(u);for(let j=0;j<=rad;j++){const id=i*(rad+1)+j;tv.fromBufferAttribute(P,id).sub(cp).multiplyScalar(r).add(cp);P.setXYZ(id,tv.x,tv.y,tv.z)}}
  P.needsUpdate=true;return g}

// ---------- poses: [pitch, bend, roll] per limb, head pitch, root drop ----------
export const POSES={
  stand:{sl:[0,-.12,-.07],sr:[0,-.12,.07],hl:[0,0,-.02],hr:[0,0,.02],hp:0,y:0},
  read:{sl:[-.62,-1.02,.36],sr:[-.62,-1.02,-.36],hp:.42},
  hold:{sr:[-.45,-1.35,.06]},
  sit:{hl:[-1.52,1.5,-.05],hr:[-1.52,1.5,.07],y:-.33,sl:[-.55,-.55,.08],sr:[-.38,-1.25,.05],hp:.05},
  sitTalk:{hl:[-1.52,1.5,-.05],hr:[-1.52,1.5,.07],y:-.33,sl:[-.55,-.55,.08],sr:[-.6,-1.1,.15],hp:0},
  sitSip:{hl:[-1.52,1.5,-.05],hr:[-1.52,1.5,.07],y:-.33,sl:[-.55,-.55,.08],sr:[-.7,-2.37,.15],hp:-.12},
  cook:{sl:[-.75,-.7,.1],sr:[-.75,-.7,-.1],hp:.45},
  measure:{sr:[-1.38,-.12,.06],sl:[.05,-1.5,-.55],hp:.05},
  lean:{sl:[-.2,-1.3,-.4],sr:[0,-.12,.07],hp:.1},
};
export function poseValues(name){const p=POSES[name]||POSES.stand,D=POSES.stand,o={};for(const k of ['sl','sr','hl','hr'])o[k]=(p[k]||D[k]).slice();o.hp=p.hp??0;o.y=p.y??0;return o}

// ---------- a Valentina ----------
export function figure(m,{h=1.62,hair='bob',gold=false,clip=null}={}){const k=h/1.62,g=new THREE.Group();
  const mk=(geo,x,y,z,par=g)=>{const o=new THREE.Mesh(geo,m);o.position.set(x*k,y*k,z*k);o.castShadow=true;o.receiveShadow=true;par.add(o);return o};
  const prof=[[0,.75],[.055,.755],[.098,.81],[.104,.88],[.09,.97],[.072,1.05],[.078,1.15],[.093,1.25],[.099,1.31],[.085,1.36],[.04,1.405],[0,1.415]].map(([r,y])=>new THREE.Vector2(r*k,y*k));
  mk(new THREE.LatheGeometry(prof,36),0,0,0).scale.z=.74;
  mk(new THREE.CylinderGeometry(.021*k,.027*k,.1*k,16),0,1.44,0);
  const head=new THREE.Group();head.position.set(0,1.545*k,0);g.add(head);
  mk(new THREE.SphereGeometry(.082,28,20),0,0,.004,head).scale.set(.9,1.13,.98);
  const cap=th=>{const c=mk(new THREE.SphereGeometry(.0875,36,20,0,Math.PI*2,0,Math.PI*th),0,.004,-.006,head);c.scale.set(.96,1.15,1.03);c.rotation.x=-.42;return c};
  if(hair==='bob'){cap(.64).scale.set(1.02,1.17,1.08)}
  else if(hair==='pony'){cap(.5);const tie=mk(new THREE.TorusGeometry(.016,.006,8,16),0,.06,-.085,head);tie.rotation.x=.9;
    const pc=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.065,-.088),new THREE.Vector3(0,.03,-.13),new THREE.Vector3(0,-.06,-.128),new THREE.Vector3(.005,-.13,-.11)]);
    const pt=new THREE.Mesh(taperTube(pc.points,u=>(.02+.012*Math.sin(u*Math.PI*.9))*(1-u*.55),18,10),m);pt.castShadow=true;head.add(pt)}
  else{cap(.56);const bk=mk(new THREE.CapsuleGeometry(.07,.15,8,18),0,-.11,-.045,head);bk.scale.set(1.18,1,.42);bk.rotation.x=.12}
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.035*k,.0135*k,16,44),new THREE.MeshStandardMaterial({color:gold?0xf1d9a4:0xc9a46a,metalness:1,roughness:.18,envMapIntensity:1.8}));
  ring.rotation.x=Math.PI/2;ring.position.y=1.432*k;ring.castShadow=true;g.add(ring);
  const L={hl:{o:[-.054,.79],l:[.39,.37],r:[.046,.033,.023]},hr:{o:[.054,.79],l:[.39,.37],r:[.046,.033,.023]},
           sl:{o:[-.086,1.33],l:[.25,.23],r:[.027,.02,.015]},sr:{o:[.086,1.33],l:[.25,.23],r:[.027,.02,.015]}};
  const tubes={},ends={};
  for(const n in L){Object.assign(L[n],{p:0,b:0,z:0,ft:0});mk(new THREE.SphereGeometry(L[n].r[0],14,10),L[n].o[0],L[n].o[1],0);
    const e=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),m);e.castShadow=true;e.scale.set(...(n[0]==='h'?[.03,.024,.072]:[.017,.034,.011]).map(v=>v*k));g.add(e);ends[n]=e}
  const u={k,head,L,hand:{},clip,
    refresh(){for(const n in L){const s=L[n],leg=n[0]==='h',o=new THREE.Vector3(s.o[0]*k,s.o[1]*k,0);
      const d1=dirOf(s.p,s.z),d2=dirOf(s.p+s.b,s.z),p1=o.clone().addScaledVector(d1,s.l[0]*k),p2=p1.clone().addScaledVector(d2,s.l[1]*k);
      const pts=[o.clone().addScaledVector(d1,-.03*k),o,o.clone().lerp(p1,.55),p1,p1.clone().lerp(p2,.5),p2];
      const [r0,r1,r2]=s.r,rf=x=>(x<.5?r0+(r1-r0)*ease(x/.5):r1+(r2-r1)*ease((x-.5)/.5))*k;
      const geo=taperTube(pts,rf);if(tubes[n]){tubes[n].geometry.dispose();tubes[n].geometry=geo}
      else{const mm=clip?m.clone():m;if(clip){mm.clippingPlanes=clip;mm.clipShadows=true}tubes[n]=new THREE.Mesh(geo,mm);tubes[n].castShadow=true;g.add(tubes[n])}
      const e=ends[n];if(leg){const fd=new THREE.Vector3(0,0,1).applyEuler(new THREE.Euler(Math.min(0,s.p+s.b)*.3+s.ft,0,0));e.position.copy(p2).addScaledVector(fd,.035*k).add(new THREE.Vector3(0,-.012*k,0));e.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),fd)}
      else{e.position.copy(p2).addScaledVector(d2,.026*k);e.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d2.clone().negate());u.hand[n]=e}}},
    pose(v){for(const n of ['sl','sr','hl','hr']){L[n].p=v[n][0];L[n].b=v[n][1];L[n].z=v[n][2];L[n].ft=0}u.rootY=v.y||0;head.rotation.x=v.hp||0},
    // blend a walking gait on top of the current pose (phase in radians, w 0..1)
    walk(ph,w){if(w<.02)return 0;const sn=Math.sin(ph),cs=Math.cos(ph);
      L.hl.p=L.hl.p*(1-w)+.34*sn*w;L.hr.p=L.hr.p*(1-w)-.34*sn*w;L.hl.b=L.hl.b*(1-w)+(.06+.62*ease(-cs*1.4))*w;L.hr.b=L.hr.b*(1-w)+(.06+.62*ease(cs*1.4))*w;
      L.hl.ft=-.25*ease(cs)*w;L.hr.ft=-.25*ease(-cs)*w;if(Math.abs(L.sl.p)<.3&&Math.abs(L.sl.b)<.3){L.sl.p-=.25*sn*w;L.sr.p+=.25*sn*w}return Math.abs(cs)*w},
    rootY:0};
  g.userData=u;u.pose(poseValues('stand'));u.refresh();clipAll(g,clip);
  // tubes created in refresh already carry the clip; keep their materials when clipAll cloned
  return g}

// ---------- the plan the architect reads ----------
export function blueprint(){const bp=document.createElement('canvas');bp.width=320;bp.height=224;const x=bp.getContext('2d');x.fillStyle='#efe8dc';x.fillRect(0,0,320,224);x.strokeStyle='#6f7a4f';x.lineWidth=4;x.strokeRect(18,18,284,188);x.lineWidth=2.4;
  [[18,112,160,112],[160,18,160,206],[160,136,302,136],[74,112,74,206],[230,18,230,136]].forEach(([a,b,c,d])=>{x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()});
  x.beginPath();x.arc(160,74,28,Math.PI/2,Math.PI);x.stroke();x.font='italic 20px Georgia';x.fillStyle='#9a7f61';x.fillText('VA',258,192);
  const t=new THREE.CanvasTexture(bp);t.colorSpace=THREE.SRGBColorSpace;const geo=new THREE.PlaneGeometry(.42,.29);geo.translate(0,.145,0);
  const s=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:t,side:THREE.DoubleSide,roughness:.9}));s.castShadow=true;return s}
// keep the plan between both hands of a reading figure (call after refresh)
export function holdPlan(f,sheet){const a=f.userData.hand.sl.position,b=f.userData.hand.sr.position;sheet.position.set((a.x+b.x)/2,(a.y+b.y)/2+.005,(a.z+b.z)/2+.012);sheet.rotation.set(-1.0,0,0)}

// ---------- Nala, the studio mascot (Jack Russell: white, tan patches, brown bandana) ----------
export function nala({clip=null}={}){const dog=new THREE.Group();
  const WH=std(0xf6f1ea,{roughness:.8}),TAN=std(0xb8743f,{roughness:.75}),BK=std(0x1f1a17,{roughness:.3}),PK=std(0xd98a8a,{roughness:.6}),BR=std(0x8a6a4f,{roughness:.9});
  const add=(geo,m,x,y,z,par)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;par.add(o);return o};
  const torso=new THREE.Group();torso.position.set(0,.2,-.12);dog.add(torso);const T0=new THREE.Group();T0.position.set(0,-.2,.12);torso.add(T0);
  add(new THREE.CapsuleGeometry(.082,.2,10,18),WH,0,.25,-.02,T0).rotation.x=Math.PI/2;
  add(new THREE.SphereGeometry(.07,16,12),TAN,.035,.305,-.1,T0).scale.set(1,.45,1.15);
  add(new THREE.SphereGeometry(.088,18,14),WH,0,.27,.1,T0);
  const head=new THREE.Group();head.position.set(0,.42,.17);T0.add(head);
  add(new THREE.SphereGeometry(.078,24,18),WH,0,0,0,head).scale.set(1,.95,1);
  const ears=[];[-1,1].forEach(sd=>{add(new THREE.SphereGeometry(.057,18,12),TAN,.034*sd,.024,.004,head).scale.set(.9,.95,1.05);
    const ear=add(new THREE.SphereGeometry(.05,14,10),TAN,.067*sd,.045,0,head);ear.scale.set(.55,1,.28);ear.rotation.set(.15,.35*sd,.75*sd);ears.push(ear);
    add(new THREE.SphereGeometry(.011,10,8),BK,.029*sd,.02,.071,head)});
  add(new THREE.CapsuleGeometry(.035,.04,8,12),WH,0,-.03,.074,head).rotation.x=Math.PI/2;
  add(new THREE.SphereGeometry(.017,12,10),BK,0,-.017,.13,head).scale.set(1.15,.85,1);
  const tongue=add(new THREE.SphereGeometry(.017,10,8),PK,0,-.064,.1,head);tongue.scale.set(1,.45,1.35);
  add(new THREE.TorusGeometry(.064,.015,10,24),BR,0,.35,.13,T0).rotation.x=1.25;
  const bdg=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.07,0,0),new THREE.Vector3(.07,0,0),new THREE.Vector3(0,-.11,.02)]);bdg.setIndex([0,1,2]);bdg.computeVertexNormals();
  const bd=new THREE.Mesh(bdg,new THREE.MeshStandardMaterial({color:0x8a6a4f,roughness:.9,side:THREE.DoubleSide}));bd.position.set(0,.33,.2);bd.rotation.x=.35;T0.add(bd);
  const legs=[[-.047,.11,1],[.047,.11,1],[-.047,-.12,0],[.047,-.12,0]].map(([x,z,fr])=>{const up=new THREE.Group();up.position.set(x,.215,z);T0.add(up);
    add(new THREE.CapsuleGeometry(fr?.026:.031,.07,6,10),WH,0,-.05,0,up);const lo=new THREE.Group();lo.position.y=-.1;up.add(lo);
    add(new THREE.CapsuleGeometry(.021,.075,6,10),WH,0,-.05,0,lo);add(new THREE.SphereGeometry(.027,12,8),WH,0,-.1,.012,lo).scale.set(1,.6,1.3);
    return {up,lo,fr,r0:fr?0:-.42,r1:fr?0:.72}});
  const tail=new THREE.Group();tail.position.set(0,.3,-.13);T0.add(tail);
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(0,.07,-.05),new THREE.Vector3(0,.13,-.035)]),12,.016,8),WH,0,0,0,tail);
  add(new THREE.SphereGeometry(.019,10,8),TAN,0,.135,-.033,tail);
  let ph=0;
  // speed in m/s, sit 0..1, t seconds
  dog.userData={update(t,dt,speed,sit=0){const run=Math.min(1,speed/.7),gal=Math.min(1,Math.max(0,(speed-1.1)/.6));if(speed>.03)ph+=dt*(7+6*gal)*Math.min(1,speed/.25);
    legs.forEach((l,j)=>{const p=ph+((j===0||j===3)?0:Math.PI)+(gal&&j>1?.6:0),sw=Math.sin(p),lift=Math.max(0,Math.cos(p));
      let a=l.r0+sw*(.45+.2*gal)*run,b=l.r1+(l.fr?.75:.55)*lift*run;if(sit){a+=((l.fr?.62:-1.05)-a)*sit;b+=((l.fr?-.05:2.1)-b)*sit}l.up.rotation.x=a;l.lo.rotation.x=b});
    torso.rotation.x=-.62*sit+Math.sin(ph*2)*.035*run*(1-sit);T0.position.y=-.2+Math.abs(Math.sin(ph))*.012*run;
    head.position.y=.42+Math.sin(ph*2+1)*.01*run;head.rotation.z=Math.sin(t*1.3)*.12;
    ears.forEach((e,i)=>e.rotation.x=.15+Math.sin(ph*2)*.18*run+Math.sin(t*3+i)*.04);
    tail.rotation.z=Math.sin(t*(sit?20:run>.3?13:9))*(sit?.75:.5);tongue.scale.z=1.35+Math.sin(t*9)*.15;return -.035*sit},head};
  dog.scale.setScalar(1.12);clipAll(dog,clip);return dog}

// shortest-turn yaw smoothing
export const yawTo=(cur,tgt,a)=>cur+(((tgt-cur+Math.PI*3)%(Math.PI*2))-Math.PI)*a;
