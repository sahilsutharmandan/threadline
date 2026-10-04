<script>
  import Icon from './Icon.svelte'
  import { settings, THEMES } from '../lib/settings.svelte.js'

  const icons = { system: 'monitor', light: 'sun', dark: 'moon' }
  const labels = { system: 'System', light: 'Light', dark: 'Dark' }

  const mode = $derived(settings.theme)

  function cycle() {
    settings.update({ theme: THEMES[(THEMES.indexOf(mode) + 1) % THEMES.length] })
  }
</script>

<button
  class="icon-btn toggle"
  type="button"
  onclick={cycle}
  title="Theme: {labels[mode]}"
  aria-label="Theme: {labels[mode]}. Click to change."
  data-mode={mode}
>
  {#key mode}
    <span class="ico"><Icon name={icons[mode]} size={18} /></span>
  {/key}
</button>

<style>
  .toggle {
    overflow: hidden;
  }

  .ico {
    animation: pop 0.25s ease;
  }

  @keyframes pop {
    from {
      transform: rotate(-60deg) scale(0.6);
      opacity: 0;
    }
  }
</style>
