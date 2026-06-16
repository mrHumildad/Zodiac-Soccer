import { getBest11, getFantaRating } from '../logic/getBest11';
import zodiacTeams from '../../data/updatedZTeams.json' with { type: 'json' };
import { rating2goals } from '../logic/rating2goals';
   
const Match = ({ selectedMatch, setTab }) => {
  console.log('Selected Match:', selectedMatch);
  const homeTeam = zodiacTeams.find(team => team.name === selectedMatch.home_team);
  const awayTeam = zodiacTeams.find(team => team.name === selectedMatch.away_team);
  const home11 = getBest11(homeTeam);
  const away11 = getBest11(awayTeam);

  const renderRating = (p) => {
    const goals = Number(p?.matches?.day1?.stats?.goals ?? 0);
    const assists = Number(p?.matches?.day1?.stats?.assists ?? 0);
    return (
      <>
        {'⚽'.repeat(goals)}
        {'½'.repeat(assists)}
        {' '}
        ({getFantaRating(p)})
      </>
    );
  };

  const renderSquad = (squad, label) => (
    <div>
      <h2>{label}</h2>
      {['GK', 'DF', 'MF', 'FW'].map((pos) => {
        const players = squad.filter((p) => p.pos === pos);
        if (!players.length) return null;
        return (
          <div key={pos}>
            <strong>{pos}</strong>
            <ul>
              {players.map((p, i) => (
                <li key={i}>
                   {p.number}. {p.name} ({p.fifa_code}){' '}
                   {renderRating(p)}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <div><strong>Total:</strong> {squad.reduce((sum, p) => sum + getFantaRating(p), 0)}</div>
      <div><strong>Goals:</strong> {rating2goals(squad.reduce((sum, p) => sum + getFantaRating(p), 0))}</div>

    </div>
  );

  return (
    <div className="match-container">
      {renderSquad(home11, `${homeTeam?.symbol} ${homeTeam?.name}`)}
      {renderSquad(away11, `${awayTeam?.symbol} ${awayTeam?.name}`)}
      <button onClick={() => setTab('league')}>Back to League</button>
    </div>
  );
};

export default Match;

