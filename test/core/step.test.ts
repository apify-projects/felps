import Actor from '@usefelps/core--actor';
import Step from '@usefelps/core--step';

describe('Step.create', () => {
    const actor = Actor.create({ name: 'actor' });

    beforeAll(async () => {
        await Actor.load(actor);
    });

    it('should fire async handler()', async () => {
        let value = false;
        const step = Step.create({
            name: 'TEST',
            async handler() { value = true; },
        });

        await Step.run(step, actor, undefined);
        expect(value).toBeTruthy();
    });

    it('should fire async beforeHandler()', async () => {
        let value = 0;
        const step = Step.create({
            name: 'TEST',
            async handler() { value = 1; },
            async beforeHandler() { value = 2; },
        });

        await Step.run(step, actor, undefined);
        expect(value).toBe(1);
    });

    it('should fire async afterHandler()', async () => {
        let value = 0;
        const step = Step.create({
            name: 'TEST',
            async handler() { value = 1; },
            async afterHandler() { value = 2; },
        });

        await Step.run(step, actor, undefined);
        expect(value).toBe(2);
    });

    it('should fire async errorHandler()', async () => {
        let value = false;
        const step = Step.create({
            name: 'TEST',
            async handler() { throw Error('failed'); },
            async errorHandler() { value = true; },
        });

        await Step.run(step, actor, undefined).catch(() => null);
        expect(value).toBeTruthy();
    });

    // it('should fire async requestErrorHandler()', async () => {
    //     let value = false;
    //     const step = Step.create({
    //         name: 'TEST',
    //         async handler() { },
    //         async requestErrorHandler() { value = true; },
    //     });

    //     await Step.run(step, actor, undefined);
    //     expect(value).toBe(2);
    // });
});
