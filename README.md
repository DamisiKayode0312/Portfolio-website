# Portfolio: The Museum of Victoria Kayode

A scroll-driven museum portfolio. Plain HTML, CSS, and JavaScript, so there is no build step and nothing to install.

## Structure
- `index.html` : entrance (museum ticket)
- `museum.html` : scroll-driven museum walk (mock)
- `case-study.html?p=<id>` : field-journal case study, filled from `data/projects.json`
- `data/projects.json`, `data/art.json` : all exhibit content (edit these, not the JS)
- `legacy/` : the previous portfolio site, kept for reference
- `CLAUDE.md` : build brief for Claude Code
- `css/style.css` : all styling (colors are set near the top of the file; the palette will change)
- `js/main.js` : renders the walk from the data files (scrolling, label sheet, lanyard)
- `js/passage.js`, `css/passage.css` : door transition from the ticket into the museum
- `js/case-study.js`, `css/case-study.css` : case-study template
- `assets/art/` : your art images
- `assets/projects/` : product images and videos

## Run locally
Run `python3 -m http.server` in this folder and visit http://localhost:8000. (Opening the file directly no longer works, because exhibits load from `data/`.)

## Put it on GitHub
1. Create a new empty repo on github.com (for example `portfolio`).
2. In this folder run:
   git init
   git add .
   git commit -m "First version"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
   git push -u origin main

## Deploy on Cloudflare Pages
1. In the Cloudflare dashboard go to Workers & Pages, then Create, then Pages, then Connect to Git.
2. Pick the repo. Framework preset: None. Build command: leave empty. Output directory: `/`.
3. Save and deploy. Every push to `main` updates the live site.
4. Optional: add a custom domain under the project's Custom domains tab.
