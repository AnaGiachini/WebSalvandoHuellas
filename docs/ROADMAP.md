# Professional Roadmap

This roadmap prioritizes improvements that would make the project stronger as a backend portfolio project and more useful for a real animal rescue organization.

## Short Term

- Keep `.env.example` files updated and keep secrets out of the repository.
- Keep local frontend/backend ports documented and consistent.
- Improve required environment variable validation at backend startup.
- Add frontend tests that cover the real application flow.
- Keep setup, scripts and architecture documentation updated.
- Add screenshots to the README when there is a stable public demo.

## Product Improvements

- Dashboard with published animals, pending requests, approved adoptions, monthly donations, store sales and upcoming events.
- More detailed adoption request states: received, in review, interview, approved, rejected and follow-up.
- Animal history: rescue, treatments, vaccines, neutering, foster care, adoption and follow-up.
- Adopter profile with request history and contact information.
- Veterinary expense records linked to each animal.
- Donations assigned to specific goals such as food, medicine, neutering or transport.
- Downloadable reports for accountability.

## Communication

- Email notifications for received requests, status changes and approved adoptions.
- Response templates for admins.
- Post-adoption follow-up reminders.
- Automatic donor messages with receipt and thank-you notes.

## Security And Operations

- Rate limiting for auth and contact endpoints.
- Mercado Pago webhook signature validation.
- Basic audit trail for admin actions.
- Structured logs for important errors.
- Documented database backups.
- More granular roles: admin, volunteer, treasury and adoptions.

## Technical Quality

- More integration tests for critical flows.
- Tests for the main frontend components.
- CI with GitHub Actions: lint, test and build.
- Complete and versioned migrations.
- Safe demo seeders for portfolio use.
- OpenAPI/Swagger documentation for the API.

## Portfolio

- README with screenshots, demo link and test credentials if a public demo is available.
- Short video showing the adoption flow, purchase flow and admin panel.
- Public frontend deployment.
- Public backend deployment with a demo database.
- Issues organized with labels like `bug`, `feature`, `documentation` and `good first issue`.
- Releases with changelog.
