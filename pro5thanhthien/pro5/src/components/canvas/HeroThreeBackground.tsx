import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroThreeBackgroundProps {
  className?: string;
}

export const HeroThreeBackground: React.FC<HeroThreeBackgroundProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    // 0. Check WebGL support & Prefers-Reduced-Motion
    const isWebGLAvailable = (): boolean => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    };

    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0c10, 0.075);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 3.4, 7.8);
    camera.lookAt(0, -0.4, 0);

    // 2. WebGL Renderer with graceful fallbacks
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      setWebglSupported(false);
      return;
    }

    // 3. Circular Glow Particle Texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(0, 242, 254, 0.85)');
      grad.addColorStop(0.7, 'rgba(139, 92, 246, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    // 4. Particle Wave / Cybernetic Grid (56 x 46 grid)
    const cols = 56;
    const rows = 46;
    const numPoints = cols * rows;

    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);

    const uthBlue = new THREE.Color(0x005baa);
    const cyanNeon = new THREE.Color(0x00f2fe);
    const accentPurple = new THREE.Color(0x8b5cf6);
    const tempCol = new THREE.Color();

    const spacingX = 0.38;
    const spacingZ = 0.38;
    const offsetX = (cols * spacingX) / 2;
    const offsetZ = (rows * spacingZ) / 2;

    let index = 0;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * spacingX - offsetX;
        const z = r * spacingZ - offsetZ;
        const y = 0;

        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = z;

        // Radial distance gradient
        const distFromCenter = Math.sqrt(x * x + z * z) / 10;
        const ratio = Math.max(0, Math.min(1, 1 - distFromCenter * 0.75));

        // Blend: Blue -> Purple -> Cyan
        if (ratio > 0.5) {
          tempCol.copy(accentPurple).lerp(cyanNeon, (ratio - 0.5) * 2);
        } else {
          tempCol.copy(uthBlue).lerp(accentPurple, ratio * 2);
        }

        colors[index * 3] = tempCol.r;
        colors[index * 3 + 1] = tempCol.g;
        colors[index * 3 + 2] = tempCol.b;

        index++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.088,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    particleSystem.position.set(0, -1.2, -1.5);
    scene.add(particleSystem);

    // 5. Mouse Parallax Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouse.targetX = (e.clientX - halfW) / halfW;
      mouse.targetY = (e.clientY - halfH) / halfH;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 6. Window Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 7. Tab Visibility Handler (Save GPU when tab is inactive)
    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !animFrameIdRef.current && !prefersReducedMotion) {
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 8. Animation Loop with 60 FPS Cap & Reduced Motion Support
    const clock = new THREE.Clock();
    const animate = () => {
      if (!isTabVisible) {
        animFrameIdRef.current = null;
        return;
      }

      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse LERP
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      particleSystem.rotation.y = mouse.x * 0.14;
      particleSystem.rotation.x = -mouse.y * 0.09;

      if (!prefersReducedMotion) {
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const posArr = posAttr.array as Float32Array;

        let idx = 0;
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const x = posArr[idx * 3];
            const z = posArr[idx * 3 + 2];

            // Harmonic wave equations
            const wave1 = Math.sin(x * 0.5 + elapsedTime * 1.3) * 0.3;
            const wave2 = Math.cos(z * 0.6 + elapsedTime * 1.0) * 0.26;
            const wave3 = Math.sin((x + z) * 0.3 + elapsedTime * 0.75) * 0.16;

            posArr[idx * 3 + 1] = wave1 + wave2 + wave3;
            idx++;
          }
        }

        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    // 9. Thorough WebGL Cleanup to prevent memory leaks
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-[-1] ${className}`}
      aria-hidden="true"
    >
      {/* Three.js Canvas Container */}
      {webglSupported ? (
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      ) : (
        /* Graceful CSS Gradient Fallback when WebGL is unavailable */
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,242,254,0.15),rgba(139,92,246,0.1),transparent)]" />
      )}

      {/* Atmospheric Vignette & Contrast Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-[#0b0c10]/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-transparent to-[#0b0c10]" />

      {/* Subtle Aurora Ambient Lights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[460px] h-[460px] bg-accent-purple/10 rounded-full blur-[150px] pointer-events-none" />
    </div>
  );
};
