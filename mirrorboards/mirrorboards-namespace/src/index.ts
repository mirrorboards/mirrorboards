type NamespaceState = (string | number)[];

type NamespaceConfig = {
  symbol: string;
  lowercase: boolean;
};

export class Namespace {
  private state: NamespaceState = [];
  private config: NamespaceConfig = {
    symbol: '-',
    lowercase: false,
  };

  constructor(...args: NamespaceState) {
    this.state.push(...args);
  }

  settings(config: Partial<NamespaceConfig>) {
    this.config = {
      ...this.config,
      ...config,
    };

    return this;
  }

  get(...args: NamespaceState) {
    this.state.push();

    return this.value(...args);
  }

  private value(...args: NamespaceState) {
    const result = [...this.state, ...args].join(this.config.symbol);

    if (this.config.lowercase) {
      return result.toLowerCase();
    }

    return result;
  }
}
