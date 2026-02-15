"use client";
import { EntityHeader, EntityPagination } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../use-workflows";
import { EntityContainer , EntitySearch } from "@/components/entity-components";
import { useUpgradeModal } from "../use-upgrade-modal";
import { toast } from "sonner";
import { on } from "events";
import { useWorkflowsParams } from "../use-workflows-params";
import { useEntitySearch } from "../use-entity-search";
export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();
    return (
            <div className="flex-1 flex justify-center items-center">
            <p> 
                {JSON.stringify(workflows.data , null , 2)}
            </p>
            </div>
    );
};
export const WorkflowsHeader = ({disabled} : {disabled? : boolean}) => {
    const createWorkflow = useCreateWorkflow();
    const {handleError , modal} = useUpgradeModal();
    const handleCreate = () => {
        createWorkflow.mutate(undefined , {
            onError : (error) => {
                const handled = handleError(error);
                if (!handled) {
                    toast.error("Failed to create workflow");
                }
            },
        });
    }
    return (
        <>
        {modal}
        <EntityHeader 
            title="Workflows"
             description="Create and manage your workflows"
             newButtonLabel="New workflow"
             disabled ={disabled}
             onNew={handleCreate}
             isCreating = {createWorkflow.isPending}
        />
        </>
    )
};

export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();
    return (
        <EntityPagination
            disabled={workflows.isFetching}
            page={workflows.data.page}
            totalPages={workflows.data.totalPages}
            onPageChange={(page) => setParams({...params, page})}
        />
    )
}

export const WorkflowsContainer = ({
    children
} : {children: React.ReactNode}) => {
    return (
        <EntityContainer
        header = {<WorkflowsHeader/>}
        search = {<WorkflowsSearch/>}
        pagination={<WorkflowsPagination/>}
        >
            {children}

        </EntityContainer>
    )
}

export const WorkflowsSearch = () => {
    const [params , setParams] = useWorkflowsParams();
    const {searchValue, onSearchChange} = useEntitySearch({
        params,
        setParams,
    });
    return (
        <EntitySearch 
        value= {searchValue}
        onChange={onSearchChange}
        placeholder="Search workflows"
        />
    )
}