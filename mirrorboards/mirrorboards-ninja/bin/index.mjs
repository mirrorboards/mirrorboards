#!/usr/bin/env node

import path from "path";

import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = fileURLToPath(import.meta.url);
const tsFile = path.resolve(__dirname, "..", "..", "src", "index.ts");

const result = spawnSync("tsx", [tsFile, ...process.argv.slice(2)], { stdio: "inherit" });

process.exit(result.status);
