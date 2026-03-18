import { NodeProps } from "@xyflow/react";
import React, { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props : NodeProps) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const nodeStatus = "success";

    const handleOpenSettings = () => setDialogOpen(true);
    return (
        <>
        <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        <BaseTriggerNode
        {...props}
        name="When clicking 'Execute Workflow'"
        icon={MousePointer}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
});