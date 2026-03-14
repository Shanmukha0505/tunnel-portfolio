// =============================================
// PlayerBody.js — Movement + Collision
//
// Convention: yaw=0 → player faces -Z (tunnel)
// =============================================

import * as THREE from 'three'

const WALK_SPEED = 4
const RUN_SPEED  = 9
const GRAVITY    = -18
const MOUSE_SENS = 0.0018

export default class PlayerBody {
  constructor(experience) {
    this.experience = experience
    this.controls   = experience.controls

    // Spawn in front of the tunnel entrance, facing it
    this.position   = new THREE.Vector3(0, 1.7, 10)

    this.velocityY  = 0
    this.yaw        = 0      // 0 = facing -Z = toward tunnel
    this.pitch      = 0

    this._forward   = new THREE.Vector3()
    this._right     = new THREE.Vector3()
    this._move      = new THREE.Vector3()
    this._raycaster = new THREE.Raycaster()

    this.isMoving   = false
    this.stepTime   = 0
  }

  update(delta) {
    const controls = this.controls

    // ── Mouse look ──────────────────────────
    this.yaw   -= controls.mouseDelta.x * MOUSE_SENS
    this.pitch -= controls.mouseDelta.y * MOUSE_SENS
    this.pitch  = Math.max(-0.5, Math.min(0.4, this.pitch))

    // ── Direction vectors ────────────────────
    // yaw=0 → facing -Z (tunnel direction)
    this._forward.set( Math.sin(this.yaw), 0, -Math.cos(this.yaw))
    this._right.set(   Math.cos(this.yaw), 0,  Math.sin(this.yaw))

    const speed = controls.keys.run ? RUN_SPEED : WALK_SPEED

    this._move.set(0, 0, 0)
    if (controls.keys.forward)  this._move.addScaledVector(this._forward,  1)
    if (controls.keys.backward) this._move.addScaledVector(this._forward, -1)
    if (controls.keys.left)     this._move.addScaledVector(this._right,   -1)
    if (controls.keys.right)    this._move.addScaledVector(this._right,    1)

    this.isMoving = this._move.length() > 0
    if (this.isMoving) {
      this._move.normalize()
      this.position.addScaledVector(this._move, speed * delta)
      this.stepTime += delta
    }

    // ── Gravity ─────────────────────────────
    this.velocityY += GRAVITY * delta
    this.position.y += this.velocityY * delta

    // ── Floor check ─────────────────────────
    const world = this.experience.world
    if (world) {
      const floorObjects = world.getFloorObjects()
      if (floorObjects.length > 0) {
        this._raycaster.set(this.position, new THREE.Vector3(0, -1, 0))
        const hits = this._raycaster.intersectObjects(floorObjects, false)
        if (hits.length > 0 && hits[0].distance < 2.5) {
          this.position.y = hits[0].point.y + 1.7
          this.velocityY  = 0
        }
      }
    }

    // Safety floor
    if (this.position.y < 1.7) {
      this.position.y = 1.7
      this.velocityY  = 0
    }
  }
}
