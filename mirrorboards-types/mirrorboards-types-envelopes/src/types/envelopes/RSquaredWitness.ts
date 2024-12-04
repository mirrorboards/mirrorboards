import { z } from 'zod';
import * as primitives from '../primitives';

export const RSquaredWitness = z.object({
  type: z.literal('r_squared_witness'),
  envelope: z.object({
    metadata: primitives.Metadata,
    witness_id: z.string(),
    witness_name: z.string(),
    witness_network: z.enum(['RQRX']),
    witness_pub_key: z.string(),
    witness_wif_key: z.string(),
  }),
});

export type RSquaredWitness = z.infer<typeof RSquaredWitness>;
