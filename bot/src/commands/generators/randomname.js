import { infoEmbed } from "../../utils/embed.js";

const first = ["Aria","Blake","Casey","Drew","Eden","Finn","Grace","Hunter","Iris","Jordan","Kai","Luna","Mason","Nova","Owen","Piper","Quinn","River","Sage","Taylor","Uma","Vance","Wren","Xena","Yara","Zane","Alex","Brooke","Cameron","Devin"];
const last = ["Stone","Reed","Cole","Hayes","Lane","Walsh","Gray","Banks","Cruz","Fox","Hart","Knox","Lake","Nash","Park","Quinn","Sage","Troy","Vale","Wolf","Ash","Blair","Clay","Dale","Earl","Fawn","Glen","Hill","Isle","Jade"];

export default {
  name: "randomname",
  description: "Generates a random full name",
  category: "generators",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    const count = Math.min(parseInt(args[0]) || 1, 10);
    const names = Array.from({ length: count }, () =>
      `${first[Math.floor(Math.random()*first.length)]} ${last[Math.floor(Math.random()*last.length)]}`
    ).map(n => `• ${n}`).join("\n");
    message.reply({ embeds: [infoEmbed("Random Name(s)", names)] });
  },
};
