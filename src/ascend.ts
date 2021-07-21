import { containsText, print, toInt, visitUrl } from "kolmafia";
import { $item, $items, $stat } from ".";

export enum lifestyle {
  casual = 1,
  softcore = 2,
  normal = 2,
  hardcore = 3,
}

export class Path {
  name: string;
  id: number;
  isAvatar: boolean; //here, we define avatar-ness around being its own class
  constructor(name: string, id: number, isAvatar = false) {
    this.name = name;
    this.id = id;
    this.isAvatar = isAvatar;
  }
}

export const Paths = {
  unrestricted: new Path("Unrestricted", 0),
  boozetafarian: new Path("Boozetafarian", 2),
  teetotaler: new Path("Teetotaler", 2),
  oxygenarian: new Path("Oxygenarian", 3),
  beesHateYou: new Path("Bees Hate You", 4),
  wayOfTheSurprisingFist: new Path("Way of the Surprising Fist", 6),
  trendy: new Path("Trendy", 6),
  avatarOfBoris: new Path("Avatar of Boris", 8, true),
  bugbearInvasion: new Path("Bugbear Invasion", 9),
  zombieSlayer: new Path("Zombie Slayer", 10, true),
  classAct: new Path("Class Act", 11),
  avatarofJarlsberg: new Path("Avatar of Jarlsberg", 12, true),
  big: new Path("BIG!", 14),
  kolHs: new Path("KOLHS", 15),
  classAct2: new Path("Class Act II: A Class For Pigs", 16),
  avatarofSneakyPete: new Path("Avatar of Sneaky Pete", 17, true),
  slowAndSteady: new Path("Slow and Steady", 18),
  heavyRains: new Path("Heavy Rains", 19),
  picky: new Path("Picky", 21),
  standard: new Path("Standard", 22),
  actuallyEdTheUndying: new Path("Actually Ed the Undying", 23, true),
  oneCrazyRandomSummer: new Path("One Crazy Random Summer", 24),
  communityService: new Path("Community Service", 25),
  avatarOfWestOfLoathing: new Path("Avatar of West of Loathing", 26, true),
  theSource: new Path("The Source", 27),
  nuclearAutumn: new Path("Nuclear Autumn", 28),
  gelatinousNoob: new Path("Gelatinous Noob", 29, true),
  licenseToAdventure: new Path("License to Adventure", 30),
  liveAscendRepeat: new Path("Live. Ascend. Repeat.", 31),
  pocketFamiliars: new Path("Pocket Familiars", 32),
  gLover: new Path("G-Lover", 33),
  disguisesDelimit: new Path("Disguises Delimit", 34),
  darkGyffte: new Path("Dark Gyffte", 35, true),
  twoCrazyRandomSummer: new Path("Two Crazy Random Summer", 36),
  kingdomOfExploathing: new Path("Kingdom of Exploathing", 37),
  pathOfThePlumber: new Path("Path of the Plumber", 38, true),
  lowKeySummer: new Path("Low Key Summer", 40),
  greyGoo: new Path("Grey Goo", 40),
  youRobot: new Path("You, Robot", 41),
  quantumTerrarium: new Path("Quantum Terrarium", 42),
};

export function ascend(
  path: Path,
  playerClass: Class,
  lifestyle: lifestyle,
  moon: string | number,
  consumable: Item | undefined = $item`Astral Six-Pack`,
  pet: Item | undefined = undefined
): void {
  if (!containsText(visitUrl("charpane.php"), "Astral Spirit")) {
    print(
      "It'd really be better if you were already through the gash. Oh well!",
      "blue"
    );
    visitUrl("ascend.php?action=ascend&confirm=on&confirm2=on");
  }
  if (!containsText(visitUrl("charpane.php"), "Astral Spirit"))
    throw "Failed to ascend.";
  const toMoonId = (moon: string | number): number => {
    if (typeof moon === "number") return moon;

    const offset = (): number => {
      switch (playerClass.primestat) {
        case $stat`Muscle`:
          return 0;
        case $stat`Mysticality`:
          return 1;
        case $stat`Moxie`:
          return 2;
        default:
          throw `unknown prime stat for ${playerClass}`;
      }
    };

    switch ((moon as string).toLowerCase()) {
      case "mongoose":
        return 1;
      case "wallaby":
        return 2;
      case "vole":
        return 3;
      case "platypus":
        return 4;
      case "opossum":
        return 5;
      case "marmot":
        return 6;
      case "wombat":
        return 7;
      case "blender":
        return 8;
      case "packrat":
        return 9;
      case "degrassi":
      case "degrassi knoll":
      case "friendly degrassi knoll":
      case "knoll":
        return 1 + offset();
      case "canada":
      case "canadia":
      case "little canadia":
        return 4 + offset();
      case "gnomads":
      case "gnomish":
      case "gnomish gnomads camp":
        return 7 + offset();
      default:
        return -1;
    }
  };
  const classid = path.isAvatar ? 0 : toInt(playerClass);
  if (path.id < 0) throw `Invalid path ID ${path.id}`;
  if (toMoonId(moon) < 1) throw `Invalid moon ${moon}`;
  if (
    consumable &&
    !$items`Astral Six-Pack, Astral Hot Dog Dinner`.includes(consumable)
  )
    throw `Invalid consumable ${consumable}`;
  if (
    pet &&
    !$items`Astral Bludgeon,
    Astral Shield, Astral Chapeau,
    Astral Bracer, Astral Longbow,
    Astral Shorts, Astral Mace,
    Astral Ring, Astral Statuette,
    Astral Pistol, Astral Mask,
    Astral Pet Sweater, Astral Shirt,
    Astral Blt`.includes(pet)
  )
    throw `Invalid astral item ${pet}`;

  visitUrl("afterlife.php?action=pearlygates");

  if (consumable)
    visitUrl(`afterlife.php?action=buydeli&whichitem=${toInt(consumable)}`);
  if (pet) visitUrl(`afterlife.php?action=buyarmory&whichitem=${toInt(pet)}`);

  visitUrl(
    `afterlife.php?action=ascend&confirmascend=1&whichsign=${toMoonId(
      moon
    )}&gender=2&whichclass=${classid}&whichpath=${
      path.id
    }&asctype=${lifestyle}&nopetok=1&noskillsok=1&lamepathok=1&pwd`,
    true
  );
}
