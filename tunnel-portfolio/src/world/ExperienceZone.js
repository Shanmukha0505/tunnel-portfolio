// =============================================
// ExperienceZone.js — Chapter IV: EXPERIENCE
// z range: -74 to -84
// Amber/red theme, job timeline on walls
// =============================================

import * as THREE from 'three'

const JOBS = [
  {
    company: 'AMERICAN EXPRESS',
    role:    'Data Engineer (CPT)',
    period:  'Jul 2025 – Present',
    color:   '#0066cc',
    side:    'left',
    z:       -76,
    bullets: [
      '500K+ daily transactions (PySpark + Databricks)',
      'Reduced pipeline latency by 35%',
      'Automated 40% of manual ELT operations',
      'PCI DSS compliant data governance',
    ]
  },
  {
    company: 'EVEN HEALTHCARE',
    role:    'Data Engineer',
    period:  'May 2021 – Dec 2023',
    color:   '#cc4400',
    side:    'right',
    z:       -80,
    bullets: [
      'Azure Data Factory — healthcare claims pipelines',
      'Reduced processing time 30% across 12 workflows',
      'Saved 25+ hrs/week of manual validation',
      'HIPAA-compliant data lineage framework',
    ]
  },
]

export default class ExperienceZone {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene
    this._build()
  }

  _build() {
    JOBS.forEach(job => this._addJobPanel(job))

    // ── Impact numbers on floor (glowing plaques) ─
    this._addImpactPlaque(-0.8, -78, '35%', 'pipeline latency\nreduced')
    this._addImpactPlaque( 0.8, -78, '40%', 'manual ops\nautomated')
    this._addImpactPlaque(-0.8, -82, '30%', 'processing\ntime saved')
    this._addImpactPlaque( 0.8, -82, '25h', 'per week\nsaved')

    // ── Skeleton in suit (The Manager) at AmEx spot
    this._addAmExSkeleton()
  }

  _addJobPanel({ company, role, period, color, side, z, bullets }) {
    const canvas  = document.createElement('canvas')
    canvas.width  = 256
    canvas.height = 512
    const ctx     = canvas.getContext('2d')

    ctx.fillStyle = '#0a0806'
    ctx.fillRect(0, 0, 256, 512)
    ctx.strokeStyle = color
    ctx.lineWidth   = 3
    ctx.strokeRect(8, 8, 240, 496)

    // Company
    ctx.font      = 'bold 18px "Courier New"'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText(company, 128, 40)

    // Role
    ctx.font      = '14px "Courier New"'
    ctx.fillStyle = '#d0c0a0'
    ctx.fillText(role, 128, 62)

    // Period
    ctx.font      = '13px "Courier New"'
    ctx.fillStyle = '#6a5a40'
    ctx.fillText(period, 128, 82)

    // Divider
    ctx.fillStyle = color
    ctx.fillRect(20, 90, 216, 1)

    // Bullets
    ctx.font      = '13px "Courier New"'
    ctx.fillStyle = '#c0b090'
    ctx.textAlign = 'left'
    bullets.forEach((b, i) => {
      // Word wrap roughly
      ctx.fillText('▸ ' + b.substring(0, 28), 16, 120 + i * 84)
      if (b.length > 28) ctx.fillText('  ' + b.substring(28), 16, 140 + i * 84)
    })

    const group = new THREE.Group()
    const slab  = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1.8, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 1.0 })
    )
    group.add(slab)

    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(1.32, 1.72),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(canvas),
        transparent: true,
        side: THREE.DoubleSide
      })
    )
    face.position.set(0.05, 0, 0)
    group.add(face)

    const x = side === 'left' ? -2.3 : 2.3
    group.position.set(x, 1.6, z)
    group.rotation.y = side === 'left' ? -Math.PI / 2 : Math.PI / 2
    this.scene.add(group)
  }

  _addImpactPlaque(x, z, number, label) {
    const canvas  = document.createElement('canvas')
    canvas.width  = 128
    canvas.height = 128
    const ctx     = canvas.getContext('2d')

    ctx.fillStyle = '#080806'
    ctx.fillRect(0, 0, 128, 128)
    ctx.strokeStyle = '#c0542a'
    ctx.lineWidth   = 2
    ctx.strokeRect(4, 4, 120, 120)

    ctx.font      = 'bold 36px "Courier New"'
    ctx.fillStyle = '#e8a020'
    ctx.textAlign = 'center'
    ctx.fillText(number, 64, 52)

    ctx.font      = '13px "Courier New"'
    ctx.fillStyle = '#806040'
    label.split('\n').forEach((l, i) => ctx.fillText(l, 64, 76 + i * 20))

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.7),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
    )
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set(x, 0.02, z)
    this.scene.add(mesh)
  }

  _addAmExSkeleton() {
    // A simple suited skeleton silhouette near left wall
    const mat  = new THREE.MeshStandardMaterial({ color: 0xd4c9a8, roughness: 0.8 })
    const blue = new THREE.MeshStandardMaterial({ color: 0x003399, roughness: 0.5 })
    const g    = new THREE.Group()

    // Torso (in suit jacket)
    const jacket = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.25), blue)
    jacket.position.y = 1.15
    g.add(jacket)

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.38, 0.3), mat)
    head.position.y = 1.66
    g.add(head)

    // Red eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    ;[[-0.09, 0], [0.09, 0]].forEach(([ex]) => {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.05), eyeMat)
      eye.position.set(ex, 1.68, 0.16)
      g.add(eye)
    })

    // Legs
    ;[-0.14, 0.14].forEach(lx => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.12), mat)
      leg.position.set(lx, 0.4, 0)
      g.add(leg)
    })

    // Briefcase (right hand)
    const brief = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.08), blue)
    brief.position.set(0.45, 0.95, 0)
    g.add(brief)

    g.position.set(-1.5, 0, -77)
    g.rotation.y = 0.4
    this.scene.add(g)
    this._suitSkeleton = g
    this._t = 0
  }

  update(delta) {
    if (this._suitSkeleton) {
      this._t += delta
      this._suitSkeleton.rotation.y = 0.4 + Math.sin(this._t * 0.5) * 0.2
    }
  }
}
