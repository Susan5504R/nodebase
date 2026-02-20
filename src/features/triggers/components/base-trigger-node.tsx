"use client";

import { NodeProps, Position } from "@xyflow/react";
import {  LucideIcon, Workflow } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";
import { memo } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import Image from "next/image";
import { BaseHandle } from "@/components/react-flow/base-handle";

interface BaseTriggerNodeProps extends NodeProps{
    icon : LucideIcon | string
    name : string;
    description?:string;
    children ?: React.ReactNode;
    onSettings?: ()=>void;
    onDoubleClick ?: ()=>void;
};
export const BaseTriggerNode = memo(
    ({
    icon : Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,

} : BaseTriggerNodeProps) => {
    return (
        <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
    >
        <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
            <BaseNodeContent>
                {typeof Icon === "string" ? (
                    <Image src={Icon} alt={name} height={16} width={16} />
                ) : (
                    <Icon className="size-4 text-muted-foreground" />
                )}
                {
                    children
                }
                <BaseHandle 
                id = "source-1"
                type="source"
                position={Position.Right} />

            </BaseNodeContent>
        </BaseNode>
    </WorkflowNode>
    )
},
);

BaseTriggerNode.displayName = "BaseTriggerNode";