export class UIController {
  constructor(gameState) {
    this.gameState = gameState;
    this.healthValue = document.getElementById('healthValue');
    this.staminaValue = document.getElementById('staminaValue');
    this.healthBar = document.getElementById('healthBar');
    this.staminaBar = document.getElementById('staminaBar');
    this.objective = document.getElementById('objectiveText');
    this.story = document.getElementById('storyPanel');
  }

  bootComplete() {
    document.getElementById('loadingOverlay')?.classList.remove('visible');
    document.getElementById('hud')?.classList.remove('hidden');
    setTimeout(() => document.getElementById('loadingOverlay')?.classList.add('hidden'), 400);
  }

  setObjective(text) {
    this.objective.textContent = `Objective: ${text}`;
  }

  showStory(text) {
    this.story.innerHTML = `<strong>Recovered Memory</strong><br/>${text}`;
    this.story.classList.remove('hidden');
    setTimeout(() => this.story.classList.add('hidden'), 6000);
  }

  updateProgress(percent) {
    document.getElementById('progressBar').style.width = `${percent}%`;
  }

  frame() {
    const health = Math.round(this.gameState.health);
    const stamina = Math.round(this.gameState.stamina);
    this.healthValue.textContent = health;
    this.staminaValue.textContent = stamina;
    this.healthBar.style.width = `${health}%`;
    this.staminaBar.style.width = `${stamina}%`;
  }
}
