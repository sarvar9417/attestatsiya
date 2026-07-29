import { Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'

function SafePage({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}

interface RouteItem {
  path: string
  element: React.ReactNode
}

export function buildRoutes(lazyPages: Record<string, React.LazyExoticComponent<React.ComponentType<unknown>>>) {
  const P = lazyPages
  const safe = (el: React.ReactNode) => <SafePage>{el}</SafePage>

  const mainRoutes: RouteItem[] = [
    { path: '/', element: safe(<P.Dashboard />) },
    { path: '/lesson', element: safe(<P.LearnHub />) },
    { path: '/lesson/level/:level', element: safe(<P.LearnHub />) },
    { path: '/lesson/:lessonId', element: safe(<P.LearnHub />) },
    { path: '/grammar', element: safe(<P.Grammar />) },
    { path: '/vocabulary', element: safe(<P.VocabHub />) },
    { path: '/mock-test', element: safe(<P.MockTest />) },
    { path: '/mixed-review', element: safe(<P.MixedReview />) },
    { path: '/active-recall', element: safe(<P.ActiveRecall />) },
    { path: '/vocab-battle', element: safe(<P.VocabBattle />) },
    { path: '/tandem', element: safe(<P.TandemPage />) },
    { path: '/add/:code', element: safe(<P.InvitePage />) },
    { path: '/phrasal-verbs', element: safe(<P.PhrasalVerbs />) },
    { path: '/idioms', element: safe(<P.Idioms />) },
    { path: '/confusable-pairs', element: safe(<P.Confusable />) },
    { path: '/chat', element: safe(<P.Chat />) },
    { path: '/conversation', element: safe(<P.Conversation />) },
    { path: '/pronunciation', element: safe(<P.Pronunciation />) },
    { path: '/ai-practice', element: safe(<P.AiPractice />) },
    { path: '/listening', element: safe(<P.Listening />) },
    { path: '/speaking', element: <Navigate to="/speaking-path?tab=free" replace /> },
    { path: '/speaking-path', element: safe(<P.SpeakingPath />) },
    { path: '/placement-test', element: safe(<P.PlacementTest />) },
    { path: '/reading', element: safe(<P.Reading />) },
    { path: '/writing', element: safe(<P.Writing />) },
    { path: '/skills', element: safe(<P.SkillsPage />) },
    { path: '/personal-vocabulary', element: safe(<P.PersonalVocabulary />) },
    { path: '/films', element: safe(<P.FilmHub />) },
    { path: '/films/:id', element: safe(<P.FilmDetail />) },
    { path: '/profile', element: safe(<P.Profile />) },
    { path: '/review', element: safe(<P.GrammarReview />) },
    { path: '/reset-password', element: safe(<P.ResetPassword />) },
    { path: '/ielts', element: safe(<P.IeltsMockTest />) },
    { path: '/weekly-plan', element: safe(<P.WeeklyPlan />) },
  ]

  const redirectRoutes: RouteItem[] = [
    { path: '/achievements', element: <Navigate to="/profile" replace /> },
    { path: '/progress', element: <Navigate to="/profile" replace /> },
    { path: '/leaders', element: <Navigate to="/profile" replace /> },
    { path: '/roadmap', element: <Navigate to="/" replace /> },
    { path: '/league', element: <Navigate to="/" replace /> },
    { path: '/friends', element: <Navigate to="/" replace /> },
    { path: '/practice', element: <Navigate to="/vocabulary" replace /> },
    { path: '/business-english', element: <Navigate to="/lesson" replace /> },
    // 30-Day Challenge — hozircha arxivda (sahifa/data kodi saqlangan, nav va route yashirilgan)
    { path: '/30-day-challenge', element: <Navigate to="/" replace /> },
  ]

  return (
    <Routes>
      {mainRoutes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}
      {redirectRoutes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}
      <Route path="*" element={safe(<P.NotFound />)} />
    </Routes>
  )
}
