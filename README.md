# Personal portfolio — editable, fast, deployable

A polished **dark/light personal portfolio** with an accessible native project-detail dialog, mobile navigation, project category filters, smooth scrolling, reveal effects, all requested content sections, a generated on-page CV, embedded PDF previews and a Formspree contact form.

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

## 2. Customize all your content

**Make almost all edits in `src/data.js`**. Open it and search for `CHANGE ME` and `Dates to confirm`.

- `site`: full name, initials, professional title, tagline, introductory bio, public city, email, phone, personal image, resume and CV paths, social profiles and production domain.
- `about`: detailed background, interests, facts.
- `education` and `experience`: school, coursework, dates, roles and achievements.
- `skills`: grouped skill tags (do not list technologies you haven't worked with).
- `projects`: thumbnails, case studies, technologies, category, contribution and optional external demo/GitHub links. The included entries are *editable examples*, not verified claims of shipped features.
- `certifications`: leave empty or add verifiable entries with issuer, date and optional proof URL.
- `cv`: personal objective and additional notes for the on-page CV.
- `contact.formspreeId`: Formspree ID for actual email delivery (see below).

The UI automatically regenerates from these values. Missing social links and project links appear as disabled placeholders or are hidden; there are no fake success messages or imaginary credentials.

### Your photo and PDFs

1. Replace `assets/profile-placeholder.svg` with your own optimized `assets/profile.webp` (recommended) or `.jpg`.
2. Update `site.photo` to `'./assets/profile.webp'` and `site.photoAlt` to describe your image.
3. **Replace** both `assets/resume.pdf` and `assets/cv.pdf` with your own finished, verified documents. The included PDFs are functional **sample documents with prominent placeholder warnings**, solely so the download and embedded preview buttons have valid files from day one.
4. When updating the PDF files, the buttons and PDF viewer work automatically. The on-page CV always reflects `src/data.js` and can be different from the PDFs until you replace them.
5. Replace `assets/favicon.svg` and `assets/og-image.png` with your own branding if desired. Update `site.initials` and `site.websiteUrl`.

The included `.svg` project thumbnails are editable vector assets under `assets/projects/`. Change each project's `image` path in `src/data.js` to use real screenshots later.

### Change colors

Edit `:root` (dark) and `:root[data-theme="light"]` in `src/styles.css`. For accessibility, if you change accents, check text contrast in *both* color themes.

## 3. Connect the contact form (Formspree)

You do **not** need a custom backend, Supabase, or private API key to send messages with this setup.

1. Create a form at [https://formspree.io/](https://formspree.io/).
2. Verify your destination email address in Formspree and configure the allowed domain / spam filtering options in your dashboard.
3. Copy the **form ID** from your endpoint (if the URL is `https://formspree.io/f/abcdefgh`, the ID is `abcdefgh`).
4. Paste it into `contact.formspreeId` in `src/data.js`.
5. Deploy your site, submit a test form, and check both the Formspree dashboard and inbox, including spam.

The form includes name, email, subject and message validation, basic honeypot spam protection, disabled/loading state, a 15-second timeout, and distinct success/error messages. **Until a real form ID is configured, the form does not send email and explicitly says so.** A public Formspree form ID is safe to include client-side; do not put private credentials in JavaScript.

## 4. Build and test

```bash
npm run check        # JavaScript syntax checks
npm run build        # generates deployable dist/ and static SEO tags
npm run test         # build output + local HTTP smoke checks
npm run preview      # preview dist/ at http://127.0.0.1:4173
```

The built `dist/` folder contains everything your host needs: `index.html`, `src/`, `assets/`, `robots.txt` and `sitemap.xml`.

### SEO and sharing

Change `site.name`, `site.description`, `site.intro`, `site.websiteUrl` and `site.ogImage` in `src/data.js`. The build script writes these values directly into the static HTML `<title>`, meta description, Open Graph/Twitter tags, canonical link and JSON-LD profile, so link previews don't depend on JavaScript rendering. It also generates `robots.txt` and a minimal `sitemap.xml`.

**Important:** The default domain is `https://yourdomain.com`, intentionally a placeholder. Before publishing, set it to the real HTTPS address **including your GitHub Pages repository path if applicable**, e.g. `https://username.github.io/portfolio/`, then rebuild. Social cards will not correctly resolve until you update it.

## 5. Deploy to Vercel

1. Put the entire **project source**, not only `dist/`, in a GitHub repository.
2. In [Vercel](https://vercel.com), select **Add New → Project** and import that repository.
3. The included `vercel.json` specifies `npm run build` and `dist` as the output directory. Keep these settings.
4. Deploy, then update `site.websiteUrl` to your actual Vercel/custom domain, push, and redeploy.
5. Add your Formspree site domain to its allowed domains if that feature is configured.

## 6. Deploy to Netlify

1. Connect the repository at [Netlify](https://www.netlify.com).
2. The included `netlify.toml` configures build command `npm run build` and publish folder `dist`.
3. Deploy. Then update `site.websiteUrl` and confirm your contact form.

Manual upload of `dist/` also works, but a repository-based deploy will update when you push new content.

## 7. Deploy to GitHub Pages

1. Push the project to a GitHub repository, using `main` as the default branch.
2. Set `site.websiteUrl` to `https://YOUR_USERNAME.github.io/YOUR_REPO/` before building.
3. Open **Repository → Settings → Pages**, and set **Build and deployment → Source: GitHub Actions**.
4. Push to `main`. The included `.github/workflows/deploy-pages.yml` automatically builds and deploys `dist/`.
5. Wait for the deployment workflow and open the Pages URL.

All app links and asset paths are relative, so this works at a repository subpath. If you use a custom domain, also update `site.websiteUrl`.

## 8. Pre-publication checklist

- [ ] Replace `YOUR NAME`, initials, placeholder email/phone and `yourdomain.com`.
- [ ] Confirm all example bios, education dates, experience, project claims and skill levels.
- [ ] Replace sample PDFs with your real résumé and CV; verify downloaded files.
- [ ] Replace placeholder profile portrait, project illustrations and social preview branding.
- [ ] Add valid social, repository, demo and certification links.
- [ ] Connect Formspree, validate inbox delivery, verify spam/domain rules.
- [ ] Check desktop, tablet and mobile layouts, keyboard navigation and light/dark contrast.
- [ ] Run `npm run check`, `npm run build` and `npm run test`.
- [ ] Inspect the final social preview tags and sitemap using your real deployed URL.

## Accessibility and security notes

The page uses semantic sections, alt text, visible focus outlines, keyboard-operable controls, `aria-current` active navigation, native `<dialog>` focus management, meaningful labels and errors for the form, a skip link and reduced-motion support. The host configs add basic `nosniff`, referrer, frame and permissions headers. The site collects only the information visitors submit to Formspree; consult Formspree's privacy/data processing policies if you intend to publish a privacy notice. As with any new public website, verify the actual production deployment, accessibility and email integration before representing it as fully ready for public submissions.

## Project files

- `src/data.js` — the single editable content source.
- `src/main.js` — complete UI generation, interactions, form handling and client-side SEO.
- `src/styles.css` — the design system, light/dark themes and responsive layouts.
- `assets/` — favicon, image placeholders, project visuals, actual placeholder PDFs, Open Graph PNG.
- `scripts/build.mjs` — static output, metadata, structured data, sitemap and robots.
- `scripts/serve.mjs` — no-dependency development and preview server.
- `scripts/test.mjs` — zero-dependency static/HTTP smoke tests.
- `.github/workflows/deploy-pages.yml` — GitHub Pages deploy workflow.
- `vercel.json`, `netlify.toml` — hosting configurations.

**License:** This template and its source are yours to customize and publish. Replace the included placeholder portfolio data with information you authorize for public sharing.
