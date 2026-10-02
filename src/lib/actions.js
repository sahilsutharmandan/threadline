export function infinite(node, { key, onLoad }) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) onLoad(key)
    },
    { rootMargin: '0px 0px 600px 0px' }
  )
  observer.observe(node)

  return {
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
