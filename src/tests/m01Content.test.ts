import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { M01_CONTENT } from '../data/topics/m01'
import { TOPIC_CONTENT, type TheoryBlock } from '../data/topicContent'
import { MODULES } from '../data/contentTree'
import { BOOK_DIAGRAMS } from '../components/learning/theory/BookDiagrams'

/**
 * M01 nazariyasi "I qism. Axborot va raqamli savodxonlik asoslari" LaTeX
 * nashridan generatsiya qilinadi. Bu testlar generatsiya natijasi kitobga mos
 * qolishini va LaTeX qoldiqlari sizib chiqmasligini qo'riqlaydi.
 */

const SOURCE = 'Axborot_va_axborot_jarayonlari_LaTeX/'
  + 'I_qism_Axborot_va_raqamli_savodxonlik_yagona.tex'

function walk(blocks: TheoryBlock[]): TheoryBlock[] {
  return blocks.flatMap(b => [b, ...walk(b.children ?? [])])
}

function textsOf(block: TheoryBlock): string[] {
  return [
    block.content,
    ...(block.items ?? []),
    ...(block.headers ?? []),
    ...(block.rows ?? []).flat(),
    ...(block.terms ?? []).flatMap(t => [t.term, t.body]),
  ]
}

/** `$...$` ichidagi matematikani chiqarib tashlaydi. */
function withoutMath(text: string): string {
  return text.replace(/\$[^$]*\$/g, '')
}

const IDS = Object.keys(M01_CONTENT)

describe('M01 kontenti', () => {
  it('12 mavzu: 7 bob + 5 ilova', () => {
    expect(IDS).toHaveLength(12)
    expect(IDS[0]).toBe('M01.01')
    expect(IDS.at(-1)).toBe('M01.12')
  })

  it('contentTree M01 mavzulari kontent bilan bir xil ID va sarlavhaga ega', () => {
    const subtopics = MODULES.find(m => m.id === 'M01')!.subtopics
    expect(subtopics.map(s => s.id)).toEqual(IDS)
    for (const st of subtopics) {
      expect(st.title).toBe(M01_CONTENT[st.id].title)
    }
  })

  it('TOPIC_CONTENT M01 ni generatsiya qilingan fayldan oladi', () => {
    for (const id of IDS) {
      expect(TOPIC_CONTENT[id]).toBe(M01_CONTENT[id])
      expect(TOPIC_CONTENT[id].source).toBe(SOURCE)
    }
  })

  it('har bir mavzu kirish yoki sarlavha bilan boshlanadi', () => {
    for (const id of IDS) {
      const theory = M01_CONTENT[id].theory
      expect(theory.length, id).toBeGreaterThan(1)
      expect(['intro', 'heading', 'goal'], id).toContain(theory[0].type)
    }
  })

  it('bo‘lim sarlavhalari manbadagi \\section ketma-ketligiga mos', () => {
    const tex = readFileSync(SOURCE, 'utf8').replace(/(?<!\\)%.*$/gm, '')
    const body = tex.slice(tex.indexOf('\\chapter*{'))
    const fromTex = [...body.matchAll(/\\section\*?\{([^}]*)\}/g)]
      .map(m => m[1].replace(/``/g, '“').replace(/''/g, '”').replace(/--/g, '–'))
    // birlashtirilgan boblarning sarlavhalari ham heading bo'lib qo'shiladi
    const merged = ['Diagnostika javoblari', 'Yakuniy eslatma']
    const fromBlocks = IDS.flatMap(id => M01_CONTENT[id].theory
      .filter(b => b.type === 'heading')
      .map(b => b.content))
      .filter(title => !merged.includes(title))
    expect(fromBlocks).toEqual(fromTex)
  })

  it('LaTeX qoldiqlari yo‘q', () => {
    const artifact = /\\[a-zA-Z]+|midrule|toprule|bottomrule|textbf\{|``|''/
    for (const id of IDS) {
      for (const block of walk(M01_CONTENT[id].theory)) {
        if (block.type === 'formula' || block.type === 'keyformula') continue
        for (const text of textsOf(block)) {
          expect(withoutMath(text), `${id} / ${block.type}`).not.toMatch(artifact)
        }
      }
    }
  })

  it('strukturaviy bloklar tegishli maydonlarga ega', () => {
    for (const id of IDS) {
      for (const block of walk(M01_CONTENT[id].theory)) {
        if (block.type === 'table') {
          expect(block.rows?.length, id).toBeGreaterThan(0)
          const width = block.rows![0].length
          expect(block.rows!.every(r => r.length === width), `${id} jadval kengligi`).toBe(true)
        }
        if (block.type === 'list') expect(block.items?.length, id).toBeGreaterThan(0)
        if (block.type === 'deflist') expect(block.terms?.length, id).toBeGreaterThan(0)
        if (block.type === 'diagram') expect(block.diagram, id).toBeTruthy()
        // bo'sh blok bo'lmaydi: matn, tuzilma yoki ichki bloklar bo'lishi shart
        const payload = block.content.length + (block.rows?.length ?? 0)
          + (block.items?.length ?? 0) + (block.terms?.length ?? 0) + (block.children?.length ?? 0)
        expect(payload, `${id} / ${block.type}`).toBeGreaterThan(0)
      }
    }
  })

  it('mini-format tokenlari juft', () => {
    for (const id of IDS) {
      for (const block of walk(M01_CONTENT[id].theory)) {
        if (block.type === 'formula' || block.type === 'keyformula') continue
        for (const text of textsOf(block)) {
          for (const token of ['$', '==', '~~', '**', '@@', '`']) {
            const count = text.split(token).length - 1
            expect(count % 2, `${id} / ${token} / ${text.slice(0, 60)}`).toBe(0)
          }
        }
      }
    }
  })

  it('boblar va ilovalar ajratilgan', () => {
    const appendices = IDS.filter(id => M01_CONTENT[id].kind === 'appendix')
    expect(appendices).toEqual(['M01.01', 'M01.09', 'M01.10', 'M01.11', 'M01.12'])
    for (const id of IDS.filter(x => !appendices.includes(x))) {
      expect(M01_CONTENT[id].kind, id).toBe('chapter')
    }
  })

  it('sxemalar xaritada mavjud identifikatorga ishora qiladi', () => {
    const known = new Set(Object.keys(BOOK_DIAGRAMS))
    const used = IDS.flatMap(id => M01_CONTENT[id].theory)
      .filter(b => b.type === 'diagram')
      .map(b => b.diagram!)
    expect(used).toHaveLength(10)
    for (const id of used) expect(known, id).toContain(id)
  })

    it('bob subtopics larida togri savollar bor', () => {
    expect(M01_CONTENT['M01.01'].questions).toHaveLength(0)
    expect(M01_CONTENT['M01.02'].questions).toHaveLength(60)
    expect(M01_CONTENT['M01.03'].questions).toHaveLength(60)
    expect(M01_CONTENT['M01.04'].questions).toHaveLength(70)
    expect(M01_CONTENT['M01.05'].questions).toHaveLength(100)
    expect(M01_CONTENT['M01.06'].questions).toHaveLength(110)
    expect(M01_CONTENT['M01.07'].questions).toHaveLength(0)
    expect(M01_CONTENT['M01.08'].questions).toHaveLength(0)
    expect(M01_CONTENT['M01.09'].questions).toHaveLength(0)
    expect(M01_CONTENT['M01.10'].questions).toHaveLength(0)
    expect(M01_CONTENT['M01.11'].questions).toHaveLength(0)
    expect(M01_CONTENT['M01.12'].questions).toHaveLength(0)
  })
})
