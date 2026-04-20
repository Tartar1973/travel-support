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
    "kitakoshigaya",
    "kitakasukabe",
    "tobudobutsukoen",
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

    // 目黒線直通の急行は「目黒行き」「大手町行き」などは出さない
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
  ],
  mita: [
    { destination: "takashimadaira", trainType: "local", direction: "outbound", platform: "1" },
    { destination: "nishitakashimadaira", trainType: "local", direction: "outbound", platform: "1" },
  ],
  hibiya: [
    { destination: "hiroo", trainType: "local", direction: "inbound", platform: "2" },
    { destination: "kitasenju", trainType: "local", direction: "outbound", platform: "2" },
    { destination: "takenotsuka", trainType: "local", direction: "outbound", platform: "2" },
    { destination: "kitakoshigaya", trainType: "local", direction: "outbound", platform: "2" },
    { destination: "kitakasukabe", trainType: "local", direction: "outbound", platform: "2" },
    { destination: "tobudobutsukoen", trainType: "local", direction: "outbound", platform: "2" },
  ],
};

const expressStopsMeguro = new Set([
  "meguro",
  "musashikoyama", // 武蔵小山
  "ookayama",
  "denenchofu",
  "musashikosugi",
  "hiyoshi",
  "shin-yokohama",
  "ebina",
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
    return getDirectionFromPaths(
      [
        ...MEGURO_LOCAL_OUTBOUND_PATHS,
        ...MEGURO_LOCAL_INBOUND_PATHS,
        ...MEGURO_EXPRESS_OUTBOUND_PATHS,
        ...MEGURO_EXPRESS_INBOUND_PATHS,
      ],
      fromStation,
      toStation
    );
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
  return true;
}

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

  const order = lineStationOrder[line];
  const fromIndex = order.indexOf(fromStation);
  const destIndex = order.indexOf(destination);

  if (fromIndex < 0 || destIndex < 0) return false;
  return direction === "outbound" ? destIndex > fromIndex : destIndex < fromIndex;
}

function sortIndexForMeguro(direction: "outbound" | "inbound", station: string) {
  const primaryPath =
    direction === "outbound"
      ? MEGURO_LOCAL_OUTBOUND_PATHS[0]
      : MEGURO_LOCAL_INBOUND_PATHS[0];
  const index = primaryPath.indexOf(station);
  if (index >= 0) return index;

  for (const path of direction === "outbound" ? MEGURO_LOCAL_OUTBOUND_PATHS : MEGURO_LOCAL_INBOUND_PATHS) {
    const otherIndex = path.indexOf(station);
    if (otherIndex >= 0) return otherIndex;
  }
  return Number.MAX_SAFE_INTEGER;
}

function servicePriority(trainType: TrainTypeKey) {
  return trainType === "local" ? 0 : 1;
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
      // エントリの方向と実際の移動方向が一致するもののみ通す
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