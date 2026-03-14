// =============================================
// Zone00_Loading.js — The Loading Screen
//
// Animates the mine cart progress bar,
// then fades out and hands control to Zone 01.
// =============================================

export default class Zone00_Loading {
  constructor(experience, onComplete) {
    this.experience = experience
    this.onComplete = onComplete   // callback — called when loading is done

    this.bar     = document.getElementById('mine-cart-bar')
    this.percent = document.getElementById('loading-percent')
    this.screen  = document.getElementById('loading-screen')

    this._start()
  }

  _start() {
    let progress = 0

    // Fill the bar over ~2.5 seconds in random-ish chunks
    // Feels like real loading, not a fake smooth slide
    const interval = setInterval(() => {
      // Random increment between 8-18%
      progress += Math.random() * 10 + 8

      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        this._onLoaded()
      }

      this._setProgress(progress)
    }, 200)
  }

  _setProgress(value) {
    const clamped = Math.min(value, 100)
    this.bar.style.width      = clamped + '%'
    this.percent.textContent  = Math.floor(clamped) + '%'
  }

  _onLoaded() {
    // Brief pause at 100% so user can read it
    setTimeout(() => {
      this.screen.classList.add('fade-out')

      // After the CSS fade transition (1.2s), remove it and call onComplete
      setTimeout(() => {
        this.screen.style.display = 'none'
        if (this.onComplete) this.onComplete()
      }, 1200)
    }, 600)
  }
}
