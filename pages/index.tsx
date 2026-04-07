import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type Language = 'en' | 'ja';
type LineKey = 'meguro' | 'namboku' | 'mita' | 'hibiya';

type Option = {
  id: string;
  line: LineKey;
  destinationJa: string;
  destinationEn: string;
  typeJa: string;
  typeEn: string;
  image: string;
  noteJa?: string;
  noteEn?: string;
};

type Station = {
  ja: string;
  en: string;
};

const lineLabels: Record<LineKey, { ja: string; en: string }> = {
  meguro: { ja: '目黒線', en: 'Meguro Line' },
  namboku: { ja: '南北線', en: 'Namboku Line' },
  mita: { ja: '三田線', en: 'Mita Line' },
  hibiya: { ja: '日比谷線', en: 'Hibiya Line' },
};

const stations: Record<LineKey, Station[]> = {
  meguro: [
    { ja: '目黒', en: 'Meguro' },
    { ja: '不動前', en: 'Fudomae' },
    { ja: '武蔵小山', en: 'Musashi-Koyama' },
    { ja: '西小山', en: 'Nishi-Koyama' },
    { ja: '洗足', en: 'Senzoku' },
    { ja: '大岡山', en: 'Ookayama' },
    { ja: '奥沢', en: 'Okusawa' },
    { ja: '田園調布', en: 'Den-en-chofu' },
    { ja: '多摩川', en: 'Tamagawa' },
    { ja: '新丸子', en: 'Shin-Maruko' },
    { ja: '武蔵小杉', en: 'Musashi-Kosugi' },
    { ja: '元住吉', en: 'Motosumiyoshi' },
    { ja: '日吉', en: 'Hiyoshi' },
    { ja: '新横浜', en: 'Shin-Yokohama' },
    { ja: '新綱島', en: 'Shin-Tsunashima' },
    { ja: '日吉本町', en: 'Hiyoshi-Honcho' },
    { ja: 'センター北', en: 'Center Kita' },
    { ja: 'センター南', en: 'Center Minami' },
    { ja: '新羽', en: 'Nippa' },
    { ja: '北新横浜', en: 'Kita-Shin-Yokohama' },
    { ja: '羽沢横浜国大', en: 'Hazawa Yokohama-Kokudai' },
    { ja: '西谷', en: 'Nishiya' },
    { ja: '二俣川', en: 'Futamatagawa' },
    { ja: '大和', en: 'Yamato' },
    { ja: '海老名', en: 'Ebina' }
  ],
  namboku: [
    { ja: '目黒', en: 'Meguro' },
    { ja: '白金台', en: 'Shirokanedai' },
    { ja: '白金高輪', en: 'Shirokane-Takanawa' },
    { ja: '麻布十番', en: 'Azabu-juban' },
    { ja: '六本木一丁目', en: 'Roppongi-itchome' },
    { ja: '溜池山王', en: 'Tameike-sanno' },
    { ja: '永田町', en: 'Nagatacho' },
    { ja: '四ツ谷', en: 'Yotsuya' },
    { ja: '市ケ谷', en: 'Ichigaya' },
    { ja: '飯田橋', en: 'Iidabashi' },
    { ja: '後楽園', en: 'Korakuen' },
    { ja: '東大前', en: 'Todaimae' },
    { ja: '本駒込', en: 'Hon-komagome' },
    { ja: '駒込', en: 'Komagome' },
    { ja: '西ケ原', en: 'Nishigahara' },
    { ja: '王子', en: 'Oji' },
    { ja: '王子神谷', en: 'Oji-kamiya' },
    { ja: '志茂', en: 'Shimo' },
    { ja: '赤羽岩淵', en: 'Akabane-Iwabuchi' },
    { ja: '川口元郷', en: 'Kawaguchi-Motogo' },
    { ja: '南鳩ヶ谷', en: 'Minami-Hatogaya' },
    { ja: '鳩ヶ谷', en: 'Hatogaya' },
    { ja: '新井宿', en: 'Araijuku' },
    { ja: '戸塚安行', en: 'Tozuka-angyo' },
    { ja: '東川口', en: 'Higashi-Kawaguchi' },
    { ja: '浦和美園', en: 'Urawa-Misono' }
  ],
  mita: [
    { ja: '目黒', en: 'Meguro' },
    { ja: '白金台', en: 'Shirokanedai' },
    { ja: '白金高輪', en: 'Shirokane-Takanawa' },
    { ja: '三田', en: 'Mita' },
    { ja: '大手町', en: 'Otemachi' },
    { ja: '神保町', en: 'Jimbocho' },
    { ja: '巣鴨', en: 'Sugamo' },
    { ja: '西高島平', en: 'Nishi-Takashimadaira' },
    { ja: '高島平', en: 'Takashimadaira' }
  ],
  hibiya: [
    { ja: '中目黒', en: 'Naka-Meguro' },
    { ja: '恵比寿', en: 'Ebisu' },
    { ja: '六本木', en: 'Roppongi' },
    { ja: '霞ケ関', en: 'Kasumigaseki' },
    { ja: '銀座', en: 'Ginza' },
    { ja: '東銀座', en: 'Higashi-Ginza' },
    { ja: '築地', en: 'Tsukiji' },
    { ja: '八丁堀', en: 'Hatchobori' },
    { ja: '秋葉原', en: 'Akihabara' },
    { ja: '上野', en: 'Ueno' },
    { ja: '北千住', en: 'Kita-Senju' }
  ]
};

const options: Record<LineKey, Option[]> = {
  meguro: [
    {
      id: 'meguro-hiyoshi-local',
      line: 'meguro',
      destinationJa: '日吉',
      destinationEn: 'Hiyoshi',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/meguro/hiyoshi-local.gif'
    },
    {
      id: 'meguro-musashikosugi-local',
      line: 'meguro',
      destinationJa: '武蔵小杉',
      destinationEn: 'Musashi-Kosugi',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/meguro/musashikosugi-local.gif'
    },
    {
      id: 'meguro-shinyokohama-local',
      line: 'meguro',
      destinationJa: '新横浜',
      destinationEn: 'Shin-Yokohama',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/meguro/shin-yokohama-local.gif'
    },
    {
      id: 'meguro-ebina-local',
      line: 'meguro',
      destinationJa: '海老名',
      destinationEn: 'Ebina',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/meguro/ebina-local.gif'
    },
    {
      id: 'meguro-shinyokohama-express',
      line: 'meguro',
      destinationJa: '新横浜',
      destinationEn: 'Shin-Yokohama',
      typeJa: '急行',
      typeEn: 'Express',
      image: '/train-displays/meguro/shin-yokohama-express.gif'
    },
    {
      id: 'meguro-ebina-express',
      line: 'meguro',
      destinationJa: '海老名',
      destinationEn: 'Ebina',
      typeJa: '急行',
      typeEn: 'Express',
      image: '/train-displays/meguro/ebina-express.gif'
    }
  ],
  namboku: [
    {
      id: 'namboku-akabaneiwabuchi-local',
      line: 'namboku',
      destinationJa: '赤羽岩淵',
      destinationEn: 'Akabane-Iwabuchi',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/namboku/akabaneiwabuchi-local.gif'
    },
    {
      id: 'namboku-urawamisono-local',
      line: 'namboku',
      destinationJa: '浦和美園',
      destinationEn: 'Urawa-Misono',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/namboku/urawamisono-local.gif'
    }
  ],
  mita: [
    {
      id: 'mita-takashimadaira-local',
      line: 'mita',
      destinationJa: '高島平',
      destinationEn: 'Takashimadaira',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/mita/takashimadaira-local.gif'
    },
    {
      id: 'mita-nishitakashimadaira-local',
      line: 'mita',
      destinationJa: '西高島平',
      destinationEn: 'Nishi-Takashimadaira',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/mita/nishi-takashimadaira-local.gif'
    }
  ],
  hibiya: [
    {
      id: 'hibiya-kitasenju-local',
      line: 'hibiya',
      destinationJa: '北千住',
      destinationEn: 'Kita-Senju',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/hibiya/kita-senju-local.gif'
    }
  ]
};

function stationIndex(line: LineKey, stationName: string, language: Language): number {
  return stations[line].findIndex((s) => (language === 'ja' ? s.ja : s.en) === stationName);
}

function destinationIndex(line: LineKey, destinationName: string): number {
  return stations[line].findIndex((s) => s.ja === destinationName || s.en === destinationName);
}

function getReachableOptions(line: LineKey, from: string, to: string, language: Language): Option[] {
  const fromIndex = stationIndex(line, from, language);
  const toIndex = stationIndex(line, to, language);

  if (fromIndex < 0 || toIndex < 0 || fromIndex >= toIndex) {
    return [];
  }

  const base = options[line].filter((option) => destinationIndex(line, option.destinationJa) >= toIndex);

  if (line !== 'meguro') {
    return base;
  }

  const localOnlyStations = new Set(['不動前', '西小山', '洗足', '奥沢', '新丸子', '元住吉', '新綱島', '日吉本町', 'センター北', 'センター南', '新羽', '北新横浜', '羽沢横浜国大', '西谷', '二俣川', '大和']);
  const expressStops = new Set(['目黒', '武蔵小山', '大岡山', '田園調布', '多摩川', '武蔵小杉', '日吉', '新横浜', '海老名']);
  const destinationJa = stations[line][toIndex].ja;

  const filtered = base.filter((option) => {
    if (option.typeJa === '各停') return true;
    if (localOnlyStations.has(destinationJa)) return false;
    return expressStops.has(destinationJa);
  });

  return filtered;
}

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);
  const [line, setLine] = useState<LineKey>('meguro');
  const [fromStation, setFromStation] = useState('Meguro');
  const [toStation, setToStation] = useState('Musashi-Kosugi');

  useEffect(() => {
    const saved = window.localStorage.getItem('travel-support-language');
    if (saved === 'ja' || saved === 'en') {
      setLanguage(saved);
    } else {
      window.localStorage.setItem('travel-support-language', 'en');
      setLanguage('en');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem('travel-support-language', language);
  }, [language, mounted]);

  useEffect(() => {
    const first = stations[line][0];
    const second = stations[line][Math.min(1, stations[line].length - 1)];
    setFromStation(language === 'ja' ? first.ja : first.en);
    setToStation(language === 'ja' ? second.ja : second.en);
  }, [line, language]);

  const currentStations = useMemo(() => stations[line], [line]);
  const results = useMemo(
    () => getReachableOptions(line, fromStation, toStation, language),
    [line, fromStation, toStation, language]
  );

  if (!mounted) {
    return null;
  }

  const t = {
    title: language === 'ja' ? 'Train Boarding Support' : 'Train Boarding Support',
    subtitle:
      language === 'ja'
        ? '駅で見えている行先表示から、乗ってよい候補をわかりやすく表示します。'
        : 'Find which destination display is safe to board when you are standing on the platform.',
    line: language === 'ja' ? '路線' : 'Line',
    from: language === 'ja' ? '乗る駅' : 'Boarding Station',
    to: language === 'ja' ? '降りる駅' : 'Destination Station',
    language: language === 'ja' ? '言語' : 'Language',
    results: language === 'ja' ? '乗ってよい候補' : 'Recommended train displays',
    noneTitle: language === 'ja' ? '候補が見つかりません' : 'No matching train found',
    noneText:
      language === 'ja'
        ? 'あなたの降りる駅、乗り換える駅に行く電車は見つかりませんでした。行先をもう一度確認してください。'
        : 'No train display in this list appears to reach your destination. Please check the destination again.',
    note:
      language === 'ja'
        ? '※ 実際の運行・種別・停車駅は現地表示で確認してください。'
        : 'Please confirm the real-time platform display before boarding.',
    switchToJa: '日本語',
    switchToEn: 'English'
  };

  return (
    <>
      <Head>
        <title>Travel Support</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="page">
        <section className="card hero">
          <div className="topRow">
            <div>
              <h1>{t.title}</h1>
              <p>{t.subtitle}</p>
            </div>
            <div className="langSwitch">
              <button
                className={language === 'en' ? 'active' : ''}
                onClick={() => setLanguage('en')}
                type="button"
              >
                {t.switchToEn}
              </button>
              <button
                className={language === 'ja' ? 'active' : ''}
                onClick={() => setLanguage('ja')}
                type="button"
              >
                {t.switchToJa}
              </button>
            </div>
          </div>
        </section>

        <section className="card formCard">
          <label>
            <span>{t.line}</span>
            <select value={line} onChange={(e) => setLine(e.target.value as LineKey)}>
              {Object.entries(lineLabels).map(([key, value]) => (
                <option key={key} value={key}>
                  {language === 'ja' ? value.ja : value.en}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{t.from}</span>
            <select value={fromStation} onChange={(e) => setFromStation(e.target.value)}>
              {currentStations.map((station) => {
                const label = language === 'ja' ? station.ja : station.en;
                return (
                  <option key={station.en} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            <span>{t.to}</span>
            <select value={toStation} onChange={(e) => setToStation(e.target.value)}>
              {currentStations.map((station) => {
                const label = language === 'ja' ? station.ja : station.en;
                return (
                  <option key={station.en} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
          </label>
        </section>

        <section className="card resultsCard">
          <h2>{t.results}</h2>

          {results.length === 0 ? (
            <div className="emptyState">
              <strong>{t.noneTitle}</strong>
              <p>{t.noneText}</p>
            </div>
          ) : (
            <div className="resultsGrid">
              {results.map((result) => (
                <article key={result.id} className="resultItem">
                  <div className="badgeRow">
                    <span className="badge lineBadge">{language === 'ja' ? lineLabels[result.line].ja : lineLabels[result.line].en}</span>
                    <span className="badge typeBadge">{language === 'ja' ? result.typeJa : result.typeEn}</span>
                  </div>
                  <h3>{language === 'ja' ? result.destinationJa : result.destinationEn}</h3>
                  <div className="imageWrap">
                    <Image
                      src={result.image}
                      alt={`${language === 'ja' ? result.destinationJa : result.destinationEn} ${language === 'ja' ? result.typeJa : result.typeEn}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="trainImage"
                    />
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="note">{t.note}</p>
        </section>
      </main>
    </>
  );
}
