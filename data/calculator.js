import matches from './matches.json' with { type: 'json' };
import matchStats from './raw/matchStats.json' with { type: 'json' };
import zodiacTeams from './zodiacTeams.json' with { type: 'json' };
import { writeFileSync } from 'fs';
const ZTeams = zodiacTeams;

function getZodiacTeamByPlayerId(playerId) {
  for (const team of ZTeams) {
    const found = team.players.find(p => p.id === playerId);
    if (found) return team.name;
  }
  return null;
}
let updatedMatches = JSON.parse(JSON.stringify(matches));
const updatedZteams = {};
zodiacTeams.forEach((team) => {
  updatedZteams[team.name] = JSON.parse(JSON.stringify(team));
});
const day1 = matchStats.matches.filter((match) => match.round === '1');
const day1Finished = day1.filter((match) => match.finished === true);
const day1ToPlay = day1.filter((match) => match.finished === false);
console.log('Day 1 matches:', day1.length);
console.log('Day 1 finished matches:', day1Finished.length);
console.log('Day 1 matches to play:', day1ToPlay.length);
//console.log(ZTeams);
if (day1Finished.length > 0) {
  updatedMatches.day1.matches = updatedMatches.day1.matches.map((match) => {
    match.status = 'ongoing';

    day1Finished.forEach((finishedMatch) => {
      finishedMatch.players.forEach((player) => {
        console.log(player)
        const zodiacTeam = getZodiacTeamByPlayerId(player.id);
        updatedZteams[zodiacTeam].players = updatedZteams[zodiacTeam].players.map((p) => {
          if (p.id === player.id) {
            p.status = 'played';
            p.matches.day1 = {
              matchId: finishedMatch.id,
              homeTeam: finishedMatch.homeTeam.code,
              awayTeam: finishedMatch.awayTeam.code,
              overallRating: player.overallRating,
              stats: player.stats
            };
          }
          return p;
        });
        console.log('Finished match player:', player.id, player.name, player.overallRating, '-> zodiacTeam:', zodiacTeam);
      });
    });
    return match;
  });
}
console.log('Updated matches:', updatedMatches.day1.matches);
writeFileSync('./updatedZTeams.json', JSON.stringify(updatedZteams, null, 2));