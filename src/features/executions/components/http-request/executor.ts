import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { resumePluginState } from "next/dist/build/build-context";
import ky ,  {type Options as KyOptions} from "ky";

const HTTP_REQUEST_TIMEOUT_MS = 30000;

type HttpRequestData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;

};
export const httpRequestExecutor : NodeExecutor<HttpRequestData> = async ({ 
    data,
    nodeId,
    context,
    step,
 }) => {
    if (!data.endpoint) {
        throw new NonRetriableError("Endpoint is required");
    }
    const result = await step.run("http-request", async()=>{
        const endpoint = data.endpoint!;
        const method = data.method || "GET";
        const options : KyOptions = {
            method,
            timeout: HTTP_REQUEST_TIMEOUT_MS,
            retry: 0,
        };
        if (["POST", "PUT", "PATCH"].includes(method)) {
            options.body = data.body;
        }
        let response: Response;

        try {
            response = await ky(endpoint, options);
        } catch (error) {
            if (error instanceof Error && error.name === "TimeoutError") {
                throw new NonRetriableError(`Request timed out after ${HTTP_REQUEST_TIMEOUT_MS}ms: ${method} ${endpoint}`);
            }

            throw error;
        }
        
        const contentType = response.headers.get("content-type");
        const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();
        return {
            ...context,
            httpResonse : {
                status : response.status,
                statusText : response.statusText,
                data : responseData,
            }
        }
    });
    return result;
};