// Export CLI functionality
export { createCLI, main } from './cli/index.js';

// Export types
export type { CLIOptions, RepositoryCodegenConfig } from './types/cli.js';

// Placeholder exports for NPM module structure
export interface RepositoryConfig {
    dialect: 'pg' | 'mysql' | 'sqlite';
    schemaPath: string;
    outputPath: string;
}

export function createRepository() {
    // Placeholder implementation
    return {
        hello: () => 'Hello from Drizzle Repositories!',
    };
}
