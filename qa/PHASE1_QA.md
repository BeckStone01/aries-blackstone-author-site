# PR #1 merge-blocker verification

Reviewed the QA comment on recovery commit `16ebb12`. This follow-up is limited to QA corrections and evidence. PR #1 must remain unmerged; issue #2 remains open for the final independent Phase 1 review.

## Fixes

- `netlify.toml`: JavaScript now uses `public, max-age=0, must-revalidate`, replacing one-year immutable caching. Unversioned `script.js` references can receive future updates while still allowing conditional responses.
- `_redirects`: restored `/quantum-series /quantum-series.html 200`; removed the new permanent redirects. A direct production HTTP check returned 200 and an HTML document with a zero-delay refresh and `location.replace('books.html')`. Both desktop and mobile browsers arrived at Books. The recovered HTML retains that behavior, including its fallback link.
- `script.js`: normalize clean and `.html` path names when determining the active navigation item. This fixes the recovered relative links failing to highlight on clean URLs such as `/books`.
- `desktop-fixes.css`: removed the new `content-visibility` optimization after full-page captures exposed blank offscreen sections. Image loading hints remain. Also fixed Coming Soon cover frames: definite grid height prevents portrait covers from being clipped on mobile and at the desktop frame edge.

## Pinned-storybook concern

Fetched the current production `script.js`, `styles.css`, and `children.html` directly from the site, not from an index or search snippet. Neither production JavaScript nor the children page contains pinned-storybook/pinned-book logic or a storybook stage. The production `styles.css` and recovered `styles.css` match after whitespace normalization. The old pinned content in the Git baseline was already absent from production.

The production/local JavaScript difference before this QA fix was conditional registration of reveal/parallax work when matching elements exist. The additional change in this follow-up is navigation-path normalization. Character selection, page scrolling, and video playback remain functional.

## Browser results

Ran every route in `site-source-manifest.json` against production and local source at 1440 x 900 and 390 x 844: 16 routes, 32 production/local comparisons, 64 page visits. Scrolled every page to trigger reveals and lazy images, waited for image completion, recorded console/network failures, and captured full-page screenshots. Reran all local pages after removing deferred rendering. The subsequent scoped Coming Soon correction was checked at 375, 390, 768, 900, and 1440 pixels; all 15 cover bounds checks passed with complete images and `object-fit: contain`.

| Check | Result |
| --- | --- |
| All 16 routes, desktop and mobile | Pass |
| Headings, normalized link destinations, image identities | Match on all 32 comparisons |
| Page text | Match except approved homepage author introduction |
| Local JavaScript/console errors | None |
| Local HTTP resource errors | None |
| Missing images | None |
| Horizontal overflow / unrevealed content after scrolling | None |
| Unique internal link destinations across all pages | 25 checked, all HTTP 200 |
| Desktop header signup / mobile Get Updates link | Reach visible signup section |
| Newsletter form | Email input renders on desktop/mobile; no subscription submitted |
| Header active state and footer Books click | Pass on desktop/mobile |
| Max/Zoey character selection | Both controls pass on desktop/mobile |
| Local video playback | Plays on desktop/mobile, no media error |
| Integrity checker | Pass; no weakened checks |

The production browser transport initially timed out, so the comparison uses actual HTTPS responses fetched through Node and rendered by Edge. No response bodies were mocked. A production mobile video download timed out in that transport; the report retains those two resource errors rather than calling production error-free. The local video request is sometimes canceled when a capture context closes (`ERR_ABORTED`); independent playback checks passed. These checks cover Chromium desktop and mobile-sized/touch-emulated rendering, not a physical iPhone or Safari. Third-party newsletter submission and retailer purchases were not performed.

## Differences retained from earlier authorized work

This branch is not a pixel-identical production snapshot. The pre-existing recovered `desktop-fixes.css` includes the user's requested compact spacing/headings, cover sizing, removal of decorative swirls, and homepage framing adjustments. The children page uses the same six-book catalog and purchase/update links as production, with decorative sky shapes hidden. This follow-up does not change the homepage hero framing.

The homepage introduction retains the explicitly approved author identification: "Aries Blackstone is an American author, U.S. Air Force veteran, former military photographer, and longtime business owner. He writes technology-driven fiction centered on bold ideas, strategic tension, and characters navigating systems larger than themselves." The following Quantum Series information remains intact. Existing branch canonical/schema metadata differences are unchanged by this follow-up; no further Phase 2 work was undertaken.

No current catalog, navigation, signup, character-selection, or video behavior was observed lost. The visual changes above are disclosed for final review rather than described as an exact production match.

## Evidence and reproduction

- [Machine-readable route, network, source-hash, interaction, and cover checks](phase1-regression.json)
- [Desktop candidate overview](1440-local-overview.png) and [production overview](1440-production-overview.png)
- [Mobile candidate overview](390-local-overview.png) and [production overview](390-production-overview.png)

Full-resolution individual screenshots are retained in the workspace `outputs/pr1-qa` directory. Overview tiles may be ordered differently because page checks run concurrently; each is labeled with its route.

`scripts/qa-browser-regression.cjs` reproduces the 16-route desktop/mobile comparison. Use an available Playwright installation (`PLAYWRIGHT_MODULE` can point to it), and optionally set `QA_BROWSER_PATH` to an installed Chromium browser. `QA_OUTPUT_DIR` selects the evidence directory. It starts a temporary server on port 3003, applies the checked-in redirect rules, and stops the server when complete. Network access to production is required. Run:

```text
node scripts/qa-browser-regression.cjs
node scripts/check-site-integrity.mjs
git diff --check
```

No production deployment or merge was performed. CI for the pushed follow-up is recorded in the PR and issue comments.
