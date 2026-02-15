import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

export class SceneManager {
  constructor(canvas) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060b12);
    this.scene.fog = new THREE.FogExp2(0x08121c, 0.015);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
    this.camera.position.set(0, 3.5, 8);

    this.clock = new THREE.Clock();
    this.dynamic = [];

    const hemi = new THREE.HemisphereLight(0xbac6ff, 0x203246, 0.65);
    this.scene.add(hemi);

    this.sun = new THREE.DirectionalLight(0xe8efff, 2.1);
    this.sun.position.set(12, 20, 8);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.scene.add(this.sun);

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setLevelLighting(palette) {
    this.scene.fog.color.setHex(palette.fog);
    this.scene.background.setHex(palette.fog);
    this.sun.color.setHex(palette.key);
  }

  clearDynamic() {
    this.dynamic.forEach((obj) => {
      this.scene.remove(obj);
      obj.traverse?.((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
          else child.material.dispose();
        }
      });
    });
    this.dynamic = [];
  }

  addDynamic(object) {
    this.dynamic.push(object);
    this.scene.add(object);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    return this.clock.getDelta();
  }
}
