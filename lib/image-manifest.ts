
import type { LineKey } from "./train-data";

export type TrainTypeKey = "local" | "express";

type ImageManifest = Partial<
  Record<LineKey, Partial<Record<string, Partial<Record<TrainTypeKey, string>>>>>
>;

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");

const imageManifest: ImageManifest = {
  meguro: {
    // 南行き（目黒線内・相鉄直通）
    meguro: {
      local: "/train-displays/meguro/meguro-local.gif",
      express: "/train-displays/meguro/meguro-express.gif",
    },
    ookayama: {
      local: "/train-displays/meguro/ookayama-local.gif",
      express: "/train-displays/meguro/ookayama-express.gif",
    },
    okusawa: {
      local: "/train-displays/meguro/okusawa-local.gif",
    },
    musashikosugi: {
      local: "/train-displays/meguro/musashikosugi-local.gif",
      express: "/train-displays/meguro/musashikosugi-express.gif",
    },
    hiyoshi: {
      local: "/train-displays/meguro/hiyoshi-local.gif",
      express: "/train-displays/meguro/hiyoshi-express.gif",
    },
    "shin-yokohama": {
      local: "/train-displays/meguro/shin-yokohama-local.gif",
      express: "/train-displays/meguro/shin-yokohama-express.gif",
    },
    ebina: {
      local: "/train-displays/meguro/ebina-local.gif",
      express: "/train-displays/meguro/ebina-express.gif",
    },
    shonandai: {
      local: "/train-displays/meguro/shonandai-local.gif",
      express: "/train-displays/meguro/shonandai-express.gif",
    },
    kashiwadai: {
      local: "/train-displays/meguro/kashiwadai-local.gif",
    },
    // 北行き（三田線直通）
    takashimadaira: {
      express: "/train-displays/meguro/takashimadaira-express.gif",
    },
    nishitakashimadaira: {
      express: "/train-displays/meguro/nishi-takashimadaira-express.gif",
    },
    // 北行き（南北線直通）
    akabaneiwabuchi: {
      express: "/train-displays/meguro/akabane-iwabuchi-express.gif",
    },
    hatogaya: {
      express: "/train-displays/meguro/hatogaya-express.gif",
    },
    urawamisono: {
      express: "/train-displays/meguro/urawa-misono-express.gif",
    },
  },

  namboku: {
    akabaneiwabuchi: {
      local: "/train-displays/namboku/akabaneiwabuchi-local.gif",
      express: "/train-displays/namboku/akabane-iwabuchi-express.gif",
    },
    hatogaya: {
      local: "/train-displays/namboku/hatogaya-local.gif",
      express: "/train-displays/namboku/hatogaya-express.gif",
    },
    urawamisono: {
      local: "/train-displays/namboku/urawamisono-local.gif",
      express: "/train-displays/namboku/urawa-misono-express.gif",
    },
  },

  mita: {
    hatogaya: {
      local: "/train-displays/mita/hatogaya-local.gif",
    },
    takashimadaira: {
      local: "/train-displays/mita/takashimadaira-local.gif",
      express: "/train-displays/mita/takashimadaira-express.gif",
    },
    nishitakashimadaira: {
      local: "/train-displays/mita/nishi-takashimadaira-local.gif",
      express: "/train-displays/mita/nishi-takashimadaira-express.gif",
    },
  },

  hibiya: {
    hiroo: {
      local: "/train-displays/hibiya/hiro-local.gif",
    },
    kitasenju: {
      local: "/train-displays/hibiya/kita-senju-local.gif",
    },
    takenotsuka: {
      local: "/train-displays/hibiya/takenotsuka-local.gif",
    },
    kitakoshigaya: {
      local: "/train-displays/hibiya/kita-koshigaya-local.gif",
    },
    kitakasukabe: {
      local: "/train-displays/hibiya/kita-kasukabe-local.gif",
    },
    tobudobutsukoen: {
      local: "/train-displays/hibiya/tobu-dobutsu-koen-local.gif",
    },
  },
};

const lineAliases: Partial<Record<LineKey, Record<string, string>>> = {
  meguro: {
    "musashi-kosugi": "musashikosugi",
    musashikosugi: "musashikosugi",
    ookayama: "ookayama",
    okusawa: "okusawa",
    hiyoshi: "hiyoshi",
    "shin-yokohama": "shin-yokohama",
    shinyokohama: "shin-yokohama",
    ebina: "ebina",
    shonandai: "shonandai",
    kashiwadai: "kashiwadai",
    // 北行き（三田線直通）
    takashimadaira: "takashimadaira",
    nishitakashimadaira: "nishitakashimadaira",
    "nishi-takashimadaira": "nishitakashimadaira",
    // 北行き（南北線直通）
    akabaneiwabuchi: "akabaneiwabuchi",
    "akabane-iwabuchi": "akabaneiwabuchi",
    hatogaya: "hatogaya",
    urawamisono: "urawamisono",
    "urawa-misono": "urawamisono",
  },

  namboku: {
    akabaneiwabuchi: "akabaneiwabuchi",
    "akabane-iwabuchi": "akabaneiwabuchi",
    hatogaya: "hatogaya",
    urawamisono: "urawamisono",
    "urawa-misono": "urawamisono",
  },

  mita: {
    takashimadaira: "takashimadaira",
    "takashima-daira": "takashimadaira",
    nishitakashimadaira: "nishitakashimadaira",
    "nishi-takashimadaira": "nishitakashimadaira",
  },

  hibiya: {
    hiroo: "hiroo",
    "hiro-o": "hiroo",
    hiro: "hiroo",
    kitasenju: "kitasenju",
    "kita-senju": "kitasenju",
    takenotsuka: "takenotsuka",
    kitakoshigaya: "kitakoshigaya",
    "kita-koshigaya": "kitakoshigaya",
    kitakasukabe: "kitakasukabe",
    "kita-kasukabe": "kitakasukabe",
    tobudobutsukoen: "tobudobutsukoen",
    "tobu-dobutsu-koen": "tobudobutsukoen",
  },
};

export function resolveDestinationKey(
  line: LineKey,
  destination: string
): string | undefined {
  const normalized = normalize(destination);
  const aliases = lineAliases[line] ?? {};
  return aliases[normalized] ?? aliases[normalized.replace(/-/g, "")] ?? normalized;
}

// meguro線北行き各停の行先は namboku/mita の local 画像を使う
const MEGURO_INBOUND_NAMBOKU = new Set(["akabaneiwabuchi", "hatogaya", "urawamisono"]);
const MEGURO_INBOUND_MITA    = new Set(["takashimadaira", "nishitakashimadaira"]);

export function getImagePath(
  line: LineKey,
  destination: string,
  trainType: TrainTypeKey
): string | undefined {
  const resolvedDestination = resolveDestinationKey(line, destination);
  if (!resolvedDestination) return undefined;

  let dest = imageManifest[line]?.[resolvedDestination];

  // meguro線北行き各停: meguroフォルダにlocal画像がない場合は namboku/mita から参照
  if (line === "meguro" && trainType === "local" && (!dest || !dest.local)) {
    if (MEGURO_INBOUND_NAMBOKU.has(resolvedDestination)) {
      dest = imageManifest["namboku"]?.[resolvedDestination];
    } else if (MEGURO_INBOUND_MITA.has(resolvedDestination)) {
      dest = imageManifest["mita"]?.[resolvedDestination];
    }
  }

  if (!dest) return undefined;

  // trainTypeに対応する画像がない場合はundefinedを返す（異種別へのフォールバックをしない）
  return dest[trainType];
}

export { imageManifest };