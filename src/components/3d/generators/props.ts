import * as THREE from 'three';
import { ProceduralTextureFactory } from './proceduralTextures';

export class PropFactory {
  /**
   * Creates an Indian Electric Utility Pole with transformer and street lamp
   */
  public static createElectricPole(): THREE.Group {
    const poleGroup = new THREE.Group();

    // Main concrete/steel pole
    const poleGeo = new THREE.CylinderGeometry(0.18, 0.22, 9.0, 10);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 4.5;
    pole.castShadow = true;
    poleGroup.add(pole);

    // Cross arms for wires
    const armMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const arm1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.12), armMat);
    arm1.position.set(0, 8.2, 0);
    poleGroup.add(arm1);

    const arm2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.12), armMat);
    arm2.position.set(0, 7.4, 0);
    poleGroup.add(arm2);

    // Ceramic Insulators
    [-1.0, -0.5, 0.5, 1.0].forEach((ix) => {
      const ins = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.08, 0.25, 8),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
      );
      ins.position.set(ix, 8.4, 0);
      poleGroup.add(ins);
    });

    // Streetlamp fixture with warm pool light
    const lampArm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.08), armMat);
    lampArm.position.set(0.6, 6.8, 0);
    lampArm.rotation.z = -Math.PI * 0.1;
    poleGroup.add(lampArm);

    const lampBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 1.5 })
    );
    lampBulb.position.set(1.2, 6.4, 0);
    poleGroup.add(lampBulb);

    const streetLight = new THREE.PointLight(0xf59e0b, 1.8, 16);
    streetLight.position.set(1.2, 6.2, 0);
    poleGroup.add(streetLight);

    return poleGroup;
  }

  /**
   * Creates an Indian Street Chaat / Fruit Vendor Cart (Thela)
   */
  public static createVendorThela(isFruit: boolean = false): THREE.Group {
    const thela = new THREE.Group();

    // Wooden cart body
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.25, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 })
    );
    base.position.y = 0.85;
    thela.add(base);

    // 4 Big Spoke Bicycle Wheels
    const wheelGeo = new THREE.TorusGeometry(0.4, 0.04, 8, 20);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b });
    [
      [-1.0, 0.45, 0.65], [1.0, 0.45, 0.65],
      [-1.0, 0.45, -0.65], [1.0, 0.45, -0.65]
    ].forEach(([wx, wy, wz]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(wx, wy, wz);
      thela.add(w);
    });

    // Cart Canopy (Striped Blue/White or Yellow/Red)
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.1, 1.5),
      new THREE.MeshStandardMaterial({ color: isFruit ? 0x16a34a : 0xdc2626, roughness: 0.6 })
    );
    canopy.position.set(0, 2.3, 0);
    thela.add(canopy);

    // 4 Corner Wooden Uprights
    [
      [-1.1, 0.6], [1.1, 0.6], [-1.1, -0.6], [1.1, -0.6]
    ].forEach(([px, pz]) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6),
        new THREE.MeshStandardMaterial({ color: 0x451a03 })
      );
      pole.position.set(px, 1.6, pz);
      thela.add(pole);
    });

    // Stainless Steel Bowls / Fruit Pyramids
    if (!isFruit) {
      // Chaat Stainless Bowls (Sev Puri / Pani Puri pots)
      for (let bx = -0.7; bx <= 0.7; bx += 0.45) {
        const bowl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.12, 0.16, 12),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 })
        );
        bowl.position.set(bx, 1.05, 0);
        thela.add(bowl);
      }
    } else {
      // Mango / Apple fruit mounds
      const fruitMat1 = new THREE.MeshStandardMaterial({ color: 0xf59e0b }); // Mangoes
      const fruitMat2 = new THREE.MeshStandardMaterial({ color: 0xdc2626 }); // Apples
      const m1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25, 0), fruitMat1);
      m1.position.set(-0.5, 1.1, 0);
      thela.add(m1);
      const m2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25, 0), fruitMat2);
      m2.position.set(0.5, 1.1, 0);
      thela.add(m2);
    }

    return thela;
  }

  /**
   * Creates an Indian Neem / Banyan shade tree
   */
  public static createTree(scale: number = 1.0): THREE.Group {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.35 * scale, 0.55 * scale, 4.5 * scale, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 2.25 * scale;
    trunk.castShadow = true;
    tree.add(trunk);

    // Lush Foliage Canopy Clustered Spheres
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    const canopyCoords = [
      [0, 4.5, 0, 1.8],
      [-1.0, 4.2, 0.6, 1.3],
      [1.0, 4.2, -0.6, 1.4],
      [0.2, 5.4, 0.3, 1.5],
      [-0.6, 4.8, -0.8, 1.2],
    ];

    canopyCoords.forEach(([cx, cy, cz, r]) => {
      const leaf = new THREE.Mesh(new THREE.DodecahedronGeometry(r * scale, 1), leafMat);
      leaf.position.set(cx * scale, cy * scale, cz * scale);
      leaf.castShadow = true;
      tree.add(leaf);
    });

    return tree;
  }

  /**
   * Creates Highway / Street Milestone marker (e.g. "NH 48 / DHUNMARG 0 KM")
   */
  public static createMilestone(): THREE.Group {
    const stone = new THREE.Group();

    const lower = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.7, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })
    );
    lower.position.y = 0.35;
    stone.add(lower);

    // Yellow curved top cap (National Highway style)
    const upper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.4, 12, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 })
    );
    upper.rotation.z = Math.PI / 2;
    upper.position.set(0, 0.7, 0);
    stone.add(upper);

    return stone;
  }
}
