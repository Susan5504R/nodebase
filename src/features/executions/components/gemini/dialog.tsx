"use client";
import z from "zod";

export const AVAILABLE_MODELS = [
    "gemini-1.5-pro",
    "gemini-2.5-flash",
    "gemini-3-pro",
    "gemini-3.1-pro",

] as const;

const formSchema = z.object({
    variableName : z
    .string()
    .min(1 , {message : "Variable name is required"})
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {message : "Variable name must start with a letter, $ or _ and can only contain letters, numbers, $ and _"}),
    model : z.string().min(1 , {message : "Model is required"}),
    systemPrompt : z.string().optional(),
    userPrompt : z.string().min(1 , {message : "User prompt is required"}),
})

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { use, useEffect } from "react";
import { models } from "inngest";
interface Props{
    open : boolean;
    onOpenChange : (open : boolean) => void;
    onSubmit : (values : z.infer<typeof formSchema>) => void;
    defaultvalues ?: Partial<GeminiFormValues>;
};


export type GeminiFormValues = z.infer<typeof formSchema>;

export const GeminiDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultvalues,
} : Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            variableName : defaultvalues?.variableName || "",
            model : defaultvalues?.model || AVAILABLE_MODELS[0],
            systemPrompt : defaultvalues?.systemPrompt,
            userPrompt : defaultvalues?.userPrompt,

        }
    });

    useEffect(() => {
        if (open) {
            form.reset({
                variableName : defaultvalues?.variableName || "",
                model : defaultvalues?.model || AVAILABLE_MODELS[0],
                systemPrompt : defaultvalues?.systemPrompt,
                userPrompt : defaultvalues?.userPrompt,
            });

        }
    }, [open , defaultvalues , form]);
    const watchVariableName = form.watch("variableName") || "myApiCall";
    const handleSubmit = (values : z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gemini</DialogTitle>
                    <DialogDescription>
                        Configure the settings for the Gemini trigger here.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8 mt-4"
                    >

                        <FormField 
                        control={form.control}
                        name="variableName"
                        render={({ field}) => (
                            <FormItem>
                                <FormLabel>Variable Name</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Enter a variable name"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Use this name to reference the result in other nodes:
                                    {""}
                                    {`{(${watchVariableName}.text)}`}
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                            <FormField
                            control={form.control}
                            name="systemPrompt"
                            render={({ field}) => (
                            <FormItem>
                                <FormLabel>System Prompt (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="You are a helpful assistant that helps with making API calls."
                                    className="min-h-[80px] font-mono text-sm"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                   Sets the behaviour of the assistant. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify the objects.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                            />
                            <FormField
                            control={form.control}
                            name="userPrompt"
                            render={({ field}) => (
                            <FormItem>
                                <FormLabel>User Prompt</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Summarize this text:"
                                    className="min-h-[80px] font-mono text-sm"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                   The input for the Gemini node. You can reference other variables in the prompt using {"{{variableName}}"}.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                            />
                        <FormField
                            control={form.control}
                            name="model"
                            render={({ field}) => (
                            <FormItem>
                                <FormLabel> Model </FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}

                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a model"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {AVAILABLE_MODELS.map((model) => (
                                            <SelectItem key={model} value={model}>
                                                {model}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>

                                </Select>
                                <FormDescription>
                                   The Gemini model to use for this node.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                            />
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};