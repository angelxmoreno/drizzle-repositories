import { afterAll, afterEach, beforeAll, beforeEach } from 'bun:test';

/**
 * Global test setup configuration
 * This file runs before all tests and sets up the testing environment
 */

// Global test configuration
const TEST_CONFIG = {
    timeout: 30000, // 30 seconds default timeout
    retries: 0,
    verbose: process.env.NODE_ENV === 'test' || process.env.VERBOSE === 'true',
};

// Mock console methods if needed (can be toggled)
const MOCK_CONSOLE = process.env.MOCK_CONSOLE === 'true';

let originalConsole: typeof console;

beforeAll(async () => {
    console.log('🧪 Setting up test environment...');

    // Store original console methods
    if (MOCK_CONSOLE) {
        originalConsole = { ...console };
        console.log = () => {};
        console.warn = () => {};
        console.error = () => {};
    }

    // Set test environment variables
    process.env.NODE_ENV = 'test';

    console.log('✅ Test environment ready');
});

afterAll(async () => {
    console.log('🧹 Cleaning up test environment...');

    // Restore console methods
    if (MOCK_CONSOLE && originalConsole) {
        Object.assign(console, originalConsole);
    }

    console.log('✅ Test cleanup complete');
});

beforeEach(async () => {
    // Setup that runs before each test
    // This is where you might reset database state, clear caches, etc.
});

afterEach(async () => {
    // Cleanup that runs after each test
    // This is where you might clean up test data, reset mocks, etc.
});

// Export test utilities
export const testUtils = {
    config: TEST_CONFIG,

    /**
     * Creates a test database connection for integration tests
     */
    async createTestDb() {
        // Placeholder for future database setup
        return null;
    },

    /**
     * Cleanup test database
     */
    async cleanupTestDb() {
        // Placeholder for future database cleanup
        return;
    },

    /**
     * Generate test data fixtures
     */
    createFixture<T>(template: Partial<T>, overrides: Partial<T> = {}): T {
        return { ...template, ...overrides } as T;
    },

    /**
     * Wait for a specified amount of time (useful for async tests)
     */
    async wait(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
};

// Export common test constants
export const TEST_CONSTANTS = {
    DB_DIALECTS: ['pg', 'mysql', 'sqlite'] as const,
    SAMPLE_CONFIG: {
        dialect: 'pg' as const,
        schemaPath: './test/fixtures/schema.ts',
        outputPath: './test/fixtures/output',
    },
};
