import { z } from 'zod';

export const Metadata = z.object({
  name: z.string(),
  namespace: z.string(),
});

export type Metadata = z.infer<typeof Metadata>;
