import { useMemo, useState } from "react";
import Image from "next/image";
import {
  trainLines,
  getLineLabel,
  getStationLabel,
  type LineKey,
} from "../lib/train-data";
import { getTrainResults } from "../lib/train-logic";

type Lang = "ja" | "en";

const uiText = {
  ja: {
    title: "Train Support",
    subtitle: "この表示なら乗ってOKをわかりやすく案内します",
    languageButton: "English",
    line: "路線",
    from: "乗る駅",
    to: "降りる駅",
    okSection: "乗ってOK",
    ngSection: "乗らない方がよい候補",
    service: "種別",
    destination: "行先",
    direction: "方面",
    platform: "番線",
    image: "表示例",
    noResultTitle: "候補が見つかりません",
    noResultBody:
      "あなたの降りる駅、乗り換える駅に行く電車はない可能性があります。今一度、行先を確認してください。",
    ok: "OK",
    ng: "NG",
    local: "各停",
    express: "急行",
    outbound: "下り",
    inbound: "上り",
    showNg: "NG候補を表示",
    hideNg: "NG候補を隠す",
    ngCount: "件",
  },
  en: {
    title: "Train Support",
    subtitle: "We show which train display is safe to board",
    languageButton: "日本語",
    line: "Line",
    from: "Boarding Station",
    to: "Destination Station",
    okSection: "You can board these trains",
    ngSection: "Avoid these trains",
    service: "Service",
    destination: "Destination",
    direction: "Direction",
    platform: "Platform",
    image: "Display example",
    noResultTitle: "No matching trains found",
    noResultBody:
      "There may be no train from this platform that goes to your destination or transfer point. Please check the destination display again.",
    ok: "OK",
    ng: "NG",
    local: "Local",
    express: "Express",
    outbound: "Outbound",
    inbound: "Inbound",
    showNg: "Show NG trains",
    hideNg: "Hide NG trains",
    ngCount: "items",
  },
};

function getTrainTypeLabel(type: "local" | "express", lang: Lang) {
  return type === "local" ? uiText[lang].local : uiText[lang].express;
}

function getDirectionLabel(direction: "outbound" | "inbound", lang: Lang) {
  return direction === "outbound"
    ? uiText[lang].outbound
    : uiText[lang].inbound;
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");
  const [line, setLine] = useState<LineKey>("meguro");
  const [showNg, setShowNg] = useState(false);

  const initialStations = trainLines.meguro.stations;
  const [fromStation, setFromStation] = useState(initialStations[0]?.key ?? "");
  const [toStation, setToStation] = useState(initialStations[1]?.key ?? "");

  const t = uiText[lang];

  const result = useMemo(() => {
    return getTrainResults({
      line,
      fromStation,
      toStation,
    });
  }, [line, fromStation, toStation]);

  function handleChangeLine(nextLine: LineKey) {
    const stations = trainLines[nextLine].stations;
    setLine(nextLine);
    setFromStation(stations[0]?.key ?? "");
    setToStation(stations[1]?.key ?? "");
    setShowNg(false);
  }

  const hasAnyResult = result.ok.length > 0 || result.ng.length > 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "16px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 20,
          padding: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {t.title}
            </h1>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#666",
              }}
            >
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={() => setLang(lang === "ja" ? "en" : "ja")}
            style={{
              border: "1px solid #d9dee8",
              borderRadius: 999,
              background: "#fff",
              padding: "8px 12px",
              fontSize: 13,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t.languageButton}
          </button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {t.line}
            </label>
            <select
              value={line}
              onChange={(e) => handleChangeLine(e.target.value as LineKey)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid #d0d7e2",
                fontSize: 16,
                background: "#fff",
              }}
            >
              {(Object.keys(trainLines) as LineKey[]).map((lineKey) => (
                <option key={lineKey} value={lineKey}>
                  {getLineLabel(lineKey, lang)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {t.from}
            </label>
            <select
              value={fromStation}
              onChange={(e) => {
                setFromStation(e.target.value);
                setShowNg(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid #d0d7e2",
                fontSize: 16,
                background: "#fff",
              }}
            >
              {trainLines[line].stations.map((station) => (
                <option key={station.key} value={station.key}>
                  {getStationLabel(line, station.key, lang)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {t.to}
            </label>
            <select
              value={toStation}
              onChange={(e) => {
                setToStation(e.target.value);
                setShowNg(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid #d0d7e2",
                fontSize: 16,
                background: "#fff",
              }}
            >
              {trainLines[line].stations.map((station) => (
                <option key={station.key} value={station.key}>
                  {getStationLabel(line, station.key, lang)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!hasAnyResult && (
          <div
            style={{
              marginTop: 16,
              background: "#fff7e8",
              border: "1px solid #f1d08d",
              borderRadius: 14,
              padding: 14,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              {t.noResultTitle}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>{t.noResultBody}</div>
          </div>
        )}

        {result.ok.length > 0 && (
          <section style={{ marginTop: 20 }}>
            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: 18,
                fontWeight: 700,
                color: "#0b7a39",
              }}
            >
              {t.okSection}
            </h2>

            <div style={{ display: "grid", gap: 12 }}>
              {result.ok.map((item, index) => (
                <div
                  key={`ok-${index}`}
                  style={{
                    border: "1px solid #bfe4c8",
                    background: "#f1fff5",
                    borderRadius: 16,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#0b7a39",
                      background: "#dff5e6",
                      borderRadius: 999,
                      padding: "4px 10px",
                      marginBottom: 10,
                    }}
                  >
                    {t.ok}
                  </div>

                  <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                    <div>
                      <strong>{t.service}:</strong>{" "}
                      {getTrainTypeLabel(item.trainType, lang)}
                    </div>
                    <div>
                      <strong>{t.destination}:</strong>{" "}
                      {getStationLabel(line, item.destination, lang)}
                    </div>
                    <div>
                      <strong>{t.direction}:</strong>{" "}
                      {getDirectionLabel(item.direction, lang)}
                    </div>
                    {item.platform && (
                      <div>
                        <strong>{t.platform}:</strong> {item.platform}
                      </div>
                    )}
                  </div>

                  {item.image && (
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#666",
                          marginBottom: 8,
                          fontWeight: 600,
                        }}
                      >
                        {t.image}
                      </div>

                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "16 / 9",
                          borderRadius: 12,
                          overflow: "hidden",
                          background: "#eee",
                        }}
                      >
                        <Image
                          src={item.image}
                          alt={`${getStationLabel(line, item.destination, lang)} display`}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 320px"
                          loading={index === 0 ? "eager" : "lazy"}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {result.ng.length > 0 && (
          <section style={{ marginTop: 20 }}>
            <button
              onClick={() => setShowNg((prev) => !prev)}
              style={{
                width: "100%",
                border: "1px solid #f2c7c7",
                background: "#fff6f6",
                color: "#b42318",
                borderRadius: 14,
                padding: "12px 14px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {showNg ? t.hideNg : t.showNg} ({result.ng.length} {t.ngCount})
            </button>

            {showNg && (
              <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                {result.ng.map((item, index) => (
                  <div
                    key={`ng-${index}`}
                    style={{
                      border: "1px solid #f2c7c7",
                      background: "#fff6f6",
                      borderRadius: 16,
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#b42318",
                        background: "#fde7e7",
                        borderRadius: 999,
                        padding: "4px 10px",
                        marginBottom: 10,
                      }}
                    >
                      {t.ng}
                    </div>

                    <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                      <div>
                        <strong>{t.service}:</strong>{" "}
                        {getTrainTypeLabel(item.trainType, lang)}
                      </div>
                      <div>
                        <strong>{t.destination}:</strong>{" "}
                        {getStationLabel(line, item.destination, lang)}
                      </div>
                      <div>
                        <strong>{t.direction}:</strong>{" "}
                        {getDirectionLabel(item.direction, lang)}
                      </div>
                      {item.platform && (
                        <div>
                          <strong>{t.platform}:</strong> {item.platform}
                        </div>
                      )}
                    </div>

                    {item.image && (
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#666",
                            marginBottom: 8,
                            fontWeight: 600,
                          }}
                        >
                          {t.image}
                        </div>

                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            aspectRatio: "16 / 9",
                            borderRadius: 12,
                            overflow: "hidden",
                            background: "#eee",
                          }}
                        >
                          <Image
                            src={item.image}
                            alt={`${getStationLabel(line, item.destination, lang)} display`}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 320px"
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
