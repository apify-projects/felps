#!/usr/bin/env node

// @ts-check
/* eslint-disable */

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const isCI = require('is-ci');
const { default: parseImports } = require('parse-imports');


function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
        }
    })

    return arrayOfFiles
}

(async function () {
    if (isCI) {
        // dont run it on CI
        return;
    }

    const { stdout, stderr } = await exec('yarn workspaces list --json -v');

    const lines = `[${stdout.split('\n').filter(Boolean).join(',')}]`;
    const workspaces = JSON.parse(lines);

    for (const index in workspaces) {
        const workspace = workspaces[index];
        const location = path.resolve(__dirname, '../', workspace.location);

        const subPkgPath = path.resolve(location, 'package.json');
        if (fs.existsSync(subPkgPath)) {
            const subPkg = JSON.parse(fs.readFileSync(subPkgPath).toString());
            const srcFiles = getAllFiles(path.resolve(location, 'src'));
            const dependencies = new Set();
            for (const srcFile in srcFiles) {
                const file = fs.readFileSync(srcFiles[srcFile]).toString();
                const imports = await parseImports(file);
                for (const imported of imports) {
                    if (imported.moduleSpecifier.type === 'package') {
                        dependencies.add(imported.moduleSpecifier.value);
                    }
                }
            }

            subPkg.dependencies = {
                ...subPkg.dependencies,
                ...Array.from(dependencies).reduce((acc, depName) => {
                    acc[depName] = depName.includes('@usefelps') ? 'workspace:*' : '*';
                    return acc;
                }, {})
            };

            fs.writeFileSync(subPkgPath, JSON.stringify(subPkg, undefined, 4));
        }
    }
})();
