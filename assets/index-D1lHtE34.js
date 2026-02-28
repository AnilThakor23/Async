import{C as _,E as J,P as Q,R as Y,V as f,G as V}from"./config-DCaRzIAl.js";import{T as $,L as ee,R as ne,S as te,P as ie,W as oe,A as ae,j as re,M as se,m as le,I as ce,a as ue,E as de,b as me,D as ge,G as pe,c as fe,C as he}from"./vendor_three-DFRtrglt.js";import{g as t}from"./vendor_gsap-DKtf60Sy.js";import"./vendor-eek0SBdr.js";var ve=`vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}
float permute(float x) {
  return floor(mod(((x * 34.0) + 1.0) * x, 289.0));
}
vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}
float taylorInvSqrt(float r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip) {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p, s;
  p.xyz = floor(fract(vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz * 2.0 - 1.0) * s.www;
  return p;
}

float simplexNoise4d(vec4 v) {
  const vec2 C = vec2(0.138196601125010504, 0.309016994374947451);
  vec4 i = floor(v + dot(v, C.yyyy));
  vec4 x0 = v - i + dot(i, C.xxxx);

  vec4 i0;

  vec3 isX = step(x0.yzw, x0.xxx);
  vec3 isYZ = step(x0.zww, x0.yyz);
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  vec4 i3 = clamp(i0, 0.0, 1.0);
  vec4 i2 = clamp(i0 - 1.0, 0.0, 1.0);
  vec4 i1 = clamp(i0 - 2.0, 0.0, 1.0);

  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  i = mod(i, 289.0);
  float j0 = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute(permute(permute(permute(i.w + vec4(i1.w, i2.w, i3.w, 1.0)) + i.z + vec4(i1.z, i2.z, i3.z, 1.0)) + i.y + vec4(i1.y, i2.y, i3.y, 1.0)) + i.x + vec4(i1.x, i2.x, i3.x, 1.0));

  vec4 ip = vec4(1.0 / 294.0, 1.0 / 49.0, 1.0 / 7.0, 0.0);

  vec4 p0 = grad4(j0, ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4, p4));

  vec3 m0 = max(0.6 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3, x3), dot(x4, x4)), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * (dot(m0 * m0, vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2))) + dot(m1 * m1, vec2(dot(p3, x3), dot(p4, x4))));
}\r
attribute vec3 tangent;

uniform float uTime;\r
uniform float uPositionFrequency;\r
uniform float uPositionStrength;\r
uniform float uTimeFrequency;

uniform float uSmallWavePositionFrequency;\r
uniform float uSmallWavePositionStrength;\r
uniform float uSmallWaveTimeFrequency;\r

float getBlob(vec3 position) {\r
    vec3 wrappedPosition = position;\r
    wrappedPosition += simplexNoise4d(vec4(position * uPositionFrequency, uTime * uTimeFrequency)) * uPositionStrength;

    return simplexNoise4d(vec4(wrappedPosition * uSmallWavePositionFrequency, uTime * uSmallWaveTimeFrequency)) * uSmallWavePositionStrength;\r
}

void main() {

    vec3 bitangent = cross(tangent.xyz, normal);

    float shift = 0.07;\r
    vec3 A = csm_Position + shift * tangent.xyz;\r
    vec3 B = csm_Position + shift * bitangent;

    float blob = getBlob(csm_Position);\r
    csm_Position += blob * normal;

    A += getBlob(A) * normal;\r
    B += getBlob(B) * normal;

    vec3 shadowA = normalize(A - csm_Position);\r
    vec3 shadowB = normalize(B - csm_Position);

    csm_Normal = -cross(shadowA, shadowB);\r
}`,we=`uniform float progress;\r
uniform float direction;

#define PI 3.1415926538

vec3 rotateAxis(vec3 p, vec3 axis, float angle) {\r
    return mix(dot(axis, p) * axis, p, cos(angle)) + cross(axis, p) * sin(angle);\r
}

void main() {

    vec3 pos = position;

    float twirlPeriod = sin(progress * PI * 2.);

    float rotateAngle = -direction * pow(sin(progress * PI), 1.5) * PI * 2.;

    float twirlAngle = -sin(uv.x - .5) * pow(twirlPeriod, 2.0) * -4.;

    float twirlRotate = rotateAngle + twirlAngle;

    pos = rotateAxis(pos, vec3(1., 0., 0.), twirlRotate);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\r
}`;const a=[{name:"Creative Developer",background:"#DADADA",config:{uPositionFrequency:1.7,uPositionStrength:.3,uSmallWavePositionFrequency:.5,uSmallWavePositionStrength:.2,roughness:.4,metalness:1,envMapIntensity:.5,clearcoat:0,clearcoatRoughness:0,transmission:0,flatShading:!1,wireframe:!1,map:"imaginarium.png"}},{name:"ML & AI",background:"#DADADA",config:{uPositionFrequency:.584,uPositionStrength:.276,uSmallWavePositionFrequency:.899,uSmallWavePositionStrength:1.266,roughness:0,metalness:1,envMapIntensity:2,clearcoat:0,clearcoatRoughness:0,transmission:0,flatShading:!1,wireframe:!1,map:"purple-rain.png"}},{name:"Backend Developer",background:"#DADADA",config:{uPositionFrequency:.5,uPositionStrength:.15,uSmallWavePositionFrequency:8,uSmallWavePositionStrength:.05,roughness:.1,metalness:1,envMapIntensity:.5,clearcoat:1,clearcoatRoughness:.1,transmission:0,flatShading:!1,wireframe:!1,map:"lucky-day.png"}},{name:"Three JS / GLSL",background:"#DADADA",config:{uPositionFrequency:.78,uPositionStrength:5,uSmallWavePositionFrequency:.631,uSmallWavePositionStrength:.04,roughness:.1,metalness:1,envMapIntensity:.5,clearcoat:1,clearcoatRoughness:.1,transmission:0,flatShading:!1,wireframe:!1,map:"12.jpg"}},{name:"Freelancer",background:"#DADADA",config:{uPositionFrequency:1.022,uPositionStrength:.99,uSmallWavePositionFrequency:.378,uSmallWavePositionStrength:.341,roughness:.292,metalness:.73,envMapIntensity:.86,clearcoat:1,clearcoatRoughness:0,transmission:0,flatShading:!1,wireframe:!1,map:"6.jpg"}}];window.addEventListener("error",e=>{console.error("Global error:",e.message,"at",e.filename+":"+e.lineno)});window.addEventListener("unhandledrejection",e=>{console.error("Unhandled promise rejection:",e.reason)});let p=window.innerWidth/5800;window.innerWidth>1500?p=window.innerWidth/6e3:window.innerWidth<1400&&window.innerWidth>1e3||window.innerWidth<1e3&&window.innerWidth>500?p=window.innerWidth/5800:window.innerWidth<500&&(p=window.innerWidth/5900);let w={x:0,y:0},x="none",S,P,u,m,M,R;const E=V.fingerLookupIndices,ye=V.landmarkColors,b=new ee,N=new $(b),xe=new ne(b);let h=!1,s=0;const q=new te,F=new ie(75,window.innerWidth/window.innerHeight,.1,1e3),g=new oe({canvas:document.querySelector("#canvas"),alpha:!0,antialias:!0});g.setSize(window.innerWidth,window.innerHeight);g.setPixelRatio(Math.min(window.devicePixelRatio,2));g.toneMapping=ae;g.toneMappingExposure=1;const X={uTime:{value:0},uPositionFrequency:{value:a[s].config.uPositionFrequency},uPositionStrength:{value:a[s].config.uPositionStrength},uTimeFrequency:{value:.3},uSmallWavePositionFrequency:{value:a[s].config.uSmallWavePositionFrequency},uSmallWavePositionStrength:{value:a[s].config.uSmallWavePositionStrength},uSmallWaveTimeFrequency:{value:.3}},r=new re({baseMaterial:se,vertexShader:ve,map:N.load(_.getAssetUrl(a[0].config.map,"gradients")),metalness:a[s].config.metalness,roughness:a[s].config.roughness,envMapIntensity:a[s].config.envMapIntensity,clearcoat:a[s].config.clearcoat,clearcoatRoughness:a[s].config.clearcoatRoughness,transmission:a[s].config.transmission,flatShading:a[s].config.flatShading,wireframe:a[s].config.wireframe,uniforms:X}),Z=le(new ce(1,70));Z.computeTangents();const d=new ue(Z,r);q.add(d);F.position.z=3;xe.load(J.HDRI,function(e){e.mapping=de,q.environment=e});window.addEventListener("resize",()=>{F.aspect=window.innerWidth/window.innerHeight,F.updateProjectionMatrix(),g.setSize(window.innerWidth,window.innerHeight),g.setPixelRatio(Math.min(window.devicePixelRatio,2))});const Se=new he,W=new me({fragmentShader:"void main() { gl_FragColor = vec4(1.0); }",vertexShader:we,side:ge,uniforms:{progress:{value:0},direction:{value:1}}}),A=new pe;q.add(A);const y=a.map((e,i)=>{const n=new fe;return n.text=e.name,n.font=Q.FONTS+"aften_screen.woff",n.anchorX="center",n.anchorY="middle",n.material=W,n.position.set(0,0,2),i!==0&&n.scale.set(0,0,2),n.letterSpacing=-.08,n.fontSize=Math.min(p,.3),n.glyphGeometryDetail=20,n.sync(),A.add(n),n});let C={x:d.rotation.x,y:d.rotation.y};function D(e){if(h)return;h=!0;let i=Math.sign(e.deltaY),n=(s+i+a.length)%a.length;y[n].scale.set(1,1,1),y[n].position.x=i*3.5,t.to(W.uniforms.progress,{value:.5,duration:1,ease:"linear",onComplete:()=>{s=n,h=!1,W.uniforms.progress.value=0}}),t.to(y[s].position,{x:-i*3,duration:1,ease:"power2.inOut"}),t.to(d.rotation,{y:d.rotation.y+Math.PI*1*-i,duration:1,ease:"power2.inOut",onComplete:()=>{C.y=d.rotation.y,C.x=d.rotation.x}}),t.to(y[n].position,{x:0,duration:1,ease:"power2.inOut"}),Pe(a[n].config)}window.addEventListener("wheel",e=>{D(e)});var k;(k=document.querySelector(".mobileTransition .rightBtn"))==null||k.addEventListener("click",()=>{D({deltaY:1})});var z;(z=document.querySelector(".mobileTransition .leftBtn"))==null||z.addEventListener("click",()=>{D({deltaY:-1})});function Pe(e){e.uPositionFrequency!==void 0&&t.to(r.uniforms.uPositionFrequency,{value:e.uPositionFrequency,duration:1,ease:"power2.inOut"}),e.uPositionStrength!==void 0&&t.to(r.uniforms.uPositionStrength,{value:e.uPositionStrength,duration:1,ease:"power2.inOut"}),e.uSmallWavePositionFrequency!==void 0&&t.to(r.uniforms.uSmallWavePositionFrequency,{value:e.uSmallWavePositionFrequency,duration:1,ease:"power2.inOut"}),e.uSmallWavePositionStrength!==void 0&&t.to(r.uniforms.uSmallWavePositionStrength,{value:e.uSmallWavePositionStrength,duration:1,ease:"power2.inOut"}),e.uSmallWaveTimeFrequency!==void 0&&t.to(r.uniforms.uSmallWaveTimeFrequency,{value:e.uSmallWaveTimeFrequency,duration:1,ease:"power2.inOut"}),e.map!==void 0&&setTimeout(()=>{r.map=N.load(_.getAssetUrl(e.map,"gradients"))},400),e.roughness!==void 0&&t.to(r,{roughness:e.roughness,duration:1,ease:"power2.inOut"}),e.metalness!==void 0&&t.to(r,{metalness:e.metalness,duration:1,ease:"power2.inOut"}),e.envMapIntensity!==void 0&&t.to(r,{envMapIntensity:e.envMapIntensity,duration:1,ease:"power2.inOut"}),e.clearcoat!==void 0&&t.to(r,{clearcoat:e.clearcoat,duration:1,ease:"power2.inOut"}),e.clearcoatRoughness!==void 0&&t.to(r,{clearcoatRoughness:e.clearcoatRoughness,duration:1,ease:"power2.inOut"}),e.transmission!==void 0&&t.to(r,{transmission:e.transmission,duration:1,ease:"power2.inOut"}),e.flatShading!==void 0&&t.to(r,{flatShading:e.flatShading,duration:1,ease:"power2.inOut"}),e.wireframe!==void 0&&t.to(r,{wireframe:e.wireframe,duration:1,ease:"power2.inOut"})}b.onLoad=()=>{function e(){requestAnimationFrame(e),X.uTime.value=Se.getElapsedTime(),g.render(q,F)}e()};document.querySelector("body").addEventListener("mousemove",function(e){h||t.to(A.position,{x:-t.utils.mapRange(0,window.innerWidth,-.03,.03,e.clientX),y:t.utils.mapRange(0,window.innerHeight,-.03,.03,e.clientY),duration:1})});function Fe(){const e=new fp.GestureDescription("thumbs_down");e.addCurl(fp.Finger.Thumb,fp.FingerCurl.NoCurl),e.addDirection(fp.Finger.Thumb,fp.FingerDirection.VerticalDown,1),e.addDirection(fp.Finger.Thumb,fp.FingerDirection.DiagonalDownLeft,.9),e.addDirection(fp.Finger.Thumb,fp.FingerDirection.DiagonalDownRight,.9);for(let i of[fp.Finger.Index,fp.Finger.Middle,fp.Finger.Ring,fp.Finger.Pinky])e.addCurl(i,fp.FingerCurl.FullCurl,.9),e.addCurl(i,fp.FingerCurl.HalfCurl,.9);return e}function Ce(){const e=new fp.GestureDescription("hello");for(let i of[fp.Finger.Thumb,fp.Finger.Index,fp.Finger.Middle,fp.Finger.Ring,fp.Finger.Pinky])e.addCurl(i,fp.FingerCurl.NoCurl,1),e.addDirection(i,fp.FingerDirection.VerticalUp,1),e.addDirection(i,fp.FingerDirection.DiagonalUpLeft,.9),e.addDirection(i,fp.FingerDirection.DiagonalUpRight,.9);return e}function qe(){const e=new fp.GestureDescription("close");for(let i of[fp.Finger.Index,fp.Finger.Middle,fp.Finger.Ring,fp.Finger.Pinky])e.addCurl(i,fp.FingerCurl.FullCurl,1),e.addCurl(i,fp.FingerCurl.HalfCurl,.5);return e}function De(e){for(let n=0;n<e.length;n++){const o=e[n][0],l=e[n][1];Te(l-2,o-2,3)}const i=Object.keys(E);for(let n=0;n<i.length;n++){const o=i[n],l=E[o].map(c=>e[c]);We(l,!1,ye[o])}}function Te(e,i,n){u.beginPath(),u.arc(i,e,n,0,2*Math.PI),u.fill()}function We(e,i,n){u.strokeStyle=n;const o=new Path2D;o.moveTo(e[0][0],e[0][1]);for(let l=1;l<e.length;l++){const c=e[l];o.lineTo(c[0],c[1])}u.stroke(o)}async function be(e,i,n){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("Browser AnavI navigator.mediaDevices.getUserMedia is not available");let o=document.getElementById("webcam");o.muted=!0,o.width=e,o.height=i;const l={audio:!1,video:{facingMode:"user",width:e,height:i,frameRate:{max:n}}};try{const c=await navigator.mediaDevices.getUserMedia(l);return o.srcObject=c,document.querySelector("footer .p2 ").textContent="Click here and control the website with your hand",document.querySelector(".howtoUseHand").style.display="flex",t.to(".howtoUseHand",{opacity:1}),t.to("#video-container",{opacity:1}),new Promise(v=>{o.onloadedmetadata=()=>{v(o)}})}catch{document.querySelector("footer .p2 ").textContent="Enable Camera Access to activate Hand-Gesture Mode"}}async function Ae(){const e=await be(f.width,f.height,f.fps);return e.play(),e}async function Ie(e){async function i(){u.drawImage(e,0,0,S,P,0,0,m.width,m.height);const o=await R.estimateHands(e);if(o.length===0&&(x="none"),o.length>0){const l=o[0].landmarks;De(l,o[0].annotations);const c=Re(o[0].landmarks);w.x=(1-c.x/f.width)*2-1,w.y=(1-c.y/f.height)*2-1,!h&&x!=="close"&&t.to(d.rotation,{y:C.y+w.x*2.5,x:C.x-w.y*1.5,duration:1})}if(o.length>0&&Object.keys(o[0]).includes("landmarks")){const l=M.estimate(o[0].landmarks,9);if(l.gestures.length>0){let c=l.gestures.reduce((v,I)=>v.score>I.score?v:I);c.score>5&&(x=c.name)}}requestAnimationFrame(i)}const n=[Fe(),Ce(),qe()];M=new fp.GestureEstimator(n),R=await handpose.load(),i()}async function Me(){let e=await Ae();S=e.videoWidth,P=e.videoHeight,m=document.getElementById("VideoCanvas"),m.width=S,m.height=P,u=m.getContext("2d"),u.clearRect(0,0,S,P),u.fillStyle="white",u.translate(m.width,0),u.scale(-1,1),Ie(e)}function Re(e){let i=0,n=0;return e.forEach(o=>{i+=o[0],n+=o[1]}),i/=e.length,n/=e.length,{x:i,y:n}}let T=!1;function K(){setTimeout(()=>{x=="close"&&!T&&(T=!0,D({deltaY:100}),setTimeout(()=>{T=!1},1200)),K()},100)}K();var G;(G=document.querySelector(".page footer .cameraBtn"))==null||G.addEventListener("mouseenter",()=>{t.to(".page footer .cameraBtn",{backgroundColor:" white ",color:"black"}),t.to(".page footer .cameraBtn .p2",{opacity:1})});var O;(O=document.querySelector(".page footer .cameraBtn"))==null||O.addEventListener("mouseleave",()=>{t.to(".page footer .cameraBtn",{backgroundColor:" black ",color:"white"}),t.to(".page footer .cameraBtn .p2",{opacity:0})});var B;(B=document.querySelector(".page footer .cameraBtn"))==null||B.addEventListener("click",()=>{Me()});var H;(H=document.querySelector(".howtoUseHand .cut"))==null||H.addEventListener("click",()=>{t.to(".howtoUseHand",{opacity:0,onComplete:()=>{document.querySelector(".howtoUseHand").style.display="none"}})});var j;(j=document.querySelector(".worksLink"))==null||j.addEventListener("click",()=>{t.fromTo(".Transition div",{height:"0%"},{height:"100%",stagger:.12,duration:1.5,onComplete:()=>{window.location.href=Y.WORKS}})});var U;(U=document.querySelector(".aboutLink"))==null||U.addEventListener("click",()=>{t.fromTo(".Transition div",{height:"0%"},{height:"100%",stagger:.12,duration:1.5,onComplete:()=>{window.location.href=Y.ABOUT}})});const Ee=360*60*1e3,L=localStorage.getItem("lastVisit");if(!L||Date.now()-L>Ee){localStorage.setItem("lastVisit",Date.now());let e=4;t.to(".LoadingPage .line",{width:"100vw",delay:.5,duration:e}),t.to(".LoadingPage .text",{opacity:1,delay:.5,delay:e/4,stagger:e/5,onComplete:()=>{t.to(".LoadingPage",{opacity:0,onComplete:()=>{document.querySelector(".LoadingPage").style.display="none",t.fromTo(".Transition div",{height:"100%"},{delay:.2,height:"0%",stagger:.1,duration:1.7})}})}})}else document.querySelector(".LoadingPage").style.display="none",t.fromTo(".Transition div",{height:"100%"},{delay:.4,height:"0%",stagger:.1,duration:1.7});
