<script>
  import Header from './components/Header.svelte'
  import Feed from './routes/Feed.svelte'
  import { route, navigate } from './lib/router.svelte.js'
  import { FEED_NAMES } from './lib/api.js'

  const view = $derived.by(() => {
    const p = route.path
    const tab = p.slice(1)
    if (FEED_NAMES.includes(tab)) return { name: 'feed', tab }
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
  {:else if route.path !== '/'}
    <div class="container page">
      <h1 class="page-title">Page not found</h1>
      <p class="page-sub">There's nothing at <code>{route.path}</code>. <a href="#/top">Back to the feed</a></p>
    </div>
  {/if}
</main>
