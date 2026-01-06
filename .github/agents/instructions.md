# Agent Instructions for Home Help Hub

## General Guidelines

When working on this repository, agents should:

1. **Follow the docs-as-code approach**
   - Place all documentation in `/docs`
   - Place all helper files in `/utils`
   - Keep root directory clean

2. **Maintain code quality**
   - Run `npm run lint` before committing
   - Run `npm run build` to verify changes
   - Fix all linting errors in modified code
   - Follow TypeScript best practices

3. **Update documentation**
   - Update relevant docs when making changes
   - Keep README.md concise and focused
   - Use Mermaid diagrams for architecture
   - Update screenshots when UI changes

## Project Structure

```
home-help-hub/
├── docs/                    # All documentation
│   ├── screenshots/        # UI screenshots
│   ├── FINAL_SUMMARY.md   # Project completion summary
│   └── IMPLEMENTATION_SUMMARY.md  # Technical details
├── utils/                  # Helper files and utilities
│   └── take-screenshots.ts # Screenshot automation
├── src/                    # Application source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   └── lib/              # Utility libraries
├── public/                # Static assets
└── [config files]         # Root level configs only
```

## Common Tasks

### Adding New Features
1. Plan changes and create minimal PRs
2. Write or update tests if applicable
3. Update relevant documentation
4. Capture screenshots for UI changes
5. Run linter and build
6. Commit with descriptive message

### Refactoring Code
1. Make small, focused changes
2. Ensure tests still pass
3. Update inline documentation
4. Run linter to verify code style
5. Keep existing functionality intact

### Updating Documentation
1. Place new docs in `/docs` folder
2. Update README.md if architecture changes
3. Use Mermaid for diagrams
4. Keep documentation clear and concise
5. Update screenshots if UI changed

### Adding Utilities
1. Place all utilities in `/utils` folder
2. Document the utility's purpose
3. Export functions properly
4. Add TypeScript types
5. Update relevant docs if needed

## Technology Stack

This project uses:
- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn-ui + Radix UI
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + OpenStreetMap
- **Testing**: Playwright for E2E
- **State**: React hooks + Tanstack Query

## Build and Test Commands

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Production build
npm run build:dev    # Development build

# Quality
npm run lint         # Run linter
npm run preview      # Preview production build
```

## Important Notes

- Never remove or modify working functionality
- Always test changes locally before committing
- Use the existing design system and components
- Follow the established code patterns
- Keep the root directory clean
- Document complex logic inline
- Update README.md for major changes only
