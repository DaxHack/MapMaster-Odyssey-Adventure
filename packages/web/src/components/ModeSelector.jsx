// packages/web/src/components/ModeSelector.jsx
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ModeSelector() {
  const navigate = useNavigate()
  useEffect(() => {
    const hdr = document.querySelector('.sticky-header')
    if (!hdr) return
    const onScroll = () =>
      window.scrollY>10 ? hdr.classList.add('scrolled') : hdr.classList.remove('scrolled')
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const modes = [
    ['Guess the Flag','/mode/flagguesser'],
    ['20-Q GeoGuesser','/mode/georeverse'],
    ['Travel Matchmaker','/mode/travelmatch'],
    ['Global Adventure','/mode/adventure'],
    ['World Detective','/mode/detective'],
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap justify-center">
        {modes.map(([label,path])=>(
          <button key={path} className="btn-mode" onClick={()=>navigate(path)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
