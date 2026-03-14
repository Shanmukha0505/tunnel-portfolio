// =============================================
// Zone01_Entrance.js — The Mine Entrance
// =============================================

import * as THREE from 'three'

export default class Zone01_Entrance {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene
    this.camera     = experience.camera.instance
    this.sizes      = experience.sizes

    this.mouse = new THREE.Vector2(0, 0)

    this._buildTunnel()
    this._buildBeams()
    this._buildLights()
    this._buildNameText()
    this._bindMouse()

    console.log('%c Zone 01 — Entrance loaded ', 'background:#1a0a00;color:#e8a020;padding:4px 8px;')
  }

  // ─── Tunnel ───────────────────────────────
  _buildTunnel() {
    // 100 units long — covers all 4 zones (entrance z=2 to contact z=-85)
    const geo = new THREE.CylinderGeometry(4, 4, 100, 12, 1, true)
    const mat = new THREE.MeshStandardMaterial({
      color:     0x2a1a0a,
      roughness: 1.0,
      side:      THREE.BackSide,
    })
    this.tunnel = new THREE.Mesh(geo, mat)
    this.tunnel.rotation.x = Math.PI / 2
    this.tunnel.position.z = -48
    this.scene.add(this.tunnel)

    // Fog — darkness swallows the far end (Limbo feel), less aggressive
    this.experience.scene.fog = new THREE.FogExp2(0x000000, 0.025)
  }

  // ─── Wooden Support Beams ─────────────────
  _buildBeams() {
    const vertGeo = new THREE.BoxGeometry(0.2, 7, 0.2)
    const horzGeo = new THREE.BoxGeometry(8, 0.2, 0.2)
    const mat     = new THREE.MeshBasicMaterial({ color: 0x1a0e05 })

    for (let i = 0; i < 10; i++) {
      const z = -i * 9 - 2

      const left = new THREE.Mesh(vertGeo, mat)
      left.position.set(-3.5, 0, z)
      this.scene.add(left)

      const right = new THREE.Mesh(vertGeo, mat)
      right.position.set(3.5, 0, z)
      this.scene.add(right)

      const top = new THREE.Mesh(horzGeo, mat)
      top.position.set(0, 3.5, z)
      this.scene.add(top)
    }
  }

  // ─── Lights ───────────────────────────────
  _buildLights() {
    // Ambient — enough to see both walls, still scary dark
    this.ambient = new THREE.AmbientLight(0x331a08, 1.5)
    this.scene.add(this.ambient)

    // Torch spotlight — follows mouse
    this.torch = new THREE.SpotLight(0xff8c30, 40, 30, Math.PI / 5, 0.4, 1)
    this.torch.position.set(0, 0, 2)

    this.torchTarget = new THREE.Object3D()
    this.torchTarget.position.set(0, 0, -8)
    this.scene.add(this.torchTarget)
    this.torch.target = this.torchTarget
    this.scene.add(this.torch)

    // Warm flicker glow around camera
    this.glow = new THREE.PointLight(0xff6010, 6, 10)
    this.glow.position.set(0, 0, 2)
    this.scene.add(this.glow)
  }

  // ─── "SHANMUKHA" carved in wall ──────────
  _buildNameText() {
    const canvas  = document.createElement('canvas')
    canvas.width  = 1024
    canvas.height = 256
    const ctx     = canvas.getContext('2d')

    ctx.fillStyle = '#2a1a0a'
    ctx.fillRect(0, 0, 1024, 256)

    ctx.font         = 'bold 100px "Courier New", monospace'
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'

    // Carved shadow
    ctx.fillStyle = '#000'
    ctx.fillText('SHANMUKHA', 514, 130)

    // Main carved face
    ctx.fillStyle = '#8b6040'
    ctx.fillText('SHANMUKHA', 512, 128)

    const texture = new THREE.CanvasTexture(canvas)
    const geo     = new THREE.PlaneGeometry(6, 1.5)
    const mat     = new THREE.MeshBasicMaterial({ map: texture, transparent: true })

    this.nameSign = new THREE.Mesh(geo, mat)
    this.nameSign.position.set(0, 2.8, -1)
    this.scene.add(this.nameSign)
  }

  // ─── Mouse ────────────────────────────────
  _bindMouse() {
    this.torchEl = document.getElementById('torch-cursor')

    window.addEventListener('mousemove', (e) => {
      this.mouse.x =  (e.clientX / this.sizes.width)  * 2 - 1
      this.mouse.y = -(e.clientY / this.sizes.height) * 2 + 1

      // Move the CSS torch glow to follow cursor
      if (this.torchEl) {
        this.torchEl.style.left = e.clientX + 'px'
        this.torchEl.style.top  = e.clientY + 'px'
      }
    })
  }

  // ─── Per-Frame Update ─────────────────────
  update(delta) {
    const camZ = this.camera.position.z

    // Torch follows mouse, stays at camera position
    this.torch.position.set(
      this.camera.position.x,
      this.camera.position.y,
      camZ
    )
    this.glow.position.copy(this.torch.position)

    // Aim torch based on mouse
    this.torchTarget.position.set(
      this.mouse.x * 6,
      this.mouse.y * 4,
      camZ - 10
    )

    // Flicker
    const t = Date.now() * 0.001
    this.glow.intensity  = 5 + Math.sin(t * 7)  * 1 + Math.random() * 0.5
    this.torch.intensity = 38 + Math.sin(t * 3.3) * 2
  }
}
