import { SvelteSet } from 'svelte/reactivity'

export function createCollapse() {
  const closed = new SvelteSet()

  return {
    has: (key) => closed.has(key),
    toggle(key) {
      if (closed.has(key)) closed.delete(key)
      else closed.add(key)
    },
    collapseAll(keys) {
      for (const k of keys) closed.add(k)
    },
    expandAll() {
      closed.clear()
    },
    get size() {
      return closed.size
    },
  }
}
