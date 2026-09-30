function isTyping(el) {
  if (!el || el === document.body) return false
  if (el.isContentEditable) return true
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT'
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
