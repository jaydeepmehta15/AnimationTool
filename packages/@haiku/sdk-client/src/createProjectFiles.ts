
import * as dedent from 'dedent';
import * as fse from 'fs-extra';
import * as path from 'path';

const logger = console;

import {
    fetchProjectConfigInfo,
    getAuthorNameOrFallback,
    getCopyrightNotice,
    getHaikuCoreVersion,
    getOrganizationNameOrFallback,
    getProjectNameLowerCase,
    getProjectNameSafeShort,
    getReactProjectName,
    getStandaloneName,
} from './ProjectDefinitions';

export function createProjectFiles (
  projectPath: string,
  projectName: string,
  projectOptions: {organizationName: string,
    authorName: string,
    skipContentCreation: boolean},
  finish: any,
) {
  try {
    logger.info('[project folder] building project content', projectPath);

    const projectNameSafe = getProjectNameSafeShort(projectPath, projectName);
    const projectNameLowerCase = getProjectNameLowerCase(projectPath, projectName);
    const reactProjectName = getReactProjectName(projectPath, projectName);

    const organizationName = getOrganizationNameOrFallback(projectOptions.organizationName);
    const organizationNameLowerCase = organizationName.toLowerCase();

    const authorName = getAuthorNameOrFallback(projectOptions.authorName);

    const haikuCoreVersion = getHaikuCoreVersion(); // This json object should be loaded at the top
    const npmPackageName = `@haiku/${organizationNameLowerCase}-${projectNameLowerCase}`;
    const copyrightNotice = getCopyrightNotice(organizationName);

    console.log('Reading old package.json..');
    const packageJson = fse.readJsonSync(path.join(projectPath, 'package.json'), {throws: false});

    return fetchProjectConfigInfo(projectPath, (err: any, userconfig: any) => {
      if (err) {
        console.log('cannot fetch project config info');
        throw err;
      }

      if (!packageJson) {
        fse.outputFileSync(path.join(projectPath, 'package.json'), dedent`
            {
              "name": "${npmPackageName}",
              "version": "${userconfig.version}",
              "haiku": ${JSON.stringify(userconfig, null, 2)},
              "authors": [
                "${authorName}",
                "Haiku <contact@haiku.ai>"
              ],
              "license": "LicenseRef-LICENSE",
              "main": "index.js",
              "dependencies": {
                "@haiku/core": "${haikuCoreVersion}"
              }
            }
          `);
      } else {
        packageJson.haiku = userconfig;

        packageJson.name = npmPackageName;

        if (!packageJson.dependencies) {
          packageJson.dependencies = {};
        }

        if (packageJson.dependencies['@haiku/player']) {
          delete packageJson.dependencies['@haiku/player'];
        }

          // TODO: Handle this step more gracefully when we are increasing by a major version.
        packageJson.dependencies['@haiku/core'] = `^${haikuCoreVersion}`;

          // #LEGACY: some old Haiku in the wild have an engines entry, which causes issues with yarn.
        delete packageJson.engines;

          // Write the file assuming we may have made a change in any of the conditions above
        fse.writeJsonSync(path.join(projectPath, 'package.json'), packageJson, {spaces: 2});
      }

        // This option is used when we initially set up a project before we've attempted to clone content that
        // may or may not exist on the remote. Since this case involves copying into a temp folder and then back
        // on top of the cloned content, we don't want to create anything that might inadvertently overwrite stuff.
      if (projectOptions.skipContentCreation) {
        logger.info('[project folder] skipping content creation (II)');
        return finish();
      }

      logger.info('[project folder] creating folders');

      fse.mkdirpSync(path.join(projectPath, '.haiku'));
      fse.mkdirpSync(path.join(projectPath, 'designs'));
      fse.mkdirpSync(path.join(projectPath, 'code/main'));
      fse.mkdirpSync(path.join(projectPath, 'public'));

      logger.info('[project folder] moving/updating legacy files');

        // Do a bunch of fix-ups that modify the folder content from legacy naming and folder structure.
        // We need to change this subroutine any time we make a change to the project content structure
      const filesToMove = {
          // Core code files
        'bytecode.js': 'code/main/code.js',

          // --
          // TODO: Switch the bundle code files to these paths, once we're ready to make the equivalent
          // switch inside sumi-e, inkstone, share-page, and wherever else.
          // ALSO SEE BELOW, where paths need to be changed as well
          // 'index.embed.js': 'public/dom-embed.bundle.js',
          // 'index.standalone.js': 'public/dom-standalone.bundle.js'
          // --
      };
      for (const formerFilePath in filesToMove) {
        const nextFilePath = filesToMove[formerFilePath];
        if (fse.existsSync(path.join(projectPath, formerFilePath))) {
            // I guess there is no 'moveSync', and 'copySync' acts weird, so here it is imperatively:
          const contentsToCopy = fse.readFileSync(path.join(projectPath, formerFilePath)).toString();
          fse.outputFileSync(path.join(projectPath, nextFilePath), contentsToCopy);
          fse.removeSync(path.join(projectPath, formerFilePath));
        }
      }

      logger.info('[project folder] removing unneeded files');

      const filesToRemove = [
        'index.embed.html',
        'index.standalone.html',
        'interpreter.js',
        'embed.js',
        'react-dom.js',
        'vue-dom.js',
      ];
      filesToRemove.forEach((fileToRemove) => {
        fse.removeSync(path.join(projectPath, fileToRemove));
      });

      logger.info('[project folder] creating files');

        // Other user data may have been written these, so don't overwrite if they're already present
      if (!fse.existsSync(path.join(projectPath, '.haiku/comments.json'))) {
        fse.outputFileSync(path.join(projectPath, '.haiku/comments.json'), dedent`
            []
          `);
      }

      fse.outputFileSync(path.join(projectPath, 'README.md'), dedent`
          # ${projectNameSafe}

          This project was created with [Haiku](https://haiku.ai).

          ## Install

          \`\`\`
          $ haiku install ${projectNameSafe}
          \`\`\`

          ## Usage

          \`\`\`
          var ${projectNameSafe} = require('${npmPackageName}')
          \`\`\`

          ## Copyright

          Please refer to LICENSE.txt.
        `);

      fse.outputFileSync(path.join(projectPath, 'LICENSE.txt'), dedent`
          ${copyrightNotice}
        `);

      const standaloneName = getStandaloneName(organizationName, projectPath, projectName);

        // But a bunch of ancillary files we take full control of and overwrite despite what the user did
      fse.outputFileSync(path.join(projectPath, 'index.js'), dedent`
          // By default, a DOM module is exported; see code/main/* for other options
          module.exports = require('./code/main/dom')
        `);
      fse.outputFileSync(path.join(projectPath, 'react.js'), dedent`
          // By default, a react-dom module is exported; see code/main/* for other options
          module.exports = require('./code/main/react-dom')
        `);
      fse.outputFileSync(path.join(projectPath, 'angular-module.js'), dedent`
          // By default, a Angular module is exported; see code/main/* for other options
          module.exports = {
            default: require('./code/main/angular-dom')
          }
        `);
      fse.outputFileSync(path.join(projectPath, 'vue.js'), dedent`
          // By default, a vue-dom module is exported; see code/main/* for other options
          module.exports = require('./code/main/vue-dom')
        `);
      fse.outputFileSync(path.join(projectPath, 'react-bare.js'), dedent`
          // This only exports a React module into which a Haiku Core must be passed
          var React = require('react') // Installed as a peer dependency of '@haiku/core'
          var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/core'
          var HaikuReactAdapter = require('@haiku/core/dom/react')
          var ${reactProjectName}_Bare = HaikuReactAdapter(null, require('./code/main/code'))
          if (${reactProjectName}_Bare.default) ${reactProjectName}_Bare = ${reactProjectName}_Bare.default
          module.exports = ${reactProjectName}_Bare
        `);

      fse.outputFileSync(path.join(projectPath, 'preview.html'), dedent`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${projectNameSafe} | Preview | Haiku</title>
            <style>
              .container { margin: 0 auto; width: 100%; }
              #mount { width: 100%; margin: 0 auto; }
              body { margin: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div id="mount"></div>
            </div>
            <script src="./index.standalone.js"></script>
            <script>
              ${standaloneName}(document.getElementById('mount'), {
                sizing: 'contain',
                loop: true
              })
            </script>
          </body>
          </html>
        `);

        // Should we try to merge these if the user made any changes?
      fse.outputFileSync(path.join(projectPath, '.gitignore'), dedent`
          .DS_Store
          *.log
          *.*.log
          node_modules
          bower_components
          jspm_modules
          coverage
          build
          dist
          .env
        `);
      fse.outputFileSync(path.join(projectPath, '.npmignore'), dedent`
          .DS_Store
          .git
          .svn
          *.log
          *.*.log
          *.ai
          *.sketch
          *.svg
          .env
          .haiku
        `);
      fse.outputFileSync(path.join(projectPath, '.yarnignore'), dedent`
          .DS_Store
          .git
          .svn
          *.log
          *.*.log
          *.ai
          *.sketch
          *.svg
          .env
          .haiku
        `);
      fse.outputFileSync(path.join(projectPath, '.npmrc'), dedent`
          registry=https://registry.npmjs.org/
          @haiku:registry=https://reservoir.haiku.ai:8910/
        `);
      fse.outputFileSync(path.join(projectPath, '.yarnrc'), dedent`
          registry "https://registry.npmjs.org/"
          "@haiku:registry" "https://reservoir.haiku.ai:8910/"
        `);

      // Let the user skip this heavy step optionally, e.g. when just initializing the project the first time
      logger.info('[project folder] create Project Files finished');
      return finish();
    });
  } catch (exception) {
    logger.error('[project folder] ' + exception);
    return finish(exception);
  }
}
