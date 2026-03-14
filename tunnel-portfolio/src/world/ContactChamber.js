// =============================================
// ContactChamber.js — Zone D: The Exit
// Blue light floods the end of the tunnel
// "You made it through the pipeline."
// =============================================

import * as THREE from 'three'

const CONTACTS = [
  { label: 'EMAIL',    value: 'shanmukhapaluri@gmail.com', color: '#e8a020' },
  { label: 'GITHUB',   value: 'github.com/Shanmukha0505',  color: '#4a9eff' },
  { label: 'LINKEDIN', value: 'linkedin.com/in/ShanmukhaSai', color: '#0099cc' },
]

export default class ContactChamber {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene
    this._build()
  }

  _build() {
    const group = new THREE.Group()

    // ── Chamber walls (wider than tunnel) ──────
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0d1b2a, roughness: 0.9 })
    const floorMat= new THREE.MeshStandardMaterial({ color: 0x0a1520, roughness: 1.0 })

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 14), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, 0, -88)
    group.add(floor)

    // Back wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMat)
    backWall.position.set(0, 2.5, -95)
    group.add(backWall)

    // Left/right walls
    const sideL = new THREE.Mesh(new THREE.PlaneGeometry(14, 5), wallMat)
    sideL.rotation.y =  Math.PI / 2
    sideL.position.set(-5, 2.5, -88)
    group.add(sideL)

    const sideR = new THREE.Mesh(new THREE.PlaneGeometry(14, 5), wallMat)
    sideR.rotation.y = -Math.PI / 2
    sideR.position.set(5, 2.5, -88)
    group.add(sideR)

    // Ceiling
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(10, 14), wallMat)
    ceil.rotation.x = Math.PI / 2
    ceil.position.set(0, 5, -88)
    group.add(ceil)

    // ── Blue light source ──────────────────────
    this.blueLight = new THREE.PointLight(0x00aaff, 0, 20)  // starts off
    this.blueLight.position.set(0, 3, -91)
    group.add(this.blueLight)

    // Ambient fill for chamber (deep blue)
    this.chamberAmbient = new THREE.PointLight(0x003366, 0, 30)
    this.chamberAmbient.position.set(0, 2, -85)
    group.add(this.chamberAmbient)

    // ── "YOU MADE IT THROUGH THE PIPELINE." ───
    this._addBigText(group, 'YOU MADE IT', -91, 3.8, 28, '#00aaff')
    this._addBigText(group, 'THROUGH THE PIPELINE.', -93, 3.0, 22, '#4acfff')

    // ── Contact info panels ────────────────────
    CONTACTS.forEach((c, i) => {
      this._addContactPanel(group, c, -87 - i * 2.2)
    })

    // ── Particle dust motes (floating blue) ───
    this._buildParticles(group)

    // ── Glowing floor line leading to chamber ─
    const lineGeo = new THREE.PlaneGeometry(0.08, 12)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x0066aa })
    const lineL   = new THREE.Mesh(lineGeo, lineMat)
    lineL.rotation.x = -Math.PI / 2
    lineL.position.set(-0.5, 0.01, -85)
    group.add(lineL)
    const lineR = new THREE.Mesh(lineGeo, lineMat)
    lineR.rotation.x = -Math.PI / 2
    lineR.position.set(0.5, 0.01, -85)
    group.add(lineR)

    this.scene.add(group)
    this.group = group
    this._triggered = false
    this._fadeIn = 0
  }

  _addBigText(parent, text, z, y, size, color) {
    const canvas  = document.createElement('canvas')
    canvas.width  = 1024
    canvas.height = 128
    const ctx     = canvas.getContext('2d')
    ctx.clearRect(0, 0, 1024, 128)
    ctx.font      = `bold ${size}px "Courier New", monospace`
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText(text, 512, 90)
    const tex  = new THREE.CanvasTexture(canvas)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 1),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    )
    mesh.position.set(0, y, z)
    parent.add(mesh)
  }

  _addContactPanel(parent, contact, z) {
    const canvas  = document.createElement('canvas')
    canvas.width  = 768
    canvas.height = 96
    const ctx     = canvas.getContext('2d')
    ctx.clearRect(0, 0, 768, 96)

    // Label
    ctx.font      = 'bold 20px "Courier New"'
    ctx.fillStyle = '#4a4a4a'
    ctx.textAlign = 'left'
    ctx.fillText(contact.label, 20, 40)

    // Value
    ctx.font      = 'bold 28px "Courier New"'
    ctx.fillStyle = contact.color
    ctx.fillText(contact.value, 20, 76)

    const tex  = new THREE.CanvasTexture(canvas)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 0.76),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    )
    mesh.position.set(0, 1.4, z)
    parent.add(mesh)
  }

  _buildParticles(parent) {
    const count = 120
    const geo   = new THREE.BufferGeometry()
    const pos   = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 9
      pos[i * 3 + 1] = Math.random() * 4.5
      pos[i * 3 + 2] = -80 - Math.random() * 14
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      color: 0x44aaff, size: 0.04, transparent: true, opacity: 0.7
    })
    this.particles = new THREE.Points(geo, mat)
    this._particlePos = pos
    parent.add(this.particles)
  }

  // Called by World when player reaches chamber
  triggerReveal() {
    if (this._triggered) return
    this._triggered = true
    console.log('💙 You made it through the pipeline.')
  }

  update(delta) {
    const player = this.experience.player
    if (!player) return

    const pz   = player.body.position.z
    const dist = Math.abs(pz - (-88))

    // Fade blue light in as player approaches
    if (pz < -75) {
      this._fadeIn = Math.min(1, this._fadeIn + delta * 0.4)
      this.blueLight.intensity    = this._fadeIn * 18
      this.chamberAmbient.intensity = this._fadeIn * 8
    }

    // Trigger reveal text when close enough
    if (pz < -82 && !this._triggered) this.triggerReveal()

    // Float particles gently upward
    if (this.particles) {
      const pos = this._particlePos
      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3 + 1] += delta * 0.08
        if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = 0
      }
      this.particles.geometry.attributes.position.needsUpdate = true
    }

    // Pulse the blue light
    const t = this.experience.time.elapsed
    if (this._fadeIn > 0) {
      this.blueLight.intensity = this._fadeIn * (16 + Math.sin(t * 1.2) * 2)
    }
  }
}
