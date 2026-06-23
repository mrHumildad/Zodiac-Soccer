const squadRestrictions = {
  Goalkeeper: { min: 1, max: 1 },
  Defender: { min: 3, max: 5 },
  Midfielder: { min: 2, max: 5 },
  Attacker: { min: 1, max: 3 },
};

const defaultPlayer = {
  name: "Unknown",
  pos: "Unknown",
  rating: 4,
};

const posMap = { Keeper: "Goalkeeper", FW: "Attacker", DF: "Defender", MF: "Midfielder", Goalkeeper: "Goalkeeper", Attacker: "Attacker", Defender: "Defender", Midfielder: "Midfielder" };

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
  if (!p.matches) return Number(p?.rating ?? 4);
  const ratings = Object.values(p.matches)
    .filter(m => m.rating != null)
    .map(m => Number(m.rating));
  if (ratings.length === 0) return Number(p?.rating ?? 4);
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
};

const pickBestFromPool = (pool, count, used, dayN) => {
  const sorted = [...pool].sort((a, b) => getFantaRating(b, dayN) - getFantaRating(a, dayN));
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

export const getBest11 = (team, dayN) => {
  if (!team || !team.players) return [];

  const pools = { Goalkeeper: [], Defender: [], Midfielder: [], Attacker: [] };
  const fwPool = [];

  for (const p of team.players) {
    const mapped = posMap[p.pos];
    if (mapped === "Goalkeeper") {
      pools.Goalkeeper.push(p);
    } else if (mapped === "Defender") {
      pools.Defender.push(p);
    } else if (mapped === "Midfielder") {
      pools.Midfielder.push(p);
    } else if (mapped === "Attacker") {
      pools.Attacker.push(p);
      fwPool.push(p);
    }
  }

  if (pools.Defender.length === 0 && pools.Midfielder.length === 0 && pools.Attacker.length > 0) {
    const sorted = [...fwPool].sort((a, b) => getFantaRating(b, dayN) - getFantaRating(a, dayN));
    const dfCount = Math.min(squadRestrictions.Defender.max, Math.max(squadRestrictions.Defender.min, Math.floor(sorted.length * 0.4)));
    const mfCount = Math.min(squadRestrictions.Midfielder.max, Math.max(squadRestrictions.Midfielder.min, Math.floor(sorted.length * 0.35)));
    const fwCount = Math.min(squadRestrictions.Attacker.max, Math.max(squadRestrictions.Attacker.min, sorted.length - dfCount - mfCount));

    let idx = 0;
    for (let i = 0; i < dfCount && idx < sorted.length; i++, idx++) {
      pools.Defender.push({ ...sorted[idx], pos: "Defender" });
    }
    for (let i = 0; i < mfCount && idx < sorted.length; i++, idx++) {
      pools.Midfielder.push({ ...sorted[idx], pos: "Midfielder" });
    }
    for (let i = 0; i < fwCount && idx < sorted.length; i++, idx++) {
      pools.Attacker.push({ ...sorted[idx], pos: "Attacker" });
    }
    while (idx < sorted.length) {
      const remaining = sorted[idx];
      if (pools.Defender.length < squadRestrictions.Defender.max) {
        pools.Defender.push({ ...remaining, pos: "Defender" });
      } else if (pools.Midfielder.length < squadRestrictions.Midfielder.max) {
        pools.Midfielder.push({ ...remaining, pos: "Midfielder" });
      } else {
        pools.Attacker.push({ ...remaining, pos: "Attacker" });
      }
      idx++;
    }
  }

  const used = new Set();
  const selected = [];
  const counts = { Goalkeeper: 0, Defender: 0, Midfielder: 0, Attacker: 0 };

  for (const pos of ["Goalkeeper", "Defender", "Midfielder", "Attacker"]) {
    const { min } = squadRestrictions[pos];
    const picked = pickBestFromPool(pools[pos], min, used, dayN);
    selected.push(...picked);
    counts[pos] = picked.length;
  }

  while (selected.length < 11) {
    const candidates = [];
    for (const pos of ["Defender", "Midfielder", "Attacker"]) {
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
    candidates.sort((a, b) => getFantaRating(b, dayN) - getFantaRating(a, dayN));
    const best = candidates[0];
    selected.push(best);
    used.add(best.id);
    counts[best.pos]++;
  }

  while (selected.length < 11) {
    const pos =
      counts.Defender < 5 ? "Defender" :
      counts.Midfielder < 5 ? "Midfielder" :
      counts.Attacker < 3 ? "Attacker" :
      "Unknown";
    selected.push({ ...defaultPlayer, pos });
    counts[pos]++;
  }

  return selected.sort((a, b) => (getFantaRating(b, dayN) ?? 0) - (getFantaRating(a, dayN) ?? 0));
};
