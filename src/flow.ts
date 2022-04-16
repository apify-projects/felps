import type { JSONSchema7 } from 'json-schema';
import Base from './base';
import Step from './step';
import { FlowOptions } from './common/types';

export default class Flow extends Base {
    private _steps: Step[];
    private _output: JSONSchema7;

    constructor(options: FlowOptions) {
        const { name } = options || {};
        super({ key: 'flow', name });
        this.extend(options);
    }

    extend(options: Partial<FlowOptions>) {
        const { steps = [], output } = options || {};
        this._steps = steps || this._steps;
        this._output = output || this._output;
    }

    get steps() {
        return this._steps;
    }

    get output() {
        return this._output;
    }

    has(name: string) {
        return this._steps.some((step: Step) => step.name === name);
    }
}
