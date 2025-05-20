//packages/server/src/index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { travelCountries } from './data/travelCountries.js'
import { travelCities } from './data/travelCountries.js'
import { fetchUnsplashImage } from './services/imageService.js'

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const matches = travelCountries.filter(...)

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
// serve public (images, sounds, etc)
app.use(express.static(path.join(__dirname, '../public')))

// — FLAG GUESSER —
const flagQuestions = [
  { prompt: 'Which country does this flag belong to?', countryCode: 'JP', options: ['France','Spain','Japan','Brazil'], answer:'Japan', continent:'Asia' },
  { prompt: 'Which country does this flag belong to?', countryCode: 'CA', options: ['Canada','Angola','Iraq','Falkland Islands'], answer:'Canada', continent:'North America' },
  { prompt: 'Which country does this flag belong to?', countryCode: 'FR', options: ['Costa Rica','France','Kosovo','Vatican City'], answer:'France', continent:'Europe' },
  // …add more…
]
const flagUrlFor = code => `https://flagcdn.com/w320/${code.toLowerCase()}.png`

app.get('/api/flagguesser', (req, res) => {
  try {
    const q = flagQuestions[Math.floor(Math.random()*flagQuestions.length)]
    res.json({
      prompt: q.prompt,
      flagUrl: flagUrlFor(q.countryCode),
      options: q.options,
      answer: q.answer,
      continent: q.continent,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load question' })
  }
})

// — 20-Q GEO-REVERSE —
const geoQuestions = Array.from({length:20}, (_,i) => ({
  id: i+1,
  question: [
    'Is it in the Northern Hemisphere?',
    'Is it in Europe?',
    'Is it landlocked?',
    'Does it border the Atlantic?',
    'Does it border the Pacific?',
    'Is English an official language?',
    'Is Arabic an official language?',
    'Is it in Africa?',
    'Is it in Asia?',
    'Is it in South America?',
    'Is it in North America?',
    'Is it an island nation?',
    'Is it a monarchy?',
    'Does it use the Euro?',
    'Is its capital a coastal city?',
    'Is the population over 50 million?',
    'Is the economy primarily service-based?',
    'Is it part of the Commonwealth?',
    'Does it have a desert?',
    'Does it have a rainforest?'
  ][i],
}))
app.get('/api/georeverse/questions', (_,res) => res.json(geoQuestions))

app.post('/api/georeverse/guess', (req, res) => {
  // naive stub: always guess “Canada”
  res.json({ guess:'Canada', correct:false })
})

// — TRAVEL MATCHMAKER —
app.post('/api/travelmatch', async (req, res) => {
  const { interests = [] } = req.body
  try {
    const matches = travelCities.filter(loc =>
      interests.some(tag => loc.tags.includes(tag))
    )

    const topResults = await Promise.all(matches.slice(0, 10).map(async loc => ({
      ...loc,
      image: await fetchUnsplashImage(loc.name + ' ' + loc.country)
    })))

    res.json(topResults)
  } catch (e) {
    console.error('Matchmaker error:', e)
    res.status(500).json({ error: 'Failed to get travel matches' })
  }
})

// — GLOBAL ADVENTURE —
const scenes = [
  { text:'You arrive at a misty port…', choices:['Explore market','Board ship'] },
  { text:'A stranger offers you a map…', choices:['Accept it','Decline'] },
  { text:'You find a hidden chest…', choices:['Open it','Leave it'] },
]
app.get('/api/adventure/next', (req, res) => {
  const step = parseInt(req.query.step)||0
  res.json(scenes[step] || { text:'The End', choices:[] })
})

// — WORLD DETECTIVE —
const clues = [
  'Clue 1: Last seen near the Eiffel Tower.',
  'Clue 2: Sighted crossing the Rhine.',
  'Clue 3: Rumored in the Swiss Alps.',
  'Clue 4: Spotted at the Leaning Tower of Pisa.',
  'Clue 5: Heading to the Spanish Steps.'
]
app.get('/api/detective/clue/:i', (req,res) => {
  const i = parseInt(req.params.i)-1
  res.json({ clue:clues[i]||'No more clues.' })
})

app.listen(PORT, () => {
  console.log(`🛰  Server running on http://localhost:${PORT}`)
})
