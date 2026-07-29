import filmsData from './filmVocabulary.json'

export interface FilmWord {
  word: string
  translation: string
  phonetic: string
  example: string
  exampleUz: string
  level: 'A1' | 'A2' | 'B1' | 'B1+' | 'B2'
}

export interface FilmVocabulary {
  id: string
  title: string
  titleUz: string
  year: number
  genre: string
  description: string
  descriptionUz: string
  posterEmoji: string
  words: FilmWord[]
}

export const FILMS: FilmVocabulary[] = filmsData as FilmVocabulary[]

export function getFilmById(id: string): FilmVocabulary | undefined {
  return FILMS.find(f => f.id === id)
}

export function searchFilms(query: string): FilmVocabulary[] {
  const q = query.toLowerCase()
  return FILMS.filter(f =>
    f.title.toLowerCase().includes(q) ||
    f.titleUz.toLowerCase().includes(q) ||
    f.genre.toLowerCase().includes(q)
  )
}
