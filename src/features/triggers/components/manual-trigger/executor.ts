import { NodeExecutor } from "@/features/executions/types";
import { resumePluginState } from "next/dist/build/build-context";
type ManualTriggerData = Record<string, unknown>;
export const manualTriggerExecutor : NodeExecutor<ManualTriggerData> = async ({ 
    data,
    nodeId,
    context,
    step,
 }) => {
    const result = await step.run("manual-trigger" , async()=>context);
    return result;
};