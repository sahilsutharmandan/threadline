<script>
  import Icon from '../components/Icon.svelte'
  import Tabs from '../components/Tabs.svelte'
  import Highlight from '../components/Highlight.svelte'
  import { search, RANGES } from '../lib/api.js'
  import { navigate, href } from '../lib/router.svelte.js'
  import { hostOf } from '../lib/url.js'
  import { timeAgo, fullDate, plural } from '../lib/time.js'
  import { markVisited } from '../lib/history.svelte.js'

  let { query } = $props()

  const params = $derived({
    q: query.q ?? '',
    type: query.type === 'comment' ? 'comment' : 'story',
    range: RANGES[query.range] ? query.range : 'all',
    points: Number(query.points) || 0,
    sort: query.sort === 'date' ? 'date' : 'relevance',
  })

  let text = $state(query.q ?? '')
  let results = $state(null)
  let more = $state([])
  let loading = $state(false)
  let error = $state(null)
  let input

  $effect(() => {
    const p = params
    const ctrl = new AbortController()
    more = []
    error = null
    if (!p.q && p.range === 'all' && !p.points) {
      results = null
      return
    }
    loading = true
    search(p, ctrl.signal)
      .then((r) => (results = r))
      .catch((e) => {
        if (e.name !== 'AbortError') error = e.message
      })
      .finally(() => {
        if (!ctrl.signal.aborted) loading = false
      })
    return () => ctrl.abort()
  })

  const hits = $derived(results ? [...results.hits, ...more.flatMap((r) => r.hits)] : [])
  const lastPage = $derived(more.length ? more[more.length - 1].page : (results?.page ?? 0))
  const canLoadMore = $derived(results && lastPage + 1 < results.pages)

  function update(patch) {
    navigate(href('/search', { ...params, ...patch, points: (patch.points ?? params.points) || '' }).slice(1), { replace: true })
  }

  let timer = null
  function onInput() {
    const q = text.trim()
    if (timer) return
    timer = setTimeout(() => {
      timer = null
      update({ q })
    }, 300)
  }

  function onSubmit(e) {
    e.preventDefault()
    clearTimeout(timer)
    timer = null
    update({ q: text.trim() })
  }

  async function loadMore() {
    const { q, type, sort } = params
    loading = true
    try {
      const r = await search({ q, type, sort, page: lastPage + 1 })
      if (q !== params.q || type !== params.type || sort !== params.sort) return
      more = [...more, r]
    } catch (e) {
      error = e.message
    } finally {
      loading = false
    }
  }

  const typeTabs = [
    { id: 'story', label: 'Stories', icon: 'flame' },
    { id: 'comment', label: 'Comments', icon: 'comment' },
  ]

  const pointOptions = [0, 10, 50, 100, 250, 500]
  const suggestions = ['rust', 'sqlite', 'show hn', 'postgres', 'llm', 'self-hosting']
</script>

<div class="container page">
  <h1 class="page-title">Search</h1>
  <p class="page-sub">Every story and comment on Hacker News, powered by Algolia.</p>

  <form class="box" role="search" onsubmit={onSubmit}>
    <Icon name="search" size={18} />
    <input
      type="search"
      placeholder="Search Hacker News"
      aria-label="Search query"
      bind:value={text}
      bind:this={input}
      oninput={onInput}
    />
    {#if loading}<span class="spinner" aria-label="Loading"></span>{/if}
  </form>

  <Tabs items={typeTabs} active={params.type} onselect={(type) => update({ type })} label="Result type" />

  <div class="filters">
    <label>
      <span>Date</span>
      <select value={params.range} onchange={(e) => update({ range: e.currentTarget.value })}>
        {#each Object.entries(RANGES) as [id, r] (id)}
          <option value={id}>{r.label}</option>
        {/each}
      </select>
    </label>
    <label class:disabled={params.type === 'comment'}>
      <span>Points</span>
      <select
        value={params.points}
        disabled={params.type === 'comment'}
        onchange={(e) => update({ points: Number(e.currentTarget.value) })}
      >
        {#each pointOptions as n (n)}
          <option value={n}>{n ? `${n}+ points` : 'Any points'}</option>
        {/each}
      </select>
    </label>
    <label>
      <span>Sort</span>
      <select value={params.sort} onchange={(e) => update({ sort: e.currentTarget.value })}>
        <option value="relevance">Popularity</option>
        <option value="date">Newest</option>
      </select>
    </label>
    {#if results}
      <p class="count">{plural(results.total, 'result')} <span>({results.ms} ms)</span></p>
    {/if}
  </div>

  {#if error}
    <div class="notice error">Search failed: {error}</div>
  {:else if !results && !loading}
    <div class="notice">
      <p>Try one of these:</p>
      <div class="chips">
        {#each suggestions as s (s)}
          <a class="chip" href={href('/search', { q: s })}>{s}</a>
        {/each}
      </div>
    </div>
  {:else if results && hits.length === 0}
    <div class="notice">No results for <strong>“{params.q}”</strong>. Try a wider date range or fewer points.</div>
  {/if}

  {#if hits.length}
    <ol class="results card">
      {#each hits as hit (hit.id)}
        <li class="hit">
          {#if hit.type === 'story'}
            <a class="title" href="#/item/{hit.id}" onclick={() => markVisited(hit.id)}>
              <Highlight value={hit.title} />
            </a>
            {#if hit.url}
              <a class="url" href={hit.url} target="_blank" rel="noopener noreferrer">{hostOf(hit.url)}</a>
            {/if}
            <div class="meta">
              <span class="pts"><Icon name="arrowUp" size={12} stroke={2.4} /> {hit.points}</span>
              <a href="#/user/{hit.author}">{hit.author}</a>
              <time title={fullDate(hit.time)}>{timeAgo(hit.time)}</time>
              <a href="#/item/{hit.id}">{plural(hit.comments, 'comment')}</a>
            </div>
          {:else}
            <div class="meta top">
              <a class="who" href="#/user/{hit.author}">{hit.author}</a>
              <time title={fullDate(hit.time)}>{timeAgo(hit.time)}</time>
              <span>on</span>
              <a class="story" href="#/item/{hit.storyId}">{hit.storyTitle}</a>
            </div>
            <p class="snippet"><Highlight value={hit.snippet} html /></p>
          {/if}
        </li>
      {/each}
    </ol>

    {#if canLoadMore}
      <div class="more">
        <button class="btn" type="button" onclick={loadMore} disabled={loading}>
          {loading ? 'Loading…' : 'Show more results'}
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .box {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 50px;
    margin-bottom: 18px;
    padding: 0 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
    color: var(--text-3);
  }

  .box:focus-within {
    border-color: var(--focus);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 20%, transparent);
  }

  .box input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    font-size: var(--text-md);
    color: var(--text);
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--border-strong);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 14px;
    margin: 16px 0;
  }

  .filters label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--text-sm);
    color: var(--text-3);
  }

  .filters label.disabled {
    opacity: 0.55;
  }

  .filters select {
    height: 32px;
    padding: 0 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface);
    font-size: var(--text-sm);
  }

  .count {
    margin: 0 0 0 auto;
    font-size: var(--text-sm);
    color: var(--text-2);
  }

  .count span {
    color: var(--text-3);
  }

  .notice {
    padding: 28px 16px;
    text-align: center;
    color: var(--text-2);
  }

  .notice p {
    margin: 0 0 12px;
  }

  .notice.error {
    color: #c2410c;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .chip {
    padding: 6px 14px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    font-size: var(--text-sm);
  }

  .chip:hover {
    border-color: var(--accent);
    color: var(--accent-strong);
  }

  .results {
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: hidden;
  }

  .hit {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
  }

  .hit:last-child {
    border-bottom: 0;
  }

  .title {
    font-size: var(--text-md);
    font-weight: 600;
    line-height: 1.35;
  }

  .title:hover {
    color: var(--accent-strong);
  }

  .url {
    display: block;
    margin-top: 2px;
    font-size: var(--text-sm);
    color: var(--text-3);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 12px;
    margin-top: 6px;
    font-size: var(--text-sm);
    color: var(--text-3);
  }

  .meta.top {
    margin-top: 0;
    gap: 2px 8px;
  }

  .meta a:hover {
    color: var(--text);
    text-decoration: underline;
  }

  .pts {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-weight: 700;
    color: var(--accent);
  }

  .who {
    font-weight: 650;
    color: var(--text);
  }

  .story {
    min-width: 0;
    color: var(--text-2);
    font-weight: 550;
  }

  .snippet {
    margin: 6px 0 0;
    font-size: var(--text-base);
    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  .more {
    display: flex;
    justify-content: center;
    margin-top: 18px;
  }
</style>
