// Generic single-card carousel engine, shared by the workout and cooldown phases.

function initWorkout(workoutTitle, exercises, cooldownExercises) {
  const root = document.getElementById("app");

  let phase = "workout"; // "workout" | "cooldown" | "done"
  let index = 0;

  function currentList() {
    return phase === "cooldown" ? cooldownExercises : exercises;
  }

  function headerLabel() {
    return phase === "cooldown" ? "COOLDOWN" : workoutTitle;
  }

  function videoBlock(videoId) {
    if (!videoId) {
      return `
        <div class="video-wrapper video-empty">
          <a class="video-fallback" href="https://www.youtube.com/results?search_query=${encodeURIComponent("dumbbell exercise")}" target="_blank" rel="noopener">
            No video linked yet — search on YouTube
          </a>
        </div>`;
    }
    return `
      <div class="video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/${videoId}"
          title="Exercise demonstration"
          frameborder="0"
          allow="fullscreen"
          allowfullscreen>
        </iframe>
      </div>`;
  }

  function statsBlock(item) {
    const isDuration = /sec|min/i.test(item.reps) && !item.weight;
    const cells = [];
    cells.push(`<div class="stat"><span class="stat-label">${isDuration ? "TIME" : "REPS"}</span><span class="stat-value">${item.reps}</span></div>`);
    if (item.weight) {
      cells.push(`<div class="stat"><span class="stat-label">WEIGHT</span><span class="stat-value">${item.weight}</span></div>`);
    }
    if (item.rest) {
      cells.push(`<div class="stat"><span class="stat-label">REST</span><span class="stat-value">${item.rest}</span></div>`);
    }
    return `<div class="stats stats-${cells.length}">${cells.join("")}</div>`;
  }

  function tipsBlock(tips) {
    return `<ul class="tips">${tips.map((t) => `<li>${t}</li>`).join("")}</ul>`;
  }

  function navBlock() {
    const list = currentList();
    const isFirst = index === 0;
    const isLast = index === list.length - 1;

    const prevDisabled = isFirst ? "disabled" : "";

    let nextLabel = "Next →";
    if (isLast && phase === "workout") {
      nextLabel = cooldownExercises.length ? "Start Cooldown →" : "Finish Workout ✓";
    } else if (isLast && phase === "cooldown") {
      nextLabel = "Finish Workout ✓";
    }

    return `
      <div class="nav">
        <button class="btn btn-prev" id="prevBtn" ${prevDisabled}>← Previous</button>
        <button class="btn btn-next" id="nextBtn">${nextLabel}</button>
      </div>`;
  }

  function progressBlock() {
    const list = currentList();
    const total = list.length;
    const current = index + 1;
    const pct = Math.round((current / total) * 100);
    return `
      <div class="progress-header">
        <button class="menu-btn" id="menuBtn" aria-label="Show exercise list">☰</button>
        <span class="progress-label">${headerLabel()}</span>
        <span class="progress-count">${current} / ${total}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>`;
  }

  function menuSection(title, list, listPhase) {
    if (!list.length) return "";
    const items = list
      .map((item, i) => {
        const isCurrent = listPhase === phase && i === index;
        const isDone =
          (listPhase === "workout" && (phase === "cooldown" || (phase === "workout" && i < index))) ||
          (listPhase === "cooldown" && phase === "cooldown" && i < index);
        const stateClass = isCurrent ? "current" : isDone ? "done" : "";
        return `
          <li class="menu-item ${stateClass}" data-phase="${listPhase}" data-index="${i}">
            <span class="menu-item-num">${isDone ? "✓" : i + 1}</span>
            <span class="menu-item-name">${item.name}</span>
          </li>`;
      })
      .join("");
    return `
      <div class="menu-section">
        <div class="menu-section-title">${title}</div>
        <ul class="menu-list">${items}</ul>
      </div>`;
  }

  function menuBlock() {
    return `
      <div class="menu-overlay" id="menuOverlay">
        <nav class="menu-drawer" id="menuDrawer" onclick="event.stopPropagation()">
          <div class="menu-header">
            <span>EXERCISES</span>
            <button class="menu-close" id="menuCloseBtn" aria-label="Close menu">✕</button>
          </div>
          ${menuSection(workoutTitle, exercises, "workout")}
          ${menuSection("COOLDOWN", cooldownExercises, "cooldown")}
        </nav>
      </div>`;
  }

  function renderCard() {
    const item = currentList()[index];
    root.innerHTML = `
      <div class="workout-page">
        ${progressBlock()}
        <div class="exercise-card" key="${phase}-${index}">
          <h1 class="exercise-name">${item.name}</h1>
          ${videoBlock(item.video)}
          <div class="exercise-info">
            ${statsBlock(item)}
            ${tipsBlock(item.tips)}
          </div>
          ${navBlock()}
        </div>
      </div>
      ${menuBlock()}`;

    // Restart the entrance animation on every render.
    const card = root.querySelector(".exercise-card");
    card.classList.remove("card-in");
    void card.offsetWidth;
    card.classList.add("card-in");

    document.getElementById("prevBtn").addEventListener("click", goPrev);
    document.getElementById("nextBtn").addEventListener("click", goNext);

    const overlay = document.getElementById("menuOverlay");
    document.getElementById("menuBtn").addEventListener("click", () => overlay.classList.add("open"));
    document.getElementById("menuCloseBtn").addEventListener("click", () => overlay.classList.remove("open"));
    overlay.addEventListener("click", () => overlay.classList.remove("open"));

    root.querySelectorAll(".menu-item").forEach((li) => {
      li.addEventListener("click", () => {
        phase = li.dataset.phase;
        index = Number(li.dataset.index);
        renderCard();
      });
    });
  }

  function goPrev() {
    if (index === 0) return;
    index -= 1;
    renderCard();
  }

  function goNext() {
    const list = currentList();
    const isLast = index === list.length - 1;

    if (!isLast) {
      index += 1;
      renderCard();
      return;
    }

    if (phase === "workout" && cooldownExercises.length) {
      phase = "cooldown";
      index = 0;
      renderCard();
      return;
    }

    renderFinish();
  }

  function renderFinish() {
    root.innerHTML = `
      <div class="finish-screen card-in">
        <div class="finish-check">✓</div>
        <h1>WORKOUT COMPLETE</h1>
        <p class="finish-sub">Great work.</p>
        <p class="finish-stat">${exercises.length} exercises completed</p>
        <p class="finish-stat">${cooldownExercises.length} stretches completed</p>
        <a class="btn btn-next finish-home" href="index.html">Back to Home</a>
      </div>`;
  }

  renderCard();
}
