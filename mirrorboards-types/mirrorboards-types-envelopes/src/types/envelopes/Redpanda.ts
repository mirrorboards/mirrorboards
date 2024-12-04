import { z } from 'zod';
import * as primitives from '../primitives';

export const Redpanda = z.object({
  type: z.literal('redpanda'),
  envelope: z.object({
    metadata: primitives.Metadata,
    connection: z.object({
      addresses: z.array(z.string()),
    }),
  }),
});

export type Redpanda = z.infer<typeof Redpanda>;
