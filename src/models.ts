import { camelCase } from 'camel-case';
import Base from './base';
import { GenerateModelSetMethods, GenerateObject, ModelOptions, ModelsOptions } from './common/types';
import Model from './model';

export default class Models<ModelDefinitions = Record<string, never>> extends Base {
    names: string[];
    private _items: GenerateObject<Extract<keyof ModelDefinitions, string>, Model>;

    constructor(options?: ModelsOptions<Extract<keyof ModelDefinitions, string>>) {
        const { names = [] } = options;
        super({ key: 'models', name: 'models' });
        this.names = names.map((name) => camelCase(name));
    }

    init() {
        for (const name of this.names) {
            // TODO: Try passing on the MethodsByStep to the Step constructor
            this._items[name as Extract<keyof ModelDefinitions, string>] = new Model({ name });
        }
    }

    get get(): GenerateObject<Extract<keyof ModelDefinitions, string>, Model> {
        return this._items;
    }

    get set(): GenerateModelSetMethods<Extract<keyof ModelDefinitions, string>> {
        return new Proxy(this, {
            get(target, name: string) {
                if (target.names.includes(name)) {
                    return (options: Partial<ModelOptions>) => target.get?.[name]?.extend?.(options);
                }
                return undefined;
            },
        }) as unknown as GenerateModelSetMethods<Extract<keyof ModelDefinitions, string>>;
    }
};
