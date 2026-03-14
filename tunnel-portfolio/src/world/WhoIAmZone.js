// =============================================
// WhoIAmZone.js — Chapter I: WHO I AM
// z range: -14 to -24
// Silver/white theme, biography carved in walls
// =============================================

import * as THREE from 'three'

export default class WhoIAmZone {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene
    this._build()
  }

  _build() {
    // ── Left wall — Story ──────────────────────
    this._addStonePanel({
      title: 'THE STORY',
      color: '#d0d0d0',
      lines: [
        'Born in Hyderabad, India.',
        'B.Tech → Data Engineer @ Even Healthcare.',
        'Moved to the US — MS Data Science,',
        'Regis University, Denver CO.',
        'Now @ American Express — building',
        'pipelines that move 500K+ transactions/day.',
      ],
      x: -2.3, z: -17, side: 'left'
    })

    // ── Right wall — Who I Am ─────────────────
    this._addStonePanel({
      title: 'WHO I AM',
      color: '#c0b890',
      lines: [
        'Data Engineer + ML tinkerer.',
        'I turn raw data into reliable pipelines.',
        'I like hard problems, distributed systems,',
        'and making machines learn things.',
        'On OPT — looking for a team that builds',
        'things that actually matter.',
      ],
      x: 2.3, z: -20, side: 'right'
    })

    // ── Education plaque ──────────────────────
    this._addPlaque(
      'EDUCATION',
      [
        'M.S. Data Science — Regis University  2024–2025',
        'B.Tech — Jawaharlal Nehru Tech Univ   2017–2021',
      ],
      0, -22.5, 0xc0a060
    )

    // ── "Currently looking for" banner ────────
    this._addBanner(-23.8)
  }

  _addStonePanel({ title, color, lines, x, z, side }) {
    const canvas  = document.createElement('canvas')
    canvas.width  = 256
    canvas.height = 512
    const ctx     = canvas.getContext('2d')

    ctx.fillStyle = '#0f0c08'
    ctx.fillRect(0, 0, 256, 512)
    ctx.strokeStyle = color
    ctx.lineWidth   = 2
    ctx.strokeRect(8, 8, 240, 496)

    ctx.font      = 'bold 22px "Courier New"'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText(title, 128, 46)

    ctx.fillStyle = color
    ctx.fillRect(20, 56, 216, 1)

    ctx.font      = '16px "Courier New"'
    ctx.fillStyle = '#b0a880'
    lines.forEach((line, i) => {
      ctx.fillText(line, 128, 90 + i * 64)
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

    group.position.set(x, 1.6, z)
    group.rotation.y = side === 'left' ? -Math.PI / 2 : Math.PI / 2
    this.scene.add(group)
  }

  _addPlaque(title, lines, x, z, color) {
    const canvas  = document.createElement('canvas')
    canvas.width  = 768
    canvas.height = 160
    const ctx     = canvas.getContext('2d')
    const hex     = '#' + color.toString(16).padStart(6, '0')

    ctx.fillStyle = '#0a0806'
    ctx.fillRect(0, 0, 768, 160)
    ctx.strokeStyle = hex
    ctx.lineWidth   = 2
    ctx.strokeRect(6, 6, 756, 148)

    ctx.font      = 'bold 20px "Courier New"'
    ctx.fillStyle = hex
    ctx.textAlign = 'center'
    ctx.fillText('── ' + title + ' ──', 384, 36)

    ctx.font      = '18px "Courier New"'
    ctx.fillStyle = '#a09070'
    lines.forEach((l, i) => ctx.fillText(l, 384, 76 + i * 44))

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(4.5, 0.96),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
    )
    mesh.position.set(x, 1.0, z)
    this.scene.add(mesh)
  }

  _addBanner(z) {
    const canvas  = document.createElement('canvas')
    canvas.width  = 1024
    canvas.height = 80
    const ctx     = canvas.getContext('2d')
    ctx.clearRect(0, 0, 1024, 80)
    ctx.font      = 'bold 22px "Courier New"'
    ctx.fillStyle = '#88aaff'
    ctx.textAlign = 'center'
    ctx.fillText('▸ Open to: Staff DE  ·  ML Engineering  ·  Data Platform Roles ◂', 512, 52)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 0.5),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
    )
    mesh.position.set(0, 3.2, z)
    this.scene.add(mesh)
  }

  update() {}
}
