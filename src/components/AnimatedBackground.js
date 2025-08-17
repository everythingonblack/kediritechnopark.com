import React, { useRef, useEffect } from 'react';
import styles from './AnimatedBackground.module.css';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Determine particle count based on screen size
    const getParticleCount = () => {
      const width = window.innerWidth;
      if (width <= 400) return 30;  // Very small screens
      if (width <= 576) return 40;  // Small screens
      if (width <= 768) return 50;  // Medium screens
      return 70;                    // Large screens
    };

    function Particle(x, y, vx, vy) {
      this.x = x; this.y = y; this.vx = vx; this.vy = vy; 
      
      // Adjust particle radius based on screen size
      if (window.innerWidth <= 400) {
        this.radius = 1.0;  // Smaller radius for very small screens
      } else if (window.innerWidth <= 576) {
        this.radius = 1.2;  // Medium radius for small screens
      } else {
        this.radius = 1.5;  // Default radius for larger screens
      }
    }

    const setupCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      const cssWidth = parent.clientWidth;
      const cssHeight = parent.clientHeight;

      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      ctx.scale(dpr, dpr);

      // Get particle count based on current screen size
      const particleCount = getParticleCount();

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(Math.random() * cssWidth, Math.random() * cssHeight, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5));
      }
    };

    function connectParticles() {
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      
      // Adjust connection distance based on screen size
      let connectionDistance = 90;
      if (window.innerWidth <= 400) {
        connectionDistance = 60;  // Smaller connection distance for very small screens
      } else if (window.innerWidth <= 576) {
        connectionDistance = 70;  // Medium connection distance for small screens
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          // Array posisi p2, termasuk "hantu" di 8 sisi lain
          const p2Positions = [
            { x: p2.x, y: p2.y }, // Posisi asli
            { x: p2.x + cssWidth, y: p2.y }, // Kanan
            { x: p2.x - cssWidth, y: p2.y }, // Kiri
            { x: p2.x, y: p2.y + cssHeight }, // Bawah
            { x: p2.x, y: p2.y - cssHeight }, // Atas
            { x: p2.x + cssWidth, y: p2.y + cssHeight }, // Kanan-bawah
            { x: p2.x - cssWidth, y: p2.y - cssHeight }, // Kiri-atas
            { x: p2.x + cssWidth, y: p2.y - cssHeight }, // Kanan-atas
            { x: p2.x - cssWidth, y: p2.y + cssHeight }  // Kiri-bawah
          ];

          // Cari jarak terpendek ke p2 atau salah satu hantunya
          for (const pos of p2Positions) {
            const distance = Math.sqrt((p1.x - pos.x) ** 2 + (p1.y - pos.y) ** 2);

            if (distance < connectionDistance) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / connectionDistance})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(pos.x, pos.y); // Gambar garis ke posisi terdekat (bisa jadi hantu)
              ctx.stroke();
              break; // Hanya gambar satu garis terpendek
            }
          }
        }
      }
    }

    function animate() {
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Adjust animation speed based on screen size
      let speedFactor = 1.0;
      if (window.innerWidth <= 400) {
        speedFactor = 0.7;  // Slower animation for very small screens
      } else if (window.innerWidth <= 576) {
        speedFactor = 0.8;  // Slightly slower animation for small screens
      }

      for (const p of particles) {
        // LOGIKA BARU: Partikel tembus (wrapping) bukan memantul (bounce)
        if (p.x > cssWidth + p.radius) p.x = -p.radius;
        else if (p.x < -p.radius) p.x = cssWidth + p.radius;

        if (p.y > cssHeight + p.radius) p.y = -p.radius;
        else if (p.y < -p.radius) p.y = cssHeight + p.radius;
        
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      }

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }

    setupCanvas();
    animate();
    
    // Handle resize events to adjust particle count
    const handleResize = () => {
      setupCanvas();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.particleCanvas}></canvas>;
};

export default AnimatedBackground;
