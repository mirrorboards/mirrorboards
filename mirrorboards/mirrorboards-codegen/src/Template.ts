import { z } from 'zod';
import { save } from './utils/save';

type TemplateCallback<TInput extends z.ZodTypeAny> = (value: { input: z.output<TInput> }) => Promise<string> | string;

type TemplateState<TInput extends z.ZodTypeAny> = {
  input?: TInput;
  callback?: TemplateCallback<TInput>;
};

export class Template<TInput extends z.ZodTypeAny = z.ZodTypeAny> {
  constructor(public state: TemplateState<TInput> = {}) {}

  input<I extends z.ZodTypeAny>(input: I): Template<I> {
    return new Template<I>({
      input,
      callback: this.state.callback as TemplateCallback<I> | undefined,
    });
  }

  template(callback: TemplateCallback<TInput>): Template<TInput> {
    return new Template<TInput>({
      ...this.state,
      callback,
    });
  }

  async compile(raw_input?: z.input<TInput>): Promise<string> {
    if (!this.state.callback) {
      throw new Error('Template: Template callback not provided');
    }

    const input = this.state.input ? this.state.input.parse(raw_input) : raw_input;
    return this.state.callback({ input });
  }

  async save(raw_input: z.input<TInput>, saveConfig: Omit<Parameters<typeof save>[0], 'content'>): Promise<string> {
    if (!this.state.callback) {
      throw new Error('Template: Template callback not provided');
    }

    const input = this.state.input ? this.state.input.parse(raw_input) : raw_input;
    const content = await this.state.callback({ input });

    await save({
      ...saveConfig,
      content: content,
    });

    return content;
  }
}
