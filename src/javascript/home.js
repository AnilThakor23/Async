import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import vertexShader from '../../shaders/vertex.glsl';
import textVertexShader from '../../shaders/textVertex.glsl';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Text } from 'troika-three-text';
import { gsap } from "gsap";
import blobs from './blobs.js';
import CONFIG, { PATHS, VIDEO_CONFIG, EXTERNAL_RESOURCES, GESTURE_CONFIG, ROUTES } from '../../config.js';
import '../css/home.css';

// global error handlers to catch runtime issues in production
window.addEventListener('error', (e) => {
  console.error('Global error:', e.message, 'at', e.filename + ':' + e.lineno);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});



let FontSize_3DText = window.innerWidth / 5800;

if (window.innerWidth > 1500) FontSize_3DText = window.innerWidth/6000
else if (window.innerWidth < 1400 && window.innerWidth > 1000 ) FontSize_3DText = window.innerWidth / 5800
else if (window.innerWidth < 1000 && window.innerWidth > 500 ) FontSize_3DText = window.innerWidth / 5800
else if (window.innerWidth < 500 ) FontSize_3DText = window.innerWidth / 5900



let handPosition = { x: 0, y: 0 };
let curruntGesture = 'none';
let videoWidth, videoHeight, drawingContext, canvas, gestureEstimator;
let model;

const gestureStrings = GESTURE_CONFIG.strings;
const fingerLookupIndices = GESTURE_CONFIG.fingerLookupIndices;
const landmarkColors = GESTURE_CONFIG.landmarkColors;


// Create the scene
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const rgbeLoader = new RGBELoader(loadingManager);



let isAnimating = false;
let currentIndex = 0;

const scene = new THREE.Scene();
// scene.background = new THREE.Color('#333');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  alpha: true,
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
// renderer.outputEncoding = THREE.sRGBEncoding;

const uniforms = {
  uTime: { value: 0 },
  uPositionFrequency: { value: blobs[currentIndex].config.uPositionFrequency },
  uPositionStrength: { value: blobs[currentIndex].config.uPositionStrength },
  uTimeFrequency: { value: .3 },
  uSmallWavePositionFrequency: { value: blobs[currentIndex].config.uSmallWavePositionFrequency },
  uSmallWavePositionStrength: { value: blobs[currentIndex].config.uSmallWavePositionStrength },
  uSmallWaveTimeFrequency: { value: .3 },
};




const material = new CustomShaderMaterial({
  baseMaterial: THREE.MeshPhysicalMaterial,
  vertexShader,
  map: textureLoader.load(CONFIG.getAssetUrl(blobs[0].config.map, 'gradients')),
  metalness: blobs[currentIndex].config.metalness,
  roughness: blobs[currentIndex].config.roughness,
  envMapIntensity: blobs[currentIndex].config.envMapIntensity,
  clearcoat: blobs[currentIndex].config.clearcoat,
  clearcoatRoughness: blobs[currentIndex].config.clearcoatRoughness,
  transmission: blobs[currentIndex].config.transmission,
  flatShading: blobs[currentIndex].config.flatShading,
  wireframe: blobs[currentIndex].config.wireframe,
  uniforms,
});

const mergedGeometry = mergeVertices(new THREE.IcosahedronGeometry(1, 70));
mergedGeometry.computeTangents();
const sphere = new THREE.Mesh(mergedGeometry, material);
// sphere.position.y += 0.5;
scene.add(sphere);

camera.position.z = 3;

rgbeLoader.load(EXTERNAL_RESOURCES.HDRI, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const clock = new THREE.Clock();

const textMaterial = new THREE.ShaderMaterial({
  fragmentShader: `void main() { gl_FragColor = vec4(1.0); }`,
  vertexShader: textVertexShader,
  side: THREE.DoubleSide,
  uniforms: {
    progress: { value: 0.0 },
    direction: { value: 1 },
  }
});

// Create a group for texts
const textGroup = new THREE.Group();
scene.add(textGroup);

const texts = blobs.map((blob, index) => {
  const myText = new Text();
  myText.text = blob.name;
  // font asset is in the fonts folder; use the PATHS.FONTS entry so the base path is applied correctly
  myText.font = PATHS.FONTS + 'aften_screen.woff';
  myText.anchorX = 'center';
  myText.anchorY = 'middle';
  myText.material = textMaterial;
  myText.position.set(0, 0, 2);

  if (index !== 0) myText.scale.set(0, 0, 2);
  myText.letterSpacing = -0.08;
  myText.fontSize = Math.min(FontSize_3DText ,  0.3);
  
  myText.glyphGeometryDetail = 20;
  myText.sync();
  textGroup.add(myText); // Add text to the group
  return myText;
})

let SphereRotation = { x: sphere.rotation.x, y: sphere.rotation.y };

function TransitionAnime(e) {
  if (isAnimating) return;
  isAnimating = true;
  let direction = Math.sign(e.deltaY);

  let next = (currentIndex + direction + blobs.length) % blobs.length;

  texts[next].scale.set(1, 1, 1);
  texts[next].position.x = direction * 3.5;

  gsap.to(textMaterial.uniforms.progress, {
    value: .5,
    duration: 1,
    ease: 'linear',
    onComplete: () => {
      currentIndex = next;
      isAnimating = false;
      textMaterial.uniforms.progress.value = 0;
    }
  })

  gsap.to(texts[currentIndex].position, {
    x: -direction * 3,
    duration: 1,
    ease: 'power2.inOut',
  })


  gsap.to(sphere.rotation, {
    y: sphere.rotation.y + Math.PI * 1 * -direction,
    duration: 1,
    ease: 'power2.inOut',
    onComplete: () => {
      SphereRotation.y = sphere.rotation.y;
      SphereRotation.x = sphere.rotation.x;
    }
  })

  gsap.to(texts[next].position, {
    x: 0,
    duration: 1,
    ease: 'power2.inOut',
  })

  updateBlob(blobs[next].config);
}
window.addEventListener('wheel', (e) => {
  TransitionAnime(e);
})
document.querySelector(".mobileTransition .rightBtn")?.addEventListener("click", () => {
  let A235 = {
    deltaY: 1
  }
  TransitionAnime(A235);
})
document.querySelector(".mobileTransition .leftBtn")?.addEventListener("click", () => {
  let A236 = {
    deltaY: -1
  }
  TransitionAnime(A236);
})

function updateBlob(config) {
  if (config.uPositionFrequency !== undefined) gsap.to(material.uniforms.uPositionFrequency, { value: config.uPositionFrequency, duration: 1, ease: 'power2.inOut' });
  if (config.uPositionStrength !== undefined) gsap.to(material.uniforms.uPositionStrength, { value: config.uPositionStrength, duration: 1, ease: 'power2.inOut' });
  if (config.uSmallWavePositionFrequency !== undefined) gsap.to(material.uniforms.uSmallWavePositionFrequency, { value: config.uSmallWavePositionFrequency, duration: 1, ease: 'power2.inOut' });
  if (config.uSmallWavePositionStrength !== undefined) gsap.to(material.uniforms.uSmallWavePositionStrength, { value: config.uSmallWavePositionStrength, duration: 1, ease: 'power2.inOut' });
  if (config.uSmallWaveTimeFrequency !== undefined) gsap.to(material.uniforms.uSmallWaveTimeFrequency, { value: config.uSmallWaveTimeFrequency, duration: 1, ease: 'power2.inOut' });
  if (config.map !== undefined) {
    setTimeout(() => {
      material.map = textureLoader.load(CONFIG.getAssetUrl(config.map, 'gradients'));
    }, 400);
  }
  if (config.roughness !== undefined) gsap.to(material, { roughness: config.roughness, duration: 1, ease: 'power2.inOut' });
  if (config.metalness !== undefined) gsap.to(material, { metalness: config.metalness, duration: 1, ease: 'power2.inOut' });
  if (config.envMapIntensity !== undefined) gsap.to(material, { envMapIntensity: config.envMapIntensity, duration: 1, ease: 'power2.inOut' });
  if (config.clearcoat !== undefined) gsap.to(material, { clearcoat: config.clearcoat, duration: 1, ease: 'power2.inOut' });
  if (config.clearcoatRoughness !== undefined) gsap.to(material, { clearcoatRoughness: config.clearcoatRoughness, duration: 1, ease: 'power2.inOut' });
  if (config.transmission !== undefined) gsap.to(material, { transmission: config.transmission, duration: 1, ease: 'power2.inOut' });
  if (config.flatShading !== undefined) gsap.to(material, { flatShading: config.flatShading, duration: 1, ease: 'power2.inOut' });
  if (config.wireframe !== undefined) gsap.to(material, { wireframe: config.wireframe, duration: 1, ease: 'power2.inOut' });
}

loadingManager.onLoad = () => {
  function animate() {
    requestAnimationFrame(animate);
    uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
  }
  // const bg = new THREE.Color(blobs[currentIndex].background);
  // gsap.to(scene.background, { r: bg.r, g: bg.g, b: bg.b, duration: 1, ease: 'linear' });
  animate();
};

document.querySelector("body").addEventListener("mousemove", function (dets) {
  if (isAnimating) return;
  gsap.to(textGroup.position, {
    x: - gsap.utils.mapRange(0, window.innerWidth, -0.03, 0.03, dets.clientX), // Maps the mouse X position from the window width to a range of -1 to 1
    y: gsap.utils.mapRange(0, window.innerHeight, -0.03, 0.03, dets.clientY), // Maps the mouse X position from the window width to a range of -1 to 1
    duration: 1
  });

  
  let x = (dets.x/window.innerWidth * 2 ) - 1 
  let y = (dets.y/window.innerHeight * 2 ) - 1 
  
  gsap.to(sphere.rotation, {
    y: SphereRotation.y - x*0.3, // Maps the mouse X position from the window width to a range of -Math.PI * 0.1 to Math.PI * 0.1
    x: SphereRotation.x + y*0.5 , // Maps the mouse Y position from the window height to a range of -Math.PI * 0.1 to Math.PI * 0.1
    duration : 1 
  })
  gsap.to(sphere.position,{
    x: -x*0.1
  })
  
});





function createThumbsDownGesture() {

  const thumbsDown = new fp.GestureDescription('thumbs_down');

  thumbsDown.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl);
  thumbsDown.addDirection(
    fp.Finger.Thumb,
    fp.FingerDirection.VerticalDown,
    1.0
  );
  thumbsDown.addDirection(
    fp.Finger.Thumb,
    fp.FingerDirection.DiagonalDownLeft,
    0.9
  );
  thumbsDown.addDirection(
    fp.Finger.Thumb,
    fp.FingerDirection.DiagonalDownRight,
    0.9
  );

  for (let finger of [
    fp.Finger.Index,
    fp.Finger.Middle,
    fp.Finger.Ring,
    fp.Finger.Pinky,
  ]) {
    thumbsDown.addCurl(finger, fp.FingerCurl.FullCurl, 0.9);
    thumbsDown.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
  }

  return thumbsDown;
}
function createHelloGesture() {
  const helloGesture = new fp.GestureDescription('hello');

  // All fingers: No curl, vertical up or close to it
  for (let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    helloGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
    helloGesture.addDirection(finger, fp.FingerDirection.VerticalUp, 1.0);
    helloGesture.addDirection(finger, fp.FingerDirection.DiagonalUpLeft, 0.9);
    helloGesture.addDirection(finger, fp.FingerDirection.DiagonalUpRight, 0.9);
  }

  return helloGesture;
}
function createCloseGesture() {
  const closeGesture = new fp.GestureDescription('close');

  // All fingers: Fully curled
  for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    closeGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    closeGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 0.5); // fallback in case it's not perfectly curled

  }

  return closeGesture;
}

function drawKeypoints(keypoints) {
  for (let i = 0; i < keypoints.length; i++) {
    const y = keypoints[i][0];
    const x = keypoints[i][1];
    drawPoint(x - 2, y - 2, 3);
  }

  const fingers = Object.keys(fingerLookupIndices);
  for (let i = 0; i < fingers.length; i++) {
    const finger = fingers[i];
    const points = fingerLookupIndices[finger].map((idx) => keypoints[idx]);
    drawPath(points, false, landmarkColors[finger]);
  }
}

function drawPoint(y, x, r) {
  drawingContext.beginPath();
  drawingContext.arc(x, y, r, 0, 2 * Math.PI);
  drawingContext.fill();
}

function drawPath(points, closePath, color) {
  drawingContext.strokeStyle = color;
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  drawingContext.stroke(region);
}

async function loadWebcam(width, height, fps) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser AnavI navigator.mediaDevices.getUserMedia is not available'
    );
  }

  let video = document.getElementById('webcam');
  video.muted = true;
  video.width = width;
  video.height = height;

  const mediaConfig = {
    audio: false,
    video: {
      facingMode: 'user',
      width: width,
      height: height,
      frameRate: { max: fps },
    },
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(mediaConfig);
    video.srcObject = stream;
    document.querySelector("footer .p2 ").textContent = "Click here and control the website with your hand"
    document.querySelector(".howtoUseHand").style.display = "flex"
    gsap.to(".howtoUseHand", { opacity: 1 })
    gsap.to("#video-container", {
      opacity: 1
    })


    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });

  } catch (error) {
    document.querySelector("footer .p2 ").textContent = "Enable Camera Access to activate Hand-Gesture Mode"
  }
}

async function loadVideo() {
  const video = await loadWebcam(
    VIDEO_CONFIG.width,
    VIDEO_CONFIG.height,
    VIDEO_CONFIG.fps
  );
  video.play();
  return video;
}
async function continuouslyDetectLandmarks(video) {
  async function runDetection() {
    drawingContext.drawImage(
      video,
      0,
      0,
      videoWidth,
      videoHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Draw hand landmarks
    const predictions = await model.estimateHands(video);
    if (predictions.length === 0) {
      curruntGesture = 'none';
    }
    if (predictions.length > 0) {
      const result = predictions[0].landmarks;
      drawKeypoints(result, predictions[0].annotations);
      const center = getHandCenter(predictions[0].landmarks);
      handPosition.x = (1 - (center.x / VIDEO_CONFIG.width)) * 2 - 1; // Normalize to [-1, 1]
      handPosition.y = (1 - (center.y / VIDEO_CONFIG.height)) * 2 - 1; // Normalize to [-1, 1]   

      if (!isAnimating && curruntGesture !== "close") {
        gsap.to(sphere.rotation, {
          y: SphereRotation.y + handPosition.x * 2.5,
          x: SphereRotation.x - handPosition.y * 1.5,
          duration: 1
        })
      }
    }

    if (
      predictions.length > 0 &&
      Object.keys(predictions[0]).includes('landmarks')
    ) {
      const est = gestureEstimator.estimate(predictions[0].landmarks, 9);
      if (est.gestures.length > 0) {
        // Find gesture with highest match score
        let result = est.gestures.reduce((p, c) => {
          return p.score > c.score ? p : c;
        });

        if (result.score > 5) {
          // document.getElementById('gesture-text').textContent =
          // gestureStrings[result.name];
          curruntGesture = result.name;
        }
      }
    }

    requestAnimationFrame(runDetection);
  }

  // Initialize gesture detection
  const knownGestures = [
    // fp.Gestures.VictoryGesture,
    // fp.Gestures.ThumbsUpGesture,
    createThumbsDownGesture(),
    createHelloGesture(),
    createCloseGesture(),

  ];

  gestureEstimator = new fp.GestureEstimator(knownGestures);

  model = await handpose.load();
  runDetection();
}

async function main() {
  let video = await loadVideo();

  videoWidth = video.videoWidth;
  videoHeight = video.videoHeight;

  canvas = document.getElementById('VideoCanvas');
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  drawingContext = canvas.getContext('2d');
  drawingContext.clearRect(0, 0, videoWidth, videoHeight);

  drawingContext.fillStyle = 'white';
  drawingContext.translate(canvas.width, 0);
  drawingContext.scale(-1, 1);

  continuouslyDetectLandmarks(video);
  startGestureLoop();
}

// main();

function getHandCenter(landmarks) {
  let x = 0, y = 0;
  landmarks.forEach((pt) => {
    x += pt[0];
    y += pt[1];
  });

  x /= landmarks.length;
  y /= landmarks.length;

  return { x, y };
}

let isRunning = false;
let gestureLoopActive = false;
let gestureLoopId = null;

function CheckGesture() {
  if (!gestureLoopActive) return;
  gestureLoopId = setTimeout(() => {
    if (curruntGesture == "close" && !isRunning) {
      isRunning = true;
      TransitionAnime({ deltaY: 100 });
      setTimeout(() => { isRunning = false; }, 1200);
    }
    CheckGesture();
  }, 100);
}

function startGestureLoop() {
  gestureLoopActive = true;
  CheckGesture();
}

function stopGestureLoop() {
  gestureLoopActive = false;
  if (gestureLoopId) clearTimeout(gestureLoopId);
}



document.querySelector(".page footer .cameraBtn")?.addEventListener("mouseenter", () => {
  gsap.to(".page footer .cameraBtn", {
    backgroundColor: " white ",
    color: "black",

  })
  gsap.to(".page footer .cameraBtn .p2", {
    opacity: 1,

  })
})
document.querySelector(".page footer .cameraBtn")?.addEventListener("mouseleave", () => {
  gsap.to(".page footer .cameraBtn", {
    backgroundColor: " black ",
    color: "white",

  })
  gsap.to(".page footer .cameraBtn .p2", {
    opacity: 0,

  })
})
document.querySelector(".page footer .cameraBtn")?.addEventListener("click", () => {
  if (typeof fp === 'undefined' || typeof handpose === 'undefined') {
    document.querySelector("footer .p2").textContent = "Still loading gesture library, please try again in a moment.";
    gsap.to("footer .p2", { opacity: 1 });
    return;
  }
  main();
})

document.querySelector(".howtoUseHand .cut")?.addEventListener("click", () => {
  stopGestureLoop();
  gsap.to(".howtoUseHand", { opacity: 0, onComplete: () => { document.querySelector(".howtoUseHand").style.display = "none" } });
})


document.querySelector(".worksLink")?.addEventListener("click", () => {
  // document.querySelector(".Transition").style.diplay ="flex"
  gsap.fromTo(".Transition div", {
    height: "0%"
  }, {
    height: "100%",
    stagger: 0.12,
    duration: 1.5,
    onComplete: () => {
      // gsap.set(".Transition div",{height:"100%"})
      window.location.href = ROUTES.WORKS;
    }

  })
})
document.querySelector(".aboutLink")?.addEventListener("click", () => {
  // document.querySelector(".Transition").style.diplay ="flex"
  gsap.fromTo(".Transition div", {
    height: "0%"
  }, {
    height: "100%",
    stagger: 0.12,
    duration: 1.5,
    onComplete: () => {
      // gsap.set(".Transition div",{height:"100%"})
      window.location.href = ROUTES.ABOUT;
    }

  })
})






const EXPIRY_TIME = 6 * 60 * 60 * 1000; // 6 hour
const lastVisit = localStorage.getItem("lastVisit");

if (!lastVisit || (Date.now() - parseInt(lastVisit, 10)) > EXPIRY_TIME) {
  localStorage.setItem("lastVisit", Date.now());
  let t = 4;
  gsap.to(".LoadingPage .line", { width: "100vw", delay: 0.5, duration: t })
  gsap.to(".LoadingPage .text", {
    opacity: 1,
    delay: t / 4,
    stagger: t / 5,
    onComplete: () => {
      gsap.to(".LoadingPage", {
        opacity: 0,
        onComplete: () => {
          document.querySelector(".LoadingPage").style.display = "none"
          gsap.fromTo(".Transition div", {
            height: "100%"
          }, {
            delay: 0.2,
            height: "0%",
            stagger: 0.1,
            duration: 1.7,
          })
        }
      })

    }
  })

} else {
  document.querySelector(".LoadingPage").style.display = "none"
  gsap.fromTo(".Transition div", {
    height: "100%"
  }, {
    delay: 0.4,
    height: "0%",
    stagger: 0.1,
    duration: 1.7,
  })
}

