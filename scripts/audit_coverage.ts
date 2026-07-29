import { loadAllLessons } from '../src/data/dailyLessons'

async function main() {
  const all = await loadAllLessons()
  console.log('Total lessons:', all.length)
  
  const gaps: string[] = []
  
  for (const lesson of all) {
    const exercises = (lesson as any).exercises || []
    const tests = (lesson as any).tests || []
    const specialCases = (lesson as any).specialCases || []
    const formulas = (lesson as any).formulas || []
    const rules = (lesson as any).rules || []
    const vocab = (lesson as any).vocabulary || []
    
    let totalDrills = 0
    for (const sc of specialCases) {
      totalDrills += (sc.drills || []).length
    }
    
    const formulaMin = formulas.length * 3
    const ruleMin = rules.length * 2
    const estimatedMin = formulaMin + ruleMin + 5
    
    const totalEx = exercises.length + tests.length + totalDrills
    
    const status = totalEx >= estimatedMin ? '\u2705' : totalEx >= estimatedMin * 0.7 ? '\u26A0\uFE0F' : '\u274C'
    
    console.log(status + ' ' + (lesson as any).level + ' Day ' + lesson.day + ': ' + (lesson as any).title)
    console.log('   F=' + formulas.length + ' R=' + rules.length + ' V=' + vocab.length)
    console.log('   Ex=' + exercises.length + ' Ts=' + tests.length + ' Dr=' + totalDrills + ' Total=' + totalEx + ' min=' + estimatedMin)
    
    if (totalEx < estimatedMin) {
      gaps.push((lesson as any).level + ' Day ' + lesson.day + ' ' + (lesson as any).title + ': ' + totalEx + ' < ' + estimatedMin)
    }
  }
  
  console.log()
  console.log('=== GAPS (' + gaps.length + ') ===')
  for (const g of gaps) console.log('  ' + g)
  if (gaps.length === 0) console.log('  ✅ No coverage gaps!')
}

main().catch(console.error)
