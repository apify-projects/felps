import { JSONSchema7 } from 'json-schema';
import Base from './base';
import { REFERENCE_KEY } from './common/consts';
import { ModelOptions, References } from './common/types';
import { traverse } from './common/utils';

export default class Model extends Base {
    private _schema: JSONSchema7;

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

    referenceKeys(): string[] {
        return this.dependencies().map((modelName) => REFERENCE_KEY(modelName));
    }

    filterReference(ref: Partial<References>) {
        return this.referenceKeys().reduce((acc, key) => {
            acc[key] = ref[key];
            return acc;
        }, {});
    }
}
