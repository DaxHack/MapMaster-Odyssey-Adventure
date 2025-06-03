# # MapMaster: Odyssey Adventure

An interactive, educational game suite that blends geography, travel trivia, and adventure into one immersive experience. Built for web using React and Node.js, MapMaster includes five game modes designed to make global knowledge fun, replayable, and informative. This is part of the larger Dax Collective ecosystem and connects with Firebase, Unsplash, and external APIs to provide a modern, dynamic gameplay experience.

---

🚀 Game Modes

1. FlagGuesser

Guess the country based on the flag.

Scoring system and sound effects.

2. GeoReverse

"20 Questions" country guessing game.

Two modes:

AI Guesses: User thinks of a country, AI asks yes/no questions.

Player Guesses: AI picks a country, user asks questions.


Supports early exits, dynamic questioning, and guess feedback.


3. Travel Matchmaker

Gamified swipe quiz to discover top travel destination matches.

Pulls real-time city/country data.

Includes affordable destination suggestions, amenities, and feature tagging.


4. Global Adventure

Choose-your-own-adventure narrative.

Scenes change based on random countries, user decisions, and quests.

Includes character setup, story progress, and dynamic paths.


5. World Detective

Carmen Sandiego-style mystery.

Solve clues to uncover countries and regions.

Highlights educational facts and encourages exploration.

---

💡 Features

Dynamic UI built with Tailwind CSS and React

Mobile-first responsive game cards

Interactive navigation with visual transitions and sound cues

Firebase and Google Sheets integration for real data and user tracking

Educational and engaging — great for classrooms, travel fans, and trivia lovers


---

📃 Project Structure

MapMaster-Odyssey-Adventure/
├── packages/
│   ├── web/             # Frontend (React + Tailwind)
│   │   └── src/components/  # All game modes
│   └── server/          # Backend APIs (Node/Express)
├── public/              # Assets, flags, sounds
├── scripts/             # Seeder scripts, utility scripts
├── firebase.json        # Firebase deploy config
├── .env                 # API keys and environment variables


---

🚜 Installation & Setup

Local Dev

git clone https://github.com/daxhack/MapMaster-Odyssey-Adventure.git
cd MapMaster-Odyssey-Adventure
npm install --legacy-peer-deps
npm run dev

Firebase Integration

Set up Firebase project

Replace .env with your Firebase config

Enable Firestore, Hosting, and Storage if needed


Unsplash Integration

Use a free API key from Unsplash Developers

Add it to your .env for Travel Matchmaker visuals



---

🪤 Tech Stack

React (Frontend)

Tailwind CSS

Node.js + Express (Backend API)

Firebase (Firestore + Hosting + Auth)

Google Sheets (for AI guessing dataset)

n8n (Workflow integration)

Unsplash API (Travel visuals)

ElevenLabs (Voice narration for game mode feedback)



---

🛠️ Future Enhancements

Interactive map zoom feature for GeoReverse

Multiplayer mode (via WebSockets)

User profile tracking with XP & badges

Leaderboards & save progress system

Monetization layer: merch + ad slots

AI-powered clue generation



---

📊 MVP Progress

[x] All 5 game modes implemented

[x] Swipe UI & game logic stable

[x] AI logic for GeoReverse working

[ ] Multiplayer sync (planned)

[ ] Firebase login integration

[ ] Polish mobile responsiveness

[ ] Add tutorial or onboarding UI



---

🌐 Live Deployment

Default deploy: Vercel / Netlify / Firebase Hosting

Firebase config and GitHub Actions included



---

🎓 Contributing

Fork the project

Submit an issue or feature request

Open a PR with descriptive title and comments



---

📢 Contact

Owner: Daniel Ryan (@DaxHack)

Email: daxdaniel2013@gmail.com

Website: https://daxcollective.com

YouTube: Dax the Traveler / Timezone Travelers / Ani-Dax


