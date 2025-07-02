import { expect, test } from 'bun:test';
import { createRepository, type RepositoryConfig } from '../../src/index';
import { TEST_CONSTANTS, testUtils } from '../setup';

test('dummy test - should pass', () => {
    expect(1 + 1).toBe(2);
});

test('createRepository - returns repository instance', () => {
    const repo = createRepository();
    expect(repo).toBeDefined();
    expect(repo.hello).toBeTypeOf('function');
    expect(repo.hello()).toBe('Hello from Drizzle Repositories!');
});

test('RepositoryConfig - has correct dialect options', () => {
    const config: RepositoryConfig = TEST_CONSTANTS.SAMPLE_CONFIG;
    expect(TEST_CONSTANTS.DB_DIALECTS).toContain(config.dialect);
});

test('testUtils - fixture creation works', () => {
    const template = { name: 'test', value: 1 };
    const fixture = testUtils.createFixture(template, { name: 'updated', value: 2 });
    expect(fixture).toEqual({ name: 'updated', value: 2 });
});
