# ZUBR DESIGN LEAGUE — public design vote

Public address: https://makemamamad.github.io/zubr-trail-website/poll/

This is a **real voting interface** based on GitHub Issues as the ballot store and a GitHub Actions job as the public results counter. Voters need a GitHub account. There is no private registration, phone or email collection on the poll site.

## Participants

All 31 manufacturer names are from the user-supplied archive `31_manufacturers_PDF_collection(1).zip`, specifically `31_manufacturers_PDF/INDEX.csv` (dated 2026-10-16). Together with ZUBR POWER, GOLD and LIME, the ballot has 34 entries. Official URLs and brochure URLs are provided as review references. A PDF link being absent does not mean the maker lacks a catalog; it means none was provided for that entry in the archive.

## How to cast a vote

1. Open official websites from the ballot (separate link in each row).
2. Mark **at most three** favorites for desktop and **at most three** favorites for mobile. One may participate in just one category.
3. Click `Подтвердить выбор на GitHub`. This opens a **prefilled GitHub issue**. A voter must sign in and click **Submit new issue**. Merely clicking on the poll website does not submit a ballot.
4. The issue contains a machine-readable marker plus `DESKTOP` and `MOBILE` values, using stable participant IDs.
5. The `issues` workflow runs `poll/tally.py` to rebuild `poll/results.json` and push the tally to GitHub Pages. It counts **only the latest correctly formatted issue per GitHub login**.
6. Results are visible publicly at `poll/#results` and refresh upon a user request. GitHub Pages / Actions publishing may take a little time.

## Integrity and limitations

- No anonymous voting: GitHub login is required. The GitHub account name and ballot issue are public.
- Multiple issues by one login count as **one latest ballot**. A single user with several different GitHub accounts may cast several votes; this is a community preference poll, not a scientifically representative survey.
- `poll/tally.py` enforces the 3-choice limit for each category, validates exact IDs, ignores pull requests and malformed submissions.
- Contestants' webpages may change during voting. The poll does not automatically score technical performance; voters evaluate functionality and design themselves.
- GitHub API permissions are limited to read issues and write the repository results file; the public site has no access token.
- Maintain `participants.json` as canonical. Changing IDs mid-poll invalidates old ballots.

## Smoke tests

`python poll/tally.py --test` checks ballot parsing and counting rules. The site can be run via `python -m http.server` from the repository root and visually tested with Chromium. GitHub Actions poll workflow is triggered when issue ballots are submitted.