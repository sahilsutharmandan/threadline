import { read, write } from './storage.js'

let items = $state(read('read-later', []))

function persist() {
  write('read-later', items)
}

export const readLater = {
  get items() {
    return items
  },
  get count() {
    return items.length
  },
  has(id) {
    return items.some((s) => s.id === id)
  },
  add(story) {
    if (this.has(story.id)) return
    const { id, title, url, author, points, comments, time, tags } = story
    items = [{ id, title, url, author, points, comments, time, tags, savedAt: Date.now() }, ...items]
    persist()
  },
  remove(id) {
    items = items.filter((s) => s.id !== id)
    persist()
  },
  toggle(story) {
    if (this.has(story.id)) this.remove(story.id)
    else this.add(story)
  },
  clear() {
    items = []
    persist()
  },
}
