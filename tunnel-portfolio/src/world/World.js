// =============================================
// World.js — The full 5-chapter journey
//
// CHAPTER I   — WHO I AM       z -14 to -24
// CHAPTER II  — SKILLS         z -24 to -53
// CHAPTER III — PROJECTS       z -53 to -73
// CHAPTER IV  — EXPERIENCE     z -73 to -84
// CHAPTER V   — GOALS          z -84 to -88
//              THE EXIT        z -88 to -100
// =============================================

import Graveyard       from './Graveyard.js'
import TunnelEntrance  from './TunnelEntrance.js'
import Tunnel          from './Tunnel.js'
import NameWall        from './NameWall.js'
import SectionMarker   from './SectionMarker.js'
import WhoIAmZone      from './WhoIAmZone.js'
import Skeletons       from './Skeletons.js'
import SkillWalls      from './SkillWalls.js'
import CoalCarts       from './CoalCarts.js'
import ExperienceZone  from './ExperienceZone.js'
import GoalsZone       from './GoalsZone.js'
import ContactChamber  from './ContactChamber.js'

export default class World {
  constructor(experience) {
    this._exp         = experience   // engine reference
    this.insideTunnel = false

    // ── Outdoor ────────────────────────────────
    this.graveyard      = new Graveyard(experience)
    this.tunnelEntrance = new TunnelEntrance(experience)

    // ── Tunnel shell ───────────────────────────
    this.tunnel  = new Tunnel(experience)
    this.nameWall = new NameWall(experience)

    // ── Chapter markers (carved stone arches) ──
    this.markers = [
      new SectionMarker(experience, {
        z: -14, chapter: 'CHAPTER I', title: 'WHO I AM', color: 0xc0c0c0
      }),
      new SectionMarker(experience, {
        z: -25, chapter: 'CHAPTER II', title: 'SKILLS', color: 0xe8a020
      }),
      new SectionMarker(experience, {
        z: -53, chapter: 'CHAPTER III', title: 'PROJECTS', color: 0x9933ff
      }),
      new SectionMarker(experience, {
        z: -73, chapter: 'CHAPTER IV', title: 'EXPERIENCE', color: 0xcc4400
      }),
      new SectionMarker(experience, {
        z: -84, chapter: 'CHAPTER V', title: 'GOALS & VISION', color: 0x20e840
      }),
    ]

    // ── Chapter content ────────────────────────
    this.whoIAm     = new WhoIAmZone(experience)
    this.skeletons  = new Skeletons(experience)
    this.skillWalls = new SkillWalls(experience)
    this.coalCarts  = new CoalCarts(experience)
    this.expZone    = new ExperienceZone(experience)
    this.goals      = new GoalsZone(experience)
    this.contact    = new ContactChamber(experience)
  }

  getFloorObjects() {
    return this.graveyard.floorMeshes
  }

  update(delta) {
    this.graveyard.update(delta)
    this.tunnelEntrance.update(delta)
    this.tunnel.update(delta)
    this.nameWall.update(delta)
    this.markers.forEach(m => m.update(delta))
    this.whoIAm.update(delta)
    this.skeletons.update(delta)
    this.skillWalls.update(delta)
    this.coalCarts.update(delta)
    this.expZone.update(delta)
    this.goals.update(delta)
    this.contact.update(delta)

    // Entrance trigger
    const player = this._exp?.player
    if (player && !this.insideTunnel) {
      this.tunnelEntrance.checkTrigger(
        player.body.position,
        () => this._enterTunnel()
      )
    }
  }

  _enterTunnel() {
    this.insideTunnel = true
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position:fixed;inset:0;background:#000;z-index:999;
      pointer-events:none;animation:tunnelFade 2s ease forwards;
    `
    document.head.insertAdjacentHTML('beforeend', `
      <style>
        @keyframes tunnelFade { 0%,40%{opacity:1}100%{opacity:0} }
      </style>
    `)
    document.body.appendChild(overlay)
    setTimeout(() => overlay.remove(), 2200)
  }
}
