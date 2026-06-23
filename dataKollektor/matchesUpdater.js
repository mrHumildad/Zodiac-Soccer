import fs from "fs";
import { rating2goals } from "./utils.js";
import { getBest11, getFantaRating } from "./getBest11.js";
import zodiacTeams from "./data/teams.json" with { type: "json" };
import matches from "./data/matches.json" with { type: "json" };

const processMatch = (match) => {
  if (match.status === "completed" && !match.home_goals && !match.away_goals) {
    const homeTeam = zodiacTeams[match.home_team];
    const awayTeam = zodiacTeams[match.away_team];
    const dayN = match.turn;

    const home11 = getBest11(homeTeam, dayN);
    const away11 = getBest11(awayTeam, dayN);

    const homeGoals = rating2goals(
      home11.reduce((sum, p) => sum + getFantaRating(p, dayN), 0),
    );

    const awayGoals = rating2goals(
      away11.reduce((sum, p) => sum + getFantaRating(p, dayN), 0),
    );

    const filterDay = (p) => ({
      ...p,
      matches: p.matches?.[dayN] ? { [dayN]: p.matches[dayN] } : {},
    });
    console.log(homeGoals, awayGoals);
    return {
      ...match,
      home_goals: homeGoals,
      away_goals: awayGoals,
      home_score: home11.reduce((sum, p) => sum + getFantaRating(p, dayN), 0).toFixed(2),
      away_score: away11.reduce((sum, p) => sum + getFantaRating(p, dayN), 0).toFixed(2),
      home11: home11.map(filterDay),
      away11: away11.map(filterDay),
    };
  }
  return match;
};

const updatedMatches = {
  ...matches,
  day1: {
    ...matches.day1,
    matches: matches.day1.matches.map(processMatch),
  },
  day2: {
    ...matches.day2,
    matches: matches.day2.matches.map(processMatch),
  },
  day3: {
    ...matches.day3,
    matches: matches.day3.matches.map(processMatch),
  },
};

fs.writeFileSync("./data/matches.json", JSON.stringify(updatedMatches, null, 2));
console.log("Updated matches saved to ./data/matches.json");