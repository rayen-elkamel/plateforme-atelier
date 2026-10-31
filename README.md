# Atelier — online course platform

A small front-end course platform built with semantic HTML, descriptive CSS classes, and plain JavaScript. No framework, build tool, or backend is required.

## Run it

1. Clone the repo.
2. Open `index.html` in a browser.
3. Serve the folder with any static HTTP server (for example, VS Code Live Server).

## Included

- Landing page with illustrative platform statistics.
- Course catalogue with search, discipline filters, and favorites.
- Course detail pages with mock curriculum and free enrollment.
- Lesson pages with reading timer or sample HTML5 video.
- Video notes saved with playback timestamps; notes can jump to the saved timestamp while the video is loaded.
- Short quizzes with immediate answer feedback.
- Local progress checklist, completion percentages, enrollment list, and saved notes.
- `localStorage` for learning state and a simple first-party cookie for a demo learner ID and cookie notice preference.
- Hash-based navigation so page transitions do not reload the document.

## Data and persistence

All course content is in the `COURSES` array at the top of `app.js`. Browser persistence is centralized in `loadState()`, `saveState()`, and the small progress helpers. This makes it straightforward to replace local storage with API calls later.

## Known demo simplifications

- Statistics, instructors, ratings, course copy, and quizzes are mock data.
- The sample video is generic footage, not the course-specific lesson.
- Text lessons unlock the continue button after a short demo timer.
- A quiz stores its latest score and lesson completion is marked when the learner continues to the quiz.
- Browser storage is device/browser-specific and can be cleared by the user.
