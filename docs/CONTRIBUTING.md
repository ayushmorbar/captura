# Contributing to Captura

First off, thank you for considering contributing to Captura! 🎉 It's people like you that make the open source community such an amazing place to learn, inspire, and create.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Types of Contributions

We welcome many different types of contributions including:

- 🐛 **Bug fixes**
- 🚀 **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Tests and testing improvements**
- 🔧 **Tooling and infrastructure**

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/ayushmorbar/captura/labels/good%20first%20issue) if you're new to the project.

## Development Workflow

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/captura.git
cd captura

# Add upstream remote
git remote add upstream https://github.com/ayushmorbar/captura.git
```

### 2. Setup Development Environment

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### 3. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### 4. Make Your Changes

- Follow our [coding standards](#coding-standards)
- Write or update tests as needed
- Update documentation if required
- Test your changes locally

### 5. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add screen recording pause functionality"
```

### 6. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

## Coding Standards

### TypeScript

- **Strict mode**: We use TypeScript in strict mode
- **Type safety**: Prefer explicit types over `any`
- **Interfaces**: Use interfaces for object shapes
- **Enums**: Use const enums when possible

```typescript
// ✅ Good
interface RecordingOptions {
  quality: 'high' | 'medium' | 'low';
  audioEnabled: boolean;
}

// ❌ Avoid
const options: any = {
  quality: 'high',
  audioEnabled: true
};
```

### React Components

- **Functional components**: Use function components with hooks
- **Component names**: Use PascalCase
- **Props interfaces**: Define props interfaces
- **Default exports**: Use default exports for components

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button({ variant, children, onClick }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Styling

- **Tailwind CSS**: Use Tailwind classes for styling
- **Component variants**: Use `class-variance-authority` for component variants
- **Responsive design**: Always consider mobile-first approach
- **Dark mode**: Support both light and dark themes

```typescript
// ✅ Good - Using CVA for variants
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   └── feature/        # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── app/                # Next.js app directory
    ├── globals.css     # Global styles
    └── layout.tsx      # Root layout
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples

```bash
# Feature
git commit -m "feat: add screen recording pause functionality"

# Bug fix
git commit -m "fix: resolve audio sync issues during recording"

# Documentation
git commit -m "docs: update installation instructions"

# Performance
git commit -m "perf: optimize video encoding process"
```

## Pull Request Process

### Before Submitting

1. **Rebase your branch** on the latest `main`
2. **Run all tests** and ensure they pass
3. **Run linting** and fix any issues
4. **Update documentation** if needed
5. **Test your changes** thoroughly

### PR Title and Description

- Use a clear, descriptive title
- Reference any related issues
- Describe what changes were made and why
- Include screenshots for UI changes
- List any breaking changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other (specify)

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## Issue Guidelines

### Bug Reports

When reporting bugs, please include:

- **Browser and version**
- **Operating system**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots or recordings**
- **Console errors** (if any)

### Feature Requests

When requesting features, please include:

- **Problem description**
- **Proposed solution**
- **Alternative solutions considered**
- **Use cases**
- **Mockups or examples** (if applicable)

## Development Setup

### Required Tools

- **Node.js**: 18+ (LTS recommended)
- **pnpm**: Latest version (preferred package manager)
- **Git**: Latest version
- **VS Code**: Recommended editor with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Prettier
  - ESLint

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Captura"
```

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test -- Button.test.tsx
```

### Writing Tests

- Write tests for new features and bug fixes
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

```typescript
// Example test
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Documentation

### Updating Documentation

- Update README if you change functionality
- Add JSDoc comments to new functions
- Update API documentation for new components
- Include examples in documentation

### JSDoc Example

```typescript
/**
 * Starts screen recording with specified options
 * @param options - Recording configuration options
 * @param options.quality - Video quality setting
 * @param options.audioEnabled - Whether to include audio
 * @returns Promise that resolves when recording starts
 * @throws {Error} When screen capture is not supported
 */
export async function startRecording(options: RecordingOptions): Promise<void> {
  // Implementation
}
```

## Questions?

If you have questions, please:

1. Check existing [documentation](../docs)
2. Search [existing issues](https://github.com/ayushmorbar/captura/issues)
3. Join our [discussions](https://github.com/ayushmorbar/captura/discussions)
4. Create a new issue with the `question` label

## Thank You! 🙏

Your contributions make Captura better for everyone. We appreciate your time and effort!

---

**Happy contributing!** 🚀
