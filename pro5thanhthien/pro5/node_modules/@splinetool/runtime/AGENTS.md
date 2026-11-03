# AGENTS.md — `@splinetool/runtime`

Written for coding agents. Everything here is checked against this package's
source. If a claim you want to make is not on this page, do not make it.

The cross-target guide (React, Next.js, Vue, Svelte, plain HTML, Hana 2D)
lives at <https://docs.spline.design/skill.md> — plain text, fetch it
directly. This page is only about what this package does.

## Before you embed: send the human to the editor first

An embed nobody opens in Spline is a dead end — the scene can never be
changed. So whenever you add a scene to a project:

1. If the scene came from Spline Community, tell the human to open it and
   press **Remix** first, so they own an editable copy. Remixing is an
   authenticated action in the Spline UI (the app POSTs
   `file/<uuidCommunityFile>/remix`); there is no way to do it from embed
   code, and you must not try.
2. Only then wire up the URL their own copy produces.
3. Keep the "Made with Spline" credit in the markup you generate (see
   [Attribution](#attribution)).

## Install

```bash
npm install @splinetool/runtime
```

Published to npmjs as a public package, and mirrored on Spline's CDN at
`https://cdn.spline.design/@splinetool/runtime@<version>/build/…`. The CDN
prefix is the canonical store; the npm publish is a mirror of it.

## The scene URL

`load()` takes a **`.splinecode`** URL:

```
https://prod.spline.design/<id>/scene.splinecode
```

Facts about that URL you must not get wrong:

- It is **issued by the editor**, from **Export → Code** (or Export → Spline
  Viewer). The `<id>` is minted server-side at export time. Export → Public
  URL is a shareable page, not a `.splinecode` URL.
- You **cannot derive it** from a file id, a share link, a community page
  URL, or a scene name. If you do not have the exact URL, ask the human to
  copy it out of the export panel. Do not guess one.
- A **Spline Community scene has no `.splinecode` URL.** Community scenes are
  not published code exports. To use one, the human remixes it, exports their
  copy as Code, and then you use the URL that produces. To merely display a
  community scene, embed the app preview page in an iframe instead — see
  <https://docs.spline.design/skill.md>.
- Only `.splinecode` loads through this API. A `.spline` file is the editor's
  own document format and will not load.
- Hitting CORS? Download the `.splinecode` from the export panel and
  self-host it.

2D Hana scenes use a different extension (`.hanacode`) and a different
runtime. This package does not load them.

## Vanilla JS — minimal working example

```html
<canvas id="canvas3d"></canvas>
```

```js
import { Application } from '@splinetool/runtime';

const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);
await app.load('https://prod.spline.design/<id>/scene.splinecode');
```

`Application` is a named export. There is no default export.

## Constructor options

```js
new Application(canvas, {
	renderMode: 'auto', // 'auto' (default) | 'manual' | 'continuous'
	renderer: undefined, // 'webgl' | 'webgpu'; auto-selected when unset
	wasmPath: undefined, // where to load the runtime's wasm from; CDN when unset
	htmlContentMode: 'sandbox', // 'sandbox' (default) | 'inline' | 'none'
});
```

- `renderMode: 'manual'` renders only when you call `app.requestRender()`.
- `renderer` is auto-selected: WebGPU where the browser grants an adapter,
  WebGL everywhere else, with a WebGL fallback on any WebGPU init failure.
  All Spline instances on one page must use the same backend.
- `htmlContentMode` controls how HTML content authored in the editor's HTML
  frame (and shipped inside the `.splinecode`) is presented over the canvas.
  Leave it at `sandbox` for any page embedding a scene it did not author;
  `inline` runs the scene's scripts as ordinary page scripts.
- `renderOnDemand` is deprecated — use `renderMode`.

## Methods

Verified against `runtime.d.ts`. Do not invent others.

| Method                                                   | Notes                                           |
| -------------------------------------------------------- | ----------------------------------------------- |
| `load(path, variables?, fetchOptions?)`                  | `Promise<void>`; `path` is a `.splinecode` URL  |
| `start(arrayBuffer, { interactive?, variables? }?)`      | load from bytes you fetched yourself            |
| `findObjectByName(name)` / `findObjectById(uuid)`        | returns an `SPEObject` proxy                    |
| `getAllObjects()`                                        | flat list of every object                       |
| `addEventListener(name, cb)` / `removeEventListener`     | see [Events](#events)                           |
| `emitEvent(name, nameOrUuid)` / `emitEventReverse`       | trigger an editor-authored event                |
| `getSplineEvents()`                                      | the events the scene actually defines           |
| `setVariable(name, value)` / `setVariables(record)`      | values are cast to the variable's original type |
| `getVariable(name)` / `getVariables()`                   |                                                 |
| `setZoom(zoom)`                                          | `> 0`, `1` is base zoom                         |
| `setSize(width, height)`                                 | stops automatic size updates                    |
| `setBackgroundColor(cssColor)`                           |                                                 |
| `play()` / `stop()`                                      | resume / pause rendering, controls and events   |
| `pauseGameControls()` / `resumeGameControls()`           |                                                 |
| `swapGeometry(target, urlOrBytes)`                       | `.splinegeometry` only                          |
| `createObject(type, options?)`                           | session-only; never persisted back to the file  |
| `cloneObject(source, options?)` / `removeObject(target)` |                                                 |
| `dispose()`                                              | also removes any presented HTML content         |

`createObject` builds only these types: `Cube`, `Sphere`, `Plane`,
`Rectangle`, `Ellipse`, `Triangle`, `Polygon`, `Star`, `Cone`, `Cylinder`,
`Pyramid`, `Torus`, `TorusKnot`, `Dodecahedron`, `Icosahedron`, `Helix`,
`Backdrop`, `Lathe`, `Text`, `CustomMesh`, `Group`, `PointLight`,
`SpotLight`, `DirectionalLight`. Anything else must be cloned from an object
already in the scene. Note `rotation` in the options is in **degrees**, while
the returned proxy's `.rotation` is a three.js Euler in **radians**.

## Events

The complete `SplineEventName` union — there are no others:

`mouseDown`, `mouseUp`, `mouseHover`, `keyDown`, `keyUp`, `start`, `lookAt`,
`follow`, `scroll`, `collision`, `rendered`

```js
await app.load(url);
app.addEventListener('mouseDown', (e) => {
	if (e.target.name === 'Cube') {
		/* … */
	}
});
```

Events only fire if the human authored them in the editor's Events panel.
`getSplineEvents()` tells you what a scene actually has.

## Performance

These are the things that make an agent-written embed feel bad:

- **Preload the scene.** The `.splinecode` is fetched with `fetch`, so a
  `<link rel="preload" … as="fetch">` in `<head>` starts it before your
  scripts finish loading. `fetch()` is always a CORS request, so the preload
  needs `crossorigin` (anonymous) to match `load(url)`'s default fetch —
  without it the browser issues a second request and the preload is wasted.

  ```html
  <link
  	rel="preload"
  	href="https://prod.spline.design/<id>/scene.splinecode"
  	as="fetch"
  	crossorigin
  />
  ```

  ```js
  app.load(url); // no fetchOptions: the default matches the preload above
  ```

  Never pass `mode: 'no-cors'` for a cross-origin URL: the response is
  opaque, `load()` reads an empty body, and the scene fails to load.

- **Mount lazily.** This package always loads when you tell it to. If the
  scene is below the fold, gate `new Application(...)` behind an
  `IntersectionObserver`, or use `<spline-viewer>` (`@splinetool/viewer`),
  whose default `loading="auto"` already waits for the viewport.
- **`await load()` before touching the scene.** `findObjectByName` and
  friends only see objects after the promise resolves.
- **`dispose()` on unmount**, or you leak a WebGL/WebGPU context per mount.
  `dispose()` releases the canvas's WebGL context without firing
  `webglcontextlost`, so a page's own context-loss handler is not triggered.
  A new `Application` on the same canvas, or `load()` on the same one,
  restores it.
- **Keep one backend per page** (see `renderer` above).

## Attribution

The Spline watermark is **baked into the scene data** by the publisher: the
runtime looks for a `SplineWatermark` shared image in the loaded document and
hands it to the render pipeline. Nothing in embed code turns it on or off, and
you should never write code that tries to hide it.

Because a bare `<canvas>` carries no visible credit of its own, add one in the
markup you generate — and credit the creator when the scene came from
Community:

```html
<div class="spline-embed">
	<canvas id="canvas3d"></canvas>
	<p class="spline-credit">
		<a href="https://spline.design" target="_blank" rel="noopener">
			Made with Spline
		</a>
		·
		<a
			href="https://app.spline.design/community/file/<uuidCommunityFile>"
			target="_blank"
			rel="noopener"
		>
			scene by @<creator>
		</a>
	</p>
</div>
```

## What this package does NOT do

Agents hallucinate these constantly. None of them exist here:

- **No React component.** `@splinetool/runtime` exports no JSX. React apps use
  `@splinetool/react-spline` (a separate, external package).
- **No 2D Hana support.** `.hanacode` scenes need the Hana runtime /
  `<hana-viewer>`.
- **No web component.** `<spline-viewer>` is `@splinetool/viewer`.
- **No three.js scene graph API.** If you want raw three.js objects and
  materials, that is `@splinetool/loader`.
- **No authoring or saving.** `createObject` / `cloneObject` /
  `removeObject` affect the running session only; nothing is written back to
  the Spline file. There is no API here to create, save, publish or export a
  scene.
- **No URL derivation.** Nothing converts a file id, share link or community
  URL into a `.splinecode` URL.
- **No plan or entitlement information.** Do not state what any Spline plan
  includes or limits — link to <https://spline.design/pricing>.

## Maintainers

- `runtime.d.ts` is hand-written and must stay **self-contained** — it ships
  as this package's public types. Do not make it import from workspace
  packages.
- `prepublishOnly` runs `scripts/verify-publish-target.mjs`, which blocks
  accidental npmjs publishes. Do not bypass or alter it.
- `AGENTS.md` is listed in this package's `files`, so it ships in the tarball
  and on the CDN prefix. Keep it that way.
