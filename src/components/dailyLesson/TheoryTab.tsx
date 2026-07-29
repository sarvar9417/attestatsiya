import { Star, BookOpen, Lightbulb, MessageCircle, Target, Clock } from 'lucide-react'
import type { NavigateFunction } from 'react-router-dom'
import type { DailyLesson, ReadingSection, WritingSection, ListeningSection } from '../../data/dailyLessons'
import type { StoryBeat } from '../../data/narrative/storyline'
import { getConfusablePairs } from './lessonHelpers'
import FormulaRecallCard from './FormulaRecallCard'
import RuleCard from './RuleCard'
import VocabLearner from './VocabLearner'
import SpecialCaseCard from './SpecialCaseCard'
import MnemonicCard from './MnemonicCard'
import LessonImage from './LessonImage'
import StoryBeatCard from './StoryBeatCard'
import SpeakingPathLink from './SpeakingPathLink'
import ExamplesSection from './ExamplesSection'
import ConfusableBanner from './ConfusableBanner'
import DialogueCard from './DialogueCard'
import CulturalNoteCard from './CulturalNoteCard'

interface Props {
  lesson: DailyLesson & { reading?: ReadingSection; writing?: WritingSection; listening?: ListeningSection }
  storyBeat: StoryBeat | null
  navigate: NavigateFunction
  addXP: (amount: number) => void
  onVocabDone: (pushedCount: number) => void
}

export default function TheoryTab({ lesson, storyBeat, navigate, addXP, onVocabDone }: Props) {
  return (
    <div className="space-y-6">
      {/* Bugun nimani o'rganamiz? — Learning Objectives */}
      <div className="bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-primary-100 dark:border-primary-800">
        <div className="flex items-center gap-2 mb-3">
          <Target size={18} className="text-primary-600 dark:text-primary-400" />
          <h3 className="font-bold text-primary-800 dark:text-primary-200 text-sm">Bugun nimani o'rganamiz?</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {lesson.formulas.length > 0 && (
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="w-5 h-5 rounded bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-[10px] font-bold text-primary-600">{lesson.formulas.length}</span>
              formulalar
            </div>
          )}
          {lesson.vocabulary.length > 0 && (
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-[10px] font-bold text-emerald-600">{lesson.vocabulary.length}</span>
              yangi so'zlar
            </div>
          )}
          {lesson.exercises.length > 0 && (
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="w-5 h-5 rounded bg-amber-100 dark:bg-amber-800 flex items-center justify-center text-[10px] font-bold text-amber-600">{lesson.exercises.length}</span>
              mashqlar
            </div>
          )}
          {lesson.specialCases.length > 0 && (
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="w-5 h-5 rounded bg-rose-100 dark:bg-rose-800 flex items-center justify-center text-[10px] font-bold text-rose-600">{lesson.specialCases.length}</span>
              maxsus holatlar
            </div>
          )}
          {lesson.reading && (
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-[10px] font-bold text-blue-600">1</span>
              o'qish matni
            </div>
          )}
          {lesson.writing && (
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="w-5 h-5 rounded bg-violet-100 dark:bg-violet-800 flex items-center justify-center text-[10px] font-bold text-violet-600">1</span>
              yozish mashqi
            </div>
          )}
          {lesson.listening && (
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="w-5 h-5 rounded bg-orange-100 dark:bg-orange-800 flex items-center justify-center text-[10px] font-bold text-orange-600">1</span>
              tinglash mashqi
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <Clock size={12} />
          Taxminiy vaqt: ~{Math.max(5, Math.round((Array.isArray(lesson.exercises) ? lesson.exercises.length : 0) * 0.5 + (Array.isArray(lesson.vocabulary) ? lesson.vocabulary.length : 0) * 0.3 + (Array.isArray(lesson.tests) ? lesson.tests.length : 0) * 0.5 + 3))} daqiqa
        </div>
      </div>

      {/* O'rganish yo'li konteksti — dars boshida */}
      {storyBeat && <StoryBeatCard storyBeat={storyBeat} day={lesson.day} lessonId={lesson.id} />}

      {/* Lesson image — dars ochilganda eng tepada vizual sxema */}
      {lesson.image && <LessonImage filename={lesson.image} title={lesson.title} />}

      {/* 🎤 Speak this — Grammar Track ga link */}
      <SpeakingPathLink lessonId={lesson.id} navigate={navigate} />

      {/* Grammar: Formulas */}
      <div className="bg-gradient-to-br from-primary-600 to-b2-600 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📐</span>
            <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">Formulalar</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {lesson.formulas.map((row) => (
              <FormulaRecallCard key={row.label} label={row.label} structure={row.structure} color={row.color} explanation={row.explanation} example={row.example} whenToUse={row.whenToUse} pronunciation={row.pronunciation} />
            ))}
          </div>
        </div>
      </div>

      {/* Grammar: Rules */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
            <BookOpen size={14} className="text-primary-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qoidalar</p>
            <p className="text-[10px] text-gray-400">{lesson.rules.length} ta qoida — har birini diqqat bilan o'qing</p>
          </div>
        </div>
        {lesson.rules.map((r, i) => <RuleCard key={i} rule={r} index={i} />)}
      </div>

      {/* Special table (only comparatives-superlatives) */}
      {lesson.id === 'comparatives-superlatives' && (
        <div className="card border-primary-200">
          <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Star size={14} /> Tezkor eslatma — yodda saqlash uchun
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-primary-200 text-left text-xs text-primary-700 uppercase tracking-wider">
                  <th className="pb-2 pr-3">Sifat turi</th>
                  <th className="pb-2 pr-3">Comparative</th>
                  <th className="pb-2 pr-3">Superlative</th>
                  <th className="pb-2">Misol</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "1 bo'g'in (qisqa)", comp: 'adj + -er', sup: 'the adj + -est', ex: 'tall → taller → the tallest' },
                  { type: "-y bilan tugagan", comp: "-y → -i + -er", sup: "the -y → -i + -est", ex: 'happy → happier → the happiest' },
                  { type: "CVC (undosh+unli+undosh)", comp: 'undosh ikki marta + -er', sup: 'the undosh×2 + -est', ex: 'big → bigger → the biggest' },
                  { type: "-e bilan tugagan", comp: 'adj + -r', sup: 'the adj + -st', ex: 'large → larger → the largest' },
                  { type: "2+ bo'g'in (uzun)", comp: 'more + adj', sup: 'the most + adj', ex: 'expensive → more expensive → the most expensive' },
                  { type: "Noto'g'ri", comp: 'maxsus shakl', sup: 'maxsus shakl', ex: 'good → better → the best' },
                ].map((r) => (
                  <tr key={r.type} className="border-b border-gray-50">
                    <td className="py-1.5 pr-3 font-semibold text-gray-800 text-xs">{r.type}</td>
                    <td className="py-1.5 pr-3 font-mono text-xs text-purple-700">{r.comp}</td>
                    <td className="py-1.5 pr-3 font-mono text-xs text-indigo-700">{r.sup}</td>
                    <td className="py-1.5 font-mono text-xs text-gray-600">{r.ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confusable ogohlantirish banneri */}
      <ConfusableBanner pairs={getConfusablePairs(lesson.vocabulary)} navigate={navigate} variant="theory" />

      {/* Vocabulary */}
      <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📝</span>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Lug'at — {lesson.vocabulary.length} ta so'z
            </p>
            <p className="text-[10px] text-gray-400">Har bir so'zni o'qing va misollarni tinglang</p>
          </div>
        </div>
        <VocabLearner
          vocab={lesson.vocabulary}
          addXP={addXP}
          lessonId={lesson.id}
          lessonLevel={lesson.level}
          onVocabDone={onVocabDone}
        />
      </div>

      {/* Examples — with AudioButton for pronunciation */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-800/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">💬</span>
          <div>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              Misollar — {lesson.examples.length} ta
            </p>
            <p className="text-[10px] text-emerald-500/70">Tinglang va takrorlang</p>
          </div>
        </div>
        <ExamplesSection examples={lesson.examples} />
      </div>

      {/* Special Cases */}
      {lesson.specialCases.length > 0 && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Star size={14} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Maxsus holatlar
              </p>
              <p className="text-[10px] text-gray-400">{lesson.specialCases.length} ta maxsus holat — yodda saqlash uchun</p>
            </div>
          </div>
          {lesson.specialCases.map((sc) => (
            <div key={sc.id} className="space-y-3">
              {sc.mnemonic && <MnemonicCard rule={sc.title} mnemonic={sc.mnemonic} />}
              <SpecialCaseCard sc={sc} addXP={addXP} lessonId={lesson.id} />
            </div>
          ))}
        </div>
      )}

      {/* Dialogues section */}
      {lesson.dialogues && lesson.dialogues.length > 0 && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <MessageCircle size={14} /> Real-life dialogues — {lesson.dialogues.length} ta
          </p>
          {lesson.dialogues.map((d) => (
            <DialogueCard key={d.id} dialogue={d} />
          ))}
        </div>
      )}

      {/* Cultural notes section */}
      {lesson.culturalNotes && lesson.culturalNotes.length > 0 && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb size={14} /> Cultural context — {lesson.culturalNotes.length} ta
          </p>
          {lesson.culturalNotes.map((n) => (
            <CulturalNoteCard key={n.id} note={n} />
          ))}
        </div>
      )}

      {/* Bottom info card */}
      <div className="bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-900/30 dark:to-emerald-900/30 rounded-2xl p-4 border border-primary-100 dark:border-primary-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
            <span className="text-lg">🎯</span>
          </div>
          <div>
            <p className="text-sm text-primary-800 dark:text-primary-200 font-bold">
              Tayyormisiz?
            </p>
            <p className="text-xs text-primary-600/70 dark:text-primary-400/70">
              Keyingi bosqichda <strong>{lesson.vocabulary.length} ta so'z</strong> va <strong>{lesson.exercises.length} ta mashq</strong> bor. Har to'g'ri javob <strong>+10 XP</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
