import { z } from 'zod';
import * as primitives from '../primitives';

export const Elasticsearch = z.object({
  type: z.literal('elasticsearch'),
  envelope: z.object({
    metadata: primitives.Metadata,
    connection: z.object({
      addresses: z.array(z.string()),
    }),
  }),
});

export type Elasticsearch = z.infer<typeof Elasticsearch>;
