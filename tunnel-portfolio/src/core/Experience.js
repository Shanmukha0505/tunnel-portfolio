// =============================================
// Experience.js — The Game Brain
// Boots everything, runs the game loop
// =============================================

import * as THREE      from 'three'
import Time            from './Time.js'
import Camera          from './Camera.js'
import Renderer        from './Renderer.js'
import Resources       from './Resources.js'
import Controls        from '../player/Controls.js'
import Player          from '../player/Player.js'
import World           from '../world/World.js'
import LoadingScreen   from '../ui/LoadingScreen.js'

// Assets to preload (empty for now — using Three.js geometry only)
const SOURCES = []

export default class Experience {
  constructor(canvas) {
    this.canvas = canvas

    this.scene  = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x000000, 0.038)  // hides far objects, kills spoilers
    this.time   = new Time()
    this.sizes  = { width: window.innerWidth, height: window.innerHeight }

    // Input first — other systems need it
    this.controls = new Controls(canvas)

    // Core rendering
    this.camera   = new Camera(this)
    this.renderer = new Renderer(this)

    // Loading screen — when done, boot the world
    this.loadingScreen = new LoadingScreen(() => this._startGame())

    // Load assets (currently empty, fires onReady instantly)
    this.resources = new Resources(SOURCES)
    this.resources.onReady = () => this.loadingScreen.complete()

    window.addEventListener('resize', () => this._onResize())

    this._tick()

    console.log('%c GAME BOOTED ', 'background:#1a0a00;color:#e8a020;padding:4px 8px;')
  }

  _startGame() {
    console.log('%c GAME STARTED — Welcome to the mine ', 'background:#1a0a00;color:#e8a020;padding:4px 8px;')

    // Boot the world first (player needs world for floor collision)
    this.world  = new World(this)

    // Boot the player
    this.player = new Player(this)

    // Show "click to play" hint
    const hint = document.getElementById('click-hint')
    if (hint) hint.style.display = 'flex'

    // E key → try to interact with coal carts
    window.addEventListener('interact', () => {
      if (this.player && this.world && this.world.coalCarts) {
        this.world.coalCarts.handleInteract(this.player.body.position)
      }
    })
  }

  _tick() {
    this.time.tick()
    const delta = this.time.delta

    // Update systems only after game started
    if (this.world)  this.world.update(delta)
    if (this.player) this.player.update(delta)

    // Camera follows player
    this.camera.update(delta)

    this.renderer.render()

    // Flush input state
    this.controls.flush()

    requestAnimationFrame(() => this._tick())
  }

  _onResize() {
    this.sizes.width  = window.innerWidth
    this.sizes.height = window.innerHeight
    this.camera.resize()
    this.renderer.resize()
  }
}
