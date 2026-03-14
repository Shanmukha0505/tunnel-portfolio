// =============================================
// SectionMarker.js — Chapter arch between zones
// Glowing carved stone frame with chapter name
// =============================================

import * as THREE from 'three'

export default class SectionMarker {
  /**
   * @param {object} experience
   * @param {object} opts — { z, chapter, title, color (hex number) }
   */
  constructor(experience, opts) {
    this.experience = experience
    this.scene      = experience.scene
    this.z          = opts.z
    this.color      = opts.color || 0xe8a020
    this.chapter    = opts.chapter
    this.title      = opts.title
    this._build()
  }

  _build() {
    const group    = new THREE.Group()
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 1.0 })
    const colorHex = '#' + this.color.toString(16).padStart(6, '0')

    // ── Left pillar ─────────────────────────────
    const pL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.2, 0.4), stoneMat)
    pL.position.set(-2.4, 2.1, 0)
    group.add(pL)

    // ── Right pillar ────────────────────────────
    const pR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.2, 0.4), stoneMat)
    pR.position.set(2.4, 2.1, 0)
    group.add(pR)

    // ── Top lintel ──────────────────────────────
    const top = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.5, 0.4), stoneMat)
    top.position.set(0, 4.25, 0)
    group.add(top)

    // ── Glowing color strip on top ──────────────
    const stripMat = new THREE.MeshBasicMaterial({ color: this.color })
    const strip    = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.08, 0.06), stripMat)
    strip.position.set(0, 4.55, 0.18)
    group.add(strip)

    // ── Chapter text ────────────────────────────
    const canvas  = document.createElement('canvas')
    canvas.width  = 512
    canvas.height = 128
    const ctx     = canvas.getContext('2d')
    ctx.fillStyle = '#0a0806'
    ctx.fillRect(0, 0, 512, 128)

    ctx.font      = '16px "Courier New"'
    ctx.fillStyle = '#5a4a30'
    ctx.textAlign = 'center'
    ctx.fillText(this.chapter, 256, 36)

    ctx.font      = 'bold 30px "Courier New"'
    ctx.fillStyle = colorHex
    ctx.fillText(this.title, 256, 80)

    const tex   = new THREE.CanvasTexture(canvas)
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(4.6, 1.15),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    )
    label.position.set(0, 4.25, 0.22)
    group.add(label)

    // ── Soft glow light ─────────────────────────
    const light = new THREE.PointLight(this.color, 1.5, 5)
    light.position.set(0, 4.0, 0.5)
    group.add(light)
    this._light = light

    group.position.set(0, 0, this.z)
    this.scene.add(group)
    this.group = group
  }

  update() {
    const t = this.experience.time.elapsed
    if (this._light) {
      this._light.intensity = 1.2 + Math.sin(t * 2) * 0.3
    }
  }
}
