// =============================================
// NameWall.js — "SHANMUKHA SAI MEDISETTI"
// Carved above the tunnel entrance
// Only visible when your torch hits it
// =============================================

import * as THREE from 'three'

export default class NameWall {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene
    this._build()
  }

  _build() {
    // Stone block the name is carved into
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 1.0 })
    const block    = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.7, 0.25), stoneMat)
    block.position.set(0, 3.0, -13.5)
    this.scene.add(block)

    // Name carved in stone — MeshStandardMaterial so torch illuminates it
    const canvas  = document.createElement('canvas')
    canvas.width  = 1024
    canvas.height = 148
    const ctx     = canvas.getContext('2d')

    ctx.fillStyle = '#1a1410'
    ctx.fillRect(0, 0, 1024, 148)

    // Carved border lines
    ctx.strokeStyle = '#3d2a14'
    ctx.lineWidth   = 2
    ctx.strokeRect(10, 10, 1004, 128)

    // Name — big, wide-spaced like carved stone
    ctx.font          = 'bold 38px "Courier New", monospace'
    ctx.fillStyle     = '#c0a060'
    ctx.textAlign     = 'center'
    ctx.letterSpacing = '8px'
    ctx.fillText('SHANMUKHA  SAI  MEDISETTI', 512, 62)

    // Title below
    ctx.font      = '20px "Courier New"'
    ctx.fillStyle = '#7a6a4a'
    ctx.fillText('DATA ENGINEER  ·  MS DATA SCIENCE', 512, 106)

    // Year
    ctx.font      = '16px "Courier New"'
    ctx.fillStyle = '#4a3a24'
    ctx.fillText('2025', 512, 132)

    const tex   = new THREE.CanvasTexture(canvas)
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(4.6, 0.66),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 })
    )
    plaque.position.set(0, 3.0, -13.3)
    this.scene.add(plaque)

    // Subtle chisel marks around the name
    const chiselMat = new THREE.MeshStandardMaterial({ color: 0x251a0e, roughness: 1.0 })
    for (let i = 0; i < 8; i++) {
      const mark = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.05), chiselMat)
      mark.position.set(-2.0 + i * 0.6, 2.7, -13.3)
      mark.rotation.z = (Math.random() - 0.5) * 0.4
      this.scene.add(mark)
    }
  }

  update() {}
}
