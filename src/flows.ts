import { GenerateObject } from './common/types';
import Flow from './flow';
import Step from './step';

export default class Flows<Names = ''> {
  items: GenerateObject<Names, Flow>;

  add(name: Extract<Names, string>, steps: Step[] = []) {
    this.items[name] = new Flow({ name });
    this.items[name].add(...steps);
  }
};
