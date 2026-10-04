<script>
  import Icon from '../components/Icon.svelte'
  import StoryRow from '../components/StoryRow.svelte'
  import { readLater } from '../lib/readLater.svelte.js'
  import { visited } from '../lib/history.svelte.js'
  import { plural } from '../lib/time.js'

  let confirming = $state(false)
  let show = $state('all')

  const unread = $derived(readLater.items.filter((s) => !visited.has(s.id)))
  const list = $derived(show === 'unread' ? unread : readLater.items)

  function clearAll() {
    if (!confirming) {
      confirming = true
      setTimeout(() => (confirming = false), 3000)
      return
    }
    readLater.clear()
    confirming = false
  }
</script>

<div class="container page">
  <div class="head">
    <div>
      <h1 class="page-title">Read later</h1>
      <p class="page-sub">
        {readLater.count ? `${plural(readLater.count, 'story', 'stories')} saved on this device.` : 'Stories you save show up here.'}
      </p>
    </div>
    {#if readLater.count}
      <div class="tools">
        <div class="filter" role="group" aria-label="Show">
          <button type="button" class:on={show === 'all'} aria-pressed={show === 'all'} onclick={() => (show = 'all')}>
            All <span>{readLater.count}</span>
          </button>
          <button type="button" class:on={show === 'unread'} aria-pressed={show === 'unread'} onclick={() => (show = 'unread')}>
            Unread <span>{unread.length}</span>
          </button>
        </div>
        <button class="btn" class:danger={confirming} type="button" onclick={clearAll}>
          <Icon name="trash" size={15} />
          {confirming ? 'Click again to clear' : 'Clear all'}
        </button>
      </div>
    {/if}
  </div>

  {#if list.length}
    <section class="list card">
      {#each list as story (story.id)}
        <StoryRow {story} />
      {/each}
    </section>
  {/if}

  {#if !unread.length}
    <div class="empty card">
      <span class="icon"><Icon name="bookmark" size={28} /></span>
      <h2>{show === 'unread' ? 'Nothing unread' : 'Nothing saved yet'}</h2>
      <p>Tap the bookmark on any story, or press <kbd>s</kbd> in the feed, to keep it for later.</p>
      <a class="btn btn-primary" href="#/top">Browse top stories</a>
    </div>
  {/if}
</div>

<style>
  .head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .tools {
    display: flex;
    gap: 8px;
  }

  .filter {
    display: flex;
    gap: 2px;
    padding: 3px;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
  }

  .filter button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 28px;
    padding: 0 10px;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: var(--text-2);
    font-size: var(--text-sm);
    font-weight: 550;
  }

  .filter button.on {
    background: var(--surface);
    color: var(--text);
    box-shadow: var(--shadow-sm);
  }

  .filter span {
    color: var(--text-3);
    font-size: var(--text-xs);
  }

  .list {
    overflow: hidden;
    margin-bottom: 16px;
  }

  .danger {
    border-color: #dc2626;
    color: #dc2626;
  }

  .empty {
    display: grid;
    justify-items: center;
    gap: 6px;
    padding: 48px 24px;
    text-align: center;
  }

  .icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    margin-bottom: 8px;
    border-radius: 50%;
    background: var(--accent-soft);
    color: var(--accent);
  }

  .empty h2 {
    margin: 0;
    font-size: var(--text-lg);
  }

  .empty p {
    max-width: 380px;
    margin: 0 0 14px;
    color: var(--text-2);
  }

  kbd {
    padding: 1px 6px;
    border: 1px solid var(--border-strong);
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }
</style>
