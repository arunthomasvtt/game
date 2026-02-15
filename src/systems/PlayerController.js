import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

export class PlayerController {
  constructor(scene, camera, input, gameState) {
    this.camera = camera;
    this.input = input;
    this.gameState = gameState;
    this.yaw = 0;

    this.avatar = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.45, 1.2, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0xd1c0b2, roughness: 0.48, metalness: 0.06 })
    );
    body.castShadow = true;
    const jacket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.53, 0.56, 0.9, 20),
      new THREE.MeshStandardMaterial({ color: 0x2d3f5a, roughness: 0.6, metalness: 0.2 })
    );
    jacket.position.y = 0.2;
    jacket.castShadow = true;
    this.avatar.add(body, jacket);
    this.avatar.position.set(0, 1.3, 0);

    this.velocity = new THREE.Vector3();
    this.tmp = new THREE.Vector3();
    scene.add(this.avatar);
  }

  update(delta) {
    const look = this.input.consumeMouseDelta();
    this.yaw -= look.x * 0.002;

    const axis = this.input.axis();
    const speed = axis.sprint && this.gameState.stamina > 0 ? 7.5 : 4.4;

    if (axis.sprint) this.gameState.drainStamina(17 * delta);
    else this.gameState.recoverStamina(12 * delta);

    this.tmp.set(axis.x, 0, axis.y);
    if (this.tmp.lengthSq() > 1) this.tmp.normalize();
    this.tmp.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

    this.velocity.lerp(this.tmp.multiplyScalar(speed), 0.18);
    this.avatar.position.addScaledVector(this.velocity, delta);

    const bob = Math.sin(performance.now() * 0.003) * 0.02;
    this.avatar.position.y = 1.3 + bob;

    if (this.velocity.lengthSq() > 0.08) {
      this.avatar.rotation.y = Math.atan2(this.velocity.x, this.velocity.z);
    }

    const target = this.avatar.position.clone().add(new THREE.Vector3(0, 2.5, 0));
    const offset = new THREE.Vector3(0, 2.8, 6.8).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    this.camera.position.lerp(target.clone().add(offset), 0.08);
    this.camera.lookAt(target);
  }
}
