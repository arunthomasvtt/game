import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

export class LevelBuilder {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
  }

  build(level, pack) {
    this.sceneManager.clearDynamic();
    this.sceneManager.setLevelLighting(level.palette);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(140, 140, 40, 40),
      new THREE.MeshStandardMaterial({
        map: pack.albedo,
        normalMap: pack.normal,
        roughnessMap: pack.rough,
        roughness: 0.86,
        metalness: 0.12,
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.material.map.repeat.set(14, 14);
    ground.material.normalMap.repeat.set(14, 14);
    this.sceneManager.addDynamic(ground);

    for (let i = 0; i < 30; i += 1) {
      const h = Math.random() * 8 + 2;
      const monolith = new THREE.Mesh(
        new THREE.BoxGeometry(3, h, 3),
        new THREE.MeshStandardMaterial({ color: 0x1b2533, roughness: 0.37, metalness: 0.45 })
      );
      monolith.position.set((Math.random() - 0.5) * 120, h / 2, (Math.random() - 0.5) * 120);
      monolith.castShadow = true;
      monolith.receiveShadow = true;
      this.sceneManager.addDynamic(monolith);
    }

    const relic = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.75, 2),
      new THREE.MeshPhysicalMaterial({
        color: 0x94f4ff,
        emissive: 0x4abec9,
        emissiveIntensity: 1.2,
        roughness: 0.12,
        transmission: 0.2,
        clearcoat: 1,
      })
    );
    relic.position.set(0, 1.8, -12);
    relic.castShadow = true;
    relic.userData.collectible = level.story;
    this.sceneManager.addDynamic(relic);
  }
}
