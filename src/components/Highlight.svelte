<script>
  import { highlightText, highlightHtml } from '../lib/html.js'

  let { value = '', html = false } = $props()

  const markup = $derived(html ? highlightHtml(value) : highlightText(value))
</script>

<span class="hl">{@html markup}</span>
