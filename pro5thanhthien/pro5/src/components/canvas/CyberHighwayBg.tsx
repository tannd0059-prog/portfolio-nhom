import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CyberHighwayBgProps {
  className?: string;
  videoSrc?: string;
}

export const CyberHighwayBg: React.FC<CyberHighwayBgProps> = ({
  className = '',
  videoSrc = '/assets/ambient-bg.mp4',
}) => {
  const [videoAvailable, setVideoAvailable] = useState<boolean>(true);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Three.js Highway Fallback
  useEffect(() => {
    // Only init 3D highway canvas if video fails or not available
    if (videoAvailable) return;

    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0c10, 0.12);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5);
    camera.lookAt(0, 0.5, -15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Receding Cyber Grid Highway Plane
    const gridHelper = new THREE.GridHelper(60, 60, 0x00f2fe, 0x002b49);
    gridHelper.position.set(0, -0.5, -15);
    scene.add(gridHelper);

    // 2. Highway Lanes / Light Speed Trails (NO flowers, NO leaves)
    const trailCount = 70;
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailCount * 6); // 2 vertices per line segment
    const trailColors = new Float32Array(trailCount * 6);

    const cyanColor = new THREE.Color(0x00f2fe);
    const blueColor = new THREE.Color(0x005baa);
    const redColor = new THREE.Color(0xff2d55);
    const amberColor = new THREE.Color(0xff9500);

    const trailData: { x: number; y: number; z: number; speed: number; len: number }[] = [];

    for (let i = 0; i < trailCount; i++) {
      const isLeftLane = i % 2 === 0;
      const x = isLeftLane ? -1.5 - Math.random() * 8 : 1.5 + Math.random() * 8;
      const y = -0.45 + Math.random() * 0.1;
      const z = -35 + Math.random() * 40;
      const speed = 0.4 + Math.random() * 0.6;
      const len = 2.5 + Math.random() * 4.0;

      trailData.push({ x, y, z, speed, len });

      // Color choice: Cyan/Blue on right, Red/Amber taillights on left
      const c = isLeftLane ? (Math.random() > 0.5 ? redColor : amberColor) : (Math.random() > 0.5 ? cyanColor : blueColor);

      // Vertex 1
      trailColors[i * 6] = c.r;
      trailColors[i * 6 + 1] = c.g;
      trailColors[i * 6 + 2] = c.b;

      // Vertex 2
      trailColors[i * 6 + 3] = c.r;
      trailColors[i * 6 + 4] = c.g;
      trailColors[i * 6 + 5] = c.b;
    }

    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));

    const trailMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      linewidth: 2,
    });

    const lines = new THREE.LineSegments(trailGeo, trailMat);
    scene.add(lines);

    // 3. Distant City Skyline Silhouettes
    const skylineGroup = new THREE.Group();
    for (let b = -20; b <= 20; b += 2.5) {
      const bHeight = 2 + Math.random() * 5;
      const bWidth = 1.2 + Math.random() * 1.8;
      const bGeo = new THREE.BoxGeometry(bWidth, bHeight, 1.5);
      const bMat = new THREE.MeshBasicMaterial({
        color: 0x050811,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(b * 1.5, bHeight / 2 - 0.5, -35);
      skylineGroup.add(bMesh);
    }
    scene.add(skylineGroup);

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Move grid backwards slightly for continuous forward motion
      gridHelper.position.z += 0.12;
      if (gridHelper.position.z > 0) {
        gridHelper.position.z = -15;
      }

      // Update light trails
      const posAttr = trailGeo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < trailCount; i++) {
        const t = trailData[i];
        t.z += t.speed;
        if (t.z > 5) {
          t.z = -35;
        }

        // Segment start
        arr[i * 6] = t.x;
        arr[i * 6 + 1] = t.y;
        arr[i * 6 + 2] = t.z;

        // Segment end (trailing backwards)
        arr[i * 6 + 3] = t.x;
        arr[i * 6 + 4] = t.y;
        arr[i * 6 + 5] = t.z - t.len;
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [videoAvailable]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-[-10] ${className}`}>
      {/* 1. Ambient Video Loop */}
      {videoAvailable ? (
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoAvailable(false)}
          className="absolute inset-0 w-full h-full object-cover opacity-45 filter contrast-125 brightness-90"
        />
      ) : (
        /* 2. Procedural Cyber Highway Canvas Fallback */
        <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full opacity-60" />
      )}

      {/* 3. Deep Cinematic Contrast Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/50 to-[#0b0c10]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-transparent to-[#0b0c10]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent" />
    </div>
  );
};
