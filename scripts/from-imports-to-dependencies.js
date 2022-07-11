#!/usr/bin/env node

// @ts-check
/* eslint-disable */

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const isCI = require('is-ci');

const parseImports = (code) => {
    const imports = [];
    const regex = /import\s+([^\s]+)\s+from\s+'([^']+)';/g;
    let match;
    while ((match = regex.exec(code)) !== null) {
        imports.push({
            name: match[1],
            path: match[2]
        });
    }
    return imports;
};

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file))
        }
    })

    return arrayOfFiles
}

(async function () {
    if (isCI) {
        // dont run it on CI
        return;
    }

    console.log('Running from-imports-to-dependencies.js');

    const { stdout, stderr } = await exec('yarn workspaces list --json -v');

    const lines = `[${stdout.split('\n').filter(Boolean).join(',')}]`;
    const workspaces = JSON.parse(lines);

    for (const index in workspaces) {
        const workspace = workspaces[index];
        const location = path.resolve(__dirname, '../', workspace.location);

        const subPkgPath = path.resolve(location, 'package.json');
        // console.log('subPkgPath', subPkgPath)
        if (!fs.existsSync(subPkgPath)) continue;

        const subPkg = JSON.parse(fs.readFileSync(subPkgPath).toString());
        // console.log('path', path.resolve(location, 'src'))
        if (!fs.existsSync(path.resolve(location, 'src'))) continue;

        const srcFiles = getAllFiles(path.resolve(location, 'src'));
        const dependencies = new Set();
        for (const srcFile in srcFiles) {
            const file = fs.readFileSync(srcFiles[srcFile]).toString();
            const imports = parseImports(file);
            for (const imported of imports) {
                if (!imported.path.includes('.')) {
                    dependencies.add(imported.path);
                }
            }
        }

        const foundDependencies = Array.from(dependencies).reduce((acc, depName) => {
            acc[depName] = depName.includes('@usefelps') ? 'workspace:*' : '*';
            return acc;
        }, {});

        // console.log(JSON.stringify(foundDependencies, null, 2))

        subPkg.dependencies = {
            ...foundDependencies,
            ...subPkg.dependencies,
        };

        fs.writeFileSync(subPkgPath, JSON.stringify(subPkg, undefined, 4));
    }
})().catch((err) => {
    console.error(err);
});
