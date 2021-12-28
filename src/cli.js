const path = require('path');
const fs = require('fs');

// 가장 최신 랭킹을 콘솔에 출력합니다

const dataDir = path.join(__dirname + '/../json/');
const sortedFiles = fs.readdirSync(dataDir)
  .filter(file => fs.lstatSync(path.join(dataDir, file)).isFile())
  .map(file => ({ file, mtime: fs.lstatSync(path.join(dataDir, file)).mtime }))
  .sort((a, b) => b.mtime.getTime() - b.mtime.getTime());
const filename = sortedFiles.length > 0 ? sortedFiles[0].file : undefined;

const file = require(dataDir + filename);

console.log(file);