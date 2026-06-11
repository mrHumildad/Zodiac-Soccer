import './App.css'
import { useState } from 'react'
import Header from './components/Header.jsx'
import Nations from './components/Nations.jsx'
import Footer from './components/Footer.jsx'
import squads from '../data/squads.json'
import teams from '../data/teams.json'
import worldCup from '../data/worldcup.json'
import zodiacs from '../data/zodiacs.json'
import ZWC26 from './components/ZWC26.jsx'
import League from './components/League.jsx'
import Roster from './components/Roster.jsx'

function App() {
  const [tab, setTab] = useState('league');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const data = {
    squads,
    teams,
    matches : worldCup,
    zodiacs
  }
  return (
    <>
     <Header />
     {tab === 'home' && <Nations data={data} />}
     {tab === 'zwc26' && <ZWC26 data={data} />}
     {tab === 'league' && <League data={data} setSelectedTeam={setSelectedTeam} setTab={setTab}/>}
      {tab === 'roster' && <Roster selectedTeam={selectedTeam} setTab={setTab}/>}
     <Footer />
    </>
  )
}

export default App
