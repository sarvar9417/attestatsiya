import type { DailyLesson } from '../dailyLessons'
import { greetingsAndNames, numbersAndAlphabet, familyAndMe } from './a0Part1'
import { greetingsAndIntroductions } from './a1Greetings'
import { alphabetAndGreetings, numbers, colorsAndShapes, family, daysAndMonths, timeAndRoutines, foodAndDrinks, animals, bodyParts, clothes } from './a1Part1'
import { demonstratives, thereIsAre, canCant, haveGot, questionWords, conjunctions, a1Review, prepositionsOfPlace, basicAdjectives } from './a1Part2'
import { articles as articlesA1 } from './a1Articles'
import { simplePresent, presentContinuous, simplePast, simpleFuture } from '../tenses/tensesData'

// A1 darslari — pedagogik ketma-ketlikda (barrel fayldan mustaqil, circular dependency yo'q)
export const A1_LESSONS_NEW: DailyLesson[] = [
  greetingsAndNames,
  numbersAndAlphabet,
  familyAndMe,
  greetingsAndIntroductions,
  alphabetAndGreetings,
  numbers,
  colorsAndShapes,
  family,
  daysAndMonths,
  timeAndRoutines,
  foodAndDrinks,
  animals,
  bodyParts,
  clothes,
  demonstratives,
  thereIsAre,
  prepositionsOfPlace,
  basicAdjectives,
  articlesA1,
  haveGot,
  canCant,
  simplePresent,
  presentContinuous,
  simplePast,
  simpleFuture,
  questionWords,
  conjunctions,
  a1Review,
]
