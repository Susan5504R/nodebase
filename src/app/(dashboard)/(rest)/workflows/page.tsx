import { WorkflowsList, WorkflowsContainer } from "@/features/auth/components/workflows/hooks/components/workflows";
import { prefetchWorkflows } from "@/features/auth/components/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient, prefetch } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = async () => {
    await requireAuth();
    prefetchWorkflows();
    return (
        <HydrateClient>
            <ErrorBoundary fallback={<p>Failed to load workflows</p>}>
                <Suspense fallback={<p>Loading workflows...</p>}>
                    <WorkflowsContainer>
                        <WorkflowsList />
                    </WorkflowsContainer>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    );
};
export default Page;