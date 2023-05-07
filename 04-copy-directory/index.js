const path = require('path');
const { mkdir } = require('fs/promises');
const { rm } = require('fs/promises');
const { readdir } = require('fs/promises');
const { copyFile } = require('fs/promises');

const filesPath = path.join(__dirname, 'files');
const destPath = `${filesPath}-copy`;

async function copyDir(src, dest) {
  await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true });
  const files = await readdir(src, { withFileTypes: true });

  files.forEach((file) => {
    const filePath = path.join(src, file.name);
    const destFilePath = path.join(dest, file.name);
    if (file.isDirectory()) {
      copyDir(filePath, destFilePath);
    } else {
      copyFile(filePath, destFilePath);
    }
  });
}

copyDir(filesPath, destPath);
