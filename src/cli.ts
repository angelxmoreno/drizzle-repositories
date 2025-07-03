#!/usr/bin/env node

/**
 * CLI binary entry point for the Drizzle Repository Codegen Framework.
 *
 * This file serves as the executable entry point when the package is installed
 * and users run `npx drizzle-repositories <command>`. It imports and executes
 * the main CLI functionality.
 *
 * @since 0.1.0
 */

import { main } from './cli/index.js';

// Execute the CLI
main().catch((error) => {
    console.error('CLI Error:', error);
    process.exit(1);
});
