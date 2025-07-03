# 🧱 Drizzle Repositories

[![CI](https://github.com/angelxmoreno/drizzle-repositories/workflows/CI/badge.svg)](https://github.com/angelxmoreno/drizzle-repositories/actions)
[![NPM Version](https://img.shields.io/npm/v/drizzle-repositories)](https://www.npmjs.com/package/drizzle-repositories)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Type-safe, extensible repository classes for Drizzle ORM with multi-dialect support. Generate clean, maintainable repository patterns for PostgreSQL, MySQL, and SQLite with dependency injection and customizable code generation.

## ✨ Features

- **🤖 Automatic Code Generation**: Zero boilerplate - generate complete repository classes from your Drizzle schemas
- **🚀 Multi-dialect Support**: PostgreSQL, MySQL, and SQLite
- **🔒 Type Safety**: Leverages Drizzle's `InferSelectModel` and `InferInsertModel` with native SQL expressions
- **🏗️ Three-Layer Architecture**: Base → Generated → Custom repositories
- **💉 Dependency Injection**: TSyringe-based with sub-container isolation
- **⚡ Built with Bun**: Fast development and testing experience
- **🎯 Zero Configuration**: Works out-of-the-box with sensible defaults
- **🔍 Native Drizzle Integration**: Uses Drizzle's SQL expressions and database types directly

## 📦 Installation

```bash
npm install drizzle-repositories
# or
yarn add drizzle-repositories
# or
bun add drizzle-repositories
```

## 🚀 Quick Start

### Basic Usage (No DI)

```typescript
import { createRepository } from 'drizzle-repositories';
import { db } from './db';

const repo = createRepository();
console.log(repo.hello()); // "Hello from Drizzle Repositories!"
```

### Configuration Example

```typescript
import type { RepositoryCodegenConfig } from 'drizzle-repositories';

const config: RepositoryCodegenConfig = {
  dialect: 'pg',
  schemaPath: './src/schema/*.ts',
  outputPath: './src/repositories/generated',
  basePath: './src/repositories/base'
};
```

### CLI Usage

Generate repository classes from your Drizzle schema:

```bash
# Initialize configuration file
npx drizzle-repositories init

# Generate repositories from schema
npx drizzle-repositories generate

# Validate existing repositories
npx drizzle-repositories validate

# Generate with options
npx drizzle-repositories generate --config ./my-config.ts --verbose --dry-run
```

## 🏗️ Architecture

### Three-Layer Repository Pattern

```
Layer 1: BaseRepository (shared, abstract methods)
├── BasePgRepository (PostgreSQL-specific)
├── BaseMySQLRepository (MySQL-specific) 
└── BaseSQLiteRepository (SQLite-specific)

Layer 2: BaseUserRepository (generated, ephemeral, always overwritten)

Layer 3: UserRepository (developer's custom queries, never overwritten)
```

### Supported Dialects

- **PostgreSQL**: Native `NodePgDatabase` types, `RETURNING` clause support, `ON CONFLICT` handling
- **MySQL**: Native `MySql2Database` types, `ON DUPLICATE KEY UPDATE` support, MySQL-specific optimizations  
- **SQLite**: Native `BetterSQLite3Database` types, simplified transaction handling, file-based operations

## 🛠️ Development

This project is built with [Bun](https://bun.sh) for optimal performance.

### Prerequisites

- Bun 1.1.38 or later
- TypeScript 5.0 or later
- Drizzle ORM 0.28.0 or later

### Setup

```bash
# Clone the repository
git clone https://github.com/angelxmoreno/drizzle-repositories.git
cd drizzle-repositories

# Install dependencies
bun install

# Run development server
bun run dev

# Run tests
bun test

# Run tests in watch mode
bun run test:watch
```

### Available Scripts

```bash
bun run dev          # Start development server with hot reload
bun run build        # Build for production
bun run test         # Run all tests
bun run test:watch   # Run tests in watch mode
bun run check-types  # TypeScript type checking
bun run lint         # Code linting
bun run lint:fix     # Fix linting issues
bun run ci           # Run full CI pipeline (lint + types + test)
```

## 🧪 Testing

Comprehensive test suite with:

- **Unit Tests**: Individual method testing with Bun Test
- **Integration Tests**: Full database operations across all dialects
- **CLI Tests**: Command-line interface functionality (planned)
- **Generation Tests**: Code generation accuracy and safety (planned)

```bash
# Run all tests
bun test

# Run specific test suites
bun test test/unit/
bun test test/integration/

# Run with coverage (when implemented)
bun test --coverage
```

## 📁 Project Structure

```
src/                          # Source code
├── index.ts                  # Main entry point
└── (planned structure)
    ├── cli/                  # CLI commands and parsing
    ├── core/                 # Core business logic
    ├── repositories/         # Base repository classes
    ├── container/            # DI container setup
    └── types/                # Global type definitions

test/                         # Test files
├── setup.ts                  # Global test configuration
├── unit/                     # Unit tests
├── integration/              # Integration tests
├── fixtures/                 # Test data and fixtures
└── helpers/                  # Test utilities

docs/                         # Documentation
├── project-overview.md       # Complete project specification
└── tasks.md                  # Implementation tasks and progress
```

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) and feel free to submit issues and pull requests.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run the test suite (`bun run ci`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Please format your commits as:

```
type(scope): description

feat: add new feature
fix: resolve bug
docs: update documentation
test: add test coverage
chore: update dependencies
```

## 📋 Roadmap

See [docs/tasks.md](./docs/tasks.md) for detailed implementation progress.

### Phase 1: Foundation ✅
- [x] Project setup with tooling (Biome, Lefthook, TypeScript)
- [x] Core type definitions and configuration system
- [x] Basic CLI structure with Commander.js
- [x] Docker Compose setup for test databases

### Upcoming Phases
- **Phase 2**: Core Logic (Schema parsing, Template generation)
- **Phase 3**: Code Generation (File generation, CLI commands)
- **Phase 4**: Dependency Injection (TSyringe container setup)
- **Phase 5**: Testing & Documentation
- **Phase 6**: Polish & Distribution

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Angel S. Moreno**

- GitHub: [@angelxmoreno](https://github.com/angelxmoreno)
- Project: [drizzle-repositories](https://github.com/angelxmoreno/drizzle-repositories)

## 🙏 Acknowledgments

- [Drizzle ORM](https://orm.drizzle.team/) for the excellent TypeScript ORM
- [Bun](https://bun.sh) for the fast JavaScript runtime
- [Biome](https://biomejs.dev/) for code formatting and linting
- [Lefthook](https://github.com/evilmartians/lefthook) for Git hooks management
