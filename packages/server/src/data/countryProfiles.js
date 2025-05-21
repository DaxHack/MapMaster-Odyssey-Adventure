// File: packages/server/src/data/countryProfiles.js
// Version: v2.3 - Consolidated country and travel data, file-based fetch caching

import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const API_URL = 'https://restcountries.com/v3.1/all'
const OUTPUT_PATH = path.resolve('packages/server/src/data/generatedCountries.json')

export async function fetchCountries() {
  try {
    const res = await fetch(API_URL)
    const data = await res.json()

    const mapped = data.map(country => ({
      name: country.name.common,
      continent: country.region,
      hemisphere: country.latlng?.[0] > 0 ? 'Northern' : 'Southern',
      coastal: (country.borders?.length || 0) > 0,
      english: country.languages?.eng || false,
      arabic: country.languages?.ara || false,
      island: country.independent && (country.borders?.length || 0) === 0,
      monarchy: country.government?.includes('monarchy') || false,
      euro: Object.keys(country.currencies || {}).includes('EUR'),
      capitalCoastal: country.capital?.some(c => c.toLowerCase().includes('coast')) || false,
      populationOver50M: country.population > 50000000,
      serviceEconomy: country.economy?.includes('services') || false,
      commonwealth: country.name.common === 'United Kingdom' || country.commonwealth || false,
      desert: false,
      rainforest: false,
      lat: country.latlng?.[0],
      lng: country.latlng?.[1]
    }))

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mapped, null, 2))
    console.log(`✅ Country data written to ${OUTPUT_PATH}`)
    return mapped
  } catch (err) {
    console.error("❌ Error fetching countries data:", err)
    return []
  }
}

export const travelCities = [
  { name: 'Tulum', country: 'Mexico', tags: ['beaches', 'culture', 'affordable'], description: 'Chill beach town with ancient ruins.' },
  { name: 'Santorini', country: 'Greece', tags: ['island', 'romance', 'scenic'], description: 'White cliffs and sunset views.' },
  { name: 'Koh Lanta', country: 'Thailand', tags: ['beaches', 'remote', 'budget'], description: 'Affordable paradise alternative to Maldives.' },
  { name: 'Lisbon', country: 'Portugal', tags: ['city', 'coastal', 'history'], description: 'Colorful streets and rich cultural heritage.' },
  { name: 'Kyoto', country: 'Japan', tags: ['culture', 'history', 'romance'], description: 'Temples, cherry blossoms, and peaceful traditions.' },
  { name: 'Cape Town', country: 'South Africa', tags: ['coastal', 'mountains', 'adventure'], description: 'Breathtaking views of mountains and ocean.' },
  { name: 'Medellín', country: 'Colombia', tags: ['city', 'budget', 'culture'], description: 'Modern city with great weather and transformation story.' },
  { name: 'Queenstown', country: 'New Zealand', tags: ['adventure', 'mountains', 'remote'], description: 'Extreme sports hub surrounded by natural beauty.' },
  { name: 'Istanbul', country: 'Turkey', tags: ['city', 'history', 'culture'], description: 'The meeting point of East and West.' },
  { name: 'Reykjavík', country: 'Iceland', tags: ['northern', 'remote', 'adventure'], description: 'Gateway to glaciers, volcanoes, and hot springs.' },
  { name: 'Hoi An', country: 'Vietnam', tags: ['culture', 'affordable', 'romance'], description: 'Ancient town full of lanterns and charm.' },
  { name: 'Vancouver', country: 'Canada', tags: ['coastal', 'mountains', 'city'], description: 'Urban life surrounded by stunning nature.' }
]

export const countryProfiles = [
  {
    name: 'Japan', continent: 'Asia', hemisphere: 'Northern', coastal: true, english: false, arabic: false,
    island: true, monarchy: true, euro: false, capitalCoastal: true, populationOver50M: true,
    serviceEconomy: true, commonwealth: false, desert: false, rainforest: false, lat: 35.68, lng: 139.69
  },
  {
    name: 'Canada', continent: 'North America', hemisphere: 'Northern', coastal: true, english: true, arabic: false,
    island: false, monarchy: true, euro: false, capitalCoastal: false, populationOver50M: false,
    serviceEconomy: true, commonwealth: true, desert: false, rainforest: true, lat: 45.42, lng: -75.69
  },
  {
    name: 'Brazil', continent: 'South America', hemisphere: 'Southern', coastal: true, english: false, arabic: false,
    island: false, monarchy: false, euro: false, capitalCoastal: false, populationOver50M: true,
    serviceEconomy: false, commonwealth: false, desert: false, rainforest: true, lat: -15.79, lng: -47.88
  },
  {
    name: 'Egypt', continent: 'Africa', hemisphere: 'Northern', coastal: true, english: false, arabic: true,
    island: false, monarchy: false, euro: false, capitalCoastal: false, populationOver50M: true,
    serviceEconomy: true, commonwealth: false, desert: true, rainforest: false, lat: 30.04, lng: 31.24
  },
  {
    name: 'United States', continent: 'North America', hemisphere: 'Northern', coastal: true, english: true, arabic: false,
    island: false, monarchy: false, euro: false, capitalCoastal: false, populationOver50M: true,
    serviceEconomy: true, commonwealth: false, desert: true, rainforest: true, lat: 38.89, lng: -77.04
  },
  {
    name: 'United Kingdom', continent: 'Europe', hemisphere: 'Northern', coastal: true, english: true, arabic: false,
    island: true, monarchy: true, euro: false, capitalCoastal: false, populationOver50M: true,
    serviceEconomy: true, commonwealth: true, desert: false, rainforest: false, lat: 51.50, lng: -0.12
  },
  {
    name: 'Germany', continent: 'Europe', hemisphere: 'Northern', coastal: true, english: true, arabic: false,
    island: false, monarchy: false, euro: true, capitalCoastal: false, populationOver50M: true,
    serviceEconomy: true, commonwealth: false, desert: false, rainforest: false, lat: 52.52, lng: 13.40
  },
  {
    name: 'France', continent: 'Europe', hemisphere: 'Northern', coastal: true, english: false, arabic: false,
    island: false, monarchy: false, euro: true, capitalCoastal: false, populationOver50M: true,
    serviceEconomy: true, commonwealth: false, desert: false, rainforest: false, lat: 48.85, lng: 2.35
  },
  {
    name: 'China', continent: 'Asia', hemisphere: 'Northern', coastal: true, english: false, arabic: false,
    island: false, monarchy: false, euro: false, capitalCoastal: false, populationOver50M: true,
    serviceEconomy: false, commonwealth: false, desert: true, rainforest: true, lat: 39.90, lng: 116.40
  },
  {
    name: 'India', continent: 'Asia', hemisphere: 'Northern', coastal: true, english: true, arabic: false,
    island: false, monarchy: false, euro: false, capitalCoastal: false, populationOver50M: true,
    serviceEconomy: true, commonwealth: true, desert: true, rainforest: true, lat: 28.61, lng: 77.21
  },
  {
    name: 'Russia', continent: 'Europe', hemisphere: 'Northern', coastal: true, english: false, arabic: false,
    island: false, monarchy: false, euro: false, capitalCoastal: false, populationOver50M: true,
    serviceEconomy: false, commonwealth: false, desert: false, rainforest: true, lat: 55.75, lng: 37.61
  },
  {
    name: 'Australia', continent: 'Oceania', hemisphere: 'Southern', coastal: true, english: true, arabic: false,
    island: true, monarchy: true, euro: false, capitalCoastal: false, populationOver50M: false,
    serviceEconomy: true, commonwealth: true, desert: true, rainforest: true, lat: -35.28, lng: 149.13
  },
  {
    name: 'South Africa', continent: 'Africa', hemisphere: 'Southern', coastal: true, english: true, arabic: false,
    island: false, monarchy: false, euro: false, capitalCoastal: true, populationOver50M: true,
    serviceEconomy: true, commonwealth: true, desert: false, rainforest: false, lat: -25.74, lng: 28.18
  }
]
