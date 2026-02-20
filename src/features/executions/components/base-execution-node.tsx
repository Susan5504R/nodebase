"use client";

import { NodeProps, Position } from "@xyflow/react";
import {  LucideIcon, Workflow } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";
import { memo } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import Image from "next/image";
import { BaseHandle } from "@/components/react-flow/base-handle";

interface BaseExecutionNodeProps extends NodeProps{
    icon : LucideIcon | string
    name : string;
    description?:string;
    children ?: React.ReactNode;
    onSettings?: ()=>void;
    onDoubleClick ?: ()=>void;
};
export const BaseExecutionNode = memo(
    ({
    icon : Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,

} : BaseExecutionNodeProps) => {
    return (
        <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
    >
        <BaseNode onDoubleClick={onDoubleClick}>
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
                id = "target-1"
                type="target"
                position={Position.Left} />
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

BaseExecutionNode.displayName = "BaseExecutionNode";