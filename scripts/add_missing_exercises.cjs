const fs = require('fs');

function insertAfterLastId(filePath, newExercises) {
  let c = fs.readFileSync(filePath, 'utf8');
  
  const exStart = c.indexOf('"exercises"');
  if (exStart === -1) {
    console.log('ERROR: exercises not found in', filePath);
    return;
  }

  const exercisesSection = c.substring(exStart);
  const exEnd = exercisesSection.indexOf('"exerciseSections"');
  const exercisesJson = exercisesSection.substring(0, exEnd);
  
  const idRegex = /"id":\s*(\d+)/g;
  let match;
  let lastId = 0;
  let lastPos = 0;
  
  while ((match = idRegex.exec(exercisesJson)) !== null) {
    lastId = parseInt(match[1]);
    lastPos = exStart + match.index;
  }
  
  // Find the closing of the last exercise object
  const afterLastId = c.substring(lastPos);
  const closeBrace = afterLastId.indexOf('}');
  const insertionPoint = lastPos + closeBrace + 1;
  
  const newExercisesStr = newExercises.map((ex, i) => {
    let json = JSON.stringify(ex, null, 4);
    if (i < newExercises.length - 1) {
      json += ',';
    }
    return json;
  }).join('\n    ');
  
  const before = c.substring(0, insertionPoint);
  const after = c.substring(insertionPoint);
  
  fs.writeFileSync(filePath, before + ',\n    ' + newExercisesStr + after, 'utf8');
  console.log('Added', newExercises.length, 'exercises to', filePath, '(last id was', lastId + ')');
}

const relEx = [
  { id: 2621, type: 'fill-blank', blanks: ['whose'], question: 'The girl ___ brother is a pilot studies with me.', explanation: "Whose = egalik", instruction: "Whose:" },
  { id: 2622, type: 'fill-blank', blanks: ['whom'], question: "The professor ___ I respect most is Dr. Karimov.", explanation: "Whom = obekt", instruction: "Whom:" },
  { id: 2623, type: 'fill-blank', blanks: ['that'], question: "Everything ___ you said is true.", explanation: "Everything + that", instruction: "That:" },
  { id: 2624, type: 'fill-blank', blanks: ['where'], question: "Is this the hotel ___ you stayed last summer?", explanation: "Where = joy", instruction: "Where:" },
  { id: 2625, type: 'fill-blank', blanks: ['when'], question: "Do you remember the summer ___ we went to the mountains?", explanation: "When = vaqt", instruction: "When:" },
  { id: 2626, type: 'multiple-choice', correct: 'who', options: ['which', 'who', 'whose', 'where'], question: "The woman ___ won the prize is my aunt.", explanation: "Who = odam", instruction: "Tanlang:" },
  { id: 2627, type: 'multiple-choice', correct: 'which', options: ['who', 'whose', 'which', 'when'], question: "I need a job ___ pays well.", explanation: "Which = narsa", instruction: "Tanlang:" },
  { id: 2628, type: 'multiple-choice', correct: 'The house which I bought', options: ['The house which I bought', 'The house who I bought', 'The house where I bought', 'The house whom I bought'], question: "CORRECT defining clause:", explanation: "Which = narsa", instruction: "Tanlang:" },
  { id: 2629, type: 'multiple-choice', correct: 'My uncle, who lives in Samarkand, is a doctor', options: ['My uncle, who lives in Samarkand, is a doctor', 'My uncle who lives in Samarkand is a doctor', 'My uncle, that lives in Samarkand, is a doctor', 'My uncle which lives in Samarkand is a doctor'], question: "Non-defining uchun CORRECT?", explanation: "Non-defining -> commas + who", instruction: "Tanlang:" },
  { id: 2630, type: 'error-correction', correct: 'The person who called you is waiting.', question: 'The person called you is waiting.', errorPart: 'called', explanation: "Ega -> pronoun kerak", instruction: "Xato:" },
  { id: 2631, type: 'error-correction', correct: 'I liked the film which you recommended.', question: 'I liked the film who you recommended.', errorPart: 'who', explanation: "Narsa -> which", instruction: "Xato:" },
  { id: 2632, type: 'error-correction', correct: 'Tashkent, where I was born, is beautiful.', question: 'Tashkent, that I was born, is beautiful.', errorPart: 'that', explanation: "Non-defining -> where", instruction: "Xato:" },
  { id: 2633, type: 'transformation', hint: 'The man who...', correct: 'The man who fixed my car was very professional.', question: 'The man fixed my car. He was very professional.', explanation: "Who = birlashtirish", instruction: "Birlashtiring:" },
  { id: 2634, type: 'transformation', hint: 'The restaurant where...', correct: 'The restaurant where we ate had excellent service.', question: 'We ate at a restaurant. It had excellent service.', explanation: "Where = joy", instruction: "Birlashtiring:" },
  { id: 2635, type: 'transformation', hint: 'The children whose...', correct: 'The children whose parents volunteered got a prize.', question: 'Some children got a prize. Their parents volunteered.', explanation: "Whose = egalik", instruction: "Birlashtiring:" },
  { id: 2636, type: 'multiple-choice', correct: 'whom', options: ['who', 'whom', 'whose', 'which'], question: "Formal: The candidate ___ we interviewed.", explanation: "Whom = obekt", instruction: "Tanlang:" },
  { id: 2637, type: 'fill-blank', blanks: ['which'], question: 'The gift ___ I received was very thoughtful.', explanation: "Which = narsa", instruction: "Pronoun:" },
];

const pvEx = [
  { id: 2821, type: 'fill-blank', blanks: ['into'], question: "I ran ___ an old friend at the market.", explanation: "Run into", instruction: "Inseparable:" },
  { id: 2822, type: 'fill-blank', blanks: ['out'], question: "We need to find ___ what happened.", explanation: "Find out", instruction: "Separable:" },
  { id: 2823, type: 'fill-blank', blanks: ['through'], question: "She has been ___ a lot lately.", explanation: "Go through", instruction: "Phrasal:" },
  { id: 2824, type: 'multiple-choice', correct: 'off', options: ['on', 'off', 'up', 'down'], question: "Please turn ___ the TV before sleeping.", explanation: "Turn off", instruction: "Tanlang:" },
  { id: 2825, type: 'multiple-choice', correct: 'out', options: ['in', 'out', 'up', 'off'], question: "We ran ___ of milk.", explanation: "Run out of", instruction: "Tanlang:" },
  { id: 2826, type: 'multiple-choice', correct: 'bring up', options: ['bring up', 'look after', 'give up', 'put off'], question: "She had to ___ three children alone.", explanation: "Bring up", instruction: "Tanlang:" },
  { id: 2827, type: 'error-correction', correct: 'He takes after his father.', question: 'He takes his father after.', errorPart: 'his father after', explanation: "Take after = inseparable", instruction: "Xato:" },
  { id: 2828, type: 'error-correction', correct: 'Turn off the lights before leaving.', question: 'Turn the lights before leaving off.', errorPart: 'before leaving off', explanation: "Separable: verb + particle + noun", instruction: "Xato:" },
  { id: 2829, type: 'transformation', hint: 'I put on...', correct: 'I put on my jacket because it was cold.', question: 'I put my jacket on because it was cold.', explanation: "Separable word order", instruction: "O'zgartiring:" },
  { id: 2830, type: 'transformation', hint: 'She came up with...', correct: 'She came up with a brilliant idea.', question: 'She thought of a brilliant idea. (use: come up with)', explanation: "Come up with", instruction: "O'zgartiring:" },
  { id: 2831, type: 'fill-blank', blanks: ['along'], question: "My sister and I get ___ well.", explanation: "Get along", instruction: "Phrasal:" },
  { id: 2832, type: 'fill-blank', blanks: ['away'], question: "Please put ___ your toys.", explanation: "Put away", instruction: "Separable:" },
  { id: 2833, type: 'fill-blank', blanks: ['down'], question: "The car broke ___ on the highway.", explanation: "Break down", instruction: "Inseparable:" },
];

insertAfterLastId('src/data/daily/b1Extra.ts', relEx);
console.log('Relative Clauses done');

// The phrasal verbs section is the SECOND exercises in the file
// We need to re-read the file and find the second occurrence
let c2 = fs.readFileSync('src/data/daily/b1Extra.ts', 'utf8');
let count = 0;
let searchPos = 0;

while (count < 2) {
  const found = c2.indexOf('"exercises"', searchPos);
  if (found === -1) break;
  count++;
  searchPos = found + 1;
  if (count === 2) {
    // Found the second exercises (phrasal verbs)
    const exercisesSection = c2.substring(found);
    const exEnd = exercisesSection.indexOf('"exerciseSections"');
    const exercisesJson = exercisesSection.substring(0, exEnd);
    
    const idRegex = /"id":\s*(\d+)/g;
    let match;
    let lastId = 0;
    let lastPos = 0;
    
    while ((match = idRegex.exec(exercisesJson)) !== null) {
      lastId = parseInt(match[1]);
      lastPos = found + match.index;
    }
    
    const afterLastId = c2.substring(lastPos);
    const closeBrace = afterLastId.indexOf('}');
    const insertionPoint = lastPos + closeBrace + 1;
    
    const newExercisesStr = pvEx.map((ex, i) => {
      let json = JSON.stringify(ex, null, 4);
      if (i < pvEx.length - 1) {
        json += ',';
      }
      return json;
    }).join('\n    ');
    
    const before = c2.substring(0, insertionPoint);
    const after = c2.substring(insertionPoint);
    
    fs.writeFileSync('src/data/daily/b1Extra.ts', before + ',\n    ' + newExercisesStr + after, 'utf8');
    console.log('Added', pvEx.length, 'exercises to Phrasal Verbs (last id was', lastId + ')');
  }
}
