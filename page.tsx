export type RouteGuide = {
  from: string;
  to: string;
  line: string;
  platform: string;
  direction: string;
  trainType: string;
  destinationSigns: string[];
  caution?: string;
};

export const routeGuides: RouteGuide[] = [
  {
    from: "Meguro",
    to: "Minami-Hatogaya",
    line: "Tokyo Metro Namboku Line / Saitama Railway",
    platform: "Platform 1",
    direction: "Northbound",
    trainType: "Local",
    destinationSigns: ["Urawa-Misono", "Akabane-Iwabuchi"],
    caution:
      "Do not board trains showing only short-turn destinations if your destination is beyond that point.",
  },
  {
    from: "Ebisu",
    to: "Nakameguro",
    line: "Tokyo Metro Hibiya Line",
    platform: "Platform 1",
    direction: "for Naka-Meguro",
    trainType: "Local",
    destinationSigns: ["Naka-Meguro"],
    caution:
      "Check platform number carefully. Some stations have similar displays.",
  },
  {
    from: "Shibuya",
    to: "Minami-Hatogaya",
    line: "Tokyo Metro Hanzomon Line / Namboku transfer",
    platform: "Platform 3",
    direction: "for Oshiage",
    trainType: "Local / Through service",
    destinationSigns: ["Oshiage", "Kita-Senju"],
    caution: "You may need one transfer depending on the route.",
  },
];
