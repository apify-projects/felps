import { camelCase } from 'camel-case';
import Base from './base';
import { GenerateObject, GenerateStepOnMethods, GenerateStepSetMethods, MakeStepBaseApiContext, StepOptions, StepsOptions } from './common/types';
import Step from './step';

export default class Steps<
    Names = '',
    InitialMethods = MakeStepBaseApiContext,
    MethodsByStep extends Record<string, unknown> = Record<string, unknown>
    > extends Base {
    names: string[];
    private _items: GenerateObject<Names, Step>;

    constructor(options?: StepsOptions<Names>) {
        const { names = [] } = options;
        super({ key: 'steps', name: 'steps' });
        this.names = names.map((name) => camelCase(name));
    }

    init() {
        for (const name of this.names) {
            // TODO: Try passing on the MethodsByStep to the Step constructor
            this._items[name] = new Step<InitialMethods>({ name });
        }
    }

    get get(): GenerateObject<Names, Step> {
        return this._items;
    }

    get set(): GenerateStepSetMethods<Names, InitialMethods, MethodsByStep> {
        return new Proxy(this, {
            get(target, name: string) {
                if (target.names.includes(name)) {
                    return (options: Partial<StepOptions<InitialMethods, MethodsByStep>>) => target.get?.[name]?.extend?.(options);
                }
                return undefined;
            },
        }) as unknown as GenerateStepSetMethods<Names, InitialMethods, MethodsByStep>;
    }

    get on(): GenerateStepOnMethods<Names, InitialMethods, MethodsByStep> {
        return new Proxy(this, {
            get(target, name: string) {
                if (target.names.includes(name)) {
                    return (handler: () => any) => target.get?.[name]?.extend?.({ handler });
                }
                return undefined;
            },
        }) as unknown as GenerateStepOnMethods<Names, InitialMethods, MethodsByStep>;
    }
};
