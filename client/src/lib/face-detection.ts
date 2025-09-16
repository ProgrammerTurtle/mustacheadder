import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadFaceDetection(): Promise<void> {
  if (modelsLoaded) return;

  try {
    // Load face detection models from CDN
    await faceapi.nets.ssdMobilenetv1.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights');
    await faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights');
    await faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights');
    
    modelsLoaded = true;
    console.log('Face detection models loaded successfully');
  } catch (error) {
    console.error('Error loading face detection models:', error);
    throw new Error('Failed to load face detection models');
  }
}

export async function detectFaces(imageUrl: string): Promise<any[]> {
  if (!modelsLoaded) {
    throw new Error('Face detection models not loaded');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      try {
        const detections = await faceapi
          .detectAllFaces(img)
          .withFaceLandmarks()
          .withFaceDescriptors();
        
        console.log(`Detected ${detections.length} faces`);
        resolve(detections);
      } catch (error) {
        console.error('Face detection error:', error);
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for face detection'));
    };
    
    img.src = imageUrl;
  });
}

export function isModelLoaded(): boolean {
  return modelsLoaded;
}
