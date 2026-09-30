import { read, write } from './storage.js'

const DEFAULTS = {
  theme: 'system',
  fontSize: 'm',
  density: 'comfortable',
}

export const THEMES = ['system', 'light', 'dark']
export const FONT_SIZES = ['s', 'm', 'l']

class Settings {
  theme = $state(DEFAULTS.theme)
  fontSize = $state(DEFAULTS.fontSize)
  density = $state(DEFAULTS.density)

  constructor() {
    this.load()
  }

  load() {
    const saved = { ...DEFAULTS, ...read('settings', {}) }
    this.theme = THEMES.includes(saved.theme) ? saved.theme : DEFAULTS.theme
    this.fontSize = FONT_SIZES.includes(saved.fontSize) ? saved.fontSize : DEFAULTS.fontSize
    this.density = saved.density === 'compact' ? 'compact' : 'comfortable'
  }

  update(patch) {
    Object.assign(this, patch)
    write('settings', { theme: this.theme, fontSize: this.fontSize, density: this.density })
  }

  reset() {
    this.update({ ...DEFAULTS })
  }
}

export const settings = new Settings()

export function applySettings(root = document.documentElement) {
  root.dataset.theme = settings.theme
  root.dataset.font = settings.fontSize
  root.dataset.density = settings.density
}
