import {execSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {FileSystem, FolderNode} from '../../utils/FileSystem';
import {CodebaseFlavor, ForeignComponent} from '../Types';

interface SymbolNameAndFilePath {
  SymbolName: string;
  FilePath: string;
}

export class VueCliFlavor extends CodebaseFlavor {
  constructor (directory: string) {
    super(directory);
  }

  initCodebase () {
    // TODO:  add .npmrc
    // TODO:  add .haiku folder & relevant info
    // TODO:  inject relevant info into package.json, incl. deps

    // TODO:  generate index of supposed components
    // May need to perform static analysis on foreign codebase?
    //   get:  name, props,
    // Need to generate an index of files/components, then use that to code-gen
    // an index file for the vue-cli build, a la lib-index.ts in:
    // > vue-cli-service build --target .haiku/host-lib --name hostLib .haiku/lib-index.js

    // create the src/haiku folder
    const src = this.getProjectSrcDir();
    const haikuSrc = path.join(src, 'haiku');
    try {
      fs.mkdirSync(haikuSrc);
    } catch (e) {
      // folder already exists (which is fine; we can skip)
      // OR some deeper fs error (e.g. folder moved or insufficient permissions)
      // Either way, suppressing this error for now.
    }

    const dotHaiku = this.getDotHaikuFolderPath();
    try {
      fs.mkdirSync(dotHaiku);
    } catch (e) {
      // folder already exists (which is fine; we can skip)
    }

    this.sideEffectfullyProcessPackageJson();

  }

  // Injects data into the host codebase's package.json & writes the file to disk
  sideEffectfullyProcessPackageJson () {
    const packageJson = this.getPackageJsonAsObject();
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts['build-lib-for-haiku'] = // TODO: parameterize these paths: (may also need to support TS vs JS)
      'vue-cli-service build --target .haiku/host-lib --name hostLib .haiku/lib-index.js';

    // TODO: could be more careful about being a courteous neighbor, e.g. checking indentation level, or otherwise
    //       only injecting a single line into the package.json instead of
    //       possibly rearranging everything through JSON.stringify
    fs.writeFileSync(path.join(this.directory, 'package.json'), JSON.stringify(packageJson, undefined, '  '), 'utf-8');
  }

  findComponents (): ForeignComponent [] {
    // TODO:  loading = true ; patch into UI

    this.generateIndexFile();
    this.buildLibrary();
    // TODO:  loading = false ; patch into UI

    // load json manifest from generated library code
    return [];
  }

  // Traverse fs, list all files into an index file
  // Note that finding actual components, e.g. multiple per file or
  // ignoring files w/o components, may have to happen by traversing
  // the Module dynamically (after building lib,) since static analysis of an arbitrary codebase will be Hard.
  generateIndexFile () {
    const MATCHING_FILES = /(\.vue|\.js|\.ts)$/;
    const fileTree = FileSystem.walkDirectoryAndMatch(this.getProjectSrcDir(), MATCHING_FILES);
    const fileContents =
      `
      ${this.evalIndexImportsTemplate(fileTree)}

      ${this.evalIndexReturnObjectTemplate(fileTree)}
      `;

    fs.writeFileSync(this.getLibIndexFilePath(), fileContents, 'utf-8');
    // TODO:  write fileContents to @/.haiku/lib.index.js
  }

  evalIndexImportsTemplate (fileTree: FolderNode): string {
    let importStrings: string[] = [];
    // import Color from './views/Color.vue';

    const imports = this.recurseAndReduceToSymbolsAndPaths(fileTree, []);
    importStrings = imports.map((imp) => {
      return `import * as ${imp.SymbolName} from '${imp.FilePath}';`;
    });

    return importStrings.join('\n');
  }

  evalIndexReturnObjectTemplate (fileTree: FolderNode) {
    const imports = this.recurseAndReduceToSymbolsAndPaths(fileTree, []);
    const objectFriendlySymbolDeclarations = imports.map((imp, i) => {
      return imp.SymbolName + ': ' + imp.SymbolName + (i === imports.length - 1 ? '' : ',');
    });
    const retTemplate =
      `
        export default {
          ${objectFriendlySymbolDeclarations.join('\n')}
        }
      `;
    return retTemplate;
  }

  buildLibrary () {
    execSync('yarn build-lib-for-haiku', {cwd: this.directory});
  }

  testCompatibility () {
    const packageJson = this.getPackageJsonAsObject();
    const conditions = [
      // has @vue/cli-service as a devDependency:
      () => packageJson.devDependencies && packageJson.devDependencies['@vue/cli-service'],
    ];

    // If one or more conditions are met, it's a match
    return conditions.reduce((accum, cur) => {
      let current = false;
      // Need to wrap in try/catch to enable brevity in `;conditions`
      try {
        current = cur();
      } catch (e) {
        current = false;
      }
      return accum || current;
    }, false);
  }

  writeHaikuToCodebase (): void {
    const haikuSrc = this.getHaikuSrcDir();
    // TODO:  - find all Haiku Components in the current project
    //          that should be written to the codebase
    //        - generate a Component.js (or .ts) in the src/haiku folder
    throw new Error('not implemented');
  }

  private getProjectSrcDir (): string {
    // assume for all vue-cli projects that src is at @/src
    return path.join(this.directory, 'src');
  }

  private getHaikuSrcDir (): string {
    return path.join(this.getProjectSrcDir(), 'haiku/');
  }

  private getPackageJsonAsObject (): any {
    let ret = {};
    try {
      ret = JSON.parse(fs.readFileSync(path.join(this.directory, 'package.json'), 'utf-8'));
    } catch (e) {
      ret = {};
    }
    return ret;
  }

  private  getLibIndexFilePath (): string {
    return path.join(this.getDotHaikuFolderPath(), 'lib.index.js');
  }

  private getDotHaikuFolderPath (): string {
    return path.join(this.directory, '.haiku');
  }

  // takes an input as a integer (intended to be an array index for imported files)
  // and determinisitically returns a unique, JS-friendly symbol (e.g. `;const mySymbol = 'some value'`)
  private integerToSymbolFriendlyHash (num: number): string {
    // TODO:  support more than 26 unique hashes
    if (num < 0 || num > 25) {
      throw new Error('this hash function needs to be upgraded to support more than 26 unique hashes');
    }
    // american airlines hack
    const NAIVE_HASH = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    ];
    return NAIVE_HASH[num];
  }

  // reduces directory of matched files to a list of symbol name + file path
  private recurseAndReduceToSymbolsAndPaths (node: FolderNode, accum: SymbolNameAndFilePath[] = []) {
    if (node.files && node.files.length) {
      node.files.forEach((file) => {
        const symbolName = this.integerToSymbolFriendlyHash(accum.length);
        accum.push({SymbolName : symbolName, FilePath: file});
      });
      node.folders.forEach((folder) => {
        this.recurseAndReduceToSymbolsAndPaths(folder, accum);
      });
    }
    return accum;
  }
}
