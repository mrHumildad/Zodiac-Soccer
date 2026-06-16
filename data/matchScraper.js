import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'data')

const teams = JSON.parse(
  fs.readFileSync(path.join(dataDir, 'teams.json'), 'utf8')
)

function normalizeKey(str) {
  return String(str)
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
}

const nameToFifaCode = new Map()

for (const team of teams) {
  const code = team.fifa_code

  const add = (key) => {
    if (key) {
      nameToFifaCode.set(normalizeKey(key), code)
    }
  }

  add(team.name)
  add(team.name_normalised ?? team.name)
  if (Array.isArray(team.aliases)) {
    for (const alias of team.aliases) {
      add(alias)
    }
  }
}

function getFifaCode(name) {
  const code = nameToFifaCode.get(normalizeKey(name))

  if (code === undefined || code === null) {
    console.warn(`Missing FIFA code for team name: ${name}`)
    return null
  }

  return code
}

const overviewURL =
  'https://www.fotmob.com/leagues/77/overview/world-cup'

const headers = {
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

const IMPORTANT_PLAYER_STATS = new Set([
  'goals',
  'assists',
  'shots',
  'shots_on_target',
  'big_chances_created',
  'chances_created',
  'passes',
  'accurate_passes',
  'touches',
  'minutes_played',
  'rating',
  'tackles_won',
  'interceptions',
  'recoveries',
  'clearances',
  'duels_won',
  'saves',
  'expected_goals_xg',
  'expected_assists_xa',
])

async function fetchWithTimeout(url) {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(20000),
  })

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    )
  }

  return response.text()
}

function extractPageProps(html) {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s
  )

  if (!match) {
    throw new Error('__NEXT_DATA__ not found')
  }

  const nextData = JSON.parse(match[1])

  return nextData?.props?.pageProps
}

function parseOverview(html) {
  const pageProps = extractPageProps(html)

  const matches =
    pageProps?.overview?.matches?.allMatches

  if (!Array.isArray(matches)) {
    throw new Error('Matches not found')
  }

  return matches
    .filter((m) => m.status?.finished && !m.status?.cancelled)
    .map((m) => ({
      matchId: String(m.id),
      home: getFifaCode(m.home?.name),
      away: getFifaCode(m.away?.name),
      homeTeamId: m.home?.id,
      awayTeamId: m.away?.id,
      dateUTC: m.status?.utcTime,
      finished: Boolean(m.status?.finished),
      round: m.round ?? null,
      group: m.group ?? null,
    }))
}

function extractTeamStats(html) {
  const pageProps = extractPageProps(html)

  const periods =
    pageProps?.content?.stats?.Periods

  if (!Array.isArray(periods) || !periods.length) {
    return null
  }

  const period = periods[0]

  const stats = {}

  for (const stat of period.stats || []) {
    const key = normalizeKey(stat.title)

    stats[key] = {
      home:
        stat.stats?.homeValue ??
        stat.homeValue ??
        null,

      away:
        stat.stats?.awayValue ??
        stat.awayValue ??
        null,
    }
  }

  return {
    homeScore: period.homeScore ?? null,
    awayScore: period.awayScore ?? null,
    stats,
  }
}

function normalizePlayer(player, fifaCode) {
  if (!player) return null

  const statGroups = Array.isArray(player.stats)
    ? player.stats
    : []

  const stats = {}

  for (const group of statGroups) {
    if (
      !group ||
      typeof group !== 'object' ||
      !group.stats
    ) {
      continue
    }

    for (const [name, obj] of Object.entries(
      group.stats
    )) {
      const key = normalizeKey(name)

      if (!IMPORTANT_PLAYER_STATS.has(key))
        continue

      const value = obj?.stat?.value

      if (
        value !== undefined &&
        value !== null
      ) {
        stats[key] = value
      }
    }
  }

  if (!Object.keys(stats).length) {
    return null
  }

  return {
    id: player.id ?? null,
    teamId: player.teamId ?? null,
    fifaCode: fifaCode ?? null,
    name: player.name ?? null,
    position:
      player.usualPosition != null
        ? String(player.usualPosition)
        : null,
    shirtNumber:
      Number(player.shirtNumber) || null,
    stats,
  }
}

function extractPlayers(html, homeCode, awayCode, homeTeamId, awayTeamId) {
  const pageProps = extractPageProps(html)

  const playerStats =
    pageProps?.content?.playerStats

  if (!playerStats) {
    return []
  }

  const players = []

  for (const player of Object.values(
    playerStats
  )) {
    const fifaCode =
      player.teamId != null && homeCode && awayCode && homeTeamId && awayTeamId
        ? String(player.teamId) === String(homeTeamId)
          ? homeCode
          : String(player.teamId) === String(awayTeamId)
            ? awayCode
            : null
        : null

    const normalized =
      normalizePlayer(player, fifaCode)

    if (normalized) {
      players.push(normalized)
    }
  }

  return players
}

async function fetchMatch(matchId) {
  const url =
    `https://www.fotmob.com/api/match/${matchId}`

  const html = await fetchWithTimeout(url)

  return html
}

function buildMatchPayload(matchMeta, html) {
  if (!matchMeta.finished) return null

  const teamStats =
    extractTeamStats(html)

  const players =
    extractPlayers(html, matchMeta.home, matchMeta.away, matchMeta.homeTeamId, matchMeta.awayTeamId)

  return {
    id: matchMeta.matchId,

    dateUTC: matchMeta.dateUTC,

    round: matchMeta.round,

    group: matchMeta.group,

    finished: matchMeta.finished,

    homeTeam: {
      id: matchMeta.homeTeamId,
      code: matchMeta.home,
    },

    awayTeam: {
      id: matchMeta.awayTeamId,
      code: matchMeta.away,
    },

    score: {
      home:
        teamStats?.homeScore ?? null,
      away:
        teamStats?.awayScore ?? null,
    },

    teamStats:
      teamStats?.stats ?? {},

    players,
  }
}

async function scrapeAllMatches() {
  console.log(
    'Fetching World Cup overview...'
  )

  const overviewHTML =
    await fetchWithTimeout(
      overviewURL
    )

  const matches =
    parseOverview(overviewHTML)

  console.log(
    `${matches.length} matches found`
  )

  const result = []

  for (
    let i = 0;
    i < matches.length;
    i++
  ) {
    const match = matches[i]

    console.log(
      `[${i + 1}/${matches.length}] ${match.home} vs ${match.away}`
    )

    try {
      const html =
        await fetchMatch(
          match.matchId
        )

      const payload =
        buildMatchPayload(
          match,
          html
        )

      if (payload) {
        result.push(payload)
      }
    } catch (err) {
      console.warn(
        `Failed ${match.matchId}: ${err.message}`
      )
    }
  }

  return {
    source: 'fotmob',
    fetchedAt:
      new Date().toISOString(),
    count: result.length,
    matches: result,
  }
}

async function save(payload) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, {
      recursive: true,
    })
  }

  const output = path.join(
    dataDir,
    'matchStats.json'
  )

  fs.writeFileSync(
    output,
    JSON.stringify(payload, null, 2),
    'utf8'
  )

  const sizeMB = (
    fs.statSync(output).size /
    1024 /
    1024
  ).toFixed(2)

  console.log(
    `Saved ${output} (${sizeMB} MB)`
  )
}

async function main() {
  try {
    console.log(
      'Starting FotMob scraper...'
    )

    const payload =
      await scrapeAllMatches()

    await save(payload)

    console.log(
      `Done. ${payload.count} matches saved.`
    )
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  }
}

main()
