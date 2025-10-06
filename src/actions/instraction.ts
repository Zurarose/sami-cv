'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { routes } from '@/constant/routes';

export const getInstruction = async () => {
  // Get the most recent instruction
  const instruction = await prisma.instruction.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
  });
  return instruction;
};

export const saveInstruction = async (content: string) => {
  // Check if an instruction already exists
  const existingInstruction = await prisma.instruction.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
  });

  let instruction;

  if (existingInstruction) {
    // Update existing instruction
    instruction = await prisma.instruction.update({
      where: { id: existingInstruction.id },
      data: { content },
    });
  } else {
    // Create new instruction
    instruction = await prisma.instruction.create({
      data: { content },
    });
  }

  revalidatePath(routes.instructions);
  return instruction;
};
