#!/usr/bin/env python3
"""I qism ("Axborot va raqamli savodxonlik asoslari") LaTeX nashrini
strukturaviy bloklarga o'giradi.

Manba — bitta yaxlit fayl; boblar `\\chapter` chegarasi bo'yicha ajratiladi.
Kitobdagi ketma-ketlik aynan saqlanadi: har bir bo'lim, quti, jadval,
ro'yxat, formula va sxema manbadagi tartibda chiqadi.

Chiqish: scripts/m01_blocks.json
"""
from __future__ import annotations

import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SOURCE = os.path.join(
    ROOT, 'Axborot_va_axborot_jarayonlari_LaTeX',
    'I_qism_Axborot_va_raqamli_savodxonlik_yagona.tex',
)

# Hujjatdagi boblar tartibi -> mavzu ID.
# Bir ID ikki marta uchrasa, ikkinchi bob birinchisining davomi sifatida qo'shiladi.
CHAPTER_PLAN = [
    ('Qo‘llanmadan qanday foydalaniladi?', 'M01.01', 'appendix'),
    ('Informatika, ma\'lumot, axborot va bilim', 'M01.02', 'chapter'),
    ('Axborotning turlari, shakllari, xossalari va manbalari', 'M01.03', 'chapter'),
    ('Axborot jarayonlari, izlash va raqamli madaniyat', 'M01.04', 'chapter'),
    ('Belgi, kod, kodlash va axborot hajmi', 'M01.05', 'chapter'),
    ('Matn, grafika, audio va videoning raqamli tasvirlanishi', 'M01.06', 'chapter'),
    ('Axborot hajmini hisoblashning yagona strategiyasi', 'M01.07', 'chapter'),
    ('Attestatsiyadagi nozik farqlar va diagnostika', 'M01.08', 'chapter'),
    ('Bir qarashda: formulalar va birliklar', 'M01.09', 'appendix'),
    ('Boblar bo\'yicha A--E diagnostika', 'M01.10', 'appendix'),
    ('Diagnostika javoblari', 'M01.10', 'appendix'),
    ('Atamalar lug‘ati', 'M01.11', 'appendix'),
    ('Birlashtirish qamrovi va manba reyestri', 'M01.12', 'appendix'),
    ('Yakuniy eslatma', 'M01.12', 'appendix'),
]

# tikzpicture -> React diagrammasi (hujjatdagi tartibda, bob ichida sanaladi)
DIAGRAM_MAP = {
    ('M01.01', 0): ('reading-cycle', 'Tavsiya etilgan o‘qish sikli'),
    ('M01.02', 0): ('dik-flow', 'Ma’lumot → Axborot → Bilim zanjiri'),
    ('M01.02', 1): ('comm-model', 'Aloqa modeli: manbadan qabul qiluvchigacha'),
    ('M01.03', 0): ('comm-noise', 'Shovqinli kanaldagi axborot uzatish modeli'),
    ('M01.04', 0): ('info-lifecycle', 'Axborotning hayot sikli'),
    ('M01.04', 1): ('info-workflow', 'Axborot bilan ishlash bosqichlari'),
    ('M01.04', 2): ('validation-chain', 'Validatsiya, verifikatsiya va audit'),
    ('M01.06', 0): ('unicode-utf8', 'Kod nuqtasidan UTF-8 baytlarigacha'),
    ('M01.06', 1): ('digitization-chain', 'Raqamlashtirish zanjiri'),
    ('M01.08', 0): ('formula-tree', 'Formula tanlashning tezkor daraxti'),
}

# LaTeX muhiti -> blok turi va sarlavhasi (kitobdagi tcolorbox nomlari)
BOX_ENVS = {
    'definition': ('definition', 'Ta’rif'),
    'definitionbox': ('definition', None),          # sarlavha argumentdan
    'simplebox': ('definition', None),
    'keywordbox': ('keywords', 'Tayanch atamalar'),
    'attest': ('exam', 'ATTESTATSIYA uchun muhim'),
    'exam': ('exam', 'ATTESTATSIYA uchun muhim'),
    'attestbox': ('exam', None),
    'formulabox': ('exam', None),
    'warningbox': ('trap', 'Ko‘p uchraydigan xato'),
    'trap': ('trap', 'Ko‘p uchraydigan xato'),
    'clarify': ('extra', 'Darslikdan tashqari aniqlashtirish'),
    'extra': ('extra', 'Darslikdan tashqari aniqlashtirish'),
    'differencebox': ('extra', None),
    'scopebox': ('extra', 'Mavzu chegarasi'),
    'examplebox': ('solved', 'Tushuntiruvchi misol'),
    'solutionbox': ('solved', 'Bosqichma-bosqich yechimlar'),
    'taskbox': ('task', 'Ishlanadigan misollar: oddiydan murakkabga'),
    'casebox': ('case', None),
    'sourcebox': ('source', 'Manba izi'),
    'summarybox': ('summary', 'Bob yakuni'),
    'learningbox': ('goal', 'Bob maqsadi va o‘rganish natijalari'),
    'goalbox': ('goal', 'Bob yo‘nalishi'),
    'recapbox': ('goal', 'Bob yakuni'),
}
# Sarlavhasi majburiy argumentda beriladigan qutilar
LABELLED_BOXES = {'definitionbox', 'simplebox', 'attestbox', 'formulabox',
                  'differencebox', 'casebox'}

DROP_COMMANDS = {
    'clearpage', 'newpage', 'pagebreak', 'vfill', 'noindent', 'smallskip',
    'medskip', 'bigskip', 'centering', 'raggedright', 'printindex', 'appendix',
    'frontmatter', 'mainmatter', 'backmatter', 'tableofcontents', 'par',
    'maketitle', 'clearlist',
}
DROP_WITH_ARG = {'vspace', 'hspace', 'thispagestyle', 'label', 'index',
                 'needspace', 'part', 'marginnote', 'marginword'}
DROP_WITH_3_ARGS = {'addcontentsline'}

FONT_COMMANDS = {
    'sffamily', 'rmfamily', 'ttfamily', 'bfseries', 'itshape', 'normalfont',
    'small', 'large', 'Large', 'LARGE', 'huge', 'Huge', 'scriptsize',
    'footnotesize', 'normalsize', 'tiny', 'selectfont', 'leavevmode',
}


# ─────────────────────────────────────────────────────────────
# Brace helpers
# ─────────────────────────────────────────────────────────────
def match_brace(s: str, start: int) -> int:
    """s[start] == '{' bo'lsa, mos yopuvchi '}' indeksini qaytaradi."""
    assert s[start] == '{', s[start:start + 30]
    depth = 0
    i = start
    while i < len(s):
        c = s[i]
        if c == '\\':
            i += 2
            continue
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise ValueError('unbalanced brace at %d: %s' % (start, s[start:start + 60]))


def read_args(s: str, pos: int, n: int) -> tuple[list[str], int]:
    """pos dan boshlab n ta {...} argumentni o'qiydi."""
    args = []
    i = pos
    for _ in range(n):
        while i < len(s) and s[i] in ' \n\t':
            i += 1
        if i >= len(s) or s[i] != '{':
            args.append('')
            continue
        end = match_brace(s, i)
        args.append(s[i + 1:end])
        i = end + 1
    return args, i


def skip_optional(s: str, pos: int) -> int:
    """[...] ixtiyoriy argumentni o'tkazib yuboradi."""
    i = pos
    while i < len(s) and s[i] in ' \n\t':
        i += 1
    if i < len(s) and s[i] == '[':
        depth = 0
        while i < len(s):
            if s[i] == '[':
                depth += 1
            elif s[i] == ']':
                depth -= 1
                if depth == 0:
                    return i + 1
            i += 1
    return pos


def replace_command(text: str, name: str, nargs: int, fn) -> str:
    """\\name{..}{..} ni fn(args) natijasi bilan almashtiradi."""
    out = []
    i = 0
    pattern = '\\' + name
    while True:
        idx = text.find(pattern, i)
        if idx == -1:
            out.append(text[i:])
            break
        after = idx + len(pattern)
        if after < len(text) and text[after].isalpha():
            out.append(text[i:after])
            i = after
            continue
        out.append(text[i:idx])
        args, end = read_args(text, after, nargs)
        out.append(fn(args))
        i = end
    return ''.join(out)


# ─────────────────────────────────────────────────────────────
# Inline conversion
# ─────────────────────────────────────────────────────────────
MATH_TOKEN = '\x00M%d\x00'


def protect_math(s: str) -> tuple[str, list[str]]:
    stash: list[str] = []

    def stash_math(expr: str) -> str:
        stash.append(expr.strip())
        return MATH_TOKEN % (len(stash) - 1)

    out = []
    i = 0
    while i < len(s):
        if s.startswith('\\(', i):
            end = s.find('\\)', i + 2)
            if end == -1:
                out.append(s[i:])
                break
            out.append(stash_math(s[i + 2:end]))
            i = end + 2
        elif s[i] == '$' and (i == 0 or s[i - 1] != '\\'):
            end = s.find('$', i + 1)
            if end == -1:
                out.append(s[i:])
                break
            out.append(stash_math(s[i + 1:end]))
            i = end + 1
        else:
            out.append(s[i])
            i += 1
    return ''.join(out), stash


def restore_math(s: str, stash: list[str]) -> str:
    for i, expr in enumerate(stash):
        s = s.replace(MATH_TOKEN % i, '$' + normalize_math(expr) + '$')
    return s


def normalize_math(expr: str) -> str:
    expr = re.sub(r'\s+', ' ', expr).strip()
    # \text{...} ichidagi \(x\) -> $x$ (KaTeX shu ko'rinishni tushunadi)
    expr = expr.replace('\\(', '$').replace('\\)', '$')
    return expr


def inline(s: str) -> str:
    """LaTeX matnini ilova ichki mini-formatiga o'giradi.

    **qalin**  __kursiv__  ~~inglizcha~~  ==kalit so'z==  `kod`  $matematika$
    @@izoh@@  [matn](url)
    """
    s, math = protect_math(s)

    # majburiy satr ko'chirish; oddiy satr oxiri — bo'shliq
    s = re.sub(r'\\\\\s*(\[[^\]]*\])?', '\x01', s)
    s = s.replace('~', ' ')

    s = replace_command(s, 'src', 2, lambda a: '@@%s, PDF %s@@' % (a[0].strip(), a[1].strip()))
    s = replace_command(s, 'difficulty', 1, lambda a: '@@%s@@' % inline_arg(a[0]))
    s = replace_command(s, 'keyterm', 1, lambda a: '==%s==' % inline_arg(a[0]))
    s = replace_command(s, 'term', 1, lambda a: '==%s==' % inline_arg(a[0]))
    s = replace_command(s, 'eng', 1, lambda a: '~~%s~~' % inline_arg(a[0]))
    s = replace_command(s, 'textbf', 1, lambda a: '**%s**' % inline_arg(a[0]))
    s = replace_command(s, 'textit', 1, lambda a: '__%s__' % inline_arg(a[0]))
    s = replace_command(s, 'emph', 1, lambda a: '__%s__' % inline_arg(a[0]))
    s = replace_command(s, 'code', 1, lambda a: '`%s`' % inline_arg(a[0]))
    s = replace_command(s, 'path', 1, lambda a: '`%s`' % inline_arg(a[0]))
    s = replace_command(s, 'texttt', 1, lambda a: '`%s`' % inline_arg(a[0]))
    s = replace_command(s, 'textsf', 1, lambda a: inline_arg(a[0]))
    s = replace_command(s, 'textnormal', 1, lambda a: inline_arg(a[0]))
    s = replace_command(s, 'textsuperscript', 1, lambda a: inline_arg(a[0]))
    s = replace_command(s, 'step', 1, lambda a: '**%s.**' % inline_arg(a[0]))
    s = replace_command(s, 'textcolor', 2, lambda a: inline_arg(a[1]))
    s = replace_command(s, 'href', 2, lambda a: '[%s](%s)' % (inline_arg(a[1]), a[0].strip()))
    s = replace_command(s, 'texorpdfstring', 2, lambda a: inline_arg(a[0]))
    s = replace_command(s, 'phantom', 1, lambda a: ' ')
    s = replace_command(s, 'color', 1, lambda a: '')
    s = replace_command(s, 'colorlet', 2, lambda a: '')
    s = replace_command(s, 'fontsize', 2, lambda a: '')

    s = s.replace('\\examtag', 'ATTESTATSIYA')
    s = re.sub(r'\\(cmark|yes)\b', '✓', s)
    s = re.sub(r'\\(xmark|no)\b', '✗', s)
    s = s.replace('\\ldots', '…').replace('\\dots', '…')
    s = s.replace('\\&', '&').replace('\\%', '%').replace('\\_', '_')
    s = s.replace('\\#', '#').replace('\\{', '{').replace('\\}', '}')
    s = s.replace('\\$', '$')

    for cmd in FONT_COMMANDS:
        s = re.sub(r'\\' + cmd + r'\b\s*', '', s)
    for cmd in DROP_COMMANDS:
        s = re.sub(r'\\' + cmd + r'\b\s*', '', s)

    s = s.replace('---', '—').replace('--', '–')
    s = re.sub(r'``', '“', s)
    s = re.sub(r"''", '”', s)
    s = re.sub(r'\\\s', ' ', s)

    leftovers = re.findall(r'\\[a-zA-Z]+', s)
    if leftovers:
        print('  ! qolgan buyruq:', set(leftovers), file=sys.stderr)

    s = re.sub(r'\s+', ' ', s)
    s = '\n'.join(part.strip() for part in s.split('\x01'))
    s = re.sub(r'\n{2,}', '\n', s).strip()

    return restore_math(s, math)


def inline_arg(s: str) -> str:
    return re.sub(r'\s+', ' ', s).strip()


# ─────────────────────────────────────────────────────────────
# Structural parsing
# ─────────────────────────────────────────────────────────────
def split_top(s: str, sep: str) -> list[str]:
    """Qavs chuqurligi 0 bo'lgan joyda sep bo'yicha bo'ladi."""
    parts = []
    depth = 0
    buf = []
    i = 0
    while i < len(s):
        if s.startswith('\\\\', i) and sep == '\\\\':
            if depth == 0:
                parts.append(''.join(buf))
                buf = []
                i += 2
                m = re.match(r'\s*\[[^\]]*\]', s[i:])
                if m:
                    i += m.end()
                continue
            buf.append(s[i:i + 2])
            i += 2
            continue
        c = s[i]
        if c == '\\' and i + 1 < len(s):
            buf.append(s[i:i + 2])
            i += 2
            continue
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
        if c == sep and depth == 0:
            parts.append(''.join(buf))
            buf = []
            i += 1
            continue
        buf.append(c)
        i += 1
    parts.append(''.join(buf))
    return parts


def find_env_end(s: str, env: str, start: int) -> int:
    depth = 1
    i = start
    b = '\\begin{' + env + '}'
    e = '\\end{' + env + '}'
    while i < len(s):
        nb = s.find(b, i)
        ne = s.find(e, i)
        if ne == -1:
            raise ValueError('no \\end{%s}' % env)
        if nb != -1 and nb < ne:
            depth += 1
            i = nb + len(b)
            continue
        depth -= 1
        if depth == 0:
            return ne
        i = ne + len(e)
    raise ValueError('no \\end{%s}' % env)


def parse_list(inner: str, ordered: bool) -> dict:
    inner = re.sub(r'^\s*\[[^\]]*\]', '', inner.strip())
    chunks = [c for c in re.split(r'\\item\b', inner) if c.strip()]
    items = [inline(c) for c in chunks]
    items = [i for i in items if i]
    return {'type': 'list', 'ordered': ordered, 'items': items}


def parse_description(inner: str) -> dict:
    inner = re.sub(r'^\s*\[[^\]]*\]', '', inner.strip())
    terms = []
    for chunk in re.split(r'\\item\b', inner):
        chunk = chunk.strip()
        if not chunk:
            continue
        label = ''
        if chunk.startswith('['):
            depth = 0
            for i, c in enumerate(chunk):
                if c == '[':
                    depth += 1
                elif c == ']':
                    depth -= 1
                    if depth == 0:
                        label = chunk[1:i]
                        chunk = chunk[i + 1:]
                        break
        term = inline(label).replace('==', '').strip()
        body = inline(chunk)
        if term or body:
            terms.append({'term': term, 'body': body})
    return {'type': 'deflist', 'terms': terms}


def parse_table(header_arg_count: int, inner: str) -> dict | None:
    body = inner
    _, pos = read_args(body, 0, header_arg_count)
    body = body[pos:]

    body = re.sub(r'\\(endhead|endfirsthead|endfoot|endlastfoot|hline)\b', '', body)
    body = replace_command(body, 'caption', 1, lambda a: '')
    body = re.sub(r'\\cmidrule(\([^)]*\))?(\{[^}]*\})?', '', body)

    seg_head, seg_body = '', body
    if '\\midrule' in body:
        first, rest = body.split('\\midrule', 1)
        seg_head, seg_body = first, rest
    seg_head = seg_head.replace('\\toprule', '')
    seg_body = seg_body.replace('\\toprule', '').replace('\\bottomrule', '')
    seg_body = seg_body.replace('\\midrule', '')

    def rows_of(seg: str) -> list[list[str]]:
        out = []
        for raw in split_top(seg, '\\\\'):
            if not raw.strip():
                continue
            cells = [inline(c) for c in split_top(raw, '&')]
            if any(c for c in cells):
                out.append(cells)
        return out

    head_rows = rows_of(seg_head)
    body_rows = rows_of(seg_body)

    headers = [h.replace('**', '') for h in head_rows[0]] if head_rows else []
    if len(head_rows) > 1:
        body_rows = head_rows[1:] + body_rows

    width = max([len(headers)] + [len(r) for r in body_rows] or [0]) if body_rows or headers else 0
    for r in body_rows:
        while len(r) < width:
            r.append('')
    if headers:
        while len(headers) < width:
            headers.append('')

    if not body_rows and not headers:
        return None
    return {'type': 'table', 'headers': headers, 'rows': body_rows}


def parse_body(text: str, ctx: dict) -> list[dict]:
    blocks: list[dict] = []
    buf: list[str] = []

    def flush():
        raw = ''.join(buf)
        buf.clear()
        for para in re.split(r'\n\s*\n', raw):
            if not para.strip():
                continue
            txt = inline(para)
            if txt:
                blocks.append({'type': 'text', 'content': txt})

    i = 0
    while i < len(text):
        if text.startswith('\\[', i):
            end = text.find('\\]', i + 2)
            flush()
            blocks.append({'type': 'formula', 'content': normalize_math(text[i + 2:end])})
            i = end + 2
            continue

        if text[i] != '\\':
            buf.append(text[i])
            i += 1
            continue

        m = re.match(r'\\([a-zA-Z]+)\*?', text[i:])
        if not m:
            buf.append(text[i])
            i += 1
            continue
        cmd = m.group(1)
        after = i + m.end()

        if cmd == 'begin':
            args, pos = read_args(text, after, 1)
            env = args[0]
            end_idx = find_env_end(text, env, pos)
            inner = text[pos:end_idx]
            rest = end_idx + len('\\end{%s}' % env)
            flush()
            blocks.extend(handle_env(env, inner, ctx))
            i = rest
            continue

        if cmd == 'end':
            _, pos = read_args(text, after, 1)
            i = pos
            continue

        if cmd in ('section', 'subsection', 'subsubsection'):
            args, pos = read_args(text, skip_optional(text, after), 1)
            flush()
            kind = 'heading' if cmd == 'section' else 'subheading'
            blocks.append({'type': kind, 'content': inline(args[0])})
            i = pos
            continue

        if cmd == 'chapterintro':
            args, pos = read_args(text, after, 1)
            flush()
            blocks.append({'type': 'intro', 'content': inline(args[0])})
            i = pos
            continue

        if cmd == 'formula':
            args, pos = read_args(text, after, 1)
            flush()
            blocks.append({'type': 'keyformula', 'content': normalize_math(args[0])})
            i = pos
            continue

        if cmd == 'sourcecite':
            args, pos = read_args(text, after, 1)
            flush()
            blocks.append({'type': 'source', 'content': inline(args[0]), 'label': 'Manba izi'})
            i = pos
            continue

        if cmd in ('quickcheck', 'answers'):
            args, pos = read_args(text, after, 1)
            flush()
            kind = 'quickcheck' if cmd == 'quickcheck' else 'answers'
            blocks.append(wrap(kind, parse_body(args[0], ctx), None))
            i = pos
            continue

        if cmd in ('bigidea', 'keyline'):
            args, pos = read_args(text, after, 1)
            flush()
            blocks.append({'type': 'subheading', 'content': inline(args[0])})
            i = pos
            continue

        if cmd == 'chapterquote':
            args, pos = read_args(text, after, 1)
            flush()
            blocks.append({'type': 'text', 'content': inline(args[0])})
            i = pos
            continue

        if cmd in DROP_WITH_3_ARGS:
            _, pos = read_args(text, after, 3)
            i = pos
            continue

        if cmd in DROP_WITH_ARG:
            j = skip_optional(text, after)
            if j < len(text) and text[j] == '{':
                _, j = read_args(text, j, 1)
            else:
                j = re.match(r'[^\n]*', text[after:]).end() + after
            i = j
            continue

        if cmd in DROP_COMMANDS:
            i = after
            continue

        buf.append(text[i])
        i += 1

    flush()
    return blocks


def wrap(kind: str, children: list[dict], label: str | None) -> dict:
    """Bitta matnli bola bo'lsa content ga siqadi, aks holda children saqlaydi."""
    children = [c for c in children if c.get('content') or c.get('rows')
                or c.get('items') or c.get('terms') or c.get('children')]
    block: dict
    if len(children) == 1 and children[0]['type'] == 'text':
        block = {'type': kind, 'content': children[0]['content']}
    else:
        block = {'type': kind, 'content': '', 'children': children}
    if label:
        block['label'] = label
    return block


def handle_env(env: str, inner: str, ctx: dict) -> list[dict]:
    if env in BOX_ENVS:
        kind, default_label = BOX_ENVS[env]
        inner = re.sub(r'^\s*\[[^\]]*\]', '', inner)
        label = default_label
        if env in LABELLED_BOXES or (env == 'sourcebox' and inner.lstrip().startswith('{')):
            stripped = inner.lstrip()
            if stripped.startswith('{'):
                end = match_brace(stripped, 0)
                label = inline(stripped[1:end])
                inner = stripped[end + 1:]
        return [wrap(kind, parse_body(inner, ctx), label)]
    if env == 'itemize':
        return [parse_list(inner, ordered=False)]
    if env == 'enumerate':
        return [parse_list(inner, ordered=True)]
    if env == 'description':
        return [parse_description(inner)]
    if env == 'tabularx':
        tbl = parse_table(2, inner)
        return [tbl] if tbl else []
    if env in ('longtable', 'tabular'):
        tbl = parse_table(1, inner)
        return [tbl] if tbl else []
    if env in ('center', 'multicols', 'minipage', 'flushleft', 'flushright'):
        body = inner
        if env in ('multicols', 'minipage'):
            _, pos = read_args(body, 0, 1)
            body = body[pos:]
        return parse_body(body, ctx)
    if env == 'tikzpicture':
        key = (ctx['topic'], ctx['tikz'])
        ctx['tikz'] += 1
        diagram = DIAGRAM_MAP.get(key)
        if not diagram:
            print('  ! sxema xaritada yo‘q:', key, file=sys.stderr)
            return []
        return [{'type': 'diagram', 'content': diagram[1], 'diagram': diagram[0]}]
    if env in ('titlepage', 'tcolorbox'):
        return parse_body(inner, ctx)
    print('  ! e\'tiborsiz muhit:', env, file=sys.stderr)
    return []


def strip_comments(s: str) -> str:
    out = []
    for line in s.split('\n'):
        idx = 0
        while True:
            idx = line.find('%', idx)
            if idx == -1:
                break
            if idx > 0 and line[idx - 1] == '\\':
                idx += 1
                continue
            line = line[:idx]
            break
        out.append(line)
    return '\n'.join(out)


def normalize_title(title: str) -> str:
    """Sarlavhalarni taqqoslash uchun soddalashtiradi (apostrof/tire variantlari)."""
    t = title.lower()
    t = t.replace('--', '–').replace('‘', "'").replace('’', "'")
    return re.sub(r'[^a-z0-9]+', '', t)


def main() -> None:
    src = strip_comments(open(SOURCE, encoding='utf-8').read())
    body = src[src.index('\\chapter*{'):]

    # boblarga ajratamiz
    marks = [(m.start(), m.group(1)) for m in
             re.finditer(r'\\chapter\*?\{((?:[^{}]|\{[^{}]*\})*)\}', body)]
    marks.append((len(body), ''))

    if len(marks) - 1 != len(CHAPTER_PLAN):
        raise SystemExit('Manbada %d bob bor, rejada %d ta — CHAPTER_PLAN yangilansin'
                         % (len(marks) - 1, len(CHAPTER_PLAN)))

    result: dict[str, dict] = {}
    for idx, (start, title) in enumerate(marks[:-1]):
        expected, topic_id, kind = CHAPTER_PLAN[idx]
        if normalize_title(title) != normalize_title(expected):
            raise SystemExit('Bob %d: kutilgan "%s", topildi "%s"' % (idx + 1, expected, title))

        segment = body[start:marks[idx + 1][0]]
        segment = segment[segment.index('}') + 1:]  # \chapter{...} ni kesamiz

        first = topic_id not in result
        if first:
            result[topic_id] = {'title': inline(title), 'kind': kind, 'blocks': [],
                                'source': os.path.basename(SOURCE)}
        ctx = {'topic': topic_id, 'tikz': result[topic_id].get('tikz_count', 0)}
        blocks = parse_body(segment, ctx)
        result[topic_id]['tikz_count'] = ctx['tikz']

        if not first:
            # davomi: bob sarlavhasi bo'lim sifatida qo'shiladi
            result[topic_id]['blocks'].append({'type': 'heading', 'content': inline(title)})
        result[topic_id]['blocks'].extend(blocks)
        print('  %-7s %-52s %3d blok' % (topic_id, title[:50], len(blocks)), file=sys.stderr)

    for value in result.values():
        value.pop('tikz_count', None)
        value['blocks'] = [b for b in value['blocks'] if b.get('content') or b.get('rows')
                           or b.get('items') or b.get('terms') or b.get('children')]

    out_path = os.path.join(ROOT, 'scripts', 'm01_blocks.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=1)

    total = sum(len(v['blocks']) for v in result.values())
    print('\n✓ %s\n  %d mavzu, %d blok' % (out_path, len(result), total), file=sys.stderr)


if __name__ == '__main__':
    main()
