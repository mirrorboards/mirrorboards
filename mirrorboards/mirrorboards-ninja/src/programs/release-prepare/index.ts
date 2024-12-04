import { Command } from 'commander';
import path from 'node:path';
import fs from 'node:fs/promises';
import { createExportableManifest } from '@pnpm/exportable-manifest';
import { readProjectManifestOnly } from '@pnpm/read-project-manifest';

export const releasePrepare = new Command()
  .name('release-prepare')
  .description('Prepare package.json for publish')
  .option('-f, --file <path>', 'Path to package.json file', 'package.json')
  .action(async (options) => {
    console.log(options);

    const projectDir = path.join(process.cwd());

    const manifest = await readProjectManifestOnly(projectDir);
    const exportable = await createExportableManifest(projectDir, manifest, {
      catalogs: true,
    });

    console.log(exportable);

    // try {
    //   const data = await fs.readFile(packageJSONPath, 'utf8');

    //   try {
    //     const contentJSON = JSON.parse(data);

    //     // Sort the object according to the defined order
    //     const sortedContent = sortObjectByOrder(contentJSON, propertyOrder);

    //     await fs.writeFile(packageJSONPath, JSON.stringify(sortedContent, null, 2) + '\n', 'utf-8');

    //     console.log('Successfully sorted package.json');
    //   } catch (error) {
    //     console.error('Error parsing JSON:', error);
    //     process.exit(1);
    //   }
    // } catch (error) {
    //   console.error('Error processing the file:', error);
    //   process.exit(1);
    // }
  });
