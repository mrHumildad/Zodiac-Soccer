import squads from '../data/squads.json';
import zodiacsMetadata from '../data/zodiacs.json';

const ZODIAC_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function getZodiacTeams() {
  const teams = ZODIAC_ORDER.map(name => ({
    name,
    symbol: zodiacsMetadata[name].symbol,
    element: zodiacsMetadata[name].element,
    quality: zodiacsMetadata[name].quality,
    ruling_planet: zodiacsMetadata[name].ruling_planet,
    dates: zodiacsMetadata[name].dates,
    players: []
  }));

  for (const squad of squads) {
    const code = squad.fifa_code;
    for (const player of squad.players) {
      const zodiac = player.zodiac;
      if (teams.some(t => t.name === zodiac)) {
        const team = teams.find(t => t.name === zodiac);
        team.players.push({ ...player, fifa_code: code });
      }
    }
  }

  return teams;
}
