// AVTO-import: Supabase lessons jadvalidan ko’chirilgan darslar (kurikulum
// bo’shliqlarini to’ldirish uchun). Endi lokal kurikulumning bir qismi.
import type { DailyLesson } from '../dailyLessons'

export const inversionB2: DailyLesson = {
  "id": "inversion-b2",
  speaking: {
    prompt: "Describe a memorable experience or make an emphatic point using inversion. Speak for about one minute. Use inverted structures like 'Never have I...', 'Not only... but also...', 'Rarely...', and 'No sooner... than...'.",
    tips: [
      "'Never have I seen...' (yordamchi + ega).",
      "'Not only did he..., but he also...'",
      "'No sooner had I... than...'",
      "'Rarely / Seldom / Little did I...'",
    ],
    sampleAnswer: "Never have I experienced a moment as proud as my graduation day. Not only had I passed all my exams, but I had also won a scholarship. Rarely does one feel such a mixture of relief and joy. No sooner had the ceremony ended than my family rushed to congratulate me. Little did I know that this achievement would open so many doors. Seldom do we appreciate how much effort success requires. Only after years of hard work did I truly understand the value of education. Not until that day had I realised how far determination could take me.",
  },
  "title": "Inversion — Emphatic Structures",
  "subtitle": "Inversiya: gap tuzilishini o'zgartirib, ma'noni kuchaytirish",
  "level": "B2",
  "day": 74,
  "listening": {
    "transcript": "Speaker: Never have I seen such a beautiful sunrise.\nFriend: Nor have I. It's incredible.\nSpeaker: Not only is it beautiful, but it's also peaceful.\nFriend: Hardly had we arrived when the colours changed.\nSpeaker: True. Rarely do we get mornings like this.\nFriend: Only after climbing the hill did we see the full view.\nSpeaker: Little did we know it would be so worth it.\nFriend: So stunning was the scene that nobody spoke.\nSpeaker: No sooner had the sun risen than the birds began to sing.\nFriend: What a perfect start to the day!",
    "vocabulary": [
      { "word": "sunrise", "definition": "quyosh chiqishi" },
      { "word": "peaceful", "definition": "tinch, osoyishta" },
      { "word": "stunning", "definition": "hayratlanarli go'zal" },
      { "word": "scene", "definition": "manzara" },
      { "word": "rise", "definition": "ko'tarilmoq, chiqmoq" }
    ],
    "questions": [
      { "id": 101713, "type": "multiple-choice", "question": "What had the speaker never seen before?", "options": ["Such a beautiful sunrise", "A bird", "A hill", "A storm"], "correctIndex": 0, "explanation": "'Never have I seen such a beautiful sunrise' — negative adverb fronting + inversion." },
      { "id": 101714, "type": "true-false", "question": "The place is beautiful but noisy.", "answer": false, "explanation": "'Not only is it beautiful, but it's also peaceful.'" },
      { "id": 101715, "type": "multiple-choice", "question": "When did the colours change?", "options": ["Before they arrived", "Just after they arrived", "At noon", "At night"], "correctIndex": 1, "explanation": "'Hardly had we arrived when the colours changed.'" },
      { "id": 101716, "type": "multiple-choice", "question": "When did they see the full view?", "options": ["From the car", "Only after climbing the hill", "At the start", "From home"], "correctIndex": 1, "explanation": "'Only after climbing the hill did we see the full view' — fronting + inversion." },
      { "id": 101717, "type": "multiple-choice", "question": "What happened no sooner than the sun rose?", "options": ["It rained", "The birds began to sing", "They left", "It got dark"], "correctIndex": 1, "explanation": "'No sooner had the sun risen than the birds began to sing.'" }
    ],
    "difficulty": "hard",
    "topic": "Inversiya — Never have I / Not only / Hardly had / No sooner"
  },
  "category": "IELTS Preparation",
  "formulas": [
    {
      "color": "blue",
      "label": "Not only...but also",
      "structure": "Not only + auxiliary + S + V, but also + S + V\nNot only does he speak English, but he also speaks French.",
      explanation: "Ingliz tilida 'nafaqat...balki' ma'nosida ishlatiladi. 'Not only' gap boshida bo'lsa, inversiya MAJBURIY — yordamchi fe'l egadan oldin keladi. O'zbekchada inversiya talab qilinmaydi.",
      whenToUse: "Ikki fikrni bog'lab, ikkalasini ham ta'kidlash uchun. IELTS Writing da argumentativ essaylarda.",
      example: "Not only does he speak English, but he also speaks French. (U nafaqat ingliz, balki fransuz tilida ham gapiradi)" },
    {
      "color": "violet",
      "label": "Rarely/Never/Seldom",
      "structure": "Rarely/Never/Seldom + auxiliary + S + V\nRarely have I seen such beauty.",
      explanation: "Salbiy ma'noli so'zlar gap boshida kelganda inversiya majburiy. Never (hech qachon), Rarely (kamdan-kam), Seldom (kamdan-kam, rasmiyroq). Urg'u berish uchun ishlatiladi.",
      whenToUse: "Kamdan-kam sodir bo'lgan hodisalarni ta'kidlashda. IELTS Speaking da, yuqori ball olish uchun.",
      example: "Never have I seen such beauty. (Hech qachon bunday go'zallikni ko'rmaganman)" },
    {
      "color": "orange",
      "label": "Hardly...when / No sooner...than",
      "structure": "Hardly + had + S + V₃ + when + S + V₂\nNo sooner had we left than it started raining.",
      explanation: "Ikkala struktura ham 'biror ish tugashi bilanoq boshqasi sodir bo'ldi' ma'nosini beradi. Hardly bilan when, No sooner bilan than ishlatiladi — bu ikkilarni adashtirmang!",
      whenToUse: "Ketma-ket sodir bo'lgan hodisalarni ta'kidlashda, ularning tezligini ko'rsatishda.",
      example: "Hardly had we arrived when the phone rang. (Biz zo'rg'a yetib kelgan edik, telefon jiringladi)" },
    {
      "color": "green",
      "label": "Only after / Only when",
      "structure": "Only after + V-ing / clause + auxiliary + S + V\nOnly after finishing work did I relax.",
      explanation: "Faqat ma'lum sharoitda sodir bo'lganini bildiradi. 'Only + ...' dan keyingi asosiy gapda inversiya bo'ladi, lekin 'only' dan keyingi bo'lakda inversiya yo'q.",
      whenToUse: "Faqat ma'lum sharoitda narsa sodir bo'lganini ta'kidlashda. IELTS Writing da sabab-natija bog'lashda.",
      example: "Only after finishing work did I relax. (Faqat ishni tugatgandan keyin dam oldim)" }
  ],
  "rules": [
    "1️⃣ INVERSIYA NIMA VA QACHON ISHLATILADI?\n\nInversiya — gapda yordamchi fe'l (auxiliary)ni egadan oldin qo'yish orqali ma'noni kuchaytirish usuli. Normal tartib: S + V. Inversiya: Aux + S + V.\n\n📌 QACHON ISHLATILADI?\n• Salbiy ma'noli so'zlar gap boshida kelganda: Never, Rarely, Seldom, Hardly, No sooner, Not only\n• Faqatgina/only ma'nosidagi konstruksiyalar: Only after, Only when, Only then\n• So + adjective/adverb: So beautiful was the view...\n\n📌 MUHIM: Inversiya faqat gap boshida ishlatiladi! Oddiy gap tartibida inversiya bo'lmaydi.\n  → Never have I seen such a film. (Inversiya — kuchaytirilgan)\n  → I have never seen such a film. (Oddiy tartib)\n\n📌 IELTS TIP: Inversiya Writing Task 2 da yoki Speaking da yuqori ball (Band 7+) olish uchun juda muhim grammatik struktura hisoblanadi.",
    "2️⃣ NOT ONLY...BUT ALSO — 'NAFAQAT...BALKI'\n\n📌 TUZILISHI: Not only + auxiliary + S + V, but (also) + S + V\n\n  → Not only does she speak English, but she also speaks French.\n  (U nafaqat ingliz tilida, balki fransuz tilida ham gapiradi.)\n  → Not only did he finish the project, but he also helped others.\n  (U nafaqat loyihani tugatdi, balki boshqalarga ham yordam berdi.)\n\n📌 QOIDA: 'Not only' dan keyin darhol auxiliary (do/does/did/have/has/can/will) keladi, keyin ega, keyin asosiy fe'l.\n\n📌 O'ZBEKCHA FARQ: O'zbek tilida 'nafaqat...balki' bilan inversiya talab qilinmaydi. Ingliz tilida 'Not only' gap boshida bo'lsa, inversiya MAJBURIY.\n\n  ❌ Not only he speaks English but also French.\n  ✅ Not only does he speak English, but he also speaks French.\n\n📌 IELTS: 'Not only...but also' — Task 2 da argumentativ essaylarda juda foydali. Band 7+ uchun kerakli struktura.",
    "3️⃣ RARELY / NEVER / SELDOM + INVERSIYA\n\n📌 TUZILISHI: Rarely/Never/Seldom + auxiliary + S + V\n\n  → Rarely have I seen such dedication.\n  (Men bunday fidoyilikni kamdan-kam ko'rganman.)\n  → Never has she been so happy in her life.\n  (U hayotida hech qachon bunchalik baxtli bo'lmagan.)\n  → Seldom do we witness such talent.\n  (Biz bunday iste'dodni kamdan-kam ko'ramiz.)\n\n📌 SO'ZLAR MA'NOSI:\n  • Never = hech qachon (eng kuchli)\n  • Rarely = kamdan-kam\n  • Seldom = kamdan-kam (rarely bilan sinonim, lekin rasmiyroq)\n  • Hardly ever = deyarli hech qachon\n\n📌 QOIDA: Bu so'zlar gap boshida kelsa, inversiya majburiy. Agar gap o'rtasida bo'lsa, inversiya kerak emas:\n  → I have never seen such beauty. (Oddiy — inversiyasiz)\n  → Never have I seen such beauty. (Inversiya — kuchaytirilgan)\n\n📌 IELTS TIP: Speaking Part 2 va 3 da 'Never have I...' strukturasini ishlatish tabiiy va ta'sirli eshitiladi.",
    "4️⃣ HARDLY...WHEN / NO SOONER...THAN\n\n📌 TUZILISHI:\n  Hardly + had + S + V₃ + when + S + V₂\n  No sooner + had + S + V₃ + than + S + V₂\n\n  → Hardly had we arrived when the phone rang.\n  (Biz zo'rg'a yetib kelgan edik, telefon jiringladi.)\n  → No sooner had she finished her speech than the audience applauded.\n  (U nutqini tugatishi bilan tomoshabinlar qarsak chalishdi.)\n\n📌 MA'NO: Ikkala struktura ham 'biror ish-harakat tugashi bilanoq boshqasi sodir bo'ldi' ma'nosini beradi. Past Perfect (had + V₃) va Past Simple (V₂) bilan ishlatiladi.\n\n📌 FARQLAR:\n  • Hardly...when — 'zo'rg'a...edi...ki...'\n  • No sooner...than — 'bilanoq', '...ishi bilan'\n\n  ❌ No sooner had we left when it rained.\n  ✅ No sooner had we left than it rained.\n  ❌ Hardly had we left than it rained.\n  ✅ Hardly had we left when it rained.\n\n📌 ESLATMA: 'Hardly' bilan 'when', 'No sooner' bilan 'than' ishlatiladi. Bularni adashtirmang!",
    "5️⃣ ONLY AFTER / ONLY WHEN + INVERSIYA\n\n📌 TUZILISHI:\n  Only after + V-ing / noun / clause + auxiliary + S + V\n  Only when + clause + auxiliary + S + V\n  Only then + auxiliary + S + V\n\n  → Only after finishing university did she find a job.\n  (Faqat universitetni tugatgandan keyin u ish topdi.)\n  → Only when you practice every day will you improve.\n  (Faqat har kuni mashq qilsangizgina yaxshilanasiz.)\n  → Only then did I realize my mistake.\n  (Shundan keyingina men xatoimni tushundim.)\n\n📌 QOIDA: 'Only + ...' dan keyingi asosiy gapda inversiya bo'ladi, lekin 'only' dan keyingi bo'lakda inversiya YO'Q.\n  → Only when he arrived did we start the meeting. (Only + clause → inversiya asosiy gapda)\n  → Only after the rain stopped could we go out. (Only + after + clause → inversiya asosiy gapda)\n\n📌 BOSHQA 'ONLY' KONSTRUKSIYALARI:\n  • Only by + V-ing: Only by working hard can you succeed.\n  • Only in this way: Only in this way will we solve the problem.\n  • Only with: Only with your support can we achieve this.\n\n📌 IELTS TIP: 'Only when...', 'Only by...' strukturalari Writing Task 2 da sabab-natija bog'lashda juda kuchli vosita.",
    "6️⃣ SO + ADJECTIVE/ADVERB + INVERSIYA VA BOSHQA STRUKTURALAR\n\n📌 SO + ADJECTIVE/ADVERB + INVERSIYA:\n  → So beautiful was the sunset that everyone stopped to watch.\n  (Quyosh botishi shunchalik go'zal ediki, hamma to'xtab tomosha qildi.)\n  → So quickly did she finish the exam that she had an hour left.\n  (U imtihonni shunchalik tez tugatdiki, bir soati qoldi.)\n\n📌 SUCH + BE + INVERSIYA:\n  → Such was her dedication that she worked all night.\n  (Uning fidoyiligi shunchalik ediki, tun bo'yi ishladi.)\n\n📌 NOT UNTIL + INVERSIYA:\n  → Not until I read the book did I understand the film.\n  (Kitobni o'qimagunimcha filmni tushunmadim.)\n\n📌 IELTS BAND 7+ UCHUN MASLAHATLAR:\n  • Inversiyani haddan tashqari ko'p ishlatmang — 2-3 marta foydalanish kifoya\n  • Faqat Writing da emas, Speaking da ham ishlating: 'Never have I seen...', 'Only then did I realize...'\n  • Reading da inversiyani taniy olish muhim — ular ko'pincha asosiy fikrni o'z ichiga oladi"
  ],
  "vocabulary": [
    {
      "en": "rarely",
      "uz": "kamdan-kam",
      "rule": "Salbiy ma'no → inversion",
      "example": "Rarely have I witnessed such a remarkable performance."
    },
    {
      "en": "seldom",
      "uz": "kamdan-kam (rasmiy)",
      "rule": "Formal / rarely sinonimi",
      "example": "Seldom do we encounter such generosity in modern society."
    },
    {
      "en": "scarcely",
      "uz": "zo'rg'a, arang",
      "rule": "Hardly bilan sinonim",
      "example": "Scarcely had we begun when the fire alarm went off."
    },
    {
      "en": "barely",
      "uz": "zo'rg'a",
      "rule": "Hardly/Scarcely bilan sinonim",
      "example": "Barely had she entered the room when everyone stood up."
    },
    {
      "en": "inversion",
      "uz": "inversiya (tartib o'zgarishi)",
      "rule": "Grammatik atama",
      "example": "Inversion occurs when the auxiliary verb comes before the subject."
    },
    {
      "en": "emphatic",
      "uz": "kuchaytirilgan, ta'kidli",
      "rule": "Uslubiy atama",
      "example": "Inversion creates an emphatic effect in formal writing."
    },
    {
      "en": "auxiliary",
      "uz": "yordamchi fe'l",
      "rule": "Grammatik atama",
      "example": "The auxiliary verb moves before the subject in inversion."
    },
    {
      "en": "consequently",
      "uz": "natijada, shuning uchun",
      "rule": "Formal bog'lovchi",
      "example": "Consequently, the project was delayed by two weeks."
    },
    {
      "en": "thereafter",
      "uz": "shundan keyin",
      "rule": "Rasmiy, vaqt bog'lovchisi",
      "example": "Thereafter, the company implemented new safety measures."
    },
    {
      "en": "profound",
      "uz": "chuqur (ta'sir)",
      "rule": "Sifat, kuchli ta'sir",
      "example": "The news had a profound effect on the community."
    },
    {
      "en": "witness",
      "uz": "guvoh bo'lmoq, ko'rmoq",
      "rule": "Fe'l, inversiyada keng ishlatiladi",
      "example": "Rarely have I witnessed such a breathtaking view."
    },
    {
      "en": "remarkable",
      "uz": "ajoyib, diqqatga sazovor",
      "rule": "Sifat, B2 darajasi",
      "example": "Seldom do we see such remarkable progress in students."
    },
    {
      "en": "emphatic structure",
      "uz": "kuchaytirilgan tuzilma",
      "rule": "Uslubiy atama",
      "example": "Inversion creates an emphatic structure in formal writing."
    },
    {
      "en": "not only...but also",
      "uz": "nafaqat...balki",
      "rule": "inversiya: Not only + aux + S + V",
      "example": "Not only does he speak English, but he also speaks French."
    },
    {
      "en": "hardly...when / no sooner...than",
      "uz": "zo'rg'a...qachonki / bilanoq",
      "rule": "inversiya: Hardly + had + S + V₃ + when",
      "example": "Hardly had we arrived when the phone rang."
    }
  ],
  "examples": [
    {
      "en": "Not only does he play the guitar, but he also composes music.",
      "uz": "U nafaqat gitara chaldi, balki musiqa ham bastalaydi."
    },
    {
      "en": "Never have I felt so inspired by a single speech.",
      "uz": "Men birgina nutqdan hech qachon bunchalik ilhomlanmaganman."
    },
    {
      "en": "Hardly had we sat down when the waiter arrived.",
      "uz": "Biz zo'rg'a o'tirgan edik, ofitsiant keldi."
    },
    {
      "en": "No sooner had the exam finished than students started celebrating.",
      "uz": "Imtihon tugashi bilan talabalar bayram qilishni boshlashdi."
    },
    {
      "en": "Only after submitting the application did she feel relieved.",
      "uz": "Arizani topshirgandan keyingina u yengil tortdi."
    },
    {
      "en": "Rarely do we find such dedication in the modern workplace.",
      "uz": "Zamonaviy ish joylarida bunday fidoyilikni kamdan-kam topamiz."
    },
    {
      "en": "So fascinating was the documentary that I watched it twice.",
      "uz": "Hujjatli film shunchalik qiziqarlı ediki, uni ikki marta ko'rdim."
    },
    {
      "en": "Not until she explained did I understand the concept.",
      "uz": "U tushuntirmaguncha men kontseptsiyani tushunmadim."
    }
  ],
  "specialCases": [
    {
      "id": "not-only-but-also",
      "rule": "'Not only' dan keyin auxiliary + S + V keladi. 'But also' dan keyin oddiy gap tartibi. Ikkala qismdagi fe'llar parallel bo'lishi kerak (bir xil zamon/formada).",
      "title": "Not only...but also — parallel tuzilma",
      "drills": [
        {
          "id": 70498,
          "type": "error-correction",
          "correct": "Not only does he speak English, but he also speaks French.",
          "question": "Not only he speaks English, but also he speaks French.",
          "errorPart": "he speaks",
          "explanation": "'Not only' dan keyin auxiliary (does) + S + V kerak. 'He speaks' → 'does he speak'.",
          "instruction": "Not only...but also xatosini toping:"
        },
        {
          "id": 70499,
          "hint": "Not only ...",
          "type": "transformation",
          "correct": "Not only is she intelligent, but she is also hardworking.",
          "question": "She is intelligent. She is also hardworking.",
          "explanation": "'Not only' dan keyin 'is she' (inversiya). 'But also' dan keyin oddiy tartib.",
          "instruction": "Not only...but also bilan qayta yozing:"
        },
        {
          "id": 70500,
          "type": "fill-blank",
          "blanks": [
            "does she compose"
          ],
          "question": "Not only _____ (does/she/compose) music, but she also performs it.",
          "explanation": "'Not only' → auxiliary + S + V → 'does she compose'.",
          "instruction": "To'g'ri shaklni qo'ying:"
        }
      ],
      "examples": [
        {
          "en": "Not only did she win the competition, but she also set a new record.",
          "uz": "U nafaqat musobaqada g'olib chiqdi, balki yangi rekord ham o'rnatdi."
        },
        {
          "en": "Not only is he a talented musician, but he is also a brilliant scientist.",
          "uz": "U nafaqat iste'dodli musiqachi, balki zo'r olim ham."
        }
      ],
      "mnemonic": "NOT ONLY + inversiya DO/DOES/DID, BUT ALSO + oddiy. ESLAB QOL: Not only dan keyin DO (yordamchi) darhol keladi.",
      "commonMistakes": "'Not only' dan keyin inversiya qilmaslik: 'Not only he speaks...' XATO. 'But also' qismida fe'l takrorlanmasa: 'Not only does he speak French but also German' (speak ikkinchi qismda tushib qolgan) — bu xato emas, lekin aniqlik uchun 'he also speaks' yaxshiroq."
    },
    {
      "id": "hardly-no-sooner",
      "rule": "'Hardly...when' va 'No sooner...than' ikkisi ham 'bilanoq' ma'nosini beradi, lekin farqli bog'lovchilar bilan ishlatiladi: 'Hardly...when', 'No sooner...than'. Past Perfect (had + V₃) va Past Simple (V₂) bilan ishlatiladi.",
      "title": "Hardly...when / No sooner...than — vaqt farqi",
      "drills": [
        {
          "id": 70501,
          "type": "fill-blank",
          "blanks": [
            "had we left"
          ],
          "question": "Hardly _____ (we/leave) when it started to pour with rain.",
          "explanation": "'Hardly + had + S + V₃' → 'Hardly had we left'. 'When' bilan davom etadi.",
          "instruction": "To'ldiring (Hardly...when):"
        },
        {
          "id": 70502,
          "type": "error-correction",
          "correct": "No sooner had she arrived than the meeting started.",
          "question": "No sooner had she arrived when the meeting started.",
          "errorPart": "when",
          "explanation": "'No sooner' bilan 'than' ishlatiladi, 'when' emas. 'Hardly' bilan 'when' ishlatiladi.",
          "instruction": "Xatoni toping:"
        },
        {
          "id": 70503,
          "hint": "No sooner ...",
          "type": "transformation",
          "correct": "No sooner had I closed my eyes than the phone rang.",
          "question": "As soon as I closed my eyes, the phone rang.",
          "explanation": "'As soon as' → 'No sooner...than'. Past Perfect (had closed) ishlatiladi.",
          "instruction": "No sooner...than bilan qayta yozing:"
        }
      ],
      "examples": [
        {
          "en": "Hardly had the concert begun when the power went out.",
          "uz": "Konsert zo'rg'a boshlangan edi, elektr o'chdi."
        },
        {
          "en": "No sooner had she opened the door than the cat ran out.",
          "uz": "U eshikni ochishi bilan mushuk tashqariga yugurib chiqdi."
        }
      ],
      "mnemonic": "HARD-WHEN (H-W), NO-THAN (N-T) — birinchi harflarga qarab eslab qoling. H → W, N → T. Hech qachon Hardly...than yoki No sooner...when demang!",
      "commonMistakes": "'No sooner...then' XATO (then emas, than). 'Hardly...than' XATO (when bo'lishi kerak). 'No sooner...when' XATO (than bo'lishi kerak). Past Perfect o'rniga Past Simple ishlatish: 'Hardly we arrived when...' XATO → 'Hardly had we arrived when...' TO'G'RI."
    },
    {
      "id": "only-after-when",
      "rule": "'Only + vaqt bo'lagi' dan keyin asosiy gapda inversiya bo'ladi. 'Only after', 'Only when', 'Only by', 'Only then' kabi konstruksiyalarda inversiya faqat asosiy gapda qo'llaniladi, 'only' dan keyingi bo'lakda emas.",
      "title": "Only after / Only when — asosiy gapda inversiya",
      "drills": [
        {
          "id": 70504,
          "type": "error-correction",
          "correct": "Only after he finished the report did he go home.",
          "question": "Only after did he finish the report, he went home.",
          "errorPart": "did he finish the report, he went",
          "explanation": "'Only after' dan keyingi bo'lakda inversiya YO'Q. Asosiy gapda 'did he go' (inversiya) bo'ladi.",
          "instruction": "Inversiya xatosini toping:"
        },
        {
          "id": 70505,
          "type": "fill-blank",
          "blanks": [
            "working",
            "can we"
          ],
          "question": "Only by _____ (work) together _____ (can/we) solve this issue.",
          "explanation": "'Only by + V-ing' → 'Only by working'. Keyin inversiya: 'can we solve'.",
          "instruction": "To'g'ri shaklni qo'ying:"
        },
        {
          "id": 70506,
          "hint": "Only when ...",
          "type": "transformation",
          "correct": "Only when you read the instructions carefully will you understand the lesson.",
          "question": "You will understand the lesson if you read the instructions carefully.",
          "explanation": "'If' → 'Only when'. Asosiy gapda inversiya: 'will you understand'.",
          "instruction": "Only when bilan qayta yozing:"
        }
      ],
      "examples": [
        {
          "en": "Only after the pandemic ended did travel become affordable again.",
          "uz": "Pandemiya tugaganidan keyingina sayohat yana qulay bo'ldi."
        },
        {
          "en": "Only when you take risks can you achieve great things.",
          "uz": "Faqat tavakkal qilsangizgina buyuk narsalarga erisha olasiz."
        }
      ],
      "mnemonic": "ONLY + (bo'lak) [inversiya YO'Q], + [Aux + S + V] [inversiya BOR]. Faqat asosiy gapda auxiliary egadan oldin keladi.",
      "commonMistakes": "Ikkala qismda ham inversiya qilish: 'Only when did he arrive did we start' XATO — faqat asosiy gapda inversiya. 'Only after' dan keyin to'liq gap o'rniga gerundiy ishlatish mumkin: 'Only after finishing...' (gerund) yoki 'Only after I finished...' (to'liq gap)."
    }
  ],
  "exercises": [
    {
      "id": 70507,
      "type": "multiple-choice",
      "correct": "Not only does he speak English but also he speaks French.",
      "options": [
        "Not only he speaks English but also French.",
        "Not only does he speak English but also he speaks French.",
        "Not only speaks he English but also French.",
        "Not only he does speak English but also French."
      ],
      "question": "Which sentence uses inversion correctly with 'Not only'?",
      "explanation": "'Not only' + auxiliary (does) + S + V. 'He speaks' → 'does he speak'.",
      "instruction": "Inversiya qoidasini tanlang:"
    },
    {
      "id": 70508,
      "type": "multiple-choice",
      "correct": "Never",
      "options": [
        "Never",
        "Always",
        "Often",
        "Sometimes"
      ],
      "question": "___ have I felt so proud of my country.",
      "explanation": "'Never' gap boshida inversiya talab qiladi: 'Never have I felt...'. 'Always', 'Often' inversiya talab qilmaydi.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70509,
      "type": "multiple-choice",
      "correct": "than",
      "options": [
        "when",
        "than",
        "then",
        "that"
      ],
      "question": "No sooner had she entered the room ___ everyone stood up.",
      "explanation": "'No sooner' bilan 'than' ishlatiladi. 'Hardly' bilan 'when'.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70510,
      "type": "multiple-choice",
      "correct": "Hardly",
      "options": [
        "No sooner",
        "Hardly",
        "Only",
        "Not only"
      ],
      "question": "___ had we sat down to eat when the doorbell rang.",
      "explanation": "'Hardly...when' — 'zo'rg'a...edi...ki'. 'No sooner...than' bilan adashtirmang.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70511,
      "type": "fill-blank",
      "blanks": [
        "finishing"
      ],
      "question": "Only after _____ (finish) the project did she take a vacation.",
      "explanation": "'Only after + V-ing': 'Only after finishing the project'. Keyin inversiya: 'did she take'.",
      "instruction": "Inversiya bilan to'ldiring:"
    },
    {
      "id": 70512,
      "type": "fill-blank",
      "blanks": [
        "saw"
      ],
      "question": "Not until I _____ (see) it with my own eyes did I believe it.",
      "explanation": "'Not until + S + V (past simple)' → keyin inversiya: 'did I believe'. 'Not until I saw...'.",
      "instruction": "Inversiya bilan to'ldiring:"
    },
    {
      "id": 70513,
      "type": "fill-blank",
      "blanks": [
        "do we see"
      ],
      "question": "Seldom _____ (we/see) such outstanding performance in amateur theatre.",
      "explanation": "'Seldom' gap boshida → inversiya: 'do we see'. 'Seldom we see' XATO.",
      "instruction": "Inversiya bilan to'ldiring:"
    },
    {
      "id": 70514,
      "type": "fill-blank",
      "blanks": [
        "fascinating was the film"
      ],
      "question": "So _____ (fascinating/was/the film) that I watched it three times.",
      "explanation": "'So + adjective + inversion': 'So fascinating was the film that...'.",
      "instruction": "Inversiya bilan to'ldiring:"
    },
    {
      "id": 70515,
      "type": "fill-blank",
      "blanks": [
        "does she complain"
      ],
      "question": "Rarely _____ (she/complain) about the long working hours.",
      "explanation": "'Rarely' gap boshida → inversiya: 'does she complain'. 'Rarely she complains' XATO.",
      "instruction": "Inversiya bilan to'ldiring:"
    },
    {
      "id": 70516,
      "type": "multiple-choice",
      "correct": "Never have I seen such beauty.",
      "options": [
        "Never I have seen such beauty.",
        "Never have I seen such beauty.",
        "Never I seen have such beauty.",
        "Never saw I such beauty."
      ],
      "question": "Which is the correct inversion of 'I have never seen such beauty'?",
      "explanation": "'Never' + auxiliary (have) + S (I) + V₃ (seen). 'Never have I seen...'.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70517,
      "type": "error-correction",
      "correct": "Not only did she win the race, but she also broke the record.",
      "question": "Not only did she won the race, but she also broke the record.",
      "errorPart": "did she won",
      "explanation": "'Did' dan keyin asosiy fe'l BASE FORM (win) bo'ladi, V₂ (won) emas. 'Did she win' TO'G'RI.",
      "instruction": "Xatoni toping:"
    },
    {
      "id": 70518,
      "type": "error-correction",
      "correct": "Only when I finished the book did I understand the message.",
      "question": "Only when did I finish the book I understood the message.",
      "errorPart": "did I finish the book I understood",
      "explanation": "'Only when' dan keyingi bo'lakda inversiya YO'Q. Asosiy gapda 'did I understand'.",
      "instruction": "Xatoni toping:"
    },
    {
      "id": 70519,
      "type": "error-correction",
      "correct": "Hardly had I closed the door when the phone rang.",
      "question": "Hardly I had closed the door when the phone rang.",
      "errorPart": "I had closed",
      "explanation": "'Hardly' dan keyin 'had + S + V₃': 'Hardly had I closed'. 'Hardly I had closed' XATO.",
      "instruction": "Xatoni toping:"
    },
    {
      "id": 70520,
      "hint": "Not only ...",
      "type": "transformation",
      "correct": "Not only did I lose my wallet, but I also lost my phone.",
      "question": "I not only lost my wallet but also my phone.",
      "explanation": "'Not only' gap boshiga → 'did I lose'. 'But also' qismida fe'l takrorlanadi: 'but I also lost'.",
      "instruction": "Inversiya bilan qayta yozing:"
    },
    {
      "id": 70521,
      "hint": "Rarely ...",
      "type": "transformation",
      "correct": "Rarely does the audience hear such beautiful music.",
      "question": "The audience rarely hears such beautiful music.",
      "explanation": "'Rarely' gap boshida → 'does the audience hear'. 'Hears' → 'does hear'.",
      "instruction": "Inversiya bilan qayta yozing:"
    },
    {
      "id": 70522,
      "hint": "Only through ...",
      "type": "transformation",
      "correct": "Only through hard work can we achieve true success.",
      "question": "We can achieve true success only through hard work.",
      "explanation": "'Only through + noun' → keyin inversiya: 'can we achieve'.",
      "instruction": "Inversiya bilan qayta yozing:"
    },
    {
      "id": 70523,
      "hint": "Not until ...",
      "type": "transformation",
      "correct": "Not until he got sick did he realize the importance of health.",
      "question": "He didn't realize the importance of health until he got sick.",
      "explanation": "'Not until + clause' → keyin inversiya: 'did he realize'.",
      "instruction": "Inversiya bilan qayta yozing:"
    },
    {
      "id": 70524,
      "type": "fill-blank",
      "blanks": [
        "was the chaos"
      ],
      "question": "Such _____ (be/the chaos) that nobody knew what to do.",
      "explanation": "'Such + be + inversion': 'Such was the chaos that...'.",
      "instruction": "Inversiya bilan to'ldiring:"
    },
    {
      "id": 70525,
      "type": "multiple-choice",
      "correct": "Hardly...when",
      "options": [
        "Hardly...when",
        "No sooner...when",
        "Hardly...than",
        "No sooner...that"
      ],
      "question": "___ had we finished eating ___ the waiter brought the bill.",
      "explanation": "'Hardly...when' — 'Hardly had we finished eating when the waiter brought the bill'.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70526,
      "type": "error-correction",
      "correct": "Never have I encountered such a challenging problem before.",
      "question": "Never I have encountered such a challenging problem before.",
      "errorPart": "I have encountered",
      "explanation": "'Never' gap boshida → inversiya: 'have I encountered'. 'I have encountered' oddiy tartib.",
      "instruction": "Xatoni toping:"
    }
  ],
  "exerciseSections": [
    {
      "ids": [
        3601,
        3602,
        3603,
        3604,
        3605
      ],
      "desc": "Not only, Never, Rarely — asosiy inversiya qoidalari",
      "icon": "🌱",
      "color": "bg-emerald-500",
      "title": "Asosiy"
    },
    {
      "ids": [
        3606,
        3607,
        3608,
        3609,
        3610
      ],
      "desc": "Fill-blank va MCQ — qoidani mustahkamlash",
      "icon": "📘",
      "color": "bg-blue-500",
      "title": "O'rtacha"
    },
    {
      "ids": [
        3611,
        3612,
        3613,
        3614,
        3615
      ],
      "desc": "Error-correction — keng tarqalgan xatolar",
      "icon": "💪",
      "color": "bg-violet-500",
      "title": "Qiyin"
    },
    {
      "ids": [
        3616,
        3617,
        3618,
        3619,
        3620
      ],
      "desc": "Transformation — IELTS darajasidagi mashqlar",
      "icon": "🏆",
      "color": "bg-rose-500",
      "title": "Yuqori daraja"
    }
  ],
  "tests": [
    {
      "id": 70527,
      "type": "multiple-choice",
      "correct": "Aux + S + V",
      "options": [
        "S + V",
        "V + S",
        "Aux + S + V",
        "S + Aux + V"
      ],
      "question": "'Not only' dan keyin qanday tartib ishlatiladi?",
      "explanation": "'Not only' dan keyin auxiliary + subject + verb (inversiya) ishlatiladi.",
      "instruction": "Asosiy inversiya"
    },
    {
      "id": 70528,
      "type": "multiple-choice",
      "correct": "Inversiya",
      "options": [
        "Oddiy tartib",
        "Inversiya",
        "Savol shakli",
        "Hech qanday o'zgarish"
      ],
      "question": "'Rarely' gap boshida kelsa, qanday tartib bo'ladi?",
      "explanation": "'Rarely' salbiy ma'noli so'z → inversiya: 'Rarely do we...'.",
      "instruction": "Asosiy inversiya"
    },
    {
      "id": 70529,
      "type": "multiple-choice",
      "correct": "Ha",
      "options": [
        "Ha",
        "Yo'q",
        "Faqat savolda",
        "Faqat so'roq gapda"
      ],
      "question": "'Never have I seen such beauty' — bu gapda inversiya bormi?",
      "explanation": "'Never' + 'have I' (auxiliary + S) → ha, inversiya bor.",
      "instruction": "Asosiy inversiya"
    },
    {
      "id": 70530,
      "type": "multiple-choice",
      "correct": "when",
      "options": [
        "than",
        "then",
        "when",
        "that"
      ],
      "question": "'Hardly' bilan qaysi bog'lovchi ishlatiladi?",
      "explanation": "'Hardly...when' — 'Hardly had we started when it rained'.",
      "instruction": "Asosiy inversiya"
    },
    {
      "id": 70531,
      "type": "multiple-choice",
      "correct": "than",
      "options": [
        "when",
        "than",
        "then",
        "that"
      ],
      "question": "'No sooner' bilan qaysi bog'lovchi ishlatiladi?",
      "explanation": "'No sooner...than' — 'No sooner had we left than it rained'.",
      "instruction": "Asosiy inversiya"
    },
    {
      "id": 70532,
      "type": "multiple-choice",
      "correct": "Not only",
      "options": [
        "Not only",
        "Only",
        "Never",
        "Hardly"
      ],
      "question": "___ does she speak Arabic, but she also writes poetry in it.",
      "explanation": "'Not only...but also' strukturasi. 'Not only does she speak...but she also writes'.",
      "instruction": "Qoidani qo'llash"
    },
    {
      "id": 70533,
      "type": "multiple-choice",
      "correct": "Hardly",
      "options": [
        "No sooner",
        "Hardly",
        "Only",
        "Seldom"
      ],
      "question": "___ had the film started when the projector broke.",
      "explanation": "'Hardly...when' → 'Hardly had the film started when the projector broke'.",
      "instruction": "Qoidani qo'llash"
    },
    {
      "id": 70534,
      "type": "multiple-choice",
      "correct": "did I realize",
      "options": [
        "I realized",
        "did I realize",
        "I did realize",
        "realized I"
      ],
      "question": "Only after the exam ___ how much I had to study.",
      "explanation": "'Only after' dan keyin asosiy gapda inversiya: 'did I realize'.",
      "instruction": "Qoidani qo'llash"
    },
    {
      "id": 70535,
      "type": "multiple-choice",
      "correct": "Seldom do I eat meat.",
      "options": [
        "Seldom I eat meat.",
        "Seldom do I eat meat.",
        "Seldom eat I meat.",
        "I seldom do eat meat."
      ],
      "question": "Which is the correct inversion of 'I seldom eat meat'?",
      "explanation": "'Seldom' gap boshida → 'do I eat'. 'Seldom I eat' XATO.",
      "instruction": "Qoidani qo'llash"
    },
    {
      "id": 70536,
      "type": "multiple-choice",
      "correct": "did I understand",
      "options": [
        "I understood",
        "did I understand",
        "I did understand",
        "understood I"
      ],
      "question": "Not until I graduated ___ the value of education.",
      "explanation": "'Not until' + clause + inversiya: 'did I understand'.",
      "instruction": "Qoidani qo'llash"
    },
    {
      "id": 70537,
      "type": "multiple-choice",
      "correct": "Hardly had we arrived when it rained.",
      "options": [
        "Hardly we had arrived when it rained.",
        "Hardly had we arrived when it rained.",
        "Hardly had we arrived than it rained.",
        "Hardly we had arrived than it rained."
      ],
      "question": "Which sentence is grammatically correct?",
      "explanation": "'Hardly + had + S + V₃ + when'. 'Than' bilan emas.",
      "instruction": "Murakkab"
    },
    {
      "id": 70538,
      "type": "multiple-choice",
      "correct": "powerful was his speech",
      "options": [
        "his speech was powerful",
        "powerful his speech was",
        "powerful was his speech",
        "was his speech powerful"
      ],
      "question": "So ___ that nobody dared to interrupt.",
      "explanation": "'So + adjective + inversion': 'So powerful was his speech that...'.",
      "instruction": "Murakkab"
    },
    {
      "id": 70539,
      "type": "multiple-choice",
      "correct": "Only after did he leave did she cry.",
      "options": [
        "Only after he left did she cry.",
        "Only after did he leave did she cry.",
        "Only after he left she cried.",
        "Only after leaving did she cry."
      ],
      "question": "Which sentence contains a double inversion error?",
      "explanation": "Ikkala qismda inversiya xato: Only after dan keyin faqat asosiy gapda inversiya.",
      "instruction": "Murakkab"
    },
    {
      "id": 70540,
      "type": "multiple-choice",
      "correct": "Ikkala qismdagi fe'llar",
      "options": [
        "Faqat fe'l",
        "Faqat ot",
        "Ikkala qismdagi fe'llar",
        "Hech qanday talab yo'q"
      ],
      "question": "'Not only but also' qaysi qismida parallel tuzilma bo'lishi kerak?",
      "explanation": "'Not only...but also' ikkala qismdagi fe'llar parallel bo'lishi kerak.",
      "instruction": "Yuqori daraja"
    },
    {
      "id": 70541,
      "type": "multiple-choice",
      "correct": "Not only...but also",
      "options": [
        "Never have I...",
        "Not only...but also",
        "Hardly had...when",
        "Only then did..."
      ],
      "question": "Which inversion structure is best for IELTS Writing Task 2 argumentative essays?",
      "explanation": "'Not only...but also' argumentativ essaylarda qo'shimcha dalil keltirish uchun eng foydali inversiya strukturasidir.",
      "instruction": "Yuqori daraja"
    }
  ],
  "testSections": [
    {
      "ids": [
        361,
        362,
        363,
        364,
        365
      ],
      "desc": "Inversiya asoslari — boshlang'ich test",
      "icon": "🌱",
      "color": "bg-emerald-500",
      "title": "Asosiy"
    },
    {
      "ids": [
        366,
        367,
        368,
        369,
        370
      ],
      "desc": "Qoidani qo'llash — o'rganish",
      "icon": "📘",
      "color": "bg-blue-500",
      "title": "O'rtacha"
    },
    {
      "ids": [
        371,
        372,
        373
      ],
      "desc": "Murakkab holatlar — tahlil",
      "icon": "💪",
      "color": "bg-violet-500",
      "title": "Qiyin"
    },
    {
      "ids": [
        374,
        375
      ],
      "desc": "IELTS darajasi — sinov",
      "icon": "🏆",
      "color": "bg-rose-500",
      "title": "Yuqori daraja"
    }
  ]
}

export const cleftSentencesB2: DailyLesson = {
  "id": "cleft-sentences-b2",
  speaking: {
    prompt: "Emphasise the important part of your message using cleft sentences. Speak for about one minute. Use structures like 'It is... that/who...' and 'What... is...'.",
    tips: [
      "'It was English that changed my life.'",
      "'What I need is more practice.'",
      "'It is my family who support me.'",
      "Gapning muhim qismini ajratib ko'rsatadi.",
    ],
    sampleAnswer: "It was my grandmother who first inspired me to learn English. What she taught me was the value of never giving up. It is patience, more than talent, that leads to success. What I enjoy most about learning is the feeling of progress. It was only after years of practice that I became confident. What really motivates me is the chance to connect with people around the world. It is not money that I am chasing, but knowledge and opportunity. What I would tell any beginner is this: it is consistency that makes all the difference.",
  },
  "title": "Cleft Sentences — It is/was...that/who",
  "subtitle": "Ajratilgan gaplar: biror bo'lakni alohida ta'kidlash",
  "level": "B2",
  "day": 75,
  "listening": {
    "transcript": "Detective: It was the gardener who broke the window, not the maid.\nAssistant: Are you sure?\nDetective: Yes. What he wanted was the painting, not the money.\nAssistant: Interesting. When did it happen?\nDetective: It was at midnight that he entered the house.\nAssistant: And the alarm?\nDetective: It was the alarm that scared him away. What saved the painting was luck.\nAssistant: So he failed?\nDetective: Exactly. It was his own mistake that gave him away.\nAssistant: Clever work, detective!",
    "vocabulary": [
      { "word": "gardener", "definition": "bog'bon" },
      { "word": "maid", "definition": "xizmatchi ayol" },
      { "word": "midnight", "definition": "yarim tun" },
      { "word": "alarm", "definition": "signalizatsiya, ogohlantirgich" },
      { "word": "mistake", "definition": "xato" }
    ],
    "questions": [
      { "id": 101718, "type": "multiple-choice", "question": "Who broke the window?", "options": ["The maid", "The gardener", "The detective", "A guest"], "correctIndex": 1, "explanation": "'It was the gardener who broke the window' — cleft sentence for emphasis." },
      { "id": 101719, "type": "multiple-choice", "question": "What did he want?", "options": ["The money", "The painting", "The keys", "The car"], "correctIndex": 1, "explanation": "'What he wanted was the painting, not the money' — wh-cleft." },
      { "id": 101720, "type": "true-false", "question": "He entered the house at noon.", "answer": false, "explanation": "'It was at midnight that he entered the house.'" },
      { "id": 101721, "type": "multiple-choice", "question": "What scared him away?", "options": ["A dog", "The alarm", "A light", "The maid"], "correctIndex": 1, "explanation": "'It was the alarm that scared him away.'" },
      { "id": 101722, "type": "multiple-choice", "question": "What gave him away?", "options": ["A witness", "His own mistake", "A camera", "The police"], "correctIndex": 1, "explanation": "'It was his own mistake that gave him away.'" }
    ],
    "difficulty": "hard",
    "topic": "Cleft gaplar — It is/was...that/who, What...was"
  },
  "category": "IELTS Preparation",
  "formulas": [
    {
      "color": "blue",
      "label": "It is/was...that/who",
      "structure": "It is/was + S/O + that/who + V\nIt was John who won the prize.",
      "explanation": "Cleft: 'It is/was + qism + that/who' — muhim qismni ajratadi.",
      "whenToUse": "Gapning bir qismini kuchli ta'kidlaganda.",
      "example": "It was John who won."
    },
    {
      "color": "green",
      "label": "What...is/was",
      "structure": "What + S + V + is/was + (that) + ...\nWhat I need is a good rest.",
      "explanation": "'What + ... + is/was' — muhim fikrni ajratish.",
      "whenToUse": "Nimani ta'kidlamoqchi ekaningizni ochganda.",
      "example": "What I need is more time."
    },
    {
      "color": "orange",
      "label": "All...is/was",
      "structure": "All + (that) + S + V + is/was + ...\nAll I want is your happiness.",
      "explanation": "'All + ... + is/was' — 'faqat' ma'nosida ajratish.",
      "whenToUse": "Yagona narsani ta'kidlaganda.",
      "example": "All I want is peace."
    },
    {
      "color": "violet",
      "label": "The thing / The reason / The person",
      "structure": "The thing that + V + is/was + ...\nThe reason why I left was the noise.",
      "explanation": "'The thing/reason that... is' — ajratuvchi qolip.",
      "whenToUse": "Aniq jihatni (sabab/narsa/shaxs) ta'kidlaganda.",
      "example": "The reason why I came is to help."
    }
  ],
  "rules": [
    "1️⃣ CLEFT SENTENCES NIMA VA NEGA KERAK?\n\nCleft sentences — bu gapni ikki qismga ajratib, biror bo'lakni (sub'ekt, ob'ekt, vaqt, sabab) alohida ta'kidlash usuli. 'Cleft' so'zi 'bo'lingan, ajratilgan' ma'nosini bildiradi.\n\n📌 NEGA KERAK?\n• Biror ma'lumotni kuchaytirish (emphasis)\n• Yangi ma'lumotni kiritish\n• Qarama-qarshilikni ko'rsatish\n• IELTS Writing va Speaking da yuqori ball olish\n\n📌 ODDIY GAP: John won the prize. (John sovrinni yutdi.)\nCLEFT: It was John who won the prize. (Aynan John sovrinni yutdi.)\n\n📌 FARQ: Oddiy gapda hech qanday ta'kid yo'q. Cleft sentence da 'It was...who' orqali 'John' ta'kidlanadi.\n\n📌 IELTS TIP: Cleft sentences — Band 7+ uchun muhim grammatik vosita. Writing Task 2 da fikrni aniq ifodalashda juda foydali.",
    "2️⃣ IT IS / IT WAS + TA'KID + THAT / WHO\n\n📌 TUZILISHI:\n  It + is/was + ta'kidlanayotgan bo'lak + that/who + qolgan qism\n\n📌 TA'KIDLASH TURLARI:\n\n  a) Sub'ektni ta'kidlash:\n    → It was John who won the prize.\n    (Aynan John sovrinni yutdi.)\n    → It is education that transforms lives.\n    (Aynan ta'lim hayotni o'zgartiradi.)\n\n  b) Ob'ektni ta'kidlash:\n    → It was the prize that John won.\n    (Aynan sovrinni John yutdi.)\n    → It is English that I want to learn.\n    (Aynan ingliz tilini men o'rganmoqchiman.)\n\n  c) Vaqtni ta'kidlash:\n    → It was in 1991 that Uzbekistan gained independence.\n    (Aynan 1991 yilda O'zbekiston mustaqillikka erishdi.)\n\n  d) Joyni ta'kidlash:\n    → It was in Tashkent that I met her.\n    (Aynan Toshkentda men uni uchratdim.)\n\n  e) Sababni ta'kidlash:\n    → It was because of the rain that we cancelled the trip.\n    (Aynan yomg'ir tufayli biz sayohatni bekor qildik.)\n\n📌 QOIDA: Odamlar uchun 'who' yoki 'that' ishlatiladi. Narsalar, vaqt, joy, sabab uchun 'that' ishlatiladi.\n  → It was my mother who/that taught me patience. (Odam → who/that)\n  → It was patience that my mother taught me. (Narsa → that)",
    "3️⃣ WHAT...IS / WAS — 'NIMA BO'LSA...O'SHA'\n\n📌 TUZILISHI:\n  What + S + V + is/was + (that) + ta'kidlanayotgan qism\n\n  → What I need is a good rest.\n  (Menga kerak bo'lgan narsa — yaxshi dam olish.)\n  → What impressed me most was her dedication.\n  (Meni eng ko'p hayratga solgan narsa — uning fidoyiligi.)\n\n📌 MA'NO: 'What...is/was' strukturasi butun bir harakat yoki narsani ta'kidlaydi. Bu 'It is/was...that' dan farqli — unda bir so'z emas, butun bir tushuncha ta'kidlanadi.\n\n📌 ZAMONLAR:\n  • Hozirgi zamon (present): What + S + V₁ + is + ...\n    → What I want is a peaceful life.\n  • O'tgan zamon (past): What + S + V₂ + was + ...\n    → What she said was completely true.\n  • Kelasi zamon (future): What + S + will + V₁ + will be + ...\n    → What will matter most will be your health.\n\n📌 MUHIM: 'What' bilan boshlangan qismdan keyin 'is/was' keladi. 'What I need is...' — 'need' dan keyin 'is', 'are' emas.\n\n  ❌ What I need are a good rest.\n  ✅ What I need is a good rest.\n\n  ❌ What she said were lies.\n  ✅ What she said was lies. yoki What she said was a lie.\n  (What + V + singular hisoblanadi, 'is/was' oladi)",
    "4️⃣ ALL...IS / WAS — 'BARCHASI...FAKAT...'\n\n📌 TUZILISHI:\n  All + (that) + S + V + is/was + ta'kidlanayotgan qism\n\n  → All I want is your happiness.\n  (Men istagan yagona narsa — sizning baxtingiz.)\n  → All that she could do was wait.\n  (U qila oladigan yagona narsa — kutish edi.)\n\n📌 MA'NO: 'All' strukturasi 'What' ga o'xshaydi, lekin 'faqat/only' ma'nosini beradi. 'All' = 'the only thing'.\n\n📌 FARQLAR:\n  • What I want is... = Menga kerak bo'lgan narsa... (umumiy)\n  • All I want is... = Men istagan yagona narsa... (cheklangan, faqat)\n\n📌 THE THING / THE PERSON / THE REASON / THE PLACE:\n  → The thing that surprised me most was his honesty.\n  (Meni eng hayratga solgan narsa — uning halolligi.)\n  → The person who helped me most was my teacher.\n  (Menga eng ko'p yordam bergan odam — o'qituvchim.)\n  → The reason why I left was the unbearable noise.\n  (Ketishimning sababi — chidab bo'lmas shovqin edi.)\n  → The place where we met was the library.\n  (Uchrashgan joyimiz — kutubxona edi.)\n\n📌 IELTS TIP: 'The reason why...is...' Writing Task 2 da sabab-natija bog'lashda juda foydali.",
    "5️⃣ CLEFT SENTENCES BILAN BOG'LIQ MUHIM QOIDALAR\n\n📌 1) 'IT IS/WAS' VAQT BILAN:\n  'It is' + hozirgi / kelasi zamon\n  'It was' + o'tgan zamon\n  → It is tomorrow that we have the exam.\n  → It was yesterday that she called.\n\n📌 2) 'THAT' NI TUSHIRIB QOLDIRISH:\n  'It is/was...that' da 'that' tushirib qoldirilishi mumkin, lekin rasmiy yozuvda saqlash tavsiya etiladi.\n  → It was John (that) I saw.\n\n📌 3) KO'PLIKDA:\n  'It is/was' dan keyin ko'plikda ham 'is/was' qoladi:\n  → It is the students who are responsible. (students ko'plik — 'are')\n  → It was the books that were lost. (books ko'plik — 'were')\n\n📌 4) 'WHAT' BILAN FE'L SHARTI:\n  What + S + V + is/was — 'What' dan keyin doim singular fe'l (is/was):\n  → What we need is more time. (more time ko'plik bo'lsa ham → 'is')\n\n📌 5) INFORMAL VA FORMAL:\n  • Informal: The thing is... / What happened was...\n  • Formal: It is evident that... / What must be emphasized is...\n\n📌 IELTS TIP: Writing Task 2 da cleft sentences dan haftasiga 2-3 marta foydalanish yuqori ball olishga yordam beradi."
  ],
  "vocabulary": [
    {
      "en": "cleft sentence",
      "uz": "ajratilgan gap (ta'kidli tuzilma)",
      "rule": "Grammatik atama",
      "example": "Cleft sentences are used to emphasize a particular part of a sentence."
    },
    {
      "en": "emphasis",
      "uz": "ta'kid, urg'u",
      "rule": "Ot, B2 darajasi",
      "example": "The emphasis in this sentence is on the subject."
    },
    {
      "en": "highlight",
      "uz": "ta'kidlamoq, ajratib ko'rsatmoq",
      "rule": "Fe'l, formal",
      "example": "This structure highlights the most important information."
    },
    {
      "en": "foreground",
      "uz": "oldingi planga chiqarmoq",
      "rule": "Fe'l, akademik",
      "example": "Cleft sentences foreground the new or important information."
    },
    {
      "en": "transform",
      "uz": "o'zgartirmoq, aylantirmoq",
      "rule": "Fe'l, o'quv jarayoni",
      "example": "Transform this simple sentence into a cleft sentence."
    },
    {
      "en": "dedication",
      "uz": "fidoyilik, sadoqat",
      "rule": "Ot, B2 darajasi",
      "example": "What impressed me most was her dedication to the project."
    },
    {
      "en": "generosity",
      "uz": "saxovat, saxiylik",
      "rule": "Ot, mavhum tushuncha",
      "example": "It was her generosity that touched everyone."
    },
    {
      "en": "integrity",
      "uz": "halollik, butunlik",
      "rule": "Ot, akademik",
      "example": "What I admire about him is his integrity."
    },
    {
      "en": "crucial",
      "uz": "muhim, hal qiluvchi",
      "rule": "Sifat, B2 darajasi",
      "example": "It was a crucial decision that changed everything."
    },
    {
      "en": "significant",
      "uz": "ahamiyatli, muhim",
      "rule": "Sifat, akademik",
      "example": "What is significant is the long-term impact."
    },
    {
      "en": "emphasize",
      "uz": "ta'kidlamoq",
      "rule": "Fe'l, formal",
      "example": "I want to emphasize the importance of education."
    },
    {
      "en": "distinguish",
      "uz": "farqlamoq, ajratmoq",
      "rule": "Fe'l, B2 darajasi",
      "example": "Cleft sentences help distinguish the main point."
    },
    {
      "en": "it-cleft",
      "uz": "it-gapli bo'lak",
      "rule": "It + be + X + that/who...",
      "example": "It was John who won the prize."
    },
    {
      "en": "wh-cleft",
      "uz": "wh-gapli bo'lak",
      "rule": "What/All + clause + be + X",
      "example": "What I need is a break."
    },
    {
      "en": "pseudo-cleft",
      "uz": "soxta bo'lak",
      "rule": "The reason why / What / All + ...",
      "example": "The reason why I left was the noise."
    }
  ],
  "examples": [
    {
      "en": "It was my sister who encouraged me to study abroad.",
      "uz": "Aynan opam meni chet elda o'qishga undadi."
    },
    {
      "en": "What I admire most about her is her determination.",
      "uz": "Men unda eng ko'p qoyil qoladigan narsa — uning qat'iyati."
    },
    {
      "en": "All I ask is that you listen to my point of view.",
      "uz": "Men so'raydigan yagona narsa — siz mening fikrimni tinglashingiz."
    },
    {
      "en": "It was in 2016 that I first visited London.",
      "uz": "Aynan 2016 yilda men Londonga birinchi marta tashrif buyurdim."
    },
    {
      "en": "What the country needs is comprehensive educational reform.",
      "uz": "Mamlakatga kerak bo'lgan narsa — keng qamrovli ta'lim islohoti."
    },
    {
      "en": "The reason why the project failed was lack of funding.",
      "uz": "Loyihaning muvaffaqiyatsizlikka uchrash sababi — mablag' yetishmasligi."
    },
    {
      "en": "It is not what you say but what you do that matters.",
      "uz": "Muhim bo'lgan narsa — sizning gapingiz emas, harakatingiz."
    },
    {
      "en": "All that is needed is a little patience and understanding.",
      "uz": "Kerak bo'lgan yagona narsa — biroz sabr va tushunish."
    }
  ],
  "specialCases": [
    {
      "id": "it-is-vs-what",
      "rule": "'It is...that' — biror aniq bo'lakni (sub'ekt, ob'ekt, vaqt, joy) ta'kidlaydi. 'What...is' — butun bir tushuncha yoki harakatni ta'kidlaydi. 'It was John who won' — aynan John. 'What impressed me was...' — meni hayratga solgan narsa.",
      "title": "It is...that vs What...is — farq va qo'llanish",
      "drills": [
        {
          "id": 70542,
          "type": "multiple-choice",
          "correct": "It was John who...",
          "options": [
            "What I saw was...",
            "It was John who...",
            "All I know is...",
            "The thing is..."
          ],
          "question": "Which structure emphasizes a specific person?",
          "explanation": "'It was...who' aniq bir odamni ta'kidlaydi. 'What' va 'All' tushunchalarni ta'kidlaydi.",
          "instruction": "To'g'ri variantni tanlang:"
        },
        {
          "id": 70543,
          "hint": "It is ...",
          "type": "transformation",
          "correct": "It is education that transforms lives.",
          "question": "Education transforms lives.",
          "explanation": "'Education' ni ta'kidlash → 'It is education that transforms lives'.",
          "instruction": "'It is...that' ga o'zgartiring:"
        },
        {
          "id": 70544,
          "type": "fill-blank",
          "blanks": [
            "appreciate"
          ],
          "question": "What I _____ (appreciate) most about this city is its rich history.",
          "explanation": "'What + S + V + is...' → 'What I appreciate most about this city is...'.",
          "instruction": "'What...is' bilan to'ldiring:"
        }
      ],
      "examples": [
        {
          "en": "It was the money that caused the argument. (Aniq narsa)",
          "uz": "Aynan pul janjalga sabab bo'ldi."
        },
        {
          "en": "What caused the argument was the lack of trust. (Tushuncha)",
          "uz": "Janjalga sabab bo'lgan narsa — ishonchsizlik edi."
        }
      ],
      "mnemonic": "IT IS + aniq bir so'z (John, yesterday, the book). WHAT + butun bir fikr (what I need, what happened). IT IS = barmoq bilan ko'rsatish. WHAT = qo'l bilan ishora.",
      "commonMistakes": "'What I need is...' dan keyin ko'plik fe'l ishlatish: 'What I need are...' XATO → 'What I need is...' TO'G'RI. 'It is' dan keyin 'who' o'rniga 'that' ishlatish odamlar uchun ham mumkin, lekin 'who' afzal."
    },
    {
      "id": "all-structure",
      "rule": "'All (that) + S + V + is/was + ...' — 'the only thing' ma'nosini bildiradi. 'All I want is peace' = 'The only thing I want is peace'. 'All' dan keyin 'that' tushirib qoldirilishi mumkin.",
      "title": "All...is/was — faqatgina ma'nosi",
      "drills": [
        {
          "id": 70545,
          "type": "error-correction",
          "correct": "All (that) I need is your support.",
          "question": "All what I need is your support.",
          "errorPart": "All what",
          "explanation": "'All what' xato. 'All that' yoki faqat 'All I need'.",
          "instruction": "Xatoni toping:"
        },
        {
          "id": 70546,
          "type": "fill-blank",
          "blanks": [
            "wants"
          ],
          "question": "All she _____ (want) is a little recognition for her work.",
          "explanation": "'All + S + V + is...' → 'All she wants is a little recognition'.",
          "instruction": "'All...is' bilan to'ldiring:"
        },
        {
          "id": 70547,
          "hint": "All ...",
          "type": "transformation",
          "correct": "All I need is a good sleep.",
          "question": "The only thing I need is a good sleep.",
          "explanation": "'The only thing' → 'All'. 'All I need is a good sleep'.",
          "instruction": "'All...is' bilan qayta yozing:"
        }
      ],
      "examples": [
        {
          "en": "All that glitters is not gold.",
          "uz": "Yaltiraganning hammasi oltin emas."
        },
        {
          "en": "All I am asking for is a fair chance.",
          "uz": "Men so'rayotgan yagona narsa — adolatli imkoniyat."
        }
      ],
      "mnemonic": "ALL = ONLY THING. 'All I want is...' = 'Only thing I want is...'. ALL dan keyin doim singular fe'l (is/was).",
      "commonMistakes": "'All' dan keyin ko'plik fe'l qo'yish: 'All I need are love' XATO → 'All I need is love' TO'G'RI. 'All what I want' XATO — 'what' emas, 'that' yoki hech narsa: 'All (that) I want'."
    },
    {
      "id": "the-reason-why",
      "rule": "'The reason why + S + V + is/was + that...' — sababni aniq ko'rsatish uchun. 'Why' tushirib qoldirilishi mumkin: 'The reason (why) I left was the noise'. Rasmiy yozuvda 'the reason...is that' (is because emas) ishlatiladi.",
      "title": "The reason why...is — sababni ta'kidlash",
      "drills": [
        {
          "id": 70548,
          "type": "error-correction",
          "correct": "The reason why I am late is the traffic jam.",
          "question": "The reason why I am late is because of the traffic jam.",
          "errorPart": "because of",
          "explanation": "'The reason...is because' xato. 'The reason is the traffic jam' yoki 'The reason is that there was a traffic jam'.",
          "instruction": "Xatoni toping:"
        },
        {
          "id": 70549,
          "type": "fill-blank",
          "blanks": [
            "succeeded"
          ],
          "question": "The reason why she _____ (succeed) was her hard work.",
          "explanation": "'The reason why + S + V₂ + was...' → 'The reason why she succeeded was her hard work'.",
          "instruction": "'The reason why...is' bilan to'ldiring:"
        },
        {
          "id": 70550,
          "hint": "The reason why ...",
          "type": "transformation",
          "correct": "The reason why I came here was that I wanted to learn from the best.",
          "question": "I came here because I wanted to learn from the best.",
          "explanation": "'because' → 'the reason why...was that'. Formal usul.",
          "instruction": "'The reason why...is' bilan qayta yozing:"
        }
      ],
      "examples": [
        {
          "en": "The reason why I chose this university was its academic reputation.",
          "uz": "Men bu universitetni tanlashimning sababi — uning akademik obro'si."
        },
        {
          "en": "The reason for the delay was the severe weather conditions.",
          "uz": "Kechikishning sababi — og'ir ob-havo sharoiti edi."
        }
      ],
      "mnemonic": "THE REASON WHY...IS THAT — sababni aytishda eng formal usul. ESLAB QOL: 'reason' + 'why' + 'is that'. 'Because' ishlatma: 'The reason is because' XATO.",
      "commonMistakes": "'The reason is because...' XATO — bu double usage xato. 'The reason is that...' TO'G'RI. 'Why' ni tashlab bo'lmaydi deb o'ylash — tashlash mumkin: 'The reason I came is...'."
    }
  ],
  "exercises": [
    {
      "id": 70551,
      "type": "multiple-choice",
      "correct": "It was John who won the prize.",
      "options": [
        "John won the prize.",
        "It was John who won the prize.",
        "John won the prize yesterday.",
        "The prize was won by John."
      ],
      "question": "Which is a cleft sentence?",
      "explanation": "'It was...who' — bu cleft sentence. Odatiy gap emas, ta'kidli tuzilma.",
      "instruction": "Cleft sentence tanlang:"
    },
    {
      "id": 70552,
      "type": "multiple-choice",
      "correct": "What",
      "options": [
        "That",
        "What",
        "It",
        "Who"
      ],
      "question": "___ I need is more time to prepare.",
      "explanation": "'What...is' — 'What I need is more time'. 'It I need' XATO.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70553,
      "type": "multiple-choice",
      "correct": "who",
      "options": [
        "which",
        "what",
        "who",
        "whom"
      ],
      "question": "It was my mother ___ taught me to be patient.",
      "explanation": "Odamlar uchun 'who' ishlatiladi: 'It was my mother who taught me'.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70554,
      "type": "multiple-choice",
      "correct": "is",
      "options": [
        "are",
        "is",
        "were",
        "have"
      ],
      "question": "All I want ___ a little peace and quiet.",
      "explanation": "'All...is' — 'All' dan keyin 'is' keladi (singular). 'All I want is peace'.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70555,
      "type": "multiple-choice",
      "correct": "What",
      "options": [
        "It",
        "That",
        "What",
        "Which"
      ],
      "question": "___ impressed me most was her confidence.",
      "explanation": "'What...was' — 'What impressed me most was her confidence'.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70556,
      "type": "fill-blank",
      "blanks": [
        "that"
      ],
      "question": "It was in Tashkent _____ I first met my best friend.",
      "explanation": "Joyni ta'kidlash → 'It was in Tashkent that...'. 'Where' emas, 'that' ishlatiladi.",
      "instruction": "Cleft sentence bilan to'ldiring:"
    },
    {
      "id": 70557,
      "type": "fill-blank",
      "blanks": [
        "needs"
      ],
      "question": "What the government _____ (need) to do is invest in education.",
      "explanation": "'What + S + V + is...' → 'What the government needs to do is invest'.",
      "instruction": "Cleft sentence bilan to'ldiring:"
    },
    {
      "id": 70558,
      "type": "fill-blank",
      "blanks": [
        "asked"
      ],
      "question": "All that she _____ (ask) for was a fair opportunity.",
      "explanation": "'All that + S + V₂ + was...' → 'All that she asked for was a fair opportunity'.",
      "instruction": "Cleft sentence bilan to'ldiring:"
    },
    {
      "id": 70559,
      "type": "fill-blank",
      "blanks": [
        "because of the rain"
      ],
      "question": "It was _____ (because/the rain) that we stayed indoors.",
      "explanation": "Sababni ta'kidlash: 'It was because of the rain that...'.",
      "instruction": "Cleft sentence bilan to'ldiring:"
    },
    {
      "id": 70560,
      "type": "fill-blank",
      "blanks": [
        "left"
      ],
      "question": "The reason why he _____ (leave) his job was the lack of growth.",
      "explanation": "'The reason why + S + V₂ + was...' → 'The reason why he left his job was...'.",
      "instruction": "Cleft sentence bilan to'ldiring:"
    },
    {
      "id": 70561,
      "type": "error-correction",
      "correct": "It was my friends who were supporting me all the way.",
      "question": "It was my friends who was supporting me all the way.",
      "errorPart": "who was",
      "explanation": "'Friends' ko'plik → 'were', 'was' emas. 'It was' dan keyin ko'plikda 'were'.",
      "instruction": "Xatoni toping:"
    },
    {
      "id": 70562,
      "type": "error-correction",
      "correct": "What I need is more time to complete the project.",
      "question": "What I need are more time to complete the project.",
      "errorPart": "are",
      "explanation": "'What I need' singular → 'is', 'are' emas. 'What + S + V + is'.",
      "instruction": "Xatoni toping:"
    },
    {
      "id": 70563,
      "type": "error-correction",
      "correct": "All (that) she wants is a fair chance to prove herself.",
      "question": "All what she wants is a fair chance to prove herself.",
      "errorPart": "All what",
      "explanation": "'All what' xato. 'All that' yoki faqat 'All she wants'.",
      "instruction": "Xatoni toping:"
    },
    {
      "id": 70564,
      "hint": "It was ...",
      "type": "transformation",
      "correct": "It was in London that I met her.",
      "question": "I met her in London.",
      "explanation": "Joyni ta'kidlash: 'It was in London that I met her'.",
      "instruction": "Cleft sentence ga o'zgartiring:"
    },
    {
      "id": 70565,
      "hint": "What ...",
      "type": "transformation",
      "correct": "What impressed me the most was his honesty.",
      "question": "His honesty impressed me the most.",
      "explanation": "'What + V₂ + was...' → 'What impressed me the most was his honesty'.",
      "instruction": "Cleft sentence ga o'zgartiring:"
    },
    {
      "id": 70566,
      "hint": "All ...",
      "type": "transformation",
      "correct": "All I need is a quiet place to study.",
      "question": "I only need a quiet place to study.",
      "explanation": "'All + S + V + is...' → 'All I need is a quiet place to study'.",
      "instruction": "Cleft sentence ga o'zgartiring:"
    },
    {
      "id": 70567,
      "hint": "The reason why ...",
      "type": "transformation",
      "correct": "The reason why she left was the unbearable noise.",
      "question": "She left because of the unbearable noise.",
      "explanation": "'The reason why + S + V₂ + was...' → sababni ta'kidlash.",
      "instruction": "Cleft sentence ga o'zgartiring:"
    },
    {
      "id": 70568,
      "type": "multiple-choice",
      "correct": "It was yesterday that she called.",
      "options": [
        "It was John who called.",
        "It was yesterday that she called.",
        "What I need is rest.",
        "All I know is the truth."
      ],
      "question": "Which sentence emphasizes TIME?",
      "explanation": "'It was yesterday that...' — vaqtni (yesterday) ta'kidlaydi.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70569,
      "type": "multiple-choice",
      "correct": "The reason why I left was the noise.",
      "options": [
        "I left because of the noise.",
        "The reason why I left was the noise.",
        "I left due to the noise.",
        "The noise made me leave."
      ],
      "question": "Which is the most formal structure for giving a reason?",
      "explanation": "'The reason why...is/was' — eng formal sabab bildirish usuli.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70570,
      "type": "error-correction",
      "correct": "It is the students who are responsible for the project.",
      "question": "It is the students who is responsible for the project.",
      "errorPart": "who is",
      "explanation": "'The students' ko'plik → 'who are'. 'Is' faqat 'It is' da to'g'ri.",
      "instruction": "Xatoni toping:"
    }
  ],
  "exerciseSections": [
    {
      "ids": [
        3701,
        3702,
        3703,
        3704,
        3705
      ],
      "desc": "Cleft sentence turlari — tanib olish",
      "icon": "🌱",
      "color": "bg-emerald-500",
      "title": "Asosiy"
    },
    {
      "ids": [
        3706,
        3707,
        3708,
        3709,
        3710
      ],
      "desc": "Fill-blank — qoidani mustahkamlash",
      "icon": "📘",
      "color": "bg-blue-500",
      "title": "O'rtacha"
    },
    {
      "ids": [
        3711,
        3712,
        3713,
        3714,
        3715
      ],
      "desc": "Error-correction — xatolarni tuzatish",
      "icon": "💪",
      "color": "bg-violet-500",
      "title": "Qiyin"
    },
    {
      "ids": [
        3716,
        3717,
        3718,
        3719,
        3720
      ],
      "desc": "Transformation — IELTS darajasidagi mashqlar",
      "icon": "🏆",
      "color": "bg-rose-500",
      "title": "Yuqori daraja"
    }
  ],
  "tests": [
    {
      "id": 70571,
      "type": "multiple-choice",
      "correct": "Biror bo'lakni ta'kidlash",
      "options": [
        "Gapni qisqartirish",
        "Biror bo'lakni ta'kidlash",
        "Savol berish",
        "Kengaytirish qilish"
      ],
      "question": "Cleft sentence nima uchun ishlatiladi?",
      "explanation": "Cleft sentences gapning biror qismini ta'kidlash uchun ishlatiladi.",
      "instruction": "Asosiy"
    },
    {
      "id": 70572,
      "type": "multiple-choice",
      "correct": "who",
      "options": [
        "which",
        "what",
        "who",
        "whom"
      ],
      "question": "It was my brother ___ helped me move.",
      "explanation": "Odamlar uchun 'who' ishlatiladi.",
      "instruction": "Asosiy"
    },
    {
      "id": 70573,
      "type": "multiple-choice",
      "correct": "is",
      "options": [
        "are",
        "is",
        "were",
        "have"
      ],
      "question": "What I need ___ a long vacation.",
      "explanation": "'What' + V + singular 'is'.",
      "instruction": "Asosiy"
    },
    {
      "id": 70574,
      "type": "multiple-choice",
      "correct": "is",
      "options": [
        "are",
        "is",
        "were",
        "have"
      ],
      "question": "All I ask ___ that you listen.",
      "explanation": "'All' + V + singular 'is'.",
      "instruction": "Asosiy"
    },
    {
      "id": 70575,
      "type": "multiple-choice",
      "correct": "that",
      "options": [
        "when",
        "that",
        "which",
        "where"
      ],
      "question": "Which word is correct? 'It was in 2020 ___ the pandemic started.'",
      "explanation": "Vaqtni ta'kidlashda 'that' ishlatiladi, 'when' emas.",
      "instruction": "Asosiy"
    },
    {
      "id": 70576,
      "type": "multiple-choice",
      "correct": "What",
      "options": [
        "It",
        "That",
        "What",
        "Which"
      ],
      "question": "___ impressed me was her professionalism.",
      "explanation": "'What...was' — butun bir tushunchani ta'kidlaydi.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70577,
      "type": "multiple-choice",
      "correct": "because of",
      "options": [
        "because",
        "because of",
        "due",
        "since"
      ],
      "question": "It was ___ the bad weather that we cancelled the trip.",
      "explanation": "'It was because of + noun + that'. 'Because' dan keyin to'liq gap kerak.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70578,
      "type": "multiple-choice",
      "correct": "was",
      "options": [
        "is",
        "was",
        "are",
        "were"
      ],
      "question": "The reason why I called ___ to invite you.",
      "explanation": "'The reason why + V₂ + was' — o'tgan zamon.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70579,
      "type": "multiple-choice",
      "correct": "All that I want",
      "options": [
        "All what I want",
        "All that I want",
        "All which I want",
        "All who I want"
      ],
      "question": "Which is correct?",
      "explanation": "'All that' to'g'ri. 'All what' xato.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70580,
      "type": "multiple-choice",
      "correct": "is",
      "options": [
        "are",
        "is",
        "were",
        "have"
      ],
      "question": "What the country needs ___ comprehensive reforms.",
      "explanation": "'What the country needs' singular → 'is'.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70581,
      "type": "multiple-choice",
      "correct": "All what she wants is love.",
      "options": [
        "It was John who called.",
        "What I need is support.",
        "All what she wants is love.",
        "The reason is that I was busy."
      ],
      "question": "Which sentence has a grammatical error?",
      "explanation": "'All what' xato. To'g'risi: 'All that she wants' yoki 'All she wants'.",
      "instruction": "Qiyin"
    },
    {
      "id": 70582,
      "type": "multiple-choice",
      "correct": "who were",
      "options": [
        "who was",
        "who were",
        "that was",
        "which was"
      ],
      "question": "It was the children ___ playing in the garden.",
      "explanation": "'Children' ko'plik → 'who were'.",
      "instruction": "Qiyin"
    },
    {
      "id": 70583,
      "type": "multiple-choice",
      "correct": "is",
      "options": [
        "are",
        "is",
        "were",
        "have been"
      ],
      "question": "What I admire about her ___ her courage and honesty.",
      "explanation": "'What + S + V' always singular → 'is'. Even if the complement is plural.",
      "instruction": "Qiyin"
    },
    {
      "id": 70584,
      "type": "multiple-choice",
      "correct": "What must be emphasized is the pivotal role of education.",
      "options": [
        "I think education is important.",
        "What must be emphasized is the pivotal role of education.",
        "Education is very important.",
        "Everyone knows education is important."
      ],
      "question": "Which sentence is most appropriate for IELTS Writing Task 2 conclusion?",
      "explanation": "'What must be emphasized is...' — formal cleft sentence, IELTS uchun ideal.",
      "instruction": "Yuqori daraja"
    },
    {
      "id": 70585,
      "type": "multiple-choice",
      "correct": "It is = aniq bo'lak, What = tushuncha",
      "options": [
        "Hech qanday farq yo'q",
        "It is = aniq bo'lak, What = tushuncha",
        "It is = tushuncha, What = aniq bo'lak",
        "Ikkalasi ham bir xil ma'noda"
      ],
      "question": "What is the difference between 'It is...that' and 'What...is'?",
      "explanation": "'It is...that' aniq bir bo'lakni (odam, vaqt, joy), 'What...is' butun tushunchani ta'kidlaydi.",
      "instruction": "Yuqori daraja"
    }
  ],
  "testSections": [
    {
      "ids": [
        376,
        377,
        378,
        379,
        380
      ],
      "desc": "Cleft sentence asoslari",
      "icon": "🌱",
      "color": "bg-emerald-500",
      "title": "Asosiy"
    },
    {
      "ids": [
        381,
        382,
        383,
        384,
        385
      ],
      "desc": "Qoidani qo'llash",
      "icon": "📘",
      "color": "bg-blue-500",
      "title": "O'rtacha"
    },
    {
      "ids": [
        386,
        387,
        388
      ],
      "desc": "Murakkab holatlar",
      "icon": "💪",
      "color": "bg-violet-500",
      "title": "Qiyin"
    },
    {
      "ids": [
        389,
        390
      ],
      "desc": "IELTS darajasi",
      "icon": "🏆",
      "color": "bg-rose-500",
      "title": "Yuqori daraja"
    }
  ]
}

export const advancedPassiveB2: DailyLesson = {
  "id": "advanced-passive-b2",
  speaking: {
    prompt: "Discuss a topic formally, using advanced passive structures. Speak for about one minute. Use passive reporting ('is said to', 'is believed to'), the get-passive, and 'have something done'.",
    tips: [
      "'It is said/believed that...' / 'is thought to be...'",
      "'get + V3' — norasmiy passiv.",
      "'have something done' — kauzativ.",
      "Bajaruvchi noma'lum/muhim emas bo'lganda.",
    ],
    sampleAnswer: "English is widely regarded as the most important language for international communication. It is estimated that over a billion people are learning it right now. The language is believed to have been shaped by many cultures over centuries. In my own experience, a lot can be achieved if lessons are taken seriously. Last year, I had my essays checked by a professional, and my writing was greatly improved as a result. Mistakes should not be feared; rather, they should be seen as opportunities. It is often said that practice makes perfect, and this, I think, is a truth that cannot be denied.",
  },
  "title": "Advanced Passive — Complex Forms",
  "subtitle": "Murakkab passiv tuzilmalar: infinitiv, gerundiy, kauzativ va reporting verb'lar",
  "level": "B2",
  "day": 76,
  "listening": {
    "transcript": "Reporter: It is said that the new policy will help thousands.\nExpert: Yes. The plan is believed to reduce poverty.\nReporter: When will it be implemented?\nExpert: It is expected to start next year. New schools are being built already.\nReporter: Is it true that taxes will rise?\nExpert: It is thought that some taxes may increase slightly.\nReporter: And the response?\nExpert: The policy is considered fair by most economists. It is reported that support is growing.\nReporter: Has it been tested?\nExpert: Yes, it was trialled in two regions and is known to work.",
    "vocabulary": [
      { "word": "policy", "definition": "siyosat, qaror" },
      { "word": "implement", "definition": "amalga oshirmoq" },
      { "word": "poverty", "definition": "qashshoqlik" },
      { "word": "trial", "definition": "sinovdan o'tkazmoq" },
      { "word": "economist", "definition": "iqtisodchi" }
    ],
    "questions": [
      { "id": 101723, "type": "multiple-choice", "question": "What is said about the new policy?", "options": ["It will fail", "It will help thousands", "It is illegal", "It is expensive"], "correctIndex": 1, "explanation": "'It is said that the new policy will help thousands' — impersonal passive." },
      { "id": 101724, "type": "multiple-choice", "question": "What is the plan believed to reduce?", "options": ["Taxes", "Poverty", "Schools", "Jobs"], "correctIndex": 1, "explanation": "'The plan is believed to reduce poverty' — passive + infinitive." },
      { "id": 101725, "type": "true-false", "question": "New schools are being built already.", "answer": true, "explanation": "'New schools are being built already' — present continuous passive." },
      { "id": 101726, "type": "multiple-choice", "question": "How do most economists consider the policy?", "options": ["Unfair", "Fair", "Risky", "Useless"], "correctIndex": 1, "explanation": "'The policy is considered fair by most economists.'" },
      { "id": 101727, "type": "multiple-choice", "question": "Where was the policy trialled?", "options": ["In one city", "In two regions", "Nationwide", "Abroad"], "correctIndex": 1, "explanation": "'it was trialled in two regions and is known to work.'" }
    ],
    "difficulty": "hard",
    "topic": "Murakkab majhul nisbat — It is said that / is believed to"
  },
  "category": "IELTS Preparation",
  "formulas": [
    {
      "color": "blue",
      "label": "Passive Infinitive",
      "structure": "S + is/was + believed/reported/said + to + V₁ / have + V₃\nHe is believed to be wealthy. / She is said to have left.",
      "explanation": "'is said/believed to + V' — passiv reporting.",
      "whenToUse": "Manba noaniq da'voni rasmiy bildirganda.",
      "example": "He is believed to be wealthy."
    },
    {
      "color": "green",
      "label": "Passive Gerund",
      "structure": "S + V + being + V₃\nI dislike being told what to do.\nShe avoided being seen.",
      "explanation": "'being + V3' — passiv gerund.",
      "whenToUse": "Passiv harakat gerund vazifasida bo'lganda.",
      "example": "I dislike being told what to do."
    },
    {
      "color": "orange",
      "label": "Causative (have/get)",
      "structure": "S + have/get + O + V₃\nI had my car repaired.\nShe got her hair cut.",
      "explanation": "'have/get + O + V3' — ishni boshqaga qildirish.",
      "whenToUse": "Xizmatdan foydalanganda.",
      "example": "I had my car repaired."
    },
    {
      "color": "violet",
      "label": "Reporting Verbs Passive",
      "structure": "It + is/was + said/believed/reported + that...\nS + is/was + said/believed + to...\nIt is said that he is rich. / He is said to be rich.",
      "explanation": "'It is said/believed that...' — shaxssiz passiv.",
      "whenToUse": "Umumiy fikrni manbasiz bildirganda.",
      "example": "It is said that time heals."
    }
  ],
  "rules": [
    "1️⃣ PASSIVE INFINITIVE — 'IS BELIEVED TO BE'\n\n📌 TUZILISHI:\n  Subject + is/was + reporting verb (V₃) + to + V₁ (hozirgi/kelasi)\n  Subject + is/was + reporting verb (V₃) + to have + V₃ (o'tgan)\n\n  → He is believed to be a great leader.\n  (U buyuk lider ekaniga ishoniladi.)\n  → The meeting is expected to start at 10 AM.\n  (Yig'ilish soat 10 da boshlanishi kutilmoqda.)\n  → She is said to have won the award.\n  (U mukofotni yutgani aytiladi.)\n\n📌 ISHLATILADIGAN FE'LLAR:\n  • said (aytiladi), believed (ishoniladi), reported (xabar qilinadi)\n  • thought (o'ylanadi), expected (kutiladi), considered (hisoblanadi)\n  • claimed (da'vo qilinadi), understood (tushuniladi),\n    known (ma'lum), alleged (ayblanadi)\n\n📌 ZAMONLAR:\n  • to + V₁ → hozirgi yoki kelasi zamon:\n    He is said to live in London. (Hozir Londonda yashaydi.)\n  • to have + V₃ → o'tgan zamon:\n    He is said to have lived in London. (Oldin Londonda yashagan.)\n\n📌 IELTS TIP: Passive infinitive Writing Task 2 da fikrni noaniq (impersonal) qilib ifodalash uchun juda muhim. 'It is believed that...' strukturasi akademik yozuv uchun ideal.",
    "2️⃣ PASSIVE GERUND — 'BEING TOLD'\n\n📌 TUZILISHI:\n  Gerundiy talab qiladigan fe'llardan keyin: being + V₃\n\n  → I dislike being told what to do.\n  (Menga nima qilishni aytilishini yoqtirmayman.)\n  → She avoided being seen by her ex-boyfriend.\n  (U sobiq yigiti tomonidan ko'rilishdan qochdi.)\n  → He admitted being involved in the scandal.\n  (U janjalga aralashganini tan oldi.)\n\n📌 GERUNDIY TALAB QILADIGAN FE'LLAR:\n  • admit (tan olmoq), appreciate (qadrlamoq), avoid (qochmoq)\n  • consider (o'ylamoq), deny (inkor qilmoq), dislike (yoqtirmaslik)\n  • enjoy (yoqtirmoq), finish (tugatmoq), imagine (tasavvur qilmoq)\n  • mind (qarshiligi yo'q), recommend (tavsiya qilmoq), suggest (taklif qilmoq)\n\n📌 PREPOZITSIYALARDAN KEYIN:\n  → She is tired of being treated unfairly.\n  → He is interested in being promoted.\n  → They insisted on being informed immediately.\n\n📌 O'ZBEKCHA FARQ: O'zbek tilida 'menga...aytilishini yoqtirmayman' — bu yerda 'aytilish' passive gerund. Ingliz tilida esa 'being told' deb ifodalanadi.",
    "3️⃣ CAUSATIVE — HAVE/GET + OBJECT + V₃\n\n📌 TUZILISHI:\n  Subject + have/get + object + past participle (V₃)\n\n  → I had my car repaired yesterday.\n  (Men mashinamni kecha ta'mirlatdim.)\n  → She got her hair cut last week.\n  (U o'tgan hafta sochini oldirdi.)\n  → We are having our house renovated this summer.\n  (Biz bu yoz uyimizni ta'mirlatyapmiz.)\n\n📌 MA'NO: Causative — biror ishni o'zimiz qilmasdan, boshqa odamga qildirish.\n  • I repaired my car. = Men o'zim ta'mirladim.\n  • I had my car repaired. = Men ta'mirlattirdim (boshqa odam ta'mirladi).\n\n📌 HAVE vs GET:\n  • HAVE — rasmiyroq, rejalashtirilgan:\n    I had my car serviced. (Rejali xizmat)\n  • GET — norasmiy, ko'pincha qiyinchilik bilan:\n    I got my car repaired. (Qiyinchilik bilan ta'mirlattirdim)\n\n📌 ZAMONLAR:\n  • Present: I have my hair cut every month.\n  • Past: I had my hair cut yesterday.\n  • Future: I will have my hair cut tomorrow.\n  • Present Continuous: I am having my house painted.\n  • Present Perfect: I have had my car fixed.\n\n📌 IELTS TIP: Causative Speaking Part 1 va 2 da kundalik hayot haqida gapirishda foydali. 'I get my nails done every week' kabi.",
    "4️⃣ REPORTING VERBS PASSIVE — 'IT IS SAID THAT...'\n\n📌 TUZILISHI (ikki usul):\n\n  1-usul: It + is/was + V₃ + that + S + V\n    → It is said that the president will resign.\n    (Prezident iste'foga chiqishi aytilmoqda.)\n    → It was reported that the company went bankrupt.\n    (Kompaniya bankrot bo'lgani xabar qilindi.)\n\n  2-usul: S + is/was + V₃ + to + V₁ (yoki to have + V₃)\n    → The president is said to resign.\n    → The company was reported to have gone bankrupt.\n\n📌 ISHLATILADIGAN FE'LLAR:\n  • say, report, believe, think, claim, expect, consider, know, understand, allege, estimate\n\n📌 ZAMON MOSLIGI:\n  • It is said that he is rich. (Hozirgi)\n    → He is said to be rich.\n  • It is said that he was rich. (O'tgan)\n    → He is said to have been rich.\n  • It is believed that the meeting will start at 10.\n    → The meeting is believed to start at 10.\n\n📌 IELTS TIP: 'It is widely believed that...', 'It is generally accepted that...', 'It can be argued that...' — bu iboralar Writing Task 2 da fikrni noaniq va akademik qilib ifodalaydi.",
    "5️⃣ PASSIVE INFINITIVE VA GERUND BILAN MURAKKAB TUZILMALAR\n\n📌 NEED + V-ing (passive ma'no):\n  → The car needs washing. (= needs to be washed)\n  → The report needs rewriting. (= needs to be rewritten)\n\n📌 WANT/WOULD LIKE + V₃ (passive istak):\n  → I want this report finished by Friday.\n  → She would like the documents signed immediately.\n\n📌 MAKE/HELP/LET + passive:\n  → He was made to apologize. (active: They made him apologize)\n  → She was helped to find a job. (active: They helped her find a job)\n\n📌 PASSIVE WITH MODALS:\n  • must be + V₃: This must be done immediately.\n  • should be + V₃: The report should be submitted on time.\n  • can be + V₃: The problem can be solved easily.\n  • might have been + V₃: It might have been stolen.\n\n📌 IELTS TIP: Modal + passive ('must be done', 'should be considered') — Writing Task 2 da tavsiya va majburiyatlarni ifodalashda eng keng tarqalgan struktura."
  ],
  "vocabulary": [
    {
      "en": "alleged",
      "uz": "da'vo qilingan, aytilishicha",
      "rule": "Reporting verb, formal",
      "example": "He is alleged to have stolen the money."
    },
    {
      "en": "renowned",
      "uz": "mashhur, taniqli",
      "rule": "Sifat, B2 darajasi",
      "example": "She is renowned for her contributions to science."
    },
    {
      "en": "rumoured",
      "uz": "mish-mish tarqalgan",
      "rule": "Reporting verb, informal",
      "example": "It is rumoured that the company is merging."
    },
    {
      "en": "estimated",
      "uz": "taxmin qilingan",
      "rule": "Reporting verb, statistika",
      "example": "The population is estimated to be over 30 million."
    },
    {
      "en": "causative",
      "uz": "kauzativ (qilmoq, qildirmoq)",
      "rule": "Grammatik atama",
      "example": "The causative structure shows that someone causes another person to do something."
    },
    {
      "en": "renovate",
      "uz": "ta'mirlamoq, yangilamoq",
      "rule": "Fe'l, causative bilan keng ishlatiladi",
      "example": "We are having our kitchen renovated this month."
    },
    {
      "en": "promote",
      "uz": "ko'tarish (lavozim), targ'ib qilmoq",
      "rule": "Fe'l, passive keng ishlatiladi",
      "example": "He was promoted to senior manager last year."
    },
    {
      "en": "allege",
      "uz": "da'vo qilmoq, ayblamoq",
      "rule": "Fe'l, formal/legal",
      "example": "The suspect is alleged to have committed the crime."
    },
    {
      "en": "anticipate",
      "uz": "kutmoq, taxmin qilmoq",
      "rule": "Fe'l, akademik",
      "example": "The new policy is anticipated to create more jobs."
    },
    {
      "en": "undergo",
      "uz": "boshdan kechirmoq, o'tmoq",
      "rule": "Fe'l, B2 darajasi",
      "example": "The patient underwent a series of tests."
    },
    {
      "en": "commission",
      "uz": "buyurtma bermoq, topshiriq",
      "rule": "Fe'l, formal",
      "example": "The artist was commissioned to paint a portrait."
    },
    {
      "en": "oversee",
      "uz": "nazorat qilmoq, boshqarmoq",
      "rule": "Fe'l, B2 darajasi",
      "example": "The project was overseen by the senior architect."
    },
    {
      "en": "passive voice",
      "uz": "majhul nisbat",
      "rule": "be + V₃",
      "example": "The report was written by the assistant."
    },
    {
      "en": "impersonal passive",
      "uz": "shaxssiz majhul",
      "rule": "It + be + V₃ + that + clause",
      "example": "It is believed that the project will succeed."
    },
    {
      "en": "personal passive",
      "uz": "shaxsli majhul",
      "rule": "S + be + V₃ + to V",
      "example": "She is said to be the best candidate."
    },
    {
      "en": "have/get something done",
      "uz": "biror narsani qildirtirmoq",
      "rule": "have/get + obj + V₃",
      "example": "I had my car repaired yesterday."
    }
  ],
  "examples": [
    {
      "en": "The suspect is believed to have fled the country.",
      "uz": "Gumonlanuvchi mamlakatni tark etganiga ishoniladi."
    },
    {
      "en": "She dislikes being told that she is wrong.",
      "uz": "Unga xato ekani aytilishini yoqtirmaydi."
    },
    {
      "en": "I had my eyes tested last week.",
      "uz": "Men o'tgan hafta ko'zimni tekshirtirdim."
    },
    {
      "en": "It is widely believed that climate change is man-made.",
      "uz": "Iqlim o'zgarishi inson omili tufayli ekaniga keng ishoniladi."
    },
    {
      "en": "The painting is believed to be worth millions.",
      "uz": "Rasm millionlab dollarga teng ekaniga ishoniladi."
    },
    {
      "en": "He avoided being recognised by wearing a disguise.",
      "uz": "U niqob kiyib tanilishdan qochdi."
    },
    {
      "en": "We are getting our house renovated next month.",
      "uz": "Biz kelasi oy uyimizni ta'mirlatyapmiz."
    },
    {
      "en": "The meeting was reported to have been cancelled.",
      "uz": "Yig'ilish bekor qilingani xabar qilindi."
    }
  ],
  "specialCases": [
    {
      "id": "need-gerund-passive",
      "rule": "'Need + V-ing' — passive ma'noni bildiradi, 'need to be + V₃' bilan sinonim. 'The car needs washing' = 'The car needs to be washed'. Bu faqat 'need' fe'liga xos.",
      "title": "Need + V-ing (passive ma'no)",
      "drills": [
        {
          "id": 70586,
          "type": "multiple-choice",
          "correct": "needs",
          "options": [
            "needs",
            "is needing",
            "needed",
            "was needing"
          ],
          "question": "The floor ___ cleaning. It is very dirty.",
          "explanation": "'Need + V-ing' — hozirgi zamon: 'The floor needs cleaning'.",
          "instruction": "To'g'ri variantni tanlang:"
        },
        {
          "id": 70587,
          "hint": "The windows need ...",
          "type": "transformation",
          "correct": "The windows need cleaning.",
          "question": "The windows need to be cleaned.",
          "explanation": "'Need to be + V₃' → 'Need + V-ing': 'The windows need cleaning'.",
          "instruction": "'Need + V-ing' bilan qayta yozing:"
        },
        {
          "id": 70588,
          "type": "fill-blank",
          "blanks": [
            "revising"
          ],
          "question": "This report requires _____ (revise) before it can be submitted.",
          "explanation": "'Require + V-ing' — 'needs revising' bilan sinonim. 'This report requires revising'.",
          "instruction": "To'g'ri shaklni qo'ying:"
        }
      ],
      "examples": [
        {
          "en": "The garden needs watering.",
          "uz": "Bog'ni sug'orish kerak."
        },
        {
          "en": "This essay needs rewriting before submission.",
          "uz": "Bu inshoni topshirishdan oldin qayta yozish kerak."
        }
      ],
      "mnemonic": "NEED + V-ing = NEED + TO BE + V₃. 'The car needs washing' = 'The car needs to be washed'. Ikkisi bir xil ma'no. ESLAB QOL: 'need' dan keyin V-ing kelsa, passive ma'noda.",
      "commonMistakes": "'The car needs washed' XATO — bu faqat Ayova/Shotlandiya dialektida bor, standart ingliz tilida yo'q. 'The car needs washing' yoki 'The car needs to be washed'."
    },
    {
      "id": "causative-have-vs-get",
      "rule": "'Have something done' — rasmiy, rejalashtirilgan, xizmat sifatida. 'Get something done' — norasmiy, ko'pincha qiyinchilik, ishontirish yoki kutilmagan holat. 'I had my car serviced' (rejali). 'I got my car fixed' (buzilib qoldi, ta'mirlattirdim).",
      "title": "Have vs Get in Causative — uslubiy farq",
      "drills": [
        {
          "id": 70589,
          "type": "multiple-choice",
          "correct": "I had my car serviced.",
          "options": [
            "I got my car washed.",
            "I had my car serviced.",
            "I washed my car.",
            "I will wash my car."
          ],
          "question": "Which implies a formal, planned service?",
          "explanation": "'Had' + V₃ — rasmiy, rejalashtirilgan xizmat. 'I had my car serviced' — rejali texnik xizmat.",
          "instruction": "Causative variantini tanlang:"
        },
        {
          "id": 70590,
          "type": "fill-blank",
          "blanks": [
            "got"
          ],
          "question": "After the accident, I finally _____ (get) my car repaired yesterday.",
          "explanation": "Kutilmagan holat → 'got'. Qiyinchilik bilan ta'mirlattirdi.",
          "instruction": "'Have' yoki 'get' bilan to'ldiring:"
        },
        {
          "id": 70591,
          "type": "error-correction",
          "correct": "I had my hair cut yesterday at the salon.",
          "question": "I had my hair cutting yesterday at the salon.",
          "errorPart": "cutting",
          "explanation": "'Have + O + V₃' — 'cut' emas, 'cut' (past participle). 'I had my hair cut'.",
          "instruction": "Xatoni toping:"
        }
      ],
      "examples": [
        {
          "en": "I had my suit dry-cleaned for the wedding.",
          "uz": "Men to'y uchun kostyumni kimyoviy tozalashga berdim."
        },
        {
          "en": "I finally got my phone fixed after two weeks.",
          "uz": "Ikki haftadan keyin nihoyat telefonimni tuzatdim."
        }
      ],
      "mnemonic": "HAVE = formal, planned, service. GET = informal, effort, unexpected. 'Have a haircut' (sartaroshga borish). 'Get it done' (majburiyat, qiyinchilik).",
      "commonMistakes": "'I cut my hair' XATO (agar sartaroshda oldirgan bo'lsangiz) → 'I had my hair cut'. 'I got my hair cut by myself' XATO (get + V₃ — boshqa odam qiladi, o'zing emas)."
    },
    {
      "id": "it-is-said-that",
      "rule": "'It is said that + S + V' — impersonal, formal. 'S + is said to + V' — personal, ko'pincha bir xil ma'no. 'It is said that the president will resign' = 'The president is said to resign'. 'It is believed that he was rich' = 'He is believed to have been rich'.",
      "title": "It is said that... vs He is said to...",
      "drills": [
        {
          "id": 70592,
          "hint": "The CEO ...",
          "type": "transformation",
          "correct": "The CEO is believed to step down.",
          "question": "It is believed that the CEO will step down.",
          "explanation": "'It is believed that + S + will V' → 'S + is believed to + V₁'.",
          "instruction": "'It is...that' dan 'S is...to' ga o'zgartiring:"
        },
        {
          "id": 70593,
          "hint": "It is reported ...",
          "type": "transformation",
          "correct": "It is reported that the company has made a profit.",
          "question": "The company is reported to have made a profit.",
          "explanation": "'S + is reported to have + V₃' → 'It is reported that + S + have + V₃'.",
          "instruction": "'S is...to' dan 'It is...that' ga o'zgartiring:"
        },
        {
          "id": 70594,
          "type": "fill-blank",
          "blanks": [
            "is"
          ],
          "question": "It is said that the film _____ (be) worth watching.",
          "explanation": "'It is said that + S + V' → 'It is said that the film is worth watching'.",
          "instruction": "To'g'ri shaklni qo'ying:"
        }
      ],
      "examples": [
        {
          "en": "It is estimated that over 2 billion people speak English.",
          "uz": "2 milliarddan ortiq odam ingliz tilida so'zlashishi taxmin qilinmoqda."
        },
        {
          "en": "Over 2 billion people are estimated to speak English.",
          "uz": "2 milliarddan ortiq odam ingliz tilida so'zlashadi deb taxmin qilinadi."
        }
      ],
      "mnemonic": "IT IS SAID THAT + to'liq gap = S + IS SAID TO + infinitive. Ikkala usulni ham bilish kerak — Writing da stilistik xilma-xillik uchun.",
      "commonMistakes": "'It is said that' dan keyin 'to' ishlatmaslik kerak: 'It is said that he to be rich' XATO. 'He is said that he is rich' XATO — ikki usulni adashtirish."
    }
  ],
  "exercises": [
    {
      "id": 70595,
      "type": "multiple-choice",
      "correct": "to be",
      "options": [
        "is",
        "to be",
        "being",
        "been"
      ],
      "question": "He is believed ___ a very wealthy man.",
      "explanation": "'Is believed + to + V₁': 'He is believed to be a very wealthy man'.",
      "instruction": "Passive infinitive tanlang:"
    },
    {
      "id": 70596,
      "type": "multiple-choice",
      "correct": "being given",
      "options": [
        "give",
        "to give",
        "being given",
        "given"
      ],
      "question": "She enjoys ___ compliments on her work.",
      "explanation": "'Enjoy + V-ing' → 'enjoys being given'. 'Enjoy to give' XATO.",
      "instruction": "Passive gerund tanlang:"
    },
    {
      "id": 70597,
      "type": "multiple-choice",
      "correct": "had",
      "options": [
        "had",
        "got",
        "did",
        "made"
      ],
      "question": "I ___ my watch repaired last week.",
      "explanation": "'Have + O + V₃': 'I had my watch repaired'. 'Had' yoki 'got' ikkisi ham mumkin.",
      "instruction": "Causative tanlang:"
    },
    {
      "id": 70598,
      "type": "multiple-choice",
      "correct": "is said",
      "options": [
        "is saying",
        "is said",
        "says",
        "said"
      ],
      "question": "It ___ that the meeting has been cancelled.",
      "explanation": "'It is said that...' — impersonal passive. 'It is said that the meeting has been cancelled'.",
      "instruction": "Reporting verb passive tanlang:"
    },
    {
      "id": 70599,
      "type": "multiple-choice",
      "correct": "washing",
      "options": [
        "wash",
        "to wash",
        "washing",
        "washed"
      ],
      "question": "The car needs ___. It is very dirty.",
      "explanation": "'Need + V-ing' — passive ma'no: 'The car needs washing' = 'The car needs to be washed'.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70600,
      "type": "fill-blank",
      "blanks": [
        "to visit"
      ],
      "question": "The President is expected _____ (visit) the region next month.",
      "explanation": "'Is expected + to + V₁': 'The President is expected to visit the region next month'.",
      "instruction": "Passive infinitive bilan to'ldiring:"
    },
    {
      "id": 70601,
      "type": "fill-blank",
      "blanks": [
        "being involved"
      ],
      "question": "He admitted _____ (involve) in the illegal activity.",
      "explanation": "'Admit + V-ing' → 'admitted being involved'. 'Admit to involve' XATO.",
      "instruction": "Passive gerund bilan to'ldiring:"
    },
    {
      "id": 70602,
      "type": "fill-blank",
      "blanks": [
        "having our house painted"
      ],
      "question": "We are _____ (have/our house/paint) this summer.",
      "explanation": "'Are having + O + V₃': 'We are having our house painted this summer'.",
      "instruction": "Causative bilan to'ldiring:"
    },
    {
      "id": 70603,
      "type": "fill-blank",
      "blanks": [
        "believed"
      ],
      "question": "It is widely _____ (believe) that education is the key to success.",
      "explanation": "'It is widely believed that...' — 'believe' → 'believed'.",
      "instruction": "Reporting verb passive bilan to'ldiring:"
    },
    {
      "id": 70604,
      "type": "fill-blank",
      "blanks": [
        "to have committed"
      ],
      "question": "The suspect is alleged _____ (commit) the crime last year.",
      "explanation": "O'tgan zamon → 'to have + V₃': 'is alleged to have committed'.",
      "instruction": "To'g'ri shaklni qo'ying:"
    },
    {
      "id": 70605,
      "type": "error-correction",
      "correct": "The report is believed to have been finished by now, but it isn't.",
      "question": "The report is believed to be finished by now, but it isn't.",
      "errorPart": "to be finished",
      "explanation": "O'tgan zamon ma'nosi → 'to have been finished' (to have + been + V₃).",
      "instruction": "Xatoni toping:"
    },
    {
      "id": 70606,
      "type": "error-correction",
      "correct": "I don't like being told what to do.",
      "question": "I don't like being tell what to do.",
      "errorPart": "being tell",
      "explanation": "'Being + V₃': 'being told'. 'Being tell' XATO — past participle kerak.",
      "instruction": "Xatoni toping:"
    },
    {
      "id": 70607,
      "type": "error-correction",
      "correct": "I had my hair cut at the barbershop yesterday.",
      "question": "I had my hair cutting at the barbershop yesterday.",
      "errorPart": "cutting",
      "explanation": "'Have + O + V₃': 'have my hair cut'. 'Cutting' → 'cut' (past participle).",
      "instruction": "Xatoni toping:"
    },
    {
      "id": 70608,
      "hint": "He ...",
      "type": "transformation",
      "correct": "He is believed to be innocent.",
      "question": "People believe that he is innocent.",
      "explanation": "'People believe that he is innocent' → 'He is believed to be innocent'.",
      "instruction": "Passive infinitive ga o'zgartiring:"
    },
    {
      "id": 70609,
      "hint": "I had ...",
      "type": "transformation",
      "correct": "I had my car fixed by a mechanic.",
      "question": "A mechanic fixed my car.",
      "explanation": "'A mechanic fixed my car' → 'I had my car fixed (by a mechanic)'.",
      "instruction": "Causative ga o'zgartiring:"
    },
    {
      "id": 70610,
      "hint": "It is said ...",
      "type": "transformation",
      "correct": "It is said that the company is planning an expansion.",
      "question": "The company is said to be planning an expansion.",
      "explanation": "'S + is said to + V' → 'It is said that + S + V'.",
      "instruction": "'It is...that' ga o'zgartiring:"
    },
    {
      "id": 70611,
      "hint": "The documents need ...",
      "type": "transformation",
      "correct": "The documents need signing.",
      "question": "The documents need to be signed.",
      "explanation": "'Need to be + V₃' → 'Need + V-ing': 'The documents need signing'.",
      "instruction": "'Need + V-ing' ga o'zgartiring:"
    },
    {
      "id": 70612,
      "type": "multiple-choice",
      "correct": "I had my car repaired by a mechanic.",
      "options": [
        "I repaired my car by a mechanic.",
        "I had my car repaired by a mechanic.",
        "I had my car repairing by a mechanic.",
        "I got my car repairing by a mechanic."
      ],
      "question": "Which sentence uses the causative correctly?",
      "explanation": "'Have + O + V₃' → 'I had my car repaired by a mechanic'.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70613,
      "type": "multiple-choice",
      "correct": "renovating",
      "options": [
        "renovate",
        "to renovate",
        "renovating",
        "renovated"
      ],
      "question": "The house needs ___. It is in terrible condition.",
      "explanation": "'Need + V-ing': 'The house needs renovating' (= needs to be renovated).",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70614,
      "type": "error-correction",
      "correct": "It is believed that the project will be completed on time.",
      "question": "It is believed that the project to be completed on time.",
      "errorPart": "to be completed",
      "explanation": "'It is believed that + to'liq gap' (S + V). 'To be completed' → 'will be completed'.",
      "instruction": "Xatoni toping:"
    }
  ],
  "exerciseSections": [
    {
      "ids": [
        3801,
        3802,
        3803,
        3804,
        3805
      ],
      "desc": "Passive infinitive va gerund — tanib olish",
      "icon": "🌱",
      "color": "bg-emerald-500",
      "title": "Asosiy"
    },
    {
      "ids": [
        3806,
        3807,
        3808,
        3809,
        3810
      ],
      "desc": "Fill-blank — qoidani mustahkamlash",
      "icon": "📘",
      "color": "bg-blue-500",
      "title": "O'rtacha"
    },
    {
      "ids": [
        3811,
        3812,
        3813,
        3814,
        3815
      ],
      "desc": "Error-correction — keng tarqalgan xatolar",
      "icon": "💪",
      "color": "bg-violet-500",
      "title": "Qiyin"
    },
    {
      "ids": [
        3816,
        3817,
        3818,
        3819,
        3820
      ],
      "desc": "Transformation — IELTS darajasidagi mashqlar",
      "icon": "🏆",
      "color": "bg-rose-500",
      "title": "Yuqori daraja"
    }
  ],
  "tests": [
    {
      "id": 70615,
      "type": "multiple-choice",
      "correct": "to be + V₃",
      "options": [
        "to + V₁",
        "being + V₃",
        "to be + V₃",
        "having + V₃"
      ],
      "question": "Passive infinitive qanday tuziladi?",
      "explanation": "Passive infinitive: 'to be + V₃' (e.g., to be seen, to be told).",
      "instruction": "Asosiy"
    },
    {
      "id": 70616,
      "type": "multiple-choice",
      "correct": "being told",
      "options": [
        "telling",
        "being told",
        "to tell",
        "told"
      ],
      "question": "I dislike ___ what to do.",
      "explanation": "'Dislike + V-ing' + passive: 'being told'.",
      "instruction": "Asosiy"
    },
    {
      "id": 70617,
      "type": "multiple-choice",
      "correct": "had",
      "options": [
        "had",
        "got",
        "did",
        "made"
      ],
      "question": "I ___ my hair cut yesterday.",
      "explanation": "Causative: 'had + O + V₃'. 'Had' / 'got' ikkisi mumkin.",
      "instruction": "Asosiy"
    },
    {
      "id": 70618,
      "type": "multiple-choice",
      "correct": "Reporting verb passive",
      "options": [
        "Active voice",
        "Reporting verb passive",
        "Causative",
        "Passive gerund"
      ],
      "question": "'It is said that...' — bu qanday struktura?",
      "explanation": "'It is said that...' — reporting verb passive.",
      "instruction": "Asosiy"
    },
    {
      "id": 70619,
      "type": "multiple-choice",
      "correct": "The car needs to be washed",
      "options": [
        "The car needs to wash",
        "The car needs to be washed",
        "The car needs washed",
        "The car is washing"
      ],
      "question": "'The car needs washing' = ?",
      "explanation": "'Need + V-ing' = 'Need + to be + V₃'.",
      "instruction": "Asosiy"
    },
    {
      "id": 70620,
      "type": "multiple-choice",
      "correct": "to have won",
      "options": [
        "win",
        "to win",
        "to have won",
        "winning"
      ],
      "question": "He is believed ___ the award last year.",
      "explanation": "O'tgan zamon → 'to have + V₃': 'to have won'.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70621,
      "type": "multiple-choice",
      "correct": "being seen",
      "options": [
        "to see",
        "seeing",
        "being seen",
        "seen"
      ],
      "question": "She avoided ___ by hiding behind the door.",
      "explanation": "'Avoid + V-ing' + passive: 'being seen'.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70622,
      "type": "multiple-choice",
      "correct": "having",
      "options": [
        "having",
        "getting",
        "making",
        "doing"
      ],
      "question": "We are ___ our kitchen renovated next month.",
      "explanation": "'Are having + O + V₃' — 'are having our kitchen renovated'.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70623,
      "type": "multiple-choice",
      "correct": "is rumoured",
      "options": [
        "is rumoured",
        "rumours",
        "is rumouring",
        "rumoured"
      ],
      "question": "It ___ that the factory will close down.",
      "explanation": "'It is rumoured that...' — impersonal passive.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70624,
      "type": "multiple-choice",
      "correct": "run",
      "options": [
        "believe",
        "say",
        "run",
        "report"
      ],
      "question": "Which is NOT a reporting verb?",
      "explanation": "'Run' reporting verb emas. Believe, say, va report — reporting verb'lar.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70625,
      "type": "multiple-choice",
      "correct": "The suspect is alleged to have escaped.",
      "options": [
        "The suspect is alleged to escape.",
        "The suspect is alleged to have escaped.",
        "The suspect is alleged escaping.",
        "The suspect is alleged escaped."
      ],
      "question": "Which sentence is correct?",
      "explanation": "O'tgan zamon ma'nosi → 'to have + V₃': 'to have escaped'.",
      "instruction": "Qiyin"
    },
    {
      "id": 70626,
      "type": "multiple-choice",
      "correct": "serviced",
      "options": [
        "service",
        "servicing",
        "serviced",
        "to service"
      ],
      "question": "I had my car ___ yesterday. The mechanic did a great job.",
      "explanation": "'Have + O + V₃': 'had my car serviced'.",
      "instruction": "Qiyin"
    },
    {
      "id": 70627,
      "type": "multiple-choice",
      "correct": "The house needs painting.",
      "options": [
        "The house needs painted.",
        "The house needs painting.",
        "The house needs to painting.",
        "The house needs be painted."
      ],
      "question": "Which sentence is grammatically correct?",
      "explanation": "'Need + V-ing' — 'The house needs painting'.",
      "instruction": "Qiyin"
    },
    {
      "id": 70628,
      "type": "multiple-choice",
      "correct": "Had = formal, Got = informal",
      "options": [
        "Hech qanday farq yo'q",
        "Had = formal, Got = informal",
        "Had = past, Got = present",
        "Had = I did it, Got = someone else"
      ],
      "question": "What is the difference between 'I had my hair cut' and 'I got my hair cut'?",
      "explanation": "'Have' causative — rasmiy, rejalashtirilgan. 'Get' causative — norasmiy, ko'pincha qiyinchilik bilan.",
      "instruction": "Yuqori daraja"
    },
    {
      "id": 70629,
      "type": "multiple-choice",
      "correct": "It is widely believed that...",
      "options": [
        "People say that...",
        "It is widely believed that...",
        "I think that...",
        "Everyone knows that..."
      ],
      "question": "Which structure is best for academic writing?",
      "explanation": "'It is widely believed that...' — impersonal, formal, akademik yozuv uchun ideal.",
      "instruction": "Yuqori daraja"
    }
  ],
  "testSections": [
    {
      "ids": [
        391,
        392,
        393,
        394,
        395
      ],
      "desc": "Advanced passive asoslari",
      "icon": "🌱",
      "color": "bg-emerald-500",
      "title": "Asosiy"
    },
    {
      "ids": [
        396,
        397,
        398,
        399,
        400
      ],
      "desc": "Qoidani qo'llash",
      "icon": "📘",
      "color": "bg-blue-500",
      "title": "O'rtacha"
    },
    {
      "ids": [
        401,
        402,
        403
      ],
      "desc": "Murakkab holatlar",
      "icon": "💪",
      "color": "bg-violet-500",
      "title": "Qiyin"
    },
    {
      "ids": [
        404,
        405
      ],
      "desc": "Akademik daraja",
      "icon": "🏆",
      "color": "bg-rose-500",
      "title": "Yuqori daraja"
    }
  ]
}

export const academicVocabularyB2: DailyLesson = {
  "id": "academic-vocabulary-b2",
  speaking: {
    prompt: "Discuss an academic topic using formal, high-level vocabulary. Speak for about one minute. Use academic words such as 'significant', 'establish', 'consequently', 'demonstrate', 'sufficient', and 'implement'.",
    tips: [
      "'a significant impact / role'.",
      "'demonstrate / illustrate / indicate'.",
      "'establish / implement / acquire'.",
      "'consequently / furthermore / therefore'.",
    ],
    sampleAnswer: "Education has a significant impact on a country's development. Numerous studies demonstrate that nations which invest sufficiently in schools tend to prosper. Consequently, it is essential that governments establish strong educational systems. When effective policies are implemented, the benefits become evident within a generation. Furthermore, access to quality education enables individuals to acquire the skills required by a modern economy. It is widely acknowledged that knowledge is a crucial resource. In order to address global challenges, we must, therefore, prioritise learning. To conclude, sustained investment in education is not merely beneficial but absolutely fundamental to long-term prosperity.",
  },
  "title": "Academic Vocabulary — Top 50 IELTS Words",
  "subtitle": "Akademik so'z boyligi: AWL (Academic Word List) — 50 ta eng muhim so'z",
  "level": "B2",
  "day": 78,
  "listening": {
    "transcript": "Tutor: For IELTS, use precise academic words. Instead of 'big', say 'significant'.\nStudent: I see. What about 'show'?\nTutor: Use 'demonstrate' or 'illustrate'. And instead of 'a lot', say 'numerous'.\nStudent: Got it. How about 'important'?\nTutor: 'Crucial' or 'vital'. To say 'cause', use 'contribute to'.\nStudent: And 'good'?\nTutor: 'Beneficial' or 'positive'. Avoid simple words in essays.\nStudent: What replaces 'in my opinion'?\nTutor: Try 'it could be argued that'. Always analyse, don't just describe.\nStudent: Thank you. These words will improve my band score!",
    "vocabulary": [
      { "word": "significant", "definition": "muhim, sezilarli" },
      { "word": "demonstrate", "definition": "ko'rsatmoq, namoyish etmoq" },
      { "word": "crucial", "definition": "hal qiluvchi" },
      { "word": "beneficial", "definition": "foydali" },
      { "word": "analyse", "definition": "tahlil qilmoq" }
    ],
    "questions": [
      { "id": 101728, "type": "multiple-choice", "question": "What word should replace 'big'?", "options": ["Large", "Significant", "Huge", "Wide"], "correctIndex": 1, "explanation": "'Instead of big, say significant' — precise academic vocabulary." },
      { "id": 101729, "type": "multiple-choice", "question": "What can be used instead of 'show'?", "options": ["Tell", "Demonstrate or illustrate", "See", "Look"], "correctIndex": 1, "explanation": "'Use demonstrate or illustrate.'" },
      { "id": 101730, "type": "true-false", "question": "'A lot' can be replaced with 'numerous'.", "answer": true, "explanation": "'instead of a lot, say numerous.'" },
      { "id": 101731, "type": "multiple-choice", "question": "What replaces 'important'?", "options": ["Big", "Crucial or vital", "Nice", "Good"], "correctIndex": 1, "explanation": "'Crucial or vital.'" },
      { "id": 101732, "type": "multiple-choice", "question": "What phrase replaces 'in my opinion'?", "options": ["I think", "It could be argued that", "Maybe", "I guess"], "correctIndex": 1, "explanation": "'Try it could be argued that.'" }
    ],
    "difficulty": "hard",
    "topic": "Akademik lug'at — IELTS uchun aniq so'zlar"
  },
  "category": "IELTS Preparation",
  "formulas": [
    {
      "color": "blue",
      "label": "Formal vs Informal",
      "structure": "Informal: get / Formal: obtain\nInformal: show / Formal: demonstrate\nInformal: use / Formal: utilize",
      "explanation": "Rasmiy va norasmiy so'z juftlari.",
      "whenToUse": "Akademik yozuvda rasmiy so'zni tanlaganda.",
      "example": "obtain (not get)"
    },
    {
      "color": "green",
      "label": "Collocations",
      "structure": "reach + a conclusion\nconduct + research\nplay + a role\nmake + an impact",
      "explanation": "Akademik kollokatsiyalar.",
      "whenToUse": "Rasmiy matnda tabiiy birikmalar uchun.",
      "example": "conduct research, draw a conclusion"
    },
    {
      "color": "orange",
      "label": "Sentence Patterns",
      "structure": "It is + adj + that...\nThere is + noun + in...\nThis + noun + suggests that...",
      "explanation": "Akademik gap qoliplari.",
      "whenToUse": "Rasmiy fikrni tuzilishli bildirganda.",
      "example": "It is clear that..."
    },
    {
      "color": "violet",
      "label": "Register Shift",
      "structure": "Speaking: loads of / Writing: a significant number of\nSpeaking: get better / Writing: improve",
      "explanation": "So'zlashuvdan yozma uslubga o'tish.",
      "whenToUse": "Nutqni akademik yozuvga moslaganda.",
      "example": "loads of -> a significant number of"
    }
  ],
  "rules": [
    "1️⃣ AKADEMIK SO'Z BOYLIGI — IELTS UCHUN NEGA MUHIM?\n\n📌 NEGA 50 TA SO'Z?\nIELTS Writing va Speaking da yuqori ball (Band 7+) olish uchun keng va aniq so'z boyligi kerak. AWL (Academic Word List) — akademik matnlarda eng ko'p uchraydigan 570 so'zdan iborat. Biz eng muhim 50 tasini o'rganamiz.\n\n📌 QANDAY O'RGANISH KERAK?\n• So'zni yodlash emas, ishlatishni o'rganing\n• Collocation (so'z birikmasi) bilan o'rganing\n• Formal va informal variantlarini bilib oling\n• Misol gaplar bilan mustahkamlang\n\n📌 IELTS BAND 7+ UCHUN:\n• Lexical Resource (so'z boyligi) — baholash mezonlaridan biri\n• Kamida 80% akademik so'zlarni to'g'ri ishlata olish kerak\n• So'zlarni takrorlamaslik va sinonimlardan foydalanish muhim\n\n📌 QANDAY MASHQ QILISH KERAK?\n• Har kuni 5 ta yangi so'z o'rganing\n• O'rganilgan so'z bilan gap tuzing\n• IELTS Writing Task 2 da ishlatib ko'ring\n• Speaking da ham ishlatishga harakat qiling",
    "2️⃣ FORMAL VA INFORMAL REGISTER — FARQNI BILING\n\n📌 NEGA MUHIM?\nIELTS Writing Task 2 — formal akademik yozuv. Bu yerda kundalik so'zlashuv so'zlari (informal) emas, rasmiy so'zlar (formal) ishlatilishi kerak.\n\n📌 FORMAL → INFORMAL:\n\n  • get → obtain / acquire\n  • show → demonstrate / indicate / illustrate\n  • use → utilize / employ\n  • buy → purchase\n  • tell → inform / notify\n  • ask → inquire / request\n  • help → assist / facilitate\n  • start → commence / initiate\n  • end → terminate / conclude\n  • enough → sufficient / adequate\n  • bad → detrimental / adverse\n  • good → beneficial / advantageous\n  • big → significant / substantial / considerable\n  • small → minor / negligible\n  • a lot of → a significant number of / a great deal of\n\n📌 ESLATMA: Bu formal so'zlarni Speaking da ishlatishingiz shart emas — Speaking natural bo'lishi kerak. Ammo Writing da formal so'zlar majburiy.",
    "3️⃣ TOP 50 AWL SO'ZLARI — 1-QISM (1-25)\n\n📌 1-5: ANALYSIS, ASSESSMENT, CONCEPT, CONTEXT, DATA\n• Analysis (tahlil): The analysis of the data revealed significant trends.\n• Assessment (baholash): A thorough assessment is required before making a decision.\n• Concept (tushuncha): The concept of sustainable development is widely discussed.\n• Context (kontekst): It is important to understand the historical context.\n• Data (ma'lumot): The data were collected through extensive surveys.\n\n📌 6-10: ECONOMY, ENVIRONMENT, ESTABLISH, EVIDENCE, FACTOR\n• Economy (iqtisodiyot): The economy has shown steady growth.\n• Environment (atrof-muhit): Protecting the environment is a global priority.\n• Establish (tashkil qilmoq): The company was established in 2010.\n• Evidence (dalil): There is strong evidence supporting this theory.\n• Factor (omil): Education is a key factor in reducing poverty.\n\n📌 11-15: IDENTIFY, IMPACT, INDICATE, INTERPRET, INVESTIGATE\n• Identify (aniqlash): Researchers have identified the main cause.\n• Impact (ta'sir): The new policy had a significant impact on employment.\n• Indicate (ko'rsatmoq): The results indicate a positive correlation.\n• Interpret (talqin qilmoq): The findings can be interpreted in various ways.\n• Investigate (tekshirmoq): The committee will investigate the matter.\n\n📌 16-20: ISSUE, MAJOR, METHOD, OCCUR, PERIOD\n• Issue (masala): This issue has been debated for decades.\n• Major (asosiy): Pollution is a major concern in urban areas.\n• Method (usul): The research method was carefully designed.\n• Occur (sodir bo'lmoq): Significant changes occurred during this period.\n• Period (davr): The study covered a period of five years.\n\n📌 21-25: POLICY, PROCESS, REQUIRE, RESEARCH, RESPOND\n• Policy (siyosat): The government introduced a new educational policy.\n• Process (jarayon): The application process takes approximately two weeks.\n• Require (talab qilmoq): This position requires excellent communication skills.\n• Research (tadqiqot): Further research is needed to confirm these findings.\n• Respond (javob bermoq): The government must respond to the crisis.\n",
    "4️⃣ TOP 50 AWL SO'ZLARI — 2-QISM (26-50)\n\n📌 26-30: RESULT, SECTION, SIGNIFICANT, SIMILAR, SOURCE\n• Result (natija): The results of the study were published in a journal.\n• Section (bo'lim): The final section of the report summarizes the findings.\n• Significant (muhim, sezilarli): There was a significant increase in sales.\n• Similar (o'xshash): Similar patterns were observed in other countries.\n• Source (manba): The primary source of energy is solar power.\n\n📌 31-35: STRATEGY, STRUCTURE, SURVEY, THEORY, TRADITION\n• Strategy (strategiya): The company developed a new marketing strategy.\n• Structure (tuzilma): The social structure has changed over time.\n• Survey (so'rovnoma): A survey was conducted among university students.\n• Theory (nazariya): According to this theory, language shapes thought.\n• Tradition (an'ana): The tradition of celebrating Nowruz dates back centuries.\n\n📌 36-40: AFFECT, APPROACH, ASSUME, AUTHORITY, AVAILABLE\n• Affect (ta'sir qilmoq): Climate change affects ecosystems worldwide.\n• Approach (yondashish): A new approach to teaching has been adopted.\n• Assume (taxmin qilmoq): It is reasonable to assume that prices will rise.\n• Authority (hokimiyat, vakolat): The local authority is responsible for waste management.\n• Available (mavjud): Several options are available to address this problem.\n\n📌 41-45: BENEFIT, CONSEQUENCE, DISTRIBUTION, EMERGING, FOCUS\n• Benefit (foyda, manfaat): The benefits of exercise are well-documented.\n• Consequence (oqibat): The consequences of global warming are severe.\n• Distribution (taqsimot): The distribution of wealth is uneven in many countries.\n• Emerging (rivojlanayotgan): Emerging economies are growing rapidly.\n• Focus (diqqat, asosiy e'tibor): The focus of the study is on environmental issues.\n\n📌 46-50: GLOBAL, INVOLVE, MAINTAIN, POTENTIAL, PRIORITY\n• Global (global, jahon): Global temperatures have risen over the past century.\n• Involve (o'z ichiga olmoq): The project involves collaboration between multiple departments.\n• Maintain (saqlamoq, davom ettirmoq): It is essential to maintain high standards.\n• Potential (potensial, imkoniyat): Renewable energy has the potential to transform the economy.\n• Priority (ustuvorlik): Education should be a top priority for any government.\n",
    "5️⃣ COLLOCATION VA SINTAKSIS — SO'Z BIRIKMALARI\n\n📌 SO'Z + SO'Z birikmalari (collocations):\n\n  • reach + a conclusion (xulosaga kelish): The committee reached a conclusion.\n  • conduct + research (tadqiqot o'tkazish): Scientists conducted extensive research.\n  • make + an impact (ta'sir ko'rsatish): This policy will make a positive impact.\n  • play + a role (rol o'ynash): Education plays a crucial role in development.\n  • draw + a conclusion (xulosa chiqarish): We can draw several conclusions from this.\n  • address + an issue (muammoni hal qilish): The government must address this issue.\n\n📌 MUHIM PREPOZITSIYALAR:\n  • impact ON: The policy had a significant impact on the economy.\n  • focus ON: The study focuses on climate change.\n  • involve IN: He was involved in the research project.\n  • benefit FROM: Students benefit from a well-rounded education.\n  • respond TO: The company must respond to market changes.\n\n📌 IT IS...THAT PATTERNS:\n  • It is evident that... (Ko'rinib turibdiki...)\n  • It is crucial that... (Bu juda muhimki...)\n  • It is widely accepted that... (Keng qabul qilinganki...)\n  • It can be argued that... (Bahslash mumkinki...)\n\n📌 IELTS TIP: Writing Task 2 da collocation ishlatish Band 7+ uchun hal qiluvchi omil. 'Make a decision' (qaror qilish) oddiy 'decide' dan ko'ra tabiiyroq va akademik.",
    "6️⃣ REGISTER SHIFT — FORMAL YOZUV UCHUN STRATEGIYALAR\n\n📌 NEGA REGISTER MUHIM?\nIELTS Writing Task 2 da formal register (rasmiy uslub) talab qilinadi. Bu degani: to'liq gaplar, inkor qisqartmalari (don't, can't) emas, formal leksika.\n\n📌 FORMAL YOZUV QOIDALARI:\n\n  1) Qisqartmalar ishlatmang:\n     ❌ don't, can't, won't, it's, there's\n     ✅ do not, cannot, will not, it is, there is\n\n  2) One/We o'rniga impersonal:\n     ❌ We can see that...\n     ✅ It can be seen that...\n\n  3) Phrasal verbs o'rniga formal sinonim:\n     ❌ The problem came up...\n     ✅ The problem emerged / arose...\n     ❌ The government put off the decision...\n     ✅ The government postponed the decision...\n\n  4) So'zlashuv so'zlari o'rniga akademik:\n     ❌ a lot of, lots of, tons of\n     ✅ a significant number of, a considerable amount of\n\n  5) Kuchli sifatlar:\n     ❌ very big, really important\n     ✅ significant, crucial, vital, essential\n\n📌 IELTS BAND 7+ UCHUN:\n  • 50% dan ko'p gaplarda formal konstruksiyalar bo'lishi kerak\n  • 1-2 ta cleft sentence yoki passive infinitive qo'shing\n  • Discourse markerlarni to'g'ri ishlating\n  • Collocation va akademik so'zlarni ishlating"
  ],
  "vocabulary": [
    {
      "en": "analysis",
      "uz": "tahlil",
      "rule": "AWL 1, formal",
      "example": "The analysis of the data revealed significant trends."
    },
    {
      "en": "assessment",
      "uz": "baholash",
      "rule": "AWL 1, formal",
      "example": "A thorough assessment is required before making a decision."
    },
    {
      "en": "concept",
      "uz": "tushuncha",
      "rule": "AWL 1, akademik",
      "example": "The concept of sustainable development is widely discussed."
    },
    {
      "en": "context",
      "uz": "kontekst",
      "rule": "AWL 1, formal",
      "example": "It is important to understand the historical context."
    },
    {
      "en": "data",
      "uz": "ma'lumot",
      "rule": "AWL 1, plural",
      "example": "The data were collected through extensive surveys."
    },
    {
      "en": "economy",
      "uz": "iqtisodiyot",
      "rule": "AWL 2, formal",
      "example": "The economy has shown steady growth this quarter."
    },
    {
      "en": "environment",
      "uz": "atrof-muhit",
      "rule": "AWL 2, formal",
      "example": "Protecting the environment is a global priority."
    },
    {
      "en": "establish",
      "uz": "tashkil qilmoq",
      "rule": "AWL 2, fe'l",
      "example": "The company was established in 2010."
    },
    {
      "en": "evidence",
      "uz": "dalil",
      "rule": "AWL 2, uncountable",
      "example": "There is strong evidence supporting this theory."
    },
    {
      "en": "factor",
      "uz": "omil",
      "rule": "AWL 2, formal",
      "example": "Education is a key factor in reducing poverty."
    },
    {
      "en": "identify",
      "uz": "aniqlash",
      "rule": "AWL 3, fe'l",
      "example": "Researchers have identified the main cause of the disease."
    },
    {
      "en": "impact",
      "uz": "ta'sir",
      "rule": "AWL 3, collocation: impact on",
      "example": "The new policy had a significant impact on employment."
    },
    {
      "en": "indicate",
      "uz": "ko'rsatmoq",
      "rule": "AWL 3, fe'l",
      "example": "The results indicate a positive correlation."
    },
    {
      "en": "interpret",
      "uz": "talqin qilmoq",
      "rule": "AWL 3, fe'l",
      "example": "The findings can be interpreted in various ways."
    },
    {
      "en": "investigate",
      "uz": "tekshirmoq",
      "rule": "AWL 3, fe'l",
      "example": "The committee will investigate the matter thoroughly."
    },
    {
      "en": "issue",
      "uz": "masala",
      "rule": "AWL 4, formal",
      "example": "This issue has been debated for decades."
    },
    {
      "en": "major",
      "uz": "asosiy",
      "rule": "AWL 4, adjective",
      "example": "Pollution is a major concern in urban areas."
    },
    {
      "en": "method",
      "uz": "usul",
      "rule": "AWL 4, formal",
      "example": "The research method was carefully designed."
    },
    {
      "en": "occur",
      "uz": "sodir bo'lmoq",
      "rule": "AWL 4, fe'l",
      "example": "Significant changes occurred during this period."
    },
    {
      "en": "period",
      "uz": "davr",
      "rule": "AWL 4, formal",
      "example": "The study covered a period of five years."
    },
    {
      "en": "policy",
      "uz": "siyosat",
      "rule": "AWL 5, formal",
      "example": "The government introduced a new educational policy."
    },
    {
      "en": "process",
      "uz": "jarayon",
      "rule": "AWL 5, formal",
      "example": "The application process takes approximately two weeks."
    },
    {
      "en": "require",
      "uz": "talab qilmoq",
      "rule": "AWL 5, fe'l",
      "example": "This position requires excellent communication skills."
    },
    {
      "en": "research",
      "uz": "tadqiqot",
      "rule": "AWL 5, uncountable",
      "example": "Further research is needed to confirm these findings."
    },
    {
      "en": "respond",
      "uz": "javob bermoq",
      "rule": "AWL 5, fe'l",
      "example": "The government must respond to the crisis immediately."
    },
    {
      "en": "result",
      "uz": "natija",
      "rule": "AWL 6, formal",
      "example": "The results of the study were published in a journal."
    },
    {
      "en": "section",
      "uz": "bo'lim",
      "rule": "AWL 6, formal",
      "example": "The final section of the report summarizes the findings."
    },
    {
      "en": "significant",
      "uz": "muhim, sezilarli",
      "rule": "AWL 6, adjective",
      "example": "There was a significant increase in sales."
    },
    {
      "en": "similar",
      "uz": "o'xshash",
      "rule": "AWL 6, adjective",
      "example": "Similar patterns were observed in other countries."
    },
    {
      "en": "source",
      "uz": "manba",
      "rule": "AWL 6, formal",
      "example": "The primary source of energy is solar power."
    },
    {
      "en": "strategy",
      "uz": "strategiya",
      "rule": "AWL 7, formal",
      "example": "The company developed a new marketing strategy."
    },
    {
      "en": "structure",
      "uz": "tuzilma",
      "rule": "AWL 7, formal",
      "example": "The social structure has changed over time."
    },
    {
      "en": "survey",
      "uz": "so'rovnoma",
      "rule": "AWL 7, formal",
      "example": "A survey was conducted among university students."
    },
    {
      "en": "theory",
      "uz": "nazariya",
      "rule": "AWL 7, akademik",
      "example": "According to this theory, language shapes thought."
    },
    {
      "en": "tradition",
      "uz": "an'ana",
      "rule": "AWL 7, madaniy",
      "example": "The tradition of celebrating Nowruz dates back centuries."
    },
    {
      "en": "affect",
      "uz": "ta'sir qilmoq",
      "rule": "AWL 8, fe'l (verb)",
      "example": "Climate change affects ecosystems worldwide."
    },
    {
      "en": "approach",
      "uz": "yondashish",
      "rule": "AWL 8, formal",
      "example": "A new approach to teaching has been adopted."
    },
    {
      "en": "assume",
      "uz": "taxmin qilmoq",
      "rule": "AWL 8, fe'l",
      "example": "It is reasonable to assume that prices will rise."
    },
    {
      "en": "authority",
      "uz": "hokimiyat, vakolat",
      "rule": "AWL 8, formal",
      "example": "The local authority is responsible for waste management."
    },
    {
      "en": "available",
      "uz": "mavjud",
      "rule": "AWL 8, adjective",
      "example": "Several options are available to address this problem."
    },
    {
      "en": "benefit",
      "uz": "foyda, manfaat",
      "rule": "AWL 9, formal",
      "example": "The benefits of exercise are well-documented."
    },
    {
      "en": "consequence",
      "uz": "oqibat",
      "rule": "AWL 9, formal",
      "example": "The consequences of global warming are severe."
    },
    {
      "en": "distribution",
      "uz": "taqsimot",
      "rule": "AWL 9, formal",
      "example": "The distribution of wealth is uneven in many countries."
    },
    {
      "en": "emerging",
      "uz": "rivojlanayotgan",
      "rule": "AWL 9, adjective",
      "example": "Emerging economies are growing rapidly."
    },
    {
      "en": "focus",
      "uz": "diqqat, asosiy e'tibor",
      "rule": "AWL 9, collocation: focus on",
      "example": "The focus of the study is on environmental issues."
    },
    {
      "en": "global",
      "uz": "global, jahon",
      "rule": "AWL 10, adjective",
      "example": "Global temperatures have risen over the past century."
    },
    {
      "en": "involve",
      "uz": "o'z ichiga olmoq",
      "rule": "AWL 10, fe'l",
      "example": "The project involves collaboration between multiple departments."
    },
    {
      "en": "maintain",
      "uz": "saqlamoq, davom ettirmoq",
      "rule": "AWL 10, fe'l",
      "example": "It is essential to maintain high standards."
    },
    {
      "en": "potential",
      "uz": "potensial, imkoniyat",
      "rule": "AWL 10, noun/adjective",
      "example": "Renewable energy has the potential to transform the economy."
    },
    {
      "en": "priority",
      "uz": "ustuvorlik",
      "rule": "AWL 10, formal",
      "example": "Education should be a top priority for any government."
    },
    {
      "en": "academic vocabulary",
      "uz": "akademik lug'at",
      "rule": "AWL so'zlari",
      "example": "Analysis, concept, evidence, factor, method."
    },
    {
      "en": "academic word list",
      "uz": "akademik so'zlar ro'yxati",
      "rule": "AWL 1-10",
      "example": "The AWL contains 570 word families for academic study."
    },
    {
      "en": "formal synonym",
      "uz": "rasmiy sinonim",
      "rule": "AWL so'zi = kundalik so'z",
      "example": "Obtain = get, demonstrate = show, sufficient = enough."
    }
  ],
  "examples": [
    {
      "en": "The analysis of demographic data reveals significant trends in population growth.",
      "uz": "Demografik ma'lumotlar tahlili aholi o'sishidagi muhim tendensiyalarni ochib beradi."
    },
    {
      "en": "It is widely accepted that education plays a crucial role in economic development.",
      "uz": "Ta'lim iqtisodiy rivojlanishda hal qiluvchi rol o'ynashi keng qabul qilingan."
    },
    {
      "en": "The government must address the issue of climate change as a matter of priority.",
      "uz": "Hukumat iqlim o'zgarishi masalasini ustuvor vazifa sifatida hal qilishi kerak."
    },
    {
      "en": "Further research is required to establish a clear link between these factors.",
      "uz": "Ushbu omillar o'rtasidagi aniq bog'liqlikni aniqlash uchun qo'shimcha tadqiqot talab etiladi."
    },
    {
      "en": "The consequences of global warming affect ecosystems worldwide.",
      "uz": "Global isishning oqibatlari butun dunyo bo'ylab ekotizimlarga ta'sir qiladi."
    },
    {
      "en": "It can be argued that technology has a significant impact on modern education.",
      "uz": "Texnologiya zamonaviy ta'limga sezilarli ta'sir ko'rsatadi, deb bahslash mumkin."
    },
    {
      "en": "The study focuses on the potential benefits of renewable energy sources.",
      "uz": "Tadqiqot qayta tiklanuvchi energiya manbalarining potensial foydalariga qaratilgan."
    },
    {
      "en": "A thorough assessment of the situation is required before making a final decision.",
      "uz": "Yakuniy qaror qabul qilishdan oldin vaziyatni har tomonlama baholash talab etiladi."
    }
  ],
  "specialCases": [
    {
      "id": "affect-vs-effect",
      "rule": "'Affect' — fe'l (verb): ta'sir qilmoq. 'Effect' — ot (noun): ta'sir, natija. 'Climate change affects many species.' 'The effect of pollution is harmful.' FE'L = Affect, OT = Effect. 'Affect' har doim fe'l, 'effect' deyarli har doim ot.",
      "title": "Affect vs Effect — eng ko'p uchraydigan xato",
      "drills": [
        {
          "id": 70630,
          "type": "fill-blank",
          "blanks": [
            "affect"
          ],
          "question": "The new policy will _____ (affect/effect) the economy.",
          "explanation": "'Will' dan keyin fe'l → 'affect'. 'Will affect the economy'.",
          "instruction": "'Affect' yoki 'Effect' bilan to'ldiring:"
        },
        {
          "id": 70631,
          "type": "fill-blank",
          "blanks": [
            "effect"
          ],
          "question": "The _____ (affect/effect) of the pandemic was devastating.",
          "explanation": "'The' dan keyin ot → 'effect'. 'The effect of the pandemic'.",
          "instruction": "'Affect' yoki 'Effect' bilan to'ldiring:"
        },
        {
          "id": 70632,
          "type": "multiple-choice",
          "correct": "affect",
          "options": [
            "affect",
            "effect",
            "effective",
            "affectedly"
          ],
          "question": "How did the recession ___ the job market?",
          "explanation": "Fe'l kerak → 'affect'. 'How did the recession affect the job market?'",
          "instruction": "To'g'ri variantni tanlang:"
        }
      ],
      "examples": [
        {
          "en": "The new law will affect small businesses significantly.",
          "uz": "Yangi qonun kichik biznesga sezilarli ta'sir qiladi."
        },
        {
          "en": "The new law will have a significant effect on small businesses.",
          "uz": "Yangi qonun kichik biznesga sezilarli ta'sir ko'rsatadi."
        }
      ],
      "mnemonic": "A = Action (fe'l) → Affect. E = End result (ot) → Effect. RAVEN: Remember Affect = Verb, Effect = Noun.",
      "commonMistakes": "'The new policy effected the economy' XATO → 'affected the economy' (fe'l kerak). 'What was the affect of the policy?' XATO → 'What was the effect?' (ot kerak)."
    },
    {
      "id": "data-usage",
      "rule": "'Data' — datum so'zining ko'plik shakli (lotin tilidan). Rasmiy akademik yozuvda 'data are...' (ko'plik) ishlatiladi. Norasmiy va kundalik ingliz tilida 'data is...' (birlik) keng tarqalgan. IELTS Writing da 'data are' (ko'plik) ishlating.",
      "title": "Data — ko'plikdami yoki birlikdami?",
      "drills": [
        {
          "id": 70633,
          "type": "fill-blank",
          "blanks": [
            "are"
          ],
          "question": "The data _____ (is/are) insufficient to draw a conclusion.",
          "explanation": "Formal akademik yozuvda 'data are' (ko'plik) ishlatiladi.",
          "instruction": "'Is' yoki 'are' bilan to'ldiring:"
        },
        {
          "id": 70634,
          "type": "error-correction",
          "correct": "These data are not accurate enough for the report.",
          "question": "This data is not accurate enough for the report.",
          "errorPart": "This data is",
          "explanation": "Formal: 'These data are' (ko'plik). 'This data is' informal.",
          "instruction": "Xatoni toping:"
        },
        {
          "id": 70635,
          "type": "multiple-choice",
          "correct": "The data are clear.",
          "options": [
            "The data is clear.",
            "The data are clear.",
            "The data be clear.",
            "The data am clear."
          ],
          "question": "Which is correct for academic writing?",
          "explanation": "Akademik yozuvda 'data are' (ko'plik) ishlatiladi.",
          "instruction": "To'g'ri variantni tanlang:"
        }
      ],
      "examples": [
        {
          "en": "The data were collected from a variety of sources.",
          "uz": "Ma'lumotlar turli manbalardan to'plangan."
        },
        {
          "en": "These data suggest that further investigation is required.",
          "uz": "Ushbu ma'lumotlar qo'shimcha tekshiruv talab etilishini ko'rsatadi."
        }
      ],
      "mnemonic": "DATUM (bir) → DATA (ko'p). One datum, many data. DATA ARE = formal, correct. DATA IS = informal, common but less correct.",
      "commonMistakes": "'The data shows that...' XATO (agar formal bo'lishni istasangiz) → 'The data show that...' TO'G'RI. 'This data' XATO → 'These data'."
    },
    {
      "id": "formal-vs-informal-words",
      "rule": "IELTS Writing Task 2 formal so'zlarni talab qiladi: obtain (get), demonstrate (show), sufficient (enough), significant (big), consequently (so), etc. Speaking da natural bo'lish uchun informal so'zlar maqbul. Writing da formal so'zlarni ishlatish majburiy.",
      "title": "Formal va Informal so'zlar — register farqi",
      "drills": [
        {
          "id": 70636,
          "type": "fill-blank",
          "blanks": [
            "obtain"
          ],
          "question": "The committee will _____ (get → formal) the necessary information.",
          "explanation": "'Get' → 'obtain'. Formal. 'The committee will obtain the necessary information'.",
          "instruction": "Formal so'z bilan to'ldiring:"
        },
        {
          "id": 70637,
          "type": "multiple-choice",
          "correct": "demonstrate",
          "options": [
            "show",
            "demonstrate",
            "tell",
            "use"
          ],
          "question": "Which is formal?",
          "explanation": "'Demonstrate' — formal. 'Show' — informal.",
          "instruction": "Formal variantni tanlang:"
        },
        {
          "id": 70638,
          "hint": "We obtained ...",
          "type": "transformation",
          "correct": "We obtained a significant number of benefits from the new system.",
          "question": "We got a lot of benefits from the new system.",
          "explanation": "'Got' → 'obtained'. 'A lot of' → 'a significant number of'.",
          "instruction": "Informal → Formal ga o'zgartiring:"
        }
      ],
      "examples": [
        {
          "en": "FORMAL: The study obtained sufficient data to demonstrate the impact.",
          "uz": "Tadqiqot ta'sirni ko'rsatish uchun yetarli ma'lumot oldi."
        },
        {
          "en": "INFORMAL: We got enough data to show the impact.",
          "uz": "Biz ta'sirni ko'rsatish uchun yetarli ma'lumot oldik."
        }
      ],
      "mnemonic": "WRITING = longer, Latin-based words (obtain, demonstrate, sufficient). SPEAKING = short, Anglo-Saxon words (get, show, enough). UZ: Yozma = uzun so'zlar, Og'zaki = qisqa so'zlar.",
      "commonMistakes": "'We got sufficient data to show the impact.' — 'Got' informal → 'obtained'. 'Show' informal → 'demonstrate'. 'We obtained sufficient data to demonstrate the impact.'"
    }
  ],
  "exercises": [
    {
      "id": 70639,
      "type": "multiple-choice",
      "correct": "analysis",
      "options": [
        "analysis",
        "synthesis",
        "hypothesis",
        "theory"
      ],
      "question": "Which word means 'tahlil'?",
      "explanation": "'Analysis' = 'tahlil'. Ma'lumotlarni batafsil o'rganish va tushunish.",
      "instruction": "Akademik so'z tanlang:"
    },
    {
      "id": 70640,
      "type": "multiple-choice",
      "correct": "obtain",
      "options": [
        "obtain",
        "grab",
        "catch",
        "receive"
      ],
      "question": "Formal synonym for 'get':",
      "explanation": "'Obtain' — 'get' ning formal sinonimi. 'The study obtained sufficient data'.",
      "instruction": "Formal variantni tanlang:"
    },
    {
      "id": 70641,
      "type": "multiple-choice",
      "correct": "conduct",
      "options": [
        "do",
        "make",
        "conduct",
        "create"
      ],
      "question": "Correct collocation: '___ research'",
      "explanation": "'Conduct research' — to'g'ri collocation. 'Do research' ham mumkin, lekin 'conduct' formal.",
      "instruction": "Collocation tanlang:"
    },
    {
      "id": 70642,
      "type": "multiple-choice",
      "correct": "are",
      "options": [
        "is",
        "are",
        "was",
        "has"
      ],
      "question": "The data ___ collected from various sources.",
      "explanation": "Formal akademik: 'The data are'. 'Data' ko'plik.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70643,
      "type": "multiple-choice",
      "correct": "affects",
      "options": [
        "effects",
        "affects",
        "is effecting",
        "effecting"
      ],
      "question": "Climate change ___ ecosystems worldwide.",
      "explanation": "Fe'l → 'affects'. 'Climate change affects ecosystems'.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70644,
      "type": "fill-blank",
      "blanks": [
        "concept"
      ],
      "question": "The _____ (tushuncha) of sustainable development is widely discussed.",
      "explanation": "'Concept' = 'tushuncha'. 'The concept of sustainable development'.",
      "instruction": "Akademik so'z bilan to'ldiring:"
    },
    {
      "id": 70645,
      "type": "fill-blank",
      "blanks": [
        "demonstrates"
      ],
      "question": "The study _____ (show → formal) a positive correlation.",
      "explanation": "'Show' → 'demonstrate'. 'The study demonstrates a positive correlation'.",
      "instruction": "Formal so'z bilan to'ldiring:"
    },
    {
      "id": 70646,
      "type": "fill-blank",
      "blanks": [
        "role"
      ],
      "question": "Education plays a crucial _____ (rol) in economic development.",
      "explanation": "'Play a role' — collocation. 'Education plays a crucial role'.",
      "instruction": "Collocation bilan to'ldiring:"
    },
    {
      "id": 70647,
      "type": "fill-blank",
      "blanks": [
        "consequences"
      ],
      "question": "The _____ (oqibat) of global warming are severe.",
      "explanation": "'Consequence' = 'oqibat'. 'The consequences of global warming'.",
      "instruction": "Akademik so'z bilan to'ldiring:"
    },
    {
      "id": 70648,
      "type": "fill-blank",
      "blanks": [
        "needs"
      ],
      "question": "The company _____ (need → formal) to improve its customer service.",
      "explanation": "'Need' formal. 'The company needs to improve'. 'Require' ham mumkin.",
      "instruction": "Formal so'z bilan to'ldiring:"
    },
    {
      "id": 70649,
      "type": "error-correction",
      "correct": "The effect of the policy was significant for the economy.",
      "question": "The effect of the policy affected the economy.",
      "errorPart": "effect ... affected",
      "explanation": "'Effect' va 'affect' adashgan. 'Effect' ot, 'affect' fe'l. Gapni qayta tuzing.",
      "instruction": "Xatoni toping:"
    },
    {
      "id": 70650,
      "type": "error-correction",
      "correct": "We obtained a significant number of benefits from the new system.",
      "question": "We got a lot of benefits from the new system. (Make formal)",
      "errorPart": "We got a lot of",
      "explanation": "'Got' → 'obtained'. 'A lot of' → 'a significant number of'.",
      "instruction": "Xatoni toping:"
    },
    {
      "id": 70651,
      "type": "error-correction",
      "correct": "These data are not sufficient for our analysis.",
      "question": "This data is not sufficient for our analysis.",
      "errorPart": "This data is",
      "explanation": "Formal: 'These data are'. 'Data' ko'plik. 'This data is' informal.",
      "instruction": "Xatoni toping:"
    },
    {
      "id": 70652,
      "hint": "The government should address ...",
      "type": "transformation",
      "correct": "The government should address the issue of pollution.",
      "question": "The government should do something about pollution.",
      "explanation": "'Do something about' → 'address the issue of'. Formal.",
      "instruction": "Formal ga o'zgartiring:"
    },
    {
      "id": 70653,
      "hint": "It is widely ...",
      "type": "transformation",
      "correct": "It is widely believed that education is of great importance.",
      "question": "A lot of people think that education is very important.",
      "explanation": "'A lot of people think' → 'It is widely believed'. 'Very important' → 'of great importance'.",
      "instruction": "Formal ga o'zgartiring:"
    },
    {
      "id": 70654,
      "hint": "It can be observed that ...",
      "type": "transformation",
      "correct": "It can be observed that the economy is improving.",
      "question": "We can see that the economy is getting better.",
      "explanation": "'We can see' → 'It can be observed'. 'Getting better' → 'improving'. Impersonal passive.",
      "instruction": "Formal ga o'zgartiring:"
    },
    {
      "id": 70655,
      "type": "multiple-choice",
      "correct": "sufficient",
      "options": [
        "sufficient",
        "plenty",
        "lots",
        "ample"
      ],
      "question": "Which is a formal synonym for 'enough'?",
      "explanation": "'Sufficient' — 'enough' ning formal sinonimi. 'Sufficient data', 'sufficient evidence'.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70656,
      "type": "multiple-choice",
      "correct": "play a role",
      "options": [
        "take a role",
        "do a role",
        "play a role",
        "make a role"
      ],
      "question": "Which collocation is correct?",
      "explanation": "'Play a role' — to'g'ri collocation. 'Education plays a crucial role'.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70657,
      "type": "multiple-choice",
      "correct": "It is widely acknowledged that this is detrimental.",
      "options": [
        "People think it is bad.",
        "It is widely acknowledged that this is detrimental.",
        "Most people know it is not good.",
        "Everybody says it is bad."
      ],
      "question": "Which sentence is most formal?",
      "explanation": "'It is widely acknowledged' — impersonal passive. 'Detrimental' — formal. Eng formal variant.",
      "instruction": "To'g'ri variantni tanlang:"
    },
    {
      "id": 70658,
      "type": "error-correction",
      "correct": "It can be argued that technology has a significant impact on education.",
      "question": "It can be argued that technology has a big impact on education.",
      "errorPart": "big impact",
      "explanation": "'Big' → 'significant'. Akademik yozuvda 'big' ishlatmang.",
      "instruction": "Xatoni toping:"
    }
  ],
  "exerciseSections": [
    {
      "ids": [
        4001,
        4002,
        4003,
        4004,
        4005
      ],
      "desc": "Top 50 AWL so'zlari — tanib olish",
      "icon": "🌱",
      "color": "bg-emerald-500",
      "title": "Asosiy"
    },
    {
      "ids": [
        4006,
        4007,
        4008,
        4009,
        4010
      ],
      "desc": "Fill-blank — so'z boyligini mustahkamlash",
      "icon": "📘",
      "color": "bg-blue-500",
      "title": "O'rtacha"
    },
    {
      "ids": [
        4011,
        4012,
        4013,
        4014,
        4015
      ],
      "desc": "Error-correction — keng tarqalgan xatolar",
      "icon": "💪",
      "color": "bg-violet-500",
      "title": "Qiyin"
    },
    {
      "ids": [
        4016,
        4017,
        4018,
        4019,
        4020
      ],
      "desc": "Transformation — IELTS darajasidagi mashqlar",
      "icon": "🏆",
      "color": "bg-rose-500",
      "title": "Yuqori daraja"
    }
  ],
  "tests": [
    {
      "id": 70659,
      "type": "multiple-choice",
      "correct": "tahlil",
      "options": [
        "tahlil",
        "sintez",
        "baholash",
        "taqqoslash"
      ],
      "question": "'Analysis' so'zining ma'nosi?",
      "explanation": "'Analysis' = 'tahlil'. Ma'lumotlarni batafsil o'rganish.",
      "instruction": "Asosiy"
    },
    {
      "id": 70660,
      "type": "multiple-choice",
      "correct": "obtain",
      "options": [
        "obtain",
        "grab",
        "catch",
        "take"
      ],
      "question": "'Get' so'zining formal sinonimi?",
      "explanation": "'Obtain' — 'get' ning formal sinonimi.",
      "instruction": "Asosiy"
    },
    {
      "id": 70661,
      "type": "multiple-choice",
      "correct": "demonstrate",
      "options": [
        "tell",
        "demonstrate",
        "point",
        "indicate"
      ],
      "question": "'Show' so'zining formal sinonimi?",
      "explanation": "'Demonstrate' — 'show' ning formal sinonimi.",
      "instruction": "Asosiy"
    },
    {
      "id": 70662,
      "type": "multiple-choice",
      "correct": "a significant number of",
      "options": [
        "a significant number of",
        "lots of",
        "tons of",
        "loads of"
      ],
      "question": "'A lot of' formal varianti?",
      "explanation": "'A significant number of' formal. 'Lots of', 'tons of' informal.",
      "instruction": "Asosiy"
    },
    {
      "id": 70663,
      "type": "multiple-choice",
      "correct": "data are",
      "options": [
        "data is",
        "data are",
        "data am",
        "data be"
      ],
      "question": "'Data' qanday ishlatiladi (formal)?",
      "explanation": "Formal akademik yozuvda 'data are' (ko'plik) ishlatiladi.",
      "instruction": "Asosiy"
    },
    {
      "id": 70664,
      "type": "multiple-choice",
      "correct": "plays",
      "options": [
        "makes",
        "does",
        "plays",
        "takes"
      ],
      "question": "Education ___ a crucial role in development.",
      "explanation": "'Play a role' — to'g'ri collocation.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70665,
      "type": "multiple-choice",
      "correct": "ta'sir qilmoq",
      "options": [
        "efekt",
        "ta'sir qilmoq",
        "natija",
        "sabab"
      ],
      "question": "Affect so'zining ma'nosi?",
      "explanation": "'Affect' = fe'l, 'ta'sir qilmoq'.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70666,
      "type": "multiple-choice",
      "correct": "natijada",
      "options": [
        "bundan tashqari",
        "natijada",
        "shunga qaramay",
        "aksincha"
      ],
      "question": "'Consequently' so'zining ma'nosi?",
      "explanation": "'Consequently' = 'natijada'. Sabab-natija markeri.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70667,
      "type": "multiple-choice",
      "correct": "banana",
      "options": [
        "analysis",
        "economy",
        "banana",
        "policy"
      ],
      "question": "Which is NOT an AWL word?",
      "explanation": "'Banana' — AWL (Academic Word List) so'zi emas. 'Analysis', 'economy', 'policy' AWL so'zlari.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70668,
      "type": "multiple-choice",
      "correct": "address",
      "options": [
        "solve",
        "address",
        "fix",
        "repair"
      ],
      "question": "Correct collocation: '___ the issue'",
      "explanation": "'Address the issue' — formal collocation. 'Solve' ham mumkin, lekin 'address' formalroq.",
      "instruction": "O'rtacha"
    },
    {
      "id": 70669,
      "type": "multiple-choice",
      "correct": "The policy affected the economy positively.",
      "options": [
        "The affect of the policy was positive.",
        "The policy effected the economy positively.",
        "The policy affected the economy positively.",
        "What is the affect of this?"
      ],
      "question": "Which sentence uses 'affect' correctly?",
      "explanation": "'Affect' fe'l → 'affected the economy'. 'Effect' ot.",
      "instruction": "Qiyin"
    },
    {
      "id": 70670,
      "type": "multiple-choice",
      "correct": "We obtained sufficient data.",
      "options": [
        "We got sufficient data.",
        "We obtained enough data.",
        "We obtained sufficient data.",
        "We got enough data."
      ],
      "question": "Which is correct for academic writing?",
      "explanation": "'We obtained' (formal) + 'sufficient' (formal). Eng formal variant.",
      "instruction": "Qiyin"
    },
    {
      "id": 70671,
      "type": "multiple-choice",
      "correct": "Research is uncountable",
      "options": [
        "Research is uncountable",
        "Research is countable",
        "Research is a verb",
        "Nothing is wrong"
      ],
      "question": "What is wrong with 'The research have shown...'?",
      "explanation": "'Research' uncountable → 'has shown', 'have shown' emas. 'The research has shown'.",
      "instruction": "Qiyin"
    },
    {
      "id": 70672,
      "type": "multiple-choice",
      "correct": "It can be argued that there are several factors contributing to this phenomenon.",
      "options": [
        "There are lots of reasons for this.",
        "It can be argued that there are several factors contributing to this phenomenon.",
        "You can see many reasons for this.",
        "Everybody knows the reasons for this."
      ],
      "question": "Which sentence demonstrates the best use of academic register?",
      "explanation": "Impersonal passive + formal vocabulary + complex structure. IELTS Band 7+ sifatida.",
      "instruction": "Yuqori daraja"
    },
    {
      "id": 70673,
      "type": "multiple-choice",
      "correct": "Use a mix of formal academic words with correct collocations",
      "options": [
        "Use simple words correctly",
        "Use only very difficult words",
        "Use a mix of formal academic words with correct collocations",
        "Repeat the same words throughout"
      ],
      "question": "For IELTS Writing Task 2, which approach is best for lexical resource?",
      "explanation": "Lexical Resource — so'z boyligi, sinonimlar, collocation va formal register kombinatsiyasi bilan yuqori ball olinadi.",
      "instruction": "Yuqori daraja"
    }
  ],
  "testSections": [
    {
      "ids": [
        421,
        422,
        423,
        424,
        425
      ],
      "desc": "AWL asoslari",
      "icon": "🌱",
      "color": "bg-emerald-500",
      "title": "Asosiy"
    },
    {
      "ids": [
        426,
        427,
        428,
        429,
        430
      ],
      "desc": "Collocation va so'z boyligi",
      "icon": "📘",
      "color": "bg-blue-500",
      "title": "O'rtacha"
    },
    {
      "ids": [
        431,
        432,
        433
      ],
      "desc": "Murakkab holatlar",
      "icon": "💪",
      "color": "bg-violet-500",
      "title": "Qiyin"
    },
    {
      "ids": [
        434,
        435
      ],
      "desc": "IELTS darajasi",
      "icon": "🏆",
      "color": "bg-rose-500",
      "title": "Yuqori daraja"
    }
  ]
}
