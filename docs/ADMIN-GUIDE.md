# MDG.gr Website Template — Admin Guide

## What this is
A free static website template for a Greek World of Warcraft Mythic+ Time Trials tournament.

## Pages included
- `index.html` — landing page
- `rules.html` — tournament info and rules
- `leaderboard.html` — automatic season leaderboard
- `weekly.html` — archived weekly results
- `teams.html` — registered teams
- `data/results.json` — edit this file to update teams and weekly results

## How to update results manually
1. Open `data/results.json`.
2. Add a new object inside the `weeks` array.
3. Add each team result with team name, key, time, deaths, points, and proof link.
4. Save and upload/push to GitHub.

## Free hosting recommendation
Use GitHub Pages for free hosting. You can later connect `MDG.gr` as a custom domain.

## Future automation option
For easier admin work, replace `data/results.json` with a Google Sheets public CSV/JSON feed. Then admins only edit the Google Sheet and the website updates automatically.

Suggested Google Sheet tabs:
- Teams
- Players
- WeeklyResults
- Rules
- Schedule

## Domain note
The `.gr` domain has to be registered through an approved registrar if available. After registration, connect it to GitHub Pages using DNS records and a `CNAME` file.
