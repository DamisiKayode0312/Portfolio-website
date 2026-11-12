# Placeholders, defaults and open questions

Everything below renders on the site as a visible placeholder (dashed, hatched block or disabled button) until the material exists. Nothing here was invented.

## Missing material

| Where | What is needed | How it shows now |
|---|---|---|
| About | Portrait (oval frame) | "Placeholder · Portrait" |
| About | Likes, dislikes, what brought you here (your words) | Placeholder block |
| Playground | Optional: year and a short note for each piece; confirm the reference photo in "Painting Study" is OK to show publicly | Titles in place; medium shown, no year |
| Closing | Confirm GitHub profile `github.com/DamisiKayode0312` | Live link |
| Résumé | Updated 12 Nov 2026 from her new PDF. It lists her phone number publicly: confirm before deploy | Live download |
| Work · Fairy Job Mother | Frame image; repo review to confirm the shipped AI features her résumé lists | Résumé claims marked Reported |
| Work · News Corp | Frame image; how the "20% increase in reader engagement" on her résumé was tested (not on the site until confirmed, since outcomes were treated as projections) | Placeholder frame |
| LOCIT | "Who it helps"; why it mattered; budget/timeline; research and usability testing; reasons behind decisions; prototype photos (in the milestone PDFs); test data behind the four metrics; your reflection | Placeholder blocks; metrics marked Reported |
| LOCIT | Camera / facial recognition: did it ship? | Not claimed |
| News Corp | Direct quote from your peer-reflection entry (needs the PDF) | Paraphrase, marked |
| AI Evaluation | Non-confidential description of method, dates, role title | Placeholder blocks |
| Raspberry Pi weather station | Architecture, photos, code link, dates (the earlier 95% integrity / 30-day claims were dropped: not on her résumé) | Résumé facts marked Reported |
| Project PDFs | `references/project-docs/` was not in the handoff zip | Facts taken from the brief's §9 summary of them |

## Defaults used (brief §12), easy to change

1. Brand "Victoria's Gallery", welcome voice "Dami", footer and page titles "Victoria Kayode".
2. Ticket: drag the stub (primary), tap the stub, or "Tear to enter" button. Shown once per session; "Skip the ticket" always there.
3. "Kinda 3D": ticket tilts toward the pointer on desktop, slow idle sway elsewhere.
4. Nav: inline four links (fits at 360px), no hamburger.
5. Welcome: no ":3"; one verified background line added.
6. Third gallery frame: News Corp Product Strategy. AI Evaluation and the Pi logger appear in the quick grid (`work.html`).
7. Ornate gold frames (not wavy).
8. Case study: Back, browser back and Escape return to the lit frame; "Next exhibit" card at the end.
9. Portrait: empty oval.
10. About copy uses verified wording, not "designer-turned-engineer".
11. Timeline: Education / Engineering / Product; passed nodes stay lit.
12. Playground: framed wall with a curtain reveal; no filters until 8+ pieces.
13. Doodles stay on the visitor's device (Save PNG, no upload, no visitor wall).
14. Contact: no form; mailto + copy once an email exists.
15. Desktop Work gallery: vertical stack (brief's Option B) instead of the horizontal pan.
16. Doodle swatch colors sampled from storyboard screen 07.
17. Stack: plain HTML/CSS/JS with no build step, kept from the existing repo.
18. Palette (Nov 11, from Victoria's reference): stone #CCC4BA, taupe #937D68, brick #6C2724, oxblood #471918, near-black #15100D. Taupe is used for lines only (too faint for text); small text uses a deeper taupe #5A4636. Red rooms: Victoria's burgundy damask tile with a stone crown molding and black-marble nameplates. Frames: Victoria's supplied gilt frames (portrait, landscape, oval) in `assets/frames/`, cropped to their edges, halo from background removal cleared, exported as WebP; pictures sit behind the transparent openings. Confirm these frame and damask images are licensed for a public site before deploying.

## Nov 2026 redesign (clean gallery + scroll-driven exhibition wall)

- Palette: #FAF9F6 page, #F0ECE4 surfaces, #651E28 exhibition wall and buttons, #42151C accents, #282522 text, #6D665F secondary text, #B49359 decorative gold (decoration only on light backgrounds; #D6BE8C for small gold text on burgundy). Type: Bodoni Moda headings, Inter for everything else.
- Hero ("Victoria Kayode / A curious mind. An evolving collection.") replaces the welcome screen and the scroll-to-open doors.
- The ticket is kept as the once-per-visit entrance (skip link kept). Confirm, or drop it so the hero is the first screen.
- Home page order: Hero → Gallery I projects wall (LOCIT, Fairy Job Mother, Weather Station; scroll-driven) → Experience (Handshake AI, News Corp cards linking to their case studies) → About → Gallery II Playground (static salon hang on damask with a title card) → Doodle → Contact. Nav: Home · Work · Experience · About · Playground (Home hidden under 380px wide).
- Frame shapes (data/exhibits.json `frame`, `small`): LOCIT landscape, Fairy Job Mother landscape, Weather Station portrait (small). Experience roles have no frames.
- Reduced motion: the wall becomes a vertical gallery with every exhibit lit; no pinning.
- The mockups mentioned in the redesign request were not attached; layout follows the written spec. Adjust once they are supplied.

## Earlier concepts kept for reference (not linked from the new site)

`entrance-v1.html` (first ticket), `museum.html` (scroll walk), `home.html` (station-line layout), `gallery.html` (walkable art hallway), `legacy/` (original portfolio).

## Case-study write-ups (Nov 2026)
Every case study now uses the `story` format in `data/exhibits.json` (Elaine Yu-style: intro, facts row, numbered sections with headlines), in first person. Sources are not shown on the page; the older `sections` data beside each story keeps the evidence level and source for every statement (PRD, milestone reports, résumé, case scan, reflection, creative brief). Still wanted: a short "what I'd do differently" from Victoria for each project, in her own words.

## From the LOCIT poster (Nov 2026)
- Used: hardware photo (GPS, USB, processor, power), GPS test route, findings (open sky vs tree cover, ~2 h battery), parts total ~$285.
- To confirm: the poster spells LOCIT as "Location Integrated Technology", the résumé as "Location Integrated Tracker" (the site uses the résumé).
- Not used: teammates' names (AZAD: four engineers), the Raspberry Pi camera photo.
- Weather Station enclosure render: assumed to be the CPE 4040 weather station enclosure; confirm.
- About (Nov 2026): rebuilt in Victoria's words (Bao To's layout). Experience, Education and Communities each have a small square mark; the marks are initials until she supplies logo files (Handshake AI, News Corp, LOCIT, Kennesaw State, NSBE, SWE, African Students Association). Community roles show "Member" until she confirms or gives a title. The separate Experience section and the "My journey" timeline were folded into About; #experience now points at the list.
