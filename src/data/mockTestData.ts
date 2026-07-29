// Mock test question banks — A1 (20 Qs), A2, B1, B2
// Sections: grammar + vocabulary + reading per level

export interface TQ {
  id:       number
  level:    'A1' | 'A2' | 'B1' | 'B2'
  section:  'grammar' | 'vocabulary' | 'reading'
  passage?: string   // displayed above the question for reading Qs
  q:        string
  opts:     [string, string, string, string]
  ans:      number   // 0 = A, 1 = B, 2 = C, 3 = D
}

// ── A1 Questions ──────────────────────────────────────────────────────────────

export const A1_QUESTIONS: TQ[] = [
  // ── Grammar (7) ────────────────────────────────────────────────────────────
  { id:401, level:'A1', section:'grammar', q:'I ___ a student.',
    opts:['am','is','are','be'], ans:0 },
  { id:402, level:'A1', section:'grammar', q:'She ___ two brothers.',
    opts:['have','has','having','had'], ans:1 },
  { id:403, level:'A1', section:'grammar', q:'They ___ swim very well.',
    opts:['can','is','are','have'], ans:0 },
  { id:404, level:'A1', section:'grammar', q:'___ is your name?',
    opts:['What','Where','When','Who'], ans:0 },
  { id:405, level:'A1', section:'grammar', q:'This is ___ book. (near)',
    opts:['this','that','these','those'], ans:0 },
  { id:406, level:'A1', section:'grammar', q:'The cat is ___ the table.',
    opts:['in','on','at','to'], ans:1 },
  { id:407, level:'A1', section:'grammar', q:'He ___ coffee every morning.',
    opts:['drink','drinks','drinking','drank'], ans:1 },
  // ── Vocabulary (7) ─────────────────────────────────────────────────────────
  { id:408, level:'A1', section:'vocabulary', q:'Which word means "katta" in English?',
    opts:['small','big','tall','short'], ans:1 },
  { id:409, level:'A1', section:'vocabulary', q:'Which word means "chiroyli" in English?',
    opts:['ugly','beautiful','dark','quick'], ans:1 },
  { id:410, level:'A1', section:'vocabulary', q:"Your mother's mother is your ___.",
    opts:['aunt','grandmother','sister','cousin'], ans:1 },
  { id:411, level:'A1', section:'vocabulary', q:'Which is a fruit?',
    opts:['carrot','potato','apple','onion'], ans:2 },
  { id:412, level:'A1', section:'vocabulary', q:'The opposite of "big" is:',
    opts:['tall','small','long','wide'], ans:1 },
  { id:413, level:'A1', section:'vocabulary', q:'Which word means "tez" in English?',
    opts:['slow','fast','heavy','light'], ans:1 },
  { id:414, level:'A1', section:'vocabulary', q:'What do you drink in the morning?',
    opts:['bread','water','rice','meat'], ans:1 },
  // ── Reading (6 — 3 passages × 2 Qs) ───────────────────────────────────────
  { id:415, level:'A1', section:'reading',
    passage:'Hello! My name is Ali. I am from Uzbekistan. I am ten years old. I have one sister. Her name is Malika. She is seven.',
    q:'How old is Ali?',
    opts:['seven','ten','eight','twelve'], ans:1 },
  { id:416, level:'A1', section:'reading',
    passage:'Hello! My name is Ali. I am from Uzbekistan. I am ten years old. I have one sister. Her name is Malika. She is seven.',
    q:'Who is Malika?',
    opts:['His mother','His friend','His sister','His teacher'], ans:2 },
  { id:417, level:'A1', section:'reading',
    passage:'Tom has a small dog. The dog is black and white. Every morning Tom walks his dog in the park. The dog loves to run.',
    q:'What colour is the dog?',
    opts:['Brown','Black and white','Yellow','Grey'], ans:1 },
  { id:418, level:'A1', section:'reading',
    passage:'Tom has a small dog. The dog is black and white. Every morning Tom walks his dog in the park. The dog loves to run.',
    q:'Where do they go every morning?',
    opts:['School','The park','The shop','Home'], ans:1 },
  { id:419, level:'A1', section:'reading',
    passage:'Today is Monday. Sara is at school. She has English, math, and science. Her favourite subject is English because the teacher is very kind.',
    q:'What is Sara\'s favourite subject?',
    opts:['Math','Science','English','History'], ans:2 },
  { id:420, level:'A1', section:'reading',
    passage:'Today is Monday. Sara is at school. She has English, math, and science. Her favourite subject is English because the teacher is very kind.',
    q:'Why does Sara like this subject?',
    opts:['It is easy','The teacher is kind','Her friends are there','It is fun'], ans:1 },
]

// ── B1 Questions ──────────────────────────────────────────────────────────────

export const B1_QUESTIONS: TQ[] = [
  // ── Grammar ──────────────────────────────────────────────────────────────
  { id:1,  level:'B1', section:'grammar', q:'She ___ that film twice already.',
    opts:['saw','has seen','was seeing','have seen'], ans:1 },

  { id:2,  level:'B1', section:'grammar', q:'If I ___ you, I would apologize immediately.',
    opts:['am','was','were','had been'], ans:2 },

  { id:3,  level:'B1', section:'grammar', q:'The report ___ by the manager last night.',
    opts:['wrote','was written','has written','writes'], ans:1 },

  { id:4,  level:'B1', section:'grammar', q:'You ___ smoke here. It is strictly forbidden.',
    opts:["mustn't","don't have to","shouldn't","couldn't"], ans:0 },

  { id:5,  level:'B1', section:'grammar', q:'He said that he ___ very tired after the meeting.',
    opts:['is','was','has been','will be'], ans:1 },

  { id:6,  level:'B1', section:'grammar', q:'The woman ___ helped me was a local doctor.',
    opts:['which','what','who','whom'], ans:2 },

  { id:7,  level:'B1', section:'grammar', q:"She doesn't mind ___ overtime occasionally.",
    opts:['to work','working','work','worked'], ans:1 },

  { id:8,  level:'B1', section:'grammar', q:'This exercise is ___ than the last one.',
    opts:['more easy','easier','most easy','easiest'], ans:1 },

  { id:9,  level:'B1', section:'grammar', q:'___ Nile is the longest river in the world.',
    opts:['A','An','The','—'], ans:2 },

  { id:10, level:'B1', section:'grammar', q:'She has worked in this company ___ 2019.',
    opts:['for','since','during','in'], ans:1 },

  { id:11, level:'B1', section:'grammar', q:'When I arrived at the cinema, the film ___ already.',
    opts:['started','has started','had started','starts'], ans:2 },

  { id:12, level:'B1', section:'grammar', q:'You ___ bring a gift — it\'s not necessary.',
    opts:["mustn't","couldn't","don't have to","shouldn't"], ans:2 },

  { id:13, level:'B1', section:'grammar', q:'I wish I ___ taller — I can never reach the top shelf.',
    opts:['am','was','were','will be'], ans:2 },

  { id:14, level:'B1', section:'grammar', q:'Neither of the answers ___ correct, unfortunately.',
    opts:['are','were','is','have been'], ans:2 },

  { id:15, level:'B1', section:'grammar', q:'She asked me if I ___ help her move the furniture.',
    opts:['can','could','will','shall'], ans:1 },

  // ── Vocabulary ────────────────────────────────────────────────────────────
  { id:16, level:'B1', section:'vocabulary', q:"She was very ___ of her son's achievements at school.",
    opts:['proud','jealous','curious','satisfied'], ans:0 },

  { id:17, level:'B1', section:'vocabulary', q:'Choose the word closest in meaning to "sufficient":',
    opts:['enough','extra','scarce','excessive'], ans:0 },

  { id:18, level:'B1', section:'vocabulary', q:"'Don't give ___ — the exam is almost finished!'",
    opts:['in','up','out','off'], ans:1 },

  { id:19, level:'B1', section:'vocabulary', q:'The lecture was so boring that I found it hard to ___.',
    opts:['concentrate','relax','manage','improve'], ans:0 },

  { id:20, level:'B1', section:'vocabulary', q:'He works extremely hard in order to ___ his goals.',
    opts:['make','do','achieve','perform'], ans:2 },

  { id:21, level:'B1', section:'vocabulary', q:"She's very ___; she always sees the positive side of things.",
    opts:['pessimistic','optimistic','realistic','cynical'], ans:1 },

  { id:22, level:'B1', section:'vocabulary', q:'We need to ___ a decision before the end of the week.',
    opts:['do','make','take','have'], ans:1 },

  { id:23, level:'B1', section:'vocabulary', q:'There was no ___ for his rude behaviour at the meeting.',
    opts:['excuse','reason','cause','purpose'], ans:0 },

  { id:24, level:'B1', section:'vocabulary', q:'The opposite of "expand" is:',
    opts:['grow','shrink','extend','develop'], ans:1 },

  { id:25, level:'B1', section:'vocabulary', q:'She ___ to arrive early, but the traffic was terrible.',
    opts:['managed','succeeded','attempted','achieved'], ans:2 },

  // ── Reading ───────────────────────────────────────────────────────────────
  { id:26, level:'B1', section:'reading',
    passage:'Every year, millions of tourists visit Rome to see its historic monuments. The city offers a unique combination of past and present — modern restaurants sit beside 2,000-year-old ruins. However, the large number of visitors is causing damage to some famous sites.',
    q:'Why do tourists visit Rome, according to the text?',
    opts:['For modern restaurants','To see historic sites','For ancient technology','To learn Italian'], ans:1 },

  { id:27, level:'B1', section:'reading',
    passage:'Every year, millions of tourists visit Rome to see its historic monuments. The city offers a unique combination of past and present — modern restaurants sit beside 2,000-year-old ruins. However, the large number of visitors is causing damage to some famous sites.',
    q:'What problem is mentioned in the text?',
    opts:['Lack of restaurants','Tourism is declining','Damage to historic sites','Poor public transport'], ans:2 },

  { id:28, level:'B1', section:'reading',
    passage:'Remote working has become increasingly popular in recent years. Many employees report feeling more productive at home due to fewer distractions and no commute. However, some companies worry that employees may feel isolated and miss the social benefits of office life.',
    q:'Why do employees feel more productive at home?',
    opts:['Better salaries','Fewer distractions','Longer hours','Better equipment'], ans:1 },

  { id:29, level:'B1', section:'reading',
    passage:'Remote working has become increasingly popular in recent years. Many employees report feeling more productive at home due to fewer distractions and no commute. However, some companies worry that employees may feel isolated and miss the social benefits of office life.',
    q:'What concern do some companies have about remote working?',
    opts:['Higher costs','Employee isolation','Reduced hours','Lower productivity'], ans:1 },

  { id:30, level:'B1', section:'reading',
    passage:'Remote working has become increasingly popular in recent years. Many employees report feeling more productive at home due to fewer distractions and no commute. However, some companies worry that employees may feel isolated and miss the social benefits of office life.',
    q:'The word "commute" in this context means:',
    opts:['holiday','regular travel to work','break time','social interaction'], ans:1 },

  // ── Grammar (B1+) ─────────────────────────────────────────────────
  { id:91, level:'B1', section:'grammar',
    q:'If I had studied harder, I ___ the exam.',
    opts:['would pass','would have passed','had passed','passed'], ans:1 },

  { id:92, level:'B1', section:'grammar',
    q:"She wouldn't have missed the train if she ___ earlier.",
    opts:['left','had left','would leave','has left'], ans:1 },

  { id:93, level:'B1', section:'grammar',
    q:'If they had arrived on time, they ___ the opening speech.',
    opts:['would hear','heard','would have heard','had heard'], ans:2 },

  { id:94, level:'B1', section:'grammar',
    q:'If I had taken that job, I ___ in a different city now.',
    opts:['would be','would have been','will be','had been'], ans:0 },

  { id:95, level:'B1', section:'grammar',
    q:'She ___ more confident today if she had prepared better.',
    opts:['would have been','would be','will be','was'], ans:1 },

  { id:96, level:'B1', section:'grammar',
    q:"If he weren't so talented, he ___ the job last week.",
    opts:["wouldn't have got","won't get","didn't get","wouldn't get"], ans:0 },

  { id:97, level:'B1', section:'grammar',
    q:'I wish I ___ more time to finish the project yesterday.',
    opts:['had','had had','have','would have'], ans:1 },

  { id:98, level:'B1', section:'grammar',
    q:"If only she ___ to my advice last year.",
    opts:['listened','had listened','would listen','listens'], ans:1 },

  { id:99, level:'B1', section:'grammar',
    q:'I wish it ___ raining so I could go for a walk.',
    opts:['stops','would stop','stopped','had stopped'], ans:1 },

  { id:100, level:'B1', section:'grammar',
    q:"Nobody answers her phone. She ___ forgotten about our meeting.",
    opts:['must have','should have','could have','would have'], ans:0 },

  { id:101, level:'B1', section:'grammar',
    q:"You ___ me earlier. I was waiting for your call.",
    opts:['must have called','should have called','could have called','would have called'], ans:1 },

  { id:102, level:'B1', section:'grammar',
    q:"Why did you walk? You ___ taken my car.",
    opts:['must have','should have','could have','would have'], ans:2 },

  { id:103, level:'B1', section:'grammar',
    q:"He ___ finished the report already. I only sent it five minutes ago.",
    opts:["must have","can't have","should have","could have"], ans:1 },

  { id:104, level:'B1', section:'grammar',
    q:"We brought our umbrellas but it didn't rain. We ___ brought them.",
    opts:["must have","should have","needn't have","couldn't have"], ans:2 },

  { id:105, level:'B1', section:'grammar',
    q:"I'm not certain, but she ___ caught an earlier flight.",
    opts:["must have","might have","should have","can't have"], ans:1 },

  // ── Vocabulary (B1+) ─────────────────────────────────────────────
  { id:106, level:'B1', section:'vocabulary',
    q:"Could you ___ me a favour and open the window?",
    opts:['make','do','take','have'], ans:1 },

  { id:107, level:'B1', section:'vocabulary',
    q:'I need to ___ a decision by tomorrow.',
    opts:['do','make','take','have'], ans:1 },

  { id:108, level:'B1', section:'vocabulary',
    q:'She ___ a lot of effort to learn the language.',
    opts:['did','made','took','had'], ans:1 },

  { id:109, level:'B1', section:'vocabulary',
    q:"He couldn't ___ up with the constant noise from the construction site.",
    opts:['take','stand','put','give'], ans:2 },

  { id:110, level:'B1', section:'vocabulary',
    q:'We need to ___ out where the problem is coming from.',
    opts:['figure','look','find','turn'], ans:0 },

  { id:111, level:'B1', section:'vocabulary',
    q:'She ___ up a new hobby during the lockdown.',
    opts:['took','gave','made','set'], ans:0 },

  { id:112, level:'B1', section:'vocabulary',
    q:"The project is behind schedule, but we're ___ our best to catch up.",
    opts:['making','giving','doing','taking'], ans:2 },

  { id:113, level:'B1', section:'vocabulary',
    q:'He decided to ___ down the job offer because the salary was too low.',
    opts:['turn','take','put','get'], ans:0 },

  { id:114, level:'B1', section:'vocabulary',
    q:'Don\'t ___ the risk of losing your passport when travelling abroad.',
    opts:['make','take','have','do'], ans:1 },

  { id:115, level:'B1', section:'vocabulary',
    q:'She managed to ___ both ends meet on a very tight budget.',
    opts:['put','make','get','take'], ans:1 },

  // ── Reading (B1+) ────────────────────────────────────────────────
  { id:116, level:'B1', section:'reading',
    passage:"In the past two decades, technology has dramatically transformed the way we communicate with one another. Social media platforms such as Facebook, Instagram, and Twitter have made it possible to stay in touch with friends and family across the globe instantly. Messaging apps like WhatsApp and Telegram have largely replaced traditional SMS text messages, offering free communication over the internet. Video calling services such as Zoom and Skype have become essential tools for both personal conversations and professional meetings, especially since the pandemic began. However, these advances have not come without drawbacks. Critics argue that relying too heavily on digital communication can reduce face-to-face interaction, weakening social bonds. Many people report feeling more isolated despite being more connected than ever before. The pressure to respond immediately to messages can also lead to increased anxiety. Nevertheless, few would disagree that technology has made communication faster, more accessible, and more convenient — even if it comes with new challenges.",
    q:'According to the passage, what has social media made possible?',
    opts:['Replacing emails entirely','Staying in touch instantly across the globe','Eliminating phone calls','Reducing the cost of phones'], ans:1 },

  { id:117, level:'B1', section:'reading',
    passage:"In the past two decades, technology has dramatically transformed the way we communicate with one another. Social media platforms such as Facebook, Instagram, and Twitter have made it possible to stay in touch with friends and family across the globe instantly. Messaging apps like WhatsApp and Telegram have largely replaced traditional SMS text messages, offering free communication over the internet. Video calling services such as Zoom and Skype have become essential tools for both personal conversations and professional meetings, especially since the pandemic began. However, these advances have not come without drawbacks. Critics argue that relying too heavily on digital communication can reduce face-to-face interaction, weakening social bonds. Many people report feeling more isolated despite being more connected than ever before. The pressure to respond immediately to messages can also lead to increased anxiety. Nevertheless, few would disagree that technology has made communication faster, more accessible, and more convenient — even if it comes with new challenges.",
    q:'What does the passage say about messaging apps like WhatsApp?',
    opts:['They are only used for work','They have replaced traditional SMS','They require a paid subscription','They are less popular than phone calls'], ans:1 },

  { id:118, level:'B1', section:'reading',
    passage:"In the past two decades, technology has dramatically transformed the way we communicate with one another. Social media platforms such as Facebook, Instagram, and Twitter have made it possible to stay in touch with friends and family across the globe instantly. Messaging apps like WhatsApp and Telegram have largely replaced traditional SMS text messages, offering free communication over the internet. Video calling services such as Zoom and Skype have become essential tools for both personal conversations and professional meetings, especially since the pandemic began. However, these advances have not come without drawbacks. Critics argue that relying too heavily on digital communication can reduce face-to-face interaction, weakening social bonds. Many people report feeling more isolated despite being more connected than ever before. The pressure to respond immediately to messages can also lead to increased anxiety. Nevertheless, few would disagree that technology has made communication faster, more accessible, and more convenient — even if it comes with new challenges.",
    q:'What negative effect of digital communication is mentioned?',
    opts:['It is too expensive','It reduces face-to-face interaction','It is difficult to learn','It requires special equipment'], ans:1 },

  { id:119, level:'B1', section:'reading',
    passage:"In the past two decades, technology has dramatically transformed the way we communicate with one another. Social media platforms such as Facebook, Instagram, and Twitter have made it possible to stay in touch with friends and family across the globe instantly. Messaging apps like WhatsApp and Telegram have largely replaced traditional SMS text messages, offering free communication over the internet. Video calling services such as Zoom and Skype have become essential tools for both personal conversations and professional meetings, especially since the pandemic began. However, these advances have not come without drawbacks. Critics argue that relying too heavily on digital communication can reduce face-to-face interaction, weakening social bonds. Many people report feeling more isolated despite being more connected than ever before. The pressure to respond immediately to messages can also lead to increased anxiety. Nevertheless, few would disagree that technology has made communication faster, more accessible, and more convenient — even if it comes with new challenges.",
    q:'According to critics, what can result from relying too heavily on digital communication?',
    opts:['Stronger relationships','Weakened social bonds','Faster decision-making','Better productivity'], ans:1 },

  { id:120, level:'B1', section:'reading',
    passage:"In the past two decades, technology has dramatically transformed the way we communicate with one another. Social media platforms such as Facebook, Instagram, and Twitter have made it possible to stay in touch with friends and family across the globe instantly. Messaging apps like WhatsApp and Telegram have largely replaced traditional SMS text messages, offering free communication over the internet. Video calling services such as Zoom and Skype have become essential tools for both personal conversations and professional meetings, especially since the pandemic began. However, these advances have not come without drawbacks. Critics argue that relying too heavily on digital communication can reduce face-to-face interaction, weakening social bonds. Many people report feeling more isolated despite being more connected than ever before. The pressure to respond immediately to messages can also lead to increased anxiety. Nevertheless, few would disagree that technology has made communication faster, more accessible, and more convenient — even if it comes with new challenges.",
    q:'The word "isolated" in the passage most closely means:',
    opts:['connected','alone','busy','relaxed'], ans:1 },

  // ── B1 Additional Grammar (15) ────────────────────────────────────
  { id:151, level:'B1', section:'grammar',
    q:'She suggested that we ___ to the park for a picnic.',
    opts:['go','went','going','to go'], ans:0 },

  { id:152, level:'B1', section:'grammar',
    q:'The more you practise, the ___ you become.',
    opts:['better','best','good','well'], ans:0 },

  { id:153, level:'B1', section:'grammar',
    q:"He told me that he ___ never been to Japan before.",
    opts:['has','had','have','was'], ans:1 },

  { id:154, level:'B1', section:'grammar',
    q:'By the time we arrived, everyone ___ already left.',
    opts:['has','had','have','was'], ans:1 },

  { id:155, level:'B1', section:'grammar',
    q:'This is the book ___ I was telling you about.',
    opts:['which','that','what','who'], ans:1 },

  { id:156, level:'B1', section:'grammar',
    q:"She doesn't have ___ money to buy a car right now.",
    opts:['enough','many','much','few'], ans:0 },

  { id:157, level:'B1', section:'grammar',
    q:'We are looking forward ___ you at the party.',
    opts:['to see','seeing','to seeing','see'], ans:2 },

  { id:158, level:'B1', section:'grammar',
    q:'I have been studying English ___ three years.',
    opts:['since','for','during','from'], ans:1 },

  { id:159, level:'B1', section:'grammar',
    q:'He used to ___ up early when he was a child.',
    opts:['wake','waking','woke','wakes'], ans:0 },

  { id:160, level:'B1', section:'grammar',
    q:'The children were made ___ their rooms before going out.',
    opts:['clean','cleaning','to clean','cleaned'], ans:2 },

  { id:161, level:'B1', section:'grammar',
    q:'Is there ___ I can help you with?',
    opts:['something','anything','nothing','everything'], ans:1 },

  { id:162, level:'B1', section:'grammar',
    q:'She prefers ___ coffee rather than tea in the morning.',
    opts:['to drink','drinking','drink','drunk'], ans:1 },

  { id:163, level:'B1', section:'grammar',
    q:'I\'d rather you ___ tell anyone about this.',
    opts:["don't","didn't","wouldn't","won't"], ans:1 },

  { id:164, level:'B1', section:'grammar',
    q:'Hardly ___ finished dinner when the doorbell rang.',
    opts:['they had','had they','they have','have they'], ans:1 },

  { id:165, level:'B1', section:'grammar',
    q:'You look tired. You ___ been working too hard.',
    opts:['must have','should have','could have','would have'], ans:0 },

  // ── B1 Additional Vocabulary (10) ────────────────────────────────
  { id:166, level:'B1', section:'vocabulary',
    q:'He ___ a lot of progress in his English studies this year.',
    opts:['did','made','took','got'], ans:1 },

  { id:167, level:'B1', section:'vocabulary',
    q:"I can't ___ the difference between these two words.",
    opts:['say','tell','speak','talk'], ans:1 },

  { id:168, level:'B1', section:'vocabulary',
    q:'She ___ a good impression on her first day at work.',
    opts:['did','made','took','gave'], ans:1 },

  { id:169, level:'B1', section:'vocabulary',
    q:'The company is looking for ways to ___ costs.',
    opts:['reduce','lower','cut','decrease'], ans:2 },

  { id:170, level:'B1', section:'vocabulary',
    q:'We need to come ___ with a solution to this problem.',
    opts:['up','out','in','over'], ans:0 },

  { id:171, level:'B1', section:'vocabulary',
    q:'The opposite of "temporary" is:',
    opts:['permanent','brief','short','momentary'], ans:0 },

  { id:172, level:'B1', section:'vocabulary',
    q:'She was ___ $100 for speeding by the police.',
    opts:['charged','fined','paid','cost'], ans:1 },

  { id:173, level:'B1', section:'vocabulary',
    q:'The manager asked us to ___ our work before the deadline.',
    opts:['complete','finish','end','finalize'], ans:0 },

  { id:174, level:'B1', section:'vocabulary',
    q:'He finally ___ to quit his job and start his own business.',
    opts:['decided','chose','selected','elected'], ans:0 },

  { id:175, level:'B1', section:'vocabulary',
    q:'The documentary ___ light on a little-known historical event.',
    opts:['gave','shed','put','brought'], ans:1 },

  // ── B1 Additional Reading (10) ──────────────────────────────────
  { id:176, level:'B1', section:'reading',
    passage:'Climate change is one of the most pressing challenges of our time. Scientists warn that rising global temperatures are causing more frequent and severe weather events, including floods, droughts, and hurricanes. The melting of polar ice caps has led to rising sea levels, which threaten coastal communities around the world. Many governments have pledged to reduce carbon emissions, but progress has been slow. Environmental activists argue that individual actions, such as reducing energy consumption and adopting sustainable habits, can also make a significant difference. However, they emphasize that systemic change through government policy and corporate responsibility is essential for long-term solutions.',
    q:'What do scientists warn about rising global temperatures?',
    opts:['They will decrease over time','They cause more severe weather events','They only affect polar regions','They are natural and unavoidable'], ans:1 },

  { id:177, level:'B1', section:'reading',
    passage:'Climate change is one of the most pressing challenges of our time. Scientists warn that rising global temperatures are causing more frequent and severe weather events, including floods, droughts, and hurricanes. The melting of polar ice caps has led to rising sea levels, which threaten coastal communities around the world. Many governments have pledged to reduce carbon emissions, but progress has been slow. Environmental activists argue that individual actions, such as reducing energy consumption and adopting sustainable habits, can also make a significant difference. However, they emphasize that systemic change through government policy and corporate responsibility is essential for long-term solutions.',
    q:'According to the text, what threatens coastal communities?',
    opts:['Air pollution','Rising sea levels','Overpopulation','Deforestation'], ans:1 },

  { id:178, level:'B1', section:'reading',
    passage:'Climate change is one of the most pressing challenges of our time. Scientists warn that rising global temperatures are causing more frequent and severe weather events, including floods, droughts, and hurricanes. The melting of polar ice caps has led to rising sea levels, which threaten coastal communities around the world. Many governments have pledged to reduce carbon emissions, but progress has been slow. Environmental activists argue that individual actions, such as reducing energy consumption and adopting sustainable habits, can also make a significant difference. However, they emphasize that systemic change through government policy and corporate responsibility is essential for long-term solutions.',
    q:'What do activists believe is essential for long-term solutions?',
    opts:['Only individual actions','Government policy and corporate responsibility','Building more coastal defences','Moving to renewable energy only'], ans:1 },

  { id:179, level:'B1', section:'reading',
    passage:'Climate change is one of the most pressing challenges of our time. Scientists warn that rising global temperatures are causing more frequent and severe weather events, including floods, droughts, and hurricanes. The melting of polar ice caps has led to rising sea levels, which threaten coastal communities around the world. Many governments have pledged to reduce carbon emissions, but progress has been slow. Environmental activists argue that individual actions, such as reducing energy consumption and adopting sustainable habits, can also make a significant difference. However, they emphasize that systemic change through government policy and corporate responsibility is essential for long-term solutions.',
    q:'The word "pledged" in this context most closely means:',
    opts:['refused','promised','considered','ignored'], ans:1 },

  { id:180, level:'B1', section:'reading',
    passage:'The sharing economy has transformed the way people access goods and services. Companies like Airbnb and Uber have enabled individuals to rent out their homes or offer rides to strangers, creating new income opportunities. Supporters argue that this model makes more efficient use of existing resources and often provides cheaper alternatives to traditional services. For example, staying in an Airbnb apartment is frequently less expensive than booking a hotel room. However, critics point out that the sharing economy can also have negative consequences. In many cities, the rise of short-term rentals has contributed to housing shortages and increased rent prices for local residents. Additionally, some sharing economy platforms have been accused of avoiding taxes and regulations that traditional businesses must follow.',
    q:'What is one advantage of the sharing economy mentioned in the text?',
    opts:['Higher prices for consumers','Creating new income opportunities','Reducing the need for regulation','Eliminating traditional businesses'], ans:1 },

  { id:181, level:'B1', section:'reading',
    passage:'The sharing economy has transformed the way people access goods and services. Companies like Airbnb and Uber have enabled individuals to rent out their homes or offer rides to strangers, creating new income opportunities. Supporters argue that this model makes more efficient use of existing resources and often provides cheaper alternatives to traditional services. For example, staying in an Airbnb apartment is frequently less expensive than booking a hotel room. However, critics point out that the sharing economy can also have negative consequences. In many cities, the rise of short-term rentals has contributed to housing shortages and increased rent prices for local residents. Additionally, some sharing economy platforms have been accused of avoiding taxes and regulations that traditional businesses must follow.',
    q:'What negative consequence of the sharing economy is mentioned?',
    opts:['Lower quality services','Housing shortages and increased rents','Fewer job opportunities','Higher transportation costs'], ans:1 },

  { id:182, level:'B1', section:'reading',
    passage:'The sharing economy has transformed the way people access goods and services. Companies like Airbnb and Uber have enabled individuals to rent out their homes or offer rides to strangers, creating new income opportunities. Supporters argue that this model makes more efficient use of existing resources and often provides cheaper alternatives to traditional services. For example, staying in an Airbnb apartment is frequently less expensive than booking a hotel room. However, critics point out that the sharing economy can also have negative consequences. In many cities, the rise of short-term rentals has contributed to housing shortages and increased rent prices for local residents. Additionally, some sharing economy platforms have been accused of avoiding taxes and regulations that traditional businesses must follow.',
    q:'According to the text, what have some sharing economy platforms been accused of?',
    opts:['Providing poor customer service','Avoiding taxes and regulations','Exploiting their workers','Misusing personal data'], ans:1 },

  { id:183, level:'B1', section:'reading',
    passage:'The sharing economy has transformed the way people access goods and services. Companies like Airbnb and Uber have enabled individuals to rent out their homes or offer rides to strangers, creating new income opportunities. Supporters argue that this model makes more efficient use of existing resources and often provides cheaper alternatives to traditional services. For example, staying in an Airbnb apartment is frequently less expensive than booking a hotel room. However, critics point out that the sharing economy can also have negative consequences. In many cities, the rise of short-term rentals has contributed to housing shortages and increased rent prices for local residents. Additionally, some sharing economy platforms have been accused of avoiding taxes and regulations that traditional businesses must follow.',
    q:'The word "alternatives" in the passage most closely means:',
    opts:['copies','options','requirements','problems'], ans:1 },

  { id:184, level:'B1', section:'reading',
    passage:'Urban gardening has become increasingly popular in cities around the world. Residents transform rooftops, balconies, and small plots of land into green spaces where they grow vegetables, herbs, and flowers. Supporters of urban gardening highlight several benefits. Firstly, it provides access to fresh, organic produce, which can improve nutrition and reduce grocery bills. Secondly, green spaces help to improve air quality and reduce the urban heat island effect, where cities become significantly warmer than surrounding rural areas. Community gardens also foster social connections among neighbours, creating a sense of shared purpose. However, urban gardening does face challenges. Limited space, soil contamination, and lack of access to water can make it difficult to maintain a garden in a city environment.',
    q:'What is one benefit of urban gardening mentioned in the passage?',
    opts:['It reduces traffic congestion','It provides access to fresh produce','It lowers property taxes','It increases employment'], ans:1 },

  { id:185, level:'B1', section:'reading',
    passage:'Urban gardening has become increasingly popular in cities around the world. Residents transform rooftops, balconies, and small plots of land into green spaces where they grow vegetables, herbs, and flowers. Supporters of urban gardening highlight several benefits. Firstly, it provides access to fresh, organic produce, which can improve nutrition and reduce grocery bills. Secondly, green spaces help to improve air quality and reduce the urban heat island effect, where cities become significantly warmer than surrounding rural areas. Community gardens also foster social connections among neighbours, creating a sense of shared purpose. However, urban gardening does face challenges. Limited space, soil contamination, and lack of access to water can make it difficult to maintain a garden in a city environment.',
    q:'What is the "urban heat island effect"?',
    opts:['Cities that are located on islands','Cities becoming warmer than rural areas','Gardens that are heated artificially','Neighbourhoods with no green spaces'], ans:1 },
]

// ── B2 Questions ──────────────────────────────────────────────────────────────

export const B2_QUESTIONS: TQ[] = [
  // ── Grammar ──────────────────────────────────────────────────────────────
  { id:31, level:'B2', section:'grammar', q:'Had I known about the delay, I ___ a different route.',
    opts:['would take','would have taken','had taken','took'], ans:1 },

  { id:32, level:'B2', section:'grammar', q:'Not only ___ late, but she also forgot her presentation.',
    opts:['she arrived','arrived she','did she arrive','she did arrive'], ans:2 },

  { id:33, level:'B2', section:'grammar', q:'The contract is said ___ next Monday.',
    opts:['to be signed','to sign','being signed','signing'], ans:0 },

  { id:34, level:'B2', section:'grammar', q:'The manager suggested that the report ___ rewritten.',
    opts:['be','is','was','should be'], ans:0 },

  { id:35, level:'B2', section:'grammar', q:'By this time next year, I ___ for the company for a decade.',
    opts:['will work','am working','will have been working','would work'], ans:2 },

  { id:36, level:'B2', section:'grammar', q:'He was accused ___ the confidential documents.',
    opts:['to leak','of leaking','for leaking','with leaking'], ans:1 },

  { id:37, level:'B2', section:'grammar', q:'It was ___ who first proposed the new strategy.',
    opts:['her','she','hers','herself'], ans:1 },

  { id:38, level:'B2', section:'grammar', q:"I'd rather you ___ mention this to anyone else.",
    opts:["don't","didn't","wouldn't","not"], ans:1 },

  { id:39, level:'B2', section:'grammar', q:'Barely ___ sat down when the phone rang again.',
    opts:['I had','had I','I','did I'], ans:1 },

  { id:40, level:'B2', section:'grammar', q:'She finished first, ___ surprised all of the judges.',
    opts:['that','who','which','what'], ans:2 },

  { id:41, level:'B2', section:'grammar', q:"It's high time the government ___ action on climate change.",
    opts:['takes','took','would take','has taken'], ans:1 },

  { id:42, level:'B2', section:'grammar', q:'She denied ever ___ to the man before.',
    opts:['speaking','to speak','having spoken','spoke'], ans:2 },

  { id:43, level:'B2', section:'grammar', q:'The painting, ___ for two centuries, was finally found.',
    opts:['lost','losing','having lost','been lost'], ans:0 },

  { id:44, level:'B2', section:'grammar', q:'No sooner ___ than it started to rain heavily.',
    opts:['we left','had we left','we had left','did we leave'], ans:1 },

  { id:45, level:'B2', section:'grammar', q:'"I didn\'t take the money," she said. She denied ___ the money.',
    opts:['taking','to take','that she takes','took'], ans:0 },

  // ── Vocabulary ────────────────────────────────────────────────────────────
  { id:46, level:'B2', section:'vocabulary', q:'Choose the word closest in meaning to "conceal":',
    opts:['reveal','hide','display','protect'], ans:1 },

  { id:47, level:'B2', section:'vocabulary', q:"She gave a very ___ analysis of the company's financial problems.",
    opts:['thorough','complete','full','inclusive'], ans:0 },

  { id:48, level:'B2', section:'vocabulary', q:'The manager ___ the less urgent tasks to a junior colleague.',
    opts:['delegated','transferred','passed','abandoned'], ans:0 },

  { id:49, level:'B2', section:'vocabulary', q:'Despite all the obstacles, she ___ to complete the marathon.',
    opts:['managed','succeeded','achieved','accomplished'], ans:0 },

  { id:50, level:'B2', section:'vocabulary', q:'Which word does NOT fit with the others?',
    opts:['hesitate','delay','postpone','accelerate'], ans:3 },

  { id:51, level:'B2', section:'vocabulary', q:'The new evidence completely ___ his carefully constructed alibi.',
    opts:['confirmed','established','demolished','proved'], ans:2 },

  { id:52, level:'B2', section:'vocabulary', q:'The government announced new ___ to tackle rising inflation.',
    opts:['methods','measures','strategies','procedures'], ans:1 },

  { id:53, level:'B2', section:'vocabulary', q:'His proposal was ___ by the board without discussion.',
    opts:['turned off','turned down','turned over','turned out'], ans:1 },

  { id:54, level:'B2', section:'vocabulary', q:'"She has a natural ___ for languages — she picks them up effortlessly."',
    opts:['talent','gift','flair','instinct'], ans:2 },

  { id:55, level:'B2', section:'vocabulary', q:"The scientist's claims were ___ by independent research teams.",
    opts:['confirmed','ratified','substantiated','corroborated'], ans:3 },

  // ── Reading ───────────────────────────────────────────────────────────────
  { id:56, level:'B2', section:'reading',
    passage:'Artificial intelligence is increasingly being used in healthcare to assist doctors in diagnosing diseases. AI algorithms can analyse thousands of medical scans in minutes — a task that would take human doctors considerably longer. Critics, however, raise concerns about patient privacy and the potential for errors in automated systems.',
    q:'What is the primary use of AI in healthcare mentioned in the text?',
    opts:['Treating patients directly','Diagnosing diseases','Replacing surgeons','Managing hospital budgets'], ans:1 },

  { id:57, level:'B2', section:'reading',
    passage:'Artificial intelligence is increasingly being used in healthcare to assist doctors in diagnosing diseases. AI algorithms can analyse thousands of medical scans in minutes — a task that would take human doctors considerably longer. Critics, however, raise concerns about patient privacy and the potential for errors in automated systems.',
    q:'What advantage of AI over human doctors is mentioned?',
    opts:['It is always accurate','It is cheaper to operate','It processes scans far more quickly','It never makes errors'], ans:2 },

  { id:58, level:'B2', section:'reading',
    passage:'Artificial intelligence is increasingly being used in healthcare to assist doctors in diagnosing diseases. AI algorithms can analyse thousands of medical scans in minutes — a task that would take human doctors considerably longer. Critics, however, raise concerns about patient privacy and the potential for errors in automated systems.',
    q:'What concerns do critics raise about AI in healthcare?',
    opts:['High financial cost','Privacy and potential errors','Loss of doctor jobs','Slow processing speed'], ans:1 },

  { id:59, level:'B2', section:'reading',
    passage:'The so-called "gig economy" — characterised by short-term contracts and freelance work — has grown rapidly over the past decade. While workers appreciate the flexibility it offers, many lack the job security and benefits that come with traditional employment. Governments in several countries are now debating legislation to extend greater protections to gig workers.',
    q:'What characterises the "gig economy" according to the passage?',
    opts:['Long-term employment contracts','High salaries and bonuses','Short-term and freelance work','Government-funded positions'], ans:2 },

  { id:60, level:'B2', section:'reading',
    passage:'The so-called "gig economy" — characterised by short-term contracts and freelance work — has grown rapidly over the past decade. While workers appreciate the flexibility it offers, many lack the job security and benefits that come with traditional employment. Governments in several countries are now debating legislation to extend greater protections to gig workers.',
    q:'What are some governments currently considering?',
     opts:['Banning the gig economy entirely','Reducing gig workers\' tax obligations','Legislation to protect gig workers','Limiting the number of freelance platforms'], ans:2 },

  // ── Grammar (B2) ─────────────────────────────────────────────────
  { id:121, level:'B2', section:'grammar',
    q:'Under no circumstances ___ we allow this to happen.',
    opts:['should','would','are','could'], ans:0 },
  { id:122, level:'B2', section:'grammar',
    q:'Not until the results were published ___ the extent of the problem.',
    opts:['they realised','did they realise','they did realise','had they realised'], ans:1 },
  { id:123, level:'B2', section:'grammar',
    q:'What really impressed the interviewers ___ my previous experience.',
    opts:['was','were','has been','are'], ans:0 },
  { id:124, level:'B2', section:'grammar',
    q:'It was the board of directors ___ rejected the merger proposal.',
    opts:['which','who','whom','that'], ans:3 },
  { id:125, level:'B2', section:'grammar',
    q:'The suspect is believed ___ the country before the crime was discovered.',
    opts:['to leave','to have left','leaving','having left'], ans:1 },
  { id:126, level:'B2', section:'grammar',
    q:'The government is expected ___ new regulations next month.',
    opts:['to introduce','introducing','to be introduced','having introduced'], ans:0 },
  { id:127, level:'B2', section:'grammar',
    q:'If I had taken that job, I ___ in a different city now.',
    opts:['would be','would have been','will be','had been'], ans:0 },
  { id:128, level:'B2', section:'grammar',
    q:'If she were not so busy at work, she ___ us on the trip last month.',
    opts:['would have joined','would join','joined','had joined'], ans:0 },
  { id:129, level:'B2', section:'grammar',
    q:'The company has expanded rapidly. ___, profits have not increased accordingly.',
    opts:['Moreover','Furthermore','Nevertheless','Therefore'], ans:2 },
  { id:130, level:'B2', section:'grammar',
    q:'Rising costs are a major concern. ___, customer satisfaction has declined sharply.',
    opts:['In addition','On the contrary','As a result','However'], ans:0 },
  { id:131, level:'B2', section:'grammar',
    q:'Seldom ___ such a remarkable performance.',
    opts:['we have seen','have we seen','we saw','we see'], ans:1 },
  { id:132, level:'B2', section:'grammar',
    q:'The reason why the project failed ___ a lack of proper planning.',
    opts:['is','are','was','were'], ans:2 },
  { id:133, level:'B2', section:'grammar',
    q:'The documents are thought ___ during the fire.',
    opts:['to destroy','to be destroyed','to have been destroyed','destroying'], ans:2 },
  { id:134, level:'B2', section:'grammar',
    q:'Were it not for his financial support, the charity ___ last year.',
    opts:['would not survive','would not have survived','did not survive','had not survived'], ans:1 },
  { id:135, level:'B2', section:'grammar',
    q:'The new policy has several advantages. ___, it is considerably more cost-effective.',
    opts:['For instance','On the other hand','In contrast','Otherwise'], ans:0 },

  // ── Vocabulary (B2) ──────────────────────────────────────────────
  { id:136, level:'B2', section:'vocabulary',
    q:'The study aims to ___ the effects of social media on adolescent mental health.',
    opts:['investigate','question','suspect','interrogate'], ans:0 },
  { id:137, level:'B2', section:'vocabulary',
    q:'Choose the most formal alternative for "find out":',
    opts:['discover','ascertain','uncover','reveal'], ans:1 },
  { id:138, level:'B2', section:'vocabulary',
    q:'The government must ___ urgent action to address the housing crisis.',
    opts:['make','do','take','give'], ans:2 },
  { id:139, level:'B2', section:'vocabulary',
    q:'Her research ___ on the relationship between diet and cognitive function.',
    opts:['concentrates','focuses','centres','fixes'], ans:1 },
  { id:140, level:'B2', section:'vocabulary',
    q:'The word "ubiquitous" most nearly means:',
    opts:['rare','everywhere','unique','limited'], ans:1 },
  { id:141, level:'B2', section:'vocabulary',
    q:'Choose the most appropriate word: "The CEO ___ the employee for her outstanding contribution."',
    opts:['praised','complimented','commended','congratulated'], ans:2 },
  { id:142, level:'B2', section:'vocabulary',
    q:"The company's ___ of the new software led to increased efficiency.",
    opts:['implementation','application','utilisation','execution'], ans:0 },
  { id:143, level:'B2', section:'vocabulary',
    q:'Her argument was so ___ that even her critics were convinced.',
    opts:['persuasive','aggressive','descriptive','sensitive'], ans:0 },
  { id:144, level:'B2', section:'vocabulary',
    q:'The two theories are ___ — they cannot both be true.',
    opts:['complementary','contradictory','comprehensive','compulsory'], ans:1 },
  { id:145, level:'B2', section:'vocabulary',
    q:"The minister's comments were ___ — they could be interpreted in several ways.",
    opts:['ambiguous','obvious','precise','definite'], ans:0 },

  // ── Reading (B2) ────────────────────────────────────────────────
  { id:146, level:'B2', section:'reading',
    passage:'Artificial intelligence is transforming healthcare in unprecedented ways. In the field of diagnostics, machine learning algorithms can analyse medical imaging with remarkable accuracy, often detecting abnormalities that the human eye might miss. For instance, AI systems have demonstrated the ability to identify early-stage cancers from CT scans and mammograms with sensitivity rates exceeding those of experienced radiologists. Beyond diagnosis, AI is playing an increasingly prominent role in treatment planning. By processing vast amounts of patient data alongside the latest medical research, AI can recommend personalised treatment protocols tailored to an individual\'s genetic profile and lifestyle factors. This approach, known as precision medicine, promises to improve outcomes while reducing adverse effects. However, the integration of AI into healthcare raises significant ethical questions. Concerns over data privacy are paramount, as AI systems require access to vast quantities of sensitive patient information. There is also the risk of algorithmic bias — if the data used to train AI systems is not representative of diverse populations, the resulting recommendations may be less effective for certain groups. Moreover, questions of accountability remain unresolved: when an AI system makes an incorrect diagnosis, who bears responsibility? Despite these challenges, proponents argue that the potential benefits far outweigh the risks, and that with appropriate regulation, AI could revolutionise healthcare delivery worldwide.',
    q:'What ability of AI in diagnostics is highlighted in the passage?',
    opts:['Replacing all radiologists','Detecting abnormalities missed by human eyes','Reducing the cost of scans','Eliminating the need for CT scans'], ans:1 },
  { id:147, level:'B2', section:'reading',
    passage:'Artificial intelligence is transforming healthcare in unprecedented ways. In the field of diagnostics, machine learning algorithms can analyse medical imaging with remarkable accuracy, often detecting abnormalities that the human eye might miss. For instance, AI systems have demonstrated the ability to identify early-stage cancers from CT scans and mammograms with sensitivity rates exceeding those of experienced radiologists. Beyond diagnosis, AI is playing an increasingly prominent role in treatment planning. By processing vast amounts of patient data alongside the latest medical research, AI can recommend personalised treatment protocols tailored to an individual\'s genetic profile and lifestyle factors. This approach, known as precision medicine, promises to improve outcomes while reducing adverse effects. However, the integration of AI into healthcare raises significant ethical questions. Concerns over data privacy are paramount, as AI systems require access to vast quantities of sensitive patient information. There is also the risk of algorithmic bias — if the data used to train AI systems is not representative of diverse populations, the resulting recommendations may be less effective for certain groups. Moreover, questions of accountability remain unresolved: when an AI system makes an incorrect diagnosis, who bears responsibility? Despite these challenges, proponents argue that the potential benefits far outweigh the risks, and that with appropriate regulation, AI could revolutionise healthcare delivery worldwide.',
    q:'What is "precision medicine" according to the passage?',
    opts:['A standardised treatment for all patients','Personalised treatment based on genetics and lifestyle','A surgical technique using AI','Preventive medicine without drugs'], ans:1 },
  { id:148, level:'B2', section:'reading',
    passage:'Artificial intelligence is transforming healthcare in unprecedented ways. In the field of diagnostics, machine learning algorithms can analyse medical imaging with remarkable accuracy, often detecting abnormalities that the human eye might miss. For instance, AI systems have demonstrated the ability to identify early-stage cancers from CT scans and mammograms with sensitivity rates exceeding those of experienced radiologists. Beyond diagnosis, AI is playing an increasingly prominent role in treatment planning. By processing vast amounts of patient data alongside the latest medical research, AI can recommend personalised treatment protocols tailored to an individual\'s genetic profile and lifestyle factors. This approach, known as precision medicine, promises to improve outcomes while reducing adverse effects. However, the integration of AI into healthcare raises significant ethical questions. Concerns over data privacy are paramount, as AI systems require access to vast quantities of sensitive patient information. There is also the risk of algorithmic bias — if the data used to train AI systems is not representative of diverse populations, the resulting recommendations may be less effective for certain groups. Moreover, questions of accountability remain unresolved: when an AI system makes an incorrect diagnosis, who bears responsibility? Despite these challenges, proponents argue that the potential benefits far outweigh the risks, and that with appropriate regulation, AI could revolutionise healthcare delivery worldwide.',
    q:'What ethical concern about AI in healthcare is mentioned?',
    opts:['High implementation costs','Data privacy and algorithmic bias','Lack of qualified personnel','Slow processing speeds'], ans:1 },
  { id:149, level:'B2', section:'reading',
    passage:'Artificial intelligence is transforming healthcare in unprecedented ways. In the field of diagnostics, machine learning algorithms can analyse medical imaging with remarkable accuracy, often detecting abnormalities that the human eye might miss. For instance, AI systems have demonstrated the ability to identify early-stage cancers from CT scans and mammograms with sensitivity rates exceeding those of experienced radiologists. Beyond diagnosis, AI is playing an increasingly prominent role in treatment planning. By processing vast amounts of patient data alongside the latest medical research, AI can recommend personalised treatment protocols tailored to an individual\'s genetic profile and lifestyle factors. This approach, known as precision medicine, promises to improve outcomes while reducing adverse effects. However, the integration of AI into healthcare raises significant ethical questions. Concerns over data privacy are paramount, as AI systems require access to vast quantities of sensitive patient information. There is also the risk of algorithmic bias — if the data used to train AI systems is not representative of diverse populations, the resulting recommendations may be less effective for certain groups. Moreover, questions of accountability remain unresolved: when an AI system makes an incorrect diagnosis, who bears responsibility? Despite these challenges, proponents argue that the potential benefits far outweigh the risks, and that with appropriate regulation, AI could revolutionise healthcare delivery worldwide.',
    q:'What question about accountability does the passage raise?',
    opts:['Should AI be used at all?','Who is responsible for AI errors?','How much should AI cost?','Can AI replace doctors entirely?'], ans:1 },
  { id:150, level:'B2', section:'reading',
    passage:'Artificial intelligence is transforming healthcare in unprecedented ways. In the field of diagnostics, machine learning algorithms can analyse medical imaging with remarkable accuracy, often detecting abnormalities that the human eye might miss. For instance, AI systems have demonstrated the ability to identify early-stage cancers from CT scans and mammograms with sensitivity rates exceeding those of experienced radiologists. Beyond diagnosis, AI is playing an increasingly prominent role in treatment planning. By processing vast amounts of patient data alongside the latest medical research, AI can recommend personalised treatment protocols tailored to an individual\'s genetic profile and lifestyle factors. This approach, known as precision medicine, promises to improve outcomes while reducing adverse effects. However, the integration of AI into healthcare raises significant ethical questions. Concerns over data privacy are paramount, as AI systems require access to vast quantities of sensitive patient information. There is also the risk of algorithmic bias — if the data used to train AI systems is not representative of diverse populations, the resulting recommendations may be less effective for certain groups. Moreover, questions of accountability remain unresolved: when an AI system makes an incorrect diagnosis, who bears responsibility? Despite these challenges, proponents argue that the potential benefits far outweigh the risks, and that with appropriate regulation, AI could revolutionise healthcare delivery worldwide.',
    q:'The word "paramount" in the passage most closely means:',
    opts:['optional','secondary','of greatest importance','controversial'], ans:2 },

  // ── B2 Additional Grammar (15) ────────────────────────────────────
  { id:186, level:'B2', section:'grammar',
    q:'Only after the meeting did I ___ the seriousness of the situation.',
    opts:['realise','realised','realising','have realised'], ans:0 },

  { id:187, level:'B2', section:'grammar',
    q:"The artist's latest work, ___ has been highly anticipated, finally goes on display next week.",
    opts:['that','which','what','who'], ans:1 },

  { id:188, level:'B2', section:'grammar',
    q:'She would rather ___ the project herself than delegate it.',
    opts:['manage','to manage','managing','managed'], ans:0 },

  { id:189, level:'B2', section:'grammar',
    q:'Not a single word ___ during the entire presentation.',
    opts:['he said','did he say','he did say','said he'], ans:1 },

  { id:190, level:'B2', section:'grammar',
    q:'It is essential that every participant ___ the consent form before the workshop.',
    opts:['signs','sign','signed','is signing'], ans:1 },

  { id:191, level:'B2', section:'grammar',
    q:'The longer she waited for a response, ___ anxious she became.',
    opts:['the more','more','most','the most'], ans:0 },

  { id:192, level:'B2', section:'grammar',
    q:'Were I in your position, I ___ a different approach entirely.',
    opts:['would take','will take','would have taken','took'], ans:0 },

  { id:193, level:'B2', section:'grammar',
    q:'The professor, along with his research team, ___ currently conducting a field study.',
    opts:['are','is','were','have been'], ans:1 },

  { id:194, level:'B2', section:'grammar',
    q:'On no account ___ the confidential information to unauthorised personnel.',
    opts:['you should disclose','should you disclose','you disclose','you would disclose'], ans:1 },

  { id:195, level:'B2', section:'grammar',
    q:'I wish I ___ more attention in class yesterday.',
    opts:['paid','had paid','would pay','have paid'], ans:1 },

  { id:196, level:'B2', section:'grammar',
    q:'___ the delay, we would have arrived on time.',
    opts:['But for','Despite','Although','Because of'], ans:0 },

  { id:197, level:'B2', section:'grammar',
    q:"The committee recommended that the building ___ demolished.",
    opts:['be','is','was','will be'], ans:0 },

  { id:198, level:'B2', section:'grammar',
    q:"It was not until she read the article ___ she understood the full story.",
    opts:['that','when','then','did'], ans:0 },

  { id:199, level:'B2', section:'grammar',
    q:'Such ___ the demand for the product that it sold out within hours.',
    opts:['was','were','has been','is'], ans:0 },

  { id:200, level:'B2', section:'grammar',
    q:'Despite ___ for hours, the negotiation reached no agreement.',
    opts:['to negotiate','negotiating','having negotiated','negotiate'], ans:2 },

  // ── B2 Additional Vocabulary (15) ──────────────────────────────
  { id:201, level:'B2', section:'vocabulary',
    q:'The two countries signed a ___ to promote mutual trade and investment.',
    opts:['pact','contract','treaty','agreement'], ans:2 },

  { id:202, level:'B2', section:'vocabulary',
    q:'Her ___ to detail is what makes her an excellent editor.',
    opts:['attention','focus','concentration','awareness'], ans:0 },

  { id:203, level:'B2', section:'vocabulary',
    q:'The CEO decided to ___ the merger after careful consideration.',
    opts:['go through with','put up with','come down with','make off with'], ans:0 },

  { id:204, level:'B2', section:'vocabulary',
    q:'The word "ephemeral" most nearly means:',
    opts:['permanent','short-lived','frequent','intense'], ans:1 },

  { id:205, level:'B2', section:'vocabulary',
    q:'The company faced severe ___ for its role in the pollution scandal.',
    opts:['criticism','credit','approval','praise'], ans:0 },

  { id:206, level:'B2', section:'vocabulary',
    q:'The new policy aims to ___ the gap between rich and poor.',
    opts:['broaden','narrow','widen','extend'], ans:1 },

  { id:207, level:'B2', section:'vocabulary',
    q:'The results of the experiment ___ our initial hypothesis.',
    opts:['contradicted','confirmed','corroborated','validated'], ans:0 },

  { id:208, level:'B2', section:'vocabulary',
    q:'He has a ___ ability to solve complex problems quickly.',
    opts:['remarkable','ordinary','typical','common'], ans:0 },

  { id:209, level:'B2', section:'vocabulary',
    q:'The documentary provides a ___ analysis of the political situation.',
    opts:['superficial','comprehensive','narrow','partial'], ans:1 },

  { id:210, level:'B2', section:'vocabulary',
    q:'The team worked in close ___ with the local authorities.',
    opts:['cooperation','competition','conflict','isolation'], ans:0 },

  { id:211, level:'B2', section:'vocabulary',
    q:'Her theory was met with widespread ___ from the academic community.',
    opts:['scepticism','enthusiasm','indifference','approval'], ans:0 },

  { id:212, level:'B2', section:'vocabulary',
    q:'The investigation ___ widespread corruption within the organisation.',
    opts:['uncovered','covered','discovered','found'], ans:0 },

  { id:213, level:'B2', section:'vocabulary',
    q:'The project requires a ___ investment of time and resources.',
    opts:['substantial','minor','trivial','negligible'], ans:0 },

  { id:214, level:'B2', section:'vocabulary',
    q:'Choose the word that is closest in meaning to "reluctant":',
    opts:['eager','unwilling','determined','ready'], ans:1 },

  { id:215, level:'B2', section:'vocabulary',
    q:'The new regulations will ___ from next month.',
    opts:['take effect','take part','take place','take care'], ans:0 },

  // ── B2 Additional Reading (10) ──────────────────────────────────
  { id:216, level:'B2', section:'reading',
    passage:'The concept of a four-day working week has gained significant traction in recent years, with several countries and companies running pilot programmes to test its feasibility. Proponents argue that reducing the standard working week from five days to four can lead to increased productivity, improved employee wellbeing, and reduced environmental impact due to fewer commutes. A large-scale trial conducted in Iceland between 2015 and 2019 involved over 2,500 workers across a variety of workplace settings. The results were overwhelmingly positive: productivity remained the same or improved in most workplaces, while employee stress and burnout decreased significantly. Workers reported spending more time with their families, pursuing hobbies, and taking better care of their health. However, critics point out that a four-day week may not be suitable for all industries. Sectors such as healthcare, education, and retail often require continuous coverage, making it challenging to condense the same workload into fewer days. There are also concerns about potential salary reductions and the risk of increased work intensity during the remaining working days. Despite these challenges, the growing body of evidence suggests that, when implemented thoughtfully, a shorter working week can benefit both employees and employers.',
    q:'What was the outcome of the Icelandic trial mentioned in the passage?',
    opts:['Productivity decreased significantly','Productivity remained the same or improved','Most workers returned to a five-day week','The trial was unsuccessful'], ans:1 },

  { id:217, level:'B2', section:'reading',
    passage:'The concept of a four-day working week has gained significant traction in recent years, with several countries and companies running pilot programmes to test its feasibility. Proponents argue that reducing the standard working week from five days to four can lead to increased productivity, improved employee wellbeing, and reduced environmental impact due to fewer commutes. A large-scale trial conducted in Iceland between 2015 and 2019 involved over 2,500 workers across a variety of workplace settings. The results were overwhelmingly positive: productivity remained the same or improved in most workplaces, while employee stress and burnout decreased significantly. Workers reported spending more time with their families, pursuing hobbies, and taking better care of their health. However, critics point out that a four-day week may not be suitable for all industries. Sectors such as healthcare, education, and retail often require continuous coverage, making it challenging to condense the same workload into fewer days. There are also concerns about potential salary reductions and the risk of increased work intensity during the remaining working days. Despite these challenges, the growing body of evidence suggests that, when implemented thoughtfully, a shorter working week can benefit both employees and employers.',
    q:'Which sectors are mentioned as potentially unsuitable for a four-day week?',
    opts:['Technology and finance','Healthcare, education and retail','Manufacturing and agriculture','Construction and transportation'], ans:1 },

  { id:218, level:'B2', section:'reading',
    passage:'The concept of a four-day working week has gained significant traction in recent years, with several countries and companies running pilot programmes to test its feasibility. Proponents argue that reducing the standard working week from five days to four can lead to increased productivity, improved employee wellbeing, and reduced environmental impact due to fewer commutes. A large-scale trial conducted in Iceland between 2015 and 2019 involved over 2,500 workers across a variety of workplace settings. The results were overwhelmingly positive: productivity remained the same or improved in most workplaces, while employee stress and burnout decreased significantly. Workers reported spending more time with their families, pursuing hobbies, and taking better care of their health. However, critics point out that a four-day week may not be suitable for all industries. Sectors such as healthcare, education, and retail often require continuous coverage, making it challenging to condense the same workload into fewer days. There are also concerns about potential salary reductions and the risk of increased work intensity during the remaining working days. Despite these challenges, the growing body of evidence suggests that, when implemented thoughtfully, a shorter working week can benefit both employees and employers.',
    q:'What concern about the four-day week is raised by critics?',
    opts:['Workers would become less motivated','It may not suit all industries','It would reduce company profits','It requires too much planning'], ans:1 },

  { id:219, level:'B2', section:'reading',
    passage:'The concept of a four-day working week has gained significant traction in recent years, with several countries and companies running pilot programmes to test its feasibility. Proponents argue that reducing the standard working week from five days to four can lead to increased productivity, improved employee wellbeing, and reduced environmental impact due to fewer commutes. A large-scale trial conducted in Iceland between 2015 and 2019 involved over 2,500 workers across a variety of workplace settings. The results were overwhelmingly positive: productivity remained the same or improved in most workplaces, while employee stress and burnout decreased significantly. Workers reported spending more time with their families, pursuing hobbies, and taking better care of their health. However, critics point out that a four-day week may not be suitable for all industries. Sectors such as healthcare, education, and retail often require continuous coverage, making it challenging to condense the same workload into fewer days. There are also concerns about potential salary reductions and the risk of increased work intensity during the remaining working days. Despite these challenges, the growing body of evidence suggests that, when implemented thoughtfully, a shorter working week can benefit both employees and employers.',
    q:'The word "traction" in the first sentence most closely means:',
    opts:['resistance','popularity and momentum','confusion','decline'], ans:1 },

  { id:220, level:'B2', section:'reading',
    passage:'Neuroscience has made remarkable strides in understanding how the brain processes and stores information. One of the most significant discoveries is the concept of neuroplasticity — the brain\'s ability to reorganise itself by forming new neural connections throughout life. This challenges the long-held belief that the brain\'s structure is fixed after childhood. Research has shown that learning a new skill, such as playing a musical instrument or speaking another language, can physically alter the brain\'s structure. These changes occur through a process called synaptic pruning, where frequently used neural pathways are strengthened while rarely used ones are eliminated. This explains why regular practice is so crucial for skill development — the more we repeat an activity, the more efficient the corresponding neural circuits become. Understanding neuroplasticity has important implications for education and rehabilitation. It suggests that individuals who struggle with certain subjects may simply need different teaching methods rather than lacking innate ability. Similarly, patients recovering from brain injuries can often regain lost functions through targeted therapy that encourages the brain to form new pathways. However, neuroplasticity also has a downside — negative thought patterns and habits can become deeply ingrained through the same mechanism, making them difficult to change.',
    q:'What is neuroplasticity, according to the passage?',
    opts:['A theory about brain size','The brain\'s ability to reorganise itself','A medical treatment for brain injuries','A method of teaching'], ans:1 },

  { id:221, level:'B2', section:'reading',
    passage:'Neuroscience has made remarkable strides in understanding how the brain processes and stores information. One of the most significant discoveries is the concept of neuroplasticity — the brain\'s ability to reorganise itself by forming new neural connections throughout life. This challenges the long-held belief that the brain\'s structure is fixed after childhood. Research has shown that learning a new skill, such as playing a musical instrument or speaking another language, can physically alter the brain\'s structure. These changes occur through a process called synaptic pruning, where frequently used neural pathways are strengthened while rarely used ones are eliminated. This explains why regular practice is so crucial for skill development — the more we repeat an activity, the more efficient the corresponding neural circuits become. Understanding neuroplasticity has important implications for education and rehabilitation. It suggests that individuals who struggle with certain subjects may simply need different teaching methods rather than lacking innate ability. Similarly, patients recovering from brain injuries can often regain lost functions through targeted therapy that encourages the brain to form new pathways. However, neuroplasticity also has a downside — negative thought patterns and habits can become deeply ingrained through the same mechanism, making them difficult to change.',
    q:'What is "synaptic pruning"?',
    opts:['The creation of new brain cells','Strengthening used pathways and eliminating unused ones','A surgical procedure on the brain','The reduction of brain size with age'], ans:1 },

  { id:222, level:'B2', section:'reading',
    passage:'Neuroscience has made remarkable strides in understanding how the brain processes and stores information. One of the most significant discoveries is the concept of neuroplasticity — the brain\'s ability to reorganise itself by forming new neural connections throughout life. This challenges the long-held belief that the brain\'s structure is fixed after childhood. Research has shown that learning a new skill, such as playing a musical instrument or speaking another language, can physically alter the brain\'s structure. These changes occur through a process called synaptic pruning, where frequently used neural pathways are strengthened while rarely used ones are eliminated. This explains why regular practice is so crucial for skill development — the more we repeat an activity, the more efficient the corresponding neural circuits become. Understanding neuroplasticity has important implications for education and rehabilitation. It suggests that individuals who struggle with certain subjects may simply need different teaching methods rather than lacking innate ability. Similarly, patients recovering from brain injuries can often regain lost functions through targeted therapy that encourages the brain to form new pathways. However, neuroplasticity also has a downside — negative thought patterns and habits can become deeply ingrained through the same mechanism, making them difficult to change.',
    q:'What implication does neuroplasticity have for education?',
    opts:['Only intelligent students can learn','Different teaching methods may help struggling students','Brain structure cannot change after childhood','All students learn the same way'], ans:1 },

  { id:223, level:'B2', section:'reading',
    passage:'Neuroscience has made remarkable strides in understanding how the brain processes and stores information. One of the most significant discoveries is the concept of neuroplasticity — the brain\'s ability to reorganise itself by forming new neural connections throughout life. This challenges the long-held belief that the brain\'s structure is fixed after childhood. Research has shown that learning a new skill, such as playing a musical instrument or speaking another language, can physically alter the brain\'s structure. These changes occur through a process called synaptic pruning, where frequently used neural pathways are strengthened while rarely used ones are eliminated. This explains why regular practice is so crucial for skill development — the more we repeat an activity, the more efficient the corresponding neural circuits become. Understanding neuroplasticity has important implications for education and rehabilitation. It suggests that individuals who struggle with certain subjects may simply need different teaching methods rather than lacking innate ability. Similarly, patients recovering from brain injuries can often regain lost functions through targeted therapy that encourages the brain to form new pathways. However, neuroplasticity also has a downside — negative thought patterns and habits can become deeply ingrained through the same mechanism, making them difficult to change.',
    q:'What downside of neuroplasticity is mentioned in the passage?',
    opts:['It only works for children','Negative habits can become deeply ingrained','It requires expensive equipment','It cannot help with brain injuries'], ans:1 },

  { id:224, level:'B2', section:'reading',
    passage:'Neuroscience has made remarkable strides in understanding how the brain processes and stores information. One of the most significant discoveries is the concept of neuroplasticity — the brain\'s ability to reorganise itself by forming new neural connections throughout life. This challenges the long-held belief that the brain\'s structure is fixed after childhood. Research has shown that learning a new skill, such as playing a musical instrument or speaking another language, can physically alter the brain\'s structure. These changes occur through a process called synaptic pruning, where frequently used neural pathways are strengthened while rarely used ones are eliminated. This explains why regular practice is so crucial for skill development — the more we repeat an activity, the more efficient the corresponding neural circuits become. Understanding neuroplasticity has important implications for education and rehabilitation. It suggests that individuals who struggle with certain subjects may simply need different teaching methods rather than lacking innate ability. Similarly, patients recovering from brain injuries can often regain lost functions through targeted therapy that encourages the brain to form new pathways. However, neuroplasticity also has a downside — negative thought patterns and habits can become deeply ingrained through the same mechanism, making them difficult to change.',
    q:'The word "implications" in the passage most closely means:',
    opts:['suggestions','consequences or significance','objections','similarities'], ans:1 },

  { id:225, level:'B2', section:'reading',
    passage:'The rise of e-commerce has fundamentally altered the retail landscape over the past two decades. Traditional brick-and-mortar stores have faced increasing pressure as consumers increasingly turn to online shopping for its convenience, wider selection, and often lower prices. E-commerce giants like Amazon have set new standards for delivery speed and customer service, forcing traditional retailers to adapt or risk becoming obsolete. However, the shift to online shopping has not been without costs. The decline of physical retail has led to job losses in the sector and the closure of many beloved local shops. Small businesses, in particular, have struggled to compete with the logistical capabilities and marketing budgets of large online platforms. Additionally, the environmental impact of e-commerce is increasingly under scrutiny. The convenience of home delivery comes with a significant carbon footprint — from warehouse energy consumption to the final mile of delivery. Packaging waste is another major concern, with mountains of cardboard and plastic generated by online orders. In response, some companies are exploring more sustainable practices, such as optimising delivery routes, using electric vehicles, and reducing packaging. Consumers, too, are becoming more conscious of their purchasing decisions, with some choosing to support local businesses or buy second-hand to reduce their environmental impact.',
    q:'What has forced traditional retailers to adapt, according to the passage?',
    opts:['Government regulations','New standards set by e-commerce giants','Decreasing consumer demand','Rising property prices'], ans:1 },

  { id:226, level:'B2', section:'reading',
    passage:'The rise of e-commerce has fundamentally altered the retail landscape over the past two decades. Traditional brick-and-mortar stores have faced increasing pressure as consumers increasingly turn to online shopping for its convenience, wider selection, and often lower prices. E-commerce giants like Amazon have set new standards for delivery speed and customer service, forcing traditional retailers to adapt or risk becoming obsolete. However, the shift to online shopping has not been without costs. The decline of physical retail has led to job losses in the sector and the closure of many beloved local shops. Small businesses, in particular, have struggled to compete with the logistical capabilities and marketing budgets of large online platforms. Additionally, the environmental impact of e-commerce is increasingly under scrutiny. The convenience of home delivery comes with a significant carbon footprint — from warehouse energy consumption to the final mile of delivery. Packaging waste is another major concern, with mountains of cardboard and plastic generated by online orders. In response, some companies are exploring more sustainable practices, such as optimising delivery routes, using electric vehicles, and reducing packaging. Consumers, too, are becoming more conscious of their purchasing decisions, with some choosing to support local businesses or buy second-hand to reduce their environmental impact.',
    q:'What environmental concern related to e-commerce is mentioned?',
    opts:['Increased water usage','Carbon footprint and packaging waste','Deforestation for warehouses','Air pollution from factories'], ans:1 },

  { id:227, level:'B2', section:'reading',
    passage:'The rise of e-commerce has fundamentally altered the retail landscape over the past two decades. Traditional brick-and-mortar stores have faced increasing pressure as consumers increasingly turn to online shopping for its convenience, wider selection, and often lower prices. E-commerce giants like Amazon have set new standards for delivery speed and customer service, forcing traditional retailers to adapt or risk becoming obsolete. However, the shift to online shopping has not been without costs. The decline of physical retail has led to job losses in the sector and the closure of many beloved local shops. Small businesses, in particular, have struggled to compete with the logistical capabilities and marketing budgets of large online platforms. Additionally, the environmental impact of e-commerce is increasingly under scrutiny. The convenience of home delivery comes with a significant carbon footprint — from warehouse energy consumption to the final mile of delivery. Packaging waste is another major concern, with mountains of cardboard and plastic generated by online orders. In response, some companies are exploring more sustainable practices, such as optimising delivery routes, using electric vehicles, and reducing packaging. Consumers, too, are becoming more conscious of their purchasing decisions, with some choosing to support local businesses or buy second-hand to reduce their environmental impact.',
    q:'What are some companies doing to address environmental concerns?',
    opts:['Closing their online stores','Optimising delivery routes and reducing packaging','Increasing their prices','Moving back to physical stores only'], ans:1 },

  { id:228, level:'B2', section:'reading',
    passage:'The rise of e-commerce has fundamentally altered the retail landscape over the past two decades. Traditional brick-and-mortar stores have faced increasing pressure as consumers increasingly turn to online shopping for its convenience, wider selection, and often lower prices. E-commerce giants like Amazon have set new standards for delivery speed and customer service, forcing traditional retailers to adapt or risk becoming obsolete. However, the shift to online shopping has not been without costs. The decline of physical retail has led to job losses in the sector and the closure of many beloved local shops. Small businesses, in particular, have struggled to compete with the logistical capabilities and marketing budgets of large online platforms. Additionally, the environmental impact of e-commerce is increasingly under scrutiny. The convenience of home delivery comes with a significant carbon footprint — from warehouse energy consumption to the final mile of delivery. Packaging waste is another major concern, with mountains of cardboard and plastic generated by online orders. In response, some companies are exploring more sustainable practices, such as optimising delivery routes, using electric vehicles, and reducing packaging. Consumers, too, are becoming more conscious of their purchasing decisions, with some choosing to support local businesses or buy second-hand to reduce their environmental impact.',
    q:'The phrase "brick-and-mortar stores" refers to:',
    opts:['Online-only retailers','Physical shops with a building','Stores that sell building materials','Temporary pop-up shops'], ans:1 },

  { id:229, level:'B2', section:'reading',
    passage:'The rise of e-commerce has fundamentally altered the retail landscape over the past two decades. Traditional brick-and-mortar stores have faced increasing pressure as consumers increasingly turn to online shopping for its convenience, wider selection, and often lower prices. E-commerce giants like Amazon have set new standards for delivery speed and customer service, forcing traditional retailers to adapt or risk becoming obsolete. However, the shift to online shopping has not been without costs. The decline of physical retail has led to job losses in the sector and the closure of many beloved local shops. Small businesses, in particular, have struggled to compete with the logistical capabilities and marketing budgets of large online platforms. Additionally, the environmental impact of e-commerce is increasingly under scrutiny. The convenience of home delivery comes with a significant carbon footprint — from warehouse energy consumption to the final mile of delivery. Packaging waste is another major concern, with mountains of cardboard and plastic generated by online orders. In response, some companies are exploring more sustainable practices, such as optimising delivery routes, using electric vehicles, and reducing packaging. Consumers, too, are becoming more conscious of their purchasing decisions, with some choosing to support local businesses or buy second-hand to reduce their environmental impact.',
    q:'What is one way consumers are responding to environmental concerns?',
    opts:['Shopping more online','Supporting local businesses and buying second-hand','Demanding faster delivery','Using more packaging'], ans:1 },
]

// ── A2 Questions ───────────────────────────────────────────────────────────────

export const A2_QUESTIONS: TQ[] = [
  // ── Grammar ──────────────────────────────────────────────────────────────
  { id:61, level:'A2', section:'grammar', q:'She ___ to school every day.',
    opts:['go','goes','going','gone'], ans:1 },

  { id:62, level:'A2', section:'grammar', q:'They ___ watching TV right now.',
    opts:['am','is','are','be'], ans:2 },

  { id:63, level:'A2', section:'grammar', q:'I ___ my grandmother yesterday.',
    opts:['visit','am visiting','visited','visits'], ans:2 },

  { id:64, level:'A2', section:'grammar', q:'He ___ play the guitar very well.',
    opts:['can','must','need','should'], ans:0 },

  { id:65, level:'A2', section:'grammar', q:'You ___ eat in the library. It is not allowed.',
    opts:['must','mustn\'t','can','don\'t'], ans:1 },

  { id:66, level:'A2', section:'grammar', q:'I saw ___ elephant at the zoo yesterday.',
    opts:['a','an','the','—'], ans:1 },

  { id:67, level:'A2', section:'grammar', q:'There is ___ milk in the fridge.',
    opts:['some','any','a','many'], ans:0 },

  { id:68, level:'A2', section:'grammar', q:'She was born ___ May 14th.',
    opts:['in','at','on','by'], ans:2 },

  { id:69, level:'A2', section:'grammar', q:'My bag is ___ than yours.',
    opts:['big','more big','bigger','biggest'], ans:2 },

  { id:70, level:'A2', section:'grammar', q:'We ___ very happy to see them last night.',
    opts:['was','were','are','is'], ans:1 },

  { id:71, level:'A2', section:'grammar', q:'I ___ like coffee. I prefer tea.',
    opts:['doesn\'t','don\'t','am not','not'], ans:1 },

  { id:72, level:'A2', section:'grammar', q:'She ___ breakfast at 7 o\'clock every morning.',
    opts:['have','has','having','had'], ans:1 },

  { id:73, level:'A2', section:'grammar', q:'Where ___ you go last weekend?',
    opts:['do','did','does','are'], ans:1 },

  { id:74, level:'A2', section:'grammar', q:'The cat is sleeping ___ the bed.',
    opts:['in','on','under','at'], ans:2 },

  { id:75, level:'A2', section:'grammar', q:'There ___ a book and two pens on the table.',
    opts:['am','is','are','be'], ans:1 },

  // ── Vocabulary ────────────────────────────────────────────────────────────
  { id:76, level:'A2', section:'vocabulary', q:'I ___ my teeth every morning.',
    opts:['wash','clean','brush','fix'], ans:2 },

  { id:77, level:'A2', section:'vocabulary', q:'She drinks a glass of ___ every morning.',
    opts:['bread','rice','milk','meat'], ans:2 },

  { id:78, level:'A2', section:'vocabulary', q:'My mother\'s brother is my ___.',
    opts:['grandfather','uncle','cousin','nephew'], ans:1 },

  { id:79, level:'A2', section:'vocabulary', q:'You can buy medicine at the ___.',
    opts:['library','hospital','bank','pharmacy'], ans:3 },

  { id:80, level:'A2', section:'vocabulary', q:'The opposite of "hot" is ___.',
    opts:['warm','cool','cold','wet'], ans:2 },

  { id:81, level:'A2', section:'vocabulary', q:'There are sixty ___ in an hour.',
    opts:['seconds','hours','days','minutes'], ans:3 },

  { id:82, level:'A2', section:'vocabulary', q:'A ___ is a person who teaches at a school.',
    opts:['doctor','teacher','driver','farmer'], ans:1 },

  { id:83, level:'A2', section:'vocabulary', q:'The colour of the sky on a sunny day is ___.',
    opts:['green','red','blue','yellow'], ans:2 },

  { id:84, level:'A2', section:'vocabulary', q:'She ___ to music every evening.',
    opts:['reads','listens','watches','looks'], ans:1 },

  { id:85, level:'A2', section:'vocabulary', q:'A ___ is a place where you can see old things from history.',
    opts:['museum','cinema','restaurant','market'], ans:0 },

  // ── Reading ───────────────────────────────────────────────────────────────
  { id:86, level:'A2', section:'reading',
    passage:'Sarah is a student. She gets up at 7 o\'clock every morning. First, she takes a shower and has breakfast. She usually eats toast and drinks orange juice. Then she goes to school by bus. She has lunch at school at 12 o\'clock. In the evening, she does her homework and watches TV. She goes to bed at 10 o\'clock.',
    q:'What time does Sarah get up?',
    opts:['At 6 o\'clock','At 7 o\'clock','At 8 o\'clock','At 9 o\'clock'], ans:1 },

  { id:87, level:'A2', section:'reading',
    passage:'Sarah is a student. She gets up at 7 o\'clock every morning. First, she takes a shower and has breakfast. She usually eats toast and drinks orange juice. Then she goes to school by bus. She has lunch at school at 12 o\'clock. In the evening, she does her homework and watches TV. She goes to bed at 10 o\'clock.',
    q:'What does Sarah drink for breakfast?',
    opts:['Milk','Water','Orange juice','Tea'], ans:2 },

  { id:88, level:'A2', section:'reading',
    passage:'Sarah is a student. She gets up at 7 o\'clock every morning. First, she takes a shower and has breakfast. She usually eats toast and drinks orange juice. Then she goes to school by bus. She has lunch at school at 12 o\'clock. In the evening, she does her homework and watches TV. She goes to bed at 10 o\'clock.',
    q:'How does Sarah go to school?',
    opts:['By car','By bus','By bike','On foot'], ans:1 },

  { id:89, level:'A2', section:'reading',
    passage:'Sarah is a student. She gets up at 7 o\'clock every morning. First, she takes a shower and has breakfast. She usually eats toast and drinks orange juice. Then she goes to school by bus. She has lunch at school at 12 o\'clock. In the evening, she does her homework and watches TV. She goes to bed at 10 o\'clock.',
    q:'Where does Sarah have lunch?',
    opts:['At home','At a restaurant','At school','At a cafe'], ans:2 },

  { id:90, level:'A2', section:'reading',
    passage:'Sarah is a student. She gets up at 7 o\'clock every morning. First, she takes a shower and has breakfast. She usually eats toast and drinks orange juice. Then she goes to school by bus. She has lunch at school at 12 o\'clock. In the evening, she does her homework and watches TV. She goes to bed at 10 o\'clock.',
    q:'What does Sarah do in the evening?',
    opts:['Plays with friends','Does her homework','Cooks dinner','Cleans the house'], ans:1 },

  // ── A2 Additional Grammar (15) ────────────────────────────────────
  { id:230, level:'A2', section:'grammar', q:'We ___ going to the park tomorrow.',
    opts:['am','is','are','be'], ans:2 },

  { id:231, level:'A2', section:'grammar', q:'She ___ her homework every evening.',
    opts:['do','does','doing','done'], ans:1 },

  { id:232, level:'A2', section:'grammar', q:'They ___ not like spicy food.',
    opts:['do','does','are','is'], ans:0 },

  { id:233, level:'A2', section:'grammar', q:'I ___ a new bicycle last week.',
    opts:['buy','buys','bought','buying'], ans:2 },

  { id:234, level:'A2', section:'grammar', q:'___ you speak English?',
    opts:['Are','Do','Does','Is'], ans:1 },

  { id:235, level:'A2', section:'grammar', q:'She is ___ girl in our class.',
    opts:['tall','taller','tallest','more tall'], ans:2 },

  { id:236, level:'A2', section:'grammar', q:'We have ___ finished our homework.',
    opts:['yet','already','since','for'], ans:1 },

  { id:237, level:'A2', section:'grammar', q:'He usually ___ up at 6 o\'clock.',
    opts:['wake','wakes','waking','woke'], ans:1 },

  { id:238, level:'A2', section:'grammar', q:'There are ___ apples on the table.',
    opts:['some','any','a','an'], ans:0 },

  { id:239, level:'A2', section:'grammar', q:'She is ___ than her sister.',
    opts:['tall','taller','tallest','more tall'], ans:1 },

  { id:240, level:'A2', section:'grammar', q:'What ___ you doing right now?',
    opts:['am','is','are','be'], ans:2 },

  { id:241, level:'A2', section:'grammar', q:'I ___ like to have a glass of water, please.',
    opts:['would','will','can','must'], ans:0 },

  { id:242, level:'A2', section:'grammar', q:'The weather was ___ yesterday.',
    opts:['rain','rainy','raining','rained'], ans:1 },

  { id:243, level:'A2', section:'grammar', q:'We ___ to London three times.',
    opts:['have been','went','go','are going'], ans:0 },

  { id:244, level:'A2', section:'grammar', q:'He doesn\'t ___ to school on Sundays.',
    opts:['go','goes','going','went'], ans:0 },

  // ── A2 Additional Vocabulary (10) ────────────────────────────────
  { id:245, level:'A2', section:'vocabulary', q:'I need to ___ some water. I am thirsty.',
    opts:['eat','drink','cook','cut'], ans:1 },

  { id:246, level:'A2', section:'vocabulary', q:'She wears ___ on her feet.',
    opts:['gloves','shoes','hat','scarf'], ans:1 },

  { id:247, level:'A2', section:'vocabulary', q:'The ___ is shining brightly today.',
    opts:['moon','sun','star','cloud'], ans:1 },

  { id:248, level:'A2', section:'vocabulary', q:'I ___ my friend\'s birthday party next Saturday.',
    opts:['visit','attend','join','go'], ans:1 },

  { id:249, level:'A2', section:'vocabulary', q:'Please ___ the door before you leave.',
    opts:['open','close','lock','knock'], ans:2 },

  { id:250, level:'A2', section:'vocabulary', q:'My favourite ___ is pizza.',
    opts:['drink','food','colour','animal'], ans:1 },

  { id:251, level:'A2', section:'vocabulary', q:'She ___ a letter to her grandmother.',
    opts:['wrote','read','drew','painted'], ans:0 },

  { id:252, level:'A2', section:'vocabulary', q:'We need to buy some ___ for the salad.',
    opts:['vegetables','books','clothes','toys'], ans:0 },

  { id:253, level:'A2', section:'vocabulary', q:'The train ___ at 9 o\'clock in the morning.',
    opts:['arrives','leaves','departs','starts'], ans:0 },

  { id:254, level:'A2', section:'vocabulary', q:'I ___ my keys. I can\'t find them anywhere.',
    opts:['lost','found','kept','hid'], ans:0 },

  // ── A2 Additional Reading (5) ────────────────────────────────────
  { id:255, level:'A2', section:'reading',
    passage:'Tom lives in a small town near the sea. Every weekend, he goes to the beach with his family. Tom likes to swim in the sea and collect shells on the sand. His little sister, Emma, likes to build sandcastles. Their mother brings sandwiches and fruit for lunch. They usually stay at the beach for three or four hours. Tom says the best part of the day is watching the sunset over the water.',
    q:'Where does Tom go every weekend?',
    opts:['To the park','To the beach','To the mountains','To the library'], ans:1 },

  { id:256, level:'A2', section:'reading',
    passage:'Tom lives in a small town near the sea. Every weekend, he goes to the beach with his family. Tom likes to swim in the sea and collect shells on the sand. His little sister, Emma, likes to build sandcastles. Their mother brings sandwiches and fruit for lunch. They usually stay at the beach for three or four hours. Tom says the best part of the day is watching the sunset over the water.',
    q:'What does Tom like to do at the beach?',
    opts:['Build sandcastles','Swim and collect shells','Play with a ball','Read a book'], ans:1 },

  { id:257, level:'A2', section:'reading',
    passage:'Tom lives in a small town near the sea. Every weekend, he goes to the beach with his family. Tom likes to swim in the sea and collect shells on the sand. His little sister, Emma, likes to build sandcastles. Their mother brings sandwiches and fruit for lunch. They usually stay at the beach for three or four hours. Tom says the best part of the day is watching the sunset over the water.',
    q:'What does their mother bring for lunch?',
    opts:['Pizza and cake','Sandwiches and fruit','Rice and meat','Bread and cheese'], ans:1 },

  { id:258, level:'A2', section:'reading',
    passage:'Tom lives in a small town near the sea. Every weekend, he goes to the beach with his family. Tom likes to swim in the sea and collect shells on the sand. His little sister, Emma, likes to build sandcastles. Their mother brings sandwiches and fruit for lunch. They usually stay at the beach for three or four hours. Tom says the best part of the day is watching the sunset over the water.',
    q:'How long do they usually stay at the beach?',
    opts:['One or two hours','Three or four hours','The whole day','Until sunset'], ans:1 },

  { id:259, level:'A2', section:'reading',
    passage:'Tom lives in a small town near the sea. Every weekend, he goes to the beach with his family. Tom likes to swim in the sea and collect shells on the sand. His little sister, Emma, likes to build sandcastles. Their mother brings sandwiches and fruit for lunch. They usually stay at the beach for three or four hours. Tom says the best part of the day is watching the sunset over the water.',
    q:'What is the best part of the day for Tom?',
    opts:['Swimming in the sea','Watching the sunset','Eating lunch','Collecting shells'], ans:1 },
]

// ── IELTS Writing prompts ─────────────────────────────────────────────────────

export const IELTS_WRITING_TASK1 = {
  title: 'Task 1 — Data Description (150+ so\'z)',
  prompt: `The table below shows average daily internet usage (in hours) across five countries in 2023:

  Japan: 3.5h  |  United Kingdom: 5.2h  |  USA: 7.1h  |  Brazil: 8.4h  |  India: 6.3h

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.`,
  minWords: 150,
}

export const IELTS_WRITING_TASK2 = {
  title: 'Task 2 — Essay (250+ so\'z)',
  prompt: 'In many countries, young people are spending more time on social media than ever before. Some argue this has a negative impact on mental health and social skills. Others believe it brings important benefits. Discuss both views and give your own opinion.',
  minWords: 250,
}

// ── IELTS Listening text + MCQ ────────────────────────────────────────────────

export const IELTS_LISTENING_TEXT = `Working from home has become one of the most significant changes in modern work culture.
During the pandemic, millions of employees worldwide were forced to work remotely, and many have continued
to do so even after restrictions were lifted. Surveys show that a majority of workers now prefer a hybrid
model — splitting time between home and the office.

Supporters argue that remote work improves productivity by eliminating the daily commute and reducing
workplace distractions. Employees also report better work-life balance and reduced stress levels.
For companies, the shift can reduce overheads by requiring less office space.

However, critics highlight several challenges. Remote workers may feel isolated and disconnected from
colleagues, which can affect team morale and collaboration. Junior employees, in particular, miss out
on informal mentoring that happens naturally in office environments. There are also concerns about
the blurring of boundaries between work and personal life.`

export interface ListeningMCQ {
  id:   number
  q:    string
  opts: [string, string, string, string]
  ans:  number
}

export const IELTS_LISTENING_MCQ: ListeningMCQ[] = [
  { id:1, q:'What major event forced millions to work remotely?',
    opts:['A financial crisis','The pandemic','A transport strike','New government policy'], ans:1 },
  { id:2, q:'What model do most workers now prefer, according to surveys?',
    opts:['Fully remote','Fully office-based','A hybrid model','Freelance work'], ans:2 },
  { id:3, q:'Which of the following is given as an advantage of remote work?',
    opts:['More meetings','Faster career growth','Improved work-life balance','Larger salaries'], ans:2 },
  { id:4, q:'How can remote work benefit companies financially?',
    opts:['Higher productivity bonuses','Less office space needed','Cheaper equipment','Reduced hiring costs'], ans:1 },
  { id:5, q:'What concern about junior employees is mentioned?',
    opts:['They work longer hours','They earn less','They miss informal mentoring','They struggle with technology'], ans:2 },
  { id:6, q:'According to the text, remote work can cause workers to feel:',
    opts:['More creative','Isolated from colleagues','Better motivated','More focused'], ans:1 },
  { id:7, q:'What does "blurring of boundaries" refer to in the final paragraph?',
    opts:['Unclear job roles','Work and personal life becoming mixed','Poor office design','Unreliable internet connections'], ans:1 },
  { id:8, q:'Which sentence best summarises the text?',
    opts:['Remote work has only negative effects','Remote work has replaced office work entirely','Remote work has both benefits and drawbacks','Companies prefer office-based work'], ans:2 },
]

// ── Band score conversion ─────────────────────────────────────────────────────

export function pctToBand(pct: number): number {
  if (pct >= 90) return 8.5
  if (pct >= 80) return 7.5
  if (pct >= 73) return 7.0
  if (pct >= 67) return 6.5
  if (pct >= 60) return 6.0
  if (pct >= 53) return 5.5
  if (pct >= 45) return 5.0
  if (pct >= 38) return 4.5
  return 4.0
}

export function scoreToBand(score: number): number {
  // score 1-10 from Claude → IELTS band
  const pct = (score / 10) * 100
  return pctToBand(pct)
}

export function roundBand(band: number): number {
  return Math.round(band * 2) / 2  // round to nearest 0.5
}

// ── IELTS Listening B1 ─────────────────────────────────────────────

export const IELTS_LISTENING_TEXT_B1 = `I want to tell you about my recent trip to Paris. It was my first time visiting France, and I went there with two friends last summer. We stayed for five days in a small hotel near the city centre. The room was not very big, but it was clean and comfortable. The hotel staff were friendly and helpful. On the first day, we visited the Eiffel Tower. We took many photos and went up to the top. The view of the city from up there was amazing. We could see all the famous buildings. On the second day, we went to the Louvre Museum. I was surprised by how big it was. We spent almost four hours there but we only saw a small part of the collection. We also tried French food. I really enjoyed the croissants and cheese. My friend tried snails, but he did not like them very much. On our last evening, we took a boat trip on the River Seine. The city lights were beautiful at night. I learned a few French words before the trip, which helped me order food and ask for directions. Overall, it was a wonderful experience. I want to go back to France one day and visit other cities like Lyon and Marseille.`

export const IELTS_LISTENING_MCQ_B1: ListeningMCQ[] = [
  { id:1, q:'How many people went on the trip to Paris?',
    opts:['One','Two','Three','Four'], ans:2 },
  { id:2, q:'How long did the travellers stay in Paris?',
    opts:['Three days','Four days','Five days','One week'], ans:2 },
  { id:3, q:'What did the speaker do on the first day?',
    opts:['Visited a museum','Went to the Eiffel Tower','Took a boat trip','Tried French food'], ans:1 },
  { id:4, q:'How long did the speaker spend at the Louvre Museum?',
    opts:['Two hours','Three hours','Almost four hours','The whole day'], ans:2 },
  { id:5, q:'What did the speaker learn before the trip?',
    opts:['How to cook French food','Some French words','How to drive in France','French history'], ans:1 },
]

// ── IELTS Listening B2 ─────────────────────────────────────────────

export const IELTS_LISTENING_TEXT_B2 = `Today I would like to discuss the complex relationship between social media use and mental health. While social media platforms have undoubtedly revolutionised the way we connect and communicate, a growing body of research suggests that their impact on psychological wellbeing is far from straightforward. On one hand, social media can foster a sense of community and belonging, particularly for individuals who may feel isolated in their offline lives. It provides access to support networks and allows people to maintain relationships across geographical distances. However, the picture becomes considerably more complicated when we examine the negative effects. Numerous studies have established a correlation between heavy social media use and increased rates of anxiety, depression, and poor sleep quality. One explanation is the phenomenon of social comparison — users constantly compare their own lives to the carefully curated highlights of others, which can lead to feelings of inadequacy. Furthermore, the addictive nature of these platforms, engineered to maximise engagement, can result in excessive screen time and reduced face-to-face interaction. The impact appears to be particularly pronounced among adolescents, whose developing brains may be more susceptible to social validation cues. Nevertheless, it would be overly simplistic to claim that social media is inherently harmful. Much depends on how these platforms are used — passive consumption of content seems to be more detrimental than active interaction with meaningful communities. In conclusion, while social media presents clear risks to mental health, a nuanced understanding of usage patterns is essential for developing effective strategies to mitigate harm.`

export const IELTS_LISTENING_MCQ_B2: ListeningMCQ[] = [
  { id:1, q:'What is the main topic of the lecture?',
    opts:['The evolution of social media platforms','Social media and its links to mental health','How to reduce screen time effectively','The history of social comparison theory'], ans:1 },
  { id:2, q:'What positive aspect of social media is mentioned?',
    opts:['It improves academic performance','It fosters community and belonging','It increases physical activity','It replaces traditional therapy'], ans:1 },
  { id:3, q:'What does the speaker identify as a reason for the negative effects of social media?',
    opts:['Increased productivity','Social comparison with others','Better communication skills','Reduced advertisement exposure'], ans:1 },
  { id:4, q:'Which group is mentioned as being particularly affected?',
    opts:['Elderly people','Middle-aged adults','Adolescents','Preschool children'], ans:2 },
  { id:5, q:'What does the speaker suggest about social media usage?',
    opts:['All usage is equally harmful','Active interaction is less harmful than passive consumption','It should be banned for teenagers','Only visual content causes problems'], ans:1 },
]

// ── Combined export ────────────────────────────────────────────────────────────

export const MOCK_TEST_QUESTIONS: TQ[] = [...A1_QUESTIONS, ...A2_QUESTIONS, ...B1_QUESTIONS, ...B2_QUESTIONS]
