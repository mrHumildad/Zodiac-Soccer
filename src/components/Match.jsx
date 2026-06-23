import { useMemo, useState } from "react";
import "./Match.css";

import { rating2goals } from "../logic/rating2goals";
import { getFantaRating } from "../../data/utils.js";
import { getBest11 } from "../../data/getBest11.js";
import rawZodiacTeams from "../../data/teams.json" with { type: "json" };
import ZodiacIcon from "./ZodiacIcon";
import Player from "./Player";
import PlayerModal from "./PlayerModal";
import { useLanguage } from '../i18n/LanguageContext.jsx';

const Match = ({ selectedMatch, setTab }) => {
  const { t } = useLanguage();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerTeam, setSelectedPlayerTeam] = useState(null);
  const zodiacTeams = useMemo(() => Array.isArray(rawZodiacTeams) ? rawZodiacTeams : Object.values(rawZodiacTeams), [rawZodiacTeams]);

  const homeTeam = zodiacTeams.find(
    (team) => team.name === selectedMatch.home_team,
  );

  const awayTeam = zodiacTeams.find(
    (team) => team.name === selectedMatch.away_team,
  );

  if (selectedMatch.status === "scheduled") {
    return (
      <div className="zw-section">
        <div className="zw-card" style={{ textAlign: "center", padding: "32px" }}>
          <h2 style={{ color: "var(--gold)", marginBottom: "16px" }}>{t('matchScheduled')}</h2>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ZodiacIcon sign={homeTeam?.name} size={24} />
              <span>{selectedMatch.home_team}</span>
            </span>
            <span style={{ color: "var(--text-secondary)" }}>{t('vs')}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ZodiacIcon sign={awayTeam?.name} size={24} />
              <span>{selectedMatch.away_team}</span>
            </span>
          </div>
          <div style={{ marginTop: "24px" }}>
            <button className="zw-btn" onClick={() => setTab("league")}>{t('back')}</button>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = selectedMatch.status === "completed";
  const isOngoing = selectedMatch.status === "ongoing";

  const home11 = isCompleted
    ? selectedMatch.home11
    : getBest11(homeTeam, selectedMatch.turn);
  console.log(home11);
  const away11 = isCompleted
    ? selectedMatch.away11
    : getBest11(awayTeam, selectedMatch.turn);

  const homeGoals = isCompleted
    ? selectedMatch.home_goals
    : rating2goals(
        home11.reduce((sum, p) => sum + getFantaRating(p, selectedMatch.turn), 0),
      );

  const awayGoals = isCompleted
    ? selectedMatch.away_goals
    : rating2goals(
        away11.reduce((sum, p) => sum + getFantaRating(p, selectedMatch.turn), 0),
      );

  const homeTotalRating = isCompleted
    ? selectedMatch.home_score
    : home11.reduce((sum, p) => sum + getFantaRating(p, selectedMatch.turn), 0);

  const awayTotalRating = isCompleted
    ? selectedMatch.away_score
    : away11.reduce((sum, p) => sum + getFantaRating(p, selectedMatch.turn), 0);

  return (
    <div className="match-page">
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        {isOngoing ? (
          <span
            className="zw-live-pulse"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--cosmic-blue-soft)",
              background: "rgba(76, 125, 255, 0.12)",
              border: "1px solid rgba(76, 125, 255, 0.25)",
              padding: "0.3rem 0.85rem",
              borderRadius: "999px",
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--cosmic-blue)", display: "inline-block" }} />
            {t('live')}
          </span>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "var(--text-secondary)",
              background: "rgba(216, 180, 95, 0.08)",
              border: "1px solid rgba(216, 180, 95, 0.18)",
              padding: "0.3rem 0.85rem",
              borderRadius: "999px",
              textTransform: "uppercase",
            }}
          >
            {t('fullTime')}
          </span>
        )}
      </div>

      <div className="match-header">
        <div className="team-side">
          <div className="team-symbol">
            <span
              className="zw-symbol"
              style={{
                color: `var(--${homeTeam?.name.toLowerCase()})`,
                textShadow: `0 0 10px var(--${homeTeam?.name.toLowerCase()}-glow)`,
              }}
            >
              <ZodiacIcon sign={homeTeam?.name} size={48} />
            </span>
          </div>

          <div className="team-name">{homeTeam?.name}</div>
        </div>

        <div className={`score-board ${isOngoing ? "score-board-live" : ""}`}>
          <span>{homeGoals}</span>
          <span className="score-separator">:</span>
          <span>{awayGoals}</span>
        </div>

        <div className="team-side">
          <div className="team-symbol">
            <span
              className="zw-symbol"
              style={{
                color: `var(--${awayTeam?.name.toLowerCase()})`,
                textShadow: `0 0 10px var(--${awayTeam?.name.toLowerCase()}-glow)`,
              }}
            >
              <ZodiacIcon sign={awayTeam?.name} size={48} />
            </span>
          </div>

          <div className="team-name">{awayTeam?.name}</div>
        </div>
      </div>

      <div className="match-ratings">
        <span>({Number(homeTotalRating).toFixed(1)})</span>
        <span className="rating-separator">:</span>
        <span>({Number(awayTotalRating).toFixed(1)})</span>
      </div>

      <div className="astral-pitch" style={{"--home-sign-color": `var(--${homeTeam?.name.toLowerCase()})`, "--away-sign-color": `var(--${awayTeam?.name.toLowerCase()})`}}>
         <div className="home-zodiac-bg">
           <ZodiacIcon sign={homeTeam?.name} size={320} />
         </div>
         <div className="away-zodiac-bg">
           <ZodiacIcon sign={awayTeam?.name} size={320} />
         </div>
         <div className="field-row away-gk">
           {away11.filter((p) => p.pos === "Keeper").map((p) => <Player key={p.id || p.name} player={p} team={awayTeam} turn={selectedMatch.turn} onClick={(player) => { setSelectedPlayer(player); setSelectedPlayerTeam(awayTeam); }} />)}
         </div>

         <div className="field-row away-df">
           {away11.filter((p) => p.pos === "Defender").map((p) => <Player key={p.id || p.name} player={p} team={awayTeam} turn={selectedMatch.turn} onClick={(player) => { setSelectedPlayer(player); setSelectedPlayerTeam(awayTeam); }} />)}
         </div>

         <div className="field-row away-mf">
           {away11.filter((p) => p.pos === "Midfielder").map((p) => <Player key={p.id || p.name} player={p} team={awayTeam} turn={selectedMatch.turn} onClick={(player) => { setSelectedPlayer(player); setSelectedPlayerTeam(awayTeam); }} />)}
         </div>

         <div className="field-row away-fw">
           {away11.filter((p) => p.pos === "Attacker").map((p) => <Player key={p.id || p.name} player={p} team={awayTeam} turn={selectedMatch.turn} onClick={(player) => { setSelectedPlayer(player); setSelectedPlayerTeam(awayTeam); }} />)}
         </div>

         <div className="field-midline">
           <div className="center-circle" />
         </div>

         <div className="field-row home-fw">
           {home11.filter((p) => p.pos === "Attacker").map((p) => <Player key={p.id || p.name} player={p} team={homeTeam} turn={selectedMatch.turn} onClick={(player) => { setSelectedPlayer(player); setSelectedPlayerTeam(homeTeam); }} />)}
         </div>

         <div className="field-row home-mf">
           {home11.filter((p) => p.pos === "Midfielder").map((p) => <Player key={p.id || p.name} player={p} team={homeTeam} turn={selectedMatch.turn} onClick={(player) => { setSelectedPlayer(player); setSelectedPlayerTeam(homeTeam); }} />)}
         </div>

         <div className="field-row home-df">
           {home11.filter((p) => p.pos === "Defender").map((p) => <Player key={p.id || p.name} player={p} team={homeTeam} turn={selectedMatch.turn} onClick={(player) => { setSelectedPlayer(player); setSelectedPlayerTeam(homeTeam); }} />)}
         </div>

         <div className="field-row home-gk">
           {home11.filter((p) => p.pos === "Keeper").map((p) => <Player key={p.id || p.name} player={p} team={homeTeam} turn={selectedMatch.turn} onClick={(player) => { setSelectedPlayer(player); setSelectedPlayerTeam(homeTeam); }} />)}
         </div>
       </div>
       <div className="back-row">
         <button className="zw-btn" onClick={() => setTab("league")}>
           {t('back')}
         </button>
       </div>
       {selectedPlayer && (
         <PlayerModal
           player={selectedPlayer}
           team={selectedPlayerTeam}
           onClose={() => setSelectedPlayer(null)}
         />
      )}
     </div>
   );
};

export default Match;
