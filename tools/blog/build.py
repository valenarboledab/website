#!/usr/bin/env python3
"""Studio Valentina blog generator.

Reads every article in content/blog/*.json and writes:
  /blog/<slug_en>/index.html        English article
  /es/blog/<slug_es>/index.html     Spanish article
  /blog/index.html, /es/blog/index.html   blog hubs (newest first)
  /sitemap.xml                      rebuilt from every page on the site (hreflang pairs read from each page)

Run from the repository root:  python3 tools/blog/build.py
Article format: see tools/blog/README.md
"""
import glob, html, json, os, re, sys, urllib.parse, datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SITE = 'https://studio-valentina.com'
CSS = open(os.path.join(os.path.dirname(__file__), 'site.css.txt')).read()
CSS += """
article ul{margin:4px 0 18px 20px}article li{margin-bottom:8px}
.meta{font-size:13px;color:var(--mid);margin-top:14px}
.post-hero figure{aspect-ratio:16/7}
"""
e = html.escape
MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

UI = {
 'en': {'home': '/', 'blog': '/blog/', 'contact': '/#contact', 'projects': '/projects/', 'blog_name': 'Journal',
        'cta_t': 'Planning a home or an interior?', 'cta_p': 'Studio Valentina works with clients in Georgia, across the U.S. and in Latin America — in English and Spanish.',
        'cta_b': "Let's talk on WhatsApp", 'switch': 'Español', 'more': 'Keep reading', 'by': 'By Valentina Arboleda',
        'foot': 'Architectural & interior design · Peachtree City, GA · Atlanta · Latin America',
        'wa': "Hi Valentina! I read your article \"{t}\" and I'd like to talk about a project.",
        'hub_title': 'Journal — Architecture, Interior Design & Wellbeing | Studio Valentina',
        'hub_desc': 'Ideas on architecture, interior design, neuroarchitecture, BIM and building smarter homes, by architectural designer Valentina Arboleda.',
        'hub_eyebrow': 'Journal', 'hub_h1': 'Ideas for spaces that feel right.',
        'hub_lead': 'Architecture, interior design, wellbeing and technology — what I learn from real projects, written for people planning their own.'},
 'es': {'home': '/es/', 'blog': '/es/blog/', 'contact': '/es/#contact', 'projects': '/es/proyectos/', 'blog_name': 'Blog',
        'cta_t': '¿Estás planeando una casa o un interior?', 'cta_p': 'Studio Valentina trabaja con clientes en Georgia, en todo Estados Unidos y en Latinoamérica, en español y en inglés.',
        'cta_b': 'Hablemos por WhatsApp', 'switch': 'English', 'more': 'Sigue leyendo', 'by': 'Por Valentina Arboleda',
        'foot': 'Diseño arquitectónico y de interiores · Peachtree City, GA · Atlanta · Latinoamérica',
        'wa': '¡Hola Valentina! Leí tu artículo "{t}" y me gustaría hablar sobre un proyecto.',
        'hub_title': 'Blog — Arquitectura, Diseño de Interiores y Bienestar | Studio Valentina',
        'hub_desc': 'Ideas sobre arquitectura, diseño de interiores, neuroarquitectura, BIM y cómo construir mejores casas, por la diseñadora arquitectónica Valentina Arboleda.',
        'hub_eyebrow': 'Blog', 'hub_h1': 'Ideas para espacios que se sienten bien.',
        'hub_lead': 'Arquitectura, diseño de interiores, bienestar y tecnología: lo que aprendo en proyectos reales, escrito para quien está planeando el suyo.'},
}


def u(p):
    return urllib.parse.quote(p, safe='/+-_.,()')


def url(a, lang):
    return f"{SITE}/blog/{a['slug_en']}/" if lang == 'en' else f"{SITE}/es/blog/{a['slug_es']}/"


def nice_date(d, lang):
    dt = datetime.date.fromisoformat(d)
    return dt.strftime('%B %-d, %Y') if lang == 'en' else f"{dt.day} de {MONTHS_ES[dt.month - 1]} de {dt.year}"


def block_html(b):
    if isinstance(b, str):
        return f'<p>{e(b)}</p>'
    if 'list' in b:
        return '<ul>' + ''.join(f'<li>{e(x)}</li>' for x in b['list']) + '</ul>'
    if 'quote' in b:
        return f'<blockquote>“{e(b["quote"])}”</blockquote>'
    raise ValueError(b)


def head(lang, title, desc, me, alt, other, xdef, image, extra=''):
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{e(title)}</title>
  <meta name="description" content="{e(desc)}">
  <meta name="author" content="Valentina Arboleda">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="{me}">
  <link rel="alternate" hreflang="{lang}" href="{me}">
  <link rel="alternate" hreflang="{other}" href="{alt}">
  <link rel="alternate" hreflang="x-default" href="{xdef}">
  <meta property="og:type" content="article"><meta property="og:site_name" content="Studio Valentina">
  <meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}">
  <meta property="og:url" content="{me}"><meta property="og:image" content="{image}">
  <meta property="og:locale" content="{'en_US' if lang == 'en' else 'es_ES'}">
  <meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#f5f0e8">
  <link rel="icon" href="/images/favicon.png" type="image/png"><link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>{CSS}</style>
  {extra}
</head>"""


def nav(lang, alt_path, other):
    ui = UI[lang]
    return f"""<body>
  <div class="nav"><div class="wrap">
    <a class="brand" href="{ui['home']}"><span class="badge">VA</span>STUDIO VALENTINA</a>
    <nav><a href="{ui['home']}">{'Home' if lang == 'en' else 'Inicio'}</a><a href="{ui['projects']}">{'Projects' if lang == 'en' else 'Proyectos'}</a><a href="{ui['blog']}">{ui['blog_name']}</a><a href="{ui['contact']}">{'Contact' if lang == 'en' else 'Contacto'}</a><a class="lang" href="{alt_path}" hreflang="{other}" lang="{other}">{ui['switch']}</a></nav>
  </div></div>"""


def footer(lang):
    return f"""  <footer><div class="wrap"><span>© {datetime.date.today().year} Studio Valentina · Valentina Arboleda</span><span>{e(UI[lang]['foot'])}</span></div></footer>
</body>
</html>
"""


def article_page(a, lang, all_articles):
    c = a[lang]; ui = UI[lang]; other = 'es' if lang == 'en' else 'en'
    me, alt = url(a, lang), url(a, other)
    img = SITE + u(a['hero'])
    schema = {"@context": "https://schema.org", "@graph": [
        {"@type": "BlogPosting", "@id": me + "#article", "headline": c['h1'], "description": c['desc'], "inLanguage": lang,
         "datePublished": a['date'], "dateModified": a.get('updated', a['date']), "image": img, "url": me,
         "mainEntityOfPage": me, "keywords": ", ".join(c.get('tags', [])),
         "author": {"@type": "Person", "@id": SITE + "/#valentina", "name": "Valentina Arboleda", "url": SITE + "/"},
         "publisher": {"@id": SITE + "/#studio"}},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Studio Valentina", "item": SITE + ui['home']},
            {"@type": "ListItem", "position": 2, "name": ui['blog_name'], "item": SITE + ui['blog']},
            {"@type": "ListItem", "position": 3, "name": c['h1'], "item": me}]}]}
    body = ''
    for sec in c['sections']:
        if sec.get('h'):
            body += f"<h2>{e(sec['h'])}</h2>"
        body += ''.join(block_html(b) for b in sec['blocks'])
    tags = ''.join(f'<span>{e(t)}</span>' for t in c.get('tags', []))
    wa = 'https://wa.me/16784905574?text=' + urllib.parse.quote(ui['wa'].format(t=c['h1']))
    others = [o for o in all_articles if o is not a][:4]
    more = ''.join(f'<li><a href="{url(o, lang).replace(SITE, "")}"><img src="{u(o["hero"])}" alt="" loading="lazy"><span>{e(o[lang]["h1"])}</span></a></li>' for o in others)
    more_sec = f'<section class="more"><h2>{ui["more"]}</h2><ul>{more}</ul></section>' if others else ''
    return (head(lang, c['title'], c['desc'], me, alt, other, url(a, 'en'), img,
                 f'<meta property="article:published_time" content="{a["date"]}">\n  <script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>')
            + nav(lang, alt.replace(SITE, ''), other) + f"""
  <div class="hero post-hero"><figure><img src="{u(a['hero'])}" alt="{e(c.get('hero_alt', c['h1']))}" fetchpriority="high"></figure></div>
  <main class="wrap">
    <header style="padding:48px 0 0;max-width:880px"><p class="eyebrow">{e(c.get('eyebrow', ui['blog_name']))}</p><h1>{e(c['h1'])}</h1>
      <p class="meta">{ui['by']} · <time datetime="{a['date']}">{nice_date(a['date'], lang)}</time></p></header>
    <p class="lead">{e(c['lead'])}</p>
    <article>{body}<div class="tags">{tags}</div></article>
    <section class="cta"><div><h2>{e(ui['cta_t'])}</h2><p>{e(ui['cta_p'])}</p></div><a class="btn" href="{wa}" target="_blank" rel="noopener">{e(ui['cta_b'])} ↗</a></section>
    {more_sec}
  </main>
""" + footer(lang))


def hub_page(lang, arts):
    ui = UI[lang]; other = 'es' if lang == 'en' else 'en'
    me, alt = SITE + ui['blog'], SITE + UI[other]['blog']
    items = ''.join(
        f'<li><a href="{url(a, lang).replace(SITE, "")}"><figure><img src="{u(a["hero"])}" alt="" loading="lazy" decoding="async"></figure>'
        f'<div><small>{nice_date(a["date"], lang)}</small><strong>{e(a[lang]["h1"])}</strong></div></a></li>' for a in arts)
    schema = {"@context": "https://schema.org", "@type": "Blog", "name": ui['hub_title'], "url": me, "inLanguage": lang,
              "author": {"@id": SITE + "/#valentina"},
              "blogPost": [{"@type": "BlogPosting", "headline": a[lang]['h1'], "url": url(a, lang), "datePublished": a['date']} for a in arts]}
    return (head(lang, ui['hub_title'], ui['hub_desc'], me, alt, other, SITE + '/blog/', SITE + '/images/og-image.jpg',
                 f'<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>')
            + nav(lang, UI[other]['blog'], other) + f"""
  <main class="wrap">
    <header style="padding:56px 0 8px"><p class="eyebrow">{ui['hub_eyebrow']}</p><h1>{e(ui['hub_h1'])}</h1><p class="lead" style="padding-top:18px">{e(ui['hub_lead'])}</p></header>
    <ul class="cards">{items}</ul>
    <section class="cta"><div><h2>{e(ui['cta_t'])}</h2><p>{e(ui['cta_p'])}</p></div><a class="btn" href="https://wa.me/16784905574" target="_blank" rel="noopener">{e(ui['cta_b'])} ↗</a></section>
  </main>
""" + footer(lang))


def rebuild_sitemap():
    pages = []
    for f in [os.path.join(ROOT, 'index.html'), os.path.join(ROOT, 'es', 'index.html')] + \
             sorted(glob.glob(os.path.join(ROOT, 'projects', '**', 'index.html'), recursive=True)) + \
             sorted(glob.glob(os.path.join(ROOT, 'es', 'proyectos', '**', 'index.html'), recursive=True)) + \
             sorted(glob.glob(os.path.join(ROOT, 'blog', '**', 'index.html'), recursive=True)) + \
             sorted(glob.glob(os.path.join(ROOT, 'es', 'blog', '**', 'index.html'), recursive=True)):
        h = open(f, encoding='utf-8').read()
        if re.search(r'<meta name="robots" content="[^"]*noindex', h):
            continue  # redirects / pages kept out of Google
        can = re.search(r'<link rel="canonical" href="([^"]+)"', h)
        if not can:
            continue
        alts = dict(re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', h))
        img = re.search(r'<meta property="og:image" content="([^"]+)"', h)
        mod = re.search(r'"dateModified": "([^"]+)"', h)
        pages.append((can.group(1), alts, img.group(1) if img else None, mod.group(1) if mod else datetime.date.today().isoformat()))
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
           '        xmlns:xhtml="http://www.w3.org/1999/xhtml"',
           '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']
    for loc, alts, img, mod in pages:
        out.append(f'  <url>\n    <loc>{loc}</loc>\n    <lastmod>{mod}</lastmod>')
        for k in ('en', 'es', 'x-default'):
            if k in alts:
                out.append(f'    <xhtml:link rel="alternate" hreflang="{k}" href="{alts[k]}"/>')
        if img:
            out.append(f'    <image:image><image:loc>{img}</image:loc></image:image>')
        out.append('  </url>')
    out.append('</urlset>\n')
    open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8').write('\n'.join(out))
    return len(pages)


def main():
    arts = [json.load(open(f, encoding='utf-8')) for f in sorted(glob.glob(os.path.join(ROOT, 'content', 'blog', '*.json')))]
    arts.sort(key=lambda a: a['date'], reverse=True)
    seen = set()
    for a in arts:
        for k in ('slug_en', 'slug_es', 'date', 'hero', 'en', 'es'):
            assert k in a, f"{a.get('slug_en')}: missing {k}"
        assert os.path.exists(ROOT + a['hero']), f"hero image not found: {a['hero']}"
        assert a['slug_en'] not in seen, f"duplicate slug {a['slug_en']}"; seen.add(a['slug_en'])
        for lang in ('en', 'es'):
            for k in ('title', 'desc', 'h1', 'lead', 'sections'):
                assert k in a[lang], f"{a['slug_en']} [{lang}] missing {k}"
            d = os.path.join(ROOT, 'blog', a['slug_en']) if lang == 'en' else os.path.join(ROOT, 'es', 'blog', a['slug_es'])
            os.makedirs(d, exist_ok=True)
            open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(article_page(a, lang, arts))
    for lang in ('en', 'es'):
        d = os.path.join(ROOT, UI[lang]['blog'].strip('/'))
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(hub_page(lang, arts))
    n = rebuild_sitemap()
    print(f'{len(arts)} articles built; sitemap has {n} URLs')


if __name__ == '__main__':
    main()
