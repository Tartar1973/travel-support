export type LineKey = "meguro" | "namboku" | "mita" | "hibiya";

export type Station = {
  key: string;
  ja: string;
  en: string;
};

export type TrainLine = {
  key: LineKey;
  ja: string;
  en: string;
  stations: Station[];
};

export const trainLines: Record<LineKey, TrainLine> = {
  meguro: {
    key: "meguro",
    ja: "目黒線",
    en: "Meguro Line",
    stations: [
      { key: "meguro", ja: "目黒", en: "Meguro" },
      { key: "fudomae", ja: "不動前", en: "Fudomae" },
      { key: "musashikoyama", ja: "武蔵小山", en: "Musashi-Koyama" },
      { key: "nishikoyama", ja: "西小山", en: "Nishi-Koyama" },
      { key: "senzoku", ja: "洗足", en: "Senzoku" },
      { key: "ookayama", ja: "大岡山", en: "Ookayama" },
      { key: "okusawa", ja: "奥沢", en: "Okusawa" },
      { key: "denenchofu", ja: "田園調布", en: "Den-en-chofu" },
      { key: "tamagawa", ja: "多摩川", en: "Tamagawa" },
      { key: "shinmaruko", ja: "新丸子", en: "Shin-Maruko" },
      { key: "musashikosugi", ja: "武蔵小杉", en: "Musashi-Kosugi" },
      { key: "motosumiyoshi", ja: "元住吉", en: "Motosumiyoshi" },
      { key: "hiyoshi", ja: "日吉", en: "Hiyoshi" },
      { key: "shin-tsunashima", ja: "新綱島", en: "Shin-Tsunashima" },
      { key: "shin-yokohama", ja: "新横浜", en: "Shin-Yokohama" },
      { key: "ebina", ja: "海老名", en: "Ebina" },
      { key: "shonandai", ja: "湘南台", en: "Shonandai" },
      { key: "kashiwadai", ja: "かしわ台", en: "Kashiwadai" },
    ],
  },

  namboku: {
    key: "namboku",
    ja: "南北線",
    en: "Namboku Line",
    stations: [
      { key: "meguro", ja: "目黒", en: "Meguro" },
      { key: "shirokanedai", ja: "白金台", en: "Shirokanedai" },
      { key: "shirokanetakanawa", ja: "白金高輪", en: "Shirokane-Takanawa" },
      { key: "azabujuban", ja: "麻布十番", en: "Azabu-juban" },
      { key: "roppongiitchome", ja: "六本木一丁目", en: "Roppongi-itchome" },
      { key: "tameikesanno", ja: "溜池山王", en: "Tameike-sanno" },
      { key: "nagatacho", ja: "永田町", en: "Nagatacho" },
      { key: "yotsuya", ja: "四ツ谷", en: "Yotsuya" },
      { key: "ichigaya", ja: "市ケ谷", en: "Ichigaya" },
      { key: "iidabashi", ja: "飯田橋", en: "Iidabashi" },
      { key: "korakuen", ja: "後楽園", en: "Korakuen" },
      { key: "todaimae", ja: "東大前", en: "Todaimae" },
      { key: "honkomagome", ja: "本駒込", en: "Hon-Komagome" },
      { key: "komagome", ja: "駒込", en: "Komagome" },
      { key: "nishigahara", ja: "西ケ原", en: "Nishigahara" },
      { key: "oji", ja: "王子", en: "Oji" },
      { key: "ojikamiya", ja: "王子神谷", en: "Oji-Kamiya" },
      { key: "shimo", ja: "志茂", en: "Shimo" },
      { key: "akabaneiwabuchi", ja: "赤羽岩淵", en: "Akabane-Iwabuchi" },
      { key: "kawaguchimotogo", ja: "川口元郷", en: "Kawaguchi-Motogo" },
      { key: "minamihatogaya", ja: "南鳩ヶ谷", en: "Minami-Hatogaya" },
      { key: "hatogaya", ja: "鳩ヶ谷", en: "Hatogaya" },
      { key: "araijuku", ja: "新井宿", en: "Araijuku" },
      { key: "tozukaangyo", ja: "戸塚安行", en: "Tozuka-angyo" },
      { key: "higashikawaguchi", ja: "東川口", en: "Higashi-Kawaguchi" },
      { key: "urawamisono", ja: "浦和美園", en: "Urawa-Misono" },
    ],
  },

  mita: {
    key: "mita",
    ja: "三田線",
    en: "Mita Line",
    stations: [
      { key: "meguro", ja: "目黒", en: "Meguro" },
      { key: "shirokanedai", ja: "白金台", en: "Shirokanedai" },
      { key: "shirokanetakanawa", ja: "白金高輪", en: "Shirokane-Takanawa" },
      { key: "mita", ja: "三田", en: "Mita" },
      { key: "onarimon", ja: "御成門", en: "Onarimon" },
      { key: "uchisaiwaicho", ja: "内幸町", en: "Uchisaiwaicho" },
      { key: "hibiya", ja: "日比谷", en: "Hibiya" },
      { key: "otemachi", ja: "大手町", en: "Otemachi" },
      { key: "jinbocho", ja: "神保町", en: "Jimbocho" },
      { key: "suidobashi", ja: "水道橋", en: "Suidobashi" },
      { key: "sugamo", ja: "巣鴨", en: "Sugamo" },
      { key: "takashimadaira", ja: "高島平", en: "Takashimadaira" },
      { key: "nishitakashimadaira", ja: "西高島平", en: "Nishi-Takashimadaira" },
    ],
  },

  hibiya: {
    key: "hibiya",
    ja: "日比谷線",
    en: "Hibiya Line",
    stations: [
      { key: "nakameguro", ja: "中目黒", en: "Nakameguro" },
      { key: "ebisu", ja: "恵比寿", en: "Ebisu" },
      { key: "hiroo", ja: "広尾", en: "Hiroo" },
      { key: "roppongi", ja: "六本木", en: "Roppongi" },
      { key: "kamiyacho", ja: "神谷町", en: "Kamiyacho" },
      { key: "toranomonhills", ja: "虎ノ門ヒルズ", en: "Toranomon Hills" },
      { key: "kasumigaseki", ja: "霞ケ関", en: "Kasumigaseki" },
      { key: "hibiya", ja: "日比谷", en: "Hibiya" },
      { key: "ginza", ja: "銀座", en: "Ginza" },
      { key: "higashiginza", ja: "東銀座", en: "Higashi-Ginza" },
      { key: "tsukiji", ja: "築地", en: "Tsukiji" },
      { key: "hatchobori", ja: "八丁堀", en: "Hatchobori" },
      { key: "kayabacho", ja: "茅場町", en: "Kayabacho" },
      { key: "ningyocho", ja: "人形町", en: "Ningyocho" },
      { key: "kodemmacho", ja: "小伝馬町", en: "Kodemmacho" },
      { key: "akihabara", ja: "秋葉原", en: "Akihabara" },
      { key: "nakaokachimachi", ja: "仲御徒町", en: "Naka-Okachimachi" },
      { key: "ueno", ja: "上野", en: "Ueno" },
      { key: "iriya", ja: "入谷", en: "Iriya" },
      { key: "minamisenju", ja: "南千住", en: "Minami-Senju" },
      { key: "kitasenju", ja: "北千住", en: "Kita-Senju" },
      { key: "takenotsuka", ja: "竹ノ塚", en: "Takenotsuka" },
      { key: "kitakoshigaya", ja: "北越谷", en: "Kita-Koshigaya" },
      { key: "kitakasukabe", ja: "北春日部", en: "Kita-Kasukabe" },
      { key: "tobudobutsukoen", ja: "東武動物公園", en: "Tobu-Dobutsu-Koen" },
    ],
  },
};

export function getLineLabel(lineKey: LineKey, lang: "ja" | "en") {
  return lang === "ja" ? trainLines[lineKey].ja : trainLines[lineKey].en;
}

export function getStationLabel(
  lineKey: LineKey,
  stationKey: string,
  lang: "ja" | "en"
) {
  const station = trainLines[lineKey].stations.find((s) => s.key === stationKey);
  if (!station) return stationKey;
  return lang === "ja" ? station.ja : station.en;
}
