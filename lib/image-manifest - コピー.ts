import type { LineKey } from "./train-data";

export type TrainTypeKey = "local" | "express";

type ImageManifest = Partial<
  Record<LineKey, Partial<Record<string, Partial<Record<TrainTypeKey, string>>>>>
>;

export const imageManifest: ImageManifest = {
  meguro: {
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

export function getImagePath(
  line: LineKey,
  destination: string,
  trainType: TrainTypeKey
): string | undefined {
  return imageManifest[line]?.[destination]?.[trainType];
}
