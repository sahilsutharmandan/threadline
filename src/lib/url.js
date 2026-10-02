export function hostOf(url) {
  if (!url) return ''
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export function siteLabel(url) {
  const host = url?.split('/')[2]
  return `(${host})`
}

export function hnLink(id) {
  return `https://news.ycombinator.com/item?id=${id}`
}
