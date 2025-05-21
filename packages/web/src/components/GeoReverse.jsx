// packages/web/src/components/GeoReverse.jsx


// Version: v2.0 - Added mode toggle, two-game logic, and updated UI integration
// Version: v2.3 - Added Map Visualization for GeoReverse AI Final Guess

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CountryMap from './CountryMap'

export default function GeoReverse() {
  const nav = useNavigate()
  const [mode, setMode] = useState(null) // 'player' or 'ai'
  const [questions, setQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState(null)

  // AI Mode State
  const [aiQuestion, setAIQuestion] = useState(null)
  const [aiGuess, setAIGuess] = useState(null)
  const [aiDone, setAIDone] = useState(false)
  const [aiLoading, setAILoading] = useState(false)

  const MAX = 20
  const flip = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/page-flip.mp3`))
  const fanfare = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/fanfare-announcement.mp3`))

  // mock coordinates for AI guess visual (to be replaced with actual backend data)
  const guessCoords = {
    'Japan': { lat: 35.68, lng: 139.69 },
    'Canada': { lat: 45.42, lng: -75.69 },
    'Egypt': { lat: 30.04, lng: 31.24 },
    'Brazil': { lat: -15.79, lng: -47.88 }
  }

  useEffect(() => {
    if (mode === 'player') {
      fetch('/api/georeverse/questions')
        .then(res => res.json())
        .then(setQuestions)
        .catch(console.error)
    }
  }, [mode])

  async function startAIMode() {
    setAILoading(true)
    await fetch('/api/georeverse/ai/start', { method: 'POST' })
    const res = await fetch('/api/georeverse/ai/question')
    const data = await res.json()
    if (data.done) {
      setAIGuess(data.guess)
      setAIDone(true)
    } else {
      setAIQuestion(data)
    }
    setAILoading(false)
  }

  async function answerAI(value) {
    flip.current.play()
    setAILoading(true)
    await fetch('/api/georeverse/ai/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: aiQuestion.key, value })
    })
    const res = await fetch('/api/georeverse/ai/question')
    const data = await res.json()
    if (data.done) {
      setAIGuess(data.guess)
      setAIDone(true)
      fanfare.current.play()
    } else {
      setAIQuestion(data)
    }
    setAILoading(false)
  }

  const handleAnswer = (value) => {
    flip.current.play()
    setAnswers([...answers, value])
    setQuestionIndex(q => q + 1)
  }

  const submitGuess = () => {
    fetch('/api/georeverse/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, guess })
    })
      .then(res => res.json())
      .then(data => {
        setResult(data)
        fanfare.current.play()
      })
      .catch(console.error)
  }

  const restart = () => {
    setMode(null)
    setQuestions([])
    setAnswers([])
    setGuess('')
    setResult(null)
    setQuestionIndex(0)
    setAIQuestion(null)
    setAIGuess(null)
    setAIDone(false)
    setAILoading(false)
  }

  if (!mode) return (
    <div className="p-6 text-center space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">20Q: Guess the Country</h2>
      <p className="text-gray-600">Choose a game mode:</p>
      <div className="flex justify-around">
        <button className="btn-simple" onClick={() => setMode('player')}>I’ll Guess</button>
        <button className="btn-simple" onClick={() => { setMode('ai'); startAIMode() }}>AI Guesses</button>
      </div>
      <button onClick={() => nav('/')} className="btn-simple">Back</button>
    </div>
  )

  if (mode === 'player') {
    if (result) return (
      <div className="p-6 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl">Your Final Guess</h2>
        <p>You guessed: <strong>{result.guess}</strong></p>
        <p>{result.correct ? '✅ Correct!' : '❌ Incorrect'}</p>
        <button onClick={restart} className="btn-simple">Try Again</button>
        <button onClick={() => nav('/')} className="btn-simple">Back</button>
      </div>
    )
    if (questionIndex >= MAX) return (
      <div className="p-6 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl">Make Your Final Guess</h2>
        <input
          value={guess}
          onChange={e => setGuess(e.target.value)}
          placeholder="Enter country name"
          className="w-full border p-2 rounded"
        />
        <button onClick={submitGuess} className="btn-simple">Submit Guess</button>
        <button onClick={restart} className="btn-simple">Restart</button>
      </div>
    )
    return (
      <div className="p-6 max-w-md mx-auto space-y-4 text-center">
        <h2 className="text-xl">Question {questionIndex + 1} of {MAX}</h2>
        <p>{questions[questionIndex]?.question}</p>
        <div className="flex justify-around">
          <button className="btn-simple" onClick={() => handleAnswer(true)}>Yes</button>
          <button className="btn-simple" onClick={() => handleAnswer(false)}>No</button>
          <button className="btn-simple" onClick={() => handleAnswer(null)}>Unknown</button>
        </div>
        <button onClick={restart} className="btn-simple">Give Up</button>
        <button onClick={() => nav('/')} className="btn-simple">Back</button>
      </div>
    )
  }

  if (mode === 'ai') {
    if (aiLoading) return <p className="p-6 text-center">Loading AI...</p>
    if (aiDone) return (
      <div className="p-6 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl">AI's Final Guess</h2>
        <p>The AI thinks your country is:</p>
        <p className="text-2xl font-bold">{aiGuess}</p>
        {aiGuess && guessCoords[aiGuess] && (
          <CountryMap lat={guessCoords[aiGuess].lat} lng={guessCoords[aiGuess].lng} useMapbox={false} />
        )}
        <button onClick={restart} className="btn-simple">Play Again</button>
        <button onClick={() => nav('/')} className="btn-simple">Back</button>
      </div>
    )
    return (
      <div className="p-6 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl">AI Asks:</h2>
        <p>{aiQuestion?.question}</p>
        <div className="flex justify-around">
          <button className="btn-simple" onClick={() => answerAI(true)}>Yes</button>
          <button className="btn-simple" onClick={() => answerAI(false)}>No</button>
          <button className="btn-simple" onClick={() => answerAI(null)}>Unknown</button>
        </div>
        <button onClick={restart} className="btn-simple">Give Up</button>
        <button onClick={() => nav('/')} className="btn-simple">Back</button>
      </div>
    )
  }

  return null
}
