import { gemini, NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma/browser";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channel/http-request";
import { manualTriggerChannel } from "./channel/manual-request";
import { googleFormTriggerChannel } from "./channel/google-form-trigger";
import { stripeTriggerChannel } from "./channel/stripe-trigger";
import { geminiChannel } from "./channel/gemini";
import { discordChannel } from "./channel/discord";
export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event : "workflows/execute.workflow" ,
    channel : [httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      discordChannel(),
    ],
  },
  async ({event , step , publish}) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {
        throw new NonRetriableError("Workflow ID is required");
    }
    const sortedNodes = await step.run("prepare-workflow" , async()=>{
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where : {
            id : workflowId,

        },
        include : {
            nodes : true,
            connections : true,
        },
      });
      return topologicalSort(workflow.nodes, workflow.connections);
    })

    const userId = await step.run("find-user-id" , async()=>{
        const workflow = await prisma.workflow.findUniqueOrThrow({
            where : {
                id : workflowId,
            },
            select : {
                userId : true,
            },  
        });
        return workflow.userId;
    })  
    // initialize the context with any initial data from the trigger
    let context = event.data.initialData || {};
      for (const node of sortedNodes) {
        const executor = getExecutor(node.type as NodeType);
        context = await executor({
        data : node.data as Record<string, unknown>,
        nodeId : node.id,
        context , 
        step,
        publish,
        userId,
    })
      }
    return {workflowId, result : context};
  },
);