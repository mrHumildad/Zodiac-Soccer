import { useLanguage } from '../i18n/LanguageContext.jsx';

const langLabels = ['EN', 'ES', 'IT'];

const Header = ({ setTab }) => {
  const { t, cycleLanguage, langIndex } = useLanguage();

  return (
    <header className="zw-nav">
      <div className="brand" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none' }} onClick={() => setTab('home')}>
        <img src="/Zodiac-Soccer/icon.png" alt="" width="28" height="28" />
        {t('brand')}
      </div>
      <nav>
        <button className="zw-btn" aria-label="league" onClick={() => setTab('league')}>{t('league')}</button>
        <button className="zw-btn lang-btn" onClick={cycleLanguage} aria-label="switch language">
          {langLabels[langIndex]}
        </button>
      </nav>
    </header>
  );
};

export default Header;
