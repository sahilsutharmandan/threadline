<script>
  let { count = 8 } = $props()
</script>

{#each Array(count) as _, i (i)}
  <div class="sk" aria-hidden="true">
    <span class="box"></span>
    <div class="lines">
      <span class="line" style:width="{60 + ((i * 37) % 35)}%"></span>
      <span class="line short"></span>
    </div>
  </div>
{/each}

<style>
  .sk {
    display: grid;
    grid-template-columns: 46px 1fr;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid var(--border);
  }

  .box,
  .line {
    border-radius: var(--radius-sm);
    background: linear-gradient(90deg, var(--surface-2), var(--border), var(--surface-2));
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }

  .box {
    height: 40px;
  }

  .lines {
    display: grid;
    gap: 8px;
    align-content: center;
  }

  .line {
    height: 12px;
  }

  .line.short {
    width: 35%;
  }

  @keyframes shimmer {
    from { background-position: 100% 0; }
    to { background-position: -100% 0; }
  }
</style>
