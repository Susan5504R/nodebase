import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { inngest } from '@/inngest/client';
import { resolve } from 'path';
export const appRouter = createTRPCRouter({
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