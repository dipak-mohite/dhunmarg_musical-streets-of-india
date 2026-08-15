import * as THREE from 'three';
import { AvatarGender } from '../../../types';

export interface AnimatedNPC {
  group: THREE.Group;
  type: 'walker' | 'dancer' | 'sitter' | 'chaiwala' | 'barber';
  update: (delta: number, time: number) => void;
}

export interface PlayableAvatarInstance {
  group: THREE.Group;
  gender: AvatarGender;
  update: (
    delta: number,
    speed: number,
    isSprint: boolean,
    isMoving: boolean,
    moveHeading: number,
    isSitting?: boolean
  ) => void;
  setVisible: (visible: boolean) => void;
}

export class CharacterFactory {
  /**
   * Creates a high-fidelity playable 3D character with articulated joints & dynamic clothing
   */
  public static createPlayableAvatar(gender: AvatarGender = 'man'): PlayableAvatarInstance {
    const group = new THREE.Group();
    group.name = `player_avatar_${gender}`;

    // Skin tones & fabrics
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xd49b6a, // Warm South Asian tone
      roughness: 0.65,
      metalness: 0.05
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.8
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.25
    });

    // 1. Root Hips / Pelvis
    const hipsGroup = new THREE.Group();
    hipsGroup.position.set(0, 0.88, 0);
    group.add(hipsGroup);

    // 2. Torso Group
    const torsoGroup = new THREE.Group();
    hipsGroup.add(torsoGroup);

    // 3. Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.65, 0);
    torsoGroup.add(headGroup);

    // 4. Arms pivots (attached to torso at shoulders)
    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.28, 0.52, 0);
    torsoGroup.add(leftArmPivot);

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.28, 0.52, 0);
    torsoGroup.add(rightArmPivot);

    // 5. Leg pivots (attached to hips with 2-joint thigh & knee articulation)
    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.14, 0, 0);
    hipsGroup.add(leftLegPivot);

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.14, 0, 0);
    hipsGroup.add(rightLegPivot);

    const leftKneePivot = new THREE.Group();
    leftKneePivot.position.set(0, -0.44, 0);
    leftLegPivot.add(leftKneePivot);

    const rightKneePivot = new THREE.Group();
    rightKneePivot.position.set(0, -0.44, 0);
    rightLegPivot.add(rightKneePivot);

    if (gender === 'man') {
      // --- MAN AVATAR DESIGN (Modern Nehru Jacket & Kurta / Chinos) ---
      const kurtaMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.5 }); // Teal/Emerald Kurta
      const jacketMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 }); // Deep Indigo Nehru Jacket
      const pantsMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.7 }); // Off-white pyjama/chinos
      const shoeMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 }); // Tan leather mojari shoes

      // Torso & Waistcoat
      const kurtaMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.58, 12), kurtaMat);
      kurtaMesh.position.y = 0.28;
      kurtaMesh.castShadow = true;
      torsoGroup.add(kurtaMesh);

      // Nehru Jacket Vest
      const vestMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.25, 0.44, 12), jacketMat);
      vestMesh.position.y = 0.33;
      vestMesh.castShadow = true;
      torsoGroup.add(vestMesh);

      // Mandarin Collar
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12), jacketMat);
      collar.position.y = 0.58;
      torsoGroup.add(collar);

      // Pocket Handkerchief / Brooch
      const brooch = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.02), goldMat);
      brooch.position.set(0.11, 0.44, 0.21);
      torsoGroup.add(brooch);

      // Head & Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.12, 8), skinMat);
      neck.position.y = 0.02;
      headGroup.add(neck);

      const face = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), skinMat);
      face.position.y = 0.14;
      face.castShadow = true;
      headGroup.add(face);

      // Stylish Undercut / Hair
      const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.155, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
      hairTop.position.set(0, 0.16, 0.01);
      headGroup.add(hairTop);

      // Smart Glasses / Wayfarers
      const glassesFrame = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.04), new THREE.MeshBasicMaterial({ color: 0x09090b }));
      glassesFrame.position.set(0, 0.15, 0.14);
      headGroup.add(glassesFrame);

      // Left Arm
      const lUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.28, 8), kurtaMat);
      lUpperArm.position.y = -0.14;
      lUpperArm.castShadow = true;
      leftArmPivot.add(lUpperArm);

      const lForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.25, 8), skinMat);
      lForearm.position.y = -0.38;
      lForearm.castShadow = true;
      leftArmPivot.add(lForearm);

      // Smartwatch on left wrist
      const watch = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.015, 6, 12), goldMat);
      watch.position.y = -0.46;
      watch.rotation.x = Math.PI / 2;
      leftArmPivot.add(watch);

      const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), skinMat);
      lHand.position.y = -0.52;
      leftArmPivot.add(lHand);

      // Right Arm
      const rUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.28, 8), kurtaMat);
      rUpperArm.position.y = -0.14;
      rUpperArm.castShadow = true;
      rightArmPivot.add(rUpperArm);

      const rForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.25, 8), skinMat);
      rForearm.position.y = -0.38;
      rForearm.castShadow = true;
      rightArmPivot.add(rForearm);

      const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), skinMat);
      rHand.position.y = -0.52;
      rightArmPivot.add(rHand);

      // Articulated Legs (Thigh + Calf Knee)
      const createLeg = (thighPivot: THREE.Group, kneePivot: THREE.Group) => {
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.075, 0.44, 10), pantsMat);
        thigh.position.y = -0.22;
        thigh.castShadow = true;
        thighPivot.add(thigh);

        const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.42, 10), pantsMat);
        calf.position.y = -0.21;
        calf.castShadow = true;
        kneePivot.add(calf);

        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.22), shoeMat);
        shoe.position.set(0, -0.42, 0.04);
        shoe.castShadow = true;
        kneePivot.add(shoe);
      };

      createLeg(leftLegPivot, leftKneePivot);
      createLeg(rightLegPivot, rightKneePivot);

    } else {
      // --- WOMAN AVATAR DESIGN (Contemporary Kurti, Dupatta & Jhumkas) ---
      const kurtiMat = new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.45 }); // Magenta Pink Kurti
      const dupattaMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5, side: THREE.DoubleSide }); // Golden Amber Dupatta
      const pantsMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 }); // Silk White Palazzo
      const juttiMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35 }); // Golden Embroidered Jutti

      // Kurti Torso
      const kurtiMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.26, 0.62, 12), kurtiMat);
      kurtiMesh.position.y = 0.27;
      kurtiMesh.castShadow = true;
      torsoGroup.add(kurtiMesh);

      // Elegant Dupatta Stole (Draped gracefully over left shoulder)
      const dupattaDrape = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.28, 0.52, 12, 1, true, 0, Math.PI * 1.2),
        dupattaMat
      );
      dupattaDrape.position.set(-0.04, 0.3, 0);
      dupattaDrape.rotation.y = Math.PI * 0.3;
      torsoGroup.add(dupattaDrape);

      // Head & Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.12, 8), skinMat);
      neck.position.y = 0.02;
      headGroup.add(neck);

      const face = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), skinMat);
      face.position.y = 0.14;
      face.castShadow = true;
      headGroup.add(face);

      // Bindi on Forehead
      const bindi = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), new THREE.MeshBasicMaterial({ color: 0xb91c1c }));
      bindi.position.set(0, 0.17, 0.135);
      headGroup.add(bindi);

      // Jhumka Earrings (Gold Drops)
      const lJhumka = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 6), goldMat);
      lJhumka.position.set(-0.15, 0.09, 0);
      lJhumka.rotation.x = Math.PI;
      headGroup.add(lJhumka);

      const rJhumka = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 6), goldMat);
      rJhumka.position.set(0.15, 0.09, 0);
      rJhumka.rotation.x = Math.PI;
      headGroup.add(rJhumka);

      // Elegant Hair Bun & Long Braid
      const hairBun = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), hairMat);
      hairBun.position.set(0, 0.15, -0.02);
      headGroup.add(hairBun);

      const hairBraid = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.025, 0.42, 8), hairMat);
      hairBraid.position.set(0, -0.08, -0.12);
      hairBraid.rotation.x = 0.15;
      headGroup.add(hairBraid);

      // Left Arm with Bangles
      const lUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.26, 8), kurtiMat);
      lUpperArm.position.y = -0.13;
      lUpperArm.castShadow = true;
      leftArmPivot.add(lUpperArm);

      const lForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.24, 8), skinMat);
      lForearm.position.y = -0.36;
      leftArmPivot.add(lForearm);

      // Colorful Glass Bangles
      const bangle1 = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.01, 6, 12), goldMat);
      bangle1.position.y = -0.42;
      bangle1.rotation.x = Math.PI / 2;
      leftArmPivot.add(bangle1);

      const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), skinMat);
      lHand.position.y = -0.50;
      leftArmPivot.add(lHand);

      // Right Arm
      const rUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.26, 8), kurtiMat);
      rUpperArm.position.y = -0.13;
      rUpperArm.castShadow = true;
      rightArmPivot.add(rUpperArm);

      const rForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.24, 8), skinMat);
      rForearm.position.y = -0.36;
      rightArmPivot.add(rForearm);

      const bangle2 = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.01, 6, 12), goldMat);
      bangle2.position.y = -0.42;
      bangle2.rotation.x = Math.PI / 2;
      rightArmPivot.add(bangle2);

      const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), skinMat);
      rHand.position.y = -0.50;
      rightArmPivot.add(rHand);

      // Palazzo Pants Articulated Legs
      const createLeg = (thighPivot: THREE.Group, kneePivot: THREE.Group) => {
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.44, 10), pantsMat);
        thigh.position.y = -0.22;
        thigh.castShadow = true;
        thighPivot.add(thigh);

        const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.085, 0.42, 10), pantsMat);
        calf.position.y = -0.21;
        calf.castShadow = true;
        kneePivot.add(calf);

        const jutti = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.2), juttiMat);
        jutti.position.set(0, -0.42, 0.03);
        jutti.castShadow = true;
        kneePivot.add(jutti);
      };

      createLeg(leftLegPivot, leftKneePivot);
      createLeg(rightLegPivot, rightKneePivot);
    }

    // Animation variables
    let walkPhase = 0;
    let currentAvatarYaw = 0;

    return {
      group,
      gender,
      setVisible: (visible: boolean) => {
        group.visible = visible;
      },
      update: (
        delta: number,
        _speed: number,
        isSprint: boolean,
        isMoving: boolean,
        moveHeading: number,
        isSitting: boolean = false
      ) => {
        if (isSitting) {
          // Sitting comfortably on Barber Chair, Bus Seat, Truck Cabin, Auto Bench, or Tapri Stool
          hipsGroup.position.y = THREE.MathUtils.lerp(hipsGroup.position.y, 0.46, delta * 10);

          // Thighs extend forward horizontally along the seat cushion
          leftLegPivot.rotation.x = THREE.MathUtils.lerp(leftLegPivot.rotation.x, Math.PI * 0.48, delta * 10);
          rightLegPivot.rotation.x = THREE.MathUtils.lerp(rightLegPivot.rotation.x, Math.PI * 0.48, delta * 10);

          // Knees bend down 90 degrees so calves drop naturally in front of seat
          leftKneePivot.rotation.x = THREE.MathUtils.lerp(leftKneePivot.rotation.x, -Math.PI * 0.48, delta * 10);
          rightKneePivot.rotation.x = THREE.MathUtils.lerp(rightKneePivot.rotation.x, -Math.PI * 0.48, delta * 10);

          // Arms rest naturally forward on armrests or lap
          leftArmPivot.rotation.x = THREE.MathUtils.lerp(leftArmPivot.rotation.x, 0.35, delta * 10);
          rightArmPivot.rotation.x = THREE.MathUtils.lerp(rightArmPivot.rotation.x, 0.35, delta * 10);
          leftArmPivot.rotation.z = THREE.MathUtils.lerp(leftArmPivot.rotation.z, -0.12, delta * 10);
          rightArmPivot.rotation.z = THREE.MathUtils.lerp(rightArmPivot.rotation.z, 0.12, delta * 10);

          // Relaxed spine against chair backrest
          torsoGroup.position.y = THREE.MathUtils.lerp(torsoGroup.position.y, 0, delta * 10);
          torsoGroup.rotation.x = THREE.MathUtils.lerp(torsoGroup.rotation.x, -0.05, delta * 10);
          torsoGroup.rotation.z = 0;
          headGroup.rotation.y = 0;
          return;
        }

        // Standing / walking posture
        hipsGroup.position.y = THREE.MathUtils.lerp(hipsGroup.position.y, 0.88, delta * 8);
        torsoGroup.rotation.x = THREE.MathUtils.lerp(torsoGroup.rotation.x, 0, delta * 8);
        leftArmPivot.rotation.z = THREE.MathUtils.lerp(leftArmPivot.rotation.z, 0, delta * 8);
        rightArmPivot.rotation.z = THREE.MathUtils.lerp(rightArmPivot.rotation.z, 0, delta * 8);

        if (isMoving) {
          // Smooth rotation to face movement heading
          const diff = ((moveHeading - currentAvatarYaw + Math.PI) % (Math.PI * 2)) - Math.PI;
          currentAvatarYaw += diff * Math.min(1, delta * 14);
          group.rotation.y = currentAvatarYaw;

          // Stride animation speed
          const freq = isSprint ? 14.0 : 8.5;
          walkPhase += delta * freq;

          const strideAmp = isSprint ? 0.85 : 0.55;
          const armAmp = isSprint ? 0.75 : 0.48;

          leftLegPivot.rotation.x = Math.sin(walkPhase) * strideAmp;
          rightLegPivot.rotation.x = -Math.sin(walkPhase) * strideAmp;

          // Natural knee flexion on backstride
          leftKneePivot.rotation.x = -Math.max(0, -Math.sin(walkPhase) * strideAmp * 0.75);
          rightKneePivot.rotation.x = -Math.max(0, Math.sin(walkPhase) * strideAmp * 0.75);

          leftArmPivot.rotation.x = -Math.sin(walkPhase) * armAmp;
          rightArmPivot.rotation.x = Math.sin(walkPhase) * armAmp;

          // Slight torso bounce and side-to-side natural sway
          torsoGroup.position.y = Math.abs(Math.sin(walkPhase * 2)) * (isSprint ? 0.06 : 0.03);
          torsoGroup.rotation.z = Math.sin(walkPhase) * (isSprint ? 0.06 : 0.03);
          headGroup.rotation.y = Math.sin(walkPhase) * 0.05;
        } else {
          // Idle stance - smoothly return limbs
          walkPhase += delta * 2.0; // Idle breathing
          currentAvatarYaw = moveHeading;
          group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, currentAvatarYaw, delta * 6);

          leftLegPivot.rotation.x = THREE.MathUtils.lerp(leftLegPivot.rotation.x, 0, delta * 10);
          rightLegPivot.rotation.x = THREE.MathUtils.lerp(rightLegPivot.rotation.x, 0, delta * 10);
          leftKneePivot.rotation.x = THREE.MathUtils.lerp(leftKneePivot.rotation.x, 0, delta * 10);
          rightKneePivot.rotation.x = THREE.MathUtils.lerp(rightKneePivot.rotation.x, 0, delta * 10);

          // Subtle idle arm swing & breathing
          leftArmPivot.rotation.x = THREE.MathUtils.lerp(leftArmPivot.rotation.x, Math.sin(walkPhase) * 0.05, delta * 8);
          rightArmPivot.rotation.x = THREE.MathUtils.lerp(rightArmPivot.rotation.x, -Math.sin(walkPhase) * 0.05, delta * 8);

          torsoGroup.position.y = Math.sin(walkPhase) * 0.015;
          torsoGroup.rotation.z = 0;
          headGroup.rotation.y = Math.sin(walkPhase * 0.5) * 0.08;
        }
      }
    };
  }

  /**
   * Helper to create a stylized background NPC pedestrian/dancer
   */
  public static createCharacter(
    shirtColor: number = 0xef4444,
    pantsColor: number = 0x1e293b,
    hasTurban: boolean = false,
    turbanColor: number = 0xf59e0b
  ) {
    const group = new THREE.Group();

    // 1. Torso / Kurta
    const torsoGeo = new THREE.BoxGeometry(0.55, 0.75, 0.35);
    const torsoMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.6 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    group.add(torso);

    // 2. Head & Hair / Turban
    const head = new THREE.Group();
    head.position.set(0, 1.7, 0);

    const face = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.7 }) // Indian warm skin tone
    );
    head.add(face);

    if (hasTurban) {
      // Royal Pagri / Turban
      const turban = new THREE.Mesh(
        new THREE.TorusGeometry(0.22, 0.08, 8, 16),
        new THREE.MeshStandardMaterial({ color: turbanColor })
      );
      turban.rotation.x = Math.PI / 2;
      turban.position.y = 0.08;
      head.add(turban);
    } else {
      // Dark Hair
      const hair = new THREE.Mesh(
        new THREE.SphereGeometry(0.21, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0x171717 })
      );
      hair.position.y = 0.05;
      head.add(hair);
    }
    group.add(head);

    // 3. Arms
    const armGeo = new THREE.BoxGeometry(0.14, 0.65, 0.14);
    const armMat = new THREE.MeshStandardMaterial({ color: shirtColor });

    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.35, 1.15, 0);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.35, 1.15, 0);
    group.add(rightArm);

    // 4. Legs
    const legGeo = new THREE.BoxGeometry(0.18, 0.75, 0.18);
    const legMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.7 });

    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.16, 0.4, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.16, 0.4, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);

    return { group, leftArm, rightArm, leftLeg, rightLeg, head };
  }

  /**
   * Creates an energetic Bhangra / Wedding Dancer for DJ Baraat
   */
  public static createBaraatiDancer(
    x: number,
    z: number,
    color: number = 0xec4899,
    hasTurban: boolean = true
  ): AnimatedNPC {
    const char = this.createCharacter(color, 0xf8fafc, hasTurban, 0xf59e0b);
    char.group.position.set(x, 0, z);

    const phase = Math.random() * Math.PI * 2;
    const danceSpeed = 5.0 + Math.random() * 1.5;

    return {
      group: char.group,
      type: 'dancer',
      update: (_delta, time) => {
        // Joyous Bhangra bounce up and down
        const bounce = Math.abs(Math.sin(time * danceSpeed + phase)) * 0.25;
        char.group.position.y = bounce;

        // Hands waving high in the air
        char.leftArm.rotation.x = Math.PI * 0.8 + Math.sin(time * danceSpeed + phase) * 0.4;
        char.leftArm.rotation.z = -0.3 + Math.cos(time * danceSpeed + phase) * 0.3;

        char.rightArm.rotation.x = Math.PI * 0.8 + Math.cos(time * danceSpeed + phase) * 0.4;
        char.rightArm.rotation.z = 0.3 - Math.sin(time * danceSpeed + phase) * 0.3;

        // Head sway
        char.head.rotation.y = Math.sin(time * 3 + phase) * 0.3;
        char.head.rotation.z = Math.cos(time * 3 + phase) * 0.15;
      }
    };
  }

  /**
   * Creates a Walking Pedestrian along sidewalk paths
   */
  public static createWalkingPedestrian(
    pathPoints: { x: number; z: number }[],
    speed: number = 2.0,
    color: number = 0x0284c7
  ): AnimatedNPC {
    const char = this.createCharacter(color, 0x334155, Math.random() > 0.6);
    let currentWaypoint = 0;
    char.group.position.set(pathPoints[0].x, 0, pathPoints[0].z);

    return {
      group: char.group,
      type: 'walker',
      update: (delta, time) => {
        const target = pathPoints[currentWaypoint];
        const currentPos = char.group.position;
        const dx = target.x - currentPos.x;
        const dz = target.z - currentPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 0.5) {
          currentWaypoint = (currentWaypoint + 1) % pathPoints.length;
        } else {
          const moveStep = Math.min(dist, speed * delta);
          currentPos.x += (dx / dist) * moveStep;
          currentPos.z += (dz / dist) * moveStep;
          char.group.rotation.y = Math.atan2(dx, dz);
        }

        // Arm and leg swinging animation
        const walkCycle = Math.sin(time * speed * 4);
        char.leftLeg.rotation.x = walkCycle * 0.6;
        char.rightLeg.rotation.x = -walkCycle * 0.6;
        char.leftArm.rotation.x = -walkCycle * 0.5;
        char.rightArm.rotation.x = walkCycle * 0.5;
      }
    };
  }
}
