import { CredentialView } from "@/features/credentials/components/credential";
import { CredentialsError, CredentialsLoading } from "@/features/credentials/components/credentials";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
interface PageProps {
    params : Promise<{
        credentialId : string,
    }>
}

const Page = async({params} : PageProps) => {
    const {credentialId} = await params;
    await requireAuth();
    prefetchCredential(credentialId);
    return (

            <HydrateClient>
                <ErrorBoundary fallback={<CredentialsError/>}>
                <Suspense fallback={<CredentialsLoading/>}>
                    <CredentialView credentialId={credentialId}/>
                </Suspense>
                </ErrorBoundary>
            </HydrateClient>
            
    );
};
export default Page;