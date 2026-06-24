# MDG Admin Panel Guide

Open your website admin panel at:

`https://YOUR-GITHUB-USERNAME.github.io/MDG/admin/`

## Important limitation

This free admin panel works on GitHub Pages without a backend. It can prepare and download updated JSON files, but it cannot secretly write to GitHub by itself. After downloading a file, upload it to the `data/` folder in your repository and commit the change.

## How to add a team

1. Open `/admin/`.
2. Fill in team name, captain, realm, faction, and members.
3. Click **Add team**.
4. Click **Download teams.json**.
5. In GitHub, open `data/` and replace `teams.json` with the downloaded file.
6. Commit changes.

## How to add weekly results

1. Open `/admin/`.
2. Fill in week, dungeon, team, key level, time, points, and proof link.
3. Click **Add run to week**.
4. Repeat for every team.
5. Click **Download results.json**.
6. Replace `data/results.json` in GitHub and commit.

## How to edit Greek/English rules

1. Open `/admin/`.
2. Edit the `rules.json` text area.
3. Click **Download rules.json**.
4. Replace the file in GitHub.

## For a real login admin later

To edit directly from the browser without downloading files, you need a backend/CMS, for example Decap CMS with GitHub authentication, Firebase, Supabase, or a custom admin app.
