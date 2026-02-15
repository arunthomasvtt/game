import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

export class AssetLoader {
  constructor(onProgress) {
    this.manager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.manager);
    this.cache = new Map();
    this.onProgress = onProgress;

    this.manager.onProgress = (_, loaded, total) => {
      if (this.onProgress) this.onProgress(Math.round((loaded / total) * 100));
    };
  }

  async loadLevelPack(level) {
    const key = `level:${level.id}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const textures = await Promise.all([
      this.loadTexture('https://threejs.org/examples/textures/terrain/grasslight-big.jpg'),
      this.loadTexture('https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg'),
      this.loadTexture('https://threejs.org/examples/textures/brick_diffuse.jpg'),
    ]);

    const pack = {
      albedo: textures[0],
      normal: textures[1],
      rough: textures[2],
      metadata: level,
    };
    textures.forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 8;
      t.generateMipmaps = true;
    });
    this.cache.set(key, pack);
    return pack;
  }

  loadTexture(url) {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(url, resolve, undefined, reject);
    });
  }
}
