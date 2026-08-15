import * as THREE from 'three';
import { ProceduralTextureFactory } from './proceduralTextures';

export class BuildingFactory {
  /**
   * Creates Sharma Ji Ki Chai Tapri (Roadside Stall)
   */
  public static createChaiTapri(): THREE.Group {
    const tapri = new THREE.Group();
    tapri.name = 'ChaiTapri';

    // Wooden Stall Counter & Shed
    const stallBase = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.1, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x5c2b0c, roughness: 0.85 })
    );
    stallBase.position.set(0, 0.55, 0);
    stallBase.castShadow = true;
    tapri.add(stallBase);

    // Corrugated Tin / Canvas Slanted Roof
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.1, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 })
    );
    roof.position.set(0, 2.7, 0.3);
    roof.rotation.x = Math.PI * 0.08;
    roof.castShadow = true;
    tapri.add(roof);

    // 4 Bamboo Poles supporting roof
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    [
      [-1.8, 0], [1.8, 0], [-1.8, 1.4], [1.8, 1.4]
    ].forEach(([px, pz]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.7, 8), poleMat);
      pole.position.set(px, 1.35, pz);
      tapri.add(pole);
    });

    // Big Brass Boiling Chai Kettle
    const kettle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.35, 0.45, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 })
    );
    kettle.position.set(-0.9, 1.35, 0.2);
    tapri.add(kettle);

    // Gas Burner with glowing blue flame
    const burner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.08, 12),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x60a5fa, emissiveIntensity: 0.8 })
    );
    burner.position.set(-0.9, 1.14, 0.2);
    tapri.add(burner);

    // Cutting Chai Glasses in Metal Wire Stand
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.2, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
    );
    stand.position.set(0.6, 1.2, 0.2);
    tapri.add(stand);

    // 6 Small Chai Glasses
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xfef08a, transmission: 0.6, transparent: true });
    for (let gx = -0.25; gx <= 0.25; gx += 0.2) {
      for (let gz = -0.1; gz <= 0.1; gz += 0.2) {
        const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.14, 10), glassMat);
        glass.position.set(0.6 + gx, 1.35, 0.2 + gz);
        tapri.add(glass);
      }
    }

    // Glass Jar with Bun Maska & Toast
    const jar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.4, 12),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.8, transparent: true })
    );
    jar.position.set(0, 1.3, -0.4);
    tapri.add(jar);

    // Signboard
    const tapriSignTex = ProceduralTextureFactory.getTapriSignTexture();
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 1.2),
      new THREE.MeshBasicMaterial({ map: tapriSignTex, side: THREE.DoubleSide })
    );
    sign.position.set(0, 3.2, 1.65);
    tapri.add(sign);

    // Roadside Wooden Stools & Bench
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.45, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 })
    );
    bench.position.set(0, 0.25, 2.4);
    bench.castShadow = true;
    tapri.add(bench);

    // Hanging Warm Lantern
    const lantern = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xf59e0b, emissiveIntensity: 1.2 })
    );
    lantern.position.set(0, 2.5, 0.6);
    tapri.add(lantern);

    const pointLight = new THREE.PointLight(0xf59e0b, 2.0, 12);
    pointLight.position.set(0, 2.4, 0.6);
    tapri.add(pointLight);

    return tapri;
  }

  /**
   * Creates New Bharat Men's Salon (Hollow Walk-In Building + Fully Detailed 3D Interior)
   */
  public static createBarberShop(): THREE.Group {
    const salon = new THREE.Group();
    salon.name = 'BarberShop';

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6, side: THREE.DoubleSide });
    const innerWallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.7, side: THREE.DoubleSide });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.1 });
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    // 1. Tiled Glossy Floor
    const floor = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.1, 7.0), floorMat);
    floor.position.set(0, 0.05, 0);
    floor.receiveShadow = true;
    salon.add(floor);

    // 2. Ceiling / Upper Floor
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.2, 7.2), ceilingMat);
    ceiling.position.set(0, 4.8, 0);
    salon.add(ceiling);

    // Upper facade floor box (sits above ceiling)
    const upperFloor = new THREE.Mesh(new THREE.BoxGeometry(8.2, 3.2, 7.2), wallMat);
    upperFloor.position.set(0, 6.5, 0);
    upperFloor.castShadow = true;
    salon.add(upperFloor);

    // 3. Back Interior Wall (with mirrors and shelves)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(8.0, 4.8, 0.25), innerWallMat);
    backWall.position.set(0, 2.4, -3.4);
    salon.add(backWall);

    // 4. Left Wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, 4.8, 7.0), innerWallMat);
    leftWall.position.set(-3.9, 2.4, 0);
    salon.add(leftWall);

    // 5. Right Wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, 4.8, 7.0), innerWallMat);
    rightWall.position.set(3.9, 2.4, 0);
    salon.add(rightWall);

    // 6. Front Facade: Pillars, Side Glass Windows & Wide Open Entrance (Doorway width 3.6m)
    // Left front wall panel
    const frontLeft = new THREE.Mesh(new THREE.BoxGeometry(2.0, 4.8, 0.25), wallMat);
    frontLeft.position.set(-2.9, 2.4, 3.4);
    salon.add(frontLeft);

    // Right front wall panel
    const frontRight = new THREE.Mesh(new THREE.BoxGeometry(2.0, 4.8, 0.25), wallMat);
    frontRight.position.set(2.9, 2.4, 3.4);
    salon.add(frontRight);

    // Front Over-Door Arch Beam
    const frontLintel = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.2, 0.25), wallMat);
    frontLintel.position.set(0, 4.2, 3.4);
    salon.add(frontLintel);

    // Signboard atop front entrance
    const barberSignTex = ProceduralTextureFactory.getBarberSignTexture();
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 1.8),
      new THREE.MeshBasicMaterial({ map: barberSignTex, side: THREE.DoubleSide })
    );
    sign.position.set(0, 4.6, 3.56);
    salon.add(sign);

    // Barber Pole on exterior corner with glowing rotation hint
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 2.2, 16),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, emissive: 0x991b1b, emissiveIntensity: 0.3 })
    );
    pole.position.set(3.85, 2.6, 3.55);
    salon.add(pole);

    // INTERIOR SALON DETAILS
    // Full-Wall Mirrors along back wall
    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      roughness: 0.05,
      metalness: 0.95
    });
    const mirror1 = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 2.2), mirrorMat);
    mirror1.position.set(-1.8, 2.4, -3.24);
    salon.add(mirror1);

    const mirror2 = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 2.2), mirrorMat);
    mirror2.position.set(1.8, 2.4, -3.24);
    salon.add(mirror2);

    // Wooden / Laminate Barber Work Counter
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
    const counter = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.95, 0.9), counterMat);
    counter.position.set(0, 0.48, -2.8);
    salon.add(counter);

    // Barber Tools on Counter: Talcum powder, Spray bottles, Scissors & Combs stand
    const talcMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const sprayMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 });

    [-1.8, 1.8].forEach((bx) => {
      // Talc Powder can
      const talc = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.28, 12), talcMat);
      talc.position.set(bx - 0.7, 1.1, -2.7);
      salon.add(talc);

      // Water spray bottle
      const spray = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.32, 12), sprayMat);
      spray.position.set(bx + 0.7, 1.12, -2.7);
      salon.add(spray);

      // Clipper & Comb stand
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.1, 0.25), chromeMat);
      stand.position.set(bx, 1.0, -2.65);
      salon.add(stand);
    });

    // Vintage Transistor Radio on shelf (playing 90s bollywood)
    const radioGroup = new THREE.Group();
    radioGroup.position.set(0, 1.15, -2.7);
    const radioBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.35, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
    );
    radioGroup.add(radioBody);
    const radioDial = new THREE.Mesh(
      new THREE.PlaneGeometry(0.3, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.8 })
    );
    radioDial.position.set(0, 0.05, 0.13);
    radioGroup.add(radioDial);
    salon.add(radioGroup);

    // 2 Deluxe Hydraulic Red Barber Chairs (facing mirror)
    [-1.8, 1.8].forEach((cx) => {
      const chairGroup = new THREE.Group();
      chairGroup.position.set(cx, 0, -1.8);

      // Chrome Heavy Pedestal Base
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.55, 0.35, 16),
        chromeMat
      );
      base.position.y = 0.18;
      chairGroup.add(base);

      // Hydraulic Stem
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.35, 12),
        chromeMat
      );
      stem.position.y = 0.45;
      chairGroup.add(stem);

      // Red Leather Cushion Seat
      const seatMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.85), seatMat);
      seat.position.y = 0.68;
      chairGroup.add(seat);

      // Backrest
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.9, 0.16), seatMat);
      back.position.set(0, 1.18, 0.35);
      chairGroup.add(back);

      // Headrest
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.12), seatMat);
      head.position.set(0, 1.7, 0.35);
      chairGroup.add(head);

      // Chrome Armrests
      [-0.45, 0.45].forEach((ax) => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.6), chromeMat);
        arm.position.set(ax, 0.92, 0.05);
        chairGroup.add(arm);
      });

      // Chrome Footrest
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.35), chromeMat);
      foot.position.set(0, 0.22, -0.5);
      chairGroup.add(foot);

      salon.add(chairGroup);
    });

    // Waiting Bench on the side wall
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.45, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 })
    );
    bench.position.set(-3.4, 0.25, 0.5);
    salon.add(bench);

    // Ceiling Fan with 3 blades
    const fanGroup = new THREE.Group();
    fanGroup.position.set(0, 4.4, 0);
    const fanMotor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.15, 12),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
    );
    fanGroup.add(fanMotor);
    for (let f = 0; f < 3; f++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.02, 0.22),
        new THREE.MeshStandardMaterial({ color: 0x64748b })
      );
      blade.rotation.y = (f * Math.PI * 2) / 3;
      blade.position.x = Math.cos((f * Math.PI * 2) / 3) * 0.7;
      blade.position.z = Math.sin((f * Math.PI * 2) / 3) * 0.7;
      fanGroup.add(blade);
    }
    salon.add(fanGroup);

    // Interior Warm Fluorescent Tube Lights
    [-1.5, 1.5].forEach((lz) => {
      const lightTube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 5.0, 10),
        new THREE.MeshStandardMaterial({ color: 0xffedd5, emissive: 0xfef08a, emissiveIntensity: 1.4 })
      );
      lightTube.rotation.z = Math.PI / 2;
      lightTube.position.set(0, 4.6, lz);
      salon.add(lightTube);
    });

    const intLight = new THREE.PointLight(0xfef08a, 2.5, 16);
    intLight.position.set(0, 4.0, 0);
    salon.add(intLight);

    return salon;
  }

  /**
   * Creates IndiTech Corporate Office Tower (Hollow Ground Floor Tech Lab + Upper Tower)
   */
  public static createCorporateOffice(): THREE.Group {
    const office = new THREE.Group();
    office.name = 'CorporateOffice';

    // 1. Ground Floor Hollow Interior
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const floor = new THREE.Mesh(new THREE.BoxGeometry(12.0, 0.1, 10.0), floorMat);
    floor.position.set(0, 0.05, 0);
    office.add(floor);

    // Ground Floor Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(12.2, 0.3, 10.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    ceiling.position.set(0, 4.0, 0);
    office.add(ceiling);

    // 2. Upper Corporate Tower Floors (y >= 4.15)
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const tower = new THREE.Mesh(new THREE.BoxGeometry(12.0, 10.0, 10.0), towerMat);
    tower.position.set(0, 9.15, 0);
    tower.castShadow = true;
    office.add(tower);

    // Reflective Glass Panels on Upper Tower
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.1,
      transmission: 0.6,
      transparent: true
    });
    for (let floorIdx = 1; floorIdx <= 2; floorIdx++) {
      const windowStrip = new THREE.Mesh(new THREE.PlaneGeometry(10.5, 2.2), glassMat);
      windowStrip.position.set(0, 5.5 + floorIdx * 3.0, 5.02);
      office.add(windowStrip);
    }

    // Glowing Rooftop Signboard
    const signTex = ProceduralTextureFactory.getOfficeSignTexture();
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(7.0, 2.2),
      new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide })
    );
    sign.position.set(0, 13.5, 5.04);
    office.add(sign);

    // Ground Floor Back & Side Walls
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(12.0, 4.0, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    backWall.position.set(0, 2.0, -4.9);
    office.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 4.0, 10.0),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    leftWall.position.set(-5.9, 2.0, 0);
    office.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 4.0, 10.0),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    rightWall.position.set(5.9, 2.0, 0);
    office.add(rightWall);

    // Ground Floor Open Entrance (Pillars & Glass)
    [-5.0, 5.0].forEach((px) => {
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 4.0, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x0284c7 })
      );
      pillar.position.set(px, 2.0, 4.9);
      office.add(pillar);
    });

    // INTERIOR DEVELOPER WORKSTATION
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.85, 1.8), deskMat);
    desk.position.set(0, 0.42, 0);
    office.add(desk);

    // Dual 4K Glowing Monitors
    [-0.9, 0.9].forEach((mx) => {
      const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.7, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.1 })
      );
      monitor.position.set(mx, 1.35, -0.4);
      monitor.rotation.y = mx > 0 ? -0.15 : 0.15;
      office.add(monitor);

      const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 })
      );
      stand.position.set(mx, 1.05, -0.4);
      office.add(stand);
    });

    // Keyboard, Mouse & Ceramic Coffee Mug
    const kb = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.03, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    kb.position.set(0, 0.87, 0.1);
    office.add(kb);

    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.07, 0.16, 12),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b })
    );
    mug.position.set(1.0, 0.95, 0.2);
    office.add(mug);

    // Ergonomic Mesh Swivel Chair
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0, 0, 0.8);
    const chairSeat = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.15, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
    );
    chairSeat.position.y = 0.55;
    chairGroup.add(chairSeat);

    const chairBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.8, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
    );
    chairBack.position.set(0, 0.95, 0.35);
    chairGroup.add(chairBack);
    office.add(chairGroup);

    // Interior Ambient Blue Bias Lighting
    const officeLight = new THREE.PointLight(0x60a5fa, 2.5, 16);
    officeLight.position.set(0, 3.2, 0);
    office.add(officeLight);

    return office;
  }

  /**
   * Creates DJ Rocky Baraat / Indian Wedding Dance Zone
   */
  public static createDJBaraat(): THREE.Group {
    const baraat = new THREE.Group();
    baraat.name = 'DJBaraat';

    // 1. Wedding Floral Welcome Arch (Genda Phool / Marigold yellow-orange garland gate)
    const archMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.8 });
    const archPillars = [
      [-3.0, 2.5, 0], [3.0, 2.5, 0]
    ];
    archPillars.forEach(([px, py, pz]) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 5.0, 12), archMat);
      p.position.set(px, py, pz);
      baraat.add(p);
    });

    const archBeam = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.6, 0.6), archMat);
    archBeam.position.set(0, 5.0, 0);
    baraat.add(archBeam);

    // Festive Marigold Balls
    for (let bx = -3.0; bx <= 3.0; bx += 0.5) {
      const mBall = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        new THREE.MeshStandardMaterial({
          color: bx % 1 === 0 ? 0xf59e0b : 0xdc2626,
          emissive: 0x78350f
        })
      );
      mBall.position.set(bx, 4.6, 0);
      baraat.add(mBall);
    }

    // 2. DJ Sound Generator Truck / Mobile Console
    const djTruck = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 2.4, 5.0),
      new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.5 })
    );
    djTruck.position.set(0, 1.4, -4.5);
    baraat.add(djTruck);

    // Massive Speaker Array Towers
    [-1.2, 1.2].forEach((sx) => {
      const spkTower = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 2.8, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 })
      );
      spkTower.position.set(sx, 3.2, -4.5);
      baraat.add(spkTower);

      // Subwoofer cones
      for (let cy = 2.2; cy <= 4.2; cy += 0.8) {
        const cone = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.15, 0.1, 16),
          new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0x9d174d, emissiveIntensity: 0.5 })
        );
        cone.rotation.x = Math.PI / 2;
        cone.position.set(sx, cy, -4.0);
        baraat.add(cone);
      }
    });

    // DJ Signboard
    const djSignTex = ProceduralTextureFactory.getBaraatSignTexture();
    const djSign = new THREE.Mesh(
      new THREE.PlaneGeometry(4.0, 1.6),
      new THREE.MeshBasicMaterial({ map: djSignTex, side: THREE.DoubleSide })
    );
    djSign.position.set(0, 3.0, -1.8);
    baraat.add(djSign);

    // Strobe RGB Party Light
    const partyLight = new THREE.PointLight(0xec4899, 3.0, 18);
    partyLight.position.set(0, 4.0, -2.0);
    baraat.add(partyLight);

    return baraat;
  }

  /**
   * Creates Coke Studio Concert Amphitheater Stage
   */
  public static createConcertStage(): THREE.Group {
    const concert = new THREE.Group();
    concert.name = 'ConcertStage';

    // 1. Elevated Stage Deck
    const stage = new THREE.Mesh(
      new THREE.BoxGeometry(12.0, 1.2, 8.0),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 })
    );
    stage.position.set(0, 0.6, 0);
    stage.castShadow = true;
    concert.add(stage);

    // 2. Heavy Aluminum Truss Frame
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    [
      [-5.5, -3.5], [5.5, -3.5], [-5.5, 3.5], [5.5, 3.5]
    ].forEach(([tx, tz]) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 7.0, 8), trussMat);
      col.position.set(tx, 4.0, tz);
      concert.add(col);
    });

    const trussRoof = new THREE.Mesh(new THREE.BoxGeometry(12.0, 0.3, 8.0), trussMat);
    trussRoof.position.set(0, 7.5, 0);
    concert.add(trussRoof);

    // Stage Backdrop Banner
    const bannerTex = ProceduralTextureFactory.getConcertSignTexture();
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(10.0, 4.5),
      new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide })
    );
    banner.position.set(0, 4.5, -3.9);
    concert.add(banner);

    // Array Line Speakers hanging from truss
    [-4.5, 4.5].forEach((lx) => {
      const lineSpk = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 3.2, 1.0),
        new THREE.MeshStandardMaterial({ color: 0x09090b })
      );
      lineSpk.position.set(lx, 5.0, 2.0);
      concert.add(lineSpk);
    });

    // Dynamic Concert Stage Moving Headlights (Purple / Cyan)
    const stageLight1 = new THREE.SpotLight(0xa855f7, 4.0, 30, Math.PI * 0.25, 0.5);
    stageLight1.position.set(-4, 7.0, 2);
    stageLight1.target.position.set(0, 1.0, 6);
    concert.add(stageLight1);
    concert.add(stageLight1.target);

    const stageLight2 = new THREE.SpotLight(0x06b6d4, 4.0, 30, Math.PI * 0.25, 0.5);
    stageLight2.position.set(4, 7.0, 2);
    stageLight2.target.position.set(0, 1.0, 6);
    concert.add(stageLight2);
    concert.add(stageLight2.target);

    return concert;
  }

  /**
   * Creates Nizamuddin Haveli Sufi Mahfil-e-Qawwali Courtyard
   */
  public static createMahfil(): THREE.Group {
    const mahfil = new THREE.Group();
    mahfil.name = 'MahfilCourtyard';

    // 1. Carved Mughal Sandstone Heritage Pavilion
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 }); // Red sandstone
    const pavilion = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.5, 10.0), stoneMat);
    pavilion.position.set(0, 0.25, 0);
    mahfil.add(pavilion);

    // Carved Jali Heritage Columns
    [
      [-4.5, -4.5], [4.5, -4.5], [-4.5, 4.5], [4.5, 4.5]
    ].forEach(([cx, cz]) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 4.5, 12), stoneMat);
      col.position.set(cx, 2.5, cz);
      mahfil.add(col);
    });

    // Heritage Jali Arches Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.4, 10.5), stoneMat);
    roof.position.set(0, 4.8, 0);
    mahfil.add(roof);

    // 2. Persian Silk Carpet on the Floor
    const carpetTex = ProceduralTextureFactory.getMahfilCarpetTexture();
    const carpet = new THREE.Mesh(
      new THREE.PlaneGeometry(8.5, 8.5),
      new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 0.85 })
    );
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.51, 0);
    mahfil.add(carpet);

    // 3. Velvet Bolsters (Gaddi & Takiya) for sitting
    const gaddiMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.7 });
    const bolsterMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });

    for (let r = 0; r < 4; r++) {
      const angle = (r * Math.PI) / 2;
      const gx = Math.cos(angle) * 2.8;
      const gz = Math.sin(angle) * 2.8;

      // Sitting mattress
      const mat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 1.2), gaddiMat);
      mat.position.set(gx, 0.6, gz);
      mat.rotation.y = angle;
      mahfil.add(mat);

      // Cylindrical bolster pillow (Takiya)
      const takiya = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.6, 12), bolsterMat);
      takiya.rotation.z = Math.PI / 2;
      takiya.rotation.y = angle;
      takiya.position.set(gx * 1.2, 0.8, gz * 1.2);
      mahfil.add(takiya);
    }

    // 4. Center Brass Baithak Table with Harmonium & Tabla
    const centerTable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.9, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 })
    );
    centerTable.position.set(0, 0.65, 0);
    mahfil.add(centerTable);

    // Harmonium
    const harmonium = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.25, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 })
    );
    harmonium.position.set(-0.25, 0.9, 0);
    mahfil.add(harmonium);

    // Tabla Pair (Dayan & Bayan)
    const bayan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.14, 0.3, 12),
      new THREE.MeshStandardMaterial({ color: 0x78350f, metalness: 0.4 })
    );
    bayan.position.set(0.3, 0.9, -0.15);
    mahfil.add(bayan);

    const dayan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.12, 0.3, 12),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 })
    );
    dayan.position.set(0.3, 0.9, 0.18);
    mahfil.add(dayan);

    // 5. Hanging Brass Fanoos Lanterns
    const lantern = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.35, 0),
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.5,
        wireframe: false
      })
    );
    lantern.position.set(0, 3.4, 0);
    mahfil.add(lantern);

    const candleLight = new THREE.PointLight(0xf59e0b, 2.5, 14);
    candleLight.position.set(0, 3.2, 0);
    mahfil.add(candleLight);

    return mahfil;
  }

  /**
   * Creates City Residential / Commercial building block with balconies, ACs, and posters
   */
  public static createCityBuilding(
    width: number = 10,
    height: number = 12,
    depth: number = 8,
    color: number = 0xfef3c7,
    posterIdx: number = 0
  ): THREE.Group {
    const building = new THREE.Group();

    // Main concrete structure
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color, roughness: 0.75 })
    );
    body.position.y = height / 2;
    body.castShadow = true;
    building.add(body);

    // Rooftop Sintex Water Tank (Black/Blue plastic tank)
    const tank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 })
    );
    tank.position.set(width * 0.25, height + 0.6, 0);
    building.add(tank);

    // Windows with warm evening light
    const winMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.6
    });

    const floors = Math.floor(height / 3.0);
    for (let f = 1; f < floors; f++) {
      const y = f * 3.0;
      for (let wx = -width / 2 + 2; wx <= width / 2 - 2; wx += 2.8) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.4), winMat);
        win.position.set(wx, y, depth / 2 + 0.02);
        building.add(win);

        // Balcony railing
        const railing = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 0.6, 0.5),
          new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 })
        );
        railing.position.set(wx, y - 0.5, depth / 2 + 0.3);
        building.add(railing);
      }
    }

    // Bollywood / Street poster on ground level
    const posterTex = ProceduralTextureFactory.getMoviePosterTexture(posterIdx);
    const poster = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 2.7),
      new THREE.MeshBasicMaterial({ map: posterTex, side: THREE.DoubleSide })
    );
    poster.position.set(-width * 0.25, 1.6, depth / 2 + 0.03);
    building.add(poster);

    return building;
  }
}
