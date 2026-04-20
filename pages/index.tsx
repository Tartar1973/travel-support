import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { trainLines, getLineLabel, getStationLabel } from '../lib/train-data';
import { getTrainResults } from '../lib/train-logic';
import type { LineKey } from '../lib/train-data';
import type { TrainCandidate } from '../lib/train-logic';

type Language = 'en' | 'ja';

// ---- ヘルパー ----

function getCandidateTitle(candidate: TrainCandidate, line: LineKey, language: Language): string {
  const typeLabel =
    candidate.trainType === 'express'
      ? language === 'ja' ? '急行' : 'Express'
      : language === 'ja' ? '各停' : 'Local';
  const destLabel = getStationLabel(line, candidate.destination, language);
  return `${typeLabel} ${destLabel}`;
}

// ---- コンポーネント ----

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);
  const [line, setLine] = useState<LineKey>('meguro');
  const [fromKey, setFromKey] = useState('meguro');
  const [toKey, setToKey] = useState('fudomae');

  // 言語設定の永続化
  useEffect(() => {
    const saved = window.localStorage.getItem('travel-support-language');
    if (saved === 'ja' || saved === 'en') {
      setLanguage(saved as Language);
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

  // 路線変更時は最初の2駅にリセット
  useEffect(() => {
    const stationList = trainLines[line].stations;
    setFromKey(stationList[0].key);
    setToKey(stationList[Math.min(1, stationList.length - 1)].key);
  }, [line]);

  const stationList = useMemo(() => trainLines[line].stations, [line]);

  const { ok: okResults } = useMemo(
    () => getTrainResults({ line, fromStation: fromKey, toStation: toKey }),
    [line, fromKey, toKey]
  );

  if (!mounted) return null;

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
        ? 'あなたの降りる駅・乗り換える駅に行く電車は見つかりませんでした。行先をもう一度確認してください。'
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
        {/* ヒーローパネル */}
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

        {/* 入力パネル */}
        <section className="panel formPanel">
          <label className="field">
            <span>{t.line}</span>
            <select value={line} onChange={(e) => setLine(e.target.value as LineKey)}>
              {(Object.keys(trainLines) as LineKey[]).map((key) => (
                <option key={key} value={key}>
                  {getLineLabel(key, language)}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{t.from}</span>
            <select value={fromKey} onChange={(e) => setFromKey(e.target.value)}>
              {stationList.map((s) => (
                <option key={s.key} value={s.key}>
                  {language === 'ja' ? s.ja : s.en}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{t.to}</span>
            <select value={toKey} onChange={(e) => setToKey(e.target.value)}>
              {stationList.map((s) => (
                <option key={s.key} value={s.key}>
                  {language === 'ja' ? s.ja : s.en}
                </option>
              ))}
            </select>
          </label>
        </section>

        {/* 結果パネル */}
        <section className="panel resultsPanel">
          <div className="sectionTitle">{t.results}</div>

          {okResults.length === 0 ? (
            <div className="emptyState">
              <strong>{t.noneTitle}</strong>
              <p>{t.noneText}</p>
            </div>
          ) : (
            <div className="resultsList">
              {okResults.map((candidate) => {
                return (
                  <article key={`${candidate.destination}-${candidate.trainType}`} className="resultCard">
                    <div className="resultRow">
                      <div className="resultImageBox">
                        <Image
                          src={candidate.image!}
                          alt={getCandidateTitle(candidate, line, language)}
                          fill
                          sizes="(max-width: 640px) 48vw, 240px"
                          className="resultImage"
                          unoptimized
                          loading="eager"
                        />
                      </div>
                      <div className="resultBody">
                        <div className="resultTitle">{getCandidateTitle(candidate, line, language)}</div>
                        <div className="resultTags">
                          <span className="tagChip">{getLineLabel(line, language)}</span>
                          <span className="tagChip">
                            {candidate.trainType === 'express'
                              ? language === 'ja' ? '急行' : 'Express'
                              : language === 'ja' ? '各停' : 'Local'}
                          </span>
                          {candidate.platform && (
                            <span className="tagChip">
                              {language === 'ja' ? `${candidate.platform}番線` : `Platform ${candidate.platform}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
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
          width: 240px;
          height: 128px;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid #d1fae5;
        }

        .resultImage {
          object-fit: contain;
        }

        .resultBody {
          min-width: 0;
          flex: 1;
          margin-left: 10px;
          padding-top: 2px;
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
            font-size: 22px;
            margin-bottom: 6px;
          }
          .heroText p {
            font-size: 13px;
            line-height: 1.5;
          }
          .formPanel {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .field {
            gap: 4px;
          }
          .field span {
            font-size: 12px;
          }
          .field select {
            padding: 9px 10px;
            font-size: 14px;
          }
          .sectionTitle {
            font-size: 17px;
          }
          .resultRow {
            gap: 10px;
          }
          .resultImageBox {
            width: 48vw;
            height: 28vw;
            max-width: 220px;
            max-height: 124px;
            min-width: 160px;
            min-height: 90px;
          }
          .resultBody {
            margin-left: 10px;
          }
          .resultTitle {
            font-size: 15px;
          }
          .tagChip {
            font-size: 10px;
            padding: 3px 7px;
          }
        }
      `}</style>
    </>
  );
}
