// =============================================
// ContactChamber.js — Zone D: The Exit
// Everything on the back wall, clean layout
// =============================================

import * as THREE from 'three'

export default class ContactChamber {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene
    this._fadeIn    = 0
    this._triggered = false
    this._build()
  }

  _build() {
    const group   = new THREE.Group()
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0d1b2a, roughness: 0.9 })
    const floorMat= new THREE.MeshStandardMaterial({ color: 0x0a1520, roughness: 1.0 })

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 16), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, 0, -90)
    group.add(floor)

    // Back wall (far end, nothing in front of it)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 7), wallMat)
    backWall.position.set(0, 3.5, -99)
    group.add(backWall)

    // Side walls
    const sideL = new THREE.Mesh(new THREE.PlaneGeometry(16, 7), wallMat)
    sideL.rotation.y = Math.PI / 2
    sideL.position.set(-6, 3.5, -90)
    group.add(sideL)

    const sideR = new THREE.Mesh(new THREE.PlaneGeometry(16, 7), wallMat)
    sideR.rotation.y = -Math.PI / 2
    sideR.position.set(6, 3.5, -90)
    group.add(sideR)

    // Ceiling
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(12, 16), wallMat)
    ceil.rotation.x = Math.PI / 2
    ceil.position.set(0, 7, -90)
    group.add(ceil)

    // ── Blue lights ─────────────────────────────
    this.blueLight      = new THREE.PointLight(0x00aaff, 0, 25)
    this.blueLight.position.set(0, 5, -92)
    group.add(this.blueLight)

    this.chamberAmbient = new THREE.PointLight(0x003366, 0, 35)
    this.chamberAmbient.position.set(0, 3, -84)
    group.add(this.chamberAmbient)

    // ── All text on the back wall ───────────────
    // "YOU MADE IT THROUGH THE PIPELINE."
    this._addWallText(group, 'YOU MADE IT THROUGH THE PIPELINE.', -98.5, 5.8, 26, '#00aaff')

    // Divider line
    this._addWallText(group, '─────────────────────────────────', -98.5, 5.0, 18, '#1a4a6a')

    // Contact info stacked vertically
    this._addWallText(group, '✉  shanmukhsaivenkatmedisetti@gmail.com', -98.5, 4.2, 18, '#e8a020')
    this._addWallText(group, '◈  github.com/Shanmukha0505',             -98.5, 3.4, 20, '#4a9eff')
    this._addWallText(group, '◉  linkedin.com/in/ShanmukhaSai',         -98.5, 2.6, 20, '#0099cc')

    // Bottom tagline
    this._addWallText(group, 'MS Data Science · American Express · Denver CO', -98.5, 1.6, 15, '#4a4a6a')

    // ── Glowing floor guide lines ──────────────
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x004488 })
    ;[-0.6, 0.6].forEach(x => {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 18), lineMat)
      line.rotation.x = -Math.PI / 2
      line.position.set(x, 0.01, -88)
      group.add(line)
    })

    // ── Floating particles ─────────────────────
    this._buildParticles(group)

    this.scene.add(group)
    this.group = group
  }

  _addWallText(parent, text, z, y, fontSize, color) {
    const canvas  = document.createElement('canvas')
    canvas.width  = 1024
    canvas.height = 96
    const ctx     = canvas.getContext('2d')
    ctx.clearRect(0, 0, 1024, 96)
    ctx.font      = `bold ${fontSize}px "Courier New", monospace`
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText(text, 512, 64)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 0.85),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
    )
    mesh.position.set(0, y, z)
    parent.add(mesh)
  }

  _buildParticles(parent) {
    const count = 150
    const geo   = new THREE.BufferGeometry()
    const pos   = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 11
      pos[i * 3 + 1] = Math.random() * 6
      pos[i * 3 + 2] = -80 - Math.random() * 18
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.particles    = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0x44aaff, size: 0.05, transparent: true, opacity: 0.8
    }))
    this._particlePos = pos
    parent.add(this.particles)
  }

  update(delta) {
    const player = this.experience.player
    if (!player) return

    const pz = player.body.position.z

    // Fade blue light in as player approaches end
    if (pz < -78) {
      this._fadeIn = Math.min(1, this._fadeIn + delta * 0.5)
      const t = this.experience.time.elapsed
      this.blueLight.intensity      = this._fadeIn * (15 + Math.sin(t * 1.4) * 2)
      this.chamberAmbient.intensity = this._fadeIn * 7
    }

    if (pz < -84 && !this._triggered) {
      this._triggered = true
      console.log('💙 You made it through the pipeline.')
    }

    // Float particles
    if (this.particles && this._fadeIn > 0) {
      for (let i = 0; i < this._particlePos.length / 3; i++) {
        this._particlePos[i * 3 + 1] += delta * 0.1
        if (this._particlePos[i * 3 + 1] > 6.5) this._particlePos[i * 3 + 1] = 0.1
      }
      this.particles.geometry.attributes.position.needsUpdate = true
    }
  }
}
