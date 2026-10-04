<script>
  import { onMount, tick } from 'svelte'
  import Icon from './Icon.svelte'

  let { items, active, onselect, label = 'Sections' } = $props()

  let list
  let offsets = $state([])

  function updateOffsets() {
    if (!list) return
    offsets = [...list.querySelectorAll('.tab')].map((el) => ({ x: el.offsetLeft, w: el.offsetWidth }))
  }

  onMount(() => {
    updateOffsets()
    const ro = new ResizeObserver(() => updateOffsets())
    ro.observe(list)
    window.addEventListener('resize', updateOffsets)
    document.fonts?.ready?.then(updateOffsets)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateOffsets)
    }
  })

  $effect(() => {
    items
    active
    tick().then(updateOffsets)
  })

  const index = $derived(items.findIndex((item) => item.id === active))
  const bar = $derived(offsets[index] ? { ...offsets[index], ready: true } : { x: 0, w: 0, ready: false })
</script>

<div class="tabs" bind:this={list} role="tablist" aria-label={label}>
  {#each items as item (item.id)}
    {#if item.href}
      <a
        class="tab"
        href={item.href}
        role="tab"
        aria-selected={item.id === active}
        data-active={item.id === active}
      >
        {#if item.icon}<Icon name={item.icon} size={15} />{/if}
        {#if item.short}
          <span class="long">{item.label}</span><span class="short">{item.short}</span>
        {:else}
          <span>{item.label}</span>
        {/if}
        {#if item.count != null}<span class="count">{item.count}</span>{/if}
      </a>
    {:else}
      <button
        class="tab"
        type="button"
        role="tab"
        aria-selected={item.id === active}
        data-active={item.id === active}
        onclick={() => onselect?.(item.id)}
      >
        {#if item.icon}<Icon name={item.icon} size={15} />{/if}
        {#if item.short}
          <span class="long">{item.label}</span><span class="short">{item.short}</span>
        {:else}
          <span>{item.label}</span>
        {/if}
        {#if item.count != null}<span class="count">{item.count}</span>{/if}
      </button>
    {/if}
  {/each}
  <span
    class="indicator"
    class:ready={bar.ready}
    style:width="{bar.w}px"
    style:transform="translateX({bar.x}px)"
  ></span>
</div>

<style>
  .tabs {
    position: relative;
    display: flex;
    gap: 6px;
    border-bottom: 1px solid var(--border);
  }

  .tab {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 16px 12px;
    border: 0;
    background: none;
    color: var(--text-2);
    font-size: var(--text-sm);
    font-weight: 600;
    white-space: nowrap;
    transition: color 0.15s;
  }

  .tab:hover {
    color: var(--text);
  }

  .tab[data-active='true'] {
    color: var(--text);
  }

  .short {
    display: none;
  }

  .count {
    padding: 0 6px;
    border-radius: 999px;
    background: var(--surface-2);
    font-size: var(--text-xs);
    color: var(--text-3);
  }

  .indicator {
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 2px;
    border-radius: 2px;
    background: var(--accent);
    opacity: 0;
  }

  .indicator.ready {
    opacity: 1;
    transition: transform 0.25s cubic-bezier(0.3, 0.7, 0.2, 1), width 0.25s cubic-bezier(0.3, 0.7, 0.2, 1);
  }

  @media (max-width: 720px) {
    .tabs {
      gap: 0;
    }

    .tab {
      flex: 1;
      justify-content: center;
      padding: 10px 6px 12px;
    }

    .tab :global(svg),
    .long {
      display: none;
    }

    .short {
      display: inline;
    }
  }
</style>
