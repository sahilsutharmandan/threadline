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

function toComment(node) {
  const children = (node.children ?? []).map(toComment).filter(Boolean)
  if (!node.author && !node.text && children.length === 0) return null
  return {
    id: node.id,
    author: node.author,
    text: node.text ?? '',
    time: node.created_at_i,
    deleted: !node.author,
    children,
  }
}

export function countComments(list) {
  return list.reduce((n, c) => n + 1 + countComments(c.children), 0)
}

export async function fetchItem(id, signal) {
  const data = await get(`items/${id}`, {}, signal)
  const children = (data.children ?? []).map(toComment).filter(Boolean)
  return {
    story: {
      id: data.id,
      type: data.type,
      title: data.title ?? '',
      url: data.url || null,
      author: data.author,
      points: data.points ?? 0,
      time: data.created_at_i,
      text: data.text || null,
      parent: data.parent_id,
      storyId: data.story_id,
      tags: data.type === 'story' && /^ask hn/i.test(data.title ?? '') ? ['ask_hn'] : [],
    },
    comments: children,
    total: countComments(children),
  }
}

export const RANGES = {
  all: { label: 'Any time', days: null },
  day: { label: 'Past 24 hours', days: 1 },
  week: { label: 'Past week', days: 7 },
  month: { label: 'Past month', days: 30 },
  year: { label: 'Past year', days: 365 },
}

export async function search({ q = '', type = 'story', range = 'all', points = 0, sort = 'relevance', page = 0 }, signal) {
  const filters = []
  const days = RANGES[range]?.days
  if (days) filters.push(`created_at_i>${since(days)}`)
  if (points > 0 && type === 'story') filters.push(`points>=${points}`)

  const data = await get(
    sort === 'date' ? 'search_by_date' : 'search',
    {
      query: q,
      tags: type,
      numericFilters: filters.join(',') || undefined,
      attributesToSnippet: type === 'comment' ? 'comment_text:40' : undefined,
      hitsPerPage: 20,
      page,
    },
    signal
  )

  return {
    total: data.nbHits,
    pages: data.nbPages,
    page: data.page,
    ms: data.processingTimeMS,
    hits: data.hits.map((h) => ({
      id: Number(h.objectID),
      type,
      author: h.author,
      time: h.created_at_i,
      points: h.points ?? 0,
      comments: h.num_comments ?? 0,
      url: h.url || null,
      storyId: h.story_id,
      storyTitle: h.story_title,
      title: h._highlightResult?.title?.value ?? h.title ?? '',
      snippet: h._snippetResult?.comment_text?.value ?? h._highlightResult?.comment_text?.value ?? '',
      tags: h._tags ?? [],
    })),
  }
}
