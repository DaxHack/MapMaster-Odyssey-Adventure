// packages/web/src/components/GlobalAdventure.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function GlobalAdventure() {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [scene, setScene] = useState(null)
  const flip = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/page-flip.mp3`))
  const fanfare = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/fanfare-announcement.mp3`))

  useEffect(()=>{
    fetch(`/api/adventure/next?step=${step}`)
      .then(r=>r.json()).then(s=>setScene(s))
  },[step])

  if(!scene) return <p className="p-6">Loading…</p>
  if(scene.choices.length===0) {
    fanfare.current.play()
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <h2 className="text-xl mb-4">The End</h2>
        <p>{scene.text}</p>
        <button onClick={()=>nav('/')} className="btn-simple mt-4">Back</button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl">Global Adventure</h2>
      <p>{scene.text}</p>
      {scene.choices.map((c,i)=>(
        <button key={i} className="btn-simple block w-full" onClick={()=>{
          flip.current.play()
          setStep(step+1)
        }}>{c}</button>
      ))}
      <button onClick={()=>nav('/')} className="btn-simple">Back</button>
    </div>
  )
}
