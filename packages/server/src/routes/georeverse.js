// File: packages/server/src/routes/georeverse.js
// Version: v3.0 - Uses centralized countryProfiles and expanded AI logic

import express from 'express'
import { countryProfiles } from '../data/countryProfiles.js'

const router = express.Router()

// Geo-reverse questions
const geoQuestions = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  key: [
    'hemisphere', 'continent', 'landlocked', 'atlantic', 'pacific',
    'english', 'arabic', 'africa', 'asia', 'southAmerica',
    'northAmerica', 'island', 'monarchy', 'euro', 'capitalCoastal',
    'populationOver50M', 'serviceEconomy', 'commonwealth', 'desert', 'rainforest'
  ][i],
  question: [
    'Is it in the Northern Hemisphere?', 'Is it in Europe?', 'Is it landlocked?',
    'Does it border the Atlantic?', 'Does it border the Pacific?',
    'Is English an official language?', 'Is Arabic an official language?',
    'Is it in Africa?', 'Is it in Asia?', 'Is it in South America?',
    'Is it in North America?', 'Is it an island nation?', 'Is it a monarchy?',
    'Does it use the Euro?', 'Is its capital a coastal city?',
    'Is the population over 50 million?', 'Is the economy primarily service-based?',
    'Is it part of the Commonwealth?', 'Does it have a desert?', 'Does it have a rainforest?'
  ][i]
}))

router.get('/questions', (_, res) => res.json(geoQuestions))

// Guess endpoint
router.post('/guess', (req, res) => {
  const { answers = [], guess = '' } = req.body
  const correct = countryProfiles.some(c => c.name.toLowerCase() === guess.trim().toLowerCase())
  res.json({ guess, correct })
})

// AI Logic
let aiSession = {
  remaining: [...countryProfiles.map(c => ({ name: c.name, facts: c }))],
  questionIndex: 0
}

router.post('/ai/start', (req, res) => {
  aiSession.remaining = [...countryProfiles.map(c => ({ name: c.name, facts: c }))]
  aiSession.questionIndex = 0
  res.json({ message: 'AI session started' })
})

router.get('/ai/question', (req, res) => {
  if (aiSession.questionIndex >= geoQuestions.length) {
    return res.json({ done: true, guess: aiSession.remaining[0]?.name || 'Unknown' })
  }
  const q = geoQuestions[aiSession.questionIndex]
  res.json({ question: q.question, key: q.key, index: aiSession.questionIndex })
})

router.post('/ai/answer', (req, res) => {
  const { key, value } = req.body // value: true/false/null
  aiSession.remaining = aiSession.remaining.filter(c => {
    const fact = c.facts[key]
    if (value === null) return true
    return fact === value
  })
  aiSession.questionIndex++
  res.json({ remaining: aiSession.remaining.length, nextQuestionIndex: aiSession.questionIndex })
})

export default router
