"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { QueryClient } from "@tanstack/react-query";
const Page = () => {
  const trpc = useTRPC();
  const {data} = useQuery (trpc.getWorkflows.queryOptions());
  const queryClient = useQueryClient();
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess : () => {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    }
  }));
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      <div>
        {JSON.stringify(data , null,2)}
      </div>
      <Button disabled = {create.isPending} onClick={() => {create.mutate()}}>
        Create Workflows
      </Button>
    </div>
  )
};
export default Page;