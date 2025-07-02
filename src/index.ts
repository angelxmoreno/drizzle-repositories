console.log('Hello via Bun!');

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
