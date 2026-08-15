import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LOCATIONS } from '../../config/locations';
import { AvatarGender, CameraMode, LocationZone, PlayerState } from '../../types';
import { CollisionSystem } from './collision';
import { BuildingFactory } from './generators/buildings';
import { CharacterFactory, AnimatedNPC, PlayableAvatarInstance } from './generators/characters';
import { ProceduralTextureFactory } from './generators/proceduralTextures';
import { PropFactory } from './generators/props';
import { TrafficManager } from './generators/trafficManager';
import { VehicleFactory } from './generators/vehicles';
import { ZoneVisualManager } from './generators/zoneVisuals';

interface CityCanvasProps {
  avatarGender: AvatarGender;
  cameraMode: CameraMode;
  onToggleCameraMode?: () => void;
  onZoneChange: (zone: LocationZone | null) => void;
  onPlayerStateUpdate: (state: PlayerState) => void;
  teleportTarget: { x: number; y: number; z: number; yaw?: number } | null;
  onTeleportComplete: () => void;
  isAudioUnlocked: boolean;
  mobileMoveInput: { x: number; y: number };
  mobileLookInput: { x: number; y: number };
  mobileSprint: boolean;
  mobileActionTrigger: number;
}

export const CityCanvas: React.FC<CityCanvasProps> = ({
  avatarGender,
  cameraMode,
  onToggleCameraMode,
  onZoneChange,
  onPlayerStateUpdate,
  teleportTarget,
  onTeleportComplete,
  isAudioUnlocked,
  mobileMoveInput,
  mobileLookInput,
  mobileSprint,
  mobileActionTrigger
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.7, 4));
  const playerYawRef = useRef<number>(Math.PI * 0.15);
  const playerPitchRef = useRef<number>(-0.05);
  const currentZoneRef = useRef<LocationZone | null>(null);
  const isCtrlDownRef = useRef<boolean>(false);
  const isMouseDownRef = useRef<boolean>(false);
  const isCameraLockedRef = useRef<boolean>(false);
  const isSittingRef = useRef<boolean>(false);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const lastActionTriggerRef = useRef<number>(0);
  const avatarRef = useRef<PlayableAvatarInstance | null>(null);
  const cameraModeRef = useRef<CameraMode>(cameraMode);
  const avatarGenderRef = useRef<AvatarGender>(avatarGender);

  cameraModeRef.current = cameraMode;
  avatarGenderRef.current = avatarGender;

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // --- 1. Three.js Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1224); // Dusk Twilight Indigo
    scene.fog = new THREE.FogExp2(0x20152e, 0.009); // Clearer atmospheric dusk haze

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 280);
    camera.position.copy(playerPosRef.current);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // --- 2. Dusk Lighting & Skies ---
    // Ambient fill (Cool twilight sky light)
    const hemiLight = new THREE.HemisphereLight(0xffb088, 0x241832, 0.85);
    scene.add(hemiLight);

    // Sunset Directional Light (Warm Amber Sun casting long shadows)
    const sunLight = new THREE.DirectionalLight(0xff8c42, 2.0);
    sunLight.position.set(45, 30, -35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 140;
    const d = 55;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    // --- 3. Ground, Roads & Footpaths ---
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // City Base Terrain
    const groundGeo = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1c212a, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    worldGroup.add(ground);

    // East-West Main Road (Width 12m)
    const ewRoad = new THREE.Mesh(
      new THREE.PlaneGeometry(180, 10),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 })
    );
    ewRoad.rotation.x = -Math.PI / 2;
    ewRoad.position.set(0, 0.02, 0);
    ewRoad.receiveShadow = true;
    worldGroup.add(ewRoad);

    // North-South Main Road (Width 10m)
    const nsRoad = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 180),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 })
    );
    nsRoad.rotation.x = -Math.PI / 2;
    nsRoad.position.set(0, 0.02, 0);
    nsRoad.receiveShadow = true;
    worldGroup.add(nsRoad);

    // Yellow Dashed Center Line Markings
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    for (let x = -80; x <= 80; x += 6) {
      if (Math.abs(x) > 6) {
        const dash = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.25), lineMat);
        dash.rotation.x = -Math.PI / 2;
        dash.position.set(x, 0.03, 0);
        worldGroup.add(dash);
      }
    }
    for (let z = -80; z <= 80; z += 6) {
      if (Math.abs(z) > 6) {
        const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 3.0), lineMat);
        dash.rotation.x = -Math.PI / 2;
        dash.position.set(0, 0.03, z);
        worldGroup.add(dash);
      }
    }

    // Concrete Sidewalks / Footpaths with Curbstones
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const createSidewalk = (x: number, z: number, w: number, d: number) => {
      const sw = new THREE.Mesh(new THREE.BoxGeometry(w, 0.25, d), sidewalkMat);
      sw.position.set(x, 0.125, z);
      sw.receiveShadow = true;
      worldGroup.add(sw);
    };

    // 4 Quadrant sidewalks
    createSidewalk(-40, -40, 70, 70);
    createSidewalk(40, -40, 70, 70);
    createSidewalk(-40, 40, 70, 70);
    createSidewalk(40, 40, 70, 70);

    // --- 4. Building the 9 Iconic Locations ---

    // 1. Sharma Ji Ki Chai Tapri (-14, 0, 12)
    const tapri = BuildingFactory.createChaiTapri();
    tapri.position.set(-14, 0, 12);
    tapri.rotation.y = Math.PI * 0.25;
    worldGroup.add(tapri);

    // 2. New Bharat Men's Salon (-28, 0, -18)
    const salon = BuildingFactory.createBarberShop();
    salon.position.set(-28, 0, -18);
    worldGroup.add(salon);

    // 3. Indian Highway Tata Truck (26, 0, 18)
    const truck = VehicleFactory.createIndianTruck();
    truck.position.set(26, 0, 18);
    truck.rotation.y = -Math.PI * 0.4;
    worldGroup.add(truck);

    // 4. Bajaj Auto-Rickshaw Stand (8, 0, -14)
    const auto = VehicleFactory.createAutoRickshaw();
    auto.position.set(8, 0, -14);
    auto.rotation.y = Math.PI * 0.6;
    worldGroup.add(auto);

    // 5. State Transport "Lal Dabba" Bus (-18, 0, 36)
    const bus = VehicleFactory.createIndianBus();
    bus.position.set(-18, 0, 36);
    bus.rotation.y = -Math.PI * 0.5;
    worldGroup.add(bus);

    // 6. IndiTech Corporate Office Tower (34, 0, -26)
    const office = BuildingFactory.createCorporateOffice();
    office.position.set(34, 0, -26);
    office.rotation.y = Math.PI * 0.8;
    worldGroup.add(office);

    // 7. DJ Rocky Baraat & Wedding Celebration (-34, 0, 6)
    const baraat = BuildingFactory.createDJBaraat();
    baraat.position.set(-34, 0, 6);
    baraat.rotation.y = -Math.PI * 0.2;
    worldGroup.add(baraat);

    // 8. Coke Studio Live Stage (40, 0, 30)
    const concert = BuildingFactory.createConcertStage();
    concert.position.set(40, 0, 30);
    concert.rotation.y = -Math.PI * 0.75;
    worldGroup.add(concert);

    // 9. Nizamuddin Haveli Sufi Mahfil Courtyard (16, 0, -40)
    const mahfil = BuildingFactory.createMahfil();
    mahfil.position.set(16, 0, -40);
    worldGroup.add(mahfil);

    // --- 5. Surrounding City Blocks & Street Architecture ---
    const cityBlocks = [
      { x: -50, z: -50, w: 16, h: 22, d: 16, c: 0xfef08a, p: 0 },
      { x: -20, z: -50, w: 14, h: 18, d: 14, c: 0x93c5fd, p: 1 },
      { x: -52, z: -20, w: 14, h: 20, d: 12, c: 0xfbcfe8, p: 2 },
      { x: -52, z: 25, w: 14, h: 16, d: 16, c: 0xa7f3d0, p: 3 },
      { x: -45, z: 52, w: 18, h: 24, d: 16, c: 0xfde68a, p: 0 },
      { x: 15, z: 52, w: 18, h: 20, d: 16, c: 0xd8b4fe, p: 1 },
      { x: 52, z: -10, w: 16, h: 26, d: 16, c: 0xbfdbfe, p: 2 },
      { x: 52, z: -48, w: 16, h: 20, d: 14, c: 0xfbcfe8, p: 3 },
      { x: 52, z: 52, w: 16, h: 22, d: 16, c: 0xfef08a, p: 0 },
    ];

    cityBlocks.forEach((b) => {
      const bldg = BuildingFactory.createCityBuilding(b.w, b.h, b.d, b.c, b.p);
      bldg.position.set(b.x, 0, b.z);
      worldGroup.add(bldg);
    });

    // Street Utility Poles with Lamp Glows
    const poleCoords = [
      [-7, -7], [7, -7], [-7, 7], [7, 7],
      [-22, -7], [-38, -7], [22, -7], [38, -7],
      [-7, -22], [-7, -38], [7, -22], [7, -38],
      [-7, 22], [-7, 38], [7, 22], [7, 38],
    ];
    poleCoords.forEach(([px, pz]) => {
      const pole = PropFactory.createElectricPole();
      pole.position.set(px, 0, pz);
      worldGroup.add(pole);
    });

    // Vendor Thelas (Chaat & Fruit Carts)
    const thela1 = PropFactory.createVendorThela(false);
    thela1.position.set(-8, 0, 7);
    worldGroup.add(thela1);

    const thela2 = PropFactory.createVendorThela(true);
    thela2.position.set(7, 0, 8);
    worldGroup.add(thela2);

    // Trees (Banyan / Neem trees along footpaths)
    const treeCoords = [
      [-10, -12], [-18, -12], [-8, 20], [12, -8],
      [20, 8], [32, 12], [24, -16], [-28, 24]
    ];
    treeCoords.forEach(([tx, tz]) => {
      const tree = PropFactory.createTree(0.9 + Math.random() * 0.3);
      tree.position.set(tx, 0, tz);
      worldGroup.add(tree);
    });

    // Parked Scooters & Bikes
    const scooter1 = VehicleFactory.createScooter(0x0284c7);
    scooter1.position.set(-11, 0, 14);
    scooter1.rotation.y = Math.PI * 0.4;
    worldGroup.add(scooter1);

    const scooter2 = VehicleFactory.createScooter(0xdc2626);
    scooter2.position.set(-22, 0, -17);
    scooter2.rotation.y = -Math.PI * 0.3;
    worldGroup.add(scooter2);

    // Street Road Signs
    const sign1Tex = ProceduralTextureFactory.getStreetSignTexture('एम. जी. मार्ग (चौक)', 'M.G. ROAD CHOWK');
    const sign1 = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 0.6),
      new THREE.MeshBasicMaterial({ map: sign1Tex, side: THREE.DoubleSide })
    );
    sign1.position.set(-6, 3.5, -6);
    worldGroup.add(sign1);

    // --- 6. Character NPCs & Living World ---
    const npcs: AnimatedNPC[] = [];

    // 5 Dancing Baraatis in Wedding Zone
    const baraatiColors = [0xec4899, 0xf59e0b, 0xdc2626, 0x8b5cf6, 0x10b981];
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const bx = -34 + Math.cos(angle) * 3.5;
      const bz = 6 + Math.sin(angle) * 3.5;
      const dancer = CharacterFactory.createBaraatiDancer(bx, bz, baraatiColors[i], i % 2 === 0);
      worldGroup.add(dancer.group);
      npcs.push(dancer);
    }

    // Walking Pedestrians on Sidewalks
    const walkerPath1 = [
      { x: -6.5, z: -35 },
      { x: -6.5, z: 35 },
      { x: -35, z: 35 },
      { x: -35, z: -35 }
    ];
    const walker1 = CharacterFactory.createWalkingPedestrian(walkerPath1, 1.8, 0x0284c7);
    worldGroup.add(walker1.group);
    npcs.push(walker1);

    const walkerPath2 = [
      { x: 6.5, z: 35 },
      { x: 6.5, z: -35 },
      { x: 35, z: -35 },
      { x: 35, z: 35 }
    ];
    const walker2 = CharacterFactory.createWalkingPedestrian(walkerPath2, 2.1, 0x16a34a);
    worldGroup.add(walker2.group);
    npcs.push(walker2);

    // Moving City Traffic Manager
    const trafficManager = new TrafficManager();
    worldGroup.add(trafficManager.container);

    // Dynamic Glowing Song Catchment Zone Rings
    const zoneVisualManager = new ZoneVisualManager(LOCATIONS);
    worldGroup.add(zoneVisualManager.container);

    // Initialize City Collision Mesh Boundaries
    CollisionSystem.init();

    // Ambient Twilight Dust / Fireflies Particle System
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 110;
      particlePos[i + 1] = 0.5 + Math.random() * 7;
      particlePos[i + 2] = (Math.random() - 0.5) * 110;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.15,
      transparent: true,
      opacity: 0.85
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(particles);

    // --- 7. Playable 3D Human Avatar (Man or Woman with cultural details) ---
    let playerAvatar = CharacterFactory.createPlayableAvatar(avatarGenderRef.current);
    worldGroup.add(playerAvatar.group);
    avatarRef.current = playerAvatar;

    // --- 8. Event Listeners for Movement & Camera Look ---

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;

      // 'C' key toggles camera lock mode
      if (e.code === 'KeyC') {
        isCameraLockedRef.current = !isCameraLockedRef.current;
      }

      // 'V' key toggles between 3rd-Person character view and 1st-Person immersive view
      if (e.code === 'KeyV') {
        if (onToggleCameraMode) onToggleCameraMode();
      }

      // 'Control' key enables camera look while held
      if (e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
        isCtrlDownRef.current = true;
      }

      // 'E' key interacts / jumps to ideal vantage or sits
      if (e.code === 'KeyE') {
        triggerAction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
      if (e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
        isCtrlDownRef.current = false;
      }
    };

    const handleMouseDown = (_e: MouseEvent) => {
      // Allow mouse drag looking on canvas
      isMouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Look camera when mouse is clicked/dragged OR Ctrl is held OR Camera Lock is toggled
      if (isMouseDownRef.current || isCtrlDownRef.current || isCameraLockedRef.current) {
        const sensitivity = 0.0032;
        playerYawRef.current -= e.movementX * sensitivity;
        playerPitchRef.current -= e.movementY * sensitivity;
        playerPitchRef.current = Math.max(-Math.PI * 0.38, Math.min(Math.PI * 0.38, playerPitchRef.current));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);

    // Window resize handler for true dynamic full-screen canvas
    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener('resize', updateSize);

    // Initial resize trigger
    setTimeout(updateSize, 30);

    // --- 9. Animation & Render Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const triggerAction = () => {
      const curPos = playerPosRef.current;
      let closestZone: LocationZone | null = null;
      let minD = 999;

      LOCATIONS.forEach((z) => {
        const dx = z.position.x - curPos.x;
        const dz = z.position.z - curPos.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d < z.radius + 6 && d < minD) {
          minD = d;
          closestZone = z;
        }
      });

      if (closestZone) {
        const cz = closestZone as LocationZone;
        if (!isSittingRef.current) {
          playerPosRef.current.set(cz.interiorSpawn.x, cz.interiorSpawn.y, cz.interiorSpawn.z);
          playerYawRef.current = cz.interiorSpawn.yaw;
          playerPitchRef.current = cz.interiorSpawn.pitch || 0;
          isSittingRef.current = true;
        } else {
          isSittingRef.current = false;
        }
      } else {
        isSittingRef.current = !isSittingRef.current;
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(0.1, clock.getDelta());
      const elapsedTime = clock.getElapsedTime();

      // Mobile look input handling
      if (mobileLookInput.x !== 0 || mobileLookInput.y !== 0) {
        const mobSensitivity = 2.0 * delta;
        playerYawRef.current -= mobileLookInput.x * mobSensitivity;
        playerPitchRef.current -= mobileLookInput.y * mobSensitivity;
        playerPitchRef.current = Math.max(-Math.PI * 0.38, Math.min(Math.PI * 0.38, playerPitchRef.current));
      }

      // --- Precise Uninverted Movement Direction Calculation ---
      // Up Arrow / W = Moves forward in the exact direction the camera is facing
      // Down Arrow / S = Moves backward directly behind camera
      // Left Arrow / A = Moves left perpendicular to camera
      // Right Arrow / D = Moves right perpendicular to camera
      let moveForward = 0;
      let moveRight = 0;

      if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) moveForward += 1;
      if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) moveForward -= 1;
      if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) moveRight -= 1;
      if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) moveRight += 1;

      // Add mobile touch movement
      if (mobileMoveInput.y !== 0) moveForward += -mobileMoveInput.y;
      if (mobileMoveInput.x !== 0) moveRight += mobileMoveInput.x;

      const isSprint = keysRef.current['ShiftLeft'] || keysRef.current['ShiftRight'] || mobileSprint;
      const baseSpeed = isSprint ? 8.2 : 4.4;
      const speed = baseSpeed * delta;
      const isMoving = moveForward !== 0 || moveRight !== 0;

      let moveHeading = playerYawRef.current;

      if (isMoving) {
        isSittingRef.current = false;
        // Calculate camera facing vectors in standard Three.js coordinates
        const forwardX = -Math.sin(playerYawRef.current);
        const forwardZ = -Math.cos(playerYawRef.current);
        const rightX = Math.cos(playerYawRef.current);
        const rightZ = -Math.sin(playerYawRef.current);

        const inputLen = Math.hypot(moveForward, moveRight);
        const normF = moveForward / inputLen;
        const normR = moveRight / inputLen;

        const dirX = forwardX * normF + rightX * normR;
        const dirZ = forwardZ * normF + rightZ * normR;

        // Player avatar orientation follows movement trajectory
        moveHeading = Math.atan2(dirX, dirZ);

        const deltaX = dirX * speed;
        const deltaZ = dirZ * speed;

        // Resolve movement against solid objects with smooth wall sliding
        const resolved = CollisionSystem.resolveMovement(
          playerPosRef.current,
          deltaX,
          deltaZ
        );
        playerPosRef.current.x = resolved.x;
        playerPosRef.current.z = resolved.z;
      }

      // Compute accurate elevation for the avatar depending on sitting on chair or standing
      let activeSeatElevation = 0;
      if (isSittingRef.current) {
        if (currentZoneRef.current && currentZoneRef.current.interiorSpawn.seatHeight !== undefined) {
          activeSeatElevation = currentZoneRef.current.interiorSpawn.seatHeight;
        } else {
          activeSeatElevation = Math.max(0, playerPosRef.current.y - 0.82);
        }
      } else {
        // Standing / walking elevations in elevated zones
        if (currentZoneRef.current?.id === 'bus') {
          activeSeatElevation = 0.95;
        } else if (currentZoneRef.current?.id === 'truck') {
          activeSeatElevation = 1.05;
        } else if (currentZoneRef.current?.id === 'mahfil') {
          activeSeatElevation = 0.50;
        } else {
          activeSeatElevation = 0;
        }
      }

      // --- Avatar Positioning & Articulated Limb Animations ---
      if (playerAvatar) {
        playerAvatar.group.position.set(
          playerPosRef.current.x,
          activeSeatElevation,
          playerPosRef.current.z
        );

        if (isSittingRef.current) {
          // Align avatar with the chair facing direction
          playerAvatar.group.rotation.y = playerYawRef.current;
        }

        playerAvatar.update(
          delta,
          isMoving ? baseSpeed : 0,
          isSprint,
          isMoving,
          moveHeading,
          isSittingRef.current
        );

        // Hide or show avatar mesh depending on camera mode
        if (cameraModeRef.current === 'third-person') {
          playerAvatar.setVisible(true);
        } else {
          playerAvatar.setVisible(false);
        }
      }

      // --- Camera Positioning (3rd-Person Follow vs 1st-Person Immersive) ---
      const eyeLevelY = isSittingRef.current
        ? activeSeatElevation + 0.82
        : playerPosRef.current.y;

      if (cameraModeRef.current === 'third-person') {
        // 3rd Person: Smooth follow camera behind the player avatar
        const camDistance = isSittingRef.current ? 1.6 : 3.2;
        const camHeight = isSittingRef.current ? 0.35 : 0.85;

        // Rotate offset by playerYaw & playerPitch
        const cosPitch = Math.cos(playerPitchRef.current);
        const sinPitch = Math.sin(playerPitchRef.current);

        const offsetX = Math.sin(playerYawRef.current) * camDistance * cosPitch;
        const offsetZ = Math.cos(playerYawRef.current) * camDistance * cosPitch;
        const offsetY = camHeight - sinPitch * camDistance;

        camera.position.x = playerPosRef.current.x + offsetX;
        camera.position.y = eyeLevelY + offsetY;
        camera.position.z = playerPosRef.current.z + offsetZ;

        // Look at player character chest / head
        camera.lookAt(
          playerPosRef.current.x,
          eyeLevelY + 0.15,
          playerPosRef.current.z
        );
      } else {
        // 1st Person: Camera directly at player's eye level
        camera.position.x = playerPosRef.current.x;
        camera.position.y = eyeLevelY;
        camera.position.z = playerPosRef.current.z;

        const euler = new THREE.Euler(playerPitchRef.current, playerYawRef.current, 0, 'YXZ');
        camera.quaternion.setFromEuler(euler);
      }

      // Update traffic & NPCs
      trafficManager.update(delta);
      npcs.forEach((npc) => npc.update(delta, elapsedTime));

      // Twinkle fireflies
      particles.rotation.y = elapsedTime * 0.04;

      // --- Proximity Zone Detection with Hysteresis ---
      const pPos = playerPosRef.current;
      let detectedZone: LocationZone | null = null;
      let minDistance = 999;
      let nearestZone: LocationZone | null = null;

      for (const zone of LOCATIONS) {
        const dx = zone.position.x - pPos.x;
        const dz = zone.position.z - pPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < minDistance) {
          minDistance = dist;
          nearestZone = zone;
        }

        // Hysteresis buffer threshold so zone doesn't flicker
        const activeRadius = currentZoneRef.current?.id === zone.id ? zone.radius + 2.5 : zone.radius;
        if (dist < activeRadius) {
          detectedZone = zone;
        }
      }

      // Update 3D Glowing Song Catchment Range Rings
      zoneVisualManager.update(delta, detectedZone?.id || null, pPos);

      if (detectedZone?.id !== currentZoneRef.current?.id) {
        currentZoneRef.current = detectedZone;
        onZoneChange(detectedZone);
      }

      // Emit clean serializable player state update
      onPlayerStateUpdate({
        position: { x: pPos.x, y: pPos.y, z: pPos.z },
        rotation: { yaw: playerYawRef.current, pitch: playerPitchRef.current },
        speed: isMoving ? (isSprint ? 8.2 : 4.4) : 0,
        isSprint,
        isMoving,
        inInterior: false,
        currentZone: detectedZone,
        nearbyZone: nearestZone,
        distanceToNearest: minDistance
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('resize', updateSize);
      if (playerAvatar) {
        worldGroup.remove(playerAvatar.group);
      }
      zoneVisualManager.dispose();
      renderer.dispose();
    };
  }, []);

  // Handle mobile action trigger
  useEffect(() => {
    if (mobileActionTrigger > 0 && mobileActionTrigger !== lastActionTriggerRef.current) {
      lastActionTriggerRef.current = mobileActionTrigger;
      const curPos = playerPosRef.current;
      let closestZone: LocationZone | null = null;
      let minD = 999;
      LOCATIONS.forEach((z) => {
        const dx = z.position.x - curPos.x;
        const dz = z.position.z - curPos.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d < z.radius + 5 && d < minD) {
          minD = d;
          closestZone = z;
        }
      });
      if (closestZone) {
        const cz = closestZone as LocationZone;
        if (!isSittingRef.current) {
          playerPosRef.current.set(cz.interiorSpawn.x, cz.interiorSpawn.y, cz.interiorSpawn.z);
          playerYawRef.current = cz.interiorSpawn.yaw;
          playerPitchRef.current = cz.interiorSpawn.pitch || 0;
          isSittingRef.current = true;
        } else {
          isSittingRef.current = false;
        }
      } else {
        isSittingRef.current = !isSittingRef.current;
      }
    }
  }, [mobileActionTrigger]);

  // Handle teleport target from mini-map or playlist directory
  useEffect(() => {
    if (teleportTarget) {
      playerPosRef.current.set(teleportTarget.x, teleportTarget.y, teleportTarget.z);
      if (teleportTarget.yaw !== undefined) {
        playerYawRef.current = teleportTarget.yaw;
      }
      playerPitchRef.current = 0;
      isSittingRef.current = true;
      onTeleportComplete();
    }
  }, [teleportTarget, onTeleportComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full block cursor-crosshair select-none touch-none z-0"
    />
  );
};
