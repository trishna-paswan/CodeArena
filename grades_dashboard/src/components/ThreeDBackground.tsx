"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

export default function ThreeDBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // We expose a global init function that will be called once Three.js loads
  useEffect(() => {
    window.initThreeScene = () => {
      if (initialized.current || !containerRef.current || !window.THREE) return;
      initialized.current = true;

      const THREE = window.THREE;
      let scene: any, camera: any, renderer: any;
      let robots: any[] = [];
      let particles: any;
      let mouseX = 0;
      let mouseY = 0;
      let timeOffset = 0;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 2, 50);
      
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);
      
      scene.add(new THREE.AmbientLight(0x404040, 3));
      const pL = new THREE.PointLight(0x8A2BE2, 20, 100);
      pL.position.set(10, 10, 20);
      scene.add(pL);

      function createRobot(x: number, y: number, z: number, isHero = false) {
        const group = new THREE.Group();
        const metalMat = new THREE.MeshStandardMaterial({ 
          color: 0x1a1a1a, 
          metalness: 0.9, 
          roughness: 0.1, 
          emissive: 0x8A2BE2, 
          emissiveIntensity: isHero ? 0.5 : 0.2 
        });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 1.5, 6), metalMat);
        group.add(body);
        const head = new THREE.Mesh(new THREE.BoxGeometry(1, 0.7, 0.8), metalMat); 
        head.position.y = 1.3;
        group.add(head);
        group.position.set(x, y, z);
        scene.add(group);
        return { group, head, initialY: y, initialScale: 1, offset: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() };
      }

      robots.push(createRobot(0, 0, 0, true));
      for (let i = 0; i < 15; i++) {
        const r = createRobot((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30 - 20);
        r.initialScale = 0.5 + Math.random(); 
        r.group.scale.setScalar(r.initialScale);
        robots.push(r);
      }

      const geo = new THREE.BufferGeometry(); 
      const pos = new Float32Array(2000 * 3);
      for(let i=0; i<6000; i++) pos[i] = (Math.random() - 0.5) * 100;
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      particles = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.05, color: 0x8A2BE2, transparent: true, opacity: 0.4 }));
      scene.add(particles);

      window.addEventListener('resize', () => { 
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight; 
        camera.updateProjectionMatrix(); 
        renderer.setSize(window.innerWidth, window.innerHeight); 
      });

      document.addEventListener('mousemove', (e) => { 
        mouseX = (e.clientX / window.innerWidth) * 2 - 1; 
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1; 
      });

      function animate() {
        requestAnimationFrame(animate);
        timeOffset += 0.01;
        
        // We always keep camera slightly dynamic based on mouse since there's no "intro phase" 
        // to block it in the dashboard (the dashboard already loaded).
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 5 - camera.position.y) * 0.02;
        camera.position.z = 20; // fixed z for dashboard
        camera.lookAt(0, 0, 0);

        robots.forEach(r => {
          r.group.position.y = r.initialY + Math.sin(timeOffset * r.speed + r.offset) * 0.5;
          r.head.rotation.y = THREE.MathUtils.lerp(r.head.rotation.y, mouseX * 0.5, 0.05);
        });

        if (particles) {
          particles.rotation.y = timeOffset * 0.2;
        }

        renderer.render(scene, camera);
      }
      
      animate();
    };

    // If THREE is already loaded (e.g. fast refresh during local dev)
    if (window.THREE) {
      window.initThreeScene();
    }
    
    return () => {
      // Cleanup logic if needed when component unmounts
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      initialized.current = false;
    }
  }, []);

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" 
        strategy="lazyOnload"
        onLoad={() => {
          if (window.initThreeScene) window.initThreeScene();
        }}
      />
      <div 
        ref={containerRef} 
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -10, pointerEvents: 'none' }} 
      />
    </>
  );
}

// Ensure type definitions for window
declare global {
  interface Window {
    initThreeScene?: () => void;
    THREE?: any;
  }
}
