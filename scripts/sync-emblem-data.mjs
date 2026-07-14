#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = path.join(root, 'public', 'data', 'emblems.json');
const imageDirectory = path.join(root, 'public', 'emblems');
const packagePath = path.join(root, 'package.json');

const legacyEmblems = {
  'Insula Thesauria': '07cc1a29fdc7eeef244dfffec8bff3a7.jpg',
  'Lone Focus, Jagged Edge': 'f98a8dc10ec457ac90dcc84a3d80fe6b.jpg',
  'Flames of Forgotten Truth': '5d61d9b03c9d521d7751ddf80a186f85.jpg',
  'Illusion of Light': '9b0ff3d80b061515b69c2f842375295d.jpg',
  'Ab Aeterno': 'f5e813625abebd6df48838e30bf8382e.jpg',
  'Field of Light': '95f5895fb4587a3a7e881d6407446f4e.jpg',
  'The Reflective Proof': '8bc8cf5467593e9d6521d2f0a03f3768.jpg',
  'The Unimagined Plane': 'ee9d2fe8b039751ad3d9e48c7f476dc2.jpg',
  'Sign of the Finite': 'ed0cf68e6647596480e853a9f199c124.jpg',
  'Note of Conquest': 'e3535465a6aa597fdb74c9d73459cebd.jpg',
  'Binding Focus': '2df04b3bb473ec39efa4a2042fe99b7f.jpg',
};

const database = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const packageMetadata = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const cachedFiles = new Set(fs.readdirSync(imageDirectory));

database.legacyEmblems = Object.fromEntries(
  Object.entries(legacyEmblems).map(([name, filename]) => [
    name,
    {
      icon: `https://destinyemblemcollector.b-cdn.net/destiny1/${filename}`,
      note: 'Destiny 1 promotional emblem',
    },
  ])
);

let localImageCount = 0;
for (const emblem of Object.values(database.emblems)) {
  const filename = path.basename(emblem.icon || '');
  if (filename && cachedFiles.has(filename)) {
    emblem.localIcon = `/emblems/${filename}`;
    localImageCount += 1;
  } else {
    delete emblem.localIcon;
  }
}

const unresolvedCodes = Object.entries(database.codeToEmblem).filter(
  ([, name]) => !database.emblems[name] && !database.legacyEmblems[name]
);

if (unresolvedCodes.length > 0) {
  const details = unresolvedCodes.map(([code, name]) => `${code}: ${name}`).join(', ');
  throw new Error(`Catalogue entries without reward metadata: ${details}`);
}

database.version = packageMetadata.version;
database.lastUpdated = new Date().toISOString().slice(0, 10);
database.localCache = localImageCount > 0;

fs.writeFileSync(dataPath, JSON.stringify(database));

console.log(
  `Synced ${Object.keys(database.codeToEmblem).length} codes, ` +
    `${Object.keys(database.legacyEmblems).length} Destiny 1 icons, and ` +
    `${localImageCount} local images.`
);
