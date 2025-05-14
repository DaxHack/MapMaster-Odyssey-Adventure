// packages/web/src/components/WorldDetective.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WorldDetective() {
  const nav = useNavigate()
  const [i, setI] = useState(1)
  const [clue, setClue] = useState('')
  const [loading, setL] = useState(true)
  const drum = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/drum-roll.mp3`))

  useEffect(()=>{
    setL(true)
    fetch(`/api/detective/clue/${i}`)
      .then(r=>r.json()).then(d=>{
        setClue(d.clue)
        setL(false)
        drum.current.play()
      })
      .catch(console.error)
  },[i])

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
