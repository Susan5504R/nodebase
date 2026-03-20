import { NodeExecutor } from "@/features/executions/types";
import Handlebars from "handlebars";
import { anthropicChannel } from "@/inngest/channel/anthropic";
import {generateText} from "ai"
import { createAnthropic } from "@ai-sdk/anthropic";
import { NonRetriableError } from "inngest";
const ANTHROPIC_TIMEOUT_MS = 30000;

Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(stringified);
    return safeString;
});
type AnthropicData = {
    variableName?: string;
    model?: any;
    systemPrompt?: string;
    userPrompt?: string;
};
export const AnthropicExecutor : NodeExecutor<AnthropicData> = async ({ 
    data,
    nodeId,
    context,
    step,
    publish,
 }) => {
    await publish(
        anthropicChannel().status({
            nodeId,
            status : "loading",
        }),
    );

    if (!data.variableName){
        await publish(
        anthropicChannel().status({
            nodeId,
            status : "error",
        }),
    );
    throw new NonRetriableError("Variable name is required to store the response");
    }
    if (!data.userPrompt) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status : "error",
            }),
        );
        throw new NonRetriableError("User prompt is required");
    }
    
   const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant that helps with making API calls.";
   const userPrompt = Handlebars.compile(data.userPrompt)(context);

   const credential = process.env.ANTHROPIC_API_KEY!;
   const anthropic = createAnthropic({
        apiKey : credential,
   });

   try {
        const {steps} = await step.ai.wrap("anthropic generate text", generateText , {
            model : anthropic(data.model || "claude-sonnet-4-20250514"),
            system : systemPrompt,
            prompt : userPrompt,
            experimental_telemetry : {
                isEnabled : true,
                recordInputs : true,
                recordOutputs : true,
            },

        },
    );

    const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
        anthropicChannel().status({
            nodeId,
            status : "success",
        }),
    );

    return {
        ...context,
        [data.variableName] : {aiResponse : text},
    }
   } catch (error) {
    await publish(
        anthropicChannel().status({
            nodeId,
            status : "error",
        }),
    );
    throw error;
}
};
