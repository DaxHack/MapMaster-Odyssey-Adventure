// packages/web/src/components/WorldDetective.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WorldDetective() {
  const nav = useNavigate()
  const [i, setI] = useState(1)
  const [clue, setClue] = useState('')
  const [loading, setLoading] = useState(true)
  const drum = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/drum-roll.mp3`))
  const fanfare = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/fanfare-announcement.mp3`))

  useEffect(() => {
    setLoading(true)
    fetch(`/api/detective/clue/${i}`)
      .then(async (r) => {
        if (!r.ok) {
          const msg = await r.text()
          throw new Error(`Server error: ${msg}`)
        }
        return r.json()
      })
      .then(d => {
        setClue(d.clue)
        setLoading(false)
        drum.current.play()
      })
      .catch(err => {
        console.error("Error fetching clue:", err)
        setClue("Error loading clue.")
        setLoading(false)
      })
  }, [i])

  const reset = () => {
    setI(1)
    setClue('')
    setLoading(true)
  }

  if (loading) return <p className="p-6">Loading…</p>

  return (
    <div className="p-6 max-w-md mx-auto space-y-4 text-center">
      <h2 className="text-xl">World Detective</h2>
      <p className="italic">{clue}</p>

      <div className="flex justify-between mt-4">
        <button disabled={i <= 1} onClick={() => setI(i - 1)} className="btn-simple">Previous</button>
        <button onClick={() => setI(i + 1)} className="btn-simple">Next</button>
      </div>

      <div className="mt-6">
        <button onClick={reset} className="btn-simple mr-4">Restart</button>
        <button onClick={() => nav('/')} className="btn-simple">Back</button>
      </div>
    </div>
  )
}
