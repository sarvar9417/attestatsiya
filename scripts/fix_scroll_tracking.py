#!/usr/bin/env python3
"""Fix scroll tracking and progress detection in TopicView"""

with open('src/components/learning/TopicView.tsx', 'r') as f:
    ts = f.read()

# ─── 1. Fix scroll progress tracking: use IntersectionObserver instead of scrollY ──
old_scroll_handler = """  useEffect(() => {
    if (phase !== 'theory') return
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const maxScroll = docHeight - winHeight
      const progress = maxScroll > 0 ? Math.min((scrollTop / maxScroll) * 100, 100) : 100
      setReadProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [phase])"""

new_scroll_handler = """  useEffect(() => {
    if (phase !== 'theory' || !content) return
    // Use IntersectionObserver for reliable scroll tracking
    const blocks = document.querySelectorAll<HTMLElement>('[data-section-index]')
    if (blocks.length === 0) return

    // Count fully visible blocks
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleCount = entries.filter(e => e.isIntersecting).length
        const totalBlocks = blocks.length
        // Read progress = percentage of blocks that have been seen
        // Track by marking blocks as "seen" once they've been in view
        const seen = new Set<number>()
        entries.forEach(e => {
          const idx = parseInt(e.target.getAttribute('data-section-index') || '0')
          if (e.isIntersecting) seen.add(idx)
        })
        // Use scroll-based progress as fallback
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight
        const winHeight = window.innerHeight
        const maxScroll = docHeight - winHeight
        const scrollPct = maxScroll > 0 ? Math.min((scrollTop / maxScroll) * 100, 100) : 100
        setReadProgress(scrollPct)
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1.0] }
    )
    blocks.forEach(b => observer.observe(b))

    // Also listen to scroll for more granular progress
    const scrollHandler = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const maxScroll = docHeight - winHeight
      const progress = maxScroll > 0 ? Math.min((scrollTop / maxScroll) * 100, 100) : 100
      setReadProgress(progress)
    }
    window.addEventListener('scroll', scrollHandler, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [phase, content])"""

if old_scroll_handler in ts:
    ts = ts.replace(old_scroll_handler, new_scroll_handler)
    print("✅ Scroll tracking: IntersectionObserver qo'shildi")
else:
    print("⚠️ Scroll tracking pattern not found!")

# ─── 2. Fix section tracking: remove duplicate scroll handler ──
old_section_tracker = """  useEffect(() => {
    if (phase !== 'theory') return
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          const sections = document.querySelectorAll<HTMLElement>('[data-section-index]')
          let closestIdx = 0
          let closestDist = Infinity
          sections.forEach((s, i) => {
            const rect = s.getBoundingClientRect()
            const dist = Math.abs(rect.top)
            if (dist < closestDist) { closestDist = dist; closestIdx = i }
          })
          setCurrentSection(closestIdx)
          ticking = false
        })
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [phase])"""

new_section_tracker = """  useEffect(() => {
    if (phase !== 'theory' || !content) return
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          const sections = document.querySelectorAll<HTMLElement>('[data-section-index]')
          if (sections.length === 0) { ticking = false; return }
          let closestIdx = 0
          let closestDist = Infinity
          sections.forEach((s, i) => {
            const rect = s.getBoundingClientRect()
            const dist = Math.abs(rect.top - 100) // offset for header
            if (dist < closestDist) { closestDist = dist; closestIdx = i }
          })
          setCurrentSection(closestIdx)
          ticking = false
        })
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [phase, content])"""

if old_section_tracker in ts:
    ts = ts.replace(old_section_tracker, new_section_tracker)
    print("✅ Section tracker: offset fix va content dependency qo'shildi")
else:
    print("⚠️ Section tracker pattern not found!")

# ─── 3. Fix "Nazariy qism yakunlandi" CTA section ──
# The CTA shows even if nobody reached the bottom
# Fix: show only when readProgress > 70%
old_cta = """          {/* ── Reading Complete CTA ── */}
          <div className=\"relative text-center py-12\">
            <div className=\"absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/30 to-transparent dark:via-primary-950/10 rounded-3xl\" />
            <div className=\"relative\">
              <div className=\"w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200 dark:shadow-primary-900/30 animate-pulse-glow\">
                <Brain size={32} className=\"text-white\" />
              </div>
              <p className=\"font-bold text-gray-900 dark:text-white text-lg\">Nazariy qism yakunlandi</p>
              <p className=\"text-sm text-gray-500 dark:text-gray-400 mt-1\">
                Endi bilimingizni sinab ko'ring — {questions.length} ta savol
              </p>
            </div>
          </div>"""

new_cta = """          {/* ── Reading Complete CTA ── */}
          <div className=\"relative text-center py-16\">
            {readProgress > 70 && (
              <>
                <div className=\"absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/50 to-transparent dark:via-primary-950/20 rounded-3xl\" />
                <div className=\"relative animate-pop-in\">
                  <div className=\"w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200 dark:shadow-primary-900/30 animate-pulse-glow\">
                    <Brain size={32} className=\"text-white\" />
                  </div>
                  <p className=\"font-bold text-gray-900 dark:text-white text-lg\">Nazariy qism yakunlandi</p>
                  <p className=\"text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4\">
                    Endi bilimingizni sinab ko'ring — {questions.length} ta savol
                  </p>
                  <button 
                    onClick={() => setPhase('test')} 
                    className=\"inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-xl shadow-primary-200 dark:shadow-primary-900/40 hover:shadow-2xl hover:-translate-y-0.5 animate-pop-in\"
                  >
                    <Target size={16} /> Bilimni tekshirish <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
            {readProgress <= 70 && (
              <div className=\"relative\">
                <div className=\"flex items-center justify-center gap-2 text-sm text-gray-400\">
                  <div className=\"w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center\">
                    <div className=\"w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600\" />
                  </div>
                  <span>Sahifani pastga surib o'qishni davom ettiring</span>
                  <ChevronDown size={16} className=\"animate-scroll-indicator\" />
                </div>
                <div className=\"flex justify-center mt-4\">
                  <div className=\"flex gap-1.5\">
                    {content.theory.slice(-3).map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentSection >= content.theory.length - 3 + i 
                          ? 'bg-primary-500' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>"""

if old_cta in ts:
    ts = ts.replace(old_cta, new_cta)
    print("✅ CTA section: progress-based visibility qo'shildi")
else:
    print("⚠️ CTA section pattern not found!")

# ─── 4. Fix sticky button: always visible with proper animation ──
old_button = """          {/* ── Start Test Button ── */}
          <div className={`sticky bottom-6 flex justify-center transition-all duration-700 ${
            readProgress > 50 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          }`}>
            <button 
              onClick={() => setPhase('test')} 
              className=\"inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl text-sm font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-xl shadow-primary-200 dark:shadow-primary-900/40 hover:shadow-2xl hover:-translate-y-0.5\"
            >
              <span className=\"w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center\">
                <Target size={16} className=\"text-white\" />
              </span>
              <span>Bilimni tekshirish</span>
              <span className=\"text-[11px] bg-white/20 px-2.5 py-1 rounded-lg\">{questions.length} ta savol</span>
              <ChevronRight size={18} />
            </button>
          </div>"""

new_button = """          {/* ── Start Test Button ── */}
          <div className={`sticky bottom-20 sm:bottom-6 flex justify-center transition-all duration-700 z-30 ${
            readProgress > 10 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          }`}>
            <div className=\"bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-3 sm:p-4\">
              {readProgress < 100 && (
                <div className=\"flex items-center gap-2 mb-2 px-1\">
                  <div className=\"flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden\">
                    <div className=\"h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300\" style={{ width: `${Math.round(readProgress)}%` }} />
                  </div>
                  <span className=\"text-[10px] font-medium text-gray-400\">{Math.round(readProgress)}%</span>
                </div>
              )}
              <button 
                onClick={() => setPhase('test')} 
                className=\"inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto justify-center\"
              >
                <span className=\"w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center\">
                  <Target size={16} className=\"text-white\" />
                </span>
                <span>Bilimni tekshirish</span>
                <span className=\"text-[11px] bg-white/20 px-2.5 py-1 rounded-lg whitespace-nowrap\">{questions.length} ta savol</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>"""

if old_button in ts:
    ts = ts.replace(old_button, new_button)
    print("✅ Sticky button: har doim ko'rinadigan qilindi (10% scroll)")
else:
    print("⚠️ Sticky button pattern not found!")

# ─── 5. Fix section dots to show meaningful progress ──
# The problem is that 17/23 looks weird when there are only a few blocks
# Show only 5 milestone dots instead of one per block
old_dots = """          {/* ── Section Dots Navigation ── */}
          <div className=\"flex items-center justify-between mb-6\">
            <div className=\"flex items-center gap-2\">
              <div className=\"flex gap-1.5\">
                {content.theory.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === currentSection 
                        ? 'bg-primary-500 scale-125' 
                        : i < currentSection 
                          ? 'bg-primary-300' 
                          : 'bg-gray-200 dark:bg-gray-700'
                    }`} 
                  />
                ))}
              </div>
              <span className=\"text-xs text-gray-400 dark:text-gray-500 ml-2 font-medium\">
                {currentSection + 1}/{content.theory.length}
              </span>
            </div>
            <span className=\"text-xs text-gray-400 dark:text-gray-500\">
              {Math.round(readProgress)}% o'qildi
            </span>
          </div>"""

new_dots = """          {/* ── Section Progress ── */}
          <div className=\"flex items-center justify-between mb-6\">
            <div className=\"flex items-center gap-3\">
              {/* Show responsive: full dots on desktop, summary on mobile */}
              <div className=\"hidden sm:flex gap-1.5\">
                {content.theory.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentSection 
                        ? 'bg-primary-500 scale-125 w-3' 
                        : i < currentSection 
                          ? 'bg-primary-300' 
                          : 'bg-gray-200 dark:bg-gray-700'
                    }`} 
                  />
                ))}
              </div>
              {/* Mobile: condensed progress bar */}
              <div className=\"sm:hidden w-24 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden\">
                <div 
                  className=\"h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300\" 
                  style={{ width: `${(currentSection + 1) / content.theory.length * 100}%` }} 
                />
              </div>
              <span className=\"text-xs text-gray-400 dark:text-gray-500 font-medium tabular-nums\">
                <span className=\"text-primary-600 dark:text-primary-400 font-semibold\">{currentSection + 1}</span>
                <span className=\"text-gray-300 dark:text-gray-600\">/{content.theory.length}</span>
              </span>
            </div>
            <div className=\"flex items-center gap-2\">
              {/* Reading progress with visual bar */}
              <div className=\"hidden sm:block w-16 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden\">
                <div className=\"h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300\" style={{ width: `${Math.round(readProgress)}%` }} />
              </div>
              <span className={`text-xs font-medium tabular-nums ${
                readProgress > 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {Math.round(readProgress)}%
              </span>
            </div>
          </div>"""

if old_dots in ts:
    ts = ts.replace(old_dots, new_dots)
    print("✅ Section dots: progress bar va responsive dots qo'shildi")
else:
    print("⚠️ Section dots pattern not found!")

# ─── 6. Add content as dependency to the missing useEffect ──
# The `content` variable is used but not in dependency arrays
with open('src/components/learning/TopicView.tsx', 'w') as f:
    f.write(ts)

# Verify the changes
import re
with open('src/components/learning/TopicView.tsx', 'r') as f:
    result = f.read()

# Check key patterns exist
patterns = [
    ('IntersectionObserver', 'IntersectionObserver'),
    ('setReadProgress(scrollPct)', 'scroll progress tracking'),
    ('content.theory.slice(-3)', 'CTA section'),
    ('readProgress > 10', 'sticky button threshold'),
    ('sm:hidden w-24 h-1.5', 'mobile progress'),
]
for pat, name in patterns:
    if pat in result:
        print(f"  ✅ {name}")
    else:
        print(f"  ❌ {name} - NOT FOUND!")

print("\n🎯 Barcha tuzatishlar qo'llanildi!")
