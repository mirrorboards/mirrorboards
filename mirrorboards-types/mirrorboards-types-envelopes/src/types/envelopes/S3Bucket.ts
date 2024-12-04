import { z } from 'zod';
import * as primitives from '../primitives';

export const S3Bucket = z.object({
  type: z.literal('s3bucket'),
  envelope: z.object({
    metadata: primitives.Metadata,
    connection: z.object({
      endpoint: z.string(),
      bucket: z.string(),
      credentials: z.object({
        id: z.string(),
        secret: z.string(),
      }),
    }),
  }),
});

export type S3Bucket = z.infer<typeof S3Bucket>;
