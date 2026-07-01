import { readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client) {
  const commandsPath = join(__dirname, "../commands");
  const categories = readdirSync(commandsPath).filter(f => statSync(join(commandsPath, f)).isDirectory());
  const slashData = [];

  for (const category of categories) {
    const files = readdirSync(join(commandsPath, category)).filter(f => f.endsWith(".js"));
    for (const file of files) {
      const mod = await import(`../commands/${category}/${file}`);
      const command = mod.default;
      if (command?.name) {
        client.commands.set(command.name, command);
        if (command.data) {
          slashData.push(command.data.toJSON());
        }
      }
    }
  }

  client.slashData = slashData;
  console.log(`[CMD] Loaded ${client.commands.size} commands (${slashData.length} slash)`);
}
