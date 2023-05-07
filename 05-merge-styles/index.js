const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const stylesSrcPath = path.join(__dirname, 'styles');
const styleDestPath = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundleCss(src, dest) {
  const writeableStream = fs.createWriteStream(dest);
  const files = await readdir(src, { withFileTypes: true });

  files.forEach((file) => {
    if (!file.isDirectory() && path.extname(file.name) === '.css') {
      const srcFilePath = path.join(src, file.name);
      const readStream = fs.createReadStream(srcFilePath);
      readStream.pipe(writeableStream);
    }
  });
}

bundleCss(stylesSrcPath, styleDestPath);
