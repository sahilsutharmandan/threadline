const PREFIX = 'threadline:'

export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // storage full or disabled
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {}
}
