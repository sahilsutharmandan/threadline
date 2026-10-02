export const ui = $state({
  settingsOpen: false,
})

export function openSettings() {
  ui.settingsOpen = true
}

export function closeSettings() {
  ui.settingsOpen = false
}
