"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import React, { memo, use } from "react";
import { GlobeIcon } from "lucide-react";
import { BaseExecutionNode } from "../base-execution-node";
import { HttpRequestFormValues, HttpRequestDialog } from "./dialog";

type HttpRequestNodeData = {
    endpoint ?: string;
    method ?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body ?: string;
};
type HttpRequestNodeType = Node<HttpRequestNodeData>;
export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const { setNodes } = useReactFlow();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const nodeStatus = "initial"; 
    const handleSubmit = (values : HttpRequestFormValues) => {
        setNodes((nodes) => 
                    nodes.map((node) => {
                        if (node.id === props.id) {
                            return { ...node, data: { ...node.data , ...values } };
                        }
                        return node;
                    })
                );
    }
    const handleOpenSettings = () => setDialogOpen(true);
    const nodeData = props.data;
    const description = nodeData.endpoint
     ? `${nodeData.method || "GET"} : ${nodeData.endpoint}` : "Not Configured";
     return (
        <>
            <HttpRequestDialog 
            open = {dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleSubmit}
            defaultvalues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                description={description}
                name="HTTP Request"
                icon={GlobeIcon}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
                status={nodeStatus}

                />

        </> 
     )
});
HttpRequestNode.displayName = "HttpRequestNode";