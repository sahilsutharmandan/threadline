<script>
  import Header from './components/Header.svelte'
  import { route } from './lib/router.svelte.js'
</script>

<Header />

<main class="container page">
  <h1 class="page-title">Threadline</h1>
  <p class="page-sub">{route.path}</p>
</main>
