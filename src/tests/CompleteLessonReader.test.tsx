import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MODULES } from '../data/contentTree'
import { getTopicContent, type TopicContent, type TheoryBlock } from '../data/topicContent'
import { getPedagogyStudyNotes } from '../data/pedagogyStudyNotes'
import { completeLessonReader } from '../features/content/completeLessonReader'
import { markdownToTheoryBlocks } from '../features/content/professionalLessonTheory'
import BookReader, { splitAdaptiveSections, splitSections } from '../components/learning/theory/BookReader'
import BookBlock from '../components/learning/theory/BookBlock'

const topic = (subtopicId: string, theory: TheoryBlock[]): TopicContent => ({ subtopicId, title: subtopicId, theory, questions: [] })
const text = (content: string): TheoryBlock => ({ type: 'text', content })

describe('complete existing lesson material', () => {
  for (const module of MODULES) {
    it(`${module.code}: every existing block stays ordered in the book and renders`, () => {
      for (const subtopic of module.subtopics) {
        const original = getTopicContent(subtopic.id)
        if (!original) continue // Server-only editions have independent API tests.
        const complete = completeLessonReader(original, null)!
        expect(complete.theory.slice(0, original.theory.length)).toEqual(original.theory)
        expect(complete.questions).toBe(original.questions)
        const sections = complete.source ? splitSections(complete.theory) : splitAdaptiveSections(complete.theory)
        expect(sections.flatMap(section => section.blocks)).toEqual(complete.theory)
        for (const [index, block] of complete.theory.entries()) {
          const html = renderToStaticMarkup(<BookBlock block={block} index={index} />)
          expect(html, `${subtopic.id} block ${index} (${block.type})`).not.toBe('')
        }
        if (module.code === 'M15') {
          for (const note of getPedagogyStudyNotes(subtopic.id)) expect(complete.theory).toContainEqual(note)
        }
      }
    })
  }

  it('M15 keeps the curated book and appends only the marked source corpus', () => {
    const local = topic('M15.08', [text('Curated core')])
    const remote = {
      ...topic('M15.08', [text('Old short server summary')]),
      supplementalTheory: [text('Source-backed corpus')],
    }
    const result = completeLessonReader(local, remote)!
    expect(result.theory[0]).toEqual(local.theory[0])
    expect(result.theory).not.toContainEqual(remote.theory[0])
    expect(result.theory).toContainEqual(remote.supplementalTheory[0])
    for (const note of getPedagogyStudyNotes('M15.08')) expect(result.theory).toContainEqual(note)
  })

  it('M02 admits only the verified addendum, not an old short summary', () => {
    const local = topic('M02.01', [text('Complete curated textbook')])
    const remote = topic('M02.01', [text('Old short summary'), { type: 'heading', content: 'Tekshirilgan qo‘shimcha: OMR' }, text('OMR explanation')])
    const result = completeLessonReader(local, remote)!
    expect(result.theory).toContainEqual(local.theory[0])
    expect(result.theory).not.toContainEqual(remote.theory[0])
    expect(result.theory).toContainEqual(remote.theory[2])
  })

  it('keeps repeated teaching steps within a source, removes only exact cross-source duplicates', () => {
    const repeated = text('Repeat the practice')
    const local = topic('M16.01', [repeated, text('Unique local')])
    const remote = topic('M16.01', [repeated, repeated, text('Unique published')])
    expect(completeLessonReader(local, remote)!.theory.filter(block => block.content === repeated.content)).toHaveLength(2)
  })

  it('handles unavailable and remote-only lessons without inventing content', () => {
    expect(completeLessonReader(undefined, null)).toBeUndefined()
    const remote = topic('M16.04', [text('Remote only')])
    expect(completeLessonReader(undefined, remote)?.theory).toEqual(remote.theory)
  })

  it('never deletes irregular Markdown table rows', () => {
    const result = markdownToTheoryBlocks('| A | B |\n|---|---|\n| Short |\n| Longer | row | extra data |')
    expect(result[0].rows).toEqual([['Short'], ['Longer', 'row', 'extra data']])
  })

  it('renders box introductory text as well as its child blocks', () => {
    render(<BookBlock index={0} block={{ type: 'example', content: 'Example context', children: [text('Example steps')] }} />)
    expect(screen.getByText('Example context')).toBeInTheDocument()
    expect(screen.getByText('Example steps')).toBeInTheDocument()
  })

  it('retains legacy table text when structured table parsing is impossible', () => {
    render(<BookBlock index={0} block={{ type: 'table', content: 'Old table explanation' }} />)
    expect(screen.getByText('Old table explanation')).toBeInTheDocument()
  })

  it('switches from the last page of a long lesson to the first page of a short one', () => {
    const props = { questionCount: 0, onFinishReading: vi.fn() }
    const long = topic('M11.01', Array.from({ length: 12 }, (_, n) => text(`Long ${n}`)))
    const { rerender } = render(<BookReader {...props} content={long} />)
    fireEvent.click(screen.getAllByRole('tab').at(-1)!)
    expect(screen.getByText('Long 11')).toBeInTheDocument()
    expect(screen.getByText('Bobning oxirgi bo‘limi')).toBeInTheDocument()
    rerender(<BookReader {...props} content={topic('M16.01', [text('Short lesson')])} />)
    expect(screen.getByText('Short lesson')).toBeInTheDocument()
    expect(screen.queryByText('Long 11')).not.toBeInTheDocument()
  })
  it('resets safely when source metadata changes under the unified pagination contract', () => {
    const content = topic('M11.01', Array.from({ length: 9 }, (_, n) => text(`Shared ${n}`)))
    const props = { questionCount: 0, onFinishReading: vi.fn() }
    const { rerender } = render(<BookReader {...props} content={content} />)
    fireEvent.click(screen.getAllByRole('tab').at(-1)!)
    rerender(<BookReader {...props} content={{ ...content, source: 'Named textbook' }} />)
    expect(screen.getByText('Shared 0')).toBeInTheDocument()
    expect(screen.queryByText('Shared 8')).not.toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true')
  })

})
