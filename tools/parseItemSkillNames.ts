import { writeFile } from "fs/promises";
import path from "path";
import url from "url";
import nodeFetch from "node-fetch";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const SKILLS_FILE =
  "https://raw.githubusercontent.com/kolmafia/kolmafia/main/src/data/classskills.txt";
const ITEMS_FILE =
  "https://raw.githubusercontent.com/kolmafia/kolmafia/main/src/data/items.txt";

const OVERLAPPING_NAMES_FILE = path.join(
  __dirname,
  "../src/overlappingNames.ts"
);

async function overlappingItems(): Promise<string[]> {
  const response = await nodeFetch(ITEMS_FILE);
  const text = await response.text();
  const lines = text.split("\n");

  const items: string[] = [];
  for (const line of lines) {
    if (!line || line.startsWith("#") || !line.includes("\t")) continue;
    const [_id, name, _descid, _image, use, _access, _autosell, _discard] =
      line.split("\t");
    if (use.includes("combat")) items.push(name);
  }

  return items.filter((name1) =>
    items.some(
      (name2) =>
        name2 !== name1 && name2.toLowerCase().includes(name1.toLowerCase())
    )
  );
}
async function overlappingSkills(): Promise<string[]> {
  const response = await nodeFetch(SKILLS_FILE);
  const text = await response.text();
  const lines = text.split("\n");

  const skills: string[] = [];
  for (const line of lines) {
    if (!line || line.startsWith("#") || !line.includes("\t")) continue;
    const [_id, name, _image, tags, _mpCost] = line.split("\t");
    if (tags.split(",").includes("combat")) skills.push(name);
  }

  return skills.filter((name1) =>
    skills.some(
      (name2) =>
        name2 !== name1 && name2.toLowerCase().includes(name1.toLowerCase())
    )
  );
}

async function main() {
  const items = await overlappingItems();
  const skills = await overlappingSkills();

  let contents = `/** THIS FILE IS AUTOMATICALLY GENERATED. See tools/parseItemSkillNames.ts for more information */\n\n`;

  contents += "export const overlappingItemNames = [\n";
  contents += items.map((item) => `  "${item}",\n`).join("");
  contents += "];\n\n";

  contents += "export const overlappingSkillNames = [\n";
  contents += skills.map((skill) => `  "${skill}",\n`).join("");
  contents += "];\n";

  await writeFile(OVERLAPPING_NAMES_FILE, contents);
}

main();
