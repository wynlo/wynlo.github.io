# Wayne Loh Personal Site

Static editorial site built with Next.js, Markdown, Pages CMS, Tailwind CSS, and GitHub Pages.

See [`docs/deployment-and-content.md`](docs/deployment-and-content.md) for the complete GitHub Pages and Pages CMS setup guide.

## Local development

Use Node 22:

```bash
nvm use
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3001`.

## Content management

Articles are Markdown files in `content/articles`. Pages CMS uses `.pages.yml` to provide a browser editor for their frontmatter and body content.

To connect the site:

1. Push this project to the `USERNAME.github.io` repository associated with the GitHub account.
2. Sign in at [Pages CMS](https://app.pagescms.org/).
3. Select the repository and its `main` branch.
4. Open **Articles** to edit an existing article or create one.
5. Save the article. Pages CMS commits it to GitHub and the deployment workflow publishes the update.

The article body supports Markdown, fenced code blocks, Mermaid diagrams, and images. Uploaded images are committed under `public/media`.

Set **Draft** while an article should remain unpublished. A future publish date is also excluded until a build runs after that date. Because drafts are committed to Git, do not store sensitive drafts in a public repository.

## GitHub Pages deployment

The workflow at `.github/workflows/deploy-pages.yml` builds and deploys the static `out` directory whenever `main` changes.

In the GitHub repository:

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Open **Settings → Secrets and variables → Actions → Variables**.
4. Add any public values used by the build:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_EMAIL` | Contact email and email links |
| `NEXT_PUBLIC_LINKEDIN_URL` | LinkedIn profile URL |
| `NEXT_PUBLIC_STUDIO_URL` | Reserved external studio URL |
| `NEXT_PUBLIC_STUDIO_NAME` | Studio name; defaults to Potatoheads |

`NEXT_PUBLIC_SERVER_URL` and the project base path are derived automatically from the repository by the workflow.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

The production build is a static export in `out`.
