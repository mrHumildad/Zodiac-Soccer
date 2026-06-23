import { useState } from 'react';
import { getAverageRating, getFlagEmoji, getTeamStats } from '../../data/utils.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import Player from './Player';
import PlayerModal from './PlayerModal';

const Roster = ({ selectedTeam, setTab }) => {
  const { t } = useLanguage();
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  if (!selectedTeam) return <div className="zw-section">{t('selectTeam')}</div>;
  const team = selectedTeam;
  const signColor = `var(--${team.name.toLowerCase()})`;

  const gkCount = team.players.filter(p => p.pos === 'Keeper').length;
  const dfCount = team.players.filter(p => p.pos === 'Defender').length;
  const mfCount = team.players.filter(p => p.pos === 'Midfielder').length;
  const fwCount = team.players.filter(p => p.pos === 'Attacker').length;
  const teamStats = getTeamStats(team);
  const nationalityCounts = {};
  team.players.forEach(p => {
    const code = p.fifa_code;
    nationalityCounts[code] = (nationalityCounts[code] || 0) + 1;
  });
  const topNationalities = Object.entries(nationalityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([code, count]) => {
      const flag = getFlagEmoji(code);
      return (
        <span key={code} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginRight: '8px' }}>
          {flag && <img src={flag} alt={code} style={{ width: '20px', height: '14px', objectFit: 'contain' }} />}
          <span>({count})</span>
        </span>
      );
    });

  const ages = team.players
    .filter(p => p.date_of_birth)
    .map(p => {
      const dob = new Date(p.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
      return age;
    });
  const avgAge = ages.length > 0 ? (ages.reduce((sum, a) => sum + a, 0) / ages.length).toFixed(1) : '-';

  const renderSection = (title, players) => (
    <div style={{ marginBottom: '14px' }}>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.14em',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          marginBottom: '8px',
          paddingLeft: '4px',
        }}
      >
        {title}
      </div>
      <div className="zw-card" style={{ padding: '10px 12px', borderLeftColor: signColor }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
          {players.map((player) => (
            <Player key={player.id || player.name} player={player} team={team} averageRating={getAverageRating(player)} onClick={setSelectedPlayer} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="zw-section">
      <div className="zw-card zw-card-glow" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '22px', color: 'var(--gold)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: signColor }}>{team.symbol}</span>
          <span>{team.name}</span>
        </h2>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '18px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '13px' }}>
          <div><strong>GK:</strong> {gkCount}</div>
          <div><strong>DF:</strong> {dfCount}</div>
          <div><strong>MF:</strong> {mfCount}</div>
          <div><strong>FW:</strong> {fwCount}</div>
          <div><strong>{t('topNationalities')}:</strong> <span style={{ fontSize: '16px' }}>{topNationalities}</span></div>
          <div><strong>{t('averageAge')}:</strong> {avgAge}</div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '8px',
            marginBottom: '18px',
            padding: '12px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('avgRating')}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold)' }}>{teamStats.avgrating.toFixed(1)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('goals')}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{teamStats.goals}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('assists')}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{teamStats.assists}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('yellowCards')}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#f5c542' }}>{teamStats.yellowCards}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('redCards')}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#ef4444' }}>{teamStats.redCards}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('ownGoals')}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{teamStats.ownGoals}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('missedPenalties')}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{teamStats.missedPenalties}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('minutes')}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{teamStats.minutes}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('avgHeight')}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{teamStats.avgHeight.toFixed(1)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('unusedPlayers')}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{teamStats.unusedPlayersPercentage.toFixed(0)}%</span>
          </div>
        </div>
        {renderSection(t('goalkeepers'), team.players.filter(p => p.pos === 'Keeper'))}
        {renderSection(t('defenders'), team.players.filter(p => p.pos === 'Defender'))}
        {renderSection(t('midfielders'), team.players.filter(p => p.pos === 'Midfielder'))}
        {renderSection(t('forwards'), team.players.filter(p => p.pos === 'Attacker'))}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => setTab('league')} className="zw-btn">{t('backToTeams')}</button>
        </div>
      </div>
      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          team={team}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};

export default Roster;
