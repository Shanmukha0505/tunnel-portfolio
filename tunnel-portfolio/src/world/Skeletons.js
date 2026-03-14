// =============================================
// Skeletons.js — The whole skeleton crew
// =============================================

import Skeleton, { JOB } from './Skeleton.js'

const CREW = [
  {
    label: 'Python Pete',
    skill: 'Python',
    job:   JOB.PICKAXE,
    x: -1.6, z: -22, rotY:  0.4,
  },
  {
    label: 'Spark Sam',
    skill: 'Spark',
    job:   JOB.PUSHER,
    x:  0.2, z: -32, rotY:  Math.PI,
  },
  {
    label: 'AWS Al',
    skill: 'AWS',
    job:   JOB.CABLES,
    x:  1.8, z: -42, rotY: -0.5,
  },
  {
    label: 'SQL Sue',
    skill: 'SQL',
    job:   JOB.BLUEPRINT,
    x: -1.7, z: -50, rotY:  0.3,
  },
  {
    label: 'Kafka Karl',
    skill: 'Kafka',
    job:   JOB.PIPES,
    x: -2.0, z: -60, rotY:  Math.PI / 2,
  },
  {
    label: 'The Manager',
    skill: 'PM',
    job:   JOB.MANAGER,
    x:  0.0, z: -70, rotY:  Math.PI,
  },
]

const ALERT_DISTANCE = 5  // units — how close player must be to trigger alert

export default class Skeletons {
  constructor(experience) {
    this.experience = experience
    this.list       = []

    CREW.forEach(cfg => {
      this.list.push(new Skeleton(experience, { ...cfg, y: 0 }))
    })
  }

  update(delta) {
    const player = this.experience.player
    if (!player) return

    const px = player.body.position.x
    const pz = player.body.position.z

    this.list.forEach(sk => {
      sk.update(delta)

      // Alert skeleton if player is close
      if (!sk._alert) {
        const dx   = px - sk.x
        const dz   = pz - sk.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < ALERT_DISTANCE) sk.alert()
      }
    })
  }
}
