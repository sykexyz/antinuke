import { Router } from "express";

const router = Router();

const ALL_COMMANDS = [
  // Anti-Nuke
  { name: "antinuke", description: "Configure the anti-nuke protection system", usage: "!antinuke <enable|disable|status|threshold>", category: "antinuke", ownerOnly: true, aliases: ["an"], cooldown: 5 },
  { name: "bypass", description: "Manage bypass roles for the anti-nuke system", usage: "!bypass <add|remove|list> [@role]", category: "antinuke", ownerOnly: true, aliases: [], cooldown: 5 },
  { name: "trustedbot", description: "Add or remove a trusted bot from anti-nuke whitelist", usage: "!trustedbot <add|remove> <bot_id>", category: "antinuke", ownerOnly: true, aliases: [], cooldown: 5 },
  { name: "lockdown", description: "Emergency lock/unlock all channels instantly", usage: "!lockdown [unlock]", category: "antinuke", ownerOnly: true, aliases: ["lock"], cooldown: 10 },
  // Moderation
  { name: "ban", description: "Ban a member from the server with reason logging", usage: "!ban @user [reason]", category: "moderation", ownerOnly: true, aliases: [], cooldown: 5 },
  { name: "kick", description: "Kick a member from the server", usage: "!kick @user [reason]", category: "moderation", ownerOnly: true, aliases: [], cooldown: 5 },
  { name: "mute", description: "Timeout (mute) a member for a set duration", usage: "!mute @user <minutes> [reason]", category: "moderation", ownerOnly: true, aliases: ["timeout"], cooldown: 5 },
  { name: "unmute", description: "Remove timeout from a member", usage: "!unmute @user", category: "moderation", ownerOnly: true, aliases: [], cooldown: 5 },
  { name: "warn", description: "Warn a member — auto-punishes at 3 and 5 warns", usage: "!warn @user [reason]", category: "moderation", ownerOnly: true, aliases: [], cooldown: 3 },
  { name: "purge", description: "Delete bulk messages from the channel (max 100)", usage: "!purge <amount> [@user]", category: "moderation", ownerOnly: true, aliases: ["clear"], cooldown: 5 },
  { name: "slowmode", description: "Set slowmode for the current channel", usage: "!slowmode <seconds>", category: "moderation", ownerOnly: true, aliases: ["slow"], cooldown: 5 },
  { name: "history", description: "View moderation case history for a user", usage: "!history @user", category: "moderation", ownerOnly: true, aliases: ["cases"], cooldown: 5 },
  { name: "tempban", description: "Temporarily ban a user for a set duration", usage: "!tempban @user <hours> [reason]", category: "moderation", ownerOnly: true, aliases: [], cooldown: 5 },
  // Welcome
  { name: "welcomeset", description: "Set the welcome channel and message", usage: "!welcomeset #channel [message]", category: "welcome", ownerOnly: true, aliases: ["setwelcome"], cooldown: 5 },
  // Utility
  { name: "ping", description: "Check bot latency and API response time", usage: "!ping", category: "utility", ownerOnly: false, aliases: ["latency"], cooldown: 3 },
  { name: "serverinfo", description: "View detailed information about this server", usage: "!serverinfo", category: "utility", ownerOnly: false, aliases: ["si"], cooldown: 5 },
  { name: "userinfo", description: "View information about a user", usage: "!userinfo [@user]", category: "utility", ownerOnly: false, aliases: ["ui", "whois"], cooldown: 5 },
  { name: "avatar", description: "View a user's avatar in full resolution", usage: "!avatar [@user]", category: "utility", ownerOnly: false, aliases: ["av", "pfp"], cooldown: 3 },
  { name: "snipe", description: "See the last deleted message in this channel", usage: "!snipe", category: "utility", ownerOnly: false, aliases: [], cooldown: 5 },
  { name: "editsnipe", description: "See the last edited message in this channel", usage: "!editsnipe", category: "utility", ownerOnly: false, aliases: [], cooldown: 5 },
  { name: "help", description: "View all commands with paginated categories", usage: "!help [command|category]", category: "utility", ownerOnly: false, aliases: ["h", "commands"], cooldown: 5 },
  { name: "afk", description: "Set an AFK status — auto-removed when you send a message", usage: "!afk [reason]", category: "utility", ownerOnly: false, aliases: [], cooldown: 10 },
  { name: "remind", description: "Set a reminder that the bot will DM you", usage: "!remind <time> <message>", category: "utility", ownerOnly: false, aliases: [], cooldown: 5 },
  { name: "calculator", description: "Calculate a math expression", usage: "!calc <expression>", category: "utility", ownerOnly: false, aliases: ["calc", "math"], cooldown: 3 },
  { name: "translate", description: "Translate text to another language", usage: "!translate <lang> <text>", category: "utility", ownerOnly: false, aliases: ["tr"], cooldown: 5 },
  { name: "color", description: "Display info about a hex color code", usage: "!color #hexcode", category: "utility", ownerOnly: false, aliases: [], cooldown: 3 },
  { name: "weather", description: "Check the weather for a location", usage: "!weather <city>", category: "utility", ownerOnly: false, aliases: [], cooldown: 10 },
  // Fun
  { name: "8ball", description: "Ask the magic 8ball a yes/no question", usage: "!8ball <question>", category: "fun", ownerOnly: false, aliases: ["eightball"], cooldown: 3 },
  { name: "coinflip", description: "Flip a coin — heads or tails", usage: "!coinflip", category: "fun", ownerOnly: false, aliases: ["cf", "flip"], cooldown: 3 },
  { name: "ship", description: "Calculate compatibility between two users", usage: "!ship @user1 @user2", category: "fun", ownerOnly: false, aliases: [], cooldown: 5 },
  { name: "meme", description: "Get a random meme from Reddit", usage: "!meme", category: "fun", ownerOnly: false, aliases: [], cooldown: 5 },
  { name: "trivia", description: "Answer a random trivia question with buttons", usage: "!trivia", category: "fun", ownerOnly: false, aliases: [], cooldown: 10 },
  { name: "wouldyourather", description: "Get a would you rather question", usage: "!wyr", category: "fun", ownerOnly: false, aliases: ["wyr"], cooldown: 5 },
  { name: "truthordare", description: "Get a truth or dare prompt", usage: "!tod", category: "fun", ownerOnly: false, aliases: ["tod"], cooldown: 5 },
  { name: "roast", description: "Roast a user with a random savage line", usage: "!roast @user", category: "fun", ownerOnly: false, aliases: [], cooldown: 5 },
  { name: "compliment", description: "Send a compliment to a user", usage: "!compliment @user", category: "fun", ownerOnly: false, aliases: [], cooldown: 5 },
  { name: "dice", description: "Roll a dice", usage: "!dice [sides]", category: "fun", ownerOnly: false, aliases: ["roll"], cooldown: 3 },
  { name: "cat", description: "Get a random cat image", usage: "!cat", category: "fun", ownerOnly: false, aliases: [], cooldown: 5 },
  { name: "dog", description: "Get a random dog image", usage: "!dog", category: "fun", ownerOnly: false, aliases: [], cooldown: 5 },
  { name: "fortune", description: "Get a random fortune cookie message", usage: "!fortune", category: "fun", ownerOnly: false, aliases: [], cooldown: 5 },
  { name: "animequote", description: "Get a random anime quote", usage: "!animequote", category: "fun", ownerOnly: false, aliases: ["aq"], cooldown: 5 },
  // Leveling
  { name: "rank", description: "View your XP rank and level progress", usage: "!rank [@user]", category: "leveling", ownerOnly: false, aliases: ["xp", "level"], cooldown: 5 },
  { name: "leaderboard", description: "View the top 10 XP leaderboard for this server", usage: "!leaderboard", category: "leveling", ownerOnly: false, aliases: ["lb", "top"], cooldown: 10 },
  // Economy
  { name: "balance", description: "Check your coin balance", usage: "!balance [@user]", category: "economy", ownerOnly: false, aliases: ["bal", "coins"], cooldown: 5 },
  { name: "daily", description: "Claim your daily coin reward (once per 24h)", usage: "!daily", category: "economy", ownerOnly: false, aliases: [], cooldown: 3 },
  { name: "gamble", description: "Gamble your coins on the slot machine", usage: "!gamble <amount|all>", category: "economy", ownerOnly: false, aliases: ["slots", "bet"], cooldown: 5 },
  { name: "work", description: "Work to earn coins", usage: "!work", category: "economy", ownerOnly: false, aliases: [], cooldown: 3600 },
  { name: "rob", description: "Attempt to steal coins from another user", usage: "!rob @user", category: "economy", ownerOnly: false, aliases: [], cooldown: 300 },
  { name: "shop", description: "View and buy items from the server shop", usage: "!shop", category: "economy", ownerOnly: false, aliases: [], cooldown: 5 },
  { name: "inventory", description: "View your item inventory", usage: "!inventory", category: "economy", ownerOnly: false, aliases: ["inv"], cooldown: 5 },
  // Roles
  { name: "createrole", description: "Create a new role with optional color", usage: "!createrole <name> [#color]", category: "roles", ownerOnly: true, aliases: ["newrole"], cooldown: 10 },
  { name: "temprole", description: "Assign a role to a user for a limited time", usage: "!temprole @user @role <duration>", category: "roles", ownerOnly: true, aliases: [], cooldown: 10 },
  { name: "rolemenu", description: "Create a dropdown role selection menu", usage: "!rolemenu", category: "roles", ownerOnly: true, aliases: [], cooldown: 30 },
  // Tickets
  { name: "ticket", description: "Open, close, or manage support tickets", usage: "!ticket <open|close|claim> [category]", category: "tickets", ownerOnly: false, aliases: [], cooldown: 10 },
  // Config
  { name: "setup", description: "Configure bot settings for this server", usage: "!setup <setting> <value>", category: "config", ownerOnly: true, aliases: ["config", "set"], cooldown: 5 },
  // Owner
  { name: "eval", description: "Execute JavaScript code (bot owner only)", usage: "!eval <code>", category: "owner", ownerOnly: true, aliases: ["ev"], cooldown: 3 },
  { name: "blacklist", description: "Blacklist a guild or user from using the bot", usage: "!blacklist <guild|user> <add|remove> <id>", category: "owner", ownerOnly: true, aliases: [], cooldown: 3 },
];

router.get("/commands", (req, res) => {
  res.json(ALL_COMMANDS);
});

router.get("/commands/:category", (req, res) => {
  const { category } = req.params;
  const filtered = ALL_COMMANDS.filter(c => c.category.toLowerCase() === category.toLowerCase());
  res.json(filtered);
});

export default router;
