// =============================================
// Tunnel.js — The mine corridor
// =============================================

import * as THREE from 'three'

export default class Tunnel {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene

    this._build()
  }

  _build() {
    const group = new THREE.Group()

    // ── Floor ────────────────────────────────────
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1a1008, roughness: 1.0, metalness: 0
    })
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 80), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, 0, -52)
    group.add(floor)

    // ── Ceiling ───────────────────────────────────
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x120c06, roughness: 1.0 })
    const ceil    = new THREE.Mesh(new THREE.PlaneGeometry(5, 80), ceilMat)
    ceil.rotation.x = Math.PI / 2
    ceil.position.set(0, 3.8, -52)
    group.add(ceil)

    // ── Left wall ─────────────────────────────────
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e1408, roughness: 1.0 })
    const wallL   = new THREE.Mesh(new THREE.PlaneGeometry(80, 3.8), wallMat)
    wallL.rotation.y = Math.PI / 2
    wallL.position.set(-2.5, 1.9, -52)
    group.add(wallL)

    // ── Right wall ────────────────────────────────
    const wallR = new THREE.Mesh(new THREE.PlaneGeometry(80, 3.8), wallMat)
    wallR.rotation.y = -Math.PI / 2
    wallR.position.set(2.5, 1.9, -52)
    group.add(wallR)

    // ── End wall (back of tunnel) ─────────────────
    const endWall = new THREE.Mesh(new THREE.PlaneGeometry(5, 3.8), wallMat)
    endWall.position.set(0, 1.9, -92)
    group.add(endWall)

    // ── Wooden support beams every 6 units ────────
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x2d1a08, roughness: 0.9 })
    for (let z = -14; z > -90; z -= 7) {
      this._addBeam(group, beamMat, z)
    }

    // ── Rail tracks on the floor ──────────────────
    this._buildRails(group)

    // ── Hanging lanterns every 14 units ──────────
    for (let z = -18; z > -88; z -= 14) {
      this._addHangingLantern(group, z)
    }

    // ── Coal piles scattered on floor ─────────────
    const coalMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1.0 })
    const coalPositions = [
      [-1.8, -22], [1.6, -30], [-1.2, -44], [1.9, -58], [-1.5, -66]
    ]
    coalPositions.forEach(([x, z]) => {
      const coal = new THREE.Mesh(new THREE.SphereGeometry(0.25, 5, 4), coalMat)
      coal.scale.y = 0.5
      coal.position.set(x, 0.1, z)
      group.add(coal)
    })

    // ── Exposed pipes on left wall ────────────────
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.4 })
    for (let z = -16; z > -85; z -= 4) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4.2, 8), pipeMat)
      pipe.rotation.z = Math.PI / 2
      pipe.position.set(-2.3, 2.8, z)
      group.add(pipe)
    }

    // Tunnel starts at z=-12 (just behind the entrance)
    group.position.set(0, 0, 0)
    this.scene.add(group)
    this.group = group
  }

  _addBeam(parent, mat, z) {
    // Left vertical
    const lv = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.4, 0.2), mat)
    lv.position.set(-2.2, 1.7, z)
    parent.add(lv)

    // Right vertical
    const rv = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.4, 0.2), mat)
    rv.position.set(2.2, 1.7, z)
    parent.add(rv)

    // Top horizontal
    const top = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.22, 0.22), mat)
    top.position.set(0, 3.4, z)
    parent.add(top)

    // Diagonal braces (X shape on top corners)
    const braceGeo = new THREE.BoxGeometry(0.12, 0.9, 0.12)
    const bl = new THREE.Mesh(braceGeo, mat)
    bl.position.set(-1.8, 3.15, z)
    bl.rotation.z = 0.45
    parent.add(bl)

    const br = new THREE.Mesh(braceGeo, mat)
    br.position.set(1.8, 3.15, z)
    br.rotation.z = -0.45
    parent.add(br)
  }

  _buildRails(parent) {
    const railMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.5, metalness: 0.7 })
    const tieMat  = new THREE.MeshStandardMaterial({ color: 0x2d1a08, roughness: 1.0 })

    // Left rail
    const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 80), railMat)
    leftRail.position.set(-0.5, 0.04, -52)
    parent.add(leftRail)

    // Right rail
    const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 80), railMat)
    rightRail.position.set(0.5, 0.04, -52)
    parent.add(rightRail)

    // Ties (cross pieces every 1.2 units)
    for (let z = -13; z > -90; z -= 1.2) {
      const tie = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 0.18), tieMat)
      tie.position.set(0, 0.01, z)
      parent.add(tie)
    }
  }

  _addHangingLantern(parent, z) {
    const mat   = new THREE.MeshStandardMaterial({ color: 0x3d2800, roughness: 0.7 })
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 6), mat)
    chain.position.set(0, 3.5, z)
    parent.add(chain)

    const cage = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 0.22), mat)
    cage.position.set(0, 3.1, z)
    parent.add(cage)

    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffaa22 })
    )
    flame.position.set(0, 3.1, z)
    parent.add(flame)

    // Each lantern has a dim point light — very short range so only local glow
    const light = new THREE.PointLight(0xff9922, 2, 4)
    light.position.set(0, 3.1, z)
    parent.add(light)

    // Store for flicker in update
    if (!this._lanternLights) this._lanternLights = []
    this._lanternLights.push(light)
  }

  update(delta) {
    if (!this._lanternLights) return
    const t = this.experience.time.elapsed
    this._lanternLights.forEach((light, i) => {
      light.intensity = 1.5 + Math.sin(t * 5 + i * 1.7) * 0.4 + Math.random() * 0.2
    })
  }
}
