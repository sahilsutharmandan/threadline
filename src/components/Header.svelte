<script>
  import Icon from './Icon.svelte'
  import { route, navigate } from '../lib/router.svelte.js'
  import { shortcuts } from '../lib/keys.js'

  let q = $state('')
  let input

  $effect(() =>
    shortcuts({
      '/': () => input?.focus(),
    })
  )

  function onInputKey(e) {
    if (e.key === 'Escape') {
      q = ''
      input.blur()
    }
  }

  const links = [
    { to: '/top', label: 'Feed', match: (p) => ['/top', '/new', '/ask', '/show'].includes(p) || p.startsWith('/item') },
    { to: '/search', label: 'Search', match: (p) => p === '/search' },
    { to: '/saved', label: 'Read later', match: (p) => p === '/saved' },
  ]

  function submit(e) {
    e.preventDefault()
    const query = q.trim()
    navigate('/search' + (query ? '?q=' + encodeURIComponent(query) : ''))
    e.currentTarget.querySelector('input')?.blur()
  }
</script>

<header class="header">
  <div class="inner">
    <a class="brand" href="#/top" aria-label="Threadline home">
      <span class="logo">T</span>
      <span class="name">Threadline</span>
    </a>

    <nav class="nav" aria-label="Primary">
      {#each links as l (l.to)}
        <a href={'#' + l.to} class:active={l.match(route.path)}>{l.label}</a>
      {/each}
    </nav>

    <form class="search" role="search" onsubmit={submit}>
      <Icon name="search" size={16} />
      <input type="search" placeholder="Search stories, comments…" aria-label="Search Hacker News" bind:value={q} bind:this={input} onkeydown={onInputKey} />
      <kbd>/</kbd>
    </form>
  </div>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 30;
    height: var(--header-h);
    background: color-mix(in srgb, var(--surface) 86%, transparent);
    backdrop-filter: saturate(160%) blur(12px);
    border-bottom: 1px solid var(--border);
  }

  .inner {
    display: flex;
    align-items: center;
    gap: 20px;
    height: 100%;
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 750;
    letter-spacing: -0.02em;
    font-size: var(--text-md);
  }

  .logo {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: var(--accent);
    color: #fff;
    font-weight: 800;
    font-size: 16px;
  }

  .nav {
    display: flex;
    gap: 4px;
  }

  .nav a {
    padding: 6px 12px;
    border-radius: 999px;
    color: var(--text-2);
    font-size: var(--text-sm);
    font-weight: 550;
  }

  .nav a:hover {
    color: var(--text);
    background: var(--surface-2);
  }

  .nav a.active {
    color: var(--text);
    background: var(--surface-2);
  }

  .search {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    width: min(340px, 40vw);
    height: 38px;
    padding: 0 10px 0 12px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface-2);
    color: var(--text-3);
  }

  .search:focus-within {
    border-color: var(--focus);
    background: var(--surface);
  }

  .search input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    font-size: var(--text-sm);
    color: var(--text);
  }

  kbd {
    padding: 1px 6px;
    border: 1px solid var(--border-strong);
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-3);
  }

  @media (max-width: 720px) {
    .nav,
    .search {
      display: none;
    }

    .inner {
      padding: 0 16px;
    }
  }
</style>
