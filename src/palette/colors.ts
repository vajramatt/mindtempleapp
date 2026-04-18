export type RGB = readonly [number, number, number];

export const rgb = (c: RGB, a = 1): string =>
  a >= 1 ? `rgb(${c[0]},${c[1]},${c[2]})` : `rgba(${c[0]},${c[1]},${c[2]},${a})`;

export const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

export const shade = (c: RGB, amt: number): RGB => [
  Math.max(0, Math.min(255, Math.round(c[0] + amt))),
  Math.max(0, Math.min(255, Math.round(c[1] + amt))),
  Math.max(0, Math.min(255, Math.round(c[2] + amt))),
];

export interface BiomePalette {
  id: string;
  name: string;
  grass: RGB;
  grassHi: RGB;
  grassLo: RGB;
  grassBlade: RGB;
  grassFlower: RGB;
  water: [RGB, RGB, RGB];
  waterFoam: RGB;
  stone: RGB;
  stoneHi: RGB;
  stoneLo: RGB;
  sand: RGB;
  accent: RGB;
}

export const SACRED_GROVE: BiomePalette = {
  id: 'sacred_grove',
  name: 'Sacred Grove',
  grass: [46, 88, 58],
  grassHi: [74, 124, 82],
  grassLo: [28, 60, 38],
  grassBlade: [96, 148, 96],
  grassFlower: [236, 202, 112],
  water: [[40, 86, 98], [58, 112, 120], [82, 140, 140]],
  waterFoam: [214, 232, 220],
  stone: [96, 92, 78],
  stoneHi: [130, 124, 104],
  stoneLo: [62, 58, 48],
  sand: [196, 176, 124],
  accent: [246, 196, 83],
};

export const CRYSTAL_CAVERNS: BiomePalette = {
  id: 'crystal_caverns',
  name: 'Crystal Caverns',
  grass: [42, 38, 72],
  grassHi: [68, 62, 108],
  grassLo: [26, 24, 48],
  grassBlade: [124, 108, 196],
  grassFlower: [180, 236, 248],
  water: [[32, 42, 88], [58, 76, 132], [96, 132, 196]],
  waterFoam: [216, 232, 248],
  stone: [72, 66, 102],
  stoneHi: [108, 100, 150],
  stoneLo: [40, 36, 62],
  sand: [148, 138, 176],
  accent: [180, 236, 248],
};

export const EMBER_COAST: BiomePalette = {
  id: 'ember_coast',
  name: 'Ember Coast',
  grass: [46, 28, 26],
  grassHi: [84, 40, 30],
  grassLo: [26, 16, 16],
  grassBlade: [188, 76, 44],
  grassFlower: [246, 176, 64],
  water: [[52, 22, 28], [94, 38, 40], [156, 68, 50]],
  waterFoam: [246, 196, 140],
  stone: [38, 32, 34],
  stoneHi: [68, 58, 60],
  stoneLo: [18, 16, 18],
  sand: [72, 48, 40],
  accent: [246, 108, 48],
};

export const MOONLIT_LAKE: BiomePalette = {
  id: 'moonlit_lake',
  name: 'Moonlit Lake',
  grass: [70, 86, 104],
  grassHi: [116, 136, 160],
  grassLo: [44, 56, 74],
  grassBlade: [176, 196, 220],
  grassFlower: [236, 236, 248],
  water: [[30, 40, 72], [62, 82, 124], [112, 140, 188]],
  waterFoam: [232, 240, 252],
  stone: [96, 108, 130],
  stoneHi: [148, 160, 184],
  stoneLo: [58, 68, 88],
  sand: [180, 190, 208],
  accent: [220, 232, 248],
};

export const WINDSWEPT_PLATEAU: BiomePalette = {
  id: 'windswept_plateau',
  name: 'Windswept Plateau',
  grass: [114, 120, 78],
  grassHi: [156, 164, 108],
  grassLo: [76, 82, 56],
  grassBlade: [196, 200, 132],
  grassFlower: [246, 220, 128],
  water: [[60, 92, 112], [94, 132, 150], [140, 176, 188]],
  waterFoam: [232, 236, 228],
  stone: [124, 120, 108],
  stoneHi: [172, 168, 150],
  stoneLo: [78, 74, 68],
  sand: [220, 200, 156],
  accent: [220, 180, 88],
};

export const BIOMES: BiomePalette[] = [
  SACRED_GROVE,
  CRYSTAL_CAVERNS,
  EMBER_COAST,
  MOONLIT_LAKE,
  WINDSWEPT_PLATEAU,
];

export const SKY = {
  nightDeep: [8, 10, 28] as RGB,
  nightMid: [18, 22, 58] as RGB,
  dawnLow: [242, 166, 112] as RGB,
  dawnHigh: [98, 84, 148] as RGB,
  dayHigh: [138, 196, 232] as RGB,
  dayLow: [198, 228, 244] as RGB,
  duskLow: [248, 148, 102] as RGB,
  duskHigh: [88, 52, 108] as RGB,
};

export const UI = {
  gold: [246, 196, 83] as RGB,
  bone: [236, 229, 208] as RGB,
  deep: [11, 10, 20] as RGB,
  shadow: [0, 0, 0] as RGB,
};
