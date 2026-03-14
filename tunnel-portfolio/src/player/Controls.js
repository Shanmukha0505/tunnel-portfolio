// =============================================
// Controls.js — Keyboard + Mouse Input
//
// WASD    = move
// Shift   = run
// E       = interact
// Mouse   = look (pointer lock)
// Click   = lock pointer (start game)
// Esc     = unlock pointer (pause)
// =============================================

export default class Controls {
  constructor(canvas) {
    this.canvas = canvas

    // Key states
    this.keys = {
      forward:  false,   // W
      backward: false,   // S
      left:     false,   // A
      right:    false,   // D
      run:      false,   // Shift
      interact: false,   // E (single press)
    }

    // Mouse look delta this frame
    this.mouseDelta = { x: 0, y: 0 }

    // Is pointer locked?
    this.isLocked = false

    // Interact was just pressed (single frame)
    this._interactPressed = false

    this._bindEvents()
  }

  _bindEvents() {
    // Click canvas to lock pointer (start playing)
    this.canvas.addEventListener('click', () => {
      if (!this.isLocked) this.canvas.requestPointerLock()
    })

    document.addEventListener('pointerlockchange', () => {
      this.isLocked = document.pointerLockElement === this.canvas
      // Show/hide the "click to play" hint
      const hint = document.getElementById('click-hint')
      if (hint) hint.style.display = this.isLocked ? 'none' : 'flex'
    })

    // Mouse move — only works when pointer is locked
    document.addEventListener('mousemove', (e) => {
      if (!this.isLocked) return
      this.mouseDelta.x += e.movementX
      this.mouseDelta.y += e.movementY
    })

    // Keydown
    document.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    this.keys.forward  = true; break
        case 'KeyS': case 'ArrowDown':  this.keys.backward = true; break
        case 'KeyA': case 'ArrowLeft':  this.keys.left     = true; break
        case 'KeyD': case 'ArrowRight': this.keys.right    = true; break
        case 'ShiftLeft': case 'ShiftRight': this.keys.run = true; break
        case 'KeyE':
          if (!this._interactPressed) {
            this._interactPressed = true
            this.keys.interact = true
            window.dispatchEvent(new CustomEvent('interact'))
          }
          break
      }
    })

    // Keyup
    document.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    this.keys.forward  = false; break
        case 'KeyS': case 'ArrowDown':  this.keys.backward = false; break
        case 'KeyA': case 'ArrowLeft':  this.keys.left     = false; break
        case 'KeyD': case 'ArrowRight': this.keys.right    = false; break
        case 'ShiftLeft': case 'ShiftRight': this.keys.run = false; break
        case 'KeyE':
          this._interactPressed = false
          this.keys.interact = false
          break
      }
    })
  }

  // Call at end of each frame to reset per-frame values
  flush() {
    this.mouseDelta.x = 0
    this.mouseDelta.y = 0
  }
}
