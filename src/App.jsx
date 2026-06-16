import './App.css'
import { useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
//import zodiacTeams from '../data/zodiacTeams.json' with { type: 'json' };
import ZWC26 from './components/ZWC26.jsx'
import League from './components/League.jsx'
import Roster from './components/Roster.jsx'
import Match from './components/Match.jsx'

function App() {
  const [tab, setTab] = useState('league');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  return (
    <>
     <Header />
     {tab === 'zwc26' && <ZWC26  />}
     {tab === 'league' && <League  setSelectedTeam={setSelectedTeam} setSelectedMatch={setSelectedMatch} setTab={setTab}/>}
      {tab === 'roster' && <Roster selectedTeam={selectedTeam} setTab={setTab}/>}
      {tab === 'match' && <Match selectedMatch={selectedMatch} setTab={setTab} />}

     <Footer />
    </>
  )
}

export default App
