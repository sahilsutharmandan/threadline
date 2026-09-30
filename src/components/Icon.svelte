<script>
  let { name, size = 18, stroke = 1.8 } = $props()

  const paths = {
    flame: 'M12 3c.5 3-1.5 4.5-3 6.5S7 13 7 15a5 5 0 0 0 10 0c0-2.5-1.5-4-2.5-5.5C14 11 13 11.5 12 11c1-2.5 1-5.5 0-8Z',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2',
    help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.6-11.5a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2.2-2.6 3.8M12 17h.01',
    eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-4-4',
    bookmark: 'M6.5 3.5h11v17l-5.5-4-5.5 4v-17Z',
    'bookmark-fill': 'M6.5 3.5h11v17l-5.5-4-5.5 4v-17Z',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3c0-.5 0-1-.1-1.4l2-1.6-2-3.4-2.4.9a7 7 0 0 0-2.4-1.4L14 2.5h-4l-.5 2.6a7 7 0 0 0-2.4 1.4l-2.4-.9-2 3.4 2 1.6a7 7 0 0 0 0 2.8l-2 1.6 2 3.4 2.4-.9a7 7 0 0 0 2.4 1.4l.5 2.6h4l.5-2.6a7 7 0 0 0 2.4-1.4l2.4.9 2-3.4-2-1.6c.1-.4.1-.9.1-1.4Z',
    sun: 'M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z',
    monitor: 'M3.5 4.5h17v11h-17v-11ZM8 20h8m-4-4.5V20',
    arrowUp: 'M12 19V5m-6 6 6-6 6 6',
    comment: 'M4 5.5h16v10H9l-5 4v-14Z',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7.5 8.5a7.5 7.5 0 0 1 15 0',
    external: 'M14 4h6v6m0-6-9 9M18 14v5.5H4.5V6H10',
    x: 'M6 6l12 12M18 6 6 18',
    chevron: 'm9 6 6 6-6 6',
    minus: 'M6 12h12',
    plus: 'M12 6v12M6 12h12',
    trash: 'M4.5 6.5h15M9.5 6.5V4h5v2.5m-8 0 1 13.5h9l1-13.5',
    keyboard: 'M3 6.5h18v11H3v-11Zm4 3h.01M11 9.5h.01M15 9.5h.01M7 13.5h10',
    home: 'M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4v-9.5Z',
    collapse: 'M8 4l4 4 4-4M8 20l4-4 4 4',
    expand: 'M8 8l4-4 4 4M8 16l4 4 4-4',
    refresh: 'M20 11a8 8 0 0 0-14.6-4.5L4 8m0-4v4h4m-4 5a8 8 0 0 0 14.6 4.5L20 16m0 4v-4h-4',
  }
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill={name === 'bookmark-fill' ? 'currentColor' : 'none'}
  stroke="currentColor"
  stroke-width={stroke}
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d={paths[name]} />
</svg>
