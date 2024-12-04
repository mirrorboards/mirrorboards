import * as pulumi from '@pulumi/pulumi';
import { Envelopes } from '@mirrorboards-types/envelopes';
import { Namespace } from '@mirrorboards/namespace';
import * as mirrorboards from '../index';

type RedpandaArgs = {
  name: string;
};

export class Redpanda extends pulumi.ComponentResource {
  public readonly envelope: Envelopes.Redpanda;

  constructor(name: string, args: RedpandaArgs, opts?: pulumi.ComponentResourceOptions) {
    super('mirrorboards:db:Redpanda:Redpanda', name, args, opts);

    const namespace = new Namespace('boardnamespace');

    this.envelope = {
      type: 'redpanda',
      envelope: {
        metadata: {
          name: args.name,
          namespace: namespace.get(),
        },
        connection: {
          addresses: [`https://${args.name}-es-internal-http.namespace.svc.cluster.local:9200`],
        },
      },
    };

    this.registerOutputs({
      envelope: this.envelope,
    });
  }
}
