import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

export class AIController {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.enemies = [];
  }

  spawn(count) {
    this.clear();
    for (let i = 0; i < count; i += 1) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 1.4, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x861f38, metalness: 0.55, roughness: 0.28 })
      );
      mesh.castShadow = true;
      mesh.position.set((Math.random() - 0.5) * 30, 0.8, (Math.random() - 0.5) * 30);
      this.scene.add(mesh);
      this.enemies.push({
        mesh,
        patrolAnchor: mesh.position.clone(),
        phase: Math.random() * Math.PI * 2,
        state: 'patrol',
      });
    }
  }

  update(delta, playerPosition) {
    let alert = 'exploration';
    this.enemies.forEach((enemy) => {
      const dist = enemy.mesh.position.distanceTo(playerPosition);
      if (dist < 8) enemy.state = 'chase';
      else if (dist > 12) enemy.state = 'patrol';

      if (enemy.state === 'chase') {
        alert = 'combat';
        const dir = playerPosition.clone().sub(enemy.mesh.position).normalize();
        enemy.mesh.position.addScaledVector(dir, delta * 2.3);
        if (dist < 1.6) this.gameState.damage(9 * delta);
      } else {
        const orbit = new THREE.Vector3(Math.cos(performance.now() * 0.001 + enemy.phase), 0, Math.sin(performance.now() * 0.001 + enemy.phase));
        const goal = enemy.patrolAnchor.clone().add(orbit.multiplyScalar(2));
        enemy.mesh.position.lerp(goal, 0.01);
      }
    });
    this.gameState.setAlert(alert);
  }

  clear() {
    this.enemies.forEach((e) => {
      this.scene.remove(e.mesh);
      e.mesh.geometry.dispose();
      e.mesh.material.dispose();
    });
    this.enemies = [];
  }
}
