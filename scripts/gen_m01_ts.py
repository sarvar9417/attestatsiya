#!/usr/bin/env python3
"""m01_blocks.json + m01_questions.json -> src/data/topics/m01.ts

Ishlatish:
    python3 scripts/latex_to_blocks.py && python3 scripts/gen_m01_ts.py
"""
from __future__ import annotations

import json
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
BLOCKS = os.path.join(ROOT, 'scripts', 'm01_blocks.json')
OUT = os.path.join(ROOT, 'src', 'data', 'topics', 'm01.ts')

KEY_ORDER = ['type', 'label', 'content', 'diagram', 'ordered', 'items', 'headers',
             'rows', 'terms', 'children']


def s(value: str) -> str:
    """TS satr literali."""
    return json.dumps(value, ensure_ascii=False)


def fallback_content(b: dict) -> str:
    """Strukturaviy bloklar uchun oddiy matnli zaxira (qidiruv, MDX eksporti uchun)."""
    if b['type'] == 'list':
        mark = (lambda i: '%d. ' % (i + 1)) if b.get('ordered') else (lambda i: '• ')
        return '\n'.join(mark(i) + item.replace('\n', ' ') for i, item in enumerate(b['items']))
    if b['type'] == 'table':
        lines = []
        if b.get('headers'):
            lines.append('| ' + ' | '.join(b['headers']) + ' |')
        for row in b.get('rows', []):
            lines.append('| ' + ' | '.join(c.replace('\n', ' ') for c in row) + ' |')
        return '\n'.join(lines)
    if b['type'] == 'deflist':
        return '\n'.join('%s — %s' % (t['term'], t['body'].replace('\n', ' ')) for t in b['terms'])
    return ''


def emit_block(b: dict, indent: int) -> str:
    """Bitta nazariy blokni TS obyekt literali sifatida chiqaradi."""
    b = dict(b)
    if not b.get('content'):
        b['content'] = fallback_content(b)
    pad = ' ' * indent
    inner = pad + '  '
    parts = []
    for key in KEY_ORDER:
        if key not in b:
            continue
        val = b[key]
        if key in ('type', 'label', 'content', 'diagram'):
            parts.append('%s: %s' % (key, s(val)))
        elif key == 'ordered':
            parts.append('ordered: %s' % ('true' if val else 'false'))
        elif key in ('items', 'headers'):
            parts.append('%s: [%s]' % (key, ', '.join(s(x) for x in val)))
        elif key == 'rows':
            rows = ',\n'.join('%s  [%s]' % (inner, ', '.join(s(c) for c in row)) for row in val)
            parts.append('rows: [\n%s,\n%s]' % (rows, inner))
        elif key == 'terms':
            terms = ',\n'.join(
                '%s  { term: %s, body: %s }' % (inner, s(t['term']), s(t['body'])) for t in val)
            parts.append('terms: [\n%s,\n%s]' % (terms, inner))
        elif key == 'children':
            kids = ',\n'.join(emit_block(c, indent + 4) for c in val)
            parts.append('children: [\n%s,\n%s]' % (kids, inner))

    one_line = '%s{ %s }' % (pad, ', '.join(parts))
    if len(one_line) <= 118 and '\n' not in one_line:
        return one_line
    return '%s{\n%s%s,\n%s}' % (pad, inner, (',\n%s' % inner).join(parts), pad)


def main() -> None:
    blocks = json.load(open(BLOCKS, encoding='utf-8'))

    out = [
        '/**',
        ' * M01 — Axborot va raqamli savodxonlik: nazariy kontent.',
        ' *',
        ' * AVTOMATIK GENERATSIYA QILINGAN — qo\'lda tahrirlamang.',
        ' * Manba: Axborot_va_axborot_jarayonlari_LaTeX/',
        ' *         I_qism_Axborot_va_raqamli_savodxonlik_yagona.tex',
        ' * Bloklar kitobdagi ketma-ketlikda, matn aynan manbadagidek saqlangan.',
        ' *',
        ' * Qayta yaratish:',
        ' *   python3 scripts/latex_to_blocks.py && python3 scripts/gen_m01_ts.py',
        ' */',
        "import type { TopicContent } from '../topicContent'",
        '',
        'export const M01_CONTENT: Record<string, TopicContent> = {',
    ]

    for tid in sorted(blocks):
        v = blocks[tid]
        out.append('  %s: {' % s(tid))
        out.append('    subtopicId: %s,' % s(tid))
        out.append('    title: %s,' % s(v['title']))
        out.append('    source: %s,' % s('Axborot_va_axborot_jarayonlari_LaTeX/' + v['source']))
        out.append('    kind: %s,' % s(v['kind']))
        out.append('    theory: [')
        for b in v['blocks']:
            out.append(emit_block(b, 6) + ',')
        out.append('    ],')
        # Test savollari yangi manba bo'yicha qayta tayyorlanadi
        out.append('    questions: [],')
        out.append('  },')

    out.append('}')
    out.append('')

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))

    total_blocks = sum(len(v['blocks']) for v in blocks.values())
    print('✓ %s' % OUT)
    print('  %d mavzu, %d nazariy blok' % (len(blocks), total_blocks))


if __name__ == '__main__':
    main()
