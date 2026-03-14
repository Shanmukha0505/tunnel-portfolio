// =============================================
// Camera.js — 3rd Person Follow Camera
//
// Floats behind + above the player.
// Convention matches PlayerBody: yaw=0 = facing -Z
// =============================================

import * as THREE from 'three'

export default class Camera {
  constructor(experience) {
    this.experience = experience
    this.sizes      = experience.sizes
    this.scene      = experience.scene

    this.offsetBehind = 3.0
    this.offsetUp     = 1.4

    this._build()
  }

  _build() {
    this.instance = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      200
    )
    // Start behind where player spawns, looking toward tunnel
    this.instance.position.set(0, 3, 13)
    this.scene.add(this.instance)
  }

  update(delta) {
    const player = this.experience.player
    if (!player) return

    const body = player.body
    const yaw  = body.yaw

    // "Behind" player = opposite of forward direction
    // forward = (sin(yaw), 0, -cos(yaw)), so behind = (-sin(yaw), 0, cos(yaw))
    const targetX = body.position.x - Math.sin(yaw) * this.offsetBehind
    const targetY = body.position.y + this.offsetUp
    const targetZ = body.position.z + Math.cos(yaw) * this.offsetBehind

    // Smooth lerp follow
    const speed = 8
    this.instance.position.x += (targetX - this.instance.position.x) * speed * delta
    this.instance.position.y += (targetY - this.instance.position.y) * speed * delta
    this.instance.position.z += (targetZ - this.instance.position.z) * speed * delta

    // Look at player's head
    this.instance.lookAt(
      body.position.x,
      body.position.y + 0.6 + body.pitch * 1.5,
      body.position.z
    )
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }
}
