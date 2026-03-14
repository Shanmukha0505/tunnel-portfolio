// =============================================
// main.js — Entry Point
// =============================================

import './styles/main.css'
import Experience from './core/Experience.js'

const experience = new Experience(document.getElementById('tunnel-canvas'))
window.experience = experience
