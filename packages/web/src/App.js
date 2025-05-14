// packages/web/src/App.js
import React from 'react'
import { Routes, Route } from 'react-router-dom'

import ModeSelector     from './components/ModeSelector'
import FlagGuesser      from './components/FlagGuesser'
import GeoReverse       from './components/GeoReverse'
import TravelMatch      from './components/TravelMatch'
import GlobalAdventure  from './components/GlobalAdventure'
import WorldDetective   from './components/WorldDetective'

import './index.css'

export default function App() {
  const P = process.env.PUBLIC_URL

  return (
    <div
      className="app-bg min-h-screen"
      style={{
        backgroundImage:   `url(${P}/images/planet-bg.png)`,
        backgroundRepeat:  'no-repeat',
        backgroundPosition:'center',
        backgroundAttachment:'fixed',
        backgroundSize:    '150% auto',
        backgroundColor:   'rgba(255,255,255,0.6)',
        backgroundBlendMode:'lighten',
      }}
    >
      <header
        className="sticky-header p-4 text-center text-4xl font-extrabold"
        style={{
          backgroundImage:   `url(${P}/images/header-pattern.png)`,
          backgroundSize:    'cover',
          backgroundPosition:'center',
          opacity:           0.75,
          backdropFilter:    'blur(4px)',
          transition:        'padding 200ms ease, opacity 200ms ease',
        }}
      >
        MapMaster: Odyssey Adventures
      </header>

      <Routes>
        <Route path="/"                 element={<ModeSelector />} />
        <Route path="/mode/flagguesser" element={<FlagGuesser />} />
        <Route path="/mode/georeverse"  element={<GeoReverse />} />
        <Route path="/mode/travelmatch" element={<TravelMatch />} />
        <Route path="/mode/adventure"   element={<GlobalAdventure />} />
        <Route path="/mode/detective"   element={<WorldDetective />} />
      </Routes>

      <footer className="p-4 text-center text-sm opacity-50">
        © 2025 MapMaster
      </footer>
    </div>
  )
}
