const fs = require('fs/promises');
const path = require('path');

const pathSource = path.join(__dirname, 'files/');
const pathDest = path.join(__dirname, 'files-copy/');

(async function (source, dest= path.join(__dirname, 'files-copy')) {
  try {
    const files = await fs.readdir(source);
    await fs.rm(dest, {recursive: true, force:true});
    await fs.mkdir(dest, { recursive: true });
    for (const file of files) {
      await fs.copyFile(`${source}${file}`, `${dest}${file}`);
    }
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})(pathSource, pathDest);