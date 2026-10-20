import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { INITIAL_VG_WORLD_COLLECTIBLES } from '../../data/gameAssets';
import { WORLD_LANDMARKS, WorldLandmark } from '../../data/worldLandmarks';
import { CollectibleItem, TravelEmote } from '../../types/game';
import { VirtualJoystick } from './VirtualJoystick';
import { GameHUD } from './GameHUD';
import { PlaceSearchModal } from './PlaceSearchModal';

interface VGWorldGameProps {
  onScoreUpdate?: (score: number, collectedCount: number) => void;
}

type TimeOfDay = 'day' | 'sunset' | 'night';

// ---------------------------------------------------------------------------
// WEB AUDIO SOUND SYNTH — 100% offline
// ---------------------------------------------------------------------------
function playSoundEffect(type: 'pickup' | 'jump' | 'bounce' | 'boost' | 'chest' | 'teleport') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'jump':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.start(now); osc.stop(now + 0.18);
        break;
      case 'bounce':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.3);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
        break;
      case 'boost':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
        break;
      case 'chest':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
        osc.start(now); osc.stop(now + 0.55);
        break;
      case 'teleport':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(1350, now + 0.25);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
        osc.start(now); osc.stop(now + 0.38);
        break;
      default:
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    }
  } catch { /* silently ignore audio errors on unsupported browsers */ }
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------
export const VGWorldGame: React.FC<VGWorldGameProps> = ({ onScoreUpdate }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // React state — kept minimal to avoid unnecessary re-renders of 3D scene
  const [collectibles, setCollectibles] = useState<CollectibleItem[]>(INITIAL_VG_WORLD_COLLECTIBLES);
  const [score, setScore] = useState<number>(0);
  const [unlockedItem, setUnlockedItem] = useState<CollectibleItem | null>(null);
  const [nearbyPlayerName, setNearbyPlayerName] = useState<string | undefined>(undefined);
  const [nearbyPlayerEmote, setNearbyPlayerEmote] = useState<string | undefined>(undefined);
  const [playerEmote, setPlayerEmote] = useState<{ text: string; expires: number } | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [speedBoostActive, setSpeedBoostActive] = useState<boolean>(false);
  const [activeBadge, setActiveBadge] = useState<{ text: string; icon: string } | null>(null);
  const [showPlaceSearch, setShowPlaceSearch] = useState<boolean>(false);
  const [activeWaypoint, setActiveWaypoint] = useState<WorldLandmark | null>(null);
  const [playerCoords, setPlayerCoords] = useState<{ x: number; z: number }>({ x: 0, z: 0 });
  const [waypointDistance, setWaypointDistance] = useState<number>(0);
  const [discoveredLandmarks, setDiscoveredLandmarks] = useState<string[]>([]);

  // Score callback ref — prevents re-mounting 3D scene on score changes
  const onScoreUpdateRef = useRef(onScoreUpdate);
  useEffect(() => { onScoreUpdateRef.current = onScoreUpdate; }, [onScoreUpdate]);

  // Atmosphere sync — fast path, never rebuilds WebGL scene
  const updateAtmosphereRef = useRef<((mode: TimeOfDay) => void) | null>(null);
  useEffect(() => {
    if (updateAtmosphereRef.current) updateAtmosphereRef.current(timeOfDay);
  }, [timeOfDay]);

  // Game refs — all mutable game state lives here to avoid React overhead in animate()
  const jumpRequestedAtRef = useRef<number>(0);
  const speedBoostExpiresRef = useRef<number>(0);
  const speedBoostActiveRef = useRef<boolean>(false); // mirrors React state without triggering renders every frame
  const teleportTargetRef = useRef<{ x: number; y: number; z: number; landmarkName: string } | null>(null);
  const activeWaypointRef = useRef<WorldLandmark | null>(null);
  const moveVectorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const scoreRef = useRef<number>(0);
  const collectedIdsRef = useRef<Set<string>>(new Set()); // authoritative source for what's been collected
  const boostPadCooldownRef = useRef<{ [k: string]: number }>({}); // per-pad boost cooldown timestamps
  const respawnTimersRef = useRef<{ [id: string]: number }>({}); // timestamps for 45s secret loot respawns
  const lastNearbyRef = useRef<string | undefined>(undefined);
  const lastCoordsRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const lastWaypointDistRef = useRef<number>(-1);

  // Badge ref — avoid stale closure issue
  const activeBadgeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showBadge = useCallback((text: string, icon: string) => {
    if (activeBadgeTimeoutRef.current) clearTimeout(activeBadgeTimeoutRef.current);
    setActiveBadge({ text, icon });
    activeBadgeTimeoutRef.current = setTimeout(() => setActiveBadge(null), 2400);
  }, []);

  // Sync waypoint ref
  useEffect(() => { activeWaypointRef.current = activeWaypoint; }, [activeWaypoint]);

  // NPC remote players — stable ref
  const remotePlayersRef = useRef([
    { id: 'usr_rohan',  displayName: 'Rohan',   avatarColor: '#1B3FFF', x:   4.5, y: 0.0, z:  -4.0, rotationY:  0.5, currentEmote: 'Hello! Enjoying the sights! 👋' },
    { id: 'usr_fatima', displayName: 'Fatima',  avatarColor: '#FF5722', x:  -6.0, y: 0.0, z:  26.0, rotationY:  1.2, currentEmote: 'The fragrant spices smell amazing! 🧄' },
    { id: 'usr_alex',   displayName: 'Alex',    avatarColor: '#10B981', x:  26.0, y: 3.6, z:   2.0, rotationY: -1.5, currentEmote: 'Crossing the Creek! 🌉' },
    { id: 'usr_zayn',   displayName: 'Zayn',    avatarColor: '#EC4899', x:  48.0, y: 0.0, z: -34.0, rotationY: -0.8, currentEmote: 'So peaceful by the fountain ⛲' },
    { id: 'usr_aadhu',  displayName: 'Aadhu',   avatarColor: '#F59E0B', x: -38.5, y: 0.2, z:  56.5, rotationY:  0.3, scale: 0.72, currentEmote: 'Race you across the bridge, Momo! 🏃' },
    { id: 'usr_momo',   displayName: 'Momo',    avatarColor: '#8B5CF6', x: -36.2, y: 0.2, z:  54.8, rotationY: -0.7, scale: 1.05, currentEmote: 'Careful near the water, Aadhu! 😄' },
  ]);

  // ---------------------------------------------------------------------------
  // CALLBACKS — stable refs, never recreated
  // ---------------------------------------------------------------------------
  const handleJoystickMove = useCallback((vec: { x: number; y: number }) => {
    moveVectorRef.current = vec;
  }, []);

  const handleSendEmote = useCallback((emote: TravelEmote) => {
    setPlayerEmote({ text: emote, expires: Date.now() + 4500 });
  }, []);

  const handleJump = useCallback(() => {
    jumpRequestedAtRef.current = Date.now();
  }, []);

  const handleSprint = useCallback(() => {
    speedBoostExpiresRef.current = Date.now() + 3500;
    playSoundEffect('boost');
    showBadge('TURBO SPRINT!', '⚡');
  }, [showBadge]);

  const handleToggleTimeOfDay = useCallback(() => {
    setTimeOfDay(prev => prev === 'day' ? 'sunset' : prev === 'sunset' ? 'night' : 'day');
  }, []);

  const handleTeleportTo = useCallback((landmark: WorldLandmark) => {
    teleportTargetRef.current = {
      x: landmark.coords.x,
      y: landmark.coords.y,
      z: landmark.coords.z + (landmark.coords.z > 0 ? -4.5 : 4.5),
      landmarkName: landmark.name
    };
  }, []);

  // ---------------------------------------------------------------------------
  // MAIN THREE.JS SETUP EFFECT — runs once only ([])
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#87CEEB');
    scene.fog = new THREE.FogExp2('#87CEEB', 0.007);

    // 2. CAMERA
    const width  = container.clientWidth  || window.innerWidth;
    const height = container.clientHeight || (window.innerHeight - 130);
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 750);
    const targetCameraPos = new THREE.Vector3();

    // 3. RENDERER (Optimized for 60fps buttery-smooth mobile & desktop gameplay)
    const isMobile = width < 768;
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp',
      stencil: false,
      depth: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // Ultra-fast hardware shadow map filtering
    container.appendChild(renderer.domElement);

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight('#FFFBEB', 0.85);
    scene.add(ambientLight);
    const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#E8D2A6', 0.6);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight('#F59E0B', 2.0);
    sunLight.position.set(45, 55, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(isMobile ? 512 : 1024, isMobile ? 512 : 1024);
    sunLight.shadow.camera.near   =  10;
    sunLight.shadow.camera.far    =  190;
    sunLight.shadow.camera.left   = -75;
    sunLight.shadow.camera.right  =  75;
    sunLight.shadow.camera.top    =  75;
    sunLight.shadow.camera.bottom = -75;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // Night point lights
    const lanternBridge = new THREE.PointLight('#FBBF24', 0, 20);
    lanternBridge.position.set(26, 4.8, 0);
    const lanternBurj   = new THREE.PointLight('#38BDF8', 0, 30);
    lanternBurj.position.set(30, 8, -50);
    const lanternSouk   = new THREE.PointLight('#F59E0B', 0, 22);
    lanternSouk.position.set(-6, 3.5, 28);
    const lanternCamp   = new THREE.PointLight('#EA580C', 0, 22);
    lanternCamp.position.set(-48, 2.0, -53);
    scene.add(lanternBridge, lanternBurj, lanternSouk, lanternCamp);

    // Star field — only visible at night
    const starGeo = new THREE.BufferGeometry();
    const starCount = 600;
    const starVerts = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starVerts[i * 3]     = (Math.random() - 0.5) * 600;
      starVerts[i * 3 + 1] = 80 + Math.random() * 120;
      starVerts[i * 3 + 2] = (Math.random() - 0.5) * 600;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starVerts, 3));
    const starMat = new THREE.PointsMaterial({ color: '#FFFFFF', size: 0.6, sizeAttenuation: true, transparent: true, opacity: 0 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Atmosphere switcher — updated by React state changes via ref
    const updateAtmosphere = (mode: TimeOfDay) => {
      if (mode === 'sunset') {
        scene.background = new THREE.Color('#F97316');
        scene.fog = new THREE.FogExp2('#EA580C', 0.009);
        ambientLight.color.set('#FEF08A'); ambientLight.intensity = 0.7;
        sunLight.color.set('#EF4444');     sunLight.intensity = 2.4;
        lanternBridge.intensity = 1.2; lanternBurj.intensity = 0.8;
        lanternSouk.intensity   = 1.0; lanternCamp.intensity = 1.5;
        starMat.opacity = 0;
      } else if (mode === 'night') {
        scene.background = new THREE.Color('#0F172A');
        scene.fog = new THREE.FogExp2('#0F172A', 0.011);
        ambientLight.color.set('#312E81'); ambientLight.intensity = 0.45;
        sunLight.color.set('#6366F1');     sunLight.intensity = 0.6;
        lanternBridge.intensity = 2.8; lanternBurj.intensity = 3.5;
        lanternSouk.intensity   = 3.0; lanternCamp.intensity = 3.2;
        starMat.opacity = 1;
      } else {
        scene.background = new THREE.Color('#87CEEB');
        scene.fog = new THREE.FogExp2('#87CEEB', 0.007);
        ambientLight.color.set('#FFFBEB'); ambientLight.intensity = 0.85;
        sunLight.color.set('#F59E0B');     sunLight.intensity = 2.0;
        lanternBridge.intensity = 0; lanternBurj.intensity = 0;
        lanternSouk.intensity   = 0; lanternCamp.intensity = 0;
        starMat.opacity = 0;
      }
    };
    updateAtmosphereRef.current = updateAtmosphere;
    updateAtmosphere('day');

    // 5. SHARED MATERIALS
    const sharedSandMat     = new THREE.MeshLambertMaterial({ color: '#E8D2A6' });
    const sharedDuneMat     = new THREE.MeshLambertMaterial({ color: '#D97706' });
    const sharedRoadMat     = new THREE.MeshLambertMaterial({ color: '#374151' });
    const sharedWoodMat     = new THREE.MeshLambertMaterial({ color: '#78350F' });
    const sharedBuildingMat = new THREE.MeshLambertMaterial({ color: '#D4B996' });
    const sharedFoliageMat  = new THREE.MeshLambertMaterial({ color: '#15803D' });
    const sharedGoldMat     = new THREE.MeshLambertMaterial({ color: '#D4AF37' });
    const sharedSilverMat   = new THREE.MeshLambertMaterial({ color: '#E2E8F0' });

    // 6. GROUND — 320×320
    const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), sharedSandMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Grid
    const gridHelper = new THREE.GridHelper(320, 160, '#9ca3af', '#d1d5db');
    gridHelper.position.y = 0.02;
    (gridHelper.material as THREE.Material).opacity = 0.18;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // 7. MAJESTIC RED SAND DUNES (Western & Northern Horizon Reserve — 100% Grounded, Zero Floating)
    // Geometry base vertices are translated and anchored subterraneanly at y = -0.2 (impossible to float)
    const createDune = (
      cx: number,
      cz: number,
      rx: number,
      rz: number,
      height: number,
      rotY = 0
    ) => {
      const g = new THREE.Group();
      // Main deep red desert dune
      const geo = new THREE.ConeGeometry(1, 1, 18);
      geo.translate(0, 0.5, 0); // Translate base to y = 0, apex to y = 1.0
      const mesh = new THREE.Mesh(geo, sharedDuneMat);
      mesh.scale.set(rx, height, rz);
      mesh.position.set(0, -0.2, 0); // Sunk 0.2 units below ground plane
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      g.add(mesh);

      // Sunlit windward ridge crest highlight (low-poly stylized desert rim)
      const crestGeo = new THREE.ConeGeometry(1, 1, 14);
      crestGeo.translate(0, 0.5, 0);
      const crestMat = new THREE.MeshLambertMaterial({ color: '#E8A246' });
      const crestMesh = new THREE.Mesh(crestGeo, crestMat);
      crestMesh.scale.set(rx * 0.75, height * 0.94, rz * 0.72);
      crestMesh.position.set(rx * 0.08, -0.19, -rz * 0.06);
      g.add(crestMesh);

      g.position.set(cx, 0, cz);
      g.rotation.y = rotY;
      return g;
    };

    scene.add(
      // Far North-Western Horizon Dune Ridge
      createDune(-62, -78, 22, 16, 5.5, 0.35),
      // Far Western Perimeter Dune (framing behind the camp clearing)
      createDune(-67, -46, 16, 24, 5.0, -0.2),
      // Deep Northern Desert Dune
      createDune(-38, -84, 18, 14, 4.6, 0.15),
      // South-Western Transition Dune
      createDune(-66, -18, 15, 20, 4.2, 0.3),
      // Deep Corner Ridge
      createDune(-72, -88, 20, 20, 6.2, -0.1)
    );

    // 8. ROAD NETWORK
    const createRoad = (w: number, d: number, x: number, z: number, rotY = 0) => {
      const r = new THREE.Mesh(new THREE.PlaneGeometry(w, d), sharedRoadMat);
      r.rotation.x = -Math.PI / 2; r.rotation.z = rotY;
      r.position.set(x, 0.03, z); r.receiveShadow = true;
      return r;
    };
    scene.add(
      createRoad(10, 180, -10, 0), createRoad(110, 10, -15, 20, Math.PI / 2), createRoad(110, 10, -15, -25, Math.PI / 2),
      createRoad(12, 190,  32, 0), createRoad( 90, 10,  32, -45, Math.PI / 2), createRoad( 80, 10, 32, 45, Math.PI / 2)
    );

    // 9. KHOR DUBAI WATERWAY (Confined to canal channel from z = -35 to +40)
    const creekMat = new THREE.MeshLambertMaterial({ color: '#38BDF8', transparent: true, opacity: 0.88 });
    const creekMesh = new THREE.Mesh(new THREE.PlaneGeometry(34, 76), creekMat);
    creekMesh.rotation.x = -Math.PI / 2;
    creekMesh.position.set(26, 0.05, 2.5);
    creekMesh.receiveShadow = true;
    scene.add(creekMesh);

    // Creek quay walls (aligned with canal channel)
    const quayGeo = new THREE.BoxGeometry(1.5, 0.8, 76);
    const quayW = new THREE.Mesh(quayGeo, sharedBuildingMat); quayW.position.set( 8.5, 0.4, 2.5); scene.add(quayW);
    const quayE = new THREE.Mesh(quayGeo, sharedBuildingMat); quayE.position.set(43.5, 0.4, 2.5); scene.add(quayE);

    // 10. GRAND ARCH BRIDGE
    const bridgeGroup = new THREE.Group();
    const segments = 22;
    const postGeo  = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 6);
    for (let i = 0; i <= segments; i++) {
      const t  = i / segments;
      const bx = 7.5 + t * 37.0;
      const by = 0.4 + Math.sin(t * Math.PI) * 3.2;
      const seg = new THREE.Mesh(new THREE.BoxGeometry(37.0 / segments + 0.1, 0.4, 8.0), sharedWoodMat);
      seg.position.set(bx, by, 0); seg.castShadow = true; seg.receiveShadow = true;
      bridgeGroup.add(seg);
      if (i % 2 === 0) {
        for (const rz of [-3.8, 3.8]) {
          const post = new THREE.Mesh(postGeo, sharedGoldMat);
          post.position.set(bx, by + 0.7, rz);
          bridgeGroup.add(post);
        }
      }
    }
    scene.add(bridgeGroup);

    // 11. ABRA BOATS
    const createAbra = (zPos: number) => {
      const ag = new THREE.Group();
      const hull = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.6, 6.5), sharedWoodMat); hull.position.y = 0.3; ag.add(hull);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 5.0), sharedGoldMat); roof.position.y = 1.6; ag.add(roof);
      ag.position.set(20, 0, zPos);
      return ag;
    };
    const abra1 = createAbra(-18);
    const abra2 = createAbra( 22);
    scene.add(abra1, abra2);

    // 12. LANDMARKS

    // a) BURJ KHALIFA & DOWNTOWN FOUNTAIN PLAZA (100% On Dry Land & Walkable!)
    const downtownPlaza = new THREE.Mesh(
      new THREE.BoxGeometry(46, 0.3, 44),
      new THREE.MeshLambertMaterial({ color: '#1E293B' })
    );
    downtownPlaza.position.set(28, 0.15, -55);
    downtownPlaza.receiveShadow = true;
    scene.add(downtownPlaza);

    // Downtown Fountain Lake Basin (Reflective lake around the tower base)
    const fountainLake = new THREE.Mesh(
      new THREE.CylinderGeometry(14, 14, 0.15, 32),
      new THREE.MeshLambertMaterial({ color: '#0284C7', emissive: '#0369A1', emissiveIntensity: 0.35 })
    );
    fountainLake.position.set(28, 0.25, -55);
    scene.add(fountainLake);

    const bkGroup = new THREE.Group();
    const bkDark    = new THREE.MeshLambertMaterial({ color: '#334155' });
    const bkCyanBand = new THREE.MeshLambertMaterial({ color: '#38BDF8', emissive: '#0284C7', emissiveIntensity: 0.75 });
    for (let i = 0; i < 7; i++) {
      const size = 8 - i * 1.0;
      const h = 8.5;
      const box = new THREE.Mesh(new THREE.BoxGeometry(size, h, size), i % 2 === 0 ? bkDark : sharedSilverMat);
      box.position.y = i * h + h / 2; box.castShadow = true; box.receiveShadow = true;
      bkGroup.add(box);
      const ring = new THREE.Mesh(new THREE.BoxGeometry(size + 0.35, 0.3, size + 0.35), bkCyanBand);
      ring.position.y = i * h + h; bkGroup.add(ring);
    }
    const bkSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.55, 16, 6), sharedSilverMat);
    bkSpire.position.y = 66; bkSpire.castShadow = true; bkGroup.add(bkSpire);
    const bkBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), new THREE.MeshBasicMaterial({ color: '#EF4444' }));
    bkBeacon.position.y = 75; bkGroup.add(bkBeacon);
    const bkLobby = new THREE.Mesh(new THREE.BoxGeometry(11, 2.2, 11), new THREE.MeshLambertMaterial({ color: '#0F172A' }));
    bkLobby.position.y = 1.1; bkGroup.add(bkLobby);
    bkGroup.position.set(28, 0.2, -55);
    scene.add(bkGroup);

    // b) DUBAI FRAME
    const dfGroup = new THREE.Group();
    const pillarGeo = new THREE.BoxGeometry(2.5, 26, 2.5);
    const dfP1 = new THREE.Mesh(pillarGeo, sharedGoldMat); dfP1.position.set(-7, 13, 0); dfP1.castShadow = true;
    const dfP2 = new THREE.Mesh(pillarGeo, sharedGoldMat); dfP2.position.set( 7, 13, 0); dfP2.castShadow = true;
    for (const lx of [-7.8, -6.2, 6.2, 7.8]) {
      const lat = new THREE.Mesh(new THREE.BoxGeometry(0.2, 24, 0.2), sharedGoldMat);
      lat.position.set(lx, 13, 0); dfGroup.add(lat);
    }
    const dfBridge    = new THREE.Mesh(new THREE.BoxGeometry(16.5, 2.5, 2.5), sharedGoldMat); dfBridge.position.set(0, 25, 0); dfBridge.castShadow = true;
    const dfGlassFloor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.15, 2.0), new THREE.MeshLambertMaterial({ color: '#38BDF8', transparent: true, opacity: 0.65 }));
    dfGlassFloor.position.set(0, 23.8, 0);
    dfGroup.add(dfP1, dfP2, dfBridge, dfGlassFloor);
    dfGroup.position.set(-25, 0, -35);
    scene.add(dfGroup);

    // c) BURJ AL ARAB (Iconic Curved Dhow Sail, Rear Mast Arch & Cantilevered Helipad)
    const baaGroup = new THREE.Group();
    const sailWhiteMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.15, metalness: 0.05 });
    const steelArchMat = new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.3, metalness: 0.6 });
    const skyviewMat   = new THREE.MeshLambertMaterial({ color: '#38BDF8', transparent: true, opacity: 0.8 });

    // 1. Sweeping Curved Spinnaker Sail (Layered white curved arc structure)
    for (let s = 0; s < 9; s++) {
      const prog = s / 8;
      const tierH = 2.6;
      const sailWidth = 10.5 * Math.sin(prog * Math.PI * 0.85);
      const sailZ = Math.cos(prog * Math.PI * 0.7) * 3.5;
      const sailTier = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, tierH - 0.2, Math.max(1.5, sailWidth)),
        sailWhiteMat
      );
      sailTier.position.set(0, s * tierH + tierH / 2 + 0.4, sailZ);
      sailTier.castShadow = true;
      baaGroup.add(sailTier);
    }

    // 2. Rear Structural Exoskeleton Mast Truss (Twin Inverted-V Columns)
    const mastLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 26, 8), steelArchMat);
    mastLeft.position.set(-2.0, 13.5, -3.2);
    mastLeft.rotation.z = -0.06;
    mastLeft.rotation.x = -0.15;
    const mastRight = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 26, 8), steelArchMat);
    mastRight.position.set(2.0, 13.5, -3.2);
    mastRight.rotation.z = 0.06;
    mastRight.rotation.x = -0.15;
    baaGroup.add(mastLeft, mastRight);

    // 3. Spire Mast Summit
    const baaSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.35, 9, 6), sharedSilverMat);
    baaSpire.position.set(0, 27, 0);
    baaGroup.add(baaSpire);

    // 4. Cantilevered Circular Helipad (Jutting out forward over ocean)
    const helipad = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.35, 20), new THREE.MeshLambertMaterial({ color: '#1E293B' }));
    helipad.position.set(0, 21.0, 5.8);
    const helipadH = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.8, 18), new THREE.MeshBasicMaterial({ color: '#FBBF24', side: THREE.DoubleSide }));
    helipadH.rotation.x = -Math.PI / 2; helipadH.position.set(0, 21.2, 5.8);
    const helipadBeam = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 5.5), steelArchMat);
    helipadBeam.position.set(0, 20.3, 3.2);
    baaGroup.add(helipad, helipadH, helipadBeam);

    // 5. Skyview Panoramic Restaurant Capsule (Cantilevered under the summit)
    const skyviewBar = new THREE.Mesh(new THREE.BoxGeometry(8.5, 1.6, 2.6), skyviewMat);
    skyviewBar.position.set(0, 19.2, -1.8);
    baaGroup.add(skyviewBar);

    // 6. Artificial Triangular/Circular Island Base with sea breakers
    const island = new THREE.Mesh(new THREE.CylinderGeometry(14, 15, 0.7, 32), new THREE.MeshLambertMaterial({ color: '#E2E8F0' }));
    island.position.y = 0.35;
    const waveBreaker = new THREE.Mesh(new THREE.TorusGeometry(14.8, 0.6, 8, 32), sharedBuildingMat);
    waveBreaker.rotation.x = Math.PI / 2;
    waveBreaker.position.y = 0.35;
    const baaCause = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.4, 16), sharedWoodMat);
    baaCause.position.set(0, 0.35, -12);
    baaGroup.add(island, waveBreaker, baaCause);

    baaGroup.position.set(40, 0, 25);
    scene.add(baaGroup);

    // d) MUSEUM OF THE FUTURE
    const motfGroup = new THREE.Group();
    const motfHill  = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 11.0, 2.4, 28), sharedFoliageMat);
    motfHill.position.y = 1.2; motfHill.receiveShadow = true; motfGroup.add(motfHill);
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(4.8, 2.3, 16, 44),
      new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.22, metalness: 0.85 })
    );
    torus.position.y = 7.2; torus.castShadow = true; motfGroup.add(torus);
    const slitMat = new THREE.MeshBasicMaterial({ color: '#FDE047' });
    for (let s = 0; s < 8; s++) {
      const angle = (s * Math.PI * 2) / 8;
      const slit  = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.35), slitMat);
      slit.position.set(Math.cos(angle) * 4.8, 7.2 + Math.sin(angle) * 2.3, 0);
      motfGroup.add(slit);
    }
    motfGroup.position.set(-35, 0, 15); motfGroup.rotation.y = Math.PI / 4;
    scene.add(motfGroup);

    // Innovation Plaza Promenade around MOTF
    const motfPlaza = new THREE.Mesh(new THREE.BoxGeometry(26, 0.12, 24), new THREE.MeshLambertMaterial({ color: '#1E293B' }));
    motfPlaza.position.set(-35, 0.06, 15);
    motfPlaza.receiveShadow = true;
    scene.add(motfPlaza);

    // e) AIN DUBAI FERRIS WHEEL
    const ainGroup = new THREE.Group();
    const pylonGeo = new THREE.CylinderGeometry(0.4, 0.7, 24, 8);
    const pylon1   = new THREE.Mesh(pylonGeo, sharedSilverMat); pylon1.position.set(-4, 11, 0); pylon1.rotation.z = -0.16; pylon1.castShadow = true;
    const pylon2   = new THREE.Mesh(pylonGeo, sharedSilverMat); pylon2.position.set( 4, 11, 0); pylon2.rotation.z =  0.16; pylon2.castShadow = true;
    ainGroup.add(pylon1, pylon2);
    const wheelGroup = new THREE.Group(); wheelGroup.position.set(0, 17, 0);
    const rim  = new THREE.Mesh(new THREE.TorusGeometry(12, 0.45, 12, 36), sharedSilverMat); wheelGroup.add(rim);
    const podGeo  = new THREE.SphereGeometry(0.7, 10, 10);
    const podMat  = new THREE.MeshLambertMaterial({ color: '#38BDF8', emissive: '#0284C7', emissiveIntensity: 0.4 });
    const spokeGeo = new THREE.CylinderGeometry(0.08, 0.08, 23.6, 4);
    for (let a = 0; a < 6; a++) { const sp = new THREE.Mesh(spokeGeo, sharedSilverMat); sp.rotation.z = (a * Math.PI) / 6; wheelGroup.add(sp); }
    for (let c = 0; c < 12; c++) {
      const angle = (c * Math.PI * 2) / 12;
      const pod = new THREE.Mesh(podGeo, podMat);
      pod.position.set(Math.cos(angle) * 12, Math.sin(angle) * 12, 0);
      wheelGroup.add(pod);
    }
    ainGroup.add(wheelGroup);
    ainGroup.position.set(55, 0, 50);
    scene.add(ainGroup);

    // f) SPICE & GOLD SOUK BAZAAR
    const soukGroup = new THREE.Group();
    const awningMats = [
      new THREE.MeshLambertMaterial({ color: '#DC2626' }),
      new THREE.MeshLambertMaterial({ color: '#F59E0B' }),
      new THREE.MeshLambertMaterial({ color: '#10B981' }),
      new THREE.MeshLambertMaterial({ color: '#2563EB' }),
    ];
    const createStall = (sx: number, sz: number, mat: THREE.MeshLambertMaterial) => {
      const s = new THREE.Group();
      const counter = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.0, 2.0), sharedWoodMat); counter.position.y = 0.5; s.add(counter);
      const awning  = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.1, 2.6), mat); awning.position.set(0, 2.2, 0.2); awning.rotation.x = 0.15; s.add(awning);
      for (const px of [-1.7, 1.7]) { const p = new THREE.Mesh(postGeo, sharedWoodMat); p.position.set(px, 1.3, 1.2); s.add(p); }
      s.position.set(sx, 0, sz);
      return s;
    };
    soukGroup.add(createStall(-10, 24, awningMats[0]), createStall(-4, 24, awningMats[1]),
                  createStall(-10, 32, awningMats[2]), createStall(-4, 32, awningMats[3]));
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(8, 0.8, 1.2), sharedWoodMat); archTop.position.set(-7, 3.8, 19); soukGroup.add(archTop);
    scene.add(soukGroup);

    // g) BEDOUIN DESERT CAMP (100% Grounded Authentic Desert Majlis at x: -48, z: -55)
    const campGroup = new THREE.Group();

    // 1. Campsite Packed-Earth Clearing Base (flush at ground level y = 0.015)
    const campGround = new THREE.Mesh(
      new THREE.CircleGeometry(12.5, 28),
      new THREE.MeshLambertMaterial({ color: '#C27838' })
    );
    campGround.rotation.x = -Math.PI / 2;
    campGround.position.set(-48, 0.015, -55);
    campGround.receiveShadow = true;
    campGroup.add(campGround);

    // 2. Traditional Pitched Goat-Hair Tent (Beit al-Sha'ar)
    const tentRoofMat = new THREE.MeshLambertMaterial({ color: '#271B12' }); // Rich woven dark goat hair
    // Rear sloped canopy
    const rearRoof = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.14, 3.2), tentRoofMat);
    rearRoof.position.set(-48, 2.45, -58.0);
    rearRoof.rotation.x = -0.25;
    rearRoof.castShadow = true;
    // Front sloped canopy
    const frontRoof = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.14, 2.6), tentRoofMat);
    frontRoof.position.set(-48, 2.65, -55.4);
    frontRoof.rotation.x = 0.22;
    frontRoof.castShadow = true;
    // Center ridge beam
    const ridgeBeam = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.16, 0.16), sharedWoodMat);
    ridgeBeam.position.set(-48, 2.95, -56.7);
    ridgeBeam.castShadow = true;
    campGroup.add(rearRoof, frontRoof, ridgeBeam);

    // Tall center support poles (running from ground y = 0 up to ridge beam)
    const centerPoleGeo = new THREE.CylinderGeometry(0.11, 0.13, 2.95, 8);
    [-51.0, -45.0].forEach(px => {
      const pole = new THREE.Mesh(centerPoleGeo, sharedWoodMat);
      pole.position.set(px, 1.47, -56.7);
      pole.castShadow = true;
      campGroup.add(pole);
    });

    // Four eaves support poles (running from ground y = 0 up to tent eaves)
    const rearPoleGeo  = new THREE.CylinderGeometry(0.09, 0.11, 2.15, 6);
    const frontPoleGeo = new THREE.CylinderGeometry(0.09, 0.11, 2.45, 6);
    [-51.2, -44.8].forEach(px => {
      const rPole = new THREE.Mesh(rearPoleGeo, sharedWoodMat);
      rPole.position.set(px, 1.07, -59.3);
      rPole.castShadow = true;
      const fPole = new THREE.Mesh(frontPoleGeo, sharedWoodMat);
      fPole.position.set(px, 1.22, -54.3);
      fPole.castShadow = true;
      campGroup.add(rPole, fPole);
    });

    // Rear and side windbreak woven wool fabric walls
    const tentFabricMat = new THREE.MeshLambertMaterial({ color: '#7F1D1D' }); // Deep Bedouin maroon
    const rearWall = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.0, 0.1), tentFabricMat);
    rearWall.position.set(-48, 1.0, -59.3);
    rearWall.castShadow = true;
    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.0, 4.8), tentFabricMat);
    sideWall.position.set(-51.2, 1.0, -56.8);
    sideWall.castShadow = true;
    campGroup.add(rearWall, sideWall);

    // 3. Woven Arabian Floor Carpet & Majlis Seating
    const carpetMat = new THREE.MeshLambertMaterial({ color: '#991B1B' });
    const carpet = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.04, 4.4), carpetMat);
    carpet.position.set(-48, 0.03, -56.8);
    carpet.receiveShadow = true;
    const runnerMat = new THREE.MeshLambertMaterial({ color: '#B45309' });
    const runner = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.05, 3.8), runnerMat);
    runner.position.set(-48, 0.04, -56.8);
    runner.receiveShadow = true;
    campGroup.add(carpet, runner);

    // Plush Sadu embroidered floor cushions (Takia / Masnad)
    const cushionGeo = new THREE.BoxGeometry(1.4, 0.32, 0.65);
    const cushionMat = new THREE.MeshLambertMaterial({ color: '#DC2626' });
    // Rear row
    [-50.0, -48.0, -46.0].forEach(cx => {
      const c = new THREE.Mesh(cushionGeo, cushionMat);
      c.position.set(cx, 0.19, -58.5);
      campGroup.add(c);
    });
    // West & East side rows
    const sideCushionGeo = new THREE.BoxGeometry(0.65, 0.32, 1.3);
    [-57.5, -55.8].forEach(cz => {
      const cW = new THREE.Mesh(sideCushionGeo, cushionMat);
      cW.position.set(-50.2, 0.19, cz);
      const cE = new THREE.Mesh(sideCushionGeo, cushionMat);
      cE.position.set(-45.8, 0.19, cz);
      campGroup.add(cW, cE);
    });

    // 4. Carved Brass Coffee Table & Golden Dallah Pot
    const coffeeTable = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.72, 0.24, 14), new THREE.MeshLambertMaterial({ color: '#D97706' }));
    coffeeTable.position.set(-48, 0.14, -56.6);
    const dallah = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.2, 0.5, 8), sharedGoldMat);
    dallah.position.set(-48, 0.49, -56.6);
    const dallahSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.04, 0.28, 6), sharedGoldMat);
    dallahSpout.position.set(-48, 0.6, -56.4);
    dallahSpout.rotation.x = 0.5;
    const dallahLid = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 6), sharedGoldMat);
    dallahLid.position.set(-48, 0.82, -56.6);
    const cupMat = new THREE.MeshLambertMaterial({ color: '#F8FAFC' });
    const cup1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.09, 8), cupMat);
    cup1.position.set(-48.25, 0.29, -56.4);
    const cup2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.09, 8), cupMat);
    cup2.position.set(-47.75, 0.29, -56.4);
    campGroup.add(coffeeTable, dallah, dallahSpout, dallahLid, cup1, cup2);

    // 5. Traditional Stone Campfire Fire-pit (sitting firmly on the desert sand)
    const fireBase = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.22, 8, 16), sharedBuildingMat);
    fireBase.rotation.x = Math.PI / 2;
    fireBase.position.set(-48, 0.12, -51.8);
    const coals = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.08, 12),
      new THREE.MeshLambertMaterial({ color: '#1F2937', emissive: '#EA580C', emissiveIntensity: 0.8 })
    );
    coals.position.set(-48, 0.06, -51.8);
    const flameMesh = new THREE.Mesh(new THREE.ConeGeometry(0.44, 1.05, 7), new THREE.MeshBasicMaterial({ color: '#F97316' }));
    flameMesh.position.set(-48, 0.58, -51.8);
    campGroup.add(fireBase, coals, flameMesh);

    // 6. Wooden Camel Hitching Station & Feed Sacks
    const hitchPost1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 6), sharedWoodMat);
    hitchPost1.position.set(-42, 0.75, -53.5);
    const hitchPost2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 6), sharedWoodMat);
    hitchPost2.position.set(-42, 0.75, -56.5);
    const hitchBeam = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 3.4), sharedWoodMat);
    hitchBeam.position.set(-42, 1.35, -55.0);
    const sackMat = new THREE.MeshLambertMaterial({ color: '#CA8A04' });
    const sack1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7), sackMat);
    sack1.position.set(-42.4, 0.25, -54.2);
    const sack2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.65), sackMat);
    sack2.position.set(-42.4, 0.23, -55.8);
    campGroup.add(hitchPost1, hitchPost2, hitchBeam, sack1, sack2);

    // 7. Terracotta Water Amphoras (Al-Jahla)
    const amphoraMat = new THREE.MeshLambertMaterial({ color: '#B45309' });
    const jar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 0.65, 8), amphoraMat);
    jar1.position.set(-45.0, 0.33, -53.6);
    const jar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.28, 0.55, 8), amphoraMat);
    jar2.position.set(-44.4, 0.28, -53.2);
    campGroup.add(jar1, jar2);

    scene.add(campGroup);

    // h) MIRACLE OASIS & FOUNTAIN
    const oasisGroup = new THREE.Group();
    const fBase  = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 0.6, 24), sharedBuildingMat); fBase.position.set(50, 0.3, -35);
    const fTier  = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.4, 16), sharedBuildingMat); fTier.position.set(50, 1.2, -35);
    const fCent  = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.0, 8),  sharedBuildingMat); fCent.position.set(50, 1.5, -35);
    const fWater = new THREE.Mesh(new THREE.CircleGeometry(4.2, 24), new THREE.MeshLambertMaterial({ color: '#38BDF8' }));
    fWater.rotation.x = -Math.PI / 2; fWater.position.set(50, 0.58, -35);
    oasisGroup.add(fBase, fTier, fCent, fWater);
    const bArch1 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.5, 8, 20), new THREE.MeshLambertMaterial({ color: '#EC4899' })); bArch1.position.set(44, 2.8, -35); bArch1.rotation.y = Math.PI / 2;
    const bArch2 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.5, 8, 20), new THREE.MeshLambertMaterial({ color: '#FBBF24' })); bArch2.position.set(56, 2.8, -35); bArch2.rotation.y = Math.PI / 2;
    oasisGroup.add(bArch1, bArch2);
    scene.add(oasisGroup);

    // i) AL QASBA WATERFRONT CANAL DISTRICT
    const qasbaGroup = new THREE.Group();

    // 1. Turquoise Canal Water Channel (running East-West between x: -52 and -8 at z: 65)
    const qasbaWaterMat = new THREE.MeshLambertMaterial({ color: '#06B6D4', transparent: true, opacity: 0.88 });
    const qasbaWater = new THREE.Mesh(new THREE.PlaneGeometry(44, 12), qasbaWaterMat);
    qasbaWater.rotation.x = -Math.PI / 2;
    qasbaWater.position.set(-30, 0.05, 65);
    qasbaGroup.add(qasbaWater);

    // Stone quayside coping curbs along the canal edges
    const qQuayGeo = new THREE.BoxGeometry(44, 0.35, 1.2);
    const quayNorth = new THREE.Mesh(qQuayGeo, sharedBuildingMat); quayNorth.position.set(-30, 0.18, 58.5);
    const quaySouth = new THREE.Mesh(qQuayGeo, sharedBuildingMat); quaySouth.position.set(-30, 0.18, 71.5);
    qasbaGroup.add(quayNorth, quaySouth);

    // 2. North & South Waterfront Promenades (Paved pedestrian walkways)
    const promenadeMat = new THREE.MeshLambertMaterial({ color: '#F1F5F9' });
    const promNorth = new THREE.Mesh(new THREE.BoxGeometry(44, 0.25, 7.5), promenadeMat);
    promNorth.position.set(-30, 0.12, 54.5);
    promNorth.receiveShadow = true;
    const promSouth = new THREE.Mesh(new THREE.BoxGeometry(44, 0.25, 7.5), promenadeMat);
    promSouth.position.set(-30, 0.12, 75.5);
    promSouth.receiveShadow = true;
    qasbaGroup.add(promNorth, promSouth);

    // 3. Twin Venetian Arch Footbridges (West at x: -40, East at x: -20)
    const createQasbaBridge = (bx: number) => {
      const bg = new THREE.Group();
      const bSegs = 14;
      for (let s = 0; s <= bSegs; s++) {
        const prog = s / bSegs;
        const bz = 58 + prog * 14.0;
        const by = 0.25 + Math.sin(prog * Math.PI) * 2.0;
        const step = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 14.0 / bSegs + 0.1), sharedWoodMat);
        step.position.set(bx, by, bz);
        step.castShadow = true; step.receiveShadow = true;
        bg.add(step);

        // Railings
        if (s % 2 === 0) {
          for (const rx of [-1.75, 1.75]) {
            const rPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 6), sharedGoldMat);
            rPost.position.set(bx + rx, by + 0.6, bz);
            bg.add(rPost);
          }
        }
      }
      return bg;
    };
    qasbaGroup.add(createQasbaBridge(-40), createQasbaBridge(-20));

    // 4. Canal-side Outdoor Café Bistros (parasols & tables)
    const parasolColors = ['#DC2626', '#2563EB', '#F59E0B', '#10B981'];
    const cafePositions: [number, number, number][] = [
      [-46, 54.5, 0], [-34, 54.5, 1],
      [-46, 75.5, 2], [-34, 75.5, 3]
    ];
    cafePositions.forEach(([cx, cz, colorIdx]) => {
      const tbl = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.7, 10), sharedWoodMat);
      tbl.position.set(cx, 0.45, cz);
      const pPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 6), sharedGoldMat);
      pPole.position.set(cx, 1.4, cz);
      const pTop  = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.65, 8), new THREE.MeshLambertMaterial({ color: parasolColors[colorIdx] }));
      pTop.position.set(cx, 2.5, cz);
      qasbaGroup.add(tbl, pPole, pTop);
    });

    // 5. Al Qasba Moorish Cultural Pavilion (facing the canal at x: -30, z: 81)
    const pavBase = new THREE.Mesh(new THREE.BoxGeometry(14, 4.6, 7.5), sharedBuildingMat);
    pavBase.position.set(-30, 2.3, 81.5);
    pavBase.castShadow = true; pavBase.receiveShadow = true;
    for (const ax of [-4.0, 0, 4.0]) {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.25, 8, 16), sharedGoldMat);
      arch.position.set(-30 + ax, 3.0, 77.8);
      qasbaGroup.add(arch);
    }
    const pavDome = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 16, 12),
      new THREE.MeshLambertMaterial({ color: '#06B6D4' })
    );
    pavDome.position.set(-30, 5.8, 81.5);
    pavDome.castShadow = true;
    qasbaGroup.add(pavBase, pavDome);

    // 6. Moored Traditional Abras in Canal Water
    const createMooredAbra = (mx: number, mz: number, rotY: number) => {
      const ag = new THREE.Group();
      const hull = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.45, 5.0), sharedWoodMat); hull.position.y = 0.22; ag.add(hull);
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 4.0), sharedGoldMat); canopy.position.y = 1.25; ag.add(canopy);
      ag.position.set(mx, 0, mz);
      ag.rotation.y = rotY;
      return ag;
    };
    qasbaGroup.add(createMooredAbra(-32, 63.5, 0.1), createMooredAbra(-26, 66.5, -0.15));

    scene.add(qasbaGroup);

    // 13. AL FAHIDI HISTORIC DISTRICT
    const obsBase  = new THREE.Mesh(new THREE.BoxGeometry(10, 5.5, 12), sharedBuildingMat); obsBase.position.set(-16, 2.75, -18); obsBase.castShadow = true; obsBase.receiveShadow = true; scene.add(obsBase);
    const obsDeck  = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.3, 11.6), sharedWoodMat);  obsDeck.position.set(-16, 5.65, -18); obsDeck.receiveShadow = true; scene.add(obsDeck);
    const rampLen  = 7.0;
    const ramp     = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(rampLen, 5.5), 0.4, 2.4), sharedWoodMat);
    ramp.position.set(-12.5, 2.75, -18); ramp.rotation.z = Math.atan2(5.5, rampLen); ramp.castShadow = true; scene.add(ramp);

    const createHouse = (x: number, z: number, w: number, h: number, d: number) => {
      const g = new THREE.Group();
      const main = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), sharedBuildingMat); main.position.y = h / 2; main.castShadow = true; main.receiveShadow = true; g.add(main);
      const tow  = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 2.5), sharedBuildingMat); tow.position.set(w / 3, h + 1.75, -d / 3); tow.castShadow = true; g.add(tow);
      g.position.set(x, 0, z); return g;
    };
    scene.add(createHouse(-18, 8, 11, 6.0, 14), createHouse(-6, -26, 8, 4.8, 9),
               createHouse(-2, 22, 10, 5.2, 11), createHouse(-28, -6, 12, 6.5, 12));

    // 14. SPEED BOOST PADS (cyan)
    const boostPadDefs = [
      { id: 'bp0', x: -10, z:   0 },
      { id: 'bp1', x:  26, z:   0 },
      { id: 'bp2', x:  32, z: -30 },
      { id: 'bp3', x:  32, z:  35 },
    ];
    const boostPadMat = new THREE.MeshLambertMaterial({ color: '#06B6D4', emissive: '#0891B2', emissiveIntensity: 0.8 });
    boostPadDefs.forEach(pad => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.1, 4.5), boostPadMat);
      m.position.set(pad.x, 0.08, pad.z); scene.add(m);
    });

    // 15. TRAMPOLINE BOUNCE PADS (amber)
    const bouncePadDefs = [
      { x: -8, z:  12 },
      { x: 32, z: -15 },
      { x: 50, z: -20 },
    ];
    const bouncePadMat = new THREE.MeshLambertMaterial({ color: '#F59E0B', emissive: '#D97706', emissiveIntensity: 0.7 });
    bouncePadDefs.forEach(pad => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.25, 20), bouncePadMat);
      m.position.set(pad.x, 0.15, pad.z); scene.add(m);
    });

    // 16. SECRET MYSTERY CHESTS
    const chestDefs = [
      { id: 'chest-rooftop', x: -16, y: 5.8, z: -16, opened: false },
      { id: 'chest-burj',    x:  34, y: 0.3, z: -62, opened: false },
      { id: 'chest-oasis',   x:  53, y: 0.3, z: -38, opened: false },
    ];
    const chestMeshes: { [id: string]: { group: THREE.Group; lid: THREE.Mesh } } = {};
    chestDefs.forEach(ch => {
      const cg   = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 1.0), sharedWoodMat); trunk.position.y = 0.4; trunk.castShadow = true; cg.add(trunk);
      const lid   = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.3, 1.05), new THREE.MeshLambertMaterial({ color: '#FBBF24', emissive: '#F59E0B', emissiveIntensity: 0.4 }));
      lid.position.set(0, 0.95, -0.45); lid.castShadow = true; cg.add(lid);
      cg.position.set(ch.x, ch.y, ch.z);
      scene.add(cg);
      chestMeshes[ch.id] = { group: cg, lid };
    });

    // 17. PALM TREES (Optimized — zero shadow overhead)
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 4.5, 6);
    const leafGeo  = new THREE.ConeGeometry(0.9, 2.2, 4);
    const createPalm = (x: number, z: number) => {
      const g = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, sharedWoodMat); trunk.position.y = 2.25; g.add(trunk);
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
        const leaf = new THREE.Mesh(leafGeo, sharedFoliageMat);
        leaf.position.set(Math.cos(angle) * 0.9, 4.3, Math.sin(angle) * 0.9);
        leaf.rotation.x = Math.PI / 3; leaf.rotation.y = angle;
        g.add(leaf);
      }
      g.position.set(x, 0, z);
      return g;
    };
    const palmPositions = [
      [6, -8], [5, 12], [-8, -10], [-10, 16], [2, -2],
      [45, -15], [45, 10], [38, -35], [38, 30], [48, -45], [54, -42], [-54, -48], [-44, -62]
    ];
    palmPositions.forEach(([px, pz]) => scene.add(createPalm(px, pz)));

    // 18. GPS WAYPOINT BEACON
    const wpGroup = new THREE.Group();
    const beamMat = new THREE.MeshBasicMaterial({ color: '#38BDF8', transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    const beamMesh   = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 70, 12), beamMat);
    beamMesh.position.y = 35; wpGroup.add(beamMesh);
    const diamondMesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.6), new THREE.MeshBasicMaterial({ color: '#FBBF24' }));
    diamondMesh.position.y = 12; wpGroup.add(diamondMesh);
    wpGroup.visible = false;
    scene.add(wpGroup);

    // 19. PLAYER CHARACTER
    const createCharacterRig = (primaryColor: string, isMain: boolean) => {
      const rg = new THREE.Group();
      const bodyMat = new THREE.MeshLambertMaterial({ color: primaryColor });
      const skinMat = new THREE.MeshLambertMaterial({ color: '#FDE047' });
      const torso  = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.1, 4), bodyMat); torso.rotation.y = Math.PI / 4; torso.position.y = 0.85; torso.castShadow = true; rg.add(torso);
      const head   = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), skinMat); head.position.y = 1.6; head.castShadow = true; rg.add(head);
      const hat    = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 12), sharedGoldMat); hat.position.y = 1.95; hat.castShadow = true; rg.add(hat);
      if (isMain) {
        const pack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.35), new THREE.MeshLambertMaterial({ color: '#FF5722' })); pack.position.set(0, 0.9, -0.4); pack.castShadow = true; rg.add(pack);
      }
      const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 6);
      const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.8, 6);
      const lArmG  = new THREE.Group(); lArmG.position.set( 0.45, 1.3, 0); const lArmM = new THREE.Mesh(armGeo, skinMat); lArmM.position.y = -0.35; lArmG.add(lArmM); rg.add(lArmG);
      const rArmG  = new THREE.Group(); rArmG.position.set(-0.45, 1.3, 0); const rArmM = new THREE.Mesh(armGeo, skinMat); rArmM.position.y = -0.35; rArmG.add(rArmM); rg.add(rArmG);
      const lLegG  = new THREE.Group(); lLegG.position.set( 0.2,  0.8, 0); const lLegM = new THREE.Mesh(legGeo, bodyMat); lLegM.position.y = -0.4; lLegG.add(lLegM); rg.add(lLegG);
      const rLegG  = new THREE.Group(); rLegG.position.set(-0.2,  0.8, 0); const rLegM = new THREE.Mesh(legGeo, bodyMat); rLegM.position.y = -0.4; rLegG.add(rLegM); rg.add(rLegG);
      return { rg, lArmG, rArmG, lLegG, rLegG };
    };

    const playerGroup = new THREE.Group();
    const pChar = createCharacterRig('#1B3FFF', true);
    playerGroup.add(pChar.rg);
    playerGroup.position.set(0, 0, 0);
    scene.add(playerGroup);

    remotePlayersRef.current.forEach(rp => {
      const rg = new THREE.Group();
      const ch = createCharacterRig(rp.avatarColor, false);
      rg.add(ch.rg);
      const s = (rp as any).scale || 1.0;
      rg.scale.set(s, s, s);
      rg.position.set(rp.x, rp.y || 0, rp.z);
      rg.rotation.y = rp.rotationY || 0;

      // Overhead Comic Name Badge (Canvas Sprite Billboard)
      const tagCanvas = document.createElement('canvas');
      tagCanvas.width = 256;
      tagCanvas.height = 64;
      const ctx = tagCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#111827';
        if (ctx.roundRect) {
          ctx.roundRect(8, 8, 240, 48, 12);
        } else {
          ctx.fillRect(8, 8, 240, 48);
        }
        ctx.fill();
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.font = 'bold 20px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(rp.displayName, 128, 32);
      }
      const tagTex = new THREE.CanvasTexture(tagCanvas);
      const tagMat = new THREE.SpriteMaterial({ map: tagTex, transparent: true });
      const tagSprite = new THREE.Sprite(tagMat);
      tagSprite.position.y = 2.45;
      tagSprite.scale.set(2.2, 0.55, 1);
      rg.add(tagSprite);

      scene.add(rg);
    });

    // 19b. COMIC DUST PUFF PARTICLES (POOLED MESHES)
    const maxPuffs = 12;
    const dustGeo = new THREE.RingGeometry(0.08, 0.25, 8);
    const dustMat = new THREE.MeshBasicMaterial({ color: '#E8D2A6', transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    const dustPool: { mesh: THREE.Mesh; life: number; maxLife: number; scale: number }[] = [];
    for (let i = 0; i < maxPuffs; i++) {
      const dm = new THREE.Mesh(dustGeo, dustMat.clone());
      dm.rotation.x = -Math.PI / 2;
      dm.visible = false;
      scene.add(dm);
      dustPool.push({ mesh: dm, life: 0, maxLife: 0.45, scale: 1 });
    }
    let lastPuffSpawn = 0;

    // 20. COLLECTIBLE 3D MESHES
    const collectibleMeshes: { [id: string]: THREE.Group } = {};
    const sharedRingMat = new THREE.MeshLambertMaterial({
      color: '#FBBF24',
      emissive: '#F59E0B',
      emissiveIntensity: 0.5
    });
    const ringGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 12);

    INITIAL_VG_WORLD_COLLECTIBLES.forEach(item => {
      const cg = new THREE.Group();
      let mesh: THREE.Mesh;
      if (item.type === 'pearl') {
        mesh = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), new THREE.MeshLambertMaterial({ color: '#E0F2FE', emissive: '#38BDF8', emissiveIntensity: 0.25 }));
      } else if (item.type === 'coin') {
        mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 12), new THREE.MeshLambertMaterial({ color: '#FBBF24', emissive: '#D97706', emissiveIntensity: 0.35 }));
        mesh.rotation.x = Math.PI / 2;
      } else {
        mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38), new THREE.MeshLambertMaterial({ color: item.color, emissive: item.color, emissiveIntensity: 0.2 }));
      }
      mesh.castShadow = true; cg.add(mesh);
      const ringMesh = new THREE.Mesh(ringGeo, sharedRingMat);
      ringMesh.position.y = 0.03; cg.add(ringMesh);
      cg.position.set(item.x, item.y, item.z);
      scene.add(cg);
      collectibleMeshes[item.id] = cg;
    });

    // 21. CAMERA DRAG — pointer events on canvas only
    //     Exclude bottom-left 200×200 area (joystick zone) on mobile to prevent conflict
    let cameraAngle = Math.PI * 0.75;
    let cameraPitch = 0.45;
    let activeCamPointerId: number | null = null;
    let prevPtrX = 0;
    let prevPtrY = 0;
    const canvas = renderer.domElement;

    const onPtrDown = (e: PointerEvent) => {
      if (activeCamPointerId !== null) return;
      // Exclude bottom-left 200×200px (joystick) and bottom-right 160×180px (jump/dash buttons)
      const rect = canvas.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      if (localX < 200 && localY > rect.height - 200) return;
      if (localX > rect.width - 160 && localY > rect.height - 180) return;
      activeCamPointerId = e.pointerId;
      prevPtrX = e.clientX; prevPtrY = e.clientY;
      try { canvas.setPointerCapture(e.pointerId); } catch {}
    };
    const onPtrMove = (e: PointerEvent) => {
      if (e.pointerId !== activeCamPointerId) return;
      cameraAngle -= (e.clientX - prevPtrX) * 0.007;
      cameraPitch  = Math.max(0.18, Math.min(1.15, cameraPitch + (e.clientY - prevPtrY) * 0.005));
      prevPtrX = e.clientX; prevPtrY = e.clientY;
    };
    const onPtrUp = (e: PointerEvent) => {
      if (e.pointerId !== activeCamPointerId) return;
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
      activeCamPointerId = null;
    };
    canvas.addEventListener('pointerdown',   onPtrDown);
    canvas.addEventListener('pointermove',   onPtrMove);
    canvas.addEventListener('pointerup',     onPtrUp);
    canvas.addEventListener('pointercancel', onPtrUp);

    // Keyboard controls
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.code === 'Space') { e.preventDefault(); jumpRequestedAtRef.current = Date.now(); }
      if (e.key === 'Shift') { speedBoostExpiresRef.current = Date.now() + 3500; playSoundEffect('boost'); showBadge('TURBO SPRINT!', '⚡'); }
    };
    const onKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || (window.innerHeight - 130);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 22. HEIGHT COLLISION MAP (Static data outside loop to eliminate GC allocations)
    const WORLD_DUNES = [
      { cx: -62, cz: -78, rx: 22, rz: 16, h: 5.5 },
      { cx: -67, cz: -46, rx: 16, rz: 24, h: 5.0 },
      { cx: -38, cz: -84, rx: 18, rz: 14, h: 4.6 },
      { cx: -66, cz: -18, rx: 15, rz: 20, h: 4.2 },
      { cx: -72, cz: -88, rx: 20, rz: 20, h: 6.2 },
    ];
    const getGroundHeight = (px: number, pz: number): number => {
      // Downtown Spire Promenade Plaza
      if (px >= 5 && px <= 51 && pz >= -77 && pz <= -36) {
        return 0.2;
      }
      // Grand Arch Bridge
      if (px >= 7.5 && px <= 44.5 && Math.abs(pz) <= 4.2) {
        const t = (px - 7.5) / 37.0;
        return 0.4 + Math.sin(t * Math.PI) * 3.2;
      }
      // Al Qasba West Venetian Arch Footbridge (x: -40, z in [58, 72])
      if (Math.abs(px - (-40)) <= 2.2 && pz >= 58 && pz <= 72) {
        const t = (pz - 58) / 14.0;
        return 0.25 + Math.sin(t * Math.PI) * 2.0;
      }
      // Al Qasba East Venetian Arch Footbridge (x: -20, z in [58, 72])
      if (Math.abs(px - (-20)) <= 2.2 && pz >= 58 && pz <= 72) {
        const t = (pz - 58) / 14.0;
        return 0.25 + Math.sin(t * Math.PI) * 2.0;
      }
      // Al Qasba Waterfront Promenades (North & South)
      if (px >= -52 && px <= -8 && ((pz >= 50 && pz <= 58.5) || (pz >= 71.5 && pz <= 84))) {
        return 0.2;
      }
      // Wind-Tower Rooftop Observatory deck
      if (px >= -21 && px <= -11 && pz >= -24 && pz <= -12) return 5.65;
      // Observatory ramp
      if (px >= -16 && px <= -9 && Math.abs(pz - (-18)) <= 1.4) {
        const prog = (-9 - px) / 7.0;
        return Math.max(0, Math.min(5.65, prog * 5.65));
      }
      // Western & Northern Horizon Sand Dunes climbing physics (smooth cone slope matching visual meshes)
      for (let i = 0; i < WORLD_DUNES.length; i++) {
        const d = WORLD_DUNES[i];
        const nx = (px - d.cx) / d.rx;
        const nz = (pz - d.cz) / d.rz;
        const distSq = nx * nx + nz * nz;
        if (distSq < 1.0) {
          const duneH = (1 - Math.sqrt(distSq)) * d.h;
          if (duneH > 0.05) return duneH;
        }
      }
      return 0;
    };

    // 23. GAME LOOP
    let animFrameId: number;
    const clock = new THREE.Clock();

    const velocity = new THREE.Vector3();
    let playerY    = 0;
    let playerVelY = 0;
    let isGrounded = true;
    const gravity     = -28.0;
    const baseSpeed   = 10.5;
    const accelRate   = baseSpeed / 0.12;
    const decelRate   = baseSpeed / 0.08;
    const camDist     = 7.5;

    // Place initial camera
    camera.position.set(
      Math.sin(cameraAngle) * camDist,
      Math.sin(cameraPitch) * camDist + 1.2,
      Math.cos(cameraAngle) * camDist
    );

    // Track discovered landmarks locally to avoid stale closure issues
    const discoveredSet = new Set<string>();
    let lastCoordsUpdate = 0;
    let lastWpUpdate = 0;

    const targetVel = new THREE.Vector3();
    const velDiff   = new THREE.Vector3();

    // SOLID OBSTACLES (Exact Coordinates for all landmarks, buildings, houses, and market stalls)
    const SOLID_CYLINDERS = [
      { cx: 28,  cz: -55, r: 6.2 }, // Burj Khalifa Downtown Base
      { cx: 40,  cz:  25, r: 5.8 }, // Burj Al Arab Tower & Spinnaker Sail
      { cx: -35, cz:  15, r: 8.0 }, // Museum of the Future Torus Ring
      { cx: 55,  cz:  50, r: 5.2 }, // Ain Dubai Base & Support Legs
      { cx: -48, cz: -51.8, r: 1.1 }, // Bedouin Desert Camp Campfire Stone Ring
      { cx: 50,  cz: -35, r: 5.0 }, // Miracle Oasis Fountain Basin
    ];

    const SOLID_BOXES = [
      // Dubai Frame: West Pillar & East Pillar (open passage in between!)
      { minX: -33.5, maxX: -30.5, minZ: -36.5, maxZ: -33.5 },
      { minX: -19.5, maxX: -16.5, minZ: -36.5, maxZ: -33.5 },

      // Al Fahidi 4 Historic Houses
      { minX: -24.0, maxX: -12.0, minZ:   0.5, maxZ:  15.5 }, // House 1 (-18, 8)
      { minX: -10.5, maxX:  -1.5, minZ: -31.0, maxZ: -21.0 }, // House 2 (-6, -26)
      { minX:  -7.5, maxX:   3.5, minZ:  16.0, maxZ:  28.0 }, // House 3 (-2, 22)
      { minX: -34.5, maxX: -21.5, minZ: -12.5, maxZ:   0.5 }, // House 4 (-28, -6)

      // Al Fahidi Observatory Base Walls (leaves ramp corridor open at z: -19.5 to -16.5)
      { minX: -21.5, maxX: -16.0, minZ: -24.5, maxZ: -11.5 }, // West section
      { minX: -16.0, maxX: -10.5, minZ: -24.5, maxZ: -19.5 }, // North-East wall
      { minX: -16.0, maxX: -10.5, minZ: -16.5, maxZ: -11.5 }, // South-East wall

      // Spice & Gold Souk Bazaar Stalls
      { minX: -12.5, maxX:  -1.5, minZ:  22.5, maxZ:  25.5 }, // North stall row
      { minX: -12.5, maxX:  -1.5, minZ:  30.5, maxZ:  33.5 }, // South stall row

      // Al Qasba Moorish Cultural Pavilion
      { minX: -37.0, maxX: -23.0, minZ:  78.0, maxZ:  85.0 },

      // Bedouin Desert Camp Tent Walls (rear & west windbreak — front majlis entrance open!)
      { minX: -51.5, maxX: -44.5, minZ: -59.8, maxZ: -58.8 }, // Rear wall
      { minX: -51.6, maxX: -50.6, minZ: -59.5, maxZ: -54.0 }, // West wall
    ];

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.033);
      const time  = clock.getElapsedTime();
      const now   = Date.now();

      // TELEPORT — consume queue atomically
      if (teleportTargetRef.current) {
        const tgt = teleportTargetRef.current;
        teleportTargetRef.current = null;
        playerGroup.position.set(tgt.x, tgt.y + 0.8, tgt.z);
        velocity.set(0, 0, 0);
        playerY = tgt.y; playerVelY = 0; isGrounded = true;
        playSoundEffect('teleport');
        showBadge(`TELEPORTED TO ${tgt.landmarkName.toUpperCase()}!`, '🚀');
      }

      // SPEED BOOST — only update React state when value actually changes
      const isBoosting = now < speedBoostExpiresRef.current;
      if (isBoosting !== speedBoostActiveRef.current) {
        speedBoostActiveRef.current = isBoosting;
        setSpeedBoostActive(isBoosting);
      }
      const currentMaxSpeed = isBoosting ? 18.0 : baseSpeed;

      // MOVEMENT INPUT
      const joyX = moveVectorRef.current.x;
      const joyY = moveVectorRef.current.y;
      let keyX = 0, keyY = 0;
      if (keysPressed.current['w'] || keysPressed.current['arrowup'])    keyY += 1;
      if (keysPressed.current['s'] || keysPressed.current['arrowdown'])  keyY -= 1;
      if (keysPressed.current['a'] || keysPressed.current['arrowleft'])  keyX -= 1;
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) keyX += 1;

      let inputX = joyX + keyX;
      let inputY = joyY + keyY;
      const inputLen = Math.hypot(inputX, inputY);

      if (inputLen > 0.05) {
        const normX = inputX / Math.max(1, inputLen);
        const normY = inputY / Math.max(1, inputLen);
        const fwdX =  -Math.sin(cameraAngle); const fwdZ  = -Math.cos(cameraAngle);
        const rgtX =   Math.cos(cameraAngle); const rgtZ  = -Math.sin(cameraAngle);
        const worldX = normX * rgtX + normY * fwdX;
        const worldZ = normX * rgtZ + normY * fwdZ;
        targetVel.set(worldX, 0, worldZ).multiplyScalar(currentMaxSpeed * Math.min(1, inputLen));
      } else {
        targetVel.set(0, 0, 0);
      }

      // Smooth horizontal velocity (reusing vectors to avoid GC pressure)
      const rate = targetVel.lengthSq() > 0 ? accelRate : decelRate;
      velDiff.copy(targetVel).sub(velocity);
      const diffLen = velDiff.length();
      if (diffLen <= rate * delta) {
        velocity.copy(targetVel);
      } else {
        velocity.addScaledVector(velDiff.divideScalar(diffLen), rate * delta);
      }
      playerGroup.position.addScaledVector(velocity, delta);

      // Map boundaries
      playerGroup.position.x = Math.max(-70, Math.min(75, playerGroup.position.x));
      playerGroup.position.z = Math.max(-95, Math.min(95, playerGroup.position.z));

      // Water boundaries:
      // 1. Khor Dubai canal waterway (z: -35.5 to 40.5)
      const inCreekWater = playerGroup.position.x > 8.8 && playerGroup.position.x < 43.2 && playerGroup.position.z >= -35.5 && playerGroup.position.z <= 40.5;
      const onBridge     = Math.abs(playerGroup.position.z) <= 4.8;
      const onBaaIsland  = playerGroup.position.x >= 28 && playerGroup.position.z >= 12 && playerGroup.position.z <= 38;
      if (inCreekWater && !onBridge && !onBaaIsland) {
        if (playerGroup.position.x < 26) {
          playerGroup.position.x = 8.6;
          velocity.x = 0;
        } else {
          playerGroup.position.x = 43.4;
          velocity.x = 0;
        }
      }

      // 2. Al Qasba Waterfront Canal (z: 59.2 to 70.8, x: -52 to -8)
      const inQasbaWater = playerGroup.position.x >= -52 && playerGroup.position.x <= -8 && playerGroup.position.z > 59.2 && playerGroup.position.z < 70.8;
      const onQasbaBridge = (Math.abs(playerGroup.position.x - (-40)) <= 2.2 || Math.abs(playerGroup.position.x - (-20)) <= 2.2) && playerGroup.position.z >= 58 && playerGroup.position.z <= 72;
      if (inQasbaWater && !onQasbaBridge) {
        if (playerGroup.position.z < 65) {
          playerGroup.position.z = 58.8;
          velocity.z = 0;
        } else {
          playerGroup.position.z = 71.2;
          velocity.z = 0;
        }
      }

      // SOLID OBSTACLES COLLISION RESOLVER (2-iteration solver guarantees zero building phasing)
      const pRadius = 0.6;
      for (let iter = 0; iter < 2; iter++) {
        // Cylinders (Burj Khalifa, Burj Al Arab, MOTF, Ain Dubai, Desert Camp, Oasis)
        for (let i = 0; i < SOLID_CYLINDERS.length; i++) {
          const obs = SOLID_CYLINDERS[i];
          const dx = playerGroup.position.x - obs.cx;
          const dz = playerGroup.position.z - obs.cz;
          const distSq = dx * dx + dz * dz;
          const minDist = obs.r + pRadius;
          if (distSq < minDist * minDist && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const overlap = minDist - dist;
            const nx = dx / dist;
            const nz = dz / dist;
            playerGroup.position.x += nx * overlap;
            playerGroup.position.z += nz * overlap;
            const dot = velocity.x * nx + velocity.z * nz;
            if (dot < 0) {
              velocity.x -= dot * nx;
              velocity.z -= dot * nz;
            }
          }
        }

        // Box Colliders (Dubai Frame pillars, 4 Al Fahidi houses, Souk stalls, Observatory base)
        if (playerY < 4.5) {
          for (let i = 0; i < SOLID_BOXES.length; i++) {
            const b = SOLID_BOXES[i];
            const px = playerGroup.position.x;
            const pz = playerGroup.position.z;
            if (
              px > b.minX - pRadius &&
              px < b.maxX + pRadius &&
              pz > b.minZ - pRadius &&
              pz < b.maxZ + pRadius
            ) {
              const dLeft   = px - (b.minX - pRadius);
              const dRight  = (b.maxX + pRadius) - px;
              const dTop    = pz - (b.minZ - pRadius);
              const dBottom = (b.maxZ + pRadius) - pz;
              const minPen = Math.min(dLeft, dRight, dTop, dBottom);
              if (minPen === dLeft) {
                playerGroup.position.x = b.minX - pRadius;
                if (velocity.x > 0) velocity.x = 0;
              } else if (minPen === dRight) {
                playerGroup.position.x = b.maxX + pRadius;
                if (velocity.x < 0) velocity.x = 0;
              } else if (minPen === dTop) {
                playerGroup.position.z = b.minZ - pRadius;
                if (velocity.z > 0) velocity.z = 0;
              } else {
                playerGroup.position.z = b.maxZ + pRadius;
                if (velocity.z < 0) velocity.z = 0;
              }
            }
          }
        }
      }

      // VERTICAL PHYSICS
      const groundY = getGroundHeight(playerGroup.position.x, playerGroup.position.z);

      // Jump — 240ms buffer window
      const wantsJump = (now - jumpRequestedAtRef.current) < 240;
      if (wantsJump && (isGrounded || Math.abs(playerY - groundY) < 0.55)) {
        jumpRequestedAtRef.current = 0;
        playerVelY = 12.8;
        isGrounded = false;
        playSoundEffect('jump');
      }

      if (!isGrounded) {
        playerVelY += gravity * delta;
        playerY    += playerVelY * delta;
        if (playerY <= groundY) {
          playerY = groundY;
          playerVelY = 0;
          isGrounded = true;
        }
      } else {
        // Smooth ground tracking — transition into falling if walked off elevated bridge/roof
        if (playerY > groundY + 0.35) {
          isGrounded = false;
        } else {
          playerY = THREE.MathUtils.lerp(playerY, groundY, 0.38);
        }
      }
      if (playerY < groundY - 0.2) {
        playerY = groundY;
        playerVelY = 0;
        isGrounded = true;
      }
      playerGroup.position.y = playerY;

      // CHARACTER ANIMATION
      const spd = velocity.length();
      if (spd > 0.1) {
        playerGroup.rotation.y = Math.atan2(velocity.x, velocity.z);
        const animSpeed = isBoosting ? 25 : 16;
        const bob   = Math.abs(Math.sin(time * animSpeed)) * 0.12 * (spd / currentMaxSpeed);
        const swing = Math.sin(time * animSpeed) * 0.65;
        pChar.rg.position.y = bob;
        pChar.lArmG.rotation.x =  swing; pChar.rArmG.rotation.x = -swing;
        pChar.lLegG.rotation.x = -swing; pChar.rLegG.rotation.x =  swing;

        // Spawn comic dust puffs when running or turbo sprinting
        if (spd > 2.0 && isGrounded && (now - lastPuffSpawn > (isBoosting ? 85 : 150))) {
          lastPuffSpawn = now;
          let puff: typeof dustPool[0] | undefined;
          for (let i = 0; i < maxPuffs; i++) {
            if (dustPool[i].life <= 0) { puff = dustPool[i]; break; }
          }
          if (puff) {
            puff.mesh.position.set(
              playerGroup.position.x - velocity.x * 0.08 + (Math.random() - 0.5) * 0.25,
              playerY + 0.04,
              playerGroup.position.z - velocity.z * 0.08 + (Math.random() - 0.5) * 0.25
            );
            puff.scale = 1;
            puff.mesh.scale.set(1, 1, 1);
            (puff.mesh.material as THREE.MeshBasicMaterial).opacity = 0.65;
            puff.mesh.visible = true;
            puff.life = puff.maxLife;
          }
        }
      } else {
        pChar.rg.position.y   = 0;
        pChar.lArmG.rotation.x = 0; pChar.rArmG.rotation.x = 0;
        pChar.lLegG.rotation.x = 0; pChar.rLegG.rotation.x = 0;
      }

      // Update dust puff particle physics (indexed loop — zero garbage collection)
      for (let i = 0; i < maxPuffs; i++) {
        const p = dustPool[i];
        if (p.life > 0) {
          p.life -= delta;
          p.scale += delta * 2.6;
          p.mesh.scale.set(p.scale, p.scale, 1);
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (p.life / p.maxLife) * 0.65);
          if (p.life <= 0) p.mesh.visible = false;
        }
      }

      // SMOOTH CAMERA
      targetCameraPos.x = playerGroup.position.x + Math.sin(cameraAngle) * Math.cos(cameraPitch) * camDist;
      targetCameraPos.y = playerGroup.position.y + Math.sin(cameraPitch) * camDist + 1.2;
      targetCameraPos.z = playerGroup.position.z + Math.cos(cameraAngle) * Math.cos(cameraPitch) * camDist;
      camera.position.lerp(targetCameraPos, 0.1);
      camera.lookAt(playerGroup.position.x, playerGroup.position.y + 1.2, playerGroup.position.z);

      // WORLD ANIMATIONS
      wheelGroup.rotation.z += 0.22 * delta;
      (bkBeacon.material as THREE.MeshBasicMaterial).color.set(Math.sin(time * 5) > 0 ? '#EF4444' : '#1E1B4B');
      creekMat.opacity = 0.86 + Math.sin(time * 2) * 0.05;
      abra1.position.y = Math.sin(time * 2) * 0.08;     abra1.rotation.z = Math.sin(time * 1.5) * 0.04;
      abra2.position.y = Math.sin(time * 2 + 1) * 0.08; abra2.rotation.z = Math.sin(time * 1.5 + 1) * 0.04;
      flameMesh.position.y = 0.58 + Math.sin(time * 12) * 0.06; // campfire flicker grounded on coals

      // Star twinkling at night
      if (starMat.opacity > 0) {
        starMat.size = 0.6 + Math.sin(time * 3) * 0.15;
      }

      // GPS WAYPOINT BEACON
      if (activeWaypointRef.current) {
        const wp = activeWaypointRef.current;
        wpGroup.visible = true;
        wpGroup.position.set(wp.coords.x, 0, wp.coords.z);
        diamondMesh.rotation.y += 2.8 * delta;
        diamondMesh.position.y = 12 + Math.sin(time * 3) * 1.5;
        beamMat.opacity = 0.35 + Math.sin(time * 4) * 0.15;
        const distToWp = Math.round(Math.hypot(playerGroup.position.x - wp.coords.x, playerGroup.position.z - wp.coords.z));
        if (Math.abs(distToWp - lastWaypointDistRef.current) >= 2 && (now - lastWpUpdate > 350)) {
          lastWpUpdate = now;
          lastWaypointDistRef.current = distToWp;
          setWaypointDistance(distToWp);
        }
      } else {
        wpGroup.visible = false;
      }

      // LANDMARK DISCOVERY (+150 XP each, once) — skip loop if all discovered
      if (discoveredSet.size < WORLD_LANDMARKS.length) {
        for (let i = 0; i < WORLD_LANDMARKS.length; i++) {
          const lm = WORLD_LANDMARKS[i];
          if (discoveredSet.has(lm.id)) continue;
          const d = Math.hypot(playerGroup.position.x - lm.coords.x, playerGroup.position.z - lm.coords.z);
          if (d <= 9.5) {
            discoveredSet.add(lm.id);
            playSoundEffect('chest');
            showBadge(`DISCOVERED: ${lm.name.toUpperCase()}!`, lm.emoji || '📍');
            scoreRef.current += 150;
            setScore(scoreRef.current);
            setDiscoveredLandmarks(prev => [...prev, lm.id]);
            if (onScoreUpdateRef.current) onScoreUpdateRef.current(scoreRef.current, collectedIdsRef.current.size);
          }
        }
      }

      // SPEED BOOST PADS — indexed loop with per-pad cooldown (zero GC)
      for (let i = 0; i < boostPadDefs.length; i++) {
        const pad = boostPadDefs[i];
        const d = Math.hypot(playerGroup.position.x - pad.x, playerGroup.position.z - pad.z);
        if (d <= 2.2 && !isBoosting && (now - (boostPadCooldownRef.current[pad.id] || 0)) > 3000) {
          boostPadCooldownRef.current[pad.id] = now;
          speedBoostExpiresRef.current = now + 3200;
          playSoundEffect('boost');
          showBadge('⚡ SPEED SURGE!', '⚡');
        }
      }

      // BOUNCE PADS (zero GC)
      for (let i = 0; i < bouncePadDefs.length; i++) {
        const pad = bouncePadDefs[i];
        const d = Math.hypot(playerGroup.position.x - pad.x, playerGroup.position.z - pad.z);
        if (d <= 2.0 && isGrounded) {
          playerVelY = 17.5; isGrounded = false;
          playSoundEffect('bounce');
          showBadge('SUPER BOUNCE!', '🦘');
        }
      }

      // MYSTERY CHESTS (zero GC)
      for (let i = 0; i < chestDefs.length; i++) {
        const ch = chestDefs[i];
        if (!ch.opened) {
          const d = Math.hypot(playerGroup.position.x - ch.x, playerGroup.position.z - ch.z);
          if (d <= 2.2) {
            ch.opened = true;
            const entry = chestMeshes[ch.id];
            if (entry) entry.lid.rotation.x = -Math.PI / 3;
            playSoundEffect('chest');
            scoreRef.current += 250;
            setScore(scoreRef.current);
            showBadge('SECRET CHEST +250 PTS!', '🎁');
            if (onScoreUpdateRef.current) onScoreUpdateRef.current(scoreRef.current, collectedIdsRef.current.size);
          }
        }
      }

      // RESPOND TO 45s SECRET LOOT RESPAWN (keeps open world alive)
      for (let i = 0; i < INITIAL_VG_WORLD_COLLECTIBLES.length; i++) {
        const item = INITIAL_VG_WORLD_COLLECTIBLES[i];
        if (item.type !== 'pearl' && collectedIdsRef.current.has(item.id)) {
          const respawnAt = respawnTimersRef.current[item.id];
          if (respawnAt && now >= respawnAt) {
            collectedIdsRef.current.delete(item.id);
            delete respawnTimersRef.current[item.id];
            const cMesh = collectibleMeshes[item.id];
            if (cMesh) {
              cMesh.visible = true;
              cMesh.position.y = item.y;
            }
          }
        }
      }

      // COLLECTIBLES — single material uniform pulse and fast loop
      sharedRingMat.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.3;
      for (let i = 0; i < INITIAL_VG_WORLD_COLLECTIBLES.length; i++) {
        const item = INITIAL_VG_WORLD_COLLECTIBLES[i];
        const cMesh = collectibleMeshes[item.id];
        if (!cMesh) continue;

        if (!collectedIdsRef.current.has(item.id)) {
          cMesh.visible = true;
          cMesh.rotation.y += 2.2 * delta;
          cMesh.position.y = item.y + Math.sin(time * 3 + item.x) * 0.16;

          const dist = Math.hypot(playerGroup.position.x - item.x, playerGroup.position.z - item.z);
          if (dist <= 1.4) {
            collectedIdsRef.current.add(item.id);
            if (item.type !== 'pearl') {
              respawnTimersRef.current[item.id] = now + 45000;
            }
            cMesh.visible = false;
            playSoundEffect('pickup');
            setCollectibles(prev => {
              const updated = prev.map(c => c.id === item.id ? { ...c, collected: true } : c);
              const totalScore = scoreRef.current + item.points;
              scoreRef.current = totalScore;
              setScore(totalScore);
              setUnlockedItem(item);
              if (onScoreUpdateRef.current) onScoreUpdateRef.current(totalScore, collectedIdsRef.current.size);
              return updated;
            });
          }
        } else {
          cMesh.visible = false;
        }
      }

      // NEARBY PLAYER NAME & EMOTE DIALOG — only triggers React state when changed
      let nearbyName: string | undefined;
      let nearbyEmote: string | undefined;
      const rPlayers = remotePlayersRef.current;
      for (let i = 0; i < rPlayers.length; i++) {
        const rp = rPlayers[i];
        if (Math.hypot(playerGroup.position.x - rp.x, playerGroup.position.z - rp.z) <= 3.8) {
          nearbyName = rp.displayName;
          nearbyEmote = rp.currentEmote;
          break;
        }
      }
      if (nearbyName !== lastNearbyRef.current) {
        lastNearbyRef.current = nearbyName;
        setNearbyPlayerName(nearbyName);
        setNearbyPlayerEmote(nearbyEmote);
      }

      // COORDINATE UPDATE (throttled 350ms & 2m delta to eliminate micro-jitter and rerender lag)
      if (now - lastCoordsUpdate > 350) {
        lastCoordsUpdate = now;
        const rx = Math.round(playerGroup.position.x);
        const rz = Math.round(playerGroup.position.z);
        if (Math.abs(rx - lastCoordsRef.current.x) >= 2 || Math.abs(rz - lastCoordsRef.current.z) >= 2) {
          lastCoordsRef.current.x = rx;
          lastCoordsRef.current.z = rz;
          setPlayerCoords({ x: rx, z: rz });
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 24. DISPOSAL — zero VRAM leaks on unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      canvas.removeEventListener('pointerdown',   onPtrDown);
      canvas.removeEventListener('pointermove',   onPtrMove);
      canvas.removeEventListener('pointerup',     onPtrUp);
      canvas.removeEventListener('pointercancel', onPtrUp);
      window.removeEventListener('keydown',  onKeyDown);
      window.removeEventListener('keyup',    onKeyUp);
      window.removeEventListener('resize',   onResize);
      scene.traverse(obj => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach(mat => mat.dispose());
          else (m.material as THREE.Material)?.dispose();
        }
      });
      starGeo.dispose(); starMat.dispose();
      dustGeo.dispose(); dustMat.dispose();
      dustPool.forEach(p => {
        p.mesh.geometry?.dispose();
        if (Array.isArray(p.mesh.material)) p.mesh.material.forEach(m => m.dispose());
        else (p.mesh.material as THREE.Material)?.dispose();
      });
      renderer.dispose();
      if (container.contains(canvas)) container.removeChild(canvas);
      updateAtmosphereRef.current = null;
      if (activeBadgeTimeoutRef.current) clearTimeout(activeBadgeTimeoutRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pearlsCollected = useMemo(() => collectibles.filter(c => c.type === 'pearl' && c.collected).length, [collectibles]);
  const totalPearls     = useMemo(() => collectibles.filter(c => c.type === 'pearl').length, [collectibles]);

  return (
    <div className={`relative w-full h-[calc(100vh-140px)] min-h-[480px] overflow-hidden rounded-2xl border-[2.5px] border-[#111827] shadow-[4px_4px_0px_#111827] transition-colors duration-500 ${
      timeOfDay === 'night' ? 'bg-[#0F172A]' : timeOfDay === 'sunset' ? 'bg-[#F97316]' : 'bg-[#87CEEB]'
    }`}>

      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* HUD */}
      <GameHUD
        score={score}
        pearlsCollected={pearlsCollected}
        totalPearls={totalPearls}
        discoveredLandmarksCount={discoveredLandmarks.length}
        onSendEmote={handleSendEmote}
        unlockedItem={unlockedItem}
        onDismissUnlock={() => setUnlockedItem(null)}
        timeOfDay={timeOfDay}
        onToggleTimeOfDay={handleToggleTimeOfDay}
        speedBoostActive={speedBoostActive}
        onJump={handleJump}
        onSprint={handleSprint}
        activeBadge={activeBadge}
        onOpenPlaceSearch={() => setShowPlaceSearch(true)}
        activeWaypoint={activeWaypoint}
        waypointDistance={waypointDistance}
        onClearWaypoint={() => setActiveWaypoint(null)}
        playerCoords={playerCoords}
      />

      {/* Player speech bubble emote */}
      {playerEmote && playerEmote.expires > Date.now() && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-white border-2 border-[#111827] rounded-2xl shadow-[4px_4px_0px_#111827] font-comic text-xl text-[#111827] animate-bounce pointer-events-none">
          {playerEmote.text}
        </div>
      )}

      {/* Nearby player name tag & comic speech bubble */}
      {nearbyPlayerName && (
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 pointer-events-none">
          {nearbyPlayerEmote && (
            <div className="px-3 py-1.5 bg-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_#111827] font-comic text-xs sm:text-sm text-[#111827] animate-bounce max-w-[280px] text-center">
              "{nearbyPlayerEmote}"
            </div>
          )}
          <div className="px-3 py-1 bg-[#111827] text-white text-[10px] font-mono rounded-full border border-white/30 shadow-[2px_2px_0px_#111827]">
            👤 {nearbyPlayerName} is nearby
          </div>
        </div>
      )}

      {/* Virtual Joystick — bottom-left, inside joystick exclusion zone for camera */}
      <div className="absolute bottom-6 left-4 z-30 pointer-events-auto">
        <VirtualJoystick onMove={handleJoystickMove} maxRadius={56} />
      </div>

      {/* Place Search Modal */}
      <PlaceSearchModal
        isOpen={showPlaceSearch}
        onClose={() => setShowPlaceSearch(false)}
        playerCoords={{ x: playerCoords.x, y: 0, z: playerCoords.z }}
        activeWaypoint={activeWaypoint}
        onSelectWaypoint={lm => setActiveWaypoint(lm)}
        onTeleportTo={handleTeleportTo}
      />
    </div>
  );
};
