#!/usr/bin/env node

// @ts-check
/* eslint-disable */

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const isCI = require('is-ci');

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../tsconfig.json')).toString());
config.files = [];
config.references = [];

(async function () {
    if (isCI) {
        // dont run it on CI
        return;
    }

    const { stdout, stderr } = await exec('yarn workspaces list --json -v');

    const lines = `[${stdout.split('\n').filter(Boolean).join(',')}]`;
    const workspaces = JSON.parse(lines);

    for (const name in workspaces) {
        const workspace = workspaces[name];
        const location = path.resolve(process.cwd(), workspace.location);
        const tsconfigPath = path.resolve(location, 'tsconfig.json');
        if (fs.existsSync(tsconfigPath)) {
            const reference = { path: workspace.location };
            if (reference.path !== ".") config.references.push(reference);

            const workspaceConfig = JSON.parse(
                fs.readFileSync(tsconfigPath).toString(),
            );
            // workspaceConfig.compilerOptions ||= {};
            // workspaceConfig.compilerOptions.composite = true;
            workspaceConfig.references = [];
            for (const dependency of workspace.workspaceDependencies) {
                const dependecyLocation = path.resolve(
                    process.cwd(),
                    workspaces.find(ws => ws.location === dependency).location,
                );
                if (
                    fs.existsSync(
                        path.resolve(dependecyLocation, 'tsconfig.json'),
                    )
                ) {
                    const reference = {
                        path: path.relative(location, dependecyLocation),
                    };
                    if (reference.path !== ".") workspaceConfig.references.push(reference);
                }
            }
            fs.writeFileSync(
                tsconfigPath,
                JSON.stringify(workspaceConfig, undefined, 4),
            );
        }
    }
    fs.writeFileSync('tsconfig.json', JSON.stringify(config, undefined, 4));
})();
