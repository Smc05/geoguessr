# GitHub Copilot Instructions for geoguessr

## Repository Overview
This is a GeoGuessr-related project. GeoGuessr is a geography game that challenges players to identify locations based on visual clues from panoramic street view imagery.

## Project Structure
This repository is currently in early stages with minimal setup. As the project grows, maintain clear organization:
- Keep documentation up to date
- Organize code by feature/module
- Follow consistent naming conventions

## Coding Standards
- Write clear, readable, and maintainable code
- Use meaningful variable and function names
- Add comments for complex logic
- Follow language-specific best practices and idioms
- Keep functions small and focused on a single responsibility

## Documentation
- Update README.md with setup instructions, usage, and contribution guidelines
- Document all public APIs and interfaces
- Include examples where helpful
- Keep documentation in sync with code changes

## Development Workflow
1. **Before making changes:**
   - Understand the existing codebase
   - Read relevant documentation
   - Check for existing tests

2. **When adding features:**
   - Start with a clear understanding of requirements
   - Write tests alongside code (if test infrastructure exists)
   - Ensure changes are minimal and focused
   - Update documentation to reflect changes

3. **Code quality:**
   - Write self-documenting code
   - Avoid premature optimization
   - Prioritize readability over cleverness
   - Handle edge cases appropriately

## Testing
- Add tests for new functionality when test infrastructure is available
- Ensure tests are clear and focused
- Test edge cases and error conditions
- Keep tests independent and repeatable

## Git Practices
- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Reference issues in commit messages when applicable
- Use meaningful branch names

## Security
- Never commit sensitive data (API keys, passwords, tokens)
- Validate and sanitize user inputs
- Follow security best practices for the technologies used
- Be mindful of common vulnerabilities (XSS, SQL injection, etc.)

## Best Practices
- **DRY (Don't Repeat Yourself):** Extract common patterns into reusable functions
- **KISS (Keep It Simple, Stupid):** Choose simple solutions over complex ones
- **YAGNI (You Aren't Gonna Need It):** Don't add functionality until it's needed
- **Code Review:** All changes should be reviewable and understandable
- **Performance:** Consider performance implications, but prioritize correctness first

## Helpful Context
- This is a geography/location-based project
- Features may involve maps, location data, image processing, or game mechanics
- User experience and accuracy are important considerations
- Consider internationalization for geography-related features

## When Unsure
- Ask for clarification rather than making assumptions
- Check existing patterns in the codebase
- Refer to official documentation for libraries/frameworks used
- Suggest multiple approaches when trade-offs exist
