const headers = {
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

const url = 'https://www.fotmob.com/leagues/77/overview/world-cup'

fetch(url, { headers })
  .then((r) => r.text())
  .then((html) => {
    const match = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s
    )
    if (!match) {
      console.log('No __NEXT_DATA__ found')
      return
    }
    const nextData = JSON.parse(match[1])
    const matches =
      nextData?.props?.pageProps?.overview?.matches?.allMatches
    if (!Array.isArray(matches)) {
      console.log('No matches array')
      return
    }
    console.log('Total in overview:', matches.length)
    console.log('First match:', JSON.stringify(matches[0], null, 2).slice(0, 1200))
    console.log(
      `Finished: ${matches.filter((m) => m.finished).length}`
    )
    console.log(
      `Cancelled: ${matches.filter((m) => m.cancelled).length}`
    )
    console.log(
      `Has status: ${matches.filter((m) => m.status).length}`
    )
    console.log(
      `Sample statuses:`,
      matches.slice(0, 5).map((m) => ({
        id: m.id,
        finished: m.finished,
        cancelled: m.cancelled,
        status: m.status,
      }))
    )
  })
  .catch((err) => console.error(err))
