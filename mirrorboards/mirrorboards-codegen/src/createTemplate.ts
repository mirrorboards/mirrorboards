import { z } from 'zod';
import { Template } from './Template';

type TemplateOptions<TInput extends z.ZodTypeAny> = {
  input?: TInput;
  template: (value: { input: z.output<TInput> }) => Promise<string> | string;
};

export const createTemplate = <TInput extends z.ZodTypeAny>({
  input,
  template,
}: TemplateOptions<TInput>): Template<TInput> => {
  if (input) {
    return new Template<TInput>().input(input).template(template);
  }

  return new Template<TInput>().template(template);
};
