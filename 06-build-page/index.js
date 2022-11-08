const fs = require('fs/promises');
const path = require('path');

const options = {
  pathStyles: 'styles/',
  pathDist: 'project-dist/',
  pathAssets: 'assets',
  pathFonts: 'assets/fonts/',
  pathImg: 'assets/img/',
  pathSvg: 'assets/svg/',
  pathComp: 'components/',
  destStyle: 'style.css',
  htmlFile: 'template.html',
};

(async function (opt) {
  try {
    await fs.rm(path.join(__dirname, opt.pathDist), {recursive: true, force: true});

    await createDir(path.join(__dirname, opt.pathDist));
    await createDir(path.join(__dirname, opt.pathDist, opt.pathAssets));
    await createDir(path.join(__dirname, opt.pathDist, opt.pathFonts));
    await createDir(path.join(__dirname, opt.pathDist, opt.pathImg));
    await createDir(path.join(__dirname, opt.pathDist, opt.pathSvg));

    await copyDir(path.join(__dirname, opt.pathFonts), path.join(__dirname, opt.pathDist, opt.pathFonts));
    await copyDir(path.join(__dirname, opt.pathImg), path.join(__dirname, opt.pathDist, opt.pathImg));
    await copyDir(path.join(__dirname, opt.pathSvg), path.join(__dirname, opt.pathDist, opt.pathSvg));

    await cssBuild(opt);
    await htmlBuild(opt);

  } catch (e) {
    console.error('there was an error:', e.message);
  }

  async function htmlBuild(opt) {
    try {
      let template = await fs.readFile(`${__dirname}/${opt.htmlFile}`, {encoding: 'utf8'});
      let components = {};

      let regexp = /{{[a-z]+}}/g;
      let matchAll = template.matchAll(regexp);

      for (const match of matchAll) {
        const componentName = match[0].slice(2).slice(0,-2);
        const componentTemplate = await fs.readFile(`${path.join(__dirname, opt.pathComp)}${componentName}.html`, {encoding: 'utf8'});
        components[componentName] = componentTemplate;
      }

      for (let key in components) {
        template = template.replace(`{{${key}}}`, components[key]);
      }

      await fs.writeFile(`${path.join(__dirname, opt.pathDist)}index.html`, template);

    } catch (e) {
      console.error('there was an error:', e.message);
    }
  }

  async function cssBuild(opt) {
    let buffer = '';
    try {
      const files = await fs.readdir(path.join(__dirname, opt.pathStyles), {withFileTypes: true});
      for (const file of files) {
        if (!file.isDirectory()) {
          if (path.parse(file.name).ext === '.css') {
            const contents = await fs.readFile(`${path.join(__dirname, opt.pathStyles)}${file.name}`, {encoding: 'utf8'});
            buffer += contents.trim();
          }
        }
      }
      await fs.writeFile(`${path.join(__dirname, opt.pathDist)}${opt.destStyle}`, buffer);
    } catch (e) {
      console.error('there was an error:', e.message);
    }
  }

  async function createDir(path) {
    try {
      await fs.mkdir(path, {recursive: true});
    } catch (e) {
      console.error('there was an error:', e.message);
    }
  }

  async function copyDir(source, dist) {
    try {
      const files = await fs.readdir(source);
      for (const file of files) {
        await fs.copyFile(`${source}${file}`, `${dist}${file}`);
      }
    } catch (e) {
      console.error('there was an error:', e.message);
    }
  }

})(options);


// let buf;
//
// (async function (source, dest,file) {
//   try {
//     const files = await fs.readdir(source, {withFileTypes: true});
//     for (const file of files) {
//       if (!file.isDirectory()) {
//         if (path.parse(file.name).ext ==='.css') {
//           const contents = await fs.readFile(`${source}${file.name}`, { encoding: 'utf8' });
//           buf+=contents;
//         }
//       }
//     }
//     await fs.writeFile(`${dest}${file}`, buf);
//   } catch (error) {
//     console.error('there was an error:', error.message);
//   }
// })(pathSource, pathDest, destFile);