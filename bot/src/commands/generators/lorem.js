import { infoEmbed } from "../../utils/embed.js";

const LOREM = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

export default {
  name: "lorem",
  description: "Generates Lorem Ipsum placeholder text",
  category: "generators",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    const words = Math.min(parseInt(args[0]) || 50, 200);
    const result = [];
    for (let i = 0; i < words; i++) result.push(LOREM[i % LOREM.length]);
    message.reply({ embeds: [infoEmbed("Lorem Ipsum", result.join(" "))] });
  },
};
