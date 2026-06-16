import zodiacTeams from "../../data/updatedZTeams.json" with { type: "json" };

const squadRestrictions = {
  GK: { min: 1, max: 1 },
  DF: { min: 3, max: 5 },
  MF: { min: 2, max: 5 },
  FW: { min: 1, max: 3 },
};

const defaultPlayer = {
  name: "Unknown",
  pos: "Unknown",
  overallRating: 4,
};

export const getFantaRating = (p) => {
  const day = p.matches?.day1;
  if (day?.overallRating != null) {
    return Number(day.overallRating) + Number(day.stats?.goals ?? 0) * 3 + Number(day.stats?.assists ?? 0) * 2;
  }
  return Number(p?.overallRating ?? 4);
};

const pickBestFromPool = (pool, count, used) => {
  const sorted = [...pool].sort((a, b) => getFantaRating(b) - getFantaRating(a));
  const selected = [];
  for (const p of sorted) {
    if (selected.length >= count) break;
    if (!used.has(p.id)) {
      selected.push(p);
      used.add(p.id);
    }
  }
  return selected;
};

export const getBest11 = (team) => {
  if (!team || !team.players) return [];

  const pools = { GK: [], DF: [], MF: [], FW: [] };
  for (const p of team.players) {
    const pos = p.pos;
    if (pools[pos]) pools[pos].push(p);
  }

  const used = new Set();
  const selected = [];
  const counts = { GK: 0, DF: 0, MF: 0, FW: 0 };

  for (const pos of ["GK", "DF", "MF", "FW"]) {
    const { min } = squadRestrictions[pos];
    const picked = pickBestFromPool(pools[pos], min, used);
    selected.push(...picked);
    counts[pos] = picked.length;
  }

  while (selected.length < 11) {
    const candidates = [];
    for (const pos of ["DF", "MF", "FW"]) {
      const { max } = squadRestrictions[pos];
      if (counts[pos] < max) {
        for (const p of pools[pos]) {
          if (!used.has(p.id)) {
            candidates.push(p);
          }
        }
      }
    }
    if (!candidates.length) break;
    candidates.sort((a, b) => getFantaRating(b) - getFantaRating(a));
    const best = candidates[0];
    selected.push(best);
    used.add(best.id);
    counts[best.pos]++;
  }

  while (selected.length < 11) {
    const pos =
      counts.DF < 5 ? "DF" :
      counts.MF < 5 ? "MF" :
      counts.FW < 3 ? "FW" :
      "Unknown";
    selected.push({ ...defaultPlayer, pos });
    counts[pos]++;
  }

  return selected.sort((a, b) => (getFantaRating(b) ?? 0) - (getFantaRating(a) ?? 0));
};
