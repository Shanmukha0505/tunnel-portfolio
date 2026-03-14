// =============================================
// World.js — The Game World
// Boots all environments and manages them
// =============================================

import Graveyard from './Graveyard.js'

export default class World {
  constructor(experience) {
    this.experience = experience
    this.graveyard  = new Graveyard(experience)
  }

  // PlayerBody calls this to know what to stand on
  getFloorObjects() {
    return this.graveyard.floorMeshes
  }

  update(delta) {
    // future: update NPCs, animations, etc.
  }
}
