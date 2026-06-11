# Clean Architecture Rules

## Dependency Direction

- `domain` depends on no framework and no infrastructure package.
- `application` depends on `domain` and interfaces only.
- `infrastructure` implements interfaces and owns ORM/external provider details.
- `presentation` maps HTTP requests/responses to application use cases.

## Required Rules

- Do not place business rules in controllers or React components.
- Do not expose TypeORM entities outside infrastructure.
- Do not pass raw Prisma/TypeORM records into domain code.
- Use DTO validation for all input.
- Use response mappers for public API output.
- Use repository interfaces in domain/application.
- Keep tenant authorization checks in use cases or guards before repository operations.
- Add README files for complex modules.

## Testing Expectations

- Unit test domain rules and use cases.
- Guard and authorization logic must have focused tests.
- Cross-tenant access must be covered by e2e or integration tests before release.
