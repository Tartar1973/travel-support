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
    "ebina",
    "shonandai",
    "kashiwadai",
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
  { destination: string; trainType: TrainTypeKey; platform?: string }[]
> = {
  meguro: [
    { destination: "musashikosugi", trainType: "local", platform: "1" },
    { destination: "hiyoshi", trainType: "local", platform: "1" },
    { destination: "shin-yokohama", trainType: "local", platform: "1" },
    { destination: "ebina", trainType: "local", platform: "1" },
    { destination: "shonandai", trainType: "local", platform: "1" },
    { destination: "kashiwadai", trainType: "local", platform: "1" },
    { destination: "shin-yokohama", trainType: "express", platform: "1" },
    { destination: "ebina", trainType: "express", platform: "1" },
  ],
  namboku: [
    { destination: "akabaneiwabuchi", trainType: "local", platform: "1" },
    { destination: "hatogaya", trainType: "local", platform: "1" },
    { destination: "urawamisono", trainType: "local", platform: "1" },
  ],
  mita: [
    { destination: "takashimadaira", trainType: "local", platform: "1" },
    { destination: "nishitakashimadaira", trainType: "local", platform: "1" },
  ],
  hibiya: [
    { destination: "hiroo", trainType: "local", platform: "2" },
    { destination: "kitasenju", trainType: "local", platform: "2" },
    { destination: "takenotsuka", trainType: "local", platform: "2" },
    { destination: "kitakoshigaya", trainType: "local", platform: "2" },
    { destination: "kitakasukabe", trainType: "local", platform: "2" },
    { destination: "tobudobutsukoen", trainType: "local", platform: "2" },
  ],
};

const expressStopsMeguro = new Set([
  "meguro",
  "ookayama",
  "denenchofu",
  "musashikosugi",
  "hiyoshi",
  "shin-yokohama",
  "ebina",
]);

function getDirection(
  line: LineKey,
  fromStation: string,
  toStation: string
): "outbound" | "inbound" | null {
  const order = lineStationOrder[line];
  const fromIndex = order.indexOf(fromStation);
  const toIndex = order.indexOf(toStation);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return null;
  return toIndex > fromIndex ? "outbound" : "inbound";
}

function canReachByLocal(
  line: LineKey,
  fromStation: string,
  toStation: string,
  destination: string,
  direction: "outbound" | "inbound"
) {
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
  if (!expressStopsMeguro.has(toStation)) return false;
  if (!expressStopsMeguro.has(destination)) return false;

  const order = lineStationOrder.meguro;
  const fromIndex = order.indexOf(fromStation);
  const toIndex = order.indexOf(toStation);
  const destIndex = order.indexOf(destination);

  if (fromIndex < 0 || toIndex < 0 || destIndex < 0) return false;

  if (direction === "outbound") {
    return fromIndex < toIndex && destIndex >= toIndex;
  }

  return fromIndex > toIndex && destIndex <= toIndex;
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
  const order = lineStationOrder[line];
  const toIndex = order.indexOf(toStation);

  return [...items].sort((a, b) => {
    const aIndex = order.indexOf(a.destination);
    const bIndex = order.indexOf(b.destination);

    const aDistance =
      direction === "outbound" ? aIndex - toIndex : toIndex - aIndex;
    const bDistance =
      direction === "outbound" ? bIndex - toIndex : toIndex - bIndex;

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
  const order = lineStationOrder[line];
  const fromIndex = order.indexOf(fromStation);

  return [...items].sort((a, b) => {
    const aIndex = order.indexOf(a.destination);
    const bIndex = order.indexOf(b.destination);

    const aDistance =
      direction === "outbound" ? aIndex - fromIndex : fromIndex - aIndex;
    const bDistance =
      direction === "outbound" ? bIndex - fromIndex : fromIndex - bIndex;

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
      const order = lineStationOrder[line];
      const fromIndex = order.indexOf(fromStation);
      const destIndex = order.indexOf(item.destination);

      if (fromIndex < 0 || destIndex < 0) return false;

      if (direction === "outbound") {
        return destIndex > fromIndex;
      }
      return destIndex < fromIndex;
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
