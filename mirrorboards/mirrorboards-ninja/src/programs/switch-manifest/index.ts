// import { Command } from "commander";
// import path from "node:path";
// import fs from "node:fs/promises";

// export const switchManifest = new Command()
//   .name("switch-manifest")
//   .description("Switch package.json template")
//   .option("-f, --file", "Path to package.json file", "package.json")
//   .option("-n, --name <template>", "Name of template")
//   .action(async (options) => {
//     const packageJSONPath = path.join(process.cwd(), options.file);

//     console.log("run switcher!");
//     console.log(options.name);

//     try {
//       const data = await fs.readFile(packageJSONPath, "utf8");

//       try {
//         const contentJSON = JSON.parse(data);

//         // magic should be here
//         contentJSON.now = +new Date();

//         await fs.writeFile(packageJSONPath, JSON.stringify(contentJSON, null, 2), "utf-8");
//       } catch (_error) {
//         console.log("Error parsing json");
//       }
//     } catch (err) {
//       console.error("Error processing the file:", err);
//     }
//   });

import { Command } from 'commander';
import path from 'node:path';
import fs from 'node:fs/promises';

export const switchManifest = new Command()
  .name('switch-manifest')
  .description('Switch package.json template')
  .option('-f, --file <path>', 'Path to package.json file', 'package.json')
  .option('-t, --template <name>', 'Name of template')
  .action(async (options) => {
    const packageJSONPath = path.join(process.cwd(), options.file);
    const templateName = options.template;

    if (!templateName) {
      console.error('Template name is required');
      process.exit(1);
    }

    console.log(`Switching to template: ${templateName}`);

    try {
      const data = await fs.readFile(packageJSONPath, 'utf8');

      try {
        const contentJSON = JSON.parse(data);
        const templates = contentJSON.__SWITCH_MANIFEST__;

        if (!templates) {
          console.error('No __SWITCH_MANIFEST__ found in package.json');
          process.exit(1);
        }

        if (!templates[templateName]) {
          console.error(`Template "${templateName}" not found`);
          process.exit(1);
        }

        // Remove all properties from other templates first
        Object.keys(templates).forEach((tmpl) => {
          if (tmpl !== templateName) {
            Object.keys(templates[tmpl]).forEach((key) => {
              delete contentJSON[key];
            });
          }
        });

        // Apply selected template properties
        Object.entries(templates[templateName]).forEach(([key, value]) => {
          contentJSON[key] = value;
        });

        await fs.writeFile(packageJSONPath, JSON.stringify(contentJSON, null, 2) + '\n', 'utf-8');

        console.log(`Successfully switched to "${templateName}" template`);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        process.exit(1);
      }
    } catch (error) {
      console.error('Error processing the file:', error);
      process.exit(1);
    }
  });
