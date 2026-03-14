// =============================================
// Skeleton.js — A single skeleton worker
// Built entirely from Three.js primitives
// =============================================

import * as THREE from 'three'

const BONE_MAT = new THREE.MeshStandardMaterial({ color: 0xd4c9a8, roughness: 0.8 })
const EYE_MAT  = new THREE.MeshBasicMaterial({ color: 0xff0000 })  // red glow

// Job types — each has a different idle animation
export const JOB = {
  PICKAXE  : 'pickaxe',   // swings arm up/down
  PUSHER   : 'pusher',    // rocks forward/back
  CABLES   : 'cables',    // holds arms out
  BLUEPRINT: 'blueprint', // looks down, subtle head bob
  PIPES    : 'pipes',     // bangs side wall repeatedly
  MANAGER  : 'manager',  // stands, occasionally looks around
}

export default class Skeleton {
  /**
   * @param {object} experience
   * @param {object} opts — { x, y, z, rotY, job, skill, label }
   */
  constructor(experience, opts = {}) {
    this.experience = experience
    this.scene      = experience.scene

    this.job    = opts.job   || JOB.MANAGER
    this.skill  = opts.skill || 'Data Engineer'
    this.label  = opts.label || this.skill
    this.x      = opts.x ?? 0
    this.y      = opts.y ?? 0
    this.z      = opts.z ?? -20
    this.rotY   = opts.rotY ?? 0

    this._t     = Math.random() * Math.PI * 2   // random phase offset
    this._alert = false   // has player come close?

    this._buildBody()
    this._buildHat()
    this._buildLabel()
  }

  // ── Build skeleton from primitives ────────────
  _buildBody() {
    this.group = new THREE.Group()

    // Torso
    this.torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.22), BONE_MAT)
    this.torso.position.y = 1.15
    this.group.add(this.torso)

    // Hips
    this.hips = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.2), BONE_MAT)
    this.hips.position.y = 0.78
    this.group.add(this.hips)

    // Head
    this.head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.38, 0.3), BONE_MAT)
    this.head.position.y = 1.65
    this.group.add(this.head)

    // Eye sockets
    const eyeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.05)
    const eyeL   = new THREE.Mesh(eyeGeo, EYE_MAT)
    eyeL.position.set(-0.09, 1.67, 0.16)
    this.group.add(eyeL)

    const eyeR = new THREE.Mesh(eyeGeo, EYE_MAT)
    eyeR.position.set(0.09, 1.67, 0.16)
    this.group.add(eyeR)

    // Jaw (lower)
    this.jaw = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.25), BONE_MAT)
    this.jaw.position.y = 1.5
    this.group.add(this.jaw)

    // Red eye glow light inside skull — blooms beautifully
    this.eyeLight = new THREE.PointLight(0xff1100, 0.4, 1.2)
    this.eyeLight.position.set(this.x, this.y + 1.67, this.z)
    this.scene.add(this.eyeLight)

    // Left arm (upper + lower)
    this.armLGroup = new THREE.Group()
    this.armLGroup.position.set(-0.32, 1.42, 0)
    const armLUpper = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42, 0.1), BONE_MAT)
    armLUpper.position.y = -0.21
    this.armLGroup.add(armLUpper)
    this.armLLower = new THREE.Group()
    this.armLLower.position.y = -0.44
    const armLLow = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.38, 0.09), BONE_MAT)
    armLLow.position.y = -0.19
    this.armLLower.add(armLLow)
    this.armLGroup.add(this.armLLower)
    this.group.add(this.armLGroup)

    // Right arm
    this.armRGroup = new THREE.Group()
    this.armRGroup.position.set(0.32, 1.42, 0)
    const armRUpper = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42, 0.1), BONE_MAT)
    armRUpper.position.y = -0.21
    this.armRGroup.add(armRUpper)
    this.armRLower = new THREE.Group()
    this.armRLower.position.y = -0.44
    const armRLow = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.38, 0.09), BONE_MAT)
    armRLow.position.y = -0.19
    this.armRLower.add(armRLow)
    this.armRGroup.add(this.armRLower)
    this.group.add(this.armRGroup)

    // Left leg
    this.legLGroup = new THREE.Group()
    this.legLGroup.position.set(-0.14, 0.75, 0)
    const legLUp  = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.12), BONE_MAT)
    legLUp.position.y = -0.22
    this.legLGroup.add(legLUp)
    const legLLow = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), BONE_MAT)
    legLLow.position.y = -0.65
    this.legLGroup.add(legLLow)
    this.group.add(this.legLGroup)

    // Right leg
    this.legRGroup = new THREE.Group()
    this.legRGroup.position.set(0.14, 0.75, 0)
    const legRUp  = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.12), BONE_MAT)
    legRUp.position.y = -0.22
    this.legRGroup.add(legRUp)
    const legRLow = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), BONE_MAT)
    legRLow.position.y = -0.65
    this.legRGroup.add(legRLow)
    this.group.add(this.legRGroup)

    // Position in world
    this.group.position.set(this.x, this.y, this.z)
    this.group.rotation.y = this.rotY
    this.scene.add(this.group)
  }

  // ── Hard hat on top of head ────────────────────
  _buildHat() {
    const hatMat  = new THREE.MeshStandardMaterial({ color: 0xe8b020, roughness: 0.6 })
    const brim    = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.05, 12), hatMat)
    brim.position.set(0, 0.22, 0)
    this.head.add(brim)

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), hatMat)
    dome.position.set(0, 0.22, 0)
    this.head.add(dome)

    // Skill label on hat (canvas texture)
    const canvas  = document.createElement('canvas')
    canvas.width  = 256
    canvas.height = 80
    const ctx     = canvas.getContext('2d')
    ctx.fillStyle = '#e8b020'
    ctx.fillRect(0, 0, 256, 80)
    ctx.font      = 'bold 28px "Courier New"'
    ctx.fillStyle = '#1a1008'
    ctx.textAlign = 'center'
    ctx.fillText(this.skill, 128, 50)
    const tex    = new THREE.CanvasTexture(canvas)
    const badge  = new THREE.Mesh(
      new THREE.PlaneGeometry(0.28, 0.09),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    )
    badge.position.set(0, 0.27, 0.22)
    this.head.add(badge)
  }

  // ── Floating name label above skeleton ────────
  _buildLabel() {
    const canvas  = document.createElement('canvas')
    canvas.width  = 320
    canvas.height = 60
    const ctx     = canvas.getContext('2d')
    ctx.clearRect(0, 0, 320, 60)
    ctx.font      = '22px "Courier New"'
    ctx.fillStyle = '#d4c9b0'
    ctx.textAlign = 'center'
    ctx.fillText(this.label, 160, 40)
    const tex    = new THREE.CanvasTexture(canvas)
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }))
    sprite.scale.set(1.4, 0.28, 1)
    sprite.position.set(this.x, this.y + 2.3, this.z)
    this.scene.add(sprite)
    this.nameSprite = sprite
  }

  // ── Per-frame animation ───────────────────────
  update(delta) {
    this._t += delta

    switch (this.job) {
      case JOB.PICKAXE:   this._animPickaxe();   break
      case JOB.PUSHER:    this._animPusher();    break
      case JOB.CABLES:    this._animCables();    break
      case JOB.BLUEPRINT: this._animBlueprint(); break
      case JOB.PIPES:     this._animPipes();     break
      case JOB.MANAGER:   this._animManager();   break
    }

    // Eye light follows head
    if (this.eyeLight) {
      const worldPos = new THREE.Vector3()
      this.head.getWorldPosition(worldPos)
      this.eyeLight.position.copy(worldPos)
      const pulse = Math.sin(this._t * 3) * 0.15
      this.eyeLight.intensity = this._alert
        ? 1.8 + pulse          // bright red when alert
        : 0.3 + pulse * 0.3    // dim idle glow
    }

    // Alert — face player when close
    if (this._alert) {
      const player = this.experience.player
      if (player) {
        const dx = player.body.position.x - this.x
        const dz = player.body.position.z - this.z
        const targetYaw = Math.atan2(dx, dz)
        this.group.rotation.y += (targetYaw - this.group.rotation.y) * 3 * delta
      }
    }

    // Keep name label floating above
    if (this.nameSprite) {
      this.nameSprite.position.y = this.y + 2.3 + Math.sin(this._t * 1.5) * 0.04
    }
  }

  // ── Animation helpers ─────────────────────────

  _animPickaxe() {
    // Right arm swings up and smashes down — mining motion
    const swing = Math.sin(this._t * 3) * 0.9 + 0.2
    this.armRGroup.rotation.x = -swing
    this.armRLower.rotation.x = Math.max(0, swing * 0.6)
    this.armLGroup.rotation.x = swing * 0.3
    this.torso.rotation.x     = Math.sin(this._t * 3) * 0.08
  }

  _animPusher() {
    // Body rocks forward and back — pushing cart
    const push = Math.sin(this._t * 2) * 0.18
    this.torso.rotation.x     = 0.3 + push
    this.armLGroup.rotation.x = -(0.6 + push * 0.5)
    this.armRGroup.rotation.x = -(0.6 + push * 0.5)
    this.legLGroup.rotation.x = push * 0.4
    this.legRGroup.rotation.x = -push * 0.4
  }

  _animCables() {
    // Arms held out holding cables — slight sway
    const sway = Math.sin(this._t * 1.2) * 0.1
    this.armLGroup.rotation.z =  0.6 + sway
    this.armRGroup.rotation.z = -0.6 - sway
    this.armLGroup.rotation.x = -0.3
    this.armRGroup.rotation.x = -0.3
    this.head.rotation.x      = Math.sin(this._t * 0.8) * 0.1
  }

  _animBlueprint() {
    // Looking down at blueprints, subtle bob
    this.head.rotation.x      = 0.4
    this.torso.rotation.x     = 0.2
    this.armLGroup.rotation.x = -0.5
    this.armRGroup.rotation.x = -0.5
    this.armLGroup.rotation.z =  0.3
    this.armRGroup.rotation.z = -0.3
    // Tiny finger-tap motion
    this.armRLower.rotation.x = Math.sin(this._t * 4) * 0.15
  }

  _animPipes() {
    // Right arm bangs rhythmically against wall
    const bang = Math.abs(Math.sin(this._t * 4))
    this.armRGroup.rotation.z = -(0.8 + bang * 0.3)
    this.armRGroup.rotation.x = -(0.2 + bang * 0.4)
    this.head.rotation.z      = Math.sin(this._t * 4) * 0.06
  }

  _animManager() {
    // Standing, occasional slow head turn + clipboard glance
    this.head.rotation.y  = Math.sin(this._t * 0.4) * 0.5
    this.head.rotation.x  = Math.sin(this._t * 0.3) * 0.1
    this.armRGroup.rotation.x = -0.3
    this.armRGroup.rotation.z = -0.2
    this.armRLower.rotation.x = -0.5  // holding clipboard up
  }

  // Called by Skeletons.js when player gets close
  alert() {
    this._alert = true
  }
}
