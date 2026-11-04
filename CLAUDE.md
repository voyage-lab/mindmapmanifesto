# MindMapManifesto

Static site served by GitHub Pages at mindmapmanifesto.com. No framework: every page is a plain HTML file.

## Layout
- `index.html`: the front page and the only hub. It lists everything, grouped under headings (projects, the mind, stories, the body, people x business), with jump links at the top, the "Under the Glass" player and a contact link. Add every new page here.
- `mind-brain/index.html`: just a redirect to the front page, kept so old links still work. Every page's "← back to the map" link goes to the front page.
- `mind-brain/15-brain-waves/`, `mind-brain/21-rules-mind/`: slide decks. Both run on `mind-brain/deck.js`, and `mind-brain/theme.css` gives them the site look.
- The other `mind-brain/*` topics are small React apps styled by `mind-brain/theme-app.css`.
- `turkish/index.html`: the Turkish training ground, one self-contained page (data, script and styles inline) with hash routes like `#u4`. Progress is saved in the visitor's browser.
- `notes/`: source notes and transcripts. They stay in the repo but are not published (see `_config.yml`).
- `case-workbook/`: the case workbook (mindmapmanifesto.com/case-workbook). `index.html` is the page (plain HTML and vanilla JS, no build step) and `data.js` holds the method text and the 38 cases. Edit them directly. The cases are anonymised on purpose: never add client names, places, exact ages or addresses.

## React pages: edit the .jsx, then build
Each React page's code lives in a `.jsx` file next to its HTML, e.g. `mind-brain/dopamine/index.jsx`.
The page loads the compiled `.js` file, so after editing a `.jsx` run:

    npm install   # once
    npm run build

and commit both files. Never edit the built `.js` by hand. CI runs `npm run check` and fails if a `.js` is out of date.
