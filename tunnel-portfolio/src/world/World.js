// =============================================
// World.js — Boots and updates all zones
// =============================================

import Graveyard       from './Graveyard.js'
import TunnelEntrance  from './TunnelEntrance.js'
import Tunnel          from './Tunnel.js'
import Skeletons       from './Skeletons.js'
import SkillWalls      from './SkillWalls.js'
import CoalCarts       from './CoalCarts.js'
import ContactChamber  from './ContactChamber.js'
import NameWall        from './NameWall.js'

export default class World {
  constructor(experience) {
    this.experience   = experience
    this.insideTunnel = false

    this.graveyard       = new Graveyard(experience)
    this.tunnelEntrance  = new TunnelEntrance(experience)
    this.tunnel          = new Tunnel(experience)
    this.nameWall        = new NameWall(experience)
    this.skeletons       = new Skeletons(experience)
    this.skillWalls      = new SkillWalls(experience)
    this.coalCarts       = new CoalCarts(experience)
    this.contactChamber  = new ContactChamber(experience)
  }

  getFloorObjects() {
    return this.graveyard.floorMeshes
  }

  update(delta) {
    this.graveyard.update(delta)
    this.tunnelEntrance.update(delta)
    this.tunnel.update(delta)
    this.skeletons.update(delta)
    this.skillWalls.update(delta)
    this.coalCarts.update(delta)
    this.nameWall.update(delta)
    this.contactChamber.update(delta)

    // Check if player walked through the entrance
    const player = this.experience.player
    if (player && !this.insideTunnel) {
      this.tunnelEntrance.checkTrigger(
        player.body.position,
        () => this._enterTunnel()
      )
    }
  }

  _enterTunnel() {
    this.insideTunnel = true

    // Black flash transition
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position:fixed; inset:0; background:#000;
      z-index:999; pointer-events:none;
      animation: tunnelFade 2s ease forwards;
    `
    document.head.insertAdjacentHTML('beforeend', `
      <style>
        @keyframes tunnelFade {
          0%,40% { opacity:1; }
          100%   { opacity:0; }
        }
      </style>
    `)
    document.body.appendChild(overlay)
    setTimeout(() => overlay.remove(), 2200)

    console.log('🕯️ Entered the pipeline...')
  }
}
