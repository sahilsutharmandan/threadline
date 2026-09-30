<script>
  let { name, options, value, onchange, label } = $props()
</script>

<div class="seg" role="radiogroup" aria-label={label}>
  {#each options as opt (opt.value)}
    <label class:checked={opt.value === value}>
      <input
        type="radio"
        {name}
        value={opt.value}
        checked={opt.value === value}
        onchange={() => onchange(opt.value)}
      />
      {#if opt.preview}
        <span class="preview" style:font-size={opt.preview}>Aa</span>
      {/if}
      <span>{opt.label}</span>
    </label>
  {/each}
</div>

<style>
  .seg {
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    gap: 4px;
    padding: 4px;
    border-radius: var(--radius);
    background: var(--surface-2);
  }

  label {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-height: 36px;
    padding: 6px 8px;
    border-radius: 7px;
    color: var(--text-2);
    font-size: var(--text-sm);
    font-weight: 550;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
  }

  label:hover {
    color: var(--text);
  }

  label.checked {
    background: var(--surface);
    color: var(--text);
    box-shadow: var(--shadow-sm);
  }

  label:has(input:focus-visible) {
    outline: 2px solid var(--focus);
    outline-offset: 1px;
  }

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .preview {
    font-weight: 700;
    line-height: 1.1;
  }
</style>
