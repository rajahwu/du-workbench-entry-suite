# Dudael Entry Suite (Workspace Root)

This monorepo contains the core engine, web clients, and system documentation for Dudael.

## Architecture Shape

* **`apps/bell-runner/`**: The core state machine and game engine.
    * `engine/`: Pure TypeScript state machine (no React/UI logic). Governs the 7-phase loop via `manager.ts`.
    * `web/`: The Vite + React 19 frontend. Consumes the engine via `bell-bridge`.
* **`apps/du-system-library/`**: The living archive, brand guide, and lore repository.
* **`apps/lattice-run-ledger/`**: The canonical logging system for narrative and gameplay runs.
* **`packages/`**: Shared libraries, including database models (Sequelize) and core UI components.

## Stack Rules
* **Frontend**: React 19, Tailwind v4, React Router v7.
* **Engine**: Pure functions, strict boundaries (The Five-Node Invariant).
* **State**: Redux Toolkit + TanStack Query for remote state.