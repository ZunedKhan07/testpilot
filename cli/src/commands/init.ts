import * as p from "@clack/prompts";
import pc from "picocolors";
import { configExists, saveConfig } from "../utils/config.js";

export const handleInit = async () => {
  p.intro(pc.bgCyan(pc.black(" TestPilot CLI Initialization ")));

  if (configExists()) {
    const shouldOverwrite = await p.confirm({
      message: "A testpilot.config.json already exists. Do you want to overwrite it?",
      initialValue: false,
    });

    if (p.isCancel(shouldOverwrite) || !shouldOverwrite) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }
  }

  const group = await p.group(
    {
      serverUrl: () =>
        p.text({
          message: "Enter TestPilot Backend Server URL:",
          placeholder: "http://localhost:5000",
          initialValue: "http://localhost:5000",
          validate(value) {
            if (!value.startsWith("http://") && !value.startsWith("https://")) {
              return "URL must start with http:// or https://";
            }
          },
        }),
      geminiApiKey: () =>
        p.password({
          message: "Enter your Gemini API Key (leave empty to prompt later):",
          mask: "*",
        }),
      autoFixOnStart: () =>
        p.confirm({
          message: "Enable Auto-Fix prompt on server startup (e.g. npm run dev)?",
          initialValue: true,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Setup cancelled.");
        process.exit(0);
      },
    }
  );

  const spinner = p.spinner();
  spinner.start("Saving TestPilot local configuration...");

  saveConfig({
    serverUrl: group.serverUrl,
    geminiApiKey: group.geminiApiKey || "",
    autoFixOnStart: group.autoFixOnStart,
    createdAt: new Date().toISOString(),
  });

  spinner.stop("Configuration saved successfully!");

  p.note(
    `File created: ${pc.green("testpilot.config.json")}\nNext step: Run ${pc.cyan("npx testpilot run")} to scan project.`,
    "Setup Complete"
  );

  p.outro(pc.green("TestPilot is ready for this project! 🚀"));
};