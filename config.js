/**
 * Global Configuration File
 * Centralized configuration for paths, API endpoints, and app settings
 */

// Determine the base path from Vite's environment
const BASE_URL = import.meta.env.BASE_URL || '/';

// Import all environment variables
const ENV = {
  BASE_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
};

// Path configuration - resolves to correct paths regardless of deployment
// Vite serves the `public` directory at the project root. therefore URLs
// should not include the literal "public/" segment; they can be referenced
// from `/` in both development and production.
export const PATHS = {
  BASE: BASE_URL,
  HTML: `${BASE_URL}`, // HTML entry files live at root now
  JS: `${BASE_URL}src/javascript/`,
  CSS: `${BASE_URL}src/css/`,
  SHADERS: `${BASE_URL}src/shaders/`,
  ASSETS: `${BASE_URL}`,
  IMAGES: `${BASE_URL}images/`,
  GRADIENTS: `${BASE_URL}gradients/`,
  FONTS: `${BASE_URL}fonts/`,
};

// Application configuration
export const APP_CONFIG = {
  title: 'Anil Thakor',
  description: 'Creative Developer Portfolio',
  author: 'Anil Thakor',
  year: 2024,
};

// Video configuration for webcam
export const VIDEO_CONFIG = {
  width: 640,
  height: 480,
  fps: 30,
};

// THREE.js rendering configuration
export const RENDER_CONFIG = {
  antialias: true,
  alpha: true,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  toneMapping: 'ACESFilmic',
  toneMappingExposure: 1,
};

// Animation configuration
export const ANIMATION_CONFIG = {
  transitionDuration: 1.5,
  transitionStagger: 0.12,
  loadingDuration: 4,
};

// Navigation routes
export const ROUTES = {
  HOME: BASE_URL,
  WORKS: BASE_URL + 'works.html',
  ABOUT: BASE_URL + 'about.html',
};

// External resources
export const EXTERNAL_RESOURCES = {
  HDRI: '/studio_small_08_1k.hdr',
  TAILWIND: 'https://unpkg.com/@tailwindcss/browser@4',
  REMIXICON: 'https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.css',
  FINGERPOSE: 'https://cdn.jsdelivr.net/npm/fingerpose@0.1.0/dist/fingerpose.min.js',
  TENSORFLOW_CORE: 'https://unpkg.com/@tensorflow/tfjs-core@3.7.0/dist/tf-core.js',
  TENSORFLOW_CONVERTER: 'https://unpkg.com/@tensorflow/tfjs-converter@3.7.0/dist/tf-converter.js',
  TENSORFLOW_BACKEND: 'https://unpkg.com/@tensorflow/tfjs-backend-webgl@3.7.0/dist/tf-backend-webgl.js',
  HANDPOSE: 'https://unpkg.com/@tensorflow-models/handpose@0.0.7/dist/handpose.js',
};

// Social links
export const SOCIAL_LINKS = {
  INSTAGRAM: 'https://www.instagram.com/_._.anil_21._._/',
  LINKEDIN: 'https://www.linkedin.com/in/anil-thakor-830b242b2/',
  GITHUB: 'https://github.com/AnilThakor23',
};

// Gesture configuration
export const GESTURE_CONFIG = {
  strings: {
    thumbs_up: '👍',
    victory: '✌🏻',
    thumbs_down: '👎',
    hello: '👋',
    close: '✊',
  },
  fingerLookupIndices: {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  },
  landmarkColors: {
    thumb: 'red',
    indexFinger: 'blue',
    middleFinger: 'yellow',
    ringFinger: 'green',
    pinky: 'pink',
    palmBase: 'white',
  },
};

// Export environment info
export const ENVIRONMENT = ENV;

// Helper function to get absolute URL
export const getAbsoluteUrl = (relativePath) => {
  return PATHS.BASE + relativePath;
};

// Helper function to get asset URL
export const getAssetUrl = (assetName, type = 'images') => {
  const typeMap = {
    images: PATHS.IMAGES,
    gradients: PATHS.GRADIENTS,
    fonts: PATHS.FONTS,
    shaders: PATHS.SHADERS,
  };
  return (typeMap[type] || PATHS.ASSETS) + assetName;
};

// Default export
export default {
  PATHS,
  APP_CONFIG,
  VIDEO_CONFIG,
  RENDER_CONFIG,
  ANIMATION_CONFIG,
  ROUTES,
  EXTERNAL_RESOURCES,
  SOCIAL_LINKS,
  GESTURE_CONFIG,
  ENVIRONMENT,
  getAbsoluteUrl,
  getAssetUrl,
};
