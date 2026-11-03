import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Box, ShieldCheck } from 'lucide-react';

interface Hero3DSceneProps {
  className?: string;
  imageSrc?: string;
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = ({
  className = '',
  imageSrc = '/images/thien-chibi.png',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Three.js instances
  const animFrameIdRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // 3D Scene Elements
  const chibiGroupRef = useRef<THREE.Group | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const haloMeshRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  const ring3Ref = useRef<THREE.Mesh | null>(null);
  const specularLightRef = useRef<THREE.PointLight | null>(null);

  // Mouse & Scroll Parallax State
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const scrollOffsetRef = useRef<number>(0);

  // Helper to generate circular particle glow texture
  const createCircleParticleTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(0, 242, 254, 0.85)');
      gradient.addColorStop(0.7, 'rgba(0, 91, 170, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Helper to generate soft radial shadow texture
  const createRadialShadowTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      gradient.addColorStop(0.4, 'rgba(0, 43, 73, 0.45)');
      gradient.addColorStop(0.8, 'rgba(0, 242, 254, 0.15)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 540;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 4.8);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    // Key Light (Cyan)
    const keyLight = new THREE.DirectionalLight(0x00f2fe, 2.4);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Fill Light (UTH Blue)
    const fillLight = new THREE.DirectionalLight(0x005baa, 2.6);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    // Interactive Specular Glare Light (Moves with cursor)
    const specularLight = new THREE.PointLight(0x00f2fe, 3.2, 5.5);
    specularLight.position.set(0, 1, 2.5);
    scene.add(specularLight);
    specularLightRef.current = specularLight;

    // 5. PROCEDURAL 3D CYBER BACKGROUND (700 PARTICLES)
    const particleCount = 750;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const uthBlue = new THREE.Color(0x005baa);
    const cyanNeon = new THREE.Color(0x00f2fe);
    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      // 3D Spatial coordinates
      positions[i * 3] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1;

      // Color interpolation between UTH Blue and Cyan
      const ratio = Math.random();
      tempColor.copy(uthBlue).lerp(cyanNeon, ratio);
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleTexture = createCircleParticleTexture();
    const particleMat = new THREE.PointsMaterial({
      size: 0.075,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 6. PROCEDURAL HOLOGRAM PEDESTAL AT CHARACTER'S FEET
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.45, 0);

    const glowCyanMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
    });

    const glowUthMat = new THREE.MeshStandardMaterial({
      color: 0x005baa,
      emissive: 0x005baa,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.8,
    });

    // Hologram Ring 1 (Outer - Rotates Clockwise)
    const ringGeo1 = new THREE.TorusGeometry(1.55, 0.022, 16, 64);
    ringGeo1.rotateX(Math.PI / 2);
    const ring1 = new THREE.Mesh(ringGeo1, glowCyanMat);
    ring1Ref.current = ring1;
    pedestalGroup.add(ring1);

    // Hologram Ring 2 (Inner - Rotates Counter-Clockwise)
    const ringGeo2 = new THREE.TorusGeometry(1.22, 0.02, 16, 64);
    ringGeo2.rotateX(Math.PI / 2);
    const ring2 = new THREE.Mesh(ringGeo2, glowUthMat);
    ring2Ref.current = ring2;
    pedestalGroup.add(ring2);

    // Hologram Ring 3 (Hex Core / Dotted)
    const ringGeo3 = new THREE.TorusGeometry(0.85, 0.015, 6, 32);
    ringGeo3.rotateX(Math.PI / 2);
    const ring3 = new THREE.Mesh(ringGeo3, glowCyanMat);
    ring3Ref.current = ring3;
    pedestalGroup.add(ring3);

    // Dynamic Floor Shadow on Pedestal
    const shadowGeo = new THREE.PlaneGeometry(1.6, 0.9);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowTexture = createRadialShadowTexture();
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, 0.02, 0);
    shadowMeshRef.current = shadowMesh;
    pedestalGroup.add(shadowMesh);

    scene.add(pedestalGroup);

    // 7. INTERACTIVE 3D HOLOGRAM CHIBI CHARACTER
    const chibiRoot = new THREE.Group();
    chibiGroupRef.current = chibiRoot;
    scene.add(chibiRoot);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      imageSrc,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Calculate proportional aspect ratio
        const img = texture.image;
        const aspect = (img.width || 1) / (img.height || 1);
        const planeHeight = 2.75;
        const planeWidth = planeHeight * aspect;

        // Front Facing Hologram Character Plane
        const planeGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);

        const planeMat = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.02,
          roughness: 0.25,
          metalness: 0.15,
          side: THREE.DoubleSide,
        });

        const chibiMesh = new THREE.Mesh(planeGeo, planeMat);
        chibiMesh.position.set(0, 0.1, 0);
        chibiRoot.add(chibiMesh);

        // Holographic Glowing Contour Halo Layer (Slightly behind character)
        const haloMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.35,
          color: 0x00f2fe,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const haloMesh = new THREE.Mesh(planeGeo, haloMat);
        haloMesh.position.set(0, 0.1, -0.04);
        haloMesh.scale.set(1.035, 1.035, 1);
        haloMeshRef.current = haloMesh;
        chibiRoot.add(haloMesh);

        // Floating UTH Cyber Tag next to character
        const badgeCanvas = document.createElement('canvas');
        badgeCanvas.width = 256;
        badgeCanvas.height = 70;
        const bCtx = badgeCanvas.getContext('2d');
        if (bCtx) {
          bCtx.fillStyle = 'rgba(6, 13, 26, 0.85)';
          bCtx.roundRect(0, 0, 256, 70, 16);
          bCtx.fill();
          bCtx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
          bCtx.lineWidth = 3;
          bCtx.roundRect(0, 0, 256, 70, 16);
          bCtx.stroke();

          bCtx.fillStyle = '#00f2fe';
          bCtx.font = 'bold 19px monospace';
          bCtx.fillText('UTH // AI ENGINEER', 20, 30);
          bCtx.fillStyle = '#66fcf1';
          bCtx.font = '14px monospace';
          bCtx.fillText('Đinh Thanh Thiên • GPA 3.08', 20, 52);
        }
        const badgeTexture = new THREE.CanvasTexture(badgeCanvas);
        badgeTexture.needsUpdate = true;

        const badgeGeo = new THREE.PlaneGeometry(0.9, 0.25);
        const badgeMat = new THREE.MeshBasicMaterial({
          map: badgeTexture,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
        badgeMesh.position.set(0.95, -0.65, 0.2);
        chibiRoot.add(badgeMesh);

        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.warn('[Hero3DScene] Failed to load image, using fallback texture:', err);
        setIsLoaded(true);
      }
    );

    // 8. Event Listeners (Mouse Parallax & Scroll Depth)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
    };

    const handleScroll = () => {
      scrollOffsetRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 9. ANIMATION LOOP
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.07;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.07;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Vertical Floating Bobbing
      const floatOffset = Math.sin(elapsedTime * 2.1) * 0.12;

      // Update Chibi Character with 3D Tilt Parallax & Glare
      if (chibiGroupRef.current) {
        chibiGroupRef.current.position.y = floatOffset;
        chibiGroupRef.current.position.x = mx * 0.35;
        chibiGroupRef.current.position.z = my * 0.25;

        // 3D Tilt Angle
        chibiGroupRef.current.rotation.y = mx * 0.42;
        chibiGroupRef.current.rotation.x = -my * 0.32;
        chibiGroupRef.current.rotation.z = -mx * 0.08;
      }

      // Update Specular Glare Light to follow mouse
      if (specularLightRef.current) {
        specularLightRef.current.position.x = mx * 3.5;
        specularLightRef.current.position.y = my * 3.0 + 1.2;
      }

      // Update Floor Shadow (Expands/contracts with float height & shifts with tilt)
      if (shadowMeshRef.current) {
        const shadowScale = 1 - floatOffset * 0.9;
        shadowMeshRef.current.scale.set(shadowScale, shadowScale, 1);
        shadowMeshRef.current.position.x = mx * 0.15;
      }

      // Animate Hologram Pedestal Rings
      if (ring1Ref.current) {
        ring1Ref.current.rotation.z = elapsedTime * 0.85;
      }
      if (ring2Ref.current) {
        ring2Ref.current.rotation.z = -elapsedTime * 1.15;
      }
      if (ring3Ref.current) {
        ring3Ref.current.rotation.z = elapsedTime * 1.6;
      }

      // Animate Background Particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.045 + mx * 0.15;
        particlesRef.current.rotation.x = my * 0.12;

        // Scroll zoom depth
        const scrollFactor = (scrollOffsetRef.current * 0.0012) % 3;
        particlesRef.current.position.z = -scrollFactor * 0.8;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Memory Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc]);

  return (
    <div
      className={`relative w-full h-[470px] sm:h-[540px] md:h-[600px] flex items-center justify-center rounded-3xl overflow-hidden glass-panel ${className}`}
    >
      {/* Three.js WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
        title="Di chuyển chuột để tạo hiệu ứng nghiêng 3D Hologram & cuộn trang tạo chiều sâu"
      />

      {/* Top Floating Badge Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-auto z-20">
        <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/85 px-3.5 py-1.5 backdrop-blur-md text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              isLoaded ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400 animate-ping'
            }`}
          />
          <span className="font-mono text-cyan-300 font-bold truncate">
            {isLoaded ? 'Chibi UTH 3D Hologram Active' : 'Đang khởi tạo WebGL Hologram...'}
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-700/50">
            Three.js 60FPS
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-cyan-500/30 backdrop-blur-md">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="hidden sm:inline">100% Thuần WebGL • Không lỗi hộp đen</span>
          <span className="sm:hidden">Thuần WebGL</span>
        </div>
      </div>

      {/* Bottom Interactive Hint */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none text-[11px] text-slate-400 font-mono z-10">
        <div className="flex items-center gap-1.5 bg-slate-900/75 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">Di chuyển chuột để nghiêng 3D • Cuộn trang để zoom chiều sâu</span>
          <span className="sm:hidden">Nghiêng 3D theo chuột</span>
        </div>

        <div className="flex items-center gap-1.5 text-cyan-400/90 bg-slate-900/75 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
          <Box className="h-3.5 w-3.5" />
          <span>UTH Hologram Rig</span>
        </div>
      </div>
    </div>
  );
};
