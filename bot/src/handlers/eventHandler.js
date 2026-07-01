import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadEvents(client) {
  const eventsPath = join(__dirname, "../events");
  const files = readdirSync(eventsPath).filter(f => f.endsWith(".js"));

  for (const file of files) {
    const mod = await import(`../events/${file}`);
    const event = mod.default;
    if (event?.name) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  }
  console.log(`[EVT] Loaded ${files.length} events`);
}
