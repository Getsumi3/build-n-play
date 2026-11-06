# Repository structure

BuildNPlay is a collection of ten small, independently developed games. The repository is organized as a multi-engine monorepo: each game owns its implementation and can use the engine and tooling that fit it.

## Layout

```text
build-n-play/
├── games/
│   ├── 01-one-button/
│   │   ├── web/
│   │   └── README.md
│   ├── 02-tiny-dungeon/
│   ├── 03-impossible-jump/
│   ├── 04-one-more-wave/
│   ├── 05-the-room/
│   ├── 06-lost-in-space/
│   ├── 07-tiny-shop/
│   ├── 08-last-player-standing/
│   ├── 09-a-story-in-5-minutes/
│   └── 10-the-final-boss/
├── shared/
│   ├── web/
│   ├── unity/
│   └── assets/
├── website/
├── docs/
└── README.md
```

Only create implementation directories when a project actually needs them; Git does not track empty directories.

## Boundaries

- Each game owns its source, assets, dependencies, build output, and engine-specific configuration.
- Web games may use TypeScript, Vite, Canvas 2D, and SCSS.
- Unity games keep their complete Unity project together, including `Assets/`, `Packages/`, and `ProjectSettings/`.
- Put genuinely reusable code in `shared/` only after more than one game needs it.
- Keep the root focused on the collection: project overview, repository-wide conventions, and documentation.
- Do not force all games into one framework or one release schedule.

## Current migration

The first project is One Button. Its existing Vite application is being moved into `games/01-one-button/web/` as a self-contained web project. Keep its existing configuration and source intact during the move.
