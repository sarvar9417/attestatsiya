import type { Rating } from '../../services/vocabularyService'

export interface RatingConfigItem {
  key: Rating
  label: string
  emoji: string
  color: string
  bg: string
}

export const RATING_CONFIG: RatingConfigItem[] = [
  { key: 'yodladim',  label: 'Yodladim',  emoji: '⭐', color: 'text-yellow-600', bg: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-300' },
  { key: 'bildim',    label: 'Bildim',    emoji: '😊', color: 'text-green-600', bg: 'bg-green-50 hover:bg-green-100 border-green-200' },
  { key: 'qiynaldim', label: 'Qiynaldim', emoji: '🤔', color: 'text-orange-600', bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
  { key: 'bilmadim',  label: 'Bilmadim',  emoji: '😕', color: 'text-red-600', bg: 'bg-red-50 hover:bg-red-100 border-red-200' },
]
