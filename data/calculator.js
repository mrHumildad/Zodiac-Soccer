import matches from './matches.json' with { type: 'json' };
import matchStats from './matchStats.json' with { type: 'json' };
import getZodiacTeams from '../logics/getZodiacTeams.js';

const ZTeams = getZodiacTeams();
let updatedMatches = {...matches}
const day1 = matchStats.matches.filter((match) => match.round === '1');
const da1Finisched = day1.filter((match) => match.finished === true);
const day1ToPlay = day1.filter((match) => match.finished === false);
console.log('Day 1 matches:', day1.length);
console.log('Day 1 finished matches:', da1Finisched.length);
console.log('Day 1 matches to play:', day1ToPlay.length);
console.log(ZTeams);
if (day1ToPlay.length > 0) {
  updatedMatches.day1.matches = updatedMatches.day1.matches.map((match) => {
    match.status = 'ongoing';
    const homeTeam = ZTeams.find(t => t.name === match.home_team);
    const awayTeam = ZTeams.find(t => t.name === match.away_team);
    match.homePlayers = homeTeam ? homeTeam.players : [];
    match.awayPlayers = awayTeam ? awayTeam.players : [];
    return match;
  });
}
console.log('Updated matches:', updatedMatches.day1.matches[0]);