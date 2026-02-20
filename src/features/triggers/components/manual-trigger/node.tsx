import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer } from "lucide-react";

export const ManualTriggerNode = memo((props : NodeProps) => {
    return (
        <>
        <BaseTriggerNode
        {...props}
        name="When clicking 'Execute Workflow'"
        icon={MousePointer}
        // status={nodeStatus}
        // onSettings={handleOpenSettings}
        // onDoubleClick={handleDoubleClick}
        />
        </>
    )
});