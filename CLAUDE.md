# MindMapManifesto

Static site served by GitHub Pages at mindmapmanifesto.com. No framework: every page is a plain HTML file.

The site is the link in bio for a one-on-one hypnosis practice built on the VOYAGE method. Only pages for customers are public. Everything else lives in an encrypted private library. When a new page isn't clearly for customers, it goes in the library.

## Public site
- `index.html`: the landing page for visitors from Instagram, YouTube and TikTok. Its copy comes from the reel scripts, so a visitor reads the same words they just heard. One action: book. Don't add a list of pages here. Never invent a price, testimonial, credential or result.
- Booking is the form at `index.html#book`, sent through EmailJS to the owner's inbox.
- `404.html`: catches every old URL for a page that moved to the library. It uses root-absolute paths because it can be served from any path.
- `contact-me/index.html`, `mind-brain/index.html`: redirects to the front page, kept so old links still work.
- `mind-brain/15-brain-waves/`, `mind-brain/21-rules-mind/`: slide decks, the only public reading. Both run on `mind-brain/deck.js`, and `mind-brain/theme.css` gives them the site look.
- `notes/`: source notes and transcripts. They stay in the repo but are not published (see `_config.yml`). The repo can be read by anyone, so anything drawn from clients goes in `private/notes/` instead, which the lock script skips.

## Private library
- `private/`: the readable source of every private page, in the same folder layout it had on the public site, so relative links keep working. `private/index.html` is the hub and lists everything, grouped under headings. Add every new private page there.
- `private/` is gitignored and must never be committed while the GitHub repository is public. The plan is in `notes/plans/landing-and-private-library.md`.
- `private/mind-brain/*` topics are small React apps styled by `private/mind-brain/theme-app.css`.
- `private/turkish/index.html`: the Turkish training ground, one self-contained page (data, script and styles inline) with hash routes like `#u4`. Progress is saved in the visitor's browser.
- `private/case-workbook/`: `index.html` is the page (plain HTML and vanilla JS, no build step) and `data.js` holds the method text and the 38 cases. Edit them directly. The cases are anonymised on purpose: never add client names, places, exact ages or addresses.
- `under-the-glass/`: the published side of the library at mindmapmanifesto.com/under-the-glass. It's linked from nowhere on the public site. `index.html` is the unlock page, `sw.js` decrypts pages on the fly under `open/`, `vault/` holds the encrypted files, and `vault-crypto.js` is shared by the page and the service worker.

After changing anything in `private/`, run:

    npm run lock

and commit `under-the-glass/vault/`. The key is in `.library-key`, which is gitignored: never print it, commit it or put it in a plan file. `npm run lock -- --show` shows the key and the one-tap bookmark link, for the owner to run themselves. `scripts/lock-library.mjs` and `under-the-glass/vault-crypto.js` must stay in step.

Inside the library, `/under-the-glass/open/<path>` serves `private/<path>`. Anything the vault doesn't hold redirects to `/<path>` on the public site, which is how library pages reach the public decks and `Under_the_Glass.mp3`.

## React pages: edit the .jsx, then build
Each React page's code lives in a `.jsx` file next to its HTML, e.g. `private/mind-brain/dopamine/index.jsx`.
The page loads the compiled `.js` file, so after editing a `.jsx` run:

    npm install   # once
    npm run build
    npm run lock

Never edit the built `.js` by hand. CI runs `npm run check` and fails if a tracked `.js` is out of date.
