<script>
  import { setContext, untrack } from 'svelte'
  import Icon from '../components/Icon.svelte'
  import Comment from '../components/Comment.svelte'
  import { fetchItem } from '../lib/api.js'
  import { createCollapse } from '../lib/collapse.svelte.js'
  import { markVisited } from '../lib/history.svelte.js'
  import { readLater } from '../lib/readLater.svelte.js'
  import { hostOf, hnLink } from '../lib/url.js'
  import { timeAgo, fullDate, plural } from '../lib/time.js'

  let { id } = $props()

  let data = $state(null)
  let error = $state(null)
  let sort = $state('default')
  let copied = $state(false)

  const collapse = createCollapse()
  setContext('collapse', collapse)

  $effect(() => {
    const ctrl = new AbortController()
    data = null
    error = null
    untrack(() => {
      collapse.expandAll()
      markVisited(Number(id))
    })
    window.scrollTo(0, 0)
    fetchItem(id, ctrl.signal)
      .then((d) => (data = d))
      .catch((e) => {
        if (e.name !== 'AbortError') error = e.message
      })
    return () => ctrl.abort()
  })

  const story = $derived(data?.story)
  const host = $derived(hostOf(story?.url))

  const threads = $derived.by(() => {
    if (!data) return []
    const list = [...data.comments]
    if (sort === 'newest') list.sort((a, b) => b.time - a.time)
    if (sort === 'oldest') list.sort((a, b) => a.time - b.time)
    return list
  })

  const saved = $derived(story ? readLater.has(story.id) : false)

  function toggleSaved() {
    readLater.toggle({ ...story, comments: data.total })
  }

  const anyCollapsed = $derived(collapse.size > 0)

  function toggleAll() {
    if (anyCollapsed) collapse.expandAll()
    else collapse.collapseAll(threads.map((c) => c.id))
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(location.href)
      copied = true
      setTimeout(() => (copied = false), 1500)
    } catch {}
  }

  $effect(() => {
    if (story?.title) document.title = `${story.title} · Threadline`
    return () => (document.title = 'Threadline')
  })
</script>

<div class="wrap page">
  {#if error}
    <div class="card empty">
      <h1 class="page-title">Couldn't load this story</h1>
      <p class="page-sub">{error}</p>
      <a class="btn" href="#/top">Back to the feed</a>
    </div>
  {:else if !story}
    <div class="story-layout">
      <div class="main">
        <div class="sk title"></div>
        <div class="sk meta"></div>
        {#each Array(5) as _, i (i)}
          <div class="sk line" style:width="{90 - i * 9}%"></div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="story-layout">
      <div class="main">
        <article class="story card">
          <h1 class="title">
            {#if story.url}
              <a href={story.url} target="_blank" rel="noopener noreferrer">{story.title}</a>
            {:else}
              {story.title}
            {/if}
          </h1>
          {#if host}
            <a class="site" href={story.url} target="_blank" rel="noopener noreferrer">
              <Icon name="external" size={13} />
              {host}
            </a>
          {/if}
          <div class="meta">
            <span class="pts"><Icon name="arrowUp" size={13} stroke={2.4} /> {story.points}</span>
            <span>by <a class="author" href="#/user/{story.author}">{story.author}</a></span>
            <time title={fullDate(story.time)}>{timeAgo(story.time)}</time>
            <span>{plural(data.total, 'comment')}</span>
          </div>
          {#if story.text}
            <div class="text prose">{@html story.text}</div>
          {/if}
          <div class="story-actions">
            <button class="btn" class:btn-primary={saved} type="button" onclick={toggleSaved}>
              <Icon name={saved ? 'bookmark-fill' : 'bookmark'} size={15} />
              {saved ? 'Saved' : 'Read later'}
            </button>
            <a class="btn btn-ghost" href={hnLink(story.id)} target="_blank" rel="noopener noreferrer">
              <Icon name="external" size={15} /> HN
            </a>
          </div>
        </article>

        <section class="thread" aria-label="Comments">
          <div class="toolbar">
            <h2>{plural(data.total, 'comment')}</h2>
            <div class="tools">
              <label class="sort">
                <span class="visually-hidden">Sort threads</span>
                <select bind:value={sort}>
                  <option value="default">Default order</option>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </label>
              <button class="btn" type="button" onclick={toggleAll} disabled={!threads.length}>
                <Icon name={anyCollapsed ? 'expand' : 'collapse'} size={15} />
                {anyCollapsed ? 'Expand all' : 'Collapse all'}
              </button>
            </div>
          </div>

          {#if threads.length}
            <div class="comments">
              {#each threads as c (c.id)}
                <div class="top">
                  <Comment comment={c} depth={0} op={story.author} />
                </div>
              {/each}
            </div>
          {:else}
            <p class="none">No comments yet.</p>
          {/if}
        </section>
      </div>

      <aside class="side">
        <div class="card panel">
          <h3>Thread</h3>
          <dl>
            <div><dt>Points</dt><dd>{story.points.toLocaleString()}</dd></div>
            <div><dt>Comments</dt><dd>{data.total.toLocaleString()}</dd></div>
            <div><dt>Threads</dt><dd>{data.comments.length}</dd></div>
            <div><dt>Posted</dt><dd>{fullDate(story.time)}</dd></div>
          </dl>
          <div class="actions">
            <a class="btn" href={hnLink(story.id)} target="_blank" rel="noopener noreferrer">
              <Icon name="external" size={15} /> Open on HN
            </a>
            <button class="btn" type="button" onclick={copyLink}>{copied ? 'Copied!' : 'Copy link'}</button>
          </div>
        </div>
      </aside>
    </div>
  {/if}
</div>

<style>
  .wrap {
    max-width: 1120px;
    margin: 0 auto;
    padding-inline: 20px;
  }

  .story-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 28px;
    align-items: start;
  }

  .story {
    padding: 22px 24px;
  }

  .title {
    margin: 0;
    font-size: var(--text-xl);
    line-height: 1.25;
    letter-spacing: -0.02em;
  }

  .title a:hover {
    color: var(--accent-strong);
  }

  .site {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 6px;
    font-size: var(--text-sm);
    color: var(--text-3);
  }

  .site:hover {
    color: var(--link);
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    margin-top: 12px;
    font-size: var(--text-sm);
    color: var(--text-2);
  }

  .pts {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-weight: 700;
    color: var(--accent);
  }

  .author {
    font-weight: 600;
    color: var(--text);
  }

  .author:hover {
    text-decoration: underline;
  }

  .text {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
    font-size: var(--text-base);
  }

  .story-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .thread {
    margin-top: 28px;
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }

  .toolbar h2 {
    margin: 0;
    font-size: var(--text-md);
  }

  .tools {
    display: flex;
    gap: 8px;
  }

  .sort select {
    height: 34px;
    padding: 0 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface);
    font-size: var(--text-sm);
  }

  .top {
    padding-bottom: var(--comment-gap);
    border-bottom: 1px solid var(--border);
  }

  .none {
    color: var(--text-3);
  }

  .side {
    position: sticky;
    top: calc(var(--header-h) + 24px);
  }

  .panel {
    padding: 18px;
  }

  .panel h3 {
    margin: 0 0 12px;
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-3);
  }

  dl {
    display: grid;
    gap: 8px;
    margin: 0;
  }

  dl div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: var(--text-sm);
  }

  dt {
    color: var(--text-3);
  }

  dd {
    margin: 0;
    font-weight: 600;
    text-align: right;
  }

  .actions {
    display: grid;
    gap: 8px;
    margin-top: 16px;
  }

  .actions .btn {
    justify-content: center;
  }

  .empty {
    padding: 32px;
    text-align: center;
  }

  .sk {
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    margin-bottom: 12px;
    animation: pulse 1.2s ease-in-out infinite alternate;
  }

  .sk.title { height: 30px; width: 70%; }
  .sk.meta { height: 14px; width: 40%; margin-bottom: 28px; }
  .sk.line { height: 12px; }

  @keyframes pulse {
    to { opacity: 0.5; }
  }

  @media (max-width: 960px) {
    .story-layout {
      grid-template-columns: minmax(0, 1fr);
    }

    .side {
      position: static;
      order: -1;
      display: none;
    }
  }

  @media (max-width: 720px) {
    .wrap {
      padding-inline: 16px;
    }

    .story {
      padding: 16px;
    }

    .title {
      font-size: var(--text-lg);
    }

    .toolbar h2 {
      font-size: var(--text-base);
    }
  }
</style>
