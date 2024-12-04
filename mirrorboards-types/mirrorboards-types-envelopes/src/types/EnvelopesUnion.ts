import { z } from 'zod';
import * as envelopes from './envelopes';

export const EnvelopesUnion = z.discriminatedUnion('type', [
  envelopes.RSquaredWitness,
  envelopes.Elasticsearch,
  envelopes.Redpanda,
  envelopes.Streamwave,
]);

export type EnvelopesUnion = z.infer<typeof EnvelopesUnion>;
