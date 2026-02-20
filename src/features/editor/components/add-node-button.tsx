"use client";

import { NodeSelector } from "@/components/node-selector";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { set } from "zod";

export const AddNodeButton = memo(() => {
    const [selectorOpen, setSelectorOpen] = useState(false);
    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <Button
        onClick={()=>{}}
        variant="outline"
        size="icon"
        className="bg-background"
        >
            <PlusIcon />
        </Button>
        </NodeSelector>
    )
});

AddNodeButton.displayName = "AddNodeButton";