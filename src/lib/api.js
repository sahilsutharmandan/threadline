const BASE = 'https://hn.algolia.com/api/v1'
const PAGE_SIZE = 30

const DAY = 86400

function since(days) {
  const hour = Math.floor(Date.now() / 1000 / 3600) * 3600
  return hour - days * DAY
}

const FEEDS = {
  top: () => ({ endpoint: 'search', tags: 'story', numericFilters: `created_at_i>${since(2)},points>5` }),
  new: () => ({ endpoint: 'search_by_date', tags: 'story' }),
  ask: () => ({ endpoint: 'search', tags: 'ask_hn', numericFilters: `created_at_i>${since(7)}` }),
  show: () => ({ endpoint: 'search', tags: 'show_hn', numericFilters: `created_at_i>${since(7)}` }),
}

export const FEED_NAMES = Object.keys(FEEDS)

async function get(path, params = {}, signal) {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
  const res = await fetch(`${BASE}/${path}${qs.size ? '?' + qs : ''}`, { signal })
  if (!res.ok) throw new Error(res.status === 404 ? 'Not found' : `Request failed (${res.status})`)
  return res.json()
}

export function toStory(hit) {
  return {
    id: Number(hit.objectID ?? hit.id),
    title: hit.title ?? hit.story_title ?? '',
    url: hit.url || null,
    author: hit.author,
    points: hit.points ?? 0,
    comments: hit.num_comments ?? 0,
    time: hit.created_at_i,
    text: hit.story_text ?? hit.text ?? null,
    tags: hit._tags ?? [],
  }
}

export async function fetchFeed(name, page = 0, signal) {
  const { endpoint, ...params } = FEEDS[name]()
  const data = await get(endpoint, { ...params, page, hitsPerPage: PAGE_SIZE }, signal)
  return {
    stories: data.hits.map(toStory),
    page: data.page,
    pages: data.nbPages,
  }
}
