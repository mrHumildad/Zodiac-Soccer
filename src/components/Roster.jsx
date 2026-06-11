import React from 'react';

const Roster = ({selectedTeam, setTab}) => {
  if (!selectedTeam) return <div>Select a team</div>;
  const team = selectedTeam;
  return (
    <div>
      <h2>{team.symbol} {team.name}</h2>
      <h3>Goalkeepers</h3>
      <ul>
        {team.players.filter(p => p.pos === 'GK').map((player, index) => (
          <li key={index}>{player.number}. {player.name} ({player.fifa_code})</li>
        ))}
      </ul>
      <h3>Defenders</h3>
      <ul>
        {team.players.filter(p => p.pos === 'DF').map((player, index) => (
          <li key={index}>{player.number}. {player.name} ({player.fifa_code})</li>
        ))}
      </ul>
      <h3>Midfielders</h3>
      <ul>
        {team.players.filter(p => p.pos === 'MF').map((player, index) => (
          <li key={index}>{player.number}. {player.name} ({player.fifa_code})</li>
        ))}
      </ul>
      <h3>Forwards</h3>
      <ul>
        {team.players.filter(p => p.pos === 'FW').map((player, index) => (
          <li key={index}>{player.number}. {player.name} ({player.fifa_code})</li>
        ))}
      </ul>
      <button onClick={() => setTab('league')}>Back to all teams</button>
    </div>
  );
}

export default Roster;
