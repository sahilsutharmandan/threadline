<script>
  import Header from './components/Header.svelte'
  import Feed from './routes/Feed.svelte'
  import Story from './routes/Story.svelte'
  import { route, navigate, match } from './lib/router.svelte.js'
  import { FEED_NAMES } from './lib/api.js'

  const view = $derived.by(() => {
    const p = route.path
    const tab = p.slice(1)
    if (FEED_NAMES.includes(tab)) return { name: 'feed', tab }
    let m
    if ((m = match('/item/:id', p))) return { name: 'item', ...m }
    return { name: 'notfound' }
  })

  $effect(() => {
    if (route.path === '/') navigate('/top', { replace: true })
  })
</script>

<Header />

<main>
  {#if view.name === 'feed'}
    <Feed tab={view.tab} />
  {:else if view.name === 'item'}
    {#key view.id}
      <Story id={view.id} />
    {/key}
  {:else if route.path !== '/'}
    <div class="container page">
      <h1 class="page-title">Page not found</h1>
      <p class="page-sub">There's nothing at <code>{route.path}</code>. <a href="#/top">Back to the feed</a></p>
    </div>
  {/if}
</main>
