import { type HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

/** Base skeleton block with shimmer */
export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`rounded-xl skeleton-shimmer ${className}`}
      {...props}
    />
  )
}

/** Skeleton for a single line of text (default ~80% width) */
export function SkeletonLine({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-4 ${className || 'w-4/5'}`} />
}

/** Skeleton for a block of text (2-3 lines) */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  const widths = ['w-full', 'w-11/12', 'w-3/4', 'w-2/3', 'w-5/6']
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonLine key={i} className={widths[i % widths.length]} />
      ))}
    </div>
  )
}

/** Skeleton avatar (circle) */
export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton className="rounded-full" style={{ width: size, height: size }} />
}

/** Skeleton card (full card shape) */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card !p-4 space-y-3 ${className}`}>
      <SkeletonLine className="w-1/3" />
      <SkeletonText lines={2} />
      <SkeletonLine className="w-1/2" />
    </div>
  )
}

/** Skeleton for stat/metric cards (icon + value + label) */
export function SkeletonStatCard() {
  return (
    <div className="card !p-4 flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonLine className="w-16" />
        <SkeletonLine className="w-12 h-3" />
      </div>
    </div>
  )
}

/** Skeleton for a skill ring (circular progress) */
export function SkeletonSkillRing({ size = 80 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="rounded-full" style={{ width: size, height: size }} />
      <SkeletonLine className="w-14 h-3" />
    </div>
  )
}

/** Skeleton button */
export function SkeletonButton({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-10 rounded-xl ${className || 'w-24'}`} />
}

/** Skeleton for a sidebar link item */
export function SkeletonSidebarItem() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <Skeleton className="w-5 h-5 rounded-lg" />
      <SkeletonLine className="w-24 h-3" />
    </div>
  )
}
