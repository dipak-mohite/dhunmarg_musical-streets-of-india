import * as THREE from 'three';
import { VehicleFactory } from './vehicles';

export interface TrafficVehicle {
  group: THREE.Group;
  speed: number;
  route: { x: number; z: number }[];
  targetIdx: number;
  update: (delta: number) => void;
}

export class TrafficManager {
  private vehicles: TrafficVehicle[] = [];
  public container: THREE.Group = new THREE.Group();

  constructor() {
    this.container.name = 'CityTraffic';
    this.initTraffic();
  }

  private initTraffic() {
    // Street Loop 1: Main East-West Boulevard (Z = -2.5 and Z = 2.5)
    const eastWestRoad1 = [
      { x: -55, z: -2.5 },
      { x: 55, z: -2.5 },
    ];
    const eastWestRoad2 = [
      { x: 55, z: 2.5 },
      { x: -55, z: 2.5 },
    ];

    // Street Loop 2: North-South Highway (X = -2.5 and X = 2.5)
    const northSouthRoad1 = [
      { x: -2.5, z: -55 },
      { x: -2.5, z: 55 },
    ];
    const northSouthRoad2 = [
      { x: 2.5, z: 55 },
      { x: 2.5, z: -55 },
    ];

    // 1. Moving Auto-Rickshaws
    const auto1 = VehicleFactory.createAutoRickshaw();
    this.addVehicle(auto1, eastWestRoad1, 6.5, -40);

    const auto2 = VehicleFactory.createAutoRickshaw();
    this.addVehicle(auto2, northSouthRoad1, 7.0, -30);

    // 2. Moving City Cars / Taxis (Black & Yellow Padmini Taxi)
    const taxi1 = VehicleFactory.createCityCar(0xfbbf24, true);
    this.addVehicle(taxi1, eastWestRoad2, 8.0, 35);

    const car2 = VehicleFactory.createCityCar(0xef4444, false);
    this.addVehicle(car2, northSouthRoad2, 8.5, 40);

    // 3. Moving Scooter
    const scooter1 = VehicleFactory.createScooter(0x06b6d4);
    this.addVehicle(scooter1, eastWestRoad1, 5.5, 10);
  }

  private addVehicle(mesh: THREE.Group, route: { x: number; z: number }[], speed: number, startPosOffset: number) {
    const v: TrafficVehicle = {
      group: mesh,
      speed,
      route,
      targetIdx: 1,
      update: (delta: number) => {
        const target = route[v.targetIdx];
        const current = mesh.position;
        const dx = target.x - current.x;
        const dz = target.z - current.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 1.0) {
          // Loop back to start
          mesh.position.set(route[0].x, 0, route[0].z);
          v.targetIdx = 1;
        } else {
          const step = speed * delta;
          mesh.position.x += (dx / dist) * step;
          mesh.position.z += (dz / dist) * step;
          mesh.rotation.y = Math.atan2(dx, dz);
        }
      }
    };

    // Initial position along route
    mesh.position.set(startPosOffset, 0, route[0].z);
    this.container.add(mesh);
    this.vehicles.push(v);
  }

  public update(delta: number) {
    this.vehicles.forEach((v) => v.update(delta));
  }
}
