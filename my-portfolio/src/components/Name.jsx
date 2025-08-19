import React, { useEffect, useRef } from 'react';

const Name = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const planeMeshRef = useRef(null);
  const mousePosition = useRef({ x: 0.5, y: 0.5 });
  const targetMousePosition = useRef({ x: 0.5, y: 0.5 });
  const prevPosition = useRef({ x: 0.5, y: 0.5 });
  const easeFactor = useRef(0.02);
  const animationIdRef = useRef(null);

  // Load Three.js dynamically with timeout fallback
  useEffect(() => {
    const loadThreeJS = async () => {
      // Set a timeout for fallback
      const fallbackTimeout = setTimeout(() => {
        console.log('Three.js loading timeout, using CSS fallback');
        renderCSSFallback();
      }, 3000); // 3 second timeout

      try {
        // Check if Three.js is already loaded
        if (window.THREE) {
          clearTimeout(fallbackTimeout);
          initializeThreeJS(window.THREE);
          return;
        }

        // Load Three.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.async = true;
        
        const loadPromise = new Promise((resolve, reject) => {
          script.onload = () => {
            clearTimeout(fallbackTimeout);
            resolve(window.THREE);
          };
          script.onerror = () => {
            clearTimeout(fallbackTimeout);
            reject(new Error('Failed to load Three.js'));
          };
        });

        document.head.appendChild(script);
        const THREE = await loadPromise;

        initializeThreeJS(THREE);
        
        return () => {
          clearTimeout(fallbackTimeout);
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
      } catch (error) {
        clearTimeout(fallbackTimeout);
        console.error('Failed to load Three.js:', error);
        // Fallback to CSS-only version
        renderCSSFallback();
      }
    };

    loadThreeJS();
  }, []);

  const renderCSSFallback = () => {
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <div class="name-fallback">
          <h1 class="hero-name gradient-text">
            <span class="name-line">Saiprasad</span>
            <span class="name-line">Jamdar</span>
          </h1>
        </div>
      `;
      
      // Add some debugging
      console.log('Fallback CSS text rendered');
    }
  };

  const initializeThreeJS = (THREE) => {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      uniform sampler2D u_texture;
      uniform vec2 u_mouse;
      uniform vec2 u_prevMouse;

      void main() {
        vec2 gridUV = floor(vUv * vec2(40.0, 40.0)) / vec2(40.0, 40.0);
        vec2 centerOfPixel = gridUV + vec2(1.0 / 40.0, 1.0 / 40.0);

        vec2 mouseDirection = u_mouse - u_prevMouse;
        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

        vec2 uvOffset = strength * -mouseDirection * 0.3;
        vec2 uv = vUv - uvOffset;

        vec4 color = texture2D(u_texture, uv);
        gl_FragColor = color;
      }
    `;

    const createTextTexture = (text, font, size, bgColor, textColor, fontWeight = '300') => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const canvasWidth = window.innerWidth * 2;
      const canvasHeight = window.innerHeight * 2;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Background
      ctx.fillStyle = bgColor || '#060606';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fontSize = size || Math.floor(canvasWidth * 0.08); // Reduced from 0.15 to 0.08

      // Create gradient for text - FIXED GRADIENT
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
      gradient.addColorStop(0, '#ff2d2d');    // --red1
      gradient.addColorStop(0.25, '#ff4757'); // --red2
      gradient.addColorStop(0.5, '#ff6b7a');  // --red3
      gradient.addColorStop(0.75, '#ff8a95'); // --red4
      gradient.addColorStop(1, '#ff2d2d');    // Loop back to red1

      ctx.fillStyle = gradient;
      ctx.font = `${fontWeight} ${fontSize}px ${font || 'Inter, system-ui, sans-serif'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const scaleFactor = Math.min(1, (canvasWidth * 0.6) / textWidth); // Reduced from 0.8 to 0.6

      ctx.setTransform(
        scaleFactor,
        0,
        0,
        scaleFactor,
        canvasWidth / 2,
        canvasHeight / 2
      );

      // Split text into two lines
      const lines = text.split(' ');
      const lineHeight = fontSize * 1.1;
      
      lines.forEach((line, index) => {
        const yPos = (index - (lines.length - 1) / 2) * lineHeight;
        ctx.fillText(line, 0, yPos);
      });

      return new THREE.CanvasTexture(canvas);
    };

    const initializeScene = (texture) => {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const aspectRatio = window.innerWidth / window.innerHeight;
      const camera = new THREE.OrthographicCamera(
        -1, 1, 1 / aspectRatio, -1 / aspectRatio, 0.1, 1000
      );
      camera.position.z = 1;

      const shaderUniforms = {
        u_mouse: { type: 'v2', value: new THREE.Vector2() },
        u_prevMouse: { type: 'v2', value: new THREE.Vector2() },
        u_texture: { type: 't', value: texture },
      };

      const planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          uniforms: shaderUniforms,
          vertexShader,
          fragmentShader,
        })
      );

      planeMesh.material.transparent = true;
      planeMeshRef.current = planeMesh;
      scene.add(planeMesh);

      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        premultipliedAlpha: false 
      });
      renderer.setClearColor(0x060606, 0); // Transparent background
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      rendererRef.current = renderer;

      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }

      return { scene, camera, renderer };
    };

    const reloadTexture = () => {
      if (planeMeshRef.current && window.THREE) {
        const newTexture = createTextTexture(
          "Saiprasad Jamdar",
          "Inter, system-ui, sans-serif",
          null,
          "#060606",
          "#ff6b6b",
          "300"
        );
        planeMeshRef.current.material.uniforms.u_texture.value.dispose();
        planeMeshRef.current.material.uniforms.u_texture.value = newTexture;
      }
    };

    const animateScene = (camera) => {
      if (!rendererRef.current || !sceneRef.current || !planeMeshRef.current) return;

      mousePosition.current.x += (targetMousePosition.current.x - mousePosition.current.x) * easeFactor.current;
      mousePosition.current.y += (targetMousePosition.current.y - mousePosition.current.y) * easeFactor.current;

      planeMeshRef.current.material.uniforms.u_mouse.value.set(
        mousePosition.current.x,
        1.0 - mousePosition.current.y
      );
      planeMeshRef.current.material.uniforms.u_prevMouse.value.set(
        prevPosition.current.x,
        1.0 - prevPosition.current.y
      );

      rendererRef.current.render(sceneRef.current, camera);
      animationIdRef.current = requestAnimationFrame(() => animateScene(camera));
    };

    const handleMouseMove = (event) => {
      if (!containerRef.current) return;
      
      easeFactor.current = 0.04;
      const rect = containerRef.current.getBoundingClientRect();
      prevPosition.current = { ...targetMousePosition.current };
      targetMousePosition.current.x = (event.clientX - rect.left) / rect.width;
      targetMousePosition.current.y = (event.clientY - rect.top) / rect.height;
    };

    const handleMouseEnter = (event) => {
      if (!containerRef.current) return;
      
      easeFactor.current = 0.02;
      const rect = containerRef.current.getBoundingClientRect();
      mousePosition.current.x = targetMousePosition.current.x = (event.clientX - rect.left) / rect.width;
      mousePosition.current.y = targetMousePosition.current.y = (event.clientY - rect.top) / rect.height;
    };

    const handleMouseLeave = () => {
      easeFactor.current = 0.02;
      targetMousePosition.current = { ...prevPosition.current };
    };

    const onWindowResize = (camera) => {
      if (!rendererRef.current) return;
      
      const aspectRatio = window.innerWidth / window.innerHeight;
      camera.left = -1;
      camera.right = 1;
      camera.top = 1 / aspectRatio;
      camera.bottom = -1 / aspectRatio;
      camera.updateProjectionMatrix();

      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      
      // Debounced texture reload
      if (window.textureReloadTimeout) {
        clearTimeout(window.textureReloadTimeout);
      }
      window.textureReloadTimeout = setTimeout(() => {
        reloadTexture();
      }, 100);
    };

    // Initialize the scene
    const texture = createTextTexture(
      'Saiprasad Jamdar',
      'Inter, system-ui, sans-serif',
      null,
      '#060606',
      '#ff6b6b',
      '300'
    );

    const { camera } = initializeScene(texture);
    animateScene(camera);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    const handleResize = () => onWindowResize(camera);
    window.addEventListener('resize', handleResize);

    // Cleanup function
    const cleanup = () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (window.textureReloadTimeout) {
        clearTimeout(window.textureReloadTimeout);
      }
      
      if (rendererRef.current && containerRef.current) {
        try {
          if (containerRef.current.contains(rendererRef.current.domElement)) {
            containerRef.current.removeChild(rendererRef.current.domElement);
          }
        } catch (e) {
          console.warn('Error removing renderer element:', e);
        }
      }
      
      // Dispose of Three.js resources
      if (planeMeshRef.current) {
        if (planeMeshRef.current.material.uniforms.u_texture.value) {
          planeMeshRef.current.material.uniforms.u_texture.value.dispose();
        }
        planeMeshRef.current.material.dispose();
        planeMeshRef.current.geometry.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };

    // Store cleanup function for later use
    containerRef.current._cleanup = cleanup;
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (containerRef.current && containerRef.current._cleanup) {
        containerRef.current._cleanup();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="name-container"
    />
  );
};

export default Name;