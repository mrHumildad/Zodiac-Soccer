import './App.css'
import { useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import teams from '../data/teams.json'
import zodiacs from '../data/zodiacs.json'
import fotmobMatches from '../data/fotmobMatches.json'
import ZWC26 from './components/ZWC26.jsx'
import League from './components/League.jsx'
import Roster from './components/Roster.jsx'
import Match from './components/Match.jsx'

function App() {
  const [tab, setTab] = useState('league');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const data = {
    teams,
    zodiacs,
    fotmobMatches
  }

  return (
    <>
     <Header />
     {tab === 'zwc26' && <ZWC26 data={data} />}
     {tab === 'league' && <League data={data} setSelectedTeam={setSelectedTeam} setSelectedMatch={setSelectedMatch} setTab={setTab}/>}
      {tab === 'roster' && <Roster selectedTeam={selectedTeam} setTab={setTab}/>}
      {tab === 'match' && <Match selectedMatch={selectedMatch} setTab={setTab} data={data}/>}

     <Footer />
    </>
  )
}

export default App
