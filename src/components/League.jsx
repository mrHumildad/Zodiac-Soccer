import { useState, useMemo } from 'react';
import zodiacMatches from '../../data/matches.json';
import zodiacTeams from '../../data/updatedZTeams.json' with { type: 'json' };
const GROUPS = [
  {
    name: 'Cardinal',
    teams: ['Aries', 'Cancer', 'Libra', 'Capricorn'],
  },
  {
    name: 'Fixed',
    teams: ['Taurus', 'Leo', 'Scorpio', 'Aquarius'],
  },
  {
    name: 'Mutable',
    teams: ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'],
  },
];

export default function League({ setSelectedTeam, setSelectedMatch, setTab }) {
  
  const schools = zodiacTeams;
  const [groupIndex, setGroupIndex] = useState(0);

  const group = GROUPS[groupIndex];
  const allMatches = useMemo(
    () => Object.values(zodiacMatches).flatMap((day) => day.matches),
    []
  );

  const groupMatches = useMemo(
    () =>
      allMatches.filter(
        (m) =>
          group.teams.includes(m.home_team) &&
          group.teams.includes(m.away_team)
      ),
    [allMatches, group.teams]
  );

  const standings = useMemo(() => {
    const stats = {};
    for (const team of group.teams) {
      stats[team] = {
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDiff: 0,
        points: 0,
      };
    }
    for (const m of groupMatches) {
      if (m.home_score == null || m.away_score == null) continue;
      const home = m.home_score;
      const away = m.away_score;
      stats[m.home_team].played += 1;
      stats[m.away_team].played += 1;
      stats[m.home_team].goalsFor += home;
      stats[m.home_team].goalsAgainst += away;
      stats[m.away_team].goalsFor += away;
      stats[m.away_team].goalsAgainst += home;
      stats[m.home_team].goalDiff += home - away;
      stats[m.away_team].goalDiff += away - home;
      if (home > away) {
        stats[m.home_team].wins += 1;
        stats[m.home_team].points += 3;
        stats[m.away_team].losses += 1;
      } else if (away > home) {
        stats[m.away_team].wins += 1;
        stats[m.away_team].points += 3;
        stats[m.home_team].losses += 1;
      } else {
        stats[m.home_team].draws += 1;
        stats[m.away_team].draws += 1;
        stats[m.home_team].points += 1;
        stats[m.away_team].points += 1;
      }
    }
    return group.teams
      .map((name) => ({ name, symbol: zodiacTeams.find((t) => t.name === name)?.symbol, ...stats[name] }))
      .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor);
  }, [groupMatches, group.teams]);

  const handleNextGroup = () => {
    setGroupIndex((prev) => (prev + 1) % GROUPS.length);
  };

  const handlePrevGroup = () => {
    setGroupIndex((prev) => (prev - 1 + GROUPS.length) % GROUPS.length);
  };

  return (
    <div className="league-container">
      <div className="league-header">
        <button onClick={handlePrevGroup}>← Previous Group</button>
        <h2>{group.name} Group</h2>
        <button onClick={handleNextGroup}>Next Group →</button>
      </div>

      <h3>Standings</h3>
      <table className="league-table">
        <thead>
          <tr>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => {
            const fullTeam = schools.find((s) => s.name === team.name);
            return (
              <tr key={team.name} onClick={() => { console.log(fullTeam); setSelectedTeam(fullTeam); setTab('roster'); }} style={{ cursor: 'pointer' }}>
                <td>
                  {team.symbol} {team.name}
                </td>
                <td>{team.played}</td>
                <td>{team.wins}</td>
                <td>{team.draws}</td>
                <td>{team.losses}</td>
                <td>{team.goalsFor}</td>
                <td>{team.goalsAgainst}</td>
                <td>{team.goalDiff}</td>
                <td>{team.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3>Matches</h3>
      <ul className="league-matches">
        {groupMatches.map((match, index) => (
          <li key={index} className="match-item" onClick={() => { console.log(match); setSelectedMatch(match); setTab('match'); }}>
            {zodiacTeams.find((t) => t.name === match.home_team)?.symbol ?? ''} {match.home_team} vs{' '}
            {zodiacTeams.find((t) => t.name === match.away_team)?.symbol ?? ''} {match.away_team} —{' '}
            {match.home_score ?? '-'} - {match.away_score ?? '-'}
          </li>
        ))}
      </ul>
    </div>
  );
}
