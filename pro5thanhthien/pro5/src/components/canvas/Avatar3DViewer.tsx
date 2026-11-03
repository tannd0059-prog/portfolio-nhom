import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { Upload, RotateCcw, Sparkles, CheckCircle2, Box } from 'lucide-react';

interface Avatar3DViewerProps {
  className?: string;
  defaultModelPath?: string;
}

export const Avatar3DViewer: React.FC<Avatar3DViewerProps> = ({
  className = '',
  defaultModelPath = '/models/thien-uth-avatar.glb',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const customModelUrl = usePortfolioStore((s) => s.customModelUrl);
  const customModelName = usePortfolioStore((s) => s.customModelName);
  const setCustomModel = usePortfolioStore((s) => s.setCustomModel);
  const resetCustomModel = usePortfolioStore((s) => s.resetCustomModel);
  const setSceneLoaded = usePortfolioStore((s) => s.setSceneLoaded);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeModelType, setActiveModelType] = useState<'glb' | 'procedural'>('procedural');
  const [modelLabel, setModelLabel] = useState<string>('Sinh viên CNTT UTH (Procedural Rig)');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // References for Three.js lifecycle
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Groups and animatable elements
  const currentObjectGroupRef = useRef<THREE.Group | null>(null);
  const orbitalRing1Ref = useRef<THREE.Mesh | null>(null);
  const orbitalRing2Ref = useRef<THREE.Mesh | null>(null);
  const orbitalNodesRef = useRef<THREE.Mesh[]>([]);
  const laptopScreenMeshRef = useRef<THREE.Mesh | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);

  // Mouse & Scroll Parallax State
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const scrollOffsetRef = useRef<number>(0);

  // Helper to create live dynamic code texture for laptop screen
  const createLaptopScreenTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#060d1a';
      ctx.fillRect(0, 0, 512, 320);

      // Header bar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 36);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(20, 18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(36, 18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(52, 18, 5, 0, Math.PI * 2);
      ctx.fill();

      // Title
      ctx.fillStyle = '#00f2fe';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('UTH Smart Logistics AI // Terminal v2.4', 75, 23);

      // Terminal Code Lines
      ctx.font = '13px monospace';
      ctx.fillStyle = '#66fcf1';
      ctx.fillText('$ python -m ai.logistics.eta --train', 20, 65);
      ctx.fillStyle = '#a5b4fc';
      ctx.fillText('> Dataset: UTH Logistics (500K+ records) [LOADED]', 20, 90);
      ctx.fillStyle = '#34d399';
      ctx.fillText('> LightGBM Model: R² = 0.912 | MAE = ±4.2m', 20, 115);
      ctx.fillStyle = '#66fcf1';
      ctx.fillText('$ yolo predict model=alpr_v5.pt src=cam_01', 20, 145);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('> License Plate: 59-V1 2006 (96.4% confidence)', 20, 170);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('> Route Optimized: Go Vap -> CS1 UTH: 24 mins', 20, 195);
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('> Student: Dinh Thanh Thien (GPA: 3.08/4.0)', 20, 220);
      ctx.fillStyle = '#00f2fe';
      ctx.fillText('>>> VIBE CODING & THREE.JS ENGINE: 60 FPS ACTIVE', 20, 250);

      // Blinking cursor
      ctx.fillStyle = '#00f2fe';
      ctx.fillRect(20, 268, 12, 16);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Build the Smart Fallback Procedural 3D Character
  const createSmartFallbackCharacter = useCallback((): THREE.Group => {
    const root = new THREE.Group();
    root.name = 'ThienUTHProceduralRig';

    // Materials Palette (UTH Blue #005baa & Cyan #00f2fe)
    const uthBlueMat = new THREE.MeshStandardMaterial({
      color: 0x005baa,
      roughness: 0.35,
      metalness: 0.45,
    });
    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.8,
    });
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      metalness: 0.1,
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffd1a9,
      roughness: 0.5,
      metalness: 0.05,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x241711,
      roughness: 0.7,
      metalness: 0.1,
    });
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.25,
      metalness: 0.85,
    });

    // 1. CHARACTER BODY GROUP
    const characterGroup = new THREE.Group();
    characterGroup.position.set(0, -0.3, 0);

    // Torso / Student Polo Jacket (UTH Blue + White stripe)
    const torsoGeo = new THREE.CylinderGeometry(0.55, 0.48, 1.1, 16);
    const torsoMesh = new THREE.Mesh(torsoGeo, uthBlueMat);
    torsoMesh.position.set(0, 0.55, 0);
    characterGroup.add(torsoMesh);

    // White Chest Placket & UTH Badge
    const chestGeo = new THREE.BoxGeometry(0.35, 0.65, 0.12);
    const chestMesh = new THREE.Mesh(chestGeo, whiteMat);
    chestMesh.position.set(0, 0.65, 0.46);
    characterGroup.add(chestMesh);

    const badgeGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.03, 16);
    badgeGeo.rotateX(Math.PI / 2);
    const badgeMesh = new THREE.Mesh(badgeGeo, cyanGlowMat);
    badgeMesh.position.set(0.18, 0.8, 0.5);
    characterGroup.add(badgeMesh);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.25, 16);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.set(0, 1.2, 0);
    characterGroup.add(neckMesh);

    // Head
    const headGeo = new THREE.SphereGeometry(0.42, 24, 24);
    headGeo.scale(1, 1.15, 0.95);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.set(0, 1.62, 0);
    characterGroup.add(headMesh);

    // Hair (Stylish modern hair spikes)
    const hairBaseGeo = new THREE.SphereGeometry(0.45, 18, 18);
    hairBaseGeo.scale(1.05, 1.1, 1.05);
    const hairMesh = new THREE.Mesh(hairBaseGeo, hairMat);
    hairMesh.position.set(0, 1.76, -0.05);
    characterGroup.add(hairMesh);

    // Front Hair Fringe
    for (let i = -2; i <= 2; i++) {
      const spikeGeo = new THREE.ConeGeometry(0.12, 0.35, 8);
      spikeGeo.rotateZ(0.2 * i);
      const spike = new THREE.Mesh(spikeGeo, hairMat);
      spike.position.set(i * 0.14, 2.05, 0.3);
      characterGroup.add(spike);
    }

    // Futuristic AI Smart Visor / Cyber Glasses (Glowing Cyan)
    const visorGeo = new THREE.BoxGeometry(0.68, 0.14, 0.25);
    const visorMesh = new THREE.Mesh(visorGeo, cyanGlowMat);
    visorMesh.position.set(0, 1.62, 0.35);
    characterGroup.add(visorMesh);

    // Arms Typing at Laptop
    // Left Arm
    const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.7, 12);
    armGeo.rotateX(Math.PI / 3);
    armGeo.rotateZ(Math.PI / 8);
    const leftArm = new THREE.Mesh(armGeo, uthBlueMat);
    leftArm.position.set(-0.62, 0.6, 0.3);
    characterGroup.add(leftArm);

    // Right Arm
    const rightArmGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.7, 12);
    rightArmGeo.rotateX(Math.PI / 3);
    rightArmGeo.rotateZ(-Math.PI / 8);
    const rightArm = new THREE.Mesh(rightArmGeo, uthBlueMat);
    rightArm.position.set(0.62, 0.6, 0.3);
    characterGroup.add(rightArm);

    // Hands
    const handGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(-0.35, 0.32, 0.62);
    characterGroup.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(0.35, 0.32, 0.62);
    characterGroup.add(rightHand);

    // 2. FLOATING HOLOGRAPHIC LAPTOP
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 0.22, 0.75);

    // Laptop Base / Keyboard
    const baseGeo = new THREE.BoxGeometry(0.95, 0.04, 0.65);
    const baseMesh = new THREE.Mesh(baseGeo, darkMetalMat);
    laptopGroup.add(baseMesh);

    // Keyboard glow panel
    const keyGlowGeo = new THREE.BoxGeometry(0.82, 0.02, 0.45);
    const keyGlowMesh = new THREE.Mesh(keyGlowGeo, cyanGlowMat);
    keyGlowMesh.position.set(0, 0.025, 0.05);
    laptopGroup.add(keyGlowMesh);

    // Trackpad
    const trackpadGeo = new THREE.BoxGeometry(0.3, 0.015, 0.18);
    const trackpadMesh = new THREE.Mesh(trackpadGeo, whiteMat);
    trackpadMesh.position.set(0, 0.025, -0.22);
    laptopGroup.add(trackpadMesh);

    // Laptop Screen Panel (Open at ~110 degrees)
    const screenBaseGeo = new THREE.BoxGeometry(0.95, 0.62, 0.03);
    screenBaseGeo.rotateX(-0.35);
    const screenPanelMesh = new THREE.Mesh(screenBaseGeo, darkMetalMat);
    screenPanelMesh.position.set(0, 0.32, 0.3);
    laptopGroup.add(screenPanelMesh);

    // Screen Display with live dynamic CanvasTexture
    const screenTexture = createLaptopScreenTexture();
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    });
    const screenDisplayGeo = new THREE.PlaneGeometry(0.88, 0.55);
    screenDisplayGeo.rotateX(-0.35);
    const screenDisplayMesh = new THREE.Mesh(screenDisplayGeo, screenMat);
    screenDisplayMesh.position.set(0, 0.32, 0.28);
    laptopScreenMeshRef.current = screenDisplayMesh;
    laptopGroup.add(screenDisplayMesh);

    // UTH Logo on laptop lid (back)
    const uthLidGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.01, 16);
    uthLidGeo.rotateX(-0.35);
    uthLidGeo.rotateX(Math.PI / 2);
    const uthLidMesh = new THREE.Mesh(uthLidGeo, cyanGlowMat);
    uthLidMesh.position.set(0, 0.32, 0.32);
    laptopGroup.add(uthLidMesh);

    characterGroup.add(laptopGroup);
    root.add(characterGroup);

    // 3. AI NEURAL NETWORK ORBITAL RINGS & NODES
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 0.6, 0.2);

    // Ring 1 (Tilted 50 deg)
    const ringGeo1 = new THREE.TorusGeometry(1.5, 0.018, 16, 64);
    ringGeo1.rotateX(Math.PI / 3);
    ringGeo1.rotateY(Math.PI / 5);
    const ring1 = new THREE.Mesh(ringGeo1, cyanGlowMat);
    orbitalRing1Ref.current = ring1;
    ringGroup.add(ring1);

    // Ring 2 (Tilted -40 deg)
    const ringGeo2 = new THREE.TorusGeometry(1.85, 0.018, 16, 64);
    ringGeo2.rotateX(-Math.PI / 4);
    ringGeo2.rotateZ(Math.PI / 6);
    const ring2 = new THREE.Mesh(ringGeo2, uthBlueMat);
    orbitalRing2Ref.current = ring2;
    ringGroup.add(ring2);

    // Orbital Nodes (Data Spheres traveling along rings)
    orbitalNodesRef.current = [];
    for (let i = 0; i < 6; i++) {
      const nodeGeo = new THREE.SphereGeometry(0.07, 12, 12);
      const nodeMesh = new THREE.Mesh(nodeGeo, cyanGlowMat);
      nodeMesh.userData = { angle: (i * Math.PI) / 3, radius: i % 2 === 0 ? 1.5 : 1.85, isRing1: i % 2 === 0 };
      ringGroup.add(nodeMesh);
      orbitalNodesRef.current.push(nodeMesh);
    }
    root.add(ringGroup);

    // 4. HOLOGRAPHIC TECH PEDESTAL
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.2, 0);

    // Base cylinder
    const baseCylGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.25, 32);
    const baseCylMesh = new THREE.Mesh(baseCylGeo, darkMetalMat);
    pedestalGroup.add(baseCylMesh);

    // Glowing rim ring
    const rimGeo = new THREE.TorusGeometry(1.65, 0.035, 16, 64);
    rimGeo.rotateX(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, cyanGlowMat);
    rimMesh.position.set(0, 0.12, 0);
    pedestalGroup.add(rimMesh);

    // Inner glowing ring
    const innerRimGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 64);
    innerRimGeo.rotateX(Math.PI / 2);
    const innerRimMesh = new THREE.Mesh(innerRimGeo, uthBlueMat);
    innerRimMesh.position.set(0, 0.13, 0);
    pedestalGroup.add(innerRimMesh);

    root.add(pedestalGroup);

    // 5. DATA PARTICLES CONSTELLATION
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      positions[p * 3] = (Math.random() - 0.5) * 6;
      positions[p * 3 + 1] = Math.random() * 4 - 1.2;
      positions[p * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x66fcf1,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystemRef.current = particleSystem;
    root.add(particleSystem);

    return root;
  }, []);

  // Main 3D Initializer and Model Loader
  const loadActiveModel = useCallback(
    (targetUrl: string | null) => {
      const scene = sceneRef.current;
      if (!scene) return;

      setIsLoading(true);
      setLoadingProgress(10);

      // Remove existing object group if any
      if (currentObjectGroupRef.current) {
        scene.remove(currentObjectGroupRef.current);
        currentObjectGroupRef.current = null;
      }

      const urlToAttempt = targetUrl || defaultModelPath;

      // Try loading with GLTFLoader
      const loader = new GLTFLoader();
      loader.load(
        urlToAttempt,
        (gltf) => {
          // GLB file loaded successfully!
          console.log('[Avatar3DViewer] Loaded .glb model successfully from:', urlToAttempt);
          const loadedModel = gltf.scene;

          // Compute bounding box & auto-center and scale
          const box = new THREE.Box3().setFromObject(loadedModel);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          const maxDim = Math.max(size.x, size.y, size.z);
          const targetScale = 2.4 / (maxDim || 1);
          loadedModel.scale.setScalar(targetScale);

          // Center model at origin
          loadedModel.position.x = -center.x * targetScale;
          loadedModel.position.y = -center.y * targetScale - 0.2;
          loadedModel.position.z = -center.z * targetScale;

          // Wrap into container group
          const wrapperGroup = new THREE.Group();
          wrapperGroup.add(loadedModel);

          // Add subtle tech halo ring under the avatar
          const ringGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 64);
          ringGeo.rotateX(Math.PI / 2);
          const ringMesh = new THREE.Mesh(
            ringGeo,
            new THREE.MeshStandardMaterial({
              color: 0x00f2fe,
              emissive: 0x00f2fe,
              emissiveIntensity: 0.6,
            })
          );
          ringMesh.position.set(0, -1.1, 0);
          wrapperGroup.add(ringMesh);

          scene.add(wrapperGroup);
          currentObjectGroupRef.current = wrapperGroup;

          setActiveModelType('glb');
          setModelLabel(customModelName || 'Tripo AI Avatar (thien-uth-avatar.glb)');
          setIsLoading(false);
          setLoadingProgress(100);
          setSceneLoaded(true);
        },
        (xhr) => {
          if (xhr.total > 0) {
            setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
          }
        },
        (_error) => {
          // Fallback to Procedural UTH Character
          console.info(
            '[Avatar3DViewer] GLB model not present at path, engaging Smart Procedural 3D Rig for Sinh viên UTH.'
          );
          const fallbackRig = createSmartFallbackCharacter();
          scene.add(fallbackRig);
          currentObjectGroupRef.current = fallbackRig;

          setActiveModelType('procedural');
          setModelLabel('Sinh viên CNTT UTH Đinh Thanh Thiên (Smart 3D Rig)');
          setIsLoading(false);
          setLoadingProgress(100);
          setSceneLoaded(true);
        }
      );
    },
    [defaultModelPath, customModelName, createSmartFallbackCharacter, setSceneLoaded]
  );

  // Setup Three.js Scene, Camera, Lights, Renderer, OrbitControls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 4.6);
    cameraRef.current = camera;

    // 3. Renderer with Alpha for seamless background blending
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false; // Keep hero layout stable while allowing 360 rotation
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = (3 * Math.PI) / 4;
    controls.autoRotate = false;
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Cyan Key Light
    const keyLight = new THREE.DirectionalLight(0x00f2fe, 2.2);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    // UTH Blue Fill Light
    const fillLight = new THREE.DirectionalLight(0x005baa, 2.4);
    fillLight.position.set(-4, -2, -4);
    scene.add(fillLight);

    // Point Glow for Laptop
    const laptopGlow = new THREE.PointLight(0x66fcf1, 1.8, 4);
    laptopGlow.position.set(0, 0.4, 1.2);
    scene.add(laptopGlow);

    // 6. Initial Load of Active Model (GLB or Fallback)
    loadActiveModel(customModelUrl);

    // 7. Mouse Move Listener for Parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    // 8. Scroll Listener for subtle scroll-driven rotation
    const handleScroll = () => {
      scrollOffsetRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 9. Resize Listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      controls.update();

      // Animate current object group if present
      if (currentObjectGroupRef.current) {
        // Subtle floating bob
        const floatY = Math.sin(elapsedTime * 1.8) * 0.06;
        currentObjectGroupRef.current.position.y = floatY;

        // Mouse tilt + subtle scroll tilt
        const scrollFactor = (scrollOffsetRef.current * 0.0006) % (Math.PI * 2);
        currentObjectGroupRef.current.rotation.y =
          mouseRef.current.x * 0.35 + Math.sin(scrollFactor) * 0.25;
        currentObjectGroupRef.current.rotation.x = -mouseRef.current.y * 0.2;
      }

      // Animate Procedural Rig components if active
      if (orbitalRing1Ref.current) {
        orbitalRing1Ref.current.rotation.z = elapsedTime * 0.8;
      }
      if (orbitalRing2Ref.current) {
        orbitalRing2Ref.current.rotation.y = -elapsedTime * 0.6;
      }

      // Orbiting data nodes
      orbitalNodesRef.current.forEach((node) => {
        const u = node.userData;
        const currentAngle = u.angle + (u.isRing1 ? elapsedTime * 1.2 : -elapsedTime * 0.9);
        const r = u.radius;
        if (u.isRing1) {
          node.position.x = Math.cos(currentAngle) * r;
          node.position.y = Math.sin(currentAngle) * r * 0.6;
          node.position.z = Math.sin(currentAngle) * r * 0.8;
        } else {
          node.position.x = Math.sin(currentAngle) * r * 0.8;
          node.position.y = Math.cos(currentAngle) * r * 0.5;
          node.position.z = Math.cos(currentAngle) * r;
        }
      });

      // Particle system drift
      if (particleSystemRef.current) {
        particleSystemRef.current.rotation.y = elapsedTime * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 11. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [loadActiveModel, customModelUrl]);

  // Handle User File Upload for custom Tripo AI .glb
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      alert('Vui lòng chọn file 3D định dạng .glb hoặc .gltf!');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCustomModel(objectUrl, file.name);
    loadActiveModel(objectUrl);

    setUploadSuccessMsg(`Đã tải thành công mô hình: ${file.name}`);
    setTimeout(() => setUploadSuccessMsg(null), 4500);

    // Reset input value so same file can be re-selected if desired
    e.target.value = '';
  };

  const handleReset = () => {
    resetCustomModel();
    loadActiveModel(null);
  };

  return (
    <div
      className={`relative w-full h-[460px] sm:h-[540px] md:h-[600px] flex items-center justify-center rounded-3xl overflow-hidden glass-panel ${className}`}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
        title="Nhấp giữ chuột để xoay mô hình 3D 360 độ"
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-auto z-20">
        {/* Status Badge */}
        <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/80 px-3.5 py-1.5 backdrop-blur-md text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              isLoading ? 'bg-amber-400 animate-ping' : 'bg-cyan-400 animate-pulse'
            }`}
          />
          <span className="font-mono text-cyan-300 font-medium truncate max-w-[200px] sm:max-w-xs">
            {isLoading ? `Đang nạp 3D (${loadingProgress}%)...` : modelLabel}
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-700/50">
            {activeModelType.toUpperCase()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Custom Model Reset Button if active */}
          {customModelUrl && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-full border border-slate-600 bg-slate-900/85 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-md"
              title="Khôi phục mô hình mặc định"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Khôi phục</span>
            </button>
          )}

          {/* Upload GLB Button (Tripo AI) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/15 hover:bg-cyan-400 hover:text-slate-950 px-3.5 py-1.5 text-xs font-bold text-cyan-300 transition-all duration-300 shadow-[0_0_15px_rgba(0,242,254,0.25)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] active:scale-95"
            title="Chọn file mô hình 3D .glb từ máy tính của bạn (tạo từ Tripo AI) để xem trực tiếp"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Nạp file .GLB (Tripo AI)</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {uploadSuccessMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/90 px-4 py-2 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-3 z-30">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {/* Bottom Interactive Hint */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none text-[11px] text-slate-400 font-mono z-10">
        <div className="flex items-center gap-1.5 bg-slate-900/70 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
          <Sparkles className="h-3 w-3 text-cyan-400" />
          <span className="hidden sm:inline">Mô hình nghiêng theo chuột & cuộn trang • Kéo chuột để xoay 360°</span>
          <span className="sm:hidden">Kéo để xoay 360°</span>
        </div>
        <div className="flex items-center gap-1 text-cyan-400/80 bg-slate-900/70 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/5">
          <Box className="h-3 w-3" />
          <span>UTH 3D Lab</span>
        </div>
      </div>
    </div>
  );
};
