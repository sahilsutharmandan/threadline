import { SvelteSet } from 'svelte/reactivity'
import { read, write } from './storage.js'

const LIMIT = 1000

export const visited = new SvelteSet(read('visited', []))

export function markVisited(id) {
  if (visited.has(id)) return
  visited.add(id)
  const ids = [...visited]
  write('visited', ids.slice(-LIMIT))
}

export function clearVisited() {
  visited.clear()
  write('visited', [])
}
