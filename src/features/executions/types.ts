import type { GetStepTools, Inngest } from "inngest";

export type workflowContext = Record<string, unknown>;
export type stepTools = GetStepTools<Inngest.Any>;
export interface NodeExecutorParams<TData = Record<string, unknown>> {
    data : TData;
    nodeId : string;
    context : workflowContext;
    step : stepTools;
    //publish pending   
}
export type NodeExecutor<TData = Record<string, unknown>> = (params : NodeExecutorParams<TData>) => Promise<workflowContext>;
