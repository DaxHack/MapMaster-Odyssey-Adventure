// packages/web/src/components/WorldDetective.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WorldDetective() {
  const nav = useNavigate()
  const [i, setI] = useState(1)
  const [clue, setClue] = useState('')
  const [loading, setL] = useState(true)
  const drum = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/drum-roll.mp3`))

  useEffect(() => {
    setL(true)
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
        setL(false)
        drum.current.play()
      })
      .catch(err => {
        console.error("Error fetching clue:", err)
        setClue("Error loading clue.")
        setL(false)
      })
  }, [i])
  

  function find() {
    setL(true)
    fetch('/api/travelmatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        interests: Object.keys(prefs).filter(k => prefs[k])
      })
    })
      .then(async (r) => {
        if (!r.ok) {
          const msg = await r.text()
          throw new Error(`Server error: ${msg}`)
        }
        return r.json()
      })
      .then(d => {
        setR(d)
        ding.current.play()
      })
      .catch(err => {
        console.error("Error fetching travelmatch:", err)
        setR([])
      })
      .finally(() => setL(false))
  }

  if(loading) return <p className="p-6">Loading…</p>
  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl">World Detective</h2>
      <p>{clue}</p>
      <div className="flex justify-between">
        <button disabled={i<=1} onClick={()=>setI(i-1)} className="btn-simple">Previous</button>
        <button onClick={()=>setI(i+1)} className="btn-simple">Next</button>
      </div>
      <button onClick={()=>nav('/')} className="btn-simple">Back</button>
    </div>
  )
}
