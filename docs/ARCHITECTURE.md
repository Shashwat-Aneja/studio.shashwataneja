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

## Phase 1 scope

- React + TypeScript + Vite foundation.
- Theme persistence.
- Responsive application shell.
- Clear product journey.
- Component and data boundaries ready for the interactive Studio systems.
