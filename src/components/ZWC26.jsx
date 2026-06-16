import { useState} from 'react';
import zodiacTeams from '../../data/updatedZTeams.json';
const ZWC26 = ({data}) => {
  const zTeams = zodiacTeams;
  const [selectedTeam, setSelectedTeam] = useState(null);
  console.log(zTeams);
  return (
    <div>
      {selectedTeam && (
        <div>
          <h2>{selectedTeam.name} {selectedTeam.symbol}</h2>
          <h3>Goalkeepers</h3>
          <ul>
            {selectedTeam.players.filter(p => p.pos === 'GK').map((player, index) => (
              <li key={index}>{player.number}. {player.name} ({player.fifa_code})</li>
            ))}
          </ul>
          <h3>Defenders</h3>
          <ul>
            {selectedTeam.players.filter(p => p.pos === 'DF').map((player, index) => (
              <li key={index}>{player.number}. {player.name} ({player.fifa_code})</li>
            ))}
          </ul>
          <h3>Midfielders</h3>
          <ul>
            {selectedTeam.players.filter(p => p.pos === 'MF').map((player, index) => (
              <li key={index}>{player.number}. {player.name} ({player.fifa_code})</li>
            ))}
          </ul>
          <h3>Forwards</h3>
          <ul>
            {selectedTeam.players.filter(p => p.pos === 'FW').map((player, index) => (
              <li key={index}>{player.number}. {player.name} ({player.fifa_code})</li>
            ))}
          </ul>
          <button onClick={() => setSelectedTeam(null)}>Back to all teams</button>
        </div>
      )}
      {!selectedTeam && zTeams.map((team, index) => (
        <div key={index} onClick={() => setSelectedTeam(team)} style={{ cursor: 'pointer' }}>
          <h2>{team.name} {team.symbol}</h2>
          <p>GK: {team.players.filter(player => player.pos === 'GK').length}</p>
          <p>DF: {team.players.filter(player => player.pos === 'DF').length}</p>
          <p>MF: {team.players.filter(player => player.pos === 'MF').length}</p>
          <p>FW: {team.players.filter(player => player.pos === 'FW').length}</p>
        </div>
      ))}
    </div>
  );
}

export default ZWC26;
