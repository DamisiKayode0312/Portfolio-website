# Victoria's Gallery

The portfolio of Victoria Kayode, presented as a museum exhibition. Plain HTML, CSS and JavaScript: no build step and nothing to install.

## Run locally
In this folder run `python3 -m http.server` and open http://localhost:8000. (Opening the files directly will not work, because content loads from `data/`.)

## Structure
- `index.html`: ticket, hero, the exhibition wall (Gallery I: projects), Experience (jobs, from `kind: "experience"` in exhibits.json), about and journey, the Playground salon wall (Gallery II: art), doodle, contact
- `js/exhibition.js`: the scroll-driven projects wall: vertical scroll moves the wall sideways, with exhibit lighting
- `case-study.html?p=<slug>`: screen 04, one page per project
- `work.html`: quick grid of every project for recruiters
- `data/exhibits.json`: projects, with an evidence level on every statement (verified, reported, planned, awaiting)
- `data/art.json`: artwork (only Victoria's own files)
- `data/site.json`: résumé, contact links, journey timeline
- `css/tokens.css`: colors, type, spacing and motion; change the palette here
- `css/site.css`, `css/case-study.css`, `js/site.js`, `js/case-study.js`
- `PLACEHOLDERS.md`: everything still missing, plus the defaults chosen
- Earlier concepts, kept for reference: `entrance-v1.html`, `museum.html`, `home.html`, `gallery.html`, `legacy/`

## Add content
- **Artwork:** put the file in `assets/art/`, then in `data/art.json` set `image`, `title`, `year`, `medium`, `alt`, `story`, `frame` (`portrait`, `landscape` or `oval`), `wall` (salon position: `col` 2–5 and `size` s, m, l or xl) and `"placeholder": false`. The order in the file is the lightbox order, so keep it left to right as hung. The picture is cropped to fill the frame's opening.
- **A project fact:** add it to the right section in `data/exhibits.json` with `ev` and `src`. Only use `verified` when a document supports it.

## Deploy (only with Victoria's approval)
Cloudflare Pages: connect the GitHub repo, framework preset None, build command empty, output directory `/`.
