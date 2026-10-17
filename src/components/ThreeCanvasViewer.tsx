import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Layers,
  Sun,
  Eye,
  Sparkles,
  Upload,
  Download,
  Info
} from 'lucide-react';
import {
  buildForearmMesh,
  buildSkullMesh,
  buildHannyaMesh,
  buildTorsoMesh,
  buildDialHardwareMesh,
  buildCaliperMesh
} from '../utils/proceduralGeometries';
import {
  createHighResUVGridTexture,
  createDarkClayTexture,
  createIvoryBoneTexture,
  createTattooOverlayTexture
} from '../utils/textureGenerators';
import { STENCIL_PRESETS } from '../utils/stencilPresets';
import { exportToOBJ, triggerDownload, generateProcreateReadme } from '../utils/objExporter';

interface ThreeCanvasViewerProps {
  meshPreset?: 'forearm' | 'skull' | 'hannya' | 'torso' | 'snake' | 'dial' | 'caliper' | 'custom';
  modelTitle: string;
  isCompact?: boolean; // When embedded directly in PDP gallery
  onExpandFullscreen?: () => void;
}

export const ThreeCanvasViewer: React.FC<ThreeCanvasViewerProps> = ({
  meshPreset = 'forearm',
  modelTitle,
  isCompact = false,
  onExpandFullscreen
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI state
  const [activeTextureMode, setActiveTextureMode] = useState<
    'clay' | 'uv_grid' | 'bone' | 'wireframe' | 'stencil'
  >('uv_grid');
  const [activeLighting, setActiveLighting] = useState<'studio' | 'rim' | 'warm'>('studio');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'textures' | 'stencil' | 'lighting'>('textures');

  // Stencil simulator state
  const [selectedStencilId, setSelectedStencilId] = useState<string>('mandala');
  const [stencilScale, setStencilScale] = useState<number>(1.0);
  const [stencilRotation, setStencilRotation] = useState<number>(0);
  const [stencilOpacity, setStencilOpacity] = useState<number>(0.95);
  const [customStencilSrc, setCustomStencilSrc] = useState<string | null>(null);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentModelGroupRef = useRef<THREE.Group | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Interaction controls refs
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const sphericalRef = useRef({ radius: 5.2, theta: 0.6, phi: 1.2 });
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  // Stencil image element cache
  const loadedStencilImgRef = useRef<HTMLImageElement | null>(null);

  // Helper to load image for stencil canvas
  useEffect(() => {
    const src = customStencilSrc || (STENCIL_PRESETS.find((s) => s.id === selectedStencilId)?.dataUrl ?? null);
    if (!src) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedStencilImgRef.current = img;
      if (activeTextureMode === 'stencil') {
        applyTextureToMeshes();
      }
    };
    img.src = src;
  }, [selectedStencilId, customStencilSrc]);

  // Update textures on meshes
  const applyTextureToMeshes = () => {
    if (!currentModelGroupRef.current) return;

    let targetTexture: THREE.CanvasTexture | null = null;
    let isWireframe = false;
    let roughness = 0.45;
    let metalness = 0.08;
    let color = 0xffffff;

    if (activeTextureMode === 'uv_grid') {
      targetTexture = createHighResUVGridTexture();
      roughness = 0.5;
      metalness = 0.05;
    } else if (activeTextureMode === 'clay') {
      targetTexture = createDarkClayTexture();
      roughness = 0.6;
      metalness = 0.05;
    } else if (activeTextureMode === 'bone') {
      targetTexture = createIvoryBoneTexture();
      roughness = 0.38;
      metalness = 0.04;
      color = 0xf5f0e6;
    } else if (activeTextureMode === 'wireframe') {
      isWireframe = true;
      color = 0xd97706; // Amber gold wireframe
    } else if (activeTextureMode === 'stencil') {
      targetTexture = createTattooOverlayTexture(
        loadedStencilImgRef.current,
        stencilScale,
        stencilRotation,
        stencilOpacity
      );
      roughness = 0.55;
      metalness = 0.08;
    }

    currentModelGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (isWireframe) {
          mesh.material = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xd97706
          });
        } else {
          mesh.material = new THREE.MeshStandardMaterial({
            map: targetTexture,
            color: color,
            roughness: roughness,
            metalness: metalness
          });
        }
      }
    });
  };

  // Re-apply when texture mode or stencil parameters change
  useEffect(() => {
    applyTextureToMeshes();
  }, [activeTextureMode, stencilScale, stencilRotation, stencilOpacity]);

  // Lighting switcher
  useEffect(() => {
    if (!keyLightRef.current || !fillLightRef.current || !rimLightRef.current) return;

    if (activeLighting === 'studio') {
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 2.4;
      fillLightRef.current.color.setHex(0xd0d8f0);
      fillLightRef.current.intensity = 1.0;
      rimLightRef.current.color.setHex(0xe0e6ff);
      rimLightRef.current.intensity = 1.8;
    } else if (activeLighting === 'rim') {
      keyLightRef.current.intensity = 0.7;
      fillLightRef.current.intensity = 0.3;
      rimLightRef.current.color.setHex(0xf59e0b); // Amber rim
      rimLightRef.current.intensity = 3.8;
    } else if (activeLighting === 'warm') {
      keyLightRef.current.color.setHex(0xffdfa8);
      keyLightRef.current.intensity = 2.8;
      fillLightRef.current.color.setHex(0xa68c74);
      fillLightRef.current.intensity = 0.9;
      rimLightRef.current.color.setHex(0xffd599);
      rimLightRef.current.intensity = 1.5;
    }
  }, [activeLighting]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1017);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;

    // Default distance according to model preset
    let defaultDist = 5.2;
    if (meshPreset === 'caliper') defaultDist = 6.0;
    if (meshPreset === 'dial') defaultDist = 4.4;
    sphericalRef.current.radius = defaultDist;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0xd0d8f0, 1.0);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const rimLight = new THREE.DirectionalLight(0xe0e6ff, 1.8);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Soft contact ground shadow plane
    const shadowGeo = new THREE.PlaneGeometry(12, 12);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.05;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // Build targeted 3D model
    let modelGroup: THREE.Group;
    if (meshPreset === 'skull') {
      modelGroup = buildSkullMesh();
    } else if (meshPreset === 'hannya') {
      modelGroup = buildHannyaMesh();
    } else if (meshPreset === 'torso') {
      modelGroup = buildTorsoMesh();
    } else if (meshPreset === 'dial') {
      modelGroup = buildDialHardwareMesh();
    } else if (meshPreset === 'caliper') {
      modelGroup = buildCaliperMesh();
    } else {
      modelGroup = buildForearmMesh();
    }

    currentModelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    applyTextureToMeshes();

    // Mouse / Touch Event Handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      sphericalRef.current.theta -= deltaX * 0.007;
      sphericalRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, sphericalRef.current.phi - deltaY * 0.007)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRef.current.radius = Math.max(
        1.8,
        Math.min(10.0, sphericalRef.current.radius + e.deltaY * 0.004)
      );
    };

    // Touch events for iPad and mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      sphericalRef.current.theta -= deltaX * 0.008;
      sphericalRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, sphericalRef.current.phi - deltaY * 0.008)
      );

      previousMousePositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotateRef.current && !isDraggingRef.current) {
        sphericalRef.current.theta += 0.004;
      }

      // Convert spherical coordinates to cartesian camera position
      const s = sphericalRef.current;
      const x = s.radius * Math.sin(s.phi) * Math.sin(s.theta);
      const y = s.radius * Math.cos(s.phi);
      const z = s.radius * Math.sin(s.phi) * Math.cos(s.theta);

      camera.position.set(x, y, z);
      camera.lookAt(cameraTargetRef.current);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [meshPreset]);

  // Handle file upload for custom stencil / tattoo flash
  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomStencilSrc(event.target.result);
        setActiveTextureMode('stencil');
      }
    };
    reader.readAsDataURL(file);
  };

  // Zoom helpers
  const handleZoom = (delta: number) => {
    sphericalRef.current.radius = Math.max(
      1.8,
      Math.min(10.0, sphericalRef.current.radius + delta)
    );
  };

  // Reset view
  const handleResetCamera = () => {
    sphericalRef.current = { radius: 5.2, theta: 0.6, phi: 1.2 };
    cameraTargetRef.current.set(0, 0, 0);
  };

  // Export & Download OBJ for Procreate
  const handleExportOBJ = () => {
    if (!currentModelGroupRef.current) return;
    const objContent = exportToOBJ(currentModelGroupRef.current, modelTitle);
    const filename = `${modelTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_procreate_ready.obj`;
    triggerDownload(objContent, filename, 'model/obj');

    // Also download procreate readme instructions
    const readmeContent = generateProcreateReadme(modelTitle);
    triggerDownload(readmeContent, 'COMO_IMPORTAR_EN_PROCREATE.txt', 'text/plain');
  };

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#0d0f17] rounded-xl overflow-hidden select-none border border-white/5 flex flex-col">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing w-full h-full" />

      {/* Top HUD Bar: Title, Spec Badges & Fullscreen Action */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 pointer-events-auto">
          <span className="text-xs font-semibold text-white tracking-wide uppercase font-display">
            3D Orbit Preview
          </span>
          <span className="text-white/30">/</span>
          <span className="text-xs text-amber-400 font-mono">2048px HD UV</span>
          <span className="text-white/30">/</span>
          <span className="text-xs text-zinc-400">Procreate 5.2+ Ready</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {onExpandFullscreen && (
            <button
              onClick={onExpandFullscreen}
              title="Expandir a pantalla completa"
              className="p-2 bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white rounded-lg border border-white/10 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleExportOBJ}
            title="Descargar muestra .OBJ para Procreate"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar .OBJ</span>
          </button>
        </div>
      </div>

      {/* Floating Instructions Helper (Discreet corner) */}
      <div className="absolute top-16 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 text-[11px] text-zinc-400 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5">
        <Info className="w-3 h-3 text-amber-400" />
        <span>Gira 360° arrastrando · Rueda para zoom · Prueba stencils abajo</span>
      </div>

      {/* Collapsible Ergonomic Bottom Dock (Strict Three.js Architecture Directive) */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[860px] transition-all duration-300 ease-out ${
          isDockCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
        }`}
      >
        {/* Dock Header & Collapse Toggle */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#141722]/95 backdrop-blur-md rounded-t-lg border-t border-x border-white/10">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('textures')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'textures'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Texturas HD
              </span>
            </button>
            <button
              onClick={() => setActiveTab('stencil')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'stencil'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Simulador Stencil / Tattoo
              </span>
            </button>
            <button
              onClick={() => setActiveTab('lighting')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'lighting'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                Iluminación
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Camera Quick Tools */}
            <button
              onClick={() => handleZoom(-0.6)}
              title="Acercar zoom"
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(0.6)}
              title="Alejar zoom"
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetCamera}
              title="Restablecer posición inicial"
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title="Giro automático 360°"
              className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                autoRotate ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Auto 360°
            </button>

            {/* Collapse / Expand Toggle */}
            <button
              onClick={() => setIsDockCollapsed(!isDockCollapsed)}
              className="flex items-center gap-1 px-2 py-0.5 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded transition-colors ml-1"
            >
              {isDockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mostrar Controles</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ocultar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dock Main Content Panel */}
        <div className="p-3 bg-[#11131c]/95 backdrop-blur-md rounded-b-lg border-b border-x border-white/10">
          {/* TAB 1: Textures */}
          {activeTab === 'textures' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-medium">Acabado 3D:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTextureMode('uv_grid')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      activeTextureMode === 'uv_grid'
                        ? 'bg-amber-500 text-black font-semibold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    Guía UV HD (2048px)
                  </button>
                  <button
                    onClick={() => setActiveTextureMode('clay')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      activeTextureMode === 'clay'
                        ? 'bg-amber-500 text-black font-semibold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    Arcilla Mate
                  </button>
                  <button
                    onClick={() => setActiveTextureMode('bone')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      activeTextureMode === 'bone'
                        ? 'bg-amber-500 text-black font-semibold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    Hueso / Resina
                  </button>
                  <button
                    onClick={() => setActiveTextureMode('wireframe')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      activeTextureMode === 'wireframe'
                        ? 'bg-amber-500 text-black font-semibold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    Malla Quads
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Textura 100% calibrada para Procreate & Nomad</span>
              </div>
            </div>
          )}

          {/* TAB 2: Stencil / Tattoo Wrap Simulator */}
          {activeTab === 'stencil' && (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-medium">Stencils Flash:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {STENCIL_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setSelectedStencilId(preset.id);
                          setCustomStencilSrc(null);
                          setActiveTextureMode('stencil');
                        }}
                        className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                          activeTextureMode === 'stencil' &&
                          selectedStencilId === preset.id &&
                          !customStencilSrc
                            ? 'bg-amber-500 text-black font-semibold'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Custom Tattoo Flash */}
                <label className="flex items-center gap-1.5 px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md cursor-pointer border border-white/10 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Subir Mi Flash / Diseño</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleCustomFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Stencil Controls: Scale, Rotation, Opacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400 whitespace-nowrap">Escala:</span>
                  <input
                    type="range"
                    min="0.3"
                    max="2.0"
                    step="0.05"
                    value={stencilScale}
                    onChange={(e) => {
                      setStencilScale(parseFloat(e.target.value));
                      setActiveTextureMode('stencil');
                    }}
                    className="w-full accent-amber-500 h-1 bg-zinc-700 rounded-lg"
                  />
                  <span className="text-[11px] text-zinc-300 font-mono w-8">
                    {stencilScale.toFixed(1)}x
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400 whitespace-nowrap">Rotación:</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={stencilRotation}
                    onChange={(e) => {
                      setStencilRotation(parseInt(e.target.value, 10));
                      setActiveTextureMode('stencil');
                    }}
                    className="w-full accent-amber-500 h-1 bg-zinc-700 rounded-lg"
                  />
                  <span className="text-[11px] text-zinc-300 font-mono w-8">
                    {stencilRotation}°
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400 whitespace-nowrap">Opacidad:</span>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={stencilOpacity}
                    onChange={(e) => {
                      setStencilOpacity(parseFloat(e.target.value));
                      setActiveTextureMode('stencil');
                    }}
                    className="w-full accent-amber-500 h-1 bg-zinc-700 rounded-lg"
                  />
                  <span className="text-[11px] text-zinc-300 font-mono w-8">
                    {Math.round(stencilOpacity * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Lighting */}
          {activeTab === 'lighting' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-medium">Esquema de Luz:</span>
                <button
                  onClick={() => setActiveLighting('studio')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    activeLighting === 'studio'
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  Estudio 3-Puntos PBR
                </button>
                <button
                  onClick={() => setActiveLighting('rim')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    activeLighting === 'rim'
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  Contraluz Silueta (Rim)
                </button>
                <button
                  onClick={() => setActiveLighting('warm')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    activeLighting === 'warm'
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  Lámpara Cálida de Taller
                </button>
              </div>

              <div className="text-[11px] text-zinc-400 hidden sm:block">
                Simula las condiciones de iluminación en tu estudio o en Procreate
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
