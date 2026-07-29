export interface MinimalPair {
  id: string
  level: 'A2' | 'B1' | 'B2'
  soundFocus: string
  pair: [string, string]
  example: [string, string]
}

export const MINIMAL_PAIRS: MinimalPair[] = [
  { id: 'ship-sheep',  level: 'A2', soundFocus: '/ɪ/ vs /iː/', pair: ['ship',  'sheep'],  example: ["The ship is big.", "The sheep is white."] },
  { id: 'live-leave',  level: 'A2', soundFocus: '/ɪ/ vs /iː/', pair: ['live',  'leave'],  example: ["Where do you live?", "When do you leave?"] },
  { id: 'bit-beat',    level: 'A2', soundFocus: '/ɪ/ vs /iː/', pair: ['bit',   'beat'],   example: ["Wait a bit.", "He can beat anyone."] },
  { id: 'hit-heat',    level: 'A2', soundFocus: '/ɪ/ vs /iː/', pair: ['hit',   'heat'],   example: ["He hit the ball.", "The heat is strong."] },
  { id: 'sit-seat',    level: 'A2', soundFocus: '/ɪ/ vs /iː/', pair: ['sit',   'seat'],   example: ["Please sit down.", "Take your seat."] },
  { id: 'bed-bad',     level: 'A2', soundFocus: '/e/ vs /æ/', pair: ['bed',   'bad'],    example: ["Time for bed.", "That's bad news."] },
  { id: 'said-sad',    level: 'A2', soundFocus: '/e/ vs /æ/', pair: ['said',  'sad'],    example: ["He said hello.", "She felt sad."] },
  { id: 'men-man',     level: 'A2', soundFocus: '/e/ vs /æ/', pair: ['men',   'man'],    example: ["Two men walked in.", "A man called."] },
  { id: 'cap-cup',     level: 'A2', soundFocus: '/æ/ vs /ʌ/', pair: ['cap',   'cup'],   example: ["A red cap.", "A hot cup."] },
  { id: 'bat-but',     level: 'A2', soundFocus: '/æ/ vs /ʌ/', pair: ['bat',   'but'],   example: ["A cricket bat.", "But I disagree."] },
  { id: 'very-berry',  level: 'A2', soundFocus: '/v/ vs /b/', pair: ['very',  'berry'],  example: ["Very good!", "A sweet berry."] },
  { id: 'vest-best',   level: 'A2', soundFocus: '/v/ vs /b/', pair: ['vest',  'best'],   example: ["A warm vest.", "Your best friend."] },
  { id: 'thin-tin',    level: 'B1', soundFocus: '/θ/ vs /t/', pair: ['thin',  'tin'],    example: ["She is thin.", "Open the tin."] },
  { id: 'three-tree',  level: 'B1', soundFocus: '/θ/ vs /t/', pair: ['three', 'tree'],   example: ["Three birds.", "A big tree."] },
  { id: 'think-tink',  level: 'B1', soundFocus: '/θ/ vs /t/', pair: ['think', 'tink'],   example: ["I think so.", "The glass will tink."] },
  { id: 'wine-vine',   level: 'B1', soundFocus: '/w/ vs /v/', pair: ['wine',  'vine'],   example: ["Red wine.", "A long vine."] },
  { id: 'west-vest',   level: 'B1', soundFocus: '/w/ vs /v/', pair: ['west',  'vest'],   example: ["The sun sets in the west.", "He wore a vest."] },
  { id: 'full-fool',   level: 'B1', soundFocus: '/ʊ/ vs /uː/', pair: ['full',  'fool'],  example: ["I'm full.", "Don't be a fool."] },
  { id: 'look-Luke',   level: 'B1', soundFocus: '/ʊ/ vs /uː/', pair: ['look',  'Luke'],  example: ["Look at this.", "Luke is my friend."] },
  { id: 'affect-effect', level: 'B2', soundFocus: '/æ/ vs /ɪ/', pair: ['affect', 'effect'], example: ["It will affect us.", "The effect is clear."] },
]
