import fs from "fs";

const LEAGUE_ID = 77; // World Cup
const TEAM_API = "https://www.fotmob.com/api/data/teams?id=";

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
  const [year, month, day] = date.split("-").map(Number);
  const zodiacSigns = [
    { sign: "Capricorn", start: [12, 22], end: [1, 19] },
    { sign: "Aquarius", start: [1, 20], end: [2, 18] },
    { sign: "Pisces", start: [2, 19], end: [3, 20] },
    { sign: "Aries", start: [3, 21], end: [4, 19] },
    { sign: "Taurus", start: [4, 20], end: [5, 20] },
    { sign: "Gemini", start: [5, 21], end: [6, 20] },
    { sign: "Cancer", start: [6, 21], end: [7, 22] },
    { sign: "Leo", start: [7, 23], end: [8, 22] },
    { sign: "Virgo", start: [8, 23], end: [9, 22] },
    { sign: "Libra", start: [9, 23], end: [10, 22] },
    { sign: "Scorpio", start: [10, 23], end: [11, 21] },
    { sign: "Sagittarius", start: [11, 22], end: [12, 21] }
  ];

  for (const { sign, start, end } of zodiacSigns) {
    if (year >= start[0] && year <= end[0]) {
      if (month > start[1] || (month === start[1] && day >= start[1])) {
        return sign;
      }
    }
  }
  return "Aquarius";
};

/**
 * STEP 1: get teams from World Cup table
 */
async function getTeams() {
  console.log("Fetching league data...");

  const data = await fetchJSON(
    `https://www.fotmob.com/api/leagues?id=${LEAGUE_ID}`
  );

  if (!data) throw new Error("No league data");

  // usually structure:
  const teams = data.table?.teams || data.table || [];

  const result = teams.map((t) => ({
    id: t.id,
    name: t.name,
    countryCode: t.ccode
  }));

  console.log(`Found ${result.length} teams`);
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
  const teams = await getTeams();

  const output = [];

  for (const team of teams) {
    console.log(`Fetching squad: ${team.name} (${team.id})`);

    const players = await getSquad(team.id);

    const formattedPlayers = players.map((p) => ({
      id: p.id,
      name: p.name,
      number: p.shirtNumber,
      position: p.positionIdsDesc,
      age: p.age,
      height: p.height,
      zodiacSign: getZodiacSign(p.birthDate),
      nationality: p.ccode,
      value: p.transferValue
    }));

    output.push({
      team: team.name,
      team_id: team.id,
      country: team.countryCode,
      players: formattedPlayers
    });

    await new Promise((r) => setTimeout(r, 500)); // rate limit safety
  }

  fs.writeFileSync("worldcup_squads.json", JSON.stringify(output, null, 2));

  console.log("DONE → worldcup_squads.json");
}

run();