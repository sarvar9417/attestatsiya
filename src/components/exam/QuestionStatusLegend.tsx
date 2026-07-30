export default function QuestionStatusLegend() {
  const items = [
    { label: 'Joriy', color: 'ring-2 ring-primary bg-primary/5' },
    { label: 'Bajarilgan', color: 'bg-success/10 border-success/30' },
    { label: 'Belgilangan', color: 'bg-warning/10 border-warning/30' },
    { label: 'Qolgan', color: 'bg-muted border-border' },
  ]

  return (
    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-sm border ${item.color}`} />
          <span className="text-[10px] text-muted-foreground font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
