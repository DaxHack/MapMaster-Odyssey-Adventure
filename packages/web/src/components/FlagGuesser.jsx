// packages/web/src/components/FlagGuesser.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FlagGuesser() {
  const nav = useNavigate()
  const MAX = 10, T = 15

  const [q, setQ] = useState(null)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [fb, setFB] = useState('')
  const [hint, setHint] = useState(false)
  const [time, setTime] = useState(T)

  const timer = useRef(null)
  const ding = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/correct-3.mp3`))
  const buzz = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/wrong-buzzer.mp3`))
  const tick = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/simple-countdown.mp3`))
  const reveal = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/fanfare-announcement.mp3`))
  const flip = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/page-flip.mp3`))

  const loadQ = useCallback(() => {
    setFB('')
    setHint(false)
    setTime(T)
    fetch('/api/flagguesser')
      .then(async (r) => {
        if (!r.ok) {
          const msg = await r.text()
          throw new Error(`Server error: ${msg}`)
        }
        return r.json()
      })
      .then(data => {
        setQ(data)
        reveal.current.play()
      })
      .catch(err => {
        console.error("Error fetching flagguesser:", err)
        setFB("Error loading question. Please try again.")
      })
  }, [])

  useEffect(() => { if (round <= MAX) loadQ() }, [loadQ, round])

  useEffect(() => {
    if (fb) return
    clearInterval(timer.current)
    tick.current.play()
    timer.current = setInterval(() => {
      setTime(t => t <= 1 ? (clearInterval(timer.current), handleGuess(null), 0) : t - 1)
    }, 1000)
    return () => clearInterval(timer.current)
  }, [q, fb])

  function handleGuess(choice) {
    if (!q || fb) return
    clearInterval(timer.current)
    const ok = choice === q.answer
    if (ok) {
      ding.current.play()
      setScore(s => s + 1)
      setStreak(s => s + 1)
      setFB('✅ Correct!')
    } else {
      buzz.current.play()
      setStreak(0)
      setFB(`❌ Nope—was ${q.answer}`)
    }
    setTimeout(() => {
      flip.current.play()
      if (round < MAX) setRound(r => r + 1)
      else setFB(`🎉 Game Over! You scored ${score + (ok ? 1 : 0)} / ${MAX}`)
    }, 800)
  }

  const reset = () => { setScore(0); setStreak(0); setRound(1); setFB('') }

  if (round > MAX) return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-2xl mb-4">Game Over</h2>
      <p>Final score: <strong>{score}</strong></p>
      <p>Highest streak: <strong>{streak}</strong></p>
      <button onClick={reset} className="btn-simple mr-4">Play Again</button>
      <button onClick={() => nav('/')} className="btn-simple">Back</button>
    </div>
  )

  if (!q) return <p className="p-6">{fb || "Loading…"}</p>

  return (
    <div className="container mx-auto p-6 max-w-md bg-white rounded shadow-lg">
      <div className="flex justify-between mb-4">
        <span>Round {round}/{MAX}</span>
        <span>⏲️ {time}s</span>
      </div>

      <h2 className="text-xl mb-2">Guess the Flag</h2>
      <p className="mb-4 text-gray-600">
        Score: {score} · Streak: {streak}
      </p>
      <div className="mb-4 flex justify-center">
        <img src={q.flagUrl} alt="" className="h-24 object-contain border" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {q.options.map(opt => (
          <button
            key={opt}
            className="btn-simple"
            onClick={() => handleGuess(opt)}
            disabled={!!fb}
          >{opt}</button>
        ))}
      </div>

      {hint
        ? <p className="mb-2 italic text-gray-500">Continent: {q.continent}</p>
        : <button
          className="btn-simple mb-4"
          onClick={() => setHint(true)}
          disabled={!!fb}
        >Show Continent Hint</button>
      }

      {fb && <p className="mb-4 text-center font-medium">{fb}</p>}
      <div className="flex justify-between">
        <button onClick={() => nav('/')} className="btn-simple">Back</button>
      </div>
    </div>
  )
}