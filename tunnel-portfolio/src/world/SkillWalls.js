// =============================================
// SkillWalls.js — Tech skills carved in stone
// Stone slabs on tunnel walls, lit by torch only
// =============================================

import * as THREE from 'three'

const SKILLS = [
  {
    title: 'LANGUAGES',
    color: '#c0542a',
    items: ['Python', 'PySpark', 'SQL', 'Scala', 'Shell'],
    x: -2.3, z: -25, side: 'left'
  },
  {
    title: 'DATA ENGINEERING',
    color: '#e8a020',
    items: ['Apache Spark', 'Kafka', 'Airflow', 'ETL/ELT', 'Delta Lake', 'Data Modeling'],
    x: 2.3, z: -35, side: 'right'
  },
  {
    title: 'CLOUD & PLATFORMS',
    color: '#4a9eff',
    items: ['AWS S3', 'Redshift', 'EMR', 'Azure ADF', 'Databricks', 'Snowflake'],
    x: -2.3, z: -45, side: 'left'
  },
  {
    title: 'ML & AI',
    color: '#a020e8',
    items: ['TensorFlow', 'Scikit-learn', 'MLflow', 'LangChain', 'RAG', 'FAISS'],
    x: 2.3, z: -55, side: 'right'
  },
  {
    title: 'DEVOPS',
    color: '#20e840',
    items: ['Docker', 'Git', 'CI/CD', 'FastAPI', 'Flask', 'REST APIs'],
    x: -2.3, z: -65, side: 'left'
  },
]

export default class SkillWalls {
  constructor(experience) {
    this.experience = experience
    this.scene      = experience.scene
    this._build()
  }

  _build() {
    SKILLS.forEach(s => this._buildPanel(s))
  }

  _buildPanel({ title, color, items, x, z, side }) {
    const group = new THREE.Group()

    // Stone slab backing
    const slabMat = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 1.0 })
    const slab    = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 1.4), slabMat)
    group.add(slab)

    // Canvas texture with skill list
    const canvas = document.createElement('canvas')
    canvas.width  = 256
    canvas.height = 512
    const ctx    = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#0d0a06'
    ctx.fillRect(0, 0, 256, 512)

    // Carved border
    ctx.strokeStyle = color
    ctx.lineWidth   = 3
    ctx.strokeRect(8, 8, 240, 496)

    // Title
    ctx.font      = 'bold 22px "Courier New"'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText(title, 128, 48)

    // Divider
    ctx.fillStyle = color
    ctx.fillRect(20, 58, 216, 2)

    // Skills list
    ctx.font      = '18px "Courier New"'
    ctx.fillStyle = '#d4c9b0'
    items.forEach((item, i) => {
      ctx.fillText('▸ ' + item, 128, 100 + i * 58)
    })

    const tex     = new THREE.CanvasTexture(canvas)
    const face    = new THREE.Mesh(
      new THREE.PlaneGeometry(1.32, 1.72),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    )
    face.position.set(side === 'left' ? 0.05 : -0.05, 0, 0)
    face.rotation.y = side === 'left' ? Math.PI / 2 : -Math.PI / 2
    group.add(face)

    // Position on wall
    group.position.set(x, 1.6, z)
    group.rotation.y = side === 'left' ? Math.PI / 2 : -Math.PI / 2

    this.scene.add(group)
  }

  update() {}
}
