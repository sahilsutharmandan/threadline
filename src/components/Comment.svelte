<script>
  import { getContext } from 'svelte'
  import Comment from './Comment.svelte'
  import { timeAgo, fullDate } from '../lib/time.js'
  import { countComments } from '../lib/api.js'

  let { comment, depth = 0, op, path = '0', parent = null } = $props()

  const collapse = getContext('collapse')

  const key = $derived(path)
  const collapsed = $derived(collapse.has(key))
  const hidden = $derived(countComments(comment.children))
  const isOp = $derived(!!op && comment.author === op)

  function toggle() {
    collapse.toggle(key)
  }

  function jump(target) {
    const el = document.getElementById(`c-${target}`)
    if (!el) return
    el.scrollIntoView({ block: 'start', behavior: 'smooth' })
    el.classList.add('flash')
    setTimeout(() => el.classList.remove('flash'), 1200)
  }
</script>

<article class="comment" class:collapsed id="c-{path}" data-id={comment.id} style:--depth={depth}>
  <header class="head">
    <button
      class="toggle"
      type="button"
      onclick={toggle}
      aria-expanded={!collapsed}
      aria-label={collapsed ? 'Expand thread' : 'Collapse thread'}
    >
      {collapsed ? '+' : '–'}
    </button>

    {#if comment.deleted}
      <span class="author deleted">[deleted]</span>
    {:else}
      <a class="author" href="#/user/{comment.author}">{comment.author}</a>
      {#if isOp}<span class="op" title="Original poster">OP</span>{/if}
    {/if}

    <time title={fullDate(comment.time)}>{timeAgo(comment.time)}</time>

    {#if parent}
      <button class="link" type="button" onclick={() => jump(parent)}>parent</button>
    {/if}

    {#if collapsed && hidden > 0}
      <span class="hidden">{hidden} more {hidden === 1 ? 'reply' : 'replies'}</span>
    {/if}
  </header>

  {#if !collapsed}
    <div class="body prose">
      {#if comment.deleted}
        <p class="muted">This comment was deleted.</p>
      {:else}
        {@html comment.text}
      {/if}
    </div>

    {#if comment.children.length}
      <div class="children" class:flat={depth >= 7}>
        <button class="guide" type="button" aria-label="Collapse thread" onclick={toggle}></button>
        {#each comment.children as child, i (i)}
          <Comment comment={child} depth={depth + 1} {op} path="{path}-{i}" parent={path} />
        {/each}
      </div>
    {/if}
  {/if}
</article>

<style>
  .comment {
    --guide: hsl(calc(var(--depth) * 47 + 18) 72% 56%);
    margin-left: calc(var(--depth) * var(--indent-step));
    padding-top: var(--comment-gap);
    border-radius: var(--radius-sm);
    transition: background-color 0.6s;
  }

  .comment:global(.flash) {
    background: var(--accent-soft);
  }

  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    font-size: var(--text-sm);
    color: var(--text-3);
  }

  .toggle {
    display: inline-grid;
    place-items: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: 5px;
    background: var(--surface);
    color: var(--text-2);
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1;
  }

  .toggle:hover {
    border-color: var(--border-strong);
    color: var(--text);
  }

  .author {
    font-weight: 650;
    color: var(--text);
  }

  .author:hover {
    text-decoration: underline;
  }

  .author.deleted {
    font-weight: 500;
    color: var(--text-3);
  }

  .op {
    padding: 0 6px;
    border-radius: 4px;
    background: var(--op-bg);
    color: var(--op-fg);
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.03em;
  }

  .link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font-size: inherit;
  }

  .link:hover {
    color: var(--text);
    text-decoration: underline;
  }

  .hidden {
    padding: 0 8px;
    border-radius: 999px;
    background: var(--surface-2);
    font-size: var(--text-xs);
  }

  .body {
    margin: 4px 0 0 28px;
    font-size: var(--text-comment);
    color: var(--text);
  }

  .body :global(p:first-child) {
    margin-top: 0;
  }

  .children {
    position: relative;
    margin-left: 9px;
  }

  .children.flat {
    margin-left: 0;
    padding-left: 0;
  }

  .guide {
    position: absolute;
    top: 6px;
    bottom: 0;
    left: 0;
    width: 12px;
    margin-left: -5px;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
  }

  .guide::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 5px;
    width: 2px;
    border-radius: 2px;
    background: color-mix(in srgb, var(--guide) 45%, var(--border));
    transition: background-color 0.15s;
  }

  .guide:hover::before {
    background: var(--guide);
  }

  .flat > .guide {
    display: none;
  }

  @media (max-width: 720px) {
    .body {
      margin-left: 0;
    }

    .children {
      margin-left: 4px;
    }
  }
</style>
