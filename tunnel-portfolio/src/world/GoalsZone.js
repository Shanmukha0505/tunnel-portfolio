// =============================================
// GoalsZone.js — Chapter V: VISION & GOALS
// z range: -84 to -88 (short, before contact)
// Green theme, future goals + what I'm learning
// =============================================

import * as THREE from 'three'

const LEARNING = ['Rust', 'LLM Agents', 'Apache Iceberg', 'Real-time ML', 'Kubernetes']
const CERTS    = ['AWS Solutions Architect', 'Databricks Certified DE', 'Google Cloud DE']
const GOALS    = ['Staff Data Engineer', 'ML Platform Engineer', 'Open Source contributor']

export default class GoalsZone {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene
    this._build()
  }

  _build() {
    this._addPanel('CURRENTLY LEARNING', LEARNING, '#20e840', -2.3, -85, 'left')
    this._addPanel('CERTIFICATIONS', CERTS, '#44aaff', 2.3, -85, 'right')
    this._addGoalBanner(-86.5)
  }

  _addPanel(title, items, color, x, z, side) {
    const canvas  = document.createElement('canvas')
    canvas.width  = 256
    canvas.height = 400
    const ctx     = canvas.getContext('2d')

    ctx.fillStyle = '#060a06'
    ctx.fillRect(0, 0, 256, 400)
    ctx.strokeStyle = color
    ctx.lineWidth   = 2
    ctx.strokeRect(8, 8, 240, 384)

    ctx.font      = 'bold 20px "Courier New"'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText(title, 128, 42)
    ctx.fillStyle = color
    ctx.fillRect(20, 52, 216, 1)

    ctx.font      = '17px "Courier New"'
    ctx.fillStyle = '#a0c8a0'
    items.forEach((item, i) => ctx.fillText('▸ ' + item, 128, 88 + i * 54))

    const group = new THREE.Group()
    const slab  = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1.5, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x0a1008, roughness: 1.0 })
    )
    group.add(slab)

    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(1.14, 1.42),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(canvas),
        transparent: true,
        side: THREE.DoubleSide
      })
    )
    face.position.set(0.05, 0, 0)
    group.add(face)

    group.position.set(x, 1.5, z)
    group.rotation.y = side === 'left' ? -Math.PI / 2 : Math.PI / 2
    this.scene.add(group)
  }

  _addGoalBanner(z) {
    const canvas  = document.createElement('canvas')
    canvas.width  = 1024
    canvas.height = 80
    const ctx     = canvas.getContext('2d')
    ctx.clearRect(0, 0, 1024, 80)
    ctx.font      = 'bold 20px "Courier New"'
    ctx.fillStyle = '#20e840'
    ctx.textAlign = 'center'
    ctx.fillText('TARGET ROLES:  ' + GOALS.join('  ·  '), 512, 50)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 0.5),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
    )
    mesh.position.set(0, 3.2, z)
    this.scene.add(mesh)
  }

  update() {}
}
