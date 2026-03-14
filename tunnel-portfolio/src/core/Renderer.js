// =============================================
// Renderer.js — The Painter + Post Processing
// Bloom makes the torch look REAL
// =============================================

import * as THREE from 'three'
import { EffectComposer }   from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass }       from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass }  from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass }       from 'three/addons/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js'

export default class Renderer {
  constructor(experience) {
    this.experience = experience
    this.canvas     = experience.canvas
    this.scene      = experience.scene
    this.camera     = experience.camera
    this.sizes      = experience.sizes

    this._createRenderer()
    this._createPostProcessing()
  }

  _createRenderer() {
    this.instance = new THREE.WebGLRenderer({
      canvas:    this.canvas,
      antialias: true,
      alpha:     false
    })

    this.instance.toneMapping         = THREE.ACESFilmicToneMapping
    this.instance.toneMappingExposure  = 0.8
    this.instance.shadowMap.enabled    = true
    this.instance.shadowMap.type       = THREE.PCFSoftShadowMap
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setClearColor(0x000000, 1)
  }

  _createPostProcessing() {
    const w = this.sizes.width
    const h = this.sizes.height

    this.composer = new EffectComposer(this.instance)

    // 1. Render the scene normally
    this.composer.addPass(new RenderPass(this.scene, this.camera.instance))

    // 2. Bloom — makes torch + lanterns glow beautifully
    //    strength, radius, threshold
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      1.2,   // strength  — how bright the glow
      0.6,   // radius    — how wide the glow spreads
      0.15   // threshold — only pixels brighter than this bloom
    )
    this.composer.addPass(this.bloomPass)

    // 3. Gamma correction (keeps colors accurate after bloom)
    this.composer.addPass(new ShaderPass(GammaCorrectionShader))
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.composer.setSize(this.sizes.width, this.sizes.height)
  }

  render() {
    // Use composer instead of direct render — applies bloom
    this.composer.render()
  }
}
