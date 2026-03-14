// =============================================
// Torch.js — The Player's Only Light
// =============================================

import * as THREE from 'three'

export default class Torch {
  constructor(experience, player) {
    this.experience = experience
    this.scene      = experience.scene
    this.player     = player        // passed directly — no timing issue
    this.body       = player.body

    this._bobTime   = 0
    this._bobAmount = 0

    this._build()
  }

  _build() {
    // Main spot light — cone of torch light
    this.spot = new THREE.SpotLight(0xff8c30, 120, 55, Math.PI / 5, 0.35, 1.0)
    this.spot.castShadow = true
    this.spot.shadow.mapSize.set(512, 512)

    this.spotTarget = new THREE.Object3D()
    this.scene.add(this.spotTarget)
    this.spot.target = this.spotTarget
    this.scene.add(this.spot)

    // Warm glow around player's hand
    this.glow = new THREE.PointLight(0xff5500, 10, 14)
    this.scene.add(this.glow)

    // Visible flame dot
    this.flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffaa00 })
    )
    this.scene.add(this.flame)
  }

  update(delta) {
    const body = this.body
    const t    = this.experience.time.elapsed
    const yaw  = body.yaw

    // Bob when walking
    const targetBob = body.isMoving ? 1 : 0
    this._bobAmount += (targetBob - this._bobAmount) * 5 * delta
    if (body.isMoving) {
      this._bobTime += delta * (this.experience.controls.keys.run ? 10 : 6)
    }

    const bobX = Math.sin(this._bobTime) * 0.08 * this._bobAmount
    const bobY = Math.abs(Math.sin(this._bobTime * 2)) * 0.06 * this._bobAmount

    // Hand position — right side, slightly forward of player
    // forward in -Z convention: (sin(yaw), 0, -cos(yaw))
    const fwdX =  Math.sin(yaw)
    const fwdZ = -Math.cos(yaw)
    const rgtX =  Math.cos(yaw)
    const rgtZ =  Math.sin(yaw)

    const handX = body.position.x + rgtX * 0.4 + fwdX * 0.3 + bobX
    const handY = body.position.y - 0.3 + bobY
    const handZ = body.position.z + rgtZ * 0.4 + fwdZ * 0.3

    this.spot.position.set(handX, handY, handZ)
    this.glow.position.set(handX, handY, handZ)
    this.flame.position.set(handX, handY + 0.05, handZ)

    // Aim torch forward + slight down in look direction
    this.spotTarget.position.set(
      body.position.x + fwdX * 10,
      body.position.y + body.pitch * 6 - 1,
      body.position.z + fwdZ * 10
    )

    // Flicker
    const flicker = Math.sin(t * 13) * 0.6 + Math.sin(t * 7.3) * 0.4 + Math.random() * 0.3
    this.spot.intensity  = 110 + flicker * 10
    this.glow.intensity  =   9 + flicker * 2
    this.flame.scale.setScalar(0.9 + flicker * 0.15)
  }
}
