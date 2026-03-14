// =============================================
// CoalCarts.js — 3 project carts on rails
// Walk up + press E to open project card
// =============================================

import * as THREE from 'three'

const PROJECTS = [
  {
    id:    'quantum',
    name:  'QUANTUM PLATFORM',
    z:     -55,
    color: 0x9933ff,
    title: 'LLM Orchestration & Quantum Platform',
    tech:  'FastAPI · LangChain · n8n · React · Python',
    desc:  [
      '▸ Designed full-stack backend for quantum computing platform',
      '▸ FastAPI for high-performance endpoint routing',
      '▸ LangChain + n8n: translates user prompts into platform commands',
      '▸ LLM-powered workflow automation layer',
    ],
    link: 'https://github.com/Shanmukha0505'
  },
  {
    id:    'risk',
    name:  'RISK PIPELINE',
    z:     -62,
    color: 0xff6600,
    title: 'Risk Analytics Pipeline',
    tech:  'Databricks · PySpark · AWS · Delta Lake · Redshift',
    desc:  [
      '▸ Handles 500K+ daily transactions for Risk workflows',
      '▸ Reduced end-to-end data latency by 35%',
      '▸ Automated 40% of manual ELT operations',
      '▸ PCI DSS compliant data governance framework',
    ],
    link: 'https://github.com/Shanmukha0505'
  },
  {
    id:    'skin',
    name:  'SKIN CLASSIFIER',
    z:     -69,
    color: 0x00cc88,
    title: 'Skin Lesion Classifier',
    tech:  'EfficientNetB2 · TensorFlow · Docker · ISIC 2019',
    desc:  [
      '▸ Multi-class classification on 25K+ dermoscopic images',
      '▸ EfficientNet + data augmentation → 87% F1-score',
      '▸ Resolved class-imbalance for reliable predictions',
      '▸ Containerized with Docker for reproducible deployment',
    ],
    link: 'https://github.com/Shanmukha0505'
  },
]

const INTERACT_DIST = 2.8

export default class CoalCarts {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene
    this.carts      = []
    this._activeCard = null

    this._buildAllCarts()
    this._buildUI()
  }

  _buildAllCarts() {
    PROJECTS.forEach(proj => {
      const cart = this._buildCart(proj)
      this.carts.push({ mesh: cart, proj, interactable: false })
    })
  }

  _buildCart(proj) {
    const group   = new THREE.Group()
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x2d1a08, roughness: 0.9 })
    const metalMat= new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.6 })

    // Cart body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 1.4), woodMat)
    body.position.y = 0.45
    group.add(body)

    // Cart rim (metal edge)
    const rim = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.06, 1.46), metalMat)
    rim.position.y = 0.74
    group.add(rim)

    // 4 wheels
    const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 10)
    const positions = [[-0.45, -0.25], [0.45, -0.25], [-0.45, 0.38], [0.45, 0.38]]
    positions.forEach(([wx, wz]) => {
      // Relative Z offsets for front/back pairs
      const isBack = wz > 0
      const w = new THREE.Mesh(wheelGeo, metalMat)
      w.rotation.z = Math.PI / 2
      w.position.set(wx, 0.18, isBack ? 0.45 : -0.45)
      group.add(w)
    })

    // Coal chunks inside
    const coalMat = new THREE.MeshStandardMaterial({ color: 0x0a0808, roughness: 1.0 })
    for (let i = 0; i < 5; i++) {
      const chunk = new THREE.Mesh(new THREE.SphereGeometry(0.1 + Math.random() * 0.08, 5, 4), coalMat)
      chunk.position.set(
        (Math.random() - 0.5) * 0.6,
        0.62 + Math.random() * 0.1,
        (Math.random() - 0.5) * 0.9
      )
      chunk.scale.y = 0.6
      group.add(chunk)
    }

    // Project name sign on cart side
    const canvas  = document.createElement('canvas')
    canvas.width  = 256
    canvas.height = 80
    const ctx     = canvas.getContext('2d')
    ctx.fillStyle = '#1a1008'
    ctx.fillRect(0, 0, 256, 80)
    ctx.font      = 'bold 20px "Courier New"'
    ctx.fillStyle = '#' + proj.color.toString(16).padStart(6, '0')
    ctx.textAlign = 'center'
    ctx.fillText(proj.name, 128, 48)
    const tex  = new THREE.CanvasTexture(canvas)
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(0.86, 0.27),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    )
    sign.position.set(0, 0.45, 0.71)
    group.add(sign)

    // Glowing light inside cart
    const glow = new THREE.PointLight(proj.color, 1.5, 3)
    glow.position.set(0, 0.8, 0)
    group.add(glow)

    // "[ E ] Inspect" prompt above cart
    const promptCanvas  = document.createElement('canvas')
    promptCanvas.width  = 200
    promptCanvas.height = 40
    const pctx          = promptCanvas.getContext('2d')
    pctx.clearRect(0, 0, 200, 40)
    pctx.font      = '18px "Courier New"'
    pctx.fillStyle = '#ffffff'
    pctx.textAlign = 'center'
    pctx.fillText('[ E ] Inspect', 100, 28)
    const promptSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(promptCanvas), transparent: true, opacity: 0 })
    )
    promptSprite.scale.set(1.0, 0.22, 1)
    promptSprite.position.y = 1.4
    group.add(promptSprite)
    group._promptSprite = promptSprite

    // Slight random rotation for a scattered look
    group.rotation.y = (Math.random() - 0.5) * 0.15

    group.position.set(0.1, 0, proj.z)
    this.scene.add(group)
    return group
  }

  // ── HTML overlay project card ─────────────────
  _buildUI() {
    this._card = document.createElement('div')
    this._card.id = 'project-card-overlay'
    this._card.style.cssText = `
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(0.85);
      width: 520px;
      background: rgba(5,3,1,0.96);
      border: 1px solid #c0542a;
      padding: 32px 36px;
      font-family: 'Courier New', monospace;
      color: #d4c9b0;
      z-index: 500;
      display: none;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: all;
    `
    document.body.appendChild(this._card)

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.code === 'Escape' || e.code === 'KeyE') this._closeCard()
    })
  }

  _openCard(proj) {
    this._activeCard = proj
    this._card.innerHTML = `
      <div style="color:#c0542a;font-size:11px;letter-spacing:3px;margin-bottom:8px">
        ── PROJECT FILE ──
      </div>
      <h2 style="color:#e8a020;font-size:20px;margin-bottom:6px">${proj.title}</h2>
      <div style="color:#4a9eff;font-size:12px;margin-bottom:20px">${proj.tech}</div>
      <div style="margin-bottom:20px;line-height:1.8;font-size:13px">
        ${proj.desc.map(d => `<div>${d}</div>`).join('')}
      </div>
      <div style="display:flex;gap:16px;margin-top:8px">
        <a href="${proj.link}" target="_blank"
           style="color:#e8a020;text-decoration:none;border:1px solid #e8a020;padding:6px 16px;font-size:12px">
          View on GitHub →
        </a>
        <span style="color:#4a4a4a;font-size:12px;line-height:2.2">[ E ] or Esc to close</span>
      </div>
    `
    this._card.style.display = 'block'
    requestAnimationFrame(() => {
      this._card.style.opacity = '1'
      this._card.style.transform = 'translate(-50%, -50%) scale(1)'
    })
  }

  _closeCard() {
    if (!this._activeCard) return
    this._card.style.opacity = '0'
    this._card.style.transform = 'translate(-50%, -50%) scale(0.85)'
    setTimeout(() => { this._card.style.display = 'none' }, 300)
    this._activeCard = null
  }

  update(delta) {
    const player = this.experience.player
    if (!player) return

    const px = player.body.position.x
    const pz = player.body.position.z

    this.carts.forEach(({ mesh, proj }) => {
      const dist = Math.sqrt((px - 0.1) ** 2 + (pz - proj.z) ** 2)
      const close = dist < INTERACT_DIST

      // Show/hide [E] prompt
      const sprite = mesh._promptSprite
      if (sprite) {
        const targetOpacity = close ? 1 : 0
        sprite.material.opacity += (targetOpacity - sprite.material.opacity) * 6 * delta
      }

      // Glow pulse when close
      const light = mesh.children.find(c => c.isPointLight)
      if (light) {
        const t = this.experience.time.elapsed
        light.intensity = close
          ? 3 + Math.sin(t * 4) * 1
          : 1.2 + Math.sin(t * 2) * 0.3
      }
    })
  }

  // Called by Controls.js when E is pressed
  handleInteract(playerPosition) {
    if (this._activeCard) {
      this._closeCard()
      return
    }

    for (const { proj } of this.carts) {
      const dist = Math.sqrt(
        (playerPosition.x - 0.1) ** 2 +
        (playerPosition.z - proj.z) ** 2
      )
      if (dist < INTERACT_DIST) {
        this._openCard(proj)
        return
      }
    }
  }
}
