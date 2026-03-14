// =============================================
// Graveyard.js — Outdoor Starting Area
//
// The player spawns here.
// Walk forward toward the tunnel entrance.
//
// Built entirely from Three.js geometry —
// no Blender needed.
// =============================================

import * as THREE from 'three'
import seedrandom  from 'seedrandom'

const rng = seedrandom('shanmukha-mine')  // same layout every load

export default class Graveyard {
  constructor(experience) {
    this.experience  = experience
    this.scene       = experience.scene
    this.floorMeshes = []

    this._buildGround()
    this._buildSky()
    this._buildMoon()
    this._buildFog()
    this._buildGravestones()
    this._buildDeadTrees()
    this._buildTunnelEntrance()
    this._buildStars()
  }

  // ── Ground ──────────────────────────────
  _buildGround() {
    const geo = new THREE.PlaneGeometry(80, 80, 20, 20)
    const mat = new THREE.MeshStandardMaterial({
      color:     0x1a1a0e,
      roughness: 1.0,
    })
    const ground = new THREE.Mesh(geo, mat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0
    ground.receiveShadow = true
    this.scene.add(ground)
    this.floorMeshes.push(ground)
  }

  // ── Night Sky ───────────────────────────
  _buildSky() {
    const geo = new THREE.SphereGeometry(90, 16, 16)
    const mat = new THREE.MeshBasicMaterial({
      color: 0x05080f,
      side:  THREE.BackSide,
    })
    this.scene.add(new THREE.Mesh(geo, mat))
  }

  // ── Moon (directional light) ─────────────
  _buildMoon() {
    // Cold blue-white moonlight
    const moon = new THREE.DirectionalLight(0x8899cc, 0.35)
    moon.position.set(20, 40, -20)
    moon.castShadow = true
    moon.shadow.mapSize.set(1024, 1024)
    moon.shadow.camera.near = 0.5
    moon.shadow.camera.far  = 120
    moon.shadow.camera.left = moon.shadow.camera.bottom = -40
    moon.shadow.camera.right = moon.shadow.camera.top   =  40
    this.scene.add(moon)

    // Ambient — dim but enough to see the graveyard shape
    this.scene.add(new THREE.AmbientLight(0x223355, 1.2))
  }

  // ── Fog ─────────────────────────────────
  _buildFog() {
    // Thin ground fog, grey-black
    this.scene.fog = new THREE.FogExp2(0x05080f, 0.022)
  }

  // ── Gravestones ─────────────────────────
  _buildGravestones() {
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.9 })
    const crossMat = new THREE.MeshStandardMaterial({ color: 0x1a1a20, roughness: 1.0 })

    for (let i = 0; i < 28; i++) {
      const x = (rng() - 0.5) * 50
      const z = (rng() - 0.5) * 40 + 5

      // Skip area right in front of tunnel entrance
      if (Math.abs(x) < 4 && z > -5 && z < 15) continue

      const group = new THREE.Group()

      // Stone base
      const h   = 0.6 + rng() * 0.5
      const geo = new THREE.BoxGeometry(0.5, h, 0.15)
      const stone = new THREE.Mesh(geo, stoneMat)
      stone.position.y = h / 2
      stone.rotation.y = (rng() - 0.5) * 0.3
      stone.castShadow = true
      group.add(stone)

      // Cross on top of some stones
      if (rng() > 0.4) {
        const v = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.06), crossMat)
        v.position.y = h + 0.15
        const hz = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.06), crossMat)
        hz.position.y = h + 0.22
        group.add(v, hz)
      }

      group.position.set(x, 0, z)
      this.scene.add(group)
    }
  }

  // ── Dead Trees ──────────────────────────
  _buildDeadTrees() {
    const trunkMat  = new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 1.0 })
    const branchMat = new THREE.MeshStandardMaterial({ color: 0x120c06, roughness: 1.0 })

    for (let i = 0; i < 12; i++) {
      const x = (rng() - 0.5) * 55
      const z = (rng() - 0.5) * 45 + 5
      if (Math.abs(x) < 6 && z > -8 && z < 16) continue

      const group = new THREE.Group()

      // Trunk
      const h     = 3 + rng() * 3
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.18, h, 6),
        trunkMat
      )
      trunk.position.y = h / 2
      trunk.castShadow = true
      group.add(trunk)

      // Random branches
      const numBranches = 2 + Math.floor(rng() * 4)
      for (let b = 0; b < numBranches; b++) {
        const bLen   = 0.6 + rng() * 1.2
        const bY     = h * 0.5 + rng() * h * 0.5
        const bAngle = rng() * Math.PI * 2
        const bTilt  = 0.4 + rng() * 0.6

        const branch = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.06, bLen, 5),
          branchMat
        )
        branch.position.set(
          Math.cos(bAngle) * bLen * 0.4,
          bY,
          Math.sin(bAngle) * bLen * 0.4
        )
        branch.rotation.z = bTilt * Math.cos(bAngle)
        branch.rotation.x = bTilt * Math.sin(bAngle)
        group.add(branch)
      }

      group.position.set(x, 0, z)
      group.rotation.y = rng() * Math.PI * 2
      this.scene.add(group)
    }
  }

  // ── Tunnel Entrance ─────────────────────
  _buildTunnelEntrance() {
    const woodMat  = new THREE.MeshStandardMaterial({ color: 0x2a1808, roughness: 0.9 })
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x111008, roughness: 1.0 })

    const group = new THREE.Group()

    // Rocky arch surround
    const archGeo = new THREE.BoxGeometry(7, 6, 1.5)
    const arch    = new THREE.Mesh(archGeo, stoneMat)
    arch.position.y = 3
    group.add(arch)

    // Dark opening (hole into the tunnel)
    const holeGeo = new THREE.BoxGeometry(3.5, 4.5, 1.6)
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const hole    = new THREE.Mesh(holeGeo, holeMat)
    hole.position.y = 2.5
    group.add(hole)

    // Left wooden post
    const postGeo = new THREE.BoxGeometry(0.25, 4.5, 0.25)
    const leftPost = new THREE.Mesh(postGeo, woodMat)
    leftPost.position.set(-1.9, 2.25, 0)
    leftPost.castShadow = true
    group.add(leftPost)

    // Right wooden post
    const rightPost = leftPost.clone()
    rightPost.position.set(1.9, 2.25, 0)
    group.add(rightPost)

    // Top beam
    const beamGeo  = new THREE.BoxGeometry(4.1, 0.25, 0.25)
    const topBeam  = new THREE.Mesh(beamGeo, woodMat)
    topBeam.position.set(0, 4.6, 0)
    group.add(topBeam)

    // "THE PIPELINE" sign above entrance
    group.add(this._makeSign('THE PIPELINE', 0, 5.6, 0))

    // Lantern hanging from top beam
    this._buildLantern(group, -0.8, 4.2, 0)
    this._buildLantern(group,  0.8, 4.2, 0)

    group.position.set(0, 0, -8)   // tunnel entrance is north
    this.scene.add(group)
  }

  _buildLantern(parent, x, y, z) {
    const mat  = new THREE.MeshStandardMaterial({ color: 0x332200, roughness: 0.8 })
    const cage = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.2), mat)
    cage.position.set(x, y, z)
    parent.add(cage)

    const light = new THREE.PointLight(0xff8800, 1.2, 4)
    light.position.set(x, y, z)
    parent.add(light)
  }

  _makeSign(text, x, y, z) {
    const canvas = document.createElement('canvas')
    canvas.width  = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#1a0e05'
    ctx.fillRect(0, 0, 512, 128)
    ctx.font      = 'bold 52px "Courier New"'
    ctx.fillStyle = '#8b6040'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 256, 64)

    const tex  = new THREE.CanvasTexture(canvas)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 0.6),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    )
    mesh.position.set(x, y, z)
    return mesh
  }

  // ── Stars ───────────────────────────────
  _buildStars() {
    const geo      = new THREE.BufferGeometry()
    const count    = 1200
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const theta = rng() * Math.PI * 2
      const phi   = Math.acos(2 * rng() - 1)
      const r     = 80 + rng() * 5
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi))  // only upper hemisphere
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat   = new THREE.PointsMaterial({ color: 0xaaaacc, size: 0.3, sizeAttenuation: true })
    this.scene.add(new THREE.Points(geo, mat))
  }

  // Called by PlayerBody for floor raycasting
  getFloorObjects() {
    return this.floorMeshes
  }
}
