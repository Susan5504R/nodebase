import { NodeExecutor } from "@/features/executions/types";
import Handlebars from "handlebars";
import { openaiChannel } from "@/inngest/channel/openai";
import {generateText} from "ai"
import { createOpenAI } from "@ai-sdk/openai";
import { NonRetriableError } from "inngest";
const OPENAI_TIMEOUT_MS = 30000;

Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(stringified);
    return safeString;
});
type OpenAIData = {
    variableName?: string;
    model?: any;
    systemPrompt?: string;
    userPrompt?: string;
};
export const OpenAIExecutor : NodeExecutor<OpenAIData> = async ({ 
    data,
    nodeId,
    context,
    step,
    publish,
 }) => {
    await publish(
        openaiChannel().status({
            nodeId,
            status : "loading",
        }),
    );

    if (!data.variableName){
        await publish(
        openaiChannel().status({
            nodeId,
            status : "error",
        }),
    );
    throw new NonRetriableError("Variable name is required to store the response");
    }
    if (!data.userPrompt) {
        await publish(
            openaiChannel().status({
                nodeId,
                status : "error",
            }),
        );
        throw new NonRetriableError("User prompt is required");
    }
    
   const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant that helps with making API calls.";
   const userPrompt = Handlebars.compile(data.userPrompt)(context);

   const credential = process.env.OPENAI_API_KEY!;
   const openai = createOpenAI({
        apiKey : credential,
   });

   try {
        const {steps} = await step.ai.wrap("openai generate text", generateText , {
            model : openai(data.model || "gpt-4o"),
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
        openaiChannel().status({
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
        openaiChannel().status({
            nodeId,
            status : "error",
        }),
    );
    throw error;
}
};
