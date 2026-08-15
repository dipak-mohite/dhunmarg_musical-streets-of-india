import * as THREE from 'three';
import { LocationZone } from '../../../types';

export interface ZoneVisualMesh {
  zoneId: string;
  group: THREE.Group;
  outerRing: THREE.Mesh;
  innerRing: THREE.Mesh;
  rippleDisc1: THREE.Mesh;
  rippleDisc2: THREE.Mesh;
  lightPillar: THREE.Mesh;
  particles: THREE.Points;
  baseColor: THREE.Color;
  accentColor: THREE.Color;
  radius: number;
  isActive: boolean;
  pulsePhase: number;
}

export class ZoneVisualManager {
  private zoneMeshes: Map<string, ZoneVisualMesh> = new Map();
  public container: THREE.Group = new THREE.Group();

  constructor(locations: LocationZone[]) {
    this.container.name = 'ZoneVisualRings';
    this.createZoneVisuals(locations);
  }

  private createZoneVisuals(locations: LocationZone[]) {
    locations.forEach((loc) => {
      const zoneGroup = new THREE.Group();
      zoneGroup.position.set(loc.position.x, 0.04, loc.position.z);

      const baseCol = new THREE.Color(loc.accentColor || '#f59e0b');
      const brightCol = baseCol.clone().offsetHSL(0, 0.1, 0.15);
      const r = loc.radius;

      // 1. Outer Perimeter Ring (Dashed/Runed Acoustic Ring)
      const outerRingGeo = new THREE.RingGeometry(r - 0.22, r + 0.22, 64);
      const outerRingMat = new THREE.MeshBasicMaterial({
        color: baseCol,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
      });
      const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
      outerRing.rotation.x = -Math.PI / 2;
      zoneGroup.add(outerRing);

      // 2. Inner Concentric Audio Border Ring
      const innerRingGeo = new THREE.RingGeometry(r * 0.72 - 0.12, r * 0.72 + 0.12, 48);
      const innerRingMat = new THREE.MeshBasicMaterial({
        color: brightCol,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
      innerRing.rotation.x = -Math.PI / 2;
      zoneGroup.add(innerRing);

      // 3. Dynamic Expanding Acoustic Wave Ripple Disc 1
      const rippleGeo1 = new THREE.RingGeometry(0.5, 1.2, 48);
      const rippleMat1 = new THREE.MeshBasicMaterial({
        color: baseCol,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });
      const rippleDisc1 = new THREE.Mesh(rippleGeo1, rippleMat1);
      rippleDisc1.rotation.x = -Math.PI / 2;
      zoneGroup.add(rippleDisc1);

      // 4. Dynamic Expanding Acoustic Wave Ripple Disc 2
      const rippleGeo2 = new THREE.RingGeometry(0.5, 1.2, 48);
      const rippleMat2 = new THREE.MeshBasicMaterial({
        color: brightCol,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });
      const rippleDisc2 = new THREE.Mesh(rippleGeo2, rippleMat2);
      rippleDisc2.rotation.x = -Math.PI / 2;
      zoneGroup.add(rippleDisc2);

      // 5. Central Soft Holographic Music Cylinder Aura
      const pillarGeo = new THREE.CylinderGeometry(r * 0.25, r * 0.4, 3.8, 24, 1, true);
      const pillarMat = new THREE.MeshBasicMaterial({
        color: baseCol,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const lightPillar = new THREE.Mesh(pillarGeo, pillarMat);
      lightPillar.position.y = 1.9;
      zoneGroup.add(lightPillar);

      // 6. Perimeter Floating Music Spark Particles
      const particleCount = 28;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const theta = (i / particleCount) * Math.PI * 2;
        const dist = r * (0.4 + Math.random() * 0.55);
        posArray[i * 3] = Math.cos(theta) * dist;
        posArray[i * 3 + 1] = 0.2 + Math.random() * 2.2;
        posArray[i * 3 + 2] = Math.sin(theta) * dist;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        color: brightCol,
        size: 0.22,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      zoneGroup.add(particles);

      this.container.add(zoneGroup);

      this.zoneMeshes.set(loc.id, {
        zoneId: loc.id,
        group: zoneGroup,
        outerRing,
        innerRing,
        rippleDisc1,
        rippleDisc2,
        lightPillar,
        particles,
        baseColor: baseCol,
        accentColor: brightCol,
        radius: r,
        isActive: false,
        pulsePhase: Math.random() * Math.PI * 2
      });
    });
  }

  public update(delta: number, activeZoneId: string | null, _playerPos: THREE.Vector3) {
    this.zoneMeshes.forEach((mesh, id) => {
      const isZoneActive = activeZoneId === id;
      mesh.isActive = isZoneActive;
      mesh.pulsePhase += delta * (isZoneActive ? 3.2 : 1.2);

      // Outer ring rotation & subtle breathing
      mesh.outerRing.rotation.z += delta * (isZoneActive ? 0.35 : 0.08);
      mesh.innerRing.rotation.z -= delta * (isZoneActive ? 0.45 : 0.12);

      const outerMat = mesh.outerRing.material as THREE.MeshBasicMaterial;
      const innerMat = mesh.innerRing.material as THREE.MeshBasicMaterial;
      const pillarMat = mesh.lightPillar.material as THREE.MeshBasicMaterial;
      const partMat = mesh.particles.material as THREE.PointsMaterial;

      if (isZoneActive) {
        // High-energy vibrant aura when player is inside the song catchment circle
        const pulse = 0.75 + Math.sin(mesh.pulsePhase * 2) * 0.25;
        outerMat.opacity = 0.85 * pulse;
        innerMat.opacity = 0.7 * pulse;
        pillarMat.opacity = 0.22 * pulse;
        partMat.opacity = 0.95;
        mesh.lightPillar.scale.set(1 + Math.sin(mesh.pulsePhase) * 0.08, 1, 1 + Math.sin(mesh.pulsePhase) * 0.08);
      } else {
        // Subtle, elegant ambient territory marker when player is roaming outside
        outerMat.opacity = 0.35 + Math.sin(mesh.pulsePhase) * 0.12;
        innerMat.opacity = 0.2 + Math.sin(mesh.pulsePhase * 0.8) * 0.08;
        pillarMat.opacity = 0.04;
        partMat.opacity = 0.4;
        mesh.lightPillar.scale.set(1, 1, 1);
      }

      // Animated Soundwave Ripples Expanding Outward
      const rippleProgress1 = (mesh.pulsePhase * 0.45) % 1.0;
      const rippleScale1 = rippleProgress1 * (mesh.radius * 0.95);
      mesh.rippleDisc1.scale.set(rippleScale1, rippleScale1, 1);
      const rippleMat1 = mesh.rippleDisc1.material as THREE.MeshBasicMaterial;
      rippleMat1.opacity = isZoneActive ? (1.0 - rippleProgress1) * 0.6 : (1.0 - rippleProgress1) * 0.18;

      const rippleProgress2 = ((mesh.pulsePhase * 0.45) + 0.5) % 1.0;
      const rippleScale2 = rippleProgress2 * (mesh.radius * 0.95);
      mesh.rippleDisc2.scale.set(rippleScale2, rippleScale2, 1);
      const rippleMat2 = mesh.rippleDisc2.material as THREE.MeshBasicMaterial;
      rippleMat2.opacity = isZoneActive ? (1.0 - rippleProgress2) * 0.5 : (1.0 - rippleProgress2) * 0.12;

      // Particle rotation
      mesh.particles.rotation.y += delta * (isZoneActive ? 0.6 : 0.15);
    });
  }

  public dispose() {
    this.zoneMeshes.forEach((mesh) => {
      mesh.outerRing.geometry.dispose();
      (mesh.outerRing.material as THREE.Material).dispose();
      mesh.innerRing.geometry.dispose();
      (mesh.innerRing.material as THREE.Material).dispose();
      mesh.rippleDisc1.geometry.dispose();
      (mesh.rippleDisc1.material as THREE.Material).dispose();
      mesh.rippleDisc2.geometry.dispose();
      (mesh.rippleDisc2.material as THREE.Material).dispose();
      mesh.lightPillar.geometry.dispose();
      (mesh.lightPillar.material as THREE.Material).dispose();
      mesh.particles.geometry.dispose();
      (mesh.particles.material as THREE.Material).dispose();
    });
    this.zoneMeshes.clear();
  }
}
