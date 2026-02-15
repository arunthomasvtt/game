export class GameState {
  constructor() {
    this.health = 100;
    this.stamina = 100;
    this.levelIndex = 0;
    this.storyFragments = [];
    this.alertState = 'exploration';
  }

  damage(amount) {
    this.health = Math.max(0, this.health - amount);
  }

  drainStamina(amount) {
    this.stamina = Math.max(0, this.stamina - amount);
  }

  recoverStamina(amount) {
    this.stamina = Math.min(100, this.stamina + amount);
  }

  collect(fragment) {
    this.storyFragments.push(fragment);
  }

  setAlert(state) {
    this.alertState = state;
  }
}
