// =============================================
// Player.js — Ties body + torch together
// =============================================

import PlayerBody from './PlayerBody.js'
import Torch      from './Torch.js'

export default class Player {
  constructor(experience) {
    this.experience = experience
    this.body       = new PlayerBody(experience)
    this.torch      = new Torch(experience, this)  // pass 'this' so Torch has body ref immediately
  }

  update(delta) {
    this.body.update(delta)
    this.torch.update(delta)
  }
}
