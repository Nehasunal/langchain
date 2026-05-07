import { PromptTemplate } from "@langchain/core/prompts";

const prompt = PromptTemplate.fromTemplate(
  "Explain {topic} in 10 words for a {level} person"
);

const formatted = await prompt.format({
  topic: "Node.js",
  level: "beginner",
});

console.log(formatted);