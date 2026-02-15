export class InputController {
  constructor() {
    this.keys = new Set();
    this.mouseDelta = { x: 0, y: 0 };
    this.virtual = { x: 0, y: 0, sprint: false, interact: false };

    addEventListener('keydown', (e) => this.keys.add(e.code));
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('mousemove', (e) => {
      if (document.pointerLockElement) {
        this.mouseDelta.x += e.movementX;
        this.mouseDelta.y += e.movementY;
      }
    });

    const canvas = document.getElementById('gameCanvas');
    canvas.addEventListener('click', () => canvas.requestPointerLock());
    this.initMobile();
  }

  initMobile() {
    const mobile = document.getElementById('mobileControls');
    const base = document.getElementById('joystickBase');
    const knob = document.getElementById('joystickKnob');
    const sprintBtn = document.getElementById('sprintBtn');
    const interactBtn = document.getElementById('interactBtn');
    if (!base) return;

    const show = /Android|iPhone|iPad/i.test(navigator.userAgent);
    mobile?.classList.toggle('hidden', !show);

    let dragging = false;
    base.addEventListener('pointerdown', () => (dragging = true));
    addEventListener('pointerup', () => {
      dragging = false;
      this.virtual.x = this.virtual.y = 0;
      knob.style.transform = 'translate(0,0)';
    });
    addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const rect = base.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const clamp = Math.min(45, Math.hypot(x, y));
      const ang = Math.atan2(y, x);
      const nx = Math.cos(ang) * clamp;
      const ny = Math.sin(ang) * clamp;
      knob.style.transform = `translate(${nx}px, ${ny}px)`;
      this.virtual.x = nx / 45;
      this.virtual.y = ny / 45;
    });

    sprintBtn?.addEventListener('pointerdown', () => (this.virtual.sprint = true));
    sprintBtn?.addEventListener('pointerup', () => (this.virtual.sprint = false));
    interactBtn?.addEventListener('click', () => (this.virtual.interact = true));
  }

  consumeMouseDelta() {
    const d = { ...this.mouseDelta };
    this.mouseDelta.x = this.mouseDelta.y = 0;
    return d;
  }

  axis() {
    const keyboard = {
      x: (this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('KeyA') ? 1 : 0),
      y: (this.keys.has('KeyW') ? 1 : 0) - (this.keys.has('KeyS') ? 1 : 0),
    };
    return {
      x: Math.abs(keyboard.x) > 0 ? keyboard.x : this.virtual.x,
      y: Math.abs(keyboard.y) > 0 ? keyboard.y : -this.virtual.y,
      sprint: this.keys.has('ShiftLeft') || this.virtual.sprint,
      interact: this.keys.has('KeyE') || this.virtual.interact,
    };
  }

  consumeInteract() {
    this.virtual.interact = false;
  }
}
