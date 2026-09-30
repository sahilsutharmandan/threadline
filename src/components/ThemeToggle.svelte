<script>
  import Icon from './Icon.svelte'
  import { settings, THEMES } from '../lib/settings.svelte.js'

  const icons = { system: 'monitor', light: 'sun', dark: 'moon' }
  const labels = { system: 'System', light: 'Light', dark: 'Dark' }

  function cycle() {
    const next = THEMES[(THEMES.indexOf(settings.theme) + 1) % THEMES.length]
    settings.update({ theme: next })
  }
</script>

<button
  class="icon-btn toggle"
  type="button"
  onclick={cycle}
  title="Theme: {labels[settings.theme]}"
  aria-label="Theme: {labels[settings.theme]}. Click to change."
  data-mode={settings.theme}
>
  {#key settings.theme}
    <span class="ico"><Icon name={icons[settings.theme]} size={18} /></span>
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
