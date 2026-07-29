export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1 pt-1">
      {children}
    </p>
  )
}
