// Sync upgraded listening sections to Supabase lesson_skills table
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load env vars directly from .env file
const envPath = '.env';
let envContent = '';
try {
  envContent = readFileSync(envPath, 'utf-8');
} catch {
  // Try reading from parent or different locations
  try {
    envContent = readFileSync('../.env', 'utf-8');
  } catch {
    console.error('Could not find .env file');
    process.exit(1);
  }
}

function getEnvVar(name) {
  const match = envContent.match(new RegExp(`^${name}=(.+)$`, 'm'));
  return match ? match[1].trim() : null;
}

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// The upgraded listening data for present-continuous
const presentContinuousListening = {
  youtubeId: 'xFsYrTIndhI',
  transcript: "Mum: Doniyor, what are you doing?\nDoniyor: I'm doing my homework, Mum.\nMum: No, you aren't. You're playing on your phone!\nDoniyor: OK, I'm not playing. I'm checking a message from my teacher.\nMum: What is your sister doing?\nDoniyor: She's watching TV in the living room. She isn't studying today.\nMum: And where is Dad?\nDoniyor: He's working in the garden. He's planting some flowers.\nMum: OK. I'm going to the market now. I'm buying some fruit.\nDoniyor: Can you buy some apples, please?\nMum: Sure. Now please do your homework!\nDoniyor: OK, Mum. I'm starting now!",
  source: "Original dialogue for English learners",
  duration: "~1 minute",
  difficulty: "easy",
  topic: "A mother checking what her family is doing at home",
  vocabulary: [
    { word: "homework", definition: "school work done at home", example: "I am doing my homework right now." },
    { word: "playing", definition: "having fun or doing an activity", example: "The children are playing in the garden." },
    { word: "phone", definition: "a device for calling or texting", example: "She is talking on her phone." },
    { word: "working", definition: "doing a job or task", example: "My father is working in the garden." },
    { word: "planting", definition: "putting seeds or plants in the ground", example: "He is planting flowers in the garden." },
    { word: "market", definition: "a place where people buy food", example: "My mother is going to the market." },
  ],
  mainIdea: [
    "A mother checks what her family members are doing at home.",
    "Doniyor pretends to do homework but is playing on his phone.",
    "Everyone in the family is busy with different activities.",
  ],
  questions: [
    { id: 1, type: "multiple-choice", question: "What does Mum think Doniyor is doing?", options: ["Homework","Playing on his phone","Reading","Sleeping"], correctIndex: 1, explanation: "'You're playing on your phone!' \u2014 present continuous for action in progress.", difficulty: "easy" },
    { id: 2, type: "multiple-choice", question: "What is the sister doing?", options: ["Studying","Watching TV","Playing games","Cooking"], correctIndex: 1, explanation: "'She's watching TV in the living room' \u2014 present continuous.", difficulty: "easy" },
    { id: 3, type: "multiple-choice", question: "What is Dad doing?", options: ["Sleeping","Working in the garden","Cooking","Shopping"], correctIndex: 1, explanation: "'He's working in the garden. He's planting some flowers' \u2014 present continuous.", difficulty: "easy" },
    { id: 4, type: "multiple-choice", question: "Where is Mum going?", options: ["To work","To the market","To the garden","To school"], correctIndex: 1, explanation: "'I'm going to the market now' \u2014 present continuous for actions happening now.", difficulty: "easy" },
    { id: 5, type: "true-false", question: "Doniyor is doing his homework when Mum asks him.", answer: false, explanation: "Mum says 'You're playing on your phone!' \u2014 present continuous negative.", difficulty: "easy" },
    { id: 6, type: "true-false", question: "Doniyor's sister is studying in the living room.", answer: false, explanation: "'She's watching TV in the living room. She isn't studying today.' \u2014 present continuous negative.", difficulty: "easy" },
    { id: 7, type: "true-false", question: "Doniyor says he is checking a message from his teacher.", answer: true, explanation: "Doniyor says 'I'm checking a message from my teacher.' \u2014 he is making an excuse.", difficulty: "easy" },
    { id: 8, type: "fill-blank", question: "Dad is _____ flowers in the garden.", answer: "planting", explanation: "'He's planting some flowers' \u2014 present continuous for an action happening now.", difficulty: "easy" },
    { id: 9, type: "fill-blank", question: "Doniyor says: 'I'm _____ a message from my teacher.'", answer: "checking", explanation: "'I'm checking a message' \u2014 present continuous for an action in progress.", difficulty: "easy" },
    { id: 10, type: "ordering", question: "Put Mum's plan in the correct order:", options: ["Buy fruit", "Go to the market", "Come back home"], correctOrder: [1, 0, 2], explanation: "Mum says: 'I'm going to the market now. I'm buying some fruit.' We can infer she will come back.", difficulty: "medium" },
    { id: 11, type: "matching", question: "Match each person to what they are doing:", pairs: [{ left: "Doniyor", right: "playing on his phone" }, { left: "Sister", right: "watching TV" }, { left: "Dad", right: "working in the garden" }, { left: "Mum", right: "going to the market" }], explanation: "Each family member is doing a different activity right now.", difficulty: "medium" },
    { id: 12, type: "multiple-answer", question: "Which of these are TRUE about Doniyor? Select all that apply:", options: ["He is doing his homework", "He is playing on his phone", "He asks Mum to buy apples", "He is starting his homework at the end"], correctIndices: [1, 2, 3], explanation: "Doniyor is playing on his phone, asks for apples, and finally says he is starting his homework.", difficulty: "medium" },
    { id: 13, type: "multiple-choice", question: "What does Doniyor ask his mother to buy?", options: ["Bananas","Apples","Bread","Milk"], correctIndex: 1, explanation: "'Can you buy some apples, please?' \u2014 Doniyor asks his mother to buy apples.", difficulty: "easy" },
    { id: 14, type: "fill-blank", question: "Mum tells Doniyor: 'Now please do your _____!'", answer: "homework", explanation: "'Now please do your homework!' \u2014 Mum insists Doniyor does his homework.", difficulty: "easy" },
  ],
  dictation: [
    { startLine: 0, endLine: 0 },
    { startLine: 6, endLine: 6 },
    { startLine: 9, endLine: 9 },
  ],
  discussion: [
    { question: "What are you doing right now? Tell your study partner.", hints: ["I am...", "Right now I am...", "At the moment I am..."] },
    { question: "What are the people in your family doing at this moment?", hints: ["My mother is...", "My father is...", "My sister/brother is..."] },
    { question: "Do you think Doniyor was being honest? Why or why not?", hints: ["He said he was doing homework but...", "He was checking a message..."] },
  ],
};

// The upgraded listening data for past-continuous
const pastContinuousListening = {
  youtubeId: 'uTB5I8V9Eog',
  transcript: "Dilnoza: Where were you at 6 PM yesterday? I called you!\nRustam: I was playing football with my friends. I didn't hear my phone.\nDilnoza: Was it raining at that time?\nRustam: Yes, it was raining a little. But we were having so much fun that we didn't notice!\nDilnoza: I was doing my homework when I called you. I needed help with maths.\nRustam: Sorry! My phone was charging at home. I wasn't carrying it.\nDilnoza: What was your brother doing while you were playing?\nRustam: He was studying for his exam. He wasn't playing with us.\nDilnoza: My sister was cooking dinner when I finished my homework. The food was delicious!\nRustam: I'm sorry I missed your call. I'll help you with maths tomorrow.",
  source: "Original dialogue for English learners",
  duration: "~1 minute",
  difficulty: "easy",
  topic: "Two friends talking about what they were doing yesterday evening",
  vocabulary: [
    { word: "yesterday", definition: "the day before today", example: "I was at home yesterday." },
    { word: "calling", definition: "trying to phone someone", example: "I was calling you but you didn't answer." },
    { word: "raining", definition: "water falling from the sky", example: "It was raining all morning." },
    { word: "charging", definition: "putting electricity into a device", example: "My phone was charging on the table." },
    { word: "exam", definition: "an important test", example: "He was studying for his final exam." },
    { word: "homework", definition: "school work done at home", example: "I was doing my maths homework." },
  ],
  mainIdea: [
    "Dilnoza called Rustam yesterday but he didn't answer.",
    "Rustam was playing football and didn't hear his phone.",
    "Dilnoza needed help with maths homework.",
  ],
  questions: [
    { id: 1, type: "multiple-choice", question: "What was Rustam doing at 6 PM yesterday?", options: ["Studying","Playing football","Sleeping","Cooking"], correctIndex: 1, explanation: "'I was playing football with my friends' \u2014 past continuous for an action in progress at a specific past time.", difficulty: "easy" },
    { id: 2, type: "multiple-choice", question: "Was it raining at that time?", options: ["Yes, heavily","Yes, a little","No, it wasn't","It was snowing"], correctIndex: 1, explanation: "'Yes, it was raining a little' \u2014 past continuous for ongoing weather at a past moment.", difficulty: "easy" },
    { id: 3, type: "multiple-choice", question: "What was Dilnoza doing when she called?", options: ["Playing","Doing homework","Cooking","Reading"], correctIndex: 1, explanation: "'I was doing my homework when I called you' \u2014 past continuous for an ongoing action in the past.", difficulty: "easy" },
    { id: 4, type: "multiple-choice", question: "What was Rustam's brother doing while Rustam was playing?", options: ["Playing football","Studying for an exam","Sleeping","Cooking dinner"], correctIndex: 1, explanation: "'He was studying for his exam. He wasn't playing with us.' \u2014 past continuous.", difficulty: "easy" },
    { id: 5, type: "true-false", question: "Rustam heard his phone ringing but chose not to answer.", answer: false, explanation: "Rustam says 'I didn't hear my phone' \u2014 he didn't hear it because he was playing.", difficulty: "easy" },
    { id: 6, type: "true-false", question: "Rustam's phone was charging at home when Dilnoza called.", answer: true, explanation: "'My phone was charging at home. I wasn't carrying it.' \u2014 past continuous for where the phone was.", difficulty: "easy" },
    { id: 7, type: "true-false", question: "Dilnoza's sister was cooking dinner when Dilnoza finished her homework.", answer: true, explanation: "'My sister was cooking dinner when I finished my homework.' \u2014 past continuous with past simple interruption.", difficulty: "medium" },
    { id: 8, type: "fill-blank", question: "Rustam was _____ football with his friends at 6 PM.", answer: "playing", explanation: "'I was playing football with my friends' \u2014 past continuous action.", difficulty: "easy" },
    { id: 9, type: "fill-blank", question: "Dilnoza needed help with _____ homework.", answer: "maths", explanation: "'I needed help with maths' \u2014 the subject she was studying.", difficulty: "easy" },
    { id: 10, type: "ordering", question: "Put the events in the order they happened:", options: ["Dilnoza called Rustam", "Rustam was playing football", "Dilnoza finished her homework", "Rustam's sister was cooking dinner"], correctOrder: [1, 0, 2, 3], explanation: "Rustam was playing when Dilnoza called. When she finished her homework, her sister was cooking.", difficulty: "medium" },
    { id: 11, type: "matching", question: "Match each person to what they were doing at 6 PM yesterday:", pairs: [{ left: "Rustam", right: "playing football" }, { left: "Rustam's brother", right: "studying for an exam" }, { left: "Dilnoza's sister", right: "cooking dinner" }, { left: "Dilnoza", right: "doing homework" }], explanation: "Each person was doing a different activity at that past moment.", difficulty: "medium" },
    { id: 12, type: "multiple-answer", question: "Why didn't Rustam answer Dilnoza's call? Select all that apply:", options: ["He was playing football", "He didn't hear his phone", "He didn't want to talk", "His phone was at home charging"], correctIndices: [0, 1, 3], explanation: "Rustam didn't hear his phone because he was playing football and his phone was charging at home.", difficulty: "medium" },
    { id: 13, type: "multiple-choice", question: "What does Rustam promise to do?", options: ["Call Dilnoza later","Help her with maths tomorrow","Stop playing football","Bring his phone next time"], correctIndex: 1, explanation: "'I'll help you with maths tomorrow.' \u2014 Rustam promises future help.", difficulty: "easy" },
  ],
  dictation: [
    { startLine: 0, endLine: 0 },
    { startLine: 2, endLine: 2 },
    { startLine: 8, endLine: 8 },
  ],
  discussion: [
    { question: "What were you doing yesterday at 5 PM? Tell your partner.", hints: ["I was...", "At 5 PM yesterday I was...", "I was...-ing when..."] },
    { question: "Have you ever missed an important call because you were busy? What happened?", hints: ["I was... when someone called", "I didn't hear because...", "I called them back..."] },
    { question: "What were your family members doing at 7 PM yesterday?", hints: ["My mother was...", "My father was...", "My siblings were..."] },
  ],
};

async function syncToSupabase() {
  console.log('Connecting to Supabase...');
  
  // Upsert present-continuous
  const { error: err1 } = await supabase
    .from('lesson_skills')
    .upsert({
      lesson_id: 'present-continuous',
      listening: presentContinuousListening,
    }, { onConflict: 'lesson_id' });

  if (err1) {
    console.error('Error upserting present-continuous:', err1.message);
  } else {
    console.log('present-continuous: synced to Supabase successfully');
  }

  // Upsert past-continuous
  const { error: err2 } = await supabase
    .from('lesson_skills')
    .upsert({
      lesson_id: 'past-continuous',
      listening: pastContinuousListening,
    }, { onConflict: 'lesson_id' });

  if (err2) {
    console.error('Error upserting past-continuous:', err2.message);
  } else {
    console.log('past-continuous: synced to Supabase successfully');
  }

  if (!err1 && !err2) {
    console.log('\nBoth lessons synced! Refresh your browser and check the listening sections.');
  }
}

syncToSupabase().catch(console.error);
