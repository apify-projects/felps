import Base from './base';
import { ModelOptions } from './common/types';
import { traverse } from './common/utils';

export default class Model extends Base {
  private _schema: any;

  constructor(options: ModelOptions) {
      const { name } = options || {};
      super({ key: 'model', name });

      this.extend(options);
  }

  extend(options: Partial<ModelOptions>) {
      const { schema } = options || {};
      this._schema = schema;
  }

  get schema() {
      return {
          ...this._schema,
          '#schema-name': this.name,
      };
  }

  dependencies(): string[] {
      const deps = new Set<string>();
      traverse(this._schema, (key, value) => {
          if (key === '#schema-name') deps.add(value);
      });
      return [...deps];
  }
}
