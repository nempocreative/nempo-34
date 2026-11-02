# Sub-app rules

Rules here apply to files under `src/apps/`. Read this before changing them.

- Sub-app stylesheets (`src/apps/*/index.css`) can end up loaded on main-site pages, so they must never set shared theme variables (`--primary`, `--primary-foreground`, ...) to placeholder values; why: a leaked placeholder made white text on every main-site page fall back to dark.
