import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { inngest } from '@/inngest/client';
import { resolve } from 'path';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const appRouter = createTRPCRouter({
  test_ai : protectedProcedure.mutation(async() =>{
    await inngest.send({
      name : "execute-ai",
    })
    return {success : true , message : "Job Queued"};
  }),
  getWorkflows : protectedProcedure.query(({ctx}) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow : protectedProcedure.mutation(async()=>{
    await new Promise((resolve) => setTimeout(resolve , 5000)); 
    await inngest.send({
      name : "test/hello.world",
      data : {
        email : "afzal@gmail.com",
      },
    });
    return prisma.workflow.create({
      data:{
        name : "test-workflow"
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;