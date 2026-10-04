# Comment-thread repair evidence

Captured October 4, 2026 in Chromium with a light theme. Mobile captures use a 390 × 844 viewport; desktop captures use 1280 × 900. These are responsive browser checks, not physical-phone captures.

The original and fixed app were captured against the same saved API responses from the exact discussions shown in the supplied screenshots. Discussions have gained comments since those screenshots, so totals, newest authors, and relative times differ from the supplied images. No production data or API behavior was changed.

| Issue | Before | After | Result |
| --- | --- | --- | --- |
| Deep mobile replies | [Before](before/1-deep-replies.png) | [After](after/1-deep-replies.png) | Indentation stops after three levels on mobile and seven on desktop; nested structure, collapse buttons, and parent navigation remain. |
| Collapse then sort newest | [Before](before/2-collapse-after-sort.png) | [After](after/2-collapse-after-sort.png) | The newly first comment by knifelemon remains expanded instead of inheriting the collapsed state. |
| Mobile code block | [Before](before/3-code-block.png) | [After](after/3-code-block.png) | The code block stays within the comment and scrolls horizontally; the long link wraps. |

[The originally collapsed babelfish thread remains collapsed after sorting](after/2-original-thread-still-collapsed.png). This additional capture shows the same thread at its new position.

## Reproduction

1. Open `/#/item/49913571` (Gemini 4 Argon). The deep-chain capture targets comment `49921174` by giancarlostoro.
2. In default order, collapse the first root thread (`49913608`, babelfish), then choose Newest first. Confirm that this ID remains collapsed and the newly first thread remains expanded.
3. Open `/#/item/49890732` (Why the Bronze Age Collapsed). The code capture targets comment `49917769` by rawgabbit. Scroll horizontally inside its code block.

## Verification

- Root and nested collapse state follows comment IDs through Newest first, Oldest first, and Default order.
- Nested collapse state survives collapsing and reopening its ancestor.
- Collapse all, sort, and Expand all operate on the expected threads.
- Parent buttons jump to the parent comment after sorting.
- Reload/direct navigation renders the discussion correctly; collapse state resets as before.
- Both discussions have page scroll width equal to viewport width at 320, 390, 720, 768, and 1280 pixels.
- Minimum comment-body width on both discussions: 240 pixels at a 320-pixel viewport; 310 pixels at 390.
- The target code block has 308 pixels of inner width and 2526 pixels of content; local horizontal scrolling was verified at a 150-pixel offset.
- No browser runtime errors during verification.
- `npm run build` and `git diff --check` passed.
