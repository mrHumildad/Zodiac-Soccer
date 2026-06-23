import fs from "fs";
import zodiacs from "./zodiacs.json" with { type: 'json' };
import nations from "./nations.json" with { type: 'json' };
const LEAGUE_ID = 77; // World Cup
const TEAM_API = "https://www.fotmob.com/api/data/teams?id=";

let clubs = [];
let zodiacTeams = {...zodiacs};

const headers = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
  Accept: "application/json",
  Referer: "https://www.fotmob.com/"
};

async function fetchJSON(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.log("FAILED:", url, res.status);
    return null;
  }
  return res.json();
}

const getZodiacSign = (date) => {
  const [, month, day] = date.split("-").map(Number);

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";

  return "Capricorn";
};

/**
 * STEP 1: get teams from World Cup table
 */
async function getTeams() {
  console.log("Fetching league data...");

  const data = await fetchJSON(
    `https://data.fotmob.com/stats/77/season/24254/rating_team.json`
  );

  if (!data) throw new Error("No league data");

  // usually structure:
  console.log(Object.keys(data.TopLists[0].StatList[0]));
  const teams = data.TopLists[0].StatList;
  const result = teams.map((t) => ({
    id: t.TeamId,
    name: t.ParticipantName,
    countryCode: t.ParticipantCountryCode
  }));

  console.log(`Found ${result.length} teams`);
    fs.writeFileSync("nations.json", JSON.stringify(result, null, 2));
  return result;
}

/**
 * STEP 2: fetch squad
 */
async function getSquad(teamId) {
  const data = await fetchJSON(`${TEAM_API}${teamId}`);
  if (!data?.squad?.squad) return [];

  return data.squad.squad
    .slice(1)
    .flatMap((g) => g.members);
}

/**
 * STEP 3: build final structure
 */
async function run() {
  //const teams = await getTeams();
  const teams = JSON.parse(fs.readFileSync("nations.json"));
  const output = [];

  for (const team of teams) {
    console.log(`Fetching squad: ${team.name} (${team.id})`);

    const players = await getSquad(team.id);

    const formattedPlayers = players.map((p) => ( 
      //console.log(p),
     {
      fm_id: p.id,
      id: p.shirtNumber + '-' + team.fifa_code,
      fifa_code: team.fifa_code,
      name: p.name,
      number: p.shirtNumber,
      pos: p.role.fallback,
      age: p.age,
      date_of_birth: p.dateOfBirth,
      height: p.height,
      matches: {},
      club_id: p.ccode,
      club_name: p.cname,
      value: p.transferValue
    }));
    console.log(formattedPlayers.length, 'players found');
    for (const player of formattedPlayers) {
      const sign = getZodiacSign(player.date_of_birth);
      console.log(sign, player);
     
      if (clubs.find((c) => c.id === player.club_id) === undefined) {
        clubs.push({ id: player.club_id, name: player.club_name});
      }
      zodiacTeams[sign].players.push(player);
    }

    await new Promise((r) => setTimeout(r, 500)); // rate limit safety
  }

  fs.writeFileSync("worldcup_squads.json", JSON.stringify(zodiacTeams, null, 2));
  fs.writeFileSync("clubs.json", JSON.stringify(clubs, null, 2));

  console.log("DONE → worldcup_squads.json");
}

run();