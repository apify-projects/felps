import Actor from '@usefelps/core--actor';
import Step from '@usefelps/core--step';


describe('Step.create', () => {
    const actor = Actor.create({ name: 'actor' });

    beforeAll(async () => {
        await Actor.load(actor);
    });

    it('should fire handler', async () => {
        let value = false;
        const step = Step.create({
            name: 'TEST',
            async handler() { value = true; },
        });

        await Step.run(step, actor, undefined);
        expect(value).toBeTruthy();
    });
});
