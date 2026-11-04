#!/usr/bin/env python3
"""Replace dashes used as punctuation with commas in the site's visible text.

Only text between tags is touched (never attributes, <script> or <style>), and only
dashes surrounded by spaces, so these stay exactly as they are:
  studio-valentina.com   +1 (678) 490-5574   2023-2026   non-exclusive   Pop-Up Store
"""
import re
import sys

SKIP = ('script', 'style')
# a dash used as punctuation: spaces on both sides
PUNCT = re.compile(r'[ \t ]*[—–-][ \t ]+')
LEADING = re.compile(r'^([ \t ]*)[—–][ \t ]+')


def fix_text(t):
    if not t.strip():
        return t
    out = LEADING.sub(r'\1', t)

    def rep(m):
        start = m.start()
        before = out[:start].rstrip()
        if before.endswith((',', ':', ';', '.', '(')):
            return ' '
        return ', '
    # apply repeatedly so several dashes in one sentence are all handled
    prev = None
    while prev != out:
        prev = out
        out = PUNCT.sub(lambda m: ', ' if not out[:m.start()].rstrip().endswith((',', ':', ';', '.', '(')) else ' ', out, count=1)
    return re.sub(r',\s*,', ',', out)


def fix_html(html):
    parts = re.split(r'(<[^>]*>)', html)
    skipping = 0
    out = []
    for p in parts:
        if p.startswith('<'):
            name = re.match(r'</?\s*([a-zA-Z0-9]+)', p)
            tag = name.group(1).lower() if name else ''
            if tag in SKIP:
                skipping += 0 if p.startswith('</') else 1
                if p.startswith('</'):
                    skipping = max(0, skipping - 1)
            out.append(p)
        else:
            out.append(p if skipping else fix_text(p))
    return ''.join(out)


def fix_meta(html):
    """Also clean the description/title metadata that shows up in Google."""
    def rep(m):
        return m.group(1) + fix_text(m.group(2)) + m.group(3)
    pat = r'(<meta[^>]*(?:name="description"|property="og:(?:title|description)"|name="twitter:(?:title|description)")[^>]*content=")([^"]*)(")'
    return re.sub(pat, rep, html)


def main(paths):
    changed = 0
    for path in paths:
        src = open(path, encoding='utf-8').read()
        out = fix_meta(fix_html(src)) if path.endswith('.html') else fix_text(src)
        if out != src:
            open(path, 'w', encoding='utf-8').write(out)
            changed += 1
            print('fixed', path)
    print('files changed:', changed)


if __name__ == '__main__':
    main(sys.argv[1:])
