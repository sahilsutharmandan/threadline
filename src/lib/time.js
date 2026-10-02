const UNITS = [
  ['year', 31536000],
  ['month', 2592000],
  ['week', 604800],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
]

export function timeAgo(seconds) {
  if (!seconds) return ''
  const diff = Math.max(0, Date.now() / 1000 - seconds)
  for (const [unit, size] of UNITS) {
    const n = Math.floor(diff / size)
    if (n >= 1) return `${n} ${unit}${n > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export function fullDate(seconds) {
  return new Date(seconds * 1000).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function plural(n, word, many = word + 's') {
  return `${n.toLocaleString()} ${n === 1 ? word : many}`
}
