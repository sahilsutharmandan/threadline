export function infinite(node, params) {
  let current = params

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) current.onLoad(current.key)
    },
    { rootMargin: '0px 0px 600px 0px' }
  )
  observer.observe(node)

  return {
    update(next) {
      current = next
    },
    destroy() {
      observer.disconnect()
    },
  }
}

export function clickOutside(node, handler) {
  let fn = handler
  const onDown = (e) => {
    if (!node.contains(e.target)) fn(e)
  }
  document.addEventListener('pointerdown', onDown, true)
  return {
    update(next) {
      fn = next
    },
    destroy() {
      document.removeEventListener('pointerdown', onDown, true)
    },
  }
}
