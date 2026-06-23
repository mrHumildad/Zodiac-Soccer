import './App.css'
import { useState } from 'react'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import League from './components/League.jsx'
import Roster from './components/Roster.jsx'
import Match from './components/Match.jsx'
import Home from './components/Home.jsx'
import PlayerModal from './components/PlayerModal.jsx'

function App() {
  const [tab, setTab] = useState('home');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const activeSign = selectedTeam ? selectedTeam.name.toLowerCase() : 'aquarius';

  return (
    <LanguageProvider>
      <div style={{ '--sign-color': `var(--${activeSign})`, '--sign-glow': `var(--${activeSign}-glow)` }}>
        <Header setTab={setTab} />
        {selectedPlayer && <PlayerModal selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} />}
        {tab === 'league' && <League setSelectedTeam={setSelectedTeam} setSelectedMatch={setSelectedMatch} setTab={setTab} />}
        {tab === 'roster' && <Roster selectedTeam={selectedTeam} setTab={setTab} />}
        {tab === 'match' && <Match selectedMatch={selectedMatch} setTab={setTab} />}
        {tab === 'home' && <Home setSelectedTeam={setSelectedTeam} setSelectedMatch={setSelectedMatch} setTab={setTab} />}
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App
