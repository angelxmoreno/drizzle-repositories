export interface CLIOptions {
    config?: string;
    verbose?: boolean;
}

export interface RepositoryCodegenConfig {
    dialect: 'pg' | 'mysql' | 'sqlite';
    schemaPath: string;
    outputPath: string;
    basePath: string;
    logging?: boolean;
    transactionTimeout?: number;
    pagination?: {
        defaultLimit: number;
        maxLimit: number;
    };
}
