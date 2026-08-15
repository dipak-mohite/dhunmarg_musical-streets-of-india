import * as THREE from 'three';

export interface BoxCollider {
  type: 'box';
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  name?: string;
}

export interface CylinderCollider {
  type: 'cylinder';
  x: number;
  z: number;
  radius: number;
  name?: string;
}

export type Collider = BoxCollider | CylinderCollider;

export class CollisionSystem {
  private static colliders: Collider[] = [];
  private static initialized: boolean = false;
  private static readonly PLAYER_RADIUS = 0.45;
  private static readonly WORLD_BOUNDS = 74;

  public static init() {
    if (this.initialized) return;
    this.colliders = [];

    // --- 1. Surrounding City Blocks (Skyscrapers & Buildings) ---
    const cityBlocks = [
      { x: -50, z: -50, w: 16, d: 16 },
      { x: -20, z: -50, w: 14, d: 14 },
      { x: -52, z: -20, w: 14, d: 12 },
      { x: -52, z: 25, w: 14, d: 16 },
      { x: -45, z: 52, w: 18, d: 16 },
      { x: 15, z: 52, w: 18, d: 16 },
      { x: 52, z: -10, w: 16, d: 16 },
      { x: 52, z: -48, w: 16, d: 14 },
      { x: 52, z: 52, w: 16, d: 16 },
    ];

    cityBlocks.forEach((b, idx) => {
      this.colliders.push({
        type: 'box',
        minX: b.x - b.w / 2,
        maxX: b.x + b.w / 2,
        minZ: b.z - b.d / 2,
        maxZ: b.z + b.d / 2,
        name: `CityBlock_${idx}`
      });
    });

    // --- 2. 16 Electric Utility Poles (Cylinders) ---
    const poleCoords = [
      [-7, -7], [7, -7], [-7, 7], [7, 7],
      [-22, -7], [-38, -7], [22, -7], [38, -7],
      [-7, -22], [-7, -38], [7, -22], [7, -38],
      [-7, 22], [-7, 38], [7, 22], [7, 38],
    ];
    poleCoords.forEach(([px, pz], i) => {
      this.colliders.push({
        type: 'cylinder',
        x: px,
        z: pz,
        radius: 0.35,
        name: `Pole_${i}`
      });
    });

    // --- 3. 8 Banyan & Neem Trees (Trunks) ---
    const treeCoords = [
      [-10, -12], [-18, -12], [-8, 20], [12, -8],
      [20, 8], [32, 12], [24, -16], [-28, 24]
    ];
    treeCoords.forEach(([tx, tz], i) => {
      this.colliders.push({
        type: 'cylinder',
        x: tx,
        z: tz,
        radius: 0.55,
        name: `Tree_${i}`
      });
    });

    // --- 4. Vendor Thelas (Street Food / Chaat Carts) ---
    // Thela 1 at (-8, 7)
    this.colliders.push({
      type: 'box',
      minX: -8 - 1.1,
      maxX: -8 + 1.1,
      minZ: 7 - 0.75,
      maxZ: 7 + 0.75,
      name: 'Thela_Chaat'
    });
    // Thela 2 at (7, 8)
    this.colliders.push({
      type: 'box',
      minX: 7 - 1.1,
      maxX: 7 + 1.1,
      minZ: 8 - 0.75,
      maxZ: 8 + 0.75,
      name: 'Thela_Fruit'
    });

    // --- 5. Parked Scooters ---
    // Scooter 1 at (-11, 14)
    this.colliders.push({
      type: 'cylinder',
      x: -11,
      z: 14,
      radius: 0.75,
      name: 'Scooter_1'
    });
    // Scooter 2 at (-22, -17)
    this.colliders.push({
      type: 'cylinder',
      x: -22,
      z: -17,
      radius: 0.75,
      name: 'Scooter_2'
    });

    // --- 6. The 9 Iconic Location Buildings (Outer Solid Structures with Walkable Interiors) ---

    // 1. Chai Tapri (-14, 0, 12): Main wooden counter & back wall
    this.colliders.push({
      type: 'box',
      minX: -16.2,
      maxX: -13.6,
      minZ: 10.2,
      maxZ: 12.8,
      name: 'Tapri_Kitchen_Counter'
    });

    // 2. New Bharat Men's Salon (-28, 0, -18): Back wall, Left wall, Right wall (Front is open entrance)
    // Left Wall
    this.colliders.push({
      type: 'box',
      minX: -32.8,
      maxX: -32.0,
      minZ: -21.8,
      maxZ: -14.2,
      name: 'Salon_Left_Wall'
    });
    // Right Wall
    this.colliders.push({
      type: 'box',
      minX: -24.0,
      maxX: -23.2,
      minZ: -21.8,
      maxZ: -14.2,
      name: 'Salon_Right_Wall'
    });
    // Back Wall
    this.colliders.push({
      type: 'box',
      minX: -32.8,
      maxX: -23.2,
      minZ: -22.2,
      maxZ: -21.4,
      name: 'Salon_Back_Wall'
    });

    // 3. Indian Highway Tata Truck (26, 0, 18): Truck cargo container & engine bonnet (Cabin inside is accessible)
    // Engine Hood
    this.colliders.push({
      type: 'cylinder',
      x: 29.2,
      z: 20.8,
      radius: 1.4,
      name: 'Truck_Front_Hood'
    });
    // Rear Cargo Container
    this.colliders.push({
      type: 'box',
      minX: 23.5,
      maxX: 28.5,
      minZ: 13.0,
      maxZ: 17.5,
      name: 'Truck_Cargo_Box'
    });

    // 4. Auto-Rickshaw (8, 0, -14): Front nose collision
    this.colliders.push({
      type: 'cylinder',
      x: 9.2,
      z: -14.8,
      radius: 0.9,
      name: 'Auto_Front_Nose'
    });

    // 5. State Bus (-18, 0, 36): Left side wall, back wall, engine hood (Front door is open)
    // Left outer side
    this.colliders.push({
      type: 'box',
      minX: -20.6,
      maxX: -19.8,
      minZ: 31.0,
      maxZ: 41.5,
      name: 'Bus_Side_Wall'
    });
    // Back rear wall
    this.colliders.push({
      type: 'box',
      minX: -20.6,
      maxX: -15.4,
      minZ: 30.2,
      maxZ: 31.0,
      name: 'Bus_Back_Wall'
    });
    // Front Engine Cap
    this.colliders.push({
      type: 'box',
      minX: -20.6,
      maxX: -15.4,
      minZ: 41.5,
      maxZ: 42.6,
      name: 'Bus_Front_Cap'
    });

    // 6. IndiTech Office Tower (34, 0, -26): Left, Right, Back walls (Front glass door is accessible)
    this.colliders.push({
      type: 'box',
      minX: 30.0,
      maxX: 30.8,
      minZ: -31.5,
      maxZ: -20.5,
      name: 'Office_Left_Wall'
    });
    this.colliders.push({
      type: 'box',
      minX: 37.2,
      maxX: 38.0,
      minZ: -31.5,
      maxZ: -20.5,
      name: 'Office_Right_Wall'
    });
    this.colliders.push({
      type: 'box',
      minX: 30.0,
      maxX: 38.0,
      minZ: -32.2,
      maxZ: -31.4,
      name: 'Office_Back_Wall'
    });

    // 7. DJ Baraat Stage Truck (-34, 0, 6): DJ Console & Giant Speaker Walls
    this.colliders.push({
      type: 'box',
      minX: -38.2,
      maxX: -34.8,
      minZ: 4.2,
      maxZ: 7.8,
      name: 'Baraat_DJ_Truck'
    });
    this.colliders.push({
      type: 'box',
      minX: -36.5,
      maxX: -35.2,
      minZ: 8.0,
      maxZ: 10.5,
      name: 'Baraat_Speaker_Left'
    });
    this.colliders.push({
      type: 'box',
      minX: -36.5,
      maxX: -35.2,
      minZ: 1.5,
      maxZ: 4.0,
      name: 'Baraat_Speaker_Right'
    });

    // 8. Coke Studio Live Stage (40, 0, 30): Stage Back Wall, Speaker Trusses & Side Wings
    this.colliders.push({
      type: 'box',
      minX: 42.0,
      maxX: 46.5,
      minZ: 26.0,
      maxZ: 34.0,
      name: 'Concert_Backstage_Wall'
    });
    this.colliders.push({
      type: 'box',
      minX: 38.0,
      maxX: 46.0,
      minZ: 33.8,
      maxZ: 35.2,
      name: 'Concert_Truss_Left'
    });
    this.colliders.push({
      type: 'box',
      minX: 38.0,
      maxX: 46.0,
      minZ: 24.8,
      maxZ: 26.2,
      name: 'Concert_Truss_Right'
    });

    // 9. Sufi Mahfil Haveli (16, 0, -40): Surrounding arched sandstone perimeter walls (Front Arch is open entrance)
    this.colliders.push({
      type: 'box',
      minX: 10.5,
      maxX: 11.4,
      minZ: -45.5,
      maxZ: -34.5,
      name: 'Mahfil_Left_Wall'
    });
    this.colliders.push({
      type: 'box',
      minX: 20.6,
      maxX: 21.5,
      minZ: -45.5,
      maxZ: -34.5,
      name: 'Mahfil_Right_Wall'
    });
    this.colliders.push({
      type: 'box',
      minX: 10.5,
      maxX: 21.5,
      minZ: -46.0,
      maxZ: -45.1,
      name: 'Mahfil_Back_Wall'
    });

    this.initialized = true;
  }

  /**
   * Checks if position (x, z) with player radius overlaps any obstacle.
   */
  public static checkCollision(x: number, z: number): boolean {
    if (!this.initialized) this.init();

    // World Boundary Check
    if (Math.abs(x) > this.WORLD_BOUNDS || Math.abs(z) > this.WORLD_BOUNDS) {
      return true;
    }

    const pr = this.PLAYER_RADIUS;

    for (let i = 0; i < this.colliders.length; i++) {
      const col = this.colliders[i];

      if (col.type === 'cylinder') {
        const dx = x - col.x;
        const dz = z - col.z;
        const distSq = dx * dx + dz * dz;
        const minDist = col.radius + pr;
        if (distSq < minDist * minDist) {
          return true;
        }
      } else if (col.type === 'box') {
        // Expand box by player radius
        if (
          x >= col.minX - pr &&
          x <= col.maxX + pr &&
          z >= col.minZ - pr &&
          z <= col.maxZ + pr
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Resolves player movement with sliding collision physics.
   * If direct movement causes a collision, it attempts to slide along X or Z axes.
   */
  public static resolveMovement(
    currentPos: THREE.Vector3,
    deltaX: number,
    deltaZ: number
  ): { x: number; z: number } {
    if (!this.initialized) this.init();

    const targetX = currentPos.x + deltaX;
    const targetZ = currentPos.z + deltaZ;

    // 1. Try full movement
    if (!this.checkCollision(targetX, targetZ)) {
      return { x: targetX, z: targetZ };
    }

    // 2. Try sliding along X axis only
    if (!this.checkCollision(targetX, currentPos.z)) {
      return { x: targetX, z: currentPos.z };
    }

    // 3. Try sliding along Z axis only
    if (!this.checkCollision(currentPos.x, targetZ)) {
      return { x: currentPos.x, z: targetZ };
    }

    // 4. Blocked completely
    return { x: currentPos.x, z: currentPos.z };
  }
}
