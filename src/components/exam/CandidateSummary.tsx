import { CANDIDATE } from './exam-data'

export default function CandidateSummary() {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
          {CANDIDATE.initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {CANDIDATE.firstName} {CANDIDATE.lastName}
          </p>
          <p className="text-[11px] text-muted-foreground truncate font-mono">
            ID: {CANDIDATE.id}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
        <span className="text-muted-foreground">Fan:</span>
        <span className="text-foreground font-medium text-right">{CANDIDATE.subject}</span>
        <span className="text-muted-foreground">Guruh:</span>
        <span className="text-foreground font-medium text-right truncate">{CANDIDATE.group}</span>
      </div>
    </div>
  )
}
