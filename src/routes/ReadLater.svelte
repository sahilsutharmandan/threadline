<script>
  import Icon from '../components/Icon.svelte'
  import StoryRow from '../components/StoryRow.svelte'
  import { readLater } from '../lib/readLater.svelte.js'
  import { plural } from '../lib/time.js'

  let confirming = $state(false)

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
      <button class="btn" class:danger={confirming} type="button" onclick={clearAll}>
        <Icon name="trash" size={15} />
        {confirming ? 'Click again to clear' : 'Clear all'}
      </button>
    {/if}
  </div>

  {#if readLater.count}
    <section class="list card">
      {#each readLater.items as story (story.id)}
        <StoryRow {story} />
      {/each}
    </section>
  {:else}
    <div class="empty card">
      <span class="icon"><Icon name="bookmark" size={28} /></span>
      <h2>Nothing saved yet</h2>
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

  .list {
    overflow: hidden;
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
