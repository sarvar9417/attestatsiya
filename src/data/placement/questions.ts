// Placement Test — savol banki (25 sof, kalibrlangan savol)
// Reja: docs/EnglishPath_Roadmap.md (1.1)
// 5 band (A2→B2) × 5 savol. Adaptiv tartiblovchi band bo'yicha tanlaydi.
// Izohlar — qisqa, o'zbekcha (lotin).

import type { PlacementQuestion } from './types'

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // ── A2 (poldan past — boshlang'ich detektori) ──
  { id: 'pl-a2-1', band: 'A2', category: 'grammar', question: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], correct: 1, explanation: "Present Simple, 3-shaxs birlik: -s qo'shiladi." },
  { id: 'pl-a2-2', band: 'A2', category: 'grammar', question: 'There ___ some milk in the fridge.', options: ['is', 'are', 'am', 'be'], correct: 0, explanation: "Sanalmaydigan ot (milk) → is." },
  { id: 'pl-a2-3', band: 'A2', category: 'vocabulary', question: "I'm very ___. Can I have some water?", options: ['hungry', 'thirsty', 'tired', 'angry'], correct: 1, explanation: "Suv so'rayapti → thirsty (chanqagan)." },
  { id: 'pl-a2-4', band: 'A2', category: 'vocabulary', question: 'He ___ his teeth every morning.', options: ['washes', 'brushes', 'cleans', 'combs'], correct: 1, explanation: "Tishni 'brush' qilamiz." },
  { id: 'pl-a2-5', band: 'A2', category: 'reading', question: "Read: 'Tom gets up at 7 and has breakfast at 7:30.' What does Tom do first?", options: ['has breakfast', 'gets up', 'goes to work', 'sleeps'], correct: 1, explanation: "Avval turadi (7), keyin nonushta (7:30)." },

  // ── A2+ ──
  { id: 'pl-a2p-1', band: 'A2+', category: 'grammar', question: 'I have lived here ___ 2019.', options: ['since', 'for', 'from', 'at'], correct: 0, explanation: "Aniq nuqta (2019) → since." },
  { id: 'pl-a2p-2', band: 'A2+', category: 'grammar', question: 'If it rains tomorrow, we ___ at home.', options: ['stay', 'will stay', 'stayed', 'staying'], correct: 1, explanation: "First Conditional: if + present, will + V1." },
  { id: 'pl-a2p-3', band: 'A2+', category: 'vocabulary', question: 'The film was so ___ that I fell asleep.', options: ['boring', 'bored', 'exciting', 'interesting'], correct: 0, explanation: "Film tasviri → -ing (boring)." },
  { id: 'pl-a2p-4', band: 'A2+', category: 'vocabulary', question: 'Could you ___ me a favour, please?', options: ['do', 'make', 'give', 'take'], correct: 0, explanation: "Kollokatsiya: do a favour." },
  { id: 'pl-a2p-5', band: 'A2+', category: 'reading', question: "Read: 'The museum is open daily except Mondays.' When is it closed?", options: ['Sunday', 'Monday', 'every day', 'weekends'], correct: 1, explanation: "'except Mondays' = dushanba yopiq." },

  // ── B1 ──
  { id: 'pl-b1-1', band: 'B1', category: 'grammar', question: 'By the time we arrived, the film ___.', options: ['started', 'has started', 'had started', 'starts'], correct: 2, explanation: "Past Perfect: oldinroq bo'lgan ish." },
  { id: 'pl-b1-2', band: 'B1', category: 'grammar', question: 'She asked me where I ___ from.', options: ['come', 'came', 'had come', 'coming'], correct: 1, explanation: "Reported speech: present → past (came)." },
  { id: 'pl-b1-3', band: 'B1', category: 'vocabulary', question: "I can't ___ the difference between these two.", options: ['say', 'tell', 'talk', 'speak'], correct: 1, explanation: "Kollokatsiya: tell the difference." },
  { id: 'pl-b1-4', band: 'B1', category: 'vocabulary', question: "He's really ___ on playing football.", options: ['keen', 'fond', 'interested', 'good'], correct: 0, explanation: "keen ON ... -ing." },
  { id: 'pl-b1-5', band: 'B1', category: 'reading', question: "Read: 'Although the project was difficult, the team finished on time.' What does this suggest?", options: ['the team failed', 'it was easy', 'they succeeded despite difficulty', 'they were late'], correct: 2, explanation: "'Although' = qiyinchilikka qaramay muvaffaqiyat." },

  // ── B1+ ──
  { id: 'pl-b1p-1', band: 'B1+', category: 'grammar', question: 'I wish I ___ more time to finish it.', options: ['have', 'had', 'would have', 'has'], correct: 1, explanation: "wish + Past Simple (hozirgi afsus)." },
  { id: 'pl-b1p-2', band: 'B1+', category: 'grammar', question: 'The report ___ by tomorrow morning.', options: ['will finish', 'will be finished', 'finishes', 'is finishing'], correct: 1, explanation: "Future Passive: will be + V3." },
  { id: 'pl-b1p-3', band: 'B1+', category: 'vocabulary', question: "Her explanation was rather ___; I didn't understand it.", options: ['vague', 'clear', 'obvious', 'precise'], correct: 0, explanation: "Tushunmadi → vague (mavhum)." },
  { id: 'pl-b1p-4', band: 'B1+', category: 'vocabulary', question: 'We need to ___ a decision soon.', options: ['do', 'make', 'take', 'get'], correct: 1, explanation: "Kollokatsiya: make a decision." },
  { id: 'pl-b1p-5', band: 'B1+', category: 'reading', question: "Read: 'The new policy was met with considerable resistance from staff.' How did staff react?", options: ['they welcomed it', 'they ignored it', 'they opposed it', 'they did not notice'], correct: 2, explanation: "'resistance' = qarshilik (opposed)." },

  // ── B2 ──
  { id: 'pl-b2-1', band: 'B2', category: 'grammar', question: 'Had I known earlier, I ___ differently.', options: ['would act', 'would have acted', 'had acted', 'will act'], correct: 1, explanation: "Third Conditional (inversion): would have + V3." },
  { id: 'pl-b2-2', band: 'B2', category: 'grammar', question: 'Not only ___ late, but he also forgot the documents.', options: ['he was', 'was he', 'he is', 'is he'], correct: 1, explanation: "Inversion: Not only + was he ..." },
  { id: 'pl-b2-3', band: 'B2', category: 'vocabulary', question: "The CEO's remarks were widely seen as ___.", options: ['controversial', 'controvert', 'controversy', 'controversially'], correct: 0, explanation: "Ot oldidan sifat kerak → controversial." },
  { id: 'pl-b2-4', band: 'B2', category: 'vocabulary', question: 'She managed to ___ a compromise between the two sides.', options: ['broker', 'break', 'brake', 'borrow'], correct: 0, explanation: "broker a compromise = murosaga erishtirmoq." },
  { id: 'pl-b2-5', band: 'B2', category: 'reading', question: "Read: 'The findings, while preliminary, have far-reaching implications.' What does the writer imply?", options: ['results are final', 'results are unimportant', 'early results may matter greatly', 'there are no results'], correct: 2, explanation: "'preliminary' lekin 'far-reaching' = erta natija muhim bo'lishi mumkin." },
]
