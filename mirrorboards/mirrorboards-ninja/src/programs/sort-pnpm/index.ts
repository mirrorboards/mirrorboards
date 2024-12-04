import { Command } from 'commander';
import path from 'node:path';
import fs from 'node:fs/promises';
import yaml from 'yaml';
import { sortPackages } from './utils/sort-packages';

export const sortPnpm = new Command()
  .name('sort-pnpm')
  .description('Sort pnpm-workspace.yaml')
  .option('-f, --file', 'Path to file', 'pnpm-workspace.yaml')
  .action(async (options) => {
    const workspace = path.join(process.cwd(), options.file);

    try {
      const data = await fs.readFile(workspace, 'utf8');
      const parsed = yaml.parse(data);

      const sorted = sortPackages(parsed);

      await fs.writeFile(workspace, yaml.stringify(sorted), 'utf-8');
    } catch (err) {
      console.error('Error processing the file:', err);
    }
  });
