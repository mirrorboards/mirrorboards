import { z } from 'zod';
import { EnvelopesUnion } from './EnvelopesUnion';

export const EnvelopesMap = z.record(z.string(), EnvelopesUnion);

export type EnvelopesMap = z.infer<typeof EnvelopesMap>;
