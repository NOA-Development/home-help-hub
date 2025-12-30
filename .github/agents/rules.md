# Repository Rules and Conventions

## Code Organization

### Docs-as-Code Approach
- **All documentation** must be placed in the `/docs` folder
- Keep the root directory clean and minimal
- Documentation includes:
  - Implementation summaries
  - Final summaries
  - Screenshots and visual assets
  - Technical specifications
  - Architecture diagrams

### Helper Files and Utilities
- **All helper files** must be placed in the `/utils` folder
- This includes:
  - Test utilities
  - Build scripts
  - Screenshot automation
  - Development tools
  - Agent utilities

### Root Directory
Keep the root directory minimal with only essential files:
- `package.json` - Project dependencies
- `README.md` - Project overview and quick start
- Configuration files (tsconfig, vite.config, etc.)
- `.gitignore`
- License file

## Code Style and Quality

### TypeScript Standards
- Use TypeScript strict mode
- Always define proper types and interfaces
- Avoid `any` types unless absolutely necessary
- Use meaningful variable and function names

### React Best Practices
- Use functional components with hooks
- Follow React hooks rules (useEffect dependencies)
- Extract magic numbers to named constants
- Keep components focused and single-purpose

### Code Quality
- Run linter before committing: `npm run lint`
- Build code to verify: `npm run build`
- Fix all linting errors in new code
- Maintain existing code quality standards

## Documentation Standards

### Inline Documentation
- Add comments for complex logic
- Document public APIs and exported functions
- Keep comments concise and meaningful
- Update comments when code changes

### README Files
- Keep README.md focused on essential information
- Include architecture diagrams when helpful
- Use Mermaid for diagrams
- Add deployment links
- Document setup and build process

## Security

### Best Practices
- Never commit secrets or API keys
- Use environment variables for sensitive data
- Run security scans before merging
- Address vulnerabilities promptly

## Git Workflow

### Commit Messages
- Use clear, descriptive commit messages
- Follow conventional commit format when possible
- Reference issue numbers when applicable

### Pull Requests
- Keep PRs focused and small
- Update documentation with code changes
- Ensure all tests pass
- Address review feedback promptly
