<script>
  import Tabs from '../components/Tabs.svelte'
  import StoryRow from '../components/StoryRow.svelte'
  import StorySkeleton from '../components/StorySkeleton.svelte'
  import { feed } from '../lib/feed.svelte.js'
  import { infinite } from '../lib/actions.js'
  import { shortcuts } from '../lib/keys.js'
  import { markVisited } from '../lib/history.svelte.js'
  import { navigate } from '../lib/router.svelte.js'
  import { readLater } from '../lib/readLater.svelte.js'
  import { tick } from 'svelte'

  let { tab } = $props()

  const tabs = [
    { id: 'top', label: 'Top stories', short: 'Top', href: '#/top', icon: 'flame' },
    { id: 'new', label: 'Newest', short: 'New', href: '#/new', icon: 'clock' },
    { id: 'ask', label: 'Ask HN', short: 'Ask', href: '#/ask', icon: 'help' },
    { id: 'show', label: 'Show HN', short: 'Show', href: '#/show', icon: 'eye' },
  ]

  const blurb = {
    top: 'The most upvoted stories from the last two days.',
    new: 'Fresh submissions, newest first.',
    ask: 'Questions and discussions from the community.',
    show: 'Things people made, shared for feedback.',
  }

  let selected = $state(-1)

  $effect(() => {
    feed.reset(tab)
    selected = -1
    window.scrollTo(0, 0)
  })

  async function select(index) {
    if (!feed.stories.length) return
    selected = Math.max(0, Math.min(feed.stories.length - 1, index))
    await tick()
    const id = feed.stories[selected]?.id
    document.querySelector(`[data-story="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    if (selected >= feed.stories.length - 3) feed.loadMore(tab)
  }

  function current() {
    return feed.stories[selected]
  }

  $effect(() =>
    shortcuts({
      j: () => select(selected + 1),
      k: () => select(selected - 1),
      o: () => {
        const s = current()
        if (!s) return false
        markVisited(s.id)
        if (s.url) window.open(s.url, '_blank', 'noopener')
        else navigate(`/item/${s.id}`)
      },
      c: () => {
        const s = current()
        if (!s) return false
        markVisited(s.id)
        navigate(`/item/${s.id}`)
      },
      s: () => {
        const s = current()
        if (!s) return false
        readLater.toggle(s)
      },
      Enter: () => {
        const s = current()
        if (!s) return false
        markVisited(s.id)
        navigate(`/item/${s.id}`)
      },
    })
  )
</script>

<div class="container page">
  <div class="head">
    <h1 class="page-title">Hacker News</h1>
    <p class="page-sub">{blurb[tab]}</p>
  </div>

  <Tabs items={tabs} active={tab} label="Feeds" />

  <section class="list card" aria-busy={feed.loading}>
    {#each feed.stories as story, i (story.id)}
      <StoryRow {story} rank={i + 1} selected={i === selected} />
    {/each}

    {#if feed.loading && feed.stories.length === 0}
      <StorySkeleton />
    {/if}
  </section>

  <div class="sentinel" use:infinite={{ key: tab, onLoad: (name) => feed.loadMore(name) }}></div>

  {#if feed.loading && feed.stories.length > 0}
    <div class="status"><span class="spinner"></span> Loading more…</div>
  {:else if feed.done && feed.stories.length > 0}
    <div class="status">You've reached the end. <a href="#/new">See what's new</a></div>
  {/if}

  {#if feed.error}
    <div class="status error">
      <span>Couldn't load stories: {feed.error}</span>
      <button class="btn" onclick={() => feed.retry()}>Try again</button>
    </div>
  {/if}

  <p class="keys">
    <kbd>j</kbd><kbd>k</kbd> move <span>·</span> <kbd>o</kbd> open link <span>·</span>
    <kbd>c</kbd> comments <span>·</span> <kbd>s</kbd> save <span>·</span> <kbd>/</kbd> search
  </p>
</div>

<style>
  .head {
    margin-bottom: 8px;
  }

  .list {
    margin-top: 16px;
    overflow: hidden;
  }

  .list:empty {
    display: none;
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 24px;
    color: var(--text-3);
    font-size: var(--text-sm);
  }

  .status a {
    color: var(--link);
  }

  .sentinel {
    height: 1px;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--border-strong);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .keys {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin: 8px 0 0;
    color: var(--text-3);
    font-size: var(--text-xs);
  }

  .keys kbd {
    min-width: 20px;
    padding: 1px 5px;
    border: 1px solid var(--border-strong);
    border-bottom-width: 2px;
    border-radius: 4px;
    background: var(--surface);
    font-family: var(--font-mono);
    text-align: center;
  }

  @media (max-width: 720px) {
    .keys {
      display: none;
    }
  }

  .status.error {
    color: #c2410c;
  }
</style>
