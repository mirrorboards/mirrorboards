import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import { Envelopes } from '@mirrorboards-types/envelopes';
import { Namespace } from '@mirrorboards/namespace';
import * as mirrorboards from '../index';
import * as yaml from 'yaml';

type StreamwaveArgs = {
  metadata: {
    name: string;
    namespace: string;
  };
};

export class Streamwave extends pulumi.ComponentResource {
  public readonly envelope: Envelopes.Streamwave;

  constructor(name: string, args: StreamwaveArgs, opts?: pulumi.ComponentResourceOptions) {
    super('mirrorboards:db:Streamwave:Streamwave', name, args, opts);

    const namespace = new Namespace(args.metadata.name, 'streamwave');

    const configMap = new k8s.core.v1.ConfigMap(
      namespace.get('config-map'),
      {
        metadata: {
          name: namespace.get('config-map'),
          namespace: args.metadata.namespace,
        },
        data: {
          'benthos.yaml': yaml.stringify({
            http: {
              address: '0.0.0.0:4195',
              cors: {
                enabled: false,
              },
              debug_endpoints: false,
              enabled: true,
              root_path: '/benthos',
            },
          }),
        },
      },
      {
        parent: this,
      },
    );

    const deployment = new k8s.apps.v1.Deployment(
      namespace.get('deployment'),
      {
        metadata: {
          name: namespace.get(),
          namespace: args.metadata.namespace,
        },
        spec: {
          replicas: 1,
          selector: {
            matchLabels: {
              'app.kubernetes.io/name': namespace.get(),
              'app.kubernetes.io/instance': 'streamwave',
            },
          },
          template: {
            metadata: {
              labels: {
                'app.kubernetes.io/name': namespace.get(),
                'app.kubernetes.io/instance': 'streamwave',
              },
            },
            spec: {
              restartPolicy: 'Always',
              containers: [
                {
                  name: 'connect',
                  image: 'ghcr.io/mirrorboards-forks/connect:4.28.9',
                  imagePullPolicy: 'IfNotPresent',
                  args: ['-c', '/benthos.yaml', 'streams', '/streams/*.yaml'],
                  ports: [
                    {
                      name: 'http',
                      containerPort: 4195,
                      protocol: 'TCP',
                    },
                  ],
                  livenessProbe: {
                    failureThreshold: 3,
                    httpGet: {
                      path: '/ping',
                      port: 'http',
                    },
                    periodSeconds: 5,
                    successThreshold: 1,
                    timeoutSeconds: 2,
                  },
                  readinessProbe: {
                    failureThreshold: 1,
                    httpGet: {
                      path: '/ready',
                      port: 'http',
                    },
                    periodSeconds: 5,
                    successThreshold: 1,
                    timeoutSeconds: 2,
                  },
                  volumeMounts: [
                    {
                      name: 'config',
                      mountPath: '/benthos.yaml',
                      subPath: 'benthos.yaml',
                      readOnly: true,
                    },
                  ],
                },
              ],
              volumes: [
                {
                  name: 'config',
                  configMap: {
                    name: namespace.get('config-map'),
                  },
                },
              ],
            },
          },
        },
      },
      {
        parent: this,
      },
    );

    const svc = new k8s.core.v1.Service(
      namespace.get('svc'),
      {
        metadata: {
          name: namespace.get(),
          namespace: args.metadata.namespace,
          labels: {
            'app.kubernetes.io/name': namespace.get(),
            'app.kubernetes.io/instance': 'streamwave',
          },
        },
        spec: {
          type: 'ClusterIP',
          ports: [
            {
              port: 80,
              targetPort: 'http',
              protocol: 'TCP',
              name: 'http',
            },
          ],
          selector: {
            'app.kubernetes.io/name': namespace.get(),
            'app.kubernetes.io/instance': 'streamwave',
          },
        },
      },
      {
        parent: this,
        dependsOn: [deployment],
      },
    );

    this.envelope = {
      type: 'streamwave',
      envelope: {
        metadata: {
          name: args.metadata.name,
          namespace: namespace.get(),
        },
        connection: {
          url: 'http://www.xxx.default',
        },
      },
    };

    this.registerOutputs({
      envelope: this.envelope,
    });
  }
}
