const fs = require('fs/promises');
const path = require('path');

const dir = path.join(__dirname, 'secret-folder/');

(async function (dir) {
  try {
    const files = await fs.readdir(dir, {withFileTypes: true});
    for (const file of files) {
      if (!file.isDirectory()) {
        const stat = await fs.stat(dir + file.name);
        console.log(`${path.parse(file.name).name}\t - ${path.parse(file.name).ext.slice(1)}\t - ${stat.size}`);
      }
    }
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})(dir);


