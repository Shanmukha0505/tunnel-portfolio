// =============================================
// Time.js — Frame Timer
// Gives every system consistent delta time
// so game speed is same on all machines
// =============================================

export default class Time {
  constructor() {
    this.start   = performance.now()
    this.current = this.start
    this.elapsed = 0
    this.delta   = 0.016  // assume 60fps on first frame
  }

  tick() {
    const now    = performance.now()
    this.delta   = Math.min((now - this.current) / 1000, 0.05) // seconds, capped at 50ms
    this.current = now
    this.elapsed = (now - this.start) / 1000
  }
}
