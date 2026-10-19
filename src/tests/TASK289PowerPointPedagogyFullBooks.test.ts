import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M03_08_CANONICAL_BOOK, M03_09_CANONICAL_BOOK, M03_10_CANONICAL_BOOK } from '../data/topics/m03PowerPointCanonicalBooks'
import { M15_07_CANONICAL_BOOK, M15_08_CANONICAL_BOOK } from '../data/topics/m15AbilitiesTechnologyCanonicalBooks'
import { M03_OFFICE_TEXTBOOK_ADDITIONS } from '../data/topics/m03OfficeTextbookAdditions'
import { withPedagogyStudyNotes, getPedagogyStudyNotes } from '../data/pedagogyStudyNotes'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-289 PowerPoint and pedagogy canonical book coverage', () => {
  const cases = [
    {id:'M03.08', book:M03_08_CANONICAL_BOOK, min:52},
    {id:'M03.09', book:M03_09_CANONICAL_BOOK, min:52},
    {id:'M03.10', book:M03_10_CANONICAL_BOOK, min:51},
    {id:'M15.07', book:M15_07_CANONICAL_BOOK, min:52},
    {id:'M15.08', book:M15_08_CANONICAL_BOOK, min:53},
  ] as const
  for(const {id,book,min} of cases){
    it(`${id} opens in deep, structured BookReader and keeps source trace`,()=>{
      const topic=getTopicContent(id)!
      expect(topic).toBeDefined()
      expect(topic.kind).toBe('chapter')
      expect(topic.source).toBeTruthy()
      expect(book.length).toBeGreaterThanOrEqual(min)
      expect(book.filter(x=>x.type==='heading')).toHaveLength(12)
      for(const kind of ['goal','intro','definition','table','case','trap','task','answers','summary','source']){
        expect(book.some(x=>x.type===kind),`${id} missing ${kind}`).toBe(true)
      }
      expect(topic.theory.slice(0,book.length)).toEqual(book)
      expect(splitSections(topic.theory).flatMap(x=>x.blocks)).toEqual(topic.theory)
      expect(book.at(-1)?.content).toContain('drive.google.com')
    })
  }
  for(const [id,book] of [['M03.08',M03_08_CANONICAL_BOOK],['M03.09',M03_09_CANONICAL_BOOK],['M03.10',M03_10_CANONICAL_BOOK]] as const){
    it(`${id} retains existing exam questions and reviewed source appendix`,()=>{
      const topic=getTopicContent(id)!
      expect(topic.questions).toHaveLength(4)
      expect(topic.questions.map(q=>q.id)).toEqual([1,2,3,4].map(i=>`${id}-q${i}`))
      expect(topic.questions.every(q=>q.correctIndex>=0&&q.correctIndex<q.options.length)).toBe(true)
      const additions=M03_OFFICE_TEXTBOOK_ADDITIONS[id]
      expect(additions.length).toBeGreaterThan(0)
      expect(topic.theory).toHaveLength(book.length+additions.length)
      expect(topic.theory.slice(-additions.length)).toEqual(additions)
    })
  }
  for(const id of ['M15.07','M15.08']){
    it(`${id} does not leak professional answer keys and retains published source notes`,()=>{
      const topic=getTopicContent(id)!
      expect(topic.questions).toEqual([])
      const notes=getPedagogyStudyNotes(id)
      expect(notes.length).toBeGreaterThan(0)
      const enriched=withPedagogyStudyNotes(topic)
      expect(enriched.theory.slice(0,topic.theory.length)).toEqual(topic.theory)
      expect(enriched.theory.slice(-notes.length)).toEqual(notes)
      expect(enriched.questions).toBe(topic.questions)
    })
  }
  it('does not overwrite subsequent brief-lesson modules',()=>{
    for(const id of ['M13.09','M13.10']){
      const topic=getTopicContent(id)!
      expect(topic.theory[0]).not.toEqual(M03_08_CANONICAL_BOOK[0])
      expect(topic.theory[0]).not.toEqual(M15_08_CANONICAL_BOOK[0])
    }
  })
})
