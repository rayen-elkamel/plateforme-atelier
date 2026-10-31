const STORAGE_KEY = "atelier-learning-v1";
const USER_KEY = "atelier-user-id";
const app = document.getElementById("app");
let state = loadState();
let activeVideo = null;
let lessonTimer = null;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      favorites: saved.favorites || [],
      enrolled: saved.enrolled || [],
      progress: saved.progress || {},
      notes: saved.notes || {},
      preferences: saved.preferences || { category: "All", search: "" },
    };
  } catch {
    return {
      favorites: [],
      enrolled: [],
      progress: {},
      notes: {},
      preferences: { category: "All", search: "" },
    };
  }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function ensureUserCookie() {
  if (
    !document.cookie.split("; ").some((row) => row.startsWith("atelier_user="))
  ) {
    const id = "learner-" + Math.random().toString(36).slice(2, 10);
    document.cookie = `atelier_user=${id}; max-age=31536000; path=/; SameSite=Lax`;
  }
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("atelier_user="));
  document.getElementById("user-mark").textContent = match
    ? match.split("=")[1].slice(-1).toUpperCase()
    : "A";
  if (
    !document.cookie
      .split("; ")
      .some((row) => row.startsWith("atelier_cookie_notice="))
  ) {
    document.getElementById("cookie-notice").hidden = false;
  }
}
function acceptCookies() {
  document.cookie =
    "atelier_cookie_notice=accepted; max-age=31536000; path=/; SameSite=Lax";
  document.getElementById("cookie-notice").hidden = true;
}
function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ],
  );
}
function getCourse(id) {
  return COURSES.find((course) => course.id === id);
}
function getLesson(course, lessonId) {
  return course?.lessonsData.find((lesson) => lesson.id === lessonId);
}
function getCourseProgress(course) {
  const record = state.progress[course.id] || {};
  const total = course.lessonsData.length;
  const completed = course.lessonsData.filter(
    (lesson) => record[lesson.id]?.completed,
  ).length;
  return { total, completed, percent: Math.round((completed / total) * 100) };
}
function isLessonComplete(courseId, lessonId) {
  return Boolean(state.progress[courseId]?.[lessonId]?.completed);
}
function markLessonComplete(courseId, lessonId) {
  state.progress[courseId] ||= {};
  state.progress[courseId][lessonId] ||= {};
  state.progress[courseId][lessonId].completed = true;
  saveState();
}
function markQuizComplete(courseId, lessonId, score) {
  state.progress[courseId] ||= {};
  state.progress[courseId][lessonId] ||= {};
  state.progress[courseId][lessonId].quizScore = score;
  state.progress[courseId][lessonId].quizPassed = score >= 1;
  saveState();
}
function courseArt(course, compact = false) {
  return `<div class="${compact ? "detail-art" : "course-art"} art-${course.color}">
    <span class="art-number">FIELD NOTES / ${course.number}</span>
    <span class="art-title">${escapeHtml(course.title)}</span>
    <span class="art-number">${escapeHtml(course.category.toUpperCase())} — ATELIER</span>
  </div>`;
}
function courseCard(course) {
  const progress = getCourseProgress(course);
  const enrolled = state.enrolled.includes(course.id);
  return `<article class="course-card">
    <a href="#/course/${course.id}" aria-label="View ${escapeHtml(course.title)}">${courseArt(course)}</a>
    <div class="course-meta"><span>${escapeHtml(course.category)} / ${escapeHtml(course.level)}</span><span>${course.duration}</span></div>
    <h3><a href="#/course/${course.id}">${escapeHtml(course.title)}</a></h3>
    <p>${escapeHtml(course.description)}</p>
    <div class="course-card-bottom">
      <a class="arrow-link" href="#/course/${course.id}">${enrolled ? `${progress.percent}% complete` : "Explore course"} ↗</a>
      <button class="favorite-button" type="button" data-favorite="${course.id}" aria-pressed="${state.favorites.includes(course.id)}" aria-label="${state.favorites.includes(course.id) ? "Remove from" : "Add to"} favorites">${state.favorites.includes(course.id) ? "★" : "☆"}</button>
    </div>
  </article>`;
}
function initializeLessonPlayer() {
  const video = document.querySelector("#lesson-player");
  if (!video) return;
  if (video.plyr) {
    video.plyr.destroy();
  }
  new Plyr(video, {
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "duration",
      "mute",
      "volume",
      "captions",
      "settings",
      "pip",
      "fullscreen",
    ],
    settings: ["captions", "speed"],
    speed: {
      selected: 1,
      options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    },
    hideControls: true,
    keyboard: {
      focused: true,
      global: false,
    },
  });
}
function renderHome() {
  const featured = COURSES.slice(0, 3);
  app.innerHTML = `<section class="hero">
    <div><p class="eyebrow">A school for independent minds · Est. 2026</p>
      <h1>Learn the craft.<br><em>Keep your edge.</em></h1>
    </div>
    <div class="hero-copy"><p>Small, considered courses for people who want to do meaningful work. No noise. No shortcuts. Just useful ideas, taught by people who practice them.</p><a class="button button-dark" href="#/courses">Explore the curriculum <span>↗</span></a></div>
  </section>
  <section class="hero-bottom"><p>Good work begins<br>with good questions.</p><div class="stats">
    <div class="stat"><strong>06</strong><span>Independent courses</span></div><div class="stat"><strong>18</strong><span>Focused lessons</span></div><div class="stat"><strong>4.9<span>/5</span></strong><span>Illustrative learner rating</span></div>
  </div></section>
  <section class="section"><div class="section-heading"><div><p class="eyebrow">The starting point</p><h2>Selected courses.</h2></div><p>Clear ideas, practical exercises and a little more room to think.</p></div>
    <div class="course-grid">${featured.map(courseCard).join("")}</div>
    <p style="margin-top:30px"><a class="arrow-link" href="#/courses">View all courses ↗</a></p>
  </section>
  <div class="marquee-band"><span>Learn with intention</span><span>Make space for better work</span><span>Practice beats noise ↗</span></div>
  <section class="section"><div class="section-heading"><div><p class="eyebrow">A better way to learn</p><h2>Make progress<br>you can see.</h2></div><p>Short lessons, quick checks for understanding, and automatic progress tracking—so you can pick up where you left off.</p></div>
    <div class="course-grid">
      <article class="course-card"><div class="course-meta"><span>01 / FOCUS</span></div><h3>Learn in small pieces.</h3><p>Each course is broken into lessons that fit into a focused stretch of time.</p></article>
      <article class="course-card"><div class="course-meta"><span>02 / PRACTICE</span></div><h3>Check what sticks.</h3><p>Short quizzes give immediate feedback and reinforce the ideas worth keeping.</p></article>
      <article class="course-card"><div class="course-meta"><span>03 / CONTINUE</span></div><h3>Pick up where you left off.</h3><p>Your course progress, saved notes and favorites stay in this browser.</p></article>
    </div>
  </section>`;
}
function renderCourses() {
  const categories = ["All", ...new Set(COURSES.map((c) => c.category))];
  const search = state.preferences.search || "";
  const category = state.preferences.category || "All";
  const favoritesOnly =
    new URLSearchParams(location.hash.split("?")[1] || "").get("favorites") ===
    "1";
  const filtered = COURSES.filter(
    (course) =>
      (category === "All" || course.category === category) &&
      `${course.title} ${course.description} ${course.instructor}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!favoritesOnly || state.favorites.includes(course.id)),
  );
  app.innerHTML = `<section class="page-intro"><p class="eyebrow">The curriculum / ${String(COURSES.length).padStart(2, "0")} courses</p><h1>Ideas worth<br>your attention.</h1><p>A considered collection of courses for curious people. Browse by discipline, save the ones you want to return to, and learn at your own pace.</p></section>
    <form class="filter-bar" id="filters">
      <div class="field"><label for="course-search">Search the curriculum</label><input id="course-search" name="search" type="search" placeholder="Try “design” or “writing”" value="${escapeHtml(search)}"></div>
      <div class="field"><label for="category-filter">Discipline</label><select id="category-filter" name="category">${categories.map((c) => `<option ${c === category ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}</select></div>
      <label class="check-label"><input id="favorites-only" type="checkbox" ${favoritesOnly ? "checked" : ""}> Saved favorites only</label>
      <div class="filter-spacer"></div><button class="button button-small button-light" type="button" id="clear-filters">Clear filters</button>
    </form>
    <div class="results-line">${filtered.length} COURSE${filtered.length === 1 ? "" : "S"} FOUND</div>
    <section class="section" style="padding-top:24px"><div class="course-grid">${filtered.map(courseCard).join("")}</div>${filtered.length ? "" : `<div class="empty-state"><h2>No courses found.</h2><p>Try another search, or clear your filters.</p></div>`}</section>`;
  document
    .getElementById("course-search")
    .addEventListener("input", (event) => {
      state.preferences.search = event.target.value;
      saveState();
      const pos = event.target.selectionStart;
      renderCourses();
      const input = document.getElementById("course-search");
      input.focus();
      input.setSelectionRange(pos, pos);
    });
  document
    .getElementById("category-filter")
    .addEventListener("change", (event) => {
      state.preferences.category = event.target.value;
      saveState();
      renderCourses();
    });
  document
    .getElementById("favorites-only")
    .addEventListener("change", (event) => {
      location.hash = event.target.checked
        ? "/courses?favorites=1"
        : "/courses";
    });
  document.getElementById("clear-filters").addEventListener("click", () => {
    state.preferences = { category: "All", search: "" };
    saveState();
    location.hash = "/courses";
    renderCourses();
  });
}
function renderCourseDetail(courseId) {
  const course = getCourse(courseId);
  if (!course) return renderNotFound();
  const enrolled = state.enrolled.includes(course.id);
  const progress = getCourseProgress(course);
  app.innerHTML = `<section class="course-detail"><div class="detail-main">
    <p class="eyebrow">Course ${course.number} / ${escapeHtml(course.category)} / ${escapeHtml(course.level)}</p>
    <h1>${escapeHtml(course.title)}.</h1><p class="lead">${escapeHtml(course.description)} ${escapeHtml(course.outcome)}</p>
    <div class="detail-facts"><div class="fact-row"><span>Instructor</span><strong>${escapeHtml(course.instructor)}</strong></div><div class="fact-row"><span>Time to complete</span><strong>${course.duration}</strong></div><div class="fact-row"><span>Course structure</span><strong>${course.lessonsData.length} lessons + quizzes</strong></div><div class="fact-row"><span>Your progress</span><strong>${progress.percent}%</strong></div></div>
  </div><aside class="detail-aside">${courseArt(course, true)}
    <button class="button button-dark" style="width:100%" id="enroll-button">${enrolled ? "Continue learning ↗" : "Enroll for free ↗"}</button>
    <p class="eyebrow" style="margin-top:14px">${enrolled ? "You're enrolled · Progress saved locally" : "No payment · Demo enrollment"}</p>
  </aside></section>
  <section class="curriculum"><p class="eyebrow">The syllabus</p><h2>What you'll work through.</h2>
    ${course.lessonsData.map((lesson, i) => `<article class="lesson-row"><span class="lesson-index">${String(i + 1).padStart(2, "0")}</span><div><h3>${escapeHtml(lesson.title)}</h3><p>${lesson.duration} · ${lesson.type === "video" ? "Video lesson" : "Reading lesson"} · Short knowledge check</p></div><span class="lesson-status">${isLessonComplete(course.id, lesson.id) ? "✓ Complete" : enrolled ? "Ready" : "Included"}</span></article>`).join("")}
  </section>`;
  document.getElementById("enroll-button").addEventListener("click", () => {
    if (!state.enrolled.includes(course.id)) state.enrolled.push(course.id);
    saveState();
    location.hash = `#/lesson/${course.id}/${course.lessonsData[0].id}`;
  });
}
function renderLearning() {
  const enrolledCourses = COURSES.filter((c) => state.enrolled.includes(c.id));
  const allCourses = enrolledCourses.length
    ? enrolledCourses
    : COURSES.filter((c) => getCourseProgress(c).completed > 0);
  app.innerHTML = `<section class="page-intro"><p class="eyebrow">Your workspace</p><h1>Keep your<br>momentum.</h1><p>Your active courses, completed lessons and saved notes in one place. Progress is stored locally on this device.</p></section>
  <section class="section"><div class="section-heading"><div><p class="eyebrow">Your classroom</p><h2>In progress.</h2></div><a class="arrow-link" href="#/courses">Find another course ↗</a></div>
  ${
    allCourses.length
      ? `<div class="course-grid">${allCourses
          .map((course) => {
            const progress = getCourseProgress(course);
            const nextLesson =
              course.lessonsData.find(
                (l) => !isLessonComplete(course.id, l.id),
              ) || course.lessonsData[course.lessonsData.length - 1];
            return `<article class="course-card"><a href="#/course/${course.id}">${courseArt(course)}</a><div class="course-meta"><span>${escapeHtml(course.category)}</span><span>${progress.completed}/${progress.total} lessons</span></div><h3>${escapeHtml(course.title)}</h3><p>${escapeHtml(course.description)}</p><div class="progress-track"><div class="progress-fill" style="width:${progress.percent}%"></div></div><div class="course-card-bottom"><a class="arrow-link" href="#/lesson/${course.id}/${nextLesson.id}">${progress.percent === 100 ? "Review course" : "Continue learning"} ↗</a><strong>${progress.percent}%</strong></div></article>`;
          })
          .join("")}</div>`
      : `<div class="empty-state"><h2>Your next chapter starts here.</h2><p>Enroll in a course to see lessons, track progress and keep notes together.</p><a class="button button-dark" href="#/courses">Explore courses ↗</a></div>`
  }
  </section>
  <section class="section" style="padding-top:0"><div class="section-heading"><div><p class="eyebrow">Your bookmarks</p><h2>Saved favorites.</h2></div></div>${
    state.favorites.length
      ? `<div class="course-grid">${COURSES.filter((c) =>
          state.favorites.includes(c.id),
        )
          .map(courseCard)
          .join("")}</div>`
      : `<p class="eyebrow">No favorites saved yet. Use the ☆ button on any course to save it here.</p>`
  }</section>`;
}
function renderLesson(courseId, lessonId) {
  const course = getCourse(courseId);
  const lesson = getLesson(course, lessonId);
  if (!course || !lesson) return renderNotFound();
  if (!state.enrolled.includes(courseId)) state.enrolled.push(courseId);
  saveState();
  const index = course.lessonsData.findIndex((l) => l.id === lessonId);
  const completed = isLessonComplete(courseId, lessonId);
  const progress = getCourseProgress(course);
  const notes = state.notes[`${courseId}:${lessonId}`] || [];
  activeVideo = null;
  if (lessonTimer) clearTimeout(lessonTimer);
  app.innerHTML = `<div class="learning-layout"><section class="lesson-main">
    <div class="breadcrumb"><a href="#/my-learning">MY LEARNING</a><span>/</span><a href="#/course/${courseId}">${escapeHtml(course.title.toUpperCase())}</a><span>/</span><span>LESSON ${index + 1}</span></div>
    <p class="eyebrow">${lesson.type === "video" ? "Watch & take notes" : "Read & reflect"} / ${lesson.duration}</p><h1>${escapeHtml(lesson.title)}.</h1><p class="lesson-subtitle">${escapeHtml(course.title)} · Lesson ${index + 1} of ${course.lessonsData.length}</p>
    ${lesson.type === "video" ? `<div class="video-shell" id="video-shell"><video id="lesson-video" playsinline controls preload="metadata"><source src="${escapeHtml(lesson.videoUrl || "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4")}" type="video/mp4"/>Your browser does not support HTML video.</video></div>` : ""}
    <article class="lesson-copy"><p>${escapeHtml(lesson.body)}</p><h2>Keep in mind.</h2><ul>${lesson.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></article>
    <div class="lesson-actions"><div><p>${completed ? "LESSON COMPLETED" : lesson.type === "video" ? "CONTINUE WHEN THE VIDEO ENDS" : "TAKE A MOMENT TO REFLECT"}</p><span class="eyebrow">${completed ? "Your progress is saved." : lesson.type === "video" ? "Or mark complete when you're ready." : "A short reading timer will unlock the next step."}</span></div>
      <button class="button button-dark" id="continue-button" ${!completed ? "disabled" : ""}>${completed ? "Review quiz ↗" : "Continue to quiz ↗"}</button></div>
  </section><aside class="lesson-sidebar">
    <div class="progress-label"><span>COURSE PROGRESS</span><strong>${progress.percent}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${progress.percent}%"></div></div>
    <h2>Lesson checklist</h2>${course.lessonsData.map((item, i) => `<a class="checklist-item ${isLessonComplete(courseId, item.id) ? "done" : ""}" href="#/lesson/${courseId}/${item.id}"><span class="checkmark">${isLessonComplete(courseId, item.id) ? "✓" : ""}</span><span>${escapeHtml(item.title)}<small>${String(i + 1).padStart(2, "0")} / ${isLessonComplete(courseId, item.id) ? "COMPLETED" : item.duration.toUpperCase()}</small></span></a>`).join("")}
    <div class="notes-panel"><h2>Notes from this lesson</h2><p>Save an idea and, for video lessons, attach it to the current playback time.</p><form class="note-form" id="note-form"><textarea id="note-text" placeholder="What do you want to remember?" required aria-label="Your note"></textarea><button class="button button-small button-light" type="submit">+ Take a note</button></form><div class="note-list" id="note-list">${renderNotes(notes)}</div></div>
  </aside></div>`;
  const continueButton = document.getElementById("continue-button");
  if (lesson.type === "text" && !completed) {
    let remaining = 8;
    const timerLabel = document.querySelector(".lesson-actions .eyebrow");
    timerLabel.textContent = `Continue unlocks in ${remaining} seconds. You can read at your own pace.`;
    lessonTimer = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(lessonTimer);
        lessonTimer = null;
        continueButton.disabled = false;
        timerLabel.textContent = "Ready when you are.";
      } else
        timerLabel.textContent = `Continue unlocks in ${remaining} seconds. You can read at your own pace.`;
    }, 1000);
  }
  continueButton.addEventListener("click", () => {
    markLessonComplete(courseId, lessonId);
    location.hash = `#/quiz/${courseId}/${lessonId}`;
  });
  if (lesson.type === "video") {
    const video = document.getElementById("lesson-video");
    const timerLabel = document.querySelector(".lesson-actions .eyebrow");
    if (video) {
      activeVideo = video;
      const player = new Plyr(video, {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "settings",
          "pip",
          "fullscreen",
        ],
        settings: ["speed"],
        speed: {
          selected: 1,
          options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        },
        hideControls: true,
        keyboard: {
          focused: true,
          global: false,
        },
      });
      video.addEventListener("timeupdate", () => {
        window.currentVideoTime = video.currentTime;
      });
      video.addEventListener("ended", () => {
        continueButton.disabled = false;
        timerLabel.textContent =
          "Video finished. Continue to the quiz when you're ready.";
      });
      if (completed) {
        continueButton.disabled = false;
        timerLabel.textContent = "Lesson completed. You can review the quiz.";
      } else {
        continueButton.disabled = true;
        timerLabel.textContent =
          "Watch to the end to unlock the quiz, or take notes as you go.";
      }
    }
  }
  document.getElementById("note-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const text = document.getElementById("note-text").value.trim();
    if (!text) return;
    const key = `${courseId}:${lessonId}`;
    state.notes[key] ||= [];
    state.notes[key].push({
      text,
      time:
        activeVideo && Number.isFinite(activeVideo.currentTime)
          ? activeVideo.currentTime
          : null,
      createdAt: new Date().toISOString(),
    });
    saveState();
    document.getElementById("note-text").value = "";
    document.getElementById("note-list").innerHTML = renderNotes(
      state.notes[key],
    );
  });
}
function formatTime(seconds) {
  if (seconds == null) return "READING NOTE";
  const value = Math.floor(seconds);
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")} VIDEO NOTE`;
}
function updateActiveNav() {
  const currentRoute = window.location.hash || "#/courses";

  document.querySelectorAll(".main-nav a").forEach((link) => {
    const isActive = link.getAttribute("href") === currentRoute;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}
function renderNotes(notes) {
  return notes.length
    ? notes
        .slice()
        .reverse()
        .map(
          (note) =>
            `<div class="note-item"><time>${formatTime(note.time)} · ${new Date(note.createdAt).toLocaleDateString()}</time>${escapeHtml(note.text)}${note.time != null ? `<button class="text-button" type="button" data-jump-time="${note.time}">Jump to note ↗</button>` : ""}</div>`,
        )
        .join("")
    : `<p>No notes yet.</p>`;
}
function renderQuiz(courseId, lessonId) {
  const course = getCourse(courseId);
  const lesson = getLesson(course, lessonId);
  if (!course || !lesson) return renderNotFound();
  const existing = state.progress[courseId]?.[lessonId]?.quizScore;
  app.innerHTML = `<section class="quiz-wrap"><p class="eyebrow">Knowledge check / ${escapeHtml(course.title)}</p><h1>Make it<br>make sense.</h1><p class="quiz-intro">A few quick questions to help the ideas stick. You'll see feedback as soon as you check your answers.</p>
    <form id="quiz-form">${lesson.quiz.map((question, qi) => `<section class="quiz-question" data-question="${qi}"><h2>${String(qi + 1).padStart(2, "0")} / ${escapeHtml(question.q)}</h2>${question.options.map((option, oi) => `<label class="quiz-option"><input type="radio" name="q${qi}" value="${oi}"><span>${escapeHtml(option)}</span></label>`).join("")}<div class="quiz-feedback" id="feedback-${qi}" hidden></div></section>`).join("")}
    <div class="quiz-result" id="quiz-result" ${existing == null ? "hidden" : ""}><p class="eyebrow">Previous attempt</p><strong>${existing == null ? "" : `${existing}/${lesson.quiz.length} correct`}</strong><p>Your latest result is saved locally.</p></div>
    <button class="button button-dark" type="submit">Check answers ↗</button></form>
    <div id="quiz-next" style="margin-top:25px"></div>
  </section>`;
  document.getElementById("quiz-form").addEventListener("submit", (event) => {
    event.preventDefault();
    let score = 0;
    lesson.quiz.forEach((question, qi) => {
      const selected = document.querySelector(`input[name="q${qi}"]:checked`);
      const correct = selected && Number(selected.value) === question.answer;
      if (correct) score++;
      const feedback = document.getElementById(`feedback-${qi}`);
      feedback.hidden = false;
      feedback.className = `quiz-feedback ${correct ? "correct" : "incorrect"}`;
      feedback.innerHTML = `<strong>${correct ? "Correct." : "Not quite."}</strong> ${escapeHtml(question.explanation)}${!selected ? " Choose an answer next time to check your understanding." : ""}`;
    });
    markQuizComplete(courseId, lessonId, score);
    const result = document.getElementById("quiz-result");
    result.hidden = false;
    result.innerHTML = `<p class="eyebrow">Your result</p><strong>${score}/${lesson.quiz.length} correct</strong><p>${score === lesson.quiz.length ? "Excellent. You have the key ideas." : "Review the feedback, then try again if you like."} Your result is saved locally.</p>`;
    const nextIndex =
      course.lessonsData.findIndex((l) => l.id === lessonId) + 1;
    const next = course.lessonsData[nextIndex];
    document.getElementById("quiz-next").innerHTML = next
      ? `<a class="button button-dark" href="#/lesson/${courseId}/${next.id}">Next lesson: ${escapeHtml(next.title)} ↗</a>`
      : `<a class="button button-dark" href="#/course/${courseId}">Return to course overview ↗</a> <a class="button button-light" href="#/my-learning">View my learning</a>`;
    document
      .querySelectorAll("#quiz-form input")
      .forEach((input) => (input.disabled = true));
    document.querySelector("#quiz-form button[type=submit]").textContent =
      "Answers checked";
    document.querySelector("#quiz-form button[type=submit]").disabled = true;
  });
}
function renderNotFound() {
  app.innerHTML = `<section class="page-intro"><p class="eyebrow">404 / Wrong turn</p><h1>This page<br>isn't here.</h1><p>It may have moved, or the course link may be incomplete.</p><a class="button button-dark" href="#/">Return home ↗</a></section>`;
}
function render() {
  if (lessonTimer) {
    clearInterval(lessonTimer);
    lessonTimer = null;
  }
  const route = location.hash.replace(/^#/, "") || "/";
  if (route === "/") renderHome();
  else if (route === "/courses" || route.startsWith("/courses?"))
    renderCourses();
  else if (route === "/my-learning") renderLearning();
  else if (route.startsWith("/course/"))
    renderCourseDetail(route.split("/")[2]);
  else if (route.startsWith("/lesson/")) {
    const [, , courseId, lessonId] = route.split("/");
    renderLesson(courseId, lessonId);
  } else if (route.startsWith("/quiz/")) {
    const [, , courseId, lessonId] = route.split("/");
    renderQuiz(courseId, lessonId);
  } else renderNotFound();
  app.focus({ preventScroll: true });
  updateActiveNav();
}
document.addEventListener("click", (event) => {
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) {
    const id = favorite.dataset.favorite;
    state.favorites = state.favorites.includes(id)
      ? state.favorites.filter((item) => item !== id)
      : [...state.favorites, id];
    saveState();
    render();
  }
  const jump = event.target.closest("[data-jump-time]");
  if (jump && activeVideo) {
    activeVideo.currentTime = Number(jump.dataset.jumpTime);
    activeVideo.play();
  }
});
document
  .getElementById("accept-cookies")
  .addEventListener("click", acceptCookies);
document.getElementById("reset-demo").addEventListener("click", () => {
  if (
    confirm(
      "Clear this demo's favorites, enrollments, notes and course progress?",
    )
  ) {
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
    render();
  }
});
window.addEventListener("DOMContentLoaded", updateActiveNav);
window.addEventListener("hashchange", render);
ensureUserCookie();
render();
