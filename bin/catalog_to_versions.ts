#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as glob from 'glob';

interface WorkspaceConfig {
  packages: string[];
  catalog: { [key: string]: string };
}

// Read the pnpm-workspace.yaml file
const workspaceConfig = yaml.load(fs.readFileSync('pnpm-workspace.yaml', 'utf8')) as WorkspaceConfig;

// Function to find package.json files
function findPackageJsonFiles(patterns: string[]): string[] {
  let packageJsonFiles: string[] = [];

  patterns.forEach((pattern) => {
    const matchingFiles = glob.sync(path.join(pattern, '**/package.json'), { ignore: '**/node_modules/**' });
    packageJsonFiles = packageJsonFiles.concat(matchingFiles);
  });

  return packageJsonFiles;
}

// Function to update package.json versions
function updatePackageJsonVersions(filePath: string, catalog: { [key: string]: string }) {
  const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  ['dependencies', 'devDependencies', 'peerDependencies'].forEach((depType) => {
    if (packageJson[depType]) {
      Object.keys(packageJson[depType]).forEach((pkg) => {
        if (catalog[pkg]) {
          packageJson[depType][pkg] = catalog[pkg];
        }
      });
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
}

// Find all package.json files
const packageJsonFiles = findPackageJsonFiles(workspaceConfig.packages);

// Update versions in each package.json file
packageJsonFiles.forEach((file) => {
  console.log(`Updating versions in ${file}`);
  updatePackageJsonVersions(file, workspaceConfig.catalog);
});

console.log('All package.json files have been updated.');
