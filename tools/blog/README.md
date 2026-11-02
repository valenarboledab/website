# Studio Valentina — Journal / Blog

One article per month, published in English (`/blog/<slug_en>/`) and Spanish (`/es/blog/<slug_es>/`).
Articles are ghost-written in Valentina Arboleda's voice and published under her name.

## How to publish an article

1. Pick the next unused topic from `tools/blog/TOPICS.md` (mark it as done there with the date).
2. Write `content/blog/YYYY-MM-<slug_en>.json` (format below). Look at the existing files for reference.
3. Run `python3 tools/blog/build.py` from the repo root. It writes both pages, the two blog hubs and rebuilds `sitemap.xml`.
4. Open the generated pages and check them (no 404s, images load, Spanish reads naturally).
5. Commit and push to `main`. GitHub Pages publishes in 1–3 minutes.

## Article JSON format

```json
{
  "slug_en": "kebab-case-english-slug-with-keyword",
  "slug_es": "slug-en-espanol-con-palabra-clave",
  "date": "2026-11-01",
  "hero": "/path/to/an/existing/render.webp",
  "en": {
    "title": "SEO title, max ~65 characters, keyword first | Studio Valentina",
    "desc": "Meta description, 140–160 characters, keyword + benefit.",
    "eyebrow": "Short category label",
    "h1": "Headline",
    "hero_alt": "What the hero image shows",
    "lead": "One or two sentence intro.",
    "sections": [
      {"h": "Section heading", "blocks": ["Paragraph.", {"list": ["item", "item"]}, {"quote": "Pull quote."}]}
    ],
    "tags": ["keyword", "keyword"]
  },
  "es": { "...same keys, written natively in Spanish (not a literal translation)..." }
}
```

The hero must be an image that already exists in the repo — one of Valentina's own renders
(for example under `RESIDENTIAL/`, `COMMERCIAL/` or `images/home/`). Never use stock photos.

## Voice (read before writing)

- First person, as Valentina: an architectural designer from Colombia based in Peachtree City, Georgia.
  Warm, clear, confident and practical. Her motto: design with **emotion, strategy and clarity**.
- She combines aesthetics + function + a viable business. She loves nature and wellbeing (biophilic design,
  neuroarchitecture), technology (BIM, Revit, AI, renders) and teaching while she works.
- Short paragraphs, plain words, no jargon without explaining it. Concrete advice the reader can use.
- 700–1,000 words per language. 4–6 sections with descriptive H2s. One pull quote. End with a gentle invitation,
  never a hard sell.
- English for U.S. homeowners/investors (Georgia/Atlanta context when relevant).
  Spanish: neutral Latin American, "tú", written natively — not a word-for-word translation.

## Hard rules

- Never invent facts: no made-up statistics, studies, prices, code requirements, clients, testimonials or project details.
  If a number or rule matters, either research it and only state what a reliable source says, or speak qualitatively
  ("costs vary widely; get quotes from local builders").
- Portfolio projects may be mentioned only with what is already published on the site's case-study pages.
  Never say or imply that the winning projects were university/academic projects.
- Her title in U.S. contexts: "Architectural Designer · Licensed Architect (Colombia) · NCARB Candidate".
  Never call her a licensed architect in the U.S. or "architect in Atlanta/Georgia".
- Do not mention Lake Oconee or Eatonton (removed from the portfolio on purpose); Arboretum is "a residential project in Georgia".
- No legal, tax, financial or medical advice. For codes/permits, tell readers to confirm with their county.
- Don't repeat a topic already published (check `content/blog/`).
