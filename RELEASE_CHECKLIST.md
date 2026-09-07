# Aries Blackstone Website Release Checklist

Use this checklist for every public-site change. The goal is to keep the repository capable of rebuilding the complete live author site and to protect Aries Blackstone as a durable author-brand asset.

## Source control

- [ ] Every live public route has a source file in GitHub.
- [ ] New live routes are added to `site-source-manifest.json`.
- [ ] No production-only page exists outside version control.
- [ ] Changes are made on a branch and reviewed before `main` is updated.

## Identity consistency

- [ ] Author name is exactly `Aries Blackstone`.
- [ ] Publisher/imprint is exactly `Publishing Creative Creations`.
- [ ] Adult series name is consistently `The Quantum Series` in prose and structured metadata.
- [ ] Children’s series name is consistently `The Adventures of Max & Zoey` where the ampersand form is intended.
- [ ] Canonical domain is `https://aries-blackstone.com`.

## Page integrity

- [ ] Main navigation works.
- [ ] Footer navigation works.
- [ ] Internal links point to valid routes.
- [ ] Images used by changed pages exist in the repository.
- [ ] Contact and signup links still work.
- [ ] Mobile and desktop layouts remain usable.

## Search authority

- [ ] Page has a unique `<title>`.
- [ ] Page has a useful meta description.
- [ ] Page has an explicit canonical URL.
- [ ] Open Graph URL/title/description are correct where applicable.
- [ ] Sitemap includes the public page.
- [ ] Structured data remains valid when applicable.

## Catalog / publishing accuracy

- [ ] Book title and subtitle match canonical catalog data.
- [ ] Series order is correct.
- [ ] ISBN and format data are correct where shown.
- [ ] Publisher spelling is correct.
- [ ] No outdated availability statement remains on the page.

## Pre-release checks

- [ ] `node scripts/check-site-integrity.mjs` passes.
- [ ] GitHub Actions passes.
- [ ] Changed pages are previewed locally.
- [ ] No console errors are introduced.
- [ ] Existing public pages were not accidentally removed.

## Post-release checks

- [ ] Production homepage loads.
- [ ] Changed routes load from the canonical domain.
- [ ] Navigation to Press, Libraries, Book Clubs, Discussion Resources, Reviews, and Appearances works.
- [ ] Search-facing metadata on changed pages matches the release.
- [ ] Any intentionally changed retailer/catalog facts are recorded in the Brand Authority & Discovery Audit.
