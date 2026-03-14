// =============================================
// TunnelEntrance.js — The door into the mine
// =============================================

import * as THREE from 'three'

export default class TunnelEntrance {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene

    this.triggered  = false   // has player entered yet?
    this._build()
  }

  _build() {
    const woodMat  = new THREE.MeshStandardMaterial({ color: 0x3d2008, roughness: 0.95 })
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x1a1612, roughness: 1.0 })
    const group    = new THREE.Group()

    // ── Left post ──────────────────────────────
    const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, 0.3), woodMat)
    leftPost.position.set(-2, 2, 0)
    group.add(leftPost)

    // ── Right post ─────────────────────────────
    const rightPost = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, 0.3), woodMat)
    rightPost.position.set(2, 2, 0)
    group.add(rightPost)

    // ── Top beam ───────────────────────────────
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.35, 0.3), woodMat)
    topBeam.position.set(0, 4, 0)
    group.add(topBeam)

    // ── Diagonal braces ────────────────────────
    const braceGeo = new THREE.BoxGeometry(0.15, 1.4, 0.15)
    const braceL   = new THREE.Mesh(braceGeo, woodMat)
    braceL.position.set(-1.6, 3.5, 0)
    braceL.rotation.z = 0.5
    group.add(braceL)

    const braceR = new THREE.Mesh(braceGeo, woodMat)
    braceR.position.set(1.6, 3.5, 0)
    braceR.rotation.z = -0.5
    group.add(braceR)

    // ── Stone arch surround ─────────────────────
    for (let i = 0; i < 7; i++) {
      const angle = (Math.PI / 6) * i
      const ax    = Math.cos(Math.PI - angle) * 2.4
      const ay    = Math.sin(Math.PI - angle) * 2.4 + 2
      const stone = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.4), stoneMat)
      stone.position.set(ax, ay, -0.2)
      stone.rotation.z = -angle + Math.PI / 2
      group.add(stone)
    }

    // ── "THE PIPELINE" carved sign ──────────────
    const signGeo = new THREE.BoxGeometry(3.2, 0.5, 0.12)
    const sign    = new THREE.Mesh(signGeo, stoneMat)
    sign.position.set(0, 4.6, 0)
    group.add(sign)

    // Sign text using canvas texture
    const canvas  = document.createElement('canvas')
    canvas.width  = 512
    canvas.height = 80
    const ctx     = canvas.getContext('2d')
    ctx.fillStyle = '#1a1612'
    ctx.fillRect(0, 0, 512, 80)
    ctx.font      = 'bold 36px "Courier New", monospace'
    ctx.fillStyle = '#c0a060'
    ctx.textAlign = 'center'
    ctx.fillText('THE  PIPELINE', 256, 52)
    const tex  = new THREE.CanvasTexture(canvas)
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 0.46),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    )
    label.position.set(0, 4.6, 0.08)
    group.add(label)

    // ── Lantern hanging from top beam ───────────
    this._addLantern(group, -0.6, 3.7, 0)
    this._addLantern(group,  0.6, 3.7, 0)

    // ── Dark void fill (the black inside) ───────
    const voidMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })
    const voidBox = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.8, 0.5), voidMat)
    voidBox.position.set(0, 1.9, -0.1)
    group.add(voidBox)

    // Position entrance at end of graveyard path
    group.position.set(0, 0, -12)
    this.scene.add(group)
    this.group = group

    // ── Lantern light ───────────────────────────
    this.lanternLight = new THREE.PointLight(0xff9900, 8, 6)
    this.lanternLight.position.set(0, 3.7, -12)
    this.scene.add(this.lanternLight)
  }

  _addLantern(parent, x, y, z) {
    const mat     = new THREE.MeshStandardMaterial({ color: 0x332200, roughness: 0.8 })
    const cage    = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.18), mat)
    cage.position.set(x, y, z)
    parent.add(cage)

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffaa33 })
    )
    glow.position.set(x, y, z)
    parent.add(glow)

    // Wire/chain above
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3), mat)
    chain.position.set(x, y + 0.29, z)
    parent.add(chain)
  }

  // Call every frame — check if player walked through the door
  checkTrigger(playerPosition, onEnter) {
    if (this.triggered) return
    const dist = playerPosition.distanceTo(new THREE.Vector3(0, playerPosition.y, -12))
    if (dist < 2.2) {
      this.triggered = true
      onEnter()
    }
  }

  update(delta) {
    // Lantern flicker
    const t = this.experience.time.elapsed
    this.lanternLight.intensity = 6 + Math.sin(t * 7) * 1.2 + Math.random() * 0.5
  }
}
