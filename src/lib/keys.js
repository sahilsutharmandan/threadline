const TEXT_TYPES = ['text', 'email', 'password', 'url', 'number']

function isTyping(el) {
  if (!el || el === document.body) return false
  if (el.isContentEditable || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true
  return el.tagName === 'INPUT' && TEXT_TYPES.includes(el.type)
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
