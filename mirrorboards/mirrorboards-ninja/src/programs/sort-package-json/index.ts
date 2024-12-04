import { Command } from 'commander';
import path from 'node:path';
import fs from 'node:fs/promises';

// Define the order of properties in package.json
const propertyOrder = [
  // Metadata
  'name',
  'version',
  'description',
  'author',
  'repository',
  'license',
  'private',
  'type',
  // Build metadata
  'main',
  'module',
  'types',
  'exports',
  'src',
  // Template definition
  '__SWITCH_MANIFEST__',
  // Scripts and dependencies
  'scripts',
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

function sortObjectByOrder(obj: Record<string, any>, order: string[]): Record<string, any> {
  // Create ordered object with defined properties
  const orderedObject = order.reduce(
    (acc, key) => {
      if (obj.hasOwnProperty(key)) {
        acc[key] = obj[key];
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  // Add any remaining properties that weren't in the order array
  Object.keys(obj).forEach((key) => {
    if (!orderedObject.hasOwnProperty(key)) {
      orderedObject[key] = obj[key];
    }
  });

  return orderedObject;
}

export const sortPackageJSON = new Command()
  .name('sort-package-json')
  .description('Sort package.json properties in a standardized order')
  .option('-f, --file <path>', 'Path to package.json file', 'package.json')
  .action(async (options) => {
    const packageJSONPath = path.join(process.cwd(), options.file);

    try {
      const data = await fs.readFile(packageJSONPath, 'utf8');

      try {
        const contentJSON = JSON.parse(data);

        // Sort the object according to the defined order
        const sortedContent = sortObjectByOrder(contentJSON, propertyOrder);

        await fs.writeFile(packageJSONPath, JSON.stringify(sortedContent, null, 2) + '\n', 'utf-8');

        console.log('Successfully sorted package.json');
      } catch (error) {
        console.error('Error parsing JSON:', error);
        process.exit(1);
      }
    } catch (error) {
      console.error('Error processing the file:', error);
      process.exit(1);
    }
  });
