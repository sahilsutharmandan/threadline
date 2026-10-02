<script>
  import Avatar from '../components/Avatar.svelte'
  import Tabs from '../components/Tabs.svelte'
  import StoryRow from '../components/StoryRow.svelte'
  import StorySkeleton from '../components/StorySkeleton.svelte'
  import { fetchUser, fetchUserActivity } from '../lib/api.js'
  import { timeAgo, fullDate, plural } from '../lib/time.js'

  let { name } = $props()

  let user = $state(null)
  let error = $state(null)
  let kind = $state('story')
  let activity = $state(null)
  let loadingMore = $state(false)

  $effect(() => {
    const ctrl = new AbortController()
    user = null
    error = null
    fetchUser(name, ctrl.signal)
      .then((u) => (user = u))
      .catch((e) => {
        if (e.name !== 'AbortError') error = e.message
      })
    return () => ctrl.abort()
  })

  $effect(() => {
    const ctrl = new AbortController()
    const type = kind
    activity = null
    fetchUserActivity(name, type, 0, ctrl.signal)
      .then((a) => (activity = a))
      .catch(() => {})
    return () => ctrl.abort()
  })

  async function more() {
    loadingMore = true
    try {
      const next = await fetchUserActivity(name, kind, activity.page + 1)
      activity = { ...next, items: [...activity.items, ...next.items] }
    } finally {
      loadingMore = false
    }
  }

  const tabs = $derived([
    { id: 'story', label: 'Submissions', icon: 'flame', count: kind === 'story' && activity ? activity.total : null },
    { id: 'comment', label: 'Comments', icon: 'comment', count: kind === 'comment' && activity ? activity.total : null },
  ])
</script>

<div class="container page">
  {#if error}
    <div class="card empty">
      <h1 class="page-title">No such user</h1>
      <p class="page-sub">We couldn't find <strong>{name}</strong> on Hacker News.</p>
      <a class="btn" href="#/top">Back to the feed</a>
    </div>
  {:else}
    <section class="profile card">
      <Avatar {name} size={64} />
      <div class="info">
        <h1 class="name">{name}</h1>
        {#if user}
          <p class="karma"><strong>{user.karma.toLocaleString()}</strong> karma</p>
        {:else}
          <p class="karma muted">Loading…</p>
        {/if}
      </div>
      <a class="btn hn" href="https://news.ycombinator.com/user?id={name}" target="_blank" rel="noopener noreferrer">
        View on HN
      </a>
      {#if user?.about}
        <div class="about prose">{@html user.about}</div>
      {/if}
    </section>

    <Tabs items={tabs} active={kind} onselect={(k) => (kind = k)} label="Activity" />

    <section class="activity card">
      {#if !activity}
        <StorySkeleton count={5} />
      {:else if activity.items.length === 0}
        <p class="none">Nothing here yet.</p>
      {:else if kind === 'story'}
        {#each activity.items as story (story.id)}
          <StoryRow {story} />
        {/each}
      {:else}
        {#each activity.items as c (c.id)}
          <article class="c">
            <div class="c-meta">
              <time title={fullDate(c.time)}>{timeAgo(c.time)}</time>
              <span>on</span>
              <a href="#/item/{c.storyId}">{c.storyTitle}</a>
            </div>
            <div class="c-body prose">{@html c.text}</div>
          </article>
        {/each}
      {/if}
    </section>

    {#if activity && activity.page + 1 < activity.pages}
      <div class="more">
        <button class="btn" type="button" onclick={more} disabled={loadingMore}>
          {loadingMore ? 'Loading…' : `Show more ${kind === 'story' ? 'submissions' : 'comments'}`}
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .profile {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 6px 18px;
    margin-bottom: 20px;
    padding: 22px;
  }

  .name {
    margin: 0;
    font-size: var(--text-xl);
    letter-spacing: -0.02em;
    overflow-wrap: anywhere;
  }

  .karma {
    margin: 2px 0 0;
    font-size: var(--text-sm);
    color: var(--text-2);
  }

  .karma strong {
    color: var(--accent);
  }

  .about {
    grid-column: 1 / -1;
    margin-top: 12px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
    font-size: var(--text-base);
    color: var(--text-2);
  }

  .activity {
    margin-top: 16px;
    overflow: hidden;
  }

  .none {
    margin: 0;
    padding: 28px;
    text-align: center;
    color: var(--text-3);
  }

  .c {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
  }

  .c:last-child {
    border-bottom: 0;
  }

  .c-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 6px;
    font-size: var(--text-sm);
    color: var(--text-3);
  }

  .c-meta a {
    font-weight: 600;
    color: var(--text-2);
  }

  .c-meta a:hover {
    text-decoration: underline;
  }

  .c-body {
    margin-top: 6px;
    font-size: var(--text-base);
  }

  .c-body :global(p:first-child) {
    margin-top: 0;
  }

  .more {
    display: flex;
    justify-content: center;
    margin-top: 18px;
  }

  .empty {
    padding: 32px;
    text-align: center;
  }

  @media (max-width: 720px) {
    .profile {
      grid-template-columns: auto minmax(0, 1fr);
      padding: 18px;
    }

    .hn {
      grid-column: 1 / -1;
      justify-content: center;
      margin-top: 8px;
    }
  }
</style>
