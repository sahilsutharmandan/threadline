<script>
  import Tabs from '../components/Tabs.svelte'
  import StoryRow from '../components/StoryRow.svelte'
  import StorySkeleton from '../components/StorySkeleton.svelte'
  import { feed } from '../lib/feed.svelte.js'

  let { tab } = $props()

  const tabs = [
    { id: 'top', label: 'Top', href: '#/top', icon: 'flame' },
    { id: 'new', label: 'New', href: '#/new', icon: 'clock' },
    { id: 'ask', label: 'Ask', href: '#/ask', icon: 'help' },
    { id: 'show', label: 'Show', href: '#/show', icon: 'eye' },
  ]

  const blurb = {
    top: 'The most upvoted stories from the last two days.',
    new: 'Fresh submissions, newest first.',
    ask: 'Questions and discussions from the community.',
    show: 'Things people made, shared for feedback.',
  }

  $effect(() => {
    feed.reset(tab)
    window.scrollTo(0, 0)
  })
</script>

<div class="container page">
  <div class="head">
    <h1 class="page-title">Hacker News</h1>
    <p class="page-sub">{blurb[tab]}</p>
  </div>

  <Tabs items={tabs} active={tab} label="Feeds" />

  <section class="list card" aria-busy={feed.loading}>
    {#each feed.stories as story, i (story.id)}
      <StoryRow {story} rank={i + 1} />
    {/each}

    {#if feed.loading && feed.stories.length === 0}
      <StorySkeleton />
    {/if}
  </section>

  {#if feed.error}
    <div class="status error">
      <span>Couldn't load stories: {feed.error}</span>
      <button class="btn" onclick={() => feed.retry()}>Try again</button>
    </div>
  {/if}
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

  .status.error {
    color: #c2410c;
  }
</style>
