# Contributing to Drizzle Repositories

Thank you for your interest in contributing to Drizzle Repositories! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- **Bun 1.1.38+**: [Install Bun](https://bun.sh/docs/installation)
- **TypeScript 5.0+**: Included as peer dependency
- **Drizzle ORM 0.28.0+**: Required for development and testing
- **Git**: For version control

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/drizzle-repositories.git
   cd drizzle-repositories
   ```
3. **Install dependencies**:
   ```bash
   bun install
   ```
4. **Install Git hooks** (Lefthook):
   ```bash
   bunx lefthook install
   ```

## 🛠️ Development Workflow

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   bun run ci  # Runs lint, type-check, and tests
   ```

4. **Commit your changes** using conventional commits:
   ```bash
   git commit -m "feat: add amazing new feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Available Scripts

```bash
# Development
bun run dev          # Start development server with hot reload
bun run build        # Build for production

# Testing
bun test             # Run all tests
bun run test:watch   # Run tests in watch mode
bun test test/unit/  # Run specific test suite

# Code Quality
bun run lint         # Check code style
bun run lint:fix     # Fix auto-fixable issues
bun run check-types  # TypeScript type checking
bun run ci           # Full CI pipeline (recommended before commits)
```

## 📝 Coding Standards

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `test`: Test additions or modifications
- `refactor`: Code refactoring
- `chore`: Maintenance tasks
- `style`: Code formatting (not affecting functionality)

**Examples:**
```bash
feat: add PostgreSQL repository generator
fix: resolve type inference issue in base repository
docs: update README installation instructions
test: add integration tests for MySQL dialect
refactor: simplify template generation logic
chore: update dependencies to latest versions
```

### Code Style

- **Formatting**: Handled automatically by Biome
- **Linting**: Enforced by Biome with project-specific rules
- **TypeScript**: Strict mode enabled, avoid `any` types
- **Imports**: Organized automatically by Biome
- **File Structure**: Follow existing patterns in the codebase

### Pre-commit Hooks

Lefthook automatically runs before each commit:
- **Linting**: Code style checks
- **Type checking**: TypeScript validation
- **Tests**: Unit and integration tests

If any check fails, the commit will be blocked. Fix the issues and try again.

## 🧪 Testing Guidelines

### Test Structure

```
test/
├── unit/           # Unit tests for individual functions/classes
├── integration/    # Integration tests for database operations
├── fixtures/       # Test data and mock schemas
├── helpers/        # Shared test utilities
└── setup.ts        # Global test configuration
```

### Writing Tests

- **Use descriptive test names**: Explain what the test validates
- **Follow AAA pattern**: Arrange, Act, Assert
- **Use test fixtures**: Leverage existing sample data when possible
- **Mock external dependencies**: Keep tests isolated and fast

**Example:**
```typescript
import { test, expect } from 'bun:test';
import { createRepository } from '../../src/index';

test('createRepository - should return repository with hello method', () => {
    // Arrange
    const expectedMessage = 'Hello from Drizzle Repositories!';
    
    // Act
    const repository = createRepository();
    const result = repository.hello();
    
    // Assert
    expect(result).toBe(expectedMessage);
});
```

### Test Requirements

- **Unit tests**: Required for all new functions and classes
- **Integration tests**: Required for database operations and CLI commands
- **Coverage**: Aim for meaningful coverage, not just metrics
- **Performance**: Tests should run quickly (under 30 seconds total)

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project conventions
- [ ] Tests pass locally (`bun run ci`)
- [ ] Documentation is updated (if applicable)
- [ ] Commit messages follow conventional format
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Testing
- [ ] Added/updated unit tests
- [ ] Added/updated integration tests
- [ ] All tests pass locally

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

### Review Process

1. **Automated checks**: CI pipeline must pass
2. **Code review**: At least one maintainer review required
3. **Testing**: Reviewer may test functionality locally
4. **Merge**: Squash and merge preferred for clean history

## 🐛 Bug Reports

### Before Reporting

- Search existing issues to avoid duplicates
- Try to reproduce with minimal example
- Test with latest version

### Bug Report Template

- **Environment**: OS, Bun version, TypeScript version
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Reproduction steps**: Minimal steps to reproduce
- **Code samples**: Relevant code snippets

## 💡 Feature Requests

### Guidelines

- **Alignment**: Should fit project goals and architecture
- **Use cases**: Provide concrete examples of usage
- **Implementation**: Consider complexity and maintenance burden
- **Breaking changes**: Avoid when possible

### Process

1. **Discussion**: Open an issue to discuss the feature
2. **Approval**: Wait for maintainer feedback before implementing
3. **Implementation**: Follow development workflow
4. **Documentation**: Update relevant docs and examples

## 📞 Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions and ideas
- **Email**: Contact project maintainer directly for sensitive issues

## 🙏 Recognition

Contributors will be:
- Listed in project contributors
- Mentioned in release notes for significant contributions
- Credited in documentation for major features

Thank you for helping make Drizzle Repositories better!