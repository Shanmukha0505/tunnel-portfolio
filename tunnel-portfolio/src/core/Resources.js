// =============================================
// Resources.js — Asset Loader
// Loads all .glb models + textures
// Fires 'ready' event when everything is loaded
// =============================================

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Resources {
  constructor(sources) {
    this.sources = sources   // array of { name, type, path }
    this.items   = {}        // loaded assets stored by name
    this.toLoad  = sources.length
    this.loaded  = 0
    this.onReady = null      // callback when all done

    this.loaders = {
      gltf:    new GLTFLoader(),
      texture: new THREE.TextureLoader(),
    }

    if (this.toLoad === 0) {
      // Nothing to load — fire ready next tick
      setTimeout(() => this.onReady && this.onReady(), 0)
    } else {
      this._startLoading()
    }
  }

  _startLoading() {
    for (const source of this.sources) {
      if (source.type === 'gltf') {
        this.loaders.gltf.load(source.path, (file) => {
          this._onItemLoaded(source.name, file)
        })
      } else if (source.type === 'texture') {
        this.loaders.texture.load(source.path, (file) => {
          this._onItemLoaded(source.name, file)
        })
      }
    }
  }

  _onItemLoaded(name, file) {
    this.items[name] = file
    this.loaded++

    const progress = this.loaded / this.toLoad
    window.dispatchEvent(new CustomEvent('loadprogress', { detail: { progress } }))

    if (this.loaded === this.toLoad) {
      this.onReady && this.onReady()
    }
  }
}
