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

function getOptionTitle(option: Option, language: Language) {
  if (language === 'ja') {
    return `${option.typeJa} ${option.destinationJa}`;
  }
  return `${option.typeEn} ${option.destinationEn}`;
}

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
    { ja: '新綱島', en: 'Shin-Tsunashima' },
    { ja: '新横浜', en: 'Shin-Yokohama' },
    { ja: '羽沢横浜国大', en: 'Hazawa Yokohama-Kokudai' },
    { ja: '西谷', en: 'Nishiya' },
    { ja: '鶴ケ峰', en: 'Tsurugamine' },
    { ja: '二俣川', en: 'Futamatagawa' },
    { ja: '希望ケ丘', en: 'Kibogaoka' },
    { ja: '三ツ境', en: 'Mitsukyo' },
    { ja: '瀬谷', en: 'Seya' },
    { ja: '大和', en: 'Yamato' },
    { ja: '相模大塚', en: 'Sagami-Otsuka' },
    { ja: 'さがみ野', en: 'Sagamino' },
    { ja: 'かしわ台', en: 'Kashiwadai' },
    { ja: '海老名', en: 'Ebina' },
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
    { ja: '浦和美園', en: 'Urawa-Misono' },
  ],
  mita: [
    { ja: '目黒', en: 'Meguro' },
    { ja: '白金台', en: 'Shirokanedai' },
    { ja: '白金高輪', en: 'Shirokane-Takanawa' },
    { ja: '三田', en: 'Mita' },
    { ja: '芝公園', en: 'Shibakoen' },
    { ja: '御成門', en: 'Onarimon' },
    { ja: '内幸町', en: 'Uchisaiwaicho' },
    { ja: '日比谷', en: 'Hibiya' },
    { ja: '大手町', en: 'Otemachi' },
    { ja: '神保町', en: 'Jimbocho' },
    { ja: '水道橋', en: 'Suidobashi' },
    { ja: '春日', en: 'Kasuga' },
    { ja: '白山', en: 'Hakusan' },
    { ja: '千石', en: 'Sengoku' },
    { ja: '巣鴨', en: 'Sugamo' },
    { ja: '西巣鴨', en: 'Nishi-Sugamo' },
    { ja: '新板橋', en: 'Shin-Itabashi' },
    { ja: '板橋区役所前', en: 'Itabashi-Kuyakushomae' },
    { ja: '板橋本町', en: 'Itabashi-Honcho' },
    { ja: '本蓮沼', en: 'Motohasunuma' },
    { ja: '志村坂上', en: 'Shimura-Sakaue' },
    { ja: '志村三丁目', en: 'Shimura-Sanchome' },
    { ja: '蓮根', en: 'Hasune' },
    { ja: '西台', en: 'Nishidai' },
    { ja: '高島平', en: 'Takashimadaira' },
    { ja: '新高島平', en: 'Shin-Takashimadaira' },
    { ja: '西高島平', en: 'Nishi-Takashimadaira' },
  ],
  hibiya: [
    { ja: '中目黒', en: 'Naka-Meguro' },
    { ja: '恵比寿', en: 'Ebisu' },
    { ja: '広尾', en: 'Hiroo' },
    { ja: '六本木', en: 'Roppongi' },
    { ja: '神谷町', en: 'Kamiyacho' },
    { ja: '虎ノ門ヒルズ', en: 'Toranomon Hills' },
    { ja: '霞ケ関', en: 'Kasumigaseki' },
    { ja: '日比谷', en: 'Hibiya' },
    { ja: '銀座', en: 'Ginza' },
    { ja: '東銀座', en: 'Higashi-Ginza' },
    { ja: '築地', en: 'Tsukiji' },
    { ja: '八丁堀', en: 'Hatchobori' },
    { ja: '茅場町', en: 'Kayabacho' },
    { ja: '人形町', en: 'Ningyocho' },
    { ja: '小伝馬町', en: 'Kodemmacho' },
    { ja: '秋葉原', en: 'Akihabara' },
    { ja: '仲御徒町', en: 'Naka-Okachimachi' },
    { ja: '上野', en: 'Ueno' },
    { ja: '入谷', en: 'Iriya' },
    { ja: '三ノ輪', en: 'Minowa' },
    { ja: '南千住', en: 'Minami-Senju' },
    { ja: '北千住', en: 'Kita-Senju' },
  ],
};

const options: Record<LineKey, Option[]> = {
  meguro: [
    {
      id: 'meguro-meguro-local',
      line: 'meguro',
      destinationJa: '目黒',
      destinationEn: 'Meguro',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/meguro/meguro-local.gif',
    },
    {
      id: 'meguro-meguro-express',
      line: 'meguro',
      destinationJa: '目黒',
      destinationEn: 'Meguro',
      typeJa: '急行',
      typeEn: 'Express',
      image: '/train-displays/meguro/meguro-express.gif',
    },
    {
      id: 'meguro-hiyoshi-local',
      line: 'meguro',
      destinationJa: '日吉',
      destinationEn: 'Hiyoshi',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/meguro/hiyoshi-local.gif',
    },
  ],
  namboku: [
    {
      id: 'namboku-shirokanetakanawa-local',
      line: 'namboku',
      destinationJa: '白金高輪',
      destinationEn: 'Shirokane-Takanawa',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/namboku/shirokanetakanawa-local.gif',
    },
    {
      id: 'namboku-akabaneiwabuchi-local',
      line: 'namboku',
      destinationJa: '赤羽岩淵',
      destinationEn: 'Akabane-Iwabuchi',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/namboku/akabaneiwabuchi-local.gif',
    },
    {
      id: 'namboku-urawamisono-local',
      line: 'namboku',
      destinationJa: '浦和美園',
      destinationEn: 'Urawa-Misono',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/namboku/urawamisono-local.gif',
    },
    {
      id: 'namboku-meguro-local',
      line: 'namboku',
      destinationJa: '目黒',
      destinationEn: 'Meguro',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/namboku/meguro-local.gif',
    },
  ],
  mita: [
    {
      id: 'mita-takashimadaira-express',
      line: 'mita',
      destinationJa: '高島平',
      destinationEn: 'Takashimadaira',
      typeJa: '急行',
      typeEn: 'Express',
      image: '/train-displays/mita/takashimadaira-express.gif',
    },
    {
      id: 'mita-nishitakashimadaira-express',
      line: 'mita',
      destinationJa: '西高島平',
      destinationEn: 'Nishi-Takashimadaira',
      typeJa: '急行',
      typeEn: 'Express',
      image: '/train-displays/mita/nishi-takashimadaira-express.gif',
    },
    {
      id: 'mita-shirokanetakanawa-local',
      line: 'mita',
      destinationJa: '白金高輪',
      destinationEn: 'Shirokane-Takanawa',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/mita/shirokanetakanawa-local.gif',
    },
    {
      id: 'mita-mita-local',
      line: 'mita',
      destinationJa: '三田',
      destinationEn: 'Mita',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/mita/mita-local.gif',
    },
    {
      id: 'mita-otemachi-local',
      line: 'mita',
      destinationJa: '大手町',
      destinationEn: 'Otemachi',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/mita/otemachi-local.gif',
    },
    {
      id: 'mita-sugamo-local',
      line: 'mita',
      destinationJa: '巣鴨',
      destinationEn: 'Sugamo',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/mita/sugamo-local.gif',
    },
    {
      id: 'mita-takashimadaira-local',
      line: 'mita',
      destinationJa: '高島平',
      destinationEn: 'Takashimadaira',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/mita/takashimadaira-local.gif',
    },
    {
      id: 'mita-nishitakashimadaira-local',
      line: 'mita',
      destinationJa: '西高島平',
      destinationEn: 'Nishi-Takashimadaira',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/mita/nishi-takashimadaira-local.gif',
    },
    {
      id: 'mita-meguro-local',
      line: 'mita',
      destinationJa: '目黒',
      destinationEn: 'Meguro',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/mita/meguro-local.gif',
    },
  ],
  hibiya: [
    {
      id: 'hibiya-kitasenju-local',
      line: 'hibiya',
      destinationJa: '北千住',
      destinationEn: 'Kita-Senju',
      typeJa: '各停',
      typeEn: 'Local',
      image: '/train-displays/hibiya/kita-senju-local.gif',
    },
  ],
};

function stationIndex(line: LineKey, stationName: string, language: Language): number {
  return stations[line].findIndex((s) => (language === 'ja' ? s.ja : s.en) === stationName);
}

function destinationIndex(line: LineKey, destinationName: string): number {
  return stations[line].findIndex((s) => s.ja === destinationName || s.en === destinationName);
}

function getJapaneseStationName(
  line: LineKey,
  stationName: string,
  language: Language
): string | null {
  const station = stations[line].find((s) =>
    language === 'ja' ? s.ja === stationName : s.en === stationName
  );
  return station ? station.ja : null;
}

function getReachableOptions(
  line: LineKey,
  from: string,
  to: string,
  language: Language
): Option[] {
  const fromIndex = stationIndex(line, from, language);
  const toIndex = stationIndex(line, to, language);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return [];
  }

  const isOutbound = fromIndex < toIndex;
  const toJa = getJapaneseStationName(line, to, language);

  if (!toJa) {
    return [];
  }

  const expressStops = new Set([
    '目黒',
    '武蔵小山',
    '大岡山',
    '田園調布',
    '多摩川',
    '武蔵小杉',
    '日吉',
    '新横浜',
    '西谷',
    '二俣川',
    '大和',
    '海老名',
  ]);

  if (!(line === 'meguro' && !isOutbound)) {
    const base = options[line].filter((option) => {
      const destIndex = destinationIndex(line, option.destinationJa);
      if (destIndex < 0) return false;
      return isOutbound ? destIndex >= toIndex : destIndex <= toIndex;
    });

    if (line !== 'meguro') {
      return base;
    }

    const fromJa = getJapaneseStationName(line, from, language);
    if (!fromJa) {
      return base.filter((option) => option.typeJa === '各停');
    }

    return base.filter((option) => {
      if (option.typeJa === '各停') return true;
      return expressStops.has(fromJa) && expressStops.has(toJa);
    });
  }

  const fromJa = getJapaneseStationName('meguro', from, language);
  if (!fromJa) {
    return [];
  }

  const results: Option[] = [];
  const pushUnique = (items: Option[]) => {
    for (const item of items) {
      if (!results.some((r) => r.id === item.id)) {
        results.push(item);
      }
    }
  };

  const isExpressUsable = expressStops.has(fromJa) && expressStops.has(toJa);

  const meguroUpCandidates = options.meguro.filter((option) => {
    if (option.destinationJa !== '目黒') return false;
    if (option.typeJa === '各停') return true;
    if (option.typeJa === '急行') return isExpressUsable;
    return false;
  });

  let nambokuCandidates: Option[] = [];
  let mitaCandidates: Option[] = [];

  if (toJa === '目黒' || toJa === '白金台' || toJa === '白金高輪') {
    nambokuCandidates = options.namboku.filter((option) => {
      if (toJa === '目黒' || toJa === '白金台') {
        return true;
      }
      const destIndex = destinationIndex('namboku', option.destinationJa);
      const boundaryIndex = stations.namboku.findIndex((s) => s.ja === '白金高輪');
      return destIndex >= boundaryIndex;
    });

    mitaCandidates = options.mita.filter((option) => {
      if (toJa === '目黒' || toJa === '白金台') {
        return true;
      }
      const destIndex = destinationIndex('mita', option.destinationJa);
      const boundaryIndex = stations.mita.findIndex((s) => s.ja === '白金高輪');
      return destIndex >= boundaryIndex;
    });
  } else {
    const nambokuToIndex = stations.namboku.findIndex((s) => s.ja === toJa);
    if (nambokuToIndex >= 0) {
      nambokuCandidates = options.namboku.filter((option) => {
        const destIndex = destinationIndex('namboku', option.destinationJa);
        return destIndex >= nambokuToIndex;
      });
    }

    const mitaToIndex = stations.mita.findIndex((s) => s.ja === toJa);
    if (mitaToIndex >= 0) {
      mitaCandidates = options.mita.filter((option) => {
        const destIndex = destinationIndex('mita', option.destinationJa);
        return destIndex >= mitaToIndex;
      });
    }
  }

  pushUnique(meguroUpCandidates);
  pushUnique(nambokuCandidates);
  pushUnique(mitaCandidates);

  return results;
}

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);
  const [line, setLine] = useState<LineKey>('meguro');
  const [fromStation, setFromStation] = useState('Meguro');
  const [toStation, setToStation] = useState('Fudomae');

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
    title: 'Train Boarding Support',
    subtitle:
      language === 'ja'
        ? '駅で見えている行先表示から、乗ってよい候補を見やすく表示します。'
        : 'See which train display is safe to board from the platform.',
    line: language === 'ja' ? '路線' : 'Line',
    from: language === 'ja' ? '乗る駅' : 'Boarding Station',
    to: language === 'ja' ? '降りる駅' : 'Destination Station',
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
    switchToEn: 'English',
  };

  return (
    <>
      <Head>
        <title>Travel Support</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="pageShell">
        <section className="panel heroPanel">
          <div className="heroTop">
            <div className="heroText">
              <h1>{t.title}</h1>
              <p>{t.subtitle}</p>
            </div>
            <div className="languageSwitch">
              <button
                type="button"
                className={language === 'en' ? 'langButton active' : 'langButton'}
                onClick={() => setLanguage('en')}
              >
                {t.switchToEn}
              </button>
              <button
                type="button"
                className={language === 'ja' ? 'langButton active' : 'langButton'}
                onClick={() => setLanguage('ja')}
              >
                {t.switchToJa}
              </button>
            </div>
          </div>
        </section>

        <section className="panel formPanel">
          <label className="field">
            <span>{t.line}</span>
            <select value={line} onChange={(e) => setLine(e.target.value as LineKey)}>
              {Object.entries(lineLabels).map(([key, value]) => (
                <option key={key} value={key}>
                  {language === 'ja' ? value.ja : value.en}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
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

          <label className="field">
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

        <section className="panel resultsPanel">
          <div className="sectionTitle">{t.results}</div>

          {results.length === 0 ? (
            <div className="emptyState">
              <strong>{t.noneTitle}</strong>
              <p>{t.noneText}</p>
            </div>
          ) : (
            <div className="resultsList">
              {results.map((result) => (
                <article key={result.id} className="resultCard">
                  <div className="resultRow">
                    <div className="resultImageBox">
                      <Image
                        src={result.image}
                        alt={getOptionTitle(result, language)}
                        fill
                        sizes="(max-width: 640px) 42vw, 180px"
                        className="resultImage"
                        unoptimized
                      />
                    </div>

                    <div className="resultBody">
                      <div className="resultTitle">{getOptionTitle(result, language)}</div>

                      <div className="resultTags">
                        <span className="tagChip">
                          {language === 'ja'
                            ? lineLabels[result.line].ja
                            : lineLabels[result.line].en}
                        </span>
                        <span className="tagChip">
                          {language === 'ja' ? result.typeJa : result.typeEn}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="noteText">{t.note}</p>
        </section>
      </main>

      <style jsx>{`
        :global(html) {
          -webkit-text-size-adjust: 100%;
        }

        :global(body) {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: linear-gradient(180deg, #f8fafc 0%, #eefbf4 100%);
          color: #0f172a;
        }

        * {
          box-sizing: border-box;
        }

        .pageShell {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          padding: 12px;
          display: grid;
          gap: 12px;
        }

        .panel {
          background: #ffffff;
          border: 1px solid #dfe7df;
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
        }

        .heroTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .heroText h1 {
          margin: 0 0 6px;
          font-size: 26px;
          line-height: 1.15;
        }

        .heroText p {
          margin: 0;
          font-size: 14px;
          line-height: 1.55;
          color: #475569;
        }

        .languageSwitch {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }

        .langButton {
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #334155;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .langButton.active {
          background: #0f172a;
          border-color: #0f172a;
          color: #ffffff;
        }

        .formPanel {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .field {
          display: grid;
          gap: 6px;
        }

        .field span {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }

        .field select {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          background: #ffffff;
          padding: 11px 12px;
          font-size: 14px;
          color: #0f172a;
        }

        .resultsPanel {
          display: grid;
          gap: 12px;
        }

        .sectionTitle {
          font-size: 18px;
          font-weight: 800;
        }

        .resultsList {
          display: grid;
          gap: 10px;
        }

        .resultCard {
          border: 1px solid #86efac;
          background: #ecfdf5;
          border-radius: 16px;
          padding: 10px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
        }

        .resultRow {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .resultImageBox {
          position: relative;
          width: 180px;
          height: 104px;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid #d8dee8;
        }

        .resultImage {
          object-fit: contain;
        }

        .resultBody {
          min-width: 0;
          flex: 1;
        }

        .resultTitle {
          font-size: 18px;
          line-height: 1.3;
          font-weight: 800;
          color: #0f172a;
          word-break: break-word;
        }

        .resultTags {
          margin-top: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tagChip {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid #dbeafe;
          padding: 4px 9px;
          font-size: 11px;
          font-weight: 700;
          color: #334155;
        }

        .emptyState {
          border: 1px dashed #cbd5e1;
          border-radius: 14px;
          background: #f8fafc;
          padding: 14px;
        }

        .emptyState strong {
          display: block;
          margin-bottom: 6px;
          font-size: 15px;
        }

        .emptyState p,
        .noteText {
          margin: 0;
          font-size: 13px;
          line-height: 1.6;
          color: #475569;
        }

        @media (max-width: 640px) {
          .pageShell {
            padding: 10px;
            gap: 10px;
          }

          .panel {
            padding: 12px;
            border-radius: 16px;
          }

          .heroTop {
            flex-direction: column;
            gap: 10px;
          }

          .heroText h1 {
            font-size: 23px;
          }

          .heroText p {
            font-size: 13px;
          }

          .formPanel {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .field span {
            font-size: 12px;
          }

          .field select {
            padding: 10px 11px;
            font-size: 14px;
          }

          .sectionTitle {
            font-size: 17px;
          }

          .resultRow {
            gap: 10px;
          }

          .resultImageBox {
            width: 42vw;
            height: 24vw;
            min-width: 138px;
            min-height: 78px;
            max-width: 178px;
            max-height: 102px;
          }

          .resultTitle {
            font-size: 16px;
          }

          .tagChip {
            font-size: 10px;
            padding: 4px 8px;
          }
        }
      `}</style>
    </>
  );
}
