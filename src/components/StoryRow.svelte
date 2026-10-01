<script>
  import Icon from './Icon.svelte'
  import { hostOf, siteLabel } from '../lib/url.js'
  import { timeAgo, fullDate, plural } from '../lib/time.js'
  import { visited, markVisited } from '../lib/history.svelte.js'
  import { readLater } from '../lib/readLater.svelte.js'

  let { story, rank, selected = false } = $props()

  const saved = $derived(readLater.has(story.id))

  const site = $derived(siteLabel(story.url))
  const external = $derived(Boolean(story.url))
  const link = $derived(story.url || `#/item/${story.id}`)
  const kind = $derived(
    story.tags.includes('ask_hn') ? 'Ask' : story.tags.includes('show_hn') ? 'Show' : null
  )
  const title = $derived(kind ? story.title.replace(/^(Ask|Show) HN:\s*/i, '') : story.title)
</script>

<article class="row" class:ranked={rank != null} class:selected class:seen={visited.has(story.id)} data-story={story.id}>
  {#if rank != null}<span class="rank">{rank}</span>{/if}

  <div class="score" title="{story.points} points">
    <Icon name="arrowUp" size={13} stroke={2.4} />
    <span>{story.points}</span>
  </div>

  <div class="body">
    <h2 class="title">
      {#if kind}<span class="kind">{kind}</span>{/if}
      <a
        class="headline"
        href={link}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onclick={() => markVisited(story.id)}
      >
        {title}
      </a>
      {#if site}<a class="site" href="#/search?q={encodeURIComponent(hostOf(story.url))}">{site}</a>{/if}
    </h2>
    <div class="meta">
      <a class="author" href="#/user/{story.author}">{story.author}</a>
      <span class="dot">·</span>
      <time title={fullDate(story.time)}>{timeAgo(story.time)}</time>
      <span class="dot">·</span>
      <a class="comments" href="#/item/{story.id}" onclick={() => markVisited(story.id)}>
        <Icon name="comment" size={13} />
        {story.comments ? plural(story.comments, 'comment') : 'discuss'}
      </a>
    </div>
  </div>

  <button
    class="save icon-btn"
    class:on={saved}
    type="button"
    onclick={() => readLater.toggle(story)}
    aria-pressed={saved}
    title={saved ? 'Remove from read later' : 'Save for later'}
  >
    <Icon name={saved ? 'bookmark-fill' : 'bookmark'} size={17} />
  </button>
</article>

<style>
  .row {
    position: relative;
    display: grid;
    grid-template-columns: 46px minmax(0, 1fr) auto;
    align-items: start;
    gap: 0 12px;
    padding: var(--row-gap) 16px;
    border-bottom: 1px solid var(--border);
    transition: background-color 0.12s;
  }

  .row.ranked {
    grid-template-columns: 28px 46px minmax(0, 1fr) auto;
  }

  .row:last-child {
    border-bottom: 0;
  }

  .row:hover {
    background: color-mix(in srgb, var(--surface-2) 55%, transparent);
  }

  .row.selected {
    background: var(--accent-soft);
  }

  .row.selected::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--accent);
  }

  .rank {
    padding-top: 6px;
    text-align: right;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-3);
  }

  .score {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    padding: 5px 0 4px;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    color: var(--accent);
    font-size: var(--text-xs);
    font-weight: 700;
  }

  .score span {
    color: var(--text);
  }

  .body {
    min-width: 0;
  }

  .title {
    margin: 0;
    font-size: var(--text-md);
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: -0.005em;
  }

  .seen .headline {
    color: var(--visited);
  }

  .headline:hover {
    color: var(--accent-strong);
  }

  .kind {
    display: inline-block;
    margin-right: 6px;
    padding: 1px 7px;
    border-radius: 999px;
    background: var(--op-bg);
    color: var(--op-fg);
    font-size: var(--text-xs);
    font-weight: 650;
    vertical-align: 2px;
  }

  .site {
    margin-left: 6px;
    font-size: var(--text-sm);
    font-weight: 450;
    color: var(--text-3);
  }

  .site:hover {
    text-decoration: underline;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 6px;
    margin-top: 4px;
    font-size: var(--text-sm);
    color: var(--text-3);
  }

  .meta a:hover {
    color: var(--text);
  }

  .author {
    font-weight: 550;
    color: var(--text-2);
  }

  .comments {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .save {
    margin-top: 2px;
    color: var(--text-3);
    opacity: 0;
    transition: opacity 0.15s;
  }

  .row:hover .save,
  .row.selected .save,
  .save:focus-visible,
  .save.on {
    opacity: 1;
  }

  .save.on {
    color: var(--accent);
  }

  @media (hover: none) {
    .save {
      opacity: 1;
    }
  }

  @media (max-width: 720px) {
    .row,
    .row.ranked {
      grid-template-columns: 40px minmax(0, 1fr) auto;
      padding: var(--row-gap) 12px;
    }

    .rank {
      display: none;
    }

    .title {
      font-size: var(--text-base);
    }
  }
</style>
