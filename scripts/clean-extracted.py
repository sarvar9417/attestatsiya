#!/usr/bin/env python3
"""
darsliklar/extracted/*.txt fayllarini tozalaydi.

KONTENT_SIFAT_HISOBOTI.md da aniqlangan kamchiliklarni tuzatadi:

  1. Apostrof normalizatsiyasi  — ' ' ' ` → ʻ (o'/g' uchun) yoki ʼ (tutuq belgisi)
  2. Kod/formula qo'shtirnog'i  — “<0” → "<0"  (faqat kod/formula qatorlarida)
  3. Kolontitullar             — sahifaning birinchi/oxirgi qatorida takrorlanuvchi
                                  sarlavha va kolontitul (matn ichidagisi saqlanadi)
  4. Yolg'iz sahifa raqamlari  — sahifadagi yakka son
  5. Bo'g'in bo'linishi        — satr oxiridagi tire bilan uzilgan so'zni birlashtirish
  6. Nuqtali to'ldirish        — «………………» mashq qatorlari
  7. Yetim markerlar           — yakka «•» punktlari
  8. Ortiqcha bo'sh qatorlar

O'zgarmaydi: `===== SAHIFA N =====` markerlari (sahifa iqtibosi uchun MAJBURIY),
matn mazmuni, atamalar, imlo.

Skript idempotent: ikki marta ishlatilsa natija o'zgarmaydi.

Ishlatish:
    python3 scripts/clean-extracted.py --dry-run     # faqat hisobot
    python3 scripts/clean-extracted.py               # tozalash (joyida)
    python3 scripts/clean-extracted.py --check       # idempotentlikni tekshirish
"""

from __future__ import annotations

import argparse
import re
import sys
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path

SRC_DIR = Path(__file__).resolve().parent.parent / "darsliklar" / "extracted"
# Marker oxirida `[MUNDARIJA]` kabi belgi bo'lishi mumkin — regex uni qabul qiladi,
# aks holda skript idempotent bo'lmaydi (ikkinchi o'tishda sahifa chegarasi yo'qoladi).
PAGE_RE = re.compile(r"^===== SAHIFA (\d+) =====(?:\s+\[[A-Z]+\])?$")

# ── Apostrof ────────────────────────────────────────────────────────────────
# O'zbek lotin alifbosi: oʻ gʻ uchun U+02BB, tutuq belgisi uchun U+02BC.
OKINA = "ʻ"   # ʻ  MODIFIER LETTER TURNED COMMA
TUTUQ = "ʼ"   # ʼ  MODIFIER LETTER APOSTROPHE
APOSTROPHE_LIKE = "'‘’`´′"

_OG_APOS = re.compile(f"([oOgG])[{re.escape(APOSTROPHE_LIKE)}]")
_MID_APOS = re.compile(f"(?<=[a-zA-Zʻ])[{re.escape(APOSTROPHE_LIKE)}](?=[a-zA-Z])")

# ── Kirill homoglifi ────────────────────────────────────────────────────────
# Ekstraksiyada ba'zi lotin harflari kirill ekvivalenti bilan chiqadi:
# «Тoshkent», «mikrotо‘lqin», «tugmaсhasi». Qidiruvda topilmaydi.
# ⚠️ Faqat LOTIN so'z ichidagi kirill harfi tuzatiladi — asl rus matni
# (butunlay kirill token) o'zgarmaydi.
CYRILLIC_TO_LATIN = {
    "а": "a", "е": "e", "о": "o", "р": "p", "с": "c", "у": "y", "х": "x",
    "А": "A", "В": "B", "Е": "E", "К": "K", "М": "M", "Н": "H", "О": "O",
    "Р": "P", "С": "C", "Т": "T", "У": "Y", "Х": "X",
}
_TOKEN = re.compile(r"[^\W\d_]+", re.UNICODE)
_HAS_LATIN = re.compile(r"[a-zA-Z]")
_HAS_CYRILLIC = re.compile(r"[Ѐ-ӿ]")

# ── Kod/formula qatori ──────────────────────────────────────────────────────
_CODE_HINT = re.compile(
    r"(=\s*[A-Z]{2,12}\s*\(|^\s*>>>|^\s*(print|def|for|while|if|let|const|var)\b"
    r"|</?[a-zA-Z][a-zA-Z0-9]*\s*/?>)"
)
_CURLY_DQ = str.maketrans({"“": '"', "”": '"', "„": '"', "«": '"', "»": '"'})

# ── Shovqin naqshlari ───────────────────────────────────────────────────────
_DOT_FILL = re.compile(r"^[\s.…_]{6,}$")           # ……… yoki .......  yoki ___
_LONE_BULLET = re.compile(r"^\s*[•▪◦·]\s*$")
_LONE_PAGENO = re.compile(r"^\s*\d{1,4}\s*$")
_HYPHEN_BREAK = re.compile(r"([A-Za-zʻʼЀ-ӿ])-$")
_TOC_LINE = re.compile(r"[.…]{5,}\s*\d{1,4}\s*$", re.MULTILINE)   # «Mavzu......13»

FURNITURE_MIN_RATIO = 0.20   # sahifalarning 20%+ ida chetda takrorlansa — kolontitul
FURNITURE_MAX_LEN = 120      # uzun paragraf kolontitul bo'lmaydi


@dataclass
class Stats:
    files: int = 0
    pages: int = 0
    chars_before: int = 0
    chars_after: int = 0
    apostrophes: int = 0
    homoglyphs: int = 0
    code_quotes: int = 0
    furniture_lines: int = 0
    page_numbers: int = 0
    dot_fills: int = 0
    lone_bullets: int = 0
    hyphen_joins: int = 0
    blank_collapsed: int = 0
    toc_pages: int = 0
    empty_pages: int = 0
    furniture_terms: dict[str, list[str]] = field(default_factory=dict)


def fix_cyrillic_homoglyphs(text: str) -> tuple[str, int]:
    """Lotin so'z ichidagi kirill homoglifini lotinga qaytaradi.

    Butunlay kirill token (asl rus matni) o'zgarmaydi.
    """
    fixed = 0

    def repl(m: re.Match[str]) -> str:
        nonlocal fixed
        token = m.group(0)
        if not (_HAS_LATIN.search(token) and _HAS_CYRILLIC.search(token)):
            return token
        out = "".join(CYRILLIC_TO_LATIN.get(ch, ch) for ch in token)
        if out != token:
            fixed += 1
        return out

    return _TOKEN.sub(repl, text), fixed


def normalize_apostrophes(text: str) -> tuple[str, int]:
    """o'/g' → oʻ/gʻ, so'z ichidagi qolgan apostrof → tutuq belgisi."""
    before = text
    text = _OG_APOS.sub(lambda m: m.group(1) + OKINA, text)
    text = _MID_APOS.sub(TUTUQ, text)
    # Yakka qolgan grave accent
    text = text.replace("`", TUTUQ)
    n = sum(1 for a, b in zip(before, text) if a != b) + abs(len(before) - len(text))
    return text, n


def fix_code_quotes(line: str) -> tuple[str, int]:
    """Kod/formula qatorida qiyshiq qo'shtirnoqni to'g'rilaydi."""
    if not _CODE_HINT.search(line):
        return line, 0
    fixed = line.translate(_CURLY_DQ)
    return fixed, 1 if fixed != line else 0


def split_pages(raw: str) -> list[tuple[int | None, list[str]]]:
    """Matnni [(sahifa_raqami, qatorlar)] ko'rinishiga ajratadi."""
    pages: list[tuple[int | None, list[str]]] = []
    current_no: int | None = None
    buf: list[str] = []
    for line in raw.split("\n"):
        m = PAGE_RE.match(line.strip())
        if m:
            pages.append((current_no, buf))
            current_no = int(m.group(1))
            buf = []
        else:
            buf.append(line)
    pages.append((current_no, buf))
    return pages


def detect_furniture(pages: list[tuple[int | None, list[str]]]) -> set[str]:
    """Sahifa chetlarida takrorlanuvchi kolontitullarni aniqlaydi."""
    edge = Counter()
    n_pages = 0
    for _, lines in pages:
        content = [ln.strip() for ln in lines if ln.strip()]
        if not content:
            continue
        n_pages += 1
        # Sahifaning yuqori 2 va pastki 2 qatori
        for ln in content[:2] + content[-2:]:
            if 0 < len(ln) <= FURNITURE_MAX_LEN and not _LONE_PAGENO.match(ln):
                edge[ln] += 1
    if n_pages == 0:
        return set()
    threshold = max(3, int(n_pages * FURNITURE_MIN_RATIO))
    return {ln for ln, c in edge.items() if c >= threshold}


def clean_page(
    lines: list[str], furniture: set[str], st: Stats
) -> tuple[list[str], bool]:
    """Bitta sahifani tozalaydi. Qaytaradi: (qatorlar, mundarija_sahifasimi)."""
    # 1) Chetlardagi kolontitullarni olib tashlash (matn ichidagisi qoladi)
    content_idx = [i for i, ln in enumerate(lines) if ln.strip()]
    edge_idx = set(content_idx[:2] + content_idx[-2:]) if content_idx else set()

    kept: list[str] = []
    for i, line in enumerate(lines):
        s = line.strip()
        if not s:
            kept.append("")
            continue
        if i in edge_idx and s in furniture:
            st.furniture_lines += 1
            continue
        if _LONE_PAGENO.match(s):
            st.page_numbers += 1
            continue
        if _DOT_FILL.match(s):
            st.dot_fills += 1
            continue
        if _LONE_BULLET.match(s):
            st.lone_bullets += 1
            continue
        kept.append(line.rstrip())

    # 2) Bo'g'in bo'linishini birlashtirish (tire saqlanadi — o'zbekcha
    #    qo'shma so'zlar ko'p: «ketma-ketlik», «al-jabr»)
    joined: list[str] = []
    i = 0
    while i < len(kept):
        line = kept[i]
        m = _HYPHEN_BREAK.search(line.rstrip())
        if m and i + 1 < len(kept):
            nxt = kept[i + 1].lstrip()
            if nxt and nxt[0].islower():
                joined.append(line.rstrip() + nxt)
                st.hyphen_joins += 1
                i += 2
                continue
        joined.append(line)
        i += 1

    # 3) Kod qatorlaridagi qo'shtirnoq
    out: list[str] = []
    for line in joined:
        fixed, n = fix_code_quotes(line)
        st.code_quotes += n
        out.append(fixed)

    # 4) Ketma-ket bo'sh qatorlarni bittaga siqish
    collapsed: list[str] = []
    for line in out:
        if not line.strip() and collapsed and not collapsed[-1].strip():
            st.blank_collapsed += 1
            continue
        collapsed.append(line)
    while collapsed and not collapsed[0].strip():
        collapsed.pop(0)
    while collapsed and not collapsed[-1].strip():
        collapsed.pop()

    body = "\n".join(collapsed)
    is_toc = len(_TOC_LINE.findall(body)) >= 3
    if not body.strip():
        st.empty_pages += 1
    return collapsed, is_toc


def clean_file(path: Path, st: Stats) -> str:
    raw = path.read_text(encoding="utf-8")
    st.chars_before += len(raw)

    # Homoglif apostrofdan OLDIN: «mikrotо‘lqin» → «mikroto‘lqin» → «mikrotoʻlqin»
    raw, n_homo = fix_cyrillic_homoglyphs(raw)
    st.homoglyphs += n_homo

    raw, n_apos = normalize_apostrophes(raw)
    st.apostrophes += n_apos

    pages = split_pages(raw)
    furniture = detect_furniture(pages)
    if furniture:
        st.furniture_terms[path.name] = sorted(furniture)[:8]

    chunks: list[str] = []
    for page_no, lines in pages:
        cleaned, is_toc = clean_page(lines, furniture, st)
        if page_no is not None:
            st.pages += 1
            header = f"===== SAHIFA {page_no} ====="
            if is_toc:
                st.toc_pages += 1
                header += "  [MUNDARIJA]"
            chunks.append(header)
        body = "\n".join(cleaned).strip("\n")
        if body:
            chunks.append(body)

    result = "\n".join(chunks).strip() + "\n"
    st.chars_after += len(result)
    return result


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="faqat hisobot, yozmaydi")
    ap.add_argument("--check", action="store_true", help="idempotentlikni tekshirish")
    ap.add_argument("--dir", type=Path, default=SRC_DIR, help="boshqa papkada ishlash")
    args = ap.parse_args()

    src_dir: Path = args.dir
    if not src_dir.is_dir():
        print(f"XATO: {src_dir} topilmadi", file=sys.stderr)
        return 1

    files = sorted(src_dir.glob("*.txt"))
    if not files:
        print(f"XATO: {src_dir} da .txt fayl yoq", file=sys.stderr)
        return 1

    st = Stats()
    changed: list[str] = []

    for path in files:
        st.files += 1
        original = path.read_text(encoding="utf-8")
        cleaned = clean_file(path, st)

        if args.check:
            # Ikkinchi o'tish natijani o'zgartirmasligi kerak
            tmp_st = Stats()
            tmp = src_dir / f".__check_{path.name}"
            tmp.write_text(cleaned, encoding="utf-8")
            twice = clean_file(tmp, tmp_st)
            tmp.unlink()
            if twice != cleaned:
                print(f"❌ IDEMPOTENT EMAS: {path.name}", file=sys.stderr)
                return 1
            continue

        if cleaned != original:
            changed.append(path.name)
            if not args.dry_run:
                path.write_text(cleaned, encoding="utf-8")

    if args.check:
        print(f"✅ Idempotent: {st.files} fayl ikki marta tozalanganda o'zgarmadi")
        return 0

    saved = st.chars_before - st.chars_after
    pct = 100 * saved / st.chars_before if st.chars_before else 0

    print("─" * 62)
    print(f"{'TOZALASH HISOBOTI':^62}")
    print("─" * 62)
    print(f"  Fayl                        {st.files}")
    print(f"  Sahifa                      {st.pages}")
    print(f"  Belgi (oldin → keyin)       {st.chars_before:,} → {st.chars_after:,}")
    print(f"  Tozalangan shovqin          {saved:,} belgi ({pct:.1f}%)")
    print()
    print("  TUZATISHLAR")
    print(f"    Kirill homoglifi tuzatildi  {st.homoglyphs:,}")
    print(f"    Apostrof normalizatsiyasi   {st.apostrophes:,}")
    print(f"    Kod/formula qo'shtirnog'i   {st.code_quotes:,}")
    print(f"    Bo'g'in birlashtirildi      {st.hyphen_joins:,}")
    print()
    print("  OLIB TASHLANGAN SHOVQIN")
    print(f"    Kolontitul qatorlari        {st.furniture_lines:,}")
    print(f"    Yolg'iz sahifa raqamlari    {st.page_numbers:,}")
    print(f"    Nuqtali to'ldirish          {st.dot_fills:,}")
    print(f"    Yetim markerlar             {st.lone_bullets:,}")
    print(f"    Ortiqcha bo'sh qatorlar     {st.blank_collapsed:,}")
    print()
    print("  BELGILANGAN")
    print(f"    Mundarija sahifalari        {st.toc_pages}")
    print(f"    Bo'sh sahifalar             {st.empty_pages}")
    print()
    if st.furniture_terms:
        print("  ANIQLANGAN KOLONTITULLAR (namuna)")
        for name, terms in list(st.furniture_terms.items())[:4]:
            print(f"    {name}")
            for t in terms[:3]:
                print(f"      · {t[:64]}")
        print()
    print(f"  {'O`ZGARADIGAN' if args.dry_run else 'O`ZGARTIRILGAN'} FAYL: {len(changed)}")
    if args.dry_run:
        print("\n  (--dry-run: hech narsa yozilmadi)")
    print("─" * 62)
    return 0


if __name__ == "__main__":
    sys.exit(main())
