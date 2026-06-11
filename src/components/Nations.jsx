import { useState} from 'react';

const Nations = ({data}) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedSing, setSelectedSing] = useState('Aries');
  const getTeamZodiacs = (team) => {
    console.log(team)
    const zodiacs = {};
    team.players.forEach(player => {
      if (!zodiacs[player.zodiac]) {
        zodiacs[player.zodiac] = 1;
      }
      zodiacs[player.zodiac]++;
    });
    return zodiacs;
  };
  
  return (
    <div>
      {selectedTeam ? (
        <div>
          <h2>{selectedTeam.name}</h2>
          <ul>
            {selectedTeam.players.map(player => (
              <li key={player.name}>{player.number}. {player.pos} {player.name} - {data.zodiacs[player.zodiac].symbol}</li>
            ))}
          </ul>
          <button onClick={() => setSelectedTeam(null)}>Back</button>
        </div>
      ) : (
        <table>
        <thead>
          <tr>
            <th>Team</th>
            <th onClick={() => setSelectedSing('Aries')}>{data.zodiacs.Aries.symbol}</th>
            <th onClick={() => setSelectedSing('Taurus')}>{data.zodiacs.Taurus.symbol}</th>
            <th onClick={() => setSelectedSing('Gemini')}>{data.zodiacs.Gemini.symbol}</th>
            <th onClick={() => setSelectedSing('Cancer')}>{data.zodiacs.Cancer.symbol}</th>
            <th onClick={() => setSelectedSing('Leo')}>{data.zodiacs.Leo.symbol}</th>
            <th onClick={() => setSelectedSing('Virgo')}>{data.zodiacs.Virgo.symbol}</th>
            <th onClick={() => setSelectedSing('Libra')}>{data.zodiacs.Libra.symbol}</th>
            <th onClick={() => setSelectedSing('Scorpio')}>{data.zodiacs.Scorpio.symbol}</th>
            <th onClick={() => setSelectedSing('Sagittarius')}>{data.zodiacs.Sagittarius.symbol}</th>
            <th onClick={() => setSelectedSing('Capricorn')}>{data.zodiacs.Capricorn.symbol}</th>
            <th onClick={() => setSelectedSing('Aquarius')}>{data.zodiacs.Aquarius.symbol}</th>
            <th onClick={() => setSelectedSing('Pisces')}>{data.zodiacs.Pisces.symbol}</th>
          </tr>
        </thead>
        <tbody>
          {data.squads
            .slice()
            .sort((a, b) => {
              const countA = a.players.filter(p => p.zodiac === selectedSing).length;
              const countB = b.players.filter(p => p.zodiac === selectedSing).length;
              return countB - countA;
            })
            .map(team => {
            console.log(team)
            const zodiacs = getTeamZodiacs(team);
            return (
              <tr key={team.fifa_code} onClick={() => setSelectedTeam(team)}>
                <td onClick={() => setSelectedTeam(team)}>{team.name}</td>
                <td>{zodiacs.Aries || 0}</td>
                <td>{zodiacs.Taurus || 0}</td>
                <td>{zodiacs.Gemini || 0}</td>
                <td>{zodiacs.Cancer || 0}</td>
                <td>{zodiacs.Leo || 0}</td>
                <td>{zodiacs.Virgo || 0}</td>
                <td>{zodiacs.Libra || 0}</td>
                <td>{zodiacs.Scorpio || 0}</td>
                <td>{zodiacs.Sagittarius || 0}</td>
                <td>{zodiacs.Capricorn || 0}</td>
                <td>{zodiacs.Aquarius || 0}</td>
                <td>{zodiacs.Pisces || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      )}
      
    </div>
  );
}

export default Nations;
