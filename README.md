# yapmeter-site

The marketing site at yapmeter.com. Static Vite site, deploys to Vercel on
push to `main`.

## Build and run

```
npm install
npm run dev
```

## Release version

The download button links to
`https://github.com/kaegan/yapmeter/releases/latest/download/Yapmeter.dmg`,
which GitHub always resolves to the newest release, so the link itself never
needs updating.

The version shown next to the button (`CURRENT_VERSION` in `src/main.js`) is
a string in the source rather than fetched at build time — there's no
build-time dependency on the GitHub API to keep working, and releases are
infrequent enough that a one-line edit is cheaper than the machinery. It is
not updated by hand, though: the `release` skill in the yapmeter repo
(`.claude/skills/release/`) bumps it and opens the PR as the last step of
every release, after the GitHub release exists. Four releases shipped with
the site still saying v0.1.2 before that step was made part of the
procedure.
