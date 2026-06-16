import teams from '../data/teams.json' with { type: 'json' };
import zodiacsMetadata from '../data/zodiacs.json' with { type: 'json' };

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
        team.players.push({ ...player, fifa_code: squad.fifa_code });
      }
    }
  }

  return zodiacTeams;
}
