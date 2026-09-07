# Aries Blackstone Brand Authority & Discovery Audit

Date started: 2026-09-07
Status: Active
Purpose: Build Aries Blackstone as a durable family-owned author brand and intellectual-property asset. The objective is brand growth, discoverability, reader trust, catalog authority, and long-term control rather than personal notoriety.

## Executive finding

Aries Blackstone already has meaningful retail and international distribution. The central problem is not lack of presence. The central problem is fragmentation: publisher/imprint variants, inconsistent series metadata, uneven genre/category metadata, weak reader-review proof, incomplete library/profile discovery, and a website source-of-truth gap.

Canonical identity target:

- Author: Aries Blackstone
- Publisher / imprint: Publishing Creative Creations
- Adult series: The Quantum Series
- Children's series: The Adventures of Max & Zoey
- Canonical author website: https://aries-blackstone.com/

## Priority 0 — Source metadata correction

Verified publisher/imprint variants currently include:

- Publishing.creative.creations
- Publishing.Creative.Creations
- Publishing.Creative.Creations Jul 2026

Verified examples include Apple Books, Bookshop.org, Booktopia, AbeBooks/IberLibro, Nalda, The Nile, Atlantic Books, Rakuten/Kobo-linked listings, IBS, and other international booksellers.

This confirms the error is traveling through distribution metadata rather than being isolated retailer copy.

Active IngramSpark support request: #5839881
Requested correction: Publishing.creative.creations → Publishing Creative Creations
Requested scope: account-level imprint, existing distributed hardcover titles, and retailer/catalog feeds.

Inbox check on 2026-09-07 found no support response to the correction request yet.

After Ingram responds, verify publisher/imprint for each ISBN/edition in Bowker/MyIdentifiers, IngramSpark, KDP where applicable, and downstream retailer feeds after propagation.

## Priority 0 — Series metadata cleanup

The official website uses "The Quantum Series," while external catalogs frequently use "Quantum Edge Series."

Verified inconsistencies include:

- Goodreads: Quantum Edge Series
- ThriftBooks: Quantum Pursuit shown with text implying Book 1 and a typo in "Engima"
- AbeBooks/IberLibro: Quantum Pursuit shown as Book 2 of 2 while Quantum Divide is shown in some feeds as Book 1 of 1

Target canonical series metadata:

1. Quantum Edge: The Enigma of Ladonna Stone — The Quantum Series, Book 1
2. Quantum Pursuit: Hunt for the Spy — The Quantum Series, Book 2
3. Quantum Divide: Forces in Conflict — The Quantum Series, Book 3

## Priority 1 — Canonical website authority

Positive findings:

- live homepage is indexed
- Press & Media is indexed
- Book Clubs resources are indexed
- current Quantum Series content is indexed
- children's content is indexed

Critical source-control issue:

The live website currently contains pages such as /press and /book-clubs, but the connected GitHub main branch does not contain corresponding press.html or book-clubs.html files.

Before major SEO/code changes, reconcile the deployed site with the repository so the complete current website can be preserved and rebuilt from version control.

Items not found in current GitHub main:

- sitemap.xml
- robots.txt
- JSON-LD / schema.org structured author/book data
- explicit canonical link in the current homepage head

Recommended structured-data layer after source reconciliation:

- WebSite
- Person: Aries Blackstone
- Organization: Publishing Creative Creations
- Book records for each title and edition/ISBN
- BookSeries records for The Quantum Series and The Adventures of Max & Zoey
- sameAs references to verified authoritative author profiles

## Priority 1 — Category and positioning consistency

External metadata currently places books in inconsistent categories, including Science Fiction, Mystery, Popular Fiction, Drama / General, Young Adult, Thrillers / Suspense, and Technological Thriller.

This should be normalized at the metadata source so bookseller and recommendation systems understand the titles consistently.

Children's books need a separate metadata strategy centered on friendship, autism/inclusion, empathy, belonging, resilience, and age-appropriate social-emotional themes.

## Discovery map — verified presence

Owned authority:
- Aries-Blackstone.com
- Press & Media hub
- Book Clubs resources
- Publishing Creative Creations

Reader/review authority:
- Goodreads — verified Goodreads Author; 8 distinct works indexed; very low follower/review volume
- OnlineBookClub — author page; official 5/5 review for Quantum Edge
- ThriftBooks — Aries Blackstone author page with multiple titles

Retail/bookseller discovery verified in current or indexed listings:
- Barnes & Noble
- Walmart
- Bookshop.org
- Apple Books
- Google Books
- AbeBooks / IberLibro
- Booktopia
- The Nile
- Atlantic Books
- Nalda
- IBS
- Rakuten/Kobo ecosystem
- eBay
- multiple international booksellers/resellers

Audiobook discovery:
- Audiobooks.com listing verified for The Magical Tail of Joy-Fun Day

## Discovery gaps / not currently confirmed in indexed search

Targeted searches did not find a reliable current Aries Blackstone author/result for:

- WorldCat author/catalog presence
- Open Library author record
- BookBub author profile
- The StoryGraph author profile
- LibraryThing author profile
- a clearly indexed Amazon Author Central public author page

This does not prove an account or catalog record does not exist. It means it is not currently discoverable enough to be confirmed through normal indexed search and should be checked directly.

## Goodreads audit

Positive:
- verified Goodreads Author status
- official website linked
- 8 distinct works
- current bio reflects Quantum Series + children's work
- Ask the Author enabled

Weaknesses:
- only 1 follower shown in current indexed profile
- only 1 rating / 1 review across the catalog in indexed results
- most works show zero ratings
- Quantum titles use "Quantum Edge Series" rather than the official "The Quantum Series"
- indexed biography text appears duplicated in part and should be checked in the live profile editor

Goal: legitimate reader activity, not artificial review volume.

## Library/bookseller authority plan

1. Confirm WorldCat/OCLC records by ISBN.
2. Ensure Ingram metadata uses the corrected imprint and canonical series.
3. Build a librarian/bookseller page on Aries-Blackstone.com with ISBNs by format, trim/page count, publication dates, subjects, series order, descriptions, cover downloads, author bio/photo, and contact information.
4. Prepare downloadable one-sheets for adult and children's catalogs.
5. Target independent bookstores and libraries by title fit, not mass cold outreach.

## Reader-proof plan

The next growth bottleneck is not more retailer listings. It is genuine reader evidence.

Priority actions:
- Goodreads followers
- Goodreads Want-to-Read additions
- legitimate Goodreads reviews
- retailer reviews from actual readers
- book-club use of the existing discussion guides
- library circulation and requests
- independent reviewer coverage

Never purchase or manufacture reader reviews.

## Ranked opportunities

P0 — Correct publisher/imprint at source
Impact: Very High

P0 — Reconcile live Aries site with GitHub
Impact: Very High

P1 — Normalize The Quantum Series metadata
Impact: High

P1 — Add canonical URLs, sitemap, robots, and structured data
Impact: High

P1 — Clean Goodreads editions/series/profile
Impact: High

P2 — WorldCat/library catalog confirmation
Impact: High

P2 — BookBub / StoryGraph / LibraryThing / Open Library
Impact: Medium-High

P2 — Librarian/bookseller resource page and sell sheets
Impact: Medium-High

P2 — Ethical review acquisition system
Impact: High over time

## Current next action

Do not scatter effort.

1. Continue monitoring Ingram support request #5839881 and confirm correction/propagation.
2. Reconcile the live Aries-Blackstone.com site with the GitHub repository.
3. Build the canonical SEO/entity layer only after the source-of-truth site is safely version controlled.
4. Then clean series/profile metadata and move into library/reader discovery.
