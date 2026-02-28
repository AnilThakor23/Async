import{R as G}from"./config-DCaRzIAl.js";import{g as h}from"./vendor_gsap-DKtf60Sy.js";import{S as Q,O as $,W as ee,d as te,V as z,e as L,f as oe,b as re,a as ae,T as ie,g as I,h as b,i as Z,N as P,k as le}from"./vendor_three-DFRtrglt.js";import"./vendor-eek0SBdr.js";const R=[{title:"Motion Study",image:"images/works1.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2024,href:"/"},{title:"Digital Bloom",image:"images/works2.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2023,href:"/"},{title:"Echo Design",image:"images/works3.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2022,href:"/"},{title:"Waveform Art",image:"images/works4.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2024,href:"/"},{title:"Pixel Flow",image:"images/works5.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2021,href:"/"},{title:"Neon Trails",image:"images/works6.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2023,href:"/"},{title:"Visual Drift",image:"images/works7.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2022,href:"/"},{title:"Reactive Grid",image:"images/works8.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2020,href:"/"},{title:"Geometry Loop",image:"images/works9.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2023,href:"/"},{title:"Pattern Code",image:"images/works10.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2024,href:"/"},{title:"Signal Noise",image:"images/works11.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2021,href:"/"},{title:"Light Canvas",image:"images/works12.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2022,href:"/"},{title:"Echo Pulse",image:"images/works13.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2023,href:"/"},{title:"Fragment Flow",image:"images/works14.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2024,href:"/"},{title:"Frame Sync",image:"images/works15.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2020,href:"/"},{title:"Generative Mesh",image:"images/works16.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2021,href:"/"},{title:"Visual Memory",image:"images/works17.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2022,href:"/"},{title:"Data Pulse",image:"images/works18.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2024,href:"/"},{title:"Motion Language",image:"images/works19.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2023,href:"/"},{title:"Layer Drift",image:"images/works20.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2022,href:"/"},{title:"Echo Layer",image:"images/works21.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2021,href:"/"},{title:"Form Noise",image:"images/works22.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2020,href:"/"},{title:"Mesh Vibe",image:"images/works23.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2023,href:"/"},{title:"Rhythm Grid",image:"images/works24.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2024,href:"/"},{title:"Sketch Synth",image:"images/works25.jpg",hoverColor:"rgba(100,100,100,0.1)",year:2022,href:"/"}],ne=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,se=`
  uniform vec2 uOffset;
  uniform vec2 uResolution;
  uniform vec4 uBorderColor;
  uniform vec4 uHoverColor;
  uniform vec4 uBackgroundColor;
  uniform vec2 uMousePos;
  uniform float uZoom;
  uniform float uCellSize;
  uniform float uTextureCount;
  uniform sampler2D uImageAtlas;
  uniform sampler2D uTextAtlas;

  varying vec2 vUv;

  void main() {
    vec2 screenUV = (vUv - 0.5) *2.0;

    float radius = length(screenUV);
    float distortion = 1.0 - 0.11 * radius * radius;
    vec2 distortedUV = screenUV * distortion;

    vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 worldCoord = distortedUV * aspectRatio;

    worldCoord *= uZoom;
    worldCoord += uOffset;

    vec2 cellPos = worldCoord / uCellSize;
    vec2 cellId = floor(cellPos);
    vec2 cellUV = fract(cellPos);

    vec2 mouseScreenUV = (uMousePos / uResolution) * 2.0 - 1.0;
    mouseScreenUV.y = -mouseScreenUV.y;

    float mouseRadius = length(mouseScreenUV);
    float mouseDistortion = 1.0 - 0.08 * mouseRadius * mouseRadius;
    vec2 mouseDistortedUV = mouseScreenUV * mouseDistortion;
    vec2 mouseWorldCoord = mouseDistortedUV * aspectRatio;
    mouseWorldCoord *= uZoom;
    mouseWorldCoord += uOffset;

    vec2 mouseCellPos = mouseWorldCoord / uCellSize;
    vec2 mouseCellId = floor(mouseCellPos);

    vec2 cellCenter = cellId + 0.5;
    vec2 mouseCellCenter = mouseCellId + 0.5;

    float cellDistance = length(cellCenter - mouseCellCenter);
    float hoverIntensity = 1.0 - smoothstep(0.4, 0.7, cellDistance);
    bool isHovered = hoverIntensity > 0.0 && uMousePos.x >= 0.0;

    vec3 backgroundColor = uBackgroundColor.rgb;
    if (isHovered) {
      backgroundColor = mix(uBackgroundColor.rgb, uHoverColor.rgb, hoverIntensity * uHoverColor.a);
    }

    float lineWidth = 0.005;
    float gridX = smoothstep(0.0, lineWidth, cellUV.x) * smoothstep(0.0, lineWidth, 1.0 - cellUV.x);
    float gridY = smoothstep(0.0, lineWidth, cellUV.y) * smoothstep(0.0, lineWidth, 1.0 - cellUV.y);
    float gridMask = gridX * gridY;

    float imageSize = 0.6;
    float imageBorder = (1.0 - imageSize) * 0.5;
    vec2 imageUV = (cellUV - imageBorder) / imageSize;

    float edgeSmooth = 0.01;
    vec2 imageMask = smoothstep(-edgeSmooth, edgeSmooth, imageUV) *
                     smoothstep(-edgeSmooth, edgeSmooth, 1.0 - imageUV);
    float imageAlpha = imageMask.x * imageMask.y;

    bool inImageArea = imageUV.x >= 0.0 && imageUV.x <= 1.0 &&
                       imageUV.y >= 0.0 && imageUV.y <= 1.0;

    float textHeight = 0.08;
    float textY = 0.88;

    bool inTextArea = cellUV.x >= 0.05 && cellUV.x <= 0.95 &&
                      cellUV.y >= textY && cellUV.y <= (textY + textHeight);

    float textIndex = mod(cellId.x + cellId.y * 3.0, uTextureCount);

    vec3 color = backgroundColor;

    if (inImageArea && imageAlpha > 0.0) {
      float atlasSize = ceil(sqrt(uTextureCount));
      vec2 atlasPos = vec2(mod(textIndex, atlasSize), floor(textIndex / atlasSize));
      vec2 atlasUV = (atlasPos + imageUV) / atlasSize;
      atlasUV.y = 1.0 - atlasUV.y;

      vec3 imageColor = texture2D(uImageAtlas, atlasUV).rgb;
      color = mix(color, imageColor, imageAlpha);
    }

    if (inTextArea) {
      vec2 textCoord = vec2((cellUV.x - 0.05) / 0.9, (cellUV.y - textY) / textHeight);
      textCoord.y = 1.0 - textCoord.y;

      float atlasSize = ceil(sqrt(uTextureCount));
      vec2 atlasPos = vec2(mod(textIndex, atlasSize), floor(textIndex / atlasSize));
      vec2 atlasUV = (atlasPos + textCoord) / atlasSize;

      vec4 textColor = texture2D(uTextAtlas, atlasUV);
      vec3 textBgColor = backgroundColor;
      color = mix(textBgColor, textColor.rgb, textColor.a);
    }

    vec3 borderRGB = uBorderColor.rgb;
    float borderAlpha = uBorderColor.a;
    color = mix(color, borderRGB, (1.0 - gridMask) * borderAlpha);

    float fade = 1.0 - smoothstep(1.2, 1.8, radius);
    gl_FragColor = vec4(color * fade, 1.0);
  }
`;h.fromTo(".Transition div",{height:"100%"},{delay:.4,height:"0%",stagger:.1,duration:1.7});document.querySelector(".homeLink").addEventListener("click",()=>{h.fromTo(".Transition div",{height:"0%"},{height:"100%",stagger:.12,duration:1.5,onComplete:()=>{window.location.href=G.HOME}})});document.querySelector(".aboutLink").addEventListener("click",()=>{h.fromTo(".Transition div",{height:"0%"},{height:"100%",stagger:.12,duration:1.5,onComplete:()=>{window.location.href=G.ABOUT}})});window.addEventListener("mousemove",e=>{h.to(".cursor",{left:e.x,top:e.y,duration:.2})});let c={cellSize:.65,zoomlevel:1.25,lerpFactor:.075,borderColor:"rgba(0,0,0,0.1)",backgroundColor:"rgba(218, 218, 218, 1)",textColor:"rgba(0,0,0,1)"};window.innerWidth<500?c.cellSize=.3:window.innerWidth<1e3&&(c.cellSize=.45);let j,M,s,i,V=!1,D=!0,N=0,w={x:0,y:0},C={x:0,y:0},m={x:0,y:0},S={x:0,y:0},x={x:-1,y:-1},E=1,B=1,A=[];const T=e=>{const t=e.match(/rgba?\(([^)]+)\)/);return t?t[1].split(",").map((r,o)=>o<3?parseFloat(r.trim())/255:parseFloat(r.trim()||1)):[1,1,1,1]},ue=(e,t)=>{const r=document.createElement("canvas");r.width=2048,r.height=256;const o=r.getContext("2d");o.clearRect(0,0,2048,256),o.font="bold 100px Anton",o.fillStyle=c.textColor,o.textBaseline="middle",o.imageSmoothingEnabled=!0,o.textAlign="left",o.fillText(e.toUpperCase(),30,128),o.textAlign="right",o.fillText(t.toString().toUpperCase(),2018,128);const a=new Z(r);return Object.assign(a,{wrapS:b,wrapT:b,minFilter:P,magFilter:P,flipY:!1,generateMipmaps:!1,format:le}),a},W=(e,t=!1)=>{const r=Math.ceil(Math.sqrt(e.length)),o=512,a=document.createElement("canvas");a.width=a.height=r*o;const n=a.getContext("2d");t?n.clearRect(0,0,a.width,a.height):(n.fillStyle="black",n.fillRect(0,0,a.width,a.height)),e.forEach((u,l)=>{var v,g;const d=l%r*o,f=Math.floor(l/r)*o;t&&((v=u.source)!=null&&v.data)?n.drawImage(u.source.data,d,f,o,o):!t&&((g=u.image)!=null&&g.complete)&&n.drawImage(u.image,d,f,o,o)});const y=new Z(a);return Object.assign(y,{wrapS:b,wrapT:b,minFilter:P,magFilter:P,flipY:!1}),y},ce=()=>{const e=new ie,t=[];let r=0;return new Promise(o=>{R.forEach(a=>{const n=e.load(a.image,()=>{++r===R.length&&o(t)});Object.assign(n,{wrapS:b,wrapT:b,minFilter:I,magFilter:I}),t.push(n),A.push(ue(a.title,a.year))})})},F=e=>{const t=s.domElement.getBoundingClientRect();x.x=e.clientX-t.left,x.y=e.clientY-t.top,i==null||i.material.uniforms.uMousePos.value.set(x.x,x.y)},_=(e,t)=>{V=!0,D=!0,N=Date.now(),h.to(".cursor ",{height:"10px",width:"10px",duration:.2}),w.x=e,w.y=t,B=c.zoomlevel},J=(e,t)=>{if(!V||e===void 0||t===void 0)return;const r=e-w.x,o=t-w.y;(Math.abs(r)>2||Math.abs(o)>2)&&(D=!1,B===1&&(B=c.zoomlevel)),m.x-=r*.007,m.y+=o*.007,S.y=m.y,S.x=m.x,w.x=e,w.y=t},q=e=>_(e.clientX,e.clientY),H=e=>J(e.clientX,e.clientY),p=e=>{var t,r,o,a;if(V=!1,h.to(".cursor ",{height:"20px",width:"20px",duration:.2}),B=1,D&&Date.now()-N<200){const n=e.clientX||((r=(t=e.changedTouches)==null?void 0:t[0])==null?void 0:r.clientX),y=e.clientY||((a=(o=e.changedTouches)==null?void 0:o[0])==null?void 0:a.clientY);if(n!==void 0&&y!==void 0){const u=s.domElement.getBoundingClientRect(),l=(n-u.left)/u.width*2-1,d=-((y-u.top)/u.height)*2-1,f=Math.sqrt(l*l+d*d),v=1-.08*f*f;l*v*(u.width/u.height)*E+C.x}}},Y=e=>{e.preventDefault(),_(e.touches[0].clientX,e.touches[0].clientY)},O=e=>{e.preventDefault(),J(e.touches[0].clientX,e.touches[0].clientY)},X=()=>{const e=document.getElementById("gallery");if(!e)return;const{offsetWidth:t,offsetHeight:r}=e;M.updateProjectionMatrix(),s.setSize(t,r),s.setPixelRatio(window.devicePixelRatio),i==null||i.material.uniforms.uResolution.value.set(t,r)};function ge(){let e=document.querySelector("#gallery");e&&(e.addEventListener("mousedown",q),e.addEventListener("mousemove",H),e.addEventListener("mouseup",p),e.addEventListener("mouseleave",p),e.addEventListener("touchstart",Y,{passive:!1}),e.addEventListener("touchmove",O,{passive:!1}),e.addEventListener("touchend",p,{passive:!1}),window.addEventListener("resize",X),document.addEventListener("contextmenu",t=>t.preventDefault()),s.domElement.addEventListener("mousemove",F),window.addEventListener("mousemove",t=>{let r=t.x/window.innerWidth*2-1,o=t.y/window.innerHeight*2-1;V||(m.x=-r*.1+S.x,m.y=o*.1+S.y)}),s.domElement.addEventListener("mouseleave",()=>{x.x=x.y=-1,i==null||i.material.uniforms.uMousePos.value.set(-1,-1)}),s.domElement,s.domElement)}function K(){requestAnimationFrame(K),C.x+=(m.x-C.x)*c.lerpFactor,C.y+=(m.y-C.y)*c.lerpFactor,E+=(B-E)*c.lerpFactor,i!=null&&i.material.uniforms&&(i.material.uniforms.uOffset.value.set(C.x,C.y),i.material.uniforms.uZoom.value=E),s.render(j,M)}async function me(){A=[];let e=document.getElementById("gallery");if(!e)return;j=new Q,M=new $(-1,1,1,-1,.1,10),M.position.z=3,s=new ee({antialias:!0,alpha:!1}),s.setSize(e.offsetWidth,e.offsetHeight),s.setPixelRatio(window.devicePixelRatio);const t=T(c.backgroundColor);s.setClearColor(new te(t[0],t[1],t[2]),t[3]),e.appendChild(s.domElement);const r=await ce(),o=W(r,!1),a=W(A,!0);let n={uOffset:{value:new z(0,0)},uResolution:{value:new z(e.offsetWidth,e.offsetHeight)},uBorderColor:{value:new L(...T(c.borderColor))},uHoverColor:{value:0},uBackgroundColor:{value:new L(...T(c.backgroundColor))},uMousePos:{value:new z(-1,-1)},uZoom:{value:1},uCellSize:{value:c.cellSize},uTextureCount:{value:R.length},uImageAtlas:{value:o},uTextAtlas:{value:a}};R.forEach(g=>{n.uHoverColor.value=new L(...T(g.hoverColor))});const y=new oe(2,2),u=new re({vertexShader:ne,fragmentShader:se,uniforms:n});i=new ae(y,u),j.add(i),ge(),K();let l=!1,d=document.querySelector(".PageShiftButton1"),f=document.querySelector(".PageShiftButton2"),v=document.querySelector(".PageShiftButton3");d&&f&&v&&(d.addEventListener("click",()=>{if(l)return;l=!0;let g=document.querySelector(".transitionButtons .bgButton"),k=document.querySelector(".transitionButtons").getBoundingClientRect(),U=d.getBoundingClientRect();h.to(g,{left:U.left-k.left+"px",onComplete:()=>{l=!1}})}),f.addEventListener("click",()=>{if(l)return;l=!0;let g=document.querySelector(".transitionButtons .bgButton"),k=document.querySelector(".transitionButtons").getBoundingClientRect(),U=f.getBoundingClientRect();h.to(g,{left:U.left-k.left+"px",onComplete:()=>{l=!1}})}),v.addEventListener("click",()=>{if(l)return;l=!0;let g=document.querySelector(".transitionButtons .bgButton"),k=document.querySelector(".transitionButtons").getBoundingClientRect(),U=v.getBoundingClientRect();h.to(g,{left:U.left-k.left+"px",onComplete:()=>{l=!1}})}))}me();
