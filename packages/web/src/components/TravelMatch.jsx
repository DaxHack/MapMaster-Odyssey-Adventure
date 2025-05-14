// packages/web/src/components/TravelMatch.jsx
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TravelMatch() {
  const nav = useNavigate()
  const [prefs, setP] = useState({ beaches:false, history:false, mountains:false, city:false })
  const [res, setR]   = useState(null)
  const [loading, setL] = useState(false)
  const ding = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/correct-3.mp3`))
  const ambience = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/gameshow-music.mp3`))

  useEffect(()=>{
    ambience.current.loop=true
    ambience.current.volume=0.2
    ambience.current.play()
    return ()=>ambience.current.pause()
  },[])

  function toggle(k){ setP(p=>({...p,[k]:!p[k]})) }
  function find(){
    setL(true)
    fetch('/api/travelmatch',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ interests: Object.keys(prefs).filter(k=>prefs[k]) })
    })
      .then(r=>r.json()).then(d=>{
        setR(d)
        ding.current.play()
      })
      .catch(console.error)
      .finally(()=>setL(false))
  }

  if(loading) return <p className="p-6">Loading…</p>
  if(res) return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl">Travel Matchmaker</h2>
      {res.map((r,i)=>(
        <div key={i} className="border p-4 rounded">
          <h3 className="font-bold">{r.place}</h3>
          <p>{r.description}</p>
          <img src={r.image} alt={r.place} className="mt-2 w-full h-32 object-cover rounded"/>
        </div>
      ))}
      <button onClick={()=>{setR(null);setP({beaches:false,history:false,mountains:false,city:false})}}
              className="btn-simple">Reset</button>
      <button onClick={()=>nav('/')} className="btn-simple">Back</button>
    </div>
  )

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl">Travel Matchmaker</h2>
      {Object.keys(prefs).map(k=>(
        <label key={k} className="flex items-center space-x-2">
          <input type="checkbox" checked={prefs[k]} onChange={()=>toggle(k)}/>
          <span>{k.charAt(0).toUpperCase()+k.slice(1)}</span>
        </label>
      ))}
      <button onClick={find} className="btn-simple">Find Matches</button>
      <button onClick={()=>nav('/')} className="btn-simple">Back</button>
    </div>
  )
}
