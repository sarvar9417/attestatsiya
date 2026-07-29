export interface CanDoStatement {
  category: string
  categoryUz: string
  categoryRu: string
  statements: {
    en: string
    uz: string
    ru: string
  }[]
}

export const canDoStatements: Record<string, CanDoStatement[]> = {
  A1: [
    {
      category: 'Speaking',
      categoryUz: 'Gapirish',
      categoryRu: 'Говорение',
      statements: [
        { en: 'I can introduce myself and others', uz: "O'zimni va boshqalarni tanishtira olaman", ru: 'Я могу представиться и представить других' },
        { en: 'I can ask and answer simple personal questions', uz: "Oddiy shaxsiy savollar berish va javob berish", ru: 'Я могу задавать и отвечать на простые личные вопросы' },
        { en: 'I can order food in a restaurant', uz: "Restoranda ovqat buyurtira olaman", ru: 'Я могу заказать еду в ресторане' },
        { en: 'I can describe where I live', uz: "Qayerda yashashimni tasvirlab berish", ru: 'Я могу описать, где я живу' },
      ]
    },
    {
      category: 'Listening',
      categoryUz: 'Tinglash',
      categoryRu: 'Аудирование',
      statements: [
        { en: 'I can understand slow, clear speech about familiar topics', uz: "Sekkin va aniq nutqni tushuna olaman", ru: 'Я могу понимать медленную речь на знакомые темы' },
        { en: 'I can recognize familiar words and basic phrases', uz: "Tanish so'zlarni va asosiy frazalarni taniy olaman", ru: 'Я могу узнавать знакомые слова и основные фразы' },
      ]
    },
    {
      category: 'Reading',
      categoryUz: "O'qish",
      categoryRu: 'Чтение',
      statements: [
        { en: 'I can understand names, words, and simple sentences', uz: "Ism, so'z va oddiy gaplarni tushuna olaman", ru: 'Я могу понимать имена, слова и простые предложения' },
        { en: 'I can read short, simple texts', uz: "Qisqa, oddiy matnlarni o'qish", ru: 'Я могу читать короткие простые тексты' },
      ]
    },
    {
      category: 'Writing',
      categoryUz: 'Yozish',
      categoryRu: 'Письмо',
      statements: [
        { en: 'I can write a short, simple postcard', uz: "Qisqa, oddiy ochiq xat yozish", ru: 'Я могу написать короткую открытку' },
        { en: 'I can fill in forms with personal details', uz: "Shaxsiy ma'lumotlarni to'ldirish", ru: 'Я могу заполнить формы с личными данными' },
      ]
    }
  ],
  A2: [
    {
      category: 'Speaking',
      categoryUz: 'Gapirish',
      categoryRu: 'Говорение',
      statements: [
        { en: 'I can communicate in simple, routine tasks', uz: "Oddiy, kundalik vazifalarda muloqot qilish", ru: 'Я могу общаться в простых повседневных ситуациях' },
        { en: 'I can describe my background and immediate environment', uz: "O'tmishim va atrof-muhitimni tasvirlash", ru: 'Я могу описать свое прошлое и ближайшее окружение' },
        { en: 'I can handle short social exchanges', uz: "Qisqa ijtimoiy suhbatlarni boshqarish", ru: 'Я могу вести короткие социальные беседы' },
      ]
    },
    {
      category: 'Listening',
      categoryUz: 'Tinglash',
      categoryRu: 'Аудирование',
      statements: [
        { en: 'I can understand phrases and high-frequency vocabulary', uz: "Frezalarni va ko'p qo'llaniladigan so'zlarni tushunish", ru: 'Я могу понимать фразы и часто используемые слова' },
        { en: 'I can understand short, simple recorded messages', uz: "Qisqa, oddiy yozilgan xabarlarni tushunish", ru: 'Я могу понимать короткие простые записанные сообщения' },
      ]
    },
    {
      category: 'Reading',
      categoryUz: "O'qish",
      categoryRu: 'Чтение',
      statements: [
        { en: 'I can read very short, simple texts', uz: "Juda qisqa, oddiy matnlarni o'qish", ru: 'Я могу читать очень короткие простые тексты' },
        { en: 'I can find specific, predictable information', uz: "Aniq, oldindan taxmin qilinadigan ma'lumotni topish", ru: 'Я могу найти конкретную ожидаемую информацию' },
      ]
    },
    {
      category: 'Writing',
      categoryUz: 'Yozish',
      categoryRu: 'Письмо',
      statements: [
        { en: 'I can write short, simple notes and messages', uz: "Qisqa, oddiy eslatmalar va xabarlar yozish", ru: 'Я могу писать короткие простые записки и сообщения' },
        { en: 'I can write a very simple personal letter', uz: "Juda oddiy shaxsiy xat yozish", ru: 'Я могу написать очень простое личное письмо' },
      ]
    }
  ],
  B1: [
    {
      category: 'Speaking',
      categoryUz: 'Gapirish',
      categoryRu: 'Говорение',
      statements: [
        { en: 'I can deal with most situations while travelling', uz: "Sayohat paytida ko'pchilik holatlarni hal qilish", ru: 'Я могу справляться с большинством ситуаций во время путешествий' },
        { en: 'I can describe experiences, events, and ambitions', uz: "Tajribalar, voqealar va orzularimni tasvirlash", ru: 'Я могу описывать опыт, события и мечты' },
        { en: 'I can give reasons and explanations for opinions', uz: "Fikrlarim uchun sabab va tushuntirish berish", ru: 'Я могу приводить причины и объяснения для мнений' },
      ]
    },
    {
      category: 'Listening',
      categoryUz: 'Tinglash',
      categoryRu: 'Аудирование',
      statements: [
        { en: 'I can understand the main points of clear standard speech', uz: "Aniq standart nutqning asosiy mazmunini tushunish", ru: 'Я могу понимать основные моменты четкой стандартной речи' },
        { en: 'I can understand TV shows and movies in standard dialect', uz: "Standart leksikadagi TV ko'rsatuvlar va filmlarni tushunish", ru: 'Я могу понимать телепередачи и фильмы на стандартном диалекте' },
      ]
    },
    {
      category: 'Reading',
      categoryUz: "O'qish",
      categoryRu: 'Чтение',
      statements: [
        { en: 'I can understand texts that consist mainly of high-frequency language', uz: "Ko'p qo'llaniladigan so'zlardan tashkil topgan matnlarni tushunish", ru: 'Я могу понимать тексты, состоящие в основном из частотной лексики' },
        { en: 'I can identify the main point in news articles', uz: "Yangiliklar maqolalaridagi asosiy g'oyani aniqlash", ru: 'Я могу определить главную мысль в новостных статьях' },
      ]
    },
    {
      category: 'Writing',
      categoryUz: 'Yozish',
      categoryRu: 'Письмо',
      statements: [
        { en: 'I can write connected text on familiar topics', uz: "Tanish mavzularda bog'langan matn yozish", ru: 'Я могу писать связные тексты на знакомые темы' },
        { en: 'I can write personal letters describing experiences', uz: "Tajribalarni tasvirlaydigan shaxsiy xatlar yozish", ru: 'Я могу писать личные письма, описывающие опыт' },
      ]
    }
  ],
  B2: [
    {
      category: 'Speaking',
      categoryUz: 'Gapirish',
      categoryRu: 'Говорение',
      statements: [
        { en: 'I can present clear, detailed descriptions on a wide range of subjects', uz: "Keng mavzularda aniq va batafsil tavsiflar berish", ru: 'Я могу давать четкие, подробные описания по ширкому кругу тем' },
        { en: 'I can explain my viewpoint on topical issues', uz: "Mavzu masalalar bo'yicha fikrimni tushuntirish", ru: 'Я могу объяснить свою точку зрения на актуальные вопросы' },
        { en: 'I can interact with native speakers with a degree of fluency', uz: "Ona tili so'zlovchilar bilan ravon muloqot qilish", ru: 'Я могу общаться с носителями языка с определенной беглостью' },
      ]
    },
    {
      category: 'Listening',
      categoryUz: 'Tinglash',
      categoryRu: 'Аудирование',
      statements: [
        { en: 'I can understand extended speech and lectures', uz: "Uzoq nutq va ma'ruzalarni tushunish", ru: 'Я могу понимать протяженную речь и лекции' },
        { en: 'I can follow complex arguments even when not clearly structured', uz: "Aniq tuzilmagan murakkab argumentlarni ham tushunish", ru: 'Я могу следить за сложными аргументами даже без четкой структуры' },
      ]
    },
    {
      category: 'Reading',
      categoryUz: "O'qish",
      categoryRu: 'Чтение',
      statements: [
        { en: 'I can read articles and reports concerned with contemporary problems', uz: "Zamonaviy muammolarga oid maqolalarni o'qish", ru: 'Я могу читать статьи и отчеты, касающиеся современных проблем' },
        { en: 'I can recognize the line of argument in the treatment of the issue', uz: "Masala yuzasidan argumentatsiya ketma-ketligini aniqlash", ru: 'Я могу распознать линию аргументации в рассмотрении вопроса' },
      ]
    },
    {
      category: 'Writing',
      categoryUz: 'Yozish',
      categoryRu: 'Письмо',
      statements: [
        { en: 'I can write clear, detailed text on a wide range of subjects', uz: "Keng mavzularda aniq va batafsil matn yozish", ru: 'Я могу писать четкие, подробные тексты по ширкому кругу тем' },
        { en: 'I can evaluate different ideas or solutions to a problem', uz: "Muammo uchun turli g'oyalar yoki yechimlarni baholash", ru: 'Я могу оценивать различные идеи или решения проблемы' },
      ]
    }
  ],
}
