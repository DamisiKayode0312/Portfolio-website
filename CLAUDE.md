# CLAUDE.md: The Museum of Victoria Kayode

You are continuing a portfolio build for Victoria Kayode (Computer Engineering, B.S., Kennesaw State, Cum Laude, Dec 2024). She is pursuing product management, associate PM, product analysis, AI product and adjacent roles. Her story is the overlap of product thinking, technology and creativity. She also paints, draws digitally and photographs.

## Concept (approved direction, pending her final sign-off on color and type)
A personal digital museum where every exhibit is a story about something she built, researched, designed or made.
- **Entrance (done as a mock):** `index.html`. An admission ticket. Pull the stub down at the perforation, or tap the button, to tear it and walk in.
- **Museum walk (mock, needs rework):** `museum.html`. Scroll-driven walk forward through rooms. Each exhibit has a label that opens a bottom sheet.
- **Rooms to build:** Product and Technology Gallery (5 exhibits), Design Studio (illustrated desk, clickable objects), Art Gallery (equal billing, not an "Experiments" corner), About the Curator, Visitor Desk (resume and contact).
- **Case studies:** each exhibit label expands, then opens a full case-study page in an editorial "field journal" format. Template questions: problem, why it mattered, her role, constraints, research, decisions and why, what was built or tested, results, what she would improve.
- **Quick path:** always offer "Quick tour" and a grid view so a recruiter can reach the work in under a minute.
- Optional later: a walking-character playground for the art (inspired by doodlejub-gallery.vercel.app).

## Hard rules
1. Do not fabricate research, interviews, shipped features, metrics or business impact. Use clearly marked placeholders where evidence is missing.
2. Separate implemented features, prototypes, planned capabilities and roadmap items. Fairy Job Mother is ongoing, so do not assume planned features exist. Review the repo (github.com/DamisiKayode0312/fairy-job-mother) before writing about it.
3. News Corp outcomes are recommendations and projections, not shipped results.
4. AI evaluation work (Handshake AI): never reveal confidential or proprietary evaluation data. Describe method only.
5. Never invent or generate artwork and present it as hers. Use only files she supplies.
6. Classmates' words: the peer reflection PDF contains other students' writing. Quote only Victoria's own entry. Use others only as unnamed themes, never with names or exact words.
7. Do not publish or deploy without her explicit approval. Do not push to `main` without asking.
8. Preserve working functionality when revising. Show a preview before major changes and build in small steps.
9. Accessibility: honor `prefers-reduced-motion`, keep keyboard access for every interaction (the ticket tear has a button), keep 44px touch targets, check contrast, and make every animation optional.
10. Phone first. It must work at 400px wide and never scroll sideways.

## Design system (placeholders until she chooses)
Tokens live at the top of each CSS file. Options she is choosing between:
- Color: 1) Gallery (warm white, charcoal, teal accent wall, brass), 2) Signal (black, white, signal green from her AZAD mark), 3) Candlelight (dark, teal, candle gold; Art Gallery only).
- Type: A) Cormorant Garamond + Figtree, B) Space Grotesk + IBM Plex Mono, C) Fraunces + Figtree.
Keep one button style, one label style, one spacing scale and one expand motion everywhere. Avoid generic cards, heavy gradients, glassmorphism and emojis.

## Evidence status
| Project | Have | Missing |
|---|---|---|
| Fairy Job Mother | GitHub link | repo review, screenshots, user flow, architecture sketch |
| LOCIT | Milestone 1 and 3 reports, FlutterFlow link, Fusion 360 and PLA prototype notes, AZAD team logo (her design) | source for 98% GPS accuracy, 100% alert accuracy, 20+ scenarios, ~20% performance gain; photos; confirm whether camera and facial recognition shipped |
| News Corp | mini case scan, TikTok/Spotify/NY Post/BBC comparison, reflection PDF (125 entries, hers is "From Oluwadamisi") | 500 survey responses, five personas, requirements and user stories |
| AI evaluation | none (by design) | non-confidential description of method |
| Raspberry Pi logger | none | architecture, AWS IoT setup, 500 readings/day, 95% integrity, 30-day result |
| Art | AZAD mark | paintings, illustrations, photography with title, year, medium |

## Tech
Currently plain HTML, CSS and JS with no build step. If a build step is needed, prefer Vite with React, Motion for interface animation, and GSAP only for the scroll walk. No Three.js unless it clearly earns its weight. Keep content in data files (projects, art) separate from components. Hosting plan: GitHub repo to Cloudflare Pages (static). Costs stay near zero.

## Suggested first tasks
1. Read the repo and run it locally (`python3 -m http.server`). Open `index.html` on a phone-width viewport.
2. Wire the ticket's "Walk into the museum" into the museum walk with a transition instead of a page jump.
3. Move exhibit content out of `js/main.js` into `data/projects.json` and `data/art.json`.
4. Build one reusable case-study page template and fill it for LOCIT using only what the reports support, with placeholders for the rest.
5. Stop and show her a preview before starting the Design Studio or Art Gallery.
