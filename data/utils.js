export function num2mk(number) {
  // Check if the number is greater than or equal to 1 million
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    // Check if the number is greater than or equal to 1 thousand
    return (number / 1000).toFixed(0) + "k";
  } else {
    // If the number is less than 1 thousand, return it as is
    return number.toString();
  };
};
import nations from './nations.json' with { type: 'json' };

export function getFlagEmoji(fifa_code) { 
  const countryId = nations.find(n => n.fifa_code === fifa_code)?.id;
  if (!countryId) return "";
  return `https://images.fotmob.com/image_resources/logo/teamlogo/${countryId}.png`;
}

export function getTeamLogo(clubId)  {
  return `https://images.fotmob.com/image_resources/logo/teamlogo/${clubId}.png`
}

export function getPortrait(id)  {
  return `https://images.fotmob.com/image_resources/playerimages/${id}.png`
}

export const rating2goals = (rating) => {
  if (rating < 66) return 0;
  return Math.floor((rating - 66) / 6) + 1;
};
export const getShortName = (name) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : name;
};

export const getFantaRating = (p, dayN) => {
  const day = p.matches?.[dayN];
  if (day?.rating != null) {
    return  Number(day.rating) +
            Number(day.goals ?? 0) * 3 +
            Number(day.assists ?? 0) * 2 -
            Number(day.yelowCards ?? 0) -
            Number(day.redCards ?? 0) * 2 -
            Number(day.ownGoals ?? 0) * 2 -
            Number(day.missedPenalties ?? 0) * 2
  }
  return Number(p?.rating ?? 4);
};

export const getAverageRating = (p) => {
  if (!p.matches) return null;
  const ratings = Object.values(p.matches)
    .filter(m => m.rating != null)
    .map(m => Number(m.rating) +
      Number(m.goals ?? 0) * 3 +
      Number(m.assists ?? 0) * 2 -
      Number(m.yellowCards ?? 0) -
      Number(m.redCards ?? 0) * 2 -
      Number(m.ownGoals ?? 0) * 2 -
      Number(m.missedPenalties ?? 0) * 2);
  if (ratings.length === 0) return null;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
};

export const getTeamStats = (team) => {
  const allPlayers = team.players;
  const players = allPlayers.filter(p => getAverageRating(p) != null);
  let stats = {
    unusedPlayersPercentage: allPlayers.length === 0 ? 0 : (allPlayers.length - players.length) / allPlayers.length * 100,
    avgrating: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    ownGoals: 0,
    missedPenalties: 0,
    minutes: 0,
    avgAge: 0,
    avgHeight: 0
  };
  for (const player of players)
  {
    const matches = Object.values(player.matches ?? {});
    stats.avgrating += getAverageRating(player);
    stats.goals += matches.reduce((sum, m) => sum + Number(m.goals ?? 0), 0);
    stats.assists += matches.reduce((sum, m) => sum + Number(m.assists ?? 0), 0);
    stats.yellowCards += matches.reduce((sum, m) => sum + Number(m.yellowCards ?? 0), 0);
    stats.redCards += matches.reduce((sum, m) => sum + Number(m.redCards ?? 0), 0);
    stats.ownGoals += matches.reduce((sum, m) => sum + Number(m.ownGoals ?? 0), 0);
    stats.missedPenalties += matches.reduce((sum, m) => sum + Number(m.missedPenalties ?? 0), 0);
    stats.minutes += matches.reduce((sum, m) => sum + Number(m.minutes ?? 0), 0);
    stats.avgAge += player.age ?? 0;
    stats.avgHeight += player.height ?? 0;
  }
  stats.avgrating /= players.length;
  stats.avgAge /= players.length;
  stats.avgHeight /= players.length;
  return stats;
};

