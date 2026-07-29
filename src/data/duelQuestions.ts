// ═══════════════════════════════════════════════════════════════════════════
// duelQuestions.ts — Grammar & Reading savollari (Async Duel uchun)
// ═══════════════════════════════════════════════════════════════════════════

export interface DuelQuestionData {
  id: number
  english: string   // savol matni (grammar: gap, reading: comprehension)
  options: string[] // 4 variant
  correct: number   // to'g'ri index
}

// ─── GRAMMAR QUESTIONS ──────────────────────────────────────────────────────

const GRAMMAR_A1: DuelQuestionData[] = [
  { id: 1,  english: "She ___ to school every day.",                options: ["go", "goes", "going", "gone"],          correct: 1 },
  { id: 2,  english: "I ___ a student.",                            options: ["am", "is", "are", "be"],               correct: 0 },
  { id: 3,  english: "They ___ playing football now.",              options: ["is", "am", "are", "be"],               correct: 2 },
  { id: 4,  english: "He ___ not like coffee.",                     options: ["do", "does", "is", "are"],             correct: 1 },
  { id: 5,  english: "___ you speak English?",                      options: ["Does", "Do", "Is", "Are"],             correct: 1 },
  { id: 6,  english: "We ___ a car.",                               options: ["has", "have", "having", "haves"],      correct: 1 },
  { id: 7,  english: "This ___ my book.",                           options: ["am", "is", "are", "be"],               correct: 1 },
  { id: 8,  english: "I ___ breakfast at 7 AM.",                    options: ["eat", "eats", "eating", "eated"],      correct: 0 },
  { id: 9,  english: "She ___ a teacher.",                          options: ["am", "is", "are", "be"],               correct: 1 },
  { id: 10, english: "___ they from Tashkent?",                     options: ["Is", "Am", "Are", "Do"],               correct: 2 },
  { id: 11, english: "The cat is ___ the table.",                    options: ["in", "on", "at", "under"],             correct: 3 },
  { id: 12, english: "I have ___ apple.",                            options: ["a", "an", "the", "some"],              correct: 1 },
  { id: 13, english: "There ___ a book on the table.",               options: ["am", "is", "are", "be"],               correct: 1 },
  { id: 14, english: "She can ___ English well.",                    options: ["speaks", "spoke", "speak", "speaking"], correct: 2 },
  { id: 15, english: "I go to school ___ bus.",                      options: ["by", "on", "in", "with"],              correct: 0 },
  { id: 16, english: "___ is your name?",                            options: ["What", "Where", "When", "Why"],        correct: 0 },
  { id: 17, english: "The book is ___ the desk.",                    options: ["in", "on", "at", "under"],             correct: 1 },
  { id: 18, english: "I like ___ football.",                         options: ["play", "plays", "playing", "played"],  correct: 2 },
  { id: 19, english: "It is ___ pen.",                               options: ["a", "an", "the", "some"],              correct: 0 },
  { id: 20, english: "___ old is your brother?",                     options: ["What", "How", "Where", "When"],        correct: 1 },
]

const GRAMMAR_A2: DuelQuestionData[] = [
  { id: 1,  english: "Yesterday, I ___ to the park.",                options: ["go", "goes", "went", "going"],              correct: 2 },
  { id: 2,  english: "She was ___ when I called.",                   options: ["sleep", "sleeps", "slept", "sleeping"],     correct: 3 },
  { id: 3,  english: "I have ___ visited Samarkand.",                options: ["ever", "never", "yet", "already"],          correct: 1 },
  { id: 4,  english: "___ you ever eaten plov?",                     options: ["Did", "Have", "Do", "Are"],                 correct: 1 },
  { id: 5,  english: "She is ___ than her sister.",                   options: ["tall", "taller", "tallest", "more tall"],    correct: 1 },
  { id: 6,  english: "This is the ___ book I've read.",              options: ["good", "better", "best", "more good"],      correct: 2 },
  { id: 7,  english: "I ___ my homework when you called.",           options: ["do", "did", "was doing", "have done"],      correct: 2 },
  { id: 8,  english: "We are going ___ visit Bukhara.",              options: ["for", "to", "at", "in"],                    correct: 1 },
  { id: 9,  english: "There ___ some milk in the fridge.",           options: ["am", "is", "are", "be"],                    correct: 1 },
  { id: 10, english: "She doesn't have ___ money.",                  options: ["many", "much", "a few", "a lot"],           correct: 1 },
  { id: 11, english: "I bought ___ apples at the market.",           options: ["some", "any", "much", "little"],            correct: 0 },
  { id: 12, english: "___ you like some tea?",                       options: ["Do", "Would", "Did", "Are"],                correct: 1 },
  { id: 13, english: "He has been studying ___ 3 hours.",            options: ["since", "for", "during", "in"],             correct: 1 },
  { id: 14, english: "She has lived here ___ 2020.",                 options: ["for", "since", "during", "in"],             correct: 1 },
  { id: 15, english: "I ___ like to order a coffee.",                options: ["should", "could", "would", "must"],          correct: 2 },
  { id: 16, english: "We have ___ finished our project.",            options: ["yet", "already", "never", "ever"],          correct: 1 },
  { id: 17, english: "The restaurant ___ at 9 PM.",                  options: ["close", "closes", "closed", "closing"],     correct: 1 },
  { id: 18, english: "I ___ like to eat sushi.",                      options: ["don't", "doesn't", "isn't", "aren't"],       correct: 0 },
  { id: 19, english: "She speaks English ___ than me.",              options: ["good", "well", "better", "best"],           correct: 2 },
  { id: 20, english: "You should ___ more water.",                   options: ["drink", "drinks", "drank", "drinking"],     correct: 0 },
]

const GRAMMAR_B1: DuelQuestionData[] = [
  { id: 1,  english: "If I ___ you, I would study harder.",          options: ["am", "was", "were", "be"],                   correct: 2 },
  { id: 2,  english: "She has been working here ___ five years.",    options: ["since", "for", "during", "in"],              correct: 1 },
  { id: 3,  english: "The book ___ was on the table is mine.",       options: ["which", "who", "whom", "whose"],             correct: 0 },
  { id: 4,  english: "I wish I ___ speak English fluently.",         options: ["can", "could", "will", "would"],             correct: 1 },
  { id: 5,  english: "By next year, I ___ from university.",         options: ["graduate", "will graduate", "will have graduated", "graduated"], correct: 2 },
  { id: 6,  english: "It ___ outside when I left home.",              options: ["rains", "rained", "was raining", "has rained"], correct: 2 },
  { id: 7,  english: "I'm used to ___ up early.",                    options: ["get", "gets", "getting", "got"],             correct: 2 },
  { id: 8,  english: "She told me ___ wait for her.",                options: ["that", "to", "for", "and"],                   correct: 1 },
  { id: 9,  english: "We ___ each other since childhood.",           options: ["know", "knew", "have known", "had known"],    correct: 2 },
  { id: 10, english: "The more you study, ___ you become.",          options: ["the smarter", "smarter", "more smart", "smart"], correct: 0 },
  { id: 11, english: "He asked where I ___ .",                        options: ["live", "lived", "living", "am living"],      correct: 1 },
  { id: 12, english: "I don't mind ___ late at night.",              options: ["work", "to work", "working", "worked"],      correct: 2 },
  { id: 13, english: "She ___ have missed the bus.",                 options: ["must", "can", "might", "will"],              correct: 2 },
  { id: 14, english: "By the time we arrived, they ___ dinner.",     options: ["had", "had had", "have had", "having"],      correct: 1 },
  { id: 15, english: "This is the man ___ car was stolen.",          options: ["who", "whom", "whose", "which"],             correct: 2 },
  { id: 16, english: "If he ___ harder, he would pass.",             options: ["studies", "studied", "would study", "study"], correct: 1 },
  { id: 17, english: "I would rather ___ at home tonight.",          options: ["stay", "to stay", "staying", "stayed"],      correct: 0 },
  { id: 18, english: "She advised me ___ a doctor.",                 options: ["see", "seeing", "to see", "saw"],            correct: 2 },
  { id: 19, english: "Neither the teacher ___ the students were there.", options: ["or", "nor", "and", "but"],              correct: 1 },
  { id: 20, english: "Hardly had we left ___ it started raining.",   options: ["when", "than", "that", "then"],              correct: 0 },
]

const GRAMMAR_B2: DuelQuestionData[] = [
  { id: 1,  english: "Had I known, I ___ differently.",              options: ["would act", "would have acted", "acted", "would be acting"], correct: 1 },
  { id: 2,  english: "It is essential that he ___ on time.",         options: ["arrives", "arrive", "arrived", "arriving"],  correct: 1 },
  { id: 3,  english: "The proposal ___ by the committee next week.",  options: ["reviews", "reviewed", "will be reviewed", "is reviewing"], correct: 2 },
  { id: 4,  english: "Not until she arrived ___ the truth.",         options: ["she knew", "did she know", "she knows", "she had known"], correct: 1 },
  { id: 5,  english: "Were I in your position, I ___ accept.",       options: ["would", "will", "may", "can"],               correct: 0 },
  { id: 6,  english: "The experiment, ___ took months, was successful.", options: ["that", "which", "what", "who"],          correct: 1 },
  { id: 7,  english: "She resents ___ about her mistakes.",          options: ["being told", "to be told", "telling", "having told"], correct: 0 },
  { id: 8,  english: "By next month, he ___ for 10 years.",          options: ["will work", "will have been working", "works", "has been working"], correct: 1 },
  { id: 9,  english: "The data ___ analysed, we published the paper.", options: ["having been", "being", "was", "had"],     correct: 0 },
  { id: 10, english: "___ his reputation, he was invited to speak.", options: ["Because", "Due to", "Owing to", "Despite"], correct: 2 },
  { id: 11, english: "I'd rather you ___ told anyone about this.",   options: ["didn't", "hadn't", "don't", "wouldn't"],     correct: 1 },
  { id: 12, english: "Scarcely ___ the phone when she hung up.",     options: ["did I answer", "had I answered", "I answered", "I had answered"], correct: 1 },
  { id: 13, english: "The manager insisted that the report ___ .",    options: ["is submitted", "be submitted", "submits", "submitted"], correct: 1 },
  { id: 14, english: "No sooner ___ the bell than they left.",       options: ["did ring", "had rung", "rang", "was ringing"], correct: 1 },
  { id: 15, english: "She is ___ to know the answer.",                options: ["enough smart", "smart enough", "so smart", "too smart"], correct: 1 },
  { id: 16, english: "It was ___ a difficult exam that few passed.", options: ["so", "such", "too", "very"],                correct: 1 },
  { id: 17, english: "___ the weather, the event was cancelled.",    options: ["Due to", "Because", "Since", "As"],          correct: 0 },
  { id: 18, english: "The theory ___ by Einstein is widely accepted.", options: ["proposed", "proposing", "was proposed", "proposes"], correct: 0 },
  { id: 19, english: "He talks as if he ___ everything.",            options: ["knows", "knew", "had known", "knowing"],     correct: 1 },
  { id: 20, english: "___ considered, the results are impressive.",  options: ["All things", "Everything", "Each thing", "Anything"], correct: 0 },
]

// ─── READING PASSAGES + QUESTIONS ───────────────────────────────────────────

interface ReadingPassage {
  title: string
  text: string
  questions: DuelQuestionData[]
}

const READING_A1: ReadingPassage[] = [
  {
    title: "Akmal's Day",
    text: "Akmal is a student from Tashkent. He wakes up at 7 o'clock every morning. He eats breakfast with his family. His mother makes fresh bread and tea. After breakfast, he goes to university. His classes start at 9 AM and finish at 2 PM. In the evening, he does his homework. On Fridays, he visits his grandmother. She always cooks plov for him.",
    questions: [
      { id: 1, english: "What time does Akmal wake up?", options: ["6 AM", "7 AM", "8 AM", "9 AM"], correct: 1 },
      { id: 2, english: "What does his mother make?", options: ["Plov", "Bread and tea", "Eggs", "Pancakes"], correct: 1 },
      { id: 3, english: "Where does Akmal go after breakfast?", options: ["Park", "University", "Market", "Library"], correct: 1 },
      { id: 4, english: "When do his classes finish?", options: ["12 PM", "1 PM", "2 PM", "3 PM"], correct: 2 },
    ],
  },
  {
    title: "My Family",
    text: "I live with my family in a small house. There are four people in my family: my mother, my father, my sister, and me. My father is a doctor. He works at a hospital. My mother is a teacher. She works at a school. My sister is a student. She studies English. I am a student too. We eat dinner together every evening.",
    questions: [
      { id: 1, english: "How many people are in the family?", options: ["Three", "Four", "Five", "Six"], correct: 1 },
      { id: 2, english: "What does the father do?", options: ["Teacher", "Doctor", "Engineer", "Student"], correct: 1 },
      { id: 3, english: "Where does the mother work?", options: ["Hospital", "School", "Bank", "Market"], correct: 1 },
      { id: 4, english: "What does the sister study?", options: ["Maths", "English", "History", "Science"], correct: 1 },
    ],
  },
]

const READING_A2: ReadingPassage[] = [
  {
    title: "A Trip to Khiva",
    text: "Last summer, my family visited Khiva. We travelled by train from Tashkent. The journey took about 12 hours. We arrived early in the morning. The weather was hot and sunny. We walked through the old town and saw the famous Ichon-Qala fortress. My father bought some traditional souvenirs. In the evening, we ate plov at a traditional restaurant. The next day, we visited museums. We stayed for three days. It was the best trip of my life!",
    questions: [
      { id: 1, english: "How did they travel to Khiva?", options: ["By car", "By train", "By bus", "By plane"], correct: 1 },
      { id: 2, english: "How long did the journey take?", options: ["6 hours", "10 hours", "12 hours", "24 hours"], correct: 2 },
      { id: 3, english: "What did they see in the old town?", options: ["A museum", "Ichon-Qala fortress", "A market", "A restaurant"], correct: 1 },
      { id: 4, english: "How long did they stay?", options: ["One day", "Two days", "Three days", "A week"], correct: 2 },
    ],
  },
  {
    title: "Weekend Plans",
    text: "Sevara has big plans for this weekend. On Saturday morning, she is going to clean her room. In the afternoon, she will meet her friend Malika at the park. They are going to walk and talk. On Sunday, she will visit her grandmother in the village. She will take some fresh fruit for her. In the evening, she will come back home and study for her exam. She wants to get a good grade.",
    questions: [
      { id: 1, english: "What is Sevara going to do on Saturday morning?", options: ["Visit grandmother", "Clean her room", "Study", "Go shopping"], correct: 1 },
      { id: 2, english: "Where will she meet Malika?", options: ["At school", "At the park", "At a cafe", "At home"], correct: 1 },
      { id: 3, english: "What will she take to her grandmother?", options: ["Flowers", "Books", "Fruit", "Clothes"], correct: 2 },
      { id: 4, english: "What will she do on Sunday evening?", options: ["Watch TV", "Study", "Cook dinner", "Visit friends"], correct: 1 },
    ],
  },
  {
    title: "Tashkent vs Samarkand",
    text: "Tashkent is bigger than Samarkand, but Samarkand is older. Tashkent has about 3 million people while Samarkand has about 800,000. Samarkand is more beautiful because of its history. Registan Square is one of the most beautiful places in the world. Tashkent has more modern buildings and the biggest subway system. But the food in Samarkand is more delicious. Samarkand has the best plov in the whole country!",
    questions: [
      { id: 1, english: "Which city is bigger?", options: ["Samarkand", "Tashkent", "Both same", "Not mentioned"], correct: 1 },
      { id: 2, english: "Which city is older?", options: ["Samarkand", "Tashkent", "Both same", "Neither"], correct: 0 },
      { id: 3, english: "What does Tashkent have that's biggest?", options: ["Park", "Subway system", "Airport", "Market"], correct: 1 },
      { id: 4, english: "Where is the best plov?", options: ["Tashkent", "Bukhara", "Samarkand", "Khiva"], correct: 2 },
    ],
  },
]

const READING_B1: ReadingPassage[] = [
  {
    title: "Learning English Journey",
    text: "Aziz has been learning English for three years. He started with basic grammar and vocabulary. Now, he can hold conversations on everyday topics. Last month, he passed his B1 exam with a high score. He studies every evening for at least an hour. His teacher says his speaking is improving quickly. Aziz also watches English films with subtitles. He finds it helpful for learning new words. His dream is to study abroad next year. He has already started looking at universities in the UK. He knows it will be expensive, but he is saving money. His family supports him a lot.",
    questions: [
      { id: 1, english: "How long has Aziz been learning English?", options: ["One year", "Two years", "Three years", "Five years"], correct: 2 },
      { id: 2, english: "What exam did he pass last month?", options: ["A2", "B1", "B2", "IELTS"], correct: 1 },
      { id: 3, english: "How does Aziz watch English films?", options: ["With dubbing", "With subtitles", "Without help", "With a friend"], correct: 1 },
      { id: 4, english: "What is Aziz's dream?", options: ["Visit the UK", "Study abroad", "Teach English", "Write a book"], correct: 1 },
    ],
  },
  {
    title: "Technology in Education",
    text: "Technology is changing how students learn in Uzbekistan. Many schools now use tablets and computers in classrooms. Students can access online materials and watch educational videos. Teachers use interactive whiteboards to explain difficult topics. Online platforms like this one help students practise at home. However, not all students have internet access at home. The government is working to fix this problem. They plan to provide free Wi-Fi in all schools by 2025. Experts believe technology will make education more accessible for everyone.",
    questions: [
      { id: 1, english: "What technology do many schools use?", options: ["Phones", "Tablets", "TVs", "Radios"], correct: 1 },
      { id: 2, english: "What helps students practise at home?", options: ["Books", "Online platforms", "Teachers", "Friends"], correct: 1 },
      { id: 3, english: "What problem still exists?", options: ["Not enough teachers", "No internet at home", "Expensive schools", "Old buildings"], correct: 1 },
      { id: 4, english: "When will all schools have free Wi-Fi?", options: ["2023", "2024", "2025", "2030"], correct: 2 },
    ],
  },
  {
    title: "Healthy Habits",
    text: "Dr. Karimov says many people in Uzbekistan need to improve their health habits. He recommends eating more fruits and vegetables and less bread and meat. Regular exercise is also important. Walking for 30 minutes every day can make a big difference. Sleeping 7-8 hours each night helps the body recover. Drinks like green tea are good for health. He warns that too much sugar causes problems. Many people now follow his advice. They feel more energetic and healthier. Small changes in daily routine lead to big improvements over time.",
    questions: [
      { id: 1, english: "What does Dr. Karimov recommend eating less of?", options: ["Fruits", "Bread and meat", "Vegetables", "Fish"], correct: 1 },
      { id: 2, english: "How many minutes of walking does he suggest?", options: ["15", "20", "30", "60"], correct: 2 },
      { id: 3, english: "How many hours of sleep does he recommend?", options: ["5-6", "6-7", "7-8", "8-9"], correct: 2 },
      { id: 4, english: "What drink does he say is good for health?", options: ["Black tea", "Green tea", "Coffee", "Juice"], correct: 1 },
    ],
  },
]

const READING_B2: ReadingPassage[] = [
  {
    title: "The Aral Sea Crisis",
    text: "The Aral Sea was once the fourth-largest lake in the world. However, due to irrigation projects in the 1960s, it has shrunk dramatically. The water was diverted to grow cotton in the desert. What remains is only about 10% of its original size. This ecological disaster has had severe consequences. Fishing communities lost their livelihoods. The climate became more extreme, with hotter summers and colder winters. Dust storms carry salt from the dry seabed, affecting people's health. In recent years, efforts have been made to restore parts of the sea. A dam built in Kazakhstan has helped the northern part recover. However, the southern part remains mostly dry. The Uzbek government is working with international organisations to find solutions.",
    questions: [
      { id: 1, english: "What caused the Aral Sea to shrink?", options: ["Climate change", "Irrigation projects", "Earthquakes", "Pollution"], correct: 1 },
      { id: 2, english: "What percentage of the sea remains?", options: ["5%", "10%", "25%", "50%"], correct: 1 },
      { id: 3, english: "What helped the northern part recover?", options: ["A dam", "Rainfall", "New rivers", "Technology"], correct: 0 },
      { id: 4, english: "What do dust storms from the dry seabed affect?", options: ["Buildings", "Transport", "People's health", "Animals only"], correct: 2 },
    ],
  },
  {
    title: "The Silk Road Legacy",
    text: "The Great Silk Road was not a single road but a network of trade routes connecting East and West. It stretched from China through Central Asia to the Mediterranean. For over 1,500 years, caravans carried silk, spices, and ideas along these routes. Samarkand and Bukhara became prosperous cities because of their location on the Silk Road. Scholars, artists, and scientists travelled together with merchants. This exchange of knowledge led to advances in mathematics, astronomy, and medicine. Today, Uzbekistan is reviving this heritage through tourism and cultural projects. Visitors can explore ancient madrasas and mosques that have stood for centuries. The Silk Road's spirit of exchange continues in modern forms.",
    questions: [
      { id: 1, english: "What was the Silk Road?", options: ["A single road", "A network of routes", "A sea route", "A railway"], correct: 1 },
      { id: 2, english: "How long was the Silk Road used?", options: ["500 years", "1,000 years", "1,500 years", "2,000 years"], correct: 2 },
      { id: 3, english: "Why did Samarkand become prosperous?", options: ["Gold mines", "Silk Road location", "Oil discovery", "Good climate"], correct: 1 },
      { id: 4, english: "What did scholars and scientists exchange?", options: ["Goods only", "Knowledge", "Money", "Technology"], correct: 1 },
    ],
  },
  {
    title: "The Future of Work",
    text: "The way people work is changing faster than ever before. Remote work, which became common during the pandemic, is now a permanent option for many. Technology allows people to work from anywhere with an internet connection. Artificial intelligence is automating routine tasks, freeing humans for creative work. However, this also means workers need to learn new skills. Experts predict that by 2030, 50% of today's jobs will require different skills. Lifelong learning is no longer optional — it's essential. Young people in Uzbekistan should focus on digital skills, critical thinking, and languages. The future belongs to those who can adapt and learn continuously.",
    questions: [
      { id: 1, english: "What became a permanent option for many workers?", options: ["Part-time work", "Remote work", "Night shifts", "Office work"], correct: 1 },
      { id: 2, english: "What is AI automating?", options: ["Creative work", "Routine tasks", "Management", "Teaching"], correct: 1 },
      { id: 3, english: "What percentage of jobs will need different skills by 2030?", options: ["25%", "40%", "50%", "75%"], correct: 2 },
      { id: 4, english: "What skill is NOT mentioned as important for the future?", options: ["Digital skills", "Critical thinking", "Languages", "Manual labour"], correct: 3 },
    ],
  },
]

// ─── Level-based data map ───────────────────────────────────────────────────

type LevelKey = 'A1' | 'A2' | 'B1' | 'B2'

const GRAMMAR_BY_LEVEL: Record<LevelKey, DuelQuestionData[]> = {
  A1: GRAMMAR_A1,
  A2: GRAMMAR_A2,
  B1: GRAMMAR_B1,
  B2: GRAMMAR_B2,
}

const READING_BY_LEVEL: Record<LevelKey, ReadingPassage[]> = {
  A1: READING_A1,
  A2: READING_A2,
  B1: READING_B1,
  B2: READING_B2,
}

// ─── Shuffle helper ────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── SPEAKING PROMPTS ──────────────────────────────────────────────────────

interface SpeakingPrompt {
  prompt: string
  tips: string[]
}

const SPEAKING_ALL: SpeakingPrompt[] = [
  { prompt: "Describe your daily routine. What time do you wake up? What do you do during the day?",
    tips: ["Use present simple tense", "Talk about morning, afternoon, evening", "Include time expressions like 'always', 'usually'"] },
  { prompt: "Tell me about your family. Who are the members of your family? What do they do?",
    tips: ["Describe each family member", "Use 'he/she is a...' for jobs", "Talk about their hobbies"] },
  { prompt: "Describe your favorite place in Tashkent. Why do you like it? When do you go there?",
    tips: ["Use adjectives like 'beautiful', 'big', 'quiet'", "Explain why you like it", "Say how often you visit"] },
  { prompt: "Talk about your hobbies. What do you do in your free time? How long have you been doing it?",
    tips: ["Use present simple and present perfect", "Explain why you enjoy it", "Mention how often you do it"] },
  { prompt: "Describe a traditional Uzbek dish. How is it made? When do people eat it?",
    tips: ["Describe the ingredients", "Explain the cooking process", "Talk about special occasions"] },
  { prompt: "What are your plans for the future? Where do you see yourself in 5 years?",
    tips: ["Use 'will' and 'going to'", "Talk about career, education, family", "Be specific about your goals"] },
  { prompt: "Tell me about a memorable trip you took. Where did you go? What did you see and do?",
    tips: ["Use past simple tense", "Describe the place and people", "Explain why it was memorable"] },
  { prompt: "What is the biggest challenge in learning English? How do you overcome it?",
    tips: ["Be honest about difficulties", "Talk about your learning methods", "Give examples of progress"] },
  { prompt: "Describe your ideal job. What would you do? Where would you work? Why?",
    tips: ["Use conditional 'would'", "Describe responsibilities", "Explain your motivation"] },
  { prompt: "What is the most important technology in your life? How has it changed your daily routine?",
    tips: ["Compare before and after", "Give specific examples", "Talk about both benefits and drawbacks"] },
  { prompt: "Describe a festival or celebration in Uzbekistan. What happens? What do people wear and eat?",
    tips: ["Describe the atmosphere", "Use present simple for traditions", "Mention special foods and customs"] },
  { prompt: "If you could visit any country in the world, where would you go and why?",
    tips: ["Use conditional 'would'", "Research and mention specific places", "Explain cultural interests"] },
]

/** Speaking promptni tasodifiy qaytaradi */
export function getSpeakingPrompt(): SpeakingPrompt {
  return SPEAKING_ALL[Math.floor(Math.random() * SPEAKING_ALL.length)]
}

// ─── Public API ─────────────────────────────────────────────────────────────

/** Grammar savollarini level bo'yicha qaytaradi (aralashtirilgan) */
export function getGrammarQuestions(level: LevelKey, count: number = 10): DuelQuestionData[] {
  const pool = GRAMMAR_BY_LEVEL[level] ?? GRAMMAR_B1
  return shuffleArray(pool).slice(0, Math.min(count, pool.length))
}

/** Reading savollarini level bo'yicha qaytaradi (tasodifiy passage + questions) */
export function getReadingQuestions(level: LevelKey, count: number = 4): { passage: string; questions: DuelQuestionData[] } {
  const pool = READING_BY_LEVEL[level] ?? READING_B1
  const selected = pool[Math.floor(Math.random() * pool.length)]
  return {
    passage: selected.text,
    questions: shuffleArray(selected.questions).slice(0, Math.min(count, selected.questions.length)),
  }
}
