# Studio Architecture

## Product boundary
Studio is the discovery, guidance, configuration, estimation and booking layer.

`Discover → Guide → Configure → Estimate → Book → Pay → Handoff`

The client/project lifecycle after confirmed booking belongs to the future Dashboard.

## Environments
- Local: active development and integration work.
- Preview: protected deployment for review and QA.
- Production: `studio.shashwataneja.com`, sourced only from `main`.

## Branching
- `main`: production.
- `feature/*`: isolated implementation work.
- Pull requests are reviewed before production merge.

## Security boundary
No secrets, payment credentials, customer data or production keys belong in the repository.
Production payment confirmation must eventually be server-authoritative through a provider webhook before client/project records are initialized.
Browsing and estimation should not create persistent client records.

## Phase 1
- React + TypeScript + Vite foundation.
- Persistent light/dark/system theme.
- Responsive product shell.
- Service capability model.
- Interactive Studio assistant foundation.
- CI typecheck/build gate.

## Next implementation boundaries
1. Service explorer and service-detail routes.
2. Build Your Project requirement engine.
3. What Do I Need? guided advisor.
4. Pricing catalog and rules engine as data.
5. Studio tools.
6. Booking, agreement and payment contracts.
7. Backend and webhook-authoritative handoff.
8. Protected preview, accessibility, SEO, performance and production QA.
