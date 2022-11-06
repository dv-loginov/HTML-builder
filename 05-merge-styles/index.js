const fs = require('fs/promises');
const path = require('path');

const pathSource = path.join(__dirname, 'styles/');
const pathDest = path.join(__dirname, 'project-dist/');
const destFile = 'bundle.css';
let buf;

(async function (source, dest,file) {
  try {
    const files = await fs.readdir(source, {withFileTypes: true});
    for (const file of files) {
      if (!file.isDirectory()) {
        if (path.parse(file.name).ext ==='.css') {
          const contents = await fs.readFile(`${source}${file.name}`, { encoding: 'utf8' });
          buf+=contents;
        }
      }
    }
    await fs.writeFile(`${dest}${file}`, buf);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})(pathSource, pathDest, destFile);