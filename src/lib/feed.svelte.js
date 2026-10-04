import { fetchFeed } from './api.js'

class Feed {
  name = $state('top')
  stories = $state([])
  page = $state(-1)
  pages = $state(1)
  loading = $state(false)
  error = $state(null)

  #request = 0

  get done() {
    return this.page + 1 >= this.pages
  }

  reset(name) {
    this.name = name
    this.stories = []
    this.page = -1
    this.pages = 1
    this.error = null
    return this.load(name, 0)
  }

  loadMore(name) {
    if (name !== this.name || this.loading || this.error || this.done) return
    return this.load(name, this.page + 1)
  }

  retry() {
    this.error = null
    return this.load(this.name, this.page + 1)
  }

  async load(name, page) {
    const id = ++this.#request
    this.loading = true
    try {
      const res = await fetchFeed(name, page)
      if (id !== this.#request) return
      const seen = new Set(this.stories.map((s) => s.id))
      this.stories = page === 0 ? res.stories : [...this.stories, ...res.stories.filter((s) => !seen.has(s.id))]
      this.page = res.page
      this.pages = res.pages
    } catch (err) {
      if (id === this.#request) this.error = err.message
    } finally {
      if (id === this.#request) this.loading = false
    }
  }
}

export const feed = new Feed()
