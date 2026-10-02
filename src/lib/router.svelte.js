function parse() {
  const raw = location.hash.replace(/^#/, '') || '/'
  const [path, qs = ''] = raw.split('?')
  return { path: path || '/', query: Object.fromEntries(new URLSearchParams(qs)) }
}

let current = $state(parse())

window.addEventListener('hashchange', () => {
  current = parse()
})

export const route = {
  get path() {
    return current.path
  },
  get query() {
    return current.query
  },
}

export function navigate(to, { replace = false } = {}) {
  const hash = '#' + to
  if (replace) {
    history.replaceState(null, '', hash)
    current = parse()
  } else {
    location.hash = to
  }
}

export function match(pattern, path) {
  const p = pattern.split('/')
  const s = path.split('/')
  if (p.length !== s.length) return null
  const params = {}
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(s[i])
    else if (p[i] !== s[i]) return null
  }
  return params
}

export function href(path, query) {
  const qs = query ? new URLSearchParams(Object.entries(query).filter(([, v]) => v !== '' && v != null)).toString() : ''
  return '#' + path + (qs ? '?' + qs : '')
}
