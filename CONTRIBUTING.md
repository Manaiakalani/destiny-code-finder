# Contributing to Destiny 2 Code Vault

First off, thank you for considering contributing to Code Vault! 🎮

## Code of Conduct

By participating in this project, you agree to maintain a welcoming and inclusive environment for all contributors.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting a bug, include:**

- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

### 💡 Suggesting Features

Feature suggestions are welcome! Please:

1. Check if the feature has already been suggested
2. Provide a clear description of the feature
3. Explain why it would be useful
4. Consider how it fits with the project's goals

### 🔧 Pull Requests

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
4. **Make your changes** following our coding standards
5. **Test** your changes locally
6. **Commit** with clear, descriptive messages:
   ```bash
   git commit -m "feat: add new emblem source"
   git commit -m "fix: resolve code card display issue"
   ```
7. **Push** to your fork
8. **Open a Pull Request** with a clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/destiny-code-finder.git
cd destiny-code-finder

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type when possible

### React

- Use functional components with hooks
- Keep components focused and reusable
- Use proper prop typing

### Styling

- Use Tailwind CSS classes
- Follow the existing design system
- Maintain responsive design

### File Organization

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Route pages
├── services/       # API and data services
├── types/          # TypeScript definitions
└── lib/            # Utility functions
```

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `chore:` Maintenance tasks

## Adding New Emblem Sources

When adding a new code source:

1. Add scraper function in `src/services/codeScraperService.ts`
2. Update `getAllEmblemCodes()` to include the new source
3. Add proper error handling
4. Test with various scenarios
5. Update documentation

## Questions?

Feel free to open an issue for any questions or reach out on:

- GitHub Issues
- Twitter: [@manaiakalani](https://twitter.com/manaiakalani)

---

Thank you for helping make Code Vault better for the Destiny 2 community! 🚀
