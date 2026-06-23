import matchesData from '../../data/matches.json';
import ZodiacIcon from './ZodiacIcon';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const LEAGUES_META = [
  { flag: '🇧🇷', key: 'br', signs: ['Aries', 'Leo', 'Sagittarius', 'Gemini'] },
  { flag: '🇬🇧', key: 'gb', signs: ['Taurus', 'Virgo', 'Capricorn', 'Cancer'] },
  { flag: '🇪🇸', key: 'es', signs: ['Libra', 'Scorpio', 'Pisces', 'Aquarius'] },
  { flag: '🇮🇹', key: 'it', signs: ['Leo', 'Taurus', 'Libra', 'Aries'] },
  { flag: '🇩🇪', key: 'de', signs: ['Capricorn', 'Virgo', 'Gemini', 'Scorpio'] },
  { flag: '🇦🇷', key: 'ar', signs: ['Sagittarius', 'Cancer', 'Pisces', 'Taurus'] },
];

const Home = ({ setTab, setSelectedTeam, setSelectedMatch }) => {
  const { t } = useLanguage();

  const allDays = Object.keys(matchesData).sort();
  const liveMatches = [];
  for (const day of allDays) {
    for (const m of matchesData[day].matches) {
      if (m.status === 'ongoing') liveMatches.push(m);
    }
  }
  const displayMatches = liveMatches

  return (
    <div className="zw-section" style={{ padding: 0 }}>
      <div
        style={{
          width: '100%',
          height: 'clamp(16rem, 40vw, 28rem)',
          backgroundImage: "url('/ZWOS/hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(7,11,18,0.15) 0%, rgba(7,11,18,0.35) 60%, var(--bg-dark) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <img
            src="/ZWOS/logo.png"
            alt="Zodiac Soccer"
            style={{
              width: 'clamp(12rem, 40vw, 24rem)',
              height: 'auto',
              filter: 'drop-shadow(0 0 20px rgba(216,180,95,0.6)) drop-shadow(0 0 60px rgba(216,180,95,0.3)) drop-shadow(0 4px 12px rgba(0,0,0,0.8))',
            }}
          />
        </div>
      </div>
      <div
        style={{
          textAlign: 'center',
          padding: '2rem 1.5rem 4rem',
          maxWidth: '44rem',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            lineHeight: 1.7,
            maxWidth: '36rem',
            margin: '0 auto 2rem',
          }}
        >
          {t('description')}
        </div>
        <button className="zw-btn" style={{ padding: '0.85rem 2rem', fontSize: '0.9rem' }} onClick={() => setTab('league')}>
          {t('enterLeague')}
        </button>
      </div>

      <div style={{ padding: '0 1.5rem', marginBottom: '2.5rem' }}>
        <h2
          style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            color: 'var(--gold)',
            textAlign: 'center',
            marginBottom: '1.25rem',
            letterSpacing: '0.12em',
          }}
        >
          {t('zwc26Title')}
        </h2>

        {displayMatches.map((match, idx) => (
          <div
            key={idx}
            className="zw-card zw-card-blue"
            style={{
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
            onClick={() => {
              setSelectedMatch(match);
              setTab('match');
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--cosmic-blue-soft)',
                background: 'rgba(76, 125, 255, 0.15)',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                textTransform: 'uppercase',
              }}
            >
              {t('live')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ZodiacIcon sign={match.home_team} size={20} />
              <span style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>{match.home_team}</span>
            </span>
            <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.85rem' }}>{t('vs')}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ZodiacIcon sign={match.away_team} size={20} />
              <span style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>{match.away_team}</span>
            </span>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 1.5rem', marginBottom: '2.5rem' }}>
        <h2
          style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            color: 'var(--gold)',
            textAlign: 'center',
            marginBottom: '0.5rem',
            letterSpacing: '0.12em',
          }}
        >
          {t('nationalLeagues')}
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
          }}
        >
          {t('comingSoon')}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 19rem), 1fr))',
            gap: '1rem',
          }}
        >
          {LEAGUES_META.map((league) => (
            <div key={league.key} className="zw-card" style={{ padding: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '0.6rem',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{league.flag}</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>{t(`leagues.${league.key}.name`)}</span>
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.85rem',
                  lineHeight: 1.5,
                }}
              >
                {t(`leagues.${league.key}.tagline`)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                {league.signs.map((sign) => (
                  <ZodiacIcon key={sign} sign={sign} size={18} />
                ))}
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'var(--gold)',
                  background: 'rgba(216, 180, 95, 0.1)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '999px',
                }}
              >
                {t('launching')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
