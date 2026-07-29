import type { RoleplayExercise } from '../data/30dayChallenge'

export function inferScenario(ex: RoleplayExercise) {
  const s = ex.scenario.toLowerCase()

  let aiRole = 'a helpful person'
  let userRole = 'a student'
  let title = ex.scenario.split('.')[0]?.trim() || 'Role-Play'

  if (s.includes('restaurant') || s.includes('waiter') || s.includes('order')) {
    aiRole = 'a friendly waiter or waitress'
    userRole = 'a customer at the restaurant'
  } else if (s.includes('coffee') || s.includes('cafe') || s.includes('barista') || s.includes('shop')) {
    aiRole = 'a friendly barista'
    userRole = 'a customer at the coffee shop'
  } else if (s.includes('direction') || s.includes('lost') || s.includes('stranger') || s.includes('train station') || s.includes('street')) {
    aiRole = 'a friendly local person'
    userRole = 'a traveler asking for help'
  } else if (s.includes('friend') || s.includes('meet') || s.includes('talking') || s.includes('catch')) {
    aiRole = 'a close friend'
    userRole = 'a friend catching up'
  } else if (s.includes('hotel') || s.includes('check')) {
    aiRole = 'a hotel receptionist'
    userRole = 'a guest checking in'
  } else if (s.includes('shop') || s.includes('store') || s.includes('buy')) {
    aiRole = 'a friendly shop assistant'
    userRole = 'a customer looking to buy something'
  } else if (s.includes('doctor') || s.includes('hospital') || s.includes('appointment')) {
    aiRole = 'a doctor or nurse'
    userRole = 'a patient at the clinic'
  } else if (s.includes('interview') || s.includes('job')) {
    aiRole = 'an interviewer'
    userRole = 'a job candidate'
  }

  const lines = ex.scenario.split(/[.!?]/)
  const firstLine = lines[0]?.trim()
  if (firstLine && firstLine.length > 5 && firstLine.length < 80) {
    title = firstLine
  }

  const opening = ex.tips && ex.tips.length > 0
    ? ex.tips[0]
    : `Hi there! Welcome! How can I help you today?`

  return { aiRole, userRole, title, opening }
}
