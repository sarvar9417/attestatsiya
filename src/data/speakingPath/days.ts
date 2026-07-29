// Speaking Path — 75 kunlik narvon (to'liq kontent)
// Reja: docs/speaking-path-roadmap.md
// Authoring: A0 dan B1 gacha, i+1 qiyinlashish, yuqori chastotali bloklar, gapiriladigan jumlalar (so'z emas)
// Eslatma: o'zbekcha matnda apostrof (o', g', yo') bor — barcha matn maydonlari
// qo'sh tirnoq (") ichida yoziladi.
// Faza 1 qo'shimchalari: grammarTip, pronunciationFocus, recycledChunkIds (spiral curriculum)

import type { SpeakingDay } from './types'
import { A0_DAYS } from './a0Days'
import { A1_DAYS } from './a1Days'
import { A2_DAYS } from './a2Days'
import { B1_DAYS } from './b1Days'
import { B2_DAYS } from './b2Days'

export const SPEAKING_DAYS: SpeakingDay[] = [
  ...A0_DAYS,
  ...A1_DAYS,
  ...A2_DAYS,
  ...B1_DAYS,
  ...B2_DAYS,
]
