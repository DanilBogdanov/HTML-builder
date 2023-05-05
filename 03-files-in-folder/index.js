const { readdir } = require('fs/promises');
const { stat } = require('fs/promises');
const { stdout } = require('process');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

async function printInfo(file) {
  let ext = path.extname(file.name);
  const fileName = file.name.replace(ext, '');
  ext = ext.replace('.', '');
  const { size } = await stat(path.join(secretFolderPath, file.name));
  stdout.write(`${fileName} - ${ext} - ${size}b\n`);
}

async function readDirectory() {
  const files = await readdir(secretFolderPath, { withFileTypes: true });
  files.forEach((file) => {
    if (!file.isDirectory()) {
      printInfo(file);
    }
  });
}

readDirectory();
