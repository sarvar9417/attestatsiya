import { lazy, Suspense } from 'react'

const PersonalVocabularyPage = lazy(() => import('../components/personalVocabulary/PersonalVocabularyPage'))

export default function PersonalVocabulary() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full" /></div>}>
      <PersonalVocabularyPage />
    </Suspense>
  )
}
