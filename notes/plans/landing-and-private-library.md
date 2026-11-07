# Plan: VOYAGE landing page and private library

## Goal
mindmapmanifesto.com becomes the link in bio for Instagram, YouTube and TikTok. A visitor who has just
watched a reel lands on a page that uses the same words, explains why affirmations didn't work, explains
VOYAGE and the one-on-one session, and books. Everything that isn't for customers leaves the public site
and moves into an encrypted library that only the owner can open.

## Decisions
- Landing page is plain HTML with one action (book). Its copy comes from the five reel scripts and the
  owner's VOYAGE statement, not from new claims — message match with the reels is the point.
- No name, price, session length, location or testimonials on the page for now — the owner chose to leave
  them out, and nothing may be invented. The only background shown is what the owner stated in their own
  words: they studied RTT, drew on the teachers they named, and built VOYAGE.
- Booking is a request form on the landing page (`#book`) using the existing EmailJS account, so it works
  with no new accounts. `/contact-me/` redirects there.
- Public pages: landing, booking, 404, the brain waves deck, the rules of the mind deck. Everything else
  is private.
- Private pages move to `private/`, keeping their folder layout, so their relative links keep working.
  The old front page becomes `private/index.html`, the library hub.
- Library = client-side encryption, because GitHub Pages has no logins. `npm run lock` encrypts every file
  in `private/` to `under-the-glass/vault/`. A service worker decrypts on the fly under
  `/under-the-glass/open/`, so private pages run unchanged, with no edits to their 14 React apps or decks.
- Key handling: PBKDF2-SHA256 (600k iterations) into AES-256-GCM. File names in the vault are HMACs, so
  the page list isn't public either. The key lives in `.library-key` (gitignored), never in the repo. A
  bookmark `/under-the-glass/#key=…` opens it in one tap; the part after `#` is never sent to a server.
- Same file + same key = same ciphertext, so re-locking only changes what changed in git.
- A page the vault doesn't hold redirects to the same path on the public site, so private pages that
  link to the public decks keep working.
- `Under_the_Glass.mp3` stays public at the root: nothing sensitive in it, and Safari audio needs range
  requests that the service worker doesn't implement. The player moves to the hub.

## Tasks
### Milestone 1: Move private pages out
- [x] [opus] Move private pages and the old front page to `private/`; add `private/` and `.library-key` to `.gitignore` and `_config.yml` — done when: `git status` shows them deleted and nothing under `private/` staged or trackable
- [x] [sonnet] Point `contact-me` and `mind-brain/index.html` at the new landing page — done when: both redirect to the front page

### Milestone 2: Encrypted library
- [x] [opus] `scripts/lock-library.mjs` and `npm run lock` — done when: every vault file is unreadable, names reveal nothing, a re-run with no changes changes nothing
- [x] [opus] `under-the-glass/` unlock page and service worker — done when: right key opens the hub, wrong key doesn't, lock wipes access, `#key=` link works and leaves the address bar
- [x] [sonnet] Library hub — done when: every card opens, including React apps, decks and hash routes

### Milestone 3: Landing page
- [x] [sonnet] New `index.html` — done when: reads and works at 375px and desktop, no horizontal scroll, form sends the right fields
- [x] [sonnet] Custom `404.html` for old links — done when: an unknown URL shows it with a link to the front page
- [x] [sonnet] Public decks point at booking: last-slide CTA and back link — done when: no "Follow for more" is left in the two decks

### Milestone 4: Check and close
- [x] [opus] Build what GitHub Pages would publish and scan it — done when: no plaintext from `private/` is in it and all links resolve
- [x] [opus] `opus-reviewer` review, fix what it reports — done when: verdict is ready
- [x] [sonnet] Update `CLAUDE.md` layout notes — done when: it describes `private/` and `npm run lock`
- [x] [sonnet] Lock with the real key — done when: vault round-trips with `.library-key`, key not printed
- [x] [opus] Add one owner page to the library, wording unchanged — done when: it opens from the hub on phone and desktop

- [ ] [opus] Owner saves the key off this machine: `npm run lock -- --show`, then a password manager — done when: owner confirms, before the first push
- [ ] [sonnet] One real test through the booking form, after publishing — done when: it arrives in the inbox

### Milestone 5: After the owner gets GitHub Pro
- [ ] [opus] Make the repo private and confirm Pages still serves the site — done when: repo is private, site is up
- [ ] [opus] Then, and only then, remove `private/` from `.gitignore` and commit it — done when: plaintext is backed up in the private repo, still excluded by `_config.yml`

## Open questions
- `private/` has no off-machine backup of new edits until Milestone 5.
- CI has no `.jsx` to check until `private/` is tracked in Milestone 5, so run `npm run check` locally.
- `Book` is a request, not a confirmed slot. A calendar link can replace it later.
- Lock EmailJS to mindmapmanifesto.com under Account → Security, and turn off its message history if it's on.
- The landing page's error fallback uses the owner's personal address. A role address on the domain would be better.
- Owner to supply later: name, price, session length, online or in person, training wording, social handles.
- `private/reel-scripts/` still holds the older scripts without VOYAGE.
- Opening the `#key=` bookmark can leave it in browser history and sync. Treat the bookmark like a password.
- Safari, iPhone and in-app browsers are untested: check on a real phone after publishing.
