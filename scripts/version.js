#!/usr/bin/env node

// @ts-check
/* eslint-disable */

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const isCI = require('is-ci');

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json')).toString());
const [level, value] = process.argv.slice(2);

(async function () {
    if (isCI) {
        // dont run it on CI
        return;
    }

    let version = pkg.version.split('.').map(Number);
    if (level === 'major') version[0]++;
    if (level === 'minor') version[1]++;
    if (level === 'patch') version[2]++;
    version = version.join('.');

    if (level === 'set') version = value;

    const { stdout, stderr } = await exec('yarn workspaces list --json -v');

    const lines = `[${stdout.split('\n').filter(Boolean).join(',')}]`;
    const workspaces = JSON.parse(lines);

    for (const index of Object.keys(workspaces)) {
        const workspace = workspaces[index];
        const location = path.resolve(__dirname, '../', workspace.location);
        const subPkgPath = path.resolve(location, 'package.json');
        if (fs.existsSync(subPkgPath)) {
            const subPkg = JSON.parse(fs.readFileSync(subPkgPath).toString());
            subPkg.version = version;
            fs.writeFileSync(subPkgPath, JSON.stringify(subPkg, undefined, 4));
        }
    }
})();
