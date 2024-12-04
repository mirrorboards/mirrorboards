import { Command } from 'commander';
import path from 'path';
import fs from 'fs/promises';
import { glob } from 'glob';
import { Awesome, template } from './utils/template';

export const awesome = new Command()
  .name('awesome')
  .description('Build awesome list')
  .option('-s, --src <path>', 'Path to source directory')
  .option('-d, --dist <path>', 'Path to output directory')
  .action(async (options) => {
    const files = await glob(path.resolve(options.src, '**', 'awesome.md'), {
      absolute: true,
    });

    const awesomes: Awesome[] = [];

    for await (const awesome of files) {
      awesomes.push({
        absolute: awesome,
        relative: path.relative(options.src, awesome),
        content: await fs.readFile(awesome, 'utf-8'),
      });
    }

    await template.save(awesomes, {
      dest: path.join(options.dist, 'README.md'),
      parser: 'markdown',
    });
  });
