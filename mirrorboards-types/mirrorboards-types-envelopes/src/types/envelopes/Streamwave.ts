import { z } from 'zod';
import * as primitives from '../primitives';

export const Streamwave = z.object({
  type: z.literal('streamwave'),
  envelope: z.object({
    metadata: primitives.Metadata,
    connection: z.object({
      url: z.string(),
    }),
  }),
});

export type Streamwave = z.infer<typeof Streamwave>;
