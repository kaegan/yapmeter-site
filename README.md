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
`https://github.com/kaegan/yapmeter/releases/latest/download/Yapmeter.zip`,
which GitHub always resolves to the newest release, so the link itself never
needs updating.

The version shown next to the button (`CURRENT_VERSION` in `src/main.js`) is
hand-updated per release rather than fetched at build time — there's no
build-time dependency on the GitHub API to keep working, and releases are
infrequent enough that a one-line edit is cheaper than the machinery. Bump
`CURRENT_VERSION` when a new Yapmeter version ships.
