import { getInstruction } from '@/actions/instraction';
import { InstructionForm } from '@/components/instructions/instruction-form';

export default async function InstructionsPage() {
  const instruction = await getInstruction();
  const initialContent = instruction?.content || '';

  return <InstructionForm initialContent={initialContent} />;
}
