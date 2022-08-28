import { Accessor } from 'solid-js';
import { ZodIssue } from 'zod';

export function validation(issues: Accessor<ZodIssue[] | undefined>) {
  return {
    hasError: (name: string) => issues()?.some(i => i.path.includes(name)),
    getError: (name: string) => issues()?.find(i => i.path.includes(name))?.message
  };
}
