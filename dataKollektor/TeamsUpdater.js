import fs from "fs";
import zodiacTeams from "./raw/worldcup_squads.json" with { type: 'json' };


let events =[]
// Deep clone zodiacTeams for mutation
const updatedZodiacTeams = JSON.parse(JSON.stringify(zodiacTeams));

// Build a lookup map: fm_id (string) → { sign, index }
const zodiacPlayerMap = new Map();
for (const [sign, team] of Object.entries(updatedZodiacTeams)) {
  team.players.forEach((player, index) => {
    zodiacPlayerMap.set(String(player.fm_id), { sign, index });
  });
}

const URL =
  "https://www.fotmob.com/api/data/leagues?id=77&ccode3=ESP";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36",
  "Accept": "application/json",
  "Referer": "https://www.fotmob.com/"
};

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000);
  const response = await fetch(url, { ...options, signal: controller.signal });
  clearTimeout(id);
  return response;
};

async function fetchJSON(url) {
  const res = await fetchWithTimeout(url, { headers });
  if (!res.ok) {
    console.log("FAILED:", url, res.status);
    return null;
  }
  return res.json();
}
async function fetchMatch(matchId) {
  const url =
    `https://www.fotmob.com/api/match/${matchId}`

  const res = await fetchWithTimeout(url);
  const html = await res.text();

  return html;
}

function extractPageProps(html) {
  //console.log(html);
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s
  )

  if (!match) {
    throw new Error('__NEXT_DATA__ not found')
  }

  const nextData = JSON.parse(match[1])

  return nextData?.props?.pageProps
}

async function getMatches() {
  const data = await fetchJSON(URL);
  
  //console.log("TEST:", Object.keys(data.overview.matches.allMatches[0] || {}));
  const allMatches = data.overview.matches.allMatches;
  const finishedMatches = allMatches.filter((m) => m.status.finished);
  console.log(`Found ${allMatches.length} matches, ${finishedMatches.length} finished`);
  for (const match of finishedMatches) {
    console.log(match.pageUrl, match.home.name, match.away.name, match.round);
    const matchhtml = await fetchMatch(match.id);
    const pageProps = extractPageProps(matchhtml);
    const matchData = pageProps?.content?.lineup;
    console.log(matchData);
    const dayN = 'day' + match.round;
    const players = [...matchData.homeTeam.starters, ...matchData.homeTeam.subs, ...matchData.awayTeam.starters, ...matchData.awayTeam.subs];
    //console.log(players[5], "players");
    players.forEach(p => {
      const match = zodiacPlayerMap.get(String(p.id));
      for (const event of p?.performance?.events ?? []) {
        if (!events.includes(event.type)) {
          events.push(event.type);
        }
      }
      if (match) {
        const performance = (p) => {
          if (!p?.performance) return null;
          console.log(p.performance);
          let performance = {};
          performance.rating = p.performance.rating
          if (performance.events) {
            console.log(p.performance.events);
          }
          if (p.performance?.events?.filter(e => e.type === 'goal').length > 0) {
            performance.goals = p.performance.events.filter(e => e.type === 'goal').length
          }
          if (p.performance?.events?.filter(e => e.type === 'assist').length > 0) {
            performance.assists = p.performance.events.filter(e => e.type === 'assist').length
          }
          if (p.performance?.events?.filter(e => e.type === 'redCard').length > 0) {
            performance.redCards = p.performance.events.filter(e => e.type === 'redCard').length
          }
          if (p.performance?.events?.filter(e => e.type === 'yellowCard').length > 0) {
            performance.yellowCards = p.performance.events.filter(e => e.type === 'yellowCard').length
          }
          if (p.performance?.events?.filter(e => e.type === 'ownGoal').length > 0) {
            performance.ownGoals = p.performance.events.filter(e => e.type === 'ownGoal').length
          }
          if (p.performance?.events?.filter(e => e.type === 'missedPenalty').length > 0) {
            performance.missedPenalties = p.performance.events.filter(e => e.type === 'missedPenalty').length
          }
          if (p.performance?.substitutionEvents) {
            performance.minutes = 90 - p.performance?.substitutionEvents[0].time
          } else {
            performance.minutes = 90
          }
          return performance
        }
        
        updatedZodiacTeams[match.sign].players[match.index].matches[dayN] = performance(p);
      } else {
        console.log(`No zodiac match for: ${p.name} (id=${p.id})`);
      }
    })
  }
  console.log(events);
  if (!data) throw new Error("No data");
  fs.writeFileSync("./data/teams.json", JSON.stringify(updatedZodiacTeams, null, 2));
  console.log("Updated zodiac teams saved to ./data/teams.json");
}
await getMatches();