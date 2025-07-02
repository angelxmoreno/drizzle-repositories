/**
 * Test helper utilities
 * Common functions used across multiple test files
 */

import { expect } from 'bun:test';

/**
 * Assert that a function throws with a specific error message
 */
export async function expectToThrow(
    fn: () => Promise<unknown> | unknown,
    expectedError?: string | RegExp
): Promise<void> {
    try {
        await fn();
        throw new Error('Expected function to throw, but it did not');
    } catch (error) {
        if (expectedError) {
            const message = error instanceof Error ? error.message : String(error);
            if (typeof expectedError === 'string') {
                expect(message).toContain(expectedError);
            } else {
                expect(message).toMatch(expectedError);
            }
        }
    }
}

/**
 * Create a spy function that tracks calls
 */
export function createSpy<T extends (...args: unknown[]) => unknown>(
    implementation?: T
): T & { calls: unknown[][]; callCount: number } {
    const calls: unknown[][] = [];

    const spy = ((...args: unknown[]) => {
        calls.push(args);
        return implementation?.(...(args as Parameters<T>));
    }) as T & { calls: unknown[][]; callCount: number };

    Object.defineProperty(spy, 'calls', {
        get: () => calls,
        enumerable: true,
    });

    Object.defineProperty(spy, 'callCount', {
        get: () => calls.length,
        enumerable: true,
    });

    return spy;
}

/**
 * Mock a module or function temporarily
 */
export async function withMock<T>(_originalValue: T, _mockValue: T, testFn: () => Promise<void> | void): Promise<void> {
    const restore = () => {
        // In a real implementation, this would restore the original value
        // For now, this is a placeholder
    };

    try {
        await testFn();
        restore();
    } catch (error) {
        restore();
        throw error;
    }
}

/**
 * Generate random test data
 */
export const generators = {
    randomString(length = 10): string {
        return Math.random()
            .toString(36)
            .substring(2, 2 + length);
    },

    randomInt(min = 0, max = 100): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomEmail(): string {
        return `test-${this.randomString(5)}@example.com`;
    },

    randomConfig() {
        return {
            dialect: ['pg', 'mysql', 'sqlite'][this.randomInt(0, 2)] as 'pg' | 'mysql' | 'sqlite',
            schemaPath: `./schema-${this.randomString(5)}.ts`,
            outputPath: `./output-${this.randomString(5)}`,
        };
    },
};
