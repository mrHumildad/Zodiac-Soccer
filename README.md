# Zodiac Soccer

Zodiac Soccer is a zodiac-themed fantasy soccer league manager built with React and Vite. The project models a full competition where each zodiac sign is a national team, with complete schedules, standings, squads, and fantasy-style player ratings.

## Next Steps

The immediate focus for the next season is to expand the league to **major national masculine and femenine leagues**. Beyond the league and match features, an **Insight session** is also planned, where correlations between zodiac signs and soccer stats will be analyzed, with possible applications to understanding or even informing **betting odds**.

## Features

- **League standings** — live group table (W/D/L, GF, GA, GD, Pts)
- **Group navigation** — Cardinal, Fixed, and Mutable groups
- **Match viewer** — scheduled matches and completed match cards with scores
- **Team rosters** — squads listed by position with player ratings
- **Best-11 solver** — selects the optimal formation under 4-3-3 / 3-5-2-like constraints
- **Fantasy rating engine** — fanta-ratings from base ratings, goals, and assists
- **Rating-to-goals conversion** — maps combined fantasy rating to expected goals
- **ZWC26 view** — browse all 12 zodiac teams and squad composition
- **Zodiac distribution** — players linked to zodiac signs with per-sign counts
- **Data pipeline** — Node scripts scrape and transform match & zodiac data into JSON

## Tech Stack

- [React](https://react.dev) 19
- [Vite](https://vite.dev) 8
- ESLint with React hooks and refresh plugins
- Node.js scripts for data generation and scraping

## Scripts

- `npm run dev` — start dev server with HMR
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run preview` — preview production build
