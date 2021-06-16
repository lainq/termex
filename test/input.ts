import { Prompt } from "../src/prompt";

const input = new Prompt({
  prompt: "lmao",
  character: "[?]",
  callback: (solution: string) => {
    console.log(solution);
  },
});
