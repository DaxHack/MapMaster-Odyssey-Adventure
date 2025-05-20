// packages/server/src/services/imageService.js
import fetch from 'node-fetch'
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

export async function fetchUnsplashImage(query) {
  try {
    const res = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`)
    const data = await res.json()
    return data.urls?.small || 'https://source.unsplash.com/random/400x300/?travel'
  } catch {
    return 'https://source.unsplash.com/random/400x300/?travel'
  }
}