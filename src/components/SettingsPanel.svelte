<script>
  import { fly, fade } from 'svelte/transition'
  import Icon from './Icon.svelte'
  import Segmented from './Segmented.svelte'
  import { settings } from '../lib/settings.svelte.js'
  import { ui, closeSettings } from '../lib/ui.svelte.js'
  import { visited, clearVisited } from '../lib/history.svelte.js'
  import { readLater } from '../lib/readLater.svelte.js'

  let panel = $state()
  let mobile = $state(false)

  $effect(() => {
    const mq = window.matchMedia('(max-width: 720px)')
    mobile = mq.matches
    const on = (e) => (mobile = e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  })

  $effect(() => {
    if (!ui.settingsOpen) return
    const prev = document.activeElement
    panel?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') closeSettings()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  })

  const themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ]
  const sizes = [
    { value: 's', label: 'Small', preview: '13px' },
    { value: 'm', label: 'Medium', preview: '16px' },
    { value: 'l', label: 'Large', preview: '20px' },
  ]
  const densities = [
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
  ]

  const keys = [
    ['j / k', 'Next / previous story'],
    ['o', 'Open link'],
    ['c or Enter', 'Open comments'],
    ['s', 'Save for later'],
    ['/', 'Focus search'],
  ]
</script>

{#if ui.settingsOpen}
  <div class="backdrop" transition:fade={{ duration: 150 }} onclick={closeSettings} aria-hidden="true"></div>
  <div
    class="panel"
    role="dialog"
    aria-modal="true"
    aria-labelledby="settings-title"
    tabindex="-1"
    bind:this={panel}
    transition:fly={mobile ? { y: 400, duration: 220 } : { x: 380, duration: 220 }}
  >
    <header>
      <h2 id="settings-title">Settings</h2>
      <button class="icon-btn" type="button" onclick={closeSettings} aria-label="Close settings">
        <Icon name="x" size={18} />
      </button>
    </header>

    <section>
      <h3>Theme</h3>
      <Segmented name="theme" label="Theme" options={themes} value={settings.theme} onchange={(theme) => settings.update({ theme })} />
    </section>

    <section>
      <h3>Text size</h3>
      <Segmented name="font" label="Text size" options={sizes} value={settings.fontSize} onchange={(fontSize) => settings.update({ fontSize })} />
    </section>

    <section>
      <h3>Comment density</h3>
      <Segmented name="density" label="Comment density" options={densities} value={settings.density} onchange={(density) => settings.update({ density })} />
    </section>

    <section>
      <h3>Your data</h3>
      <p class="hint">Everything is stored in this browser only.</p>
      <div class="rows">
        <div class="row">
          <span>{visited.size} stories marked as read</span>
          <button class="btn" type="button" onclick={clearVisited} disabled={!visited.size}>Clear</button>
        </div>
        <div class="row">
          <span>{readLater.count} saved for later</span>
          <button class="btn" type="button" onclick={() => readLater.clear()} disabled={!readLater.count}>Clear</button>
        </div>
      </div>
    </section>

    <section class="keys-section">
      <h3>Keyboard shortcuts</h3>
      <dl class="keys">
        {#each keys as [k, desc] (k)}
          <div><dt><kbd>{k}</kbd></dt><dd>{desc}</dd></div>
        {/each}
      </dl>
    </section>

    <footer>
      <button class="btn btn-ghost" type="button" onclick={() => settings.reset()}>Reset to defaults</button>
    </footer>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: rgb(10 10 10 / 40%);
    backdrop-filter: blur(2px);
  }

  .panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 61;
    display: flex;
    flex-direction: column;
    gap: 22px;
    width: min(380px, 100%);
    padding: 20px 22px 24px;
    overflow-y: auto;
    background: var(--surface);
    border-left: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    outline: none;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h2 {
    margin: 0;
    font-size: var(--text-lg);
  }

  h3 {
    margin: 0 0 10px;
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text-3);
  }

  .hint {
    margin: -4px 0 10px;
    font-size: var(--text-sm);
    color: var(--text-3);
  }

  .rows {
    display: grid;
    gap: 8px;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: var(--text-sm);
  }

  .row .btn {
    height: 30px;
  }

  .row .btn:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .keys {
    display: grid;
    gap: 8px;
    margin: 0;
  }

  .keys div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: var(--text-sm);
  }

  .keys dd {
    margin: 0;
    color: var(--text-2);
  }

  kbd {
    padding: 1px 6px;
    border: 1px solid var(--border-strong);
    border-bottom-width: 2px;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  footer {
    margin-top: auto;
  }

  @media (max-width: 720px) {
    .panel {
      top: auto;
      left: 0;
      width: 100%;
      max-height: 86vh;
      border-left: 0;
      border-top: 1px solid var(--border);
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      padding-bottom: calc(24px + env(safe-area-inset-bottom));
    }

    .keys-section {
      display: none;
    }
  }
</style>
