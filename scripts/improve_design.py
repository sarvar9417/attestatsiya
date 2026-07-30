#!/usr/bin/env python3
"""Apply visual design improvements to the learning pages"""

import re

# ─── 1. IMPROVE TOPICVIEW: enhance table rendering ──────────────
with open('src/components/learning/TopicView.tsx', 'r') as f:
    tv = f.read()

# Replace the table rendering in TheoryBlock to use enhanced styles
old_table = '''    case 'table':
      return (
        <div className=\"rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm group hover:shadow-md transition-all duration-300 overflow-hidden\">
          <div className=\"flex items-center gap-2.5 px-5 py-3 bg-gray-50 dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800\">
            <div className={`w-7 h-7 rounded-lg ${cfg.badge} flex items-center justify-center`}>
              <Icon size={14} />
            </div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${cfg.accent}`}>Jadval</span>
          </div>
          <div className=\"overflow-x-auto\">
            <table className=\"w-full text-sm\">
              {(() => {
                const rows = block.content.split('\\\\n').filter(r => r.trim())
                if (rows.length < 2) return null
                // Row 0: header row, Row 1: separator (---|---), Row 2+: data
                const headerCells = rows[0].split('|').filter(c => c.trim())
                const dataRows = rows.slice(2)
                return (
                  <>
                    <thead>
                      <tr className=\"bg-gray-50 dark:bg-gray-800/50\">
                        {headerCells.map((cell, ci) => (
                          <th key={ci} className=\"px-5 py-3.5 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700\">
                            {cell.trim()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataRows.map((row, ri) => {
                        const cells = row.split('|').filter(c => c.trim())
                        return (
                          <tr key={ri} className=\"border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors\">
                            {cells.map((cell, ci) => (
                              <td key={ci} className={`px-5 py-3 text-sm ${
                                ci === 0 
                                  ? 'font-medium text-gray-800 dark:text-gray-200' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {cell.trim()}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </>
                )
              })()}
            </table>
          </div>
        </div>
      )'''

new_table = '''    case 'table':
      return (
        <div className=\"rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm group hover:shadow-md transition-all duration-300 overflow-hidden\">
          <div className=\"flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 border-b border-gray-100 dark:border-gray-800\">
            <div className={`w-7 h-7 rounded-lg ${cfg.badge} flex items-center justify-center`}>
              <Icon size={14} />
            </div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${cfg.accent}`}>Jadval</span>
            <div className=\"flex-1\" />
            <span className=\"text-[10px] text-gray-400\">{block.content.split('\\\\n').filter(r => r.trim()).length - 2} qator</span>
          </div>
          <div className=\"overflow-x-auto\">
            <table className=\"content-table\">
              {(() => {
                const rows = block.content.split('\\\\n').filter(r => r.trim())
                if (rows.length < 2) return null
                const headerCells = rows[0].split('|').filter(c => c.trim())
                const dataRows = rows.slice(2)
                return (
                  <>
                    <thead>
                      <tr>
                        {headerCells.map((cell, ci) => (
                          <th key={ci}>{cell.trim()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataRows.map((row, ri) => {
                        const cells = row.split('|').filter(c => c.trim())
                        return (
                          <tr key={ri}>
                            {cells.map((cell, ci) => (
                              <td key={ci} className={ci === 0 ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}>
                                {cell.trim()}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </>
                )
              })()}
            </table>
          </div>
        </div>
      )'''

if old_table in tv:
    tv = tv.replace(old_table, new_table)
    print("✅ TopicView: table rendering enhanced")
else:
    print("⚠️ TopicView: table pattern not found")

# ─── 2. IMPROVE TOPICVIEW: Add section dividers between blocks ──
old_blocks = '''          {/* ── Theory Content Blocks ── */}
          <div className=\"space-y-6 mb-8\">
            {content.theory.map((block, i) => (
              <div key={i} data-section-index={i} className=\"animate-fade-in\" style={{ animationDelay: `${i * 80}ms` }}>
                <TheoryBlock block={block} />
              </div>
            ))}
          </div>'''

new_blocks = '''          {/* ── Theory Content Blocks ── */}
          <div className=\"space-y-3 mb-8\">
            {content.theory.map((block, i) => (
              <div key={i} data-section-index={i} className=\"animate-block-entrance\" style={{ animationDelay: `${i * 60}ms` }}>
                {/* Section divider (except first) */}
                {i > 0 && (
                  <div className=\"content-divider\">
                    <div className=\"content-divider-icon\">
                      <div className=\"w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600\" />
                    </div>
                  </div>
                )}
                <TheoryBlock block={block} />
              </div>
            ))}
          </div>'''

if old_blocks in tv:
    tv = tv.replace(old_blocks, new_blocks)
    print("✅ TopicView: section dividers added")
else:
    print("⚠️ TopicView: blocks section not found")

with open('src/components/learning/TopicView.tsx', 'w') as f:
    f.write(tv)

# ─── 3. IMPROVE MODULEPAGE: enhance subtopic cards ──────────────
with open('src/pages/ModulePage.tsx', 'r') as f:
    mp = f.read()

# Add hover glass effect and better progress visualization to subtopic cards
old_subtopic_card_start = '''            <button
              key={st.id}
              onClick={() => setActiveSubtopicId(st.id)}
              className={`w-full text-left group transition-all duration-200 ${
                done 
                  ? 'bg-white dark:bg-gray-800/80 border-emerald-200 dark:border-emerald-800/50' 
                  : 'bg-white dark:bg-gray-800/80 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md'
              } rounded-2xl border p-4 sm:p-5 shadow-sm`}'''

new_subtopic_card_start = '''            <button
              key={st.id}
              onClick={() => setActiveSubtopicId(st.id)}
              className={`w-full text-left group transition-all duration-300 ${
                done 
                  ? 'bg-white dark:bg-gray-800/80 border-emerald-200 dark:border-emerald-800/50' 
                  : 'bg-white dark:bg-gray-800/80 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-xl hover:-translate-y-0.5'
              } rounded-2xl border p-4 sm:p-5 shadow-sm`}'''

if old_subtopic_card_start in mp:
    mp = mp.replace(old_subtopic_card_start, new_subtopic_card_start)
    print("✅ ModulePage: subtopic cards enhanced")
else:
    print("⚠️ ModulePage: card pattern not found")

# Enhance the progress bar section - add gradient accent
old_progress_header = '''      <div className=\"bg-white dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mb-6 shadow-sm\">
        <div className=\"flex items-center justify-between mb-3\">
          <div className=\"flex items-center gap-2.5\">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              completedCount === totalTopics ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-primary-100 dark:bg-primary-900/30'
            }`}>
              {completedCount === totalTopics 
                ? <Trophy size={18} className=\"text-emerald-600\" />
                : <Target size={18} className=\"text-primary-600\" />
              }
            </div>
            <div>
              <p className=\"text-sm font-semibold text-gray-900 dark:text-white\">
                {completedCount === totalTopics ? \"Modul to'liq o'zlashtirildi\" : \"O'zlashtirish darajasi\"}
              </p>
              <p className=\"text-xs text-gray-400\">{completedCount}/{totalTopics} mavzu bajarildi</p>
            </div>
          </div>
          <div className=\"text-right\">
            <div className=\"text-2xl font-bold text-primary-600\">{progressPercent}%</div>
          </div>
        </div>
        
        <div className=\"h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden\">
          <div 
            className=\"h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-700 ease-out\"
            style={{ width: `${progressPercent}%` }} 
          />
        </div>'''

new_progress_header = '''      <div className=\"relative overflow-hidden bg-white dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mb-6 shadow-sm\">
        {/* Decorative background pattern */}
        <div className=\"absolute inset-0 bg-pattern-dots opacity-50\" />
        <div className=\"relative\">
          <div className=\"flex items-center justify-between mb-3\">
            <div className=\"flex items-center gap-2.5\">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                completedCount === totalTopics ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-primary-100 dark:bg-primary-900/30'
              }`}>
                {completedCount === totalTopics 
                  ? <Trophy size={18} className=\"text-emerald-600\" />
                  : <Target size={18} className=\"text-primary-600\" />
                }
              </div>
              <div>
                <p className=\"text-sm font-semibold text-gray-900 dark:text-white\">
                  {completedCount === totalTopics ? \"Modul to'liq o'zlashtirildi\" : \"O'zlashtirish darajasi\"}
                </p>
                <p className=\"text-xs text-gray-400\">{completedCount}/{totalTopics} mavzu bajarildi</p>
              </div>
            </div>
            <div className=\"text-right\">
              <div className=\"text-2xl font-bold\">
                <span className=\"text-gradient\">{progressPercent}%</span>
              </div>
            </div>
          </div>
          
          <div className=\"h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden\">
            <div 
              className=\"h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-b2-500 transition-all duration-700 ease-out\"
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
          {/* Mini milestone dots */}
          <div className=\"flex justify-between px-0.5 mt-1\">
            {[0, 25, 50, 75, 100].map(p => (
              <div key={p} className={`milestone-dot ${
                progressPercent >= p ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'
              }`} />
            ))}
          </div>
        </div>'''

if old_progress_header in mp:
    mp = mp.replace(old_progress_header, new_progress_header)
    print("✅ ModulePage: progress section enhanced")
else:
    print("⚠️ ModulePage: progress pattern not found")

# Fix the closing tags - the old_progress_header replacement might leave extra div
# The original had: </div>       (closing the outer div)
# The new has:     </div>\n    </div>  (closing outer div + relative div)

with open('src/pages/ModulePage.tsx', 'w') as f:
    f.write(mp)

# ─── 4. ENHANCE DASHBOARDPAGE ────────────────────────────────────
with open('src/pages/DashboardPage.tsx', 'r') as f:
    dp = f.read()

# Add decorative pattern to hero header
old_hero_header = '''      <div className=\"relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white p-6 sm:p-8 shadow-xl\">
        <div className=\"absolute top-0 right-0 w-96 h-96 opacity-5\">
          <div className=\"absolute top-10 right-10 w-48 h-48 rounded-full bg-white\" />
          <div className=\"absolute top-28 right-28 w-24 h-24 rounded-full bg-primary-400\" />
        </div>'''

new_hero_header = '''      <div className=\"relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white p-6 sm:p-8 shadow-xl\">
        {/* Animated background orbs */}
        <div className=\"absolute top-0 right-0 w-96 h-96 opacity-5\">
          <div className=\"absolute top-10 right-10 w-48 h-48 rounded-full bg-white animate-pulse-slow\" />
          <div className=\"absolute top-28 right-28 w-24 h-24 rounded-full bg-primary-400 animate-pulse-slow\" style={{ animationDelay: '1s' }} />
          <div className=\"absolute top-40 right-40 w-16 h-16 rounded-full bg-b2-400 animate-pulse-slow\" style={{ animationDelay: '2s' }} />
        </div>
        {/* Grid pattern overlay */}
        <div className=\"absolute inset-0 opacity-[0.03]\">
          <div className=\"absolute inset-0\" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>'''

if old_hero_header in dp:
    dp = dp.replace(old_hero_header, new_hero_header)
    print("✅ DashboardPage: hero header enhanced")
else:
    print("⚠️ DashboardPage: hero pattern not found")

with open('src/pages/DashboardPage.tsx', 'w') as f:
    f.write(dp)

print("\n🎨 Barcha dizayn yaxshilanishlari qo'llanildi!")
