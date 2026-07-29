import type { ReactNode } from 'react'
import { Skeleton, SkeletonLine, SkeletonCard, SkeletonStatCard, SkeletonButton, SkeletonSkillRing } from './Skeleton'

/** Full-page skeleton wrapper */
function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto animate-pulse">
      {children}
    </div>
  )
}

/** Skeleton for the Dashboard page */
export function DashboardSkeleton() {
  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto space-y-5">
      {/* TopBar */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonLine className="w-48 h-5" />
          <SkeletonLine className="w-32 h-3" />
        </div>
        <Skeleton className="w-20 h-9 rounded-xl" />
      </div>

      {/* Today's Progress - Skill rings */}
      <div className="card !p-5">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonSkillRing key={i} size={70} />
            ))}
          </div>
          <Skeleton className="w-16 h-14 rounded-xl" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today Plan */}
        <div className="card !p-4 space-y-3">
          <SkeletonLine className="w-28 h-4" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
              <SkeletonLine className="w-5/6 h-3" />
            </div>
          ))}
        </div>

        {/* Time Tracker */}
        <div className="card !p-4 space-y-3">
          <SkeletonLine className="w-24 h-4" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <SkeletonLine className="w-full h-2" />
              <SkeletonLine className="w-3/4 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

/** Skeleton for Grammar page */
export function GrammarSkeleton() {
  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <SkeletonLine className="w-40 h-5" />
          <SkeletonLine className="w-56 h-3" />
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </PageWrapper>
  )
}

/** Skeleton for Vocabulary page */
export function VocabularySkeleton() {
  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <SkeletonLine className="w-40 h-5" />
          <SkeletonLine className="w-48 h-3" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <SkeletonButton key={i} className="w-20" />
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="card !p-4 mb-3 flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <SkeletonLine className="w-32 h-4" />
            <SkeletonLine className="w-48 h-3" />
          </div>
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
      ))}
    </PageWrapper>
  )
}

/** Skeleton for Dictionary page */
export function DictionarySkeleton() {
  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <SkeletonLine className="w-40 h-5" />
          <SkeletonLine className="w-56 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-11 rounded-xl mb-4" />
      <div className="flex gap-2 mb-4">
        {['A1','A2','B1','B2'].map((_, i) => (
          <SkeletonButton key={i} className="w-14" />
        ))}
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card !p-4 mb-2 flex items-center justify-between">
          <div className="space-y-1.5">
            <SkeletonLine className="w-24 h-4" />
            <SkeletonLine className="w-36 h-3" />
          </div>
          <Skeleton className="w-10 h-6 rounded-lg" />
        </div>
      ))}
    </PageWrapper>
  )
}

/** Skeleton for Progress page */
export function ProgressSkeleton() {
  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <SkeletonLine className="w-40 h-5" />
          <SkeletonLine className="w-48 h-3" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
      <SkeletonCard />
    </PageWrapper>
  )
}

/** Skeleton for MockTest page */
export function MockTestSkeleton() {
  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <SkeletonLine className="w-40 h-5" />
          <SkeletonLine className="w-48 h-3" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </PageWrapper>
  )
}

/** Skeleton for Reading page */
export function ReadingSkeleton() {
  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <SkeletonLine className="w-40 h-5" />
          <SkeletonLine className="w-48 h-3" />
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </PageWrapper>
  )
}

/** Skeleton for Listening page */
export function ListeningSkeleton() {
  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <SkeletonLine className="w-40 h-5" />
          <SkeletonLine className="w-48 h-3" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </PageWrapper>
  )
}

/** Skeleton for Achievements page */
export function AchievementsSkeleton() {
  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <SkeletonLine className="w-40 h-5" />
          <SkeletonLine className="w-48 h-3" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </PageWrapper>
  )
}

/** Skeleton for Leaders page */
export function LeadersSkeleton() {
  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <SkeletonLine className="w-40 h-5" />
          <SkeletonLine className="w-48 h-3" />
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card !p-4 flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <SkeletonLine className="w-32 h-4" />
              <SkeletonLine className="w-20 h-3" />
            </div>
            <Skeleton className="w-12 h-6 rounded-full" />
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}

/** Simple centered loading indicator (for standalone or inline use) */
export function SimpleLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <div className="skeleton-shimmer h-3 w-28 rounded" />
      </div>
    </div>
  )
}

/** Skeleton for DailyLesson page (LearnHub grammar tab) */
export function DailyLessonSkeleton() {
  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-5 animate-pulse">
      {/* Header — sparkles + title */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <SkeletonLine className="w-40 h-5" />
          <SkeletonLine className="w-56 h-3" />
        </div>
      </div>

      {/* Demo gradient card — 2 buttons */}
      <Skeleton className="w-full h-28 rounded-2xl" />

      {/* Progress overview card */}
      <div className="card !p-4">
        {/* Trophy + title row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-5 h-5 rounded" />
            <SkeletonLine className="w-32 h-4" />
          </div>
          <SkeletonLine className="w-14 h-3" />
        </div>

        {/* 3 stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-1">
              <Skeleton className="w-12 h-8 rounded mx-auto" />
              <SkeletonLine className="w-16 h-2 mx-auto" />
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <SkeletonLine className="w-20 h-3" />
            <SkeletonLine className="w-8 h-3" />
          </div>
          <Skeleton className="w-full h-2.5 rounded-full" />
        </div>

        {/* Dots grid — ~90 dots in 9 rows of 10 */}
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 30 }, (_, i) => (
            <Skeleton key={i} className="w-5 h-5 rounded-full" />
          ))}
        </div>
      </div>

      {/* Lesson list items — 4 detailed cards */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card !p-3 sm:!p-5">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                {/* Day badge */}
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="space-y-1.5">
                  <SkeletonLine className="w-36 h-4" />
                  <SkeletonLine className="w-48 h-3" />
                </div>
              </div>
              {/* Level badge + progress % */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Skeleton className="w-10 h-5 rounded-full" />
                <Skeleton className="w-9 h-5 rounded-full" />
              </div>
            </div>
            {/* Stats row: formulas, vocab, exercises, XP */}
            <div className="flex items-center gap-4 mb-3">
              <SkeletonLine className="w-20 h-3" />
              <SkeletonLine className="w-20 h-3" />
              <SkeletonLine className="w-20 h-3" />
            </div>
            {/* CTA row */}
            <div className="flex items-center justify-between">
              <SkeletonLine className="w-16 h-4" />
              <SkeletonLine className="w-20 h-3" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom tip card */}
      <Skeleton className="w-full h-14 rounded-2xl" />
    </div>
  )
}

/** Skeleton for Writing page */
export function WritingSkeleton() {
  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <SkeletonLine className="w-32 h-5" />
          <SkeletonLine className="w-40 h-3" />
        </div>
      </div>
      {/* Prompt card */}
      <SkeletonCard className="mb-4" />
      {/* Tips card */}
      <div className="card !p-4 bg-b2-50 mb-4">
        <SkeletonLine className="w-36 h-3 mb-2" />
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <SkeletonLine key={i} className="w-5/6 h-2" />
          ))}
        </div>
      </div>
      {/* Editor skeleton */}
      <div className="card !p-4 mb-3">
        <Skeleton className="w-full h-56 rounded-xl mb-3" />
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <SkeletonLine className="w-20 h-3" />
          <Skeleton className="w-32 h-1.5 rounded-full" />
        </div>
      </div>
      <SkeletonButton className="w-full" />
    </PageWrapper>
  )
}

/** Skeleton for Speaking page */
export function SpeakingSkeleton() {
  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <SkeletonLine className="w-32 h-5" />
          <SkeletonLine className="w-52 h-3" />
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </PageWrapper>
  )
}

/** Skeleton for ResetPassword page */
export function ResetPasswordSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card shadow-xl p-6 space-y-4">
          <div className="text-center space-y-3">
            <Skeleton className="w-14 h-14 rounded-full mx-auto" />
            <SkeletonLine className="w-44 h-5 mx-auto" />
            <SkeletonLine className="w-32 h-3 mx-auto" />
          </div>
          <Skeleton className="w-full h-11 rounded-xl" />
          <Skeleton className="w-full h-11 rounded-xl" />
          <SkeletonButton className="w-full" />
        </div>
      </div>
    </div>
  )
}
