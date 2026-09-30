<script>
  let { name = '', size = 56 } = $props()

  const hue = $derived([...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7))
</script>

<span
  class="avatar"
  style:width="{size}px"
  style:height="{size}px"
  style:font-size="{size * 0.42}px"
  style:--hue={hue}
  aria-hidden="true"
>
  {name.slice(0, 1).toUpperCase()}
</span>

<style>
  .avatar {
    display: grid;
    place-items: center;
    flex: none;
    border-radius: 50%;
    background: linear-gradient(135deg, hsl(var(--hue) 70% 58%), hsl(calc(var(--hue) + 40) 70% 48%));
    color: #fff;
    font-weight: 750;
  }
</style>
