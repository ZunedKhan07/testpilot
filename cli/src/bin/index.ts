#!/usr/bin/env node

import { Command } from "commander";
import { handleInit } from "../commands/init.js";

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

program.parse(process.argv);