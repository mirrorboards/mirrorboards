#!/usr/bin/env node
import { Command } from 'commander';
import { sortPnpm } from './programs/sort-pnpm';
import { switchManifest } from './programs/switch-manifest';
import { awesome } from './programs/awesome';
import { sortPackageJSON } from './programs/sort-package-json';
import { releasePrepare } from './programs/release-prepare';

const program = new Command();

program
  .addCommand(sortPnpm)
  .addCommand(switchManifest)
  .addCommand(awesome)
  .addCommand(sortPackageJSON)
  .addCommand(releasePrepare);

program.parse(process.argv);
