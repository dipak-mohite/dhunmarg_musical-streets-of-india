import * as THREE from 'three';
import { ProceduralTextureFactory } from './proceduralTextures';

export class VehicleFactory {
  /**
   * Creates an authentic decorated Indian Truck (Tata / Ashok Leyland style) with Hollow Cabin Interior
   */
  public static createIndianTruck(): THREE.Group {
    const truck = new THREE.Group();
    truck.name = 'IndianTruck';

    // 1. Chassis & Heavy Wheels
    const chassisGeo = new THREE.BoxGeometry(3.0, 0.4, 9.0);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.8 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.8;
    chassis.castShadow = true;
    truck.add(chassis);

    // 6 Wheels (front 2, rear dual pairs 4)
    const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.6, roughness: 0.4 });

    const wheelPositions = [
      [-1.4, 0.55, 3.2], [1.4, 0.55, 3.2], // Front
      [-1.4, 0.55, -1.8], [1.4, 0.55, -1.8], // Middle rear
      [-1.4, 0.55, -3.2], [1.4, 0.55, -3.2], // Back rear
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Group();
      wheel.position.set(x, y, z);
      const tire = new THREE.Mesh(wheelGeo, wheelMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheel.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.48, 16), rimMat);
      rim.rotation.z = Math.PI / 2;
      wheel.add(rim);
      truck.add(wheel);
    });

    // 2. Hollow Front Cabin Structure (Bright Yellow & Orange)
    const cabinColor = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, side: THREE.DoubleSide });
    const cabinTrim = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });

    // Cabin Floor
    const cabFloor = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.15, 2.8), cabinTrim);
    cabFloor.position.set(0, 1.05, 2.8);
    truck.add(cabFloor);

    // Cabin Back Partition Wall
    const cabBack = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.4, 0.15), cabinColor);
    cabBack.position.set(0, 2.25, 1.4);
    truck.add(cabBack);

    // Cabin Roof & Decorative Taj Crown
    const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.15, 2.8), cabinColor);
    cabRoof.position.set(0, 3.45, 2.8);
    truck.add(cabRoof);

    const crown = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.6, 2.6), new THREE.MeshStandardMaterial({ color: 0x16a34a }));
    crown.position.set(0, 3.8, 2.8);
    truck.add(crown);

    // Cabin Front Grille & Lower Nose
    const grille = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 0.6), cabinTrim);
    grille.position.set(0, 1.45, 4.0);
    truck.add(grille);

    // Headlights
    [-0.95, 0.95].forEach((hx) => {
      const hl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.9 })
      );
      hl.rotation.x = Math.PI / 2;
      hl.position.set(hx, 1.45, 4.32);
      truck.add(hl);
    });

    // Front Windshield (Transparent Glass)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      transmission: 0.75,
      opacity: 0.85,
      transparent: true,
      roughness: 0.05
    });
    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.4), glassMat);
    windshield.position.set(0, 2.65, 4.19);
    truck.add(windshield);

    // Left & Right Cabin Pillars (leaving open door windows)
    [-1.35, 1.35].forEach((px) => {
      // Front corner pillar
      const fPillar = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, 0.15), cabinTrim);
      fPillar.position.set(px, 2.25, 4.1);
      truck.add(fPillar);

      // Half-height lower door panel
      const halfDoor = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, 1.8), cabinColor);
      halfDoor.position.set(px, 1.55, 2.8);
      truck.add(halfDoor);

      // Large Chrome Side Mirror
      const mirrorArm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 }));
      mirrorArm.position.set(px > 0 ? px + 0.2 : px - 0.2, 2.6, 3.8);
      mirrorArm.rotation.z = Math.PI / 2;
      truck.add(mirrorArm);

      const mirrorFace = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.2), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
      mirrorFace.position.set(px > 0 ? px + 0.38 : px - 0.38, 2.6, 3.8);
      truck.add(mirrorFace);
    });

    // 3. INTERIOR CABIN DETAILS (Steering wheel, driver seat, dashboard idol)
    // Driver Seat (Right-Hand Drive in India: x = -0.65)
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const seatGroup = new THREE.Group();
    seatGroup.position.set(-0.65, 1.1, 2.4);

    const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 0.7), seatMat);
    seatBase.position.y = 0.35;
    seatGroup.add(seatBase);

    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.15), seatMat);
    seatBack.position.set(0, 0.75, -0.28);
    seatGroup.add(seatBack);
    truck.add(seatGroup);

    // Passenger Bench on left side
    const pSeat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 0.7), seatMat);
    pSeat.position.set(0.65, 1.45, 2.4);
    truck.add(pSeat);

    // Red Large Truck Steering Wheel
    const steerGroup = new THREE.Group();
    steerGroup.position.set(-0.65, 2.1, 3.4);
    steerGroup.rotation.x = -Math.PI / 4;

    const steerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.04, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xdc2626 })
    );
    steerGroup.add(steerRing);

    const steerColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8),
      new THREE.MeshStandardMaterial({ color: 0x18181b })
    );
    steerColumn.position.z = -0.25;
    steerColumn.rotation.x = Math.PI / 2;
    steerGroup.add(steerColumn);
    truck.add(steerGroup);

    // Dashboard Idol & Evil Eye Lemon-Chilli Ward
    const idol = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.6 })
    );
    idol.position.set(0, 2.05, 3.9);
    truck.add(idol);

    // Hanging Marigold Garlands
    const garlandGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const garlandMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
    for (let g = 0; g < 4; g++) {
      const ball = new THREE.Mesh(garlandGeo, garlandMat);
      ball.position.set(-0.65, 2.6 - g * 0.08, 3.7);
      truck.add(ball);
    }

    // 4. Wooden Cargo Bed with Painted Side Panels
    const cargoGeo = new THREE.BoxGeometry(3.0, 2.4, 5.6);
    const cargoMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
    const cargo = new THREE.Mesh(cargoGeo, cargoMat);
    cargo.position.set(0, 2.3, -1.5);
    cargo.castShadow = true;
    truck.add(cargo);

    // 5. Rear "HORN OK PLEASE" Painted Artwork Board
    const rearBoardGeo = new THREE.PlaneGeometry(2.9, 1.8);
    const truckArtTex = ProceduralTextureFactory.getTruckArtTexture();
    const rearBoardMat = new THREE.MeshBasicMaterial({ map: truckArtTex, side: THREE.DoubleSide });
    const rearBoard = new THREE.Mesh(rearBoardGeo, rearBoardMat);
    rearBoard.position.set(0, 2.2, -4.32);
    rearBoard.rotation.y = Math.PI;
    truck.add(rearBoard);

    return truck;
  }

  /**
   * Creates an authentic State Transport "Lal Dabba" Bus with Fully Walkable Hollow Interior
   */
  public static createIndianBus(): THREE.Group {
    const bus = new THREE.Group();
    bus.name = 'StateBus';

    const redMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.5, side: THREE.DoubleSide });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4, side: THREE.DoubleSide });
    const interiorFloorMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.75,
      opacity: 0.85,
      transparent: true,
      roughness: 0.05
    });

    // 1. Bus Elevated Floor / Chassis
    const floor = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.25, 11.0), interiorFloorMat);
    floor.position.set(0, 0.95, 0);
    floor.receiveShadow = true;
    bus.add(floor);

    // 2. White Roof Cap
    const roof = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.2, 11.2), roofMat);
    roof.position.set(0, 3.55, 0);
    bus.add(roof);

    // 3. Rear Wall
    const rearWall = new THREE.Mesh(new THREE.BoxGeometry(3.1, 2.4, 0.2), redMat);
    rearWall.position.set(0, 2.25, -5.4);
    bus.add(rearWall);

    // Rear glass window
    const rearWin = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.9), glassMat);
    rearWin.position.set(0, 2.4, -5.52);
    rearWin.rotation.y = Math.PI;
    bus.add(rearWin);

    // 4. Front Nose, Grille & Big Windshield
    const frontCowl = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.1, 0.8), redMat);
    frontCowl.position.set(0, 1.45, 5.2);
    bus.add(frontCowl);

    // Front Destination Board ("404 Dadar Express")
    const busSignTex = ProceduralTextureFactory.getBusSignTexture();
    const destSign = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 0.65),
      new THREE.MeshBasicMaterial({ map: busSignTex, side: THREE.DoubleSide })
    );
    destSign.position.set(0, 3.15, 5.56);
    bus.add(destSign);

    // Front Double Windshield
    const ws = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.3), glassMat);
    ws.position.set(0, 2.25, 5.56);
    bus.add(ws);

    // Dual Headlights
    [-1.1, 1.1].forEach((hx) => {
      const hl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.9 })
      );
      hl.rotation.x = Math.PI / 2;
      hl.position.set(hx, 1.25, 5.62);
      bus.add(hl);
    });

    // 5. Left & Right Side Walls with Passenger Windows
    // Left Side Wall (Full row of open windows)
    const leftLower = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.0, 11.0), redMat);
    leftLower.position.set(-1.5, 1.5, 0);
    bus.add(leftLower);

    const leftUpper = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 11.0), redMat);
    leftUpper.position.set(-1.5, 3.25, 0);
    bus.add(leftUpper);

    // Windows on Left Flank
    for (let z = -4.2; z <= 4.2; z += 1.5) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.85), glassMat);
      win.position.set(-1.51, 2.35, z);
      win.rotation.y = -Math.PI / 2;
      bus.add(win);
    }

    // Right Side Wall: Rear/Mid section has windows, Front section has Open Passenger Boarding Door (at z = 3.6 to 4.8)
    const rightLower = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.0, 8.5), redMat);
    rightLower.position.set(1.5, 1.5, -1.25);
    bus.add(rightLower);

    const rightUpper = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 11.0), redMat);
    rightUpper.position.set(1.5, 3.25, 0);
    bus.add(rightUpper);

    for (let z = -4.2; z <= 2.2; z += 1.5) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.85), glassMat);
      win.position.set(1.51, 2.35, z);
      win.rotation.y = Math.PI / 2;
      bus.add(win);
    }

    // Open Passenger Boarding Doorway with entry step (Right side at z = 4.0)
    const doorStep = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.15, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x18181b })
    );
    doorStep.position.set(1.7, 0.5, 4.0);
    bus.add(doorStep);

    // 6. 6 Heavy Bus Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 20);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const wPositions = [
      [-1.5, 0.55, 3.6], [1.5, 0.55, 3.6], // Front
      [-1.5, 0.55, -3.2], [1.5, 0.55, -3.2], // Rear Pair
      [-1.5, 0.55, -4.4], [1.5, 0.55, -4.4]
    ];
    wPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(x, y, z);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      bus.add(wheel);
    });

    // 7. INTERIOR PASSENGER SEATING (5 Rows of Double Green Vinyl Seats with Aisle)
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.5 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85 });

    for (let sz = -4.0; sz <= 2.2; sz += 1.4) {
      // Left Double Seat (Window + Aisle)
      const sLeftGroup = new THREE.Group();
      sLeftGroup.position.set(-0.85, 1.05, sz);

      const sLeftCushion = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 0.55), seatMat);
      sLeftCushion.position.y = 0.35;
      sLeftGroup.add(sLeftCushion);

      const sLeftBack = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.12), seatMat);
      sLeftBack.position.set(0, 0.75, -0.22);
      sLeftGroup.add(sLeftBack);

      const sLeftHandle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.75, 0.06), chromeMat);
      sLeftHandle.position.set(0.42, 0.75, -0.22);
      sLeftGroup.add(sLeftHandle);
      bus.add(sLeftGroup);

      // Right Double Seat
      const sRightGroup = new THREE.Group();
      sRightGroup.position.set(0.85, 1.05, sz);

      const sRightCushion = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 0.55), seatMat);
      sRightCushion.position.y = 0.35;
      sRightGroup.add(sRightCushion);

      const sRightBack = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.12), seatMat);
      sRightBack.position.set(0, 0.75, -0.22);
      sRightGroup.add(sRightBack);

      const sRightHandle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.75, 0.06), chromeMat);
      sRightHandle.position.set(-0.42, 0.75, -0.22);
      sRightGroup.add(sRightHandle);
      bus.add(sRightGroup);
    }

    // Driver's Seat & Bus Steering Wheel (Right-hand drive: x = -0.85, z = 4.4)
    const driverSeat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.55), seatMat);
    driverSeat.position.set(-0.85, 1.45, 4.4);
    bus.add(driverSeat);

    const busSteerGroup = new THREE.Group();
    busSteerGroup.position.set(-0.85, 2.05, 4.9);
    busSteerGroup.rotation.x = -Math.PI / 3;

    const busSteer = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.035, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0x18181b })
    );
    busSteerGroup.add(busSteer);
    bus.add(busSteerGroup);

    // Chrome Overhead Grab Rails & Hanging Rings
    [-0.5, 0.5].forEach((rx) => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 9.5, 8), chromeMat);
      rail.rotation.x = Math.PI / 2;
      rail.position.set(rx, 3.1, -0.5);
      bus.add(rail);

      for (let rz = -3.5; rz <= 2.5; rz += 1.5) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 6, 12), chromeMat);
        ring.position.set(rx, 2.85, rz);
        bus.add(ring);
      }
    });

    // Interior Warm Lighting
    const busLight = new THREE.PointLight(0xfef08a, 2.2, 14);
    busLight.position.set(0, 3.2, 0);
    bus.add(busLight);

    return bus;
  }

  /**
   * Creates an iconic Bajaj RE Auto-Rickshaw (Hollow Walk-In / Ride-In Interior)
   */
  public static createAutoRickshaw(): THREE.Group {
    const auto = new THREE.Group();
    auto.name = 'AutoRickshaw';

    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, side: THREE.DoubleSide });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5, side: THREE.DoubleSide });
    const blackHoodMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.8, side: THREE.DoubleSide });
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x93c5fd, transmission: 0.75, transparent: true, opacity: 0.85 });

    // 1. Lower Green Body Chassis
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.40, 2.7), greenMat);
    lowerBody.position.y = 0.38;
    lowerBody.castShadow = true;
    auto.add(lowerBody);

    // Front Nose / Mudguard
    const nose = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.45, 0.75), yellowMat);
    nose.position.set(0, 0.58, 1.48);
    auto.add(nose);

    // Single Center Headlight
    const headlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.9 })
    );
    headlight.position.set(0, 0.68, 1.86);
    auto.add(headlight);

    // Front Windshield
    const ws = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 0.82), glassMat);
    ws.position.set(0, 1.40, 1.25);
    auto.add(ws);

    // 2. Yellow Upper Half & Roof Canopy Frame
    // Thin metal roof pillars (extra headroom)
    [-0.78, 0.78].forEach((px) => {
      const fp = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.45, 8), chromeMat);
      fp.position.set(px, 1.42, 1.18);
      auto.add(fp);

      const rp = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.45, 8), chromeMat);
      rp.position.set(px, 1.42, -1.22);
      auto.add(rp);
    });

    // Black Canopy Curved Roof with Generous Head Clearance
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.12, 2.65), blackHoodMat);
    roof.position.set(0, 2.14, -0.05);
    auto.add(roof);

    // Back Panel
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.0, 0.1), yellowMat);
    backWall.position.set(0, 1.15, -1.28);
    auto.add(backWall);

    // 3. 3 Wheels (1 Front, 2 Rear)
    const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.16, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    const frontWheel = new THREE.Mesh(wheelGeo, wheelMat);
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.position.set(0, 0.24, 1.35);
    auto.add(frontWheel);

    [-0.82, 0.82].forEach((wx) => {
      const rw = new THREE.Mesh(wheelGeo, wheelMat);
      rw.rotation.z = Math.PI / 2;
      rw.position.set(wx, 0.24, -0.7);
      auto.add(rw);
    });

    // 4. INTERIOR: Driver Seat, Handlebars, Meter, Rear Passenger Bench
    const driverSeat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.20, 0.45), seatMat);
    driverSeat.position.set(0, 0.60, 0.65);
    auto.add(driverSeat);

    const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8), chromeMat);
    handleBar.rotation.z = Math.PI / 2;
    handleBar.position.set(0, 1.02, 1.1);
    auto.add(handleBar);

    const fareMeter = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.14, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.5 })
    );
    fareMeter.position.set(0.4, 1.05, 1.12);
    auto.add(fareMeter);

    // Rear Passenger Seat: cushion top at 0.54 + 0.11 = 0.65
    const rearBench = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.22, 0.65), seatMat);
    rearBench.position.set(0, 0.54, -0.65);
    auto.add(rearBench);

    const rearBackrest = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.65, 0.12), seatMat);
    rearBackrest.position.set(0, 0.96, -1.02);
    auto.add(rearBackrest);

    return auto;
  }

  /**
   * Creates a Bajaj Chetak / Vespa vintage scooter
   */
  public static createScooter(color: number = 0x0284c7): THREE.Group {
    const scooter = new THREE.Group();
    scooter.name = 'Scooter';

    // Body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.45, 1.4),
      new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
    );
    body.position.y = 0.4;
    scooter.add(body);

    // Front leg shield curve
    const shield = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.7, 0.08),
      new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
    );
    shield.position.set(0, 0.65, 0.6);
    scooter.add(shield);

    // Handlebar & round headlight
    const bar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8),
      new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.8 })
    );
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, 1.0, 0.55);
    scooter.add(bar);

    const hl = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.6 })
    );
    hl.position.set(0, 1.05, 0.62);
    scooter.add(hl);

    // Split rexine seat
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.15, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 })
    );
    seat.position.set(0, 0.68, -0.1);
    scooter.add(seat);

    // Wheels (Front & Back)
    const wheelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 14);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    [0.6, -0.6].forEach((wz) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(0, 0.2, wz);
      scooter.add(w);
    });

    // Stepney spare wheel mounted on rear
    const spare = new THREE.Mesh(wheelGeo, wheelMat);
    spare.position.set(0, 0.5, -0.8);
    spare.rotation.x = Math.PI / 2;
    scooter.add(spare);

    return scooter;
  }

  /**
   * Creates a moving city car / taxi for background traffic
   */
  public static createCityCar(color: number = 0xf8fafc, isTaxi: boolean = false): THREE.Group {
    const car = new THREE.Group();

    // Chassis
    const lower = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.65, 4.0),
      new THREE.MeshStandardMaterial({ color: isTaxi ? 0x111827 : color, roughness: 0.4 })
    );
    lower.position.y = 0.55;
    car.add(lower);

    // Cabin roof
    const upper = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.6, 2.2),
      new THREE.MeshStandardMaterial({ color: isTaxi ? 0xf59e0b : color, roughness: 0.3 })
    );
    upper.position.set(0, 1.15, -0.2);
    car.add(upper);

    // Windows
    const winMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transmission: 0.6, transparent: true });
    const ws = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.55), winMat);
    ws.position.set(0, 1.15, 0.91);
    car.add(ws);

    // Headlights
    [-0.65, 0.65].forEach((hx) => {
      const hl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.06, 12),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.9 })
      );
      hl.rotation.x = Math.PI / 2;
      hl.position.set(hx, 0.55, 2.01);
      car.add(hl);
    });

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.2, 14);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b });
    [
      [-0.88, 0.32, 1.2], [0.88, 0.32, 1.2],
      [-0.88, 0.32, -1.2], [0.88, 0.32, -1.2]
    ].forEach(([x, y, z]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(x, y, z);
      w.rotation.z = Math.PI / 2;
      car.add(w);
    });

    return car;
  }
}
