import teams from './raw/teams.json' with { type: 'json' };
import zodiacsMetadata from './raw/zodiacs.json' with { type: 'json' };
import fs from 'fs';
import path from 'path';

const outputPath = path.resolve('zodiacTeams.json');
const ZODIAC_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function getZodiacTeams() {
  const zodiacTeams = ZODIAC_ORDER.map(name => ({
    name,
    symbol: zodiacsMetadata[name].symbol,
    element: zodiacsMetadata[name].element,
    quality: zodiacsMetadata[name].quality,
    ruling_planet: zodiacsMetadata[name].ruling_planet,
    dates: zodiacsMetadata[name].dates,
    players: []
  }));

  for (const squad of teams) {
    for (const player of squad.players) {
      const zodiac = player.zodiac;
      const team = zodiacTeams.find(t => t.name === zodiac);
      if (team) {
        team.players.push({ ...player, fifa_code: squad.fifa_code , id: squad.fifa_code + '-' + player.number, status: 'toPlay' });
      }
    }
  }
  fs.writeFileSync(
    outputPath,
    JSON.stringify(zodiacTeams, null, 2)
  );
  return zodiacTeams;
}
getZodiacTeams();