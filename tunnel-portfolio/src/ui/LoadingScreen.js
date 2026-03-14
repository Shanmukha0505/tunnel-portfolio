// =============================================
// LoadingScreen.js — Zone 00
// Animates progress bar, then fades out
// =============================================

export default class LoadingScreen {
  constructor(onComplete) {
    this.onComplete = onComplete
    this.bar        = document.getElementById('mine-cart-bar')
    this.percent    = document.getElementById('loading-percent')
    this.screen     = document.getElementById('loading-screen')
    this.progress   = 0

    // Listen for real asset load progress
    window.addEventListener('loadprogress', (e) => {
      this._setProgress(e.detail.progress * 100)
    })

    // Start fake fill — covers cases with no assets to load
    this._fakeFill()
  }

  _fakeFill() {
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 12 + 6
      if (p >= 95) { clearInterval(interval) }
      this._setProgress(Math.min(p, 95))
    }, 180)
  }

  complete() {
    this._setProgress(100)
    setTimeout(() => {
      this.screen.classList.add('fade-out')
      setTimeout(() => {
        this.screen.style.display = 'none'
        this.onComplete && this.onComplete()
      }, 1200)
    }, 400)
  }

  _setProgress(value) {
    const v = Math.min(value, 100)
    if (this.bar)     this.bar.style.width    = v + '%'
    if (this.percent) this.percent.textContent = Math.floor(v) + '%'
  }
}
