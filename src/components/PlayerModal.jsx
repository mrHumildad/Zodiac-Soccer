import { getFlagEmoji, getTeamLogo, getPortrait, getAverageRating } from '../../data/utils.js';

const PlayerModal = ({ player, team, onClose }) => {
  if (!player) return null;
  const flag = getFlagEmoji(player.fifa_code);
  const logo = getTeamLogo(player.club_id);
  const portrait = getPortrait(player.fm_id);
  const signColor = `var(--${team?.name.toLowerCase()})`;
  const signGlow = `var(--${team?.name.toLowerCase()}-glow)`;
  const rating = getAverageRating(player);
  const age = player.date_of_birth
    ? Math.floor((new Date() - new Date(player.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  const matches = player.matches ? Object.entries(player.matches) : [];
  const totalGoals = matches.reduce((s, [, m]) => s + Number(m.goals ?? 0), 0);
  const totalAssists = matches.reduce((s, [, m]) => s + Number(m.assists ?? 0), 0);
  const totalYellow = matches.reduce((s, [, m]) => s + Number(m.yellowCards ?? 0), 0);
  const totalRed = matches.reduce((s, [, m]) => s + Number(m.redCards ?? 0), 0);
  const totalMinutes = matches.reduce((s, [, m]) => s + Number(m.minutes ?? 0), 0);

  return (
    <div
      className="player-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7, 11, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        animation: 'modalFadeIn 300ms ease',
      }}
    >
      <div
        className="player-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
          border: `1px solid ${signColor}`,
          boxShadow: `0 0 30px ${signGlow}, 0 0 60px rgba(0,0,0,0.5)`,
          borderRadius: '16px',
          padding: '28px',
          maxWidth: '400px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          animation: 'modalScaleIn 400ms ease',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '999px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: '16px',
            transition: 'all 300ms ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
            e.target.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.06)';
            e.target.style.color = 'var(--text-secondary)';
          }}
        >
          ×
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${signColor}, transparent)`,
              border: `2px solid ${signColor}`,
              boxShadow: `0 0 20px ${signGlow}`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {portrait ? (
              <img
                src={portrait}
                alt={player.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <span style={{ fontSize: '28px', color: signColor }}>{player.name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.04em',
              }}
            >
              {player.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              {logo && (
                <img src={logo} alt={team?.name} style={{ width: '18px', height: '12px', objectFit: 'contain' }} />
              )}
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{player.club_name}</span>

              {flag && (
                <img src={flag} alt={player.fifa_code} style={{ width: '18px', height: '12px', objectFit: 'contain' }} />
              )}
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{player.fifa_code}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          <div className="player-modal-stat">
            <span className="player-modal-stat-label">Position</span>
            <span className="player-modal-stat-value">{player.pos || '—'}</span>
          </div>
          <div className="player-modal-stat">
            <span className="player-modal-stat-label">Number</span>
            <span className="player-modal-stat-value">{player.number || '—'}</span>
          </div>
          <div className="player-modal-stat">
            <span className="player-modal-stat-label">Age</span>
            <span className="player-modal-stat-value">{age ?? '—'}</span>
          </div>
          <div className="player-modal-stat">
            <span className="player-modal-stat-label">Rating</span>
            <span className="player-modal-stat-value" style={{ color: 'var(--gold)' }}>
              {rating != null ? rating.toFixed(1) : '—'}
            </span>
          </div>
          <div className="player-modal-stat">
            <span className="player-modal-stat-label">Goals</span>
            <span className="player-modal-stat-value">{totalGoals || '—'}</span>
          </div>
          <div className="player-modal-stat">
            <span className="player-modal-stat-label">Assists</span>
            <span className="player-modal-stat-value">{totalAssists || '—'}</span>
          </div>
          <div className="player-modal-stat">
            <span className="player-modal-stat-label">Minutes</span>
            <span className="player-modal-stat-value">{totalMinutes || '—'}</span>
          </div>
          <div className="player-modal-stat">
            <span className="player-modal-stat-label">Yellow</span>
            <span className="player-modal-stat-value">{totalYellow || '—'}</span>
          </div>
          <div className="player-modal-stat">
            <span className="player-modal-stat-label">Red</span>
            <span className="player-modal-stat-value">{totalRed || '—'}</span>
          </div>
        </div>

        {matches.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Match Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {matches.map(([day, m]) => (
                <div
                  key={day}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 50px 50px 50px',
                    gap: '8px',
                    alignItems: 'center',
                    padding: '8px 10px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 600, color: signColor, textTransform: 'capitalize' }}>{day}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {m.opponent ? `vs ${m.opponent}` : '—'}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gold)', textAlign: 'center' }}>
                    {m.rating != null ? m.rating.toFixed(1) : '—'}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', textAlign: 'center' }}>
                    {m.goals ?? 0}G
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', textAlign: 'center' }}>
                    {m.assists ?? 0}A
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {team && (
          <div
            style={{
              padding: '12px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ color: signColor, fontSize: '20px' }}>{team.symbol}</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {team.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {team.zodiac} · {team.element}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .player-modal-stat {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .player-modal-stat-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .player-modal-stat-value {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};

export default PlayerModal;
