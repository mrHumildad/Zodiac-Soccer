import { getShortName, getFlagEmoji, getTeamLogo } from "../../data/utils.js";

const Player = ({ player, team, averageRating, onClick }) => {
  const flag  = getFlagEmoji(player.fifa_code);
  const logo = getTeamLogo(player.club_id);
  const ratingDisplay = averageRating != null ? averageRating.toFixed(1) : '—';
  return (
    <div
      key={player.id || player.name}
      className="player-star"
      onClick={() => onClick?.(player)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="player-name">{getShortName(player.name).toUpperCase()}</div>
      <div className="player-core-wrapper">
        <div
          className="player-core"
          style={{
            background: `var(--${team?.name.toLowerCase()})`,
            boxShadow: `
              0 0 .5rem var(--${team?.name.toLowerCase()}),
              0 0 1rem var(--${team?.name.toLowerCase()}-glow)
            `,
          }}
        />
        <div className="player-rating">{ratingDisplay}</div>
      </div>
      <div className="player-info">
        <span className="player-logo">{logo && <img src={logo} alt={team.name} style={{ width: '20px', height: '14px', objectFit: 'contain' }} />}</span>
        <span className="player-shirt">{player.number}</span>
        <span className="player-flag">{flag && <img src={flag} alt={player.fifa_code} style={{ width: '20px', height: '14px', objectFit: 'contain' }} />}</span>
      </div>
    </div>
  );
};

export default Player;
