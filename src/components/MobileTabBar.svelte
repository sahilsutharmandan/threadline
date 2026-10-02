<script>
  import Icon from './Icon.svelte'
  import { route } from '../lib/router.svelte.js'
  import { readLater } from '../lib/readLater.svelte.js'
  import { ui, openSettings } from '../lib/ui.svelte.js'

  const isFeed = $derived(['/top', '/new', '/ask', '/show'].includes(route.path) || route.path.startsWith('/item'))
</script>

<nav class="bar" aria-label="Mobile">
  <a href="#/top" class:active={isFeed && !ui.settingsOpen}>
    <Icon name="home" size={21} />
    <span>Feed</span>
  </a>
  <a href="#/search" class:active={route.path === '/search' && !ui.settingsOpen}>
    <Icon name="search" size={21} />
    <span>Search</span>
  </a>
  <a href="#/saved" class:active={route.path === '/saved' && !ui.settingsOpen}>
    <span class="ico">
      <Icon name="bookmark" size={21} />
      {#if readLater.count}<span class="badge">{readLater.count > 99 ? '99+' : readLater.count}</span>{/if}
    </span>
    <span>Saved</span>
  </a>
  <button type="button" class:active={ui.settingsOpen} onclick={openSettings}>
    <Icon name="settings" size={21} />
    <span>Settings</span>
  </button>
</nav>

<style>
  .bar {
    display: none;
  }

  @media (max-width: 720px) {
    .bar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 40;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      height: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
      padding-bottom: env(safe-area-inset-bottom);
      background: color-mix(in srgb, var(--surface) 92%, transparent);
      backdrop-filter: saturate(160%) blur(12px);
      border-top: 1px solid var(--border);
    }
  }

  a,
  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    border: 0;
    background: none;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 600;
  }

  .active {
    color: var(--accent);
  }

  .ico {
    position: relative;
  }

  .badge {
    position: absolute;
    top: -5px;
    right: -10px;
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-size: 10px;
    line-height: 17px;
    text-align: center;
  }
</style>
