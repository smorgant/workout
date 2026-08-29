# Dumbbell Workout

A tiny mobile-first site for following two beginner dumbbell workout plans at home. No backend, no build step — just static HTML/CSS/JS, deployed via GitHub Pages.

## Why this exists

A few people asked for a simple way to follow a structured dumbbell workout on their phone without signing up for a fitness app subscription, creating an account, or handing over any personal data. This is that: free, no login, no tracking, no ads — just open the link and go.

## Structure

```
index.html      Home page (choose a workout)
his.html        "His Workout" — full-body session
her.html        "Her Workout" — core/glute/leg focused session
css/style.css   All styling
js/workouts.js  Exercise + cooldown data
js/app.js       Single-card carousel engine (shared by both workouts)
```

## Editing a workout

Everything about an exercise — reps, weight, rest, video, tips — lives in [js/workouts.js](js/workouts.js) as plain objects. Edit the arrays `hisWorkout`, `herWorkout`, or `cooldown`; no HTML changes needed.

### Adding a demonstration video

Each exercise has a `video` field. Set it to a YouTube video ID (the part after `v=` in a YouTube URL, e.g. `dQw4w9WgXcQ`):

```js
{
  name: "Goblet Squat",
  video: "dQw4w9WgXcQ",
  ...
}
```

Leave it as `""` to show a "search on YouTube" fallback link instead of an embed.

## Running locally

Any static file server works, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings, enable GitHub Pages, deploying from the `main` branch root.
3. The site will be live at `https://USERNAME.github.io/REPO_NAME/`.
