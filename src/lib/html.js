const EM_OPEN = /&lt;em&gt;/g
const EM_CLOSE = /&lt;\/em&gt;/g

export function escape(text = '') {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function highlightText(value = '') {
  return escape(value).replace(EM_OPEN, '<em>').replace(EM_CLOSE, '</em>')
}

export function highlightHtml(value = '') {
  return String(value)
    .replace(/<(?!\/?em>)[^>]*>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function stripTags(html = '') {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent ?? ''
}
