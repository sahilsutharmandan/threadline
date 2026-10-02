# Threadline

A fast, clean Hacker News reader built with Svelte 5 (runes) and Vite. Stories, comments,
users and search come from the public [HN Algolia API](https://hn.algolia.com/api).
There is no backend: your read-later list, read history and settings live in `localStorage`.

## Features

- **Feed** - Top, New, Ask and Show tabs with infinite scroll
- **Keyboard navigation** - `j` / `k` to move, `o` to open the link, `c` or `Enter` for comments, `s` to save, `/` to search
- **Story page** - Nested comment tree with collapse/expand per thread, "Collapse all", OP badge, coloured depth guides and thread sorting
- **Search** - Stories or comments, with date range, minimum points and sort filters; matches are highlighted
- **User profiles** - Karma, about text, recent submissions and comments
- **Read later** - Save stories to read on this device
- **Settings** - Theme (light / dark / system), text size (S / M / L) and comment density
- **Responsive** - Desktop layout with a sidebar on story pages, bottom tab bar on mobile

## API

All requests go to `https://hn.algolia.com/api/v1` (no key, CORS enabled):

| Endpoint | Used for |
|----------|----------|
| `search?tags=story&numericFilters=...` | Top feed (popular stories from the last 2 days) |
| `search_by_date?tags=story` | New feed |
| `search?tags=ask_hn` / `search?tags=show_hn` | Ask and Show feeds |
| `search` / `search_by_date` with `query` | Search page |
| `items/{id}` | Story with its full comment tree |
| `users/{username}` | User profile |

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Tech Stack

- Svelte 5 with runes (`$state`, `$derived`, `$effect`)
- Vite
- Small hash router (`src/lib/router.svelte.js`)
- Hand-written CSS with custom properties for theming
- `localStorage` through a single helper (`src/lib/storage.js`)

## Project Structure

```
src/
  App.svelte          routes and app shell
  components/         Header, Tabs, StoryRow, Comment, SettingsPanel, ...
  routes/             Feed, Story, Search, User, ReadLater
  lib/                api client, router, stores, helpers
  styles/             tokens, base and prose styles
```
