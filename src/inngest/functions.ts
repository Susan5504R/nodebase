import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

const google = createGoogleGenerativeAI();
const anthropic = createAnthropic();
const openai = createOpenAI();
export const execute = inngest.createFunction(
  { id: "execute.ai" },
  { event: "execute-ai" },
  async ({ event, step }) => {
    const {steps : geminiSteps} = await step.ai.wrap("gemini-generate-text" , generateText , {
      model : google("gemini-2.5-flash"),
      system : "You are a helpful assistant that helps users",
      prompt : "what is inngest"
    });

    const {steps : openaiSteps} = await step.ai.wrap("openai-generate-text" , generateText , {
      model : openai("gpt-4o"),
      system : "You are a helpful assistant that helps users",
      prompt : "what is inngest"
    });

    const {steps : anthropicSteps} = await step.ai.wrap("anthropic-generate-text" , generateText , {
      model : anthropic("claude-2"),
      system : "You are a helpful assistant that helps users",
      prompt : "what is inngest"
    });

    return { geminiSteps , openaiSteps , anthropicSteps };
  },
);