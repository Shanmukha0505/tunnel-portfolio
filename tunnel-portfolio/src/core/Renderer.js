// =============================================
// Renderer.js — The Painter
//
// WebGLRenderer draws our Three.js scene
// onto the canvas every frame.
// =============================================

import * as THREE from 'three'

export default class Renderer {
  constructor(experience) {
    this.experience = experience
    this.canvas     = experience.canvas
    this.scene      = experience.scene
    this.camera     = experience.camera
    this.sizes      = experience.sizes

    this._createRenderer()
  }

  _createRenderer() {
    this.instance = new THREE.WebGLRenderer({
      canvas:      this.canvas,
      antialias:   true,   // smooth edges
      alpha:       false    // solid black background, no transparency
    })

    // Physical lighting (default in Three.js r155+, no flag needed)

    // ACESFilmicToneMapping = cinematic look, great for dark moody scenes
    this.instance.toneMapping        = THREE.ACESFilmicToneMapping
    this.instance.toneMappingExposure = 1.0

    // Enable shadows (torchlight will cast them)
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type    = THREE.PCFSoftShadowMap

    // Set pixel ratio (max 2 — retina without killing perf)
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.instance.setSize(this.sizes.width, this.sizes.height)

    // Deep black background — the void of the mine
    this.instance.setClearColor(0x000000, 1)
  }

  // Called when window is resized
  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  // Called every frame — draws scene + camera
  render() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
