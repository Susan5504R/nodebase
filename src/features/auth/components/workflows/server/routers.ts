import prisma from "@/lib/db";
import {z} from "zod";
import { createTRPCRouter, protectedProcedure , premiumProcedure} from "@/trpc/init";
import { generateSlug } from "random-word-slugs";

export const workflowsRouter = createTRPCRouter({
    create : premiumProcedure.mutation(({ctx}) => {
        return prisma.workflow.create({
            data : {
                name : generateSlug(3),
                userId : ctx.auth.user.id,
            },
        });
    }),

    remove : protectedProcedure
    .input(z.object({id : z.string()}))
    .mutation(({ctx, input}) => {
        return prisma.workflow.deleteMany({
            where : {
                userId : ctx.auth.user.id,
                id : input.id,
            },
        })
    }),

    updateName : protectedProcedure
    .input(z.object({id : z.string(), name : z.string().min(3)}))
    .mutation(({ctx , input}) => {
        return prisma.workflow.update({
            where : {
                id : input.id,
                userId : ctx.auth.user.id,
            },
            data : {
                name : input.name,
            },
        });
    }),

    getOne : protectedProcedure
    .input(z.object({id : z.string()}))
    .query(({ctx , input}) => {
        return prisma.workflow.findUnique({
            where : {
                id : input.id,
                userId : ctx.auth.user.id,
            },
        });
    }),

    getMany : protectedProcedure
    .query(({ctx}) => {
        return prisma.workflow.findMany({
            where : {
                userId : ctx.auth.user.id,
            },
        });
    }),
});