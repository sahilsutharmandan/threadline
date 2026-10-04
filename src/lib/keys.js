const NON_TEXT_INPUTS = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
])

function isTyping(el) {
  if (!el || el === document.body) return false
  if (el.isContentEditable || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true
  if (el.tagName === 'INPUT') return !NON_TEXT_INPUTS.has(el.type)
  return false
}

export function shortcuts(map) {
  function onKey(e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
    if (isTyping(e.target)) return
    const handler = map[e.key]
    if (!handler) return
    if (handler(e) !== false) e.preventDefault()
  }
  window.addEventListener('keydown', onKey)
  return () => window.removeEventListener('keydown', onKey)
}
