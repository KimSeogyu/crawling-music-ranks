import path from 'path';
import fs from 'fs';

import { getVibes } from './vibe';
import { getGenie } from './genie';
import { getMelon } from './melon';

export async function crawlingTracks() {
  const timeStart = Date.now();
  const [vibe, genie, melon] = await Promise.all([
    getVibes(),
    getGenie(),
    getMelon(),
  ]);

  console.log((Date.now() - timeStart) * 0.001);
  saveFileToJson({
    vibe,
    genie,
    melon,
  });
}

// JSON file 저장
const saveFileToJson = (data: Object) => {
  const jsonDirname = path.join(__dirname + '../../../json');
  if (!fs.existsSync(jsonDirname)) {
    fs.mkdirSync(jsonDirname, { recursive: true });
  }
  fs.writeFileSync(path.join(jsonDirname, `${(new Date()).toJSON()}.json`), JSON.stringify(data));
};
