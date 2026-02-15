import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';
import { LEVELS } from './data/levels.js';
import { SceneManager } from './core/SceneManager.js';
import { AssetLoader } from './core/AssetLoader.js';
import { GameState } from './core/GameState.js';
import { InputController } from './systems/InputController.js';
import { PlayerController } from './systems/PlayerController.js';
import { AIController } from './systems/AIController.js';
import { LevelBuilder } from './systems/LevelBuilder.js';
import { AudioSystem } from './systems/AudioSystem.js';
import { UIController } from './ui/UIController.js';

const gameState = new GameState();
const sceneManager = new SceneManager(document.getElementById('gameCanvas'));
const ui = new UIController(gameState);
const input = new InputController();
const player = new PlayerController(sceneManager.scene, sceneManager.camera, input, gameState);
const ai = new AIController(sceneManager.scene, gameState);
const builder = new LevelBuilder(sceneManager);
const audio = new AudioSystem(gameState);
const loader = new AssetLoader((p) => ui.updateProgress(p));

const raycaster = new THREE.Raycaster();

async function loadLevel(index) {
  const level = LEVELS[index % LEVELS.length];
  gameState.levelIndex = index % LEVELS.length;
  const pack = await loader.loadLevelPack(level);
  builder.build(level, pack);
  ai.spawn(level.enemies);
  ui.setObjective(`${level.title}: ${level.objective}`);
}

async function start() {
  await loadLevel(0);
  ui.bootComplete();

  const loop = () => {
    const delta = sceneManager.render();
    player.update(delta);
    ai.update(delta, player.avatar.position);
    ui.frame();
    audio.update();
    checkInteraction();

    if (gameState.health <= 0) {
      ui.showStory('System Failure: You collapse as the blackout echoes consume the district. Reload to retry.');
      return;
    }

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

function checkInteraction() {
  const { interact } = input.axis();
  if (!interact) return;
  input.consumeInteract();

  raycaster.set(sceneManager.camera.position, sceneManager.camera.getWorldDirection(new THREE.Vector3()));
  const hits = raycaster.intersectObjects(sceneManager.dynamic, false);
  const collectible = hits.find((h) => h.object.userData.collectible);
  if (collectible) {
    gameState.collect(collectible.object.userData.collectible);
    ui.showStory(collectible.object.userData.collectible);
    collectible.object.visible = false;

    const next = gameState.levelIndex + 1;
    if (next < LEVELS.length) {
      setTimeout(() => loadLevel(next), 900);
    } else {
      ui.showStory('Final Cutscene: The reactor displays your biometric key. You were always the fail-safe and the trigger.');
    }
  }
}

addEventListener('keydown', (e) => {
  if (e.code === 'KeyM') audio.init();
  if (e.code === 'KeyN') loadLevel(gameState.levelIndex + 1);
});

start();
