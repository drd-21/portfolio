# Personal portfolio — editable, fast, deployable

A polished **dark/light personal portfolio** with an accessible native project-detail dialog, mobile navigation, project category filters, smooth scrolling, reveal effects, all requested content sections, a generated on-page CV, embedded PDF previews, a configured Formspree contact form, and Pages CMS editing.

**Selected technology:** plain HTML, CSS and modern JavaScript (ES modules). No frameworks, dependencies, database, bundler or package install are necessary. This was an allowed option in the original brief and makes the site easy to inspect, maintain and host.

## 1. Run locally

Install [Node.js 20 or newer](https://nodejs.org) (Node is only needed for the included local preview and optional build scripts).

```bash
# Inside the extracted folder:
npm run dev
```

In **Windows PowerShell**, if you see an error that `npm.ps1` cannot be loaded because script execution is disabled, run the Windows command shim instead:

```powershell
npm.cmd run dev
```

Use the same `npm.cmd` prefix for the other npm commands below when running them in PowerShell (for example, `npm.cmd run build`). This avoids changing your PowerShell execution policy.

Open **http://127.0.0.1:3000**. Don't double-click `index.html` using `file://`, because browsers usually block ES module imports across `file://` URLs.

Alternative local server if you do not want Node:

```bash
python -m http.server 3000
```

## 2. Edit the live site without code (Pages CMS)

The editable source of portfolio content is the JSON under `content/`; `src/data.js` is generated and must not be edited by hand.

### One-time Pages CMS setup

1. Open [Pages CMS](https://app.pagescms.org/) and sign in with GitHub.
2. Authorize Pages CMS for the `drd-21/portfolio` repository. Grant access only to this repository if GitHub offers that choice.
3. Select the `main` branch. Pages CMS reads the root [`.pages.yml`](./.pages.yml) configuration from that branch.
4. In **Repository → Settings → Pages**, confirm **Build and deployment → Source: GitHub Actions**. The deployment workflow is [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml).
5. Confirm the current Actions deployment succeeds before making content changes.
6. After authorizing Pages CMS, make a small reversible test edit and verify its GitHub commit starts the workflow. The hosted CMS's authenticated save flow cannot be tested until your account authorizes the repository.

Pages CMS edits are Git commits, not an instant database update. Saving content commits files to GitHub; a push to `main` is configured to start the existing Actions build and publish `dist/`. Only authorized GitHub users can edit; the public website has no admin login or editing endpoint.

### Daily editing

1. Sign in at [app.pagescms.org](https://app.pagescms.org/) and open `drd-21/portfolio` on `main`.
2. Select the section in the sidebar: Profile and Hero, About Me, Education, Experience and Leadership, Skills, Projects, Certifications and Awards, On-page CV, Resume and CV, Social Media, Contact Information, or Website Settings and SEO.
3. Edit fields, upload media using the image/PDF controls, then save/commit to `main`.
4. Open the repository's **Actions** tab and wait for **Deploy portfolio to GitHub Pages** to complete successfully. Refresh [the live portfolio](https://drd-21.github.io/portfolio/) to see the deployed version.

Use the Projects collection to add/edit/delete project JSON records. Set **Published on website** to control visibility, **Display order** to position it, and use the upload control for a thumbnail/screenshots. IDs must be lowercase letters, numbers, and hyphens. Do not add GitHub/demo links unless those destinations are real.

Education, experience, and skill records can be reordered in their editors. Skills support an optional plain-text description; no proficiency percentages are generated. Keep credentials empty until they can be verified. Update social URLs in Social Media; blank links are not shown.

Upload profile/project/certificate images through Pages CMS, not by typing an absolute `/assets/...` URL. Upload resume/CV PDFs through Resume and CV. Pages CMS stores relative `assets/uploads/...` paths; the generator normalizes them to `./assets/uploads/...` so links work below `/portfolio/` on GitHub Pages as well as in local previews. Existing sample PDFs remain until their paths are changed to uploaded real documents.

The current public form uses Formspree ID `mvkzwlda`. Contact Information exposes the public form ID for editing; never enter a private API key. Form validation, loading, success, and error handling remain in place.

### Local content development

Edit JSON in `content/` and run `npm.cmd run dev`. `src/data.js` is rebuilt automatically before dev, checks, tests, and production builds. Run `npm.cmd run build` to generate deployable `dist/`, or `npm.cmd run test` to build and run the CMS-content and HTTP smoke tests. Invalid JSON, unsafe paths/URLs, duplicate IDs, missing assets, and malformed required fields make generation fail with an explicit error.

### Troubleshooting Pages CMS

- **Repository unavailable or edits denied:** sign in with an account that has write access, authorize Pages CMS for this repository, and select `main`.
- **A save does not deploy:** check that the Pages CMS commit landed on `main`, then inspect the Actions tab. Verify GitHub accepted the app's commit as a push event; do not change the site to another host.
- **Build fails:** open the failing `build-deploy` job. Fix invalid/missing JSON fields or asset references in Pages CMS, save, and wait for the next run. Restore a previous content version using the affected file's GitHub **History** and **Revert** action.
- **Image/PDF 404:** choose the uploaded file using the media picker. CMS media output uses the relative `assets/uploads/...` path, check the file is committed under `assets/uploads/`, and wait for deployment. Do not start the URL with `/assets/` because this site is hosted below `/portfolio/`.
- **Project missing:** check **Published on website**, required fields, unique lowercase project ID, and whether the project JSON file is in `content/projects/`.
- **Pages CMS configuration errors:** verify `.pages.yml` is at repository root on `main`, and use the supported field types and options defined there; `src/data.js` is generated, not an editable CMS file.

### Change colors

Edit `:root` (dark) and `:root[data-theme="light"]` in `src/styles.css`. For accessibility, if you change accents, check text contrast in *both* color themes.

## 3. Connect the contact form (Formspree)

You do **not** need a custom backend, Supabase, or private API key to send messages with this setup.

The site is already configured with the supplied public Formspree form ID `mvkzwlda`. Verify the destination email and allowed-domain/spam settings in the Formspree dashboard. If you intentionally replace the form, enter its new public form ID in **Contact Information** in Pages CMS, save, and check a test submission in the dashboard and inbox.

The form includes name, email, subject and message validation, basic honeypot spam protection, disabled/loading state, a 15-second timeout, and distinct success/error messages. A public Formspree form ID is safe to include client-side; do not put private credentials in Pages CMS or JavaScript.

## 4. Build and test

```bash
npm run check        # JavaScript syntax checks
npm run build        # generates deployable dist/ and static SEO tags
npm run test         # build output + local HTTP smoke checks
npm run preview      # preview dist/ at http://127.0.0.1:4173
```

The built `dist/` folder contains everything your host needs: `index.html`, `src/`, `assets/`, `robots.txt` and `sitemap.xml`. It is generated from CMS JSON before the build.

### SEO and sharing

Change the matching fields in Pages CMS (or `content/site.json` / `content/seo.json` locally). The build script writes these values directly into the static HTML `<title>`, meta description, Open Graph/Twitter tags, canonical link and JSON-LD profile, so link previews don't depend on JavaScript rendering. It also generates `robots.txt` and a minimal `sitemap.xml`.

The production URL is `https://drd-21.github.io/portfolio/`. Keep the repository path in this value when editing SEO settings.

## 5. Deploy to GitHub Pages

1. The project is hosted in `drd-21/portfolio` on the `main` branch.
2. Keep `websiteUrl` set to `https://drd-21.github.io/portfolio/`.
3. Open **Repository → Settings → Pages**, and set **Build and deployment → Source: GitHub Actions**.
4. The workflow runs on pushes to `main`, including Pages CMS commits made with the authorized GitHub integration. It validates content, builds, and deploys `dist/`.
5. Wait for the deployment workflow and open the Pages URL.

All app links and CMS-uploaded asset paths are relative, so they work at this repository subpath.

## 6. Pre-publication checklist

- [ ] Confirm the public name, initials, contact details and production URL.
- [ ] Confirm all example bios, education dates, experience, project claims and skill levels.
- [ ] Replace sample PDFs with your real résumé and CV; verify downloaded files.
- [ ] Replace placeholder profile portrait, project illustrations and social preview branding.
- [ ] Add valid social, repository, demo and certification links.
- [ ] Confirm Formspree delivery in the Formspree dashboard and inbox.
- [ ] Check desktop, tablet and mobile layouts, keyboard navigation and light/dark contrast.
- [ ] Run `npm run check`, `npm run build` and `npm run test`.
- [ ] Inspect the final social preview tags and sitemap using your real deployed URL.

## Accessibility and security notes

The page uses semantic sections, alt text, visible focus outlines, keyboard-operable controls, `aria-current` active navigation, native `<dialog>` focus management, meaningful labels and errors for the form, a skip link and reduced-motion support. The host configs add basic `nosniff`, referrer, frame and permissions headers. The site collects only the information visitors submit to Formspree; consult Formspree's privacy/data processing policies if you intend to publish a privacy notice. As with any new public website, verify the actual production deployment, accessibility and email integration before representing it as fully ready for public submissions.

## Project files

- `.pages.yml` — Pages CMS content and media editor schema.
- `content/` — authoritative JSON portfolio content managed by Pages CMS.
- `scripts/generate-data.mjs` — content validation and frontend data generation.
- `src/data.js` — generated compatibility export; do not edit directly.
- `src/main.js` — complete UI generation, interactions, form handling and client-side SEO.
- `src/styles.css` — the design system, light/dark themes and responsive layouts.
- `assets/` — favicon, image placeholders, project visuals, actual placeholder PDFs, Open Graph PNG.
- `scripts/build.mjs` — static output, metadata, structured data, sitemap and robots.
- `scripts/serve.mjs` — no-dependency development and preview server.
- `scripts/test.mjs` — zero-dependency static/HTTP smoke tests.
- `.github/workflows/deploy-pages.yml` — GitHub Pages deploy workflow.

**License:** This template and its source are yours to customize and publish. Replace the included placeholder portfolio data with information you authorize for public sharing.
