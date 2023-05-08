const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');
const { rm } = require('fs/promises');
const { mkdir } = require('fs/promises');
const { copyFile } = require('fs/promises');
const { readFile } = require('fs/promises');

async function bundleHtml(src, dest) {
  const componentsPath = path.join(__dirname, 'components');
  let html = await readFile(src, { encoding: 'utf-8' });
  const components = {};
  const promises = [];

  const loadComponents = async () => {
    const files = await readdir(componentsPath, { withFileTypes: true });
    files.forEach((file) => {
      if (!file.isDirectory() && path.extname(file.name) === '.html') {
        const compPath = path.join(componentsPath, file.name);
        const promise = readFile(compPath, { encoding: 'utf-8' });
        promises.push(promise);
        promise.then((data) => {
          components[file.name.replace('.html', '')] = data;
        });
      }
    });
  };

  await loadComponents();
  await Promise.all(promises);

  const exp = /{{(.+)}}/g;
  let res = exp.exec(html);

  while (res) {
    const compName = res[1];
    const compElem = res[0];
    const comp = components[compName];
    html = html.replace(compElem, comp);
    res = exp.exec(html);
  }

  const writeableStream = fs.createWriteStream(dest);
  writeableStream.write(html);
}

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

async function buildPage() {
  const projectDirPath = path.join(__dirname, 'project-dist');
  await rm(projectDirPath, { recursive: true, force: true });
  await mkdir(projectDirPath, { recursive: true });
  const stylesSrcPath = path.join(__dirname, 'styles');
  const styleDestPath = path.join(projectDirPath, 'style.css');
  const assetsPath = path.join(__dirname, 'assets');
  const assetsDestPath = path.join(projectDirPath, 'assets');
  const srcHtmlPath = path.join(__dirname, 'template.html');
  const destHtmlPath = path.join(projectDirPath, 'index.html');

  bundleHtml(srcHtmlPath, destHtmlPath);
  bundleCss(stylesSrcPath, styleDestPath);
  copyDir(assetsPath, assetsDestPath);
}

buildPage();
