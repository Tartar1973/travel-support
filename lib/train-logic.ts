import type { LineKey } from "./train-data";
import { getImagePath, type TrainTypeKey } from "./image-manifest";

export type TrainCandidate = {
  trainType: TrainTypeKey;
  destination: string;
  direction: "inbound" | "outbound";
  platform?: string;
  image?: string;
};

export type TrainResult = {
  ok: TrainCandidate[];
  ng: TrainCandidate[];
};

type Params = {
  line: LineKey;
  fromStation: string;
  toStation: string;
};

const lineStationOrder: Record<LineKey, string[]> = {
  // NOTE: meguro line は分岐路線のため、方向判定・到達判定には
  // MEGURO_LOCAL/EXPRESS_OUTBOUND/INBOUND_PATHS を使用する。
  // このリストは meguro line では実際には参照されない。
  meguro: [
    "meguro",
    "fudomae",
    "musashikoyama",
    "nishikoyama",
    "senzoku",
    "ookayama",
    "okusawa",
    "denenchofu",
    "tamagawa",
    "shinmaruko",
    "musashikosugi",
    "motosumiyoshi",
    "hiyoshi",
    "shin-tsunashima",
    "shin-yokohama",
    "shonandai",
    "kashiwadai",
    "ebina",
  ],
  namboku: [
    "meguro",
    "shirokanedai",
    "shirokanetakanawa",
    "azabujuban",
    "roppongiitchome",
    "tameikesanno",
    "nagatacho",
    "yotsuya",
    "ichigaya",
    "iidabashi",
    "korakuen",
    "todaimae",
    "honkomagome",
    "komagome",
    "nishigahara",
    "oji",
    "ojikamiya",
    "shimo",
    "akabaneiwabuchi",
    "kawaguchimotogo",
    "minamihatogaya",
    "hatogaya",
    "araijuku",
    "tozukaangyo",
    "higashikawaguchi",
    "urawamisono",
  ],
  mita: [
    "meguro",
    "shirokanedai",
    "shirokanetakanawa",
    "mita",
    "onarimon",
    "uchisaiwaicho",
    "hibiya",
    "otemachi",
    "jinbocho",
    "suidobashi",
    "sugamo",
    "takashimadaira",
    "nishitakashimadaira",
  ],
  hibiya: [
    "nakameguro",
    "ebisu",
    "hiroo",
    "roppongi",
    "kamiyacho",
    "toranomonhills",
    "kasumigaseki",
    "hibiya",
    "ginza",
    "higashiginza",
    "tsukiji",
    "hatchobori",
    "kayabacho",
    "ningyocho",
    "kodemmacho",
    "akihabara",
    "nakaokachimachi",
    "ueno",
    "iriya",
    "minowa",
    "minamisenju",
    "kitasenju",
    "takenotsuka",
    "soka",
    "kitakoshigaya",
    "kitakasukabe",
    "tobudobutsukoen",
    "minamikurihashi",
  ],
  "nex-shinjuku": [
    "narita-airport",
    "airport-terminal-2",
    "tokyo",
    "shinagawa",
    "shibuya",
    "shinjuku",
  ],
  "nex-ofuna": [
    "narita-airport",
    "airport-terminal-2",
    "tokyo",
    "shinagawa",
    "musashikosugi-jr",
    "yokohama",
    "totsuka",
    "ofuna",
  ],
  // NOTE: toyoko line は分岐路線のため、方向判定・到達判定には
  // TOYOKO_*_PATHS を使用する。このリストは実際には参照されない。
  toyoko: [
    "shibuya",
    "daikanyama",
    "nakameguro",
    "yutenji",
    "gakugeidaigaku",
    "toritsu-daigaku",
    "jiyugaoka",
    "denenchofu",
    "tamagawa",
    "musashikosugi",
    "motosumiyoshi",
    "hiyoshi",
    "tsunashima",
    "oguchi",
    "kikuna",
    "myorenji",
    "hakuraku",
    "tokyokogyo-daigaku-mae",
    "yokohama",
    "minatomirai",
    "bashamichi",
    "nihon-odori",
    "motomachi-chukagai",
  ],
};

const lineDestinations: Record<
  LineKey,
  { destination: string; trainType: TrainTypeKey; direction: "outbound" | "inbound"; platform?: string }[]
> = {
  meguro: [
    // southbound
    { destination: "ookayama", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "okusawa", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "musashikosugi", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "hiyoshi", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "shin-yokohama", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "ebina", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "shonandai", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "kashiwadai", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "shin-yokohama", trainType: "express", direction: "outbound", platform: "1" },
    { destination: "ebina", trainType: "express", direction: "outbound", platform: "1" },

    // northbound / through service beyond Meguro
    { destination: "meguro", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "takashimadaira", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "nishitakashimadaira", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "akabaneiwabuchi", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "hatogaya", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "urawamisono", trainType: "local", direction: "inbound", platform: "2" },

    { destination: "takashimadaira", trainType: "express", direction: "inbound", platform: "2" },
    { destination: "nishitakashimadaira", trainType: "express", direction: "inbound", platform: "2" },
    { destination: "akabaneiwabuchi", trainType: "express", direction: "inbound", platform: "2" },
    { destination: "hatogaya", trainType: "express", direction: "inbound", platform: "2" },
    { destination: "urawamisono", trainType: "express", direction: "inbound", platform: "2" },
  ],
  namboku: [
    { destination: "akabaneiwabuchi", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "hatogaya", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "urawamisono", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "meguro", trainType: "local", direction: "inbound", platform: "2" },
  ],
  mita: [
    { destination: "takashimadaira", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "nishitakashimadaira", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "takashimadaira", trainType: "express", direction: "outbound", platform: "1" },
    { destination: "nishitakashimadaira", trainType: "express", direction: "outbound", platform: "1" },
    { destination: "nishiya", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "nishiya", trainType: "express", direction: "inbound", platform: "2" },
    { destination: "hiyoshi", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "musashikosugi", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "musashikosugi", trainType: "express", direction: "inbound", platform: "2" },
    { destination: "shin-yokohama", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "shin-yokohama", trainType: "express", direction: "inbound", platform: "2" },
    { destination: "yamato", trainType: "express", direction: "inbound", platform: "2" },
    { destination: "shonandai", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "shonandai", trainType: "express", direction: "inbound", platform: "2" },
    { destination: "ebina", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "ebina", trainType: "express", direction: "inbound", platform: "2" },
    { destination: "meguro", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "shirokanetakanawa", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "hatogaya", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "urawamisono", trainType: "local", direction: "inbound", platform: "2" },
  ],
  hibiya: [
    { destination: "nakameguro", trainType: "local", direction: "inbound", platform: "1" },
    { destination: "ebisu", trainType: "local", direction: "inbound", platform: "1" },
    { destination: "hiroo", trainType: "local", direction: "inbound", platform: "1" },
    { destination: "minamisenju", trainType: "local", direction: "outbound", platform: "2" },
    { destination: "kitasenju", trainType: "local", direction: "outbound", platform: "2" },
    { destination: "takenotsuka", trainType: "local", direction: "outbound", platform: "2" },
    { destination: "soka", trainType: "local", direction: "outbound", platform: "2" },
    { destination: "kitakoshigaya", trainType: "local", direction: "outbound", platform: "2" },
    { destination: "kitakasukabe", trainType: "local", direction: "outbound", platform: "2" },
    { destination: "tobudobutsukoen", trainType: "local", direction: "outbound", platform: "2" },
    { destination: "minamikurihashi", trainType: "local", direction: "outbound", platform: "2" },
  ],
  "nex-shinjuku": [
    { destination: "shinjuku", trainType: "express", direction: "outbound", platform: "1" },
    { destination: "narita-airport", trainType: "express", direction: "inbound", platform: "1" },
  ],
  "nex-ofuna": [
    { destination: "ofuna", trainType: "express", direction: "outbound", platform: "1" },
    { destination: "narita-airport", trainType: "express", direction: "inbound", platform: "1" },
  ],

  toyoko: [
    // ── outbound（渋谷→横浜・元町中華街方面）──
    // 各停
    { destination: "musashikosugi", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "motosumiyoshi", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "hiyoshi", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "yokohama", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "motomachi-chukagai", trainType: "local", direction: "outbound", platform: "1" },
    // 急行
    { destination: "musashikosugi", trainType: "express", direction: "outbound", platform: "1" },
    { destination: "motosumiyoshi", trainType: "express", direction: "outbound", platform: "1" },
    { destination: "hiyoshi", trainType: "express", direction: "outbound", platform: "1" },
    { destination: "yokohama", trainType: "express", direction: "outbound", platform: "1" },
    { destination: "motomachi-chukagai", trainType: "express", direction: "outbound", platform: "1" },
    { destination: "nishiya", trainType: "express", direction: "outbound", platform: "1" },
    { destination: "ebina", trainType: "express", direction: "outbound", platform: "1" },
    { destination: "shonandai", trainType: "express", direction: "outbound", platform: "1" },
    // 通勤急行
    { destination: "kikuna", trainType: "commuter-express", direction: "outbound", platform: "1" },
    { destination: "hiyoshi", trainType: "commuter-express", direction: "outbound", platform: "1" },
    { destination: "motosumiyoshi", trainType: "commuter-express", direction: "outbound", platform: "1" },
    { destination: "sakuragicho", trainType: "commuter-express", direction: "outbound", platform: "1" },
    { destination: "motomachi-chukagai", trainType: "commuter-express", direction: "outbound", platform: "1" },
    // 通勤特急
    { destination: "yokohama", trainType: "limited-express", direction: "outbound", platform: "1" },
    { destination: "sakuragicho", trainType: "limited-express", direction: "outbound", platform: "1" },
    { destination: "motomachi-chukagai", trainType: "limited-express", direction: "outbound", platform: "1" },
    { destination: "motosumiyoshi", trainType: "limited-express", direction: "outbound", platform: "1" },

    // ── inbound（横浜・元町中華街→渋谷、さらに副都心線・東武・西武直通）──
    // 各停
    { destination: "shibuya", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "ikebukuro", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "shakujii-koen", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "tokorozawa", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "kiyose", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "kotesashi", trainType: "local", direction: "inbound", platform: "2" },
    // 急行
    { destination: "shibuya", trainType: "express", direction: "inbound", platform: "2" },
    { destination: "wakoshi", trainType: "express", direction: "inbound", platform: "2" },
    { destination: "kotesashi", trainType: "express", direction: "inbound", platform: "2" },
    // 通勤急行
    { destination: "shibuya", trainType: "commuter-express", direction: "inbound", platform: "2" },
    { destination: "wakoshi", trainType: "commuter-express", direction: "inbound", platform: "2" },
    { destination: "kiyose", trainType: "commuter-express", direction: "inbound", platform: "2" },
    { destination: "kotesashi", trainType: "commuter-express", direction: "inbound", platform: "2" },
    { destination: "shinrin-koen", trainType: "commuter-express", direction: "inbound", platform: "2" },
    // 通勤特急
    { destination: "shibuya", trainType: "limited-express", direction: "inbound", platform: "2" },
    { destination: "tokorozawa", trainType: "limited-express", direction: "inbound", platform: "2" },
    { destination: "kiyose", trainType: "limited-express", direction: "inbound", platform: "2" },
    { destination: "kotesashi", trainType: "limited-express", direction: "inbound", platform: "2" },
    // Fライナー（特急）
    { destination: "kotesashi", trainType: "f-liner", direction: "inbound", platform: "2" },
    { destination: "shinrin-koen", trainType: "f-liner", direction: "inbound", platform: "2" },
  ],
};

const expressStopsMeguro = new Set([
  "meguro",
  "musashikoyama",
  "ookayama",
  "denenchofu",
  "musashikosugi",
  "hiyoshi",
  "shin-yokohama",
  "ebina",
]);

// 東横線急行停車駅（渋谷〜横浜）
const expressStopsToyoko = new Set([
  "shibuya",
  "nakameguro",
  "jiyugaoka",
  "musashikosugi",
  "hiyoshi",
  "kikuna",
  "yokohama",
  // みなとみらい線内全駅
  "minatomirai",
  "bashamichi",
  "nihon-odori",
  "motomachi-chukagai",
]);

// 東横線通勤特急停車駅（朝：横浜方面→渋谷、夕：渋谷→横浜方面）
const limitedExpressStopsToyoko = new Set([
  "shibuya",
  "nakameguro",
  "jiyugaoka",
  "musashikosugi",
  "motosumiyoshi",
  "hiyoshi",
  "kikuna",
  "yokohama",
  "minatomirai",
  "bashamichi",
  "nihon-odori",
  "motomachi-chukagai",
  "sakuragicho",
]);

// 東横線通勤急行停車駅
const commuterExpressStopsToyoko = new Set([
  "shibuya",
  "nakameguro",
  "jiyugaoka",
  "musashikosugi",
  "motosumiyoshi",
  "hiyoshi",
  "kikuna",
  "yokohama",
  "minatomirai",
  "bashamichi",
  "nihon-odori",
  "motomachi-chukagai",
  "sakuragicho",
]);

// 東横線Fライナー（特急）停車駅
const fLinerStopsToyoko = new Set([
  "shibuya",
  "nakameguro",
  "jiyugaoka",
  "musashikosugi",
  "hiyoshi",
  "yokohama",
  "minatomirai",
  "bashamichi",
  "nihon-odori",
  "motomachi-chukagai",
]);

const MEGURO_LOCAL_OUTBOUND_PATHS = [
  [
    "meguro",
    "fudomae",
    "musashikoyama",
    "nishikoyama",
    "senzoku",
    "ookayama",
    "okusawa",
    "denenchofu",
    "tamagawa",
    "shinmaruko",
    "musashikosugi",
    "motosumiyoshi",
    "hiyoshi",
    "shin-tsunashima",
    "shin-yokohama",
    "kashiwadai",
    "ebina",
  ],
  [
    "meguro",
    "fudomae",
    "musashikoyama",
    "nishikoyama",
    "senzoku",
    "ookayama",
    "okusawa",
    "denenchofu",
    "tamagawa",
    "shinmaruko",
    "musashikosugi",
    "motosumiyoshi",
    "hiyoshi",
    "shin-tsunashima",
    "shin-yokohama",
    "shonandai",
  ],
] as const;

const MEGURO_LOCAL_INBOUND_PATHS = [
  [
    "ebina",
    "kashiwadai",
    "shin-yokohama",
    "shin-tsunashima",
    "hiyoshi",
    "motosumiyoshi",
    "musashikosugi",
    "shinmaruko",
    "tamagawa",
    "denenchofu",
    "okusawa",
    "ookayama",
    "senzoku",
    "nishikoyama",
    "musashikoyama",
    "fudomae",
    "meguro",
    "shirokanetakanawa",
    "mita",
    "sugamo",
    "takashimadaira",
    "nishitakashimadaira",
  ],
  [
    "ebina",
    "kashiwadai",
    "shin-yokohama",
    "shin-tsunashima",
    "hiyoshi",
    "motosumiyoshi",
    "musashikosugi",
    "shinmaruko",
    "tamagawa",
    "denenchofu",
    "okusawa",
    "ookayama",
    "senzoku",
    "nishikoyama",
    "musashikoyama",
    "fudomae",
    "meguro",
    "shirokanetakanawa",
    "azabujuban",
    "ichigaya",
    "korakuen",
    "komagome",
    "akabaneiwabuchi",
    "hatogaya",
    "urawamisono",
  ],
  [
    "shonandai",
    "izumino",
    "izumichuo",
    "yumegaoka",
    "futamatagawa",
    "nishiya",
    "shin-yokohama",
    "shin-tsunashima",
    "hiyoshi",
    "motosumiyoshi",
    "musashikosugi",
    "shinmaruko",
    "tamagawa",
    "denenchofu",
    "okusawa",
    "ookayama",
    "senzoku",
    "nishikoyama",
    "musashikoyama",
    "fudomae",
    "meguro",
    "shirokanetakanawa",
    "mita",
    "sugamo",
    "takashimadaira",
    "nishitakashimadaira",
  ],
  [
    "shonandai",
    "izumino",
    "izumichuo",
    "yumegaoka",
    "futamatagawa",
    "nishiya",
    "shin-yokohama",
    "shin-tsunashima",
    "hiyoshi",
    "motosumiyoshi",
    "musashikosugi",
    "shinmaruko",
    "tamagawa",
    "denenchofu",
    "okusawa",
    "ookayama",
    "senzoku",
    "nishikoyama",
    "musashikoyama",
    "fudomae",
    "meguro",
    "shirokanetakanawa",
    "azabujuban",
    "ichigaya",
    "korakuen",
    "komagome",
    "akabaneiwabuchi",
    "hatogaya",
    "urawamisono",
  ],
] as const;

const MEGURO_EXPRESS_OUTBOUND_PATHS = [
  [
    "meguro",
    "musashikoyama",
    "ookayama",
    "denenchofu",
    "musashikosugi",
    "hiyoshi",
    "shin-yokohama",
    "ebina",
  ],
] as const;

const MEGURO_EXPRESS_INBOUND_PATHS = [
  [
    "ebina",
    "shin-yokohama",
    "hiyoshi",
    "musashikosugi",
    "denenchofu",
    "ookayama",
    "musashikoyama",
    "meguro",
    "shirokanetakanawa",
    "mita",
    "sugamo",
    "takashimadaira",
    "nishitakashimadaira",
  ],
  [
    "ebina",
    "shin-yokohama",
    "hiyoshi",
    "musashikosugi",
    "denenchofu",
    "ookayama",
    "musashikoyama",
    "meguro",
    "shirokanetakanawa",
    "azabujuban",
    "ichigaya",
    "korakuen",
    "komagome",
    "akabaneiwabuchi",
    "hatogaya",
    "urawamisono",
  ],
] as const;

// ── 東横線 パス定義 ──
// outbound: 渋谷→元町・中華街（+ 相鉄直通）
const TOYOKO_OUTBOUND_PATHS = [
  // 通常：渋谷→横浜→元町中華街
  [
    "shibuya", "daikanyama", "nakameguro", "yutenji", "gakugeidaigaku",
    "toritsu-daigaku", "jiyugaoka", "denenchofu", "tamagawa",
    "musashikosugi", "motosumiyoshi", "hiyoshi", "tsunashima", "oguchi",
    "kikuna", "myorenji", "hakuraku", "tokyokogyo-daigaku-mae",
    "yokohama", "minatomirai", "bashamichi", "nihon-odori", "motomachi-chukagai",
  ],
  // 桜木町行き（一部）
  [
    "shibuya", "daikanyama", "nakameguro", "yutenji", "gakugeidaigaku",
    "toritsu-daigaku", "jiyugaoka", "denenchofu", "tamagawa",
    "musashikosugi", "motosumiyoshi", "hiyoshi", "tsunashima", "oguchi",
    "kikuna", "myorenji", "hakuraku", "tokyokogyo-daigaku-mae",
    "yokohama", "sakuragicho",
  ],
  // 相鉄直通（西谷・海老名・湘南台）
  [
    "shibuya", "daikanyama", "nakameguro", "yutenji", "gakugeidaigaku",
    "toritsu-daigaku", "jiyugaoka", "denenchofu", "tamagawa",
    "musashikosugi", "motosumiyoshi", "hiyoshi", "tsunashima", "oguchi",
    "kikuna", "myorenji", "hakuraku", "tokyokogyo-daigaku-mae",
    "yokohama", "nishiya", "ebina",
  ],
  [
    "shibuya", "daikanyama", "nakameguro", "yutenji", "gakugeidaigaku",
    "toritsu-daigaku", "jiyugaoka", "denenchofu", "tamagawa",
    "musashikosugi", "motosumiyoshi", "hiyoshi", "tsunashima", "oguchi",
    "kikuna", "myorenji", "hakuraku", "tokyokogyo-daigaku-mae",
    "yokohama", "nishiya", "shonandai",
  ],
] as const;

// inbound: 元町・中華街→渋谷→副都心線・東武・西武直通
const TOYOKO_INBOUND_PATHS = [
  // 副都心線→東武東上線（森林公園・川越市方面）
  [
    "motomachi-chukagai", "nihon-odori", "bashamichi", "minatomirai",
    "yokohama", "tokyokogyo-daigaku-mae", "hakuraku", "myorenji",
    "kikuna", "oguchi", "tsunashima", "hiyoshi", "motosumiyoshi",
    "musashikosugi", "tamagawa", "denenchofu", "jiyugaoka",
    "toritsu-daigaku", "gakugeidaigaku", "yutenji", "nakameguro",
    "daikanyama", "shibuya",
    "meiji-jingumae", "shinjuku-sanchome", "higashi-shinjuku",
    "nishi-waseda", "higashi-ikebukuro", "ikebukuro",
    "wakoshi", "tsuruse", "fujimino", "kawagoeshi", "shinrin-koen",
  ],
  // 副都心線→西武池袋線（所沢・小手指・清瀬方面）
  [
    "motomachi-chukagai", "nihon-odori", "bashamichi", "minatomirai",
    "yokohama", "tokyokogyo-daigaku-mae", "hakuraku", "myorenji",
    "kikuna", "oguchi", "tsunashima", "hiyoshi", "motosumiyoshi",
    "musashikosugi", "tamagawa", "denenchofu", "jiyugaoka",
    "toritsu-daigaku", "gakugeidaigaku", "yutenji", "nakameguro",
    "daikanyama", "shibuya",
    "meiji-jingumae", "shinjuku-sanchome", "higashi-shinjuku",
    "nishi-waseda", "higashi-ikebukuro", "ikebukuro",
    "shakujii-koen", "tokorozawa", "kiyose", "kotesashi",
  ],
  // 渋谷止まり（副都心線直通なし）
  [
    "motomachi-chukagai", "nihon-odori", "bashamichi", "minatomirai",
    "yokohama", "tokyokogyo-daigaku-mae", "hakuraku", "myorenji",
    "kikuna", "oguchi", "tsunashima", "hiyoshi", "motosumiyoshi",
    "musashikosugi", "tamagawa", "denenchofu", "jiyugaoka",
    "toritsu-daigaku", "gakugeidaigaku", "yutenji", "nakameguro",
    "daikanyama", "shibuya",
  ],
  // 桜木町発
  [
    "sakuragicho", "yokohama", "tokyokogyo-daigaku-mae", "hakuraku", "myorenji",
    "kikuna", "oguchi", "tsunashima", "hiyoshi", "motosumiyoshi",
    "musashikosugi", "tamagawa", "denenchofu", "jiyugaoka",
    "toritsu-daigaku", "gakugeidaigaku", "yutenji", "nakameguro",
    "daikanyama", "shibuya",
    "meiji-jingumae", "shinjuku-sanchome", "higashi-shinjuku",
    "nishi-waseda", "higashi-ikebukuro", "ikebukuro",
    "wakoshi", "tsuruse", "fujimino", "kawagoeshi", "shinrin-koen",
  ],
  // 相鉄直通（海老名→横浜→渋谷→西武・東武方面）
  [
    "ebina", "nishiya",
    "yokohama", "tokyokogyo-daigaku-mae", "hakuraku", "myorenji",
    "kikuna", "oguchi", "tsunashima", "hiyoshi", "motosumiyoshi",
    "musashikosugi", "tamagawa", "denenchofu", "jiyugaoka",
    "toritsu-daigaku", "gakugeidaigaku", "yutenji", "nakameguro",
    "daikanyama", "shibuya",
    "meiji-jingumae", "shinjuku-sanchome", "higashi-shinjuku",
    "nishi-waseda", "higashi-ikebukuro", "ikebukuro",
    "wakoshi", "tsuruse", "fujimino", "kawagoeshi", "shinrin-koen",
  ],
  // 相鉄直通（湘南台→横浜→渋谷→西武・東武方面）
  [
    "shonandai", "nishiya",
    "yokohama", "tokyokogyo-daigaku-mae", "hakuraku", "myorenji",
    "kikuna", "oguchi", "tsunashima", "hiyoshi", "motosumiyoshi",
    "musashikosugi", "tamagawa", "denenchofu", "jiyugaoka",
    "toritsu-daigaku", "gakugeidaigaku", "yutenji", "nakameguro",
    "daikanyama", "shibuya",
    "meiji-jingumae", "shinjuku-sanchome", "higashi-shinjuku",
    "nishi-waseda", "higashi-ikebukuro", "ikebukuro",
    "wakoshi", "tsuruse", "fujimino", "kawagoeshi", "shinrin-koen",
  ],
] as const;

function canMoveForwardOnAnyPath(
  paths: readonly (readonly string[])[],
  fromStation: string,
  destination: string
) {
  return paths.some((path) => {
    const fromIndex = path.indexOf(fromStation);
    const destIndex = path.indexOf(destination);
    return fromIndex >= 0 && destIndex > fromIndex;
  });
}

function canReachOnAnyPath(
  paths: readonly (readonly string[])[],
  fromStation: string,
  toStation: string,
  destination: string
) {
  return paths.some((path) => {
    const fromIndex = path.indexOf(fromStation);
    const toIndex = path.indexOf(toStation);
    const destIndex = path.indexOf(destination);
    return fromIndex >= 0 && toIndex > fromIndex && destIndex >= toIndex;
  });
}

function getDirectionFromPaths(
  paths: readonly (readonly string[])[],
  fromStation: string,
  toStation: string
): "outbound" | "inbound" | null {
  for (const path of paths) {
    const fromIndex = path.indexOf(fromStation);
    const toIndex = path.indexOf(toStation);
    if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
      return toIndex > fromIndex ? "outbound" : "inbound";
    }
  }
  return null;
}

function getDirection(
  line: LineKey,
  fromStation: string,
  toStation: string
): "outbound" | "inbound" | null {
  if (line === "meguro") {
    for (const path of [...MEGURO_LOCAL_OUTBOUND_PATHS, ...MEGURO_EXPRESS_OUTBOUND_PATHS]) {
      const fromIndex = (path as readonly string[]).indexOf(fromStation);
      const toIndex = (path as readonly string[]).indexOf(toStation);
      if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
        return toIndex > fromIndex ? "outbound" : "inbound";
      }
    }
    for (const path of [...MEGURO_LOCAL_INBOUND_PATHS, ...MEGURO_EXPRESS_INBOUND_PATHS]) {
      const fromIndex = (path as readonly string[]).indexOf(fromStation);
      const toIndex = (path as readonly string[]).indexOf(toStation);
      if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
        return toIndex > fromIndex ? "inbound" : "outbound";
      }
    }
    return null;
  }

  if (line === "toyoko") {
    // outbound方向を先に確認
    const outDir = getDirectionFromPaths(TOYOKO_OUTBOUND_PATHS, fromStation, toStation);
    if (outDir) return outDir;
    // inbound方向（inboundパスでは進む方向がinbound）
    const inDir = getDirectionFromPaths(TOYOKO_INBOUND_PATHS, fromStation, toStation);
    if (inDir === "outbound") return "inbound"; // inboundパス上で進む = inbound
    if (inDir === "inbound") return "outbound"; // inboundパス上で逆 = outbound
    return null;
  }

  const order = lineStationOrder[line];
  const fromIndex = order.indexOf(fromStation);
  const toIndex = order.indexOf(toStation);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return null;
  return toIndex > fromIndex ? "outbound" : "inbound";
}

function canBoardTrainTypeAtStation(
  line: LineKey,
  fromStation: string,
  trainType: TrainTypeKey
) {
  if (trainType === "local") return true;
  if (line === "meguro" && trainType === "express") {
    return expressStopsMeguro.has(fromStation);
  }
  if (line === "toyoko") {
    if (trainType === "express") return expressStopsToyoko.has(fromStation);
    if (trainType === "limited-express") return limitedExpressStopsToyoko.has(fromStation);
    if (trainType === "commuter-express") return commuterExpressStopsToyoko.has(fromStation);
    if (trainType === "f-liner") return fLinerStopsToyoko.has(fromStation);
  }
  return true;
}

// 三田線から目黒線経由で相鉄直通する行先（lineStationOrderに含まれない）
const MITA_SOTETSU_DESTINATIONS = new Set([
  "hiyoshi", "musashikosugi", "shin-yokohama", "nishiya",
  "yamato", "shonandai", "ebina",
]);

// 東横線から相鉄直通する行先（渋谷方向への到達判定で特別扱い）
const TOYOKO_SOTETSU_DESTINATIONS = new Set(["nishiya", "ebina", "shonandai"]);

function canReachByLocal(
  line: LineKey,
  fromStation: string,
  toStation: string,
  destination: string,
  direction: "outbound" | "inbound"
) {
  if (line === "meguro") {
    const paths =
      direction === "outbound"
        ? MEGURO_LOCAL_OUTBOUND_PATHS
        : MEGURO_LOCAL_INBOUND_PATHS;
    return canReachOnAnyPath(paths, fromStation, toStation, destination);
  }

  if (line === "toyoko") {
    const paths =
      direction === "outbound" ? TOYOKO_OUTBOUND_PATHS : TOYOKO_INBOUND_PATHS;
    return canReachOnAnyPath(paths, fromStation, toStation, destination);
  }

  // 三田線の相鉄直通行先: toStationが三田線内にある && inbound方向なら乗れる
  if (line === "mita" && MITA_SOTETSU_DESTINATIONS.has(destination)) {
    if (direction !== "inbound") return false;
    const order = lineStationOrder[line];
    const fromIndex = order.indexOf(fromStation);
    const toIndex = order.indexOf(toStation);
    return fromIndex >= 0 && toIndex >= 0 && fromIndex > toIndex;
  }

  const order = lineStationOrder[line];
  const fromIndex = order.indexOf(fromStation);
  const toIndex = order.indexOf(toStation);
  const destIndex = order.indexOf(destination);

  if (fromIndex < 0 || toIndex < 0 || destIndex < 0) return false;

  if (direction === "outbound") {
    return fromIndex < toIndex && destIndex >= toIndex;
  }

  return fromIndex > toIndex && destIndex <= toIndex;
}

function canReachByExpressMeguro(
  fromStation: string,
  toStation: string,
  destination: string,
  direction: "outbound" | "inbound"
) {
  if (!expressStopsMeguro.has(fromStation)) return false;

  const paths =
    direction === "outbound"
      ? MEGURO_EXPRESS_OUTBOUND_PATHS
      : MEGURO_EXPRESS_INBOUND_PATHS;

  return canReachOnAnyPath(paths, fromStation, toStation, destination);
}

function canReachByExpressToyoko(
  fromStation: string,
  toStation: string,
  destination: string,
  direction: "outbound" | "inbound",
  trainType: TrainTypeKey
) {
  const stopSet =
    trainType === "f-liner" ? fLinerStopsToyoko :
    trainType === "limited-express" ? limitedExpressStopsToyoko :
    trainType === "commuter-express" ? commuterExpressStopsToyoko :
    expressStopsToyoko;

  if (!stopSet.has(fromStation)) return false;
  if (!stopSet.has(toStation)) return false;

  const paths =
    direction === "outbound" ? TOYOKO_OUTBOUND_PATHS : TOYOKO_INBOUND_PATHS;

  return canReachOnAnyPath(paths, fromStation, toStation, destination);
}

function isDirectionalCandidate(
  line: LineKey,
  fromStation: string,
  destination: string,
  direction: "outbound" | "inbound",
  trainType: TrainTypeKey
) {
  if (line === "meguro") {
    const paths =
      trainType === "express"
        ? direction === "outbound"
          ? MEGURO_EXPRESS_OUTBOUND_PATHS
          : MEGURO_EXPRESS_INBOUND_PATHS
        : direction === "outbound"
        ? MEGURO_LOCAL_OUTBOUND_PATHS
        : MEGURO_LOCAL_INBOUND_PATHS;

    return canMoveForwardOnAnyPath(paths, fromStation, destination);
  }

  if (line === "toyoko") {
    const paths =
      direction === "outbound" ? TOYOKO_OUTBOUND_PATHS : TOYOKO_INBOUND_PATHS;
    return canMoveForwardOnAnyPath(paths, fromStation, destination);
  }

  // 三田線の相鉄直通行先はlineStationOrderに含まれないので特別処理
  if (line === "mita" && MITA_SOTETSU_DESTINATIONS.has(destination)) {
    return direction === "inbound";
  }

  const order = lineStationOrder[line];
  const fromIndex = order.indexOf(fromStation);
  const destIndex = order.indexOf(destination);

  if (fromIndex < 0 || destIndex < 0) return false;
  return direction === "outbound" ? destIndex > fromIndex : destIndex < fromIndex;
}

function sortIndexForMeguro(direction: "outbound" | "inbound", station: string) {
  const primaryPath: readonly string[] =
    direction === "outbound"
      ? MEGURO_LOCAL_OUTBOUND_PATHS[0]
      : MEGURO_LOCAL_INBOUND_PATHS[0];
  const index = primaryPath.indexOf(station);
  if (index >= 0) return index;

  const paths: readonly (readonly string[])[] =
    direction === "outbound" ? MEGURO_LOCAL_OUTBOUND_PATHS : MEGURO_LOCAL_INBOUND_PATHS;
  for (const path of paths) {
    const otherIndex = (path as readonly string[]).indexOf(station);
    if (otherIndex >= 0) return otherIndex;
  }
  return Number.MAX_SAFE_INTEGER;
}

function sortIndexForToyoko(direction: "outbound" | "inbound", station: string) {
  const paths = direction === "outbound" ? TOYOKO_OUTBOUND_PATHS : TOYOKO_INBOUND_PATHS;
  const primaryPath = paths[0] as readonly string[];
  const index = primaryPath.indexOf(station);
  if (index >= 0) return index;
  for (const path of paths) {
    const otherIndex = (path as readonly string[]).indexOf(station);
    if (otherIndex >= 0) return otherIndex;
  }
  return Number.MAX_SAFE_INTEGER;
}

function servicePriority(trainType: TrainTypeKey) {
  // 各停 < 急行 < 通勤急行 < 通勤特急 < Fライナー の順
  const order: Record<TrainTypeKey, number> = {
    "local": 0,
    "express": 1,
    "commuter-express": 2,
    "limited-express": 3,
    "f-liner": 4,
  };
  return order[trainType] ?? 0;
}

function sortRecommended(
  line: LineKey,
  toStation: string,
  direction: "outbound" | "inbound",
  items: TrainCandidate[]
) {
  if (line === "meguro") {
    const toIndex = sortIndexForMeguro(direction, toStation);
    return [...items].sort((a, b) => {
      const aIndex = sortIndexForMeguro(direction, a.destination);
      const bIndex = sortIndexForMeguro(direction, b.destination);
      const aDistance = aIndex - toIndex;
      const bDistance = bIndex - toIndex;
      if (aDistance !== bDistance) return aDistance - bDistance;
      if (servicePriority(a.trainType) !== servicePriority(b.trainType)) {
        return servicePriority(a.trainType) - servicePriority(b.trainType);
      }
      return a.destination.localeCompare(b.destination);
    });
  }

  if (line === "toyoko") {
    const toIndex = sortIndexForToyoko(direction, toStation);
    return [...items].sort((a, b) => {
      const aIndex = sortIndexForToyoko(direction, a.destination);
      const bIndex = sortIndexForToyoko(direction, b.destination);
      const aDistance = aIndex - toIndex;
      const bDistance = bIndex - toIndex;
      if (aDistance !== bDistance) return aDistance - bDistance;
      if (servicePriority(a.trainType) !== servicePriority(b.trainType)) {
        return servicePriority(a.trainType) - servicePriority(b.trainType);
      }
      return a.destination.localeCompare(b.destination);
    });
  }

  const order = lineStationOrder[line];
  const toIndex = order.indexOf(toStation);

  return [...items].sort((a, b) => {
    const aIndex = order.indexOf(a.destination);
    const bIndex = order.indexOf(b.destination);

    const aDistance = direction === "outbound" ? aIndex - toIndex : toIndex - aIndex;
    const bDistance = direction === "outbound" ? bIndex - toIndex : toIndex - bIndex;

    if (aDistance !== bDistance) return aDistance - bDistance;
    if (servicePriority(a.trainType) !== servicePriority(b.trainType)) {
      return servicePriority(a.trainType) - servicePriority(b.trainType);
    }
    return a.destination.localeCompare(b.destination);
  });
}

function sortAvoid(
  line: LineKey,
  fromStation: string,
  direction: "outbound" | "inbound",
  items: TrainCandidate[]
) {
  if (line === "meguro") {
    const fromIndex = sortIndexForMeguro(direction, fromStation);
    return [...items].sort((a, b) => {
      const aIndex = sortIndexForMeguro(direction, a.destination);
      const bIndex = sortIndexForMeguro(direction, b.destination);
      const aDistance = aIndex - fromIndex;
      const bDistance = bIndex - fromIndex;
      if (aDistance !== bDistance) return aDistance - bDistance;
      if (servicePriority(a.trainType) !== servicePriority(b.trainType)) {
        return servicePriority(a.trainType) - servicePriority(b.trainType);
      }
      return a.destination.localeCompare(b.destination);
    });
  }

  if (line === "toyoko") {
    const fromIndex = sortIndexForToyoko(direction, fromStation);
    return [...items].sort((a, b) => {
      const aIndex = sortIndexForToyoko(direction, a.destination);
      const bIndex = sortIndexForToyoko(direction, b.destination);
      const aDistance = aIndex - fromIndex;
      const bDistance = bIndex - fromIndex;
      if (aDistance !== bDistance) return aDistance - bDistance;
      if (servicePriority(a.trainType) !== servicePriority(b.trainType)) {
        return servicePriority(a.trainType) - servicePriority(b.trainType);
      }
      return a.destination.localeCompare(b.destination);
    });
  }

  const order = lineStationOrder[line];
  const fromIndex = order.indexOf(fromStation);

  return [...items].sort((a, b) => {
    const aIndex = order.indexOf(a.destination);
    const bIndex = order.indexOf(b.destination);

    const aDistance = direction === "outbound" ? aIndex - fromIndex : fromIndex - aIndex;
    const bDistance = direction === "outbound" ? bIndex - fromIndex : fromIndex - bIndex;

    if (aDistance !== bDistance) return aDistance - bDistance;
    if (servicePriority(a.trainType) !== servicePriority(b.trainType)) {
      return servicePriority(a.trainType) - servicePriority(b.trainType);
    }
    return a.destination.localeCompare(b.destination);
  });
}

export function getTrainResults({
  line,
  fromStation,
  toStation,
}: Params): TrainResult {
  const direction = getDirection(line, fromStation, toStation);
  if (!direction) {
    return { ok: [], ng: [] };
  }

  const candidates = lineDestinations[line]
    .filter((item) => {
      if (item.direction !== direction) {
        return false;
      }

      if (!canBoardTrainTypeAtStation(line, fromStation, item.trainType)) {
        return false;
      }

      return isDirectionalCandidate(
        line,
        fromStation,
        item.destination,
        direction,
        item.trainType
      );
    })
    .map((item) => {
      const image = getImagePath(line, item.destination, item.trainType);
      return {
        ...item,
        direction,
        image,
      };
    })
    .filter((item) => !!item.image);

  const okRaw = candidates.filter((item) => {
    if (item.trainType === "local") {
      return canReachByLocal(
        line,
        fromStation,
        toStation,
        item.destination,
        direction
      );
    }

    if (line === "meguro" && item.trainType === "express") {
      return canReachByExpressMeguro(
        fromStation,
        toStation,
        item.destination,
        direction
      );
    }

    if (line === "toyoko" && (
      item.trainType === "express" ||
      item.trainType === "commuter-express" ||
      item.trainType === "limited-express" ||
      item.trainType === "f-liner"
    )) {
      return canReachByExpressToyoko(
        fromStation,
        toStation,
        item.destination,
        direction,
        item.trainType
      );
    }

    // NEX は lineStationOrder で到達判定
    if ((line === "nex-shinjuku" || line === "nex-ofuna") && item.trainType === "express") {
      const order = lineStationOrder[line];
      const fromIndex = order.indexOf(fromStation);
      const toIndex = order.indexOf(toStation);
      const destIndex = order.indexOf(item.destination);
      if (fromIndex < 0 || toIndex < 0 || destIndex < 0) return false;
      if (direction === "outbound") return fromIndex < toIndex && destIndex >= toIndex;
      return fromIndex > toIndex && destIndex <= toIndex;
    }

    // 三田線急行（相鉄直通含む）の到達判定
    if (line === "mita" && item.trainType === "express") {
      if (MITA_SOTETSU_DESTINATIONS.has(item.destination)) {
        return direction === "inbound";
      }
      return canReachByLocal(line, fromStation, toStation, item.destination, direction);
    }

    return false;
  });

  const ngRaw = candidates.filter((item) => {
    return !okRaw.some(
      (good) =>
        good.destination === item.destination &&
        good.trainType === item.trainType &&
        good.direction === item.direction
    );
  });

  return {
    ok: sortRecommended(line, toStation, direction, okRaw),
    ng: sortAvoid(line, fromStation, direction, ngRaw),
  };
}
