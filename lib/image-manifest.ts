import type { LineKey } from "./train-data";

export type TrainTypeKey = "local" | "express";

type ImageManifest = Partial<
  Record<LineKey, Partial<Record<string, Partial<Record<TrainTypeKey, string>>>>>
>;

export const imageManifest: ImageManifest = {
  meguro: {
    musashikosugi: {
      local: "/train-displays/meguro/musashikosugi-local.gif",
    },
    hiyoshi: {
      local: "/train-displays/meguro/hiyoshi-local.gif",
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
    },
    kashiwadai: {
      local: "/train-displays/meguro/kashiwadai-local.gif",
    },
  },

  namboku: {
    akabaneiwabuchi: {
      local: "/train-displays/namboku/akabaneiwabuchi-local.gif",
    },
    hatogaya: {
      local: "/train-displays/namboku/hatogaya-local.gif",
    },
    urawamisono: {
      local: "/train-displays/namboku/urawamisono-local.gif",
    },
  },

  mita: {
    takashimadaira: {
      local: "/train-displays/mita/takashimadaira-local.gif",
    },
    nishitakashimadaira: {
      local: "/train-displays/mita/nishi-takashimadaira-local.gif",
    },
  },

  hibiya: {
    nakameguro: {
      local: "/train-displays/hibiya/nakameguro-local.gif",
    },
    ebisu: {
      local: "/train-displays/hibiya/ebisu-local.gif",
    },
    hiroo: {
      local: "/train-displays/hibiya/hiroo-local.gif",
    },
    roppongi: {
      local: "/train-displays/hibiya/roppongi-local.gif",
    },
    kamiyacho: {
      local: "/train-displays/hibiya/kamiyacho-local.gif",
    },
    toranomonhills: {
      local: "/train-displays/hibiya/toranomonhills-local.gif",
    },
    kasumigaseki: {
      local: "/train-displays/hibiya/kasumigaseki-local.gif",
    },
    hibiya: {
      local: "/train-displays/hibiya/hibiya-local.gif",
    },
    ginza: {
      local: "/train-displays/hibiya/ginza-local.gif",
    },
  },
};

export function getImagePath(
  line: LineKey,
  destination: string,
  trainType: TrainTypeKey
): string | undefined {
  return imageManifest[line]?.[destination]?.[trainType];
}
