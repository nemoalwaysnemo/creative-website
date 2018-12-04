import { AbstractCore, NuxeoOptions } from './base.interface';

export abstract class Base extends AbstractCore {

  baseOptions: any = {
    repositoryName: 'default',
    schemas: ['*'],
    enrichers: {},
    fetchProperties: {},
    translateProperties: {},
    headers: {},
    httpTimeout: 30000,
  };

  constructor(opts: NuxeoOptions) {
    super(opts);
    this.baseOptions = Object.assign({}, this.baseOptions, opts);
  }

  repositoryName(repositoryName: string): this {
    this.baseOptions.repositoryName = repositoryName;
    return this;
  }

  schemas(schemas: string[]): this {
    this.baseOptions.schemas = [...schemas];
    return this;
  }

  enrichers(enrichers: Object, override: boolean = true): this {
    this.baseOptions.enrichers = override ? {} : this.baseOptions.enrichers;
    // eslint-disable-next-line prefer-const
    for (const key of Object.keys(enrichers)) {
      if (override) {
        this.baseOptions.enrichers[key] = [...enrichers[key]];
      } else {
        this.baseOptions.enrichers[key] = this.baseOptions.enrichers[key] || [];
        this.baseOptions.enrichers[key].push(...enrichers[key]);
      }
    }
    return this;
  }

  enricher(entity: string, name: string): this {
    const enrichers = this.baseOptions.enrichers[entity] || [];
    enrichers.push(name);
    this.baseOptions.enrichers[entity] = enrichers;
    return this;
  }

  fetchProperties(fetchProperties: Object, override: boolean = true): this {
    this.baseOptions.fetchProperties = override ? {} : this.baseOptions.fetchProperties;
    // eslint-disable-next-line prefer-const
    for (const key of Object.keys(fetchProperties)) {
      if (override) {
        this.baseOptions.fetchProperties[key] = [...fetchProperties[key]];
      } else {
        this.baseOptions.fetchProperties[key] = this.baseOptions.fetchProperties[key] || [];
        this.baseOptions.fetchProperties[key].push(...fetchProperties[key]);
      }
    }
    return this;
  }

  fetchProperty(entity: string, name: string): this {
    const fetchProperties = this.baseOptions.fetchProperties[entity] || [];
    fetchProperties.push(name);
    this.baseOptions.fetchProperties[entity] = fetchProperties;
    return this;
  }

  translateProperties(translateProperties: Object, override: boolean = true): this {
    this.baseOptions.translateProperties = override ? {} : this.baseOptions.translateProperties;
    // eslint-disable-next-line prefer-const
    for (const key of Object.keys(translateProperties)) {
      if (override) {
        this.baseOptions.translateProperties[key] = [...translateProperties[key]];
      } else {
        this.baseOptions.translateProperties[key] = this.baseOptions.translateProperties[key] || [];
        this.baseOptions.translateProperties[key].push(...translateProperties[key]);
      }
    }
    return this;
  }

  translateProperty(entity: string, name: string): this {
    const translateProperties = this.baseOptions.translateProperties[entity] || [];
    translateProperties.push(name);
    this.baseOptions.translateProperties[entity] = translateProperties;
    return this;
  }

  /**
   * Sets the depth.
   * Possible values are: `root`, `children` and `max`.
   * @returns {Base} The object itself.
   */
  depth(depth: string): this {
    this.baseOptions.depth = depth;
    return this;
  }

  /**
   * Sets the headers.
   * @param {object} headers - the new headers.
   * @returns {Base} The object itself.
   */
  headers(headers: Object): this {
    this.baseOptions.headers = {};
    // eslint-disable-next-line prefer-const
    for (const key of Object.keys(headers)) {
      this.baseOptions.headers[key] = headers[key];
    }
    return this;
  }

  header(name: string, value: string): this {
    this.baseOptions.headers[name] = value;
    return this;
  }

  timeout(timeout: number): this {
    this.baseOptions.timeout = timeout;
    return this;
  }

  transactionTimeout(transactionTimeout: number): this {
    this.baseOptions.transactionTimeout = transactionTimeout;
    return this;
  }

  httpTimeout(httpTimeout: number): this {
    this.baseOptions.httpTimeout = httpTimeout;
    return this;
  }

  _computeOptions(opts?: any): any {

    const options = Object.assign({}, this.baseOptions, opts);
    // force some options that we don't merge
    if (opts.schemas) {
      options.schemas = [...opts.schemas];
    }
    if (opts.enrichers) {
      options.enrichers = {};
      Object.keys(opts.enrichers).forEach((key) => {
        options.enrichers[key] = opts.enrichers[key];
      });
    }
    if (opts.fetchProperties) {
      options.fetchProperties = {};
      Object.keys(opts.fetchProperties).forEach((key) => {
        options.fetchProperties[key] = opts.fetchProperties[key];
      });
    }
    if (opts.translateProperties) {
      options.translateProperties = {};
      Object.keys(opts.translateProperties).forEach((key) => {
        options.translateProperties[key] = opts.translateProperties[key];
      });
    }
    if (opts.headers) {
      options.headers = {};
      Object.keys(opts.headers).forEach((key) => {
        options.headers[key] = opts.headers[key];
      });
    }
    return options;
  }
}
