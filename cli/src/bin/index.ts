#!/usr/bin/env node

import "dotenv/config";
import { Command } from "commander";
import { handleInit } from "../commands/init.js";
import { handleScan } from "../commands/scan.js";

const program = new Command();

program
  .name("testpilot")
  .description("AI-driven QA Automation & Auto-Fixing Engine CLI")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize TestPilot in the current project directory")
  .action(async () => {
    await handleInit();
  });

program
  .command("scan")
  .description("Scan local Git workspace for changed files before dev server startup")
  .action(async () => {
    await handleScan();
  });

program.parse(process.argv);