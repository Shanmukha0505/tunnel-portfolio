// =============================================
// ScrollManager.js — The Rail System
//
// Maps scroll position → camera Z position
// This is what makes you "walk" through the tunnel
//
// Think of it like this:
//   scroll 0%   = Zone 01 entrance (z = 2)
//   scroll 30%  = Zone 02 skills   (z = -25)
//   scroll 65%  = Zone 03 projects (z = -55)
//   scroll 100% = Zone 04 contact  (z = -85)
//
// Bruno does this with a car + physics.
// We do it with GSAP + scroll.
// =============================================

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Zone milestone positions on the Z axis
export const ZONES = {
  entrance: 2,
  skills:  -25,
  projects:-55,
  contact: -85,
}

export default class ScrollManager {
  constructor(experience) {
    this.experience = experience
    this.camera     = experience.camera.instance

    // Current smooth camera target
    this.targetZ = ZONES.entrance
    this.targetX = 0
    this.targetY = 0

    this._buildScrollContainer()
    this._bindScroll()
  }

  // ─── Scroll Container ─────────────────────
  // An invisible tall div that gives the browser
  // something to scroll through. Canvas stays fixed.
  _buildScrollContainer() {
    // Override the CSS overflow:hidden on BOTH html and body
    document.documentElement.style.overflow = 'auto'
    document.documentElement.style.height   = 'auto'
    document.body.style.overflow = 'auto'
    document.body.style.height   = '600vh'

    // Canvas stays fixed — it never scrolls, world moves around it
    const canvas = document.getElementById('tunnel-canvas')
    canvas.style.position = 'fixed'
    canvas.style.top      = '0'
    canvas.style.left     = '0'
  }

  // ─── Map Scroll → Camera Z ────────────────
  _bindScroll() {
    const totalZ = ZONES.entrance - ZONES.contact  // total distance = 87 units

    ScrollTrigger.create({
      trigger:   document.body,
      start:     'top top',
      end:       'bottom bottom',
      onUpdate:  (self) => {
        const p = self.progress  // 0 → 1

        // Interpolate camera Z along the tunnel
        this.targetZ = ZONES.entrance - (p * totalZ)

        // Subtle side-to-side sway as you walk (like footsteps)
        this.targetX = Math.sin(p * Math.PI * 8) * 0.15

        // Subtle up-down bob
        this.targetY = Math.sin(p * Math.PI * 16) * 0.08

        // Fire zone events
        this._checkZone(p)
      }
    })
  }

  // ─── Zone Detection ───────────────────────
  _checkZone(progress) {
    let zone = 'entrance'
    if (progress > 0.28) zone = 'skills'
    if (progress > 0.60) zone = 'projects'
    if (progress > 0.88) zone = 'contact'

    if (zone !== this._currentZone) {
      this._currentZone = zone
      // Dispatch a custom event so zones can react
      window.dispatchEvent(new CustomEvent('zonechange', { detail: { zone } }))
      console.log(`%c → Zone: ${zone} `, 'background:#3b2a1a;color:#e8a020;padding:2px 6px;')
    }
  }

  // ─── Per-Frame Smooth Follow ──────────────
  // Camera lerps (smoothly follows) the scroll target
  // This prevents snapping — feels like floating/walking
  update(delta) {
    const speed = 4  // higher = snappier follow

    this.camera.position.z += (this.targetZ - this.camera.position.z) * speed * delta
    this.camera.position.x += (this.targetX - this.camera.position.x) * speed * delta
    this.camera.position.y += (this.targetY - this.camera.position.y) * speed * delta

    // Always look slightly ahead down the tunnel
    this.camera.lookAt(
      this.camera.position.x * 0.5,
      this.camera.position.y * 0.5,
      this.camera.position.z - 10
    )
  }
}
