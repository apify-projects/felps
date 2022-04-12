import Base from './base';
import Step from './step';
import { FlowOptions } from './common/types';

export default class Flow extends Base {
  private _steps: Step[];

  constructor(options: FlowOptions) {
    const { name } = options || {};
    super({ key: 'flow', name });
  }

  add(...steps: Step[]) {
    this._steps.push(...steps);
  }

  get steps() {
    return this._steps;
  }

  has(name: string) {
    return this._steps.some((step: Step) => step.name === name);
  }
}
