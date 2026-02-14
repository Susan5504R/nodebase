import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// hook to fetch workflows using suspense
export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
};

// hook to create new workflow
export const useCreateWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess : (data) => {
            toast.success(`Workflow  ${data.name} created`);
            queryClient.invalidateQueries(
                trpc.workflows.getMany.queryOptions(),
            )
        }
    }));

};