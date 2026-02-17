import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";
// hook to fetch workflows using suspense
export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

// hook to create new workflow
export const useCreateWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess : (data) => {
            toast.success(`Workflow  ${data.name} created`);
            queryClient.invalidateQueries(
                trpc.workflows.getMany.queryOptions({}),
            )
        }
    }));

};

export const useRemoveWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    return useMutation(trpc.workflows.remove.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`Workflow ${data.name} removed`);
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({

            }));
            queryClient.invalidateQueries(
                trpc.workflows.getOne.queryFilter({id : data.id}),
            )
        }
    }))
}
export const useSuspenseWorkflow = (id : string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};

//hook to update workflow name
export const useUpdateWorkflowName = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(trpc.workflows.updateName.mutationOptions({
        onSuccess : (data) => {
            toast.success(`Workflow  ${data.name} updated`);
            queryClient.invalidateQueries(
                trpc.workflows.getMany.queryOptions({}),
            )
            queryClient.invalidateQueries(
                trpc.workflows.getOne.queryOptions({id : data.id}),
            );
        },
        onError : (error) => {
            toast.error(error.message);
        }
    }));

};